import type { ProviderId } from "./types";

export const OPENAI_MODEL_OPTIONS = ["gpt-5-mini", "gpt-5-nano"] as const;
export const GEMINI_MODEL_OPTIONS = ["gemini-2.5-flash-lite", "gemini-3.1-flash-lite-preview"] as const;

export function getModelOptions(provider: ProviderId): string[] {
  return provider === "openai" ? [...OPENAI_MODEL_OPTIONS] : [...GEMINI_MODEL_OPTIONS];
}

export function getDefaultModel(provider: ProviderId): string {
  return getModelOptions(provider)[0];
}

export function isSupportedModel(provider: ProviderId, model: string | null | undefined): boolean {
  if (!model?.trim()) {
    return false;
  }

  return getModelOptions(provider).includes(model.trim());
}
