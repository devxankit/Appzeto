const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const Salary = require('../models/Salary');
const EmployeeReward = require('../models/EmployeeReward');
const emailService = require('../services/emailService');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// Helper to safely cast id
const safeObjectId = (value) => {
  try { return new mongoose.Types.ObjectId(value); } catch { return value; }
};

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
          isTeamLead: employee.isTeamLead || false,
          teamMembers: employee.teamMembers || [],
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
      team: 'developer',
      department: 'full-stack',
      phone: '+1234567890',
      dateOfBirth: new Date('1995-01-15'),
      joiningDate: new Date('2023-01-15'),
      position: 'Software Developer',
      employeeId: 'EMP001',
      salary: 50000,
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      experience: 2,
      isActive: true
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

// @desc    Get Employee wallet summary
// @route   GET /api/employee/wallet/summary
// @access  Private (Employee only)
const getWalletSummary = async (req, res) => {
  try {
    const employeeId = safeObjectId(req.employee.id);

    // Load Employee for fixed salary
    const employee = await Employee.findById(employeeId).select('fixedSalary name');
    const fixedSalary = Number(employee?.fixedSalary || 0);

    // Get current month dates
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Get salary for current month
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const currentMonthSalary = await Salary.findOne({
      employeeId: employeeId,
      employeeModel: 'Employee',
      month: currentMonthStr
    });

    const salaryStatus = currentMonthSalary?.status === 'paid' ? 'paid' : 'unpaid';

    // Get rewards for current month (paid status)
    const monthlyRewards = await EmployeeReward.aggregate([
      {
        $match: {
          employeeId: employeeId,
          status: 'paid',
          paidAt: { $gte: monthStart, $lte: monthEnd }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    const monthlyRewardsAmount = monthlyRewards.length > 0 ? monthlyRewards[0].total : 0;

    // Get all-time rewards total
    const allTimeRewards = await EmployeeReward.aggregate([
      {
        $match: {
          employeeId: employeeId,
          status: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    const allTimeRewardsAmount = allTimeRewards.length > 0 ? allTimeRewards[0].total : 0;

    // Get all-time salary total
    const allTimeSalary = await Salary.aggregate([
      {
        $match: {
          employeeId: employeeId,
          employeeModel: 'Employee',
          status: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$fixedSalary' }
        }
      }
    ]);
    const allTimeSalaryAmount = allTimeSalary.length > 0 ? allTimeSalary[0].total : 0;

    const totalEarnings = allTimeSalaryAmount + allTimeRewardsAmount;

    res.status(200).json({
      success: true,
      data: {
        monthlySalary: fixedSalary,
        monthlyRewards: monthlyRewardsAmount,
        totalEarnings: totalEarnings,
        salaryStatus: salaryStatus
      }
    });
  } catch (error) {
    console.error('Get wallet summary error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch wallet summary' });
  }
};

// @desc    Get Employee wallet transactions
// @route   GET /api/employee/wallet/transactions
// @access  Private (Employee only)
const getWalletTransactions = async (req, res) => {
  try {
    const employeeId = safeObjectId(req.employee.id);
    const { limit = 50 } = req.query;

    // Get all salaries (paid)
    const salaries = await Salary.find({
      employeeId: employeeId,
      employeeModel: 'Employee',
      status: 'paid'
    })
      .select('fixedSalary month paidDate status')
      .sort({ paidDate: -1 })
      .limit(parseInt(limit));

    // Get all rewards (paid)
    const rewards = await EmployeeReward.find({
      employeeId: employeeId,
      status: 'paid'
    })
      .select('amount reason description category dateAwarded paidAt')
      .sort({ paidAt: -1 })
      .limit(parseInt(limit));

    // Combine and format transactions
    const transactions = [];

    // Add salary transactions
    salaries.forEach(salary => {
      const paidDate = salary.paidDate || new Date();
      transactions.push({
        id: `salary-${salary.month}`,
        amount: salary.fixedSalary,
        type: 'salary',
        date: paidDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        category: 'Fixed Salary',
        description: `Monthly Salary - ${new Date(salary.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
        status: 'Paid'
      });
    });

    // Add reward transactions
    rewards.forEach(reward => {
      const paidDate = reward.paidAt || reward.dateAwarded || new Date();
      transactions.push({
        id: `reward-${reward._id}`,
        amount: reward.amount,
        type: 'reward',
        date: paidDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        category: reward.category || 'Performance Reward',
        description: reward.description || reward.reason,
        status: 'Paid'
      });
    });

    // Sort by date descending
    transactions.sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateB - dateA;
    });

    // Limit results
    const limitedTransactions = transactions.slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      data: limitedTransactions,
      count: limitedTransactions.length
    });
  } catch (error) {
    console.error('Get wallet transactions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch wallet transactions' });
  }
};

// @desc    Forgot password
// @route   POST /api/employee/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorResponse('Please provide an email address', 400));
  }

  const employee = await Employee.findOne({ email });

  if (!employee) {
    return res.status(200).json({
      success: true,
      message: 'If that email exists, a password reset link has been sent'
    });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  employee.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  employee.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

  await employee.save({ validateBeforeSave: false });

  try {
    await emailService.sendPasswordResetEmail(employee.email, resetToken, 'employee');

    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully'
    });
  } catch (error) {
    console.error('Email sending error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      email: employee.email
    });
    employee.resetPasswordToken = undefined;
    employee.resetPasswordExpire = undefined;
    await employee.save({ validateBeforeSave: false });

    return next(new ErrorResponse(`Email could not be sent: ${error.message}`, 500));
  }
});

// @desc    Reset password
// @route   PUT /api/employee/reset-password/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const resetToken = req.params.resettoken;

  if (!password) {
    return next(new ErrorResponse('Please provide a password', 400));
  }

  if (password.length < 6) {
    return next(new ErrorResponse('Password must be at least 6 characters', 400));
  }

  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const employee = await Employee.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  }).select('+password');

  if (!employee) {
    return next(new ErrorResponse('Invalid or expired reset token', 400));
  }

  employee.password = password;
  employee.resetPasswordToken = undefined;
  employee.resetPasswordExpire = undefined;
  await employee.save();

  const token = generateToken(employee._id);

  res.status(200).json({
    success: true,
    message: 'Password reset successful',
    token
  });
});

// @desc    Get my team (for developer team leads only)
// @route   GET /api/employee/my-team
// @access  Private (Employee - Team Lead only)
const getMyTeam = async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee.id)
      .select('name email position department isTeamLead teamMembers')
      .populate('teamMembers', 'name email phone position department experience skills');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    if (!employee.isTeamLead) {
      return res.status(403).json({
        success: false,
        message: 'Only team leads can access this endpoint'
      });
    }

    const teamMembers = (employee.teamMembers || []).map((m) => ({
      id: m._id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      position: m.position,
      department: m.department,
      experience: m.experience,
      skills: m.skills || []
    }));

    res.status(200).json({
      success: true,
      data: {
        teamLead: {
          id: employee._id,
          name: employee.name,
          email: employee.email,
          position: employee.position,
          department: employee.department
        },
        teamMembers,
        teamStats: {
          totalMembers: teamMembers.length
        }
      }
    });
  } catch (error) {
    console.error('Get my team error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching team'
    });
  }
};

module.exports = {
  loginEmployee,
  getEmployeeProfile,
  logoutEmployee,
  createDemoEmployee,
  getWalletSummary,
  getWalletTransactions,
  forgotPassword,
  resetPassword,
  getMyTeam
};
