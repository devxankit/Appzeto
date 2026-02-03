const Project = require('../models/Project');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// Note: The 'vendor' field in project expenses stores the client name, not a vendor/provider name.
// This field is auto-populated from the project's client information if not provided.

// @desc    Get all project expenses across all projects
// @route   GET /api/admin/project-expenses
// @access  Admin only
const getAllProjectExpenses = asyncHandler(async (req, res, next) => {
  const {
    projectId,
    category,
    startDate,
    endDate,
    page = 1,
    limit = 20,
    search
  } = req.query;

  // Build filter for projects
  const projectFilter = {};
  if (projectId) {
    projectFilter._id = projectId;
  }

  // Build expense filter
  const expenseFilter = {};
  if (category) {
    expenseFilter['expenses.category'] = category;
  }
  if (startDate || endDate) {
    expenseFilter['expenses.expenseDate'] = {};
    if (startDate) expenseFilter['expenses.expenseDate'].$gte = new Date(startDate);
    if (endDate) expenseFilter['expenses.expenseDate'].$lte = new Date(endDate);
  }
  if (search) {
    expenseFilter.$or = [
      { 'expenses.category': { $regex: search, $options: 'i' } },
      { 'expenses.description': { $regex: search, $options: 'i' } },
      { 'expenses.vendor': { $regex: search, $options: 'i' } }, // vendor field stores client name
      { 'name': { $regex: search, $options: 'i' } }, // Search by project name
      { 'client.name': { $regex: search, $options: 'i' } },
      { 'client.companyName': { $regex: search, $options: 'i' } }
    ];
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    // First, get all projects that match the filter
    const projects = await Project.find(projectFilter)
      .populate('client', 'name companyName email')
      .populate('projectManager', 'name email')
      .select('name client projectManager expenses');

    // Flatten expenses with project information
    let allExpenses = [];
    projects.forEach(project => {
      if (project.expenses && project.expenses.length > 0) {
        project.expenses.forEach(expense => {
          // Apply filters
          let includeExpense = true;
          
          if (category && expense.category !== category) {
            includeExpense = false;
          }
          
          if (startDate && new Date(expense.expenseDate) < new Date(startDate)) {
            includeExpense = false;
          }
          
          if (endDate && new Date(expense.expenseDate) > new Date(endDate)) {
            includeExpense = false;
          }
          
          if (search) {
            const searchLower = search.toLowerCase();
            const projectClientName = project.client 
              ? (typeof project.client === 'object' 
                  ? (project.client.companyName || project.client.name || '').toLowerCase()
                  : '')
              : '';
            const projectName = (project.name || '').toLowerCase();
            const matchesSearch = 
              expense.category?.toLowerCase().includes(searchLower) ||
              expense.description?.toLowerCase().includes(searchLower) ||
              expense.vendor?.toLowerCase().includes(searchLower) || // vendor field stores client name
              projectName.includes(searchLower) ||
              projectClientName.includes(searchLower);
            if (!matchesSearch) {
              includeExpense = false;
            }
          }
          
          if (includeExpense) {
            // Ensure project name is included
            const projectName = project.name || project._id?.toString() || 'Unknown Project';
            allExpenses.push({
              _id: expense._id,
              name: expense.name,
              category: expense.category,
              amount: expense.amount,
              vendor: expense.vendor,
              paymentMethod: expense.paymentMethod,
              expenseDate: expense.expenseDate,
              description: expense.description,
              createdBy: expense.createdBy,
              updatedBy: expense.updatedBy,
              createdAt: expense.createdAt,
              updatedAt: expense.updatedAt,
              project: {
                _id: project._id,
                name: projectName,
                client: project.client,
                projectManager: project.projectManager
              },
              projectName: projectName // Also include as direct field for easier access
            });
          }
        });
      }
    });

    // Sort by expenseDate descending
    allExpenses.sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate));

    // Apply pagination
    const total = allExpenses.length;
    const paginatedExpenses = allExpenses.slice(skip, skip + parseInt(limit));

    // Populate createdBy and updatedBy
    const Admin = require('../models/Admin');
    const populatedExpenses = await Promise.all(
      paginatedExpenses.map(async (expense) => {
        const populated = { ...expense };
        if (expense.createdBy) {
          const creator = await Admin.findById(expense.createdBy).select('name email');
          populated.createdBy = creator;
        }
        if (expense.updatedBy) {
          const updater = await Admin.findById(expense.updatedBy).select('name email');
          populated.updatedBy = updater;
        }
        return populated;
      })
    );

    res.status(200).json({
      success: true,
      count: populatedExpenses.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: populatedExpenses
    });
  } catch (error) {
    console.error('Error in getAllProjectExpenses:', error);
    return next(new ErrorResponse(error.message || 'Failed to fetch project expenses', 500));
  }
});

