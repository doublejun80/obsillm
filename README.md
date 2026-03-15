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
- Copy, insert into the current note, replace selection, and save-to-folder actions
- Command palette shortcuts for current-note workflows

## Defaults in this repo

- OpenAI default model: `gpt-5-mini`
- Gemini default model: `gemini-2.5-flash-lite`
- Gemini editable alternative: `gemini-2.5-flash`

The model fields stay editable because provider model names can change.

## Development

Requires Node.js 20+.

```bash
npm install
npm run typecheck
npm test
npm run build
```

`npm run build` now produces a bundled root `main.js` for Obsidian installation.

## Install in Obsidian

1. Build the plugin.
2. Open your vault folder.
3. Create this folder if it does not exist: `.obsidian/plugins/obsillm`
4. Copy these files into that folder:
   - `main.js`
   - `manifest.json`
   - `styles.css`
5. In Obsidian, open `Settings -> Community plugins`, refresh if needed, then enable `ObsiLLM`.

Example vault-relative install path:

```text
<your-vault>/.obsidian/plugins/obsillm/
```

The checked-in root `main.js` is bundled for Obsidian, so the usual install only needs `main.js`, `manifest.json`, and `styles.css`.
