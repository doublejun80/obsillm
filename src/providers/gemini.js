"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProviderAdapter = void 0;
exports.buildGeminiRequest = buildGeminiRequest;
exports.parseGeminiResponse = parseGeminiResponse;
const obsidian_1 = require("obsidian");
const prompting_1 = require("../prompting");
const utils_1 = require("../utils");
function buildGeminiRequest(request) {
    const envelope = (0, prompting_1.buildProviderPrompt)(request.prompt, request.retrieval);
    const body = {
        system_instruction: {
            parts: [{ text: request.systemPrompt }],
        },
        contents: [
            ...request.conversation.map((turn) => ({
                role: turn.role === "assistant" ? "model" : "user",
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
function parseGeminiResponse(payload) {
    const candidate = payload.candidates?.[0];
    const text = candidate?.content?.parts?.map((part) => part.text ?? "").join("\n").trim() ?? "";
    const citations = candidate?.groundingMetadata?.groundingChunks
        ?.map((chunk) => chunk.web)
        .filter((web) => Boolean(web?.uri))
        .map((web) => ({
        id: `web:${web.uri}`,
        source: "web",
        title: web.title ?? web.uri,
        url: web.uri,
    })) ?? [];
    return {
        text,
        citations: (0, utils_1.uniqueCitations)(citations),
    };
}
function sanitizeProviderErrorDetail(detail) {
    const cleaned = detail?.replace(/\s+/g, " ").replace(/raw payload:.*$/i, "").trim();
    return cleaned ? cleaned.slice(0, 240) : undefined;
}
function extractGeminiErrorMessage(payload) {
    if (!payload || typeof payload !== "object") {
        return undefined;
    }
    const record = payload;
    const nestedError = record.error && typeof record.error === "object"
        ? sanitizeProviderErrorDetail(record.error.message)
        : undefined;
    return nestedError ?? sanitizeProviderErrorDetail(record.message);
}
class GeminiProviderAdapter {
    constructor(settings) {
        this.settings = settings;
        this.id = "gemini";
        this.displayName = "Gemini";
    }
    validate() {
        if (!this.settings.apiKey.trim()) {
            return "Gemini API key is missing.";
        }
        if (!this.getModel()) {
            return "Gemini model is missing.";
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
        const body = buildGeminiRequest(request);
        const model = request.model.trim();
        let responseText = "";
        let payload;
        try {
            const response = await (0, obsidian_1.requestUrl)({
                url: `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": this.settings.apiKey.trim(),
                },
            });
            responseText = response.text;
            payload = response.json;
        }
        catch (error) {
            const detail = sanitizeProviderErrorDetail(error instanceof Error ? error.message : String(error));
            throw new Error(detail ? `Gemini request failed: ${detail}` : "Gemini request failed.");
        }
        const parsed = parseGeminiResponse(payload ?? {});
        if (!parsed.text) {
            const errorMessage = extractGeminiErrorMessage(payload) ?? extractGeminiErrorMessage(safeParseJson(responseText));
            throw new Error(errorMessage ? `Gemini returned no answer: ${errorMessage}` : "Gemini returned no answer.");
        }
        const envelope = (0, prompting_1.buildProviderPrompt)(request.prompt, request.retrieval);
        return {
            provider: this.id,
            model,
            text: parsed.text,
            citations: (0, utils_1.uniqueCitations)([...envelope.vaultCitations, ...parsed.citations]),
            raw: payload,
        };
    }
}
exports.GeminiProviderAdapter = GeminiProviderAdapter;
function safeParseJson(text) {
    try {
        return JSON.parse(text);
    }
    catch {
        return undefined;
    }
}
