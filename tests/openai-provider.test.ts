import { describe, expect, it } from "vitest";

import { buildOpenAIRequest, parseOpenAIResponse } from "../src/providers/openai";
import type { ChatRequest } from "../src/types";

const baseRequest: ChatRequest = {
  provider: "openai",
  model: "gpt-5.2-codex",
  prompt: "Summarize the latest note and verify one fact on the web.",
  systemPrompt: "System instruction",
  retrieval: {
    useVault: true,
    useWeb: true,
    activeNote: {
      path: "Projects/Plan.md",
      title: "Plan",
      excerpt: "A planning note",
    },
    vaultMatches: [
      {
        id: "1",
        filePath: "Research/Source.md",
        title: "Source",
        excerpt: "Important excerpt",
        headings: ["Findings"],
        tags: ["#research"],
        aliases: [],
        score: 10,
        lastModified: Date.now(),
      },
    ],
  },
  conversation: [{ role: "assistant", content: "Previous answer" }],
};

describe("OpenAI provider helpers", () => {
  it("builds a Responses API request with web search enabled", () => {
    const request = buildOpenAIRequest(baseRequest);

    expect(request.model).toBe("gpt-5.2-codex");
    expect(request.instructions).toBe("System instruction");
    expect(request.input).toHaveLength(2);
    expect(request.tools?.[0]).toMatchObject({ type: "web_search" });
    expect(request.include).toContain("web_search_call.action.sources");
  });

  it("parses output text and web citations", () => {
    const parsed = parseOpenAIResponse({
      output_text: "Grounded answer",
      output: [
        {
          action: {
            sources: [{ title: "OpenAI Docs", url: "https://platform.openai.com/docs/models" }],
          },
        },
      ],
    });

    expect(parsed.text).toBe("Grounded answer");
    expect(parsed.citations).toEqual([
      {
        id: "web:https://platform.openai.com/docs/models",
        source: "web",
        title: "OpenAI Docs",
        url: "https://platform.openai.com/docs/models",
      },
    ]);
  });
});
