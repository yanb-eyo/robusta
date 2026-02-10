import React, {useEffect, useRef, useState} from 'react';
import '../styles/components.css';


interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
                                                      onSendMessage,
                                                      disabled = false,
                                                      isLoading = false,
                                                    }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-adjust textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !disabled && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled
              ? 'Load a data source to start asking questions...'
              : 'Ask a question about your data... (Shift+Enter for new line)'
          }
          disabled={disabled || isLoading}
          className={`chat-textarea input ${disabled ? 'disabled' : ''}`}
        />
        <button
          onClick={handleSend}
          disabled={disabled || isLoading || !input.trim()}
          className="chat-send-btn btn btn-primary"
          title="Send message (Enter)"
        >
          {isLoading ? (
            <div className="spinner"/>
          ) : (
            <>
              Send
              <span className="chat-send-shortcut">↵</span>
            </>
          )}
        </button>
      </div>
      <div className="chat-input-hint">
        <span className="chat-input-hint-text">
          {disabled
            ? '📁 Upload a data file to enable chat'
            : '💡 Tip: You can ask analytical questions, request visualizations data, or get summaries'}
        </span>
      </div>
    </div>
  );};