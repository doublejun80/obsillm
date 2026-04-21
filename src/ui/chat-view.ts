import { ItemView, Notice, TFile, WorkspaceLeaf } from "obsidian";

import { buildInsertionMarkdown, stripPromptEcho } from "../insertion";
import { getModelOptions } from "../model-options";
import { copyTextToClipboard, renderMarkdownCompat } from "../utils";

import type ObsiLLMPlugin from "../plugin";
import type { ChatResponse, InsertionMode, ProviderId } from "../types";

export const OBSILLM_VIEW_TYPE = "obsillm-chat-view";

interface ChatEntry {
  id: string;
  prompt: string;
  provider: ProviderId;
  model: string;
  targetFilePath?: string;
  useVault: boolean;
  useWeb: boolean;
  loading: boolean;
  response?: ChatResponse;
  error?: string;
}

export class ObsiLLMChatView extends ItemView {
  private providerButtons: Partial<Record<ProviderId, HTMLButtonElement>> = {};
  private selectedProvider!: ProviderId;
  private modelSelect!: HTMLSelectElement;
  private vaultToggle!: HTMLInputElement;
  private webToggle!: HTMLInputElement;
  private includeSourcesToggle!: HTMLInputElement;
  private promptInput!: HTMLTextAreaElement;
  private statusEl!: HTMLDivElement;
  private transcriptEl!: HTMLDivElement;
  private entries: ChatEntry[] = [];

  constructor(leaf: WorkspaceLeaf, private readonly plugin: ObsiLLMPlugin) {
    super(leaf);
  }

  getViewType(): string {
    return OBSILLM_VIEW_TYPE;
  }

  getDisplayText(): string {
    return "ObsiLLM";
  }

  override getIcon(): string {
    return "bot";
  }

  override async onOpen(): Promise<void> {
    await this.refresh();
  }

  async refresh(): Promise<void> {
    const previousState = {
      provider: this.selectedProvider ?? this.plugin.settings.defaultProvider,
      model: this.modelSelect?.value,
      useVault: this.vaultToggle?.checked,
      useWeb: this.webToggle?.checked,
      includeSources: this.includeSourcesToggle?.checked,
      prompt: this.promptInput?.value,
    };

    this.contentEl.empty();
    this.contentEl.addClass("obsillm-view");
    this.renderLayout();
    this.setProvider(previousState.provider, previousState.model);
    if (typeof previousState.useVault === "boolean") {
      this.vaultToggle.checked = previousState.useVault;
    }
    if (typeof previousState.useWeb === "boolean") {
      this.webToggle.checked = previousState.useWeb;
    }
    if (typeof previousState.includeSources === "boolean") {
      this.includeSourcesToggle.checked = previousState.includeSources;
    }
    if (typeof previousState.prompt === "string") {
      this.promptInput.value = previousState.prompt;
    }
    await this.renderTranscript();
  }

  setPrompt(prompt: string): void {
    this.promptInput.value = prompt;
    this.promptInput.focus();
  }

  async runPrompt(
    prompt: string,
    options?: {
      useVault?: boolean;
      useWeb?: boolean;
      includeSources?: boolean;
      insertionModeAfterResponse?: InsertionMode;
      provider?: ProviderId;
      model?: string;
    },
  ): Promise<void> {
    this.promptInput.value = prompt;
    if (options?.provider) {
      this.setProvider(options.provider, options.model);
    }
    if (typeof options?.useVault === "boolean") {
      this.vaultToggle.checked = options.useVault;
    }
    if (typeof options?.useWeb === "boolean") {
      this.webToggle.checked = options.useWeb;
    }
    if (typeof options?.includeSources === "boolean") {
      this.includeSourcesToggle.checked = options.includeSources;
    }
    await this.submitPrompt({
      insertionModeAfterResponse: options?.insertionModeAfterResponse,
      includeSources: options?.includeSources,
    });
  }

