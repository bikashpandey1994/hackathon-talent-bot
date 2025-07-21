import React from 'react';
import FileUploader from './FileUploader';
import CustomList from './CustomList';
import Overview from './Overview';
import Chart from './Chart';
import List from './List';

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
  search
}) => (
  <div className="dashboard-main-content">
    <div className="dashboard-main-flex">
      {showUploader ? (
        <div className="dashboard-upload-row">
          <FileUploader onUpload={() => setShowCustomList(true)} />
          {showCustomList && (
            <div className="dashboard-upload-list-wrapper">
              <CustomList
                list={customListData}
                expandedId={customExpandedId}
                setExpandedId={setCustomExpandedId}
                title="Uploaded Candidates"
                showStatusFilter={true}
              />
              <div className="customlist-footer">
                <button className="customlist-footer-btn">
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
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
          />
        </>
      )}
    </div>
  </div>
);

export default DashboardMainContent;
