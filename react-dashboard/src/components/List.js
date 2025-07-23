import React, { useState, useEffect, useRef, useCallback } from 'react';
import ListCard from './ListCard';
import dataService from '../client/dataService';
import { getConfig } from '../client/config';
import '../css/List.css';

const List = ({ list, expandedId, setExpandedId, onCandidatesLoaded }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [candidates, setCandidates] = useState([]);
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

  // Fetch candidates from API - only once on mount
  const fetchCandidates = useCallback(async () => {
    if (hasLoadedOnce) return; // Prevent multiple calls
    
    setLoading(true);
    setError(null);
    try {
      const response = await dataService.getCandidates();
      const candidatesData = response.data || response || [];
      setCandidates(candidatesData);
      setHasLoadedOnce(true);
      
      // Notify parent component about loaded candidates
      if (onCandidatesLoadedRef.current) {
        onCandidatesLoadedRef.current(candidatesData);
      }
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
      setError(err.message || 'Failed to fetch candidates');
      // Fallback to props list if API fails
      setCandidates(list || []);
      setHasLoadedOnce(true);
    } finally {
      setLoading(false);
    }
  }, [hasLoadedOnce, list]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'Ready', label: 'Ready to Join' },
    { value: 'Document Pending', label: 'Document Pending' },
    { value: 'Medical Pending', label: 'Medical Pending' },
    { value: 'Offer Accepted', label: 'Offer Accepted' },
    { value: 'Offer Declined', label: 'Offer Declined' }
  ];

  // Use candidates from API or fallback to props list
  const dataToDisplay = candidates.length > 0 ? candidates : (list || []);

  // Filter the list based on statusFilter
  const filteredList = statusFilter === 'all'
    ? dataToDisplay
    : dataToDisplay.filter(item => item.status === statusFilter);

  if (loading) {
    return (
      <div className="list-root">
        <div className="list-header-row">
          <h2 className="list-title">List</h2>
        </div>
        <div className="list-loading">Loading candidates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="list-root">
        <div className="list-header-row">
          <h2 className="list-title">List</h2>
        </div>
        <div className="list-error">
          <p>Error: {error}</p>
          <p>Showing fallback data...</p>
        </div>
        <div className="list-cards-container">
          {filteredList.map(item => (
            <ListCard
              key={item.id}
              item={item}
              expanded={false}
              onClick={() => {}}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="list-root">
      <div className="list-header-row">
        <h2 className="list-title">List</h2>
        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="list-status-select"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="list-cards-container">
        {filteredList.map(item => (
          <ListCard
            key={item.id}
            item={item}
            expanded={false}
            onClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default List;
