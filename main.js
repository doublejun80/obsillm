"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ObsiLLMPlugin
});
module.exports = __toCommonJS(main_exports);

// src/plugin.ts
var import_obsidian9 = require("obsidian");

// src/i18n.ts
var LEGACY_DEFAULT_SYSTEM_PROMPT = "You are ObsiLLM, an Obsidian writing assistant. Write concise, grounded Markdown. Prefer provided vault context when it is relevant, and clearly separate note-derived context from live web information.";
var DEFAULT_SYSTEM_PROMPTS = {
  en: `${LEGACY_DEFAULT_SYSTEM_PROMPT} Answer in English unless the user explicitly asks for another language. Do not repeat the user's request. Do not greet the user. Do not say you are ObsiLLM. Do not add prefaces like 'Here is a proposal' or 'Based on your request'. Start directly with the deliverable in Markdown. If the user asks for a title, outline, article, or draft, start with the title itself as the first heading.`,
  ko: "\uB2F9\uC2E0\uC740 ObsiLLM\uC774\uBA70, Obsidian\uC5D0\uC11C \uB3D9\uC791\uD558\uB294 \uAE00\uC4F0\uAE30 \uB3C4\uC6B0\uBBF8\uC785\uB2C8\uB2E4. \uC0AC\uC6A9\uC790\uAC00 \uB2E4\uB978 \uC5B8\uC5B4\uB97C \uBA85\uC2DC\uD558\uC9C0 \uC54A\uC73C\uBA74 \uD56D\uC0C1 \uD55C\uAD6D\uC5B4\uB85C \uB2F5\uBCC0\uD558\uC138\uC694. \uAC04\uACB0\uD558\uACE0 \uADFC\uAC70 \uC788\uB294 Markdown\uC73C\uB85C \uC791\uC131\uD558\uACE0, vault \uBB38\uB9E5\uC774 \uAD00\uB828 \uC788\uC744 \uB54C \uC6B0\uC120 \uD65C\uC6A9\uD558\uC138\uC694. \uC6F9 \uC815\uBCF4\uB97C \uC0AC\uC6A9\uD588\uB2E4\uBA74 \uB178\uD2B8 \uAE30\uBC18 \uC815\uBCF4\uC640 \uBA85\uD655\uD788 \uAD6C\uBD84\uD558\uC138\uC694. \uC0AC\uC6A9\uC790\uC758 \uC694\uCCAD\uC744 \uB2E4\uC2DC \uC4F0\uC9C0 \uB9C8\uC138\uC694. \uC778\uC0AC\uB9D0\uC744 \uC4F0\uC9C0 \uB9C8\uC138\uC694. \uC790\uC2E0\uC744 ObsiLLM\uC774\uB77C\uACE0 \uC18C\uAC1C\uD558\uC9C0 \uB9C8\uC138\uC694. '\uC694\uCCAD\uD558\uC2E0 \uB0B4\uC6A9\uC744 \uBC14\uD0D5\uC73C\uB85C', '\uC81C\uC548\uC744 \uB4DC\uB9BD\uB2C8\uB2E4' \uAC19\uC740 \uB9D0\uBA38\uB9AC\uB97C \uC4F0\uC9C0 \uB9C8\uC138\uC694. \uBC14\uB85C \uACB0\uACFC\uBB3C\uBD80\uD130 \uC2DC\uC791\uD558\uC138\uC694. \uC81C\uBAA9, \uBAA9\uCC28, \uCD08\uC548, \uAE00 \uAD6C\uC870\uB97C \uC694\uCCAD\uBC1B\uC73C\uBA74 \uCCAB \uC904\uC740 \uBC14\uB85C \uC81C\uBAA9 \uD5E4\uB529\uC73C\uB85C \uC2DC\uC791\uD558\uC138\uC694.",
  ja: "\u3042\u306A\u305F\u306F ObsiLLM \u3067\u3042\u308A\u3001Obsidian \u4E0A\u3067\u52D5\u4F5C\u3059\u308B\u6587\u7AE0\u652F\u63F4\u30A2\u30B7\u30B9\u30BF\u30F3\u30C8\u3067\u3059\u3002\u30E6\u30FC\u30B6\u30FC\u304C\u5225\u306E\u8A00\u8A9E\u3092\u660E\u793A\u3057\u306A\u3044\u9650\u308A\u3001\u5E38\u306B\u65E5\u672C\u8A9E\u3067\u56DE\u7B54\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u7C21\u6F54\u3067\u6839\u62E0\u306E\u3042\u308B Markdown \u3092\u66F8\u304D\u3001vault \u306E\u6587\u8108\u304C\u95A2\u9023\u3059\u308B\u5834\u5408\u306F\u512A\u5148\u3057\u3066\u6D3B\u7528\u3057\u3066\u304F\u3060\u3055\u3044\u3002Web \u60C5\u5831\u3092\u4F7F\u3063\u305F\u5834\u5408\u306F\u30CE\u30FC\u30C8\u7531\u6765\u306E\u60C5\u5831\u3068\u660E\u78BA\u306B\u533A\u5225\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u30E6\u30FC\u30B6\u30FC\u306E\u4F9D\u983C\u3092\u8A00\u3044\u76F4\u3055\u306A\u3044\u3067\u304F\u3060\u3055\u3044\u3002\u6328\u62F6\u3092\u66F8\u304B\u306A\u3044\u3067\u304F\u3060\u3055\u3044\u3002ObsiLLM \u3068\u81EA\u5DF1\u7D39\u4ECB\u3057\u306A\u3044\u3067\u304F\u3060\u3055\u3044\u3002\u300E\u3054\u4F9D\u983C\u306E\u5185\u5BB9\u3092\u3082\u3068\u306B\u300F\u306E\u3088\u3046\u306A\u524D\u7F6E\u304D\u3092\u66F8\u304B\u305A\u3001\u7D50\u679C\u304B\u3089\u59CB\u3081\u3066\u304F\u3060\u3055\u3044\u3002\u30BF\u30A4\u30C8\u30EB\u3084\u69CB\u6210\u6848\u3001\u4E0B\u66F8\u304D\u3092\u6C42\u3081\u3089\u308C\u305F\u3089\u3001\u6700\u521D\u306E\u884C\u3092\u305D\u306E\u307E\u307E\u30BF\u30A4\u30C8\u30EB\u898B\u51FA\u3057\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002"
};
function getDefaultSystemPrompt(language) {
  return DEFAULT_SYSTEM_PROMPTS[language] ?? DEFAULT_SYSTEM_PROMPTS.en;
}
function isDefaultSystemPrompt(value) {
  const normalized = value?.trim();
  if (!normalized) {
    return true;
  }
  return normalized === LEGACY_DEFAULT_SYSTEM_PROMPT || Object.values(DEFAULT_SYSTEM_PROMPTS).includes(normalized);
}
var STRINGS = {
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
    draftCommandSuccess: "Auto-draft finished.",
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
    outlineParentLabel: "Parent topic",
    outlineDetailHeading: "Details",
    outlineDraftHeading: "Draft",
    outlineDetailPlaceholder: "Outline the key subtopics for this section.",
    emptyListPlaceholder: "Empty",
    emptySiblingPlaceholder: "None",
    missingParentOutlinePlaceholder: "Parent outline not found.",
    autoDraftDetailPlaceholder: "Outline the key subtopics for this note.",
    autoDraftBodyPlaceholder: "The draft body could not be generated.",
    fallbackTag: "Other"
  },
  ko: {
    ribbonOpen: "ObsiLLM \uC5F4\uAE30",
    openChatCommand: "ObsiLLM \uCC44\uD305 \uC5F4\uAE30",
    askAboutCurrentNoteCommand: "\uD604\uC7AC \uB178\uD2B8\uC5D0 \uB300\uD574 ObsiLLM\uC5D0\uAC8C \uBB3B\uAE30",
    draftCurrentNoteCommand: "\uD604\uC7AC \uB178\uD2B8 \uC790\uB3D9 \uC791\uC131",
    draftChildNotesCommand: "\uD558\uC704 \uB178\uD2B8 \uC804\uCCB4 \uC790\uB3D9 \uC791\uC131",
    insertCitedAnswerCommand: "ObsiLLM \uB2F5\uBCC0\uC744 \uD604\uC7AC \uB178\uD2B8\uC5D0 \uB123\uAE30",
    askCurrentNoteTitle: "\uD604\uC7AC \uB178\uD2B8\uC5D0 \uB300\uD574 \uBB3B\uAE30",
    askCurrentNotePlaceholder: "\uD604\uC7AC \uC5F4\uB824 \uC788\uB294 \uB178\uD2B8\uC5D0\uC11C \uBB34\uC5C7\uC744 \uC54C\uACE0 \uC2F6\uB098\uC694?",
    insertCitedAnswerTitle: "\uADFC\uAC70 \uD3EC\uD568 \uB2F5\uBCC0 \uB123\uAE30",
    insertCitedAnswerPlaceholder: "\uC9C8\uBB38\uC744 \uC785\uB825\uD558\uBA74 ObsiLLM\uC774 \uD604\uC7AC \uB178\uD2B8\uC5D0 \uADFC\uAC70 \uD3EC\uD568 \uB2F5\uBCC0\uC744 \uB123\uC2B5\uB2C8\uB2E4.",
    draftPrompt: "\uD604\uC7AC \uB178\uD2B8\uB97C \uBC14\uD0D5\uC73C\uB85C \uC644\uC131\uB3C4 \uC788\uB294 \uCD08\uC548\uC744 \uC791\uC131\uD558\uC138\uC694. \uD575\uC2EC \uC544\uC774\uB514\uC5B4\uB97C \uC720\uC9C0\uD558\uACE0, \uAD6C\uC870\uB97C \uBA85\uD655\uD788 \uC815\uB9AC\uD558\uBA70, \uBB38\uB9E5\uC0C1 \uAC00\uB2A5\uD55C \uC791\uC740 \uBE48\uD2C8\uC740 \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uBCF4\uC644\uD558\uC138\uC694.",
    settingsTitle: "ObsiLLM \uC124\uC815",
    settingsDescription: "\uC5B8\uC5B4, \uC81C\uACF5\uC790, \uBAA8\uB378, \uC800\uC7A5 \uB3D9\uC791\uC744 \uBC14\uAFC9\uB2C8\uB2E4.",
    language: "\uC5B8\uC5B4",
    languageDescription: "UI \uC5B8\uC5B4\uB97C \uBC14\uAFB8\uACE0 \uD574\uB2F9 \uC5B8\uC5B4\uC5D0 \uB9DE\uB294 \uAE30\uBCF8 \uC2DC\uC2A4\uD15C \uD504\uB86C\uD504\uD2B8\uB85C \uB2E4\uC2DC \uC124\uC815\uD569\uB2C8\uB2E4.",
    languageEn: "EN",
    languageKo: "KO",
    languageJp: "JP",
    defaultProvider: "\uAE30\uBCF8 \uC81C\uACF5\uC790",
    defaultProviderDescription: "\uCC44\uD305 \uD328\uB110\uC744 \uC5F4 \uB54C \uAE30\uBCF8\uC73C\uB85C \uC120\uD0DD\uB420 \uC81C\uACF5\uC790\uC785\uB2C8\uB2E4.",
    openaiApiKey: "OpenAI API \uD0A4",
    openaiApiKeyDescription: "Obsidian \uD50C\uB7EC\uADF8\uC778 \uC124\uC815\uC5D0 \uB85C\uCEEC\uB85C \uC800\uC7A5\uB429\uB2C8\uB2E4.",
    openaiModel: "OpenAI \uBAA8\uB378",
    openaiModelDescription: "\uC6D0\uD558\uB294 OpenAI \uBAA8\uB378\uC774 \uC788\uC73C\uBA74 \uC9C1\uC811 \uBC14\uAFC0 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
    geminiApiKey: "Gemini API \uD0A4",
    geminiApiKeyDescription: "Obsidian \uD50C\uB7EC\uADF8\uC778 \uC124\uC815\uC5D0 \uB85C\uCEEC\uB85C \uC800\uC7A5\uB429\uB2C8\uB2E4.",
    geminiModel: "Gemini \uBAA8\uB378",
    geminiModelDescription: "\uAE30\uBCF8\uAC12\uC740 gemini-2.5-flash-lite \uC785\uB2C8\uB2E4. \uB354 \uC800\uB834\uD558\uACE0 \uC751\uB2F5\uC774 \uBE60\uB978 \uD3B8\uC785\uB2C8\uB2E4.",
    systemPrompt: "\uC2DC\uC2A4\uD15C \uD504\uB86C\uD504\uD2B8",
    systemPromptDescription: "\uB450 \uC81C\uACF5\uC790 \uBAA8\uB450\uC5D0 \uC801\uC6A9\uB418\uB294 \uACF5\uD1B5 \uC9C0\uC2DC\uBB38\uC785\uB2C8\uB2E4.",
    defaultVaultRetrieval: "\uAE30\uBCF8 vault \uAC80\uC0C9",
    defaultVaultRetrievalDescription: "\uC0AC\uC774\uB4DC\uBC14\uB97C \uC5F4 \uB54C vault \uAC80\uC0C9\uC744 \uAE30\uBCF8\uC73C\uB85C \uCF2D\uB2C8\uB2E4.",
    defaultWebGrounding: "\uAE30\uBCF8 \uC6F9 \uAC80\uC0C9",
    defaultWebGroundingDescription: "\uC6F9 \uAC80\uC0C9 / grounding\uC744 \uAE30\uBCF8\uC73C\uB85C \uCF2D\uB2C8\uB2E4.",
    defaultIncludeSources: "\uAE30\uBCF8 \uCD9C\uCC98 \uD3EC\uD568",
    defaultIncludeSourcesDescription: "\uBCF4\uD1B5\uC740 \uAE54\uB054\uD55C \uB2F5\uBCC0\uB9CC \uC6D0\uD558\uBA74 \uAEBC\uB450\uC138\uC694.",
    maxVaultResults: "\uCD5C\uB300 vault \uACB0\uACFC \uC218",
    maxVaultResultsDescription: "\uBAA8\uB378\uC5D0 \uC804\uB2EC\uD560 vault \uC870\uAC01 \uAC1C\uC218\uC785\uB2C8\uB2E4.",
    chunkSize: "\uCCAD\uD06C \uD06C\uAE30",
    chunkSizeDescription: "vault \uCCAD\uD06C\uC758 \uB300\uB7B5\uC801\uC778 \uAE00\uC790 \uC218 \uBAA9\uD45C\uC785\uB2C8\uB2E4.",
    chunkOverlap: "\uCCAD\uD06C \uACB9\uCE68",
    chunkOverlapDescription: "\uC778\uC811 \uCCAD\uD06C \uC0AC\uC774\uC5D0\uC11C \uACB9\uCE58\uB294 \uAE00\uC790 \uC218\uC785\uB2C8\uB2E4.",
    createNoteFolder: "\uD3F4\uB354 \uBC84\uD2BC \uC800\uC7A5 \uC704\uCE58",
    createNoteFolderDescription: "\uD3F4\uB354 \uBC84\uD2BC\uC744 \uB204\uB974\uBA74 \uC774 \uD3F4\uB354\uC5D0 \uC0C8 \uB178\uD2B8\uB85C \uC800\uC7A5\uB429\uB2C8\uB2E4.",
    workspaceTitle: "ObsiLLM \uC791\uC5C5\uACF5\uAC04",
    workspaceDescription: "Vault \uBB38\uB9E5\uACFC \uC6F9 \uAC80\uC0C9\uC744 \uD568\uAED8 \uC0AC\uC6A9\uD574 \uB2F5\uBCC0\uC744 \uB9CC\uB4E4\uACE0, \uACB0\uACFC\uB97C \uBCF5\uC0AC\uD558\uAC70\uB098 \uD604\uC7AC \uB178\uD2B8\uC5D0 \uB123\uAC70\uB098 \uC120\uD0DD \uC601\uC5ED\uC744 \uBC14\uAFB8\uAC70\uB098 \uC124\uC815\uD55C \uD3F4\uB354\uC5D0 \uC0C8 \uB178\uD2B8\uB85C \uC800\uC7A5\uD558\uAC70\uB098 \uD604\uC7AC \uB178\uD2B8\uC640 \uAC19\uC740 \uD3F4\uB354\uC5D0 \uC0C8 \uB178\uD2B8\uB85C \uC800\uC7A5\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
    provider: "\uC81C\uACF5\uC790",
    model: "\uBAA8\uB378",
    modelPlaceholder: "\uC9C1\uC811 \uBAA8\uB378 ID \uC785\uB825",
    vaultContext: "Vault \uBB38\uB9E5",
    webGrounding: "\uC6F9 \uAC80\uC0C9",
    includeSources: "\uCD9C\uCC98 \uD3EC\uD568",
    prompt: "\uD504\uB86C\uD504\uD2B8",
    promptPlaceholder: "\uC9C8\uBB38\uD558\uAC70\uB098, \uCD08\uC548\uC744 \uC694\uCCAD\uD558\uAC70\uB098, ObsiLLM\uC5D0\uAC8C \uBB34\uC5C7\uC744 \uC4F8\uC9C0 \uC54C\uB824\uC8FC\uC138\uC694.",
    askButton: "ObsiLLM\uC5D0\uAC8C \uBB3B\uAE30",
    clearChat: "\uB300\uD654 \uBE44\uC6B0\uAE30",
    ready: "\uC900\uBE44\uB428",
    chatCleared: "\uB300\uD654\uB97C \uBE44\uC6E0\uC2B5\uB2C8\uB2E4.",
    enterPromptFirst: "\uBA3C\uC800 \uD504\uB86C\uD504\uD2B8\uB97C \uC785\uB825\uD558\uC138\uC694.",
    generatingResponse: "\uB2F5\uBCC0\uC744 \uC0DD\uC131\uD558\uB294 \uC911\uC785\uB2C8\uB2E4...",
    completedWith: "\uC751\uB2F5 \uC644\uB8CC",
    requestFailed: "\uC694\uCCAD\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.",
    transcriptEmpty: "\uC5EC\uAE30\uC5D0 \uB300\uD654\uAC00 \uD45C\uC2DC\uB429\uB2C8\uB2E4. \uC9C8\uBB38\uD558\uAC70\uB098, \uB178\uD2B8 \uCD08\uC548\uC744 \uB9CC\uB4E4\uAC70\uB098, vault \uBB38\uB9E5\uACFC \uC6F9 \uAC80\uC0C9\uC744 \uD568\uAED8 \uC368\uBCF4\uC138\uC694.",
    user: "\uC0AC\uC6A9\uC790",
    assistant: "ObsiLLM",
    working: "\uC791\uC5C5 \uC911...",
    error: "\uC624\uB958",
    noResponse: "\uC751\uB2F5\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
    retrievingContext: "\uBB38\uB9E5\uC744 \uBAA8\uC73C\uACE0 \uBAA8\uB378\uC5D0 \uC694\uCCAD\uD558\uB294 \uC911\uC785\uB2C8\uB2E4...",
    copyAnswer: "\uBCF5\uC0AC",
    moveToFile: "\uD604\uC7AC \uB178\uD2B8\uC5D0 \uB123\uAE30",
    replaceSelection: "\uC120\uD0DD \uAD50\uCCB4",
    saveToFolder: "\uD3F4\uB354\uC5D0 \uC0C8 \uB178\uD2B8 \uC800\uC7A5",
    saveToCurrentFolder: "\uD604\uC7AC \uD3F4\uB354\uC5D0 \uC0C8 \uB178\uD2B8 \uC800\uC7A5",
    createOutlineNotes: "\uBAA9\uCC28\uB85C \uD558\uC704 \uB178\uD2B8 \uB9CC\uB4E4\uAE30",
    autoDraftCurrentNote: "\uD604\uC7AC \uB178\uD2B8 \uC790\uB3D9 \uC791\uC131",
    autoDraftChildNotes: "\uD558\uC704 \uB178\uD2B8 \uC804\uCCB4 \uC790\uB3D9 \uC791\uC131",
    copied: "\uD074\uB9BD\uBCF4\uB4DC\uC5D0 \uBCF5\uC0AC\uD588\uC2B5\uB2C8\uB2E4.",
    insertedToFile: "\uD604\uC7AC \uB178\uD2B8\uC5D0 \uB123\uC5C8\uC2B5\uB2C8\uB2E4.",
    replacedSelection: "\uC120\uD0DD\uD55C \uD14D\uC2A4\uD2B8\uB97C \uBC14\uAFE8\uC2B5\uB2C8\uB2E4.",
    savedToFolder: "\uC124\uC815\uD55C \uD3F4\uB354\uC5D0 \uC0C8 \uB178\uD2B8\uB85C \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4.",
    savedToCurrentFolder: "\uD604\uC7AC \uB178\uD2B8\uC640 \uAC19\uC740 \uD3F4\uB354\uC5D0 \uC0C8 \uB178\uD2B8\uB85C \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4.",
    outlineNotesCreated: "\uBAA9\uCC28 \uAE30\uC900\uC73C\uB85C \uD558\uC704 \uB178\uD2B8\uB97C \uB9CC\uB4E4\uC5C8\uC2B5\uB2C8\uB2E4:",
    autoDraftingCurrentNote: "\uD604\uC7AC \uB178\uD2B8 \uC790\uB3D9 \uC791\uC131 \uC911\uC785\uB2C8\uB2E4...",
    autoDraftingChildNotes: "\uD558\uC704 \uB178\uD2B8 \uC804\uCCB4 \uC790\uB3D9 \uC791\uC131 \uC911\uC785\uB2C8\uB2E4...",
    autoDraftProgress: "\uC790\uB3D9 \uC791\uC131 \uC911",
    currentNoteAutoDrafted: "\uD604\uC7AC \uB178\uD2B8 \uCD08\uC548\uC744 \uCC44\uC6E0\uC2B5\uB2C8\uB2E4.",
    childNotesAutoDrafted: "\uD558\uC704 \uB178\uD2B8 \uCD08\uC548\uC744 \uCC44\uC6E0\uC2B5\uB2C8\uB2E4:",
    draftCommandSuccess: "\uC790\uB3D9 \uC791\uC131\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
    sources: "\uCD9C\uCC98",
    vaultOn: "Vault",
    vaultOff: "Vault \uB054",
    webOn: "Web",
    webOff: "Web \uB054",
    promptCancel: "\uCDE8\uC18C",
    promptSubmit: "\uD655\uC778",
    noActiveEditor: "\uB2F5\uBCC0\uC744 \uD30C\uC77C\uB85C \uC62E\uAE30\uB824\uBA74 \uBA3C\uC800 Markdown \uB178\uD2B8\uB97C \uC5F4\uC5B4\uC8FC\uC138\uC694.",
    noActiveFileForCurrentFolderSave: "\uD604\uC7AC \uD3F4\uB354\uC5D0 \uC800\uC7A5\uD558\uB824\uBA74 \uBA3C\uC800 Markdown \uB178\uD2B8\uB97C \uC5F4\uC5B4\uC8FC\uC138\uC694.",
    noActiveFileForOutlineCreate: "\uBAA9\uCC28\uB85C \uD558\uC704 \uB178\uD2B8\uB97C \uB9CC\uB4E4\uB824\uBA74 \uBA3C\uC800 Markdown \uB178\uD2B8\uB97C \uC5F4\uC5B4\uC8FC\uC138\uC694.",
    noActiveFileForAutoDraft: "\uC790\uB3D9 \uC791\uC131\uD558\uB824\uBA74 \uBA3C\uC800 Markdown \uB178\uD2B8\uB97C \uC5F4\uC5B4\uC8FC\uC138\uC694.",
    autoDraftNeedsChildNote: "\uC774 \uB3D9\uC791\uC740 \uD558\uC704 \uB178\uD2B8\uC5D0\uC11C \uC2E4\uD589\uD558\uC138\uC694. \uBD80\uBAA8 \uB178\uD2B8\uC5D0\uC11C\uB294 \uD558\uC704 \uB178\uD2B8 \uC804\uCCB4 \uC790\uB3D9 \uC791\uC131\uC744 \uC0AC\uC6A9\uD558\uBA74 \uB429\uB2C8\uB2E4.",
    noChildNotesForAutoDraft: "\uC774 \uD3F4\uB354\uC5D0\uC11C \uC790\uB3D9 \uC791\uC131\uD560 \uD558\uC704 \uB178\uD2B8\uB97C \uCC3E\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.",
    noOutlineItemsFound: "\uC751\uB2F5\uC5D0\uC11C \uBAA9\uCC28 \uD56D\uBAA9\uC744 \uCC3E\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.",
    noSelection: "\uC120\uD0DD \uAD50\uCCB4\uB97C \uC4F0\uB824\uBA74 \uBA3C\uC800 \uD14D\uC2A4\uD2B8\uB97C \uC120\uD0DD\uD558\uC138\uC694.",
    createdNotice: "\uC0DD\uC131\uB428",
    clipboardError: "\uB2F5\uBCC0\uC744 \uD074\uB9BD\uBCF4\uB4DC\uC5D0 \uBCF5\uC0AC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.",
    outlineParentLabel: "\uC0C1\uC704 \uC8FC\uC81C",
    outlineDetailHeading: "\uC138\uBD80 \uC8FC\uC81C",
    outlineDraftHeading: "\uCD08\uC548",
    outlineDetailPlaceholder: "\uC774 \uB300\uC8FC\uC81C\uC758 \uC138\uBD80 \uD56D\uBAA9\uC744 \uC815\uB9AC\uD558\uC138\uC694.",
    emptyListPlaceholder: "\uBE44\uC5B4 \uC788\uC74C",
    emptySiblingPlaceholder: "\uC5C6\uC74C",
    missingParentOutlinePlaceholder: "\uBD80\uBAA8 \uBAA9\uCC28\uB97C \uCC3E\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.",
    autoDraftDetailPlaceholder: "\uC774 \uB178\uD2B8\uC758 \uC138\uBD80 \uC8FC\uC81C\uB97C \uC815\uB9AC\uD558\uC138\uC694.",
    autoDraftBodyPlaceholder: "\uBCF8\uBB38\uC744 \uC0DD\uC131\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.",
    fallbackTag: "\uAE30\uD0C0"
  },
  ja: {
    ribbonOpen: "ObsiLLM \u3092\u958B\u304F",
    openChatCommand: "ObsiLLM \u30C1\u30E3\u30C3\u30C8\u3092\u958B\u304F",
    askAboutCurrentNoteCommand: "\u73FE\u5728\u306E\u30CE\u30FC\u30C8\u306B\u3064\u3044\u3066 ObsiLLM \u306B\u805E\u304F",
    draftCurrentNoteCommand: "\u73FE\u5728\u306E\u30CE\u30FC\u30C8\u3092\u81EA\u52D5\u4E0B\u66F8\u304D",
    draftChildNotesCommand: "\u5B50\u30CE\u30FC\u30C8\u3092\u4E00\u62EC\u4E0B\u66F8\u304D",
    insertCitedAnswerCommand: "\u6839\u62E0\u4ED8\u304D\u306E\u56DE\u7B54\u3092\u73FE\u5728\u306E\u30CE\u30FC\u30C8\u3078\u5165\u308C\u308B",
    askCurrentNoteTitle: "\u73FE\u5728\u306E\u30CE\u30FC\u30C8\u306B\u3064\u3044\u3066\u8CEA\u554F",
    askCurrentNotePlaceholder: "\u958B\u3044\u3066\u3044\u308B\u30CE\u30FC\u30C8\u306B\u3064\u3044\u3066\u4F55\u3092\u77E5\u308A\u305F\u3044\u3067\u3059\u304B\uFF1F",
    insertCitedAnswerTitle: "\u6839\u62E0\u4ED8\u304D\u306E\u56DE\u7B54\u3092\u633F\u5165",
    insertCitedAnswerPlaceholder: "\u8CEA\u554F\u3059\u308B\u3068\u3001ObsiLLM \u304C\u6839\u62E0\u4ED8\u304D\u306E\u56DE\u7B54\u3092\u73FE\u5728\u306E\u30CE\u30FC\u30C8\u306B\u5165\u308C\u307E\u3059\u3002",
    draftPrompt: "\u73FE\u5728\u306E\u30CE\u30FC\u30C8\u3092\u3082\u3068\u306B\u3001\u8AAD\u307F\u3084\u3059\u304F\u6574\u3063\u305F\u4E0B\u66F8\u304D\u3092\u4F5C\u6210\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u4E2D\u5FC3\u3068\u306A\u308B\u8003\u3048\u3092\u4FDD\u3061\u3001\u69CB\u6210\u3092\u660E\u78BA\u306B\u3057\u3001\u6587\u8108\u3067\u88DC\u3048\u308B\u5C0F\u3055\u306A\u629C\u3051\u306F\u81EA\u7136\u306B\u88DC\u5B8C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    settingsTitle: "ObsiLLM \u8A2D\u5B9A",
    settingsDescription: "\u8A00\u8A9E\u3001\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3001\u30E2\u30C7\u30EB\u3001\u4FDD\u5B58\u52D5\u4F5C\u3092\u5909\u66F4\u3057\u307E\u3059\u3002",
    language: "\u8A00\u8A9E",
    languageDescription: "UI \u8A00\u8A9E\u3092\u5909\u66F4\u3057\u3001\u305D\u306E\u8A00\u8A9E\u5411\u3051\u306E\u65E2\u5B9A\u30B7\u30B9\u30C6\u30E0\u30D7\u30ED\u30F3\u30D7\u30C8\u306B\u623B\u3057\u307E\u3059\u3002",
    languageEn: "EN",
    languageKo: "KO",
    languageJp: "JP",
    defaultProvider: "\u65E2\u5B9A\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC",
    defaultProviderDescription: "\u30C1\u30E3\u30C3\u30C8\u30D1\u30CD\u30EB\u3092\u958B\u3044\u305F\u3068\u304D\u306B\u6700\u521D\u306B\u4F7F\u3046\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3067\u3059\u3002",
    openaiApiKey: "OpenAI API \u30AD\u30FC",
    openaiApiKeyDescription: "Obsidian \u306E\u30D7\u30E9\u30B0\u30A4\u30F3\u8A2D\u5B9A\u306B\u30ED\u30FC\u30AB\u30EB\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002",
    openaiModel: "OpenAI \u30E2\u30C7\u30EB",
    openaiModelDescription: "\u5FC5\u8981\u306A\u3089\u5225\u306E OpenAI \u30E2\u30C7\u30EB\u3078\u5909\u66F4\u3067\u304D\u307E\u3059\u3002",
    geminiApiKey: "Gemini API \u30AD\u30FC",
    geminiApiKeyDescription: "Obsidian \u306E\u30D7\u30E9\u30B0\u30A4\u30F3\u8A2D\u5B9A\u306B\u30ED\u30FC\u30AB\u30EB\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002",
    geminiModel: "Gemini \u30E2\u30C7\u30EB",
    geminiModelDescription: "\u65E2\u5B9A\u5024\u306F gemini-2.5-flash-lite \u3067\u3059\u3002\u4F4E\u30B3\u30B9\u30C8\u3067\u5FDC\u7B54\u3082\u901F\u3081\u3067\u3059\u3002",
    systemPrompt: "\u30B7\u30B9\u30C6\u30E0\u30D7\u30ED\u30F3\u30D7\u30C8",
    systemPromptDescription: "\u4E21\u65B9\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u306B\u9069\u7528\u3055\u308C\u308B\u5171\u901A\u6307\u793A\u3067\u3059\u3002",
    defaultVaultRetrieval: "\u65E2\u5B9A\u306E vault \u691C\u7D22",
    defaultVaultRetrievalDescription: "\u30B5\u30A4\u30C9\u30D0\u30FC\u3092\u958B\u3044\u305F\u3068\u304D\u306B vault \u691C\u7D22\u3092\u6709\u52B9\u306B\u3057\u307E\u3059\u3002",
    defaultWebGrounding: "\u65E2\u5B9A\u306E Web \u691C\u7D22",
    defaultWebGroundingDescription: "Web \u691C\u7D22 / grounding \u3092\u65E2\u5B9A\u3067\u6709\u52B9\u306B\u3057\u307E\u3059\u3002",
    defaultIncludeSources: "\u65E2\u5B9A\u3067\u51FA\u5178\u3092\u542B\u3081\u308B",
    defaultIncludeSourcesDescription: "\u901A\u5E38\u306F\u56DE\u7B54\u672C\u6587\u3060\u3051\u6B32\u3057\u3044\u306A\u3089\u30AA\u30D5\u306E\u307E\u307E\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    maxVaultResults: "vault \u7D50\u679C\u6570",
    maxVaultResultsDescription: "\u30E2\u30C7\u30EB\u306B\u6E21\u3059 vault \u30C1\u30E3\u30F3\u30AF\u306E\u6570\u3067\u3059\u3002",
    chunkSize: "\u30C1\u30E3\u30F3\u30AF\u30B5\u30A4\u30BA",
    chunkSizeDescription: "vault \u30C1\u30E3\u30F3\u30AF\u306E\u76EE\u5B89\u3068\u306A\u308B\u6587\u5B57\u6570\u3067\u3059\u3002",
    chunkOverlap: "\u30C1\u30E3\u30F3\u30AF\u91CD\u306A\u308A",
    chunkOverlapDescription: "\u96A3\u63A5\u30C1\u30E3\u30F3\u30AF\u9593\u3067\u91CD\u306A\u308B\u6587\u5B57\u6570\u3067\u3059\u3002",
    createNoteFolder: "\u30D5\u30A9\u30EB\u30C0\u4FDD\u5B58\u5148",
    createNoteFolderDescription: "\u30D5\u30A9\u30EB\u30C0\u30DC\u30BF\u30F3\u3092\u62BC\u3059\u3068\u3001\u3053\u306E\u30D5\u30A9\u30EB\u30C0\u306B\u65B0\u898F\u30CE\u30FC\u30C8\u3068\u3057\u3066\u4FDD\u5B58\u3057\u307E\u3059\u3002",
    workspaceTitle: "ObsiLLM \u30EF\u30FC\u30AF\u30B9\u30DA\u30FC\u30B9",
    workspaceDescription: "vault \u6587\u8108\u3068 Web \u691C\u7D22\u3092\u4F7F\u3063\u3066\u56DE\u7B54\u3092\u4F5C\u308A\u3001\u305D\u306E\u7D50\u679C\u3092\u30B3\u30D4\u30FC\u3057\u305F\u308A\u3001\u73FE\u5728\u306E\u30CE\u30FC\u30C8\u3078\u5165\u308C\u305F\u308A\u3001\u9078\u629E\u7BC4\u56F2\u3092\u7F6E\u304D\u63DB\u3048\u305F\u308A\u3001\u6307\u5B9A\u30D5\u30A9\u30EB\u30C0\u306B\u65B0\u898F\u30CE\u30FC\u30C8\u3068\u3057\u3066\u4FDD\u5B58\u3057\u305F\u308A\u3001\u73FE\u5728\u306E\u30CE\u30FC\u30C8\u3068\u540C\u3058\u30D5\u30A9\u30EB\u30C0\u306B\u4FDD\u5B58\u3067\u304D\u307E\u3059\u3002",
    provider: "\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC",
    model: "\u30E2\u30C7\u30EB",
    modelPlaceholder: "\u30E2\u30C7\u30EB ID \u3092\u76F4\u63A5\u5165\u529B",
    vaultContext: "Vault \u6587\u8108",
    webGrounding: "Web \u691C\u7D22",
    includeSources: "\u51FA\u5178\u3092\u542B\u3081\u308B",
    prompt: "\u30D7\u30ED\u30F3\u30D7\u30C8",
    promptPlaceholder: "\u8CEA\u554F\u3057\u305F\u308A\u3001\u4E0B\u66F8\u304D\u3092\u983C\u3093\u3060\u308A\u3001ObsiLLM \u306B\u4F55\u3092\u66F8\u304F\u304B\u4F1D\u3048\u3066\u304F\u3060\u3055\u3044\u3002",
    askButton: "ObsiLLM \u306B\u805E\u304F",
    clearChat: "\u30C1\u30E3\u30C3\u30C8\u3092\u6D88\u53BB",
    ready: "\u6E96\u5099\u5B8C\u4E86",
    chatCleared: "\u30C1\u30E3\u30C3\u30C8\u3092\u6D88\u53BB\u3057\u307E\u3057\u305F\u3002",
    enterPromptFirst: "\u5148\u306B\u30D7\u30ED\u30F3\u30D7\u30C8\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    generatingResponse: "\u56DE\u7B54\u3092\u751F\u6210\u4E2D\u3067\u3059...",
    completedWith: "\u5FDC\u7B54\u5B8C\u4E86",
    requestFailed: "\u30EA\u30AF\u30A8\u30B9\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002",
    transcriptEmpty: "\u3053\u3053\u306B\u4F1A\u8A71\u304C\u8868\u793A\u3055\u308C\u307E\u3059\u3002\u8CEA\u554F\u3057\u305F\u308A\u3001\u30CE\u30FC\u30C8\u304B\u3089\u4E0B\u66F8\u304D\u3092\u4F5C\u3063\u305F\u308A\u3001vault \u6587\u8108\u3068 Web \u691C\u7D22\u3092\u7D44\u307F\u5408\u308F\u305B\u3066\u307F\u3066\u304F\u3060\u3055\u3044\u3002",
    user: "\u30E6\u30FC\u30B6\u30FC",
    assistant: "ObsiLLM",
    working: "\u51E6\u7406\u4E2D...",
    error: "\u30A8\u30E9\u30FC",
    noResponse: "\u5FDC\u7B54\u304C\u3042\u308A\u307E\u305B\u3093\u3002",
    retrievingContext: "\u6587\u8108\u3092\u96C6\u3081\u3066\u30E2\u30C7\u30EB\u3092\u547C\u3073\u51FA\u3057\u3066\u3044\u307E\u3059...",
    copyAnswer: "\u30B3\u30D4\u30FC",
    moveToFile: "\u73FE\u5728\u306E\u30CE\u30FC\u30C8\u3078\u5165\u308C\u308B",
    replaceSelection: "\u9078\u629E\u3092\u7F6E\u63DB",
    saveToFolder: "\u30D5\u30A9\u30EB\u30C0\u306B\u65B0\u898F\u4FDD\u5B58",
    saveToCurrentFolder: "\u73FE\u5728\u306E\u30D5\u30A9\u30EB\u30C0\u306B\u4FDD\u5B58",
    createOutlineNotes: "\u76EE\u6B21\u304B\u3089\u5B50\u30CE\u30FC\u30C8\u4F5C\u6210",
    autoDraftCurrentNote: "\u73FE\u5728\u30CE\u30FC\u30C8\u3092\u81EA\u52D5\u4E0B\u66F8\u304D",
    autoDraftChildNotes: "\u5B50\u30CE\u30FC\u30C8\u3092\u4E00\u62EC\u4E0B\u66F8\u304D",
    copied: "\u30AF\u30EA\u30C3\u30D7\u30DC\u30FC\u30C9\u306B\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F\u3002",
    insertedToFile: "\u73FE\u5728\u306E\u30CE\u30FC\u30C8\u3078\u5165\u308C\u307E\u3057\u305F\u3002",
    replacedSelection: "\u9078\u629E\u7BC4\u56F2\u3092\u7F6E\u304D\u63DB\u3048\u307E\u3057\u305F\u3002",
    savedToFolder: "\u8A2D\u5B9A\u3057\u305F\u30D5\u30A9\u30EB\u30C0\u306B\u65B0\u898F\u30CE\u30FC\u30C8\u3068\u3057\u3066\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",
    savedToCurrentFolder: "\u73FE\u5728\u306E\u30CE\u30FC\u30C8\u3068\u540C\u3058\u30D5\u30A9\u30EB\u30C0\u306B\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",
    outlineNotesCreated: "\u76EE\u6B21\u304B\u3089\u5B50\u30CE\u30FC\u30C8\u3092\u4F5C\u6210\u3057\u307E\u3057\u305F:",
    autoDraftingCurrentNote: "\u73FE\u5728\u306E\u30CE\u30FC\u30C8\u3092\u4E0B\u66F8\u304D\u4E2D\u3067\u3059...",
    autoDraftingChildNotes: "\u5B50\u30CE\u30FC\u30C8\u3092\u307E\u3068\u3081\u3066\u4E0B\u66F8\u304D\u4E2D\u3067\u3059...",
    autoDraftProgress: "\u4E0B\u66F8\u304D\u4E2D",
    currentNoteAutoDrafted: "\u73FE\u5728\u306E\u30CE\u30FC\u30C8\u3092\u4E0B\u66F8\u304D\u3057\u307E\u3057\u305F\u3002",
    childNotesAutoDrafted: "\u5B50\u30CE\u30FC\u30C8\u3092\u4E0B\u66F8\u304D\u3057\u307E\u3057\u305F:",
    draftCommandSuccess: "\u81EA\u52D5\u4E0B\u66F8\u304D\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F\u3002",
    sources: "\u51FA\u5178",
    vaultOn: "Vault",
    vaultOff: "Vault \u30AA\u30D5",
    webOn: "Web",
    webOff: "Web \u30AA\u30D5",
    promptCancel: "\u30AD\u30E3\u30F3\u30BB\u30EB",
    promptSubmit: "\u9001\u4FE1",
    noActiveEditor: "\u56DE\u7B54\u3092\u30D5\u30A1\u30A4\u30EB\u3078\u79FB\u3059\u524D\u306B Markdown \u30CE\u30FC\u30C8\u3092\u958B\u3044\u3066\u304F\u3060\u3055\u3044\u3002",
    noActiveFileForCurrentFolderSave: "\u73FE\u5728\u306E\u30D5\u30A9\u30EB\u30C0\u306B\u4FDD\u5B58\u3059\u308B\u306B\u306F\u3001\u5148\u306B Markdown \u30CE\u30FC\u30C8\u3092\u958B\u3044\u3066\u304F\u3060\u3055\u3044\u3002",
    noActiveFileForOutlineCreate: "\u76EE\u6B21\u304B\u3089\u5B50\u30CE\u30FC\u30C8\u3092\u4F5C\u308B\u306B\u306F\u3001\u5148\u306B Markdown \u30CE\u30FC\u30C8\u3092\u958B\u3044\u3066\u304F\u3060\u3055\u3044\u3002",
    noActiveFileForAutoDraft: "\u81EA\u52D5\u4E0B\u66F8\u304D\u3059\u308B\u524D\u306B Markdown \u30CE\u30FC\u30C8\u3092\u958B\u3044\u3066\u304F\u3060\u3055\u3044\u3002",
    autoDraftNeedsChildNote: "\u3053\u306E\u64CD\u4F5C\u306F\u5B50\u30CE\u30FC\u30C8\u3067\u5B9F\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u89AA\u30CE\u30FC\u30C8\u3067\u306F\u4E00\u62EC\u4E0B\u66F8\u304D\u3092\u4F7F\u3063\u3066\u304F\u3060\u3055\u3044\u3002",
    noChildNotesForAutoDraft: "\u3053\u306E\u30D5\u30A9\u30EB\u30C0\u3067\u4E0B\u66F8\u304D\u3067\u304D\u308B\u5B50\u30CE\u30FC\u30C8\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002",
    noOutlineItemsFound: "\u56DE\u7B54\u304B\u3089\u76EE\u6B21\u9805\u76EE\u3092\u898B\u3064\u3051\u3089\u308C\u307E\u305B\u3093\u3067\u3057\u305F\u3002",
    noSelection: "\u9078\u629E\u7F6E\u63DB\u3092\u4F7F\u3046\u524D\u306B\u30C6\u30AD\u30B9\u30C8\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    createdNotice: "\u4F5C\u6210\u3057\u307E\u3057\u305F",
    clipboardError: "\u56DE\u7B54\u3092\u30AF\u30EA\u30C3\u30D7\u30DC\u30FC\u30C9\u3078\u30B3\u30D4\u30FC\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002",
    outlineParentLabel: "\u89AA\u30C6\u30FC\u30DE",
    outlineDetailHeading: "\u8A73\u7D30\u30C8\u30D4\u30C3\u30AF",
    outlineDraftHeading: "\u4E0B\u66F8\u304D",
    outlineDetailPlaceholder: "\u3053\u306E\u5927\u9805\u76EE\u306E\u8A73\u7D30\u30C8\u30D4\u30C3\u30AF\u3092\u6574\u7406\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    emptyListPlaceholder: "\u7A7A",
    emptySiblingPlaceholder: "\u306A\u3057",
    missingParentOutlinePlaceholder: "\u89AA\u306E\u76EE\u6B21\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002",
    autoDraftDetailPlaceholder: "\u3053\u306E\u30CE\u30FC\u30C8\u306E\u8A73\u7D30\u30C8\u30D4\u30C3\u30AF\u3092\u6574\u7406\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    autoDraftBodyPlaceholder: "\u672C\u6587\u3092\u751F\u6210\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002",
    fallbackTag: "\u305D\u306E\u4ED6"
  }
};
function getStrings(language) {
  return STRINGS[language] ?? STRINGS.en;
}

