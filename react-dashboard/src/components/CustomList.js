import React, { useState, useEffect, useRef, useCallback } from 'react';
import ListCard from './ListCard';
import dataService from '../client/dataService';
import { getConfig } from '../client/config';
import '../css/List.css';

// This component is similar to the List component used in Dashboard.
// You can reuse this for any list of candidates or similar data.
const CustomList = ({
  list,
  expandedId,
  setExpandedId,
  title = "List",
  showStatusFilter = true,
  status,
  setStatus,
  useApi = false,
  onCandidatesLoaded
}) => {
  // Handler for delete (for demo, just filter out from local list)
  const [localList, setLocalList] = React.useState(list || []);
  const [apiCandidates, setApiCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  
  // Use ref to store the latest callback to avoid dependency issues
  const onCandidatesLoadedRef = useRef(onCandidatesLoaded);
  
  // Update ref when callback changes
  useEffect(() => {
    onCandidatesLoadedRef.current = onCandidatesLoaded;
  }, [onCandidatesLoaded]);

  // Initialize data service with base URL
  useEffect(() => {
    const config = getConfig();
    dataService.configure(config.baseURL);
  }, []);

  // Fetch candidates from API if useApi is true - only once per useApi change
  const fetchCandidates = useCallback(async () => {
    if (!useApi || hasLoadedOnce) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await dataService.getCandidates();
      const candidates = response.data || response || [];
      setApiCandidates(candidates);
      setLocalList(candidates);
      setHasLoadedOnce(true);
      
      // Notify parent component about loaded candidates
      if (onCandidatesLoadedRef.current) {
        onCandidatesLoadedRef.current(candidates);
      }
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
      setError(err.message || 'Failed to fetch candidates');
      // Fallback to props list if API fails
      setLocalList(list || []);
      setHasLoadedOnce(true);
    } finally {
      setLoading(false);
    }
  }, [useApi, hasLoadedOnce, list]);

  // Handle API vs local data
  useEffect(() => {
    if (useApi) {
      fetchCandidates();
    } else {
      setLocalList(list || []);
      setHasLoadedOnce(false); // Reset when switching to local data
    }
  }, [useApi, list, fetchCandidates]);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setLocalList(prev => prev.filter(item => item.id !== id));
  };

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'Ready', label: 'Ready to Join' },
    { value: 'Document Pending', label: 'Document Pending' },
    { value: 'Medical Pending', label: 'Medical Pending' },
    { value: 'Offer Accepted', label: 'Offer Accepted' },
    { value: 'Offer Declined', label: 'Offer Declined' }
  ];

  // Filter candidates by status if status filter is provided
  const filteredCandidates = status && status !== 'all'
    ? localList.filter(item => item.status === status)
    : localList;

  if (loading) {
    return (
      <div className="list-root">
        <div className="list-header-row">
          <h2 className="list-title">{title}</h2>
        </div>
        <div className="list-loading">Loading candidates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="list-root">
        <div className="list-header-row">
          <h2 className="list-title">{title}</h2>
        </div>
        <div className="list-error">
          <p>Error: {error}</p>
          <p>Showing fallback data...</p>
        </div>
        <div className="list-cards-container">
          {filteredCandidates.map(item => (
            <div style={{ position: 'relative' }} key={item.id}>
              <ListCard
                item={item}
                expanded={false}
                onClick={() => {}}
                hideActions={true}
              />
              <button
                className="customlist-delete-btn"
                title="Delete"
                onClick={e => handleDelete(item.id, e)}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  zIndex: 20
                }}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <line x1="6" y1="6" x2="14" y2="14" stroke="#e53935" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="14" y1="6" x2="6" y2="14" stroke="#e53935" strokeWidth="2" strokeLinecap="round"/>
                  <rect x="3" y="3" width="14" height="14" rx="3" stroke="#e53935" strokeWidth="1"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="list-root">
      <div className="list-header-row">
        <h2 className="list-title">{title}</h2>
        {showStatusFilter && setStatus && (
          <div>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="list-status-select"
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="list-cards-container">
        {filteredCandidates.map(item => (
          <div style={{ position: 'relative' }} key={item.id}>
            <ListCard
              item={item}
              expanded={false}
              onClick={() => {}}
              hideActions={true}
            />
            <button
              className="customlist-delete-btn"
              title="Delete"
              onClick={e => handleDelete(item.id, e)}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                zIndex: 20
              }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <line x1="6" y1="6" x2="14" y2="14" stroke="#e53935" strokeWidth="2" strokeLinecap="round"/>
                <line x1="14" y1="6" x2="6" y2="14" stroke="#e53935" strokeWidth="2" strokeLinecap="round"/>
                <rect x="3" y="3" width="14" height="14" rx="3" stroke="#e53935" strokeWidth="1"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomList;
