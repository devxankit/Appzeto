const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const Project = require('../models/Project');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

const toObjectId = (value) => {
  if (!value) return null;
  try {
    return new mongoose.Types.ObjectId(value);
  } catch (error) {
    return null;
  }
};

// @desc    Get wallet summary for the authenticated client
// @route   GET /api/client/wallet/summary
// @access  Client only
const getWalletSummary = asyncHandler(async (req, res, next) => {
  const clientId = req.client?.id || req.user?.id;
  const clientObjectId = toObjectId(clientId);

  if (!clientObjectId) {
    return next(new ErrorResponse('Client context not found', 401));
  }

  // Aggregate payment totals by status for the client
  const paymentStats = await Payment.aggregate([
    { $match: { client: clientObjectId } },
    {
      $group: {
        _id: '$status',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  // Aggregate payments per project (paid vs pending) to help build per-project view
  const projectPaymentStats = await Payment.aggregate([
    { $match: { client: clientObjectId } },
    {
      $group: {
        _id: '$project',
        paidAmount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0]
          }
        },
        pendingAmount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0]
          }
        },
        refundedAmount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'refunded'] }, '$amount', 0]
          }
        }
      }
    }
  ]);

  const paymentTotals = paymentStats.reduce(
    (acc, stat) => {
      acc.total += stat.totalAmount || 0;
      if (stat._id === 'completed') acc.paid += stat.totalAmount || 0;
      if (stat._id === 'pending') acc.pending += stat.totalAmount || 0;
      if (stat._id === 'failed') acc.failed += stat.totalAmount || 0;
      if (stat._id === 'refunded') acc.refunded += stat.totalAmount || 0;
      return acc;
    },
    { total: 0, paid: 0, pending: 0, failed: 0, refunded: 0 }
  );

  // Fetch projects for the client with minimal fields
  const projects = await Project.find({ client: clientObjectId })
    .select(
      'name status dueDate progress financialDetails.totalCost financialDetails.remainingAmount financialDetails.advanceReceived'
    )
    .lean();

  const paymentStatsByProject = projectPaymentStats.reduce((map, stat) => {
    if (!stat._id) return map;
    map.set(stat._id.toString(), {
      paidAmount: stat.paidAmount || 0,
      pendingAmount: stat.pendingAmount || 0,
      refundedAmount: stat.refundedAmount || 0
    });
    return map;
  }, new Map());

  const projectSummaries = projects.map((project) => {
    const key = project._id.toString();
    const stats = paymentStatsByProject.get(key) || {
      paidAmount: 0,
      pendingAmount: 0,
      refundedAmount: 0
    };

    const totalCost = project.financialDetails?.totalCost || 0;
    const remainingAmount =
      project.financialDetails?.remainingAmount ??
      Math.max(totalCost - stats.paidAmount, 0);

    return {
      id: project._id,
      name: project.name,
      status: project.status,
      dueDate: project.dueDate,
      progress: project.progress || 0,
      totalCost,
      paidAmount: stats.paidAmount,
      pendingAmount: stats.pendingAmount,
      refundedAmount: stats.refundedAmount,
      remainingAmount
    };
  });

  const totalProjectCost = projectSummaries.reduce(
    (sum, project) => sum + (project.totalCost || 0),
    0
  );

  const currencyDoc = await Payment.findOne({ client: clientObjectId })
    .select('currency')
    .lean();
  const currency = currencyDoc?.currency || 'INR';

  res.status(200).json({
    success: true,
    data: {
      summary: {
        currency,
        totalCost: totalProjectCost,
        totalPaid: paymentTotals.paid,
        totalPending: paymentTotals.pending,
        totalRefunded: paymentTotals.refunded,
        totalFailed: paymentTotals.failed,
        totalOutstanding: Math.max(totalProjectCost - paymentTotals.paid, 0),
        totalProjects: projectSummaries.length
      },
      projects: projectSummaries
    }
  });
});

// @desc    Get wallet transactions for the authenticated client
// @route   GET /api/client/wallet/transactions
// @access  Client only
const getWalletTransactions = asyncHandler(async (req, res, next) => {
  const clientId = req.client?.id || req.user?.id;
  const clientObjectId = toObjectId(clientId);

  if (!clientObjectId) {
    return next(new ErrorResponse('Client context not found', 401));
  }

  const { page = 1, limit = 20, status, paymentType } = req.query;

  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const skip = (parsedPage - 1) * parsedLimit;

  const filter = { client: clientObjectId };
  if (status) {
    filter.status = status;
  }
  if (paymentType) {
    filter.paymentType = paymentType;
  }

  const [transactions, total] = await Promise.all([
    Payment.find(filter)
      .populate('project', 'name status')
      .populate('milestone', 'title dueDate status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean(),
    Payment.countDocuments(filter)
  ]);

  const mappedTransactions = transactions.map((payment) => ({
    id: payment._id,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    paymentType: payment.paymentType,
    transactionId: payment.transactionId,
    paidAt: payment.paidAt,
    createdAt: payment.createdAt,
    project: payment.project
      ? { id: payment.project._id, name: payment.project.name, status: payment.project.status }
      : null,
    milestone: payment.milestone
      ? {
          id: payment.milestone._id,
          title: payment.milestone.title,
          dueDate: payment.milestone.dueDate,
          status: payment.milestone.status
        }
      : null,
    notes: payment.notes || null
  }));

  res.status(200).json({
    success: true,
    data: mappedTransactions,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      pages: Math.ceil(total / parsedLimit)
    }
  });
});

// @desc    Get upcoming payments (pending) for the authenticated client
// @route   GET /api/client/wallet/upcoming
// @access  Client only
const getUpcomingPayments = asyncHandler(async (req, res, next) => {
  const clientId = req.client?.id || req.user?.id;
  const clientObjectId = toObjectId(clientId);

  if (!clientObjectId) {
    return next(new ErrorResponse('Client context not found', 401));
  }

  const { limit = 10 } = req.query;
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

  const pendingPayments = await Payment.find({
    client: clientObjectId,
    status: 'pending'
  })
    .populate('project', 'name status')
    .populate('milestone', 'title dueDate status')
    .sort({ createdAt: -1 })
    .limit(parsedLimit)
    .lean();

  const upcoming = pendingPayments.map((payment) => ({
    id: payment._id,
    project: payment.project
      ? { id: payment.project._id, name: payment.project.name, status: payment.project.status }
      : null,
    milestone: payment.milestone
      ? {
          id: payment.milestone._id,
          title: payment.milestone.title,
          dueDate: payment.milestone.dueDate,
          status: payment.milestone.status
        }
      : null,
    amount: payment.amount,
    currency: payment.currency,
    paymentType: payment.paymentType,
    createdAt: payment.createdAt,
    dueDate: payment.milestone?.dueDate || null
  }));

  res.status(200).json({
    success: true,
    data: upcoming
  });
});

module.exports = {
  getWalletSummary,
  getWalletTransactions,
  getUpcomingPayments
};

