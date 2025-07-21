import React from 'react';
import '../css/Overview.css';

const Overview = ({
  selectedDate,
  dateOptions,
  handleDateChange,
  totalJoining,
  notReadyToJoin,
  coordinatorName = "John Doe",
}) => {
  const readyToJoin = totalJoining - notReadyToJoin;

  return (
    <div className="overview-root">
      <div className="overview-date-select">
        <select value={selectedDate} onChange={handleDateChange} className="overview-select">
          {dateOptions.map(date => (
            <option key={date} value={date}>{date}</option>
          ))}
        </select>
      </div>
      <h2 className="overview-title">Overview</h2>
      <div className="overview-stats-row">
        <div>
          <div className="overview-stat-value">{selectedDate}</div>
          <div className="overview-stat-label">Joining Date</div>
        </div>
        <div>
          <div className="overview-stat-value">{totalJoining}</div>
          <div className="overview-stat-label">Total Candidates</div>
        </div>
        <div>
          <div className="overview-stat-value">{readyToJoin}</div>
          <div className="overview-stat-label">Ready to Join</div>
        </div>
        <div>
          <div className="overview-stat-value">{notReadyToJoin}</div>
          <div className="overview-stat-label">Not Ready to Join</div>
        </div>
        <div>
          <div className="overview-stat-value">{coordinatorName}</div>
          <div className="overview-stat-label">Coordinator Name</div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
