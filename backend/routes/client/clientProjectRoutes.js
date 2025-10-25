const express = require('express');
const {
  getClientProjects,
  getClientProjectById,
  getClientProjectMilestones,
  getClientProjectStatistics
} = require('../../controllers/client/clientProjectController');
const { protect, authorize } = require('../../middlewares/auth');

const router = express.Router();

// All routes are protected and client-only
router.use(protect);
router.use(authorize('client'));

// Client project routes
router.get('/', getClientProjects);
router.get('/statistics', getClientProjectStatistics);
router.get('/:id', getClientProjectById);
router.get('/:id/milestones', getClientProjectMilestones);

module.exports = router;
