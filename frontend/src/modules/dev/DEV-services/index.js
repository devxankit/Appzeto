// DEV Services Index - Centralized exports
// This file provides a clean way to import all DEV services

// PM Authentication Service
export { default as pmAuthService } from './pmAuthService';

// Employee Authentication Service
export { default as employeeAuthService } from './employeeAuthService';

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

// Usage Examples:
// import { pmAuthService, employeeAuthService } from '../DEV-services';
// import { loginPM, loginEmployee, isPMAuthenticated, isEmployeeAuthenticated } from '../DEV-services';
// import pmAuthService from '../DEV-services/pmAuthService';
// import employeeAuthService from '../DEV-services/employeeAuthService';
