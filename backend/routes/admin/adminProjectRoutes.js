const express = require('express');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStatistics
} = require('../../controllers/admin/adminProjectController');
const { protect, authorize } = require('../../middlewares/auth');

const router = express.Router();

// All routes are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

// Admin project routes
router.get('/', getAllProjects);
router.get('/statistics', getProjectStatistics);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
