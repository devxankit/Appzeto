import { apiRequest, tokenUtils, cpStorage } from './baseApiService';

export const cpAuthService = {
  // Send OTP to phone number
  sendOTP: async (phoneNumber) => {
    try {
      const response = await apiRequest('/channel-partner/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber })
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Verify OTP and login
  verifyOTP: async (phoneNumber, otp) => {
    try {
      const response = await apiRequest('/channel-partner/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber, otp })
      });

      if (response.data && response.token) {
        tokenUtils.set(response.token);
        cpStorage.set(response.data);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Resend OTP
  resendOTP: async (phoneNumber) => {
    try {
      const response = await apiRequest('/channel-partner/resend-otp', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber })
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get channel partner profile
  getProfile: async () => {
    try {
      const response = await apiRequest('/channel-partner/profile', {
        method: 'GET'
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update channel partner profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiRequest('/channel-partner/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout channel partner
  logout: async () => {
    try {
      const response = await apiRequest('/channel-partner/logout', {
        method: 'POST'
      });
      cpStorage.clear();
      return response;
    } catch (error) {
      cpStorage.clear();
      throw error;
    }
  },

  // Authentication utilities
  isAuthenticated: () => tokenUtils.isAuthenticated(),
  getStoredCPData: () => cpStorage.get(),
  clearCPData: () => cpStorage.clear(),
};

// Export individual functions for convenience
export const {
  sendOTP,
  verifyOTP,
  resendOTP,
  getProfile,
  updateProfile,
  logout: logoutCP,
  isAuthenticated: isCPAuthenticated,
  getStoredCPData,
  clearCPData
} = cpAuthService;

export default cpAuthService;
