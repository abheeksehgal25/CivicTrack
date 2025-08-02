const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token management
const getToken = () => localStorage.getItem('civictrack_token');
const setToken = (token) => localStorage.setItem('civictrack_token', token);
const removeToken = () => localStorage.removeItem('civictrack_token');

// API headers
const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Authentication API calls
export const authAPI = {
  // Register user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token if registration successful
      if (data.token) {
        setToken(data.token);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token if login successful
      if (data.token) {
        setToken(data.token);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getHeaders()
      });

      // Remove token regardless of response
      removeToken();
      
      return { message: 'Logged out successfully' };
    } catch (error) {
      // Remove token even if API call fails
      removeToken();
      throw error;
    }
  },

  // Verify token
  verify: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: getHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        removeToken();
        throw new Error(data.message || 'Token verification failed');
      }

      return data;
    } catch (error) {
      removeToken();
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = getToken();
    return !!token;
  },

  // Get current user from token
  getCurrentUser: () => {
    const token = getToken();
    if (!token) return null;
    
    try {
      // Decode JWT token (basic decode, not verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      removeToken();
      return null;
    }
  }
}; 