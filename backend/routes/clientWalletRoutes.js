const express = require('express');
const { getWalletSummary, getWalletTransactions, getUpcomingPayments } = require('../controllers/clientWalletController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// All wallet routes require authenticated clients
router.use(protect);
router.use(authorize('client'));

router.get('/summary', getWalletSummary);
router.get('/transactions', getWalletTransactions);
router.get('/upcoming', getUpcomingPayments);

module.exports = router;

