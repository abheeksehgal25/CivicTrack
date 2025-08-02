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

// Admin API calls
export const adminAPI = {
  // Get dashboard overview data
  getDashboardData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        method: 'GET',
        headers: getHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard data');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get all users with pagination and search
  getUsers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);

      const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams}`, {
        method: 'GET',
        headers: getHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get all issues with filters
  getIssues: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);

      const response = await fetch(`${API_BASE_URL}/admin/issues?${queryParams}`, {
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

  // Get all flags
  getFlags: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await fetch(`${API_BASE_URL}/admin/flags?${queryParams}`, {
        method: 'GET',
        headers: getHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch flags');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get analytics data
  getAnalytics: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.period) queryParams.append('period', params.period);

      const response = await fetch(`${API_BASE_URL}/admin/analytics?${queryParams}`, {
        method: 'GET',
        headers: getHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch analytics');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Update issue status
  updateIssueStatus: async (issueId, statusData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/issues/${issueId}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(statusData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update issue status');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Delete issue
  deleteIssue: async (issueId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/issues/${issueId}`, {
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
  },

  // Ban user
  banUser: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/ban`, {
        method: 'PATCH',
        headers: getHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to ban user');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Unban user
  unbanUser: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/unban`, {
        method: 'PATCH',
        headers: getHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to unban user');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}; 