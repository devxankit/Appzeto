const CPLead = require('../models/CPLead');
const CPLeadProfile = require('../models/CPLeadProfile');
const CPNotification = require('../models/CPNotification');
const LeadCategory = require('../models/LeadCategory');
const ChannelPartner = require('../models/ChannelPartner');
const Client = require('../models/Client');
const Lead = require('../models/Lead');
const Sales = require('../models/Sales');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// Helper function to create notification
const createNotification = async (channelPartnerId, type, title, message, reference = null, actionUrl = null) => {
  try {
    await CPNotification.create({
      channelPartner: channelPartnerId,
      type,
      title,
      message,
      reference: reference ? { type: reference.type, id: reference.id } : undefined,
      actionUrl
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// @desc    Create lead by Channel Partner
// @route   POST /api/cp/leads
// @access  Private (Channel Partner only)
exports.createLead = asyncHandler(async (req, res, next) => {
  const { phone, name, company, email, category, priority, value, notes } = req.body;
  const cpId = req.channelPartner.id;

  // Validate required fields
  if (!phone || !category) {
    return next(new ErrorResponse('Phone number and category are required', 400));
  }

  // Check if lead with phone number already exists
  const existingLead = await CPLead.findOne({ phone });
  if (existingLead) {
    return next(new ErrorResponse('Lead with this phone number already exists', 400));
  }

  // Verify category exists
  const categoryExists = await LeadCategory.findById(category);
  if (!categoryExists) {
    return next(new ErrorResponse('Invalid category', 400));
  }

  // Create lead
  const lead = await CPLead.create({
    phone,
    name,
    company,
    email,
    category,
    priority: priority || 'medium',
    value: value || 0,
    notes,
    createdBy: cpId,
    creatorModel: 'ChannelPartner',
    assignedTo: cpId,
    status: 'new',
    source: 'manual'
  });

  // Add activity
  await lead.addActivity({
    type: 'note',
    description: 'Lead created',
    performedBy: cpId,
    activityCreatorModel: 'ChannelPartner'
  });

  // Populate for response
  await lead.populate('category', 'name color icon');
  await lead.populate('assignedTo', 'name email phoneNumber');

  res.status(201).json({
    success: true,
    message: 'Lead created successfully',
    data: lead
  });
});

// @desc    Get all leads for Channel Partner
// @route   GET /api/cp/leads
// @access  Private (Channel Partner only)
exports.getLeads = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;
  const { status, priority, category, search, page = 1, limit = 20 } = req.query;

  // Build query
  const query = { assignedTo: cpId };

  if (status && status !== 'undefined' && status !== 'all') {
    query.status = status;
  }

  if (priority && priority !== 'undefined' && priority !== 'all') {
    query.priority = priority;
  }

  if (category && category !== 'undefined' && category !== 'all') {
    // Validate category is a valid ObjectId
    if (category.match(/^[0-9a-fA-F]{24}$/)) {
      query.category = category;
    }
  }

  if (search && search !== 'undefined' && search.trim() !== '') {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } }
    ];
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const leads = await CPLead.find(query)
    .populate('category', 'name color icon')
    .populate('assignedTo', 'name email phoneNumber')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await CPLead.countDocuments(query);

  res.status(200).json({
    success: true,
    count: leads.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: leads
  });
});

// @desc    Get single lead by ID
// @route   GET /api/cp/leads/:id
// @access  Private (Channel Partner only)
exports.getLeadById = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;
  const leadId = req.params.id;

  const lead = await CPLead.findOne({
    _id: leadId,
    assignedTo: cpId
  })
    .populate('category', 'name color icon')
    .populate('assignedTo', 'name email phoneNumber')
    .populate('leadProfile')
    .populate('sharedWithSales.salesId', 'name email phoneNumber')
    .populate('activities.performedBy', 'name email');

  if (!lead) {
    return next(new ErrorResponse('Lead not found', 404));
  }

  res.status(200).json({
    success: true,
    data: lead
  });
});

