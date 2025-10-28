import { apiRequest } from './baseApiService';

// Dashboard & Statistics
export const getDashboardStatistics = async () => {
  try {
    const response = await apiRequest('/sales/dashboard/statistics', {
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    // Return default stats if API fails
    return {
      statusCounts: {
        new: 0,
        connected: 0,
        not_picked: 0,
        today_followup: 0,
        quotation_sent: 0,
        dq_sent: 0,
        app_client: 0,
        web: 0,
        converted: 0,
        lost: 0,
        hot: 0,
        demo_requested: 0
      },
      totalLeads: 0
    };
  }
};

// Lead Management
export const getMyLeads = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add parameters if they exist
    if (params.status) queryParams.append('status', params.status);
    if (params.category) queryParams.append('category', params.category);
    if (params.priority) queryParams.append('priority', params.priority);
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/sales/leads${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiRequest(url, {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error('Error fetching leads:', error);
    // Return empty response if API fails
    return {
      data: [],
      count: 0,
      total: 0,
      page: 1,
      pages: 0
    };
  }
};

export const getLeadsByStatus = async (status, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add parameters if they exist
    if (params.category) queryParams.append('category', params.category);
    if (params.priority) queryParams.append('priority', params.priority);
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const url = `/sales/leads/status/${status}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiRequest(url, {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error('Error fetching leads by status:', error);
    // Return empty response if API fails
    return {
      data: [],
      count: 0,
      total: 0,
      page: 1,
      pages: 0,
      status: status
    };
  }
};

export const getLeadDetail = async (leadId) => {
  try {
    const response = await apiRequest(`/sales/leads/${leadId}`, {
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching lead detail:', error);
    throw error;
  }
};

export const updateLeadStatus = async (leadId, status, notes = '') => {
  try {
    const response = await apiRequest(`/sales/leads/${leadId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        notes
      })
    });
    return response.data;
  } catch (error) {
    console.error('Error updating lead status:', error);
    throw error;
  }
};

// LeadProfile Management
export const createLeadProfile = async (leadId, profileData) => {
  try {
    const response = await apiRequest(`/sales/leads/${leadId}/profile`, {
      method: 'POST',
      body: JSON.stringify(profileData)
    });
    return response.data;
  } catch (error) {
    console.error('Error creating lead profile:', error);
    throw error;
  }
};

export const updateLeadProfile = async (leadId, profileData) => {
  try {
    const response = await apiRequest(`/sales/leads/${leadId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    return response.data;
  } catch (error) {
    console.error('Error updating lead profile:', error);
    throw error;
  }
};

export const convertLeadToClient = async (leadId, projectData) => {
  try {
    const response = await apiRequest(`/sales/leads/${leadId}/convert`, {
      method: 'POST',
      body: JSON.stringify({ projectData })
    });
    return response.data;
  } catch (error) {
    console.error('Error converting lead:', error);
    throw error;
  }
};

export const getLeadCategories = async () => {
  try {
    const response = await apiRequest('/sales/lead-categories', {
      method: 'GET'
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Utility functions for status management
export const getStatusDisplayName = (status) => {
  const statusMap = {
    'new': 'New',
    'connected': 'Connected',
    'not_picked': 'Not Picked',
    'today_followup': 'Today Followup',
    'quotation_sent': 'Quotation Sent',
    'dq_sent': 'DQ Sent',
    'app_client': 'App Client',
    'web': 'Web',
    'converted': 'Converted',
    'lost': 'Lost',
    'hot': 'Hot',
    'demo_requested': 'Demo Requested'
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status) => {
  const colorMap = {
    'new': 'bg-blue-100 text-blue-800',
    'connected': 'bg-green-100 text-green-800',
    'not_picked': 'bg-gray-100 text-gray-800',
    'today_followup': 'bg-yellow-100 text-yellow-800',
    'quotation_sent': 'bg-purple-100 text-purple-800',
    'dq_sent': 'bg-indigo-100 text-indigo-800',
    'app_client': 'bg-pink-100 text-pink-800',
    'web': 'bg-cyan-100 text-cyan-800',
    'converted': 'bg-emerald-100 text-emerald-800',
    'lost': 'bg-red-100 text-red-800',
    'hot': 'bg-orange-100 text-orange-800',
    'demo_requested': 'bg-teal-100 text-teal-800'
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

export const getValidStatusTransitions = (currentStatus) => {
  const transitions = {
    'new': ['connected', 'not_picked', 'lost'],
    'connected': ['hot', 'today_followup', 'quotation_sent', 'dq_sent', 'app_client', 'web', 'demo_requested', 'lost'],
    'not_picked': ['connected', 'today_followup', 'lost'],
    'today_followup': ['connected', 'hot', 'quotation_sent', 'dq_sent', 'app_client', 'web', 'demo_requested', 'lost'],
    'quotation_sent': ['connected', 'hot', 'dq_sent', 'app_client', 'web', 'demo_requested', 'converted', 'lost'],
    'dq_sent': ['connected', 'hot', 'quotation_sent', 'app_client', 'web', 'demo_requested', 'converted', 'lost'],
    'app_client': ['connected', 'hot', 'quotation_sent', 'dq_sent', 'web', 'demo_requested', 'converted', 'lost'],
    'web': ['connected', 'hot', 'quotation_sent', 'dq_sent', 'app_client', 'demo_requested', 'converted', 'lost'],
    'demo_requested': ['connected', 'hot', 'quotation_sent', 'dq_sent', 'app_client', 'web', 'converted', 'lost'],
    'hot': ['quotation_sent', 'dq_sent', 'app_client', 'web', 'demo_requested', 'converted', 'lost'],
    'converted': [], // Terminal state
    'lost': [] // Terminal state
  };
  return transitions[currentStatus] || [];
};

// Default export with all functions
const salesLeadService = {
  getDashboardStatistics,
  getMyLeads,
  getLeadsByStatus,
  getLeadDetail,
  updateLeadStatus,
  createLeadProfile,
  updateLeadProfile,
  convertLeadToClient,
  getLeadCategories,
  getStatusDisplayName,
  getStatusColor,
  getValidStatusTransitions
};

export default salesLeadService;
