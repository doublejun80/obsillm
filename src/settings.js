"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObsiLLMSettingTab = exports.DEFAULT_SETTINGS = void 0;
const obsidian_1 = require("obsidian");
exports.DEFAULT_SETTINGS = {
    defaultProvider: "openai",
    openai: {
        apiKey: "",
        model: "gpt-5.2-codex",
    },
    gemini: {
        apiKey: "",
        model: "gemini-3-pro-preview",
    },
    systemPrompt: "You are ObsiLLM, an Obsidian writing assistant. Write concise, grounded Markdown. Prefer provided vault context when it is relevant, and clearly separate note-derived context from live web information.",
    defaultUseVault: true,
    defaultUseWeb: true,
    maxVaultResults: 5,
    chunkSize: 1200,
    chunkOverlap: 180,
    createNoteFolder: "ObsiLLM Drafts",
};
class ObsiLLMSettingTab extends obsidian_1.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "ObsiLLM Settings" });
        containerEl.createEl("p", {
            text: "Use exact model IDs from the provider docs when you want to override the defaults.",
        });
        new obsidian_1.Setting(containerEl)
            .setName("Default provider")
            .setDesc("Pick the provider used when the chat panel opens.")
            .addDropdown((dropdown) => dropdown
            .addOption("openai", "OpenAI")
            .addOption("gemini", "Gemini")
            .setValue(this.plugin.settings.defaultProvider)
            .onChange(async (value) => {
            this.plugin.settings.defaultProvider = value;
            await this.plugin.saveSettings();
        }));
        new obsidian_1.Setting(containerEl)
            .setName("OpenAI API key")
            .setDesc("Stored locally in Obsidian plugin settings.")
            .addText((text) => text
            .setPlaceholder("sk-...")
            .setValue(this.plugin.settings.openai.apiKey)
            .onChange(async (value) => {
            this.plugin.settings.openai.apiKey = value.trim();
            await this.plugin.saveSettings();
        }));
        new obsidian_1.Setting(containerEl)
            .setName("OpenAI model")
            .setDesc("Default: gpt-5.2-codex. The field stays editable for future model changes.")
            .addText((text) => text
            .setValue(this.plugin.settings.openai.model)
            .setPlaceholder("gpt-5.2-codex")
            .onChange(async (value) => {
            this.plugin.settings.openai.model = value.trim();
            await this.plugin.saveSettings();
        }));
        new obsidian_1.Setting(containerEl)
            .setName("Gemini API key")
            .setDesc("Stored locally in Obsidian plugin settings.")
            .addText((text) => text
            .setPlaceholder("AIza...")
            .setValue(this.plugin.settings.gemini.apiKey)
            .onChange(async (value) => {
            this.plugin.settings.gemini.apiKey = value.trim();
            await this.plugin.saveSettings();
        }));
        new obsidian_1.Setting(containerEl)
            .setName("Gemini model")
            .setDesc("Default: gemini-3-pro-preview. Stable fallback: gemini-2.5-pro.")
            .addText((text) => text
            .setValue(this.plugin.settings.gemini.model)
            .setPlaceholder("gemini-3-pro-preview")
            .onChange(async (value) => {
            this.plugin.settings.gemini.model = value.trim();
            await this.plugin.saveSettings();
        }));
        new obsidian_1.Setting(containerEl)
            .setName("System prompt")
            .setDesc("Global instruction applied to both providers.")
            .addTextArea((text) => text.setValue(this.plugin.settings.systemPrompt).onChange(async (value) => {
            this.plugin.settings.systemPrompt = value.trim();
            await this.plugin.saveSettings();
        }));
        new obsidian_1.Setting(containerEl)
            .setName("Default vault retrieval")
            .setDesc("Enable vault retrieval when the sidebar opens.")
            .addToggle((toggle) => toggle.setValue(this.plugin.settings.defaultUseVault).onChange(async (value) => {
            this.plugin.settings.defaultUseVault = value;
            await this.plugin.saveSettings();
        }));
        new obsidian_1.Setting(containerEl)
            .setName("Default web grounding")
            .setDesc("Enable web search / grounding by default.")
            .addToggle((toggle) => toggle.setValue(this.plugin.settings.defaultUseWeb).onChange(async (value) => {
            this.plugin.settings.defaultUseWeb = value;
            await this.plugin.saveSettings();
        }));
        new obsidian_1.Setting(containerEl)
            .setName("Max vault results")
            .setDesc("How many vault chunks are provided to the model.")
            .addSlider((slider) => slider
            .setLimits(1, 10, 1)
            .setValue(this.plugin.settings.maxVaultResults)
            .setDynamicTooltip()
            .onChange(async (value) => {
            this.plugin.settings.maxVaultResults = value;
            await this.plugin.saveSettings();
        }));
        new obsidian_1.Setting(containerEl)
            .setName("Chunk size")
            .setDesc("Approximate character target for each vault chunk.")
            .addSlider((slider) => slider
            .setLimits(600, 2400, 50)
            .setValue(this.plugin.settings.chunkSize)
            .setDynamicTooltip()
            .onChange(async (value) => {
            this.plugin.settings.chunkSize = value;
            await this.plugin.saveSettings();
        }));
        new obsidian_1.Setting(containerEl)
            .setName("Chunk overlap")
            .setDesc("Character overlap between adjacent chunks.")
            .addSlider((slider) => slider
            .setLimits(0, 400, 10)
            .setValue(this.plugin.settings.chunkOverlap)
            .setDynamicTooltip()
            .onChange(async (value) => {
            this.plugin.settings.chunkOverlap = value;
            await this.plugin.saveSettings();
        }));
        new obsidian_1.Setting(containerEl)
            .setName("Create-note folder")
            .setDesc("New drafts created from the chat panel are stored here.")
            .addText((text) => text
            .setPlaceholder("ObsiLLM Drafts")
            .setValue(this.plugin.settings.createNoteFolder)
            .onChange(async (value) => {
            this.plugin.settings.createNoteFolder = value.trim();
            await this.plugin.saveSettings();
        }));
    }
}
exports.ObsiLLMSettingTab = ObsiLLMSettingTab;
