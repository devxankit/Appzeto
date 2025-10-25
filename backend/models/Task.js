const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'commentUserModel',
    required: true
  },
  commentUserModel: {
    type: String,
    enum: ['PM', 'Employee', 'Client'],
    required: true
  },
  message: {
    type: String,
    required: [true, 'Comment message is required'],
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Task title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Task description cannot exceed 1000 characters']
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project is required']
  },
  milestone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Milestone',
    required: [true, 'Milestone is required']
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'testing', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  startDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  estimatedHours: {
    type: Number,
    min: 0,
    default: 0
  },
  actualHours: {
    type: Number,
    min: 0,
    default: 0
  },
  attachments: [{
    public_id: String,
    secure_url: String,
    originalName: String,
    original_filename: String,
    format: String,
    size: Number,
    bytes: Number,
    width: Number,
    height: Number,
    resource_type: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [commentSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PM',
    required: [true, 'Task creator is required']
  }
}, {
  timestamps: true
});

// Indexes for better performance
taskSchema.index({ project: 1 });
taskSchema.index({ milestone: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ isUrgent: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ project: 1, status: 1 }); // Compound index for filtering

// Virtual for checking if task is overdue
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate) return false;
  return new Date() > this.dueDate && this.status !== 'completed';
});

// Method to mark task as complete
taskSchema.methods.markComplete = function() {
  this.status = 'completed';
  this.completedDate = new Date();
  return this.save();
};

// Method to check if task is overdue (using virtual property instead)
// taskSchema.methods.isOverdue = function() {
//   if (!this.dueDate) return false;
//   return new Date() > this.dueDate && this.status !== 'completed';
// };

// Method to add comment
taskSchema.methods.addComment = function(userId, userModel, message) {
  this.comments.push({
    user: userId,
    commentUserModel: userModel,
    message: message
  });
  return this.save();
};

// Method to assign task to employees
taskSchema.methods.assignTo = function(employeeIds) {
  this.assignedTo = employeeIds;
  return this.save();
};

// Method to add assignee
taskSchema.methods.addAssignee = function(employeeId) {
  if (!this.assignedTo.includes(employeeId)) {
    this.assignedTo.push(employeeId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove assignee
taskSchema.methods.removeAssignee = function(employeeId) {
  this.assignedTo = this.assignedTo.filter(id => !id.equals(employeeId));
  return this.save();
};

// Method to add attachment
taskSchema.methods.addAttachment = function(attachmentData) {
  this.attachments.push(attachmentData);
  return this.save();
};

// Method to remove attachment
taskSchema.methods.removeAttachment = function(attachmentId) {
  this.attachments = this.attachments.filter(att => att._id.toString() !== attachmentId);
  return this.save();
};

// Method to update status
taskSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  
  if (newStatus === 'completed') {
    this.completedDate = new Date();
  } else if (newStatus === 'in-progress' && !this.startDate) {
    this.startDate = new Date();
  }
  
  return this.save();
};

// Pre-save middleware to update milestone progress when task status changes
taskSchema.pre('save', async function(next) {
  if (this.isModified('status')) {
    try {
      const milestone = await this.constructor.model('Milestone').findById(this.milestone);
      if (milestone) {
        await milestone.updateProgress();
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Pre-save middleware to set start date when status changes to in-progress
taskSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'in-progress' && !this.startDate) {
    this.startDate = new Date();
  }
  next();
});

// Pre-save middleware to set completed date when status changes to completed
taskSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedDate) {
    this.completedDate = new Date();
  }
  next();
});

// Remove sensitive data from JSON output
taskSchema.methods.toJSON = function() {
  const task = this.toObject();
  return task;
};

module.exports = mongoose.model('Task', taskSchema);

