const jwt = require('jsonwebtoken');
const Sales = require('../models/Sales');
const Lead = require('../models/Lead');
const LeadCategory = require('../models/LeadCategory');

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

// @desc    Get sales dashboard statistics
// @route   GET /api/sales/dashboard/statistics
// @access  Private (Sales only)
const getSalesDashboardStats = async (req, res) => {
  try {
    const salesId = req.sales.id;

    // Aggregate leads by status for the logged-in sales employee
    const stats = await Lead.aggregate([
      { $match: { assignedTo: salesId } },
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
      today_followup: 0,
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
    let filter = { assignedTo: salesId };

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
    let filter = { 
      assignedTo: salesId,
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
    console.error('Get leads by status error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leads by status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

// @desc    Convert lead to client and create project
// @route   POST /api/sales/leads/:id/convert
// @access  Private (Sales only)
const convertLeadToClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectData } = req.body; // projectName, projectType, estimatedBudget, startDate
    
    const lead = await Lead.findById(id).populate('leadProfile');
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    // Verify lead belongs to sales employee
    if (lead.assignedTo.toString() !== req.sales.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to convert this lead'
      });
    }
    
    // Verify lead has profile
    if (!lead.leadProfile) {
      return res.status(400).json({
        success: false,
        message: 'Lead must have a profile before conversion'
      });
    }
    
    // Create Client from LeadProfile
    const Client = require('../models/Client');
    const newClient = await Client.create({
      phoneNumber: lead.phone,
      name: lead.leadProfile.name || lead.name,
      companyName: lead.leadProfile.businessName || lead.company,
      email: lead.email,
      isActive: true,
      // OTP will be generated when client first logs in
    });
    
    // Create Project
    const Project = require('../models/Project');
    const newProject = await Project.create({
      name: projectData.projectName,
      description: lead.leadProfile.description || '',
      client: newClient._id,
      projectType: projectData.projectType || lead.leadProfile.projectType,
      status: 'pending-assignment', // Admin needs to assign PM
      estimatedBudget: projectData.estimatedBudget || lead.leadProfile.estimatedCost,
      startDate: projectData.startDate || new Date(),
      submittedBy: req.sales.id,
      submittedByModel: 'Sales'
    });
    
    // Update lead status to converted
    lead.status = 'converted';
    lead.value = projectData.estimatedBudget || lead.leadProfile.estimatedCost || 0;
    await lead.save();
    
    // Update sales stats
    const sales = await Sales.findById(req.sales.id);
    await sales.updateLeadStats();
    
    res.status(201).json({
      success: true,
      message: 'Lead converted successfully',
      data: {
        client: newClient,
        project: newProject,
        lead: lead
      }
    });
    
  } catch (error) {
    console.error('Convert lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while converting lead'
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
  getSalesDashboardStats,
  getMyLeads,
  getLeadsByStatus,
  getLeadDetail,
  updateLeadStatus,
  createLeadProfile,
  updateLeadProfile,
  convertLeadToClient
};
