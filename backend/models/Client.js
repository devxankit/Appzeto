const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  role: {
    type: String,
    enum: ['client'],
    default: 'client'
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
  // OTP related fields
  otp: {
    type: String,
    select: false // Don't include OTP in queries by default
  },
  otpExpires: {
    type: Date,
    select: false
  },
  otpAttempts: {
    type: Number,
    default: 0
  },
  otpLockUntil: {
    type: Date
  },
  // Client specific fields
  companyName: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  industry: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  // Client preferences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'Asia/Kolkata' }
  }
}, {
  timestamps: true
});

// Index for better performance
// Indexes are automatically created by unique: true in schema definition

// Virtual for account lock status
clientSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual for OTP lock status
clientSchema.virtual('isOtpLocked').get(function() {
  return !!(this.otpLockUntil && this.otpLockUntil > Date.now());
});

// Virtual for OTP validity
clientSchema.virtual('isOtpValid').get(function() {
  return !!(this.otp && this.otpExpires && this.otpExpires > Date.now());
});

// Generate OTP
clientSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.otp = otp;
  this.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
  this.otpAttempts = 0;
  this.otpLockUntil = undefined;
  return otp;
};

// Verify OTP
clientSchema.methods.verifyOTP = function(candidateOTP) {
  if (!this.otp || !this.otpExpires) {
    return false;
  }
  
  if (this.otpExpires < Date.now()) {
    return false;
  }
  
  return this.otp === candidateOTP;
};

// Increment OTP attempts
clientSchema.methods.incOtpAttempts = function() {
  // If we have a previous OTP lock that has expired, restart at 1
  if (this.otpLockUntil && this.otpLockUntil < Date.now()) {
    return this.updateOne({
      $unset: { otpLockUntil: 1 },
      $set: { otpAttempts: 1 }
    });
  }
  
  const updates = { $inc: { otpAttempts: 1 } };
  
  // Lock OTP after 3 failed attempts for 15 minutes
  if (this.otpAttempts + 1 >= 3 && !this.isOtpLocked) {
    updates.$set = { otpLockUntil: Date.now() + 15 * 60 * 1000 }; // 15 minutes
  }
  
  return this.updateOne(updates);
};

// Clear OTP
clientSchema.methods.clearOTP = function() {
  this.otp = undefined;
  this.otpExpires = undefined;
  this.otpAttempts = 0;
  this.otpLockUntil = undefined;
  return this.save();
};

// Increment login attempts
clientSchema.methods.incLoginAttempts = function() {
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
clientSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  });
};

// Sign JWT and return
clientSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Remove sensitive data from JSON output
clientSchema.methods.toJSON = function() {
  const client = this.toObject();
  delete client.otp;
  delete client.otpExpires;
  delete client.otpAttempts;
  delete client.otpLockUntil;
  delete client.loginAttempts;
  delete client.lockUntil;
  return client;
};

module.exports = mongoose.model('Client', clientSchema);
