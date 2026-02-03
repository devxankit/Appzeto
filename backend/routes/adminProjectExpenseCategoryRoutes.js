const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/adminProjectExpenseCategoryController');
const { protect, authorize } = require('../middlewares/auth');

// Apply authentication to all routes
router.use(protect);

// GET routes - accessible to admin and PEM (for dropdown)
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// POST, PUT, DELETE routes - admin only
router.post('/', authorize('admin'), createCategory);
router.put('/:id', authorize('admin'), updateCategory);
router.delete('/:id', authorize('admin'), deleteCategory);

module.exports = router;
