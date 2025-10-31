const AdminFinance = require('../models/AdminFinance');
const Account = require('../models/Account');
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
  
  // Handle account ID if provided (only for incoming transactions)
  if (account && type === 'incoming') {
    // Check if account is a valid ObjectId
    if (account.match(/^[0-9a-fA-F]{24}$/)) {
      const accountDoc = await Account.findById(account);
      if (!accountDoc) {
        return next(new ErrorResponse('Account not found', 404));
      }
      if (!accountDoc.isActive) {
        return next(new ErrorResponse('Cannot use inactive account', 400));
      }
      transactionData.account = account;
      // Update account last used
      accountDoc.updateLastUsed();
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

// ========== ACCOUNT MANAGEMENT ==========

// @desc    Get all accounts
// @route   GET /api/admin/finance/accounts
// @access  Admin only
const getAccounts = asyncHandler(async (req, res, next) => {
  const { isActive } = req.query;
  
  const filter = {};
  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  const accounts = await Account.find(filter)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: accounts.length,
    data: accounts
  });
});

// @desc    Get single account
// @route   GET /api/admin/finance/accounts/:id
// @access  Admin only
const getAccount = asyncHandler(async (req, res, next) => {
  const account = await Account.findById(req.params.id)
    .populate('createdBy', 'name email');

  if (!account) {
    return next(new ErrorResponse('Account not found', 404));
  }

  res.status(200).json({
    success: true,
    data: account
  });
});

// @desc    Create new account
// @route   POST /api/admin/finance/accounts
// @access  Admin only
const createAccount = asyncHandler(async (req, res, next) => {
  // Check if admin is authenticated
  if (!req.admin || !req.admin._id) {
    return next(new ErrorResponse('Admin authentication required', 401));
  }

  const {
    accountName,
    bankName,
    accountNumber,
    ifscCode,
    branchName,
    accountType,
    description,
    isActive
  } = req.body;

  // Validate required fields
  if (!accountName || !bankName || !accountNumber) {
    return next(new ErrorResponse('Account name, bank name, and account number are required', 400));
  }

  // Check if account number already exists
  const existingAccount = await Account.findOne({ accountNumber });
  if (existingAccount) {
    return next(new ErrorResponse('Account with this account number already exists', 400));
  }

  const accountData = {
    accountName,
    bankName,
    accountNumber,
    ifscCode: ifscCode ? ifscCode.toUpperCase() : undefined,
    branchName,
    accountType: accountType || 'current',
    description,
    isActive: isActive !== undefined ? isActive : true,
    createdBy: req.admin._id
  };

  const account = await Account.create(accountData);

  await account.populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: account
  });
});

// @desc    Update account
// @route   PUT /api/admin/finance/accounts/:id
// @access  Admin only
const updateAccount = asyncHandler(async (req, res, next) => {
  const {
    accountName,
    bankName,
    accountNumber,
    ifscCode,
    branchName,
    accountType,
    description,
    isActive
  } = req.body;

  let account = await Account.findById(req.params.id);

  if (!account) {
    return next(new ErrorResponse('Account not found', 404));
  }

  // Check if account number is being changed and if it already exists
  if (accountNumber && accountNumber !== account.accountNumber) {
    const existingAccount = await Account.findOne({ accountNumber });
    if (existingAccount) {
      return next(new ErrorResponse('Account with this account number already exists', 400));
    }
  }

  // Update fields
  if (accountName !== undefined) account.accountName = accountName;
  if (bankName !== undefined) account.bankName = bankName;
  if (accountNumber !== undefined) account.accountNumber = accountNumber;
  if (ifscCode !== undefined) account.ifscCode = ifscCode ? ifscCode.toUpperCase() : ifscCode;
  if (branchName !== undefined) account.branchName = branchName;
  if (accountType !== undefined) account.accountType = accountType;
  if (description !== undefined) account.description = description;
  if (isActive !== undefined) account.isActive = isActive;

  await account.save();

  await account.populate('createdBy', 'name email');

  res.status(200).json({
    success: true,
    message: 'Account updated successfully',
    data: account
  });
});

// @desc    Delete account
// @route   DELETE /api/admin/finance/accounts/:id
// @access  Admin only
const deleteAccount = asyncHandler(async (req, res, next) => {
  const account = await Account.findById(req.params.id);

  if (!account) {
    return next(new ErrorResponse('Account not found', 404));
  }

  // Check if account is used in any transactions
  const transactionCount = await AdminFinance.countDocuments({ account: account._id });
  if (transactionCount > 0) {
    return next(new ErrorResponse(`Cannot delete account. It is used in ${transactionCount} transaction(s)`, 400));
  }

  await account.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully',
    data: {}
  });
});

