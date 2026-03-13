import { App, CachedMetadata, TAbstractFile, TFile } from "obsidian";

import { clamp, countTermOccurrences, normalizeForSearch, tokenize, truncate } from "../utils";

import type { PluginSettings, VaultMatch } from "../types";

interface SearchableChunk {
  id: string;
  filePath: string;
  title: string;
  titleNorm: string;
  headings: string[];
  headingsNorm: string;
  tags: string[];
  tagsNorm: string;
  aliases: string[];
  aliasesNorm: string;
  excerpt: string;
  textNorm: string;
  lastModified: number;
}

interface IndexedFileInput {
  path: string;
  title: string;
  lastModified: number;
  content: string;
  metadata?: Pick<CachedMetadata, "headings" | "tags" | "frontmatter">;
  chunkSize: number;
  chunkOverlap: number;
}

function stripMarkdown(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\(([^)]*)\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>-]/g, " ");
}

function splitIntoChunks(content: string, chunkSize: number, chunkOverlap: number): string[] {
  const normalized = stripMarkdown(content).replace(/\r/g, "").trim();
  if (!normalized) {
    return [];
  }

  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim().replace(/\s+/g, " "))
    .filter(Boolean);

  const size = clamp(chunkSize, 400, 5000);
  const overlap = clamp(chunkOverlap, 0, 1000);
  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if (!current) {
      current = paragraph;
      continue;
    }

    if (`${current}\n\n${paragraph}`.length <= size) {
      current = `${current}\n\n${paragraph}`;
      continue;
    }

    chunks.push(current);
    const tail = overlap > 0 ? current.slice(Math.max(0, current.length - overlap)) : "";
    current = `${tail}${tail ? "\n\n" : ""}${paragraph}`.trim();
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

function parseFrontmatterArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => parseFrontmatterArray(entry));
  }
  if (typeof value === "string") {
    return value
      .split(/[,\n]/)
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return [];
}

function extractMetadataLists(metadata?: Pick<CachedMetadata, "headings" | "tags" | "frontmatter">): {
  headings: string[];
  tags: string[];
  aliases: string[];
} {
  const headings = metadata?.headings?.map((heading) => heading.heading).filter(Boolean) ?? [];
  const inlineTags = metadata?.tags?.map((tag) => tag.tag).filter(Boolean) ?? [];
  const frontmatterTags = parseFrontmatterArray(metadata?.frontmatter?.tags ?? metadata?.frontmatter?.tag);
  const aliases = parseFrontmatterArray(metadata?.frontmatter?.aliases ?? metadata?.frontmatter?.alias);

  return {
    headings,
    tags: Array.from(new Set([...inlineTags, ...frontmatterTags])),
    aliases: Array.from(new Set(aliases)),
  };
}

export function buildSearchableChunks(input: IndexedFileInput): SearchableChunk[] {
  const { headings, tags, aliases } = extractMetadataLists(input.metadata);
  const titleNorm = normalizeForSearch(input.title);
  const headingsNorm = normalizeForSearch(headings.join(" "));
  const tagsNorm = normalizeForSearch(tags.join(" "));
  const aliasesNorm = normalizeForSearch(aliases.join(" "));
  const chunks = splitIntoChunks(input.content, input.chunkSize, input.chunkOverlap);

  return chunks.map((chunk, index) => ({
    id: `${input.path}::${index}`,
    filePath: input.path,
    title: input.title,
    titleNorm,
    headings,
    headingsNorm,
    tags,
    tagsNorm,
    aliases,
    aliasesNorm,
    excerpt: truncate(chunk.trim(), 700),
    textNorm: normalizeForSearch(chunk),
    lastModified: input.lastModified,
  }));
}

