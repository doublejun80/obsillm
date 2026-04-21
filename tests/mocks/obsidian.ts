export class Component {}

export class TAbstractFile {
  path = "";
  name = "";
  parent: { path: string; name: string } | null = null;
}

export class TFile extends TAbstractFile {
  basename = "";
  extension = "md";
}

export class MarkdownView {
  file: TFile | null = null;
  editor?: {
    getSelection(): string;
    replaceSelection(value: string): void;
    replaceRange(value: string, position: unknown): void;
    getCursor(): unknown;
  };
}

export class WorkspaceLeaf {
  view: unknown;

  constructor(view: unknown = null) {
    this.view = view;
  }

  async setViewState(): Promise<void> {}
}

export class ItemView extends Component {
  contentEl: HTMLElement;

  constructor(public leaf: WorkspaceLeaf) {
    super();
    this.contentEl =
      typeof document !== "undefined"
        ? document.createElement("div")
        : ({ empty() {}, addClass() {} } as unknown as HTMLElement);
  }
}

export class Plugin {
  app: App;

  constructor(app = new App(), public manifest: unknown = {}) {
    this.app = app;
  }

  async loadData(): Promise<unknown> {
    return null;
  }

  async saveData(): Promise<void> {}

  registerView(): void {}

  addRibbonIcon(): void {}

  addSettingTab(): void {}

  addCommand(): void {}

  registerEvent(): void {}
}

export class PluginSettingTab {
  containerEl: HTMLElement;

  constructor(public app: App, public plugin: Plugin) {
    this.containerEl =
      typeof document !== "undefined"
        ? document.createElement("div")
        : ({ empty() {}, createEl() {} } as unknown as HTMLElement);
  }
}

export class Setting {
  constructor(public containerEl: HTMLElement) {}

  setName(): this {
    return this;
  }

  setDesc(): this {
    return this;
  }

  addDropdown(callback: (dropdown: DropdownComponent) => unknown): this {
    callback(new DropdownComponent());
    return this;
  }

  addText(callback: (text: TextComponent) => unknown): this {
    callback(new TextComponent());
    return this;
  }

  addTextArea(callback: (text: TextAreaComponent) => unknown): this {
    callback(new TextAreaComponent());
    return this;
  }

  addToggle(callback: (toggle: ToggleComponent) => unknown): this {
    callback(new ToggleComponent());
    return this;
  }

  addSlider(callback: (slider: SliderComponent) => unknown): this {
    callback(new SliderComponent());
    return this;
  }
}

class DropdownComponent {
  addOption(): this {
    return this;
  }

  setValue(): this {
    return this;
  }

  onChange(): this {
    return this;
  }
}

class TextComponent {
  inputEl = { type: "text" };

  setPlaceholder(): this {
    return this;
  }

  setValue(): this {
    return this;
  }

  onChange(): this {
    return this;
  }
}

class TextAreaComponent extends TextComponent {}

class ToggleComponent {
  setValue(): this {
    return this;
  }

  onChange(): this {
    return this;
  }
}

class SliderComponent {
  setLimits(): this {
    return this;
  }

  setValue(): this {
    return this;
  }

  setDynamicTooltip(): this {
    return this;
  }

  onChange(): this {
    return this;
  }
}

export class App {
  vault = {
    getAbstractFileByPath: () => null,
    getMarkdownFiles: () => [],
  };

  workspace = {
    getActiveViewOfType: () => null,
    getLeavesOfType: () => [],
    getRightLeaf: () => null,
    revealLeaf: async () => undefined,
    detachLeavesOfType: () => undefined,
    onLayoutReady: (callback: () => void) => callback(),
    on: () => undefined,
  };

  fileManager = {
    renameFile: async () => undefined,
  };
}

export class Notice {
  constructor(public message: string) {}
}

export const MarkdownRenderer = {
  render: async (_app: App, markdown: string, container: HTMLElement) => {
    if (container) {
      container.textContent = markdown;
    }
  },
};

export async function requestUrl(): Promise<never> {
  throw new Error("requestUrl mock not implemented");
}

export function normalizePath(value: string): string {
  return value.replace(/\\/g, "/").replace(/\/+/g, "/").replace(/^\.\//, "").replace(/\/$/, "");
}
