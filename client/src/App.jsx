// client/src/App.jsx
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ReportDisplay from './components/ReportDisplay';
import './App.css';

// Top-level app: holds report data and loading state
function App() {
  // reportData: parsed report returned from server (or null)
  const [reportData, setReportData] = useState(null);
  // isLoading: true while server is processing uploaded file
  const [isLoading, setIsLoading] = useState(false);

  // Called by FileUpload when server returns parsed report
  const handleUploadSuccess = (data) => {
    setReportData(data);
  };

  return (
    <div className="App">
      {/* Upload area: receives loader setter and callback */}
      <FileUpload onUploadSuccess={handleUploadSuccess} setIsLoading={setIsLoading} isLoading={isLoading} />

      {/* Lightweight inline loading indicator (kept simple) */}
      {isLoading && (
        <p className="loading-indicator" aria-live="polite">
          Loading report...
        </p>
      )}

      {/* Render report if available */}
      <ReportDisplay data={reportData} />
    </div>
  );
}

export default App;