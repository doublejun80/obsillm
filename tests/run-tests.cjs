const Module = require('node:module');
const originalLoad = Module._load;
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'obsidian') {
    class StubComponent {}
    class StubFile {}
    class StubView {}
    return {
      requestUrl: async () => {
        throw new Error('requestUrl stub should not be called in unit tests');
      },
      App: class {},
      ButtonComponent: class {
        setButtonText() { return this; }
        setClass() { return this; }
        onClick() { return this; }
      },
      CachedMetadata: class {},
      Component: StubComponent,
      ItemView: class extends StubComponent {},
      MarkdownRenderer: {},
      MarkdownView: StubView,
      Modal: class extends StubComponent {},
      Notice: class {},
      Plugin: class extends StubComponent {},
      PluginSettingTab: class extends StubComponent {},
      Setting: class {
        setName() { return this; }
        setDesc() { return this; }
        addDropdown(cb) { cb({ addOption() { return this; }, setValue() { return this; }, onChange() { return this; } }); return this; }
        addText(cb) { cb({ setPlaceholder() { return this; }, setValue() { return this; }, onChange() { return this; } }); return this; }
        addTextArea(cb) { cb({ setValue() { return this; }, onChange() { return this; } }); return this; }
        addToggle(cb) { cb({ setValue() { return this; }, onChange() { return this; } }); return this; }
        addSlider(cb) { cb({ setLimits() { return this; }, setValue() { return this; }, setDynamicTooltip() { return this; }, onChange() { return this; } }); return this; }
      },
      TAbstractFile: class {},
      TextAreaComponent: class {
        constructor() { this.inputEl = { addClass() {}, rows: 0, focus() {} }; }
        setPlaceholder() { return this; }
        setValue() { return this; }
        getValue() { return ''; }
      },
      TFile: StubFile,
      WorkspaceLeaf: class {},
      normalizePath: (value) => value,
    };
  }
  return originalLoad(request, parent, isMain);
};
const assert = require('node:assert/strict');

const { buildOpenAIRequest, parseOpenAIResponse } = require('../src/providers/openai.js');
const { buildGeminiRequest, parseGeminiResponse } = require('../src/providers/gemini.js');
const { buildSearchableChunks, rankVaultChunks } = require('../src/retrieval/vault-index.js');
const { applyTextInsertion, buildInsertionMarkdown } = require('../src/insertion.js');

const tests = [];

function addTest(name, fn) {
  tests.push({ name, fn });
}

addTest('OpenAI request enables web search and preserves the model', () => {
  const request = buildOpenAIRequest({
    provider: 'openai',
    model: 'gpt-5.2-codex',
    prompt: 'Summarize the note and verify one fact on the web.',
    systemPrompt: 'System instruction',
    retrieval: {
      useVault: true,
      useWeb: true,
      activeNote: {
        path: 'Projects/Plan.md',
        title: 'Plan',
        excerpt: 'A planning note',
      },
      vaultMatches: [
        {
          id: '1',
          filePath: 'Research/Source.md',
          title: 'Source',
          excerpt: 'Important excerpt',
          headings: ['Findings'],
          tags: ['#research'],
          aliases: [],
          score: 10,
          lastModified: Date.now(),
        },
      ],
    },
    conversation: [{ role: 'assistant', content: 'Previous answer' }],
  });

  assert.equal(request.model, 'gpt-5.2-codex');
  assert.equal(request.instructions, 'System instruction');
  assert.equal(request.input.length, 2);
  assert.equal(request.tools[0].type, 'web_search');
  assert.ok(request.include.includes('web_search_call.action.sources'));
});

addTest('OpenAI response parser extracts grounded citations', () => {
  const parsed = parseOpenAIResponse({
    output_text: 'Grounded answer',
    output: [
      {
        action: {
          sources: [{ title: 'OpenAI Docs', url: 'https://platform.openai.com/docs/models' }],
        },
      },
    ],
  });

  assert.equal(parsed.text, 'Grounded answer');
  assert.deepEqual(parsed.citations, [
    {
      id: 'web:https://platform.openai.com/docs/models',
      source: 'web',
      title: 'OpenAI Docs',
      url: 'https://platform.openai.com/docs/models',
    },
  ]);
});

