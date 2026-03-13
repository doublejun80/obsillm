"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultIndex = void 0;
exports.buildSearchableChunks = buildSearchableChunks;
exports.rankVaultChunks = rankVaultChunks;
const obsidian_1 = require("obsidian");
const utils_1 = require("../utils");
function stripMarkdown(value) {
    return value
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
        .replace(/\[[^\]]*]\(([^)]*)\)/g, "$1")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/[*_~>-]/g, " ");
}
function splitIntoChunks(content, chunkSize, chunkOverlap) {
    const normalized = stripMarkdown(content).replace(/\r/g, "").trim();
    if (!normalized) {
        return [];
    }
    const paragraphs = normalized
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim().replace(/\s+/g, " "))
        .filter(Boolean);
    const size = (0, utils_1.clamp)(chunkSize, 400, 5000);
    const overlap = (0, utils_1.clamp)(chunkOverlap, 0, 1000);
    const chunks = [];
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
function parseFrontmatterArray(value) {
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
function extractMetadataLists(metadata) {
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
function buildSearchableChunks(input) {
    const { headings, tags, aliases } = extractMetadataLists(input.metadata);
    const titleNorm = (0, utils_1.normalizeForSearch)(input.title);
    const headingsNorm = (0, utils_1.normalizeForSearch)(headings.join(" "));
    const tagsNorm = (0, utils_1.normalizeForSearch)(tags.join(" "));
    const aliasesNorm = (0, utils_1.normalizeForSearch)(aliases.join(" "));
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
        excerpt: (0, utils_1.truncate)(chunk.trim(), 700),
        textNorm: (0, utils_1.normalizeForSearch)(chunk),
        lastModified: input.lastModified,
    }));
}
function rankVaultChunks(query, chunks, limit, now = Date.now()) {
    const tokens = (0, utils_1.tokenize)(query);
    const normalizedPhrase = (0, utils_1.normalizeForSearch)(query);
    if (tokens.length === 0) {
        return [];
    }
    const scored = chunks
        .map((chunk) => {
        let score = 0;
        for (const token of tokens) {
            score += (0, utils_1.countTermOccurrences)(chunk.titleNorm, token) * 5.5;
            score += (0, utils_1.countTermOccurrences)(chunk.headingsNorm, token) * 3.5;
            score += (0, utils_1.countTermOccurrences)(chunk.tagsNorm, token) * 4.5;
            score += (0, utils_1.countTermOccurrences)(chunk.aliasesNorm, token) * 4.5;
            score += (0, utils_1.countTermOccurrences)(chunk.textNorm, token) * 1.2;
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
class VaultIndex {
    constructor(app, getSettings) {
        this.app = app;
        this.getSettings = getSettings;
        this.chunks = new Map();
        this.fileChunkIds = new Map();
        this.buildPromise = null;
    }
    async ensureReady() {
        if (!this.buildPromise) {
            this.buildPromise = this.rebuild();
        }
        await this.buildPromise;
    }
    async rebuild() {
        this.chunks.clear();
        this.fileChunkIds.clear();
        const files = this.app.vault.getMarkdownFiles();
        for (const file of files) {
            await this.indexFile(file);
        }
    }
    async indexFile(file) {
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
        this.fileChunkIds.set(file.path, chunks.map((chunk) => chunk.id));
        for (const chunk of chunks) {
            this.chunks.set(chunk.id, chunk);
        }
    }
    removeFile(path) {
        const chunkIds = this.fileChunkIds.get(path) ?? [];
        for (const chunkId of chunkIds) {
            this.chunks.delete(chunkId);
        }
        this.fileChunkIds.delete(path);
    }
    async onFileChanged(file) {
        if (file instanceof obsidian_1.TFile && file.extension === "md") {
            await this.indexFile(file);
        }
    }
    onFileDeleted(file) {
        if (file instanceof obsidian_1.TFile) {
            this.removeFile(file.path);
        }
    }
    async onFileRenamed(file, oldPath) {
        this.removeFile(oldPath);
        if (file instanceof obsidian_1.TFile && file.extension === "md") {
            await this.indexFile(file);
        }
    }
    search(query, options) {
        const settings = this.getSettings();
        const chunks = Array.from(this.chunks.values()).filter((chunk) => chunk.filePath !== options?.excludePath);
        return rankVaultChunks(query, chunks, options?.limit ?? settings.maxVaultResults);
    }
}
exports.VaultIndex = VaultIndex;
