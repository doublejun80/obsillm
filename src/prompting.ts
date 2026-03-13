import { createVaultCitation, normalizeWhitespace, truncate } from "./utils";

import type { ProviderPromptEnvelope, RetrievalContext } from "./types";

const ACTIVE_NOTE_LIMIT = 3500;
const MATCH_EXCERPT_LIMIT = 600;

export function buildProviderPrompt(prompt: string, retrieval: RetrievalContext): ProviderPromptEnvelope {
  const sections: string[] = [];
  const vaultCitations = retrieval.vaultMatches.map((match) =>
    createVaultCitation(match.filePath, match.title, truncate(match.excerpt, 140)),
  );

  sections.push("You are answering inside an Obsidian knowledge workspace.");
  sections.push("Prefer the provided vault context when it is relevant. If web search is enabled, use it only when it materially improves the answer.");

  if (retrieval.activeNote) {
    const activeNoteLines = [
      `Path: ${retrieval.activeNote.path}`,
      `Title: ${retrieval.activeNote.title}`,
      retrieval.activeNote.selection
        ? `Selected text:\n${truncate(retrieval.activeNote.selection, 1000)}`
        : undefined,
      `Note excerpt:\n${truncate(retrieval.activeNote.excerpt, ACTIVE_NOTE_LIMIT)}`,
    ].filter(Boolean);
    sections.push(`Active note context:\n${activeNoteLines.join("\n\n")}`);
  }

  if (retrieval.vaultMatches.length > 0) {
    const vaultLines = retrieval.vaultMatches.map((match, index) => {
      const headingText = match.headings.length > 0 ? ` | headings: ${match.headings.slice(0, 3).join(", ")}` : "";
      const tagText = match.tags.length > 0 ? ` | tags: ${match.tags.slice(0, 4).join(", ")}` : "";
      return [
        `[Vault ${index + 1}] ${match.title} (${match.filePath})${headingText}${tagText}`,
        truncate(match.excerpt, MATCH_EXCERPT_LIMIT),
      ].join("\n");
    });
    sections.push(`Vault search context:\n${vaultLines.join("\n\n")}`);
  }

  sections.push(`User request:\n${prompt}`);
  sections.push(
    "Write in Markdown. Be explicit when information comes from the web. When vault notes are relevant, mention note titles naturally in the answer.",
  );

  return {
    prompt: normalizeWhitespace(sections.join("\n\n")),
    vaultCitations,
  };
}
