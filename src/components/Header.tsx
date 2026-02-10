import React, {useRef} from 'react';
import '../styles/components.css';

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
    <header className="header">
      <div className="header-container">
        <div className="header-title-section">
          <h1 className="header-title">Data Analysis Chat</h1>
        </div>
        <div className="header-right-section">
          {currentFileName && (
            <span className="header-file-name">
              📄 {currentFileName}
            </span>
          )}
          <button
            onClick={handleFileClick}
            disabled={isLoading}
            className="header-upload-btn btn btn-secondary"
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
        className="file-input-hidden"
      />
    </header>
  );
};
