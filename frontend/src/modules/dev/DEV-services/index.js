// DEV Services Index - Centralized exports
// This file provides a clean way to import all DEV services

// PM Authentication Service
export { default as pmAuthService } from './pmAuthService';

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

// Usage Examples:
// import { pmAuthService } from '../DEV-services';
// import { loginPM, isPMAuthenticated } from '../DEV-services';
// import pmAuthService from '../DEV-services/pmAuthService';