// ========== EXPENSE MANAGEMENT ==========

// @desc    Get all expenses (outgoing transactions)
// @route   GET /api/admin/finance/expenses
// @access  Admin only
const getExpenses = asyncHandler(async (req, res, next) => {
  const {
    status,
    category,
    startDate,
    endDate,
    page = 1,
    limit = 20,
    search
  } = req.query;

  // Build filter - expenses are outgoing transactions
  const filter = {
    recordType: 'transaction',
    transactionType: 'outgoing'
  };

  if (status) filter.status = status;
  if (category) filter.category = { $regex: category, $options: 'i' };

  // Date range filter
  if (startDate || endDate) {
    filter.transactionDate = {};
    if (startDate) filter.transactionDate.$gte = new Date(startDate);
    if (endDate) filter.transactionDate.$lte = new Date(endDate);
  }

  // Search filter - MongoDB will automatically AND this with other conditions
  if (search) {
    filter.$or = [
      { category: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { vendor: { $regex: search, $options: 'i' } }
    ];
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const expenses = await AdminFinance.find(filter)
      .populate({
        path: 'employee',
        select: 'name email department',
        strictPopulate: false // Don't throw error if reference doesn't exist
      })
      .populate({
        path: 'client',
        select: 'name email companyName',
        strictPopulate: false
      })
      .populate({
        path: 'project',
        select: 'name status',
        strictPopulate: false
      })
      .populate({
        path: 'createdBy',
        select: 'name email',
        strictPopulate: false
      })
      .sort({ transactionDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await AdminFinance.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: expenses.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: expenses
    });
  } catch (error) {
    console.error('Error in getExpenses:', error);
    return next(new ErrorResponse(error.message || 'Failed to fetch expenses', 500));
  }
});

// @desc    Get single expense (outgoing transaction)
// @route   GET /api/admin/finance/expenses/:id
// @access  Admin only
const getExpense = asyncHandler(async (req, res, next) => {
  const expense = await AdminFinance.findOne({
    _id: req.params.id,
    recordType: 'transaction',
    transactionType: 'outgoing'
  })
    .populate('employee', 'name email department')
    .populate('client', 'name email companyName')
    .populate('project', 'name status')
    .populate('createdBy', 'name email');

  if (!expense) {
    return next(new ErrorResponse('Expense not found', 404));
  }

  res.status(200).json({
    success: true,
    data: expense
  });
});

// @desc    Create new expense (outgoing transaction)
// @route   POST /api/admin/finance/expenses
// @access  Admin only
const createExpense = asyncHandler(async (req, res, next) => {
  // Check if admin is authenticated
  if (!req.admin || !req.admin._id) {
    return next(new ErrorResponse('Admin authentication required', 401));
  }

  const {
    category,
    amount,
    date,
    description
  } = req.body;

  // Validate required fields
  if (!category || !amount || !date) {
    return next(new ErrorResponse('Category, amount, and date are required', 400));
  }

  // Create expense as outgoing transaction
  const expenseData = {
    recordType: 'transaction',
    transactionType: 'outgoing', // Expenses are outgoing transactions
    category,
    amount: parseFloat(amount),
    transactionDate: new Date(date),
    description: description || '',
    createdBy: req.admin._id,
    status: 'completed' // Expenses are typically completed when created
  };

  try {
    const expense = await AdminFinance.create(expenseData);

    // Populate references for response
    await expense.populate([
      { path: 'employee', select: 'name email department' },
      { path: 'client', select: 'name email companyName' },
      { path: 'project', select: 'name status' },
      { path: 'createdBy', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((errItem) => errItem.message).join(', ');
      return next(new ErrorResponse(messages, 400));
    }
    return next(new ErrorResponse(error.message || 'Failed to create expense', 500));
  }
});

// @desc    Update expense (outgoing transaction)
// @route   PUT /api/admin/finance/expenses/:id
// @access  Admin only
const updateExpense = asyncHandler(async (req, res, next) => {
  const {
    category,
    amount,
    date,
    description,
    status
  } = req.body;

  let expense = await AdminFinance.findOne({
    _id: req.params.id,
    recordType: 'transaction',
    transactionType: 'outgoing'
  });

  if (!expense) {
    return next(new ErrorResponse('Expense not found', 404));
  }

  // Update fields
  if (category) expense.category = category;
  if (amount !== undefined) expense.amount = parseFloat(amount);
  if (date) expense.transactionDate = new Date(date);
  if (description !== undefined) expense.description = description;
  if (status) expense.status = status;

  await expense.save();

  // Populate references for response
  await expense.populate([
    { path: 'employee', select: 'name email department' },
    { path: 'client', select: 'name email companyName' },
    { path: 'project', select: 'name status' },
    { path: 'createdBy', select: 'name email' }
  ]);

  res.status(200).json({
    success: true,
    message: 'Expense updated successfully',
    data: expense
  });
});

// @desc    Delete expense (outgoing transaction)
// @route   DELETE /api/admin/finance/expenses/:id
// @access  Admin only
const deleteExpense = asyncHandler(async (req, res, next) => {
  const expense = await AdminFinance.findOne({
    _id: req.params.id,
    recordType: 'transaction',
    transactionType: 'outgoing'
  });

  if (!expense) {
    return next(new ErrorResponse('Expense not found', 404));
  }

  await expense.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Expense deleted successfully',
    data: {}
  });
});

// @desc    Approve expense (outgoing transaction)
// @route   PUT /api/admin/finance/expenses/:id/approve
// @access  Admin only
const approveExpense = asyncHandler(async (req, res, next) => {
  if (!req.admin || !req.admin._id) {
    return next(new ErrorResponse('Admin authentication required', 401));
  }

  const expense = await AdminFinance.findOne({
    _id: req.params.id,
    recordType: 'transaction',
    transactionType: 'outgoing'
  });

  if (!expense) {
    return next(new ErrorResponse('Expense not found', 404));
  }

  // Update status to completed (approved)
  expense.status = 'completed';
  await expense.save();

  await expense.populate([
    { path: 'employee', select: 'name email department' },
    { path: 'client', select: 'name email companyName' },
    { path: 'project', select: 'name status' },
    { path: 'createdBy', select: 'name email' }
  ]);

  res.status(200).json({
    success: true,
    message: 'Expense approved successfully',
    data: expense
  });
});

// ========== BUDGET MANAGEMENT ==========

// Helper function to calculate spent amount for a budget
const calculateBudgetSpent = async (budget) => {
  try {
    // Calculate spent amount from outgoing transactions that match the budget category
    // and fall within the budget date range
    const outgoingTransactions = await AdminFinance.aggregate([
      {
        $match: {
          recordType: 'transaction',
          transactionType: 'outgoing',
          category: budget.budgetCategory,
          transactionDate: {
            $gte: budget.startDate,
            $lte: budget.endDate
          },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' }
        }
      }
    ]);

    return outgoingTransactions.length > 0 ? outgoingTransactions[0].totalSpent : 0;
  } catch (error) {
    console.error('Error calculating budget spent:', error);
    return 0;
  }
};

// @desc    Get all budgets
// @route   GET /api/admin/finance/budgets
// @access  Admin only
const getBudgets = asyncHandler(async (req, res, next) => {
  const {
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
    recordType: 'budget'
  };

  if (status) filter.status = status;
  if (category) filter.budgetCategory = { $regex: category, $options: 'i' };

  // Date range filter
  if (startDate || endDate) {
    filter.$or = [
      { startDate: { $gte: new Date(startDate), $lte: new Date(endDate || '2099-12-31') } },
      { endDate: { $gte: new Date(startDate || '1970-01-01'), $lte: new Date(endDate) } }
    ];
  }

  // Search filter
  if (search) {
    const searchRegex = { $regex: search, $options: 'i' };
    filter.$or = [
      { budgetName: searchRegex },
      { budgetCategory: searchRegex },
      { description: searchRegex }
    ];
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const budgets = await AdminFinance.find(filter)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Calculate spent amount for each budget
  const budgetsWithSpent = await Promise.all(
    budgets.map(async (budget) => {
      const spentAmount = await calculateBudgetSpent(budget);
      budget.spentAmount = spentAmount;
      budget.remainingAmount = budget.allocatedAmount - spentAmount;
      await budget.save();
      return budget;
    })
  );

  const total = await AdminFinance.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: budgetsWithSpent.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: budgetsWithSpent
  });
});

