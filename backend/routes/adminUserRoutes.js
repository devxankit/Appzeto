const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStatistics
} = require('../controllers/adminUserController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const { uploadAttendance, getAttendance } = require('../controllers/adminAttendanceController');
const {
  setEmployeeSalary,
  getSalaryRecords,
  getSalaryRecord,
  updateSalaryRecord,
  generateMonthlySalaries,
  getEmployeeSalaryHistory,
  deleteSalaryRecord
} = require('../controllers/adminSalaryController');

// Apply authentication and authorization to all routes
router.use(protect);
router.use(authorize('admin', 'hr'));

// @route   GET /api/admin/users/statistics
// @desc    Get user statistics
// @access  Private (Admin/HR only)
router.get('/statistics', getUserStatistics);

// IMPORTANT: All specific routes (attendance, salary) must come BEFORE generic routes (/:userType/:id)
// Otherwise, Express will match /salary/:id as /:userType/:id where userType="salary"

// Attendance (Admin/HR) - Must come before generic routes
router.post('/attendance/upload', upload.single('file'), uploadAttendance);
router.get('/attendance', getAttendance);

// Salary Management (Admin/HR) - Must come before generic routes
router.post('/salary/generate/:month', generateMonthlySalaries);
router.get('/salary/generate/:month', generateMonthlySalaries);
router.get('/salary/employee/:userType/:employeeId', getEmployeeSalaryHistory);
router.put('/salary/set/:userType/:employeeId', setEmployeeSalary);
router.get('/salary/:id', getSalaryRecord);
router.put('/salary/:id', updateSalaryRecord);
router.delete('/salary/:id', deleteSalaryRecord);
router.get('/salary', getSalaryRecords);

// Generic user routes (must come after all specific routes)
// @route   GET /api/admin/users
// @desc    Get all users with filtering and pagination
// @access  Private (Admin/HR only)
router.get('/', getAllUsers);

// @route   POST /api/admin/users
// @desc    Create new user
// @access  Private (Admin/HR only)
router.post('/', createUser);

// @route   GET /api/admin/users/:userType/:id
// @desc    Get single user by ID and type
// @access  Private (Admin/HR only)
router.get('/:userType/:id', getUser);

// @route   PUT /api/admin/users/:userType/:id
// @desc    Update user
// @access  Private (Admin/HR only)
router.put('/:userType/:id', updateUser);

// @route   DELETE /api/admin/users/:userType/:id
// @desc    Delete user
// @access  Private (Admin/HR only)
router.delete('/:userType/:id', deleteUser);

module.exports = router;
