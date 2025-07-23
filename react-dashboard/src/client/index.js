/**
 * Client Services Index
 * Exports all API and data services for easy importing
 */

// Base API Service
export { default as apiService, ApiService } from './apiService.js';

// Data Service for dashboard-specific operations
export { default as dataService, DataService } from './dataService.js';

// Default export for convenience
export default {
  apiService: require('./apiService.js').default,
  dataService: require('./dataService.js').default,
};
