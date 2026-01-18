const ChannelPartner = require('../models/ChannelPartner');
const CPLead = require('../models/CPLead');
const Client = require('../models/Client');
const { CPWalletTransaction } = require('../models/CPWallet');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get rewards/incentives
// @route   GET /api/cp/rewards
// @access  Private (Channel Partner only)
exports.getRewards = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;
  const { page = 1, limit = 20 } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  // Get all credit transactions (rewards, incentives, commissions)
  const transactions = await CPWalletTransaction.find({
    channelPartner: cpId,
    type: 'credit',
    transactionType: { $in: ['reward', 'incentive', 'commission'] }
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await CPWalletTransaction.countDocuments({
    channelPartner: cpId,
    type: 'credit',
    transactionType: { $in: ['reward', 'incentive', 'commission'] }
  });

  res.status(200).json({
    success: true,
    count: transactions.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: transactions
  });
});

// @desc    Get incentives earned
// @route   GET /api/cp/rewards/incentives
// @access  Private (Channel Partner only)
exports.getIncentives = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;

  // Get incentive transactions
  const incentives = await CPWalletTransaction.find({
    channelPartner: cpId,
    type: 'credit',
    transactionType: 'incentive'
  })
    .sort({ createdAt: -1 });

  const totalIncentives = incentives.reduce((sum, inv) => sum + inv.amount, 0);

  res.status(200).json({
    success: true,
    count: incentives.length,
    total: totalIncentives,
    data: incentives
  });
});

// @desc    Get performance metrics
// @route   GET /api/cp/rewards/performance
// @access  Private (Channel Partner only)
exports.getPerformanceMetrics = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;

  // Get lead statistics
  const totalLeads = await CPLead.countDocuments({ assignedTo: cpId });
  const convertedLeads = await CPLead.countDocuments({
    assignedTo: cpId,
    status: 'converted'
  });
  const activeLeads = await CPLead.countDocuments({
    assignedTo: cpId,
    status: { $in: ['new', 'connected', 'followup'] }
  });

  // Get client statistics
  const totalClients = await Client.countDocuments({
    createdBy: cpId,
    creatorModel: 'ChannelPartner'
  });

  // Get revenue
  const cp = await ChannelPartner.findById(cpId);
  const totalRevenue = cp?.totalRevenue || 0;

  // Get conversion rate
  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

  // Get earnings breakdown
  const earnings = await CPWalletTransaction.aggregate([
    {
      $match: {
        channelPartner: cpId,
        type: 'credit'
      }
    },
    {
      $group: {
        _id: '$transactionType',
        total: { $sum: '$amount' }
      }
    }
  ]);

  const earningsBreakdown = earnings.reduce((acc, item) => {
    acc[item._id] = item.total;
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    data: {
      leads: {
        total: totalLeads,
        converted: convertedLeads,
        active: activeLeads,
        conversionRate: parseFloat(conversionRate.toFixed(2))
      },
      clients: {
        total: totalClients
      },
      revenue: {
        total: totalRevenue
      },
      earnings: earningsBreakdown
    }
  });
});
