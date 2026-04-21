import { App, MarkdownView, Notice, TFile, normalizePath } from "obsidian";

import { getStrings } from "./i18n";
import { citationToMarkdown, ensureFolderExists, findOrCreateAvailablePath, slugifyTitle } from "./utils";

import type { AppLanguage, ChatResponse, InsertionMode, PluginSettings } from "./types";

export interface TextSelectionState {
  document: string;
  selectionStart: number;
  selectionEnd: number;
}

export function applyTextInsertion(
  state: TextSelectionState,
  insertedText: string,
  mode: Exclude<InsertionMode, "create-note" | "create-note-current-folder">,
): TextSelectionState {
  const start = Math.max(0, Math.min(state.selectionStart, state.selectionEnd));
  const end = Math.max(start, Math.max(state.selectionStart, state.selectionEnd));

  if (mode === "replace-selection") {
    return {
      document: `${state.document.slice(0, start)}${insertedText}${state.document.slice(end)}`,
      selectionStart: start + insertedText.length,
      selectionEnd: start + insertedText.length,
    };
  }

  return {
    document: `${state.document.slice(0, start)}${insertedText}${state.document.slice(start)}`,
    selectionStart: start + insertedText.length,
    selectionEnd: start + insertedText.length,
  };
}

export function buildInsertionMarkdown(
  response: ChatResponse,
  language: AppLanguage = "en",
  includeSources = false,
  prompt = "",
): string {
  const body = stripPromptEcho(response.text, prompt);
  if (!includeSources || response.citations.length === 0) {
    return body;
  }

  const strings = getStrings(language);
  const citations = response.citations.map((citation) => citationToMarkdown(citation)).join("\n");
  return `${body}\n\n## ${strings.sources}\n${citations}`;
}

function getTargetMarkdownView(app: App, preferredFile?: TFile | null): MarkdownView | null {
  const active = app.workspace.getActiveViewOfType(MarkdownView);
  if (active && (!preferredFile || active.file?.path === preferredFile.path)) {
    return active;
  }

  const leaves = app.workspace.getLeavesOfType("markdown").map((markdownLeaf) => markdownLeaf.view);
  if (preferredFile) {
    const matched = leaves.find(
      (view): view is MarkdownView => view instanceof MarkdownView && view.file?.path === preferredFile.path,
    );
    if (matched) {
      return matched;
    }
  }

  if (active) {
    return active;
  }

  const leaf = leaves.find((view): view is MarkdownView => view instanceof MarkdownView);

  return leaf ?? null;
}

export async function applyResponseToWorkspace(
  app: App,
  settings: PluginSettings,
  response: ChatResponse,
  mode: InsertionMode,
  titleHint: string,
  includeSources = false,
  targetFile?: TFile | null,
): Promise<TFile | null> {
  const strings = getStrings(settings.language);
  const content = buildInsertionMarkdown(response, settings.language, includeSources, titleHint);

  if (mode === "create-note" || mode === "create-note-current-folder") {
    const noteTitle = deriveNoteTitle(content, titleHint);
    const fileName = `${slugifyTitle(noteTitle)}.md`;
    const noteBody = stripLeadingTitleHeading(content, noteTitle) || content;
    const baseFolder =
      mode === "create-note-current-folder" ? getCurrentNoteFolder(app, targetFile) : settings.createNoteFolder.trim();

    if (mode === "create-note-current-folder" && baseFolder === null) {
      throw new Error(strings.noActiveFileForCurrentFolderSave);
    }

    const folder =
      mode === "create-note"
        ? buildTopicFolderPath(baseFolder ?? "", noteTitle)
        : baseFolder;

    const noteContent = buildCreatedNoteContent(noteBody, response, {
      language: settings.language,
      folderPath: folder ?? "",
      noteTitle,
    });

    if (folder) {
      await ensureFolderExists(app, folder);
    }
    const path = normalizePath(folder ? `${folder}/${fileName}` : fileName);
    const availablePath = await findOrCreateAvailablePath(app, path);
    const file = await app.vault.create(availablePath, noteContent);
    await app.workspace.getLeaf(true).openFile(file);
    new Notice(`${strings.createdNotice} ${availablePath}`);
    return file;
  }

  const view = getTargetMarkdownView(app, targetFile);
  const editor = view?.editor;
  if (!editor) {
    throw new Error(strings.noActiveEditor);
  }

  if (mode === "replace-selection") {
    if (!editor.getSelection()) {
      throw new Error(strings.noSelection);
    }
    editor.replaceSelection(content);
    return view?.file ?? targetFile ?? null;
  }

  editor.replaceRange(content, editor.getCursor());
  return view?.file ?? targetFile ?? null;
}