// @desc    Update lead
// @route   PUT /api/cp/leads/:id
// @access  Private (Channel Partner only)
exports.updateLead = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;
  const leadId = req.params.id;
  const { name, company, email, priority, value, notes, category } = req.body;

  const lead = await CPLead.findOne({
    _id: leadId,
    assignedTo: cpId
  });

  if (!lead) {
    return next(new ErrorResponse('Lead not found', 404));
  }

  // Update fields
  if (name !== undefined) lead.name = name;
  if (company !== undefined) lead.company = company;
  if (email !== undefined) lead.email = email;
  if (priority !== undefined) lead.priority = priority;
  if (value !== undefined) lead.value = value;
  if (notes !== undefined) lead.notes = notes;
  if (category !== undefined) {
    const categoryExists = await LeadCategory.findById(category);
    if (!categoryExists) {
      return next(new ErrorResponse('Invalid category', 400));
    }
    lead.category = category;
  }

  await lead.save();

  // Add activity
  await lead.addActivity({
    type: 'note',
    description: 'Lead updated',
    performedBy: cpId,
    activityCreatorModel: 'ChannelPartner'
  });

  await lead.populate('category', 'name color icon');
  await lead.populate('assignedTo', 'name email phoneNumber');

  res.status(200).json({
    success: true,
    message: 'Lead updated successfully',
    data: lead
  });
});

// @desc    Update lead status
// @route   PATCH /api/cp/leads/:id/status
// @access  Private (Channel Partner only)
exports.updateLeadStatus = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;
  const leadId = req.params.id;
  const { status, lostReason } = req.body;

  if (!status) {
    return next(new ErrorResponse('Status is required', 400));
  }

  const lead = await CPLead.findOne({
    _id: leadId,
    assignedTo: cpId
  });

  if (!lead) {
    return next(new ErrorResponse('Lead not found', 404));
  }

  try {
    await lead.updateStatus(status);
    
    if (status === 'lost' && lostReason) {
      lead.lostReason = lostReason;
      await lead.save();
    }

    // Add activity
    await lead.addActivity({
      type: 'status_change',
      description: `Status changed to ${status}`,
      performedBy: cpId,
      activityCreatorModel: 'ChannelPartner'
    });

    // Create notification if converted
    if (status === 'converted') {
      await createNotification(
        cpId,
        'lead_converted',
        'Lead Converted',
        `Lead ${lead.name || lead.phone} has been converted to client`,
        { type: 'lead', id: lead._id },
        `/cp-converted`
      );
    }

    await lead.populate('category', 'name color icon');
    await lead.populate('assignedTo', 'name email phoneNumber');

    res.status(200).json({
      success: true,
      message: 'Lead status updated successfully',
      data: lead
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
});

// @desc    Delete lead
// @route   DELETE /api/cp/leads/:id
// @access  Private (Channel Partner only)
exports.deleteLead = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;
  const leadId = req.params.id;

  const lead = await CPLead.findOne({
    _id: leadId,
    assignedTo: cpId
  });

  if (!lead) {
    return next(new ErrorResponse('Lead not found', 404));
  }

  // Delete lead profile if exists
  if (lead.leadProfile) {
    await CPLeadProfile.findByIdAndDelete(lead.leadProfile);
  }

  await CPLead.findByIdAndDelete(leadId);

  res.status(200).json({
    success: true,
    message: 'Lead deleted successfully'
  });
});

