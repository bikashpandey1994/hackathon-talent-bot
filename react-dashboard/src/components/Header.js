import React, { useState, useEffect } from 'react';
import ActionPopup from './ActionPopup';
import dataService from '../client/dataService';
import { getConfig } from '../client/config';
import '../css/Header.css';

const Header = ({ navOpen, onNavOpen, onNavClose }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationEmails, setNotificationEmails] = useState([]); // Store email data (not displayed)
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Initialize data service with base URL
  useEffect(() => {
    const config = getConfig();
    dataService.configure(config.baseURL);
  }, []);

  const handleNotificationClick = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setLoading(true);
      setError(null);
      try {
        const response = await dataService.getHRNotifications();
        const notificationsData = response.data || response || [];
        
        // Store the full notification data including emails (but don't display emails)
        setNotifications(notificationsData);
        setNotificationCount(notificationsData.length);
        
        // Extract and store email data separately for potential future use
        const emailData = notificationsData.map(notification => ({
          id: notification.id,
          email: notification.email,
          message: notification.message,
          timestamp: notification.timestamp || new Date().toISOString()
        }));
        setNotificationEmails(emailData);
        
        // Optional: Log email data for debugging (remove in production)
        console.log('Notification emails stored:', emailData);
        
      } catch (err) {
        console.error('Failed to fetch HR notifications:', err);
        setError(err.message || 'Failed to fetch notifications');
        // Fallback to mock data if API fails
        const fallbackData = [
          { id: 1, message: 'New candidate joined today.', email: 'hr@company.com' },
          { id: 2, message: 'Document pending for Rahul Verma.', email: 'hr@company.com' },
          { id: 3, message: 'Medical pending for Amit Singh.', email: 'hr@company.com' }
        ];
        setNotifications(fallbackData);
        setNotificationCount(fallbackData.length);
        
        // Store fallback email data as well
        const fallbackEmailData = fallbackData.map(notification => ({
          id: notification.id,
          email: notification.email,
          message: notification.message,
          timestamp: new Date().toISOString()
        }));
        setNotificationEmails(fallbackEmailData);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNotificationItemClick = (notification) => {
    // Find the corresponding email data for this notification
    const emailData = notificationEmails.find(emailItem => emailItem.id === notification.id);
    
    // Set the selected notification data
    setSelectedNotification({
      ...notification,
      email: emailData?.email || null
    });
    
    // Close the notifications dropdown
    setShowNotifications(false);
    
    // Open the action popup
    setShowActionPopup(true);
  };

  const handleActionPopupClose = () => {
    setShowActionPopup(false);
    setSelectedNotification(null);
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
      <div className="header-notification-icon">
        <button
          className="header-notification-btn"
          aria-label="Notifications"
          onClick={handleNotificationClick}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6V11c0-3.07-1.63-5.64-5-6.32V4a1 1 0 1 0-2 0v0.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29A1 1 0 0 0 6 19h12a1 1 0 0 0 .71-1.71L18 16z" fill="#fff"/>
          </svg>
          {notificationCount > 0 && (
            <span className="header-notification-count">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </button>
        {showNotifications && (
          <div className="header-notification-dropdown">
            <div className="header-notification-dropdown-content">
              {loading ? (
                <div className="header-notification-loading">Loading notifications...</div>
              ) : error ? (
                <div className="header-notification-error">
                  <div>Failed to load notifications</div>
                  <div style={{ fontSize: '0.8em', color: '#666' }}>Showing cached data</div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="header-notification-empty">No notifications</div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className="header-notification-item"
                    onClick={() => handleNotificationItemClick(notification)}
                    style={{ cursor: 'pointer' }}
                    title="Click to take action"
                  >
                    {notification.message}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Action Popup for Notifications */}
      <ActionPopup
        isOpen={showActionPopup}
        onClose={handleActionPopupClose}
        candidateData={{
          name: selectedNotification?.candidateName || 'Unknown',
          id: selectedNotification?.candidateId || selectedNotification?.id,
          status: selectedNotification?.status || 'Document Pending'
        }}
        email={selectedNotification?.email}
        title="Take Action on Notification"
      />
    </header>
  );
};

export default Header;
