export type ProviderId = "openai" | "gemini";
export type AppLanguage = "en" | "ko" | "jp";

export type InsertionMode = "insert-cursor" | "replace-selection" | "create-note" | "create-note-current-folder";

export interface Citation {
  id: string;
  source: "vault" | "web";
  title: string;
  url?: string;
  filePath?: string;
  excerpt?: string;
}

export interface ActiveNoteContext {
  path: string;
  title: string;
  excerpt: string;
  selection?: string;
}

export interface VaultMatch {
  id: string;
  filePath: string;
  title: string;
  excerpt: string;
  headings: string[];
  tags: string[];
  aliases: string[];
  score: number;
  lastModified: number;
}

export interface RetrievalContext {
  useVault: boolean;
  useWeb: boolean;
  activeNote?: ActiveNoteContext;
  vaultMatches: VaultMatch[];
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  provider: ProviderId;
  model: string;
  prompt: string;
  systemPrompt: string;
  retrieval: RetrievalContext;
  conversation: ChatTurn[];
}

export interface ChatResponse {
  provider: ProviderId;
  model: string;
  text: string;
  citations: Citation[];
  raw?: unknown;
}

export interface ProviderAdapter {
  readonly id: ProviderId;
  readonly displayName: string;
  validate(): string | undefined;
  getModel(): string;
  generate(request: ChatRequest): Promise<ChatResponse>;
}

export interface ProviderSettings {
  apiKey: string;
  model: string;
}

export interface PluginSettings {
  language: AppLanguage;
  defaultProvider: ProviderId;
  openai: ProviderSettings;
  gemini: ProviderSettings;
  systemPrompt: string;
  defaultUseVault: boolean;
  defaultUseWeb: boolean;
  defaultIncludeSources: boolean;
  maxVaultResults: number;
  chunkSize: number;
  chunkOverlap: number;
  createNoteFolder: string;
}

export interface ProviderPromptEnvelope {
  prompt: string;
  vaultCitations: Citation[];
}
