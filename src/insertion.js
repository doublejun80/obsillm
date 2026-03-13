"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyTextInsertion = applyTextInsertion;
exports.buildInsertionMarkdown = buildInsertionMarkdown;
exports.applyResponseToWorkspace = applyResponseToWorkspace;
const obsidian_1 = require("obsidian");
const utils_1 = require("./utils");
function applyTextInsertion(state, insertedText, mode) {
    const start = Math.max(0, Math.min(state.selectionStart, state.selectionEnd));
    const end = Math.max(start, Math.max(state.selectionStart, state.selectionEnd));
    if (mode === "replace-selection") {
        return {
            document: `${state.document.slice(0, start)}${insertedText}${state.document.slice(end)}`,
            selectionStart: start + insertedText.length,
            selectionEnd: start + insertedText.length,
        };
    }
    return {
        document: `${state.document.slice(0, start)}${insertedText}${state.document.slice(start)}`,
        selectionStart: start + insertedText.length,
        selectionEnd: start + insertedText.length,
    };
}
function buildInsertionMarkdown(response) {
    const body = response.text.trim();
    if (response.citations.length === 0) {
        return body;
    }
    const citations = response.citations.map((citation) => (0, utils_1.citationToMarkdown)(citation)).join("\n");
    return `${body}\n\n## Sources\n${citations}`;
}
function getActiveMarkdownView(app) {
    return app.workspace.getActiveViewOfType(obsidian_1.MarkdownView);
}
async function applyResponseToWorkspace(app, settings, response, mode, titleHint) {
    const content = buildInsertionMarkdown(response);
    if (mode === "create-note") {
        const fileName = `${(0, utils_1.slugifyTitle)(titleHint)}.md`;
        const folder = settings.createNoteFolder.trim();
        const path = (0, obsidian_1.normalizePath)(folder ? `${folder}/${fileName}` : fileName);
        const availablePath = await (0, utils_1.findOrCreateAvailablePath)(app, path);
        const file = await app.vault.create(availablePath, content);
        await app.workspace.getLeaf(true).openFile(file);
        new obsidian_1.Notice(`Created ${availablePath}`);
        return;
    }
    const view = getActiveMarkdownView(app);
    const editor = view?.editor;
    if (!editor) {
        throw new Error("No active Markdown editor is available.");
    }
    if (mode === "replace-selection" && editor.getSelection()) {
        editor.replaceSelection(content);
    }
    else {
        editor.replaceRange(content, editor.getCursor());
    }
}