// @desc    Share lead with Sales Team Lead
// @route   POST /api/cp/leads/:id/share
// @access  Private (Channel Partner only)
exports.shareLeadWithSales = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;
  const leadId = req.params.id;
  const { salesId } = req.body;

  if (!salesId) {
    return next(new ErrorResponse('Sales ID is required', 400));
  }

  const lead = await CPLead.findOne({
    _id: leadId,
    assignedTo: cpId
  });

  if (!lead) {
    return next(new ErrorResponse('Lead not found', 404));
  }

  // Verify Sales exists
  const sales = await Sales.findById(salesId);
  if (!sales) {
    return next(new ErrorResponse('Sales Team Lead not found', 404));
  }

  // Share lead
  await lead.shareWithSales(salesId, cpId);

  // Create notification for Sales (if they have notification system)
  // TODO: Implement Sales notification if needed

  await lead.populate('sharedWithSales.salesId', 'name email phoneNumber');

  res.status(200).json({
    success: true,
    message: 'Lead shared with Sales Team Lead successfully',
    data: lead
  });
});

// @desc    Unshare lead with Sales Team Lead
// @route   POST /api/cp/leads/:id/unshare
// @access  Private (Channel Partner only)
exports.unshareLeadWithSales = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;
  const leadId = req.params.id;
  const { salesId } = req.body;

  if (!salesId) {
    return next(new ErrorResponse('Sales ID is required', 400));
  }

  const lead = await CPLead.findOne({
    _id: leadId,
    assignedTo: cpId
  });

  if (!lead) {
    return next(new ErrorResponse('Lead not found', 404));
  }

  await lead.unshareWithSales(salesId, cpId);

  await lead.populate('sharedWithSales.salesId', 'name email phoneNumber');

  res.status(200).json({
    success: true,
    message: 'Lead unshared with Sales Team Lead successfully',
    data: lead
  });
});

// @desc    Get leads shared from Sales
// @route   GET /api/cp/leads/shared/from-sales
// @access  Private (Channel Partner only)
exports.getSharedLeadsFromSales = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;
  const { page = 1, limit = 20 } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  // Find CP leads that have sharedFromSales
  const leads = await CPLead.find({
    assignedTo: cpId,
    'sharedFromSales.0': { $exists: true }
  })
    .populate('category', 'name color icon')
    .populate('sharedFromSales.leadId')
    .populate('sharedFromSales.sharedBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await CPLead.countDocuments({
    assignedTo: cpId,
    'sharedFromSales.0': { $exists: true }
  });

  res.status(200).json({
    success: true,
    count: leads.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: leads
  });
});

// @desc    Get leads shared with Sales
// @route   GET /api/cp/leads/shared/with-sales
// @access  Private (Channel Partner only)
exports.getSharedLeadsWithSales = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;
  const { page = 1, limit = 20 } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const leads = await CPLead.find({
    assignedTo: cpId,
    'sharedWithSales.0': { $exists: true }
  })
    .populate('category', 'name color icon')
    .populate('sharedWithSales.salesId', 'name email phoneNumber')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await CPLead.countDocuments({
    assignedTo: cpId,
    'sharedWithSales.0': { $exists: true }
  });

  res.status(200).json({
    success: true,
    count: leads.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: leads
  });
});

// @desc    Create lead profile
// @route   POST /api/cp/leads/:id/profile
// @access  Private (Channel Partner only)
exports.createLeadProfile = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;
  const leadId = req.params.id;
  const {
    name,
    businessName,
    email,
    projectType,
    estimatedCost,
    description,
    location,
    businessType,
    quotationSent,
    demoSent,
    proposalSent
  } = req.body;

  const lead = await CPLead.findOne({
    _id: leadId,
    assignedTo: cpId
  });

  if (!lead) {
    return next(new ErrorResponse('Lead not found or not assigned to you', 404));
  }

  if (lead.leadProfile) {
    return next(new ErrorResponse('Lead profile already exists', 400));
  }

  const leadProfile = await CPLeadProfile.create({
    lead: leadId,
    name: name || lead.name,
    businessName,
    email: email || lead.email,
    projectType: projectType || { web: false, app: false, taxi: false, other: false },
    estimatedCost: estimatedCost || 0,
    description,
    location,
    businessType,
    quotationSent: quotationSent || false,
    demoSent: demoSent || false,
    proposalSent: proposalSent || false,
    createdBy: cpId
  });

  lead.leadProfile = leadProfile._id;
  await lead.save();

  // Add activity
  await lead.addActivity({
    type: 'note',
    description: 'Lead profile created',
    performedBy: cpId,
    activityCreatorModel: 'ChannelPartner'
  });

  res.status(201).json({
    success: true,
    message: 'Lead profile created successfully',
    data: leadProfile
  });
});