// @desc    Get expenses for a specific project
// @route   GET /api/admin/project-expenses/project/:projectId
// @access  Admin only
const getProjectExpenses = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const {
    category,
    startDate,
    endDate,
    page = 1,
    limit = 20,
    search
  } = req.query;

  const project = await Project.findById(projectId)
    .populate('client', 'name companyName email')
    .populate('projectManager', 'name email')
    .populate('expenses.createdBy', 'name email')
    .populate('expenses.updatedBy', 'name email');

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Filter expenses
  let expenses = project.expenses || [];
  
  if (category) {
    expenses = expenses.filter(e => e.category === category);
  }
  
  if (startDate) {
    expenses = expenses.filter(e => new Date(e.expenseDate) >= new Date(startDate));
  }
  
  if (endDate) {
    expenses = expenses.filter(e => new Date(e.expenseDate) <= new Date(endDate));
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    const clientName = project.client 
      ? (typeof project.client === 'object' 
          ? (project.client.companyName || project.client.name || '').toLowerCase()
          : '')
      : '';
    const projectName = (project.name || '').toLowerCase();
    expenses = expenses.filter(e => 
      e.category?.toLowerCase().includes(searchLower) ||
      e.description?.toLowerCase().includes(searchLower) ||
      e.vendor?.toLowerCase().includes(searchLower) || // vendor field stores client name
      projectName.includes(searchLower) ||
      clientName.includes(searchLower)
    );
  }

  // Sort by expenseDate descending
  expenses.sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate));

  // Apply pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = expenses.length;
  const paginatedExpenses = expenses.slice(skip, skip + parseInt(limit));

  // Add project info to each expense
  const expensesWithProject = paginatedExpenses.map(expense => ({
    ...expense.toObject(),
    project: {
      _id: project._id,
      name: project.name,
      client: project.client,
      projectManager: project.projectManager
    }
  }));

  res.status(200).json({
    success: true,
    count: expensesWithProject.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: expensesWithProject
  });
});

