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

// Apply authentication and authorization to all routes
router.use(protect);
router.use(authorize('admin', 'hr'));

// @route   GET /api/admin/users/statistics
// @desc    Get user statistics
// @access  Private (Admin/HR only)
router.get('/statistics', getUserStatistics);

// @route   GET /api/admin/users
// @desc    Get all users with filtering and pagination
// @access  Private (Admin/HR only)
router.get('/', getAllUsers);

// @route   GET /api/admin/users/:userType/:id
// @desc    Get single user by ID and type
// @access  Private (Admin/HR only)
router.get('/:userType/:id', getUser);

// @route   POST /api/admin/users
// @desc    Create new user
// @access  Private (Admin/HR only)
router.post('/', createUser);

// @route   PUT /api/admin/users/:userType/:id
// @desc    Update user
// @access  Private (Admin/HR only)
router.put('/:userType/:id', updateUser);

// @route   DELETE /api/admin/users/:userType/:id
// @desc    Delete user
// @access  Private (Admin/HR only)
router.delete('/:userType/:id', deleteUser);

module.exports = router;