addTest('Gemini request enables google_search grounding', () => {
  const request = buildGeminiRequest({
    provider: 'gemini',
    model: 'gemini-3-pro-preview',
    prompt: 'Compare the active note with current public information.',
    systemPrompt: 'System instruction',
    retrieval: {
      useVault: false,
      useWeb: true,
      activeNote: undefined,
      vaultMatches: [],
    },
    conversation: [{ role: 'user', content: 'Earlier question' }],
  });

  assert.equal(request.system_instruction.parts[0].text, 'System instruction');
  assert.equal(request.contents.length, 2);
  assert.deepEqual(request.tools, [{ google_search: {} }]);
});

addTest('Gemini response parser extracts grounding citations', () => {
  const parsed = parseGeminiResponse({
    candidates: [
      {
        content: {
          parts: [{ text: 'Grounded Gemini answer' }],
        },
        groundingMetadata: {
          groundingChunks: [
            {
              web: {
                uri: 'https://ai.google.dev/gemini-api/docs/google-search',
                title: 'Google Search grounding',
              },
            },
          ],
        },
      },
    ],
  });

  assert.equal(parsed.text, 'Grounded Gemini answer');
  assert.deepEqual(parsed.citations, [
    {
      id: 'web:https://ai.google.dev/gemini-api/docs/google-search',
      source: 'web',
      title: 'Google Search grounding',
      url: 'https://ai.google.dev/gemini-api/docs/google-search',
    },
  ]);
});

addTest('Vault ranking prefers title and heading matches', () => {
  const now = Date.now();
  const titleChunks = buildSearchableChunks({
    path: 'Notes/Weekly Review.md',
    title: 'Weekly Review',
    lastModified: now,
    content: 'Random body text.',
    metadata: {
      headings: [{ heading: 'Action items', level: 2, position: { start: { line: 1, col: 0, offset: 0 }, end: { line: 1, col: 12, offset: 12 } } }],
      tags: [],
      frontmatter: {},
    },
    chunkSize: 1000,
    chunkOverlap: 0,
  });

  const bodyChunks = buildSearchableChunks({
    path: 'Notes/Other.md',
    title: 'Other',
    lastModified: now - 20 * 86400000,
    content: 'This note mentions weekly review in the middle of the paragraph.',
    metadata: {
      headings: [],
      tags: [],
      frontmatter: {},
    },
    chunkSize: 1000,
    chunkOverlap: 0,
  });

  const ranked = rankVaultChunks('weekly review', [...titleChunks, ...bodyChunks], 2, now);
  assert.equal(ranked[0]?.filePath, 'Notes/Weekly Review.md');
});

addTest('Vault ranking returns tags and aliases', () => {
  const chunks = buildSearchableChunks({
    path: 'Research/LLM.md',
    title: 'LLM Overview',
    lastModified: Date.now(),
    content: 'Context about model orchestration.',
    metadata: {
      headings: [],
      tags: [{ tag: '#llm', position: { start: { line: 0, col: 0, offset: 0 }, end: { line: 0, col: 4, offset: 4 } } }],
      frontmatter: {
        aliases: ['Language Models'],
      },
    },
    chunkSize: 1000,
    chunkOverlap: 0,
  });

  const ranked = rankVaultChunks('language models llm', chunks, 1);
  assert.ok(ranked[0].tags.includes('#llm'));
  assert.ok(ranked[0].aliases.includes('Language Models'));
});

addTest('Insertion helpers replace selected text', () => {
  const next = applyTextInsertion(
    {
      document: 'Hello world',
      selectionStart: 6,
      selectionEnd: 11,
    },
    'ObsiLLM',
    'replace-selection',
  );

  assert.equal(next.document, 'Hello ObsiLLM');
});

addTest('Insertion markdown appends sources', () => {
  const markdown = buildInsertionMarkdown({
    provider: 'openai',
    model: 'gpt-5.2-codex',
    text: 'Draft answer',
    citations: [
      {
        id: 'vault:Notes/Plan.md',
        source: 'vault',
        title: 'Plan',
        filePath: 'Notes/Plan.md',
      },
      {
        id: 'web:https://example.com',
        source: 'web',
        title: 'Example',
        url: 'https://example.com',
      },
    ],
  });

  assert.ok(markdown.includes('## Sources'));
  assert.ok(markdown.includes('[[Notes/Plan|Plan]]'));
  assert.ok(markdown.includes('[Example](https://example.com)'));
});

let failures = 0;
for (const { name, fn } of tests) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${name}`);
    console.error(error);
  }
}

if (failures > 0) {
  process.exitCode = 1;
} else {
  console.log(`All ${tests.length} tests passed.`);
}