// @desc    Create new project expense
// @route   POST /api/admin/project-expenses
// @access  Admin only
const createProjectExpense = asyncHandler(async (req, res, next) => {
  // Check if admin is authenticated
  if (!req.admin || !req.admin._id) {
    return next(new ErrorResponse('Admin authentication required', 401));
  }

  const {
    projectId,
    name,
    category,
    amount,
    vendor,
    paymentMethod,
    expenseDate,
    description
  } = req.body;

  // Validate required fields
  if (!projectId || !category || !amount || !expenseDate) {
    return next(new ErrorResponse('Project ID, category, amount, and expense date are required', 400));
  }

  // Validate category exists (check against ProjectExpenseCategory model)
  // Category validation is now optional - any category name can be used
  // But we can optionally check if it exists in the category list
  if (!category || !category.trim()) {
    return next(new ErrorResponse('Category is required', 400));
  }

  // Validate payment method
  const validPaymentMethods = ['Bank Transfer', 'UPI', 'Credit Card', 'Debit Card', 'Cash', 'Cheque', 'Other'];
  if (paymentMethod && !validPaymentMethods.includes(paymentMethod)) {
    return next(new ErrorResponse(`Invalid payment method. Must be one of: ${validPaymentMethods.join(', ')}`, 400));
  }

  try {
    const project = await Project.findById(projectId)
      .populate('client', 'name companyName');
    
    if (!project) {
      return next(new ErrorResponse('Project not found', 404));
    }

    // Auto-populate vendor (client name) if not provided
    let clientName = vendor ? vendor.trim() : '';
    if (!clientName && project.client) {
      // Use companyName if available, otherwise use name
      if (typeof project.client === 'object') {
        clientName = project.client.companyName || project.client.name || '';
      }
    }

    // Auto-generate name from category if not provided
    // Use category name with "Expense" suffix, capitalizing first letter
    const expenseName = name ? name.trim() : (category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Expense` : 'Project Expense');

    // Create expense object
    const newExpense = {
      name: expenseName,
      category,
      amount: parseFloat(amount),
      vendor: clientName, // vendor field stores client name
      paymentMethod: paymentMethod || 'Bank Transfer',
      expenseDate: new Date(expenseDate),
      description: description ? description.trim() : '',
      createdBy: req.admin._id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add expense to project
    project.expenses.push(newExpense);
    await project.save();

    // Populate the expense with admin info
    const Admin = require('../models/Admin');
    const createdByAdmin = await Admin.findById(req.admin._id).select('name email');
    
    const savedExpense = project.expenses[project.expenses.length - 1];
    const expenseWithProject = {
      ...savedExpense.toObject(),
      createdBy: createdByAdmin,
      project: {
        _id: project._id,
        name: project.name
      }
    };

    res.status(201).json({
      success: true,
      message: 'Project expense created successfully',
      data: expenseWithProject
    });
  } catch (error) {
    console.error('Error creating project expense:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((errItem) => errItem.message).join(', ');
      return next(new ErrorResponse(messages, 400));
    }
    return next(new ErrorResponse(error.message || 'Failed to create project expense', 500));
  }
});

// @desc    Update project expense
// @route   PUT /api/admin/project-expenses/:id
// @access  Admin only
const updateProjectExpense = asyncHandler(async (req, res, next) => {
  // Check if admin is authenticated
  if (!req.admin || !req.admin._id) {
    return next(new ErrorResponse('Admin authentication required', 401));
  }

  const { id } = req.params;
  const {
    name,
    category,
    amount,
    vendor,
    paymentMethod,
    expenseDate,
    description
  } = req.body;

  try {
    // Find project containing this expense
    const project = await Project.findOne({ 'expenses._id': id })
      .populate('client', 'name companyName email')
      .populate('projectManager', 'name email');

    if (!project) {
      return next(new ErrorResponse('Project expense not found', 404));
    }

    // Find the expense
    const expense = project.expenses.id(id);
    if (!expense) {
      return next(new ErrorResponse('Project expense not found', 404));
    }

    // Update fields
    if (name !== undefined) {
      expense.name = name.trim();
    } else if (category !== undefined) {
      // Auto-generate name from category if category changed but name not provided
    // Use category name with "Expense" suffix
    expense.name = category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Expense` : 'Project Expense';
    }
    if (category !== undefined) {
      if (!category || !category.trim()) {
        return next(new ErrorResponse('Category is required', 400));
      }
      expense.category = category.trim();
    }
    if (amount !== undefined) expense.amount = parseFloat(amount);
    if (vendor !== undefined) {
      // Auto-populate vendor (client name) if not provided
      let clientName = vendor.trim();
      if (!clientName && project.client) {
        if (typeof project.client === 'object') {
          clientName = project.client.companyName || project.client.name || '';
        }
      }
      expense.vendor = clientName; // vendor field stores client name
    }
    if (paymentMethod !== undefined) {
      const validPaymentMethods = ['Bank Transfer', 'UPI', 'Credit Card', 'Debit Card', 'Cash', 'Cheque', 'Other'];
      if (!validPaymentMethods.includes(paymentMethod)) {
        return next(new ErrorResponse(`Invalid payment method. Must be one of: ${validPaymentMethods.join(', ')}`, 400));
      }
      expense.paymentMethod = paymentMethod;
    }
    if (expenseDate !== undefined) expense.expenseDate = new Date(expenseDate);
    if (description !== undefined) expense.description = description.trim();
    
    expense.updatedBy = req.admin._id;
    expense.updatedAt = new Date();

    // Mark expenses array as modified
    project.markModified('expenses');
    await project.save();

    // Populate updatedBy
    const Admin = require('../models/Admin');
    const updatedByAdmin = await Admin.findById(req.admin._id).select('name email');
    const createdByAdmin = await Admin.findById(expense.createdBy).select('name email');

    const updatedExpense = {
      ...expense.toObject(),
      createdBy: createdByAdmin,
      updatedBy: updatedByAdmin,
      project: {
        _id: project._id,
        name: project.name,
        client: project.client,
        projectManager: project.projectManager
      }
    };

    res.status(200).json({
      success: true,
      message: 'Project expense updated successfully',
      data: updatedExpense
    });
  } catch (error) {
    console.error('Error updating project expense:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((errItem) => errItem.message).join(', ');
      return next(new ErrorResponse(messages, 400));
    }
    return next(new ErrorResponse(error.message || 'Failed to update project expense', 500));
  }
});

