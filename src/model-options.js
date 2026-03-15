"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GEMINI_MODEL_OPTIONS = exports.OPENAI_MODEL_OPTIONS = void 0;
exports.getModelOptions = getModelOptions;
exports.getDefaultModel = getDefaultModel;
exports.isSupportedModel = isSupportedModel;
exports.OPENAI_MODEL_OPTIONS = ["gpt-5-mini", "gpt-5-nano"];
exports.GEMINI_MODEL_OPTIONS = ["gemini-2.5-flash-lite", "gemini-3.1-flash-lite-preview"];
function getModelOptions(provider) {
    return provider === "openai" ? [...exports.OPENAI_MODEL_OPTIONS] : [...exports.GEMINI_MODEL_OPTIONS];
}
function getDefaultModel(provider) {
    return getModelOptions(provider)[0];
}
function isSupportedModel(provider, model) {
    if (!model?.trim()) {
        return false;
    }
    return getModelOptions(provider).includes(model.trim());
}
