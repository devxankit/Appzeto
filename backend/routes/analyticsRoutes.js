const express = require('express');
const {
  getPMDashboardStats,
  getProjectAnalytics,
  getEmployeePerformance,
  getClientProjectStats,
  getProductivityMetrics
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// All routes are protected
router.use(protect);
router.use(authorize('project-manager', 'admin')); // PM and Admin routes

// Analytics routes
router.get('/pm/dashboard', getPMDashboardStats);
router.get('/project/:projectId', getProjectAnalytics);
router.get('/employee/:employeeId', getEmployeePerformance);
router.get('/client/:clientId', getClientProjectStats);
router.get('/productivity', getProductivityMetrics);

module.exports = router;