// src/insertion.ts
var import_obsidian2 = require("obsidian");

// src/utils.ts
var import_obsidian = require("obsidian");
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
  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}\u2026`;
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
  const seen = /* @__PURE__ */ new Set();
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
    excerpt
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
  } catch {
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
  const renderer = import_obsidian.MarkdownRenderer;
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
  const normalized = (0, import_obsidian.normalizePath)(folderPath.trim());
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
  const normalized = (0, import_obsidian.normalizePath)(proposedPath);
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
  const cleaned = value.trim().replace(/[<>:"/\\|?*\u0000-\u001F]+/g, " ").replace(/\s+/g, " ");
  return cleaned || "ObsiLLM Draft";
}
function maybeFile(value) {
  return value instanceof import_obsidian.TFile;
}

// src/insertion.ts
function buildInsertionMarkdown(response, language = "en", includeSources = false, prompt = "") {
  const body = stripPromptEcho(response.text, prompt);
  if (!includeSources || response.citations.length === 0) {
    return body;
  }
  const strings = getStrings(language);
  const citations = response.citations.map((citation) => citationToMarkdown(citation)).join("\n");
  return `${body}

## ${strings.sources}
${citations}`;
}
function getTargetMarkdownView(app, preferredFile) {
  const active = app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
  if (active && (!preferredFile || active.file?.path === preferredFile.path)) {
    return active;
  }
  const leaves = app.workspace.getLeavesOfType("markdown").map((markdownLeaf) => markdownLeaf.view);
  if (preferredFile) {
    const matched = leaves.find(
      (view) => view instanceof import_obsidian2.MarkdownView && view.file?.path === preferredFile.path
    );
    if (matched) {
      return matched;
    }
  }
  if (active) {
    return active;
  }
  const leaf = leaves.find((view) => view instanceof import_obsidian2.MarkdownView);
  return leaf ?? null;
}
async function applyResponseToWorkspace(app, settings, response, mode, titleHint, includeSources = false, targetFile) {
  const strings = getStrings(settings.language);
  const content = buildInsertionMarkdown(response, settings.language, includeSources, titleHint);
  if (mode === "create-note" || mode === "create-note-current-folder") {
    const noteTitle = deriveNoteTitle(content, titleHint);
    const fileName = `${slugifyTitle(noteTitle)}.md`;
    const noteBody = stripLeadingTitleHeading(content, noteTitle) || content;
    const baseFolder = mode === "create-note-current-folder" ? getCurrentNoteFolder(app, targetFile) : settings.createNoteFolder.trim();
    if (mode === "create-note-current-folder" && baseFolder === null) {
      throw new Error(strings.noActiveFileForCurrentFolderSave);
    }
    const folder = mode === "create-note" ? buildTopicFolderPath(baseFolder ?? "", noteTitle) : baseFolder;
    const noteContent = buildCreatedNoteContent(noteBody, response, {
      language: settings.language,
      folderPath: folder ?? "",
      noteTitle
    });
    if (folder) {
      await ensureFolderExists(app, folder);
    }
    const path = (0, import_obsidian2.normalizePath)(folder ? `${folder}/${fileName}` : fileName);
    const availablePath = await findOrCreateAvailablePath(app, path);
    const file = await app.vault.create(availablePath, noteContent);
    await app.workspace.getLeaf(true).openFile(file);
    new import_obsidian2.Notice(`${strings.createdNotice} ${availablePath}`);
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
async function createOutlineNotesFromResponse(app, settings, response, prompt, targetFile) {
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
      extraTagSources: [item.title, ...item.children.slice(0, 2)]
    });
    await upsertOutlineChildNote(app, targetFolder, indexLabel, item.title, contentWithProperties);
  }
  new import_obsidian2.Notice(`${strings.outlineNotesCreated} ${outlineItems.length}`);
  return outlineItems.length;
}
function normalizePromptEcho(value) {
  return value.trim().replace(/^["'`“”‘’>#\-\s]+/, "").replace(/["'`“”‘’\s]+$/, "").replace(/\s+/g, " ").trim();
}
function getCurrentNoteFolder(app, preferredFile) {
  const file = preferredFile ?? getTargetMarkdownView(app, preferredFile)?.file;
  if (!file) {
    return null;
  }
  return getFolderPathFromFile(file.path);
}
function buildTopicFolderPath(baseFolder, noteTitle) {
  const folderName = slugifyTitle(noteTitle);
  return (0, import_obsidian2.normalizePath)(baseFolder ? `${baseFolder}/${folderName}` : folderName);
}
async function ensureParentNoteTopicFolder(app, settings, file) {
  const currentFolder = file.parent?.path ?? getFolderPathFromFile(file.path);
  const baseFolder = (0, import_obsidian2.normalizePath)(settings.createNoteFolder.trim());
  if (!baseFolder || (0, import_obsidian2.normalizePath)(currentFolder) !== baseFolder) {
    return currentFolder;
  }
  const targetFolder = buildTopicFolderPath(baseFolder, file.basename);
  await ensureFolderExists(app, targetFolder);
  const targetPath = (0, import_obsidian2.normalizePath)(`${targetFolder}/${file.name}`);
  if (file.path !== targetPath) {
    const availablePath = await findOrCreateAvailablePath(app, targetPath);
    await app.fileManager.renameFile(file, availablePath);
  }
  return targetFolder;
}
function escapeYamlDoubleQuoted(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\u0008/g, "\\b").replace(/\f/g, "\\f").replace(/[\u0000-\u001F\u007F-\u009F]/g, (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`);
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
    /^[^\n]*환영합니다[^\n]*\n*/i,
    /^based on your request[^\n]*\n*/i,
    /^[^\n]*welcome[^\n]*\n*/i,
    /^here (is|are)[^\n]*\n*/i,
    /^ご依頼の内容をもとに[^\n]*\n*/i,
    /^[^\n]*ようこそ[^\n]*\n*/i,
    /^以下[^\n]*\n*/i
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
  const now = /* @__PURE__ */ new Date();
  const created = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join(
    "-"
  );
  const noteTitle = options.noteTitle ?? deriveNoteTitle(body, "");
  const language = options.language ?? "en";
  const tags = deriveContextTags(noteTitle, body, options.folderPath ?? "", options.extraTagSources ?? [], language);
  const metadata = [
    "---",
    `created: ${created}`,
    ...tags.length > 0 ? ["tags:", ...tags.map((tag) => `  - ${tag}`)] : [],
    ...options.parentNoteTitle ? [`parent_note: "[[${escapeYamlDoubleQuoted(options.parentNoteTitle)}]]"`] : [],
    ...options.parentNotePath ? [`parent_note_path: "${escapeYamlDoubleQuoted(options.parentNotePath)}"`] : [],
    `llm_provider: ${response.provider}`,
    `llm_model: "${escapeYamlDoubleQuoted(response.model)}"`,
    "---",
    ""
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
          children: []
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
          children: []
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
  return ["\uBAA9\uCC28", "outline", "table of contents", "toc"].includes(heading);
}
function isOutlineLine(line) {
  return /^(\d+)\.(?!\d)\s+/.test(line) || /^[-*+]\s+/.test(line) || /^[-*+]?\s*\d+\.\d+(?:\.)?\s+/.test(line);
}
function cleanStructuredLabel(value) {
  return value.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, (_, path, alias) => alias || path).replace(/[*_`#]/g, "").replace(/^\d+(?:\.\d+)*(?:\.)?\s*/, "").replace(/^[-*+]\s*/, "").trim();
}
function buildOutlineChildBody(language, parentTitle, childTitle, children) {
  const strings = getStrings(language);
  const detailLines = children.length > 0 ? children.map((child) => `- ${child}`) : [`- ${strings.outlineDetailPlaceholder}`];
  return [
    `${strings.outlineParentLabel}: [[${parentTitle}]]`,
    "",
    `## ${strings.outlineDetailHeading}`,
    ...detailLines,
    "",
    `## ${strings.outlineDraftHeading}`,
    ""
  ].join("\n");
}
function stripFrontmatter(content) {
  return content.replace(/^\s*---\n[\s\S]*?\n---\n*/, "").trim();
}
function deriveContextTags(title, body, folderPath, extraSources, language) {
  const phrases = [
    folderPath.split("/").filter(Boolean).pop() ?? "",
    title,
    ...extraSources,
    stripFrontmatter(body).slice(0, 1600)
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
  return tags.length > 0 ? tags : [getStrings(language).fallbackTag];
}
function isGenericSectionLabel(value) {
  const normalized = value.trim().toLowerCase();
  return ["\uBAA9\uCC28", "\uAC1C\uC694", "outline", "overview", "toc", "intro", "introduction", "\uC694\uC57D", "\uC138\uBD80 \uC8FC\uC81C"].includes(normalized);
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
    "\uBAA9\uCC28",
    "\uAC1C\uC694",
    "\uCD08\uC548",
    "\uC8FC\uC81C",
    "\uC138\uBD80",
    "\uC138\uBD80-\uC8FC\uC81C",
    "\uC0AC\uC6A9\uBC95",
    "\uD65C\uC6A9\uBC95",
    "\uC644\uBCBD",
    "\uAC00\uC774\uB4DC",
    "\uD65C\uC6A9",
    "\uD6A8\uC728\uC801",
    "\uD6A8\uC728\uC801\uC778",
    "\uC2DC\uC791",
    "\uC2DC\uC791\uD558\uAE30",
    "\uC785\uBB38",
    "\uAE30\uCD08",
    "\uC815\uB9AC",
    "\uBC29\uBC95",
    "\uC18C\uAC1C",
    "\uC0AC\uB840",
    "\uC8FC\uC758\uC0AC\uD56D",
    "\uC694\uC57D",
    "through",
    "using",
    "with",
    "for",
    "the",
    "and"
  ].includes(normalized);
}
var CATEGORY_RULES = [
  { tag: "IT", patterns: [/\bobsidian\b/i, /\bcodex\b/i, /\bopenai\b/i, /\bgemini\b/i, /\bgithub\b/i, /\bapi\b/i, /\bcode\b/i, /\bplugin\b/i, /\bsoftware\b/i, /\bprogramming\b/i, /\bdeveloper\b/i, /\bgo(lang)?\b/i, /옵시디언/i, /코덱스/i, /오픈에이아이/i, /제미나이/i, /플러그인/i, /코드/i, /개발/i, /프로그래밍/i] },
  { tag: "\uC815\uCE58", patterns: [/\bpolitic/i, /\bgov/i, /\belection/i, /\bdiploma/i, /정치/i, /정부/i, /대통령/i, /선거/i, /외교/i] },
  { tag: "\uAD6D\uC81C\uC815\uC138", patterns: [/\bwar\b/i, /\biran\b/i, /\bisrael\b/i, /\bunited states\b/i, /\bgeopolit/i, /국제 정세/i, /국제정세/i, /전쟁/i, /미국/i, /이란/i, /이스라엘/i, /외교/i] },
  { tag: "\uACBD\uC81C", patterns: [/\beconom/i, /\bmarket/i, /\bstock/i, /\bfinance\b/i, /경제/i, /시장/i, /주식/i, /금융/i, /투자/i] },
  { tag: "\uBE44\uC988\uB2C8\uC2A4", patterns: [/\bbusiness\b/i, /\bstartup\b/i, /\bsaas\b/i, /비즈니스/i, /사업/i, /스타트업/i, /기업/i] },
  { tag: "\uC608\uC220", patterns: [/\bart\b/i, /\bdesign\b/i, /\bmusic\b/i, /\bmovie\b/i, /예술/i, /디자인/i, /음악/i, /영화/i] },
  { tag: "\uC2A4\uD3EC\uCE20", patterns: [/\bsport/i, /\bfootball\b/i, /\bsoccer\b/i, /\bbaseball\b/i, /\bbasketball\b/i, /스포츠/i, /축구/i, /야구/i, /농구/i] },
  { tag: "\uACFC\uD559", patterns: [/\bscience\b/i, /\bresearch\b/i, /\bphysics\b/i, /\bbiology\b/i, /과학/i, /연구/i, /물리/i, /생물/i] },
  { tag: "\uAD50\uC721", patterns: [/\beducation\b/i, /\bstudy\b/i, /\blearning\b/i, /교육/i, /학습/i, /공부/i] },
  { tag: "\uC5ED\uC0AC", patterns: [/\bhistory\b/i, /역사/i] },
  { tag: "\uAC74\uAC15", patterns: [/\bhealth\b/i, /\bmedical\b/i, /\bfitness\b/i, /건강/i, /의학/i, /운동/i] },
  { tag: "\uC5EC\uD589", patterns: [/\btravel\b/i, /\btrip\b/i, /여행/i] },
  { tag: "\uC0DD\uC0B0\uC131", patterns: [/\bworkflow\b/i, /\bproductivity\b/i, /\bnote taking\b/i, /생산성/i, /워크플로우/i, /업무 자동화/i, /지식 관리/i] }
];
var KEYWORD_RULES = [
  { tag: "Obsidian", patterns: [/\bobsidian\b/i, /옵시디언/i] },
  { tag: "Codex", patterns: [/\bcodex\b/i, /코덱스/i] },
  { tag: "OpenAI", patterns: [/\bopenai\b/i, /오픈에이아이/i] },
  { tag: "Gemini", patterns: [/\bgemini\b/i, /제미나이/i] },
  { tag: "Vault", patterns: [/\bvault\b/i, /보관소/i, /볼트/i] },
  { tag: "\uD50C\uB7EC\uADF8\uC778", patterns: [/\bplugin(s)?\b/i, /플러그인/i] },
  { tag: "\uBC31\uB9C1\uD06C", patterns: [/\bbacklinks?\b/i, /백링크/i] },
  { tag: "\uADF8\uB798\uD504\uBDF0", patterns: [/\bgraph view\b/i, /그래프 뷰/i] },
  { tag: "\uC790\uB3D9\uD654", patterns: [/\bautomation\b/i, /자동화/i] },
  { tag: "\uC6CC\uD06C\uD50C\uB85C\uC6B0", patterns: [/\bworkflow\b/i, /워크플로우/i] },
  { tag: "\uC9C0\uC2DD\uAD00\uB9AC", patterns: [/\bknowledge management\b/i, /지식 관리/i] },
  { tag: "\uD0DC\uADF8", patterns: [/\btags?\b/i, /태그/i] },
  { tag: "\uD15C\uD50C\uB9BF", patterns: [/\btemplates?\b/i, /템플릿/i] },
  { tag: "\uC815\uCE58", patterns: [/\bpolitic/i, /정치/i] },
  { tag: "\uC678\uAD50", patterns: [/\bdiploma/i, /외교/i] },
  { tag: "\uC804\uC7C1", patterns: [/\bwar\b/i, /전쟁/i] },
  { tag: "\uBBF8\uAD6D", patterns: [/\bunited states\b/i, /\busa\b/i, /미국/i] },
  { tag: "\uC774\uB780", patterns: [/\biran\b/i, /이란/i] },
  { tag: "\uC774\uC2A4\uB77C\uC5D8", patterns: [/\bisrael\b/i, /이스라엘/i] },
  { tag: "\uACBD\uC81C", patterns: [/\beconom/i, /경제/i] },
  { tag: "\uC8FC\uC2DD", patterns: [/\bstock/i, /주식/i] },
  { tag: "\uC608\uC220", patterns: [/\bart\b/i, /예술/i] },
  { tag: "\uB514\uC790\uC778", patterns: [/\bdesign\b/i, /디자인/i] },
  { tag: "\uC2A4\uD3EC\uCE20", patterns: [/\bsport/i, /스포츠/i] },
  { tag: "\uCD95\uAD6C", patterns: [/\bfootball\b/i, /\bsoccer\b/i, /축구/i] },
  { tag: "\uC57C\uAD6C", patterns: [/\bbaseball\b/i, /야구/i] },
  { tag: "\uACFC\uD559", patterns: [/\bscience\b/i, /과학/i] },
  { tag: "\uAD50\uC721", patterns: [/\beducation\b/i, /교육/i] },
  { tag: "\uC5ED\uC0AC", patterns: [/\bhistory\b/i, /역사/i] }
];
function inferCategoryTag(value) {
  for (const rule of CATEGORY_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(value))) {
      return rule.tag;
    }
  }
  return void 0;
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
  const tokens = cleanStructuredLabel(value).replace(/\([^)]*\)/g, " ").replace(/[^\p{L}\p{N}\s]+/gu, " ").split(/\s+/).map((token) => normalizeTagToken(token)).filter(Boolean).filter((token) => !isGenericTagSource(token));
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
  return normalizedLeft === normalizedRight || normalizedLeft.startsWith(`${normalizedRight}-`) || normalizedRight.startsWith(`${normalizedLeft}-`);
}
function findExistingOutlineChildFile(app, folderPath, indexLabel, title) {
  const normalizedFolder = folderPath ? (0, import_obsidian2.normalizePath)(folderPath) : "";
  const expectedTitle = normalizeTitleComparison(title);
  const markdownFiles = typeof app.vault.getMarkdownFiles === "function" ? app.vault.getMarkdownFiles() : [];
  const exactTitleMatch = markdownFiles.find(
    (candidate) => (candidate.parent?.path ? (0, import_obsidian2.normalizePath)(candidate.parent.path) : "") === normalizedFolder && normalizeTitleComparison(stripFileNumberPrefix(candidate.basename)) === expectedTitle
  ) ?? null;
  if (exactTitleMatch) {
    return exactTitleMatch;
  }
  return markdownFiles.find((candidate) => {
    if ((candidate.parent?.path ? (0, import_obsidian2.normalizePath)(candidate.parent.path) : "") !== normalizedFolder) {
      return false;
    }
    const indexMatch = candidate.basename.match(/^(\d+)\./);
    return indexMatch?.[1] ? String(Number(indexMatch[1])).padStart(2, "0") === indexLabel : false;
  }) ?? null;
}
async function upsertOutlineChildNote(app, folderPath, indexLabel, title, content) {
  const fileName = `${indexLabel}. ${slugifyTitle(title)}.md`;
  const expectedPath = (0, import_obsidian2.normalizePath)(folderPath ? `${folderPath}/${fileName}` : fileName);
  const exactFile = app.vault.getAbstractFileByPath(expectedPath);
  if (exactFile instanceof import_obsidian2.TFile) {
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
function stripFileNumberPrefix(value) {
  return value.replace(/^\d+\.\s*/, "").trim();
}
function normalizeTitleComparison(value) {
  return value.trim().toLowerCase().replace(/[`"'“”‘’]/g, "").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
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
  const lines = content.split("\n").map((line) => line.trim()).filter(Boolean);
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
function getFolderPathFromFile(filePath) {
  const separatorIndex = filePath.lastIndexOf("/");
  return separatorIndex >= 0 ? filePath.slice(0, separatorIndex) : "";
}

// src/model-options.ts
var OPENAI_MODEL_OPTIONS = ["gpt-5-mini", "gpt-5-nano"];
var GEMINI_MODEL_OPTIONS = ["gemini-2.5-flash-lite", "gemini-3.1-flash-lite-preview"];
function getModelOptions(provider) {
  return provider === "openai" ? [...OPENAI_MODEL_OPTIONS] : [...GEMINI_MODEL_OPTIONS];
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

// src/providers/gemini.ts
var import_obsidian3 = require("obsidian");

// src/prompting.ts
var ACTIVE_NOTE_LIMIT = 3500;
var MATCH_EXCERPT_LIMIT = 600;
function buildProviderPrompt(prompt, retrieval) {
  const sections = [];
  const vaultCitations = retrieval.vaultMatches.map(
    (match) => createVaultCitation(match.filePath, match.title, truncate(match.excerpt, 140))
  );
  sections.push("You are answering inside an Obsidian knowledge workspace.");
  sections.push(
    "Use vault context only when it is directly relevant to the user's request. If it is not directly relevant, ignore it completely and do not mention it."
  );
  sections.push("If web search is enabled, use it only when it materially improves the answer.");
  sections.push(
    "Do not repeat the user's request. Do not greet the user. Do not say you are ObsiLLM. Do not add prefaces or commentary before the answer. Start directly with the requested output."
  );
  sections.push("If the user asks for a title, outline, blog post, or draft, start with the title heading itself on the first line.");
  sections.push("Never force an association between the user's request and a vault note unless the overlap is explicit and material.");
  if (retrieval.activeNote) {
    const activeNoteLines = [
      `Path: ${retrieval.activeNote.path}`,
      `Title: ${retrieval.activeNote.title}`,
      retrieval.activeNote.selection ? `Selected text:
${truncate(retrieval.activeNote.selection, 1e3)}` : void 0,
      `Note excerpt:
${truncate(retrieval.activeNote.excerpt, ACTIVE_NOTE_LIMIT)}`
    ].filter(Boolean);
    sections.push(`Active note context:
${activeNoteLines.join("\n\n")}`);
  }
  if (retrieval.vaultMatches.length > 0) {
    const vaultLines = retrieval.vaultMatches.map((match, index) => {
      const headingText = match.headings.length > 0 ? ` | headings: ${match.headings.slice(0, 3).join(", ")}` : "";
      const tagText = match.tags.length > 0 ? ` | tags: ${match.tags.slice(0, 4).join(", ")}` : "";
      return [
        `[Vault ${index + 1}] ${match.title} (${match.filePath})${headingText}${tagText}`,
        truncate(match.excerpt, MATCH_EXCERPT_LIMIT)
      ].join("\n");
    });
    sections.push(`Vault search context:
${vaultLines.join("\n\n")}`);
  }
  sections.push(`User request:
${prompt}`);
  sections.push(
    "Write in Markdown. Be explicit when information comes from the web. Mention vault note titles only when they are directly relevant and genuinely helpful."
  );
  return {
    prompt: normalizeWhitespace(sections.join("\n\n")),
    vaultCitations
  };
}

// src/providers/gemini.ts
function buildGeminiRequest(request) {
  const envelope = buildProviderPrompt(request.prompt, request.retrieval);
  const body = {
    system_instruction: {
      parts: [{ text: request.systemPrompt }]
    },
    contents: [
      ...request.conversation.map((turn) => ({
        role: turn.role === "assistant" ? "model" : "user",
        parts: [{ text: turn.content }]
      })),
      {
        role: "user",
        parts: [{ text: envelope.prompt }]
      }
    ]
  };
  if (request.retrieval.useWeb) {
    body.tools = [{ google_search: {} }];
  }
  return body;
}
function parseGeminiResponse(payload) {
  const candidate = payload.candidates?.[0];
  const text = candidate?.content?.parts?.map((part) => part.text ?? "").join("\n").trim() ?? "";
  const citations = candidate?.groundingMetadata?.groundingChunks?.map((chunk) => chunk.web).filter((web) => Boolean(web?.uri)).map((web) => ({
    id: `web:${web.uri}`,
    source: "web",
    title: web.title ?? web.uri,
    url: web.uri
  })) ?? [];
  return {
    text,
    citations: uniqueCitations(citations)
  };
}
function sanitizeProviderErrorDetail(detail) {
  if (detail == null || typeof detail !== "string") {
    return void 0;
  }
  const cleaned = detail.replace(/\s+/g, " ").replace(/raw payload:.*$/i, "").trim();
  return cleaned ? cleaned.slice(0, 240) : void 0;
}
function extractGeminiErrorMessage(payload) {
  if (!payload || typeof payload !== "object") {
    return void 0;
  }
  const record = payload;
  const nestedMessage = record.error && typeof record.error === "object" ? record.error.message : void 0;
  const nestedError = typeof nestedMessage === "string" ? sanitizeProviderErrorDetail(nestedMessage) : void 0;
  return nestedError ?? (typeof record.message === "string" ? sanitizeProviderErrorDetail(record.message) : void 0);
}
var GeminiProviderAdapter = class {
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
    return void 0;
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
      const response = await (0, import_obsidian3.requestUrl)({
        url: `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": this.settings.apiKey.trim()
        }
      });
      responseText = response.text;
      payload = response.json;
    } catch (error) {
      const detail = sanitizeProviderErrorDetail(error instanceof Error ? error.message : String(error));
      throw new Error(detail ? `Gemini request failed: ${detail}` : "Gemini request failed.");
    }
    const parsed = parseGeminiResponse(payload ?? {});
    if (!parsed.text) {
      const errorMessage = extractGeminiErrorMessage(payload) ?? extractGeminiErrorMessage(safeParseJson(responseText));
      throw new Error(errorMessage ? `Gemini returned no answer: ${errorMessage}` : "Gemini returned no answer.");
    }
    const envelope = buildProviderPrompt(request.prompt, request.retrieval);
    return {
      provider: this.id,
      model,
      text: parsed.text,
      citations: uniqueCitations([...envelope.vaultCitations, ...parsed.citations]),
      raw: payload
    };
  }
};
function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return void 0;
  }
}

