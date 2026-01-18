const { CPWallet, CPWalletTransaction, CPWithdrawalRequest } = require('../models/CPWallet');
const ChannelPartner = require('../models/ChannelPartner');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get wallet summary
// @route   GET /api/cp/wallet/summary
// @access  Private (Channel Partner only)
exports.getWalletSummary = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;

  let wallet = await CPWallet.findOne({ channelPartner: cpId });

  // Create wallet if doesn't exist
  if (!wallet) {
    wallet = await CPWallet.create({
      channelPartner: cpId,
      balance: 0,
      totalEarned: 0,
      totalWithdrawn: 0
    });
  }

  // Get recent transactions (last 5)
  const recentTransactions = await CPWalletTransaction.find({ wallet: wallet._id })
    .sort({ createdAt: -1 })
    .limit(5);

  // Get pending withdrawal requests
  const pendingWithdrawals = await CPWithdrawalRequest.countDocuments({
    channelPartner: cpId,
    status: 'pending'
  });

  res.status(200).json({
    success: true,
    data: {
      wallet,
      recentTransactions,
      pendingWithdrawals
    }
  });
});

// @desc    Get wallet transactions
// @route   GET /api/cp/wallet/transactions
// @access  Private (Channel Partner only)
exports.getTransactions = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;
  const { type, transactionType, page = 1, limit = 20 } = req.query;

  const wallet = await CPWallet.findOne({ channelPartner: cpId });
  if (!wallet) {
    return res.status(200).json({
      success: true,
      count: 0,
      total: 0,
      page: 1,
      pages: 0,
      data: []
    });
  }

  const query = { wallet: wallet._id };
  if (type) query.type = type;
  if (transactionType) query.transactionType = transactionType;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const transactions = await CPWalletTransaction.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await CPWalletTransaction.countDocuments(query);

  res.status(200).json({
    success: true,
    count: transactions.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: transactions
  });
});

// @desc    Create withdrawal request
// @route   POST /api/cp/wallet/withdraw
// @access  Private (Channel Partner only)
exports.createWithdrawalRequest = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;
  const { amount, bankDetails } = req.body;

  if (!amount || amount <= 0) {
    return next(new ErrorResponse('Valid withdrawal amount is required', 400));
  }

  if (!bankDetails || !bankDetails.accountHolderName || !bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.bankName) {
    return next(new ErrorResponse('Complete bank details are required', 400));
  }

  let wallet = await CPWallet.findOne({ channelPartner: cpId });
  if (!wallet) {
    wallet = await CPWallet.create({
      channelPartner: cpId,
      balance: 0,
      totalEarned: 0,
      totalWithdrawn: 0
    });
  }

  if (wallet.balance < amount) {
    return next(new ErrorResponse('Insufficient balance', 400));
  }

  // Create withdrawal request
  const withdrawalRequest = await CPWithdrawalRequest.create({
    channelPartner: cpId,
    wallet: wallet._id,
    amount,
    bankDetails,
    status: 'pending'
  });

  res.status(201).json({
    success: true,
    message: 'Withdrawal request created successfully',
    data: withdrawalRequest
  });
});

// @desc    Get withdrawal history
// @route   GET /api/cp/wallet/withdrawals
// @access  Private (Channel Partner only)
exports.getWithdrawalHistory = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;
  const { status, page = 1, limit = 20 } = req.query;

  const query = { channelPartner: cpId };
  if (status) query.status = status;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const withdrawals = await CPWithdrawalRequest.find(query)
    .populate('processedBy', 'name')
    .populate('transaction')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await CPWithdrawalRequest.countDocuments(query);

  res.status(200).json({
    success: true,
    count: withdrawals.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: withdrawals
  });
});

// @desc    Get earnings breakdown
// @route   GET /api/cp/wallet/earnings
// @access  Private (Channel Partner only)
exports.getEarningsBreakdown = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;
  const { startDate, endDate } = req.query;

  const wallet = await CPWallet.findOne({ channelPartner: cpId });
  if (!wallet) {
    return res.status(200).json({
      success: true,
      data: {
        byType: {},
        byMonth: [],
        total: 0
      }
    });
  }

  const query = {
    wallet: wallet._id,
    type: 'credit'
  };

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  // Earnings by type
  const earningsByType = await CPWalletTransaction.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$transactionType',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  // Earnings by month
  const earningsByMonth = await CPWalletTransaction.aggregate([
    { $match: query },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 }
  ]);

  const byType = earningsByType.reduce((acc, item) => {
    acc[item._id] = {
      total: item.total,
      count: item.count
    };
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    data: {
      byType,
      byMonth: earningsByMonth,
      total: wallet.totalEarned
    }
  });
});
