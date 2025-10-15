const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/db');

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const pmRoutes = require('./routes/pmRoutes');
const salesRoutes = require('./routes/salesRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const clientRoutes = require('./routes/clientRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN || 'http://localhost:3000',
    'http://localhost:5173', // Vite default port
    'http://localhost:3000'  // React default port
  ],
  credentials: true
})); // Enable CORS with credentials
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Appzeto Backend API',
    status: 'Server is running successfully',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/admin', adminRoutes);
app.use('/api/pm', pmRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/client', clientRoutes);

// API routes placeholder
app.get('/api', (req, res) => {
  res.json({
    message: 'API endpoints will be available here',
    availableRoutes: [
      'GET /',
      'GET /health',
      'GET /api',
      'POST /api/admin/login',
      'GET /api/admin/profile',
      'POST /api/admin/logout',
      'POST /api/admin/create-demo',
      'POST /api/pm/login',
      'GET /api/pm/profile',
      'POST /api/pm/logout',
      'POST /api/pm/create-demo',
      'POST /api/sales/login',
      'GET /api/sales/profile',
      'POST /api/sales/logout',
      'POST /api/sales/create-demo',
      'POST /api/employee/login',
      'GET /api/employee/profile',
      'POST /api/employee/logout',
      'POST /api/employee/create-demo',
      'POST /api/client/send-otp',
      'POST /api/client/verify-otp',
      'GET /api/client/profile',
      'POST /api/client/logout',
      'POST /api/client/create-demo'
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log('Appzeto Backend Server');
      console.log('='.repeat(50));
      console.log(`Port: ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`API Base URL: http://localhost:${PORT}`);
      console.log(`Health Check: http://localhost:${PORT}/health`);
      console.log('='.repeat(50));
      console.log('Server started successfully');
    });

    // Graceful shutdown handling
    process.on('SIGINT', () => {
      console.log('\nReceived SIGINT (Ctrl+C). Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed successfully');
        process.exit(0);
      });
    });

    process.on('SIGTERM', () => {
      console.log('\nReceived SIGTERM. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed successfully');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer();

module.exports = app;
