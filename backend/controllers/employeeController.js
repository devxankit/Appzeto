const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Login Employee
// @route   POST /api/employee/login
// @access  Public
const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if Employee exists and include password for comparison
    const employee = await Employee.findOne({ email }).select('+password');
    
    if (!employee) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (employee.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Check if Employee is active
    if (!employee.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact system administrator.'
      });
    }

    // Check password
    const isPasswordValid = await employee.comparePassword(password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      await employee.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts and update last login
    await employee.resetLoginAttempts();

    // Generate JWT token
    const token = generateToken(employee._id);

    // Set cookie options
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    // Send response with token
    res.status(200)
      .cookie('employeeToken', token, cookieOptions)
      .json({
        success: true,
        message: 'Login successful',
        data: {
          employee: {
            id: employee._id,
            name: employee.name,
            email: employee.email,
            role: employee.role,
            department: employee.department,
            employeeId: employee.employeeId,
            phone: employee.phone,
            position: employee.position,
            joiningDate: employee.joiningDate,
            salary: employee.salary,
            lastLogin: employee.lastLogin,
            experience: employee.experience,
            skills: employee.skills
          },
          token
        }
      });

  } catch (error) {
    console.error('Employee Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current Employee profile
// @route   GET /api/employee/profile
// @access  Private
const getEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        employee: {
          id: employee._id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
          department: employee.department,
          employeeId: employee.employeeId,
          phone: employee.phone,
          position: employee.position,
          joiningDate: employee.joiningDate,
          salary: employee.salary,
          isActive: employee.isActive,
          lastLogin: employee.lastLogin,
          experience: employee.experience,
          skills: employee.skills,
          projectsAssigned: employee.projectsAssigned,
          tasksAssigned: employee.tasksAssigned,
          manager: employee.manager,
          createdAt: employee.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Get Employee profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

// @desc    Logout Employee
// @route   POST /api/employee/logout
// @access  Private
const logoutEmployee = async (req, res) => {
  try {
    res.cookie('employeeToken', '', {
      expires: new Date(0),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Employee Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

// @desc    Create demo Employee (for development only)
// @route   POST /api/employee/create-demo
// @access  Public (remove in production)
const createDemoEmployee = async (req, res) => {
  try {
    // Check if demo Employee already exists
    const existingEmployee = await Employee.findOne({ email: 'employee@demo.com' });
    
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Demo Employee already exists'
      });
    }

    // Create demo Employee
    const demoEmployee = await Employee.create({
      name: 'Demo Employee',
      email: 'employee@demo.com',
      password: 'password123',
      role: 'employee',
      department: 'Development',
      employeeId: 'EMP001',
      phone: '+1234567890',
      position: 'Software Developer',
      joiningDate: new Date('2023-01-15'),
      salary: 50000,
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      experience: 2
    });

    res.status(201).json({
      success: true,
      message: 'Demo Employee created successfully',
      data: {
        employee: {
          id: demoEmployee._id,
          name: demoEmployee.name,
          email: demoEmployee.email,
          role: demoEmployee.role,
          department: demoEmployee.department,
          employeeId: demoEmployee.employeeId
        }
      }
    });

  } catch (error) {
    console.error('Create demo Employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating demo Employee'
    });
  }
};

module.exports = {
  loginEmployee,
  getEmployeeProfile,
  logoutEmployee,
  createDemoEmployee
};
