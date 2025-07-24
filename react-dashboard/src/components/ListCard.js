import React, { useState, useEffect } from 'react';
import '../css/ListCard.css';
import hrService from '../client/hrService';

const mockConversations = [
  { date: '2024-06-01', message: 'Initial call with candidate.' },
  { date: '2024-06-02', message: 'Sent documents for verification.' },
  { date: '2024-06-03', message: 'Candidate confirmed joining date.' }
];

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

const ListCard = ({ item, expanded, onClick, hideActions }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [candidateStatus, setCandidateStatus] = useState(item.status);
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 5;

  const fetchCandidateDetails = async () => {
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      const threadId = "bikashpandey18@gmail.com";//item.email;
      const response = await hrService.getCandidateState(threadId);
      
      // Set candidate details from response.result.values
      if (response && response.result && response.result.values) {
        setCandidateDetails(response.result.values);
      } else {
        setCandidateDetails(response.values || response);
      }
      
      // Extract conversations from response.result.values.messages
      if (response && response.result && response.result.values && response.result.values.messages) {
        setConversations(response.result.values.messages);
      } else {
        setConversations([]);
      }
    } catch (err) {
      console.error('Failed to fetch candidate details:', err);
      setDetailsError(err.message || 'Failed to fetch details');
      setConversations([]);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (showPopup && !candidateDetails) {
      fetchCandidateDetails();
    }
    // Reset pagination when popup opens
    if (showPopup) {
      setCurrentPage(1);
    }
  }, [showPopup]);

  const handleStatusChange = (e) => {
    setCandidateStatus(e.target.value);
    // Here you can also call an API or update parent state if needed
  };

  return (
    <div
      className={`listcard-root${expanded ? ' expanded' : ''}`}
      onClick={onClick}
      style={{
        ...(expanded ? { zIndex: 10, position: 'relative' } : {}),
        border: '1.5px solid #b2dfdb',
        marginBottom: '1.2rem',
        boxShadow: expanded
          ? '0 6px 24px rgba(33,145,80,0.18)'
          : '0 2px 8px rgba(33,145,80,0.10)',
        transition: 'box-shadow 0.2s, border 0.2s'
      }}
    >
      <div className="listcard-row" style={{ background: expanded ? '#e8f5e9' : '#f1f8e9', borderRadius: '6px 6px 0 0', padding: '0.7em 0.5em' }}>
        <div className="listcard-col">
          <div className="listcard-label">Candidate ID</div>
          <div className="listcard-value">{item.id || <span style={{color: 'red'}}>N/A</span>}</div>
        </div>
        <div className="listcard-col">
          <div className="listcard-label">Name</div>
          <div className="listcard-value">{item.name || <span style={{color: 'red'}}>N/A</span>}</div>
        </div>
        <div className="listcard-col">
          <div className="listcard-label">Grade</div>
          <div className="listcard-value">{item.grade || <span style={{color: 'red'}}>N/A</span>}</div>
        </div>
        <div className="listcard-col">
          <div className="listcard-label">Description</div>
          <div className="listcard-value">{item.description || <span style={{color: 'red'}}>N/A</span>}</div>
        </div>
        <div className="listcard-col">
          <div className="listcard-label">Joining Date</div>
          <div className="listcard-value">{item.joiningDate || <span style={{color: 'red'}}>N/A</span>}</div>
        </div>
        <div className="listcard-col">
          <div className="listcard-label">Status</div>
          <div className="listcard-value">{item.status || <span style={{color: 'red'}}>N/A</span>}</div>
        </div>
        {/* Action and View icons */}
        {!hideActions && (
          <div className="listcard-col listcard-actions" style={{ minWidth: 70 }}>
            <button
              className="listcard-action-btn"
              title="Action"
              style={{
                background: 'linear-gradient(90deg, #43a047 60%, #219150 100%)',
                boxShadow: '0 2px 8px rgba(33,145,80,0.10)'
              }}
              onClick={e => { e.stopPropagation(); setShowActionPopup(true); }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path d="M10 2v16M2 10h16" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              className="listcard-view-btn"
              title="View"
              style={{
                background: 'linear-gradient(90deg, #43a047 60%, #219150 100%)',
                boxShadow: '0 2px 8px rgba(33,145,80,0.10)'
              }}
              onClick={e => { e.stopPropagation(); setShowPopup(true); }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <ellipse cx="10" cy="10" rx="8" ry="5" stroke="#fff" strokeWidth="2"/>
                <circle cx="10" cy="10" r="2" fill="#fff"/>
              </svg>
            </button>
          </div>
        )}
      </div>
      {expanded && (
        <div className="listcard-expanded" style={{ background: '#f9fff6', borderTop: '1px solid #b2dfdb' }}>
          <div><b>State:</b> {item.state}</div>
          <div><b>Status:</b> {item.status}</div>
          <div><b>Ready to Join:</b> {item.readyToJoin ? 'Yes' : 'No'}</div>
          <div><b>Candidate ID:</b> {item.id}</div>
        </div>
      )}
      {showPopup && (
        <div className="listcard-popup-overlay" onClick={() => setShowPopup(false)}>
          <div
            className="listcard-popup"
            style={{
              width: '80vw',
              background: 'linear-gradient(120deg, #e8f5e9 80%, #f1f8e9 100%)',
              border: '2px solid #b2dfdb',
              boxShadow: '0 8px 32px rgba(33,145,80,0.18)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button className="listcard-popup-close" onClick={() => setShowPopup(false)}>&times;</button>
            <h3 style={{ color: '#219150', marginBottom: '1em' }}>Candidate Details</h3>
            
            {detailsLoading ? (
              <div style={{ textAlign: 'center', padding: '2em' }}>Loading details...</div>
            ) : detailsError ? (
              <div style={{ color: '#d32f2f', marginBottom: '1em' }}>
                Error: {detailsError}
              </div>
            ) : null}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5em 2em', marginBottom: '1em' }}>
              <div><b>Name:</b> {candidateDetails?.name || item.name || 'N/A'}</div>
              <div><b>Grade:</b> {candidateDetails?.grade || item.grade || 'N/A'}</div>
              <div><b>Description:</b> {candidateDetails?.description || item.description || 'N/A'}</div>
              <div><b>Joining Date:</b> {candidateDetails?.joiningDate || candidateDetails?.joining_date || item.joiningDate || 'N/A'}</div>
              <div><b>Status:</b> {candidateDetails?.status || item.status || 'N/A'}</div>
              <div><b>State:</b> {candidateDetails?.state || item.state || 'N/A'}</div>
              <div><b>Ready to Join:</b> {candidateDetails?.readyToJoin !== undefined ? (candidateDetails.readyToJoin ? 'Yes' : 'No') : (item.readyToJoin ? 'Yes' : 'No')}</div>
              <div><b>Candidate ID:</b> {candidateDetails?.id || candidateDetails?.candidate_id || item.id || 'N/A'}</div>
            </div>
            <h4 style={{ marginTop: '1em', color: '#219150' }}>Conversations</h4>
            <div className="listcard-popup-conversations">
              {conversations.length > 0 ? (
                <>
                  {/* Paginated conversations */}
                  {conversations
                    .slice((currentPage - 1) * messagesPerPage, currentPage * messagesPerPage)
                    .map((message, idx) => {
                      const actualIndex = (currentPage - 1) * messagesPerPage + idx;
                      return (
                        <div key={actualIndex} className="listcard-popup-conv">
                          <div><b>{actualIndex % 2 === 0 ? 'HR' : 'Candidate'}:</b> {message.content || message.text || message.message || message || 'No content'}</div>
                          {message.timestamp && <div style={{ fontSize: '0.8em', color: '#666' }}>{message.timestamp}</div>}
                        </div>
                      );
                    })}
                  
                  {/* Pagination controls */}
                  {conversations.length > messagesPerPage && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1em', padding: '0.5em 0' }}>
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={{
                          padding: '0.3em 0.8em',
                          borderRadius: '4px',
                          border: '1px solid #b2dfdb',
                          background: currentPage === 1 ? '#f5f5f5' : '#fff',
                          color: currentPage === 1 ? '#999' : '#219150',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Previous
                      </button>
                      
                      <span style={{ fontSize: '0.9em', color: '#666' }}>
                        Page {currentPage} of {Math.ceil(conversations.length / messagesPerPage)} 
                        ({conversations.length} messages)
                      </span>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(conversations.length / messagesPerPage)))}
                        disabled={currentPage === Math.ceil(conversations.length / messagesPerPage)}
                        style={{
                          padding: '0.3em 0.8em',
                          borderRadius: '4px',
                          border: '1px solid #b2dfdb',
                          background: currentPage === Math.ceil(conversations.length / messagesPerPage) ? '#f5f5f5' : '#fff',
                          color: currentPage === Math.ceil(conversations.length / messagesPerPage) ? '#999' : '#219150',
                          cursor: currentPage === Math.ceil(conversations.length / messagesPerPage) ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div>No conversations found.</div>
              )}
            </div>
          </div>
        </div>
      )}
      {showActionPopup && (
        <div className="listcard-popup-overlay" onClick={() => setShowActionPopup(false)}>
          <div
            className="listcard-popup"
            style={{
              width: '80vw',
              background: 'linear-gradient(120deg, #e8f5e9 80%, #f1f8e9 100%)',
              border: '2px solid #b2dfdb',
              boxShadow: '0 8px 32px rgba(33,145,80,0.18)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button className="listcard-popup-close" onClick={() => setShowActionPopup(false)}>&times;</button>
            <h3 style={{ color: '#219150', marginBottom: '1em' }}>Take Action</h3>
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
            <div style={{ margin: '1em 0', display: 'flex', alignItems: 'center', gap: '1em' }}>
              <label htmlFor="candidate-status" style={{ whiteSpace: 'nowrap' }}><b>Change Status:</b></label>
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
            <div style={{ margin: '1em 0', display: 'flex', alignItems: 'center', gap: '1em' }}>
              <label htmlFor="candidate-justification" style={{ whiteSpace: 'nowrap' }}>
                <b>Justification:</b>
              </label>
              <textarea
                id="candidate-justification"
                rows={2}
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
            <button
              className="listcard-action-btn"
              style={{
                marginTop: '1em',
                background: 'linear-gradient(90deg, #43a047 60%, #219150 100%)',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '1.1em',
                padding: '0.5em 2em'
              }}
              onClick={() => setShowActionPopup(false)}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListCard;
