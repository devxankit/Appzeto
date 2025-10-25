const express = require('express');
const {
  getEmployeeTasks,
  getEmployeeTaskById,
  updateEmployeeTaskStatus,
  addEmployeeTaskComment,
  getEmployeeUrgentTasks,
  getEmployeeTaskStatistics
} = require('../../controllers/employee/employeeTaskController');
const { protect, authorize } = require('../../middlewares/auth');

const router = express.Router();

// All routes are protected and employee-only
router.use(protect);
router.use(authorize('employee'));

// Employee task routes
router.get('/', getEmployeeTasks);
router.get('/urgent', getEmployeeUrgentTasks);
router.get('/statistics', getEmployeeTaskStatistics);
router.get('/:id', getEmployeeTaskById);
router.patch('/:id/status', updateEmployeeTaskStatus);
router.post('/:id/comments', addEmployeeTaskComment);

module.exports = router;
