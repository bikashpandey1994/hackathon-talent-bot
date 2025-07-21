import React, { useState } from 'react';
import ListCard from './ListCard';
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
  setStatus
}) => {
  // Handler for delete (for demo, just filter out from local list)
  const [localList, setLocalList] = React.useState(list);

  React.useEffect(() => {
    setLocalList(list);
  }, [list]);

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
        {localList.map(item => (
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
