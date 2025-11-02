// PM2 Ecosystem Configuration
// This file configures PM2 to run the Appzeto Backend application
// 
// Usage:
//   pm2 start ecosystem.config.js
//   pm2 restart Appzeto-Backend
//   pm2 stop Appzeto-Backend
//   pm2 delete Appzeto-Backend
//
// Note: Make sure your .env file exists in the backend directory
// The application will automatically load environment variables from .env file

require('dotenv').config();

module.exports = {
  apps: [{
    name: 'Appzeto-Backend',
    script: './server.js',
    cwd: __dirname,
    instances: 1,
    exec_mode: 'fork',
    
    // Environment variables
    // These will be available to the application
    // The .env file is loaded by dotenv in server.js, but we can also set them here
    env: {
      NODE_ENV: process.env.NODE_ENV || 'production',
      PORT: process.env.PORT || 5000,
      // Add other env vars here if needed, or rely on .env file loading in server.js
      MONGODB_URI: process.env.MONGODB_URI,
      JWT_SECRET: process.env.JWT_SECRET,
      JWT_EXPIRE: process.env.JWT_EXPIRE,
      JWT_EXPIRE_COOKIE: process.env.JWT_EXPIRE_COOKIE,
      CORS_ORIGIN: process.env.CORS_ORIGIN
    },
    
    // Logging
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    time: true,
    merge_logs: true,
    
    // Restart behavior
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000,
    
    // Resource limits
    max_memory_restart: '1G',
    
    // Monitoring
    watch: false, // Set to true for development auto-reload
    
    // Graceful shutdown
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
    
    // Advanced
    ignore_watch: ['node_modules', 'logs', '.git']
  }]
};

