import React, {useEffect, useRef} from 'react';
import {marked} from 'marked';
import {ChartRenderer} from './ChartRenderer';
import {extractChartData, removeChartMarkers} from '../utils/chartParser';
import '../styles/chat.css';
import '../styles/components.css';

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
        <div className="empty-state-message">
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
          <div className="empty-state-message">
            <div className="empty-state-icon">💬</div>
            <div className="empty-state-title">Start your analysis</div>
            <div className="empty-state-subtitle">
              Ask a question about your data
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const chartData = message.role === 'assistant' ? extractChartData(message.content) : null;
              const markdownContent = chartData ? removeChartMarkers(message.content) : message.content;
              
              return (
                <div key={message.id} className={`message ${message.role}`}>
                  <div className="message-avatar">
                    {message.role === 'user' ? 'You' : 'AI'}
                  </div>
                  <div className="message-bubble">
                    {message.role === 'assistant' ? (
                      <>
                        {chartData && <ChartRenderer chartData={chartData} />}
                        <div
                          className="message-content"
                          dangerouslySetInnerHTML={{
                            __html: parseMarkdown(markdownContent),
                          }}
                        />
                      </>
                    ) : (
                      <div className="message-content">{message.content}</div>
                    )}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="message assistant">
                <div className="message-avatar">AI</div>
                <div className="message-bubble">
                  <div className="spinner loading-spinner-inline"/>
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
