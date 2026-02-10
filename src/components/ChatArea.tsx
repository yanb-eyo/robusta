import React, {useEffect, useRef} from 'react';
import {marked} from 'marked';
import '../styles/chat.css';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

interface ChatAreaProps {
  messages: Message[];
  isLoading?: boolean;
  hasDataSource?: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({messages, isLoading = false, hasDataSource = false}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages, isLoading]);

  // Parse markdown for assistant messages
  const parseMarkdown = (content: string) => {
    try {
      return marked(content);
    } catch {
      return content;
    }
  };

  if (!hasDataSource) {
    return (
      <div className="chat-container">
        <div style={styles.emptyState}>
          <div className="empty-state-icon">📚</div>
          <div className="empty-state-title">No data source loaded</div>
          <div className="empty-state-subtitle">
            Upload a CSV, JSON, BSON, or JSONL file to get started
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div style={styles.emptyStateWithData}>
            <div className="empty-state-icon">💬</div>
            <div className="empty-state-title">Start your analysis</div>
            <div className="empty-state-subtitle">
              Ask a question about your data
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.role}`}>
                <div className="message-avatar">
                  {message.role === 'user' ? 'You' : 'AI'}
                </div>
                <div className="message-bubble">
                  {message.role === 'assistant' ? (
                    <div
                      className="message-content"
                      dangerouslySetInnerHTML={{
                        __html: parseMarkdown(message.content),
                      }}
                    />
                  ) : (
                    <div className="message-content">{message.content}</div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <div className="message-avatar">AI</div>
                <div className="message-bubble">
                  <div className="spinner" style={{marginRight: '8px'}}/>
                </div>
              </div>
            )}
            <div ref={messagesEndRef}/>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center' as const,
    padding: '40px',
    color: 'var(--color-text-secondary)',
  },
  emptyStateWithData: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center' as const,
    padding: '40px',
    color: 'var(--color-text-secondary)',
  },
};
