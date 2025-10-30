const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Sales = require('../models/Sales');
const Lead = require('../models/Lead');
const LeadCategory = require('../models/LeadCategory');
const Account = require('../models/Account');
const PaymentReceipt = require('../models/PaymentReceipt');
const SalesTask = require('../models/SalesTask');
const SalesMeeting = require('../models/SalesMeeting');
const Project = require('../models/Project');
const Client = require('../models/Client');
// Ensure LeadProfile model is registered before any populate calls
require('../models/LeadProfile');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    List active accounts for payments (sales read-only)
// @route   GET /api/sales/accounts
// @access  Private (Sales)
const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ isActive: true }).select('name bankName accountNumber ifsc upiId');
    res.json({ success: true, data: accounts, message: 'Accounts fetched' });
  } catch (error) {
    console.error('getAccounts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch accounts' });
  }
};

// Helper to safely cast id
const safeObjectId = (value) => {
  try { return new mongoose.Types.ObjectId(value); } catch { return value; }
};

// @desc    List receivables (projects for my converted clients) with filters
// @route   GET /api/sales/payment-recovery
// @access  Private (Sales)
const getPaymentRecovery = async (req, res) => {
  try {
    const salesId = safeObjectId(req.sales.id);
    const { search = '', overdue, band } = req.query;

    const clientMatch = { convertedBy: salesId };
    if (search) {
      clientMatch.$or = [
        { name: new RegExp(search, 'i') },
        { phoneNumber: new RegExp(search, 'i') }
      ];
    }

    // Find clients converted by me
    const myClients = await Client.find(clientMatch).select('_id name phoneNumber');
    const clientIds = myClients.map(c => c._id);

    const projectFilter = { client: { $in: clientIds } };
    if (overdue === 'true') {
      projectFilter.dueDate = { $lt: new Date() };
    }

    // Fetch projects and compute remaining based on financialDetails
    const projects = await Project.find(projectFilter)
      .select('client dueDate financialDetails')
      .populate('client', 'name phoneNumber');

    const bandFilter = (amount) => {
      if (!band) return true;
      if (band === 'high') return amount >= 10000;
      if (band === 'medium') return amount >= 3000 && amount < 10000;
      if (band === 'low') return amount < 3000;
      return true;
    };

    const list = projects
      .map(p => {
        const rem = (p.financialDetails?.remainingAmount || 0);
        return rem > 0 ? {
          projectId: p._id,
          clientId: p.client?._id,
          clientName: p.client?.name,
          phone: p.client?.phoneNumber,
          dueDate: p.dueDate,
          remainingAmount: rem
        } : null;
      })
      .filter(Boolean)
      .filter(r => bandFilter(r.remainingAmount));

    res.json({ success: true, data: list, message: 'Receivables fetched' });
  } catch (error) {
    console.error('getPaymentRecovery error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch receivables' });
  }
};

