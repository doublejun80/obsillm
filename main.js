"use strict";
const __native_require__ = typeof require === "function" ? require : null;
const __modules__ = {
  "./src/i18n.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SYSTEM_PROMPTS = void 0;
exports.getDefaultSystemPrompt = getDefaultSystemPrompt;
exports.isDefaultSystemPrompt = isDefaultSystemPrompt;
exports.getStrings = getStrings;
const LEGACY_DEFAULT_SYSTEM_PROMPT = "You are ObsiLLM, an Obsidian writing assistant. Write concise, grounded Markdown. Prefer provided vault context when it is relevant, and clearly separate note-derived context from live web information.";
exports.DEFAULT_SYSTEM_PROMPTS = {
    en: `${LEGACY_DEFAULT_SYSTEM_PROMPT} Answer in English unless the user explicitly asks for another language. Do not repeat the user's request. Do not greet the user. Do not say you are ObsiLLM. Do not add prefaces like 'Here is a proposal' or 'Based on your request'. Start directly with the deliverable in Markdown. If the user asks for a title, outline, article, or draft, start with the title itself as the first heading.`,
    ko: "당신은 ObsiLLM이며, Obsidian에서 동작하는 글쓰기 도우미입니다. 사용자가 다른 언어를 명시하지 않으면 항상 한국어로 답변하세요. 간결하고 근거 있는 Markdown으로 작성하고, vault 문맥이 관련 있을 때 우선 활용하세요. 웹 정보를 사용했다면 노트 기반 정보와 명확히 구분하세요. 사용자의 요청을 다시 쓰지 마세요. 인사말을 쓰지 마세요. 자신을 ObsiLLM이라고 소개하지 마세요. '요청하신 내용을 바탕으로', '제안을 드립니다' 같은 말머리를 쓰지 마세요. 바로 결과물부터 시작하세요. 제목, 목차, 초안, 글 구조를 요청받으면 첫 줄은 바로 제목 헤딩으로 시작하세요.",
    jp: "あなたは ObsiLLM であり、Obsidian 上で動作する文章支援アシスタントです。ユーザーが別の言語を明示しない限り、常に日本語で回答してください。簡潔で根拠のある Markdown を書き、vault の文脈が関連する場合は優先して活用してください。Web 情報を使った場合はノート由来の情報と明確に区別してください。ユーザーの依頼を言い直さないでください。挨拶を書かないでください。ObsiLLM と自己紹介しないでください。『ご依頼の内容をもとに』のような前置きを書かず、結果から始めてください。タイトルや構成案、下書きを求められたら、最初の行をそのままタイトル見出しにしてください。",
};
function getDefaultSystemPrompt(language) {
    return exports.DEFAULT_SYSTEM_PROMPTS[language] ?? exports.DEFAULT_SYSTEM_PROMPTS.en;
}
function isDefaultSystemPrompt(value) {
    const normalized = value?.trim();
    if (!normalized) {
        return true;
    }
    return (normalized === LEGACY_DEFAULT_SYSTEM_PROMPT ||
        normalized.startsWith("You are ObsiLLM") ||
        normalized.startsWith("당신은 ObsiLLM") ||
        normalized.startsWith("あなたは ObsiLLM") ||
        Object.values(exports.DEFAULT_SYSTEM_PROMPTS).includes(normalized));
}
const STRINGS = {
    en: {
        ribbonOpen: "Open ObsiLLM",
        openChatCommand: "Open ObsiLLM chat",
        askAboutCurrentNoteCommand: "Ask ObsiLLM about current note",
        draftCurrentNoteCommand: "Draft from current note with ObsiLLM",
        draftChildNotesCommand: "Draft all child notes with ObsiLLM",
        insertCitedAnswerCommand: "Insert cited answer with ObsiLLM",
        askCurrentNoteTitle: "Ask about the current note",
        askCurrentNotePlaceholder: "What do you want to know about the active note?",
        insertCitedAnswerTitle: "Insert a cited answer",
        insertCitedAnswerPlaceholder: "Ask a question and ObsiLLM will insert the grounded answer into the active note.",
        draftPrompt: "Create a polished draft from the active note. Preserve the core ideas, organize the structure clearly, and fill small gaps when the context supports it.",
        settingsTitle: "ObsiLLM Settings",
        settingsDescription: "Change language, providers, models, and saving behavior.",
        language: "Language",
        languageDescription: "Change the UI language and reset the default system prompt for that language.",
        languageEn: "EN",
        languageKo: "KO",
        languageJp: "JP",
        defaultProvider: "Default provider",
        defaultProviderDescription: "Pick the provider used when the chat panel opens.",
        openaiApiKey: "OpenAI API key",
        openaiApiKeyDescription: "Stored locally in Obsidian plugin settings.",
        openaiModel: "OpenAI model",
        openaiModelDescription: "The field stays editable when you want a different OpenAI model.",
        geminiApiKey: "Gemini API key",
        geminiApiKeyDescription: "Stored locally in Obsidian plugin settings.",
        geminiModel: "Gemini model",
        geminiModelDescription: "Default: gemini-2.5-flash-lite for lower cost and faster text responses.",
        systemPrompt: "System prompt",
        systemPromptDescription: "Global instruction applied to both providers.",
        defaultVaultRetrieval: "Default vault retrieval",
        defaultVaultRetrievalDescription: "Enable vault retrieval when the sidebar opens.",
        defaultWebGrounding: "Default web grounding",
        defaultWebGroundingDescription: "Enable web search / grounding by default.",
        defaultIncludeSources: "Default include sources",
        defaultIncludeSourcesDescription: "Keep this off if you usually want clean answers without source blocks.",
        maxVaultResults: "Max vault results",
        maxVaultResultsDescription: "How many vault chunks are provided to the model.",
        chunkSize: "Chunk size",
        chunkSizeDescription: "Approximate character target for each vault chunk.",
        chunkOverlap: "Chunk overlap",
        chunkOverlapDescription: "Character overlap between adjacent chunks.",
        createNoteFolder: "Folder button target",
        createNoteFolderDescription: "The Folder button saves a new note into this folder.",
        workspaceTitle: "ObsiLLM Workspace",
        workspaceDescription: "Ask with vault context, web grounding, or both. Then copy the answer, insert it into the current note, replace selected text, save it as a new note in your folder, or save it into the current note folder.",
        provider: "Provider",
        model: "Model",
        modelPlaceholder: "Editable model ID",
        vaultContext: "Vault context",
        webGrounding: "Web grounding",
        includeSources: "Include sources",
        prompt: "Prompt",
        promptPlaceholder: "Ask a question, request a draft, or tell ObsiLLM what to write.",
        askButton: "Ask ObsiLLM",
        clearChat: "Clear chat",
        ready: "Ready",
        chatCleared: "Chat cleared.",
        enterPromptFirst: "Enter a prompt first.",
        generatingResponse: "Generating response...",
        completedWith: "Completed with",
        requestFailed: "Request failed.",
        transcriptEmpty: "The transcript will appear here. Ask a question, draft from a note, or combine vault context with live web grounding.",
        user: "User",
        assistant: "ObsiLLM",
        working: "Working...",
        error: "Error",
        noResponse: "No response.",
        retrievingContext: "Retrieving context and calling the provider...",
        copyAnswer: "Copy",
        moveToFile: "To current note",
        replaceSelection: "Replace selection",
        saveToFolder: "Save to folder",
        saveToCurrentFolder: "Save to current folder",
        createOutlineNotes: "Split into child notes",
        autoDraftCurrentNote: "Auto-draft current note",
        autoDraftChildNotes: "Auto-draft child notes",
        copied: "Copied to clipboard.",
        insertedToFile: "Inserted into the current note.",
        replacedSelection: "Replaced the selected text.",
        savedToFolder: "Saved into the folder target.",
        savedToCurrentFolder: "Saved into the current note folder.",
        outlineNotesCreated: "Created child notes from the outline:",
        autoDraftingCurrentNote: "Drafting the current note...",
        autoDraftingChildNotes: "Drafting child notes...",
        autoDraftProgress: "Drafting",
        currentNoteAutoDrafted: "Drafted the current note.",
        childNotesAutoDrafted: "Drafted child notes:",
        sources: "Sources",
        vaultOn: "Vault",
        vaultOff: "No vault",
        webOn: "Web",
        webOff: "No web",
        promptCancel: "Cancel",
        promptSubmit: "Submit",
        noActiveEditor: "Open a Markdown note before moving the answer into a file.",
        noActiveFileForCurrentFolderSave: "Open a Markdown note before saving a child note into its folder.",
        noActiveFileForOutlineCreate: "Open a Markdown note before creating child notes from the outline.",
        noActiveFileForAutoDraft: "Open a Markdown note before auto-drafting.",
        autoDraftNeedsChildNote: "Open a child note for this action. Use the batch child-note action from the parent note.",
        noChildNotesForAutoDraft: "No child notes were found in this folder.",
        noOutlineItemsFound: "No outline items were found in the answer.",
        noSelection: "Select some text before using Replace selection.",
        createdNotice: "Created",
        clipboardError: "Unable to copy the answer to the clipboard.",
    },
    ko: {
        ribbonOpen: "ObsiLLM 열기",
        openChatCommand: "ObsiLLM 채팅 열기",
        askAboutCurrentNoteCommand: "현재 노트에 대해 ObsiLLM에게 묻기",
        draftCurrentNoteCommand: "현재 노트 자동 작성",
        draftChildNotesCommand: "하위 노트 전체 자동 작성",
        insertCitedAnswerCommand: "ObsiLLM 답변을 현재 노트에 넣기",
        askCurrentNoteTitle: "현재 노트에 대해 묻기",
        askCurrentNotePlaceholder: "현재 열려 있는 노트에서 무엇을 알고 싶나요?",
        insertCitedAnswerTitle: "근거 포함 답변 넣기",
        insertCitedAnswerPlaceholder: "질문을 입력하면 ObsiLLM이 현재 노트에 근거 포함 답변을 넣습니다.",
        draftPrompt: "현재 노트를 바탕으로 완성도 있는 초안을 작성하세요. 핵심 아이디어를 유지하고, 구조를 명확히 정리하며, 문맥상 가능한 작은 빈틈은 자연스럽게 보완하세요.",
        settingsTitle: "ObsiLLM 설정",
        settingsDescription: "언어, 제공자, 모델, 저장 동작을 바꿉니다.",
        language: "언어",
        languageDescription: "UI 언어를 바꾸고 해당 언어에 맞는 기본 시스템 프롬프트로 다시 설정합니다.",
        languageEn: "EN",
        languageKo: "KO",
        languageJp: "JP",
        defaultProvider: "기본 제공자",
        defaultProviderDescription: "채팅 패널을 열 때 기본으로 선택될 제공자입니다.",
        openaiApiKey: "OpenAI API 키",
        openaiApiKeyDescription: "Obsidian 플러그인 설정에 로컬로 저장됩니다.",
        openaiModel: "OpenAI 모델",
        openaiModelDescription: "원하는 OpenAI 모델이 있으면 직접 바꿀 수 있습니다.",
        geminiApiKey: "Gemini API 키",
        geminiApiKeyDescription: "Obsidian 플러그인 설정에 로컬로 저장됩니다.",
        geminiModel: "Gemini 모델",
        geminiModelDescription: "기본값은 gemini-2.5-flash-lite 입니다. 더 저렴하고 응답이 빠른 편입니다.",
        systemPrompt: "시스템 프롬프트",
        systemPromptDescription: "두 제공자 모두에 적용되는 공통 지시문입니다.",
        defaultVaultRetrieval: "기본 vault 검색",
        defaultVaultRetrievalDescription: "사이드바를 열 때 vault 검색을 기본으로 켭니다.",
        defaultWebGrounding: "기본 웹 검색",
        defaultWebGroundingDescription: "웹 검색 / grounding을 기본으로 켭니다.",
        defaultIncludeSources: "기본 출처 포함",
        defaultIncludeSourcesDescription: "보통은 깔끔한 답변만 원하면 꺼두세요.",
        maxVaultResults: "최대 vault 결과 수",
        maxVaultResultsDescription: "모델에 전달할 vault 조각 개수입니다.",
        chunkSize: "청크 크기",
        chunkSizeDescription: "vault 청크의 대략적인 글자 수 목표입니다.",
        chunkOverlap: "청크 겹침",
        chunkOverlapDescription: "인접 청크 사이에서 겹치는 글자 수입니다.",
        createNoteFolder: "폴더 버튼 저장 위치",
        createNoteFolderDescription: "폴더 버튼을 누르면 이 폴더에 새 노트로 저장됩니다.",
        workspaceTitle: "ObsiLLM 작업공간",
        workspaceDescription: "Vault 문맥과 웹 검색을 함께 사용해 답변을 만들고, 결과를 복사하거나 현재 노트에 넣거나 선택 영역을 바꾸거나 설정한 폴더에 새 노트로 저장하거나 현재 노트와 같은 폴더에 새 노트로 저장할 수 있습니다.",
        provider: "제공자",
        model: "모델",
        modelPlaceholder: "직접 모델 ID 입력",
        vaultContext: "Vault 문맥",
        webGrounding: "웹 검색",
        includeSources: "출처 포함",
        prompt: "프롬프트",
        promptPlaceholder: "질문하거나, 초안을 요청하거나, ObsiLLM에게 무엇을 쓸지 알려주세요.",
        askButton: "ObsiLLM에게 묻기",
        clearChat: "대화 비우기",
        ready: "준비됨",
        chatCleared: "대화를 비웠습니다.",
        enterPromptFirst: "먼저 프롬프트를 입력하세요.",
        generatingResponse: "답변을 생성하는 중입니다...",
        completedWith: "응답 완료",
        requestFailed: "요청에 실패했습니다.",
        transcriptEmpty: "여기에 대화가 표시됩니다. 질문하거나, 노트 초안을 만들거나, vault 문맥과 웹 검색을 함께 써보세요.",
        user: "사용자",
        assistant: "ObsiLLM",
        working: "작업 중...",
        error: "오류",
        noResponse: "응답이 없습니다.",
        retrievingContext: "문맥을 모으고 모델에 요청하는 중입니다...",
        copyAnswer: "복사",
        moveToFile: "현재 노트에 넣기",
        replaceSelection: "선택 교체",
        saveToFolder: "폴더에 새 노트 저장",
        saveToCurrentFolder: "현재 폴더에 새 노트 저장",
        createOutlineNotes: "목차로 하위 노트 만들기",
        autoDraftCurrentNote: "현재 노트 자동 작성",
        autoDraftChildNotes: "하위 노트 전체 자동 작성",
        copied: "클립보드에 복사했습니다.",
        insertedToFile: "현재 노트에 넣었습니다.",
        replacedSelection: "선택한 텍스트를 바꿨습니다.",
        savedToFolder: "설정한 폴더에 새 노트로 저장했습니다.",
        savedToCurrentFolder: "현재 노트와 같은 폴더에 새 노트로 저장했습니다.",
        outlineNotesCreated: "목차 기준으로 하위 노트를 만들었습니다:",
        autoDraftingCurrentNote: "현재 노트 자동 작성 중입니다...",
        autoDraftingChildNotes: "하위 노트 전체 자동 작성 중입니다...",
        autoDraftProgress: "자동 작성 중",
        currentNoteAutoDrafted: "현재 노트 초안을 채웠습니다.",
        childNotesAutoDrafted: "하위 노트 초안을 채웠습니다:",
        sources: "출처",
        vaultOn: "Vault",
        vaultOff: "Vault 끔",
        webOn: "Web",
        webOff: "Web 끔",
        promptCancel: "취소",
        promptSubmit: "확인",
        noActiveEditor: "답변을 파일로 옮기려면 먼저 Markdown 노트를 열어주세요.",
        noActiveFileForCurrentFolderSave: "현재 폴더에 저장하려면 먼저 Markdown 노트를 열어주세요.",
        noActiveFileForOutlineCreate: "목차로 하위 노트를 만들려면 먼저 Markdown 노트를 열어주세요.",
        noActiveFileForAutoDraft: "자동 작성하려면 먼저 Markdown 노트를 열어주세요.",
        autoDraftNeedsChildNote: "이 동작은 하위 노트에서 실행하세요. 부모 노트에서는 하위 노트 전체 자동 작성을 사용하면 됩니다.",
        noChildNotesForAutoDraft: "이 폴더에서 자동 작성할 하위 노트를 찾지 못했습니다.",
        noOutlineItemsFound: "응답에서 목차 항목을 찾지 못했습니다.",
        noSelection: "선택 교체를 쓰려면 먼저 텍스트를 선택하세요.",
        createdNotice: "생성됨",
        clipboardError: "답변을 클립보드에 복사하지 못했습니다.",
    },
    jp: {
        ribbonOpen: "ObsiLLM を開く",
        openChatCommand: "ObsiLLM チャットを開く",
        askAboutCurrentNoteCommand: "現在のノートについて ObsiLLM に聞く",
        draftCurrentNoteCommand: "現在のノートを自動下書き",
        draftChildNotesCommand: "子ノートを一括下書き",
        insertCitedAnswerCommand: "根拠付きの回答を現在のノートへ入れる",
        askCurrentNoteTitle: "現在のノートについて質問",
        askCurrentNotePlaceholder: "開いているノートについて何を知りたいですか？",
        insertCitedAnswerTitle: "根拠付きの回答を挿入",
        insertCitedAnswerPlaceholder: "質問すると、ObsiLLM が根拠付きの回答を現在のノートに入れます。",
        draftPrompt: "現在のノートをもとに、読みやすく整った下書きを作成してください。中心となる考えを保ち、構成を明確にし、文脈で補える小さな抜けは自然に補完してください。",
        settingsTitle: "ObsiLLM 設定",
        settingsDescription: "言語、プロバイダー、モデル、保存動作を変更します。",
        language: "言語",
        languageDescription: "UI 言語を変更し、その言語向けの既定システムプロンプトに戻します。",
        languageEn: "EN",
        languageKo: "KO",
        languageJp: "JP",
        defaultProvider: "既定のプロバイダー",
        defaultProviderDescription: "チャットパネルを開いたときに最初に使うプロバイダーです。",
        openaiApiKey: "OpenAI API キー",
        openaiApiKeyDescription: "Obsidian のプラグイン設定にローカル保存されます。",
        openaiModel: "OpenAI モデル",
        openaiModelDescription: "必要なら別の OpenAI モデルへ変更できます。",
        geminiApiKey: "Gemini API キー",
        geminiApiKeyDescription: "Obsidian のプラグイン設定にローカル保存されます。",
        geminiModel: "Gemini モデル",
        geminiModelDescription: "既定値は gemini-2.5-flash-lite です。低コストで応答も速めです。",
        systemPrompt: "システムプロンプト",
        systemPromptDescription: "両方のプロバイダーに適用される共通指示です。",
        defaultVaultRetrieval: "既定の vault 検索",
        defaultVaultRetrievalDescription: "サイドバーを開いたときに vault 検索を有効にします。",
        defaultWebGrounding: "既定の Web 検索",
        defaultWebGroundingDescription: "Web 検索 / grounding を既定で有効にします。",
        defaultIncludeSources: "既定で出典を含める",
        defaultIncludeSourcesDescription: "通常は回答本文だけ欲しいならオフのままにしてください。",
        maxVaultResults: "vault 結果数",
        maxVaultResultsDescription: "モデルに渡す vault チャンクの数です。",
        chunkSize: "チャンクサイズ",
        chunkSizeDescription: "vault チャンクの目安となる文字数です。",
        chunkOverlap: "チャンク重なり",
        chunkOverlapDescription: "隣接チャンク間で重なる文字数です。",
        createNoteFolder: "フォルダ保存先",
        createNoteFolderDescription: "フォルダボタンを押すと、このフォルダに新規ノートとして保存します。",
        workspaceTitle: "ObsiLLM ワークスペース",
        workspaceDescription: "vault 文脈と Web 検索を使って回答を作り、その結果をコピーしたり、現在のノートへ入れたり、選択範囲を置き換えたり、指定フォルダに新規ノートとして保存したり、現在のノートと同じフォルダに保存できます。",
        provider: "プロバイダー",
        model: "モデル",
        modelPlaceholder: "モデル ID を直接入力",
        vaultContext: "Vault 文脈",
        webGrounding: "Web 検索",
        includeSources: "出典を含める",
        prompt: "プロンプト",
        promptPlaceholder: "質問したり、下書きを頼んだり、ObsiLLM に何を書くか伝えてください。",
        askButton: "ObsiLLM に聞く",
        clearChat: "チャットを消去",
        ready: "準備完了",
        chatCleared: "チャットを消去しました。",
        enterPromptFirst: "先にプロンプトを入力してください。",
        generatingResponse: "回答を生成中です...",
        completedWith: "応答完了",
        requestFailed: "リクエストに失敗しました。",
        transcriptEmpty: "ここに会話が表示されます。質問したり、ノートから下書きを作ったり、vault 文脈と Web 検索を組み合わせてみてください。",
        user: "ユーザー",
        assistant: "ObsiLLM",
        working: "処理中...",
        error: "エラー",
        noResponse: "応答がありません。",
        retrievingContext: "文脈を集めてモデルを呼び出しています...",
        copyAnswer: "コピー",
        moveToFile: "現在のノートへ入れる",
        replaceSelection: "選択を置換",
        saveToFolder: "フォルダに新規保存",
        saveToCurrentFolder: "現在のフォルダに保存",
        createOutlineNotes: "目次から子ノート作成",
        autoDraftCurrentNote: "現在ノートを自動下書き",
        autoDraftChildNotes: "子ノートを一括下書き",
        copied: "クリップボードにコピーしました。",
        insertedToFile: "現在のノートへ入れました。",
        replacedSelection: "選択範囲を置き換えました。",
        savedToFolder: "設定したフォルダに新規ノートとして保存しました。",
        savedToCurrentFolder: "現在のノートと同じフォルダに保存しました。",
        outlineNotesCreated: "目次から子ノートを作成しました:",
        autoDraftingCurrentNote: "現在のノートを下書き中です...",
        autoDraftingChildNotes: "子ノートをまとめて下書き中です...",
        autoDraftProgress: "下書き中",
        currentNoteAutoDrafted: "現在のノートを下書きしました。",
        childNotesAutoDrafted: "子ノートを下書きしました:",
        sources: "出典",
        vaultOn: "Vault",
        vaultOff: "Vault オフ",
        webOn: "Web",
        webOff: "Web オフ",
        promptCancel: "キャンセル",
        promptSubmit: "送信",
        noActiveEditor: "回答をファイルへ移す前に Markdown ノートを開いてください。",
        noActiveFileForCurrentFolderSave: "現在のフォルダに保存するには、先に Markdown ノートを開いてください。",
        noActiveFileForOutlineCreate: "目次から子ノートを作るには、先に Markdown ノートを開いてください。",
        noActiveFileForAutoDraft: "自動下書きする前に Markdown ノートを開いてください。",
        autoDraftNeedsChildNote: "この操作は子ノートで実行してください。親ノートでは一括下書きを使ってください。",
        noChildNotesForAutoDraft: "このフォルダで下書きできる子ノートが見つかりませんでした。",
        noOutlineItemsFound: "回答から目次項目を見つけられませんでした。",
        noSelection: "選択置換を使う前にテキストを選択してください。",
        createdNotice: "作成しました",
        clipboardError: "回答をクリップボードへコピーできませんでした。",
    },
};
function getStrings(language) {
    return STRINGS[language] ?? STRINGS.en;
}

  },
  "./src/insertion.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyTextInsertion = applyTextInsertion;
