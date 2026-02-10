import React, {useRef} from 'react';

interface HeaderProps {
  onFileSelected: (file: File) => void;
  currentFileName?: string;
  isLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({onFileSelected, currentFileName, isLoading = false}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Data Analysis Chat</h1>
        </div>
        <div style={styles.rightSection}>
          {currentFileName && (
            <span style={styles.fileName}>
              📄 {currentFileName}
            </span>
          )}
          <button
            onClick={handleFileClick}
            disabled={isLoading}
            style={styles.uploadBtn}
            className="btn btn-secondary"
          >
            {isLoading ? (
              <>
                <div className="spinner"/>
                Loading...
              </>
            ) : (
              <>
                📁 Load Data
              </>
            )}
          </button>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.json,.jsonl,.bson"
        onChange={handleFileChange}
        style={{display: 'none'}}
      />
    </header>
  );
};

const styles = {
  header: {
    padding: '16px 24px',
    borderBottom: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
  } as React.CSSProperties,
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  } as React.CSSProperties,
  titleSection: {
    flex: 1,
  } as React.CSSProperties,
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 600,
    color: 'var(--color-text)',
  } as React.CSSProperties,
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  } as React.CSSProperties,
  fileName: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    padding: '6px 12px',
    backgroundColor: 'rgba(86, 245, 202, 0.1)',
    borderRadius: '6px',
    maxWidth: '200px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  } as React.CSSProperties,
  uploadBtn: {
    minWidth: '130px',
  } as React.CSSProperties,
};
