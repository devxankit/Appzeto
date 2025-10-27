const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const Task = require('../models/Task');
const Payment = require('../models/Payment');
const Employee = require('../models/Employee');
const PM = require('../models/PM');
const Client = require('../models/Client');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/analytics/dashboard
// @access  Admin only
const getAdminDashboardStats = asyncHandler(async (req, res, next) => {
  // Get user counts
  const [totalUsers, activeUsers, totalProjects, activeProjects] = await Promise.all([
    // Total users
    Promise.all([
      Employee.countDocuments(),
      PM.countDocuments(),
      Client.countDocuments()
    ]).then(([employees, pms, clients]) => employees + pms + clients),
    
    // Active users
    Promise.all([
      Employee.countDocuments({ isActive: true }),
      PM.countDocuments({ isActive: true }),
      Client.countDocuments({ isActive: true })
    ]).then(([employees, pms, clients]) => employees + pms + clients),
    
    // Total projects
    Project.countDocuments(),
    
    // Active projects
    Project.countDocuments({ status: { $in: ['planning', 'active', 'on-hold', 'testing'] } })
  ]);

  // Get project statistics
  const projectStats = await Project.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalBudget: { $sum: '$budget' },
        avgProgress: { $avg: '$progress' }
      }
    }
  ]);

  // Get task statistics
  const taskStats = await Task.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalEstimatedHours: { $sum: '$estimatedHours' },
        totalActualHours: { $sum: '$actualHours' }
      }
    }
  ]);

  // Get payment statistics
  const paymentStats = await Payment.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  // Get recent activities (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentProjects = await Project.find({
    createdAt: { $gte: sevenDaysAgo }
  })
    .populate('projectManager', 'name')
    .populate('client', 'name company')
    .sort({ createdAt: -1 })
    .limit(5);

  const result = {
    users: {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers
    },
    projects: {
      total: totalProjects,
      active: activeProjects,
      completed: projectStats.find(p => p._id === 'completed')?.count || 0,
      overdue: await Project.countDocuments({
        dueDate: { $lt: new Date() },
        status: { $nin: ['completed', 'cancelled'] }
      })
    },
    tasks: {
      total: taskStats.reduce((sum, stat) => sum + stat.count, 0),
      completed: taskStats.find(t => t._id === 'completed')?.count || 0,
      inProgress: taskStats.find(t => t._id === 'in-progress')?.count || 0,
      overdue: await Task.countDocuments({
        dueDate: { $lt: new Date() },
        status: { $nin: ['completed', 'cancelled'] }
      })
    },
    payments: {
      total: paymentStats.reduce((sum, stat) => sum + stat.count, 0),
      completed: paymentStats.find(p => p._id === 'completed')?.count || 0,
      pending: paymentStats.find(p => p._id === 'pending')?.count || 0,
      totalAmount: paymentStats.reduce((sum, stat) => sum + (stat.totalAmount || 0), 0)
    },
    projectStatusBreakdown: projectStats,
    taskStatusBreakdown: taskStats,
    paymentStatusBreakdown: paymentStats,
    recentProjects
  };

  res.json({
    success: true,
    data: result
  });
});

// @desc    Get system-wide analytics
// @route   GET /api/admin/analytics/system
// @access  Admin only
const getSystemAnalytics = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  
  // Build date filter
  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
    if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
  }

  // Get productivity metrics
  const productivityMetrics = await Task.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: null,
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        totalEstimatedHours: { $sum: '$estimatedHours' },
        totalActualHours: { $sum: '$actualHours' },
        avgCompletionTime: {
          $avg: {
            $cond: [
              { $ne: ['$completedDate', null] },
              { $subtract: ['$completedDate', '$createdAt'] },
              null
            ]
          }
        }
      }
    }
  ]);

  // Get team performance
  const teamPerformance = await Task.aggregate([
    { $match: dateFilter },
    { $unwind: '$assignedTo' },
    {
      $group: {
        _id: '$assignedTo',
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        totalEstimatedHours: { $sum: '$estimatedHours' },
        totalActualHours: { $sum: '$actualHours' }
      }
    },
    {
      $lookup: {
        from: 'employees',
        localField: '_id',
        foreignField: '_id',
        as: 'employee'
      }
    },
    { $unwind: '$employee' },
    {
      $project: {
        _id: 1,
        name: '$employee.name',
        email: '$employee.email',
        department: '$employee.department',
        position: '$employee.position',
        totalTasks: 1,
        completedTasks: 1,
        completionRate: {
          $multiply: [
            { $divide: ['$completedTasks', '$totalTasks'] },
            100
          ]
        },
        totalEstimatedHours: 1,
        totalActualHours: 1,
        efficiency: {
          $cond: [
            { $gt: ['$totalActualHours', 0] },
            { $multiply: [{ $divide: ['$totalEstimatedHours', '$totalActualHours'] }, 100] },
            0
          ]
        }
      }
    },
    { $sort: { completionRate: -1 } }
  ]);

  // Get PM performance
  const pmPerformance = await Project.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$projectManager',
        totalProjects: { $sum: 1 },
        completedProjects: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        avgProgress: { $avg: '$progress' },
        totalBudget: { $sum: '$budget' }
      }
    },
    {
      $lookup: {
        from: 'pms',
        localField: '_id',
        foreignField: '_id',
        as: 'pm'
      }
    },
    { $unwind: '$pm' },
    {
      $project: {
        _id: 1,
        name: '$pm.name',
        email: '$pm.email',
        totalProjects: 1,
        completedProjects: 1,
        completionRate: {
          $multiply: [
            { $divide: ['$completedProjects', '$totalProjects'] },
            100
          ]
        },
        avgProgress: 1,
        totalBudget: 1
      }
    },
    { $sort: { completionRate: -1 } }
  ]);

  const result = {
    productivity: productivityMetrics[0] || {
      totalTasks: 0,
      completedTasks: 0,
      totalEstimatedHours: 0,
      totalActualHours: 0,
      avgCompletionTime: 0
    },
    teamPerformance,
    pmPerformance,
    summary: {
      totalEmployees: await Employee.countDocuments(),
      totalPMs: await PM.countDocuments(),
      totalClients: await Client.countDocuments(),
      totalProjects: await Project.countDocuments(),
      totalTasks: await Task.countDocuments(),
      totalPayments: await Payment.countDocuments()
    }
  };

  res.json({
    success: true,
    data: result
  });
});

module.exports = {
  getAdminDashboardStats,
  getSystemAnalytics
};
