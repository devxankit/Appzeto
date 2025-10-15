import { apiRequest } from './baseApiService';

// Admin Finance Management Service
export const adminFinanceService = {
  // Get financial overview
  getFinancialOverview: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/admin/finance/overview?${queryString}` : '/admin/finance/overview';
      
      const response = await apiRequest(url, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get transactions
  getTransactions: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/admin/finance/transactions?${queryString}` : '/admin/finance/transactions';
      
      const response = await apiRequest(url, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get revenue reports
  getRevenueReports: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/admin/finance/revenue?${queryString}` : '/admin/finance/revenue';
      
      const response = await apiRequest(url, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get expense reports
  getExpenseReports: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/admin/finance/expenses?${queryString}` : '/admin/finance/expenses';
      
      const response = await apiRequest(url, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create transaction
  createTransaction: async (transactionData) => {
    try {
      const response = await apiRequest('/admin/finance/transactions', {
        method: 'POST',
        body: JSON.stringify(transactionData)
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update transaction
  updateTransaction: async (transactionId, transactionData) => {
    try {
      const response = await apiRequest(`/admin/finance/transactions/${transactionId}`, {
        method: 'PUT',
        body: JSON.stringify(transactionData)
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete transaction
  deleteTransaction: async (transactionId) => {
    try {
      const response = await apiRequest(`/admin/finance/transactions/${transactionId}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default adminFinanceService;
