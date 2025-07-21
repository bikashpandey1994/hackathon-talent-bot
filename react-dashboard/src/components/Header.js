import React, { useState } from 'react';
import SearchBar from './SearchBar';
import '../css/Header.css';

// Mock API for notifications
const mockFetchNotifications = () =>
  new Promise(resolve =>
    setTimeout(
      () =>
        resolve([
          { id: 1, message: 'New candidate joined today.' },
          { id: 2, message: 'Document pending for Rahul Verma.' },
          { id: 3, message: 'Medical pending for Amit Singh.' }
        ]),
      500
    )
  );

const Header = ({ navOpen, onNavOpen, onNavClose, search, setSearch }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleNotificationClick = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setLoading(true);
      const data = await mockFetchNotifications();
      setNotifications(data);
      setLoading(false);
    }
  };

  return (
    <header className="header-root">
      <button
        onClick={onNavOpen}
        className="header-hamburger"
        aria-label="Open navigation"
      >
        &#9776;
      </button>
      <h1 className="header-title">Dashboard</h1>
      <div className="header-searchbar-container">
        <SearchBar search={search} setSearch={setSearch} />
      </div>
      <div className="header-notification-icon">
        <button
          className="header-notification-btn"
          aria-label="Notifications"
          onClick={handleNotificationClick}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6V11c0-3.07-1.63-5.64-5-6.32V4a1 1 0 1 0-2 0v0.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29A1 1 0 0 0 6 19h12a1 1 0 0 0 .71-1.71L18 16z" fill="#fff"/>
          </svg>
        </button>
        {showNotifications && (
          <div className="header-notification-dropdown">
            <div className="header-notification-dropdown-content">
              {loading ? (
                <div className="header-notification-loading">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="header-notification-empty">No notifications</div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className="header-notification-item">
                    {n.message}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
