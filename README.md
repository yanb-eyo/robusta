# Robusta - Data Analysis Chat

An interactive web application for analyzing datasets using AI-powered conversations. Upload your data and ask natural language questions to get insights, statistics, and beautiful visualizations.

## Features

- 📊 **Interactive Charts** - Generate bar, line, area, pie, and scatter charts from your data
- 🗣️ **AI-Powered Analysis** - Ask questions about your data and get intelligent responses using Claude API
- 📁 **Multiple Format Support** - Upload CSV, JSON, BSON, or JSONL files
- 💬 **Conversation History** - Maintain context across multiple questions
- 🎨 **Beautiful UI** - Clean, intuitive interface with real-time visualization
- ⚡ **Streaming Responses** - See responses appear in real-time

## Setup

### Prerequisites
- Node.js (v16 or higher)
- OpenRouter API key (for Claude access)

### Installation

```bash
npm install
npm run dev
```

Open http://localhost:5173 (automatically opened by Vite).

## Configuration

1. Get an OpenRouter API key from [openrouter.ai](https://openrouter.ai)
2. In the application, paste your API key when prompted
3. Upload a CSV, JSON, BSON, or JSONL file containing your data
4. Start asking questions!

## Usage

1. **Upload Data** - Select and upload your dataset file
2. **Ask Questions** - Type natural language questions about your data
3. **Get Visualizations** - Request charts and graphs for visual analysis
4. **Explore Results** - Interact with charts and review AI insights

## Project Structure

```
src/
├── components/        # React components
│   ├── ChatArea.tsx   # Main chat display
│   ├── ChatInput.tsx  # User input field
│   ├── ChartRenderer.tsx # Interactive chart rendering
│   └── Header.tsx     # App header
├── services/          # API and external services
│   └── claudeApi.ts   # OpenRouter Claude integration
├── utils/             # Utility functions
│   ├── fileParser.ts  # CSV/JSON/BSON parsing
│   └── chartParser.ts # Chart data extraction
├── styles/            # Styling
│   ├── chat.css
│   ├── theme.css
│   └── index.css
└── App.tsx            # Main application component
```

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **Recharts** - Interactive chart library
- **Claude (via OpenRouter)** - AI analysis engine
- **PapaParse** - CSV parsing
- **Marked** - Markdown rendering

## License

MIT
