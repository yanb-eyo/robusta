import {useRef, useState} from 'react';
import {Header} from './components/Header';
import {ChatArea, Message} from './components/ChatArea';
import {ChatInput} from './components/ChatInput';
import {ParsedData, parseFile} from './utils/fileParser';
import {queryDataStreaming} from './services/claudeApi';
import './styles/theme.css';
import './styles/chat.css';

export default function App() {
  const [apiKey, setApiKey] = useState<string>('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');
  const [data, setData] = useState<ParsedData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>();
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(!apiKey);
  const messageIdRef = useRef(0);

  const handleFileSelected = async (file: File) => {
    setIsLoading(true);
    try {
      const parsedData = await parseFile(file);
      setData(parsedData);
      setFileName(file.name);
      setMessages([]);
      setShowApiKeyPrompt(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to parse file';
      alert(`Error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (question: string) => {
    if (!data || !apiKey) {
      alert('Please load a data source and set your API key');
      return;
    }

    const userMessage: Message = {
      id: `msg-${messageIdRef.current++}`,
      role: 'user',
      content: question,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let fullResponse = '';

      const assistantMessage: Message = {
        id: `msg-${messageIdRef.current++}`,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      await queryDataStreaming(
        apiKey,
        question,
        data,
        messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        (chunk) => {
          fullResponse += chunk;
          setMessages((prev) => {
            const updated = [...prev];
            const lastMessage = updated[updated.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.content = fullResponse;
            }
            return updated;
          });
        }
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get response';
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${messageIdRef.current++}`,
          role: 'assistant',
          content: `Error: ${message}`,
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (showApiKeyPrompt) {
    return (
      <div className="app" style={styles.apiKeyPrompt}>
        <div style={styles.apiKeyCard}>
          <h2 style={styles.apiKeyTitle}>API Key Required</h2>
          <p style={styles.apiKeyText}>
            Please enter your OpenRouter API key to use Claude Opus 4.6.
          </p>
          <input
            type="password"
            placeholder="Enter your OpenRouter API key (sk-or-...)..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="input"
            style={styles.apiKeyInput}
          />
          <div style={styles.apiKeyButtonGroup}>
            <button
              onClick={() => {
                if (apiKey.trim()) {
                  setShowApiKeyPrompt(false);
                }
              }}
              className="btn btn-primary"
            >
              Continue
            </button>
            <p style={styles.apiKeyHint}>
              Get your API key from{' '}
              <a href="https://openrouter.ai/" target="_blank" rel="noopener noreferrer" style={styles.link}>
                openrouter.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        onFileSelected={handleFileSelected}
        currentFileName={fileName}
        isLoading={isLoading && !data}
      />
      <ChatArea
        messages={messages}
        isLoading={isLoading}
        hasDataSource={!!data}
      />
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={!data}
        isLoading={isLoading}
      />
    </div>
  );
}

const styles = {
  apiKeyPrompt: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,
  apiKeyCard: {
    backgroundColor: 'var(--color-surface)',
    padding: '32px',
    borderRadius: '16px',
    border: '1px solid var(--color-border)',
    maxWidth: '400px',
    width: '90%',
  } as React.CSSProperties,
  apiKeyTitle: {
    margin: '0 0 12px 0',
    fontSize: '24px',
    fontWeight: 600,
    color: 'var(--color-text)',
  } as React.CSSProperties,
  apiKeyText: {
    margin: '0 0 20px 0',
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
  } as React.CSSProperties,
  apiKeyInput: {
    width: '100%',
    marginBottom: '20px',
  } as React.CSSProperties,
  apiKeyButtonGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  } as React.CSSProperties,
  apiKeyHint: {
    margin: '0',
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  } as React.CSSProperties,
  link: {
    color: 'var(--color-secondary)',
    textDecoration: 'none',
  } as React.CSSProperties,
};
