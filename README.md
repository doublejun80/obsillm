# ObsiLLM

ObsiLLM is an Obsidian desktop plugin that combines:

- OpenAI Responses API support with flexible model IDs
- Gemini native API support with Google Search grounding
- Local vault text retrieval across note titles, headings, aliases, tags, and body chunks
- A right-sidebar chat workspace for asking, drafting, and inserting grounded answers

## Features

- OpenAI and Gemini provider switching from the sidebar
- Web toggle and vault retrieval toggle per request
- Inline answer preview with a citations list
- Insert at cursor, replace selection, and create-note actions
- Command palette shortcuts for current-note workflows

## Verified defaults

- OpenAI default model: `gpt-5.2-codex`
- Gemini default model: `gemini-3-pro-preview`
- Gemini stable fallback: `gemini-2.5-pro`

The plugin keeps the model field editable because model names can change over time.

## Development

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run build
```

Test:

```bash
npm test
```
