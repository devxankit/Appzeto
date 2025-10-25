const Project = require('../../models/Project');
const Milestone = require('../../models/Milestone');
const Task = require('../../models/Task');
const asyncHandler = require('../../middlewares/asyncHandler');
const ErrorResponse = require('../../utils/errorResponse');

// @desc    Get employee's assigned projects
// @route   GET /api/employee/projects
// @access  Employee only
const getEmployeeProjects = asyncHandler(async (req, res, next) => {
  const employeeId = req.user.id;
  const { status, page = 1, limit = 20 } = req.query;
  
  // Build filter - employee must be in assignedTeam
  const filter = { assignedTeam: employeeId };
  if (status) filter.status = status;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const projects = await Project.find(filter)
    .populate('client', 'name email company')
    .populate('projectManager', 'name email')
    .populate('assignedTeam', 'name email department position')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Project.countDocuments(filter);

  res.json({
    success: true,
    count: projects.length,
    total,
    data: projects,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total
    }
  });
});

// @desc    Get project details (Employee view - only assigned projects)
// @route   GET /api/employee/projects/:id
// @access  Employee only
const getEmployeeProjectById = asyncHandler(async (req, res, next) => {
  const employeeId = req.user.id;
  
  const project = await Project.findOne({
    _id: req.params.id,
    assignedTeam: employeeId
  })
    .populate('client', 'name email company phoneNumber')
    .populate('projectManager', 'name email phone')
    .populate('assignedTeam', 'name email department position')
    .populate({
      path: 'milestones',
      populate: {
        path: 'tasks',
        match: { assignedTo: employeeId }
      }
    });

  if (!project) {
    return next(new ErrorResponse('Project not found or you are not assigned to this project', 404));
  }

  res.json({
    success: true,
    data: project
  });
});

// @desc    Get project milestones (Employee view - only assigned projects)
// @route   GET /api/employee/projects/:id/milestones
// @access  Employee only
const getEmployeeProjectMilestones = asyncHandler(async (req, res, next) => {
  const employeeId = req.user.id;
  
  // First verify employee is assigned to project
  const project = await Project.findOne({
    _id: req.params.id,
    assignedTeam: employeeId
  });

  if (!project) {
    return next(new ErrorResponse('Project not found or you are not assigned to this project', 404));
  }

  const milestones = await Milestone.find({ project: req.params.id })
    .populate({
      path: 'tasks',
      match: { assignedTo: employeeId }
    })
    .sort({ sequence: 1 });

  res.json({
    success: true,
    data: milestones
  });
});

// @desc    Get project statistics (Employee view - only assigned projects)
// @route   GET /api/employee/projects/statistics
// @access  Employee only
const getEmployeeProjectStatistics = asyncHandler(async (req, res, next) => {
  const employeeId = req.user.id;

  // Get assigned projects
  const assignedProjects = await Project.find({ assignedTeam: employeeId });
  const projectIds = assignedProjects.map(p => p._id);

  // Get task statistics for assigned projects
  const taskStats = await Task.aggregate([
    { $match: { project: { $in: projectIds }, assignedTo: employeeId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalEstimatedHours: { $sum: '$estimatedHours' },
        totalActualHours: { $sum: '$actualHours' }
      }
    }
  ]);

  // Get milestone statistics
  const milestoneStats = await Milestone.aggregate([
    { $match: { project: { $in: projectIds } } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    assignedProjects: assignedProjects.length,
    activeProjects: assignedProjects.filter(p => p.status === 'active').length,
    completedProjects: assignedProjects.filter(p => p.status === 'completed').length,
    taskStats,
    milestoneStats,
    totalEstimatedHours: taskStats.reduce((sum, stat) => sum + (stat.totalEstimatedHours || 0), 0),
    totalActualHours: taskStats.reduce((sum, stat) => sum + (stat.totalActualHours || 0), 0)
  };

  res.json({
    success: true,
    data: result
  });
});

module.exports = {
  getEmployeeProjects,
  getEmployeeProjectById,
  getEmployeeProjectMilestones,
  getEmployeeProjectStatistics
};