// @desc    Update lead profile
// @route   PUT /api/cp/leads/:id/profile
// @access  Private (Channel Partner only)
exports.updateLeadProfile = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;
  const leadId = req.params.id;
  const updateData = req.body;

  const lead = await CPLead.findOne({
    _id: leadId,
    assignedTo: cpId
  }).populate('leadProfile');

  if (!lead) {
    return next(new ErrorResponse('Lead not found or not assigned to you', 404));
  }

  if (!lead.leadProfile) {
    return next(new ErrorResponse('Lead profile not found', 404));
  }

  const leadProfile = await CPLeadProfile.findByIdAndUpdate(
    lead.leadProfile._id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Lead profile updated successfully',
    data: leadProfile
  });
});

// @desc    Convert lead to client
// @route   POST /api/cp/leads/:id/convert
// @access  Private (Channel Partner only)
exports.convertLeadToClient = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;
  const leadId = req.params.id;
  const {
    projectName,
    finishedDays,
    totalCost,
    advanceReceived,
    includeGST,
    paymentScreenshot
  } = req.body;

  const lead = await CPLead.findOne({
    _id: leadId,
    assignedTo: cpId
  }).populate('leadProfile');

  if (!lead) {
    return next(new ErrorResponse('Lead not found or not assigned to you', 404));
  }

  if (lead.status === 'converted') {
    return next(new ErrorResponse('Lead is already converted', 400));
  }

  // Create client
  const client = await Client.create({
    name: lead.name || 'Client',
    email: lead.email,
    phoneNumber: lead.phone,
    companyName: lead.company,
    createdBy: cpId,
    creatorModel: 'ChannelPartner',
    source: 'channel_partner'
  });

  // Update lead
  lead.status = 'converted';
  lead.convertedToClient = client._id;
  lead.convertedAt = new Date();
  await lead.save();

  // Update lead profile conversion data if exists
  if (lead.leadProfile) {
    await CPLeadProfile.findByIdAndUpdate(lead.leadProfile._id, {
      conversionData: {
        projectName,
        finishedDays,
        totalCost,
        advanceReceived,
        includeGST,
        paymentScreenshot
      }
    });
  }

  // Add activity
  await lead.addActivity({
    type: 'note',
    description: 'Lead converted to client',
    performedBy: cpId,
    activityCreatorModel: 'ChannelPartner'
  });

  // Create notification
  await createNotification(
    cpId,
    'lead_converted',
    'Lead Converted',
    `Lead ${lead.name || lead.phone} has been converted to client`,
    { type: 'client', id: client._id },
    `/cp-converted`
  );

  // Update Channel Partner revenue
  if (totalCost) {
    await ChannelPartner.findByIdAndUpdate(cpId, {
      $inc: { totalRevenue: totalCost }
    });
  }

  res.status(200).json({
    success: true,
    message: 'Lead converted to client successfully',
    data: {
      lead,
      client
    }
  });
});

