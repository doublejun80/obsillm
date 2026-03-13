"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clamp = clamp;
exports.normalizeWhitespace = normalizeWhitespace;
exports.truncate = truncate;
exports.normalizeForSearch = normalizeForSearch;
exports.tokenize = tokenize;
exports.countTermOccurrences = countTermOccurrences;
exports.uniqueCitations = uniqueCitations;
exports.createVaultCitation = createVaultCitation;
exports.citationToMarkdown = citationToMarkdown;
exports.renderMarkdownCompat = renderMarkdownCompat;
exports.findOrCreateAvailablePath = findOrCreateAvailablePath;
exports.slugifyTitle = slugifyTitle;
exports.maybeFile = maybeFile;
const obsidian_1 = require("obsidian");
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
function normalizeWhitespace(value) {
    return value.replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
function truncate(value, maxLength) {
    if (value.length <= maxLength) {
        return value;
    }
    return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}
function normalizeForSearch(value) {
    return value.toLowerCase().replace(/[^\p{L}\p{N}\s#/_-]+/gu, " ").replace(/\s+/g, " ").trim();
}
function tokenize(value) {
    const normalized = normalizeForSearch(value);
    if (!normalized) {
        return [];
    }
    return Array.from(new Set(normalized.split(" ").filter((token) => token.length > 1)));
}
function countTermOccurrences(haystack, term) {
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
function uniqueCitations(citations) {
    const seen = new Set();
    const result = [];
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
function createVaultCitation(filePath, title, excerpt) {
    return {
        id: `vault:${filePath}`,
        source: "vault",
        title,
        filePath,
        excerpt,
    };
}
function citationToMarkdown(citation) {
    if (citation.source === "vault" && citation.filePath) {
        const wikiPath = citation.filePath.replace(/\.md$/i, "");
        const detail = citation.excerpt ? ` - ${citation.excerpt}` : "";
        return `- [[${wikiPath}|${citation.title}]]${detail}`;
    }
    const url = citation.url ?? "";
    return `- [${citation.title}](${url})`;
}
async function renderMarkdownCompat(app, markdown, container, sourcePath, component) {
    const renderer = obsidian_1.MarkdownRenderer;
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
async function findOrCreateAvailablePath(app, proposedPath) {
    const normalized = (0, obsidian_1.normalizePath)(proposedPath);
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
function slugifyTitle(value) {
    const cleaned = value
        .trim()
        .replace(/[<>:"/\\|?*\u0000-\u001F]+/g, " ")
        .replace(/\s+/g, " ");
    return cleaned || "ObsiLLM Draft";
}
function maybeFile(value) {
    return value instanceof obsidian_1.TFile;
}
