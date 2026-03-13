import { describe, expect, it } from "vitest";

import { applyTextInsertion, buildInsertionMarkdown } from "../src/insertion";
import type { ChatResponse } from "../src/types";

describe("Insertion helpers", () => {
  it("replaces the current selection", () => {
    const next = applyTextInsertion(
      {
        document: "Hello world",
        selectionStart: 6,
        selectionEnd: 11,
      },
      "ObsiLLM",
      "replace-selection",
    );

    expect(next.document).toBe("Hello ObsiLLM");
  });

  it("builds markdown with sources", () => {
    const response: ChatResponse = {
      provider: "openai",
      model: "gpt-5.2-codex",
      text: "Draft answer",
      citations: [
        {
          id: "vault:Notes/Plan.md",
          source: "vault",
          title: "Plan",
          filePath: "Notes/Plan.md",
        },
        {
          id: "web:https://example.com",
          source: "web",
          title: "Example",
          url: "https://example.com",
        },
      ],
    };

    expect(buildInsertionMarkdown(response)).toContain("## Sources");
    expect(buildInsertionMarkdown(response)).toContain("[[Notes/Plan|Plan]]");
    expect(buildInsertionMarkdown(response)).toContain("[Example](https://example.com)");
  });
});
