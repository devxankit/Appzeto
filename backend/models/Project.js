const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [1000, 'Project description cannot exceed 1000 characters']
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client is required']
  },
  projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PM',
    required: [true, 'Project manager is required']
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'on-hold', 'testing', 'completed', 'cancelled'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  assignedTeam: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  budget: {
    type: Number,
    min: 0,
    default: 0
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
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  milestones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Milestone'
  }],
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
  tags: [{
    type: String,
    trim: true
  }],
  revisions: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      firstRevision: {
        status: 'pending',
        completedDate: null,
        feedback: null
      },
      secondRevision: {
        status: 'pending',
        completedDate: null,
        feedback: null
      }
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
projectSchema.index({ client: 1 });
projectSchema.index({ projectManager: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ priority: 1 });
projectSchema.index({ dueDate: 1 });
projectSchema.index({ createdAt: -1 });

// Virtual for calculating completion percentage from milestones
projectSchema.virtual('completionPercentage').get(function() {
  if (!this.milestones || this.milestones.length === 0) {
    return 0;
  }
  
  // This will be calculated when milestones are populated
  return this.progress;
});

// Virtual for checking if project is overdue
projectSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate) return false;
  return new Date() > this.dueDate && this.status !== 'completed';
});

// Method to update project progress
projectSchema.methods.updateProgress = async function() {
  try {
    // Calculate progress based on milestones
    const milestones = await this.constructor.model('Milestone').find({ 
      project: this._id 
    });
    
    if (milestones.length === 0) {
      this.progress = 0;
    } else {
      const totalProgress = milestones.reduce((sum, milestone) => sum + milestone.progress, 0);
      this.progress = Math.round(totalProgress / milestones.length);
    }
    
    await this.save();
    return this.progress;
  } catch (error) {
    throw new Error('Failed to update project progress');
  }
};

// Method to check if project is overdue (using virtual property instead)
// projectSchema.methods.isOverdue = function() {
//   if (!this.dueDate) return false;
//   return new Date() > this.dueDate && this.status !== 'completed';
// };

// Method to add team member
projectSchema.methods.addTeamMember = function(employeeId) {
  if (!this.assignedTeam.includes(employeeId)) {
    this.assignedTeam.push(employeeId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove team member
projectSchema.methods.removeTeamMember = function(employeeId) {
  this.assignedTeam = this.assignedTeam.filter(id => !id.equals(employeeId));
  return this.save();
};

// Method to add milestone
projectSchema.methods.addMilestone = function(milestoneId) {
  if (!this.milestones.includes(milestoneId)) {
    this.milestones.push(milestoneId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to add attachment
projectSchema.methods.addAttachment = function(attachmentData) {
  this.attachments.push(attachmentData);
  return this.save();
};

// Method to remove attachment
projectSchema.methods.removeAttachment = function(attachmentId) {
  this.attachments = this.attachments.filter(att => att._id.toString() !== attachmentId);
  return this.save();
};

// Method to update revision status
projectSchema.methods.updateRevisionStatus = function(revisionType, status, feedback) {
  if (!['firstRevision', 'secondRevision'].includes(revisionType)) {
    throw new Error('Invalid revision type');
  }
  
  // Validate status
  if (!['pending', 'completed'].includes(status)) {
    throw new Error('Invalid status value');
  }
  
  // Ensure revisions object exists
  if (!this.revisions) {
    this.revisions = {
      firstRevision: { status: 'pending', completedDate: null, feedback: null },
      secondRevision: { status: 'pending', completedDate: null, feedback: null }
    };
  }
  
  // Ensure the specific revision object exists
  if (!this.revisions[revisionType]) {
    this.revisions[revisionType] = { status: 'pending', completedDate: null, feedback: null };
  }
  
  // Update the revision status
  this.revisions[revisionType].status = status;
  
  if (status === 'completed') {
    this.revisions[revisionType].completedDate = new Date();
  } else {
    this.revisions[revisionType].completedDate = null;
  }
  
  if (feedback) {
    this.revisions[revisionType].feedback = feedback;
  }
  
  // Mark the revisions field as modified
  this.markModified('revisions');
  
  return this.save();
};

// Pre-save middleware to ensure revisions object is initialized
projectSchema.pre('save', function(next) {
  // Initialize revisions object if it doesn't exist
  if (!this.revisions) {
    this.revisions = {
      firstRevision: { status: 'pending', completedDate: null, feedback: null },
      secondRevision: { status: 'pending', completedDate: null, feedback: null }
    };
  }
  
  // Ensure each revision has the required structure
  if (!this.revisions.firstRevision) {
    this.revisions.firstRevision = { status: 'pending', completedDate: null, feedback: null };
  }
  if (!this.revisions.secondRevision) {
    this.revisions.secondRevision = { status: 'pending', completedDate: null, feedback: null };
  }
  
  next();
});

// Pre-save middleware to update progress if milestones are modified
projectSchema.pre('save', async function(next) {
  if (this.isModified('milestones') && !this.isNew) {
    try {
      // Calculate progress based on milestones without calling save again
      const milestones = await this.constructor.model('Milestone').find({ 
        project: this._id 
      });
      
      if (milestones.length === 0) {
        this.progress = 0;
      } else {
        const totalProgress = milestones.reduce((sum, milestone) => sum + milestone.progress, 0);
        this.progress = Math.round(totalProgress / milestones.length);
      }
    } catch (error) {
      console.error('Error calculating project progress:', error.message);
      // Don't fail the save operation
    }
  }
  next();
});

// Remove password and sensitive data from JSON output
projectSchema.methods.toJSON = function() {
  const project = this.toObject();
  return project;
};

module.exports = mongoose.model('Project', projectSchema);

