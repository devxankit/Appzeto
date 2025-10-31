import { apiRequest } from './baseApiService';

class AdminDashboardService {
  // Get comprehensive dashboard statistics
  async getDashboardStats() {
    try {
      const response = await apiRequest('/admin/analytics/dashboard', { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      throw error;
    }
  }

  // Get system analytics
  async getSystemAnalytics(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add query parameters
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const url = `/admin/analytics/system${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await apiRequest(url, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Error fetching system analytics:', error);
      throw error;
    }
  }
}

// Export singleton instance
const adminDashboardService = new AdminDashboardService();
export default adminDashboardService;