// @desc    Add follow-up
// @route   POST /api/cp/leads/:id/followup
// @access  Private (Channel Partner only)
exports.addFollowUp = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;
  const leadId = req.params.id;
  const { scheduledDate, scheduledTime, type, notes, priority } = req.body;

  if (!scheduledDate) {
    return next(new ErrorResponse('Scheduled date is required', 400));
  }

  const lead = await CPLead.findOne({
    _id: leadId,
    assignedTo: cpId
  });

  if (!lead) {
    return next(new ErrorResponse('Lead not found', 404));
  }

  await lead.addFollowUp({
    scheduledDate,
    scheduledTime,
    type: type || 'call',
    notes,
    priority: priority || 'medium',
    status: 'pending'
  });

  // Update next follow-up date
  lead.nextFollowUpDate = scheduledDate;
  await lead.save();

  // Add activity
  await lead.addActivity({
    type: 'followup_added',
    description: `Follow-up scheduled for ${new Date(scheduledDate).toLocaleDateString()}`,
    performedBy: cpId,
    activityCreatorModel: 'ChannelPartner'
  });

  await lead.populate('category', 'name color icon');

  res.status(200).json({
    success: true,
    message: 'Follow-up added successfully',
    data: lead
  });
});

// @desc    Update follow-up
// @route   PUT /api/cp/leads/:id/followup/:followupId
// @access  Private (Channel Partner only)
exports.updateFollowUp = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;
  const leadId = req.params.id;
  const followupId = req.params.followupId;
  const { scheduledDate, scheduledTime, type, notes, priority, status } = req.body;

  const lead = await CPLead.findOne({
    _id: leadId,
    assignedTo: cpId
  });

  if (!lead) {
    return next(new ErrorResponse('Lead not found', 404));
  }

  const followUp = lead.followUps.id(followupId);
  if (!followUp) {
    return next(new ErrorResponse('Follow-up not found', 404));
  }

  if (scheduledDate !== undefined) followUp.scheduledDate = scheduledDate;
  if (scheduledTime !== undefined) followUp.scheduledTime = scheduledTime;
  if (type !== undefined) followUp.type = type;
  if (notes !== undefined) followUp.notes = notes;
  if (priority !== undefined) followUp.priority = priority;
  if (status !== undefined) {
    followUp.status = status;
    if (status === 'completed') {
      followUp.completedAt = new Date();
    }
  }

  await lead.save();

  // Add activity
  await lead.addActivity({
    type: status === 'completed' ? 'followup_completed' : 'followup_rescheduled',
    description: `Follow-up ${status === 'completed' ? 'completed' : 'updated'}`,
    performedBy: cpId,
    activityCreatorModel: 'ChannelPartner'
  });

  res.status(200).json({
    success: true,
    message: 'Follow-up updated successfully',
    data: lead
  });
});

// @desc    Get lead categories
// @route   GET /api/cp/lead-categories
// @access  Private (Channel Partner only)
exports.getLeadCategories = asyncHandler(async (req, res, next) => {
  const categories = await LeadCategory.find().sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Get sales team leads for sharing
// @route   GET /api/cp/sales-team-leads
// @access  Private (Channel Partner only)
exports.getSalesTeamLeads = asyncHandler(async (req, res, next) => {
  // Get all sales team members who are team leads
  const salesTeamLeads = await Sales.find({ isTeamLead: true, isActive: true })
    .select('name email phoneNumber')
    .sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: salesTeamLeads.length,
    data: salesTeamLeads
  });
});

// @desc    Get client details (for converted leads)
// @route   GET /api/cp/clients/:id
// @access  Private (Channel Partner only)
exports.getClientDetails = asyncHandler(async (req, res, next) => {
  const cpId = req.channelPartner.id;
  const clientId = req.params.id;

  // Verify client was created by this CP
  const client = await Client.findOne({
    _id: clientId,
    createdBy: cpId,
    creatorModel: 'ChannelPartner'
  })
    .populate('projects')
    .populate('createdBy', 'name');

  if (!client) {
    return next(new ErrorResponse('Client not found or not authorized', 404));
  }

  // Get payments for client's projects
  const Project = require('../models/Project');
  const Payment = require('../models/Payment');
  
  const projects = await Project.find({ client: clientId });
  const projectIds = projects.map(p => p._id);
  
  const payments = await Payment.find({ project: { $in: projectIds } })
    .populate('project', 'name')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      client,
      projects,
      payments
    }
  });
});
