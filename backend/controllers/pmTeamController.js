const Employee = require('../models/Employee');
const Client = require('../models/Client');
const PM = require('../models/PM');
const Project = require('../models/Project');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all employees for PM team management
// @route   GET /api/pm/team/employees
// @access  PM only
const getPMEmployees = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 50, department, position, isActive } = req.query;
  
  // Build filter object
  const filter = {};
  if (department) filter.department = department;
  if (position) filter.position = position;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get employees with pagination
  const employees = await Employee.find(filter)
    .select('-password -otp -otpExpires')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Employee.countDocuments(filter);

  res.json({
    success: true,
    data: employees,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total: total
    }
  });
});

// @desc    Get all clients for PM team management
// @route   GET /api/pm/team/clients
// @access  PM only
const getPMClients = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 50, isActive } = req.query;
  
  // Build filter object
  const filter = {};
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get clients with pagination
  const clients = await Client.find(filter)
    .select('-otp -otpExpires')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Client.countDocuments(filter);

  res.json({
    success: true,
    data: clients,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total: total
    }
  });
});

// @desc    Get all PMs for team management
// @route   GET /api/pm/team/members
// @access  PM only
const getPMTeamMembers = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 50, isActive } = req.query;
  
  // Build filter object
  const filter = {};
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get PMs with pagination
  const pms = await PM.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await PM.countDocuments(filter);

  res.json({
    success: true,
    data: pms,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total: total
    }
  });
});

// @desc    Get team statistics for PM dashboard
// @route   GET /api/pm/team/statistics
// @access  PM only
const getPMTeamStatistics = asyncHandler(async (req, res, next) => {
  const pmId = req.user.id;

  // Get counts for different user types
  const [employees, clients, pms] = await Promise.all([
    Employee.countDocuments({ isActive: true }),
    Client.countDocuments({ isActive: true }),
    PM.countDocuments({ isActive: true })
  ]);

  // Get PM's project statistics
  const projectStats = await Project.aggregate([
    { $match: { projectManager: pmId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get team members assigned to PM's projects
  const assignedTeamMembers = await Project.aggregate([
    { $match: { projectManager: pmId } },
    { $unwind: '$assignedTeam' },
    {
      $group: {
        _id: '$assignedTeam',
        projectCount: { $sum: 1 }
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
        projectCount: 1
      }
    }
  ]);

  // Get client statistics for PM's projects
  const clientStats = await Project.aggregate([
    { $match: { projectManager: pmId } },
    {
      $group: {
        _id: '$client',
        projectCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'clients',
        localField: '_id',
        foreignField: '_id',
        as: 'client'
      }
    },
    { $unwind: '$client' },
    {
      $project: {
        _id: 1,
        name: '$client.name',
        email: '$client.email',
        company: '$client.company',
        projectCount: 1
      }
    }
  ]);

  const result = {
    totalEmployees: employees,
    totalClients: clients,
    totalPMs: pms,
    projectStats: projectStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {}),
    assignedTeamMembers,
    clientStats,
    summary: {
      totalTeamMembers: employees + pms,
      totalUsers: employees + clients + pms,
      activeProjects: projectStats.find(stat => stat._id === 'active')?.count || 0,
      completedProjects: projectStats.find(stat => stat._id === 'completed')?.count || 0
    }
  };

  res.json({
    success: true,
    data: result
  });
});

module.exports = {
  getPMEmployees,
  getPMClients,
  getPMTeamMembers,
  getPMTeamStatistics
};