// @desc    Delete project expense
// @route   DELETE /api/admin/project-expenses/:id
// @access  Admin only
const deleteProjectExpense = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    // Find project containing this expense
    const project = await Project.findOne({ 'expenses._id': id });

    if (!project) {
      return next(new ErrorResponse('Project expense not found', 404));
    }

    // Filter out the expense to delete
    project.expenses = project.expenses.filter(expense => {
      return expense._id.toString() !== id;
    });
    project.markModified('expenses');
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project expense deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project expense:', error);
    return next(new ErrorResponse(error.message || 'Failed to delete project expense', 500));
  }
});

// @desc    Get project expense statistics
// @route   GET /api/admin/project-expenses/stats
// @access  Admin only
const getProjectExpenseStats = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  try {
    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter['expenses.expenseDate'] = {};
      if (startDate) dateFilter['expenses.expenseDate'].$gte = new Date(startDate);
      if (endDate) dateFilter['expenses.expenseDate'].$lte = new Date(endDate);
    }

    // Get all projects with expenses
    const projects = await Project.find(dateFilter).select('expenses');

    // Calculate totals
    let totalExpenses = 0;
    let totalProjects = new Set();
    let monthlyExpenses = 0;
    let todayExpenses = 0;
    const categoryBreakdown = {};
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    projects.forEach(project => {
      if (project.expenses && project.expenses.length > 0) {
        let projectHasExpenses = false;
        project.expenses.forEach(expense => {
          // Apply date filter if provided
          if (startDate && new Date(expense.expenseDate) < new Date(startDate)) {
            return;
          }
          if (endDate && new Date(expense.expenseDate) > new Date(endDate)) {
            return;
          }

          const expenseDate = new Date(expense.expenseDate);
          const expenseAmount = expense.amount || 0;

          totalExpenses += expenseAmount;
          projectHasExpenses = true;
          
          // Monthly expenses (current month)
          if (expenseDate >= startOfMonth) {
            monthlyExpenses += expenseAmount;
          }
          
          // Today's expenses
          if (expenseDate >= startOfToday) {
            todayExpenses += expenseAmount;
          }
          
          // Category breakdown
          const cat = expense.category || 'other';
          categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + expenseAmount;
        });
        
        if (projectHasExpenses) {
          totalProjects.add(project._id.toString());
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalExpenses,
        totalProjects: totalProjects.size,
        monthlyExpenses,
        todayExpenses,
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Error getting project expense stats:', error);
    return next(new ErrorResponse(error.message || 'Failed to get project expense statistics', 500));
  }
});

module.exports = {
  getAllProjectExpenses,
  getProjectExpenses,
  createProjectExpense,
  updateProjectExpense,
  deleteProjectExpense,
  getProjectExpenseStats
};