// @desc    Get single budget
// @route   GET /api/admin/finance/budgets/:id
// @access  Admin only
const getBudget = asyncHandler(async (req, res, next) => {
  const budget = await AdminFinance.findOne({
    _id: req.params.id,
    recordType: 'budget'
  })
    .populate('createdBy', 'name email');

  if (!budget) {
    return next(new ErrorResponse('Budget not found', 404));
  }

  // Calculate spent amount
  const spentAmount = await calculateBudgetSpent(budget);
  budget.spentAmount = spentAmount;
  budget.remainingAmount = budget.allocatedAmount - spentAmount;
  await budget.save();

  res.status(200).json({
    success: true,
    data: budget
  });
});

// @desc    Create new budget
// @route   POST /api/admin/finance/budgets
// @access  Admin only
const createBudget = asyncHandler(async (req, res, next) => {
  // Check if admin is authenticated
  if (!req.admin || !req.admin._id) {
    return next(new ErrorResponse('Admin authentication required', 401));
  }

  const {
    name,
    category,
    allocated,
    startDate,
    endDate,
    description,
    projects
  } = req.body;

  // Validate required fields
  if (!name || !category || !allocated || !startDate || !endDate) {
    return next(new ErrorResponse('Name, category, allocated amount, start date, and end date are required', 400));
  }

  // Validate dates
  if (new Date(startDate) >= new Date(endDate)) {
    return next(new ErrorResponse('End date must be after start date', 400));
  }

  // Create budget record
  const budgetData = {
    recordType: 'budget',
    budgetName: name,
    budgetCategory: category,
    allocatedAmount: parseFloat(allocated),
    spentAmount: 0,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    description: description || '',
    createdBy: req.admin._id,
    status: 'active'
  };

  // Add projects if provided
  if (projects && Array.isArray(projects) && projects.length > 0) {
    budgetData.budgetProjects = projects;
  }

  try {
    const budget = await AdminFinance.create(budgetData);

    // Calculate initial spent amount
    const spentAmount = await calculateBudgetSpent(budget);
    budget.spentAmount = spentAmount;
    budget.remainingAmount = budget.allocatedAmount - spentAmount;
    await budget.save();

    // Populate references for response
    await budget.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      data: budget
    });
  } catch (error) {
    console.error('Error creating budget:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((errItem) => errItem.message).join(', ');
      return next(new ErrorResponse(messages, 400));
    }
    return next(new ErrorResponse(error.message || 'Failed to create budget', 500));
  }
});

