const Project = require('../../models/Project');
const Milestone = require('../../models/Milestone');
const Task = require('../../models/Task');
const asyncHandler = require('../../middlewares/asyncHandler');
const ErrorResponse = require('../../utils/errorResponse');
const socketService = require('../../services/socketService');

// @desc    Get all projects (Admin view - all projects)
// @route   GET /api/admin/projects
// @access  Admin only
const getAllProjects = asyncHandler(async (req, res, next) => {
  const { status, priority, client, pm, page = 1, limit = 20, search } = req.query;
  
  // Build filter object
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (client) filter.client = client;
  if (pm) filter.projectManager = pm;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

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

// @desc    Get project by ID (Admin view)
// @route   GET /api/admin/projects/:id
// @access  Admin only
const getProjectById = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate('client', 'name email company phoneNumber')
    .populate('projectManager', 'name email phone')
    .populate('assignedTeam', 'name email department position')
    .populate('milestones');

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  res.json({
    success: true,
    data: project
  });
});

// @desc    Create project (Admin can create for any PM)
// @route   POST /api/admin/projects
// @access  Admin only
const createProject = asyncHandler(async (req, res, next) => {
  const project = await Project.create(req.body);

  const populatedProject = await Project.findById(project._id)
    .populate('client', 'name email company')
    .populate('projectManager', 'name email')
    .populate('assignedTeam', 'name email department position');

  // Emit WebSocket event
  socketService.emitToProject(project._id, 'project_created', {
    project: populatedProject,
    createdBy: req.user.name
  });

  res.status(201).json({
    success: true,
    data: populatedProject
  });
});

// @desc    Update project (Admin can update any project)
// @route   PUT /api/admin/projects/:id
// @access  Admin only
const updateProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
    .populate('client', 'name email company')
    .populate('projectManager', 'name email')
    .populate('assignedTeam', 'name email department position');

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Emit WebSocket event
  socketService.emitToProject(project._id, 'project_updated', {
    project,
    updatedBy: req.user.name
  });

  res.json({
    success: true,
    data: project
  });
});

// @desc    Delete project (Admin can delete any project)
// @route   DELETE /api/admin/projects/:id
// @access  Admin only
const deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Delete related milestones and tasks
  await Milestone.deleteMany({ project: project._id });
  await Task.deleteMany({ project: project._id });

  await Project.findByIdAndDelete(req.params.id);

  // Emit WebSocket event
  socketService.emitToProject(project._id, 'project_deleted', {
    projectId: project._id,
    projectName: project.name,
    deletedBy: req.user.name
  });

  res.json({
    success: true,
    message: 'Project deleted successfully'
  });
});

// @desc    Get project statistics (Admin view - all projects)
// @route   GET /api/admin/projects/statistics
// @access  Admin only
const getProjectStatistics = asyncHandler(async (req, res, next) => {
  const stats = await Project.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalBudget: { $sum: '$budget' },
        totalEstimatedHours: { $sum: '$estimatedHours' },
        totalActualHours: { $sum: '$actualHours' }
      }
    }
  ]);

  const priorityStats = await Project.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    }
  ]);

  const totalProjects = await Project.countDocuments();
  const overdueProjects = await Project.countDocuments({
    dueDate: { $lt: new Date() },
    status: { $nin: ['completed', 'cancelled'] }
  });

  res.json({
    success: true,
    data: {
      totalProjects,
      overdueProjects,
      statusBreakdown: stats,
      priorityBreakdown: priorityStats
    }
  });
});

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStatistics
};
