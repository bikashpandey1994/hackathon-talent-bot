/**
 * API Configuration
 * Contains API endpoints, settings, and environment-specific configurations
 */

// Environment configuration
const environments = {
  development: {
    baseURL: 'http://localhost:8081',
    timeout: 10000,
    enableLogging: true,
  },
  staging: {
    baseURL: 'https://staging-api.yourdomain.com/api',
    timeout: 15000,
    enableLogging: true,
  },
  production: {
    baseURL: 'https://api.yourdomain.com/api',
    timeout: 15000,
    enableLogging: false,
  },
};

// Get current environment
const getCurrentEnvironment = () => {
  return process.env.NODE_ENV || 'development';
};

// Get environment-specific configuration
const getConfig = () => {
  const env = getCurrentEnvironment();
  return environments[env] || environments.development;
};

// API endpoints configuration
const endpoints = {
  // Authentication
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  
  // Dashboard
  dashboard: {
    overview: '/dashboard/overview',
    stats: '/dashboard/stats',
    metrics: '/dashboard/metrics',
  },
  
  // Users
  users: {
    list: '/users',
    create: '/users',
    details: (id) => `/users/${id}`,
    update: (id) => `/users/${id}`,
    delete: (id) => `/users/${id}`,
    profile: '/users/profile',
  },
  
  // Lists/Items
  lists: {
    list: '/lists',
    create: '/lists',
    details: (id) => `/lists/${id}`,
    update: (id) => `/lists/${id}`,
    delete: (id) => `/lists/${id}`,
    items: (listId) => `/lists/${listId}/items`,
  },
  
  // Analytics/Charts
  analytics: {
    overview: '/analytics',
    charts: (type) => `/analytics/${type}`,
    reports: '/analytics/reports',
    export: '/analytics/export',
  },
  
  // Search
  search: {
    global: '/search',
    users: '/search/users',
    lists: '/search/lists',
    suggestions: '/search/suggestions',
  },
  
  // File operations
  files: {
    upload: '/upload',
    download: (id) => `/files/${id}/download`,
    delete: (id) => `/files/${id}`,
    list: '/files',
  },
  
  // Candidates
  candidates: {
    upload: '/candidates/upload',
    list: '/candidates',
    details: (id) => `/candidates/${id}`,
  },
  
  // Notifications
  notifications: {
    list: '/notifications',
    markRead: (id) => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all',
    unreadCount: '/notifications/unread-count',
    fetchHR: '/fetchHRNotifications',
  },
  
  // Configuration
  config: {
    app: '/config',
    user: '/config/user',
    theme: '/config/theme',
  },
};

// HTTP status codes
const statusCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Request timeout configurations
const timeouts = {
  default: 10000, // 10 seconds
  upload: 60000,  // 60 seconds for file uploads
  download: 30000, // 30 seconds for downloads
  analytics: 20000, // 20 seconds for analytics queries
};

// Export all configurations
export {
  environments,
  getCurrentEnvironment,
  getConfig,
  endpoints,
  statusCodes,
  timeouts,
};

export default {
  environments,
  getCurrentEnvironment,
  getConfig,
  endpoints,
  statusCodes,
  timeouts,
};
