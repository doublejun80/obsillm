"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProviderAdapter = void 0;
exports.buildOpenAIRequest = buildOpenAIRequest;
exports.extractOpenAICitations = extractOpenAICitations;
exports.parseOpenAIResponse = parseOpenAIResponse;
const obsidian_1 = require("obsidian");
const prompting_1 = require("../prompting");
const utils_1 = require("../utils");
function buildOpenAIRequest(request) {
    const envelope = (0, prompting_1.buildProviderPrompt)(request.prompt, request.retrieval);
    const input = [
        ...request.conversation.map((turn) => ({
            role: turn.role,
            content: [{ type: "input_text", text: turn.content }],
        })),
        {
            role: "user",
            content: [{ type: "input_text", text: envelope.prompt }],
        },
    ];
    const body = {
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
function collectTextFromOpenAIOutput(output) {
    if (!Array.isArray(output)) {
        return "";
    }
    const fragments = [];
    const visit = (value) => {
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
        const record = value;
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
function extractOpenAICitations(payload) {
    const citations = [];
    const visit = (value, parentKey) => {
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
        const record = value;
        if ((parentKey === "sources" || "url" in record || "uri" in record) &&
            (typeof record.url === "string" || typeof record.uri === "string")) {
            const url = record.url ?? record.uri;
            const title = record.title ?? record.name ?? url ?? "Web source";
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
    return (0, utils_1.uniqueCitations)(citations);
}
function parseOpenAIResponse(payload) {
    const text = payload.output_text?.trim() || collectTextFromOpenAIOutput(payload.output) || "";
    return {
        text,
        citations: extractOpenAICitations(payload),
    };
}
function sanitizeProviderErrorDetail(detail) {
    const cleaned = detail?.replace(/\s+/g, " ").replace(/raw payload:.*$/i, "").trim();
    return cleaned ? cleaned.slice(0, 240) : undefined;
}
function extractOpenAIErrorMessage(payload) {
    if (!payload || typeof payload !== "object") {
        return undefined;
    }
    const record = payload;
    const nestedError = record.error && typeof record.error === "object"
        ? sanitizeProviderErrorDetail(record.error.message)
        : undefined;
    return nestedError ?? sanitizeProviderErrorDetail(record.message);
}
class OpenAIProviderAdapter {
    constructor(settings) {
        this.settings = settings;
        this.id = "openai";
        this.displayName = "OpenAI";
    }
    validate() {
        if (!this.settings.apiKey.trim()) {
            return "OpenAI API key is missing.";
        }
        if (!this.getModel()) {
            return "OpenAI model is missing.";
        }
        return undefined;
    }
    getModel() {
        return this.settings.model.trim();
    }
    async generate(request) {
        const configError = this.validate();
        if (configError) {
            throw new Error(configError);
        }
        const body = buildOpenAIRequest(request);
        let responseText = "";
        let payload;
        try {
            const response = await (0, obsidian_1.requestUrl)({
                url: "https://api.openai.com/v1/responses",
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.settings.apiKey.trim()}`,
                },
            });
            responseText = response.text;
            payload = response.json;
        }
        catch (error) {
            const detail = sanitizeProviderErrorDetail(error instanceof Error ? error.message : String(error));
            throw new Error(detail ? `OpenAI request failed: ${detail}` : "OpenAI request failed.");
        }
        const parsed = parseOpenAIResponse(payload ?? {});
        if (!parsed.text) {
            const errorMessage = extractOpenAIErrorMessage(payload) ?? extractOpenAIErrorMessage(safeParseJson(responseText));
            throw new Error(errorMessage ? `OpenAI returned no answer: ${errorMessage}` : "OpenAI returned no answer.");
        }
        const envelope = (0, prompting_1.buildProviderPrompt)(request.prompt, request.retrieval);
        return {
            provider: this.id,
            model: request.model,
            text: parsed.text,
            citations: (0, utils_1.uniqueCitations)([...envelope.vaultCitations, ...parsed.citations]),
            raw: payload,
        };
    }
}
exports.OpenAIProviderAdapter = OpenAIProviderAdapter;
function safeParseJson(text) {
    try {
        return JSON.parse(text);
    }
    catch {
        return undefined;
    }
}
