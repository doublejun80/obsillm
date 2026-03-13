import { App, MarkdownView, Notice, normalizePath } from "obsidian";

import { citationToMarkdown, findOrCreateAvailablePath, slugifyTitle } from "./utils";

import type { ChatResponse, InsertionMode, PluginSettings } from "./types";

export interface TextSelectionState {
  document: string;
  selectionStart: number;
  selectionEnd: number;
}

export function applyTextInsertion(
  state: TextSelectionState,
  insertedText: string,
  mode: Exclude<InsertionMode, "create-note">,
): TextSelectionState {
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

export function buildInsertionMarkdown(response: ChatResponse): string {
  const body = response.text.trim();
  if (response.citations.length === 0) {
    return body;
  }

  const citations = response.citations.map((citation) => citationToMarkdown(citation)).join("\n");
  return `${body}\n\n## Sources\n${citations}`;
}

function getActiveMarkdownView(app: App): MarkdownView | null {
  return app.workspace.getActiveViewOfType(MarkdownView);
}

export async function applyResponseToWorkspace(
  app: App,
  settings: PluginSettings,
  response: ChatResponse,
  mode: InsertionMode,
  titleHint: string,
): Promise<void> {
  const content = buildInsertionMarkdown(response);

  if (mode === "create-note") {
    const fileName = `${slugifyTitle(titleHint)}.md`;
    const folder = settings.createNoteFolder.trim();
    const path = normalizePath(folder ? `${folder}/${fileName}` : fileName);
    const availablePath = await findOrCreateAvailablePath(app, path);
    const file = await app.vault.create(availablePath, content);
    await app.workspace.getLeaf(true).openFile(file);
    new Notice(`Created ${availablePath}`);
    return;
  }

  const view = getActiveMarkdownView(app);
  const editor = view?.editor;
  if (!editor) {
    throw new Error("No active Markdown editor is available.");
  }

  if (mode === "replace-selection" && editor.getSelection()) {
    editor.replaceSelection(content);
  } else {
    editor.replaceRange(content, editor.getCursor());
  }
}