export async function createOutlineNotesFromResponse(
  app: App,
  settings: PluginSettings,
  response: ChatResponse,
  prompt: string,
  targetFile?: TFile | null,
): Promise<number> {
  const strings = getStrings(settings.language);
  const view = getTargetMarkdownView(app, targetFile);
  const file = targetFile ?? view?.file;
  if (!file) {
    throw new Error(strings.noActiveFileForOutlineCreate);
  }

  const folder = file.parent?.path ?? getCurrentNoteFolder(app, targetFile);
  if (folder === null) {
    throw new Error(strings.noActiveFileForOutlineCreate);
  }
  const targetFolder = await ensureParentNoteTopicFolder(app, settings, file);

  const content = buildInsertionMarkdown(response, settings.language, false, prompt);
  const outlineItems = extractOutlineItems(content, prompt);
  if (outlineItems.length === 0) {
    throw new Error(strings.noOutlineItemsFound);
  }

  for (const item of outlineItems) {
    const indexLabel = String(item.index).padStart(2, "0");
    const body = buildOutlineChildBody(settings.language, file.basename, item.title, item.children);
    const contentWithProperties = buildCreatedNoteContent(body, response, {
      language: settings.language,
      folderPath: targetFolder,
      noteTitle: item.title,
      parentNoteTitle: file.basename,
      parentNotePath: file.path,
      extraTagSources: [item.title, ...item.children.slice(0, 2)],
    });
    await upsertOutlineChildNote(app, targetFolder, indexLabel, item.title, contentWithProperties);
  }

  new Notice(`${strings.outlineNotesCreated} ${outlineItems.length}`);
  return outlineItems.length;
}

