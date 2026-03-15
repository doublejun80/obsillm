import { requestUrl } from "obsidian";

import { buildProviderPrompt } from "../prompting";
import { uniqueCitations } from "../utils";

import type { ChatRequest, ChatResponse, Citation, ProviderAdapter, ProviderSettings } from "../types";

interface GeminiCandidate {
  content?: {
    parts?: Array<{ text?: string }>;
  };
  groundingMetadata?: {
    groundingChunks?: Array<{
      web?: {
        uri?: string;
        title?: string;
      };
    }>;
  };
}

interface GeminiResponsePayload {
  candidates?: GeminiCandidate[];
  error?: {
    message?: string;
  };
  message?: string;
}

export interface GeminiRequestBody {
  system_instruction: {
    parts: Array<{ text: string }>;
  };
  contents: Array<{
    role: "user" | "model";
    parts: Array<{ text: string }>;
  }>;
  tools?: Array<Record<string, unknown>>;
}

export function buildGeminiRequest(request: ChatRequest): GeminiRequestBody {
  const envelope = buildProviderPrompt(request.prompt, request.retrieval);
  const body: GeminiRequestBody = {
    system_instruction: {
      parts: [{ text: request.systemPrompt }],
    },
    contents: [
      ...request.conversation.map((turn) => ({
        role: turn.role === "assistant" ? ("model" as const) : ("user" as const),
        parts: [{ text: turn.content }],
      })),
      {
        role: "user",
        parts: [{ text: envelope.prompt }],
      },
    ],
  };

  if (request.retrieval.useWeb) {
    body.tools = [{ google_search: {} }];
  }

  return body;
}

export function parseGeminiResponse(payload: GeminiResponsePayload): { text: string; citations: Citation[] } {
  const candidate = payload.candidates?.[0];
  const text = candidate?.content?.parts?.map((part) => part.text ?? "").join("\n").trim() ?? "";
  const citations: Citation[] =
    candidate?.groundingMetadata?.groundingChunks
      ?.map((chunk) => chunk.web)
      .filter((web): web is { uri: string; title?: string } => Boolean(web?.uri))
      .map((web) => ({
        id: `web:${web.uri}`,
        source: "web" as const,
        title: web.title ?? web.uri,
        url: web.uri,
      })) ?? [];

  return {
    text,
    citations: uniqueCitations(citations),
  };
}

function sanitizeProviderErrorDetail(detail: string | undefined): string | undefined {
  const cleaned = detail?.replace(/\s+/g, " ").replace(/raw payload:.*$/i, "").trim();
  return cleaned ? cleaned.slice(0, 240) : undefined;
}

function extractGeminiErrorMessage(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const record = payload as Record<string, unknown>;
  const nestedError =
    record.error && typeof record.error === "object"
      ? sanitizeProviderErrorDetail((record.error as Record<string, unknown>).message as string | undefined)
      : undefined;

  return nestedError ?? sanitizeProviderErrorDetail(record.message as string | undefined);
}

export class GeminiProviderAdapter implements ProviderAdapter {
  readonly id = "gemini" as const;
  readonly displayName = "Gemini";

  constructor(private readonly settings: ProviderSettings) {}

  validate(): string | undefined {
    if (!this.settings.apiKey.trim()) {
      return "Gemini API key is missing.";
    }
    if (!this.getModel()) {
      return "Gemini model is missing.";
    }
    return undefined;
  }

  getModel(): string {
    return this.settings.model.trim();
  }

  async generate(request: ChatRequest): Promise<ChatResponse> {
    const configError = this.validate();
    if (configError) {
      throw new Error(configError);
    }

    const body = buildGeminiRequest(request);
    const model = request.model.trim();
    let responseText = "";
    let payload: GeminiResponsePayload | undefined;

    try {
      const response = await requestUrl({
        url: `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": this.settings.apiKey.trim(),
        },
      });
      responseText = response.text;
      payload = response.json as GeminiResponsePayload;
    } catch (error) {
      const detail = sanitizeProviderErrorDetail(error instanceof Error ? error.message : String(error));
      throw new Error(detail ? `Gemini request failed: ${detail}` : "Gemini request failed.");
    }

    const parsed = parseGeminiResponse(payload ?? {});
    if (!parsed.text) {
      const errorMessage = extractGeminiErrorMessage(payload) ?? extractGeminiErrorMessage(safeParseJson(responseText));
      throw new Error(errorMessage ? `Gemini returned no answer: ${errorMessage}` : "Gemini returned no answer.");
    }

    const envelope = buildProviderPrompt(request.prompt, request.retrieval);
    return {
      provider: this.id,
      model,
      text: parsed.text,
      citations: uniqueCitations([...envelope.vaultCitations, ...parsed.citations]),
      raw: payload,
    };
  }
}

function safeParseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}
