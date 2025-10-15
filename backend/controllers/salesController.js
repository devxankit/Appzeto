const jwt = require('jsonwebtoken');
const Sales = require('../models/Sales');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Login Sales
// @route   POST /api/sales/login
// @access  Public
const loginSales = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if Sales exists and include password for comparison
    const sales = await Sales.findOne({ email }).select('+password');
    
    if (!sales) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (sales.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Check if Sales is active
    if (!sales.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact system administrator.'
      });
    }

    // Check password
    const isPasswordValid = await sales.comparePassword(password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      await sales.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts and update last login
    await sales.resetLoginAttempts();

    // Generate JWT token
    const token = generateToken(sales._id);

    // Set cookie options
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    // Send response with token
    res.status(200)
      .cookie('salesToken', token, cookieOptions)
      .json({
        success: true,
        message: 'Login successful',
        data: {
          sales: {
            id: sales._id,
            name: sales.name,
            email: sales.email,
            role: sales.role,
            department: sales.department,
            employeeId: sales.employeeId,
            phone: sales.phone,
            lastLogin: sales.lastLogin,
            salesTarget: sales.salesTarget,
            currentSales: sales.currentSales,
            commissionRate: sales.commissionRate,
            experience: sales.experience,
            skills: sales.skills
          },
          token
        }
      });

  } catch (error) {
    console.error('Sales Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current Sales profile
// @route   GET /api/sales/profile
// @access  Private
const getSalesProfile = async (req, res) => {
  try {
    const sales = await Sales.findById(req.sales.id);
    
    if (!sales) {
      return res.status(404).json({
        success: false,
        message: 'Sales not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        sales: {
          id: sales._id,
          name: sales.name,
          email: sales.email,
          role: sales.role,
          department: sales.department,
          employeeId: sales.employeeId,
          phone: sales.phone,
          isActive: sales.isActive,
          lastLogin: sales.lastLogin,
          salesTarget: sales.salesTarget,
          currentSales: sales.currentSales,
          commissionRate: sales.commissionRate,
          experience: sales.experience,
          skills: sales.skills,
          leadsManaged: sales.leadsManaged,
          clientsManaged: sales.clientsManaged,
          createdAt: sales.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Get Sales profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

// @desc    Logout Sales
// @route   POST /api/sales/logout
// @access  Private
const logoutSales = async (req, res) => {
  try {
    res.cookie('salesToken', '', {
      expires: new Date(0),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Sales Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

// @desc    Create demo Sales (for development only)
// @route   POST /api/sales/create-demo
// @access  Public (remove in production)
const createDemoSales = async (req, res) => {
  try {
    // Check if demo Sales already exists
    const existingSales = await Sales.findOne({ email: 'sales@demo.com' });
    
    if (existingSales) {
      return res.status(400).json({
        success: false,
        message: 'Demo Sales already exists'
      });
    }

    // Create demo Sales
    const demoSales = await Sales.create({
      name: 'Demo Sales Representative',
      email: 'sales@demo.com',
      password: 'password123',
      role: 'sales',
      department: 'Sales',
      employeeId: 'SL001',
      phone: '+1234567890',
      salesTarget: 100000,
      currentSales: 25000,
      commissionRate: 5,
      skills: ['Sales', 'Lead Generation', 'Customer Relations'],
      experience: 2
    });

    res.status(201).json({
      success: true,
      message: 'Demo Sales created successfully',
      data: {
        sales: {
          id: demoSales._id,
          name: demoSales.name,
          email: demoSales.email,
          role: demoSales.role,
          department: demoSales.department,
          employeeId: demoSales.employeeId
        }
      }
    });

  } catch (error) {
    console.error('Create demo Sales error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating demo Sales'
    });
  }
};

module.exports = {
  loginSales,
  getSalesProfile,
  logoutSales,
  createDemoSales
};