function normalizePromptEcho(value: string): string {
  return value
    .trim()
    .replace(/^["'`“”‘’>#\-\s]+/, "")
    .replace(/["'`“”‘’\s]+$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getCurrentNoteFolder(app: App, preferredFile?: TFile | null): string | null {
  const file = preferredFile ?? getTargetMarkdownView(app, preferredFile)?.file;
  if (!file) {
    return null;
  }

  return getFolderPathFromFile(file.path);
}

function buildTopicFolderPath(baseFolder: string, noteTitle: string): string {
  const folderName = slugifyTitle(noteTitle);
  return normalizePath(baseFolder ? `${baseFolder}/${folderName}` : folderName);
}

async function ensureParentNoteTopicFolder(app: App, settings: PluginSettings, file: TFile): Promise<string> {
  const currentFolder = file.parent?.path ?? getFolderPathFromFile(file.path);
  const baseFolder = normalizePath(settings.createNoteFolder.trim());

  // If the parent note is already inside a topic folder, keep that structure.
  if (!baseFolder || normalizePath(currentFolder) !== baseFolder) {
    return currentFolder;
  }

  const targetFolder = buildTopicFolderPath(baseFolder, file.basename);
  await ensureFolderExists(app, targetFolder);
  const targetPath = normalizePath(`${targetFolder}/${file.name}`);
  if (file.path !== targetPath) {
    const availablePath = await findOrCreateAvailablePath(app, targetPath);
    await app.fileManager.renameFile(file, availablePath);
  }
  return targetFolder;
}

interface CreatedNoteOptions {
  language?: AppLanguage;
  folderPath?: string;
  noteTitle?: string;
  parentNoteTitle?: string;
  parentNotePath?: string;
  extraTagSources?: string[];
}

interface OutlineItem {
  index: number;
  title: string;
  children: string[];
}

function escapeYamlDoubleQuoted(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/\u0008/g, "\\b")
    .replace(/\f/g, "\\f")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`);
}

function commonPrefixLength(left: string, right: string): number {
  const limit = Math.min(left.length, right.length);
  let index = 0;
  while (index < limit && left[index] === right[index]) {
    index += 1;
  }
  return index;
}

function shouldStripPromptBlock(candidate: string, promptNormalized: string): boolean {
  const normalizedCandidate = normalizePromptEcho(candidate);
  if (!normalizedCandidate || !promptNormalized) {
    return false;
  }

  if (normalizedCandidate === promptNormalized) {
    return true;
  }

  const threshold = Math.max(16, Math.floor(promptNormalized.length * 0.55));
  if (normalizedCandidate.length >= threshold && promptNormalized.includes(normalizedCandidate)) {
    return true;
  }

  if (promptNormalized.length >= 16 && normalizedCandidate.includes(promptNormalized)) {
    return true;
  }

  return commonPrefixLength(normalizedCandidate, promptNormalized) >= threshold;
}

function stripLeadingBoilerplate(body: string): string {
  let next = body.trim();
  const patterns = [
    /^안녕하세요[.!!\s]*obsillm[^\n]*\n*/i,
    /^안녕하세요[.!!\s]*\n*/i,
    /^hello[.!!\s]*(this is )?obsillm[^\n]*\n*/i,
    /^hello[.!!\s]*\n*/i,
    /^こんにちは[。!！\s]*(obsillm[^\n]*)?\n*/i,
    /^요청하신 내용을 바탕으로[^\n]*\n*/i,
    /^요청하신 내용은[^\n]*\n*/i,
    /^제안을 드립니다[^\n]*\n*/i,
    /^[^\n]*환영합니다[^\n]*\n*/i,
    /^based on your request[^\n]*\n*/i,
    /^[^\n]*welcome[^\n]*\n*/i,
    /^here (is|are)[^\n]*\n*/i,
    /^ご依頼の内容をもとに[^\n]*\n*/i,
    /^[^\n]*ようこそ[^\n]*\n*/i,
    /^以下[^\n]*\n*/i,
  ];

  for (let index = 0; index < 4; index += 1) {
    const updated = next.replace(/^\s+/, "");
    const stripped = patterns.reduce((value, pattern) => value.replace(pattern, ""), updated).trimStart();
    if (stripped === next) {
      break;
    }
    next = stripped;
  }

  return next.trim();
}

export function stripPromptEcho(text: string, prompt: string): string {
  let body = text.trim();
  const promptNormalized = normalizePromptEcho(prompt);
  if (!body || !promptNormalized) {
    return body;
  }

  for (let index = 0; index < 3; index += 1) {
    const paragraphs = body.split(/\n\s*\n/);
    if (paragraphs.length > 1 && shouldStripPromptBlock(paragraphs[0], promptNormalized)) {
      body = paragraphs.slice(1).join("\n\n").trim();
      continue;
    }

    const lines = body.split("\n");
    if (lines.length > 1 && shouldStripPromptBlock(lines[0], promptNormalized)) {
      body = lines.slice(1).join("\n").trim();
      continue;
    }

    if (lines.length > 2 && shouldStripPromptBlock(lines.slice(0, 2).join(" "), promptNormalized)) {
      body = lines.slice(2).join("\n").trim();
      continue;
    }

    const normalizedBody = normalizePromptEcho(body);
    if (normalizedBody === promptNormalized) {
      return "";
    }

    if (normalizedBody.startsWith(promptNormalized)) {
      const promptIndex = body.indexOf(prompt.trim());
      if (promptIndex === 0) {
        body = body.slice(prompt.trim().length).replace(/^[:\-\s]+/, "").trim();
        continue;
      }
    }

    break;
  }

  return stripLeadingBoilerplate(body);
}

function buildCreatedNoteContent(body: string, response: ChatResponse, options: CreatedNoteOptions = {}): string {
  const now = new Date();
  const created = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join(
    "-",
  );
  const noteTitle = options.noteTitle ?? deriveNoteTitle(body, "");
  const language = options.language ?? "en";
  const tags = deriveContextTags(noteTitle, body, options.folderPath ?? "", options.extraTagSources ?? [], language);
  const metadata = [
    "---",
    `created: ${created}`,
    ...(tags.length > 0 ? ["tags:", ...tags.map((tag) => `  - ${tag}`)] : []),
    ...(options.parentNoteTitle ? [`parent_note: "[[${escapeYamlDoubleQuoted(options.parentNoteTitle)}]]"`] : []),
    ...(options.parentNotePath ? [`parent_note_path: "${escapeYamlDoubleQuoted(options.parentNotePath)}"`] : []),
    `llm_provider: ${response.provider}`,
    `llm_model: "${escapeYamlDoubleQuoted(response.model)}"`,
    "---",
    "",
  ].join("\n");

  return `${metadata}${body.trimStart()}`;
}

function extractOutlineItems(content: string, fallbackPrompt: string): OutlineItem[] {
  const body = stripLeadingTitleHeading(content, deriveNoteTitle(content, fallbackPrompt));
  const lines = body.split("\n").map((line) => line.trim());
  const outlineLines = extractOutlineBlock(lines);
  const numberedItems = parseNumberedOutlineItems(outlineLines);
  if (numberedItems.length > 0) {
    return numberedItems.slice(0, 20);
  }

  const items: OutlineItem[] = [];

  for (const line of lines) {
    if (!line) {
      continue;
    }

    const sectionHeadingMatch = line.match(/^#{2,6}\s+(.+)$/);
    if (sectionHeadingMatch) {
      const cleaned = cleanStructuredLabel(sectionHeadingMatch[1]);
      if (cleaned && !isGenericSectionLabel(cleaned)) {
        items.push({
          index: items.length + 1,
          title: cleaned,
          children: [],
        });
      }
    }
  }

  return items.slice(0, 20);
}

function extractOutlineBlock(lines: string[]): string[] {
  const block: string[] = [];
  let sawOutlineHeading = false;
  let started = false;

  for (const line of lines) {
    if (!line) {
      if (started && !sawOutlineHeading) {
        break;
      }
      continue;
    }

    if (isOutlineHeading(line)) {
      sawOutlineHeading = true;
      continue;
    }

    if (isOutlineLine(line)) {
      started = true;
      block.push(line);
      continue;
    }

    if (started) {
      break;
    }
  }

  return block;
}

function parseNumberedOutlineItems(lines: string[]): OutlineItem[] {
  const items: OutlineItem[] = [];
  let currentItem: OutlineItem | null = null;

  for (const line of lines) {
    const topLevelMatch = line.match(/^(\d+)\.(?!\d)\s+(.+)$/);
    if (topLevelMatch) {
      const cleaned = cleanStructuredLabel(topLevelMatch[2]);
      if (cleaned) {
        currentItem = {
          index: Number(topLevelMatch[1]),
          title: cleaned,
          children: [],
        };
        items.push(currentItem);
      }
      continue;
    }

    const numberedChildMatch = line.match(/^[-*+]?\s*(\d+)\.(\d+)(?:\.)?\s+(.+)$/);
    if (numberedChildMatch && currentItem && Number(numberedChildMatch[1]) === currentItem.index) {
      const cleaned = cleanStructuredLabel(numberedChildMatch[3]);
      const childLabel = `${numberedChildMatch[1]}.${numberedChildMatch[2]} ${cleaned}`;
      if (cleaned && !isGenericSectionLabel(cleaned) && !currentItem.children.includes(childLabel)) {
        currentItem.children.push(childLabel);
      }
      continue;
    }

    const childMatch = line.match(/^[-*+]\s+(.+)$/);
    if (childMatch && currentItem) {
      const cleaned = cleanStructuredLabel(childMatch[1]);
      if (cleaned && !isGenericSectionLabel(cleaned) && !currentItem.children.includes(cleaned)) {
        currentItem.children.push(cleaned);
      }
    }
  }

  return items;
}

function isOutlineHeading(line: string): boolean {
  const heading = line.replace(/^#{1,6}\s+/, "").trim().toLowerCase();
  return ["목차", "outline", "table of contents", "toc"].includes(heading);
}

function isOutlineLine(line: string): boolean {
  return /^(\d+)\.(?!\d)\s+/.test(line) || /^[-*+]\s+/.test(line) || /^[-*+]?\s*\d+\.\d+(?:\.)?\s+/.test(line);
}

function cleanStructuredLabel(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, (_, path: string, alias: string) => alias || path)
    .replace(/[*_`#]/g, "")
    .replace(/^\d+(?:\.\d+)*(?:\.)?\s*/, "")
    .replace(/^[-*+]\s*/, "")
    .trim();
}

function buildOutlineChildBody(language: AppLanguage, parentTitle: string, childTitle: string, children: string[]): string {
  const strings = getStrings(language);
  const detailLines =
    children.length > 0 ? children.map((child) => `- ${child}`) : [`- ${strings.outlineDetailPlaceholder}`];

  return [
    `${strings.outlineParentLabel}: [[${parentTitle}]]`,
    "",
    `## ${strings.outlineDetailHeading}`,
    ...detailLines,
    "",
    `## ${strings.outlineDraftHeading}`,
    "",
  ].join("\n");
}

function stripFrontmatter(content: string): string {
  return content.replace(/^\s*---\n[\s\S]*?\n---\n*/, "").trim();
}

function deriveContextTags(
  title: string,
  body: string,
  folderPath: string,
  extraSources: string[],
  language: AppLanguage,
): string[] {
  const phrases = [
    folderPath.split("/").filter(Boolean).pop() ?? "",
    title,
    ...extraSources,
    stripFrontmatter(body).slice(0, 1600),
  ].filter(Boolean);
  const combined = phrases.join("\n");
  const tags: string[] = [];

  const category = inferCategoryTag(combined);
  if (category) {
    tags.push(category);
  }

  for (const keyword of inferKeywordTags(combined, category)) {
    if (!tags.some((existing) => isNearDuplicateTag(existing, keyword))) {
      tags.push(keyword);
    }
    if (tags.length >= 3) {
      return tags;
    }
  }

  return tags.length > 0 ? tags : [getStrings(language).fallbackTag];
}

function isGenericSectionLabel(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return ["목차", "개요", "outline", "overview", "toc", "intro", "introduction", "요약", "세부 주제"].includes(normalized);
}

function phraseToTags(phrase: string): string[] {
  const cleaned = cleanStructuredLabel(phrase)
    .replace(/['"`“”‘’]/g, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^\p{L}\p{N}\s:/,-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return [];
  }

  const segments = cleaned
    .split(/[:/|,]/)
    .map((part) => compactTagSegment(part))
    .filter((part) => part.length >= 2)
    .filter((part) => !isGenericTagSource(part))
    .filter((part) => part.length <= 28);

  return segments.slice(0, 2);
}

function isGenericTagSource(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return [
    "drafts",
    "draft",
    "obsillm drafts",
    "notes",
    "note",
    "new",
    "untitled",
    "목차",
    "개요",
    "초안",
    "주제",
    "세부",
    "세부-주제",
    "사용법",
    "활용법",
    "완벽",
    "가이드",
    "활용",
    "효율적",
    "효율적인",
    "시작",
    "시작하기",
    "입문",
    "기초",
    "정리",
    "방법",
    "소개",
    "사례",
    "주의사항",
    "요약",
    "through",
    "using",
    "with",
    "for",
    "the",
    "and",
  ].includes(normalized);
}

function compactTagSegment(value: string): string {
  const normalized = value
    .replace(/\bcommunity plugins\b/gi, "플러그인")
    .replace(/\bgraph view\b/gi, "그래프 뷰")
    .replace(/\bbacklinks\b/gi, "백링크")
    .replace(/\bvault\b/gi, "볼트")
    .replace(/\bworkflow\b/gi, "워크플로우")
    .replace(/\bautomation\b/gi, "자동화")
    .replace(/\bknowledge management\b/gi, "지식 관리")
    .replace(/\bpersonal knowledge management\b/gi, "지식 관리")
    .replace(/란 무엇인가/g, "")
    .replace(/활용법/g, "")
    .replace(/사용법/g, "")
    .replace(/구축하기/g, "구축")
    .replace(/의 이점/g, "")
    .replace(/반복 업무 자동화/g, "업무 자동화")
    .replace(/언제 어디서나 기록하는 습관/g, "기록 습관")
    .replace(/^\d+(?:-\d+)*[-.\s]*/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const words = normalized
    .split(" ")
    .map((word) =>
      word
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}-]+/gu, "")
        .replace(/^(대한|위한|통한|에서|으로|그리고|또는)$/g, "")
        .replace(/(과|와|을|를|은|는|이|가|에|에서|으로|로|의)$/g, ""),
    )
    .filter(Boolean)
    .filter((word) => !isGenericTagSource(word))
    .filter((word) => word.length >= 2);

  if (words.length === 0) {
    return "";
  }

  if (words[0] === "obsidian" && words.length > 1) {
    return words.slice(1, 4).join("-") || "obsidian";
  }

  return words.slice(0, 3).join("-");
}

function extractKnownTopicTags(value: string): string[] {
  const rules: Array<{ tag: string; patterns: RegExp[] }> = [
    { tag: "obsidian", patterns: [/\bobsidian\b/i, /옵시디언/i] },
    { tag: "codex", patterns: [/\bcodex\b/i, /코덱스/i] },
    { tag: "go", patterns: [/\bgolang\b/i, /\bgo\b/i, /go 언어/i, /고 언어/i] },
    { tag: "vault", patterns: [/\bvault\b/i, /볼트/i, /보관소/i] },
    { tag: "백링크", patterns: [/\bbacklinks?\b/i, /백링크/i] },
    { tag: "그래프-뷰", patterns: [/\bgraph view\b/i, /그래프 뷰/i] },
    { tag: "플러그인", patterns: [/\bcommunity plugins?\b/i, /\bplugins?\b/i, /플러그인/i] },
    { tag: "워크플로우", patterns: [/\bworkflow\b/i, /워크플로우/i] },
    { tag: "자동화", patterns: [/\bautomation\b/i, /자동화/i] },
    { tag: "지식-관리", patterns: [/\bknowledge management\b/i, /지식 관리/i] },
    { tag: "템플릿", patterns: [/\btemplates?\b/i, /템플릿/i] },
    { tag: "태그", patterns: [/\btags?\b/i, /태그/i] },
    { tag: "검색", patterns: [/\bsearch\b/i, /검색/i] },
  ];

  const hits: string[] = [];
  for (const rule of rules) {
    if (rule.patterns.some((pattern) => pattern.test(value)) && !hits.includes(rule.tag)) {
      hits.push(rule.tag);
    }
  }
  return hits;
}

const CATEGORY_RULES: Array<{ tag: string; patterns: RegExp[] }> = [
  { tag: "IT", patterns: [/\bobsidian\b/i, /\bcodex\b/i, /\bopenai\b/i, /\bgemini\b/i, /\bgithub\b/i, /\bapi\b/i, /\bcode\b/i, /\bplugin\b/i, /\bsoftware\b/i, /\bprogramming\b/i, /\bdeveloper\b/i, /\bgo(lang)?\b/i, /옵시디언/i, /코덱스/i, /오픈에이아이/i, /제미나이/i, /플러그인/i, /코드/i, /개발/i, /프로그래밍/i] },
  { tag: "정치", patterns: [/\bpolitic/i, /\bgov/i, /\belection/i, /\bdiploma/i, /정치/i, /정부/i, /대통령/i, /선거/i, /외교/i] },
  { tag: "국제정세", patterns: [/\bwar\b/i, /\biran\b/i, /\bisrael\b/i, /\bunited states\b/i, /\bgeopolit/i, /국제 정세/i, /국제정세/i, /전쟁/i, /미국/i, /이란/i, /이스라엘/i, /외교/i] },
  { tag: "경제", patterns: [/\beconom/i, /\bmarket/i, /\bstock/i, /\bfinance\b/i, /경제/i, /시장/i, /주식/i, /금융/i, /투자/i] },
  { tag: "비즈니스", patterns: [/\bbusiness\b/i, /\bstartup\b/i, /\bsaas\b/i, /비즈니스/i, /사업/i, /스타트업/i, /기업/i] },
  { tag: "예술", patterns: [/\bart\b/i, /\bdesign\b/i, /\bmusic\b/i, /\bmovie\b/i, /예술/i, /디자인/i, /음악/i, /영화/i] },
  { tag: "스포츠", patterns: [/\bsport/i, /\bfootball\b/i, /\bsoccer\b/i, /\bbaseball\b/i, /\bbasketball\b/i, /스포츠/i, /축구/i, /야구/i, /농구/i] },
  { tag: "과학", patterns: [/\bscience\b/i, /\bresearch\b/i, /\bphysics\b/i, /\bbiology\b/i, /과학/i, /연구/i, /물리/i, /생물/i] },
  { tag: "교육", patterns: [/\beducation\b/i, /\bstudy\b/i, /\blearning\b/i, /교육/i, /학습/i, /공부/i] },
  { tag: "역사", patterns: [/\bhistory\b/i, /역사/i] },
  { tag: "건강", patterns: [/\bhealth\b/i, /\bmedical\b/i, /\bfitness\b/i, /건강/i, /의학/i, /운동/i] },
  { tag: "여행", patterns: [/\btravel\b/i, /\btrip\b/i, /여행/i] },
  { tag: "생산성", patterns: [/\bworkflow\b/i, /\bproductivity\b/i, /\bnote taking\b/i, /생산성/i, /워크플로우/i, /업무 자동화/i, /지식 관리/i] },
];

const KEYWORD_RULES: Array<{ tag: string; patterns: RegExp[] }> = [
  { tag: "Obsidian", patterns: [/\bobsidian\b/i, /옵시디언/i] },
  { tag: "Codex", patterns: [/\bcodex\b/i, /코덱스/i] },
  { tag: "OpenAI", patterns: [/\bopenai\b/i, /오픈에이아이/i] },
  { tag: "Gemini", patterns: [/\bgemini\b/i, /제미나이/i] },
  { tag: "Vault", patterns: [/\bvault\b/i, /보관소/i, /볼트/i] },
  { tag: "플러그인", patterns: [/\bplugin(s)?\b/i, /플러그인/i] },
  { tag: "백링크", patterns: [/\bbacklinks?\b/i, /백링크/i] },
  { tag: "그래프뷰", patterns: [/\bgraph view\b/i, /그래프 뷰/i] },
  { tag: "자동화", patterns: [/\bautomation\b/i, /자동화/i] },
  { tag: "워크플로우", patterns: [/\bworkflow\b/i, /워크플로우/i] },
  { tag: "지식관리", patterns: [/\bknowledge management\b/i, /지식 관리/i] },
  { tag: "태그", patterns: [/\btags?\b/i, /태그/i] },
  { tag: "템플릿", patterns: [/\btemplates?\b/i, /템플릿/i] },
  { tag: "정치", patterns: [/\bpolitic/i, /정치/i] },
  { tag: "외교", patterns: [/\bdiploma/i, /외교/i] },
  { tag: "전쟁", patterns: [/\bwar\b/i, /전쟁/i] },
  { tag: "미국", patterns: [/\bunited states\b/i, /\busa\b/i, /미국/i] },
  { tag: "이란", patterns: [/\biran\b/i, /이란/i] },
  { tag: "이스라엘", patterns: [/\bisrael\b/i, /이스라엘/i] },
  { tag: "경제", patterns: [/\beconom/i, /경제/i] },
  { tag: "주식", patterns: [/\bstock/i, /주식/i] },
  { tag: "예술", patterns: [/\bart\b/i, /예술/i] },
  { tag: "디자인", patterns: [/\bdesign\b/i, /디자인/i] },
  { tag: "스포츠", patterns: [/\bsport/i, /스포츠/i] },
  { tag: "축구", patterns: [/\bfootball\b/i, /\bsoccer\b/i, /축구/i] },
  { tag: "야구", patterns: [/\bbaseball\b/i, /야구/i] },
  { tag: "과학", patterns: [/\bscience\b/i, /과학/i] },
  { tag: "교육", patterns: [/\beducation\b/i, /교육/i] },
  { tag: "역사", patterns: [/\bhistory\b/i, /역사/i] },
];

function inferCategoryTag(value: string): string | undefined {
  for (const rule of CATEGORY_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(value))) {
      return rule.tag;
    }
  }

  return undefined;
}

