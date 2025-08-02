const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token management
const getToken = () => localStorage.getItem('civictrack_token');

// API headers
const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Issues API calls
export const issuesAPI = {
  // Get all issues with filters
  getIssues: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.lat) params.append('lat', filters.lat);
      if (filters.lng) params.append('lng', filters.lng);
      if (filters.radius) params.append('radius', filters.radius);

      const response = await fetch(`${API_BASE_URL}/issues?${params}`, {
        method: 'GET',
        headers: getHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch issues');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get single issue
  getIssue: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch issue');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Create new issue
  createIssue: async (issueData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(issueData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create issue');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's issues
  getUserIssues: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/user`, {
        method: 'GET',
        headers: getHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user issues');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Flag an issue
  flagIssue: async (issueId, flagData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/${issueId}/flag`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(flagData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to flag issue');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Delete issue
  deleteIssue: async (issueId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/${issueId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete issue');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}; 