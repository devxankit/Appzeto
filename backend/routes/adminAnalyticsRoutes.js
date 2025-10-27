const express = require('express');
const {
  getAdminDashboardStats,
  getSystemAnalytics
} = require('../controllers/adminAnalyticsController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// All routes are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

// Admin analytics routes
router.get('/dashboard', getAdminDashboardStats);
router.get('/system', getSystemAnalytics);

module.exports = router;