// src/providers/openai.ts
var import_obsidian4 = require("obsidian");
function buildOpenAIRequest(request) {
  const envelope = buildProviderPrompt(request.prompt, request.retrieval);
  const input = [
    ...request.conversation.map((turn) => ({
      role: turn.role,
      content: [{ type: "input_text", text: turn.content }]
    })),
    {
      role: "user",
      content: [{ type: "input_text", text: envelope.prompt }]
    }
  ];
  const body = {
    model: request.model,
    instructions: request.systemPrompt,
    input
  };
  if (request.retrieval.useWeb) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    body.tools = [
      {
        type: "web_search",
        ...timezone ? {
          user_location: {
            type: "approximate",
            timezone
          }
        } : {}
      }
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
    if ((parentKey === "sources" || "url" in record || "uri" in record) && (typeof record.url === "string" || typeof record.uri === "string")) {
      const url = record.url ?? record.uri;
      const title = record.title ?? record.name ?? url ?? "Web source";
      if (url) {
        citations.push({
          id: `web:${url}`,
          source: "web",
          title,
          url
        });
      }
    }
    for (const [key, nested] of Object.entries(record)) {
      visit(nested, key);
    }
  };
  visit(payload);
  return uniqueCitations(citations);
}
function parseOpenAIResponse(payload) {
  const text = payload.output_text?.trim() || collectTextFromOpenAIOutput(payload.output) || "";
  return {
    text,
    citations: extractOpenAICitations(payload)
  };
}
function sanitizeProviderErrorDetail2(detail) {
  if (detail == null || typeof detail !== "string") {
    return void 0;
  }
  const cleaned = detail.replace(/\s+/g, " ").replace(/raw payload:.*$/i, "").trim();
  return cleaned ? cleaned.slice(0, 240) : void 0;
}
function extractOpenAIErrorMessage(payload) {
  if (!payload || typeof payload !== "object") {
    return void 0;
  }
  const record = payload;
  const nestedMessage = record.error && typeof record.error === "object" ? record.error.message : void 0;
  const nestedError = typeof nestedMessage === "string" ? sanitizeProviderErrorDetail2(nestedMessage) : void 0;
  return nestedError ?? (typeof record.message === "string" ? sanitizeProviderErrorDetail2(record.message) : void 0);
}
var OpenAIProviderAdapter = class {
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
    return void 0;
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
      const response = await (0, import_obsidian4.requestUrl)({
        url: "https://api.openai.com/v1/responses",
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.settings.apiKey.trim()}`
        }
      });
      responseText = response.text;
      payload = response.json;
    } catch (error) {
      const detail = sanitizeProviderErrorDetail2(error instanceof Error ? error.message : String(error));
      throw new Error(detail ? `OpenAI request failed: ${detail}` : "OpenAI request failed.");
    }
    const parsed = parseOpenAIResponse(payload ?? {});
    if (!parsed.text) {
      const errorMessage = extractOpenAIErrorMessage(payload) ?? extractOpenAIErrorMessage(safeParseJson2(responseText));
      throw new Error(errorMessage ? `OpenAI returned no answer: ${errorMessage}` : "OpenAI returned no answer.");
    }
    const envelope = buildProviderPrompt(request.prompt, request.retrieval);
    return {
      provider: this.id,
      model: request.model,
      text: parsed.text,
      citations: uniqueCitations([...envelope.vaultCitations, ...parsed.citations]),
      raw: payload
    };
  }
};
function safeParseJson2(text) {
  try {
    return JSON.parse(text);
  } catch {
    return void 0;
  }
}

// src/retrieval/vault-index.ts
var import_obsidian5 = require("obsidian");
function stripMarkdown(value) {
  return value.replace(/```[\s\S]*?```/g, " ").replace(/`([^`]+)`/g, "$1").replace(/!\[[^\]]*]\([^)]*\)/g, " ").replace(/\[[^\]]*]\(([^)]*)\)/g, "$1").replace(/^#{1,6}\s+/gm, "").replace(/[*_~>-]/g, " ");
}
function splitIntoChunks(content, chunkSize, chunkOverlap) {
  const normalized = stripMarkdown(content).replace(/\r/g, "").trim();
  if (!normalized) {
    return [];
  }
  const paragraphs = normalized.split(/\n{2,}/).map((paragraph) => paragraph.trim().replace(/\s+/g, " ")).filter(Boolean);
  const size = clamp(chunkSize, 400, 5e3);
  const overlap = clamp(chunkOverlap, 0, 1e3);
  const chunks = [];
  let current = "";
  for (const paragraph of paragraphs) {
    if (!current) {
      current = paragraph;
      continue;
    }
    if (`${current}

${paragraph}`.length <= size) {
      current = `${current}

${paragraph}`;
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
    return value.split(/[,\n]/).map((part) => part.trim()).filter(Boolean);
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
    tags: Array.from(/* @__PURE__ */ new Set([...inlineTags, ...frontmatterTags])),
    aliases: Array.from(new Set(aliases))
  };
}
function buildSearchableChunks(input) {
  const { headings, tags, aliases } = extractMetadataLists(input.metadata);
  const titleNorm = normalizeForSearch(input.title);
  const headingsNorm = normalizeForSearch(headings.join(" "));
  const tagsNorm = normalizeForSearch(tags.join(" "));
  const aliasesNorm = normalizeForSearch(aliases.join(" "));
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
    excerpt: truncate(chunk.trim(), 700),
    textNorm: normalizeForSearch(chunk),
    lastModified: input.lastModified
  }));
}
function rankVaultChunks(query, chunks, limit, now = Date.now()) {
  const tokens = tokenize(query);
  const normalizedPhrase = normalizeForSearch(query);
  if (tokens.length === 0) {
    return [];
  }
  const scored = chunks.map((chunk) => {
    let score = 0;
    for (const token of tokens) {
      score += countTermOccurrences(chunk.titleNorm, token) * 5.5;
      score += countTermOccurrences(chunk.headingsNorm, token) * 3.5;
      score += countTermOccurrences(chunk.tagsNorm, token) * 4.5;
      score += countTermOccurrences(chunk.aliasesNorm, token) * 4.5;
      score += countTermOccurrences(chunk.textNorm, token) * 1.2;
    }
    if (normalizedPhrase && chunk.titleNorm.includes(normalizedPhrase)) {
      score += 7;
    }
    if (normalizedPhrase && chunk.textNorm.includes(normalizedPhrase)) {
      score += 2.5;
    }
    const ageDays = Math.max(0, (now - chunk.lastModified) / 864e5);
    const recencyBonus = Math.max(0, 1 - ageDays / 45) * 0.9;
    score += recencyBonus;
    return {
      chunk,
      score
    };
  }).filter((entry) => entry.score > 0).sort((left, right) => right.score - left.score || right.chunk.lastModified - left.chunk.lastModified);
  return scored.slice(0, limit).map(({ chunk, score }) => ({
    id: chunk.id,
    filePath: chunk.filePath,
    title: chunk.title,
    excerpt: chunk.excerpt,
    headings: chunk.headings,
    tags: chunk.tags,
    aliases: chunk.aliases,
    score,
    lastModified: chunk.lastModified
  }));
}
var VaultIndex = class {
  constructor(app, getSettings) {
    this.app = app;
    this.getSettings = getSettings;
    this.chunks = /* @__PURE__ */ new Map();
    this.fileChunkIds = /* @__PURE__ */ new Map();
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
    const metadata = this.app.metadataCache.getFileCache(file) ?? void 0;
    const chunks = buildSearchableChunks({
      path: file.path,
      title: file.basename,
      lastModified: file.stat.mtime,
      content,
      metadata,
      chunkSize: settings.chunkSize,
      chunkOverlap: settings.chunkOverlap
    });
    this.fileChunkIds.set(
      file.path,
      chunks.map((chunk) => chunk.id)
    );
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
    if (file instanceof import_obsidian5.TFile && file.extension === "md") {
      await this.indexFile(file);
    }
  }
  onFileDeleted(file) {
    if (file instanceof import_obsidian5.TFile) {
      this.removeFile(file.path);
    }
  }
  async onFileRenamed(file, oldPath) {
    this.removeFile(oldPath);
    if (file instanceof import_obsidian5.TFile && file.extension === "md") {
      await this.indexFile(file);
    }
  }
  search(query, options) {
    const settings = this.getSettings();
    const chunks = Array.from(this.chunks.values()).filter((chunk) => chunk.filePath !== options?.excludePath);
    return rankVaultChunks(query, chunks, options?.limit ?? settings.maxVaultResults);
  }
};

