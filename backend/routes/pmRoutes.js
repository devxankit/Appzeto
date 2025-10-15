const express = require('express');
const {
  loginPM,
  getPMProfile,
  logoutPM,
  createDemoPM
} = require('../controllers/pmController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/login', loginPM);
router.post('/create-demo', createDemoPM); // Remove in production

// Protected routes
router.use(protect); // All routes below this middleware are protected

router.get('/profile', getPMProfile);
router.post('/logout', logoutPM);

// Future PM-specific routes can be added here
// router.get('/projects', getPMProjects);
// router.get('/tasks', getPMTasks);
// router.get('/team', getPMTeam);

module.exports = router;
