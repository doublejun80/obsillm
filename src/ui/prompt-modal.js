"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptModal = void 0;
const obsidian_1 = require("obsidian");
class PromptModal extends obsidian_1.Modal {
    constructor(app, title, initialValue = "", placeholder = "Ask ObsiLLM…") {
        super(app);
        this.title = title;
        this.initialValue = initialValue;
        this.placeholder = placeholder;
        this.resolved = false;
    }
    openAndWait() {
        this.open();
        return new Promise((resolve) => {
            this.resolver = resolve;
        });
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h2", { text: this.title });
        this.textArea = new obsidian_1.TextAreaComponent(contentEl);
        this.textArea
            .setPlaceholder(this.placeholder)
            .setValue(this.initialValue)
            .inputEl.addClass("obsillm-prompt-modal");
        this.textArea.inputEl.rows = 8;
        this.textArea.inputEl.focus();
        const actions = contentEl.createDiv({ cls: "obsillm-actions" });
        new obsidian_1.ButtonComponent(actions)
            .setButtonText("Cancel")
            .setClass("obsillm-secondary")
            .onClick(() => this.finish(null));
        new obsidian_1.ButtonComponent(actions)
            .setButtonText("Submit")
            .setClass("obsillm-primary")
            .onClick(() => this.finish(this.textArea.getValue().trim() || null));
    }
    onClose() {
        if (!this.resolved && this.resolver) {
            this.finish(null);
        }
    }
    finish(value) {
        if (this.resolved) {
            return;
        }
        this.resolved = true;
        this.close();
        this.resolver?.(value);
    }
}
exports.PromptModal = PromptModal;
