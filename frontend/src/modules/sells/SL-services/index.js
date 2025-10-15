// Sales Services Index - Centralized exports
// This file provides a clean way to import all Sales services

// Sales Authentication Service
export { default as salesAuthService } from './salesAuthService';

// Base API Service (for internal use)
export { default as baseApiService } from './baseApiService';

// Re-export commonly used functions from Sales auth service
export {
  loginSales,
  logoutSales,
  getSalesProfile,
  createDemoSales,
  isSalesAuthenticated,
  getStoredSalesData,
  storeSalesData,
  clearSalesData
} from './salesAuthService';

// Usage Examples:
// import { salesAuthService } from '../SL-services';
// import { loginSales, isSalesAuthenticated } from '../SL-services';
// import salesAuthService from '../SL-services/salesAuthService';
