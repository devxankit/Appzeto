import { apiRequest } from './baseApiService';
import { uploadToCloudinary } from '../../../services/cloudinaryService';

class AdminChannelPartnerService {
  // Get all channel partners with filtering and pagination
  async getAllChannelPartners(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add query parameters
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const url = `/admin/channel-partners${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await apiRequest(url, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Error fetching channel partners:', error);
      throw error;
    }
  }

  // Get single channel partner by ID
  async getChannelPartner(id) {
    try {
      const response = await apiRequest(`/admin/channel-partners/${id}`, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Error fetching channel partner:', error);
      throw error;
    }
  }

  // Create new channel partner
  async createChannelPartner(partnerData) {
    try {
      // Handle document upload to Cloudinary if present
      if (partnerData.document && partnerData.document instanceof File) {
        const uploadResult = await uploadToCloudinary(partnerData.document, 'appzeto/channel-partners/documents');
        if (uploadResult.success) {
          partnerData.document = uploadResult.data;
        } else {
          throw new Error(`Document upload failed: ${uploadResult.error}`);
        }
      }

      // Helper function to format date without timezone conversion
      const formatDateForAPI = (dateString) => {
        if (!dateString) return undefined;
        // If date is in YYYY-MM-DD format (from HTML date input), send it as-is
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return dateString;
        }
        // If it's already a full ISO string, extract just the date part
        if (dateString.match(/^\d{4}-\d{2}-\d{2}T/)) {
          return dateString.split('T')[0];
        }
        return dateString;
      };

      // Prepare partner data for API
      const requestData = {
        ...partnerData,
        dateOfBirth: formatDateForAPI(partnerData.dateOfBirth),
        joiningDate: formatDateForAPI(partnerData.joiningDate)
      };

      const response = await apiRequest(`/admin/channel-partners`, {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      console.error('Error creating channel partner:', error);
      throw error;
    }
  }

  // Update channel partner
  async updateChannelPartner(id, partnerData) {
    try {
      // Handle document upload to Cloudinary if present
      if (partnerData.document && partnerData.document instanceof File) {
        const uploadResult = await uploadToCloudinary(partnerData.document, 'appzeto/channel-partners/documents');
        if (uploadResult.success) {
          partnerData.document = uploadResult.data;
        } else {
          throw new Error(`Document upload failed: ${uploadResult.error}`);
        }
      }

      // Helper function to format date without timezone conversion
      const formatDateForAPI = (dateString) => {
        if (!dateString) return undefined;
        // If date is in YYYY-MM-DD format (from HTML date input), send it as-is
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return dateString;
        }
        // If it's already a full ISO string, extract just the date part
        if (dateString.match(/^\d{4}-\d{2}-\d{2}T/)) {
          return dateString.split('T')[0];
        }
        return dateString;
      };

      // Prepare partner data for API
      const requestData = {
        ...partnerData,
        dateOfBirth: formatDateForAPI(partnerData.dateOfBirth),
        joiningDate: formatDateForAPI(partnerData.joiningDate)
      };

      const response = await apiRequest(`/admin/channel-partners/${id}`, {
        method: 'PUT',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      console.error('Error updating channel partner:', error);
      throw error;
    }
  }

  // Delete channel partner
  async deleteChannelPartner(id) {
    try {
      const response = await apiRequest(`/admin/channel-partners/${id}`, { method: 'DELETE' });
      return response;
    } catch (error) {
      console.error('Error deleting channel partner:', error);
      throw error;
    }
  }

  // Get channel partner statistics
  async getChannelPartnerStatistics() {
    try {
      const response = await apiRequest(`/admin/channel-partners/statistics`, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Error fetching channel partner statistics:', error);
      throw error;
    }
  }

  // Helper method to format channel partner data for display
  formatChannelPartnerForDisplay(partner) {
    return {
      id: partner._id,
      name: partner.name,
      email: partner.email,
      phone: partner.phoneNumber,
      phoneNumber: partner.phoneNumber,
      role: partner.role,
      status: partner.isActive ? 'active' : 'inactive',
      joiningDate: partner.joiningDate || partner.createdAt,
      lastLogin: partner.lastLogin,
      avatar: this.generateAvatar(partner.name),
      userType: 'channel-partner',
      dateOfBirth: partner.dateOfBirth,
      gender: partner.gender,
      document: partner.document,
      companyName: partner.companyName,
      address: partner.address,
      totalRevenue: partner.totalRevenue || 0
    };
  }

  // Generate avatar initials from name
  generateAvatar(name) {
    if (!name) return 'CP';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  // Validate channel partner data before submission
  validateChannelPartnerData(partnerData, isEdit = false) {
    const errors = [];

    // Required fields validation
    if (!partnerData.name?.trim()) {
      errors.push('Name is required');
    }
    if (!partnerData.phoneNumber?.trim()) {
      errors.push('Phone number is required');
    }
    // Validate phone number format (10 digits)
    if (partnerData.phoneNumber && !/^[6-9]\d{9}$/.test(partnerData.phoneNumber.replace(/\D/g, ''))) {
      errors.push('Please enter a valid 10-digit Indian mobile number');
    }
    if (!partnerData.dateOfBirth) {
      errors.push('Date of birth is required');
    }
    if (!partnerData.joiningDate) {
      errors.push('Joining date is required');
    }

    // Email validation (optional but must be valid if provided)
    if (partnerData.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(partnerData.email)) {
      errors.push('Please enter a valid email address');
    }

    return errors;
  }

  // Get status options
  getStatusOptions() {
    return [
      { value: 'active', label: 'Active', icon: 'CheckCircle' },
      { value: 'inactive', label: 'Inactive', icon: 'AlertCircle' }
    ];
  }
}

export const adminChannelPartnerService = new AdminChannelPartnerService();
export default adminChannelPartnerService;
