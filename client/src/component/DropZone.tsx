import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
  onFileAdded: (files: File[]) => void;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileAdded }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle the dropped files here
    onFileAdded(acceptedFiles);
  }, [onFileAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={`dropzone mt-3 ${isDragActive ? 'active' : ''}`} {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag &amp; drop files here, or click to select files</p>
    </div>
  );
};

export default FileDropzone;
