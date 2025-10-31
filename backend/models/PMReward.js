const mongoose = require('mongoose');

const pmRewardSchema = new mongoose.Schema({
  pmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PM',
    required: [true, 'PM ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    trim: true,
    maxlength: [200, 'Reason cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    enum: ['Performance Reward', 'Team Management', 'Client Satisfaction', 'Project Completion', 'Milestone Achievement', 'Quarterly Performance', 'Project Delivery Excellence', 'Client Retention', 'Team Collaboration', 'Other'],
    default: 'Performance Reward'
  },
  dateAwarded: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'paid'],
    default: 'paid'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Created by admin is required']
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  approvedAt: {
    type: Date
  },
  paidAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
pmRewardSchema.index({ pmId: 1 });
pmRewardSchema.index({ status: 1 });
pmRewardSchema.index({ dateAwarded: -1 });
pmRewardSchema.index({ createdAt: -1 });
pmRewardSchema.index({ pmId: 1, dateAwarded: -1 });

// Static method to get rewards by PM
pmRewardSchema.statics.getByPM = function(pmId) {
  return this.find({ pmId })
    .populate('createdBy', 'name')
    .populate('approvedBy', 'name')
    .sort({ dateAwarded: -1 });
};

// Static method to get rewards by status
pmRewardSchema.statics.getByStatus = function(status) {
  return this.find({ status })
    .populate('pmId', 'name email')
    .populate('createdBy', 'name')
    .populate('approvedBy', 'name')
    .sort({ dateAwarded: -1 });
};

module.exports = mongoose.model('PMReward', pmRewardSchema);