// @desc    Summary stats for receivables
// @route   GET /api/sales/payment-recovery/stats
const getPaymentRecoveryStats = async (req, res) => {
  try {
    const salesId = safeObjectId(req.sales.id);
    const myClients = await Client.find({ convertedBy: salesId }).select('_id');
    const clientIds = myClients.map(c => c._id);
    const projects = await Project.find({ client: { $in: clientIds } }).select('dueDate financialDetails');
    let totalDue = 0, overdueCount = 0, overdueAmount = 0;
    const now = new Date();
    projects.forEach(p => {
      const rem = p.financialDetails?.remainingAmount || 0;
      totalDue += rem;
      if (p.dueDate && p.dueDate < now && rem > 0) {
        overdueCount += 1;
        overdueAmount += rem;
      }
    });
    res.json({ success: true, data: { totalDue, overdueCount, overdueAmount }, message: 'Stats fetched' });
  } catch (error) {
    console.error('getPaymentRecoveryStats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};

// @desc    Create payment receipt (pending verification)
// @route   POST /api/sales/payment-recovery/:projectId/receipts
const createPaymentReceipt = async (req, res) => {
  try {
    const salesId = safeObjectId(req.sales.id);
    const { projectId } = req.params;
    const { amount, accountId, method = 'upi', referenceId, notes } = req.body;

    if (!amount || !accountId) {
      return res.status(400).json({ success: false, message: 'Amount and account are required' });
    }

    const project = await Project.findById(projectId).populate('client');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    // ensure client is converted by this sales user
    const client = await Client.findById(project.client);
    if (!client || String(client.convertedBy) !== String(salesId)) {
      return res.status(403).json({ success: false, message: 'Not authorized for this client' });
    }

    const receipt = await PaymentReceipt.create({
      client: client._id,
      project: project._id,
      amount,
      account: accountId,
      method,
      referenceId,
      notes,
      createdBy: salesId,
      status: 'pending'
    });

    res.status(201).json({ success: true, data: receipt, message: 'Receipt created and pending verification' });
  } catch (error) {
    console.error('createPaymentReceipt error:', error);
    res.status(500).json({ success: false, message: 'Failed to create receipt' });
  }
};

// Demo Requests
// @desc    List my demo requests stored on leads.demoRequest
// @route   GET /api/sales/demo-requests
const getDemoRequests = async (req, res) => {
  try {
    const salesId = safeObjectId(req.sales.id);
    const { search = '', status, category } = req.query;
    // Include leads marked via legacy status 'demo_requested' or with demoRequest subdoc
    const filter = { 
      assignedTo: salesId, 
      $or: [
        { 'demoRequest.status': { $exists: true } },
        { status: 'demo_requested' }
      ]
    };
    if (status && status !== 'all') filter['demoRequest.status'] = status;
    if (category && category !== 'all') filter.category = safeObjectId(category);
    if (search) filter.$or = [
      { name: new RegExp(search, 'i') },
      { company: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') }
    ];
    let leads = await Lead.find(filter)
      .populate('category', 'name color icon')
      .populate('leadProfile', 'name businessName');
    // Normalize: if demoRequest missing but status is demo_requested, treat as pending
    leads = leads.map(l => {
      if (!l.demoRequest || !l.demoRequest.status) {
        if (l.status === 'demo_requested') {
          l = l.toObject();
          l.demoRequest = { status: 'pending' };
          return l;
        }
      }
      return l.toObject ? l.toObject() : l;
    });
    const stats = {
      total: leads.length,
      pending: leads.filter(l => l.demoRequest && l.demoRequest.status === 'pending').length,
      scheduled: leads.filter(l => l.demoRequest && l.demoRequest.status === 'scheduled').length,
      completed: leads.filter(l => l.demoRequest && l.demoRequest.status === 'completed').length
    };
    res.json({ success: true, data: { items: leads, stats }, message: 'Demo requests fetched' });
  } catch (error) {
    console.error('getDemoRequests error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch demo requests' });
  }
};

// @desc    Update demo request status on a lead
// @route   PATCH /api/sales/demo-requests/:leadId/status
const updateDemoRequestStatus = async (req, res) => {
  try {
    const salesId = safeObjectId(req.sales.id);
    const { leadId } = req.params;
    const { status } = req.body; // 'pending' | 'scheduled' | 'completed' | 'cancelled'
    if (!['pending','scheduled','completed','cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const lead = await Lead.findOne({ _id: leadId, assignedTo: salesId });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    lead.demoRequest = { ...(lead.demoRequest||{}), status, updatedAt: new Date() };
    await lead.save();
    res.json({ success: true, data: lead, message: 'Demo status updated' });
  } catch (error) {
    console.error('updateDemoRequestStatus error:', error);
    res.status(500).json({ success: false, message: 'Failed to update demo status' });
  }
};

// Sales Tasks CRUD
const listSalesTasks = async (req, res) => {
  try {
    const owner = safeObjectId(req.sales.id);
    const { search = '', filter = 'all' } = req.query;
    const q = { owner };
    if (search) {
      q.$or = [{ title: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }];
    }
    if (['pending','completed'].includes(filter)) q.completed = filter === 'completed';
    if (['high','medium','low'].includes(filter)) q.priority = filter;
    const items = await SalesTask.find(q).sort({ createdAt: -1 });
    const stats = {
      total: await SalesTask.countDocuments({ owner }),
      pending: await SalesTask.countDocuments({ owner, completed: false }),
      completed: await SalesTask.countDocuments({ owner, completed: true }),
      high: await SalesTask.countDocuments({ owner, completed: false, priority: 'high' })
    };
    res.json({ success: true, data: { items, stats }, message: 'Tasks fetched' });
  } catch (error) {
    console.error('listSalesTasks error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
  }
};

const createSalesTask = async (req, res) => {
  try {
    const owner = safeObjectId(req.sales.id);
    const task = await SalesTask.create({ owner, ...req.body });
    res.status(201).json({ success: true, data: task, message: 'Task created' });
  } catch (error) {
    console.error('createSalesTask error:', error);
    res.status(500).json({ success: false, message: 'Failed to create task' });
  }
};

const updateSalesTask = async (req, res) => {
  try {
    const owner = safeObjectId(req.sales.id);
    const task = await SalesTask.findOneAndUpdate({ _id: req.params.id, owner }, req.body, { new: true });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task, message: 'Task updated' });
  } catch (error) {
    console.error('updateSalesTask error:', error);
    res.status(500).json({ success: false, message: 'Failed to update task' });
  }
};

const toggleSalesTask = async (req, res) => {
  try {
    const owner = safeObjectId(req.sales.id);
    const task = await SalesTask.findOne({ _id: req.params.id, owner });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    task.completed = !task.completed;
    await task.save();
    res.json({ success: true, data: task, message: 'Task toggled' });
  } catch (error) {
    console.error('toggleSalesTask error:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle task' });
  }
};

const deleteSalesTask = async (req, res) => {
  try {
    const owner = safeObjectId(req.sales.id);
    const task = await SalesTask.findOneAndDelete({ _id: req.params.id, owner });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task, message: 'Task deleted' });
  } catch (error) {
    console.error('deleteSalesTask error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete task' });
  }
};

