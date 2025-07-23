import React, { useState } from 'react';
import '../css/Dashboard.css';
import dataService from '../client/dataService';
import { getConfig } from '../client/config';

const FileUploader = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Initialize API service with base URL
  React.useEffect(() => {
    const config = getConfig();
    dataService.configure(config.baseURL);
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadMsg('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMsg('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadMsg('Uploading...');

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Call the API using dataService
      const response = await dataService.uploadCandidates(selectedFile);
      
      setUploadMsg(`File "${selectedFile.name}" uploaded successfully!`);
      if (onUpload) onUpload(response);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadMsg(`Upload failed: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="dashboard-file-uploader dashboard-file-uploader-left">
      <h2>Upload File</h2>
      <input type="file" onChange={handleFileChange} style={{ margin: '1rem 0' }} />
      <button
        className="dashboard-file-uploader-upload-btn"
        onClick={handleUpload}
        disabled={isUploading}
        style={{ margin: '0.5rem 0' }}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
      <div style={{ 
        color: uploadMsg.includes('successfully') ? '#219150' : 
               uploadMsg.includes('failed') || uploadMsg.includes('error') ? '#d32f2f' : '#888', 
        marginTop: '1rem' 
      }}>
        {uploadMsg || 'Select a file to upload.'}
      </div>
    </div>
  );
};

export default FileUploader;
