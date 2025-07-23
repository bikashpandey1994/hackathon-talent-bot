import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import SideNav from './SideNav';
import DashboardMainContent from './DashboardMainContent';
import { dateOptions, mockApi } from '../data/dashboardData';
import dataService from '../client/dataService';
import { getConfig } from '../client/config';
import '../css/Dashboard.css';

const Dashboard = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]);
  const [list, setList] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [chartType, setChartType] = useState('pie');
  const [showUploader, setShowUploader] = useState(false);
  const [showCustomList, setShowCustomList] = useState(false);
  const [customListData, setCustomListData] = useState([]);
  const [customExpandedId, setCustomExpandedId] = useState(null);
  const [apiCandidates, setApiCandidates] = useState([]);

  // Initialize data service
  useEffect(() => {
    const config = getConfig();
    dataService.configure(config.baseURL);
  }, []);

  useEffect(() => {
    // Fetch data when selectedDate changes - using mock data for now
    // In the future, this could be replaced with API calls that filter by date
    mockApi(selectedDate).then(data => setList(data));
  }, [selectedDate]);

  // Handle candidates loaded from API in List component - use useCallback to stabilize reference
  const handleCandidatesLoaded = useCallback((candidates) => {
    setApiCandidates(candidates);
    // You could also update the list state here if needed
    // setList(candidates);
  }, []);

  // For demo, use the same list as dashboard for CustomList
  useEffect(() => {
    if (showUploader) {
      // Use API candidates if available, otherwise fall back to mock data
      if (apiCandidates.length > 0) {
        setCustomListData(apiCandidates);
      } else {
        mockApi(selectedDate).then(data => setCustomListData(data));
      }
    }
  }, [showUploader, selectedDate, apiCandidates]);

  // Reset showCustomList when leaving uploader view
  useEffect(() => {
    if (!showUploader) setShowCustomList(false);
  }, [showUploader]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Overview calculations - use API candidates if available
  const dataForCalculations = apiCandidates.length > 0 ? apiCandidates : list;
  const totalJoining = dataForCalculations.length;
  const notReadyToJoin = dataForCalculations.filter(item => !item.readyToJoin).length;

  // Filter list by search
  const filteredList = list.filter(
    item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.grade.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-root">
      <Header
        navOpen={navOpen}
        onNavOpen={() => setNavOpen(true)}
        onNavClose={() => setNavOpen(false)}
        search={search}
        setSearch={setSearch}
      />
      {/* Overlay */}
      {navOpen && (
        <div
          className="dashboard-overlay"
          onClick={() => setNavOpen(false)}
        />
      )}
      <SideNav
        navOpen={navOpen}
        setNavOpen={setNavOpen}
        setShowUploader={setShowUploader}
        setShowCustomList={setShowCustomList}
      />
      <DashboardMainContent
        showUploader={showUploader}
        showCustomList={showCustomList}
        setShowCustomList={setShowCustomList}
        customListData={customListData}
        customExpandedId={customExpandedId}
        setCustomExpandedId={setCustomExpandedId}
        list={list}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
        filteredList={filteredList}
        selectedDate={selectedDate}
        dateOptions={dateOptions}
        handleDateChange={handleDateChange}
        totalJoining={totalJoining}
        notReadyToJoin={notReadyToJoin}
        chartType={chartType}
        setSearch={setSearch}
        search={search}
        onCandidatesLoaded={handleCandidatesLoaded}
      />
    </div>
  );
};

export default Dashboard;