const jwt = require('jsonwebtoken');
const PM = require('../models/PM');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Login PM
// @route   POST /api/pm/login
// @access  Public
const loginPM = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if PM exists and include password for comparison
    const pm = await PM.findOne({ email }).select('+password');
    
    if (!pm) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (pm.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Check if PM is active
    if (!pm.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact system administrator.'
      });
    }

    // Check password
    const isPasswordValid = await pm.comparePassword(password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      await pm.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts and update last login
    await pm.resetLoginAttempts();

    // Generate JWT token
    const token = generateToken(pm._id);

    // Set cookie options
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    // Send response with token
    res.status(200)
      .cookie('pmToken', token, cookieOptions)
      .json({
        success: true,
        message: 'Login successful',
        data: {
          pm: {
            id: pm._id,
            name: pm.name,
            email: pm.email,
            role: pm.role,
            department: pm.department,
            employeeId: pm.employeeId,
            phone: pm.phone,
            lastLogin: pm.lastLogin,
            experience: pm.experience,
            skills: pm.skills
          },
          token
        }
      });

  } catch (error) {
    console.error('PM Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current PM profile
// @route   GET /api/pm/profile
// @access  Private
const getPMProfile = async (req, res) => {
  try {
    const pm = await PM.findById(req.pm.id);
    
    if (!pm) {
      return res.status(404).json({
        success: false,
        message: 'PM not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        pm: {
          id: pm._id,
          name: pm.name,
          email: pm.email,
          role: pm.role,
          department: pm.department,
          employeeId: pm.employeeId,
          phone: pm.phone,
          isActive: pm.isActive,
          lastLogin: pm.lastLogin,
          experience: pm.experience,
          skills: pm.skills,
          projectsManaged: pm.projectsManaged,
          createdAt: pm.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Get PM profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

// @desc    Logout PM
// @route   POST /api/pm/logout
// @access  Private
const logoutPM = async (req, res) => {
  try {
    res.cookie('pmToken', '', {
      expires: new Date(0),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('PM Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

// @desc    Create demo PM (for development only)
// @route   POST /api/pm/create-demo
// @access  Public (remove in production)
const createDemoPM = async (req, res) => {
  try {
    // Check if demo PM already exists
    const existingPM = await PM.findOne({ email: 'pm@demo.com' });
    
    if (existingPM) {
      return res.status(400).json({
        success: false,
        message: 'Demo PM already exists'
      });
    }

    // Create demo PM
    const demoPM = await PM.create({
      name: 'Demo Project Manager',
      email: 'pm@demo.com',
      password: 'password123',
      role: 'PM',
      department: 'Development',
      employeeId: 'PM001',
      phone: '+1234567890',
      skills: ['Project Management', 'Agile', 'Scrum'],
      experience: 3
    });

    res.status(201).json({
      success: true,
      message: 'Demo PM created successfully',
      data: {
        pm: {
          id: demoPM._id,
          name: demoPM.name,
          email: demoPM.email,
          role: demoPM.role,
          department: demoPM.department,
          employeeId: demoPM.employeeId
        }
      }
    });

  } catch (error) {
    console.error('Create demo PM error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating demo PM'
    });
  }
};

module.exports = {
  loginPM,
  getPMProfile,
  logoutPM,
  createDemoPM
};
