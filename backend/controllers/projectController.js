const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinaryService');
const socketService = require('../services/socketService');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new project
// @route   POST /api/projects
// @access  PM only
const createProject = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    client,
    priority,
    dueDate,
    startDate,
    assignedTeam,
    budget,
    estimatedHours,
    tags
  } = req.body;

  // Create project
  const project = await Project.create({
    name,
    description,
    client,
    projectManager: req.user.id,
    priority,
    dueDate,
    startDate,
    assignedTeam,
    budget,
    estimatedHours,
    tags
  });

  // Populate the project with related data
  await project.populate([
    { path: 'client', select: 'name companyName email phoneNumber' },
    { path: 'projectManager', select: 'name email' },
    { path: 'assignedTeam', select: 'name email position department' }
  ]);

  // Log activity
  await Activity.logProjectActivity(
    project._id,
    'created',
    req.user.id,
    'PM',
    `Project "${project.name}" was created`,
    { projectName: project.name, client: project.client.name }
  );

  // Emit WebSocket event
  socketService.emitToProject(project._id, 'project_created', {
    project: project,
    createdBy: req.user.name,
    timestamp: new Date()
  });

  // Notify client
  socketService.emitToUser(project.client._id, 'project_created', {
    project: project,
    message: `New project "${project.name}" has been created for you`
  });

  // Notify assigned team members
  project.assignedTeam.forEach(employee => {
    socketService.emitToUser(employee._id, 'project_assigned', {
      project: project,
      message: `You have been assigned to project "${project.name}"`
    });
  });

  res.status(201).json({
    success: true,
    data: project
  });
});