// Meetings
const listSalesMeetings = async (req, res) => {
  try {
    const salesId = safeObjectId(req.sales.id);
    const { search = '', filter = 'all' } = req.query;
    const q = { $or: [ { assignee: salesId }, { createdBy: salesId } ] };
    if (search) {
      q.$or = [ { location: new RegExp(search,'i') } ];
    }
    const items = await SalesMeeting.find(q)
      .populate('client', 'name phoneNumber')
      .populate('assignee', 'name');
    const todayStr = new Date().toISOString().split('T')[0];
    const classify = (m) => {
      const d = new Date(m.meetingDate).toISOString().split('T')[0];
      if (d === todayStr) return 'today';
      return (new Date(m.meetingDate) >= new Date()) ? 'upcoming' : 'completed';
    };
    const filtered = items.filter(m => filter === 'all' || classify(m) === filter);
    const stats = {
      total: items.length,
      today: items.filter(m => classify(m) === 'today').length,
      upcoming: items.filter(m => classify(m) === 'upcoming').length
    };
    res.json({ success: true, data: { items: filtered, stats }, message: 'Meetings fetched' });
  } catch (error) {
    console.error('listSalesMeetings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch meetings' });
  }
};

const createSalesMeeting = async (req, res) => {
  try {
    const salesId = safeObjectId(req.sales.id);
    const payload = { ...req.body, createdBy: salesId };
    const meeting = await SalesMeeting.create(payload);
    res.status(201).json({ success: true, data: meeting, message: 'Meeting created' });
  } catch (error) {
    console.error('createSalesMeeting error:', error);
    res.status(500).json({ success: false, message: 'Failed to create meeting' });
  }
};

const updateSalesMeeting = async (req, res) => {
  try {
    const salesId = safeObjectId(req.sales.id);
    const meeting = await SalesMeeting.findOneAndUpdate({ _id: req.params.id, createdBy: salesId }, req.body, { new: true });
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
    res.json({ success: true, data: meeting, message: 'Meeting updated' });
  } catch (error) {
    console.error('updateSalesMeeting error:', error);
    res.status(500).json({ success: false, message: 'Failed to update meeting' });
  }
};

const deleteSalesMeeting = async (req, res) => {
  try {
    const salesId = safeObjectId(req.sales.id);
    const meeting = await SalesMeeting.findOneAndDelete({ _id: req.params.id, createdBy: salesId });
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
    res.json({ success: true, data: meeting, message: 'Meeting deleted' });
  } catch (error) {
    console.error('deleteSalesMeeting error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete meeting' });
  }
};

// Clients converted by me (for meetings dropdown)
const getMyConvertedClients = async (req, res) => {
  try {
    const salesId = safeObjectId(req.sales.id);
    const clients = await Client.find({ convertedBy: salesId }).select('name phoneNumber');
    res.json({ success: true, data: clients, message: 'Clients fetched' });
  } catch (error) {
    console.error('getMyConvertedClients error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch clients' });
  }
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

// @desc    Create lead by sales employee
// @route   POST /api/sales/leads
// @access  Private (Sales only)
const createLeadBySales = async (req, res) => {
  try {
    const { phone, name, company, email, category, priority, value, notes } = req.body;

    // Validate required fields
    if (!phone || !category) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and category are required'
      });
    }

    // Check if lead with phone number already exists
    const existingLead = await Lead.findOne({ phone });
    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: 'Lead with this phone number already exists'
      });
    }

    // Verify category exists
    const categoryExists = await LeadCategory.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    // Create lead with sales employee as creator AND assignee
    const lead = await Lead.create({
      phone,
      name,
      company,
      email,
      category,
      priority: priority || 'medium',
      value: value || 0,
      notes,
      createdBy: req.sales.id,
      creatorModel: 'Sales',
      assignedTo: req.sales.id, // Auto-assign to self
      status: 'new',
      source: 'manual'
    });

    // Update sales employee's leadsManaged array
    await Sales.findByIdAndUpdate(req.sales.id, {
      $push: { leadsManaged: lead._id }
    });

    // Update sales employee's lead statistics
    const sales = await Sales.findById(req.sales.id);
    await sales.updateLeadStats();

    // Populate for response
    await lead.populate('category', 'name color icon');
    await lead.populate('assignedTo', 'name email');

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead
    });

  } catch (error) {
    console.error('Create lead by sales error:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Lead with this phone number already exists'
      });
    }
    
    // Handle other errors
    res.status(500).json({
      success: false,
      message: 'Server error while creating lead'
    });
  }
};

