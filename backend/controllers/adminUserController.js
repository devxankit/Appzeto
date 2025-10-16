const Admin = require('../models/Admin');
const PM = require('../models/PM');
const Sales = require('../models/Sales');
const Employee = require('../models/Employee');
const Client = require('../models/Client');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { uploadFile, deleteFile } = require('../services/cloudinaryService');

// @desc    Get all users with filtering and pagination
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = asyncHandler(async (req, res, next) => {
  const { role, team, department, status, search, page = 1, limit = 20 } = req.query;
  
  // Build filter object
  let filter = {};
  
  // Role filter
  if (role && role !== 'all') {
    if (role === 'admin-hr') {
      // Special handling for admin-hr filter
      filter.role = { $in: ['admin', 'hr'] };
    } else {
      filter.role = role;
    }
  }
  
  // Team filter (for employees)
  if (team && team !== 'all') {
    filter.team = team;
  }
  
  // Department filter (for employees)
  if (department && department !== 'all') {
    filter.department = department;
  }
  
  // Status filter
  if (status && status !== 'all') {
    filter.isActive = status === 'active';
  }
  
  // Search filter
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { phoneNumber: { $regex: search, $options: 'i' } }
    ];
  }

  // Calculate pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Get users from all collections
  const [admins, pms, sales, employees, clients] = await Promise.all([
    Admin.find(filter).select('-password -loginAttempts -lockUntil').skip(skip).limit(limitNum),
    PM.find(filter).select('-password -loginAttempts -lockUntil').skip(skip).limit(limitNum),
    Sales.find(filter).select('-password -loginAttempts -lockUntil').skip(skip).limit(limitNum),
    Employee.find(filter).select('-password -loginAttempts -lockUntil').skip(skip).limit(limitNum),
    Client.find(filter).select('-otp -otpExpires -otpAttempts -otpLockUntil -loginAttempts -lockUntil').skip(skip).limit(limitNum)
  ]);

  // Combine all users
  let allUsers = [
    ...admins.map(user => ({ ...user.toObject(), userType: 'admin' })),
    ...pms.map(user => ({ ...user.toObject(), userType: 'pm' })),
    ...sales.map(user => ({ ...user.toObject(), userType: 'sales' })),
    ...employees.map(user => ({ ...user.toObject(), userType: 'employee' })),
    ...clients.map(user => ({ ...user.toObject(), userType: 'client' }))
  ];

  // Get total counts for statistics
  const [adminCount, hrCount, pmCount, salesCount, employeeCount, clientCount] = await Promise.all([
    Admin.countDocuments({ role: 'admin' }),
    Admin.countDocuments({ role: 'hr' }),
    PM.countDocuments(),
    Sales.countDocuments(),
    Employee.countDocuments(),
    Client.countDocuments()
  ]);

  const [activeAdminCount, activeHrCount, activePmCount, activeSalesCount, activeEmployeeCount, activeClientCount] = await Promise.all([
    Admin.countDocuments({ role: 'admin', isActive: true }),
    Admin.countDocuments({ role: 'hr', isActive: true }),
    PM.countDocuments({ isActive: true }),
    Sales.countDocuments({ isActive: true }),
    Employee.countDocuments({ isActive: true }),
    Client.countDocuments({ isActive: true })
  ]);

  // Calculate statistics
  const statistics = {
    total: adminCount + hrCount + pmCount + salesCount + employeeCount + clientCount,
    admins: adminCount,
    hr: hrCount,
    projectManagers: pmCount,
    employees: salesCount + employeeCount,
    clients: clientCount,
    developers: employeeCount,
    salesTeam: salesCount,
    active: activeAdminCount + activeHrCount + activePmCount + activeSalesCount + activeEmployeeCount + activeClientCount,
    inactive: (adminCount + hrCount + pmCount + salesCount + employeeCount + clientCount) - (activeAdminCount + activeHrCount + activePmCount + activeSalesCount + activeEmployeeCount + activeClientCount)
  };

  res.status(200).json({
    success: true,
    count: allUsers.length,
    statistics,
    data: allUsers
  });
});

