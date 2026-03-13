"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const obsidian_1 = require("obsidian");
const insertion_1 = require("./insertion");
const gemini_1 = require("./providers/gemini");
const openai_1 = require("./providers/openai");
const vault_index_1 = require("./retrieval/vault-index");
const settings_1 = require("./settings");
const chat_view_1 = require("./ui/chat-view");
const prompt_modal_1 = require("./ui/prompt-modal");
const utils_1 = require("./utils");
class ObsiLLMPlugin extends obsidian_1.Plugin {
    constructor() {
        super(...arguments);
        this.settings = settings_1.DEFAULT_SETTINGS;
        this.conversation = [];
    }
    async onload() {
        await this.loadSettings();
        this.vaultIndex = new vault_index_1.VaultIndex(this.app, () => this.settings);
        this.providers = {
            openai: new openai_1.OpenAIProviderAdapter(this.settings.openai),
            gemini: new gemini_1.GeminiProviderAdapter(this.settings.gemini),
        };
        this.registerView(chat_view_1.OBSILLM_VIEW_TYPE, (leaf) => new chat_view_1.ObsiLLMChatView(leaf, this));
        this.addRibbonIcon("bot", "Open ObsiLLM", () => {
            void this.activateView();
        });
        this.addSettingTab(new settings_1.ObsiLLMSettingTab(this.app, this));
        this.addCommands();
        this.registerVaultEvents();
        this.app.workspace.onLayoutReady(() => {
            void this.vaultIndex.ensureReady();
        });
    }
    async onunload() {
        this.app.workspace.detachLeavesOfType(chat_view_1.OBSILLM_VIEW_TYPE);
    }
    getModelForProvider(provider) {
        return provider === "openai" ? this.settings.openai.model : this.settings.gemini.model;
    }
    async loadSettings() {
        const loaded = (await this.loadData());
        this.settings = {
            ...settings_1.DEFAULT_SETTINGS,
            ...loaded,
            openai: {
                ...settings_1.DEFAULT_SETTINGS.openai,
                ...loaded?.openai,
            },
            gemini: {
                ...settings_1.DEFAULT_SETTINGS.gemini,
                ...loaded?.gemini,
            },
        };
    }
    async saveSettings() {
        await this.saveData(this.settings);
    }
    async activateView() {
        const existing = this.app.workspace.getLeavesOfType(chat_view_1.OBSILLM_VIEW_TYPE)[0];
        const leaf = existing ?? this.app.workspace.getRightLeaf(false);
        if (!leaf) {
            throw new Error("Unable to open a right sidebar leaf.");
        }
        await leaf.setViewState({
            type: chat_view_1.OBSILLM_VIEW_TYPE,
            active: true,
        });
        await this.app.workspace.revealLeaf(leaf);
        return leaf.view;
    }
    async generateResponse(options) {
        await this.vaultIndex.ensureReady();
        const retrieval = await this.buildRetrievalContext(options.prompt, options.useVault, options.useWeb);
        const adapter = this.providers[options.provider];
        const request = {
            provider: options.provider,
            model: options.model,
            prompt: options.prompt,
            systemPrompt: this.settings.systemPrompt,
            retrieval,
            conversation: this.conversation.slice(-8),
        };
        const response = await adapter.generate(request);
        this.conversation.push({ role: "user", content: options.prompt });
        this.conversation.push({ role: "assistant", content: response.text });
        this.conversation = this.conversation.slice(-12);
        return {
            ...response,
            citations: (0, utils_1.uniqueCitations)(response.citations),
        };
    }
    async applyResponse(response, mode, titleHint) {
        await (0, insertion_1.applyResponseToWorkspace)(this.app, this.settings, response, mode, titleHint);
    }
    async openCitation(citation) {
        if (citation.source === "vault" && citation.filePath) {
            const file = this.app.vault.getAbstractFileByPath(citation.filePath);
            if (file instanceof obsidian_1.TFile) {
                await this.app.workspace.getLeaf(true).openFile(file);
                return;
            }
            throw new Error(`Vault file not found: ${citation.filePath}`);
        }
        if (citation.url) {
            window.open(citation.url, "_blank", "noopener,noreferrer");
        }
    }
    async buildRetrievalContext(prompt, useVault, useWeb) {
        const markdownView = this.app.workspace.getActiveViewOfType(obsidian_1.MarkdownView);
        const file = markdownView?.file;
        const editor = markdownView?.editor;
        const fileText = file ? await this.app.vault.cachedRead(file) : "";
        const selection = editor?.getSelection().trim() || undefined;
        const activeNote = file
            ? {
                path: file.path,
                title: file.basename,
                excerpt: (0, utils_1.truncate)(fileText, 3500),
                selection,
            }
            : undefined;
        const querySeed = [prompt, selection, file?.basename, fileText.slice(0, 1200)].filter(Boolean).join("\n");
        const matches = useVault
            ? this.vaultIndex.search(querySeed, {
                excludePath: file?.path,
                limit: this.settings.maxVaultResults,
            })
            : [];
        return {
            useVault,
            useWeb,
            activeNote,
            vaultMatches: file
                ? [
                    {
                        id: `active:${file.path}`,
                        filePath: file.path,
                        title: file.basename,
                        excerpt: (0, utils_1.truncate)(fileText, 450),
                        headings: [],
                        tags: [],
                        aliases: [],
                        score: Number.MAX_SAFE_INTEGER,
                        lastModified: file.stat.mtime,
                    },
                    ...matches,
                ].slice(0, this.settings.maxVaultResults)
                : matches,
        };
    }
    addCommands() {
        this.addCommand({
            id: "open-obsillm-chat",
            name: "Open ObsiLLM chat",
            callback: () => void this.activateView(),
        });
        this.addCommand({
            id: "ask-about-current-note",
            name: "Ask ObsiLLM about current note",
            callback: async () => {
                const prompt = await new prompt_modal_1.PromptModal(this.app, "Ask about the current note", "", "What do you want to know about the active note?").openAndWait();
                if (!prompt) {
                    return;
                }
                const view = await this.activateView();
                await view.runPrompt(prompt, {
                    useVault: true,
                    useWeb: this.settings.defaultUseWeb,
                });
            },
        });
        this.addCommand({
            id: "draft-from-current-note",
            name: "Draft from current note with ObsiLLM",
            callback: async () => {
                const view = await this.activateView();
                await view.runPrompt("Create a polished draft from the active note. Preserve the core ideas, organize the structure clearly, and fill small gaps when the context supports it.", {
                    useVault: true,
                    useWeb: false,
                });
            },
        });
        this.addCommand({
            id: "insert-cited-answer",
            name: "Insert cited answer with ObsiLLM",
            callback: async () => {
                const prompt = await new prompt_modal_1.PromptModal(this.app, "Insert a cited answer", "", "Ask a question and ObsiLLM will insert the grounded answer into the active note.").openAndWait();
                if (!prompt) {
                    return;
                }
                const view = await this.activateView();
                await view.runPrompt(prompt, {
                    useVault: true,
                    useWeb: true,
                    insertionModeAfterResponse: "insert-cursor",
                });
            },
        });
    }
    registerVaultEvents() {
        this.registerEvent(this.app.vault.on("create", (file) => void this.vaultIndex.onFileChanged(file)));
        this.registerEvent(this.app.vault.on("modify", (file) => void this.vaultIndex.onFileChanged(file)));
        this.registerEvent(this.app.vault.on("delete", (file) => this.vaultIndex.onFileDeleted(file)));
        this.registerEvent(this.app.vault.on("rename", (file, oldPath) => void this.vaultIndex.onFileRenamed(file, oldPath)));
    }
}
exports.default = ObsiLLMPlugin;