// @desc    Get all lead categories for sales
// @route   GET /api/sales/lead-categories
// @access  Private (Sales only)
const getLeadCategories = async (req, res) => {
  try {
    const categories = await LeadCategory.find()
      .select('name description color icon')
      .sort('name');

    res.status(200).json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get lead categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
};

// @desc    Debug endpoint to check leads in database
// @route   GET /api/sales/debug/leads
// @access  Private (Sales only)
const debugLeads = async (req, res) => {
  try {
    const salesId = req.sales.id;
    
    // Get all leads for this sales employee
    const leads = await Lead.find({ assignedTo: salesId }).select('phone status assignedTo createdAt');
    
    // Get all leads in the database (for debugging)
    const allLeads = await Lead.find({}).select('phone status assignedTo createdAt').limit(10);
    
    res.status(200).json({
      success: true,
      data: {
        salesId,
        leadsForSales: leads,
        allLeadsInDB: allLeads,
        totalLeadsForSales: leads.length,
        totalLeadsInDB: await Lead.countDocuments({})
      }
    });
  } catch (error) {
    console.error('Debug leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while debugging leads'
    });
  }
};

// @desc    Get sales dashboard statistics
// @route   GET /api/sales/dashboard/statistics
// @access  Private (Sales only)
const getSalesDashboardStats = async (req, res) => {
  try {
    const salesId = req.sales.id;

    // Get total leads count for this sales employee
    const totalLeadsCount = await Lead.countDocuments({ assignedTo: new mongoose.Types.ObjectId(salesId) });

    // Aggregate leads by status for the logged-in sales employee
    const stats = await Lead.aggregate([
      { $match: { assignedTo: new mongoose.Types.ObjectId(salesId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Initialize all possible status counts
    const statusCounts = {
      new: 0,
      connected: 0,
      not_picked: 0,
      followup: 0, // Changed from today_followup to followup to match Lead model
      quotation_sent: 0,
      dq_sent: 0,
      app_client: 0,
      web: 0,
      converted: 0,
      lost: 0,
      hot: 0,
      demo_requested: 0
    };

    // Map aggregation results to status counts
    stats.forEach(stat => {
      if (statusCounts.hasOwnProperty(stat._id)) {
        statusCounts[stat._id] = stat.count;
      }
    });

    // Calculate total leads
    const totalLeads = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

    res.status(200).json({
      success: true,
      data: {
        statusCounts,
        totalLeads,
        salesEmployee: {
          id: req.sales.id,
          name: req.sales.name
        }
      }
    });

  } catch (error) {
    console.error('Get sales dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard statistics'
    });
  }
};

// @desc    Get all leads assigned to sales employee
// @route   GET /api/sales/leads
// @access  Private (Sales only)
const getMyLeads = async (req, res) => {
  try {
    const salesId = req.sales.id;
    const { 
      status, 
      category, 
      priority, 
      search, 
      page = 1, 
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    // Ensure proper ObjectId for assignedTo in "get my leads" too
    let myAssignedTo = salesId;
    try { myAssignedTo = new mongoose.Types.ObjectId(salesId); } catch (_) { myAssignedTo = salesId; }
    let filter = { assignedTo: myAssignedTo };

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    if (search) {
      filter.$or = [
        { phone: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const leads = await Lead.find(filter)
      .populate('category', 'name color icon')
      .populate('leadProfile', 'name businessName projectType estimatedCost quotationSent demoSent')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalLeads = await Lead.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: leads.length,
      total: totalLeads,
      page: pageNum,
      pages: Math.ceil(totalLeads / limitNum),
      data: leads
    });

  } catch (error) {
    console.error('Get my leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leads'
    });
  }
};

// @desc    Get leads by specific status
// @route   GET /api/sales/leads/status/:status
// @access  Private (Sales only)
const getLeadsByStatus = async (req, res) => {
  try {
    // Check if sales user is authenticated
    if (!req.sales || !req.sales.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const salesId = req.sales.id;
    const { status } = req.params;
    const { 
      category, 
      priority, 
      search, 
      timeFrame,
      page = 1, 
      limit = 12 
    } = req.query;

    // Validate status (with backward compatibility for today_followup)
    const validStatuses = ['new', 'connected', 'not_picked', 'followup', 'today_followup', 'quotation_sent', 'dq_sent', 'app_client', 'web', 'converted', 'lost', 'hot', 'demo_requested'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Handle backward compatibility: treat today_followup as followup
    let actualStatus = status;
    if (status === 'today_followup') {
      actualStatus = 'followup';
    }

    // Build filter object
    // Ensure proper ObjectId matching for assignedTo (with safe fallback)
    let assignedToValue = salesId;
    try {
      assignedToValue = new mongoose.Types.ObjectId(salesId);
    } catch (e) {
      // Fallback to string matching if casting fails (should not happen in normal flow)
      assignedToValue = salesId;
    }
    let filter = { 
      assignedTo: assignedToValue,
      status: actualStatus 
    };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    if (search) {
      filter.$or = [
        { phone: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Add time frame filtering for followup status
    if (actualStatus === 'followup') {
      const now = new Date();
      let startDate, endDate;
      
      if (timeFrame && timeFrame !== 'all') {
        switch(timeFrame) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            break;
          case 'week':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 59, 999);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate(), 23, 59, 59, 999);
            break;
        }
      } else if (timeFrame === 'all') {
        // For 'all' filter, show all upcoming follow-ups (from today onwards)
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        endDate = null; // No end date limit
      } else {
        // Default: show today's follow-ups
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      }
      
      const followUpFilter = {
        scheduledDate: { $gte: startDate },
        status: 'pending'
      };
      
      if (endDate) {
        followUpFilter.scheduledDate.$lte = endDate;
      }
      
      filter.followUps = {
        $elemMatch: followUpFilter
      };
    } else if (timeFrame && timeFrame !== 'all') {
      // For other statuses, filter by creation date
      const now = new Date();
      let startDate, endDate;
      
      switch(timeFrame) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
          break;
        case 'week':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0, 0);
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30, 0, 0, 0, 0);
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
          break;
      }
      
      if (startDate) {
        filter.createdAt = { $gte: startDate };
        if (endDate) {
          filter.createdAt.$lte = endDate;
        }
      }
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const leads = await Lead.find(filter)
      .populate('category', 'name color icon')
      .populate('leadProfile', 'name businessName projectType estimatedCost quotationSent demoSent')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalLeads = await Lead.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: leads.length,
      total: totalLeads,
      page: pageNum,
      pages: Math.ceil(totalLeads / limitNum),
      status: status,
      data: leads
    });

  } catch (error) {
    const errMsg = error && error.message ? error.message : String(error);
    console.error('Get leads by status error:', errMsg);
    if (error && error.stack) console.error(error.stack);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({
      success: false,
      message: isDev ? `Server error while fetching leads by status: ${errMsg}` : 'Server error while fetching leads by status',
      error: isDev ? errMsg : undefined
    });
  }
};

// @desc    Get single lead detail
// @route   GET /api/sales/leads/:id
// @access  Private (Sales only)
const getLeadDetail = async (req, res) => {
  try {
    const salesId = req.sales.id;
    const leadId = req.params.id;

    const lead = await Lead.findOne({ 
      _id: leadId, 
      assignedTo: salesId 
    })
      .populate('category', 'name color icon description')
      .populate('assignedTo', 'name email phone')
      .populate('createdBy', 'name email')
      .populate('leadProfile', 'name businessName email projectType estimatedCost description quotationSent demoSent notes documents');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found or not assigned to you'
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });

  } catch (error) {
    console.error('Get lead detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching lead detail'
    });
  }
};

