const Project = require('../../models/Project');
const Milestone = require('../../models/Milestone');
const Task = require('../../models/Task');
const Employee = require('../../models/Employee');
const Client = require('../../models/Client');
const PM = require('../../models/PM');
const Payment = require('../../models/Payment');
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
    .populate('client', 'name email phoneNumber companyName')
    .populate('projectManager', 'name email')
    .populate('assignedTeam', 'name email department position')
    .populate('submittedBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Project.countDocuments(filter);

  // Calculate additional project metrics
  const projectsWithMetrics = await Promise.all(
    projects.map(async (project) => {
      // Get milestone count and progress
      const milestones = await Milestone.find({ project: project._id });
      const completedMilestones = milestones.filter(m => m.status === 'completed').length;
      const progress = milestones.length > 0 ? 
        Math.round((completedMilestones / milestones.length) * 100) : 0;

      // Get task count
      const taskCount = await Task.countDocuments({ project: project._id });

      // Calculate days remaining
      let daysRemaining = null;
      if (project.dueDate) {
        const now = new Date();
        const dueDate = new Date(project.dueDate);
        const diffTime = dueDate - now;
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      return {
        ...project.toObject(),
        progress,
        milestoneCount: milestones.length,
        taskCount,
        daysRemaining,
        isOverdue: daysRemaining !== null && daysRemaining < 0 && !['completed', 'cancelled'].includes(project.status)
      };
    })
  );

  res.json({
    success: true,
    count: projectsWithMetrics.length,
    total,
    data: projectsWithMetrics,
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
    status: { $not: { $in: ['completed', 'cancelled'] } }
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

// @desc    Get comprehensive project management statistics
// @route   GET /api/admin/projects/management-statistics
// @access  Admin only
const getProjectManagementStatistics = asyncHandler(async (req, res, next) => {
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const endOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

  try {
    // Projects Statistics with aggregation for better performance
    const projectStats = await Project.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          onHold: { $sum: { $cond: [{ $eq: ['$status', 'on-hold'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending-assignment'] }, 1, 0] } },
          thisMonth: { 
            $sum: { 
              $cond: [
                { $gte: ['$createdAt', startOfMonth] }, 
                1, 
                0
              ] 
            } 
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ['$dueDate', currentDate] },
                    { $not: { $in: ['$status', ['completed', 'cancelled']] } }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Milestones Statistics
    const milestoneStats = await Milestone.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ['$dueDate', currentDate] },
                    { $not: { $in: ['$status', ['completed', 'cancelled']] } }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Tasks Statistics
    const taskStats = await Task.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ['$dueDate', currentDate] },
                    { $not: { $in: ['$status', ['completed', 'cancelled']] } }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Employees Statistics
    const employeeStats = await Employee.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          onLeave: { $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] } },
          newThisMonth: {
            $sum: {
              $cond: [
                { $gte: ['$joiningDate', startOfMonth] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Clients Statistics
    const clientStats = await Client.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          inactive: { $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] } },
          newThisMonth: {
            $sum: {
              $cond: [
                { $gte: ['$joiningDate', startOfMonth] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // PMs Statistics
    const pmStats = await PM.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          onLeave: { $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] } }
        }
      }
    ]);

    // Calculate average projects per PM
    const avgProjects = pmStats[0]?.total > 0 ? 
      (projectStats[0]?.total / pmStats[0].total).toFixed(1) : 0;

    const statistics = {
      projects: {
        total: projectStats[0]?.total || 0,
        active: projectStats[0]?.active || 0,
        completed: projectStats[0]?.completed || 0,
        onHold: projectStats[0]?.onHold || 0,
        overdue: projectStats[0]?.overdue || 0,
        thisMonth: projectStats[0]?.thisMonth || 0,
        pending: projectStats[0]?.pending || 0
      },
      milestones: {
        total: milestoneStats[0]?.total || 0,
        completed: milestoneStats[0]?.completed || 0,
        inProgress: milestoneStats[0]?.inProgress || 0,
        pending: milestoneStats[0]?.pending || 0,
        overdue: milestoneStats[0]?.overdue || 0
      },
      tasks: {
        total: taskStats[0]?.total || 0,
        completed: taskStats[0]?.completed || 0,
        inProgress: taskStats[0]?.inProgress || 0,
        pending: taskStats[0]?.pending || 0,
        overdue: taskStats[0]?.overdue || 0
      },
      employees: {
        total: employeeStats[0]?.total || 0,
        active: employeeStats[0]?.active || 0,
        onLeave: employeeStats[0]?.onLeave || 0,
        newThisMonth: employeeStats[0]?.newThisMonth || 0
      },
      clients: {
        total: clientStats[0]?.total || 0,
        active: clientStats[0]?.active || 0,
        inactive: clientStats[0]?.inactive || 0,
        newThisMonth: clientStats[0]?.newThisMonth || 0
      },
      projectManagers: {
        total: pmStats[0]?.total || 0,
        active: pmStats[0]?.active || 0,
        onLeave: pmStats[0]?.onLeave || 0,
        avgProjects: parseFloat(avgProjects)
      }
    };

    res.json({
      success: true,
      data: statistics
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    return next(new ErrorResponse('Failed to fetch statistics', 500));
  }
});

// @desc    Get pending projects (from sales team)
// @route   GET /api/admin/projects/pending
// @access  Admin only
const getPendingProjects = asyncHandler(async (req, res, next) => {
  const { priority, search, page = 1, limit = 20 } = req.query;
  
  // Build filter object
  const filter = { 
    status: 'pending-assignment',
    submittedBy: { $exists: true, $ne: null } // Only show projects submitted by sales
  };
  
  if (priority && priority !== 'all') {
    filter.priority = priority;
  }
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { 'client.name': { $regex: search, $options: 'i' } },
      { 'client.companyName': { $regex: search, $options: 'i' } }
    ];
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const projects = await Project.find(filter)
    .populate('client', 'name email phoneNumber companyName')
    .populate('submittedBy', 'name email')
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

// @desc    Assign PM to pending project
// @route   POST /api/admin/projects/pending/:id/assign-pm
// @access  Admin only
const assignPMToPendingProject = asyncHandler(async (req, res, next) => {
  const { pmId } = req.body;
  const projectId = req.params.id;

  if (!pmId) {
    return next(new ErrorResponse('PM ID is required', 400));
  }

  // Find the project
  const project = await Project.findById(projectId);
  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  if (project.status !== 'pending-assignment') {
    return next(new ErrorResponse('Project is not in pending assignment status', 400));
  }

  // Find the PM
  const pm = await PM.findById(pmId);
  if (!pm) {
    return next(new ErrorResponse('Project Manager not found', 404));
  }

  if (!pm.isActive) {
    return next(new ErrorResponse('Project Manager is not active', 400));
  }

  // Update project
  project.projectManager = pmId;
  project.status = 'untouched';
  project.meetingStatus = 'pending';
  
  // Set a default dueDate if not already set (required for non-pending-assignment status)
  if (!project.dueDate) {
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 30); // 30 days from now
    project.dueDate = defaultDueDate;
  }
  
  await project.save();

  // Update PM's projectsManaged array
  if (!pm.projectsManaged.includes(projectId)) {
    pm.projectsManaged.push(projectId);
    await pm.save();
  }

  // Populate the updated project
  const populatedProject = await Project.findById(projectId)
    .populate('client', 'name email phoneNumber companyName')
    .populate('projectManager', 'name email')
    .populate('submittedBy', 'name email');

  // Emit WebSocket event to PM
  socketService.emitToUser(pmId, 'project_assigned', {
    project: populatedProject,
    message: `New project "${project.name}" has been assigned to you`,
    assignedBy: req.user.name
  });

  res.json({
    success: true,
    data: populatedProject,
    message: 'Project assigned to PM successfully'
  });
});

// @desc    Get PMs for assignment dropdown
// @route   GET /api/admin/projects/pms-for-assignment
// @access  Admin only
const getPMsForAssignment = asyncHandler(async (req, res, next) => {
  try {
    const pms = await PM.find({ isActive: true })
      .select('name email projectsManaged')
      .populate('projectsManaged', 'name status');

    const pmOptions = pms.map(pm => {
      const activeProjects = pm.projectsManaged.filter(p => 
        ['untouched', 'started', 'active'].includes(p.status)
      ).length;
      
      const completedProjects = pm.projectsManaged.filter(p => 
        p.status === 'completed'
      ).length;
      
      const totalProjects = pm.projectsManaged.length;
      const completionRate = totalProjects > 0 ? 
        Math.round((completedProjects / totalProjects) * 100) : 0;
      
      const performance = Math.min(100, Math.max(0, 
        completionRate + (activeProjects < 5 ? 10 : 0) // Bonus for manageable workload
      ));

      return {
        value: pm._id.toString(),
        label: `${pm.name} - ${activeProjects} active projects - ${performance}% performance`,
        icon: 'FiUser',
        data: {
          id: pm._id,
          name: pm.name,
          email: pm.email,
          projects: activeProjects,
          performance: performance
        }
      };
    });

    res.json({
      success: true,
      data: pmOptions
    });

  } catch (error) {
    console.error('Error fetching PMs for assignment:', error);
    return next(new ErrorResponse('Failed to fetch PMs for assignment', 500));
  }
});

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStatistics,
  getProjectManagementStatistics,
  getPendingProjects,
  assignPMToPendingProject,
  getPMsForAssignment
};
