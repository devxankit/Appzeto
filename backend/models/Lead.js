const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  name: {
    type: String,
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  status: {
    type: String,
    enum: ['new', 'connected', 'hot', 'converted', 'lost'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  source: {
    type: String,
    enum: ['manual', 'bulk_upload'],
    default: 'manual'
  },
  value: {
    type: Number,
    min: 0,
    default: 0
  },
  lastContactDate: {
    type: Date
  },
  nextFollowUpDate: {
    type: Date
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sales'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LeadCategory',
    required: [true, 'Category is required']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Created by admin is required']
  }
}, {
  timestamps: true
});

// Indexes for better performance
leadSchema.index({ phone: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ category: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ priority: 1 });
leadSchema.index({ createdAt: -1 });

// Virtual for formatted phone number
leadSchema.virtual('formattedPhone').get(function() {
  if (this.phone && this.phone.length === 10) {
    return `+91 ${this.phone.slice(0, 5)} ${this.phone.slice(5)}`;
  }
  return this.phone;
});

// Virtual for days since last contact
leadSchema.virtual('daysSinceLastContact').get(function() {
  if (!this.lastContactDate) return null;
  const now = new Date();
  const diffTime = Math.abs(now - this.lastContactDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for days until next follow-up
leadSchema.virtual('daysUntilFollowUp').get(function() {
  if (!this.nextFollowUpDate) return null;
  const now = new Date();
  const diffTime = this.nextFollowUpDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to update status
leadSchema.methods.updateStatus = function(newStatus) {
  const validTransitions = {
    'new': ['connected', 'lost'],
    'connected': ['hot', 'lost'],
    'hot': ['converted', 'lost'],
    'converted': [], // Final state
    'lost': [] // Final state
  };

  if (!validTransitions[this.status].includes(newStatus)) {
    throw new Error(`Invalid status transition from ${this.status} to ${newStatus}`);
  }

  this.status = newStatus;
  if (newStatus === 'converted' || newStatus === 'lost') {
    this.lastContactDate = new Date();
  }
  return this.save();
};

// Method to assign to sales employee
leadSchema.methods.assignToSales = function(salesId) {
  this.assignedTo = salesId;
  this.lastContactDate = new Date();
  return this.save();
};

// Static method to get leads by status
leadSchema.statics.getLeadsByStatus = function(status) {
  return this.find({ status }).populate('category', 'name color').populate('assignedTo', 'name email');
};

// Static method to get unassigned leads
leadSchema.statics.getUnassignedLeads = function() {
  return this.find({ assignedTo: null }).populate('category', 'name color');
};

// Static method to get leads by category
leadSchema.statics.getLeadsByCategory = function(categoryId) {
  return this.find({ category: categoryId }).populate('assignedTo', 'name email');
};

// Static method to get conversion rate
leadSchema.statics.getConversionRate = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        converted: {
          $sum: {
            $cond: [{ $eq: ['$status', 'converted'] }, 1, 0]
          }
        }
      }
    },
    {
      $project: {
        conversionRate: {
          $multiply: [
            { $divide: ['$converted', '$total'] },
            100
          ]
        },
        totalLeads: '$total',
        convertedLeads: '$converted'
      }
    }
  ]);
};

// Remove sensitive data from JSON output
leadSchema.methods.toJSON = function() {
  const lead = this.toObject();
  return lead;
};

module.exports = mongoose.model('Lead', leadSchema);
