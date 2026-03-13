import { describe, expect, it } from "vitest";

import { buildSearchableChunks, rankVaultChunks } from "../src/retrieval/vault-index";

describe("Vault ranking", () => {
  it("prefers title and heading matches over plain body matches", () => {
    const now = Date.now();
    const titleChunks = buildSearchableChunks({
      path: "Notes/Weekly Review.md",
      title: "Weekly Review",
      lastModified: now,
      content: "Random body text.",
      metadata: {
        headings: [{ heading: "Action items", level: 2, position: { start: { line: 1, col: 0, offset: 0 }, end: { line: 1, col: 12, offset: 12 } } }],
        tags: [],
        frontmatter: {},
      },
      chunkSize: 1000,
      chunkOverlap: 0,
    });

    const bodyChunks = buildSearchableChunks({
      path: "Notes/Other.md",
      title: "Other",
      lastModified: now - 20 * 86400000,
      content: "This note mentions weekly review in the middle of the paragraph.",
      metadata: {
        headings: [],
        tags: [],
        frontmatter: {},
      },
      chunkSize: 1000,
      chunkOverlap: 0,
    });

    const ranked = rankVaultChunks("weekly review", [...titleChunks, ...bodyChunks], 2, now);
    expect(ranked[0]?.filePath).toBe("Notes/Weekly Review.md");
  });

  it("returns tags and aliases with the result", () => {
    const chunks = buildSearchableChunks({
      path: "Research/LLM.md",
      title: "LLM Overview",
      lastModified: Date.now(),
      content: "Context about model orchestration.",
      metadata: {
        headings: [],
        tags: [{ tag: "#llm", position: { start: { line: 0, col: 0, offset: 0 }, end: { line: 0, col: 4, offset: 4 } } }],
        frontmatter: {
          aliases: ["Language Models"],
        },
      },
      chunkSize: 1000,
      chunkOverlap: 0,
    });

    const ranked = rankVaultChunks("language models llm", chunks, 1);
    expect(ranked[0]?.tags).toContain("#llm");
    expect(ranked[0]?.aliases).toContain("Language Models");
  });
});
