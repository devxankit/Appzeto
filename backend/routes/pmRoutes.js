const express = require('express');
const {
  loginPM,
  getPMProfile,
  logoutPM,
  createDemoPM
} = require('../controllers/pmController');

// Import team-related controllers
const {
  getPMTeamMembers,
  getPMClients,
  getPMEmployees,
  getPMTeamStatistics
} = require('../controllers/pmTeamController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/login', loginPM);
router.post('/create-demo', createDemoPM); // Remove in production

// Protected routes
router.use(protect); // All routes below this middleware are protected
router.use(authorize('pm')); // All routes below this middleware are PM-only

router.get('/profile', getPMProfile);
router.post('/logout', logoutPM);

// PM team management routes
router.get('/team/employees', getPMEmployees);
router.get('/team/clients', getPMClients);
router.get('/team/members', getPMTeamMembers);
router.get('/team/statistics', getPMTeamStatistics);

module.exports = router;
