const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const Task = require('../models/Task');
const Payment = require('../models/Payment');
const Employee = require('../models/Employee');
const PM = require('../models/PM');
const Client = require('../models/Client');
const Sales = require('../models/Sales');
const Lead = require('../models/Lead');
const AdminFinance = require('../models/AdminFinance');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/analytics/dashboard
// @access  Admin only
const getAdminDashboardStats = asyncHandler(async (req, res, next) => {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const yesterdayEnd = new Date(todayEnd);
  yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
  
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // Get user statistics
  const [totalEmployees, totalPMs, totalSales, totalClients, activeEmployees, activePMs, activeSales, activeClients] = await Promise.all([
    Employee.countDocuments(),
    PM.countDocuments(),
    Sales.countDocuments(),
    Client.countDocuments(),
    Employee.countDocuments({ isActive: true }),
    PM.countDocuments({ isActive: true }),
    Sales.countDocuments({ isActive: true }),
    Client.countDocuments({ isActive: true })
  ]);

  // Users new this month
  const newUsersThisMonth = await Promise.all([
    Employee.countDocuments({ createdAt: { $gte: currentMonthStart } }),
    PM.countDocuments({ createdAt: { $gte: currentMonthStart } }),
    Sales.countDocuments({ createdAt: { $gte: currentMonthStart } }),
    Client.countDocuments({ createdAt: { $gte: currentMonthStart } })
  ]).then(([employees, pms, sales, clients]) => employees + pms + sales + clients);

  // Calculate user growth
  const totalUsersLastMonth = await Promise.all([
    Employee.countDocuments({ createdAt: { $lt: currentMonthStart } }),
    PM.countDocuments({ createdAt: { $lt: currentMonthStart } }),
    Sales.countDocuments({ createdAt: { $lt: currentMonthStart } }),
    Client.countDocuments({ createdAt: { $lt: currentMonthStart } })
  ]).then(([employees, pms, sales, clients]) => employees + pms + sales + clients);
  
  const totalUsersNow = totalEmployees + totalPMs + totalSales + totalClients;
  const userGrowth = totalUsersLastMonth > 0 
    ? ((totalUsersNow - totalUsersLastMonth) / totalUsersLastMonth) * 100 
    : 0;

  // Get project statistics
  const [totalProjects, activeProjects, completedProjects, onHoldProjects, overdueProjects] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: { $in: ['planning', 'active', 'on-hold', 'testing'] } }),
    Project.countDocuments({ status: 'completed' }),
    Project.countDocuments({ status: 'on-hold' }),
    Project.countDocuments({
      dueDate: { $lt: now },
      status: { $nin: ['completed', 'cancelled'] }
    })
  ]);

  // Get project financial data
  const projectFinancials = await Project.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: { $ifNull: ['$financialDetails.totalCost', '$budget', 0] } },
        avgProjectValue: { $avg: { $ifNull: ['$financialDetails.totalCost', '$budget', 0] } },
        totalProjects: { $sum: 1 },
        completedProjects: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        }
      }
    }
  ]);

  const projectFinancialData = projectFinancials[0] || { totalRevenue: 0, avgProjectValue: 0, totalProjects: 0, completedProjects: 0 };
  const completionRate = projectFinancialData.totalProjects > 0 
    ? (projectFinancialData.completedProjects / projectFinancialData.totalProjects) * 100 
    : 0;

  // Get sales statistics
  const [totalLeads, convertedLeads] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ status: 'converted' })
  ]);

  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

  // Get sales revenue from converted leads and projects
  const salesRevenue = projectFinancialData.totalRevenue;
  const avgDealSize = convertedLeads > 0 ? salesRevenue / convertedLeads : 0;

  // Calculate sales growth (compare this month vs last month)
  const leadsThisMonth = await Lead.countDocuments({ createdAt: { $gte: currentMonthStart } });
  const leadsLastMonth = await Lead.countDocuments({ 
    createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } 
  });
  const salesGrowth = leadsLastMonth > 0 
    ? ((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100 
    : 0;

  // Get financial statistics
  const todayTransactions = await AdminFinance.find({
    recordType: 'transaction',
    transactionDate: { $gte: todayStart, $lte: todayEnd }
  });

  const todayEarnings = todayTransactions
    .filter(t => t.transactionType === 'incoming')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  
  const todayExpenses = todayTransactions
    .filter(t => t.transactionType === 'outgoing')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const todaySales = todayEarnings; // Sales = incoming transactions today
  const todayProfit = todayEarnings - todayExpenses;
  const todayLoss = todayExpenses > todayEarnings ? todayExpenses - todayEarnings : 0;

  // Get yesterday's data for comparison
  const yesterdayTransactions = await AdminFinance.find({
    recordType: 'transaction',
    transactionDate: { $gte: yesterdayStart, $lte: yesterdayEnd }
  });

  const yesterdayEarnings = yesterdayTransactions
    .filter(t => t.transactionType === 'incoming')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  
  const yesterdayExpenses = yesterdayTransactions
    .filter(t => t.transactionType === 'outgoing')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  // Calculate percentage changes
  const earningsGrowth = yesterdayEarnings > 0 
    ? ((todayEarnings - yesterdayEarnings) / yesterdayEarnings) * 100 
    : 0;
  const expensesGrowth = yesterdayExpenses > 0 
    ? ((todayExpenses - yesterdayExpenses) / yesterdayExpenses) * 100 
    : 0;
  const salesGrowthToday = yesterdayEarnings > 0 
    ? ((todaySales - yesterdayEarnings) / yesterdayEarnings) * 100 
    : 0;

  // Pending payments (from Payment model)
  const pendingPayments = await Payment.find({ status: 'pending' });
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingCount = pendingPayments.length;

  // Overall financial statistics
  const allTransactions = await AdminFinance.find({ recordType: 'transaction' });
  const totalRevenue = allTransactions
    .filter(t => t.transactionType === 'incoming')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  
  const totalExpenses = allTransactions
    .filter(t => t.transactionType === 'outgoing')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const profit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  // Outstanding payments (pending payments)
  const outstandingPayments = pendingAmount;

  // Calculate overall finance growth (compare this month vs last month)
  const transactionsThisMonth = await AdminFinance.find({
    recordType: 'transaction',
    transactionDate: { $gte: currentMonthStart }
  });
  
  const revenueThisMonth = transactionsThisMonth
    .filter(t => t.transactionType === 'incoming')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const transactionsLastMonth = await AdminFinance.find({
    recordType: 'transaction',
    transactionDate: { $gte: lastMonthStart, $lte: lastMonthEnd }
  });
  
  const revenueLastMonth = transactionsLastMonth
    .filter(t => t.transactionType === 'incoming')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const financeGrowth = revenueLastMonth > 0 
    ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 
    : 0;

  // Get revenue trend data (last 7 months)
  const revenueTrendData = [];
  const currentDate = new Date(); // Use fresh date for loop
  for (let i = 6; i >= 0; i--) {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
    const monthName = monthDate.toLocaleString('en-US', { month: 'short' });
    
    const monthTransactions = await AdminFinance.find({
      recordType: 'transaction',
      transactionType: 'incoming',
      transactionDate: { $gte: monthDate, $lte: monthEnd }
    });
    
    const monthRevenue = monthTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const monthProjects = await Project.countDocuments({
      createdAt: { $gte: monthDate, $lte: monthEnd }
    });

    revenueTrendData.push({
      month: monthName,
      revenue: monthRevenue,
      projects: monthProjects
    });
  }

  // Get project status distribution - only show Active, Completed, On Hold, and Overdue (matching original mock data)
  const projectStatusData = await Project.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Map statuses to the 4 categories shown in original mock data
  const statusMap = {
    'active': { name: 'Active', color: '#10B981' },
    'planning': { name: 'Active', color: '#10B981' },
    'testing': { name: 'Active', color: '#10B981' },
    'started': { name: 'Active', color: '#10B981' },
    'completed': { name: 'Completed', color: '#3B82F6' },
    'on-hold': { name: 'On Hold', color: '#F59E0B' }
  };

  const statusCounts = {};
  
  // Count active projects (combining planning, active, testing, started)
  let activeCount = 0;
  projectStatusData.forEach(item => {
    if (['active', 'planning', 'testing', 'started'].includes(item._id)) {
      activeCount += item.count;
    } else if (statusMap[item._id]) {
      const statusInfo = statusMap[item._id];
      if (!statusCounts[statusInfo.name]) {
        statusCounts[statusInfo.name] = {
          name: statusInfo.name,
          value: 0,
          color: statusInfo.color
        };
      }
      statusCounts[statusInfo.name].value += item.count;
    }
  });

  // Add active count
  if (activeCount > 0) {
    statusCounts['Active'] = {
      name: 'Active',
      value: activeCount,
      color: '#10B981'
    };
  }

  // Add overdue count (projects with dueDate in past and not completed/cancelled)
  const overdueCount = await Project.countDocuments({
    dueDate: { $lt: now },
    status: { $nin: ['completed', 'cancelled'] }
  });

  if (overdueCount > 0) {
    statusCounts['Overdue'] = {
      name: 'Overdue',
      value: overdueCount,
      color: '#EF4444'
    };
  }

  // Convert to array - only include the 4 statuses from original mock data
  const projectStatusDistribution = [];
  const allowedStatuses = ['Active', 'Completed', 'On Hold', 'Overdue'];
  
  allowedStatuses.forEach(statusName => {
    if (statusCounts[statusName] && statusCounts[statusName].value > 0) {
      projectStatusDistribution.push({
        name: statusCounts[statusName].name,
        value: statusCounts[statusName].value,
        color: statusCounts[statusName].color
      });
    }
  });

  // System health (mock data for now - can be enhanced with real monitoring)
  const systemHealth = {
    uptime: 99.9, // Can be calculated from process.uptime()
    performance: 95, // Can be calculated from various metrics
    errors: 0, // Can be tracked from error logs
    activeUsers: activeEmployees + activePMs + activeSales + activeClients,
    serverLoad: 45 // Can be calculated from system metrics
  };

  // Format the response
  const result = {
    users: {
      total: totalUsersNow,
      sales: totalSales,
      pm: totalPMs,
      employees: totalEmployees,
      clients: totalClients,
      active: activeEmployees + activePMs + activeSales + activeClients,
      newThisMonth: newUsersThisMonth,
      growth: parseFloat(userGrowth.toFixed(2))
    },
    projects: {
      total: totalProjects,
      active: activeProjects,
      completed: completedProjects,
      onHold: onHoldProjects,
      overdue: overdueProjects,
      totalRevenue: projectFinancialData.totalRevenue || 0,
      avgProjectValue: projectFinancialData.avgProjectValue || 0,
      completionRate: parseFloat(completionRate.toFixed(2))
    },
    sales: {
      totalLeads: totalLeads,
      converted: convertedLeads,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      totalRevenue: salesRevenue,
      avgDealSize: avgDealSize,
      growth: parseFloat(salesGrowth.toFixed(2))
    },
    finance: {
      totalRevenue: totalRevenue,
      outstandingPayments: outstandingPayments,
      expenses: totalExpenses,
      profit: profit,
      profitMargin: parseFloat(profitMargin.toFixed(2)),
      growth: parseFloat(financeGrowth.toFixed(2))
    },
    today: {
      earnings: todayEarnings,
      expenses: todayExpenses,
      sales: todaySales,
      pendingAmount: pendingAmount,
      profit: todayProfit,
      loss: todayLoss,
      // Growth percentages for today
      earningsGrowth: parseFloat(earningsGrowth.toFixed(2)),
      expensesGrowth: parseFloat(expensesGrowth.toFixed(2)),
      salesGrowth: parseFloat(salesGrowthToday.toFixed(2)),
      profitGrowth: yesterdayEarnings > 0 && yesterdayExpenses > 0
        ? parseFloat((((todayProfit - (yesterdayEarnings - yesterdayExpenses)) / (yesterdayEarnings - yesterdayExpenses)) * 100).toFixed(2))
        : 0
    },
    system: systemHealth,
    revenueTrend: revenueTrendData,
    projectStatusDistribution: projectStatusDistribution
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
