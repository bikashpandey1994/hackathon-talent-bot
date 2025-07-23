/**
 * Base API Service for handling REST API calls
 * Provides common functionality for HTTP requests with error handling
 */

class ApiService {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Set authorization token for API requests
   * @param {string} token - Authorization token
   */
  setAuthToken(token) {
    if (token) {
      this.defaultHeaders.Authorization = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders.Authorization;
    }
  }

  /**
   * Set base URL for API requests
   * @param {string} url - Base URL for API
   */
  setBaseURL(url) {
    this.baseURL = url;
  }

  /**
   * Build complete URL with base URL and endpoint
   * @param {string} endpoint - API endpoint
   * @returns {string} Complete URL
   */
  buildURL(endpoint) {
    return this.baseURL ? `${this.baseURL}${endpoint}` : endpoint;
  }

  /**
   * Handle API response
   * @param {Response} response - Fetch response object
   * @returns {Promise} Parsed response data
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error = new Error(data.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  /**
   * Make GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise} Response data
   */
  async get(endpoint, options = {}) {
    try {
      const response = await fetch(this.buildURL(endpoint), {
        method: 'GET',
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`GET request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Make POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise} Response data
   */
  async post(endpoint, data = null, options = {}) {
    try {
      const response = await fetch(this.buildURL(endpoint), {
        method: 'POST',
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        body: data ? JSON.stringify(data) : null,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`POST request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Make PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise} Response data
   */
  async put(endpoint, data = null, options = {}) {
    try {
      const response = await fetch(this.buildURL(endpoint), {
        method: 'PUT',
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        body: data ? JSON.stringify(data) : null,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`PUT request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Make PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise} Response data
   */
  async patch(endpoint, data = null, options = {}) {
    try {
      const response = await fetch(this.buildURL(endpoint), {
        method: 'PATCH',
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        body: data ? JSON.stringify(data) : null,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`PATCH request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Make DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise} Response data
   */
  async delete(endpoint, options = {}) {
    try {
      const response = await fetch(this.buildURL(endpoint), {
        method: 'DELETE',
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`DELETE request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Upload file with multipart/form-data
   * @param {string} endpoint - API endpoint
   * @param {FormData} formData - Form data containing file
   * @param {Object} options - Additional fetch options
   * @returns {Promise} Response data
   */
  async uploadFile(endpoint, formData, options = {}) {
    try {
      const headers = { ...this.defaultHeaders };
      // Remove Content-Type header to let browser set it with boundary for FormData
      delete headers['Content-Type'];

      const response = await fetch(this.buildURL(endpoint), {
        method: 'POST',
        headers: {
          ...headers,
          ...options.headers,
        },
        body: formData,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`File upload failed for ${endpoint}:`, error);
      throw error;
    }
  }
}

// Create and export a default instance
const apiService = new ApiService();

export default apiService;
export { ApiService };
