const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const PM = require('../models/PM');

// @desc    Protect routes - verify JWT token
// @access  Private
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Try to find admin first
      let admin = await Admin.findById(decoded.id);
      if (admin && admin.isActive) {
        req.admin = admin;
        req.userType = 'admin';
        return next();
      }

      // Try to find PM if not admin
      let pm = await PM.findById(decoded.id);
      if (pm && pm.isActive) {
        req.pm = pm;
        req.userType = 'pm';
        return next();
      }

      // If neither admin nor PM found
      return res.status(401).json({
        success: false,
        message: 'No user found with this token'
      });

    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// @desc    Authorize specific roles
// @access  Private
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: `Admin role ${req.admin.role} is not authorized to access this route`
      });
    }

    next();
  };
};

// @desc    Check if user can access HR management (admin or hr)
// @access  Private
const canAccessHR = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  // Admin can access everything, HR can only access HR management
  if (req.admin.role === 'admin' || req.admin.role === 'hr') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions to access HR management'
    });
  }
};

// @desc    Check if user is admin (full access)
// @access  Private
const isAdmin = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  if (req.admin.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin role required to access this route'
    });
  }

  next();
};

// @desc    Optional auth - doesn't fail if no token
// @access  Public/Private
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get admin from token
        const admin = await Admin.findById(decoded.id);
        
        if (admin && admin.isActive) {
          req.admin = admin;
        }
      } catch (error) {
        // Token is invalid, but we don't fail the request
        console.log('Optional auth - invalid token:', error.message);
      }
    }

    next();

  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue even if there's an error
  }
};

module.exports = {
  protect,
  authorize,
  canAccessHR,
  isAdmin,
  optionalAuth
};
