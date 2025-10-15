const express = require('express');
const {
  loginSales,
  getSalesProfile,
  logoutSales,
  createDemoSales
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

// Future Sales-specific routes can be added here
// router.get('/leads', getSalesLeads);
// router.get('/clients', getSalesClients);
// router.get('/targets', getSalesTargets);

module.exports = router;
