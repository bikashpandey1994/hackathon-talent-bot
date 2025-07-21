import React, { useState } from 'react';
import '../css/Dashboard.css';

const FileUploader = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadMsg('');
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setUploadMsg('Please select a file to upload.');
      return;
    }
    // Simulate upload
    setTimeout(() => {
      setUploadMsg(`File "${selectedFile.name}" uploaded successfully!`);
      if (onUpload) onUpload();
    }, 800);
  };

  return (
    <div className="dashboard-file-uploader dashboard-file-uploader-left">
      <h2>Upload File</h2>
      <input type="file" onChange={handleFileChange} style={{ margin: '1rem 0' }} />
      <button
        className="dashboard-file-uploader-upload-btn"
        onClick={handleUpload}
        style={{ margin: '0.5rem 0' }}
      >
        Upload
      </button>
      <div style={{ color: uploadMsg.includes('successfully') ? '#219150' : '#888', marginTop: '1rem' }}>
        {uploadMsg || 'Select a file to upload.'}
      </div>
    </div>
  );
};

export default FileUploader;
