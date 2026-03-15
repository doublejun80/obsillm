import { ButtonComponent, Modal, TextAreaComponent } from "obsidian";

interface PromptModalOptions {
  placeholder?: string;
  submitText?: string;
  cancelText?: string;
  rows?: number;
}

export class PromptModal extends Modal {
  private resolved = false;
  private textArea!: TextAreaComponent;
  private resolver?: (value: string | null) => void;

  constructor(
    app: Modal["app"],
    private readonly title: string,
    private readonly initialValue = "",
    private readonly options: PromptModalOptions = {},
  ) {
    super(app);
  }

  openAndWait(): Promise<string | null> {
    this.open();
    return new Promise((resolve) => {
      this.resolver = resolve;
    });
  }

  override onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl("h2", { text: this.title });
    this.textArea = new TextAreaComponent(contentEl);
    this.textArea
      .setPlaceholder(this.options.placeholder ?? "Ask ObsiLLM...")
      .setValue(this.initialValue)
      .inputEl.addClass("obsillm-prompt-modal");
    this.textArea.inputEl.rows = this.options.rows ?? 8;
    this.textArea.inputEl.focus();

    const actions = contentEl.createDiv({ cls: "obsillm-actions" });
    new ButtonComponent(actions)
      .setButtonText(this.options.cancelText ?? "Cancel")
      .setClass("obsillm-secondary")
      .onClick(() => this.finish(null));
    new ButtonComponent(actions)
      .setButtonText(this.options.submitText ?? "Submit")
      .setClass("obsillm-primary")
      .onClick(() => this.finish(this.textArea.getValue().trim() || null));
  }

  override onClose(): void {
    if (!this.resolved && this.resolver) {
      this.finish(null);
    }
  }

  private finish(value: string | null): void {
    if (this.resolved) {
      return;
    }
    this.resolved = true;
    this.close();
    this.resolver?.(value);
  }
}