function inferKeywordTags(value: string, category?: string): string[] {
  const tags: string[] = [];

  for (const rule of KEYWORD_RULES) {
    if (category && isNearDuplicateTag(category, rule.tag)) {
      continue;
    }

    if (rule.patterns.some((pattern) => pattern.test(value))) {
      tags.push(rule.tag);
    }
    if (tags.length >= 2) {
      return tags;
    }
  }

  for (const fallback of extractFallbackKeywordTags(value)) {
    if (category && isNearDuplicateTag(category, fallback)) {
      continue;
    }
    if (!tags.some((existing) => isNearDuplicateTag(existing, fallback))) {
      tags.push(fallback);
    }
    if (tags.length >= 2) {
      break;
    }
  }

  return tags;
}

function extractFallbackKeywordTags(value: string): string[] {
  const tokens = cleanStructuredLabel(value)
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .split(/\s+/)
    .map((token) => normalizeTagToken(token))
    .filter(Boolean)
    .filter((token) => !isGenericTagSource(token));

  return Array.from(new Set(tokens)).slice(0, 4);
}

function normalizeTagToken(value: string): string {
  const cleaned = value.trim().replace(/[^\p{L}\p{N}]+/gu, "");
  if (!cleaned || cleaned.length < 2) {
    return "";
  }

  if (/^[a-z0-9]+$/i.test(cleaned)) {
    if (/^(it|ai|ml|ui|ux)$/i.test(cleaned)) {
      return cleaned.toUpperCase();
    }
    if (/^(obsidian|codex|openai|gemini|github|vault)$/i.test(cleaned)) {
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
    }
    return "";
  }

  return cleaned;
}

