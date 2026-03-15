import { App, Component, MarkdownRenderer, TFile, normalizePath } from "obsidian";

import type { Citation } from "./types";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function normalizeWhitespace(value: string): string {
  return value.replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export function normalizeForSearch(value: string): string {
  return value.toLowerCase().replace(/[^\p{L}\p{N}\s#/_-]+/gu, " ").replace(/\s+/g, " ").trim();
}

export function tokenize(value: string): string[] {
  const normalized = normalizeForSearch(value);
  if (!normalized) {
    return [];
  }

  return Array.from(new Set(normalized.split(" ").filter((token) => token.length > 1)));
}

export function countTermOccurrences(haystack: string, term: string): number {
  if (!haystack || !term) {
    return 0;
  }

  let count = 0;
  let index = haystack.indexOf(term);
  while (index >= 0) {
    count += 1;
    index = haystack.indexOf(term, index + term.length);
  }
  return count;
}

export function uniqueCitations(citations: Citation[]): Citation[] {
  const seen = new Set<string>();
  const result: Citation[] = [];
  for (const citation of citations) {
    const key = citation.url ?? citation.filePath ?? `${citation.source}:${citation.title}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(citation);
  }
  return result;
}

export function createVaultCitation(filePath: string, title: string, excerpt?: string): Citation {
  return {
    id: `vault:${filePath}`,
    source: "vault",
    title,
    filePath,
    excerpt,
  };
}

export function getSafeExternalUrl(value: string | null | undefined): string | null {
  if (!value?.trim()) {
    return null;
  }

  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}

export function citationToMarkdown(citation: Citation): string {
  if (citation.source === "vault" && citation.filePath) {
    const wikiPath = citation.filePath.replace(/\.md$/i, "");
    const detail = citation.excerpt ? ` - ${citation.excerpt}` : "";
    return `- [[${wikiPath}|${citation.title}]]${detail}`;
  }

  const url = getSafeExternalUrl(citation.url);
  return url ? `- [${citation.title}](${url})` : `- ${citation.title}`;
}

export async function renderMarkdownCompat(
  app: App,
  markdown: string,
  container: HTMLElement,
  sourcePath: string,
  component: Component,
): Promise<void> {
  const renderer = MarkdownRenderer as unknown as {
    render?: (
      app: App,
      markdown: string,
      container: HTMLElement,
      sourcePath: string,
      component: Component,
    ) => Promise<void> | void;
    renderMarkdown?: (
      markdown: string,
      container: HTMLElement,
      sourcePath: string,
      component: Component,
    ) => Promise<void> | void;
  };

  if (typeof renderer.render === "function") {
    await renderer.render(app, markdown, container, sourcePath, component);
    return;
  }

  if (typeof renderer.renderMarkdown === "function") {
    await renderer.renderMarkdown(markdown, container, sourcePath, component);
    return;
  }

  container.setText(markdown);
}

export async function ensureFolderExists(app: App, folderPath: string): Promise<void> {
  const normalized = normalizePath(folderPath.trim());
  if (!normalized) {
    return;
  }

  const parts = normalized.split("/").filter(Boolean);
  let current = "";
  for (const part of parts) {
    current = current ? `${current}/${part}` : part;
    if (!app.vault.getAbstractFileByPath(current)) {
      await app.vault.createFolder(current);
    }
  }
}

export async function findOrCreateAvailablePath(app: App, proposedPath: string): Promise<string> {
  const normalized = normalizePath(proposedPath);
  const existing = app.vault.getAbstractFileByPath(normalized);
  if (!existing) {
    return normalized;
  }

  const extensionMatch = normalized.match(/(\.[^.]+)$/);
  const extension = extensionMatch?.[1] ?? "";
  const base = extension ? normalized.slice(0, -extension.length) : normalized;

  let index = 2;
  while (app.vault.getAbstractFileByPath(`${base} ${index}${extension}`)) {
    index += 1;
  }
  return `${base} ${index}${extension}`;
}

export async function copyTextToClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const electronRequire = (window as Window & { require?: (name: string) => unknown }).require;
  if (typeof electronRequire === "function") {
    const electron = electronRequire("electron") as { clipboard?: { writeText: (value: string) => void } };
    if (electron.clipboard) {
      electron.clipboard.writeText(text);
      return;
    }
  }

  throw new Error("Clipboard is unavailable.");
}

export function slugifyTitle(value: string): string {
  const cleaned = value
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]+/g, " ")
    .replace(/\s+/g, " ");
  return cleaned || "ObsiLLM Draft";
}

export function maybeFile(value: unknown): value is TFile {
  return value instanceof TFile;
}
