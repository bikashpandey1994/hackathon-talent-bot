/**
 * Usage Examples for API Services
 * This file demonstrates how to use the API services in your React components
 */

import { apiService, dataService } from './index.js';
import { getConfig } from './config.js';

// Example 1: Basic API Service Usage
export const basicApiExample = async () => {
  try {
    // Configure the API service
    const config = getConfig();
    apiService.setBaseURL(config.baseURL);
    
    // Set authentication token (if available)
    const token = localStorage.getItem('authToken');
    if (token) {
      apiService.setAuthToken(token);
    }

    // Make a simple GET request
    const users = await apiService.get('/users');
    console.log('Users:', users);

    // Make a POST request with data
    const newUser = await apiService.post('/users', {
      name: 'John Doe',
      email: 'john@example.com',
    });
    console.log('Created user:', newUser);

  } catch (error) {
    console.error('API Error:', error);
  }
};

// Example 2: Using Data Service in a React Component
export const useDataServiceInComponent = () => {
  // This is how you would use it in a React component
  const exampleComponent = `
    import React, { useState, useEffect } from 'react';
    import { dataService } from '../client';

    const DashboardComponent = () => {
      const [dashboardData, setDashboardData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchDashboardData = async () => {
          try {
            setLoading(true);
            
            // Configure the data service
            dataService.configure('https://api.yourdomain.com/api', 'your-auth-token');
            
            // Fetch dashboard overview
            const overview = await dataService.getDashboardOverview();
            setDashboardData(overview);
            
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };

        fetchDashboardData();
      }, []);

      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error}</div>;

      return (
        <div>
          <h1>Dashboard</h1>
          {/* Render dashboard data */}
        </div>
      );
    };

    export default DashboardComponent;
  `;
  
  return exampleComponent;
};

// Example 3: File Upload Usage
export const fileUploadExample = async (file) => {
  try {
    // Upload a file with additional metadata
    const uploadResult = await dataService.uploadFile(file, {
      category: 'documents',
      description: 'Important document',
      isPublic: false,
    });
    
    console.log('File uploaded successfully:', uploadResult);
    return uploadResult;
    
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};

// Example 4: Search with Filters
export const searchExample = async (searchQuery) => {
  try {
    // Search with various filters
    const searchResults = await dataService.search(searchQuery, {
      type: 'users',
      limit: 20,
      page: 1,
      sortBy: 'name',
      sortOrder: 'asc',
    });
    
    console.log('Search results:', searchResults);
    return searchResults;
    
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
};

// Example 5: Analytics Data Fetching
export const analyticsExample = async () => {
  try {
    // Fetch different types of chart data
    const barChartData = await dataService.getChartData('bar', {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      groupBy: 'month',
    });
    
    const lineChartData = await dataService.getChartData('line', {
      metric: 'user_growth',
      period: 'last_6_months',
    });
    
    // Fetch general analytics
    const analytics = await dataService.getAnalytics({
      metrics: ['users', 'revenue', 'conversions'],
      dateRange: 'last_30_days',
    });
    
    return {
      barChart: barChartData,
      lineChart: lineChartData,
      analytics: analytics,
    };
    
  } catch (error) {
    console.error('Analytics fetch failed:', error);
    throw error;
  }
};

// Example 6: Error Handling Best Practices
export const errorHandlingExample = async () => {
  try {
    const data = await dataService.getUsers();
    return data;
    
  } catch (error) {
    // Handle different types of errors
    if (error.status === 401) {
      // Unauthorized - redirect to login
      console.log('User not authenticated');
      // window.location.href = '/login';
    } else if (error.status === 403) {
      // Forbidden - show access denied message
      console.log('Access denied');
    } else if (error.status === 404) {
      // Not found
      console.log('Resource not found');
    } else if (error.status >= 500) {
      // Server error
      console.log('Server error, please try again later');
    } else {
      // Other errors
      console.log('An error occurred:', error.message);
    }
    
    throw error;
  }
};

// Example 7: Pagination Helper
export const paginationExample = async (page = 1, limit = 10) => {
  try {
    const options = {
      page: page,
      limit: limit,
      sortBy: 'created_at',
      sortOrder: 'desc',
    };
    
    const result = await dataService.getUsers(options);
    
    return {
      users: result.data || result.users || result,
      pagination: {
        currentPage: result.page || page,
        totalPages: result.totalPages || Math.ceil(result.total / limit),
        totalItems: result.total || result.count,
        hasNextPage: result.hasNextPage || (page * limit < result.total),
        hasPrevPage: result.hasPrevPage || page > 1,
      },
    };
    
  } catch (error) {
    console.error('Pagination example failed:', error);
    throw error;
  }
};

export default {
  basicApiExample,
  useDataServiceInComponent,
  fileUploadExample,
  searchExample,
  analyticsExample,
  errorHandlingExample,
  paginationExample,
};
