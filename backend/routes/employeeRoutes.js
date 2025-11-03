const express = require('express');
const {
  loginEmployee,
  getEmployeeProfile,
  logoutEmployee,
  createDemoEmployee
} = require('../controllers/employeeController');
const {
  getPublishedNoticesForEmployee,
  incrementNoticeViews
} = require('../controllers/noticeController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/login', loginEmployee);
router.post('/create-demo', createDemoEmployee); // Remove in production

// Protected routes
router.use(protect); // All routes below this middleware are protected

router.get('/profile', getEmployeeProfile);
router.post('/logout', logoutEmployee);

// Notice board routes
router.get('/notices', getPublishedNoticesForEmployee);
router.post('/notices/:id/view', incrementNoticeViews);

// Future Employee-specific routes can be added here
// router.get('/projects', getEmployeeProjects);
// router.get('/tasks', getEmployeeTasks);
// router.get('/performance', getEmployeePerformance);

module.exports = router;
