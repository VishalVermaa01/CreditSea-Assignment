// client/src/components/FileUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';

// FileUpload component: light-themed landing + file picker
export default function FileUpload({ onUploadSuccess, setIsLoading, isLoading = false }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const onFileUpload = async () => {
    if (!file) {
      setMessage('Please select an XML file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      setMessage('Processing...');
      const res = await axios.post('http://localhost:5001/api/upload', formData);
      onUploadSuccess(res.data);
      setMessage('Report generated successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Error: Could not process file. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-container" aria-live="polite">
      <div className="hero">
        <h1>Experian Credit Report Analyzer</h1>
        <p className="subtitle">Upload your soft credit-pull XML to get an easy-to-read summary.</p>
      </div>

      <div className="upload-controls">
        <input
          id="file-input"
          className="file-input"
          type="file"
          accept=".xml"
          onChange={onFileChange}
          aria-label="Upload XML file"
          disabled={isLoading}
        />

        <label htmlFor="file-input" className="file-pill" role="button">
          <span className="filename">{file ? file.name : 'Choose an XML file'}</span>
          <span className="browse">Browse</span>
        </label>

        <button onClick={onFileUpload} disabled={isLoading} aria-disabled={isLoading}>
          {isLoading ? 'Processing…' : 'Generate Report'}
        </button>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
}