// @desc    Get all projects
// @route   GET /api/projects
// @access  PM, Employee, Client
const getAllProjects = asyncHandler(async (req, res, next) => {
  const {
    status,
    priority,
    client,
    projectManager,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (client) filter.client = client;
  if (projectManager) filter.projectManager = projectManager;

  // Role-based filtering
  if (req.user.role === 'client') {
    filter.client = req.user.id;
  } else if (req.user.role === 'employee') {
    filter.assignedTeam = req.user.id;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const projects = await Project.find(filter)
    .populate('client', 'name companyName email')
    .populate('projectManager', 'name email')
    .populate('assignedTeam', 'name email position')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Project.countDocuments(filter);

  res.json({
    success: true,
    count: projects.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    data: projects
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  PM, Employee (if assigned), Client (if their project)
const getProjectById = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate('client', 'name companyName email phoneNumber address')
    .populate('projectManager', 'name email phone')
    .populate('assignedTeam', 'name email position department')
    .populate({
      path: 'milestones',
      populate: {
        path: 'assignedTo',
        select: 'name email position'
      }
    });

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Check access permissions
  if (req.user.role === 'client' && !project.client._id.equals(req.user.id)) {
    return next(new ErrorResponse('Not authorized to access this project', 403));
  }

  if (req.user.role === 'employee' && !project.assignedTeam.some(member => member._id.equals(req.user.id))) {
    return next(new ErrorResponse('Not authorized to access this project', 403));
  }

  res.json({
    success: true,
    data: project
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  PM only
const updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Check if user is the project manager
  if (!project.projectManager.equals(req.user.id)) {
    return next(new ErrorResponse('Not authorized to update this project', 403));
  }

  const {
    name,
    description,
    client,
    priority,
    dueDate,
    startDate,
    assignedTeam,
    budget,
    estimatedHours,
    tags
  } = req.body;

  // Update project
  project = await Project.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      client,
      priority,
      dueDate,
      startDate,
      assignedTeam,
      budget,
      estimatedHours,
      tags
    },
    { new: true, runValidators: true }
  ).populate([
    { path: 'client', select: 'name companyName email' },
    { path: 'projectManager', select: 'name email' },
    { path: 'assignedTeam', select: 'name email position' }
  ]);

  // Log activity
  await Activity.logProjectActivity(
    project._id,
    'updated',
    req.user.id,
    'PM',
    `Project "${project.name}" was updated`,
    { projectName: project.name }
  );

  // Emit WebSocket event
  socketService.emitToProject(project._id, 'project_updated', {
    project: project,
    updatedBy: req.user.name,
    timestamp: new Date()
  });

  res.json({
    success: true,
    data: project
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  PM only
const deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Check if user is the project manager
  if (!project.projectManager.equals(req.user.id)) {
    return next(new ErrorResponse('Not authorized to delete this project', 403));
  }

  // Delete associated milestones and tasks
  await Milestone.deleteMany({ project: project._id });
  await Task.deleteMany({ project: project._id });

  // Delete project
  await Project.findByIdAndDelete(req.params.id);

  // Log activity
  await Activity.logProjectActivity(
    project._id,
    'deleted',
    req.user.id,
    'PM',
    `Project "${project.name}" was deleted`,
    { projectName: project.name }
  );

  // Emit WebSocket event
  socketService.emitToProject(project._id, 'project_deleted', {
    projectId: project._id,
    projectName: project.name,
    deletedBy: req.user.name,
    timestamp: new Date()
  });

  res.json({
    success: true,
    message: 'Project deleted successfully'
  });
});

// @desc    Get projects by client
// @route   GET /api/projects/client/:clientId
// @access  PM, Client (own projects only)
const getProjectsByClient = asyncHandler(async (req, res, next) => {
  const { clientId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Check access permissions
  if (req.user.role === 'client' && req.user.id !== clientId) {
    return next(new ErrorResponse('Not authorized to access these projects', 403));
  }

  const skip = (page - 1) * limit;

  const projects = await Project.find({ client: clientId })
    .populate('client', 'name companyName email')
    .populate('projectManager', 'name email')
    .populate('assignedTeam', 'name email position')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Project.countDocuments({ client: clientId });

  res.json({
    success: true,
    count: projects.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    data: projects
  });
});

// @desc    Get projects by PM
// @route   GET /api/projects/pm/:pmId
// @access  PM (own projects only)
const getProjectsByPM = asyncHandler(async (req, res, next) => {
  const { pmId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Check access permissions
  if (req.user.role === 'pm' && req.user.id !== pmId) {
    return next(new ErrorResponse('Not authorized to access these projects', 403));
  }

  const skip = (page - 1) * limit;

  const projects = await Project.find({ projectManager: pmId })
    .populate('client', 'name companyName email')
    .populate('projectManager', 'name email')
    .populate('assignedTeam', 'name email position')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Project.countDocuments({ projectManager: pmId });

  res.json({
    success: true,
    count: projects.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    data: projects
  });
});

// @desc    Get project statistics
// @route   GET /api/projects/statistics
// @access  PM, Admin
const getProjectStatistics = asyncHandler(async (req, res, next) => {
  const filter = {};
  
  // Role-based filtering
  if (req.user.role === 'pm') {
    filter.projectManager = req.user.id;
  } else if (req.user.role === 'client') {
    filter.client = req.user.id;
  } else if (req.user.role === 'employee') {
    filter.assignedTeam = req.user.id;
  }

  const stats = await Project.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const priorityStats = await Project.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    }
  ]);

  const overdueCount = await Project.countDocuments({
    ...filter,
    dueDate: { $lt: new Date() },
    status: { $nin: ['completed', 'cancelled'] }
  });

  const result = {
    byStatus: {
      planning: 0,
      active: 0,
      'on-hold': 0,
      testing: 0,
      completed: 0,
      cancelled: 0
    },
    byPriority: {
      low: 0,
      normal: 0,
      high: 0,
      urgent: 0
    },
    overdue: overdueCount,
    total: await Project.countDocuments(filter)
  };

  stats.forEach(stat => {
    result.byStatus[stat._id] = stat.count;
  });

  priorityStats.forEach(stat => {
    result.byPriority[stat._id] = stat.count;
  });

  res.json({
    success: true,
    data: result
  });
});

// @desc    Upload project attachment
// @route   POST /api/projects/:id/attachments
// @access  PM only
const uploadProjectAttachment = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Check if user is the project manager
  if (!project.projectManager.equals(req.user.id)) {
    return next(new ErrorResponse('Not authorized to upload attachments', 403));
  }

  if (!req.file) {
    return next(new ErrorResponse('No file uploaded', 400));
  }

  try {
    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file, 'projects');

    // Add attachment to project
    await project.addAttachment(result);

    // Log activity
    await Activity.logProjectActivity(
      project._id,
      'attachment_added',
      req.user.id,
      'PM',
      `Attachment "${result.originalName}" was added to project "${project.name}"`,
      { fileName: result.originalName }
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    return next(new ErrorResponse('Failed to upload attachment', 500));
  }
});

// @desc    Remove project attachment
// @route   DELETE /api/projects/:id/attachments/:attachmentId
// @access  PM only
const removeProjectAttachment = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Check if user is the project manager
  if (!project.projectManager.equals(req.user.id)) {
    return next(new ErrorResponse('Not authorized to remove attachments', 403));
  }

  const attachment = project.attachments.id(req.params.attachmentId);

  if (!attachment) {
    return next(new ErrorResponse('Attachment not found', 404));
  }

  try {
    // Delete from Cloudinary
    await deleteFromCloudinary(attachment.public_id);

    // Remove attachment from project
    await project.removeAttachment(req.params.attachmentId);

    // Log activity
    await Activity.logProjectActivity(
      project._id,
      'attachment_removed',
      req.user.id,
      'PM',
      `Attachment "${attachment.originalName}" was removed from project "${project.name}"`,
      { fileName: attachment.originalName }
    );

    res.json({
      success: true,
      message: 'Attachment removed successfully'
    });
  } catch (error) {
    return next(new ErrorResponse('Failed to remove attachment', 500));
  }
});

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsByClient,
  getProjectsByPM,
  getProjectStatistics,
  uploadProjectAttachment,
  removeProjectAttachment
};
