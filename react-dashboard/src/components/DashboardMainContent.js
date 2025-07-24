import React from 'react';
import FileUploader from './FileUploader';
import CustomList from './CustomList';
import Overview from './Overview';
import Chart from './Chart';
import List from './List';
import dataService from '../client/dataService';

// ...existing code...

// UploaderFlow component to handle file selection, validation, and upload
function UploaderFlow({ customListData, setShowCustomList, showCustomList, customExpandedId, setCustomExpandedId, onNavigateToDashboard }) {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadMsg, setUploadMsg] = React.useState('');

  // Handle file selection from FileUploader
  const handleFileSelected = (file) => {
    setSelectedFile(file);
    setShowCustomList(true);
    setUploadMsg('');
  };

  // Handle submit button click to upload file
  const handleSubmit = async () => {
    if (!selectedFile) {
      setUploadMsg('Please select a file first.');
      return;
    }
    setIsUploading(true);
    setUploadMsg('Uploading...');
    try {
      const response = await dataService.uploadCandidates(selectedFile);
      setUploadMsg(`File "${selectedFile.name}" uploaded successfully!`);
      
      // Navigate back to Dashboard after successful upload
      setTimeout(() => {
        if (onNavigateToDashboard) {
          onNavigateToDashboard();
        }
      }, 2000); // Wait 2 seconds to show success message
      
    } catch (error) {
      setUploadMsg(`Upload failed: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="dashboard-upload-row">
      <FileUploader onFileSelected={handleFileSelected} />
      {showCustomList && (
        <div className="dashboard-upload-list-wrapper">
          <CustomList
            list={customListData}
            expandedId={customExpandedId}
            setExpandedId={setCustomExpandedId}
            title="Uploaded Candidates"
            showStatusFilter={true}
            useApi={false}
          />
          <div className="customlist-footer">
            <button
              className="customlist-footer-btn"
              onClick={handleSubmit}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Submit'}
            </button>
            <div style={{ color: uploadMsg.includes('successfully') ? '#219150' : uploadMsg.includes('failed') ? '#d32f2f' : '#888', marginTop: '0.5rem' }}>
              {uploadMsg}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const DashboardMainContent = ({
  showUploader,
  showCustomList,
  setShowCustomList,
  customListData,
  customExpandedId,
  setCustomExpandedId,
  list,
  expandedId,
  setExpandedId,
  filteredList,
  selectedDate,
  dateOptions,
  handleDateChange,
  totalJoining,
  notReadyToJoin,
  chartType,
  setSearch,
  search,
  onCandidatesLoaded,
  onNavigateToDashboard
}) => (
  <div className="dashboard-main-content">
    <div className="dashboard-main-flex">
      {showUploader ? (
        <UploaderFlow
          customListData={customListData}
          setShowCustomList={setShowCustomList}
          showCustomList={showCustomList}
          customExpandedId={customExpandedId}
          setCustomExpandedId={setCustomExpandedId}
          onNavigateToDashboard={onNavigateToDashboard}
        />
      ) : (
        <>
          {/* Overview and Chart side by side */}
          <div className="dashboard-overview-chart-row">
            <Overview
              selectedDate={selectedDate}
              dateOptions={dateOptions}
              handleDateChange={handleDateChange}
              totalJoining={totalJoining}
              notReadyToJoin={notReadyToJoin}
              style={{ flex: 2 }}
            />
            <div
              className="dashboard-chart-container"
              style={{ flex: 1, maxWidth: '33.33%' }}
            >
              <Chart type={chartType} data={list} />
            </div>
          </div>
          <List
            list={filteredList}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
            onCandidatesLoaded={onCandidatesLoaded}
          />
        </>
      )}
    </div>
  </div>
);

export default DashboardMainContent;
