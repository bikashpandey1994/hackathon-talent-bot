/**
 * Data Service for Dashboard-specific API operations
 * Uses the base ApiService for making HTTP requests
 */

import apiService from './apiService.js';

class DataService {
  constructor() {
    this.apiService = apiService;
  }

  /**
   * Configure the API service with base URL and auth token
   * @param {string} baseURL - Base URL for the API
   * @param {string} authToken - Authentication token (optional)
   */
  configure(baseURL, authToken = null) {
    this.apiService.setBaseURL(baseURL);
    if (authToken) {
      this.apiService.setAuthToken(authToken);
    }
  }

  // Dashboard Data Operations
  /**
   * Fetch dashboard overview data
   * @returns {Promise} Dashboard overview data
   */
  async getDashboardOverview() {
    return await this.apiService.get('/dashboard/overview');
  }

  /**
   * Fetch dashboard statistics
   * @param {Object} filters - Optional filters for statistics
   * @returns {Promise} Dashboard statistics
   */
  async getDashboardStats(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/dashboard/stats?${queryParams}` : '/dashboard/stats';
    return await this.apiService.get(endpoint);
  }

  // User Management Operations
  /**
   * Fetch all users
   * @param {Object} options - Query options (page, limit, search, etc.)
   * @returns {Promise} Users data
   */
  async getUsers(options = {}) {
    const queryParams = new URLSearchParams(options).toString();
    const endpoint = queryParams ? `/users?${queryParams}` : '/users';
    return await this.apiService.get(endpoint);
  }

  /**
   * Fetch user by ID
   * @param {string|number} userId - User ID
   * @returns {Promise} User data
   */
  async getUserById(userId) {
    return await this.apiService.get(`/users/${userId}`);
  }

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise} Created user data
   */
  async createUser(userData) {
    return await this.apiService.post('/users', userData);
  }

  /**
   * Update user
   * @param {string|number} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} Updated user data
   */
  async updateUser(userId, userData) {
    return await this.apiService.put(`/users/${userId}`, userData);
  }

  /**
   * Delete user
   * @param {string|number} userId - User ID
   * @returns {Promise} Deletion confirmation
   */
  async deleteUser(userId) {
    return await this.apiService.delete(`/users/${userId}`);
  }

  // List/Items Operations
  /**
   * Fetch lists/items data
   * @param {Object} options - Query options (category, page, limit, etc.)
   * @returns {Promise} Lists data
   */
  async getLists(options = {}) {
    const queryParams = new URLSearchParams(options).toString();
    const endpoint = queryParams ? `/lists?${queryParams}` : '/lists';
    return await this.apiService.get(endpoint);
  }

  /**
   * Fetch list by ID
   * @param {string|number} listId - List ID
   * @returns {Promise} List data
   */
  async getListById(listId) {
    return await this.apiService.get(`/lists/${listId}`);
  }

  /**
   * Create new list
   * @param {Object} listData - List data
   * @returns {Promise} Created list data
   */
  async createList(listData) {
    return await this.apiService.post('/lists', listData);
  }

  /**
   * Update list
   * @param {string|number} listId - List ID
   * @param {Object} listData - Updated list data
   * @returns {Promise} Updated list data
   */
  async updateList(listId, listData) {
    return await this.apiService.put(`/lists/${listId}`, listData);
  }

  /**
   * Delete list
   * @param {string|number} listId - List ID
   * @returns {Promise} Deletion confirmation
   */
  async deleteList(listId) {
    return await this.apiService.delete(`/lists/${listId}`);
  }

  // Chart/Analytics Data Operations
  /**
   * Fetch chart data
   * @param {string} chartType - Type of chart (e.g., 'bar', 'line', 'pie')
   * @param {Object} options - Chart options (date range, filters, etc.)
   * @returns {Promise} Chart data
   */
  async getChartData(chartType, options = {}) {
    const queryParams = new URLSearchParams(options).toString();
    const endpoint = queryParams ? `/analytics/${chartType}?${queryParams}` : `/analytics/${chartType}`;
    return await this.apiService.get(endpoint);
  }

  /**
   * Fetch analytics data
   * @param {Object} options - Analytics options (date range, metrics, etc.)
   * @returns {Promise} Analytics data
   */
  async getAnalytics(options = {}) {
    const queryParams = new URLSearchParams(options).toString();
    const endpoint = queryParams ? `/analytics?${queryParams}` : '/analytics';
    return await this.apiService.get(endpoint);
  }

  // Search Operations
  /**
   * Search across different entities
   * @param {string} query - Search query
   * @param {Object} options - Search options (type, filters, etc.)
   * @returns {Promise} Search results
   */
  async search(query, options = {}) {
    const searchParams = { q: query, ...options };
    const queryParams = new URLSearchParams(searchParams).toString();
    return await this.apiService.get(`/search?${queryParams}`);
  }

  // File Upload Operations
  /**
   * Upload file
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

    return await this.apiService.uploadFile('/upload', formData);
  }

  // Candidates Operations
  /**
   * Fetch all candidates
   * @param {Object} options - Query options (page, limit, search, status, etc.)
   * @returns {Promise} Candidates data
   */
  async getCandidates(options = {}) {
    const queryParams = new URLSearchParams(options).toString();
    const endpoint = queryParams ? `/candidates?${queryParams}` : '/candidates';
    return await this.apiService.get(endpoint);
  }

  /**
   * Fetch candidate by ID
   * @param {string|number} candidateId - Candidate ID
   * @returns {Promise} Candidate data
   */
  async getCandidateById(candidateId) {
    return await this.apiService.get(`/candidates/${candidateId}`);
  }

  /**
   * Upload candidates file
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
   * Update candidate status
   * @param {string|number} candidateId - Candidate ID
   * @param {Object} statusData - Status update data (status, justification, email, etc.)
   * @returns {Promise} Update result
   */
  async updateCandidateStatus(candidateId, statusData) {
    return await this.apiService.put(`/candidates/${candidateId}/status`, statusData);
  }

  // Configuration Operations
  /**
   * Fetch application configuration
   * @returns {Promise} Configuration data
   */
  async getConfig() {
    return await this.apiService.get('/config');
  }

  /**
   * Update configuration
   * @param {Object} configData - Configuration data
   * @returns {Promise} Updated configuration
   */
  async updateConfig(configData) {
    return await this.apiService.put('/config', configData);
  }

  // Notification Operations
  /**
   * Fetch notifications
   * @param {Object} options - Query options (unread, page, limit, etc.)
   * @returns {Promise} Notifications data
   */
  async getNotifications(options = {}) {
    const queryParams = new URLSearchParams(options).toString();
    const endpoint = queryParams ? `/notifications?${queryParams}` : '/notifications';
    return await this.apiService.get(endpoint);
  }

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
   * Mark notification as read
   * @param {string|number} notificationId - Notification ID
   * @returns {Promise} Update confirmation
   */
  async markNotificationAsRead(notificationId) {
    return await this.apiService.patch(`/notifications/${notificationId}`, { read: true });
  }
}

// Create and export a default instance
const dataService = new DataService();

export default dataService;
export { DataService };
