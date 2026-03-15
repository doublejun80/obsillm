import { App, PluginSettingTab, Setting } from "obsidian";

import { getDefaultSystemPrompt, getStrings } from "./i18n";
import { GEMINI_MODEL_OPTIONS, OPENAI_MODEL_OPTIONS } from "./model-options";

import type ObsiLLMPlugin from "./plugin";
import type { AppLanguage, PluginSettings } from "./types";

export const DEFAULT_SETTINGS: PluginSettings = {
  language: "ko",
  defaultProvider: "openai",
  openai: {
    apiKey: "",
    model: "gpt-5-mini",
  },
  gemini: {
    apiKey: "",
    model: "gemini-2.5-flash-lite",
  },
  systemPrompt: getDefaultSystemPrompt("ko"),
  defaultUseVault: true,
  defaultUseWeb: true,
  defaultIncludeSources: false,
  maxVaultResults: 5,
  chunkSize: 1200,
  chunkOverlap: 180,
  createNoteFolder: "ObsiLLM Drafts",
};

export class ObsiLLMSettingTab extends PluginSettingTab {
  constructor(app: App, private readonly plugin: ObsiLLMPlugin) {
    super(app, plugin);
  }

  display(): void {
    const strings = getStrings(this.plugin.settings.language);
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: strings.settingsTitle });
    containerEl.createEl("p", {
      text: strings.settingsDescription,
    });

    new Setting(containerEl)
      .setName(strings.language)
      .setDesc(strings.languageDescription)
      .addDropdown((dropdown) =>
        dropdown
          .addOption("en", strings.languageEn)
          .addOption("ko", strings.languageKo)
          .addOption("jp", strings.languageJp)
          .setValue(this.plugin.settings.language)
          .onChange(async (value) => {
            this.plugin.settings.language = value as AppLanguage;
            this.plugin.settings.systemPrompt = getDefaultSystemPrompt(this.plugin.settings.language);
            await this.plugin.saveSettings();
            await this.plugin.refreshChatViews();
            this.display();
          }),
      );

    new Setting(containerEl)
      .setName(strings.defaultProvider)
      .setDesc(strings.defaultProviderDescription)
      .addDropdown((dropdown) =>
        dropdown
          .addOption("openai", "OpenAI")
          .addOption("gemini", "Gemini")
          .setValue(this.plugin.settings.defaultProvider)
          .onChange(async (value) => {
            this.plugin.settings.defaultProvider = value as PluginSettings["defaultProvider"];
            await this.plugin.saveSettings();
            await this.plugin.refreshChatViews();
          }),
      );

    new Setting(containerEl)
      .setName(strings.openaiApiKey)
      .setDesc(strings.openaiApiKeyDescription)
      .addText((text) => {
        text.inputEl.type = "password";
        return text
          .setPlaceholder("sk-...")
          .setValue(this.plugin.settings.openai.apiKey)
          .onChange(async (value) => {
            this.plugin.settings.openai.apiKey = value.trim();
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName(strings.openaiModel)
      .setDesc(strings.openaiModelDescription)
      .addDropdown((dropdown) =>
        OPENAI_MODEL_OPTIONS.reduce((current, model) => current.addOption(model, model), dropdown)
          .setValue(this.plugin.settings.openai.model)
          .onChange(async (value) => {
            this.plugin.settings.openai.model = value;
            await this.plugin.saveSettings();
            await this.plugin.refreshChatViews();
          }),
      );

    new Setting(containerEl)
      .setName(strings.geminiApiKey)
      .setDesc(strings.geminiApiKeyDescription)
      .addText((text) => {
        text.inputEl.type = "password";
        return text
          .setPlaceholder("AIza...")
          .setValue(this.plugin.settings.gemini.apiKey)
          .onChange(async (value) => {
            this.plugin.settings.gemini.apiKey = value.trim();
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName(strings.geminiModel)
      .setDesc(strings.geminiModelDescription)
      .addDropdown((dropdown) =>
        GEMINI_MODEL_OPTIONS.reduce((current, model) => current.addOption(model, model), dropdown)
          .setValue(this.plugin.settings.gemini.model)
          .onChange(async (value) => {
            this.plugin.settings.gemini.model = value;
            await this.plugin.saveSettings();
            await this.plugin.refreshChatViews();
          }),
      );

    new Setting(containerEl)
      .setName(strings.systemPrompt)
      .setDesc(strings.systemPromptDescription)
      .addTextArea((text) =>
        text.setValue(this.plugin.settings.systemPrompt).onChange(async (value) => {
          this.plugin.settings.systemPrompt = value.trim();
          await this.plugin.saveSettings();
        }),
      );

    new Setting(containerEl)
      .setName(strings.defaultVaultRetrieval)
      .setDesc(strings.defaultVaultRetrievalDescription)
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.defaultUseVault).onChange(async (value) => {
          this.plugin.settings.defaultUseVault = value;
          await this.plugin.saveSettings();
          await this.plugin.refreshChatViews();
        }),
      );

    new Setting(containerEl)
      .setName(strings.defaultWebGrounding)
      .setDesc(strings.defaultWebGroundingDescription)
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.defaultUseWeb).onChange(async (value) => {
          this.plugin.settings.defaultUseWeb = value;
          await this.plugin.saveSettings();
          await this.plugin.refreshChatViews();
        }),
      );

    new Setting(containerEl)
      .setName(strings.defaultIncludeSources)
      .setDesc(strings.defaultIncludeSourcesDescription)
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.defaultIncludeSources).onChange(async (value) => {
          this.plugin.settings.defaultIncludeSources = value;
          await this.plugin.saveSettings();
          await this.plugin.refreshChatViews();
        }),
      );

    new Setting(containerEl)
      .setName(strings.maxVaultResults)
      .setDesc(strings.maxVaultResultsDescription)
      .addSlider((slider) =>
        slider
          .setLimits(1, 10, 1)
          .setValue(this.plugin.settings.maxVaultResults)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.maxVaultResults = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName(strings.chunkSize)
      .setDesc(strings.chunkSizeDescription)
      .addSlider((slider) =>
        slider
          .setLimits(600, 2400, 50)
          .setValue(this.plugin.settings.chunkSize)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.chunkSize = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName(strings.chunkOverlap)
      .setDesc(strings.chunkOverlapDescription)
      .addSlider((slider) =>
        slider
          .setLimits(0, 400, 10)
          .setValue(this.plugin.settings.chunkOverlap)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.chunkOverlap = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName(strings.createNoteFolder)
      .setDesc(strings.createNoteFolderDescription)
      .addText((text) =>
        text
          .setPlaceholder("ObsiLLM Drafts")
          .setValue(this.plugin.settings.createNoteFolder)
          .onChange(async (value) => {
            this.plugin.settings.createNoteFolder = value.trim();
            await this.plugin.saveSettings();
          }),
      );
  }
}
