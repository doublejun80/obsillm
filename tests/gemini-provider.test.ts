import { describe, expect, it } from "vitest";

import { buildGeminiRequest, parseGeminiResponse } from "../src/providers/gemini";
import type { ChatRequest } from "../src/types";

const baseRequest: ChatRequest = {
  provider: "gemini",
  model: "gemini-3-pro-preview",
  prompt: "Compare the active note with current public information.",
  systemPrompt: "System instruction",
  retrieval: {
    useVault: false,
    useWeb: true,
    activeNote: undefined,
    vaultMatches: [],
  },
  conversation: [{ role: "user", content: "Earlier question" }],
};

describe("Gemini provider helpers", () => {
  it("builds a native generateContent request with google_search", () => {
    const request = buildGeminiRequest(baseRequest);

    expect(request.system_instruction.parts[0].text).toBe("System instruction");
    expect(request.contents).toHaveLength(2);
    expect(request.tools).toEqual([{ google_search: {} }]);
  });

  it("parses grounded web citations", () => {
    const parsed = parseGeminiResponse({
      candidates: [
        {
          content: {
            parts: [{ text: "Grounded Gemini answer" }],
          },
          groundingMetadata: {
            groundingChunks: [
              {
                web: {
                  uri: "https://ai.google.dev/gemini-api/docs/google-search",
                  title: "Google Search grounding",
                },
              },
            ],
          },
        },
      ],
    });

    expect(parsed.text).toBe("Grounded Gemini answer");
    expect(parsed.citations).toEqual([
      {
        id: "web:https://ai.google.dev/gemini-api/docs/google-search",
        source: "web",
        title: "Google Search grounding",
        url: "https://ai.google.dev/gemini-api/docs/google-search",
      },
    ]);
  });
});
