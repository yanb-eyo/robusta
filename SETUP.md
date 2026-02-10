# Data Analysis ChatGPT Clone - Setup Instructions

## Quick Start

### Option 1: Using Environment Variables (Recommended)

Create a `.env.local` file in the project root:

```
VITE_ANTHROPIC_API_KEY=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
```

Then run:

```bash
npm run dev
```

The app will automatically load your API key on startup.

### Option 2: Enter API Key in the UI

1. Run `npm run dev`
2. When prompted, paste your OpenRouter API key (starts with `sk-or-`)
3. Click "Continue"

## Configuration

**API Provider:** OpenRouter
**Model:** Claude Opus 4.6 (claude-opus-4-1-20250805)
**Endpoint:** https://openrouter.ai/api/v1/chat/completions

## Features

✅ **File Upload:** CSV, JSON, JSONL, BSON
✅ **Real-time Streaming:** See responses appear character-by-character
✅ **Data Analysis:** Ask questions about your uploaded data
✅ **Markdown Rendering:** Responses formatted with proper styling
✅ **Conversation History:** Full context within a session
✅ **ChatGPT-like UI:** Familiar interface with your custom colors

## Your API Key

You've been provided with an OpenRouter API key:

```
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
```

Store this securely in your `.env.local` file (don't commit to git).

## Design

- **Colors:** #56f5ca (cyan), #3898ec (blue), rgb(22, 39, 67) (dark blue)
- **Font:** Sora, sans-serif
- **Stateless:** No persistence between sessions
- **Data:** All processing happens in the browser, no backend

## Example Queries

- "Analyze the top 5 rows of this dataset"
- "What's the average sales value?"
- "Create a summary table of monthly revenue"
- "What patterns do you notice in the data?"
- "Generate a visualization description of sales by category"