// @desc    Update lead status
// @route   PATCH /api/sales/leads/:id/status
// @access  Private (Sales only)
const updateLeadStatus = async (req, res) => {
  try {
    const salesId = req.sales.id;
    const leadId = req.params.id;
    const { status, notes, followupDate, followupTime, priority } = req.body;

    // Validate status (with backward compatibility for today_followup)
    const validStatuses = ['new', 'connected', 'not_picked', 'followup', 'today_followup', 'quotation_sent', 'dq_sent', 'app_client', 'web', 'converted', 'lost', 'hot', 'demo_requested'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Handle backward compatibility: treat today_followup as followup
    let actualStatus = status;
    if (status === 'today_followup') {
      actualStatus = 'followup';
    }

    // Find lead and verify ownership
    const lead = await Lead.findOne({ 
      _id: leadId, 
      assignedTo: salesId 
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found or not assigned to you'
      });
    }

    // Validate status transition
    const validTransitions = {
      'new': ['connected', 'not_picked', 'lost'],
      'connected': ['hot', 'followup', 'quotation_sent', 'dq_sent', 'app_client', 'web', 'demo_requested', 'lost'],
      'not_picked': ['connected', 'followup', 'lost'],
      'followup': ['connected', 'hot', 'quotation_sent', 'dq_sent', 'app_client', 'web', 'demo_requested', 'lost'],
      'quotation_sent': ['connected', 'hot', 'dq_sent', 'app_client', 'web', 'demo_requested', 'converted', 'lost'],
      'dq_sent': ['connected', 'hot', 'quotation_sent', 'app_client', 'web', 'demo_requested', 'converted', 'lost'],
      'app_client': ['connected', 'hot', 'quotation_sent', 'dq_sent', 'web', 'demo_requested', 'converted', 'lost'],
      'web': ['connected', 'hot', 'quotation_sent', 'dq_sent', 'app_client', 'demo_requested', 'converted', 'lost'],
      'demo_requested': ['connected', 'hot', 'quotation_sent', 'dq_sent', 'app_client', 'web', 'converted', 'lost'],
      'hot': ['quotation_sent', 'dq_sent', 'app_client', 'web', 'demo_requested', 'converted', 'lost'],
      'converted': [], // Terminal state
      'lost': ['connected'] // Can be recovered and connected
    };

    if (!validTransitions[lead.status].includes(actualStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${lead.status} to ${actualStatus}`
      });
    }

    // Update lead status
    const oldStatus = lead.status;
    lead.status = actualStatus;
    lead.lastContactDate = new Date();

    // Handle follow-up scheduling
    if (actualStatus === 'followup' && followupDate && followupTime) {
      // Validate follow-up data
      if (!followupDate || !followupTime) {
        return res.status(400).json({
          success: false,
          message: 'Follow-up date and time are required for followup status'
        });
      }

      // Add follow-up entry
      // Ensure the date is parsed correctly (handle both ISO strings and date objects)
      let parsedDate;
      if (typeof followupDate === 'string') {
        // If it's a string, parse it as ISO date
        parsedDate = new Date(followupDate);
      } else {
        parsedDate = new Date(followupDate);
      }
      
      // Validate the parsed date
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid follow-up date format'
        });
      }
      
      
      const followUpData = {
        scheduledDate: parsedDate,
        scheduledTime: followupTime,
        notes: notes || '',
        priority: priority || 'medium',
        type: 'call',
        status: 'pending'
      };

      lead.followUps.push(followUpData);
      
      // Update lead priority if provided
      if (priority) {
        lead.priority = priority;
      }

      // Update nextFollowUpDate to the nearest upcoming follow-up (including today)
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      
      const upcomingFollowUps = lead.followUps
        .filter(fu => fu.status === 'pending' && fu.scheduledDate >= today)
        .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
      
      if (upcomingFollowUps.length > 0) {
        lead.nextFollowUpDate = upcomingFollowUps[0].scheduledDate;
      }

      // Add activity log for follow-up scheduling
      lead.activities.push({
        type: 'status_change',
        description: `Status changed from ${oldStatus} to ${actualStatus}. Follow-up scheduled for ${followupDate} at ${followupTime}${notes ? ` - ${notes}` : ''}`,
        performedBy: salesId,
        timestamp: new Date()
      });
    } else {
      // Add activity log for regular status change
      lead.activities.push({
        type: 'status_change',
        description: `Status changed from ${oldStatus} to ${actualStatus}${notes ? ` - ${notes}` : ''}`,
        performedBy: salesId,
        timestamp: new Date()
      });
    }

    // Ensure creatorModel is preserved (required field)
    if (!lead.creatorModel) {
      // If creatorModel is missing, set it based on context (Sales route)
      lead.creatorModel = 'Sales';
    }

    await lead.save();

    // Update sales employee's lead statistics
    const sales = await Sales.findById(salesId);
    await sales.updateLeadStats();

    // Populate for response
    await lead.populate('category', 'name color icon');
    await lead.populate('leadProfile', 'name businessName projectType estimatedCost quotationSent demoSent');

    res.status(200).json({
      success: true,
      message: 'Lead status updated successfully',
      data: lead
    });

  } catch (error) {
    console.error('Update lead status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating lead status'
    });
  }
};

// @desc    Create lead profile
// @route   POST /api/sales/leads/:id/profile
// @access  Private (Sales only)
const createLeadProfile = async (req, res) => {
  try {
    const salesId = req.sales.id;
    const leadId = req.params.id;
    const { name, businessName, email, projectType, estimatedCost, description, quotationSent, demoSent } = req.body;

    // Find lead and verify ownership
    const lead = await Lead.findOne({ 
      _id: leadId, 
      assignedTo: salesId 
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found or not assigned to you'
      });
    }

    // Check if profile already exists
    if (lead.leadProfile) {
      return res.status(400).json({
        success: false,
        message: 'Lead profile already exists'
      });
    }

    // Create lead profile
    const LeadProfile = require('../models/LeadProfile');
    const leadProfile = await LeadProfile.create({
      lead: leadId,
      name,
      businessName,
      email,
      projectType: projectType || { web: false, app: false, taxi: false },
      estimatedCost: estimatedCost || 0,
      description,
      quotationSent: quotationSent || false,
      demoSent: demoSent || false,
      createdBy: salesId
    });

    // Update lead with profile reference
    lead.leadProfile = leadProfile._id;
    await lead.save();

    res.status(201).json({
      success: true,
      message: 'Lead profile created successfully',
      data: leadProfile
    });

  } catch (error) {
    console.error('Create lead profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating lead profile'
    });
  }
};

// @desc    Update lead profile
// @route   PUT /api/sales/leads/:id/profile
// @access  Private (Sales only)
const updateLeadProfile = async (req, res) => {
  try {
    const salesId = req.sales.id;
    const leadId = req.params.id;
    const updateData = req.body;

    // Find lead and verify ownership
    const lead = await Lead.findOne({ 
      _id: leadId, 
      assignedTo: salesId 
    }).populate('leadProfile');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found or not assigned to you'
      });
    }

    if (!lead.leadProfile) {
      return res.status(404).json({
        success: false,
        message: 'Lead profile not found'
      });
    }

    // Update lead profile
    const LeadProfile = require('../models/LeadProfile');
    const leadProfile = await LeadProfile.findByIdAndUpdate(
      lead.leadProfile._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Lead profile updated successfully',
      data: leadProfile
    });

  } catch (error) {
    console.error('Update lead profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating lead profile'
    });
  }
};

// @desc    Convert lead to client and create project (pending-assignment)
// @route   POST /api/sales/leads/:id/convert
// @access  Private (Sales only)
const convertLeadToClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectData } = req.body; // { projectName, projectType, estimatedBudget, startDate, description }

    const lead = await Lead.findById(id).populate('leadProfile');

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Verify lead belongs to current sales employee
    if (!lead.assignedTo || lead.assignedTo.toString() !== req.sales.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to convert this lead' });
    }

    // Verify lead has profile
    if (!lead.leadProfile) {
      return res.status(400).json({ success: false, message: 'Lead must have a profile before conversion' });
    }

    // Idempotency: if a project already exists for this lead, return it
    const Project = require('../models/Project');
    const existingProject = await Project.findOne({ originLead: id }).populate('client');
    if (lead.status === 'converted' && existingProject) {
      return res.status(409).json({
        success: true,
        message: 'Lead already converted',
        data: { client: existingProject.client, project: existingProject, lead }
      });
    }

    // Upsert Client by phone number
    const Client = require('../models/Client');
    const phoneNumber = lead.phone;
    let client = await Client.findOne({ phoneNumber });
    if (!client) {
      client = await Client.create({
        phoneNumber,
        name: lead.leadProfile.name || lead.name || 'Client',
        companyName: lead.leadProfile.businessName || lead.company || '',
        email: lead.email || undefined,
        isActive: true
        // OTP is generated during client login via existing OTP flow
      });
    }

    // Prepare project fields
    const budget = (projectData && typeof projectData.estimatedBudget !== 'undefined')
      ? Number(projectData.estimatedBudget) || 0
      : (lead.leadProfile.estimatedCost || 0);

    const name = projectData?.projectName || 'Sales Converted Project';
    const description = projectData?.description || lead.leadProfile.description || 'Created from sales conversion';
    const projectType = projectData?.projectType || lead.leadProfile.projectType || { web: false, app: false, taxi: false };
    const startDate = projectData?.startDate ? new Date(projectData.startDate) : new Date();

    // Create Project with pending-assignment status and submittedBy
    const newProject = await Project.create({
      name,
      description,
      client: client._id,
      projectType,
      status: 'pending-assignment',
      budget: budget,
      startDate,
      submittedBy: req.sales.id,
      originLead: lead._id
    });

    // Update lead status/value
    lead.status = 'converted';
    lead.value = budget;
    lead.lastContactDate = new Date();
    await lead.save();

    // Update sales stats
    const sales = await Sales.findById(req.sales.id);
    if (sales && sales.updateLeadStats) {
      await sales.updateLeadStats();
    }

    // Respond
    const populatedProject = await Project.findById(newProject._id).populate('client');
    return res.status(201).json({
      success: true,
      message: 'Lead converted successfully',
      data: { client, project: populatedProject, lead }
    });
  } catch (error) {
    console.error('Convert lead error:', error);
    return res.status(500).json({ success: false, message: 'Server error while converting lead' });
  }
};

// @desc    Get all sales team members
// @route   GET /api/sales/team
// @access  Private (Sales only)
const getSalesTeam = async (req, res) => {
  try {
    const salesTeam = await Sales.find({ isActive: true })
      .select('_id name email employeeId department role')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: salesTeam
    });

  } catch (error) {
    console.error('Get sales team error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sales team'
    });
  }
};

// @desc    Request demo for lead
// @route   POST /api/sales/leads/:id/request-demo
// @access  Private (Sales only)
const requestDemo = async (req, res) => {
  try {
    const salesId = req.sales.id;
    const leadId = req.params.id;
    const { clientName, description, reference, mobileNumber } = req.body;

    // Find lead and verify ownership
    const lead = await Lead.findOne({ 
      _id: leadId, 
      assignedTo: salesId 
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found or not assigned to you'
      });
    }

    // Create demo request
    const DemoRequest = require('../models/DemoRequest');
    const demoRequest = await DemoRequest.create({
      lead: leadId,
      clientName,
      mobileNumber,
      description,
      reference,
      requestedBy: salesId,
      priority: lead.priority === 'urgent' ? 'high' : 'medium'
    });

    // Update lead status to demo_requested
    lead.status = 'demo_requested';
    lead.lastContactDate = new Date();
    await lead.save();

    // Add activity log
    lead.activities.push({
      type: 'status_change',
      description: `Demo requested for ${clientName} - ${description || 'No description provided'}`,
      performedBy: salesId,
      timestamp: new Date()
    });
    await lead.save();

    // Update sales employee's lead statistics
    const sales = await Sales.findById(salesId);
    await sales.updateLeadStats();

    res.status(201).json({
      success: true,
      message: 'Demo request submitted successfully',
      data: demoRequest
    });

  } catch (error) {
    console.error('Request demo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while requesting demo'
    });
  }
};

// @desc    Transfer lead to another sales employee
// @route   POST /api/sales/leads/:id/transfer
// @access  Private (Sales only)
const transferLead = async (req, res) => {
  try {
    const salesId = req.sales.id;
    const leadId = req.params.id;
    const { toSalesId, reason } = req.body;

    // Validate required fields
    if (!toSalesId) {
      return res.status(400).json({
        success: false,
        message: 'Target sales employee ID is required'
      });
    }

    // Find lead and verify ownership
    const lead = await Lead.findOne({ 
      _id: leadId, 
      assignedTo: salesId 
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found or not assigned to you'
      });
    }

    // Verify target sales employee exists
    const targetSales = await Sales.findById(toSalesId);
    if (!targetSales) {
      return res.status(404).json({
        success: false,
        message: 'Target sales employee not found'
      });
    }

    // Transfer lead
    await lead.transferToSales(salesId, toSalesId, reason);

    // Update both sales employees' lead statistics
    const fromSales = await Sales.findById(salesId);
    const toSales = await Sales.findById(toSalesId);
    
    await fromSales.updateLeadStats();
    await toSales.updateLeadStats();

    // Add activity log
    lead.activities.push({
      type: 'status_change',
      description: `Lead transferred to ${targetSales.name}${reason ? ` - ${reason}` : ''}`,
      performedBy: salesId,
      timestamp: new Date()
    });
    await lead.save();

    // Populate for response
    await lead.populate('assignedTo', 'name email');
    await lead.populate('leadProfile', 'name businessName projectType estimatedCost quotationSent demoSent');

    res.status(200).json({
      success: true,
      message: 'Lead transferred successfully',
      data: lead
    });

  } catch (error) {
    console.error('Transfer lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while transferring lead'
    });
  }
};

// @desc    Add note to lead profile
// @route   POST /api/sales/leads/:id/notes
// @access  Private (Sales only)
const addNoteToLead = async (req, res) => {
  try {
    const salesId = req.sales.id;
    const leadId = req.params.id;
    const { content } = req.body;

    // Validate required fields
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note content is required'
      });
    }

    // Find lead and verify ownership
    const lead = await Lead.findOne({ 
      _id: leadId, 
      assignedTo: salesId 
    }).populate('leadProfile');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found or not assigned to you'
      });
    }

    if (!lead.leadProfile) {
      return res.status(400).json({
        success: false,
        message: 'Lead profile not found. Please create a profile first.'
      });
    }

    // Add note to lead profile
    const LeadProfile = require('../models/LeadProfile');
    const leadProfile = await LeadProfile.findById(lead.leadProfile._id);
    
    await leadProfile.addNote(content.trim(), salesId);

    // Add activity log
    lead.activities.push({
      type: 'note',
      description: `Note added: ${content.trim().substring(0, 50)}${content.trim().length > 50 ? '...' : ''}`,
      performedBy: salesId,
      timestamp: new Date()
    });
    lead.lastContactDate = new Date();
    await lead.save();

    // Populate for response
    await leadProfile.populate('notes.addedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: leadProfile
    });

  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding note'
    });
  }
};

module.exports = {
  loginSales,
  getSalesProfile,
  logoutSales,
  createDemoSales,
  createLeadBySales,
  getLeadCategories,
  debugLeads,
  getSalesDashboardStats,
  getMyLeads,
  getLeadsByStatus,
  getLeadDetail,
  updateLeadStatus,
  createLeadProfile,
  updateLeadProfile,
  convertLeadToClient,
  getSalesTeam,
  requestDemo,
  transferLead,
  addNoteToLead,
  getAccounts,
  getPaymentRecovery,
  getPaymentRecoveryStats,
  createPaymentReceipt
  ,
  getDemoRequests,
  updateDemoRequestStatus
  ,
  listSalesTasks,
  createSalesTask,
  updateSalesTask,
  toggleSalesTask,
  deleteSalesTask,
  listSalesMeetings,
  createSalesMeeting,
  updateSalesMeeting,
  deleteSalesMeeting,
  getMyConvertedClients
};