export function rankVaultChunks(
  query: string,
  chunks: SearchableChunk[],
  limit: number,
  now = Date.now(),
): VaultMatch[] {
  const tokens = tokenize(query);
  const normalizedPhrase = normalizeForSearch(query);
  if (tokens.length === 0) {
    return [];
  }

  const scored = chunks
    .map((chunk) => {
      let score = 0;

      for (const token of tokens) {
        score += countTermOccurrences(chunk.titleNorm, token) * 5.5;
        score += countTermOccurrences(chunk.headingsNorm, token) * 3.5;
        score += countTermOccurrences(chunk.tagsNorm, token) * 4.5;
        score += countTermOccurrences(chunk.aliasesNorm, token) * 4.5;
        score += countTermOccurrences(chunk.textNorm, token) * 1.2;
      }

      if (normalizedPhrase && chunk.titleNorm.includes(normalizedPhrase)) {
        score += 7;
      }
      if (normalizedPhrase && chunk.textNorm.includes(normalizedPhrase)) {
        score += 2.5;
      }

      const ageDays = Math.max(0, (now - chunk.lastModified) / 86400000);
      const recencyBonus = Math.max(0, 1 - ageDays / 45) * 0.9;
      score += recencyBonus;

      return {
        chunk,
        score,
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || right.chunk.lastModified - left.chunk.lastModified);

  return scored.slice(0, limit).map(({ chunk, score }) => ({
    id: chunk.id,
    filePath: chunk.filePath,
    title: chunk.title,
    excerpt: chunk.excerpt,
    headings: chunk.headings,
    tags: chunk.tags,
    aliases: chunk.aliases,
    score,
    lastModified: chunk.lastModified,
  }));
}

export class VaultIndex {
  private readonly chunks = new Map<string, SearchableChunk>();
  private readonly fileChunkIds = new Map<string, string[]>();
  private buildPromise: Promise<void> | null = null;

  constructor(
    private readonly app: App,
    private readonly getSettings: () => PluginSettings,
  ) {}

  async ensureReady(): Promise<void> {
    if (!this.buildPromise) {
      this.buildPromise = this.rebuild();
    }
    await this.buildPromise;
  }

  async rebuild(): Promise<void> {
    this.chunks.clear();
    this.fileChunkIds.clear();

    const files = this.app.vault.getMarkdownFiles();
    for (const file of files) {
      await this.indexFile(file);
    }
  }

  async indexFile(file: TFile): Promise<void> {
    if (file.extension !== "md") {
      return;
    }

    this.removeFile(file.path);
    const settings = this.getSettings();
    const content = await this.app.vault.cachedRead(file);
    const metadata = this.app.metadataCache.getFileCache(file) ?? undefined;
    const chunks = buildSearchableChunks({
      path: file.path,
      title: file.basename,
      lastModified: file.stat.mtime,
      content,
      metadata,
      chunkSize: settings.chunkSize,
      chunkOverlap: settings.chunkOverlap,
    });

    this.fileChunkIds.set(
      file.path,
      chunks.map((chunk) => chunk.id),
    );

    for (const chunk of chunks) {
      this.chunks.set(chunk.id, chunk);
    }
  }

  removeFile(path: string): void {
    const chunkIds = this.fileChunkIds.get(path) ?? [];
    for (const chunkId of chunkIds) {
      this.chunks.delete(chunkId);
    }
    this.fileChunkIds.delete(path);
  }

  async onFileChanged(file: TAbstractFile): Promise<void> {
    if (file instanceof TFile && file.extension === "md") {
      await this.indexFile(file);
    }
  }

  onFileDeleted(file: TAbstractFile): void {
    if (file instanceof TFile) {
      this.removeFile(file.path);
    }
  }

  async onFileRenamed(file: TAbstractFile, oldPath: string): Promise<void> {
    this.removeFile(oldPath);
    if (file instanceof TFile && file.extension === "md") {
      await this.indexFile(file);
    }
  }

  search(query: string, options?: { excludePath?: string; limit?: number }): VaultMatch[] {
    const settings = this.getSettings();
    const chunks = Array.from(this.chunks.values()).filter((chunk) => chunk.filePath !== options?.excludePath);
    return rankVaultChunks(query, chunks, options?.limit ?? settings.maxVaultResults);
  }
}

