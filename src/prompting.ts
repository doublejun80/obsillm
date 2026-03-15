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
  sections.push(
    "Use vault context only when it is directly relevant to the user's request. If it is not directly relevant, ignore it completely and do not mention it.",
  );
  sections.push("If web search is enabled, use it only when it materially improves the answer.");
  sections.push(
    "Do not repeat the user's request. Do not greet the user. Do not say you are ObsiLLM. Do not add prefaces or commentary before the answer. Start directly with the requested output.",
  );
  sections.push("If the user asks for a title, outline, blog post, or draft, start with the title heading itself on the first line.");
  sections.push("Never force an association between the user's request and a vault note unless the overlap is explicit and material.");

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
    "Write in Markdown. Be explicit when information comes from the web. Mention vault note titles only when they are directly relevant and genuinely helpful.",
  );

  return {
    prompt: normalizeWhitespace(sections.join("\n\n")),
    vaultCitations,
  };
}
