/**
 * HR Service for HR-specific API operations
 * Uses the base ApiService for making HTTP requests
 * Configured with HR backend URL: http://localhost:8000
 */

import { ApiService } from './apiService.js';

class HRService {
  constructor() {
    // Create a separate instance of ApiService for HR operations
    this.apiService = new ApiService('http://localhost:8000');
  }

  /**
   * Configure the API service with base URL and auth token
   * @param {string} baseURL - Base URL for the API (defaults to http://localhost:8000)
   * @param {string} authToken - Authentication token (optional)
   */
  configure(baseURL = 'http://localhost:8000', authToken = null) {
    this.apiService.setBaseURL(baseURL);
    if (authToken) {
      this.apiService.setAuthToken(authToken);
    }
  }

  // HR Dashboard Data Operations
  /**
   * Fetch HR dashboard overview data
   * @returns {Promise} HR dashboard overview data
   */
  async getHRDashboardOverview() {
    return await this.apiService.get('/hr/dashboard/overview');
  }

  /**
   * Fetch HR dashboard statistics
   * @param {Object} filters - Optional filters for statistics
   * @returns {Promise} HR dashboard statistics
   */
  async getHRDashboardStats(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/hr/dashboard/stats?${queryParams}` : '/hr/dashboard/stats';
    return await this.apiService.get(endpoint);
  }

  // HR User Management Operations
  /**
   * Fetch all HR users
   * @param {Object} options - Query options (page, limit, search, etc.)
   * @returns {Promise} HR users data
   */
  async getHRUsers(options = {}) {
    const queryParams = new URLSearchParams(options).toString();
    const endpoint = queryParams ? `/hr/users?${queryParams}` : '/hr/users';
    return await this.apiService.get(endpoint);
  }

  /**
   * Fetch HR user by ID
   * @param {string|number} userId - User ID
   * @returns {Promise} HR user data
   */
  async getHRUserById(userId) {
    return await this.apiService.get(`/hr/users/${userId}`);
  }

  /**
   * Create new HR user
   * @param {Object} userData - User data
   * @returns {Promise} Created HR user data
   */
  async createHRUser(userData) {
    return await this.apiService.post('/hr/users', userData);
  }

  /**
   * Update HR user
   * @param {string|number} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} Updated HR user data
   */
  async updateHRUser(userId, userData) {
    return await this.apiService.put(`/hr/users/${userId}`, userData);
  }

  /**
   * Delete HR user
   * @param {string|number} userId - User ID
   * @returns {Promise} Deletion confirmation
   */
  async deleteHRUser(userId) {
    return await this.apiService.delete(`/hr/users/${userId}`);
  }

  // HR Candidates Operations
  /**
   * Fetch all candidates from HR system
   * @param {Object} options - Query options (page, limit, search, status, etc.)
   * @returns {Promise} Candidates data
   */
  async getCandidates(options = {}) {
    const queryParams = new URLSearchParams(options).toString();
    const endpoint = queryParams ? `/candidates?${queryParams}` : '/candidates';
    return await this.apiService.get(endpoint);
  }

  /**
   * Fetch candidate by ID from HR system
   * @param {string|number} candidateId - Candidate ID
   * @returns {Promise} Candidate data
   */
  async getCandidateById(candidateId) {
    return await this.apiService.get(`/candidates/${candidateId}`);
  }

  /**
   * Create new candidate in HR system
   * @param {Object} candidateData - Candidate data
   * @returns {Promise} Created candidate data
   */
  async createCandidate(candidateData) {
    return await this.apiService.post('/candidates', candidateData);
  }

  /**
   * Update candidate in HR system
   * @param {string|number} candidateId - Candidate ID
   * @param {Object} candidateData - Updated candidate data
   * @returns {Promise} Updated candidate data
   */
  async updateCandidate(candidateId, candidateData) {
    return await this.apiService.put(`/candidates/${candidateId}`, candidateData);
  }

  /**
   * Upload candidates file to HR system
   * @param {File} file - File containing candidates data
   * @param {Object} options - Upload options
   * @returns {Promise} Upload result
   */
  async uploadCandidates(file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add additional options to form data
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });

    return await this.apiService.uploadFile('/candidates/upload', formData);
  }

  /**
   * Update candidate status in HR system
   * @param {string|number} candidateId - Candidate ID
   * @param {Object} statusData - Status update data (status, justification, email, etc.)
   * @returns {Promise} Update result
   */
  async updateCandidateStatus(candidateId, statusData) {
    return await this.apiService.put(`/candidates/${candidateId}/status`, statusData);
  }

  /**
   * Get candidate state information
   * @param {string} threadId - Thread ID (email ID)
   * @param {Object} options - Additional options
   * @returns {Promise} State information with messages
   */
  async getCandidateState(threadId, options = {}) {
    const requestData = {
      thread_id: threadId,
      ...options
    };
    return await this.apiService.post('/state', requestData);
  }

  /**
   * Submit HR action for candidate
   * @param {string} threadId - Thread ID (email ID)
   * @param {string} state - Current state
   * @param {string} hrMessage - HR message/justification
   * @param {string} nextNode - Next node in workflow
   * @returns {Promise} HR action result
   */
  async submitHRAction(threadId, state, hrMessage, nextNode) {
    const requestData = {
      thread_id: threadId,
      //state: state,
      hr_message: hrMessage,
      hr_action: true,
      hr_nextnode: nextNode
    };
    return await this.apiService.post('/hr-action', requestData);
  }


  /**
   * Get candidate summary information
   * @param {string} threadId - Thread ID (email ID)
   * @param {string} query - Query string (optional)
   * @returns {Promise} Candidate summary result
   */
  async getSummary(threadId, query = "") {
    const requestData = {
      thread_id: threadId,
      summary: true,
      query: query
    };
    return await this.apiService.post('/summary', requestData);
  }

  /**
   * Delete candidate from HR system
   * @param {string|number} candidateId - Candidate ID
   * @returns {Promise} Deletion confirmation
   */
  async deleteCandidate(candidateId) {
    return await this.apiService.delete(`/candidates/${candidateId}`);
  }

  // HR Notifications Operations
  /**
   * Fetch HR notifications
   * @param {Object} options - Query options (unread, page, limit, etc.)
   * @returns {Promise} HR notifications data
   */
  async getHRNotifications(options = {}) {
    const queryParams = new URLSearchParams(options).toString();
    const endpoint = queryParams ? `/candidates/fetchHRNotifications?${queryParams}` : '/candidates/fetchHRNotifications';
    return await this.apiService.get(endpoint);
  }

  /**
   * Fetch general notifications from HR system
   * @param {Object} options - Query options (unread, page, limit, etc.)
   * @returns {Promise} Notifications data
   */
  async getNotifications(options = {}) {
    const queryParams = new URLSearchParams(options).toString();
    const endpoint = queryParams ? `/hr/notifications?${queryParams}` : '/hr/notifications';
    return await this.apiService.get(endpoint);
  }

  /**
   * Mark HR notification as read
   * @param {string|number} notificationId - Notification ID
   * @returns {Promise} Update confirmation
   */
  async markNotificationAsRead(notificationId) {
    return await this.apiService.patch(`/hr/notifications/${notificationId}`, { read: true });
  }

  /**
   * Create new HR notification
   * @param {Object} notificationData - Notification data
   * @returns {Promise} Created notification data
   */
  async createNotification(notificationData) {
    return await this.apiService.post('/hr/notifications', notificationData);
  }

  // HR Reports and Analytics
  /**
   * Fetch HR analytics data
   * @param {Object} options - Analytics options (date range, metrics, etc.)
   * @returns {Promise} HR analytics data
   */
  async getHRAnalytics(options = {}) {
    const queryParams = new URLSearchParams(options).toString();
    const endpoint = queryParams ? `/hr/analytics?${queryParams}` : '/hr/analytics';
    return await this.apiService.get(endpoint);
  }

  /**
   * Fetch HR chart data
   * @param {string} chartType - Type of chart (e.g., 'bar', 'line', 'pie')
   * @param {Object} options - Chart options (date range, filters, etc.)
   * @returns {Promise} HR chart data
   */
  async getHRChartData(chartType, options = {}) {
    const queryParams = new URLSearchParams(options).toString();
    const endpoint = queryParams ? `/hr/analytics/${chartType}?${queryParams}` : `/hr/analytics/${chartType}`;
    return await this.apiService.get(endpoint);
  }

  /**
   * Generate HR report
   * @param {Object} reportOptions - Report options (type, date range, filters, etc.)
   * @returns {Promise} HR report data
   */
  async generateHRReport(reportOptions = {}) {
    return await this.apiService.post('/hr/reports', reportOptions);
  }

  /**
   * Export HR data
   * @param {Object} exportOptions - Export options (format, data type, filters, etc.)
   * @returns {Promise} Export result
   */
  async exportHRData(exportOptions = {}) {
    return await this.apiService.post('/hr/export', exportOptions);
  }

  // HR Search Operations
  /**
   * Search HR entities
   * @param {string} query - Search query
   * @param {Object} options - Search options (type, filters, etc.)
   * @returns {Promise} HR search results
   */
  async searchHR(query, options = {}) {
    const searchParams = { q: query, ...options };
    const queryParams = new URLSearchParams(searchParams).toString();
    return await this.apiService.get(`/hr/search?${queryParams}`);
  }

  /**
   * Search candidates in HR system
   * @param {string} query - Search query
   * @param {Object} options - Search options (filters, etc.)
   * @returns {Promise} Candidate search results
   */
  async searchCandidates(query, options = {}) {
    const searchParams = { q: query, ...options };
    const queryParams = new URLSearchParams(searchParams).toString();
    return await this.apiService.get(`/candidates/search?${queryParams}`);
  }

  // HR File Operations
  /**
   * Upload file to HR system
   * @param {File} file - File to upload
   * @param {Object} options - Upload options (destination, metadata, etc.)
   * @returns {Promise} Upload result
   */
  async uploadFile(file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add additional options to form data
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });

    return await this.apiService.uploadFile('/hr/upload', formData);
  }

  /**
   * Download file from HR system
   * @param {string|number} fileId - File ID
   * @returns {Promise} File download response
   */
  async downloadFile(fileId) {
    return await this.apiService.get(`/hr/files/${fileId}/download`);
  }

  /**
   * Delete file from HR system
   * @param {string|number} fileId - File ID
   * @returns {Promise} Deletion confirmation
   */
  async deleteFile(fileId) {
    return await this.apiService.delete(`/hr/files/${fileId}`);
  }

  // HR Configuration Operations
  /**
   * Fetch HR system configuration
   * @returns {Promise} HR configuration data
   */
  async getHRConfig() {
    return await this.apiService.get('/hr/config');
  }

  /**
   * Update HR system configuration
   * @param {Object} configData - Configuration data
   * @returns {Promise} Updated HR configuration
   */
  async updateHRConfig(configData) {
    return await this.apiService.put('/hr/config', configData);
  }
}

// Create and export a default instance
const hrService = new HRService();

export default hrService;
export { HRService };
