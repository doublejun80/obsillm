import { MarkdownView, Notice, Plugin, TFile } from "obsidian";

import { applyResponseToWorkspace } from "./insertion";
import { GeminiProviderAdapter } from "./providers/gemini";
import { OpenAIProviderAdapter } from "./providers/openai";
import { VaultIndex } from "./retrieval/vault-index";
import { DEFAULT_SETTINGS, ObsiLLMSettingTab } from "./settings";
import { OBSILLM_VIEW_TYPE, ObsiLLMChatView } from "./ui/chat-view";
import { PromptModal } from "./ui/prompt-modal";
import { truncate, uniqueCitations } from "./utils";

import type { ChatRequest, ChatResponse, Citation, PluginSettings, ProviderAdapter, ProviderId, RetrievalContext } from "./types";

interface GenerateResponseOptions {
  prompt: string;
  provider: ProviderId;
  model: string;
  useVault: boolean;
  useWeb: boolean;
}

export default class ObsiLLMPlugin extends Plugin {
  settings: PluginSettings = DEFAULT_SETTINGS;
  private vaultIndex!: VaultIndex;
  private providers!: Record<ProviderId, ProviderAdapter>;
  private conversation: Array<{ role: "user" | "assistant"; content: string }> = [];

  override async onload(): Promise<void> {
    await this.loadSettings();
    this.vaultIndex = new VaultIndex(this.app, () => this.settings);
    this.providers = {
      openai: new OpenAIProviderAdapter(this.settings.openai),
      gemini: new GeminiProviderAdapter(this.settings.gemini),
    };

    this.registerView(OBSILLM_VIEW_TYPE, (leaf) => new ObsiLLMChatView(leaf, this));
    this.addRibbonIcon("bot", "Open ObsiLLM", () => {
      void this.activateView();
    });

    this.addSettingTab(new ObsiLLMSettingTab(this.app, this));
    this.addCommands();
    this.registerVaultEvents();

    this.app.workspace.onLayoutReady(() => {
      void this.vaultIndex.ensureReady();
    });
  }

  override async onunload(): Promise<void> {
    this.app.workspace.detachLeavesOfType(OBSILLM_VIEW_TYPE);
  }

  getModelForProvider(provider: ProviderId): string {
    return provider === "openai" ? this.settings.openai.model : this.settings.gemini.model;
  }

  async loadSettings(): Promise<void> {
    const loaded = (await this.loadData()) as Partial<PluginSettings> | null;
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...loaded,
      openai: {
        ...DEFAULT_SETTINGS.openai,
        ...loaded?.openai,
      },
      gemini: {
        ...DEFAULT_SETTINGS.gemini,
        ...loaded?.gemini,
      },
    };
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  async activateView(): Promise<ObsiLLMChatView> {
    const existing = this.app.workspace.getLeavesOfType(OBSILLM_VIEW_TYPE)[0];
    const leaf = existing ?? this.app.workspace.getRightLeaf(false);
    if (!leaf) {
      throw new Error("Unable to open a right sidebar leaf.");
    }

    await leaf.setViewState({
      type: OBSILLM_VIEW_TYPE,
      active: true,
    });
    await this.app.workspace.revealLeaf(leaf);
    return leaf.view as ObsiLLMChatView;
  }

  async generateResponse(options: GenerateResponseOptions): Promise<ChatResponse> {
    await this.vaultIndex.ensureReady();
    const retrieval = await this.buildRetrievalContext(options.prompt, options.useVault, options.useWeb);
    const adapter = this.providers[options.provider];

    const request: ChatRequest = {
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
      citations: uniqueCitations(response.citations),
    };
  }

  async applyResponse(response: ChatResponse, mode: "insert-cursor" | "replace-selection" | "create-note", titleHint: string): Promise<void> {
    await applyResponseToWorkspace(this.app, this.settings, response, mode, titleHint);
  }

  async openCitation(citation: Citation): Promise<void> {
    if (citation.source === "vault" && citation.filePath) {
      const file = this.app.vault.getAbstractFileByPath(citation.filePath);
      if (file instanceof TFile) {
        await this.app.workspace.getLeaf(true).openFile(file);
        return;
      }
      throw new Error(`Vault file not found: ${citation.filePath}`);
    }

    if (citation.url) {
      window.open(citation.url, "_blank", "noopener,noreferrer");
    }
  }

  private async buildRetrievalContext(prompt: string, useVault: boolean, useWeb: boolean): Promise<RetrievalContext> {
    const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
    const file = markdownView?.file;
    const editor = markdownView?.editor;
    const fileText = file ? await this.app.vault.cachedRead(file) : "";
    const selection = editor?.getSelection().trim() || undefined;
    const activeNote = file
      ? {
          path: file.path,
          title: file.basename,
          excerpt: truncate(fileText, 3500),
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
              excerpt: truncate(fileText, 450),
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

  private addCommands(): void {
    this.addCommand({
      id: "open-obsillm-chat",
      name: "Open ObsiLLM chat",
      callback: () => void this.activateView(),
    });

    this.addCommand({
      id: "ask-about-current-note",
      name: "Ask ObsiLLM about current note",
      callback: async () => {
        const prompt = await new PromptModal(
          this.app,
          "Ask about the current note",
          "",
          "What do you want to know about the active note?",
        ).openAndWait();
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
        await view.runPrompt(
          "Create a polished draft from the active note. Preserve the core ideas, organize the structure clearly, and fill small gaps when the context supports it.",
          {
            useVault: true,
            useWeb: false,
          },
        );
      },
    });

    this.addCommand({
      id: "insert-cited-answer",
      name: "Insert cited answer with ObsiLLM",
      callback: async () => {
        const prompt = await new PromptModal(
          this.app,
          "Insert a cited answer",
          "",
          "Ask a question and ObsiLLM will insert the grounded answer into the active note.",
        ).openAndWait();
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

  private registerVaultEvents(): void {
    this.registerEvent(this.app.vault.on("create", (file) => void this.vaultIndex.onFileChanged(file)));
    this.registerEvent(this.app.vault.on("modify", (file) => void this.vaultIndex.onFileChanged(file)));
    this.registerEvent(this.app.vault.on("delete", (file) => this.vaultIndex.onFileDeleted(file)));
    this.registerEvent(this.app.vault.on("rename", (file, oldPath) => void this.vaultIndex.onFileRenamed(file, oldPath)));
  }
}
