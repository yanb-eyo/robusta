import React, {useEffect, useRef, useState} from 'react';

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
    <div style={styles.container}>
      <div style={styles.inputWrapper}>
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
          style={{
            ...styles.textarea,
            opacity: disabled ? 0.6 : 1,
          } as React.CSSProperties}
          className="input"
        />
        <button
          onClick={handleSend}
          disabled={disabled || isLoading || !input.trim()}
          style={styles.sendBtn}
          className="btn btn-primary"
          title="Send message (Enter)"
        >
          {isLoading ? (
            <div className="spinner"/>
          ) : (
            <>
              Send
              <span style={{fontSize: '12px'}}>↵</span>
            </>
          )}
        </button>
      </div>
      <div style={styles.hint}>
        <span style={styles.hintText}>
          {disabled
            ? '📁 Upload a data file to enable chat'
            : '💡 Tip: You can ask analytical questions, request visualizations data, or get summaries'}
        </span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '16px 24px 24px',
    borderTop: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-background)',
  } as React.CSSProperties,
  inputWrapper: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
    marginBottom: '8px',
  } as React.CSSProperties,
  textarea: {
    flex: 1,
    minHeight: '44px',
    maxHeight: '120px',
    padding: '12px 16px',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-family)',
    fontSize: '14px',
    lineHeight: '1.5',
    resize: 'none',
    overflow: 'auto',
  } as React.CSSProperties,
  sendBtn: {
    padding: '12px 24px',
    minWidth: '100px',
    height: '44px',
  } as React.CSSProperties,
  hint: {
    paddingLeft: '4px',
  } as React.CSSProperties,
  hintText: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  } as React.CSSProperties,
};