// src/settings.ts
var import_obsidian6 = require("obsidian");
var DEFAULT_SETTINGS = {
  language: "ko",
  defaultProvider: "openai",
  openai: {
    apiKey: "",
    model: "gpt-5-mini"
  },
  gemini: {
    apiKey: "",
    model: "gemini-2.5-flash-lite"
  },
  systemPrompt: getDefaultSystemPrompt("ko"),
  defaultUseVault: true,
  defaultUseWeb: true,
  defaultIncludeSources: false,
  maxVaultResults: 5,
  chunkSize: 1200,
  chunkOverlap: 180,
  createNoteFolder: "ObsiLLM Drafts"
};
var ObsiLLMSettingTab = class extends import_obsidian6.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const strings = getStrings(this.plugin.settings.language);
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: strings.settingsTitle });
    containerEl.createEl("p", {
      text: strings.settingsDescription
    });
    new import_obsidian6.Setting(containerEl).setName(strings.language).setDesc(strings.languageDescription).addDropdown(
      (dropdown) => dropdown.addOption("en", strings.languageEn).addOption("ko", strings.languageKo).addOption("ja", strings.languageJp).setValue(this.plugin.settings.language).onChange(async (value) => {
        const previousLanguage = this.plugin.settings.language;
        const previousDefaultPrompt = getDefaultSystemPrompt(previousLanguage);
        this.plugin.settings.language = value;
        if (this.plugin.settings.systemPrompt.trim() === previousDefaultPrompt) {
          this.plugin.settings.systemPrompt = getDefaultSystemPrompt(this.plugin.settings.language);
        }
        await this.plugin.saveSettings();
        await this.plugin.refreshChatViews();
        this.display();
      })
    );
    new import_obsidian6.Setting(containerEl).setName(strings.defaultProvider).setDesc(strings.defaultProviderDescription).addDropdown(
      (dropdown) => dropdown.addOption("openai", "OpenAI").addOption("gemini", "Gemini").setValue(this.plugin.settings.defaultProvider).onChange(async (value) => {
        this.plugin.settings.defaultProvider = value;
        await this.plugin.saveSettings();
        await this.plugin.refreshChatViews();
      })
    );
    new import_obsidian6.Setting(containerEl).setName(strings.openaiApiKey).setDesc(strings.openaiApiKeyDescription).addText((text) => {
      text.inputEl.type = "password";
      return text.setPlaceholder("sk-...").setValue(this.plugin.settings.openai.apiKey).onChange(async (value) => {
        this.plugin.settings.openai.apiKey = value.trim();
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian6.Setting(containerEl).setName(strings.openaiModel).setDesc(strings.openaiModelDescription).addDropdown(
      (dropdown) => OPENAI_MODEL_OPTIONS.reduce((current, model) => current.addOption(model, model), dropdown).setValue(this.plugin.settings.openai.model).onChange(async (value) => {
        this.plugin.settings.openai.model = value;
        await this.plugin.saveSettings();
        await this.plugin.refreshChatViews();
      })
    );
    new import_obsidian6.Setting(containerEl).setName(strings.geminiApiKey).setDesc(strings.geminiApiKeyDescription).addText((text) => {
      text.inputEl.type = "password";
      return text.setPlaceholder("AIza...").setValue(this.plugin.settings.gemini.apiKey).onChange(async (value) => {
        this.plugin.settings.gemini.apiKey = value.trim();
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian6.Setting(containerEl).setName(strings.geminiModel).setDesc(strings.geminiModelDescription).addDropdown(
      (dropdown) => GEMINI_MODEL_OPTIONS.reduce((current, model) => current.addOption(model, model), dropdown).setValue(this.plugin.settings.gemini.model).onChange(async (value) => {
        this.plugin.settings.gemini.model = value;
        await this.plugin.saveSettings();
        await this.plugin.refreshChatViews();
      })
    );
    new import_obsidian6.Setting(containerEl).setName(strings.systemPrompt).setDesc(strings.systemPromptDescription).addTextArea(
      (text) => text.setValue(this.plugin.settings.systemPrompt).onChange(async (value) => {
        this.plugin.settings.systemPrompt = value.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian6.Setting(containerEl).setName(strings.defaultVaultRetrieval).setDesc(strings.defaultVaultRetrievalDescription).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.defaultUseVault).onChange(async (value) => {
        this.plugin.settings.defaultUseVault = value;
        await this.plugin.saveSettings();
        await this.plugin.refreshChatViews();
      })
    );
    new import_obsidian6.Setting(containerEl).setName(strings.defaultWebGrounding).setDesc(strings.defaultWebGroundingDescription).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.defaultUseWeb).onChange(async (value) => {
        this.plugin.settings.defaultUseWeb = value;
        await this.plugin.saveSettings();
        await this.plugin.refreshChatViews();
      })
    );
    new import_obsidian6.Setting(containerEl).setName(strings.defaultIncludeSources).setDesc(strings.defaultIncludeSourcesDescription).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.defaultIncludeSources).onChange(async (value) => {
        this.plugin.settings.defaultIncludeSources = value;
        await this.plugin.saveSettings();
        await this.plugin.refreshChatViews();
      })
    );
    new import_obsidian6.Setting(containerEl).setName(strings.maxVaultResults).setDesc(strings.maxVaultResultsDescription).addSlider(
      (slider) => slider.setLimits(1, 10, 1).setValue(this.plugin.settings.maxVaultResults).setDynamicTooltip().onChange(async (value) => {
        this.plugin.settings.maxVaultResults = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian6.Setting(containerEl).setName(strings.chunkSize).setDesc(strings.chunkSizeDescription).addSlider(
      (slider) => slider.setLimits(600, 2400, 50).setValue(this.plugin.settings.chunkSize).setDynamicTooltip().onChange(async (value) => {
        this.plugin.settings.chunkSize = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian6.Setting(containerEl).setName(strings.chunkOverlap).setDesc(strings.chunkOverlapDescription).addSlider(
      (slider) => slider.setLimits(0, 400, 10).setValue(this.plugin.settings.chunkOverlap).setDynamicTooltip().onChange(async (value) => {
        this.plugin.settings.chunkOverlap = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian6.Setting(containerEl).setName(strings.createNoteFolder).setDesc(strings.createNoteFolderDescription).addText(
      (text) => text.setPlaceholder("ObsiLLM Drafts").setValue(this.plugin.settings.createNoteFolder).onChange(async (value) => {
        this.plugin.settings.createNoteFolder = value.trim();
        await this.plugin.saveSettings();
      })
    );
  }
};

// src/ui/chat-view.ts
var import_obsidian7 = require("obsidian");
var OBSILLM_VIEW_TYPE = "obsillm-chat-view";
var ObsiLLMChatView = class extends import_obsidian7.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.providerButtons = {};
    this.entries = [];
  }
  getViewType() {
    return OBSILLM_VIEW_TYPE;
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
      prompt: this.promptInput?.value
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
      includeSources: options?.includeSources
    });
  }
  renderLayout() {
    const strings = this.plugin.getStrings();
    const hero = this.contentEl.createDiv({ cls: "obsillm-hero" });
    hero.createEl("h2", { text: strings.workspaceTitle });
    hero.createEl("p", {
      text: strings.workspaceDescription
    });
    const controls = this.contentEl.createDiv({ cls: "obsillm-controls" });
    const grid = controls.createDiv({ cls: "obsillm-grid" });
    const providerField = grid.createDiv({ cls: "obsillm-field" });
    providerField.createEl("label", { text: strings.provider });
    const providerSwitch = providerField.createDiv({ cls: "obsillm-provider-switch" });
    this.providerButtons.openai = providerSwitch.createEl("button", {
      text: "OpenAI",
      cls: "obsillm-provider-button"
    });
    this.providerButtons.gemini = providerSwitch.createEl("button", {
      text: "Gemini",
      cls: "obsillm-provider-button"
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
      this.plugin.settings.defaultIncludeSources
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
      cls: "obsillm-secondary"
    });
    autoDraftCurrentButton.onclick = () => void this.autoDraftCurrentNote();
    const autoDraftChildrenButton = automationActions.createEl("button", {
      text: strings.autoDraftChildNotes,
      cls: "obsillm-secondary"
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
        text: model
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
      useWeb: this.webToggle.checked
    };
  }
  async autoDraftCurrentNote() {
    const strings = this.plugin.getStrings();
    this.statusEl.setText(strings.autoDraftingCurrentNote);
    try {
      await this.plugin.autoDraftCurrentNote(this.getGenerationOptions());
      this.statusEl.setText(strings.currentNoteAutoDrafted);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.statusEl.setText(message);
      new import_obsidian7.Notice(message);
    }
  }
  async autoDraftChildNotes() {
    const strings = this.plugin.getStrings();
    this.statusEl.setText(strings.autoDraftingChildNotes);
    try {
      const count = await this.plugin.autoDraftChildNotes(this.getGenerationOptions(), (current, total, title) => {
        this.statusEl.setText(`${strings.autoDraftProgress} ${current}/${total} \xB7 ${title}`);
      });
      this.statusEl.setText(`${strings.childNotesAutoDrafted} ${count}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.statusEl.setText(message);
      new import_obsidian7.Notice(message);
    }
  }
  async submitPrompt(options) {
    const strings = this.plugin.getStrings();
    const prompt = this.promptInput.value.trim();
    if (!prompt) {
      new import_obsidian7.Notice(strings.enterPromptFirst);
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
      loading: true
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
        useWeb
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
          targetFile
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
  async renderTranscript() {
    const strings = this.plugin.getStrings();
    this.transcriptEl.empty();
    if (this.entries.length === 0) {
      this.transcriptEl.createDiv({
        cls: "obsillm-empty",
        text: strings.transcriptEmpty
      });
      return;
    }
    for (const entry of this.entries) {
      const userMessage = this.transcriptEl.createDiv({ cls: "obsillm-message obsillm-message-user" });
      const userHeader = userMessage.createDiv({ cls: "obsillm-message-header" });
      userHeader.createSpan({ text: strings.user });
      userHeader.createSpan({
        text: `${entry.provider} | ${entry.model} | ${entry.useVault ? strings.vaultOn : strings.vaultOff} | ${entry.useWeb ? strings.webOn : strings.webOff}`
      });
      userMessage.createDiv({ cls: "obsillm-message-body", text: entry.prompt });
      const assistantMessage = this.transcriptEl.createDiv({
        cls: "obsillm-message obsillm-message-assistant"
      });
      const assistantHeader = assistantMessage.createDiv({ cls: "obsillm-message-header" });
      assistantHeader.createSpan({ text: strings.assistant });
      assistantHeader.createSpan({ text: entry.loading ? strings.working : entry.error ? strings.error : strings.ready });
      const body = assistantMessage.createDiv({
        cls: `obsillm-message-body${entry.error ? " obsillm-error" : ""}`
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
      const resolveTargetFile = () => this.plugin.getMarkdownFileByPath(entry.targetFilePath) ?? this.plugin.getResolvedMarkdownFile();
      this.createActionButton(actions, strings.copyAnswer, async () => {
        try {
          await copyTextToClipboard(
            buildInsertionMarkdown(
              entry.response,
              this.plugin.settings.language,
              this.shouldIncludeSources(),
              entry.prompt
            )
          );
          this.statusEl.setText(strings.copied);
        } catch (error) {
          const detail = error instanceof Error ? `: ${error.message}` : "";
          throw new Error(`${strings.clipboardError}${detail}`);
        }
      });
      this.createActionButton(actions, strings.moveToFile, async () => {
        await this.plugin.applyResponse(
          entry.response,
          "insert-cursor",
          entry.prompt,
          this.shouldIncludeSources(),
          resolveTargetFile()
        );
        this.statusEl.setText(strings.insertedToFile);
      });
      this.createActionButton(actions, strings.replaceSelection, async () => {
        await this.plugin.applyResponse(
          entry.response,
          "replace-selection",
          entry.prompt,
          this.shouldIncludeSources(),
          resolveTargetFile()
        );
        this.statusEl.setText(strings.replacedSelection);
      });
      this.createActionButton(actions, strings.saveToFolder, async () => {
        const createdFile = await this.plugin.applyResponse(
          entry.response,
          "create-note",
          entry.prompt,
          this.shouldIncludeSources(),
          resolveTargetFile()
        );
        entry.targetFilePath = createdFile?.path ?? entry.targetFilePath;
        this.statusEl.setText(strings.savedToFolder);
      });
      this.createActionButton(actions, strings.saveToCurrentFolder, async () => {
        const createdFile = await this.plugin.applyResponse(
          entry.response,
          "create-note-current-folder",
          entry.prompt,
          this.shouldIncludeSources(),
          resolveTargetFile()
        );
        entry.targetFilePath = createdFile?.path ?? entry.targetFilePath;
        this.statusEl.setText(strings.savedToCurrentFolder);
      });
      this.createActionButton(actions, strings.createOutlineNotes, async () => {
        const count = await this.plugin.createOutlineNotes(
          entry.response,
          entry.prompt,
          resolveTargetFile()
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
              cls: "link-like"
            });
            button.onclick = () => void this.plugin.openCitation(citation);
            if (citation.excerpt) {
              item.createSpan({ text: ` - ${citation.excerpt}` });
            }
          } else {
            const anchor = item.createEl("a", {
              text: citation.title,
              href: citation.url ?? "#"
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
      } catch (error) {
        new import_obsidian7.Notice(error instanceof Error ? error.message : String(error));
      }
    };
  }
  shouldIncludeSources(override) {
    return typeof override === "boolean" ? override : this.includeSourcesToggle.checked;
  }
};

// src/ui/prompt-modal.ts
var import_obsidian8 = require("obsidian");
var PromptModal = class extends import_obsidian8.Modal {
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
    this.textArea = new import_obsidian8.TextAreaComponent(contentEl);
    this.textArea.setPlaceholder(this.options.placeholder ?? "Ask ObsiLLM...").setValue(this.initialValue).inputEl.addClass("obsillm-prompt-modal");
    this.textArea.inputEl.rows = this.options.rows ?? 8;
    this.textArea.inputEl.focus();
    const actions = contentEl.createDiv({ cls: "obsillm-actions" });
    new import_obsidian8.ButtonComponent(actions).setButtonText(this.options.cancelText ?? "Cancel").setClass("obsillm-secondary").onClick(() => this.finish(null));
    new import_obsidian8.ButtonComponent(actions).setButtonText(this.options.submitText ?? "Submit").setClass("obsillm-primary").onClick(() => this.finish(this.textArea.getValue().trim() || null));
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
};

// src/plugin.ts
var ObsiLLMPlugin = class extends import_obsidian9.Plugin {
  constructor() {
    super(...arguments);
    this.settings = DEFAULT_SETTINGS;
    this.conversation = [];
    this.lastMarkdownFilePath = null;
  }
  async onload() {
    await this.loadSettings();
    this.vaultIndex = new VaultIndex(this.app, () => this.settings);
    this.providers = {
      openai: new OpenAIProviderAdapter(this.settings.openai),
      gemini: new GeminiProviderAdapter(this.settings.gemini)
    };
    const strings = this.getStrings();
    this.registerView(OBSILLM_VIEW_TYPE, (leaf) => new ObsiLLMChatView(leaf, this));
    this.addRibbonIcon("bot", strings.ribbonOpen, () => {
      void this.activateView();
    });
    this.addSettingTab(new ObsiLLMSettingTab(this.app, this));
    this.addCommands();
    this.registerVaultEvents();
    this.registerWorkspaceTracking();
    this.app.workspace.onLayoutReady(() => {
      this.rememberMarkdownFile(this.getActiveMarkdownFile());
      void this.vaultIndex.ensureReady();
    });
  }
  async onunload() {
    this.app.workspace.detachLeavesOfType(OBSILLM_VIEW_TYPE);
  }
  getStrings() {
    return getStrings(this.settings.language);
  }
  async refreshChatViews() {
    const leaves = this.app.workspace.getLeavesOfType(OBSILLM_VIEW_TYPE);
    for (const leaf of leaves) {
      const view = leaf.view;
      if (view instanceof ObsiLLMChatView) {
        await view.refresh();
      }
    }
  }
  getModelForProvider(provider) {
    return provider === "openai" ? this.settings.openai.model : this.settings.gemini.model;
  }
  async loadSettings() {
    const loaded = await this.loadData();
    const loadedLanguage = typeof loaded?.language === "string" ? loaded.language : void 0;
    const shouldPersistLanguageMigration = loadedLanguage === "jp";
    const language = loadedLanguage === "jp" ? "ja" : loadedLanguage === "en" || loadedLanguage === "ko" || loadedLanguage === "ja" ? loadedLanguage : DEFAULT_SETTINGS.language;
    const openaiModel = loaded?.openai?.model?.trim();
    const geminiModel = loaded?.gemini?.model?.trim();
    const systemPrompt = loaded?.systemPrompt && !isDefaultSystemPrompt(loaded.systemPrompt) ? loaded.systemPrompt.trim() : getDefaultSystemPrompt(language);
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...loaded,
      language,
      systemPrompt,
      openai: {
        ...DEFAULT_SETTINGS.openai,
        ...loaded?.openai,
        model: isSupportedModel("openai", openaiModel) ? openaiModel : getDefaultModel("openai")
      },
      gemini: {
        ...DEFAULT_SETTINGS.gemini,
        ...loaded?.gemini,
        model: geminiModel === "gemini-3-pro-preview" ? DEFAULT_SETTINGS.gemini.model : isSupportedModel("gemini", geminiModel) ? geminiModel : getDefaultModel("gemini")
      }
    };
    if (shouldPersistLanguageMigration) {
      await this.saveSettings();
    }
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  clearConversation() {
    this.conversation = [];
  }
  async activateView() {
    const existing = this.app.workspace.getLeavesOfType(OBSILLM_VIEW_TYPE)[0];
    const leaf = existing ?? this.app.workspace.getRightLeaf(false);
    if (!leaf) {
      throw new Error("Unable to open a right sidebar leaf.");
    }
    await leaf.setViewState({
      type: OBSILLM_VIEW_TYPE,
      active: true
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
      conversation: rememberConversation ? this.conversation.slice(-8) : []
    };
    const response = await adapter.generate(request);
    const sanitizedText = stripPromptEcho(response.text, options.prompt);
    if (rememberConversation) {
      this.conversation.push({ role: "user", content: options.prompt });
      this.conversation.push({ role: "assistant", content: sanitizedText });
      this.conversation = this.conversation.slice(-12);
    }
    return {
      ...response,
      text: sanitizedText,
      citations: uniqueCitations(response.citations)
    };
  }
  async applyResponse(response, mode, titleHint, includeSources = false, targetFile) {
    return applyResponseToWorkspace(
      this.app,
      this.settings,
      response,
      mode,
      titleHint,
      includeSources,
      targetFile ?? this.getActiveMarkdownFile()
    );
  }
  async createOutlineNotes(response, prompt, targetFile) {
    return createOutlineNotesFromResponse(
      this.app,
      this.settings,
      response,
      prompt,
      targetFile ?? this.getActiveMarkdownFile()
    );
  }
  getResolvedMarkdownFile() {
    return this.getActiveMarkdownFile();
  }
  getMarkdownFileByPath(path) {
    if (!path) {
      return null;
    }
    const file = this.app.vault.getAbstractFileByPath(path);
    return file instanceof import_obsidian9.TFile && file.extension === "md" ? file : null;
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
      onProgress?.(completed + 1, files.length, stripFileNumberPrefix2(file.basename));
      const context = await this.buildAutoDraftContext(file);
      await this.generateAndApplyAutoDraft(context, options);
      completed += 1;
    }
    return completed;
  }
  async openCitation(citation) {
    if (citation.source === "vault" && citation.filePath) {
      const file = this.app.vault.getAbstractFileByPath(citation.filePath);
      if (file instanceof import_obsidian9.TFile) {
        await this.app.workspace.getLeaf(true).openFile(file);
        return;
      }
      throw new Error(`Vault file not found: ${citation.filePath}`);
    }
    const safeUrl = getSafeExternalUrl(citation.url);
    if (safeUrl) {
      window.open(safeUrl, "_blank", "noopener,noreferrer");
      return;
    }
    throw new Error("Unsupported citation URL.");
  }
  getActiveMarkdownFile() {
    const activeMarkdownView = this.app.workspace.getActiveViewOfType(import_obsidian9.MarkdownView);
    if (activeMarkdownView?.file) {
      this.rememberMarkdownFile(activeMarkdownView.file);
      return activeMarkdownView.file;
    }
    if (this.lastMarkdownFilePath) {
      const rememberedFile = this.app.vault.getAbstractFileByPath(this.lastMarkdownFilePath);
      if (rememberedFile instanceof import_obsidian9.TFile) {
        return rememberedFile;
      }
    }
    const markdownView = this.app.workspace.getLeavesOfType("markdown").map((leaf) => leaf.view).find((view) => view instanceof import_obsidian9.MarkdownView);
    const file = markdownView?.file ?? null;
    this.rememberMarkdownFile(file);
    return file;
  }
  async buildRetrievalContext(prompt, useVault, useWeb) {
    const preferredFile = this.getActiveMarkdownFile();
    const activeMarkdownView = this.app.workspace.getActiveViewOfType(import_obsidian9.MarkdownView);
    const markdownView = (activeMarkdownView?.file?.path === preferredFile?.path ? activeMarkdownView : null) ?? this.app.workspace.getLeavesOfType("markdown").map((leaf) => leaf.view).find((view) => view instanceof import_obsidian9.MarkdownView && view.file?.path === preferredFile?.path) ?? activeMarkdownView ?? this.app.workspace.getLeavesOfType("markdown").map((leaf) => leaf.view).find((view) => view instanceof import_obsidian9.MarkdownView);
    const file = preferredFile ?? markdownView?.file;
    const editor = markdownView?.editor;
    const fileText = file ? await this.app.vault.cachedRead(file) : "";
    const selection = editor?.getSelection().trim() || void 0;
    const explicitNoteContext = useVault && shouldUseExplicitNoteContext(prompt, selection);
    const activeNote = explicitNoteContext && file ? {
      path: file.path,
      title: file.basename,
      excerpt: truncate(fileText, 3500),
      selection
    } : void 0;
    const querySeed = [prompt, selection].filter(Boolean).join("\n").trim();
    const rawMatches = useVault && querySeed ? this.vaultIndex.search(querySeed, {
      excludePath: explicitNoteContext ? file?.path : void 0,
      limit: this.settings.maxVaultResults * 3
    }) : [];
    const matches = useVault ? filterRelevantVaultMatches(prompt, rawMatches, explicitNoteContext) : [];
    return {
      useVault,
      useWeb,
      activeNote,
      vaultMatches: matches.slice(0, this.settings.maxVaultResults)
    };
  }
  async generateAndApplyAutoDraft(context, options) {
    const prompt = buildAutoDraftPrompt(this.settings.language, context);
    const response = await this.generateResponse({
      ...options,
      prompt,
      rememberConversation: false
    });
    const parsed = parseAutoDraftResponse(response.text, context);
    const nextContent = applyAutoDraftToContent(context.noteContent, parsed, context);
    await this.app.vault.modify(context.file, nextContent);
  }
  async buildAutoDraftContext(file) {
    const noteContent = await this.app.vault.cachedRead(file);
    const detailHeading = detectSectionHeading(noteContent, DETAIL_SECTION_CANDIDATES) ?? DETAIL_SECTION_CANDIDATES[this.settings.language];
    const draftHeading = detectSectionHeading(noteContent, DRAFT_SECTION_CANDIDATES) ?? DRAFT_SECTION_CANDIDATES[this.settings.language];
    const detailItems = extractListItems(extractSectionBody(noteContent, detailHeading));
    const meaningfulDetailItems = detailItems.filter((item) => !isPlaceholderDetailItem(item));
    const parentPath = extractParentNotePath(noteContent);
    const parentTitle = extractParentNoteTitle(noteContent) ?? inferParentTitleFromFolder(file);
    const parentContent = parentTitle ? await this.readParentNoteContent(file, parentTitle, parentPath) : "";
    const parentOutline = parentContent ? extractParentOutline(parentContent) : "";
    const siblingTitles = await this.collectSiblingTitles(file, parentTitle);
    return {
      file,
      title: stripFileNumberPrefix2(file.basename),
      folderName: file.parent?.name ?? "",
      noteContent,
      detailHeading,
      draftHeading,
      detailItems: meaningfulDetailItems,
      hasPlaceholderDetails: meaningfulDetailItems.length === 0,
      parentTitle,
      parentOutline,
      siblingTitles
    };
  }
  async readParentNoteContent(file, parentTitle, parentPath) {
    if (parentPath) {
      const parentFile = this.app.vault.getAbstractFileByPath(parentPath);
      if (parentFile instanceof import_obsidian9.TFile) {
        return this.app.vault.cachedRead(parentFile);
      }
    }
    const localParent = file.parent?.children.find(
      (child) => maybeFile(child) && child.basename === parentTitle
    );
    if (localParent) {
      return this.app.vault.cachedRead(localParent);
    }
    return "";
  }
  async collectSiblingTitles(file, parentTitle) {
    const siblings = file.parent?.children.filter((child) => maybeFile(child) && child.extension === "md") ?? [];
    const titles = siblings.filter((candidate) => candidate.path !== file.path).map((candidate) => stripFileNumberPrefix2(candidate.basename)).filter((title) => title && title !== parentTitle);
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
    const files = await Promise.all(
      folder.children.filter((child) => maybeFile(child) && child.extension === "md").map(async (file) => {
        const content = await this.app.vault.cachedRead(file);
        return {
          file,
          content,
          score: scoreChildNoteCandidate(file, content)
        };
      })
    );
    return files.filter(({ score, file, content }) => score > 0 && !isParentOutlineNote(file, content)).sort((left, right) => compareNumberedTitles(left.file.basename, right.file.basename)).map(({ file }) => file);
  }
  addCommands() {
    const strings = this.getStrings();
    this.addCommand({
      id: "open-obsillm-chat",
      name: strings.openChatCommand,
      callback: () => void this.activateView()
    });
    this.addCommand({
      id: "ask-about-current-note",
      name: strings.askAboutCurrentNoteCommand,
      callback: async () => {
        const prompt = await new PromptModal(this.app, strings.askCurrentNoteTitle, "", {
          placeholder: strings.askCurrentNotePlaceholder,
          cancelText: strings.promptCancel,
          submitText: strings.promptSubmit
        }).openAndWait();
        if (!prompt) {
          return;
        }
        const view = await this.activateView();
        await view.runPrompt(prompt, {
          useVault: true,
          useWeb: this.settings.defaultUseWeb
        });
      }
    });
    this.addCommand({
      id: "draft-from-current-note",
      name: strings.draftCurrentNoteCommand,
      callback: async () => {
        try {
          await this.autoDraftCurrentNote({
            provider: this.settings.defaultProvider,
            model: this.getModelForProvider(this.settings.defaultProvider),
            useVault: true,
            useWeb: false
          });
          new import_obsidian9.Notice(strings.draftCommandSuccess);
        } catch (error) {
          new import_obsidian9.Notice(error instanceof Error ? error.message : String(error));
        }
      }
    });
    this.addCommand({
      id: "draft-all-child-notes",
      name: strings.draftChildNotesCommand,
      callback: async () => {
        try {
          await this.autoDraftChildNotes({
            provider: this.settings.defaultProvider,
            model: this.getModelForProvider(this.settings.defaultProvider),
            useVault: true,
            useWeb: false
          });
          new import_obsidian9.Notice(strings.draftCommandSuccess);
        } catch (error) {
          new import_obsidian9.Notice(error instanceof Error ? error.message : String(error));
        }
      }
    });
    this.addCommand({
      id: "insert-cited-answer",
      name: strings.insertCitedAnswerCommand,
      callback: async () => {
        const prompt = await new PromptModal(this.app, strings.insertCitedAnswerTitle, "", {
          placeholder: strings.insertCitedAnswerPlaceholder,
          cancelText: strings.promptCancel,
          submitText: strings.promptSubmit
        }).openAndWait();
        if (!prompt) {
          return;
        }
        const view = await this.activateView();
        await view.runPrompt(prompt, {
          useVault: true,
          useWeb: true,
          insertionModeAfterResponse: "insert-cursor",
          includeSources: true
        });
      }
    });
  }
  registerVaultEvents() {
    this.registerEvent(this.app.vault.on("create", (file) => void this.vaultIndex.onFileChanged(file)));
    this.registerEvent(this.app.vault.on("modify", (file) => void this.vaultIndex.onFileChanged(file)));
    this.registerEvent(this.app.vault.on("delete", (file) => this.vaultIndex.onFileDeleted(file)));
    this.registerEvent(this.app.vault.on("rename", (file, oldPath) => void this.vaultIndex.onFileRenamed(file, oldPath)));
  }
  registerWorkspaceTracking() {
    this.registerEvent(
      this.app.workspace.on("file-open", (file) => {
        if (file instanceof import_obsidian9.TFile && file.extension === "md") {
          this.rememberMarkdownFile(file);
        }
      })
    );
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        const view = leaf?.view;
        if (view instanceof import_obsidian9.MarkdownView && view.file) {
          this.rememberMarkdownFile(view.file);
        }
      })
    );
  }
  rememberMarkdownFile(file) {
    if (file instanceof import_obsidian9.TFile && file.extension === "md") {
      this.lastMarkdownFilePath = file.path;
    }
  }
};
var DETAIL_SECTION_CANDIDATES = {
  en: "Details",
  ko: "\uC138\uBD80 \uC8FC\uC81C",
  ja: "\u8A73\u7D30\u30C8\u30D4\u30C3\u30AF"
};
var DRAFT_SECTION_CANDIDATES = {
  en: "Draft",
  ko: "\uCD08\uC548",
  ja: "\u4E0B\u66F8\u304D"
};
function getLocalizedListPlaceholder(language) {
  return getStrings(language).emptyListPlaceholder;
}
function getLocalizedSiblingPlaceholder(language) {
  return getStrings(language).emptySiblingPlaceholder;
}
function getLocalizedParentOutlinePlaceholder(language) {
  return getStrings(language).missingParentOutlinePlaceholder;
}
function getAutoDraftFallbackLanguage(context) {
  return findLanguageForHeading(context.detailHeading, context.draftHeading);
}
function findLanguageForHeading(detailHeading, draftHeading) {
  for (const language of Object.keys(DETAIL_SECTION_CANDIDATES)) {
    if (DETAIL_SECTION_CANDIDATES[language] === detailHeading || DRAFT_SECTION_CANDIDATES[language] === draftHeading) {
      return language;
    }
  }
  return "en";
}
function buildAutoDraftPrompt(language, context) {
  const detailHeading = context.detailHeading;
  const draftHeading = context.draftHeading;
  const siblingBlock = context.siblingTitles.length > 0 ? context.siblingTitles.map((title) => `- ${title}`).join("\n") : `- ${getLocalizedSiblingPlaceholder(language)}`;
  const existingDetails = context.detailItems.length > 0 ? context.detailItems.map((item) => `- ${item}`).join("\n") : `- ${getLocalizedListPlaceholder(language)}`;
  const parentOutline = context.parentOutline || `- ${getLocalizedParentOutlinePlaceholder(language)}`;
  const noteBody = truncate(stripFrontmatter2(context.noteContent), 4500);
  if (language === "ja") {
    return [
      "Obsidian \u306E\u5B50\u30CE\u30FC\u30C8 1 \u4EF6\u3092\u57CB\u3081\u3066\u304F\u3060\u3055\u3044\u3002",
      `\u51FA\u529B\u306F\u5FC5\u305A\u6B21\u306E 2 \u30BB\u30AF\u30B7\u30E7\u30F3\u3060\u3051\u306B\u3057\u3066\u304F\u3060\u3055\u3044: \`## ${detailHeading}\` \u3068 \`## ${draftHeading}\``,
      "\u30BF\u30A4\u30C8\u30EB\u306E\u8A00\u3044\u76F4\u3057\u3001\u6328\u62F6\u3001\u524D\u7F6E\u304D\u3001\u30E1\u30BF\u8AAC\u660E\u3001\u30B3\u30FC\u30C9\u30D5\u30A7\u30F3\u30B9\u306F\u7981\u6B62\u3067\u3059\u3002",
      context.hasPlaceholderDetails ? "\u73FE\u5728\u306E\u8A73\u7D30\u30C8\u30D4\u30C3\u30AF\u306F\u7A7A\u304B\u30D7\u30EC\u30FC\u30B9\u30DB\u30EB\u30C0\u30FC\u3067\u3059\u3002\u3053\u306E\u30CE\u30FC\u30C8\u306B\u5408\u3046 3\u301C5 \u500B\u306E\u5C0F\u9805\u76EE\u3092\u5148\u306B\u6574\u7406\u3057\u3066\u304F\u3060\u3055\u3044\u3002" : "\u73FE\u5728\u306E\u8A73\u7D30\u30C8\u30D4\u30C3\u30AF\u306F\u7DAD\u6301\u3057\u3064\u3064\u3001\u5FC5\u8981\u306A\u3089\u8868\u73FE\u3060\u3051\u6574\u3048\u3066\u304F\u3060\u3055\u3044\u3002",
      "\u672C\u6587\u306F\u3053\u306E\u30CE\u30FC\u30C8\u306E\u62C5\u5F53\u7BC4\u56F2\u3060\u3051\u3092\u66F8\u304D\u3001\u5144\u5F1F\u30CE\u30FC\u30C8\u3068\u91CD\u8907\u3057\u3059\u304E\u306A\u3044\u3088\u3046\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      "\u4E0B\u66F8\u304D\u672C\u6587\u306F Markdown \u3067\u66F8\u304D\u3001\u5FC5\u8981\u306A\u3089 `###` \u898B\u51FA\u3057\u3092\u4F7F\u3063\u3066\u304F\u3060\u3055\u3044\u3002",
      "",
      `[\u73FE\u5728\u30CE\u30FC\u30C8\u30BF\u30A4\u30C8\u30EB]
${context.title}`,
      context.parentTitle ? `[\u89AA\u30C6\u30FC\u30DE]
${context.parentTitle}` : "",
      `[\u89AA\u30CE\u30FC\u30C8\u306E\u76EE\u6B21]
${parentOutline}`,
      `[\u540C\u3058\u30D5\u30A9\u30EB\u30C0\u306E\u4ED6\u306E\u5B50\u30CE\u30FC\u30C8]
${siblingBlock}`,
      `[\u73FE\u5728\u306E\u8A73\u7D30\u30C8\u30D4\u30C3\u30AF]
${existingDetails}`,
      `[\u73FE\u5728\u30CE\u30FC\u30C8\u672C\u6587]
${noteBody}`
    ].filter(Boolean).join("\n\n");
  }
  if (language === "en") {
    return [
      "Fill one Obsidian child note.",
      `Output only these two sections: \`## ${detailHeading}\` and \`## ${draftHeading}\`.`,
      "Do not restate the title. Do not greet. Do not explain what you are doing. Do not use code fences.",
      context.hasPlaceholderDetails ? "The current detail list is empty or placeholder text. First infer 3-5 concrete subtopics for this note." : "Keep the current detail list unless a light cleanup makes it clearer.",
      "Write only the scope owned by this note, and avoid repeating sibling notes too much.",
      "Use Markdown prose. `###` subheadings are allowed inside the draft.",
      "",
      `[Current note title]
${context.title}`,
      context.parentTitle ? `[Parent topic]
${context.parentTitle}` : "",
      `[Parent outline]
${parentOutline}`,
      `[Sibling notes]
${siblingBlock}`,
      `[Current detail list]
${existingDetails}`,
      `[Current note body]
${noteBody}`
    ].filter(Boolean).join("\n\n");
  }
  return [
    "Obsidian \uD558\uC704 \uB178\uD2B8 \uD558\uB098\uB97C \uCC44\uC6B0\uC138\uC694.",
    `\uBC18\uB4DC\uC2DC \`## ${detailHeading}\` \uC640 \`## ${draftHeading}\` \uB450 \uC139\uC158\uB9CC \uCD9C\uB825\uD558\uC138\uC694.`,
    "\uC81C\uBAA9 \uC7AC\uC9C4\uC220, \uC778\uC0AC\uB9D0, \uBA54\uD0C0 \uC124\uBA85, \uCF54\uB4DC \uD39C\uC2A4\uB294 \uAE08\uC9C0\uD569\uB2C8\uB2E4.",
    context.hasPlaceholderDetails ? "\uD604\uC7AC \uC138\uBD80 \uC8FC\uC81C\uAC00 \uBE44\uC5B4 \uC788\uAC70\uB098 placeholder\uC785\uB2C8\uB2E4. \uC774 \uB178\uD2B8\uC5D0 \uB9DE\uB294 \uC138\uBD80 \uC8FC\uC81C\uB97C 3~5\uAC1C\uB85C \uBA3C\uC800 \uC815\uB9AC\uD558\uC138\uC694." : "\uD604\uC7AC \uC138\uBD80 \uC8FC\uC81C\uB294 \uC720\uC9C0\uD558\uB418, \uB354 \uBA85\uD655\uD574\uC9C8 \uB54C\uB9CC \uAC00\uBCCD\uAC8C \uC815\uB9AC\uD558\uC138\uC694.",
    "\uBCF8\uBB38\uC740 \uC774 \uB178\uD2B8\uAC00 \uB9E1\uC740 \uBC94\uC704\uB9CC \uC4F0\uACE0, \uAC19\uC740 \uD3F4\uB354\uC758 \uD615\uC81C \uB178\uD2B8\uC640 \uACFC\uD558\uAC8C \uACB9\uCE58\uC9C0 \uC54A\uAC8C \uC791\uC131\uD558\uC138\uC694.",
    "\uCD08\uC548\uC740 Markdown \uBCF8\uBB38\uC73C\uB85C \uC4F0\uACE0, \uD544\uC694\uD558\uBA74 `###` \uC18C\uC81C\uBAA9\uC744 \uC368\uB3C4 \uB429\uB2C8\uB2E4.",
    "",
    `[\uD604\uC7AC \uB178\uD2B8 \uC81C\uBAA9]
${context.title}`,
    context.parentTitle ? `[\uC0C1\uC704 \uC8FC\uC81C]
${context.parentTitle}` : "",
    `[\uBD80\uBAA8 \uB178\uD2B8 \uBAA9\uCC28]
${parentOutline}`,
    `[\uAC19\uC740 \uD3F4\uB354\uC758 \uB2E4\uB978 \uD558\uC704 \uB178\uD2B8]
${siblingBlock}`,
    `[\uD604\uC7AC \uC138\uBD80 \uC8FC\uC81C]
${existingDetails}`,
    `[\uD604\uC7AC \uB178\uD2B8 \uBCF8\uBB38]
${noteBody}`
  ].filter(Boolean).join("\n\n");
}
function parseAutoDraftResponse(text, context) {
  const detailSection = extractSectionBody(text, context.detailHeading) ?? extractSectionBody(text, DETAIL_SECTION_CANDIDATES.ko) ?? extractSectionBody(text, DETAIL_SECTION_CANDIDATES.en) ?? extractSectionBody(text, DETAIL_SECTION_CANDIDATES.ja) ?? "";
  const draftSection = extractSectionBody(text, context.draftHeading) ?? extractSectionBody(text, DRAFT_SECTION_CANDIDATES.ko) ?? extractSectionBody(text, DRAFT_SECTION_CANDIDATES.en) ?? extractSectionBody(text, DRAFT_SECTION_CANDIDATES.ja);
  const detailItems = extractListItems(detailSection);
  const fallbackDetailItems = context.detailItems.filter((item) => !isPlaceholderDetailItem(item));
  const cleanedFallback = stripSectionHeadings(
    text,
    [
      context.detailHeading,
      context.draftHeading,
      DETAIL_SECTION_CANDIDATES.ko,
      DETAIL_SECTION_CANDIDATES.en,
      DETAIL_SECTION_CANDIDATES.ja,
      DRAFT_SECTION_CANDIDATES.ko,
      DRAFT_SECTION_CANDIDATES.en,
      DRAFT_SECTION_CANDIDATES.ja
    ]
  );
  return {
    detailItems: detailItems.length > 0 ? detailItems : fallbackDetailItems,
    draftBody: (draftSection ?? cleanedFallback).trim()
  };
}
function applyAutoDraftToContent(content, parsed, context) {
  const strings = getStrings(getAutoDraftFallbackLanguage(context));
  const detailItems = parsed.detailItems.length > 0 ? parsed.detailItems : context.detailItems;
  const detailBody = detailItems.length > 0 ? detailItems.map((item) => `- ${item}`).join("\n") : `- ${strings.autoDraftDetailPlaceholder}`;
  const draftBody = parsed.draftBody || `- ${strings.autoDraftBodyPlaceholder}`;
  let next = upsertSecondLevelSection(content, context.detailHeading, detailBody);
  next = upsertSecondLevelSection(next, context.draftHeading, draftBody);
  return `${next.trimEnd()}
`;
}
function extractParentOutline(content) {
  return extractSectionBody(content, "\uBAA9\uCC28") ?? extractSectionBody(content, "Outline") ?? extractSectionBody(content, "Table of contents") ?? truncate(stripFrontmatter2(content), 1800);
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
  return file.parent?.name ? file.parent.name.trim() : void 0;
}
function detectSectionHeading(content, candidates) {
  for (const heading of Object.values(candidates)) {
    if (findSectionRange(content, heading)) {
      return heading;
    }
  }
  return void 0;
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
  const section = `## ${heading}
${body.trim()}
`;
  const range = findSectionRange(content, heading);
  if (!range) {
    return `${content.trimEnd()}

${section}`;
  }
  const before = content.slice(0, range.start).trimEnd();
  const after = content.slice(range.end).trimStart();
  return `${before}

${section}${after ? `
${after}` : ""}`;
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
  return normalized.includes("\uC138\uBD80 \uD56D\uBAA9\uC744 \uC815\uB9AC\uD558\uC138\uC694") || normalized.includes("\uC138\uBD80 \uC8FC\uC81C\uB97C \uC815\uB9AC\uD558\uC138\uC694") || normalized.includes("organize the detail items") || normalized.includes("\u6574\u7406\u3057\u3066\u304F\u3060\u3055\u3044");
}
function stripSectionHeadings(content, headings) {
  let next = content;
  for (const heading of headings) {
    const range = findSectionRange(next, heading);
    if (!range) {
      continue;
    }
    next = `${next.slice(0, range.start).trimEnd()}

${next.slice(range.end).trimStart()}`.trim();
  }
  return next.trim();
}
function stripFrontmatter2(content) {
  return content.replace(/^\s*---\n[\s\S]*?\n---\n*/, "").trim();
}
function stripFileNumberPrefix2(value) {
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
  if (Object.values(DETAIL_SECTION_CANDIDATES).some((heading) => findSectionRange(content, heading)) || Object.values(DRAFT_SECTION_CANDIDATES).some((heading) => findSectionRange(content, heading))) {
    score += 1;
  }
  return score;
}
function isParentOutlineNote(file, content) {
  const hasChildBinding = /^\s*parent_note:/m.test(content) || /^\s*parent_note_path:/m.test(content) || /상위 주제:\s*\[\[/.test(content);
  if (hasChildBinding) {
    return false;
  }
  return file.parent?.name === file.basename || /(^|\n)##\s+목차\s*$/m.test(content) || /(^|\n)##\s+Outline\s*$/m.test(content) || /(^|\n)##\s+Table of contents\s*$/im.test(content);
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
  if (selection && tokenize(selection).length > 0) {
    return true;
  }
  const normalized = normalizeForSearch(prompt);
  const notePhrases = [
    "current note",
    "active note",
    "this note",
    "this file",
    "current file",
    "\uD604\uC7AC \uB178\uD2B8",
    "\uC774 \uB178\uD2B8",
    "\uC9C0\uAE08 \uB178\uD2B8",
    "\uC774 \uBB38\uC11C",
    "\uC774 \uD30C\uC77C",
    "\uD604\uC7AC \uBB38\uC11C",
    "\uD604\uC7AC \uD30C\uC77C",
    "\u73FE\u5728\u306E\u30CE\u30FC\u30C8",
    "\u3053\u306E\u30CE\u30FC\u30C8",
    "\u3053\u306E\u30D5\u30A1\u30A4\u30EB",
    "\u73FE\u5728\u306E\u30D5\u30A1\u30A4\u30EB"
  ].map((phrase) => normalizeForSearch(phrase));
  return notePhrases.some((phrase) => phrase && normalized.includes(phrase));
}
function filterRelevantVaultMatches(prompt, matches, explicitNoteContext) {
  if (explicitNoteContext) {
    return matches;
  }
  const normalizedPrompt = normalizeForSearch(prompt);
  const tokens = tokenize(prompt);
  if (!normalizedPrompt || tokens.length === 0) {
    return [];
  }
  const filtered = matches.filter((match) => {
    const combined = normalizeForSearch(
      [match.title, match.headings.join(" "), match.tags.join(" "), match.aliases.join(" "), match.excerpt].join(" ")
    );
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
    return distinctHits >= 1 && (match.score >= 8 || normalizeForSearch(match.title).includes(tokens[0]));
  });
  return filtered;
}
