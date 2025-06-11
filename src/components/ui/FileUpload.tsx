import React, { useRef, useState } from 'react';

interface FileUploadProps {
  maxSizeMB?: number;
  onFileRead?: (content: string, file: File) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  maxSizeMB = 2,
  onFileRead,
  accept = '.txt',
  multiple = false,
  label = 'Upload File',
}) => {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileContents, setFileContents] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    setError('');
    setFileContents([]);
    if (!files || files.length === 0) return;
    const names: string[] = [];
    const contents: string[] = [];
    Array.from(files).forEach((file) => {
      if (accept && !file.name.match(new RegExp(accept.replace(/\./g, '\\.').replace(/,/g, '|') + '$', 'i'))) {
        setError('Invalid file type.');
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File is too large. Max size is ${maxSizeMB}MB.`);
        return;
      }
      names.push(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        contents.push(text);
        if (onFileRead) onFileRead(text, file);
        setFileContents([...contents]);
      };
      reader.onerror = () => setError('Failed to read file.');
      reader.readAsText(file);
    });
    setFileNames(names);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      className={`w-full max-w-md mx-auto flex flex-col gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl shadow transition-colors duration-300 border-2 border-dashed ${dragActive ? 'border-blue-500 dark:border-orange-400 bg-blue-50 dark:bg-blue-950' : 'border-gray-200 dark:border-gray-700'}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      tabIndex={0}
      aria-label={label}
      role="region"
    >
      <label className="block font-semibold text-gray-800 dark:text-gray-100 mb-1">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleFileChange}
        aria-label={label}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-orange-400 dark:from-blue-600 dark:to-orange-500 text-white font-semibold shadow hover:scale-[1.03] active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-400"
      >
        Choose File
      </button>
      <div className="text-center text-gray-500 dark:text-gray-400 text-xs">or drag & drop here</div>
      {fileNames.length > 0 && (
        <div className="text-sm text-gray-700 dark:text-gray-200 truncate">Selected: <span className="font-medium">{fileNames.join(', ')}</span></div>
      )}
      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm font-medium" role="alert">{error}</div>
      )}
      {fileContents.length > 0 && (
        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs text-gray-900 dark:text-gray-100 max-h-40 overflow-auto whitespace-pre-line">
          {fileContents.map((content, i) => (
            <div key={i} className="mb-2">
              {content.slice(0, 2000) || 'No preview available.'}
              {content.length > 2000 && <span className="text-gray-400">... (truncated)</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload; 