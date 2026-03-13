import { ButtonComponent, Modal, TextAreaComponent } from "obsidian";

export class PromptModal extends Modal {
  private resolved = false;
  private textArea!: TextAreaComponent;
  private resolver?: (value: string | null) => void;

  constructor(
    app: Modal["app"],
    private readonly title: string,
    private readonly initialValue = "",
    private readonly placeholder = "Ask ObsiLLM…",
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
      .setPlaceholder(this.placeholder)
      .setValue(this.initialValue)
      .inputEl.addClass("obsillm-prompt-modal");
    this.textArea.inputEl.rows = 8;
    this.textArea.inputEl.focus();

    const actions = contentEl.createDiv({ cls: "obsillm-actions" });
    new ButtonComponent(actions)
      .setButtonText("Cancel")
      .setClass("obsillm-secondary")
      .onClick(() => this.finish(null));
    new ButtonComponent(actions)
      .setButtonText("Submit")
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


