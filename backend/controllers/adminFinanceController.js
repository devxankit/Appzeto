const AdminFinance = require('../models/AdminFinance');
const Client = require('../models/Client');
const Project = require('../models/Project');
const Employee = require('../models/Employee');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a new transaction
// @route   POST /api/admin/finance/transactions
// @access  Admin only
const createTransaction = asyncHandler(async (req, res, next) => {
  // Check if admin is authenticated
  if (!req.admin || !req.admin._id) {
    return next(new ErrorResponse('Admin authentication required', 401));
  }

  const {
    type, // 'incoming' or 'outgoing'
    category,
    amount,
    date,
    client, // Can be client ID or client name (string)
    project, // Can be project ID or project name (string)
    employee, // Can be employee ID or employee name (string)
    vendor, // Vendor name for outgoing transactions
    method, // Payment method
    description,
    account // Optional account reference
  } = req.body;

  // Validate required fields
  if (!type || !category || !amount || !date) {
    return next(new ErrorResponse('Transaction type, category, amount, and date are required', 400));
  }

  if (!['incoming', 'outgoing'].includes(type)) {
    return next(new ErrorResponse('Transaction type must be either "incoming" or "outgoing"', 400));
  }

  // Parse client if provided (can be ID or name)
  let clientId = null;
  if (client) {
    // Check if it's an ObjectId format
    if (client.match(/^[0-9a-fA-F]{24}$/)) {
      const clientDoc = await Client.findById(client);
      if (clientDoc) {
        clientId = client;
      }
    } else {
      // It's a name, try to find by name
      const clientDoc = await Client.findOne({ name: { $regex: new RegExp(client, 'i') } });
      if (clientDoc) {
        clientId = clientDoc._id;
      } else {
        // Store as vendor name if client not found
        vendor = vendor || client;
      }
    }
  }

  // Parse project if provided (can be ID or name)
  let projectId = null;
  if (project) {
    if (project.match(/^[0-9a-fA-F]{24}$/)) {
      const projectDoc = await Project.findById(project);
      if (projectDoc) {
        projectId = project;
      }
    } else {
      // It's a name, try to find by name
      const projectDoc = await Project.findOne({ name: { $regex: new RegExp(project, 'i') } });
      if (projectDoc) {
        projectId = projectDoc._id;
      }
    }
  }

  // Parse employee if provided (can be ID or name)
  let employeeId = null;
  if (employee) {
    if (employee.match(/^[0-9a-fA-F]{24}$/)) {
      const employeeDoc = await Employee.findById(employee);
      if (employeeDoc) {
        employeeId = employee;
      }
    } else {
      // It's a name, try to find by name
      const employeeDoc = await Employee.findOne({ name: { $regex: new RegExp(employee, 'i') } });
      if (employeeDoc) {
        employeeId = employeeDoc._id;
      } else {
        // Store as vendor name if employee not found and it's outgoing
        if (type === 'outgoing') {
          vendor = vendor || employee;
        }
      }
    }
  }

  // Create transaction record
  const transactionData = {
    recordType: 'transaction',
    transactionType: type,
    category,
    amount: parseFloat(amount),
    transactionDate: new Date(date),
    paymentMethod: method || 'Bank Transfer',
    description: description || '',
    createdBy: req.admin._id,
    status: 'completed' // Transactions are typically completed when created
  };

  console.log('Creating transaction with data:', transactionData);

  // Add optional references
  if (clientId) transactionData.client = clientId;
  if (projectId) transactionData.project = projectId;
  if (employeeId) transactionData.employee = employeeId;
  if (vendor) transactionData.vendor = vendor;
  
  // Handle account ID if provided
  if (account) {
    // Check if account is a valid ObjectId
    if (account.match(/^[0-9a-fA-F]{24}$/)) {
      transactionData.account = account;
    } else {
      console.warn('Invalid account ID provided:', account);
    }
  }

  try {
    const transaction = await AdminFinance.create(transactionData);

    // Populate references for response
    await transaction.populate([
      { path: 'client', select: 'name email phoneNumber companyName' },
      { path: 'project', select: 'name status' },
      { path: 'employee', select: 'name email department' },
      { path: 'account', select: 'name bankName accountNumber' },
      { path: 'createdBy', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((errItem) => errItem.message).join(', ');
      return next(new ErrorResponse(messages, 400));
    }
    
    // Return more detailed error message
    const errorMessage = error.message || 'Failed to create transaction';
    return next(new ErrorResponse(errorMessage, 500));
  }
});

// @desc    Get all transactions
// @route   GET /api/admin/finance/transactions
// @access  Admin only
const getTransactions = asyncHandler(async (req, res, next) => {
  const {
    type, // 'incoming' or 'outgoing'
    status,
    category,
    startDate,
    endDate,
    page = 1,
    limit = 20,
    search
  } = req.query;

  // Build filter
  const filter = {
    recordType: 'transaction'
  };

  if (type) filter.transactionType = type;
  if (status) filter.status = status;
  if (category) filter.category = { $regex: category, $options: 'i' };

  // Date range filter
  if (startDate || endDate) {
    filter.transactionDate = {};
    if (startDate) filter.transactionDate.$gte = new Date(startDate);
    if (endDate) filter.transactionDate.$lte = new Date(endDate);
  }

  // Search filter
  if (search) {
    filter.$or = [
      { category: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { vendor: { $regex: search, $options: 'i' } }
    ];
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const transactions = await AdminFinance.find(filter)
    .populate('client', 'name email phoneNumber companyName')
    .populate('project', 'name status')
    .populate('employee', 'name email department')
    .populate('account', 'name bankName accountNumber')
    .populate('createdBy', 'name email')
    .sort({ transactionDate: -1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await AdminFinance.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: transactions.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: transactions
  });
});

// @desc    Get single transaction
// @route   GET /api/admin/finance/transactions/:id
// @access  Admin only
const getTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await AdminFinance.findOne({
    _id: req.params.id,
    recordType: 'transaction'
  })
    .populate('client', 'name email phoneNumber companyName')
    .populate('project', 'name status')
    .populate('employee', 'name email department')
    .populate('account', 'name bankName accountNumber')
    .populate('createdBy', 'name email');

  if (!transaction) {
    return next(new ErrorResponse('Transaction not found', 404));
  }

  res.status(200).json({
    success: true,
    data: transaction
  });
});

// @desc    Update transaction
// @route   PUT /api/admin/finance/transactions/:id
// @access  Admin only
const updateTransaction = asyncHandler(async (req, res, next) => {
  const {
    type,
    category,
    amount,
    date,
    client,
    project,
    employee,
    vendor,
    method,
    description,
    status,
    account
  } = req.body;

  let transaction = await AdminFinance.findOne({
    _id: req.params.id,
    recordType: 'transaction'
  });

  if (!transaction) {
    return next(new ErrorResponse('Transaction not found', 404));
  }

  // Update fields
  if (type) transaction.transactionType = type;
  if (category) transaction.category = category;
  if (amount !== undefined) transaction.amount = parseFloat(amount);
  if (date) transaction.transactionDate = new Date(date);
  if (method) transaction.paymentMethod = method;
  if (description !== undefined) transaction.description = description;
  if (status) transaction.status = status;
  if (account) transaction.account = account;

  // Handle client update
  if (client !== undefined) {
    if (client === null || client === '') {
      transaction.client = null;
    } else if (client.match(/^[0-9a-fA-F]{24}$/)) {
      const clientDoc = await Client.findById(client);
      if (clientDoc) {
        transaction.client = client;
      }
    } else {
      const clientDoc = await Client.findOne({ name: { $regex: new RegExp(client, 'i') } });
      if (clientDoc) {
        transaction.client = clientDoc._id;
      } else {
        transaction.vendor = vendor || client;
        transaction.client = null;
      }
    }
  }

  // Handle project update
  if (project !== undefined) {
    if (project === null || project === '') {
      transaction.project = null;
    } else if (project.match(/^[0-9a-fA-F]{24}$/)) {
      const projectDoc = await Project.findById(project);
      if (projectDoc) {
        transaction.project = project;
      }
    } else {
      const projectDoc = await Project.findOne({ name: { $regex: new RegExp(project, 'i') } });
      if (projectDoc) {
        transaction.project = projectDoc._id;
      } else {
        transaction.project = null;
      }
    }
  }

  // Handle employee update
  if (employee !== undefined) {
    if (employee === null || employee === '') {
      transaction.employee = null;
    } else if (employee.match(/^[0-9a-fA-F]{24}$/)) {
      const employeeDoc = await Employee.findById(employee);
      if (employeeDoc) {
        transaction.employee = employee;
      }
    } else {
      const employeeDoc = await Employee.findOne({ name: { $regex: new RegExp(employee, 'i') } });
      if (employeeDoc) {
        transaction.employee = employeeDoc._id;
      } else {
        if (transaction.transactionType === 'outgoing') {
          transaction.vendor = vendor || employee;
        }
        transaction.employee = null;
      }
    }
  }

  if (vendor !== undefined) transaction.vendor = vendor;

  await transaction.save();

  // Populate references for response
  await transaction.populate([
    { path: 'client', select: 'name email phoneNumber companyName' },
    { path: 'project', select: 'name status' },
    { path: 'employee', select: 'name email department' },
    { path: 'account', select: 'name bankName accountNumber' },
    { path: 'createdBy', select: 'name email' }
  ]);

  res.status(200).json({
    success: true,
    data: transaction
  });
});

// @desc    Delete transaction
// @route   DELETE /api/admin/finance/transactions/:id
// @access  Admin only
const deleteTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await AdminFinance.findOne({
    _id: req.params.id,
    recordType: 'transaction'
  });

  if (!transaction) {
    return next(new ErrorResponse('Transaction not found', 404));
  }

  await transaction.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get transaction statistics
// @route   GET /api/admin/finance/transactions/stats
// @access  Admin only
const getTransactionStats = asyncHandler(async (req, res, next) => {
  const { timeFilter = 'all' } = req.query;

  const stats = await AdminFinance.getFinanceStatistics(timeFilter);

  // Get additional stats
  const totalTransactions = await AdminFinance.countDocuments({ recordType: 'transaction' });
  const pendingTransactions = await AdminFinance.countDocuments({
    recordType: 'transaction',
    status: 'pending'
  });
  const completedTransactions = await AdminFinance.countDocuments({
    recordType: 'transaction',
    status: 'completed'
  });

  res.status(200).json({
    success: true,
    data: {
      ...stats,
      totalTransactions,
      pendingTransactions,
      completedTransactions
    }
  });
});

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
};
