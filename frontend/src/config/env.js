// Environment configuration
export const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Appzeto',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  
  // URLs
  APP_URL: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
  
  // Feature flags (if needed)
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  
  // Other configurations
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Appzeto - Complete Business Management System'
};

// Helper function to get API URL
export const getApiUrl = (endpoint = '') => {
  return `${config.API_BASE_URL}${endpoint}`;
};

// Helper function to check if development mode
export const isDevelopment = () => {
  return config.NODE_ENV === 'development';
};

// Helper function to check if production mode
export const isProduction = () => {
  return config.NODE_ENV === 'production';
};

export default config;
