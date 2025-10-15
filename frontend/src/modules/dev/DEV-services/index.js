// DEV Services Index - Centralized exports
// This file provides a clean way to import all DEV services

// PM Authentication Service
export { default as pmAuthService } from './pmAuthService';

// Employee Authentication Service
export { default as employeeAuthService } from './employeeAuthService';

// Client Authentication Service
export { default as clientAuthService } from './clientAuthService';

// Base API Service (for internal use)
export { default as baseApiService } from './baseApiService';

// Re-export commonly used functions from PM auth service
export {
  loginPM,
  logoutPM,
  getPMProfile,
  createDemoPM,
  isPMAuthenticated,
  getStoredPMData,
  storePMData,
  clearPMData
} from './pmAuthService';

// Re-export commonly used functions from Employee auth service
export {
  loginEmployee,
  logoutEmployee,
  getEmployeeProfile,
  createDemoEmployee,
  isEmployeeAuthenticated,
  getStoredEmployeeData,
  storeEmployeeData,
  clearEmployeeData
} from './employeeAuthService';

// Re-export commonly used functions from Client auth service
export {
  sendOTP,
  verifyOTP,
  resendOTP,
  getProfile,
  updateProfile,
  logoutClient,
  createDemoClient,
  checkSMSStatus,
  isClientAuthenticated,
  getStoredClientData,
  clearClientData
} from './clientAuthService';

// Usage Examples:
// import { pmAuthService, employeeAuthService, clientAuthService } from '../DEV-services';
// import { loginPM, loginEmployee, sendOTP, verifyOTP, isPMAuthenticated, isEmployeeAuthenticated, isClientAuthenticated } from '../DEV-services';
// import pmAuthService from '../DEV-services/pmAuthService';
// import employeeAuthService from '../DEV-services/employeeAuthService';
// import clientAuthService from '../DEV-services/clientAuthService';