function isNearDuplicateTag(left: string, right: string): boolean {
  const normalizedLeft = left.trim().toLowerCase();
  const normalizedRight = right.trim().toLowerCase();
  return (
    normalizedLeft === normalizedRight ||
    normalizedLeft.startsWith(`${normalizedRight}-`) ||
    normalizedRight.startsWith(`${normalizedLeft}-`)
  );
}

function findExistingOutlineChildFile(app: App, folderPath: string, indexLabel: string, title: string): TFile | null {
  const normalizedFolder = folderPath ? normalizePath(folderPath) : "";
  const expectedTitle = normalizeTitleComparison(title);
  const markdownFiles = typeof app.vault.getMarkdownFiles === "function" ? app.vault.getMarkdownFiles() : [];

  const exactTitleMatch =
    markdownFiles.find(
      (candidate) =>
        (candidate.parent?.path ? normalizePath(candidate.parent.path) : "") === normalizedFolder &&
        normalizeTitleComparison(stripFileNumberPrefix(candidate.basename)) === expectedTitle,
    ) ?? null;
  if (exactTitleMatch) {
    return exactTitleMatch;
  }

  return (
    markdownFiles.find((candidate) => {
      if ((candidate.parent?.path ? normalizePath(candidate.parent.path) : "") !== normalizedFolder) {
        return false;
      }

      const indexMatch = candidate.basename.match(/^(\d+)\./);
      return indexMatch?.[1] ? String(Number(indexMatch[1])).padStart(2, "0") === indexLabel : false;
    }) ?? null
  );
}

