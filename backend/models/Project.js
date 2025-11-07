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
    required: false // Made optional for pending projects
  },
  status: {
    type: String,
    enum: ['pending-assignment', 'untouched', 'started', 'active', 'on-hold', 'testing', 'completed', 'cancelled'],
    default: 'pending-assignment' // Default for sales-submitted projects; PM-created projects should explicitly set 'active'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  dueDate: {
    type: Date,
    required: false // Made optional for pending projects
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
  // New fields for sales-to-admin-to-PM workflow
  meetingStatus: {
    type: String,
    enum: ['pending', 'done', 'not-applicable'],
    default: 'not-applicable'
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sales'
  },
  requirements: {
    type: String,
    trim: true,
    maxlength: [2000, 'Requirements cannot exceed 2000 characters']
  },
  package: {
    type: String,
    trim: true
  },
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
  },
  // Reference to original lead (if from sales conversion)
  originLead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  },
  // Project type flags
  projectType: {
    web: { type: Boolean, default: false },
    app: { type: Boolean, default: false },
    taxi: { type: Boolean, default: false }
  },
  // Financial details from conversion
  financialDetails: {
    totalCost: { type: Number, default: 0 },
    advanceReceived: { type: Number, default: 0 },
    includeGST: { type: Boolean, default: false },
    remainingAmount: { type: Number, default: 0 }
  },
  // Finished days (deadline from sales)
  finishedDays: {
    type: Number,
    min: 0
  },
  // Cost change history (embedded array for tracking cost increases)
  costHistory: [{
    previousCost: {
      type: Number,
      required: true,
      min: 0
    },
    newCost: {
      type: Number,
      required: true,
      min: 0
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Reason cannot exceed 500 characters']
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'changedByModel'
    },
    changedByModel: {
      type: String,
      required: true,
      enum: ['Sales', 'Admin', 'PM']
    },
    changedAt: {
      type: Date,
      default: Date.now
    }
  }]
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

// Method to create project from lead conversion
projectSchema.methods.createFromLeadConversion = function(leadProfileData, salesId) {
  this.originLead = leadProfileData.leadId;
  this.submittedBy = salesId;
  this.status = 'pending-assignment';
  
  // Set project type from lead profile
  if (leadProfileData.projectType) {
    this.projectType = {
      web: leadProfileData.projectType.web || false,
      app: leadProfileData.projectType.app || false,
      taxi: leadProfileData.projectType.taxi || false
    };
  }
  
  // Set financial details from conversion data
  if (leadProfileData.conversionData) {
    this.financialDetails = {
      totalCost: leadProfileData.conversionData.totalCost || 0,
      advanceReceived: leadProfileData.conversionData.advanceReceived || 0,
      includeGST: leadProfileData.conversionData.includeGST || false,
      remainingAmount: (leadProfileData.conversionData.totalCost || 0) - (leadProfileData.conversionData.advanceReceived || 0)
    };
    
    // Set budget from total cost
    this.budget = leadProfileData.conversionData.totalCost || 0;
  }
  
  // Set finished days
  if (leadProfileData.conversionData && leadProfileData.conversionData.finishedDays) {
    this.finishedDays = leadProfileData.conversionData.finishedDays;
  }
  
  // Set project name from conversion data
  if (leadProfileData.conversionData && leadProfileData.conversionData.projectName) {
    this.name = leadProfileData.conversionData.projectName;
  }
  
  return this.save();
};

// Method to update financial details
projectSchema.methods.updateFinancialDetails = function(financialData) {
  this.financialDetails = {
    ...this.financialDetails,
    ...financialData
  };
  
  // Recalculate remaining amount
  this.financialDetails.remainingAmount = this.financialDetails.totalCost - this.financialDetails.advanceReceived;
  
  // Update budget to match total cost
  this.budget = this.financialDetails.totalCost;
  
  return this.save();
};

// Method to update project type
projectSchema.methods.updateProjectType = function(projectTypeData) {
  this.projectType = {
    ...this.projectType,
    ...projectTypeData
  };
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
  
  // Custom validation: projectManager is required unless status is 'pending-assignment'
  if (this.status !== 'pending-assignment' && !this.projectManager) {
    return next(new Error('Project manager is required for projects with status other than pending-assignment'));
  }
  
  // Custom validation: dueDate is required unless status is 'pending-assignment'
  if (this.status !== 'pending-assignment' && !this.dueDate) {
    return next(new Error('Due date is required for projects with status other than pending-assignment'));
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

// Post-save middleware to handle incentive movement when project becomes "no dues"
projectSchema.post('save', async function(doc) {
  // Check if project is completed and has no dues
  const isCompleted = doc.status === 'completed';
  const remainingAmount = doc.financialDetails?.remainingAmount || 0;
  const isNoDues = isCompleted && Number(remainingAmount) === 0;
  
  if (isNoDues) {
    try {
      const Incentive = mongoose.model('Incentive');
      
      // Find all conversion-based incentives linked to this project that have pending balance
      const incentives = await Incentive.find({
        isConversionBased: true,
        projectId: doc._id,
        pendingBalance: { $gt: 0 }
      });
      
      if (incentives.length > 0) {
        // For each incentive, move the full pending amount to current
        // Since each conversion gets its own incentive, when that project becomes no-dues,
        // we move the full pending amount for that conversion
        for (const incentive of incentives) {
          if (incentive.pendingBalance > 0) {
            const amountToMove = incentive.pendingBalance;
            
            try {
              await incentive.movePendingToCurrent(amountToMove);
              console.log(`Moved ${amountToMove} from pending to current for incentive ${incentive._id} (project ${doc._id})`);
            } catch (moveError) {
              console.error(`Error moving pending to current for incentive ${incentive._id}:`, moveError);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing incentive movement for no-dues project:', error);
      // Don't fail the save operation
    }
  }
});

// Remove password and sensitive data from JSON output
projectSchema.methods.toJSON = function() {
  const project = this.toObject();
  return project;
};

// Post-save hook to create finance transaction when project is created with advanceReceived > 0
projectSchema.post('save', async function(doc) {
  // Only create transaction if advanceReceived > 0 and this is a new document
  if (doc.isNew && doc.financialDetails && doc.financialDetails.advanceReceived > 0) {
    try {
      const { createIncomingTransaction } = require('../utils/financeTransactionHelper');
      const AdminFinance = require('./AdminFinance');
      const Admin = require('./Admin');
      
      // Check if transaction already exists
      const existing = await AdminFinance.findOne({
        recordType: 'transaction',
        'metadata.sourceType': 'project_conversion',
        'metadata.projectId': doc._id.toString()
      });
      
      if (!existing) {
        // Find first active admin as createdBy
        const admin = await Admin.findOne({ isActive: true }).select('_id');
        const adminId = admin ? admin._id : null;
        
        if (adminId) {
          await createIncomingTransaction({
            amount: doc.financialDetails.advanceReceived,
            category: 'Advance Payment',
            transactionDate: doc.createdAt || new Date(),
            createdBy: adminId,
            client: doc.client,
            project: doc._id,
            description: `Advance payment received for project "${doc.name}"`,
            metadata: {
              sourceType: 'project_conversion',
              projectId: doc._id.toString()
            },
            checkDuplicate: true
          });
        }
      }
    } catch (error) {
      // Log error but don't fail the save
      console.error('Error creating finance transaction for project advance:', error);
    }
  }
});

module.exports = mongoose.model('Project', projectSchema);

