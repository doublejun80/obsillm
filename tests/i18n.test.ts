import { describe, expect, it } from "vitest";

import { getDefaultSystemPrompt, isDefaultSystemPrompt } from "../src/i18n";

describe("i18n helpers", () => {
  it("recognizes the new Japanese language code", () => {
    expect(getDefaultSystemPrompt("ja")).toContain("ObsiLLM");
  });

  it("only treats exact built-in prompts as defaults", () => {
    expect(isDefaultSystemPrompt(getDefaultSystemPrompt("en"))).toBe(true);
    expect(
      isDefaultSystemPrompt(
        "You are ObsiLLM, but please always greet the user before answering.",
      ),
    ).toBe(false);
  });
});
