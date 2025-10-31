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
const adminUserRoutes = require('./routes/adminUserRoutes');
const pmRoutes = require('./routes/pmRoutes');
const salesRoutes = require('./routes/salesRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const clientRoutes = require('./routes/clientRoutes');

// Import new PM module routes
const projectRoutes = require('./routes/projectRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');
const taskRoutes = require('./routes/taskRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Import role-specific routes
const adminProjectRoutes = require('./routes/adminProjectRoutes');
const adminAnalyticsRoutes = require('./routes/adminAnalyticsRoutes');
const adminSalesRoutes = require('./routes/adminSalesRoutes');
const adminFinanceRoutes = require('./routes/adminFinanceRoutes');
const employeeProjectRoutes = require('./routes/employeeProjectRoutes');
const employeeTaskRoutes = require('./routes/employeeTaskRoutes');
const employeeAnalyticsRoutes = require('./routes/employeeAnalyticsRoutes');
const employeeMilestoneRoutes = require('./routes/employeeMilestoneRoutes');
const clientProjectRoutes = require('./routes/clientProjectRoutes');
const clientPaymentRoutes = require('./routes/clientPaymentRoutes');

// Import socket service
const socketService = require('./services/socketService');

// Import daily points scheduler
const { startDailyScheduler } = require('./services/dailyPointsScheduler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN || 'http://localhost:3000',
    'http://localhost:5173', // Vite default port
    'http://localhost:5174', // Vite alternative port
    'http://localhost:5175', // Vite alternative port
    'http://localhost:5176', // Vite alternative port
    'http://localhost:5177', // Vite alternative port
    'http://localhost:5178', // Vite alternative port
    'http://localhost:5179', // Vite alternative port
    'http://localhost:5180', // Vite alternative port
    'http://localhost:5181', // Vite alternative port
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

// Server status route with WebSocket info
app.get('/status', (req, res) => {
  const connectedUsers = socketService.getConnectedUsersCount();
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    server: {
      status: 'RUNNING',
      uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
      memory: {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
      }
    },
    websocket: {
      status: socketService.io ? 'ACTIVE' : 'INACTIVE',
      connectedUsers: connectedUsers,
      activeRooms: socketService.io?.sockets.adapter.rooms.size || 0
    },
    database: {
      status: 'CONNECTED',
      host: process.env.MONGODB_URI ? 'Connected' : 'Not configured'
    },
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/pm', pmRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/client', clientRoutes);

// PM Module API routes (PM-only)
app.use('/api/projects', projectRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Role-specific API routes
// Admin routes
app.use('/api/admin/projects', adminProjectRoutes);
app.use('/api/admin/analytics', adminAnalyticsRoutes);
app.use('/api/admin/sales', adminSalesRoutes);
app.use('/api/admin/finance', adminFinanceRoutes);

// Employee routes
app.use('/api/employee/projects', employeeProjectRoutes);
app.use('/api/employee/tasks', employeeTaskRoutes);
app.use('/api/employee/analytics', employeeAnalyticsRoutes);
app.use('/api/employee/milestones', employeeMilestoneRoutes);

// Client routes
app.use('/api/client/projects', clientProjectRoutes);
app.use('/api/client/payments', clientPaymentRoutes);

// API routes documentation
app.get('/api', (req, res) => {
  res.json({
    message: 'Appzeto Backend API Documentation',
    version: '1.0.0',
    availableRoutes: {
      authentication: [
        'POST /api/admin/login',
        'GET /api/admin/profile',
        'POST /api/admin/logout',
        'POST /api/pm/login',
        'GET /api/pm/profile',
        'POST /api/pm/logout',
        'POST /api/sales/login',
        'GET /api/sales/profile',
        'POST /api/sales/logout',
        'POST /api/employee/login',
        'GET /api/employee/profile',
        'POST /api/employee/logout',
        'POST /api/client/send-otp',
        'POST /api/client/verify-otp',
        'GET /api/client/profile',
        'POST /api/client/logout'
      ],
      admin: [
        'GET /api/admin/users/statistics',
        'GET /api/admin/users',
        'GET /api/admin/users/:userType/:id',
        'POST /api/admin/users',
        'PUT /api/admin/users/:userType/:id',
        'DELETE /api/admin/users/:userType/:id',
        'GET /api/admin/projects',
        'GET /api/admin/projects/:id',
        'POST /api/admin/projects',
        'PUT /api/admin/projects/:id',
        'DELETE /api/admin/projects/:id',
        'GET /api/admin/projects/statistics',
        'GET /api/admin/analytics/dashboard',
        'GET /api/admin/analytics/system',
        'POST /api/admin/sales/leads',
        'POST /api/admin/sales/leads/bulk',
        'GET /api/admin/sales/leads',
        'GET /api/admin/sales/leads/:id',
        'PUT /api/admin/sales/leads/:id',
        'DELETE /api/admin/sales/leads/:id',
        'GET /api/admin/sales/leads/statistics',
        'POST /api/admin/sales/categories',
        'GET /api/admin/sales/categories',
        'GET /api/admin/sales/categories/:id',
        'PUT /api/admin/sales/categories/:id',
        'DELETE /api/admin/sales/categories/:id',
        'GET /api/admin/sales/categories/performance',
        'GET /api/admin/sales/team',
        'GET /api/admin/sales/team/:id',
        'PUT /api/admin/sales/team/:id/target',
        'POST /api/admin/sales/team/:id/distribute-leads',
        'GET /api/admin/sales/team/:id/leads',
        'GET /api/admin/sales/team/:id/leads/category/:categoryId',
        'POST /api/admin/sales/team/:id/incentive',
        'GET /api/admin/sales/team/:id/incentives',
        'PUT /api/admin/sales/team/:id/incentive/:incentiveId',
        'GET /api/admin/sales/overview',
        'GET /api/admin/sales/analytics/categories',
        'GET /api/admin/sales/analytics/team'
      ],
      projects: [
        'POST /api/projects (PM only)',
        'GET /api/projects (PM only)',
        'GET /api/projects/:id (PM only)',
        'PUT /api/projects/:id (PM only)',
        'DELETE /api/projects/:id (PM only)',
        'GET /api/projects/client/:clientId (PM only)',
        'GET /api/projects/pm/:pmId (PM only)',
        'GET /api/projects/statistics (PM only)',
        'POST /api/projects/:id/attachments (PM only)',
        'DELETE /api/projects/:id/attachments/:attachmentId (PM only)'
      ],
      milestones: [
        'POST /api/milestones',
        'GET /api/milestones/project/:projectId',
        'GET /api/milestones/:id',
        'PUT /api/milestones/:id',
        'DELETE /api/milestones/:id',
        'PATCH /api/milestones/:id/progress',
        'POST /api/milestones/:id/attachments',
        'DELETE /api/milestones/:id/attachments/:attachmentId'
      ],
      tasks: [
        'POST /api/tasks',
        'POST /api/tasks/urgent',
        'GET /api/tasks/milestone/:milestoneId',
        'GET /api/tasks/project/:projectId',
        'GET /api/tasks/employee/:employeeId',
        'GET /api/tasks/urgent',
        'GET /api/tasks/:id',
        'PUT /api/tasks/:id',
        'DELETE /api/tasks/:id',
        'PATCH /api/tasks/:id/status',
        'PATCH /api/tasks/:id/assign',
        'POST /api/tasks/:id/comments',
        'POST /api/tasks/:id/attachments',
        'DELETE /api/tasks/:id/attachments/:attachmentId'
      ],
      payments: [
        'POST /api/payments',
        'GET /api/payments/project/:projectId',
        'GET /api/payments/client/:clientId',
        'PUT /api/payments/:id',
        'GET /api/payments/statistics',
        'GET /api/payments/project/:projectId/statistics',
        'GET /api/payments/client/:clientId/statistics'
      ],
      analytics: [
        'GET /api/analytics/pm/dashboard',
        'GET /api/analytics/project/:projectId',
        'GET /api/analytics/employee/:employeeId',
        'GET /api/analytics/client/:clientId',
        'GET /api/analytics/productivity'
      ],
      employee: [
        'GET /api/employee/projects (Employee only)',
        'GET /api/employee/projects/:id (Employee only)',
        'GET /api/employee/projects/:id/milestones (Employee only)',
        'GET /api/employee/projects/statistics (Employee only)',
        'GET /api/employee/tasks (Employee only)',
        'GET /api/employee/tasks/:id (Employee only)',
        'PATCH /api/employee/tasks/:id/status (Employee only)',
        'POST /api/employee/tasks/:id/comments (Employee only)',
        'GET /api/employee/tasks/urgent (Employee only)',
        'GET /api/employee/tasks/statistics (Employee only)'
      ],
      client: [
        'GET /api/client/projects (Client only)',
        'GET /api/client/projects/:id (Client only)',
        'GET /api/client/projects/:id/milestones (Client only)',
        'GET /api/client/projects/statistics (Client only)',
        'GET /api/client/payments (Client only)',
        'GET /api/client/payments/:id (Client only)',
        'GET /api/client/payments/statistics (Client only)'
      ]
    },
    websocket: {
      connection: 'Socket.io connection with JWT authentication',
      rooms: [
        'project_{projectId}',
        'milestone_{milestoneId}',
        'task_{taskId}',
        'user_{userId}'
      ],
      events: [
        'join_project',
        'leave_project',
        'join_milestone',
        'leave_milestone',
        'join_task',
        'leave_task',
        'project_updated',
        'milestone_updated',
        'task_updated',
        'task_status_changed',
        'comment_added'
      ]
    }
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
  console.error('Error occurred:', err);
  console.error('Error stack:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 ? 'Something went wrong!' : 'Request failed',
    message: process.env.NODE_ENV === 'development' ? message : (statusCode === 500 ? 'Internal server error' : message)
  });
});

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server
    const server = app.listen(PORT, () => {
      // Clear console for clean startup
      console.clear();
      
      // Beautiful server startup display
      console.log('\n');
      console.log('🚀 ' + '='.repeat(60));
      console.log('   🎯 APPZETO BACKEND SERVER - PROJECT MANAGEMENT SYSTEM');
      console.log('🚀 ' + '='.repeat(60));
      console.log('');
      console.log('📊 SERVER STATUS:');
      console.log('   ✅ Server Status: RUNNING');
      console.log('   ✅ Database: CONNECTED');
      console.log('   ✅ WebSocket: INITIALIZING...');
      console.log('');
      console.log('🔧 CONFIGURATION:');
      console.log(`   🌐 Port: ${PORT}`);
      console.log(`   🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   🔗 API Base URL: http://localhost:${PORT}`);
      console.log(`   ❤️  Health Check: http://localhost:${PORT}/health`);
      console.log(`   📊 Server Status: http://localhost:${PORT}/status`);
      console.log('');
      console.log('📡 AVAILABLE MODULES:');
      console.log('   👤 Admin Management    🔐 Authentication');
      console.log('   📋 Project Management  🎯 Task Management');
      console.log('   📊 Analytics & Stats   💰 Payment Tracking');
      console.log('   👥 Team Management     📁 File Uploads');
      console.log('   🔄 Real-time Updates   📱 WebSocket Integration');
      console.log('');
      console.log('🚀 ' + '='.repeat(60));
      console.log('   🎉 Server started successfully! Ready for connections.');
      console.log('🚀 ' + '='.repeat(60));
      console.log('');
    });

    // Initialize Socket.io with enhanced logging
    socketService.initialize(server);

    // Start daily points scheduler
    startDailyScheduler();

    // Graceful shutdown handling
    process.on('SIGINT', () => {
      console.log('\n');
      console.log('🛑 ' + '='.repeat(50));
      console.log('   ⚠️  Received SIGINT (Ctrl+C)');
      console.log('   🔄 Shutting down gracefully...');
      console.log('🛑 ' + '='.repeat(50));
      server.close(() => {
        console.log('   ✅ Server closed successfully');
        console.log('   👋 Goodbye!');
        process.exit(0);
      });
    });

    process.on('SIGTERM', () => {
      console.log('\n');
      console.log('🛑 ' + '='.repeat(50));
      console.log('   ⚠️  Received SIGTERM');
      console.log('   🔄 Shutting down gracefully...');
      console.log('🛑 ' + '='.repeat(50));
      server.close(() => {
        console.log('   ✅ Server closed successfully');
        console.log('   👋 Goodbye!');
        process.exit(0);
      });
    });

  } catch (error) {
    console.log('\n');
    console.log('❌ ' + '='.repeat(50));
    console.log('   🚨 FAILED TO START SERVER');
    console.log('❌ ' + '='.repeat(50));
    console.error('   Error:', error.message);
    console.log('   🔧 Please check your configuration and try again.');
    console.log('❌ ' + '='.repeat(50));
    process.exit(1);
  }
};

// Start the application
startServer();

module.exports = app;
