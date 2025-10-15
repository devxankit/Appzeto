const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const salesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['sales'],
    default: 'sales'
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  // Sales specific fields
  salesTarget: {
    type: Number,
    min: 0,
    default: 0
  },
  currentSales: {
    type: Number,
    min: 0,
    default: 0
  },
  commissionRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  skills: [{
    type: String,
    trim: true
  }],
  experience: {
    type: Number,
    min: 0,
    default: 0
  },
  leadsManaged: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  }],
  clientsManaged: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  }]
}, {
  timestamps: true
});

// Index for better performance
salesSchema.index({ email: 1 });
salesSchema.index({ employeeId: 1 });

// Virtual for account lock status
salesSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Hash password before saving
salesSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
salesSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Increment login attempts
salesSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Reset login attempts
salesSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  });
};

// Remove password from JSON output
salesSchema.methods.toJSON = function() {
  const sales = this.toObject();
  delete sales.password;
  delete sales.loginAttempts;
  delete sales.lockUntil;
  return sales;
};

module.exports = mongoose.model('Sales', salesSchema);