// @desc    Update budget
// @route   PUT /api/admin/finance/budgets/:id
// @access  Admin only
const updateBudget = asyncHandler(async (req, res, next) => {
  const {
    name,
    category,
    allocated,
    startDate,
    endDate,
    description,
    status,
    projects
  } = req.body;

  let budget = await AdminFinance.findOne({
    _id: req.params.id,
    recordType: 'budget'
  });

  if (!budget) {
    return next(new ErrorResponse('Budget not found', 404));
  }

  // Update fields
  if (name) budget.budgetName = name;
  if (category) budget.budgetCategory = category;
  if (allocated !== undefined) budget.allocatedAmount = parseFloat(allocated);
  if (startDate) budget.startDate = new Date(startDate);
  if (endDate) budget.endDate = new Date(endDate);
  if (description !== undefined) budget.description = description;
  if (status) budget.status = status;
  if (projects !== undefined) {
    budget.budgetProjects = Array.isArray(projects) ? projects : [];
  }

  // Validate dates if both are being updated
  if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
    return next(new ErrorResponse('End date must be after start date', 400));
  }

  // Recalculate spent amount after category or date changes
  if (category || startDate || endDate) {
    const spentAmount = await calculateBudgetSpent(budget);
    budget.spentAmount = spentAmount;
  }

  budget.remainingAmount = budget.allocatedAmount - budget.spentAmount;
  await budget.save();

  // Populate references for response
  await budget.populate('createdBy', 'name email');

  res.status(200).json({
    success: true,
    message: 'Budget updated successfully',
    data: budget
  });
});

// @desc    Delete budget
// @route   DELETE /api/admin/finance/budgets/:id
// @access  Admin only
const deleteBudget = asyncHandler(async (req, res, next) => {
  const budget = await AdminFinance.findOne({
    _id: req.params.id,
    recordType: 'budget'
  });

  if (!budget) {
    return next(new ErrorResponse('Budget not found', 404));
  }

  await budget.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Budget deleted successfully',
    data: {}
  });
});

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  approveExpense,
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget
};