  private renderLayout(): void {
    const strings = this.plugin.getStrings();
    const hero = this.contentEl.createDiv({ cls: "obsillm-hero" });
    hero.createEl("h2", { text: strings.workspaceTitle });
    hero.createEl("p", {
      text: strings.workspaceDescription,
    });

    const controls = this.contentEl.createDiv({ cls: "obsillm-controls" });
    const grid = controls.createDiv({ cls: "obsillm-grid" });

    const providerField = grid.createDiv({ cls: "obsillm-field" });
    providerField.createEl("label", { text: strings.provider });
    const providerSwitch = providerField.createDiv({ cls: "obsillm-provider-switch" });
    this.providerButtons.openai = providerSwitch.createEl("button", {
      text: "OpenAI",
      cls: "obsillm-provider-button",
    });
    this.providerButtons.gemini = providerSwitch.createEl("button", {
      text: "Gemini",
      cls: "obsillm-provider-button",
    });
    this.providerButtons.openai.onclick = () => this.setProvider("openai");
    this.providerButtons.gemini.onclick = () => this.setProvider("gemini");

    const modelField = grid.createDiv({ cls: "obsillm-field obsillm-field-full obsillm-model-field" });
    modelField.createEl("label", { text: strings.model });
    this.modelSelect = modelField.createEl("select");

    const toggles = controls.createDiv({ cls: "obsillm-toggle-row" });
    this.vaultToggle = this.createToggle(toggles, strings.vaultContext, this.plugin.settings.defaultUseVault);
    this.webToggle = this.createToggle(toggles, strings.webGrounding, this.plugin.settings.defaultUseWeb);
    this.includeSourcesToggle = this.createToggle(
      toggles,
      strings.includeSources,
      this.plugin.settings.defaultIncludeSources,
    );

    const composer = this.contentEl.createDiv({ cls: "obsillm-composer" });
    const promptField = composer.createDiv({ cls: "obsillm-field" });
    promptField.createEl("label", { text: strings.prompt });
    this.promptInput = promptField.createEl("textarea");
    this.promptInput.placeholder = strings.promptPlaceholder;
    this.promptInput.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        void this.submitPrompt();
      }
    });

    const actions = composer.createDiv({ cls: "obsillm-actions" });
    const submitButton = actions.createEl("button", { text: strings.askButton, cls: "obsillm-primary" });
    submitButton.onclick = () => void this.submitPrompt();

    const clearButton = actions.createEl("button", { text: strings.clearChat, cls: "obsillm-secondary" });
    clearButton.onclick = () => {
      this.entries = [];
      this.plugin.clearConversation();
      this.statusEl.setText(strings.chatCleared);
      void this.renderTranscript();
    };

    const automationActions = composer.createDiv({ cls: "obsillm-actions" });
    const autoDraftCurrentButton = automationActions.createEl("button", {
      text: strings.autoDraftCurrentNote,
      cls: "obsillm-secondary",
    });
    autoDraftCurrentButton.onclick = () => void this.autoDraftCurrentNote();

    const autoDraftChildrenButton = automationActions.createEl("button", {
      text: strings.autoDraftChildNotes,
      cls: "obsillm-secondary",
    });
    autoDraftChildrenButton.onclick = () => void this.autoDraftChildNotes();

    this.statusEl = composer.createDiv({ cls: "obsillm-status" });
    this.statusEl.setText(strings.ready);

    this.transcriptEl = this.contentEl.createDiv({ cls: "obsillm-transcript" });
    this.setProvider(this.plugin.settings.defaultProvider);
  }

  private setProvider(provider: ProviderId, preferredModel?: string): void {
    this.selectedProvider = provider;
    for (const [providerId, button] of Object.entries(this.providerButtons) as Array<[ProviderId, HTMLButtonElement | undefined]>) {
      button?.classList.toggle("is-active", providerId === provider);
    }
    this.populateModelOptions(provider, preferredModel ?? this.plugin.getModelForProvider(provider));
  }

  private createToggle(container: HTMLElement, label: string, checked: boolean): HTMLInputElement {
    const wrapper = container.createEl("label", { cls: "obsillm-toggle" });
    const input = wrapper.createEl("input", { type: "checkbox" });
    input.checked = checked;
    wrapper.createSpan({ text: label });
    return input;
  }

  private populateModelOptions(provider: ProviderId, preferredModel: string): void {
    const options = getModelOptions(provider);
    this.modelSelect.empty();
    if (options.length === 0) {
      this.modelSelect.disabled = true;
      return;
    }

    this.modelSelect.disabled = false;
    for (const model of options) {
      this.modelSelect.createEl("option", {
        value: model,
        text: model,
      });
    }
    this.modelSelect.value = options.includes(preferredModel) ? preferredModel : options[0];
  }

  private getActionSuccessText(mode: InsertionMode): string {
    const strings = this.plugin.getStrings();
    if (mode === "replace-selection") {
      return strings.replacedSelection;
    }
    if (mode === "create-note-current-folder") {
      return strings.savedToCurrentFolder;
    }
    if (mode === "create-note") {
      return strings.savedToFolder;
    }
    return strings.insertedToFile;
  }

  private getGenerationOptions() {
    const provider = this.selectedProvider;
    return {
      provider,
      model: this.modelSelect.value || this.plugin.getModelForProvider(provider),
      useVault: this.vaultToggle.checked,
      useWeb: this.webToggle.checked,
    };
  }

  private async autoDraftCurrentNote(): Promise<void> {
    const strings = this.plugin.getStrings();
    this.statusEl.setText(strings.autoDraftingCurrentNote);
    try {
      await this.plugin.autoDraftCurrentNote(this.getGenerationOptions());
      this.statusEl.setText(strings.currentNoteAutoDrafted);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.statusEl.setText(message);
      new Notice(message);
    }
  }

  private async autoDraftChildNotes(): Promise<void> {
    const strings = this.plugin.getStrings();
    this.statusEl.setText(strings.autoDraftingChildNotes);
    try {
      const count = await this.plugin.autoDraftChildNotes(this.getGenerationOptions(), (current, total, title) => {
        this.statusEl.setText(`${strings.autoDraftProgress} ${current}/${total} · ${title}`);
      });
      this.statusEl.setText(`${strings.childNotesAutoDrafted} ${count}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.statusEl.setText(message);
      new Notice(message);
    }
  }

  private async submitPrompt(options?: {
    insertionModeAfterResponse?: InsertionMode;
    includeSources?: boolean;
  }): Promise<void> {
    const strings = this.plugin.getStrings();
    const prompt = this.promptInput.value.trim();
    if (!prompt) {
      new Notice(strings.enterPromptFirst);
      return;
    }

    const provider = this.selectedProvider;
    const model = this.modelSelect.value || this.plugin.getModelForProvider(provider);
    const useVault = this.vaultToggle.checked;
    const useWeb = this.webToggle.checked;
    const targetFile = this.plugin.getResolvedMarkdownFile();

    const entry: ChatEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      prompt,
      provider,
      model,
      targetFilePath: targetFile?.path,
      useVault,
      useWeb,
      loading: true,
    };
    this.entries.push(entry);
    this.promptInput.value = "";
    this.statusEl.setText(strings.generatingResponse);
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
      this.statusEl.setText(`${strings.completedWith} ${provider}:${model}`);
      await this.renderTranscript();

      if (options?.insertionModeAfterResponse && entry.response) {
        await this.plugin.applyResponse(
          entry.response,
          options.insertionModeAfterResponse,
          prompt,
          this.shouldIncludeSources(options.includeSources),
          targetFile,
        );
        this.statusEl.setText(this.getActionSuccessText(options.insertionModeAfterResponse));
      }
    } catch (error) {
      entry.loading = false;
      entry.error = error instanceof Error ? error.message : String(error);
      this.statusEl.setText(strings.requestFailed);
      await this.renderTranscript();
    }
  }

  private async renderTranscript(): Promise<void> {
    const strings = this.plugin.getStrings();
    this.transcriptEl.empty();

    if (this.entries.length === 0) {
      this.transcriptEl.createDiv({
        cls: "obsillm-empty",
        text: strings.transcriptEmpty,
      });
      return;
    }

    for (const entry of this.entries) {
      const userMessage = this.transcriptEl.createDiv({ cls: "obsillm-message obsillm-message-user" });
      const userHeader = userMessage.createDiv({ cls: "obsillm-message-header" });
      userHeader.createSpan({ text: strings.user });
      userHeader.createSpan({
        text: `${entry.provider} | ${entry.model} | ${entry.useVault ? strings.vaultOn : strings.vaultOff} | ${entry.useWeb ? strings.webOn : strings.webOff}`,
      });
      userMessage.createDiv({ cls: "obsillm-message-body", text: entry.prompt });

      const assistantMessage = this.transcriptEl.createDiv({
        cls: "obsillm-message obsillm-message-assistant",
      });
      const assistantHeader = assistantMessage.createDiv({ cls: "obsillm-message-header" });
      assistantHeader.createSpan({ text: strings.assistant });
      assistantHeader.createSpan({ text: entry.loading ? strings.working : entry.error ? strings.error : strings.ready });

      const body = assistantMessage.createDiv({
        cls: `obsillm-message-body${entry.error ? " obsillm-error" : ""}`,
      });

      if (entry.loading) {
        body.setText(strings.retrievingContext);
        continue;
      }

      if (entry.error) {
        body.setText(entry.error);
        continue;
      }

      if (!entry.response) {
        body.setText(strings.noResponse);
        continue;
      }

      const renderedText = stripPromptEcho(entry.response.text, entry.prompt);
      await renderMarkdownCompat(this.app, renderedText, body, "", this);

      const actions = assistantMessage.createDiv({ cls: "obsillm-card-actions" });
      const resolveTargetFile = (): TFile | null =>
        this.plugin.getMarkdownFileByPath(entry.targetFilePath) ?? this.plugin.getResolvedMarkdownFile();
      this.createActionButton(actions, strings.copyAnswer, async () => {
        try {
          await copyTextToClipboard(
            buildInsertionMarkdown(
              entry.response as ChatResponse,
              this.plugin.settings.language,
              this.shouldIncludeSources(),
              entry.prompt,
            ),
          );
          this.statusEl.setText(strings.copied);
        } catch (error) {
          const detail = error instanceof Error ? `: ${error.message}` : "";
          throw new Error(`${strings.clipboardError}${detail}`);
        }
      });
      this.createActionButton(actions, strings.moveToFile, async () => {
        await this.plugin.applyResponse(
          entry.response as ChatResponse,
          "insert-cursor",
          entry.prompt,
          this.shouldIncludeSources(),
          resolveTargetFile(),
        );
        this.statusEl.setText(strings.insertedToFile);
      });
      this.createActionButton(actions, strings.replaceSelection, async () => {
        await this.plugin.applyResponse(
          entry.response as ChatResponse,
          "replace-selection",
          entry.prompt,
          this.shouldIncludeSources(),
          resolveTargetFile(),
        );
        this.statusEl.setText(strings.replacedSelection);
      });
      this.createActionButton(actions, strings.saveToFolder, async () => {
        const createdFile = await this.plugin.applyResponse(
          entry.response as ChatResponse,
          "create-note",
          entry.prompt,
          this.shouldIncludeSources(),
          resolveTargetFile(),
        );
        entry.targetFilePath = createdFile?.path ?? entry.targetFilePath;
        this.statusEl.setText(strings.savedToFolder);
      });
      this.createActionButton(actions, strings.saveToCurrentFolder, async () => {
        const createdFile = await this.plugin.applyResponse(
          entry.response as ChatResponse,
          "create-note-current-folder",
          entry.prompt,
          this.shouldIncludeSources(),
          resolveTargetFile(),
        );
        entry.targetFilePath = createdFile?.path ?? entry.targetFilePath;
        this.statusEl.setText(strings.savedToCurrentFolder);
      });
      this.createActionButton(actions, strings.createOutlineNotes, async () => {
        const count = await this.plugin.createOutlineNotes(
          entry.response as ChatResponse,
          entry.prompt,
          resolveTargetFile(),
        );
        this.statusEl.setText(`${strings.outlineNotesCreated} ${count}`);
      });

      if (entry.response.citations.length > 0) {
        const citationsEl = assistantMessage.createDiv({ cls: "obsillm-citations" });
        citationsEl.createEl("strong", { text: strings.sources });
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
          } else {
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

  private createActionButton(container: HTMLElement, label: string, action: () => Promise<void>): void {
    const button = container.createEl("button", { text: label, cls: "obsillm-secondary" });
    button.onclick = async () => {
      try {
        await action();
      } catch (error) {
        new Notice(error instanceof Error ? error.message : String(error));
      }
    };
  }

  private shouldIncludeSources(override?: boolean): boolean {
    return typeof override === "boolean" ? override : this.includeSourcesToggle.checked;
  }
}