async function upsertOutlineChildNote(
  app: App,
  folderPath: string,
  indexLabel: string,
  title: string,
  content: string,
): Promise<void> {
  const fileName = `${indexLabel}. ${slugifyTitle(title)}.md`;
  const expectedPath = normalizePath(folderPath ? `${folderPath}/${fileName}` : fileName);
  const exactFile = app.vault.getAbstractFileByPath(expectedPath);

  if (exactFile instanceof TFile) {
    await app.vault.modify(exactFile, content);
    return;
  }

  const existingFile = findExistingOutlineChildFile(app, folderPath, indexLabel, title);
  if (existingFile) {
    if (existingFile.path !== expectedPath && !app.vault.getAbstractFileByPath(expectedPath)) {
      await app.fileManager.renameFile(existingFile, expectedPath);
    }
    await app.vault.modify(existingFile, content);
    return;
  }

  const availablePath = await findOrCreateAvailablePath(app, expectedPath);
  await app.vault.create(availablePath, content);
}

function stripFileNumberPrefix(value: string): string {
  return value.replace(/^\d+\.\s*/, "").trim();
}

function normalizeTitleComparison(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[`"'“”‘’]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripLeadingTitleHeading(content: string, title: string): string {
  const firstHeadingMatch = content.match(/^\s*(#{1,6})\s+(.+?)\s*(?:\n+|$)/);
  if (!firstHeadingMatch) {
    return content;
  }

  const headingText = firstHeadingMatch[2].trim();
  if (normalizeTitleComparison(headingText) !== normalizeTitleComparison(title)) {
    return content;
  }

  return content.slice(firstHeadingMatch[0].length).replace(/^\n+/, "").trimStart();
}

function deriveNoteTitle(content: string, fallback: string): string {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const heading = line.match(/^#{1,6}\s+(.+)$/);
    if (heading?.[1]) {
      return heading[1].trim();
    }
  }

  for (const line of lines) {
    if (/^[-*+]\s/.test(line) || /^\d+\.\s/.test(line) || /^>\s/.test(line)) {
      continue;
    }

    const cleaned = line.replace(/[*_`[\]#]+/g, "").trim();
    if (cleaned) {
      return cleaned;
    }
  }

  return fallback;
}

function getFolderPathFromFile(filePath: string): string {
  const separatorIndex = filePath.lastIndexOf("/");
  return separatorIndex >= 0 ? filePath.slice(0, separatorIndex) : "";
}
