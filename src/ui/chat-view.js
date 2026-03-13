"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObsiLLMChatView = exports.OBSILLM_VIEW_TYPE = void 0;
const obsidian_1 = require("obsidian");
const utils_1 = require("../utils");
exports.OBSILLM_VIEW_TYPE = "obsillm-chat-view";
class ObsiLLMChatView extends obsidian_1.ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this.entries = [];
    }
    getViewType() {
        return exports.OBSILLM_VIEW_TYPE;
    }
    getDisplayText() {
        return "ObsiLLM";
    }
    getIcon() {
        return "bot";
    }
    async onOpen() {
        this.contentEl.empty();
        this.contentEl.addClass("obsillm-view");
        this.renderLayout();
        await this.renderTranscript();
    }
    setPrompt(prompt) {
        this.promptInput.value = prompt;
        this.promptInput.focus();
    }
    async runPrompt(prompt, options) {
        this.promptInput.value = prompt;
        if (options?.provider) {
            this.providerSelect.value = options.provider;
            this.modelInput.value = options.model ?? this.plugin.getModelForProvider(options.provider);
        }
        if (typeof options?.useVault === "boolean") {
            this.vaultToggle.checked = options.useVault;
        }
        if (typeof options?.useWeb === "boolean") {
            this.webToggle.checked = options.useWeb;
        }
        await this.submitPrompt(options?.insertionModeAfterResponse);
    }
    renderLayout() {
        const hero = this.contentEl.createDiv({ cls: "obsillm-hero" });
        hero.createEl("h2", { text: "ObsiLLM Workspace" });
        hero.createEl("p", {
            text: "Ask with vault context, web grounding, or both. Review the answer, then insert it into the active note or save it as a draft.",
        });
        const controls = this.contentEl.createDiv({ cls: "obsillm-controls" });
        const grid = controls.createDiv({ cls: "obsillm-grid" });
        const providerField = grid.createDiv({ cls: "obsillm-field" });
        providerField.createEl("label", { text: "Provider" });
        this.providerSelect = providerField.createEl("select");
        this.providerSelect.createEl("option", { text: "OpenAI", value: "openai" });
        this.providerSelect.createEl("option", { text: "Gemini", value: "gemini" });
        this.providerSelect.value = this.plugin.settings.defaultProvider;
        this.providerSelect.onchange = () => {
            this.modelInput.value = this.plugin.getModelForProvider(this.providerSelect.value);
        };
        const modelField = grid.createDiv({ cls: "obsillm-field" });
        modelField.createEl("label", { text: "Model" });
        this.modelInput = modelField.createEl("input", { type: "text" });
        this.modelInput.value = this.plugin.getModelForProvider(this.plugin.settings.defaultProvider);
        this.modelInput.placeholder = "Editable model ID";
        const toggles = controls.createDiv({ cls: "obsillm-toggle-row" });
        this.vaultToggle = this.createToggle(toggles, "Vault context", this.plugin.settings.defaultUseVault);
        this.webToggle = this.createToggle(toggles, "Web grounding", this.plugin.settings.defaultUseWeb);
        const composer = this.contentEl.createDiv({ cls: "obsillm-composer" });
        const promptField = composer.createDiv({ cls: "obsillm-field" });
        promptField.createEl("label", { text: "Prompt" });
        this.promptInput = promptField.createEl("textarea");
        this.promptInput.placeholder = "Ask a question, request a draft, or tell ObsiLLM what to write.";
        this.promptInput.addEventListener("keydown", (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                event.preventDefault();
                void this.submitPrompt();
            }
        });
        const actions = composer.createDiv({ cls: "obsillm-actions" });
        const submitButton = actions.createEl("button", { text: "Ask ObsiLLM", cls: "obsillm-primary" });
        submitButton.onclick = () => void this.submitPrompt();
        const clearButton = actions.createEl("button", { text: "Clear chat", cls: "obsillm-secondary" });
        clearButton.onclick = () => {
            this.entries = [];
            void this.renderTranscript();
        };
        this.statusEl = composer.createDiv({ cls: "obsillm-status" });
        this.statusEl.setText("Ready");
        this.transcriptEl = this.contentEl.createDiv({ cls: "obsillm-transcript" });
    }
    createToggle(container, label, checked) {
        const wrapper = container.createEl("label", { cls: "obsillm-toggle" });
        const input = wrapper.createEl("input", { type: "checkbox" });
        input.checked = checked;
        wrapper.createSpan({ text: label });
        return input;
    }
    async submitPrompt(insertionModeAfterResponse) {
        const prompt = this.promptInput.value.trim();
        if (!prompt) {
            new obsidian_1.Notice("Enter a prompt first.");
            return;
        }
        const provider = this.providerSelect.value;
        const model = this.modelInput.value.trim() || this.plugin.getModelForProvider(provider);
        const useVault = this.vaultToggle.checked;
        const useWeb = this.webToggle.checked;
        const entry = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            prompt,
            provider,
            model,
            useVault,
            useWeb,
            loading: true,
        };
        this.entries.push(entry);
        this.promptInput.value = "";
        this.statusEl.setText("Generating response…");
        await this.renderTranscript();
        try {
            entry.response = await this.plugin.generateResponse({
                prompt,
                provider,
                model,
                useVault,
                useWeb,
            });
            entry.loading = false;
            this.statusEl.setText(`Completed with ${provider}:${model}`);
            await this.renderTranscript();
            if (insertionModeAfterResponse && entry.response) {
                await this.plugin.applyResponse(entry.response, insertionModeAfterResponse, prompt);
                this.statusEl.setText(`Inserted response via ${insertionModeAfterResponse}.`);
            }
        }
        catch (error) {
            entry.loading = false;
            entry.error = error instanceof Error ? error.message : String(error);
            this.statusEl.setText("Request failed.");
            await this.renderTranscript();
        }
    }
    async renderTranscript() {
        this.transcriptEl.empty();
        if (this.entries.length === 0) {
            this.transcriptEl.createDiv({
                cls: "obsillm-empty",
                text: "The transcript will appear here. Try asking about the active note, generating a draft, or combining vault context with live web grounding.",
            });
            return;
        }
        for (const entry of this.entries) {
            const userMessage = this.transcriptEl.createDiv({ cls: "obsillm-message obsillm-message-user" });
            const userHeader = userMessage.createDiv({ cls: "obsillm-message-header" });
            userHeader.createSpan({ text: "User" });
            userHeader.createSpan({
                text: `${entry.provider} | ${entry.model} | ${entry.useVault ? "Vault" : "No vault"} | ${entry.useWeb ? "Web" : "No web"}`,
            });
            userMessage.createDiv({ cls: "obsillm-message-body", text: entry.prompt });
            const assistantMessage = this.transcriptEl.createDiv({
                cls: "obsillm-message obsillm-message-assistant",
            });
            const assistantHeader = assistantMessage.createDiv({ cls: "obsillm-message-header" });
            assistantHeader.createSpan({ text: "ObsiLLM" });
            assistantHeader.createSpan({ text: entry.loading ? "Working…" : entry.error ? "Error" : "Ready" });
            const body = assistantMessage.createDiv({
                cls: `obsillm-message-body${entry.error ? " obsillm-error" : ""}`,
            });
            if (entry.loading) {
                body.setText("Retrieving context and calling the provider…");
                continue;
            }
            if (entry.error) {
                body.setText(entry.error);
                continue;
            }
            if (!entry.response) {
                body.setText("No response.");
                continue;
            }
            await (0, utils_1.renderMarkdownCompat)(this.app, entry.response.text, body, "", this);
            const actions = assistantMessage.createDiv({ cls: "obsillm-card-actions" });
            this.createActionButton(actions, "Insert at cursor", async () => {
                await this.plugin.applyResponse(entry.response, "insert-cursor", entry.prompt);
            });
            this.createActionButton(actions, "Replace selection", async () => {
                await this.plugin.applyResponse(entry.response, "replace-selection", entry.prompt);
            });
            this.createActionButton(actions, "Create note", async () => {
                await this.plugin.applyResponse(entry.response, "create-note", entry.prompt);
            });
            if (entry.response.citations.length > 0) {
                const citationsEl = assistantMessage.createDiv({ cls: "obsillm-citations" });
                citationsEl.createEl("strong", { text: "Sources" });
                const list = citationsEl.createEl("ul");
                for (const citation of entry.response.citations) {
                    const item = list.createEl("li");
                    if (citation.source === "vault" && citation.filePath) {
                        const button = item.createEl("button", {
                            text: citation.title,
                            cls: "link-like",
                        });
                        button.onclick = () => void this.plugin.openCitation(citation);
                        if (citation.excerpt) {
                            item.createSpan({ text: ` - ${citation.excerpt}` });
                        }
                    }
                    else {
                        const anchor = item.createEl("a", {
                            text: citation.title,
                            href: citation.url ?? "#",
                        });
                        anchor.target = "_blank";
                        anchor.rel = "noopener noreferrer";
                    }
                }
            }
        }
    }
    createActionButton(container, label, action) {
        const button = container.createEl("button", { text: label, cls: "obsillm-secondary" });
        button.onclick = async () => {
            try {
                await action();
            }
            catch (error) {
                new obsidian_1.Notice(error instanceof Error ? error.message : String(error));
            }
        };
    }
}
exports.ObsiLLMChatView = ObsiLLMChatView;