// @desc    Get single user by ID and type
// @route   GET /api/admin/users/:userType/:id
// @access  Private (Admin only)
const getUser = asyncHandler(async (req, res, next) => {
  const { userType, id } = req.params;
  
  let user;
  let Model;
  
  switch (userType) {
    case 'admin':
      Model = Admin;
      break;
    case 'pm':
      Model = PM;
      break;
    case 'sales':
      Model = Sales;
      break;
    case 'employee':
      Model = Employee;
      break;
    case 'client':
      Model = Client;
      break;
    default:
      return next(new ErrorResponse('Invalid user type', 400));
  }

  user = await Model.findById(id);
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: { ...user.toObject(), userType }
  });
});

// @desc    Create new user
// @route   POST /api/admin/users
// @access  Private (Admin only)
const createUser = asyncHandler(async (req, res, next) => {
  const { role, team, department, name, email, phone, dateOfBirth, joiningDate, status, password, confirmPassword } = req.body;

  // Validation
  if (!name || !email || !phone || !dateOfBirth || !joiningDate) {
    return next(new ErrorResponse('Please provide all required fields', 400));
  }

  // Password validation for non-client users
  if (role !== 'client') {
    if (!password || !confirmPassword) {
      return next(new ErrorResponse('Password and confirm password are required', 400));
    }
    if (password !== confirmPassword) {
      return next(new ErrorResponse('Passwords do not match', 400));
    }
    if (password.length < 6) {
      return next(new ErrorResponse('Password must be at least 6 characters long', 400));
    }
  }

  // Department validation for developer employees
  if (role === 'employee' && team === 'developer' && !department) {
    return next(new ErrorResponse('Please select a department for developer employees', 400));
  }

  let user;
  let userData = {
    name,
    email,
    phone: role === 'client' ? phone : phone,
    dateOfBirth: new Date(dateOfBirth),
    joiningDate: new Date(joiningDate),
    isActive: status === 'active'
  };

  // Handle document data if present (already uploaded to Cloudinary)
  if (req.body.document) {
    userData.document = req.body.document;
  }

  switch (role) {
    case 'admin':
    case 'hr':
      userData.role = role;
      userData.password = password;
      user = await Admin.create(userData);
      break;
      
    case 'project-manager':
      userData.role = 'project-manager';
      userData.password = password;
      user = await PM.create(userData);
      break;
      
    case 'employee':
      userData.role = 'employee';
      userData.team = team;
      userData.department = department;
      userData.password = password;
      userData.position = 'Developer'; // Default position
      
      if (team === 'sales') {
        user = await Sales.create(userData);
      } else {
        user = await Employee.create(userData);
      }
      break;
      
    case 'client':
      userData.role = 'client';
      userData.phoneNumber = phone; // Client uses phoneNumber field
      user = await Client.create(userData);
      break;
      
    default:
      return next(new ErrorResponse('Invalid role', 400));
  }

  res.status(201).json({
    success: true,
    data: { ...user.toObject(), userType: role === 'employee' ? (team === 'sales' ? 'sales' : 'employee') : role === 'project-manager' ? 'pm' : role }
  });
});

