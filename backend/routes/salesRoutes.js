const express = require('express');
const {
  loginSales,
  getSalesProfile,
  logoutSales,
  createDemoSales,
  createLeadBySales,
  getLeadCategories,
  getSalesDashboardStats,
  getMyLeads,
  getLeadsByStatus,
  getLeadDetail,
  updateLeadStatus,
  createLeadProfile,
  updateLeadProfile,
  convertLeadToClient,
  getSalesTeam,
  requestDemo,
  transferLead,
  addNoteToLead
} = require('../controllers/salesController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/login', loginSales);
router.post('/create-demo', createDemoSales); // Remove in production

// Protected routes
router.use(protect); // All routes below this middleware are protected

router.get('/profile', getSalesProfile);
router.post('/logout', logoutSales);

// Lead management routes
router.post('/leads', createLeadBySales);
router.get('/lead-categories', getLeadCategories);

// Dashboard & Statistics
router.get('/dashboard/statistics', getSalesDashboardStats);

// Lead Management
router.get('/leads', getMyLeads);
router.get('/leads/status/:status', getLeadsByStatus);
router.get('/leads/:id', getLeadDetail);
router.patch('/leads/:id/status', updateLeadStatus);

// LeadProfile Management
router.post('/leads/:id/profile', createLeadProfile);
router.put('/leads/:id/profile', updateLeadProfile);

// Lead Conversion
router.post('/leads/:id/convert', convertLeadToClient);

// Team Management
router.get('/team', getSalesTeam);

// Lead Actions
router.post('/leads/:id/request-demo', requestDemo);
router.post('/leads/:id/transfer', transferLead);
router.post('/leads/:id/notes', addNoteToLead);

module.exports = router;
