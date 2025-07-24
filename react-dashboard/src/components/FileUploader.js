import React, { useState } from 'react';
import '../css/Dashboard.css';
import dataService from '../client/dataService';
import { getConfig } from '../client/config';


const FileUploader = ({ onFileSelected }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [msg, setMsg] = useState('');

  React.useEffect(() => {
    const config = getConfig();
    dataService.configure(config.baseURL);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMsg('');
    if (onFileSelected) onFileSelected(file);
  };

  return (
    <div className="dashboard-file-uploader dashboard-file-uploader-left">
      <h2>Upload File</h2>
      <input type="file" onChange={handleFileChange} style={{ margin: '1rem 0' }} />
      {selectedFile && (
        <div style={{ margin: '1rem 0', color: '#219150' }}>
          Selected file: <strong>{selectedFile.name}</strong>
        </div>
      )}
      <div style={{ color: '#888', marginTop: '1rem' }}>
        {msg || 'Select a file to validate.'}
      </div>
    </div>
  );
};

export default FileUploader;
