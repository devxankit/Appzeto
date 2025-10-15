import { apiRequest } from './baseApiService';

// Admin User Management Service
export const adminUserService = {
  // Get all users
  getAllUsers: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/admin/users?${queryString}` : '/admin/users';
      
      const response = await apiRequest(url, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await apiRequest(`/admin/users/${userId}`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await apiRequest('/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await apiRequest(`/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await apiRequest(`/admin/users/${userId}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Activate/Deactivate user
  toggleUserStatus: async (userId, isActive) => {
    try {
      const response = await apiRequest(`/admin/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive })
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default adminUserService;