// @desc    Update user
// @route   PUT /api/admin/users/:userType/:id
// @access  Private (Admin only)
const updateUser = asyncHandler(async (req, res, next) => {
  const { userType, id } = req.params;
  const { name, email, phone, dateOfBirth, joiningDate, status, password, confirmPassword, team, department } = req.body;

  let user;
  let Model;
  
  switch (userType) {
    case 'admin':
      Model = Admin;
      break;
    case 'pm':
      Model = PM;
      break;
    case 'sales':
      Model = Sales;
      break;
    case 'employee':
      Model = Employee;
      break;
    case 'client':
      Model = Client;
      break;
    default:
      return next(new ErrorResponse('Invalid user type', 400));
  }

  user = await Model.findById(id);
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Update fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) {
    if (userType === 'client') {
      user.phoneNumber = phone;
    } else {
      user.phone = phone;
    }
  }
  if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
  if (joiningDate) user.joiningDate = new Date(joiningDate);
  if (status !== undefined) user.isActive = status === 'active';
  if (team) user.team = team;
  if (department) user.department = department;

  // Handle password update for non-client users
  if (userType !== 'client' && password) {
    if (!confirmPassword) {
      return next(new ErrorResponse('Please confirm password', 400));
    }
    if (password !== confirmPassword) {
      return next(new ErrorResponse('Passwords do not match', 400));
    }
    if (password.length < 6) {
      return next(new ErrorResponse('Password must be at least 6 characters long', 400));
    }
    user.password = password;
  }

  // Handle document update if present (already uploaded to Cloudinary)
  if (req.body.document) {
    // Delete old document from Cloudinary if exists
    if (user.document && user.document.public_id) {
      await deleteFile(user.document.public_id);
    }
    
    // Set new document data
    user.document = req.body.document;
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: { ...user.toObject(), userType }
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:userType/:id
// @access  Private (Admin only)
const deleteUser = asyncHandler(async (req, res, next) => {
  const { userType, id } = req.params;
  
  let user;
  let Model;
  
  switch (userType) {
    case 'admin':
      Model = Admin;
      break;
    case 'pm':
      Model = PM;
      break;
    case 'sales':
      Model = Sales;
      break;
    case 'employee':
      Model = Employee;
      break;
    case 'client':
      Model = Client;
      break;
    default:
      return next(new ErrorResponse('Invalid user type', 400));
  }

  user = await Model.findById(id);
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Delete associated document from Cloudinary if exists
  if (user.document && user.document.public_id) {
    try {
      await deleteFile(user.document.public_id);
    } catch (error) {
      console.error('Error deleting document from Cloudinary:', error);
    }
  }

  await Model.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Get user statistics
// @route   GET /api/admin/users/statistics
// @access  Private (Admin only)
const getUserStatistics = asyncHandler(async (req, res, next) => {
  const [adminCount, hrCount, pmCount, salesCount, employeeCount, clientCount] = await Promise.all([
    Admin.countDocuments({ role: 'admin' }),
    Admin.countDocuments({ role: 'hr' }),
    PM.countDocuments(),
    Sales.countDocuments(),
    Employee.countDocuments(),
    Client.countDocuments()
  ]);

  const [activeAdminCount, activeHrCount, activePmCount, activeSalesCount, activeEmployeeCount, activeClientCount] = await Promise.all([
    Admin.countDocuments({ role: 'admin', isActive: true }),
    Admin.countDocuments({ role: 'hr', isActive: true }),
    PM.countDocuments({ isActive: true }),
    Sales.countDocuments({ isActive: true }),
    Employee.countDocuments({ isActive: true }),
    Client.countDocuments({ isActive: true })
  ]);

  const statistics = {
    total: adminCount + hrCount + pmCount + salesCount + employeeCount + clientCount,
    admins: adminCount,
    hr: hrCount,
    projectManagers: pmCount,
    employees: salesCount + employeeCount,
    clients: clientCount,
    developers: employeeCount,
    salesTeam: salesCount,
    active: activeAdminCount + activeHrCount + activePmCount + activeSalesCount + activeEmployeeCount + activeClientCount,
    inactive: (adminCount + hrCount + pmCount + salesCount + employeeCount + clientCount) - (activeAdminCount + activeHrCount + activePmCount + activeSalesCount + activeEmployeeCount + activeClientCount)
  };

  res.status(200).json({
    success: true,
    data: statistics
  });
});

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStatistics
};
