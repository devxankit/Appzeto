const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  // Module that created this request (e.g., 'sales', 'admin', 'pm')
  module: {
    type: String,
    required: true,
    enum: ['sales', 'admin', 'pm', 'client'],
    trim: true
  },
  // Type of request (extensible for future types)
  requestType: {
    type: String,
    required: true,
    enum: ['accelerate_work', 'hold_work'],
    trim: true
  },
  // Related client (required)
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  // Related project (required)
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  // Reason for the request
  reason: {
    type: String,
    required: true,
    trim: true,
    maxlength: [1000, 'Reason cannot exceed 1000 characters']
  },
  // Who created this request (polymorphic - can be Sales, Admin, PM, etc.)
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'requestedByModel'
  },
  requestedByModel: {
    type: String,
    required: true,
    enum: ['Sales', 'Admin', 'PM', 'Client']
  },
  // Who handled this request (admin)
  handledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  handledAt: {
    type: Date
  },
  // Request status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  // Admin response/notes
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Indexes for better performance
requestSchema.index({ module: 1, status: 1 });
requestSchema.index({ client: 1 });
requestSchema.index({ project: 1 });
requestSchema.index({ requestedBy: 1 });
requestSchema.index({ createdAt: -1 });

// Virtual for checking if request is pending
requestSchema.virtual('isPending').get(function() {
  return this.status === 'pending';
});

// Method to approve request
requestSchema.methods.approve = function(adminId, notes) {
  this.status = 'approved';
  this.handledBy = adminId;
  this.handledAt = new Date();
  if (notes) {
    this.adminNotes = notes;
  }
  return this.save();
};

// Method to reject request
requestSchema.methods.reject = function(adminId, notes) {
  this.status = 'rejected';
  this.handledBy = adminId;
  this.handledAt = new Date();
  if (notes) {
    this.adminNotes = notes;
  }
  return this.save();
};

// Remove sensitive data from JSON output
requestSchema.methods.toJSON = function() {
  const request = this.toObject();
  return request;
};

module.exports = mongoose.model('Request', requestSchema);

