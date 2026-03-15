"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const obsidian_1 = require("obsidian");
const i18n_1 = require("./i18n");
const insertion_1 = require("./insertion");
const model_options_1 = require("./model-options");
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
        this.lastMarkdownFilePath = null;
    }
    async onload() {
        await this.loadSettings();
        this.vaultIndex = new vault_index_1.VaultIndex(this.app, () => this.settings);
        this.providers = {
            openai: new openai_1.OpenAIProviderAdapter(this.settings.openai),
            gemini: new gemini_1.GeminiProviderAdapter(this.settings.gemini),
        };
        const strings = this.getStrings();
        this.registerView(chat_view_1.OBSILLM_VIEW_TYPE, (leaf) => new chat_view_1.ObsiLLMChatView(leaf, this));
        this.addRibbonIcon("bot", strings.ribbonOpen, () => {
            void this.activateView();
        });
        this.addSettingTab(new settings_1.ObsiLLMSettingTab(this.app, this));
        this.addCommands();
        this.registerVaultEvents();
        this.registerWorkspaceTracking();
        this.app.workspace.onLayoutReady(() => {
            this.rememberMarkdownFile(this.getActiveMarkdownFile());
            void this.vaultIndex.ensureReady();
        });
    }
    async onunload() {
        this.app.workspace.detachLeavesOfType(chat_view_1.OBSILLM_VIEW_TYPE);
    }
    getStrings() {
        return (0, i18n_1.getStrings)(this.settings.language);
    }
    async refreshChatViews() {
        const leaves = this.app.workspace.getLeavesOfType(chat_view_1.OBSILLM_VIEW_TYPE);
        for (const leaf of leaves) {
            const view = leaf.view;
            if (view instanceof chat_view_1.ObsiLLMChatView) {
                await view.refresh();
            }
        }
    }
    getModelForProvider(provider) {
        return provider === "openai" ? this.settings.openai.model : this.settings.gemini.model;
    }
    async loadSettings() {
        const loaded = (await this.loadData());
        const language = loaded?.language ?? settings_1.DEFAULT_SETTINGS.language;
        const openaiModel = loaded?.openai?.model?.trim();
        const geminiModel = loaded?.gemini?.model?.trim();
        const systemPrompt = loaded?.systemPrompt && !(0, i18n_1.isDefaultSystemPrompt)(loaded.systemPrompt)
            ? loaded.systemPrompt.trim()
            : (0, i18n_1.getDefaultSystemPrompt)(language);
        this.settings = {
            ...settings_1.DEFAULT_SETTINGS,
            ...loaded,
            language,
            systemPrompt,
            openai: {
                ...settings_1.DEFAULT_SETTINGS.openai,
                ...loaded?.openai,
                model: (0, model_options_1.isSupportedModel)("openai", openaiModel) ? openaiModel : (0, model_options_1.getDefaultModel)("openai"),
            },
            gemini: {
                ...settings_1.DEFAULT_SETTINGS.gemini,
                ...loaded?.gemini,
                model: geminiModel === "gemini-3-pro-preview"
                    ? settings_1.DEFAULT_SETTINGS.gemini.model
                    : (0, model_options_1.isSupportedModel)("gemini", geminiModel)
                        ? geminiModel
                        : (0, model_options_1.getDefaultModel)("gemini"),
            },
        };
    }
    async saveSettings() {
        await this.saveData(this.settings);
    }
    clearConversation() {
        this.conversation = [];
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
        const rememberConversation = options.rememberConversation !== false;
        const request = {
            provider: options.provider,
            model: options.model,
            prompt: options.prompt,
            systemPrompt: this.settings.systemPrompt,
            retrieval,
            conversation: rememberConversation ? this.conversation.slice(-8) : [],
        };
        const response = await adapter.generate(request);
        const sanitizedText = (0, insertion_1.stripPromptEcho)(response.text, options.prompt);
        if (rememberConversation) {
            this.conversation.push({ role: "user", content: options.prompt });
            this.conversation.push({ role: "assistant", content: sanitizedText });
            this.conversation = this.conversation.slice(-12);
        }
        return {
            ...response,
            text: sanitizedText,
            citations: (0, utils_1.uniqueCitations)(response.citations),
        };
    }
    async applyResponse(response, mode, titleHint, includeSources = false, targetFile) {
        return (0, insertion_1.applyResponseToWorkspace)(this.app, this.settings, response, mode, titleHint, includeSources, targetFile ?? this.getActiveMarkdownFile());
    }
    async createOutlineNotes(response, prompt, targetFile) {
        return (0, insertion_1.createOutlineNotesFromResponse)(this.app, this.settings, response, prompt, targetFile ?? this.getActiveMarkdownFile());
    }
    getResolvedMarkdownFile() {
        return this.getActiveMarkdownFile();
    }
    getMarkdownFileByPath(path) {
        if (!path) {
            return null;
        }
        const file = this.app.vault.getAbstractFileByPath(path);
        return file instanceof obsidian_1.TFile && file.extension === "md" ? file : null;
    }
    async autoDraftCurrentNote(options) {
        const strings = this.getStrings();
        const file = this.getActiveMarkdownFile();
        if (!file) {
            throw new Error(strings.noActiveFileForAutoDraft);
        }
        const context = await this.buildAutoDraftContext(file);
        if (isParentOutlineNote(file, context.noteContent)) {
            throw new Error(strings.autoDraftNeedsChildNote);
        }
        await this.generateAndApplyAutoDraft(context, options);
        return context.title;
    }
    async autoDraftChildNotes(options, onProgress) {
        const strings = this.getStrings();
        const files = await this.getAutoDraftChildFiles();
        if (files.length === 0) {
            throw new Error(strings.noChildNotesForAutoDraft);
        }
        let completed = 0;
        for (const file of files) {
            onProgress?.(completed + 1, files.length, stripFileNumberPrefix(file.basename));
            const context = await this.buildAutoDraftContext(file);
            await this.generateAndApplyAutoDraft(context, options);
            completed += 1;
        }
        return completed;
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
        const safeUrl = (0, utils_1.getSafeExternalUrl)(citation.url);
        if (safeUrl) {
            window.open(safeUrl, "_blank", "noopener,noreferrer");
            return;
        }
        throw new Error("Unsupported citation URL.");
    }
    getActiveMarkdownFile() {
        const activeMarkdownView = this.app.workspace.getActiveViewOfType(obsidian_1.MarkdownView);
        if (activeMarkdownView?.file) {
            this.rememberMarkdownFile(activeMarkdownView.file);
            return activeMarkdownView.file;
        }
        if (this.lastMarkdownFilePath) {
            const rememberedFile = this.app.vault.getAbstractFileByPath(this.lastMarkdownFilePath);
            if (rememberedFile instanceof obsidian_1.TFile) {
                return rememberedFile;
            }
        }
        const markdownView = this.app.workspace
            .getLeavesOfType("markdown")
            .map((leaf) => leaf.view)
            .find((view) => view instanceof obsidian_1.MarkdownView);
        const file = markdownView?.file ?? null;
        this.rememberMarkdownFile(file);
        return file;
    }
    async buildRetrievalContext(prompt, useVault, useWeb) {
        const preferredFile = this.getActiveMarkdownFile();
        const activeMarkdownView = this.app.workspace.getActiveViewOfType(obsidian_1.MarkdownView);
        const markdownView = (activeMarkdownView?.file?.path === preferredFile?.path ? activeMarkdownView : null) ??
            this.app.workspace
                .getLeavesOfType("markdown")
                .map((leaf) => leaf.view)
                .find((view) => view instanceof obsidian_1.MarkdownView && view.file?.path === preferredFile?.path) ??
            activeMarkdownView ??
            this.app.workspace
                .getLeavesOfType("markdown")
                .map((leaf) => leaf.view)
                .find((view) => view instanceof obsidian_1.MarkdownView);
        const file = preferredFile ?? markdownView?.file;
        const editor = markdownView?.editor;
        const fileText = file ? await this.app.vault.cachedRead(file) : "";
        const selection = editor?.getSelection().trim() || undefined;
        const explicitNoteContext = useVault && shouldUseExplicitNoteContext(prompt, selection);
        const activeNote = explicitNoteContext && file
            ? {
                path: file.path,
                title: file.basename,
                excerpt: (0, utils_1.truncate)(fileText, 3500),
                selection,
            }
            : undefined;
        const querySeed = [prompt, selection].filter(Boolean).join("\n").trim();
        const rawMatches = useVault && querySeed
            ? this.vaultIndex.search(querySeed, {
                excludePath: explicitNoteContext ? file?.path : undefined,
                limit: this.settings.maxVaultResults * 3,
            })
            : [];
        const matches = useVault ? filterRelevantVaultMatches(prompt, rawMatches, explicitNoteContext) : [];
        return {
            useVault,
            useWeb,
            activeNote,
            vaultMatches: matches.slice(0, this.settings.maxVaultResults),
        };
    }
    async generateAndApplyAutoDraft(context, options) {
        const prompt = buildAutoDraftPrompt(this.settings.language, context);
        const response = await this.generateResponse({
            ...options,
            prompt,
            rememberConversation: false,
        });
        const parsed = parseAutoDraftResponse(response.text, context);
        const nextContent = applyAutoDraftToContent(context.noteContent, parsed, context);
        await this.app.vault.modify(context.file, nextContent);
    }
    async buildAutoDraftContext(file) {
        const noteContent = await this.app.vault.cachedRead(file);
        const detailHeading = detectSectionHeading(noteContent, DETAIL_SECTION_CANDIDATES) ?? DETAIL_SECTION_CANDIDATES.ko;
        const draftHeading = detectSectionHeading(noteContent, DRAFT_SECTION_CANDIDATES) ?? DRAFT_SECTION_CANDIDATES.ko;
        const detailItems = extractListItems(extractSectionBody(noteContent, detailHeading));
        const meaningfulDetailItems = detailItems.filter((item) => !isPlaceholderDetailItem(item));
        const parentPath = extractParentNotePath(noteContent);
        const parentTitle = extractParentNoteTitle(noteContent) ?? inferParentTitleFromFolder(file);
        const parentContent = parentTitle ? await this.readParentNoteContent(file, parentTitle, parentPath) : "";
        const parentOutline = parentContent ? extractParentOutline(parentContent) : "";
        const siblingTitles = await this.collectSiblingTitles(file, parentTitle);
        return {
            file,
            title: stripFileNumberPrefix(file.basename),
            folderName: file.parent?.name ?? "",
            noteContent,
            detailHeading,
            draftHeading,
            detailItems: meaningfulDetailItems,
            hasPlaceholderDetails: meaningfulDetailItems.length === 0,
            parentTitle,
            parentOutline,
            siblingTitles,
        };
    }
    async readParentNoteContent(file, parentTitle, parentPath) {
        if (parentPath) {
            const parentFile = this.app.vault.getAbstractFileByPath(parentPath);
            if (parentFile instanceof obsidian_1.TFile) {
                return this.app.vault.cachedRead(parentFile);
            }
        }
        const localParent = file.parent?.children.find((child) => (0, utils_1.maybeFile)(child) && child.basename === parentTitle);
        if (localParent) {
            return this.app.vault.cachedRead(localParent);
        }
        return "";
    }
    async collectSiblingTitles(file, parentTitle) {
        const siblings = file.parent?.children.filter((child) => (0, utils_1.maybeFile)(child) && child.extension === "md") ?? [];
        const titles = siblings
            .filter((candidate) => candidate.path !== file.path)
            .map((candidate) => stripFileNumberPrefix(candidate.basename))
            .filter((title) => title && title !== parentTitle);
        return Array.from(new Set(titles)).slice(0, 12);
    }
    async getAutoDraftChildFiles() {
        const strings = this.getStrings();
        const activeFile = this.getActiveMarkdownFile();
        if (!activeFile) {
            throw new Error(strings.noActiveFileForAutoDraft);
        }
        const folder = activeFile.parent;
        if (!folder) {
            throw new Error(strings.noChildNotesForAutoDraft);
        }
        const files = await Promise.all(folder.children
            .filter((child) => (0, utils_1.maybeFile)(child) && child.extension === "md")
            .map(async (file) => {
            const content = await this.app.vault.cachedRead(file);
            return {
                file,
                content,
                score: scoreChildNoteCandidate(file, content),
            };
        }));
        return files
            .filter(({ score, file, content }) => score > 0 && !isParentOutlineNote(file, content))
            .sort((left, right) => compareNumberedTitles(left.file.basename, right.file.basename))
            .map(({ file }) => file);
    }
    addCommands() {
        const strings = this.getStrings();
        this.addCommand({
            id: "open-obsillm-chat",
            name: strings.openChatCommand,
            callback: () => void this.activateView(),
        });
        this.addCommand({
            id: "ask-about-current-note",
            name: strings.askAboutCurrentNoteCommand,
            callback: async () => {
                const prompt = await new prompt_modal_1.PromptModal(this.app, strings.askCurrentNoteTitle, "", {
                    placeholder: strings.askCurrentNotePlaceholder,
                    cancelText: strings.promptCancel,
                    submitText: strings.promptSubmit,
                }).openAndWait();
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
            name: strings.draftCurrentNoteCommand,
            callback: async () => {
                await this.autoDraftCurrentNote({
                    provider: this.settings.defaultProvider,
                    model: this.getModelForProvider(this.settings.defaultProvider),
                    useVault: true,
                    useWeb: false,
                });
            },
        });
        this.addCommand({
            id: "draft-all-child-notes",
            name: strings.draftChildNotesCommand,
            callback: async () => {
                await this.autoDraftChildNotes({
                    provider: this.settings.defaultProvider,
                    model: this.getModelForProvider(this.settings.defaultProvider),
                    useVault: true,
                    useWeb: false,
                });
            },
        });
        this.addCommand({
            id: "insert-cited-answer",
            name: strings.insertCitedAnswerCommand,
            callback: async () => {
                const prompt = await new prompt_modal_1.PromptModal(this.app, strings.insertCitedAnswerTitle, "", {
                    placeholder: strings.insertCitedAnswerPlaceholder,
                    cancelText: strings.promptCancel,
                    submitText: strings.promptSubmit,
                }).openAndWait();
                if (!prompt) {
                    return;
                }
                const view = await this.activateView();
                await view.runPrompt(prompt, {
                    useVault: true,
                    useWeb: true,
                    insertionModeAfterResponse: "insert-cursor",
                    includeSources: true,
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
    registerWorkspaceTracking() {
        this.registerEvent(this.app.workspace.on("file-open", (file) => {
            if (file instanceof obsidian_1.TFile && file.extension === "md") {
                this.rememberMarkdownFile(file);
            }
        }));
        this.registerEvent(this.app.workspace.on("active-leaf-change", (leaf) => {
            const view = leaf?.view;
            if (view instanceof obsidian_1.MarkdownView && view.file) {
                this.rememberMarkdownFile(view.file);
            }
        }));
    }
    rememberMarkdownFile(file) {
        if (file instanceof obsidian_1.TFile && file.extension === "md") {
            this.lastMarkdownFilePath = file.path;
        }
    }
}
exports.default = ObsiLLMPlugin;
const DETAIL_SECTION_CANDIDATES = {
    en: "Details",
    ko: "세부 주제",
    jp: "詳細トピック",
};
const DRAFT_SECTION_CANDIDATES = {
    en: "Draft",
    ko: "초안",
    jp: "下書き",
};
function buildAutoDraftPrompt(language, context) {
    const detailHeading = context.detailHeading;
    const draftHeading = context.draftHeading;
    const siblingBlock = context.siblingTitles.length > 0 ? context.siblingTitles.map((title) => `- ${title}`).join("\n") : "- 없음";
    const existingDetails = context.detailItems.length > 0 ? context.detailItems.map((item) => `- ${item}`).join("\n") : "- 비어 있음";
    const parentOutline = context.parentOutline || "- 부모 목차를 찾지 못했습니다.";
    const noteBody = (0, utils_1.truncate)(stripFrontmatter(context.noteContent), 4500);
    if (language === "jp") {
        return [
            "Obsidian の子ノート 1 件を埋めてください。",
            `出力は必ず次の 2 セクションだけにしてください: \`## ${detailHeading}\` と \`## ${draftHeading}\``,
            "タイトルの言い直し、挨拶、前置き、メタ説明、コードフェンスは禁止です。",
            context.hasPlaceholderDetails
                ? "現在の詳細トピックは空かプレースホルダーです。このノートに合う 3〜5 個の小項目を先に整理してください。"
                : "現在の詳細トピックは維持しつつ、必要なら表現だけ整えてください。",
            "本文はこのノートの担当範囲だけを書き、兄弟ノートと重複しすぎないようにしてください。",
            "下書き本文は Markdown で書き、必要なら `###` 見出しを使ってください。",
            "",
            `[現在ノートタイトル]\n${context.title}`,
            context.parentTitle ? `[親テーマ]\n${context.parentTitle}` : "",
            `[親ノートの目次]\n${parentOutline}`,
            `[同じフォルダの他の子ノート]\n${siblingBlock}`,
            `[現在の詳細トピック]\n${existingDetails}`,
            `[現在ノート本文]\n${noteBody}`,
        ]
            .filter(Boolean)
            .join("\n\n");
    }
    if (language === "en") {
        return [
            "Fill one Obsidian child note.",
            `Output only these two sections: \`## ${detailHeading}\` and \`## ${draftHeading}\`.`,
            "Do not restate the title. Do not greet. Do not explain what you are doing. Do not use code fences.",
            context.hasPlaceholderDetails
                ? "The current detail list is empty or placeholder text. First infer 3-5 concrete subtopics for this note."
                : "Keep the current detail list unless a light cleanup makes it clearer.",
            "Write only the scope owned by this note, and avoid repeating sibling notes too much.",
            "Use Markdown prose. `###` subheadings are allowed inside the draft.",
            "",
            `[Current note title]\n${context.title}`,
            context.parentTitle ? `[Parent topic]\n${context.parentTitle}` : "",
            `[Parent outline]\n${parentOutline}`,
            `[Sibling notes]\n${siblingBlock}`,
            `[Current detail list]\n${existingDetails}`,
            `[Current note body]\n${noteBody}`,
        ]
            .filter(Boolean)
            .join("\n\n");
    }
    return [
        "Obsidian 하위 노트 하나를 채우세요.",
        `반드시 \`## ${detailHeading}\` 와 \`## ${draftHeading}\` 두 섹션만 출력하세요.`,
        "제목 재진술, 인사말, 메타 설명, 코드 펜스는 금지합니다.",
        context.hasPlaceholderDetails
            ? "현재 세부 주제가 비어 있거나 placeholder입니다. 이 노트에 맞는 세부 주제를 3~5개로 먼저 정리하세요."
            : "현재 세부 주제는 유지하되, 더 명확해질 때만 가볍게 정리하세요.",
        "본문은 이 노트가 맡은 범위만 쓰고, 같은 폴더의 형제 노트와 과하게 겹치지 않게 작성하세요.",
        "초안은 Markdown 본문으로 쓰고, 필요하면 `###` 소제목을 써도 됩니다.",
        "",
        `[현재 노트 제목]\n${context.title}`,
        context.parentTitle ? `[상위 주제]\n${context.parentTitle}` : "",
        `[부모 노트 목차]\n${parentOutline}`,
        `[같은 폴더의 다른 하위 노트]\n${siblingBlock}`,
        `[현재 세부 주제]\n${existingDetails}`,
        `[현재 노트 본문]\n${noteBody}`,
    ]
        .filter(Boolean)
        .join("\n\n");
}
function parseAutoDraftResponse(text, context) {
    const detailSection = extractSectionBody(text, context.detailHeading) ??
        extractSectionBody(text, DETAIL_SECTION_CANDIDATES.ko) ??
        extractSectionBody(text, DETAIL_SECTION_CANDIDATES.en) ??
        extractSectionBody(text, DETAIL_SECTION_CANDIDATES.jp) ??
        "";
    const draftSection = extractSectionBody(text, context.draftHeading) ??
        extractSectionBody(text, DRAFT_SECTION_CANDIDATES.ko) ??
        extractSectionBody(text, DRAFT_SECTION_CANDIDATES.en) ??
        extractSectionBody(text, DRAFT_SECTION_CANDIDATES.jp);
    const detailItems = extractListItems(detailSection);
    const fallbackDetailItems = context.detailItems.filter((item) => !isPlaceholderDetailItem(item));
    const cleanedFallback = stripSectionHeadings(text, [
        context.detailHeading,
        context.draftHeading,
        DETAIL_SECTION_CANDIDATES.ko,
        DETAIL_SECTION_CANDIDATES.en,
        DETAIL_SECTION_CANDIDATES.jp,
        DRAFT_SECTION_CANDIDATES.ko,
        DRAFT_SECTION_CANDIDATES.en,
        DRAFT_SECTION_CANDIDATES.jp,
    ]);
    return {
        detailItems: detailItems.length > 0 ? detailItems : fallbackDetailItems,
        draftBody: (draftSection ?? cleanedFallback).trim(),
    };
}
function applyAutoDraftToContent(content, parsed, context) {
    const detailItems = parsed.detailItems.length > 0 ? parsed.detailItems : context.detailItems;
    const detailBody = detailItems.length > 0
        ? detailItems.map((item) => `- ${item}`).join("\n")
        : "- 이 노트의 세부 주제를 정리하세요.";
    const draftBody = parsed.draftBody || "- 본문을 생성하지 못했습니다.";
    let next = upsertSecondLevelSection(content, context.detailHeading, detailBody);
    next = upsertSecondLevelSection(next, context.draftHeading, draftBody);
    return `${next.trimEnd()}\n`;
}
function extractParentOutline(content) {
    return (extractSectionBody(content, "목차") ??
        extractSectionBody(content, "Outline") ??
        extractSectionBody(content, "Table of contents") ??
        (0, utils_1.truncate)(stripFrontmatter(content), 1800));
}
function extractParentNotePath(content) {
    const frontmatterMatch = content.match(/^\s*---[\s\S]*?\nparent_note_path:\s*"([^"\n]+)"\s*$/m);
    return frontmatterMatch?.[1]?.trim();
}
function extractParentNoteTitle(content) {
    const frontmatterMatch = content.match(/^\s*---[\s\S]*?\nparent_note:\s*"?\[\[([^\]|]+)(?:\|[^\]]+)?\]\]"?/m);
    if (frontmatterMatch?.[1]) {
        return frontmatterMatch[1].trim();
    }
    const inlineMatch = content.match(/상위 주제:\s*\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/);
    return inlineMatch?.[1]?.trim();
}
function inferParentTitleFromFolder(file) {
    return file.parent?.name ? file.parent.name.trim() : undefined;
}
function detectSectionHeading(content, candidates) {
    for (const heading of Object.values(candidates)) {
        if (findSectionRange(content, heading)) {
            return heading;
        }
    }
    return undefined;
}
function extractSectionBody(content, heading) {
    const range = findSectionRange(content, heading);
    return range?.body;
}
function findSectionRange(content, heading) {
    const headingPattern = new RegExp(`^##\\s+${escapeRegExp(heading)}\\s*$`, "m");
    const headingMatch = headingPattern.exec(content);
    if (!headingMatch || headingMatch.index < 0) {
        return null;
    }
    const bodyStart = headingMatch.index + headingMatch[0].length;
    const remaining = content.slice(bodyStart);
    const trimmedRemaining = remaining.replace(/^\n+/, "");
    const leadingOffset = remaining.length - trimmedRemaining.length;
    const nextHeading = /^##\s+/m.exec(trimmedRemaining);
    const end = nextHeading ? bodyStart + leadingOffset + nextHeading.index : content.length;
    const body = content.slice(bodyStart, end).replace(/^\n+/, "").trim();
    return { start: headingMatch.index, end, body };
}
function upsertSecondLevelSection(content, heading, body) {
    const section = `## ${heading}\n${body.trim()}\n`;
    const range = findSectionRange(content, heading);
    if (!range) {
        return `${content.trimEnd()}\n\n${section}`;
    }
    const before = content.slice(0, range.start).trimEnd();
    const after = content.slice(range.end).trimStart();
    return `${before}\n\n${section}${after ? `\n${after}` : ""}`;
}
function extractListItems(content) {
    if (!content) {
        return [];
    }
    const items = [];
    for (const line of content.split("\n").map((value) => value.trim())) {
        const bulletMatch = line.match(/^[-*+]\s+(.+)$/);
        if (bulletMatch?.[1]) {
            items.push(bulletMatch[1].trim());
            continue;
        }
        const numberedMatch = line.match(/^(\d+(?:\.\d+)*)\.?\s+(.+)$/);
        if (numberedMatch?.[2]) {
            items.push(`${numberedMatch[1]} ${numberedMatch[2].trim()}`);
        }
    }
    return items.filter(Boolean);
}
function isPlaceholderDetailItem(value) {
    const normalized = value.trim().toLowerCase();
    return (normalized.includes("세부 항목을 정리하세요") ||
        normalized.includes("세부 주제를 정리하세요") ||
        normalized.includes("organize the detail items") ||
        normalized.includes("整理してください"));
}
function stripSectionHeadings(content, headings) {
    let next = content;
    for (const heading of headings) {
        const range = findSectionRange(next, heading);
        if (!range) {
            continue;
        }
        next = `${next.slice(0, range.start).trimEnd()}\n\n${next.slice(range.end).trimStart()}`.trim();
    }
    return next.trim();
}
function stripFrontmatter(content) {
    return content.replace(/^\s*---\n[\s\S]*?\n---\n*/, "").trim();
}
function stripFileNumberPrefix(value) {
    return value.replace(/^\d+\.\s*/, "").trim();
}
function scoreChildNoteCandidate(file, content) {
    if (isParentOutlineNote(file, content)) {
        return 0;
    }
    let score = 0;
    if (/^\d+\.\s/.test(file.basename)) {
        score += 2;
    }
    if (/^\s*parent_note:/m.test(content)) {
        score += 2;
    }
    if (/상위 주제:\s*\[\[/.test(content)) {
        score += 2;
    }
    if (Object.values(DETAIL_SECTION_CANDIDATES).some((heading) => findSectionRange(content, heading)) ||
        Object.values(DRAFT_SECTION_CANDIDATES).some((heading) => findSectionRange(content, heading))) {
        score += 1;
    }
    return score;
}
function isParentOutlineNote(file, content) {
    const hasChildBinding = /^\s*parent_note:/m.test(content) || /^\s*parent_note_path:/m.test(content) || /상위 주제:\s*\[\[/.test(content);
    if (hasChildBinding) {
        return false;
    }
    return (file.parent?.name === file.basename ||
        /(^|\n)##\s+목차\s*$/m.test(content) ||
        /(^|\n)##\s+Outline\s*$/m.test(content) ||
        /(^|\n)##\s+Table of contents\s*$/im.test(content));
}
function compareNumberedTitles(left, right) {
    const leftIndex = Number(left.match(/^(\d+)\./)?.[1] ?? Number.MAX_SAFE_INTEGER);
    const rightIndex = Number(right.match(/^(\d+)\./)?.[1] ?? Number.MAX_SAFE_INTEGER);
    if (leftIndex !== rightIndex) {
        return leftIndex - rightIndex;
    }
    return left.localeCompare(right, "ko");
}
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function shouldUseExplicitNoteContext(prompt, selection) {
    if (selection && (0, utils_1.tokenize)(selection).length > 0) {
        return true;
    }
    const normalized = (0, utils_1.normalizeForSearch)(prompt);
    const notePhrases = [
        "current note",
        "active note",
        "this note",
        "this file",
        "current file",
        "현재 노트",
        "이 노트",
        "지금 노트",
        "이 문서",
        "이 파일",
        "현재 문서",
        "현재 파일",
        "現在のノート",
        "このノート",
        "このファイル",
        "現在のファイル",
    ].map((phrase) => (0, utils_1.normalizeForSearch)(phrase));
    return notePhrases.some((phrase) => phrase && normalized.includes(phrase));
}
function filterRelevantVaultMatches(prompt, matches, explicitNoteContext) {
    if (explicitNoteContext) {
        return matches;
    }
    const normalizedPrompt = (0, utils_1.normalizeForSearch)(prompt);
    const tokens = (0, utils_1.tokenize)(prompt);
    if (!normalizedPrompt || tokens.length === 0) {
        return [];
    }
    return matches.filter((match) => {
        const combined = (0, utils_1.normalizeForSearch)([match.title, match.headings.join(" "), match.tags.join(" "), match.aliases.join(" "), match.excerpt].join(" "));
        if (!combined) {
            return false;
        }
        if (normalizedPrompt.length >= 8 && combined.includes(normalizedPrompt)) {
            return true;
        }
        const distinctHits = new Set(tokens.filter((token) => combined.includes(token))).size;
        if (tokens.length >= 2) {
            return distinctHits >= 2;
        }
        return distinctHits >= 1 && (match.score >= 8 || (0, utils_1.normalizeForSearch)(match.title).includes(tokens[0]));
    });
}
