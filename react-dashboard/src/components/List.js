import React, { useState } from 'react';
import ListCard from './ListCard';
import '../css/List.css';

const List = ({ list, expandedId, setExpandedId }) => {
  const [statusFilter, setStatusFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'Ready', label: 'Ready to Join' },
    { value: 'Document Pending', label: 'Document Pending' },
    { value: 'Medical Pending', label: 'Medical Pending' },
    { value: 'Offer Accepted', label: 'Offer Accepted' },
    { value: 'Offer Declined', label: 'Offer Declined' }
  ];

  // Fix: filter the list based on statusFilter
  const filteredList = statusFilter === 'all'
    ? list
    : list.filter(item => item.status === statusFilter);

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
