const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
} = require('../controllers/adminFinanceController');
const { protect, authorize } = require('../middlewares/auth');

// Apply authentication and admin authorization to all routes
router.use(protect);
router.use(authorize('admin'));

// Transaction routes
router.route('/transactions')
  .post(createTransaction)
  .get(getTransactions);

router.route('/transactions/stats')
  .get(getTransactionStats);

router.route('/transactions/:id')
  .get(getTransaction)
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;

