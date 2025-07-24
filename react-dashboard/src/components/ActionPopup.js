import React, { useState, useEffect } from 'react';
import dataService from '../client/dataService';
import hrService from '../client/hrService';
import { getConfig } from '../client/config';
import '../css/ListCard.css';

const statusOptions = [
  'Ready',
  'Document Pending',
  'Medical Pending',
  'Offer Accepted',
  'Offer Declined'
];

// Define the flow for the state diagram
const statusFlow = [
  'Document Pending',
  'Medical Pending',
  'Ready',
  'Offer Accepted',
  'Offer Declined'
];

const ActionPopup = ({ 
  isOpen, 
  onClose, 
  candidateData = {}, 
  email = null,
  title = "Take Action" 
}) => {
  const [candidateStatus, setCandidateStatus] = useState(candidateData.status || 'Document Pending');
  const [justification, setJustification] = useState('');
  const [saving, setSaving] = useState(false);
  const [stateDetails, setStateDetails] = useState(null);
  const [loadingState, setLoadingState] = useState(false);
  const [stateError, setStateError] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  // Initialize services
  useEffect(() => {
    const config = getConfig();
    dataService.configure(config.baseURL);
    hrService.configure(); // Uses default http://localhost:8000
  }, []);

  // Reset form when candidateData changes and fetch state details
  useEffect(() => {
    setCandidateStatus(candidateData.status || 'Document Pending');
    setJustification('');
    
    // Fetch state details when candidate data changes and popup is open
    if (isOpen && email) {
      fetchStateDetails();
    }
  }, [candidateData, isOpen, email]);

  // Fetch candidate state details from hrService
  const fetchStateDetails = async () => {
    if (!email) {
      console.warn('No email provided for state fetch');
      return;
    }
    
    setLoadingState(true);
    setStateError(null);
    try {
      const response = await hrService.getCandidateState(email);
      setStateDetails(response);
    } catch (error) {
      console.error('Failed to fetch candidate state:', error);
      setStateError(error.message || 'Failed to fetch state details');
    } finally {
      setLoadingState(false);
    }
  };

  // Fetch candidate summary when ActionPopup is opened
  useEffect(() => {
    const fetchSummary = async () => {
      if (isOpen && email) {
        setLoadingSummary(true);
        setSummaryError(null);
        try {
          const response = await hrService.getSummary(email, "");
          setSummaryData(response.result || null);
        } catch (error) {
          setSummaryError(error.message || 'Failed to fetch summary');
          setSummaryData(null);
        } finally {
          setLoadingSummary(false);
        }
      } else {
        setSummaryData(null);
      }
    };
    fetchSummary();
  }, [isOpen, email]);

  const handleStatusChange = (e) => {
    setCandidateStatus(e.target.value);
  };

  const handleSave = async () => {
    if (!email) {
      console.error('No email provided for HR action');
      alert('Email is required to submit HR action');
      return;
    }

    if (!justification.trim()) {
      alert('Please enter a justification message');
      return;
    }

    setSaving(true);
    try {
      // Call HR action API
      await hrService.submitHRAction(
        email,                    // thread_id
        candidateStatus,          // state
        justification,            // hr_message
        candidateStatus           // hr_nextnode (using same as state for now)
      );

      // Also update the status in the main system
      if (candidateData.id) {
        const statusData = {
          status: candidateStatus,
          justification,
          email,
          updatedAt: new Date().toISOString(),
          updatedBy: 'HR User'
        };
        await dataService.updateCandidateStatus(candidateData.id, statusData);
      }
      
      console.log('HR action submitted successfully:', {
        email,
        state: candidateStatus,
        hrMessage: justification,
        candidateId: candidateData.id
      });

      // Refresh state details after successful submission
      await fetchStateDetails();

      // Close the popup on success
      onClose();
    } catch (error) {
      console.error('Failed to submit HR action:', error);
      alert('Failed to submit HR action. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="listcard-popup-overlay" onClick={onClose}>
      <div
        className="listcard-popup"
        style={{
          width: '80vw',
          maxWidth: '600px',
          background: 'linear-gradient(120deg, #e8f5e9 80%, #f1f8e9 100%)',
          border: '2px solid #b2dfdb',
          boxShadow: '0 8px 32px rgba(33,145,80,0.18)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button className="listcard-popup-close" onClick={onClose}>&times;</button>
        <h3 style={{ color: '#219150', marginBottom: '1em' }}>{title}</h3>
        
        {/* Display candidate info if available */}
        {loadingSummary ? (
          <div style={{ marginBottom: '1.5em', padding: '1em', background: '#f9fff6', borderRadius: '6px', border: '1px solid #b2dfdb', color: '#888' }}>
            Loading candidate information...
          </div>
        ) : summaryError ? (
          <div style={{ marginBottom: '1.5em', padding: '1em', background: '#fff8f8', borderRadius: '6px', border: '1px solid #ffcdd2', color: '#d32f2f' }}>
            Error loading candidate info: {summaryError}
          </div>
        ) : typeof summaryData === 'string' && summaryData.trim().length > 0 ? (
          <div style={{ marginBottom: '1.5em', padding: '1em', background: '#f9fff6', borderRadius: '6px', border: '1px solid #b2dfdb' }}>
            <h4 style={{ color: '#219150', marginBottom: '0.5em' }}>Candidate Summary</h4>
            <div style={{ color: '#333', fontSize: '1em', whiteSpace: 'pre-line' }}>{summaryData}</div>
            {email && <div style={{ marginTop: '0.5em' }}><b>Email:</b> {email}</div>}
          </div>
        ) : candidateData.name ? (
          <div style={{ marginBottom: '1.5em', padding: '1em', background: '#f9fff6', borderRadius: '6px', border: '1px solid #b2dfdb' }}>
            <h4 style={{ color: '#219150', marginBottom: '0.5em' }}>Candidate Information</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5em' }}>
              {candidateData.name && <div><b>Name:</b> {candidateData.name}</div>}
              {candidateData.id && <div><b>ID:</b> {candidateData.id}</div>}
              {candidateData.grade && <div><b>Grade:</b> {candidateData.grade}</div>}
              {candidateData.joiningDate && <div><b>Joining Date:</b> {candidateData.joiningDate}</div>}
              {email && <div><b>Email:</b> {email}</div>}
            </div>
          </div>
        ) : null}

        {/* State Details Section */}
        <div style={{ marginBottom: '1.5em', padding: '1em', background: '#f0f8ff', borderRadius: '6px', border: '1px solid #b2dfdb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5em' }}>
            <h4 style={{ color: '#219150', margin: 0 }}>Last Email From Candidate</h4>
            <button
              onClick={fetchStateDetails}
              disabled={loadingState}
              style={{
                padding: '0.3em 0.8em',
                fontSize: '0.8em',
                borderRadius: '4px',
                border: '1px solid #b2dfdb',
                background: loadingState ? '#f5f5f5' : '#fff',
                color: '#219150',
                cursor: loadingState ? 'not-allowed' : 'pointer',
                fontWeight: '600'
              }}
            >
              {loadingState ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          {loadingState ? (
            <div style={{ color: '#666', fontStyle: 'italic' }}>Loading state details...</div>
          ) : stateError ? (
            <div style={{ color: '#d32f2f', fontSize: '0.9em' }}>
              Error: {stateError}
            </div>
          ) : stateDetails && stateDetails.result && stateDetails.result.values && stateDetails.result.values.messages && stateDetails.result.values.messages.length > 0 ? (
            <div>
              <div style={{ 
                background: '#fff', 
                padding: '0.8em', 
                borderRadius: '4px', 
                border: '1px solid #ddd',
                marginTop: '0.5em',
                fontSize: '0.95em',
                lineHeight: '1.4'
              }}>
                <b>Latest Message:</b>
                <div style={{ marginTop: '0.3em', color: '#333' }}>
                  {stateDetails.result.values.messages[stateDetails.result.values.messages.length - 1]}
                </div>
              </div>
              {stateDetails.result.values.messages.length > 1 && (
                <div style={{ fontSize: '0.8em', color: '#666', marginTop: '0.3em' }}>
                  Total messages: {stateDetails.result.values.messages.length}
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: '#666', fontStyle: 'italic' }}>No state details available</div>
          )}
        </div>

        {/* State Flow Diagram */}
        <div className="listcard-status-flow" style={{ marginBottom: '1.5em' }}>
          {statusFlow.map((status, idx) => (
            <React.Fragment key={status}>
              <div
                className={
                  'listcard-status-step' +
                  (candidateStatus === status ? ' current' : '') +
                  (idx === 0 ? ' first' : '') +
                  (idx === statusFlow.length - 1 ? ' last' : '')
                }
              >
                {status}
              </div>
              {idx < statusFlow.length - 1 && (
                <div className="listcard-status-arrow">&#8594;</div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Status Change Dropdown */}
        <div style={{ margin: '1em 0', display: 'flex', alignItems: 'center', gap: '1em' }}>
          <label htmlFor="candidate-status" style={{ whiteSpace: 'nowrap' }}>
            <b>Change Status:</b>
          </label>
          <select
            id="candidate-status"
            value={candidateStatus}
            onChange={handleStatusChange}
            style={{
              minWidth: '160px',
              padding: '0.4em',
              borderRadius: '6px',
              border: '1.5px solid #b2dfdb',
              background: '#fff',
              color: '#219150',
              fontWeight: 600
            }}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Justification field */}
        <div style={{ margin: '1em 0', display: 'flex', alignItems: 'flex-start', gap: '1em' }}>
          <label htmlFor="candidate-justification" style={{ whiteSpace: 'nowrap', paddingTop: '0.5em' }}>
            <b>Justification:</b>
          </label>
          <textarea
            id="candidate-justification"
            rows={3}
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            style={{
              width: '100%',
              minWidth: '180px',
              marginTop: 0,
              padding: '0.5em',
              borderRadius: '6px',
              border: '1.5px solid #b2dfdb',
              resize: 'vertical',
              fontSize: '1em',
              background: '#f9fff6'
            }}
            placeholder="Enter justification for status change..."
          />
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '1.5em', display: 'flex', gap: '1em', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.5em 1.5em',
              borderRadius: '6px',
              border: '1.5px solid #b2dfdb',
              background: '#fff',
              color: '#219150',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '0.5em 2em',
              borderRadius: '6px',
              border: 'none',
              background: saving 
                ? '#ccc' 
                : 'linear-gradient(90deg, #43a047 60%, #219150 100%)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1.1em',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionPopup;
