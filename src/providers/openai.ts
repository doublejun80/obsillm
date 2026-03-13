import { requestUrl } from "obsidian";

import { buildProviderPrompt } from "../prompting";
import { uniqueCitations } from "../utils";

import type { ChatRequest, ChatResponse, Citation, ProviderAdapter, ProviderSettings } from "../types";

interface OpenAIResponsePayload {
  output_text?: string;
  output?: unknown[];
}

export interface OpenAIRequestBody {
  model: string;
  instructions: string;
  input: Array<{
    role: "user" | "assistant";
    content: Array<{
      type: "input_text";
      text: string;
    }>;
  }>;
  tools?: Array<Record<string, unknown>>;
  tool_choice?: "auto";
  include?: string[];
}

export function buildOpenAIRequest(request: ChatRequest): OpenAIRequestBody {
  const envelope = buildProviderPrompt(request.prompt, request.retrieval);
  const input = [
    ...request.conversation.map((turn) => ({
      role: turn.role,
      content: [{ type: "input_text" as const, text: turn.content }],
    })),
    {
      role: "user" as const,
      content: [{ type: "input_text" as const, text: envelope.prompt }],
    },
  ];

  const body: OpenAIRequestBody = {
    model: request.model,
    instructions: request.systemPrompt,
    input,
  };

  if (request.retrieval.useWeb) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    body.tools = [
      {
        type: "web_search",
        ...(timezone
          ? {
              user_location: {
                type: "approximate",
                timezone,
              },
            }
          : {}),
      },
    ];
    body.tool_choice = "auto";
    body.include = ["web_search_call.action.sources"];
  }

  return body;
}

function collectTextFromOpenAIOutput(output: unknown[] | undefined): string {
  if (!Array.isArray(output)) {
    return "";
  }

  const fragments: string[] = [];
  const visit = (value: unknown): void => {
    if (typeof value === "string") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    if (!value || typeof value !== "object") {
      return;
    }

    const record = value as Record<string, unknown>;
    if (record.type === "output_text" && typeof record.text === "string") {
      fragments.push(record.text);
    }
    if (record.type === "text" && typeof record.text === "string") {
      fragments.push(record.text);
    }
    if (typeof record.content === "object") {
      visit(record.content);
    }
  };

  visit(output);
  return fragments.join("\n").trim();
}

export function extractOpenAICitations(payload: unknown): Citation[] {
  const citations: Citation[] = [];
  const visit = (value: unknown, parentKey?: string): void => {
    if (!value) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, parentKey));
      return;
    }

    if (typeof value !== "object") {
      return;
    }

    const record = value as Record<string, unknown>;
    if (
      (parentKey === "sources" || "url" in record || "uri" in record) &&
      (typeof record.url === "string" || typeof record.uri === "string")
    ) {
      const url = (record.url as string | undefined) ?? (record.uri as string | undefined);
      const title = (record.title as string | undefined) ?? (record.name as string | undefined) ?? url ?? "Web source";
      if (url) {
        citations.push({
          id: `web:${url}`,
          source: "web",
          title,
          url,
        });
      }
    }

    for (const [key, nested] of Object.entries(record)) {
      visit(nested, key);
    }
  };

  visit(payload);
  return uniqueCitations(citations);
}

export function parseOpenAIResponse(payload: OpenAIResponsePayload): { text: string; citations: Citation[] } {
  const text = payload.output_text?.trim() || collectTextFromOpenAIOutput(payload.output) || "";
  return {
    text,
    citations: extractOpenAICitations(payload),
  };
}

export class OpenAIProviderAdapter implements ProviderAdapter {
  readonly id = "openai" as const;
  readonly displayName = "OpenAI";

  constructor(private readonly settings: ProviderSettings) {}

  validate(): string | undefined {
    if (!this.settings.apiKey.trim()) {
      return "OpenAI API key is missing.";
    }
    if (!this.getModel()) {
      return "OpenAI model is missing.";
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

    const body = buildOpenAIRequest(request);
    let responseText = "";
    let payload: OpenAIResponsePayload | undefined;

    try {
      const response = await requestUrl({
        url: "https://api.openai.com/v1/responses",
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.settings.apiKey.trim()}`,
        },
      });
      responseText = response.text;
      payload = response.json as OpenAIResponsePayload;
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      throw new Error(`OpenAI request failed: ${detail}`);
    }

    const parsed = parseOpenAIResponse(payload ?? {});
    if (!parsed.text) {
      throw new Error(`OpenAI returned an empty response. Raw payload: ${responseText.slice(0, 500)}`);
    }

    const envelope = buildProviderPrompt(request.prompt, request.retrieval);
    return {
      provider: this.id,
      model: request.model,
      text: parsed.text,
      citations: uniqueCitations([...envelope.vaultCitations, ...parsed.citations]),
      raw: payload,
    };
  }
}
