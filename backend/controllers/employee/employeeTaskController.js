const Task = require('../../models/Task');
const Project = require('../../models/Project');
const Milestone = require('../../models/Milestone');
const asyncHandler = require('../../middlewares/asyncHandler');
const ErrorResponse = require('../../utils/errorResponse');
const socketService = require('../../services/socketService');

// @desc    Get employee's assigned tasks
// @route   GET /api/employee/tasks
// @access  Employee only
const getEmployeeTasks = asyncHandler(async (req, res, next) => {
  const employeeId = req.user.id;
  const { status, priority, isUrgent, project, milestone, page = 1, limit = 20 } = req.query;
  
  // Build filter - employee must be in assignedTo
  const filter = { assignedTo: employeeId };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (isUrgent !== undefined) filter.isUrgent = isUrgent === 'true';
  if (project) filter.project = project;
  if (milestone) filter.milestone = milestone;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const tasks = await Task.find(filter)
    .populate('project', 'name status')
    .populate('milestone', 'title status')
    .populate('assignedTo', 'name email department')
    .populate('createdBy', 'name email')
    .sort({ 
      isUrgent: -1, // Urgent tasks first
      priority: 1,  // Then by priority
      dueDate: 1    // Then by due date
    })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Task.countDocuments(filter);

  res.json({
    success: true,
    count: tasks.length,
    total,
    data: tasks,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total
    }
  });
});

// @desc    Get task details (Employee view - only assigned tasks)
// @route   GET /api/employee/tasks/:id
// @access  Employee only
const getEmployeeTaskById = asyncHandler(async (req, res, next) => {
  const employeeId = req.user.id;
  
  const task = await Task.findOne({
    _id: req.params.id,
    assignedTo: employeeId
  })
    .populate('project', 'name status description')
    .populate('milestone', 'title status description')
    .populate('assignedTo', 'name email department position')
    .populate('createdBy', 'name email');

  if (!task) {
    return next(new ErrorResponse('Task not found or you are not assigned to this task', 404));
  }

  res.json({
    success: true,
    data: task
  });
});

// @desc    Update task status (Employee can update their assigned tasks)
// @route   PATCH /api/employee/tasks/:id/status
// @access  Employee only
const updateEmployeeTaskStatus = asyncHandler(async (req, res, next) => {
  const employeeId = req.user.id;
  const { status, actualHours, comments } = req.body;

  const task = await Task.findOne({
    _id: req.params.id,
    assignedTo: employeeId
  });

  if (!task) {
    return next(new ErrorResponse('Task not found or you are not assigned to this task', 404));
  }

  // Update task status
  task.status = status;
  if (actualHours) task.actualHours = actualHours;
  
  // Set completion date if task is completed
  if (status === 'completed' && !task.completedDate) {
    task.completedDate = new Date();
  }

  // Add comment if provided
  if (comments) {
    task.comments.push({
      user: employeeId,
      userType: 'employee',
      message: comments,
      createdAt: new Date()
    });
  }

  await task.save();

  // Populate the updated task
  const updatedTask = await Task.findById(task._id)
    .populate('project', 'name status')
    .populate('milestone', 'title status')
    .populate('assignedTo', 'name email department')
    .populate('createdBy', 'name email');

  // Emit WebSocket event
  socketService.emitToTask(task._id, 'task_status_updated', {
    task: updatedTask,
    updatedBy: req.user.name,
    status: status
  });

  // Also emit to project room
  socketService.emitToProject(task.project, 'task_updated', {
    task: updatedTask,
    updatedBy: req.user.name
  });

  res.json({
    success: true,
    data: updatedTask
  });
});

// @desc    Add comment to task (Employee can comment on assigned tasks)
// @route   POST /api/employee/tasks/:id/comments
// @access  Employee only
const addEmployeeTaskComment = asyncHandler(async (req, res, next) => {
  const employeeId = req.user.id;
  const { message } = req.body;

  const task = await Task.findOne({
    _id: req.params.id,
    assignedTo: employeeId
  });

  if (!task) {
    return next(new ErrorResponse('Task not found or you are not assigned to this task', 404));
  }

  // Add comment
  task.comments.push({
    user: employeeId,
    userType: 'employee',
    message: message,
    createdAt: new Date()
  });

  await task.save();

  // Populate the updated task
  const updatedTask = await Task.findById(task._id)
    .populate('project', 'name status')
    .populate('milestone', 'title status')
    .populate('assignedTo', 'name email department')
    .populate('createdBy', 'name email');

  // Emit WebSocket event
  socketService.emitToTask(task._id, 'comment_added', {
    task: updatedTask,
    comment: {
      user: req.user.name,
      userType: 'employee',
      message: message,
      createdAt: new Date()
    }
  });

  res.json({
    success: true,
    data: updatedTask
  });
});

// @desc    Get urgent tasks (Employee view - only assigned urgent tasks)
// @route   GET /api/employee/tasks/urgent
// @access  Employee only
const getEmployeeUrgentTasks = asyncHandler(async (req, res, next) => {
  const employeeId = req.user.id;
  const { page = 1, limit = 20 } = req.query;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const urgentTasks = await Task.find({
    assignedTo: employeeId,
    isUrgent: true,
    status: { $nin: ['completed', 'cancelled'] }
  })
    .populate('project', 'name status')
    .populate('milestone', 'title status')
    .populate('assignedTo', 'name email department')
    .populate('createdBy', 'name email')
    .sort({ dueDate: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Task.countDocuments({
    assignedTo: employeeId,
    isUrgent: true,
    status: { $nin: ['completed', 'cancelled'] }
  });

  res.json({
    success: true,
    count: urgentTasks.length,
    total,
    data: urgentTasks,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total
    }
  });
});

// @desc    Get employee task statistics
// @route   GET /api/employee/tasks/statistics
// @access  Employee only
const getEmployeeTaskStatistics = asyncHandler(async (req, res, next) => {
  const employeeId = req.user.id;

  // Get task statistics
  const taskStats = await Task.aggregate([
    { $match: { assignedTo: employeeId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalEstimatedHours: { $sum: '$estimatedHours' },
        totalActualHours: { $sum: '$actualHours' }
      }
    }
  ]);

  // Get urgent tasks count
  const urgentTasksCount = await Task.countDocuments({
    assignedTo: employeeId,
    isUrgent: true,
    status: { $nin: ['completed', 'cancelled'] }
  });

  // Get overdue tasks count
  const overdueTasksCount = await Task.countDocuments({
    assignedTo: employeeId,
    dueDate: { $lt: new Date() },
    status: { $nin: ['completed', 'cancelled'] }
  });

  const result = {
    totalTasks: taskStats.reduce((sum, stat) => sum + stat.count, 0),
    completedTasks: taskStats.find(t => t._id === 'completed')?.count || 0,
    inProgressTasks: taskStats.find(t => t._id === 'in-progress')?.count || 0,
    pendingTasks: taskStats.find(t => t._id === 'pending')?.count || 0,
    urgentTasks: urgentTasksCount,
    overdueTasks: overdueTasksCount,
    totalEstimatedHours: taskStats.reduce((sum, stat) => sum + (stat.totalEstimatedHours || 0), 0),
    totalActualHours: taskStats.reduce((sum, stat) => sum + (stat.totalActualHours || 0), 0),
    taskStatusBreakdown: taskStats
  };

  res.json({
    success: true,
    data: result
  });
});

module.exports = {
  getEmployeeTasks,
  getEmployeeTaskById,
  updateEmployeeTaskStatus,
  addEmployeeTaskComment,
  getEmployeeUrgentTasks,
  getEmployeeTaskStatistics
};
