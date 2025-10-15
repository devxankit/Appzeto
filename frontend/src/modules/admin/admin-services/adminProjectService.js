import { apiRequest } from './baseApiService';

// Admin Project Management Service
export const adminProjectService = {
  // Get all projects
  getAllProjects: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/admin/projects?${queryString}` : '/admin/projects';
      
      const response = await apiRequest(url, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get project by ID
  getProjectById: async (projectId) => {
    try {
      const response = await apiRequest(`/admin/projects/${projectId}`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new project
  createProject: async (projectData) => {
    try {
      const response = await apiRequest('/admin/projects', {
        method: 'POST',
        body: JSON.stringify(projectData)
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update project
  updateProject: async (projectId, projectData) => {
    try {
      const response = await apiRequest(`/admin/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify(projectData)
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete project
  deleteProject: async (projectId) => {
    try {
      const response = await apiRequest(`/admin/projects/${projectId}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get project statistics
  getProjectStats: async () => {
    try {
      const response = await apiRequest('/admin/projects/stats', {
        method: 'GET'
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default adminProjectService;
