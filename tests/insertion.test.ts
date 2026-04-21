import { describe, expect, it } from "vitest";

import {
  applyTextInsertion,
  applyResponseToWorkspace,
  buildInsertionMarkdown,
  createOutlineNotesFromResponse,
  stripPromptEcho,
} from "../src/insertion";
import type { ChatResponse } from "../src/types";

describe("Insertion helpers", () => {
  it("replaces the current selection", () => {
    const next = applyTextInsertion(
      {
        document: "Hello world",
        selectionStart: 6,
        selectionEnd: 11,
      },
      "ObsiLLM",
      "replace-selection",
    );

    expect(next.document).toBe("Hello ObsiLLM");
  });

  it("returns plain answer text by default", () => {
    const response: ChatResponse = {
      provider: "openai",
      model: "gpt-5.2-codex",
      text: "Draft answer",
      citations: [
        {
          id: "vault:Notes/Plan.md",
          source: "vault",
          title: "Plan",
          filePath: "Notes/Plan.md",
        },
        {
          id: "web:https://example.com",
          source: "web",
          title: "Example",
          url: "https://example.com",
        },
      ],
    };

    expect(buildInsertionMarkdown(response)).toBe("Draft answer");
  });

  it("can append sources when requested", () => {
    const response: ChatResponse = {
      provider: "openai",
      model: "gpt-5.2-codex",
      text: "Draft answer",
      citations: [
        {
          id: "vault:Notes/Plan.md",
          source: "vault",
          title: "Plan",
          filePath: "Notes/Plan.md",
        },
        {
          id: "web:https://example.com",
          source: "web",
          title: "Example",
          url: "https://example.com",
        },
      ],
    };

    expect(buildInsertionMarkdown(response, "en", true)).toContain("## Sources");
    expect(buildInsertionMarkdown(response, "en", true)).toContain("[[Notes/Plan|Plan]]");
    expect(buildInsertionMarkdown(response, "en", true)).toContain("[Example](https://example.com/)");
  });

  it("strips an echoed prompt from the start of the answer", () => {
    const prompt = "codex 사용법에 대한 글을 쓸거야 목차 생성하고 그 목차에 맞게 글을 쓸거야. 일단 목차 생성해주고 말머리 적어줘.";
    const text = `${prompt}\n\n# Codex 사용법\n\n## 목차`;

    expect(stripPromptEcho(text, prompt)).toBe("# Codex 사용법\n\n## 목차");
  });

  it("strips a wrapped echoed prompt block from the start of the answer", () => {
    const prompt = "codex 사용법에 대한 글을 쓸거야 목차 생성하고 그 목차에 맞게 글을 쓸거야. 일단 목차 생성해주고 말머리 적어줘.";
    const text = `codex 사용법에 대한 글을 쓸거야 목차 생성하고 그 목차에 맞게 글을 쓸거야.\n일단 목차 생성해주고 말머리 적어줘.\n\n# Codex 사용법\n\n## 목차`;

    expect(stripPromptEcho(text, prompt)).toBe("# Codex 사용법\n\n## 목차");
  });

  it("strips greeting and boilerplate lead-in", () => {
    const prompt = "go lang 언어에 대해 블로그를 만들려고 해. 너가 생각한 제목과 목차를 적어주고 머리글을 써줘. 그다음 내가 목차별로 하나씩 물어볼께.";
    const text = `안녕하세요! ObsiLLM입니다.\nGo 언어(Golang)에 관한 블로그 개설을 환영합니다.\n\n요청하신 내용을 바탕으로 제안을 드립니다.\n\n# Go 언어 블로그 제목 제안`;

    expect(stripPromptEcho(text, prompt)).toBe("# Go 언어 블로그 제목 제안");
  });

  it("uses the first markdown heading as the saved note title source", () => {
    const response: ChatResponse = {
      provider: "gemini",
      model: "gemini-2.5-flash-lite",
      text: "# Obsidian 사용법\n\n## 시작하기",
      citations: [],
    };

    expect(buildInsertionMarkdown(response, "ko", false, "obsidian 사용법 제목으로 목차 생성해주고 머리글까지 써줘.")).toBe(
      "# Obsidian 사용법\n\n## 시작하기",
    );
  });

  it("does not duplicate the title inside a newly created note", async () => {
    const created: { path: string; content: string }[] = [];
    const response: ChatResponse = {
      provider: "gemini",
      model: "gemini-3.1-flash-lite-preview",
      text: "# Obsidian 활용 가이드: 지식 관리의 시작\n\n## 목차\n\n1. 시작하기",
      citations: [],
    };
    const app = {
      vault: {
        create: async (path: string, content: string) => {
          created.push({ path, content });
          return { path };
        },
        getAbstractFileByPath: () => null,
        createFolder: async () => undefined,
      },
      workspace: {
        getLeaf: () => ({
          openFile: async () => undefined,
        }),
      },
    } as never;

    await applyResponseToWorkspace(
      app,
      {
        language: "ko",
        defaultProvider: "gemini",
        openai: { apiKey: "", model: "gpt-5-mini" },
        gemini: { apiKey: "", model: "gemini-2.5-flash-lite" },
        systemPrompt: "",
        defaultUseVault: true,
        defaultUseWeb: true,
        defaultIncludeSources: false,
        maxVaultResults: 5,
        chunkSize: 1200,
        chunkOverlap: 180,
        createNoteFolder: "Drafts",
      },
      response,
      "create-note",
      "obsidian 사용법에 대해 제목과 목차를 정해서 적어줘.",
      false,
    );

    expect(created).toHaveLength(1);
    expect(created[0].path).toContain("Obsidian 활용 가이드 지식 관리의 시작");
    expect(created[0].content).toContain("created: ");
    expect(created[0].content).toContain("tags:");
    expect(created[0].content).toContain("  - IT");
    expect(created[0].content).toContain("  - Obsidian");
    expect(created[0].content).toContain("  - 지식관리");
    expect(created[0].content).toContain("llm_provider: gemini");
    expect(created[0].content).toContain('llm_model: "gemini-3.1-flash-lite-preview"');
    expect(created[0].content.startsWith("# Obsidian 활용 가이드: 지식 관리의 시작")).toBe(false);
    expect(created[0].content.trimEnd().endsWith("## 목차\n\n1. 시작하기")).toBe(true);
  });

  it("creates child notes from an outline response in the current folder", async () => {
    const created: { path: string; content: string }[] = [];
    const response: ChatResponse = {
      provider: "gemini",
      model: "gemini-3.1-flash-lite-preview",
      text: "# Obsidian 시작하기\n\n## 목차\n\n1. 설치와 볼트 만들기\n2. 노트 연결하기",
      citations: [],
    };
    const app = {
      vault: {
        create: async (path: string, content: string) => {
          created.push({ path, content });
          return { path };
        },
        getAbstractFileByPath: () => null,
        createFolder: async () => undefined,
      },
      workspace: {
        getActiveViewOfType: () => ({
          file: {
            path: "Drafts/Obsidian 시작하기/index.md",
            basename: "Obsidian 시작하기",
          },
        }),
      },
    } as never;

    const count = await createOutlineNotesFromResponse(
      app,
      {
        language: "ko",
        defaultProvider: "gemini",
        openai: { apiKey: "", model: "gpt-5-mini" },
        gemini: { apiKey: "", model: "gemini-2.5-flash-lite" },
        systemPrompt: "",
        defaultUseVault: true,
        defaultUseWeb: true,
        defaultIncludeSources: false,
        maxVaultResults: 5,
        chunkSize: 1200,
        chunkOverlap: 180,
        createNoteFolder: "Drafts",
      },
      response,
      "obsidian 사용법에 대한 목차를 만들어줘.",
    );

    expect(count).toBe(2);
    expect(created[0].path).toBe("Drafts/Obsidian 시작하기/01. 설치와 볼트 만들기.md");
    expect(created[1].path).toBe("Drafts/Obsidian 시작하기/02. 노트 연결하기.md");
    expect(created[0].content).toContain('parent_note: "[[Obsidian 시작하기]]"');
    expect(created[0].content).toContain('parent_note_path: "Drafts/Obsidian 시작하기/index.md"');
    expect(created[0].content).toContain("  - IT");
    expect(created[0].content).toContain("  - Obsidian");
    expect(created[0].content).toContain("  - Vault");
    expect(created[1].content).toContain("  - IT");
    expect(created[1].content).toContain("  - Obsidian");
  });

  it("groups bullet subtopics under each top-level outline note", async () => {
    const created: { path: string; content: string }[] = [];
    const parentFile = {
      path: "Drafts/Obsidian 완벽 가이드.md",
      name: "Obsidian 완벽 가이드.md",
      basename: "Obsidian 완벽 가이드",
      parent: {
        path: "Drafts",
        name: "Drafts",
      },
    };
    const response: ChatResponse = {
      provider: "gemini",
      model: "gemini-3.1-flash-lite-preview",
      text:
        "# Obsidian 완벽 가이드\n\n## 목차\n1. Obsidian 입문: 두뇌의 확장\n- Obsidian이란 무엇인가: 로컬 마크다운 기반의 지식 관리\n- 설치 및 기본 설정: 보관소(Vault) 생성과 동기화 전략\n2. 핵심 기능 파헤치기\n- 양방향 링크(Backlinks)와 지식의 연결\n- 그래프 뷰(Graph View)로 보는 사고의 흐름",
      citations: [],
    };
    const app = {
      vault: {
        create: async (path: string, content: string) => {
          created.push({ path, content });
          return { path };
        },
        getAbstractFileByPath: () => null,
        createFolder: async () => undefined,
      },
      fileManager: {
        renameFile: async (file: typeof parentFile, nextPath: string) => {
          file.path = nextPath;
          file.parent = {
            path: "Drafts/Obsidian 완벽 가이드",
            name: "Obsidian 완벽 가이드",
          };
        },
      },
      workspace: {
        getActiveViewOfType: () => ({
          file: parentFile,
        }),
      },
    } as never;

    const count = await createOutlineNotesFromResponse(
      app,
      {
        language: "ko",
        defaultProvider: "gemini",
        openai: { apiKey: "", model: "gpt-5-mini" },
        gemini: { apiKey: "", model: "gemini-2.5-flash-lite" },
        systemPrompt: "",
        defaultUseVault: true,
        defaultUseWeb: true,
        defaultIncludeSources: false,
        maxVaultResults: 5,
        chunkSize: 1200,
        chunkOverlap: 180,
        createNoteFolder: "Drafts",
      },
      response,
      "obsidian 완벽 가이드 목차를 정리해줘.",
    );

    expect(count).toBe(2);
    expect(created[0].path).toBe("Drafts/Obsidian 완벽 가이드/01. Obsidian 입문 두뇌의 확장.md");
    expect(created[0].content).toContain("## 세부 주제");
    expect(created[0].content).toContain('parent_note: "[[Obsidian 완벽 가이드]]"');
    expect(created[0].content).toContain('parent_note_path: "Drafts/Obsidian 완벽 가이드/Obsidian 완벽 가이드.md"');
    expect(created[0].content).toContain("- Obsidian이란 무엇인가: 로컬 마크다운 기반의 지식 관리");
    expect(created[0].content).toContain("- 설치 및 기본 설정: 보관소(Vault) 생성과 동기화 전략");
    expect(created[1].path).toBe("Drafts/Obsidian 완벽 가이드/02. 핵심 기능 파헤치기.md");
    expect(created[1].content).toContain("- 양방향 링크(Backlinks)와 지식의 연결");
  });
});
