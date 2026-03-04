import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function ResumeUpload({ onFileSelect, file }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) onFileSelect(acceptedFiles[0]);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  return (
    <div className="upload-section">
      <label className="section-label">📄 Upload Resume (PDF)</label>
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'dragover' : ''} ${file ? 'has-file' : ''}`}>
        <input {...getInputProps()} />
        {file ? (
          <div className="file-selected">
            <span className="file-icon">✅</span>
            <span className="file-name">{file.name}</span>
            <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
        ) : (
          <div className="dropzone-prompt">
            <span className="upload-icon">📂</span>
            <p>{isDragActive ? 'Drop your PDF here...' : 'Drag & drop your resume PDF, or click to browse'}</p>
            <small>Max size: 5MB</small>
          </div>
        )}
      </div>
    </div>
  );
}