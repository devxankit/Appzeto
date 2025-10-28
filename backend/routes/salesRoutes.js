const express = require('express');
const {
  loginSales,
  getSalesProfile,
  logoutSales,
  createDemoSales,
  createLeadBySales,
  getLeadCategories
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

// Future Sales-specific routes can be added here
// router.get('/leads', getSalesLeads);
// router.get('/clients', getSalesClients);
// router.get('/targets', getSalesTargets);

module.exports = router;