exports.buildInsertionMarkdown = buildInsertionMarkdown;
exports.applyResponseToWorkspace = applyResponseToWorkspace;
exports.createOutlineNotesFromResponse = createOutlineNotesFromResponse;
exports.stripPromptEcho = stripPromptEcho;
const obsidian_1 = require("obsidian");
const i18n_1 = require("./i18n");
const utils_1 = require("./utils");
function applyTextInsertion(state, insertedText, mode) {
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
function buildInsertionMarkdown(response, language = "en", includeSources = false, prompt = "") {
    const body = stripPromptEcho(response.text, prompt);
    if (!includeSources || response.citations.length === 0) {
        return body;
    }
    const strings = (0, i18n_1.getStrings)(language);
    const citations = response.citations.map((citation) => (0, utils_1.citationToMarkdown)(citation)).join("\n");
    return `${body}\n\n## ${strings.sources}\n${citations}`;
}
function getTargetMarkdownView(app, preferredFile) {
    const active = app.workspace.getActiveViewOfType(obsidian_1.MarkdownView);
    if (active && (!preferredFile || active.file?.path === preferredFile.path)) {
        return active;
    }
    const leaves = app.workspace.getLeavesOfType("markdown").map((markdownLeaf) => markdownLeaf.view);
    if (preferredFile) {
        const matched = leaves.find((view) => view instanceof obsidian_1.MarkdownView && view.file?.path === preferredFile.path);
        if (matched) {
            return matched;
        }
    }
    if (active) {
        return active;
    }
    const leaf = leaves.find((view) => view instanceof obsidian_1.MarkdownView);
    return leaf ?? null;
}
async function applyResponseToWorkspace(app, settings, response, mode, titleHint) {
    const strings = (0, i18n_1.getStrings)(settings.language);
    const includeSources = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    const targetFile = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : undefined;
    const content = buildInsertionMarkdown(response, settings.language, includeSources, titleHint);
    if (mode === "create-note" || mode === "create-note-current-folder") {
        const noteTitle = deriveNoteTitle(content, titleHint);
        const fileName = `${(0, utils_1.slugifyTitle)(noteTitle)}.md`;
        const noteBody = stripLeadingTitleHeading(content, noteTitle) || content;
        const baseFolder = mode === "create-note-current-folder" ? getCurrentNoteFolder(app, targetFile) : settings.createNoteFolder.trim();
        if (mode === "create-note-current-folder" && baseFolder === null) {
            throw new Error(strings.noActiveFileForCurrentFolderSave);
        }
        const folder = mode === "create-note"
            ? buildTopicFolderPath(baseFolder ?? "", noteTitle)
            : baseFolder;
        const noteContent = buildCreatedNoteContent(noteBody, response, {
            folderPath: folder ?? "",
            noteTitle,
        });
        if (folder) {
            await (0, utils_1.ensureFolderExists)(app, folder);
        }
        const path = (0, obsidian_1.normalizePath)(folder ? `${folder}/${fileName}` : fileName);
        const availablePath = await (0, utils_1.findOrCreateAvailablePath)(app, path);
        const file = await app.vault.create(availablePath, noteContent);
        await app.workspace.getLeaf(true).openFile(file);
        new obsidian_1.Notice(`${strings.createdNotice} ${availablePath}`);
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
async function createOutlineNotesFromResponse(app, settings, response, prompt) {
    const strings = (0, i18n_1.getStrings)(settings.language);
    const targetFile = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
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
        const body = buildOutlineChildBody(file.basename, item.title, item.children);
        const contentWithProperties = buildCreatedNoteContent(body, response, {
            folderPath: targetFolder,
            noteTitle: item.title,
            parentNoteTitle: file.basename,
            parentNotePath: file.path,
            extraTagSources: [item.title, ...item.children.slice(0, 2)],
        });
        await upsertOutlineChildNote(app, targetFolder, indexLabel, item.title, contentWithProperties);
    }
    new obsidian_1.Notice(`${strings.outlineNotesCreated} ${outlineItems.length}`);
    return outlineItems.length;
}
function normalizePromptEcho(value) {
    return value
        .trim()
        .replace(/^["'`“”‘’>#\-\s]+/, "")
        .replace(/["'`“”‘’\s]+$/, "")
        .replace(/\s+/g, " ")
        .trim();
}
function getCurrentNoteFolder(app, preferredFile) {
    const file = preferredFile ?? getTargetMarkdownView(app, preferredFile)?.file;
    if (!file) {
        return null;
    }
    const separatorIndex = file.path.lastIndexOf("/");
    return separatorIndex >= 0 ? file.path.slice(0, separatorIndex) : "";
}
function buildTopicFolderPath(baseFolder, noteTitle) {
    const folderName = (0, utils_1.slugifyTitle)(noteTitle);
    return (0, obsidian_1.normalizePath)(baseFolder ? `${baseFolder}/${folderName}` : folderName);
}
async function ensureParentNoteTopicFolder(app, settings, file) {
    const currentFolder = file.parent?.path ?? "";
    const baseFolder = (0, obsidian_1.normalizePath)(settings.createNoteFolder.trim());
    if (!baseFolder || (0, obsidian_1.normalizePath)(currentFolder) !== baseFolder) {
        return currentFolder;
    }
    const targetFolder = buildTopicFolderPath(baseFolder, file.basename);
    await (0, utils_1.ensureFolderExists)(app, targetFolder);
    const targetPath = (0, obsidian_1.normalizePath)(`${targetFolder}/${file.name}`);
    if (file.path !== targetPath) {
        const availablePath = await (0, utils_1.findOrCreateAvailablePath)(app, targetPath);
        await app.fileManager.renameFile(file, availablePath);
    }
    return targetFolder;
}
function escapeYamlDoubleQuoted(value) {
    return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
function commonPrefixLength(left, right) {
    const limit = Math.min(left.length, right.length);
    let index = 0;
    while (index < limit && left[index] === right[index]) {
        index += 1;
    }
    return index;
}
function shouldStripPromptBlock(candidate, promptNormalized) {
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
function stripLeadingBoilerplate(body) {
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
        /^based on your request[^\n]*\n*/i,
        /^here (is|are)[^\n]*\n*/i,
        /^ご依頼の内容をもとに[^\n]*\n*/i,
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
function stripPromptEcho(text, prompt) {
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
function buildCreatedNoteContent(body, response, options = {}) {
    const now = new Date();
    const created = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-");
    const noteTitle = options.noteTitle ?? deriveNoteTitle(body, "");
    const tags = deriveContextTags(noteTitle, body, options.folderPath ?? "", options.extraTagSources ?? []);
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
function extractOutlineItems(content, fallbackPrompt) {
    const body = stripLeadingTitleHeading(content, deriveNoteTitle(content, fallbackPrompt));
    const lines = body.split("\n").map((line) => line.trim());
    const outlineLines = extractOutlineBlock(lines);
    const numberedItems = parseNumberedOutlineItems(outlineLines);
    if (numberedItems.length > 0) {
        return numberedItems.slice(0, 20);
    }
    const items = [];
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
function extractOutlineBlock(lines) {
    const block = [];
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
function parseNumberedOutlineItems(lines) {
    const items = [];
    let currentItem = null;
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
function isOutlineHeading(line) {
    const heading = line.replace(/^#{1,6}\s+/, "").trim().toLowerCase();
    return ["목차", "outline", "table of contents", "toc"].includes(heading);
}
function isOutlineLine(line) {
    return /^(\d+)\.(?!\d)\s+/.test(line) || /^[-*+]\s+/.test(line) || /^[-*+]?\s*\d+\.\d+(?:\.)?\s+/.test(line);
}
function cleanStructuredLabel(value) {
    return value
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, (_, path, alias) => alias || path)
        .replace(/[*_`#]/g, "")
        .replace(/^\d+(?:\.\d+)*(?:\.)?\s*/, "")
        .replace(/^[-*+]\s*/, "")
        .trim();
}
function buildOutlineChildBody(parentTitle, childTitle, children) {
    const detailLines = children.length > 0 ? children.map((child) => `- ${child}`) : ["- 이 대주제의 세부 항목을 정리하세요."];
    return [
        `상위 주제: [[${parentTitle}]]`,
        "",
        "## 세부 주제",
        ...detailLines,
        "",
        "## 초안",
        "",
    ].join("\n");
}
function stripFrontmatter(content) {
    return content.replace(/^\s*---\n[\s\S]*?\n---\n*/, "").trim();
}
function deriveContextTags(title, body, folderPath, extraSources) {
    const phrases = [
        folderPath.split("/").filter(Boolean).pop() ?? "",
        title,
        ...extraSources,
        stripFrontmatter(body).slice(0, 1600),
    ].filter(Boolean);
    const combined = phrases.join("\n");
    const tags = [];
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
    return tags.length > 0 ? tags : ["기타"];
}
function isGenericSectionLabel(value) {
    const normalized = value.trim().toLowerCase();
    return ["목차", "개요", "outline", "overview", "toc", "intro", "introduction", "요약", "세부 주제"].includes(normalized);
}
function isGenericTagSource(value) {
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
const CATEGORY_RULES = [
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
const KEYWORD_RULES = [
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
function inferCategoryTag(value) {
    for (const rule of CATEGORY_RULES) {
        if (rule.patterns.some((pattern) => pattern.test(value))) {
            return rule.tag;
        }
    }
    return undefined;
}
function inferKeywordTags(value, category) {
    const tags = [];
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
function extractFallbackKeywordTags(value) {
    const tokens = cleanStructuredLabel(value)
        .replace(/\([^)]*\)/g, " ")
        .replace(/[^\p{L}\p{N}\s]+/gu, " ")
        .split(/\s+/)
        .map((token) => normalizeTagToken(token))
        .filter(Boolean)
        .filter((token) => !isGenericTagSource(token));
    return Array.from(new Set(tokens)).slice(0, 4);
}
function normalizeTagToken(value) {
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
function isNearDuplicateTag(left, right) {
    const normalizedLeft = left.trim().toLowerCase();
    const normalizedRight = right.trim().toLowerCase();
    return normalizedLeft === normalizedRight;
}
function findExistingOutlineChildFile(app, folderPath, indexLabel, title) {
    const normalizedFolder = folderPath ? (0, obsidian_1.normalizePath)(folderPath) : "";
    const expectedTitle = normalizeTitleComparison(title);
    const markdownFiles = typeof app.vault.getMarkdownFiles === "function" ? app.vault.getMarkdownFiles() : [];
    const exactTitleMatch = markdownFiles.find((candidate) => (candidate.parent?.path ? (0, obsidian_1.normalizePath)(candidate.parent.path) : "") === normalizedFolder &&
        normalizeTitleComparison(stripFileNumberPrefix(candidate.basename)) === expectedTitle) ?? null;
    if (exactTitleMatch) {
        return exactTitleMatch;
    }
    return (markdownFiles.find((candidate) => {
        if ((candidate.parent?.path ? (0, obsidian_1.normalizePath)(candidate.parent.path) : "") !== normalizedFolder) {
            return false;
        }
        const indexMatch = candidate.basename.match(/^(\d+)\./);
        return indexMatch?.[1] ? String(Number(indexMatch[1])).padStart(2, "0") === indexLabel : false;
    }) ?? null);
}
async function upsertOutlineChildNote(app, folderPath, indexLabel, title, content) {
    const fileName = `${indexLabel}. ${(0, utils_1.slugifyTitle)(title)}.md`;
    const expectedPath = (0, obsidian_1.normalizePath)(folderPath ? `${folderPath}/${fileName}` : fileName);
    const exactFile = app.vault.getAbstractFileByPath(expectedPath);
    if (exactFile instanceof obsidian_1.TFile) {
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
    const availablePath = await (0, utils_1.findOrCreateAvailablePath)(app, expectedPath);
    await app.vault.create(availablePath, content);
}
function stripFileNumberPrefix(value) {
    return value.replace(/^\d+\.\s*/, "").trim();
}
function normalizeTitleComparison(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[`"'“”‘’]/g, "")
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
}
function stripLeadingTitleHeading(content, title) {
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
function deriveNoteTitle(content, fallback) {
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

  },
  "./src/model-options.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GEMINI_MODEL_OPTIONS = exports.OPENAI_MODEL_OPTIONS = void 0;
exports.getModelOptions = getModelOptions;
exports.getDefaultModel = getDefaultModel;
exports.isSupportedModel = isSupportedModel;
exports.OPENAI_MODEL_OPTIONS = ["gpt-5-mini", "gpt-5-nano"];
exports.GEMINI_MODEL_OPTIONS = ["gemini-2.5-flash-lite", "gemini-3.1-flash-lite-preview"];
function getModelOptions(provider) {
    return provider === "openai" ? [...exports.OPENAI_MODEL_OPTIONS] : [...exports.GEMINI_MODEL_OPTIONS];
}
function getDefaultModel(provider) {
    return getModelOptions(provider)[0];
}
function isSupportedModel(provider, model) {
    if (!model?.trim()) {
        return false;
    }
    return getModelOptions(provider).includes(model.trim());
}

  },
  "./src/plugin.js": function(module, exports, require) {
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

  },
  "./src/prompting.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProviderPrompt = buildProviderPrompt;
const utils_1 = require("./utils");
const ACTIVE_NOTE_LIMIT = 3500;
const MATCH_EXCERPT_LIMIT = 600;
function buildProviderPrompt(prompt, retrieval) {
    const sections = [];
    const vaultCitations = retrieval.vaultMatches.map((match) => (0, utils_1.createVaultCitation)(match.filePath, match.title, (0, utils_1.truncate)(match.excerpt, 140)));
    sections.push("You are answering inside an Obsidian knowledge workspace.");
    sections.push("Use vault context only when it is directly relevant to the user's request. If it is not directly relevant, ignore it completely and do not mention it.");
    sections.push("If web search is enabled, use it only when it materially improves the answer.");
    sections.push("Do not repeat the user's request. Do not greet the user. Do not say you are ObsiLLM. Do not add prefaces or commentary before the answer. Start directly with the requested output.");
    sections.push("If the user asks for a title, outline, blog post, or draft, start with the title heading itself on the first line.");
    sections.push("Never force an association between the user's request and a vault note unless the overlap is explicit and material.");
    if (retrieval.activeNote) {
        const activeNoteLines = [
            `Path: ${retrieval.activeNote.path}`,
            `Title: ${retrieval.activeNote.title}`,
            retrieval.activeNote.selection
                ? `Selected text:\n${(0, utils_1.truncate)(retrieval.activeNote.selection, 1000)}`
                : undefined,
            `Note excerpt:\n${(0, utils_1.truncate)(retrieval.activeNote.excerpt, ACTIVE_NOTE_LIMIT)}`,
        ].filter(Boolean);
        sections.push(`Active note context:\n${activeNoteLines.join("\n\n")}`);
    }
    if (retrieval.vaultMatches.length > 0) {
        const vaultLines = retrieval.vaultMatches.map((match, index) => {
            const headingText = match.headings.length > 0 ? ` | headings: ${match.headings.slice(0, 3).join(", ")}` : "";
            const tagText = match.tags.length > 0 ? ` | tags: ${match.tags.slice(0, 4).join(", ")}` : "";
            return [
                `[Vault ${index + 1}] ${match.title} (${match.filePath})${headingText}${tagText}`,
                (0, utils_1.truncate)(match.excerpt, MATCH_EXCERPT_LIMIT),
            ].join("\n");
        });
        sections.push(`Vault search context:\n${vaultLines.join("\n\n")}`);
    }
    sections.push(`User request:\n${prompt}`);
    sections.push("Write in Markdown. Be explicit when information comes from the web. Mention vault note titles only when they are directly relevant and genuinely helpful.");
    return {
        prompt: (0, utils_1.normalizeWhitespace)(sections.join("\n\n")),
        vaultCitations,
    };
}

  },
  "./src/providers/gemini.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProviderAdapter = void 0;
exports.buildGeminiRequest = buildGeminiRequest;
exports.parseGeminiResponse = parseGeminiResponse;
const obsidian_1 = require("obsidian");
const prompting_1 = require("../prompting");
const utils_1 = require("../utils");
function buildGeminiRequest(request) {
    const envelope = (0, prompting_1.buildProviderPrompt)(request.prompt, request.retrieval);
    const body = {
        system_instruction: {
            parts: [{ text: request.systemPrompt }],
        },
        contents: [
            ...request.conversation.map((turn) => ({
                role: turn.role === "assistant" ? "model" : "user",
                parts: [{ text: turn.content }],
            })),
            {
                role: "user",
                parts: [{ text: envelope.prompt }],
            },
        ],
    };
    if (request.retrieval.useWeb) {
        body.tools = [{ google_search: {} }];
    }
    return body;
}
function parseGeminiResponse(payload) {
    const candidate = payload.candidates?.[0];
    const text = candidate?.content?.parts?.map((part) => part.text ?? "").join("\n").trim() ?? "";
    const citations = candidate?.groundingMetadata?.groundingChunks
        ?.map((chunk) => chunk.web)
        .filter((web) => Boolean(web?.uri))
        .map((web) => ({
        id: `web:${web.uri}`,
        source: "web",
        title: web.title ?? web.uri,
        url: web.uri,
    })) ?? [];
    return {
        text,
        citations: (0, utils_1.uniqueCitations)(citations),
    };
}
function sanitizeProviderErrorDetail(detail) {
    const cleaned = detail?.replace(/\s+/g, " ").replace(/raw payload:.*$/i, "").trim();
    return cleaned ? cleaned.slice(0, 240) : undefined;
}
function extractGeminiErrorMessage(payload) {
    if (!payload || typeof payload !== "object") {
        return undefined;
    }
    const record = payload;
    const nestedError = record.error && typeof record.error === "object"
        ? sanitizeProviderErrorDetail(record.error.message)
        : undefined;
    return nestedError ?? sanitizeProviderErrorDetail(record.message);
}
class GeminiProviderAdapter {
    constructor(settings) {
        this.settings = settings;
        this.id = "gemini";
        this.displayName = "Gemini";
    }
    validate() {
        if (!this.settings.apiKey.trim()) {
            return "Gemini API key is missing.";
        }
        if (!this.getModel()) {
            return "Gemini model is missing.";
        }
        return undefined;
    }
    getModel() {
        return this.settings.model.trim();
    }
    async generate(request) {
        const configError = this.validate();
        if (configError) {
            throw new Error(configError);
        }
        const body = buildGeminiRequest(request);
        const model = request.model.trim();
        let responseText = "";
        let payload;
        try {
            const response = await (0, obsidian_1.requestUrl)({
                url: `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": this.settings.apiKey.trim(),
                },
            });
            responseText = response.text;
            payload = response.json;
        }
        catch (error) {
            const detail = sanitizeProviderErrorDetail(error instanceof Error ? error.message : String(error));
            throw new Error(detail ? `Gemini request failed: ${detail}` : "Gemini request failed.");
        }
        const parsed = parseGeminiResponse(payload ?? {});
        if (!parsed.text) {
            const errorMessage = extractGeminiErrorMessage(payload) ?? extractGeminiErrorMessage(safeParseJson(responseText));
            throw new Error(errorMessage ? `Gemini returned no answer: ${errorMessage}` : "Gemini returned no answer.");
        }
        const envelope = (0, prompting_1.buildProviderPrompt)(request.prompt, request.retrieval);
        return {
            provider: this.id,
            model,
            text: parsed.text,
            citations: (0, utils_1.uniqueCitations)([...envelope.vaultCitations, ...parsed.citations]),
            raw: payload,
        };
    }
}
exports.GeminiProviderAdapter = GeminiProviderAdapter;
function safeParseJson(text) {
    try {
        return JSON.parse(text);
    }
    catch {
        return undefined;
    }
}

  },
  "./src/providers/openai.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProviderAdapter = void 0;
exports.buildOpenAIRequest = buildOpenAIRequest;
exports.extractOpenAICitations = extractOpenAICitations;
exports.parseOpenAIResponse = parseOpenAIResponse;
const obsidian_1 = require("obsidian");
const prompting_1 = require("../prompting");
const utils_1 = require("../utils");
function buildOpenAIRequest(request) {
    const envelope = (0, prompting_1.buildProviderPrompt)(request.prompt, request.retrieval);
    const input = [
        ...request.conversation.map((turn) => ({
            role: turn.role,
            content: [{ type: "input_text", text: turn.content }],
        })),
        {
            role: "user",
            content: [{ type: "input_text", text: envelope.prompt }],
        },
    ];
    const body = {
        model: request.model,
        instructions: request.systemPrompt,
        input,
    };
    if (request.retrieval.useWeb) {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        body.tools = [
            {
                type: "web_search",
                ...(timezone
                    ? {
                        user_location: {
                            type: "approximate",
                            timezone,
                        },
                    }
                    : {}),
            },
        ];
        body.tool_choice = "auto";
        body.include = ["web_search_call.action.sources"];
    }
    return body;
}
function collectTextFromOpenAIOutput(output) {
    if (!Array.isArray(output)) {
        return "";
    }
    const fragments = [];
    const visit = (value) => {
        if (typeof value === "string") {
            return;
        }
        if (Array.isArray(value)) {
            value.forEach(visit);
            return;
        }
        if (!value || typeof value !== "object") {
            return;
        }
        const record = value;
        if (record.type === "output_text" && typeof record.text === "string") {
            fragments.push(record.text);
        }
        if (record.type === "text" && typeof record.text === "string") {
            fragments.push(record.text);
        }
        if (typeof record.content === "object") {
            visit(record.content);
        }
    };
    visit(output);
    return fragments.join("\n").trim();
}
function extractOpenAICitations(payload) {
    const citations = [];
    const visit = (value, parentKey) => {
        if (!value) {
            return;
        }
        if (Array.isArray(value)) {
            value.forEach((item) => visit(item, parentKey));
            return;
        }
        if (typeof value !== "object") {
            return;
        }
        const record = value;
        if ((parentKey === "sources" || "url" in record || "uri" in record) &&
            (typeof record.url === "string" || typeof record.uri === "string")) {
            const url = record.url ?? record.uri;
            const title = record.title ?? record.name ?? url ?? "Web source";
            if (url) {
                citations.push({
                    id: `web:${url}`,
                    source: "web",
                    title,
                    url,
                });
            }
        }
        for (const [key, nested] of Object.entries(record)) {
            visit(nested, key);
        }
    };
    visit(payload);
    return (0, utils_1.uniqueCitations)(citations);
}
function parseOpenAIResponse(payload) {
    const text = payload.output_text?.trim() || collectTextFromOpenAIOutput(payload.output) || "";
    return {
        text,
        citations: extractOpenAICitations(payload),
    };
}
function sanitizeProviderErrorDetail(detail) {
    const cleaned = detail?.replace(/\s+/g, " ").replace(/raw payload:.*$/i, "").trim();
    return cleaned ? cleaned.slice(0, 240) : undefined;
}
function extractOpenAIErrorMessage(payload) {
    if (!payload || typeof payload !== "object") {
        return undefined;
    }
    const record = payload;
    const nestedError = record.error && typeof record.error === "object"
        ? sanitizeProviderErrorDetail(record.error.message)
        : undefined;
    return nestedError ?? sanitizeProviderErrorDetail(record.message);
}
class OpenAIProviderAdapter {
    constructor(settings) {
        this.settings = settings;
        this.id = "openai";
        this.displayName = "OpenAI";
    }
    validate() {
        if (!this.settings.apiKey.trim()) {
            return "OpenAI API key is missing.";
        }
        if (!this.getModel()) {
            return "OpenAI model is missing.";
        }
        return undefined;
    }
    getModel() {
        return this.settings.model.trim();
    }
    async generate(request) {
        const configError = this.validate();
        if (configError) {
            throw new Error(configError);
        }
        const body = buildOpenAIRequest(request);
        let responseText = "";
        let payload;
        try {
            const response = await (0, obsidian_1.requestUrl)({
                url: "https://api.openai.com/v1/responses",
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.settings.apiKey.trim()}`,
                },
            });
            responseText = response.text;
            payload = response.json;
        }
        catch (error) {
            const detail = sanitizeProviderErrorDetail(error instanceof Error ? error.message : String(error));
            throw new Error(detail ? `OpenAI request failed: ${detail}` : "OpenAI request failed.");
        }
        const parsed = parseOpenAIResponse(payload ?? {});
        if (!parsed.text) {
            const errorMessage = extractOpenAIErrorMessage(payload) ?? extractOpenAIErrorMessage(safeParseJson(responseText));
            throw new Error(errorMessage ? `OpenAI returned no answer: ${errorMessage}` : "OpenAI returned no answer.");
        }
        const envelope = (0, prompting_1.buildProviderPrompt)(request.prompt, request.retrieval);
        return {
            provider: this.id,
            model: request.model,
            text: parsed.text,
            citations: (0, utils_1.uniqueCitations)([...envelope.vaultCitations, ...parsed.citations]),
            raw: payload,
        };
    }
}
exports.OpenAIProviderAdapter = OpenAIProviderAdapter;
function safeParseJson(text) {
    try {
        return JSON.parse(text);
    }
    catch {
        return undefined;
    }
}

  },
  "./src/retrieval/vault-index.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultIndex = void 0;
exports.buildSearchableChunks = buildSearchableChunks;
exports.rankVaultChunks = rankVaultChunks;
const obsidian_1 = require("obsidian");
const utils_1 = require("../utils");
function stripMarkdown(value) {
    return value
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
        .replace(/\[[^\]]*]\(([^)]*)\)/g, "$1")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/[*_~>-]/g, " ");
}
function splitIntoChunks(content, chunkSize, chunkOverlap) {
    const normalized = stripMarkdown(content).replace(/\r/g, "").trim();
    if (!normalized) {
        return [];
    }
    const paragraphs = normalized
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim().replace(/\s+/g, " "))
        .filter(Boolean);
    const size = (0, utils_1.clamp)(chunkSize, 400, 5000);
    const overlap = (0, utils_1.clamp)(chunkOverlap, 0, 1000);
    const chunks = [];
    let current = "";
    for (const paragraph of paragraphs) {
        if (!current) {
            current = paragraph;
            continue;
        }
        if (`${current}\n\n${paragraph}`.length <= size) {
            current = `${current}\n\n${paragraph}`;
            continue;
        }
        chunks.push(current);
        const tail = overlap > 0 ? current.slice(Math.max(0, current.length - overlap)) : "";
        current = `${tail}${tail ? "\n\n" : ""}${paragraph}`.trim();
    }
    if (current) {
        chunks.push(current);
    }
    return chunks;
}
function parseFrontmatterArray(value) {
    if (Array.isArray(value)) {
        return value.flatMap((entry) => parseFrontmatterArray(entry));
    }
    if (typeof value === "string") {
        return value
            .split(/[,\n]/)
            .map((part) => part.trim())
            .filter(Boolean);
    }
    return [];
}
function extractMetadataLists(metadata) {
    const headings = metadata?.headings?.map((heading) => heading.heading).filter(Boolean) ?? [];
    const inlineTags = metadata?.tags?.map((tag) => tag.tag).filter(Boolean) ?? [];
    const frontmatterTags = parseFrontmatterArray(metadata?.frontmatter?.tags ?? metadata?.frontmatter?.tag);
    const aliases = parseFrontmatterArray(metadata?.frontmatter?.aliases ?? metadata?.frontmatter?.alias);
    return {
        headings,
        tags: Array.from(new Set([...inlineTags, ...frontmatterTags])),
        aliases: Array.from(new Set(aliases)),
    };
}
function buildSearchableChunks(input) {
    const { headings, tags, aliases } = extractMetadataLists(input.metadata);
    const titleNorm = (0, utils_1.normalizeForSearch)(input.title);
    const headingsNorm = (0, utils_1.normalizeForSearch)(headings.join(" "));
    const tagsNorm = (0, utils_1.normalizeForSearch)(tags.join(" "));
    const aliasesNorm = (0, utils_1.normalizeForSearch)(aliases.join(" "));
    const chunks = splitIntoChunks(input.content, input.chunkSize, input.chunkOverlap);
    return chunks.map((chunk, index) => ({
        id: `${input.path}::${index}`,
        filePath: input.path,
        title: input.title,
        titleNorm,
        headings,
        headingsNorm,
        tags,
        tagsNorm,
        aliases,
        aliasesNorm,
        excerpt: (0, utils_1.truncate)(chunk.trim(), 700),
        textNorm: (0, utils_1.normalizeForSearch)(chunk),
        lastModified: input.lastModified,
    }));
}
function rankVaultChunks(query, chunks, limit, now = Date.now()) {
    const tokens = (0, utils_1.tokenize)(query);
    const normalizedPhrase = (0, utils_1.normalizeForSearch)(query);
    if (tokens.length === 0) {
        return [];
    }
    const scored = chunks
        .map((chunk) => {
        let score = 0;
        for (const token of tokens) {
            score += (0, utils_1.countTermOccurrences)(chunk.titleNorm, token) * 5.5;
            score += (0, utils_1.countTermOccurrences)(chunk.headingsNorm, token) * 3.5;
            score += (0, utils_1.countTermOccurrences)(chunk.tagsNorm, token) * 4.5;
            score += (0, utils_1.countTermOccurrences)(chunk.aliasesNorm, token) * 4.5;
            score += (0, utils_1.countTermOccurrences)(chunk.textNorm, token) * 1.2;
        }
        if (normalizedPhrase && chunk.titleNorm.includes(normalizedPhrase)) {
            score += 7;
        }
        if (normalizedPhrase && chunk.textNorm.includes(normalizedPhrase)) {
            score += 2.5;
        }
        const ageDays = Math.max(0, (now - chunk.lastModified) / 86400000);
        const recencyBonus = Math.max(0, 1 - ageDays / 45) * 0.9;
        score += recencyBonus;
        return {
            chunk,
            score,
        };
    })
        .filter((entry) => entry.score > 0)
        .sort((left, right) => right.score - left.score || right.chunk.lastModified - left.chunk.lastModified);
    return scored.slice(0, limit).map(({ chunk, score }) => ({
        id: chunk.id,
        filePath: chunk.filePath,
        title: chunk.title,
        excerpt: chunk.excerpt,
        headings: chunk.headings,
        tags: chunk.tags,
        aliases: chunk.aliases,
        score,
        lastModified: chunk.lastModified,
    }));
}
class VaultIndex {
    constructor(app, getSettings) {
        this.app = app;
        this.getSettings = getSettings;
        this.chunks = new Map();
        this.fileChunkIds = new Map();
        this.buildPromise = null;
    }
    async ensureReady() {
        if (!this.buildPromise) {
            this.buildPromise = this.rebuild();
        }
        await this.buildPromise;
    }
    async rebuild() {
        this.chunks.clear();
        this.fileChunkIds.clear();
        const files = this.app.vault.getMarkdownFiles();
        for (const file of files) {
            await this.indexFile(file);
        }
    }
    async indexFile(file) {
        if (file.extension !== "md") {
            return;
        }
        this.removeFile(file.path);
        const settings = this.getSettings();
        const content = await this.app.vault.cachedRead(file);
        const metadata = this.app.metadataCache.getFileCache(file) ?? undefined;
        const chunks = buildSearchableChunks({
            path: file.path,
            title: file.basename,
            lastModified: file.stat.mtime,
            content,
            metadata,
            chunkSize: settings.chunkSize,
            chunkOverlap: settings.chunkOverlap,
        });
        this.fileChunkIds.set(file.path, chunks.map((chunk) => chunk.id));
        for (const chunk of chunks) {
            this.chunks.set(chunk.id, chunk);
        }
    }
    removeFile(path) {
        const chunkIds = this.fileChunkIds.get(path) ?? [];
        for (const chunkId of chunkIds) {
            this.chunks.delete(chunkId);
        }
        this.fileChunkIds.delete(path);
    }
    async onFileChanged(file) {
        if (file instanceof obsidian_1.TFile && file.extension === "md") {
            await this.indexFile(file);
        }
    }
    onFileDeleted(file) {
        if (file instanceof obsidian_1.TFile) {
            this.removeFile(file.path);
        }
    }
    async onFileRenamed(file, oldPath) {
        this.removeFile(oldPath);
        if (file instanceof obsidian_1.TFile && file.extension === "md") {
            await this.indexFile(file);
        }
    }
    search(query, options) {
        const settings = this.getSettings();
        const chunks = Array.from(this.chunks.values()).filter((chunk) => chunk.filePath !== options?.excludePath);
        return rankVaultChunks(query, chunks, options?.limit ?? settings.maxVaultResults);
    }
}
exports.VaultIndex = VaultIndex;

  },
  "./src/settings.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObsiLLMSettingTab = exports.DEFAULT_SETTINGS = void 0;
const obsidian_1 = require("obsidian");
const i18n_1 = require("./i18n");
const model_options_1 = require("./model-options");
exports.DEFAULT_SETTINGS = {
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
    systemPrompt: (0, i18n_1.getDefaultSystemPrompt)("ko"),
    defaultUseVault: true,
    defaultUseWeb: true,
    defaultIncludeSources: false,
    maxVaultResults: 5,
    chunkSize: 1200,
    chunkOverlap: 180,
    createNoteFolder: "ObsiLLM Drafts",
};
class ObsiLLMSettingTab extends obsidian_1.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const strings = (0, i18n_1.getStrings)(this.plugin.settings.language);
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: strings.settingsTitle });
        containerEl.createEl("p", {
            text: strings.settingsDescription,
        });
        new obsidian_1.Setting(containerEl)
            .setName(strings.language)
            .setDesc(strings.languageDescription)
            .addDropdown((dropdown) => dropdown
            .addOption("en", strings.languageEn)
            .addOption("ko", strings.languageKo)
            .addOption("jp", strings.languageJp)
            .setValue(this.plugin.settings.language)
            .onChange(async (value) => {
            this.plugin.settings.language = value;
            this.plugin.settings.systemPrompt = (0, i18n_1.getDefaultSystemPrompt)(this.plugin.settings.language);
            await this.plugin.saveSettings();
            await this.plugin.refreshChatViews();
            this.display();
        }));
        new obsidian_1.Setting(containerEl)
            .setName(strings.defaultProvider)
            .setDesc(strings.defaultProviderDescription)
            .addDropdown((dropdown) => dropdown
            .addOption("openai", "OpenAI")
            .addOption("gemini", "Gemini")
            .setValue(this.plugin.settings.defaultProvider)
            .onChange(async (value) => {
            this.plugin.settings.defaultProvider = value;
            await this.plugin.saveSettings();
            await this.plugin.refreshChatViews();
        }));
        new obsidian_1.Setting(containerEl)
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
        new obsidian_1.Setting(containerEl)
            .setName(strings.openaiModel)
            .setDesc(strings.openaiModelDescription)
            .addDropdown((dropdown) => model_options_1.OPENAI_MODEL_OPTIONS.reduce((current, model) => current.addOption(model, model), dropdown)
            .setValue(this.plugin.settings.openai.model)
            .onChange(async (value) => {
            this.plugin.settings.openai.model = value;
            await this.plugin.saveSettings();
            await this.plugin.refreshChatViews();
        }));
        new obsidian_1.Setting(containerEl)
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
        new obsidian_1.Setting(containerEl)
            .setName(strings.geminiModel)
            .setDesc(strings.geminiModelDescription)
            .addDropdown((dropdown) => model_options_1.GEMINI_MODEL_OPTIONS.reduce((current, model) => current.addOption(model, model), dropdown)
            .setValue(this.plugin.settings.gemini.model)
            .onChange(async (value) => {
            this.plugin.settings.gemini.model = value;
            await this.plugin.saveSettings();
            await this.plugin.refreshChatViews();
        }));
        new obsidian_1.Setting(containerEl)
            .setName(strings.systemPrompt)
            .setDesc(strings.systemPromptDescription)
            .addTextArea((text) => text.setValue(this.plugin.settings.systemPrompt).onChange(async (value) => {
            this.plugin.settings.systemPrompt = value.trim();
            await this.plugin.saveSettings();
        }));
        new obsidian_1.Setting(containerEl)
            .setName(strings.defaultVaultRetrieval)
            .setDesc(strings.defaultVaultRetrievalDescription)
            .addToggle((toggle) => toggle.setValue(this.plugin.settings.defaultUseVault).onChange(async (value) => {
            this.plugin.settings.defaultUseVault = value;
            await this.plugin.saveSettings();
            await this.plugin.refreshChatViews();
        }));
        new obsidian_1.Setting(containerEl)
            .setName(strings.defaultWebGrounding)
            .setDesc(strings.defaultWebGroundingDescription)
            .addToggle((toggle) => toggle.setValue(this.plugin.settings.defaultUseWeb).onChange(async (value) => {
            this.plugin.settings.defaultUseWeb = value;
            await this.plugin.saveSettings();
            await this.plugin.refreshChatViews();
        }));
        new obsidian_1.Setting(containerEl)
            .setName(strings.defaultIncludeSources)
            .setDesc(strings.defaultIncludeSourcesDescription)
            .addToggle((toggle) => toggle.setValue(this.plugin.settings.defaultIncludeSources).onChange(async (value) => {
            this.plugin.settings.defaultIncludeSources = value;
            await this.plugin.saveSettings();
            await this.plugin.refreshChatViews();
        }));
        new obsidian_1.Setting(containerEl)
            .setName(strings.maxVaultResults)
            .setDesc(strings.maxVaultResultsDescription)
            .addSlider((slider) => slider
            .setLimits(1, 10, 1)
            .setValue(this.plugin.settings.maxVaultResults)
            .setDynamicTooltip()
            .onChange(async (value) => {
            this.plugin.settings.maxVaultResults = value;
            await this.plugin.saveSettings();
        }));
        new obsidian_1.Setting(containerEl)
            .setName(strings.chunkSize)
            .setDesc(strings.chunkSizeDescription)
            .addSlider((slider) => slider
            .setLimits(600, 2400, 50)
            .setValue(this.plugin.settings.chunkSize)
            .setDynamicTooltip()
            .onChange(async (value) => {
            this.plugin.settings.chunkSize = value;
            await this.plugin.saveSettings();
        }));
        new obsidian_1.Setting(containerEl)
            .setName(strings.chunkOverlap)
            .setDesc(strings.chunkOverlapDescription)
            .addSlider((slider) => slider
            .setLimits(0, 400, 10)
            .setValue(this.plugin.settings.chunkOverlap)
            .setDynamicTooltip()
            .onChange(async (value) => {
            this.plugin.settings.chunkOverlap = value;
            await this.plugin.saveSettings();
        }));
        new obsidian_1.Setting(containerEl)
            .setName(strings.createNoteFolder)
            .setDesc(strings.createNoteFolderDescription)
            .addText((text) => text
            .setPlaceholder("ObsiLLM Drafts")
            .setValue(this.plugin.settings.createNoteFolder)
            .onChange(async (value) => {
            this.plugin.settings.createNoteFolder = value.trim();
            await this.plugin.saveSettings();
        }));
    }
}
exports.ObsiLLMSettingTab = ObsiLLMSettingTab;

  },
  "./src/types.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

  },
  "./src/ui/chat-view.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObsiLLMChatView = exports.OBSILLM_VIEW_TYPE = void 0;
const obsidian_1 = require("obsidian");
const insertion_1 = require("../insertion");
const model_options_1 = require("../model-options");
const utils_1 = require("../utils");
exports.OBSILLM_VIEW_TYPE = "obsillm-chat-view";
class ObsiLLMChatView extends obsidian_1.ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this.providerButtons = {};
        this.entries = [];
    }
    getViewType() {
        return exports.OBSILLM_VIEW_TYPE;
    }
    getDisplayText() {
        return "ObsiLLM";
    }
    getIcon() {
        return "bot";
    }
    async onOpen() {
        await this.refresh();
    }
    async refresh() {
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
    setPrompt(prompt) {
        this.promptInput.value = prompt;
        this.promptInput.focus();
    }
    async runPrompt(prompt, options) {
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
    renderLayout() {
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
        this.includeSourcesToggle = this.createToggle(toggles, strings.includeSources, this.plugin.settings.defaultIncludeSources);
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
    setProvider(provider, preferredModel) {
        this.selectedProvider = provider;
        for (const [providerId, button] of Object.entries(this.providerButtons)) {
            button?.classList.toggle("is-active", providerId === provider);
        }
        this.populateModelOptions(provider, preferredModel ?? this.plugin.getModelForProvider(provider));
    }
    createToggle(container, label, checked) {
        const wrapper = container.createEl("label", { cls: "obsillm-toggle" });
        const input = wrapper.createEl("input", { type: "checkbox" });
        input.checked = checked;
        wrapper.createSpan({ text: label });
        return input;
    }
    populateModelOptions(provider, preferredModel) {
        const options = (0, model_options_1.getModelOptions)(provider);
        this.modelSelect.empty();
        for (const model of options) {
            this.modelSelect.createEl("option", {
                value: model,
                text: model,
            });
        }
        this.modelSelect.value = options.includes(preferredModel) ? preferredModel : options[0];
    }
    getActionSuccessText(mode) {
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
    getGenerationOptions() {
        const provider = this.selectedProvider;
        return {
            provider,
            model: this.modelSelect.value || this.plugin.getModelForProvider(provider),
            useVault: this.vaultToggle.checked,
            useWeb: this.webToggle.checked,
        };
    }
    async autoDraftCurrentNote() {
        const strings = this.plugin.getStrings();
        this.statusEl.setText(strings.autoDraftingCurrentNote);
        try {
            await this.plugin.autoDraftCurrentNote(this.getGenerationOptions());
            this.statusEl.setText(strings.currentNoteAutoDrafted);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.statusEl.setText(message);
            new obsidian_1.Notice(message);
        }
    }
    async autoDraftChildNotes() {
        const strings = this.plugin.getStrings();
        this.statusEl.setText(strings.autoDraftingChildNotes);
        try {
            const count = await this.plugin.autoDraftChildNotes(this.getGenerationOptions(), (current, total, title) => {
                this.statusEl.setText(`${strings.autoDraftProgress} ${current}/${total} · ${title}`);
            });
            this.statusEl.setText(`${strings.childNotesAutoDrafted} ${count}`);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.statusEl.setText(message);
            new obsidian_1.Notice(message);
        }
    }
    async submitPrompt(options) {
        const strings = this.plugin.getStrings();
        const prompt = this.promptInput.value.trim();
        if (!prompt) {
            new obsidian_1.Notice(strings.enterPromptFirst);
            return;
        }
        const provider = this.selectedProvider;
        const model = this.modelSelect.value || this.plugin.getModelForProvider(provider);
        const useVault = this.vaultToggle.checked;
        const useWeb = this.webToggle.checked;
        const targetFile = this.plugin.getResolvedMarkdownFile();
        const entry = {
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
                await this.plugin.applyResponse(entry.response, options.insertionModeAfterResponse, prompt, this.shouldIncludeSources(options.includeSources), targetFile);
                this.statusEl.setText(this.getActionSuccessText(options.insertionModeAfterResponse));
            }
        }
        catch (error) {
            entry.loading = false;
            entry.error = error instanceof Error ? error.message : String(error);
            this.statusEl.setText(strings.requestFailed);
            await this.renderTranscript();
        }
    }
    async renderTranscript() {
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
            const renderedText = (0, insertion_1.stripPromptEcho)(entry.response.text, entry.prompt);
            await (0, utils_1.renderMarkdownCompat)(this.app, renderedText, body, "", this);
            const actions = assistantMessage.createDiv({ cls: "obsillm-card-actions" });
            const resolveTargetFile = () => this.plugin.getMarkdownFileByPath(entry.targetFilePath) ?? this.plugin.getResolvedMarkdownFile();
            this.createActionButton(actions, strings.copyAnswer, async () => {
                try {
                    await (0, utils_1.copyTextToClipboard)((0, insertion_1.buildInsertionMarkdown)(entry.response, this.plugin.settings.language, this.shouldIncludeSources(), entry.prompt));
                    this.statusEl.setText(strings.copied);
                }
                catch {
                    throw new Error(strings.clipboardError);
                }
            });
            this.createActionButton(actions, strings.moveToFile, async () => {
                await this.plugin.applyResponse(entry.response, "insert-cursor", entry.prompt, this.shouldIncludeSources(), resolveTargetFile());
                this.statusEl.setText(strings.insertedToFile);
            });
            this.createActionButton(actions, strings.replaceSelection, async () => {
                await this.plugin.applyResponse(entry.response, "replace-selection", entry.prompt, this.shouldIncludeSources(), resolveTargetFile());
                this.statusEl.setText(strings.replacedSelection);
            });
            this.createActionButton(actions, strings.saveToFolder, async () => {
                const createdFile = await this.plugin.applyResponse(entry.response, "create-note", entry.prompt, this.shouldIncludeSources(), resolveTargetFile());
                entry.targetFilePath = createdFile?.path ?? entry.targetFilePath;
                this.statusEl.setText(strings.savedToFolder);
            });
            this.createActionButton(actions, strings.saveToCurrentFolder, async () => {
                const createdFile = await this.plugin.applyResponse(entry.response, "create-note-current-folder", entry.prompt, this.shouldIncludeSources(), resolveTargetFile());
                entry.targetFilePath = createdFile?.path ?? entry.targetFilePath;
                this.statusEl.setText(strings.savedToCurrentFolder);
            });
            this.createActionButton(actions, strings.createOutlineNotes, async () => {
                const count = await this.plugin.createOutlineNotes(entry.response, entry.prompt, resolveTargetFile());
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
                    }
                    else {
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
    createActionButton(container, label, action) {
        const button = container.createEl("button", { text: label, cls: "obsillm-secondary" });
        button.onclick = async () => {
            try {
                await action();
            }
            catch (error) {
                new obsidian_1.Notice(error instanceof Error ? error.message : String(error));
            }
        };
    }
    shouldIncludeSources(override) {
        return typeof override === "boolean" ? override : this.includeSourcesToggle.checked;
    }
}
exports.ObsiLLMChatView = ObsiLLMChatView;

  },
  "./src/ui/prompt-modal.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptModal = void 0;
const obsidian_1 = require("obsidian");
class PromptModal extends obsidian_1.Modal {
    constructor(app, title, initialValue = "", options = {}) {
        super(app);
        this.title = title;
        this.initialValue = initialValue;
        this.options = options;
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
            .setPlaceholder(this.options.placeholder ?? "Ask ObsiLLM...")
            .setValue(this.initialValue)
            .inputEl.addClass("obsillm-prompt-modal");
        this.textArea.inputEl.rows = this.options.rows ?? 8;
        this.textArea.inputEl.focus();
        const actions = contentEl.createDiv({ cls: "obsillm-actions" });
        new obsidian_1.ButtonComponent(actions)
            .setButtonText(this.options.cancelText ?? "Cancel")
            .setClass("obsillm-secondary")
            .onClick(() => this.finish(null));
        new obsidian_1.ButtonComponent(actions)
            .setButtonText(this.options.submitText ?? "Submit")
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

  },
  "./src/utils.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clamp = clamp;
exports.normalizeWhitespace = normalizeWhitespace;
exports.truncate = truncate;
exports.normalizeForSearch = normalizeForSearch;
exports.tokenize = tokenize;
exports.countTermOccurrences = countTermOccurrences;
exports.uniqueCitations = uniqueCitations;
exports.createVaultCitation = createVaultCitation;
exports.getSafeExternalUrl = getSafeExternalUrl;
exports.citationToMarkdown = citationToMarkdown;
exports.renderMarkdownCompat = renderMarkdownCompat;
exports.ensureFolderExists = ensureFolderExists;
exports.findOrCreateAvailablePath = findOrCreateAvailablePath;
exports.copyTextToClipboard = copyTextToClipboard;
exports.slugifyTitle = slugifyTitle;
exports.maybeFile = maybeFile;
const obsidian_1 = require("obsidian");
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
function normalizeWhitespace(value) {
    return value.replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
function truncate(value, maxLength) {
    if (value.length <= maxLength) {
        return value;
    }
    return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}
function normalizeForSearch(value) {
    return value.toLowerCase().replace(/[^\p{L}\p{N}\s#/_-]+/gu, " ").replace(/\s+/g, " ").trim();
}
function tokenize(value) {
    const normalized = normalizeForSearch(value);
    if (!normalized) {
        return [];
    }
    return Array.from(new Set(normalized.split(" ").filter((token) => token.length > 1)));
}
function countTermOccurrences(haystack, term) {
    if (!haystack || !term) {
        return 0;
    }
    let count = 0;
    let index = haystack.indexOf(term);
    while (index >= 0) {
        count += 1;
        index = haystack.indexOf(term, index + term.length);
    }
    return count;
}
function uniqueCitations(citations) {
    const seen = new Set();
    const result = [];
    for (const citation of citations) {
        const key = citation.url ?? citation.filePath ?? `${citation.source}:${citation.title}`;
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        result.push(citation);
    }
    return result;
}
function createVaultCitation(filePath, title, excerpt) {
    return {
        id: `vault:${filePath}`,
        source: "vault",
        title,
        filePath,
        excerpt,
    };
}
function getSafeExternalUrl(value) {
    if (!value?.trim()) {
        return null;
    }
    try {
        const url = new URL(value);
        if (url.protocol === "http:" || url.protocol === "https:") {
            return url.toString();
        }
    }
    catch {
        return null;
    }
    return null;
}
function citationToMarkdown(citation) {
    if (citation.source === "vault" && citation.filePath) {
        const wikiPath = citation.filePath.replace(/\.md$/i, "");
        const detail = citation.excerpt ? ` - ${citation.excerpt}` : "";
        return `- [[${wikiPath}|${citation.title}]]${detail}`;
    }
    const url = getSafeExternalUrl(citation.url);
    return url ? `- [${citation.title}](${url})` : `- ${citation.title}`;
}
async function renderMarkdownCompat(app, markdown, container, sourcePath, component) {
    const renderer = obsidian_1.MarkdownRenderer;
    if (typeof renderer.render === "function") {
        await renderer.render(app, markdown, container, sourcePath, component);
        return;
    }
    if (typeof renderer.renderMarkdown === "function") {
        await renderer.renderMarkdown(markdown, container, sourcePath, component);
        return;
    }
    container.setText(markdown);
}
async function ensureFolderExists(app, folderPath) {
    const normalized = (0, obsidian_1.normalizePath)(folderPath.trim());
    if (!normalized) {
        return;
    }
    const parts = normalized.split("/").filter(Boolean);
    let current = "";
    for (const part of parts) {
        current = current ? `${current}/${part}` : part;
        if (!app.vault.getAbstractFileByPath(current)) {
            await app.vault.createFolder(current);
        }
    }
}
async function findOrCreateAvailablePath(app, proposedPath) {
    const normalized = (0, obsidian_1.normalizePath)(proposedPath);
    const existing = app.vault.getAbstractFileByPath(normalized);
    if (!existing) {
        return normalized;
    }
    const extensionMatch = normalized.match(/(\.[^.]+)$/);
    const extension = extensionMatch?.[1] ?? "";
    const base = extension ? normalized.slice(0, -extension.length) : normalized;
    let index = 2;
    while (app.vault.getAbstractFileByPath(`${base} ${index}${extension}`)) {
        index += 1;
    }
    return `${base} ${index}${extension}`;
}
async function copyTextToClipboard(text) {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }
    const electronRequire = window.require;
    if (typeof electronRequire === "function") {
        const electron = electronRequire("electron");
        if (electron.clipboard) {
            electron.clipboard.writeText(text);
            return;
        }
    }
    throw new Error("Clipboard is unavailable.");
}
function slugifyTitle(value) {
    const cleaned = value
        .trim()
        .replace(/[<>:"/\\|?*\u0000-\u001F]+/g, " ")
        .replace(/\s+/g, " ");
    return cleaned || "ObsiLLM Draft";
}
function maybeFile(value) {
    return value instanceof obsidian_1.TFile;
}

  }
};
const __cache__ = {};
function __normalizePath__(value) {
  const input = String(value || "").replace(/\\/g, "/");
  const isAbsolute = input.startsWith("/");
  const parts = [];
  for (const part of input.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") {
      if (parts.length && parts[parts.length - 1] !== "..") parts.pop();
      else if (!isAbsolute) parts.push("..");
      continue;
    }
    parts.push(part);
  }
  const normalized = parts.join("/");
  if (isAbsolute) return `/${normalized}`;
  return `./${normalized.replace(/^\.\//, "")}`;
}
function __resolveLocal__(from, request) {
  const fromParts = String(from || "./main.js").replace(/\\/g, "/").split("/");
  fromParts.pop();
  const requestParts = String(request).split("/");
  const combined = fromParts.concat(requestParts);
  const normalized = __normalizePath__(combined.join("/"));
  const candidates = [normalized, `${normalized}.js`, `${normalized}/index.js`];
  for (const candidate of candidates) {
    if (__modules__[candidate]) return candidate;
  }
  return normalized;
}
function __bundle_require__(from, request) {
  const resolved = String(request).startsWith(".") ? __resolveLocal__(from, request) : request;
  if (__modules__[resolved]) {
    if (!__cache__[resolved]) {
      const module = { exports: {} };
      __cache__[resolved] = module;
      __modules__[resolved](module, module.exports, (childRequest) => __bundle_require__(resolved, childRequest));
    }
    return __cache__[resolved].exports;
  }
  if (__native_require__) return __native_require__(request);
  throw new Error(`Cannot resolve module: ${request}`);
}
const __entry__ = __bundle_require__("./main.js", "./src/plugin.js");
module.exports = __entry__ && __entry__.default ? __entry__.default : __entry__;
