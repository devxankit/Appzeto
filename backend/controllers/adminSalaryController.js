const Salary = require('../models/Salary');
const Employee = require('../models/Employee');
const Sales = require('../models/Sales');
const PM = require('../models/PM');
const Admin = require('../models/Admin');
const Incentive = require('../models/Incentive');
const Project = require('../models/Project');
const mongoose = require('mongoose');
const asyncHandler = require('../middlewares/asyncHandler');

// Helper: Get employee by ID and model type (includes Admin for HR salary)
const getEmployee = async (employeeId, employeeModel) => {
  let Model;
  switch (employeeModel) {
    case 'Employee':
      Model = Employee;
      break;
    case 'Sales':
      Model = Sales;
      break;
    case 'PM':
      Model = PM;
      break;
    case 'Admin':
      Model = Admin;
      break;
    default:
      return null;
  }
  return await Model.findById(employeeId);
};

// Helper: Calculate payment date based on joining date for a given month
const calculatePaymentDate = (joiningDate, month) => {
  const [year, monthNum] = month.split('-');
  const joiningDay = new Date(joiningDate).getDate();
  const lastDayOfMonth = new Date(parseInt(year), parseInt(monthNum), 0).getDate();
  const paymentDay = Math.min(joiningDay, lastDayOfMonth);
  return new Date(parseInt(year), parseInt(monthNum) - 1, paymentDay);
};

// Helper: Get employee model type from user type (admin/hr for HR salary)
const getEmployeeModelType = (userType) => {
  switch (userType) {
    case 'employee':
      return 'Employee';
    case 'sales':
      return 'Sales';
    case 'project-manager':
    case 'pm':
      return 'PM';
    case 'admin':
    case 'hr':
      return 'Admin';
    default:
      return null;
  }
};

// Helper: Calculate team target reward for a sales team lead for a given month
// Returns the reward amount if team target was achieved in that month, else 0
const calculateTeamTargetRewardForMonth = async (salesEmployeeId, month) => {
  try {
    const sales = await Sales.findById(salesEmployeeId)
      .select('isTeamLead teamMembers teamLeadTarget teamLeadTargetReward');
    if (!sales || !sales.isTeamLead || !(sales.teamLeadTarget > 0) || !(sales.teamLeadTargetReward > 0)) return 0;
    if (!sales.teamMembers || sales.teamMembers.length === 0) return 0;

    const [year, monthNum] = month.split('-');
    const monthStart = new Date(parseInt(year), parseInt(monthNum) - 1, 1, 0, 0, 0, 0);
    const monthEnd = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999);

    const teamMemberIds = sales.teamMembers
      .map(id => (mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null))
      .filter(Boolean);
    // Include team lead's own conversions + team members (full team sales for target)
    const allTeamIds = [new mongoose.Types.ObjectId(salesEmployeeId), ...teamMemberIds];

    const teamSalesAggregation = await Project.aggregate([
      { $lookup: { from: 'clients', localField: 'client', foreignField: '_id', as: 'clientData' } },
      { $unwind: { path: '$clientData', preserveNullAndEmptyArrays: false } },
      {
        $match: {
          'clientData.convertedBy': { $in: allTeamIds },
          'clientData.conversionDate': { $gte: monthStart, $lte: monthEnd }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: { $ifNull: ['$financialDetails.totalCost', { $ifNull: ['$budget', 0] }] }
          }
        }
      }
    ]);

    const teamMonthlySales = teamSalesAggregation.length > 0 ? (Number(teamSalesAggregation[0].totalSales) || 0) : 0;
    return teamMonthlySales >= sales.teamLeadTarget ? Number(sales.teamLeadTargetReward) : 0;
  } catch (error) {
    console.error(`Error calculating team target reward for sales ${salesEmployeeId}, month ${month}:`, error);
    return 0;
  }
};

// @desc    Set employee fixed salary
// @route   PUT /api/admin/salary/set/:userType/:employeeId
// @access  Private (Admin/HR)
exports.setEmployeeSalary = asyncHandler(async (req, res) => {
  const { userType, employeeId } = req.params;
  const { fixedSalary } = req.body;

  if (!fixedSalary || fixedSalary < 0) {
    return res.status(400).json({
      success: false,
      message: 'Valid fixed salary amount is required'
    });
  }

  const employeeModel = getEmployeeModelType(userType);
  if (!employeeModel) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user type'
    });
  }

  const employee = await getEmployee(employeeId, employeeModel);
  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }

  // Update fixed salary (ensure number for Mongoose)
  const amount = Number(fixedSalary);
  if (isNaN(amount) || amount < 0) {
    return res.status(400).json({
      success: false,
      message: 'Valid fixed salary amount is required'
    });
  }
  employee.fixedSalary = amount;
  await employee.save();

  // Create salary records starting from the month AFTER joining through current + 36 months (3 years ahead)
  // Mark-paid auto-creates next month, so records extend indefinitely until admin deletes
  const joiningDate = employee.joiningDate || new Date();
  const joinDate = new Date(joiningDate);
  const now = new Date();
  // Example: joins on 5-Feb -> first salary should be 5-Mar (not Feb)
  const startMonth = joinDate.getFullYear() * 12 + joinDate.getMonth() + 1;
  const endMonth = now.getFullYear() * 12 + now.getMonth() + 36;
  const months = [];
  for (let m = startMonth; m <= endMonth; m++) {
    const y = Math.floor(m / 12);
    const mo = (m % 12) + 1;
    months.push(`${y}-${String(mo).padStart(2, '0')}`);
  }
  const paymentDay = new Date(joiningDate).getDate();

  for (const month of months) {
    const paymentDate = calculatePaymentDate(joiningDate, month);
    
    // Calculate incentiveAmount and rewardAmount (team target reward) for sales team
    let incentiveAmount = 0;
    let rewardAmount = 0;
    if (employeeModel === 'Sales') {
      try {
        const incentives = await Incentive.find({
          salesEmployee: employee._id,
          currentBalance: { $gt: 0 }
        });
        incentiveAmount = incentives.reduce((sum, inc) => sum + (inc.currentBalance || 0), 0);
        rewardAmount = await calculateTeamTargetRewardForMonth(employee._id, month);
      } catch (error) {
        console.error(`Error calculating incentive/reward for employee ${employee._id}:`, error);
      }
    }

    const department = employeeModel === 'Admin' ? (employee.role || 'HR') : (employee.department || 'unknown');
    const role = employeeModel === 'Admin' ? (employee.role || 'hr') : (employee.role || userType);

    await Salary.findOneAndUpdate(
      {
        employeeId: employee._id,
        employeeModel,
        month
      },
      {
        employeeId: employee._id,
        employeeModel,
        employeeName: employee.name,
        department,
        role,
        month,
        fixedSalary: amount,
        paymentDate,
        paymentDay,
        status: 'pending',
        incentiveAmount,
        incentiveStatus: 'pending',
        rewardAmount,
        rewardStatus: 'pending',
        createdBy: req.admin.id
      },
      {
        upsert: true,
        new: true
      }
    );
  }

  res.json({
    success: true,
    message: `Fixed salary set to ₹${amount.toLocaleString()} and salary records generated`,
    data: {
      employeeId: employee._id,
      employeeName: employee.name,
      fixedSalary: employee.fixedSalary
    }
  });
});

// @desc    Get all salary records with filters
// @route   GET /api/admin/salary
// @access  Private (Admin/HR)
exports.getSalaryRecords = asyncHandler(async (req, res) => {
  const { month, department, status, search } = req.query;

  const filter = {};
  
  // Filter by month (default to current month)
  const currentMonth = month || new Date().toISOString().slice(0, 7);
  filter.month = currentMonth;

  // Filter by department
  if (department && department !== 'all') {
    filter.department = department;
  }

  // Filter by status
  if (status && status !== 'all') {
    filter.status = status;
  }

  // Search by employee name
  if (search) {
    filter.employeeName = { $regex: search, $options: 'i' };
  }

  let salaries = await Salary.find(filter)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .sort({ paymentDate: 1, employeeName: 1 });

  // Sync incentiveAmount and rewardAmount for sales (pending only). Do NOT overwrite
  // existing non-zero amounts with 0 – that would "remove" incentive/reward after an admin
  // only updates fixed salary and list is reloaded.
  for (const salary of salaries) {
    if (salary.employeeModel === 'Sales' && salary.department === 'sales') {
      try {
        if (salary.incentiveStatus === 'pending') {
          const incentives = await Incentive.find({
            salesEmployee: salary.employeeId,
            currentBalance: { $gt: 0 }
          });
          const totalIncentive = incentives.reduce((sum, inc) => sum + (inc.currentBalance || 0), 0);
          const existing = salary.incentiveAmount || 0;
          const diff = Math.abs(existing - totalIncentive) > 0.01;
          const wouldZero = totalIncentive === 0 && existing > 0;
          if (diff && !wouldZero) {
            salary.incentiveAmount = totalIncentive;
            await salary.save();
          }
        }
        if (salary.rewardStatus === 'pending') {
          const teamTargetReward = await calculateTeamTargetRewardForMonth(salary.employeeId, salary.month);
          const existing = salary.rewardAmount || 0;
          const diff = Math.abs(existing - teamTargetReward) > 0.01;
          const wouldZero = teamTargetReward === 0 && existing > 0;
          if (diff && !wouldZero) {
            salary.rewardAmount = teamTargetReward;
            await salary.save();
          }
        }
      } catch (error) {
        console.error(`Error calculating incentive/reward for salary ${salary._id}:`, error);
      }
    }
  }

  // Re-fetch salaries to get updated incentiveAmount values
  salaries = await Salary.find(filter)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .sort({ paymentDate: 1, employeeName: 1 });

  // Calculate statistics - incentive only for Sales employees; others have fixed salary + reward only
  const isSales = (s) => s.employeeModel === 'Sales' && s.department === 'sales';
  const stats = {
    totalEmployees: salaries.length,
    paidEmployees: salaries.filter(s => s.status === 'paid').length,
    pendingEmployees: salaries.filter(s => s.status === 'pending').length,
    totalAmount: salaries.reduce((sum, s) => sum + s.fixedSalary, 0),
    paidAmount: salaries.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.fixedSalary, 0),
    pendingAmount: salaries.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.fixedSalary, 0),
    totalIncentiveAmount: salaries.filter(isSales).reduce((sum, s) => sum + (s.incentiveAmount || 0), 0),
    paidIncentiveAmount: salaries.filter(s => isSales(s) && s.incentiveStatus === 'paid').reduce((sum, s) => sum + (s.incentiveAmount || 0), 0),
    pendingIncentiveAmount: salaries.filter(s => isSales(s) && s.incentiveStatus === 'pending').reduce((sum, s) => sum + (s.incentiveAmount || 0), 0),
    totalRewardAmount: salaries.reduce((sum, s) => sum + (s.rewardAmount || 0), 0),
    paidRewardAmount: salaries.filter(s => s.rewardStatus === 'paid').reduce((sum, s) => sum + (s.rewardAmount || 0), 0),
    pendingRewardAmount: salaries.filter(s => s.rewardStatus === 'pending').reduce((sum, s) => sum + (s.rewardAmount || 0), 0)
  };

  res.json({
    success: true,
    data: salaries,
    stats,
    month: currentMonth
  });
});

// @desc    Get employee IDs who already have salary set (for Set salary dropdown)
// @route   GET /api/admin/users/salary/employee-ids
// @access  Private (Admin/HR)
exports.getEmployeesWithSalary = asyncHandler(async (req, res) => {
  const ids = await Salary.distinct('employeeId');
  res.json({
    success: true,
    data: ids.map(id => id.toString())
  });
});

// @desc    Get single salary record
// @route   GET /api/admin/salary/:id
// @access  Private (Admin/HR)
exports.getSalaryRecord = asyncHandler(async (req, res) => {
  const salary = await Salary.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  if (!salary) {
    return res.status(404).json({
      success: false,
      message: 'Salary record not found'
    });
  }

  res.json({
    success: true,
    data: salary
  });
});

// @desc    Update salary record (mark as paid, update payment details)
// @route   PUT /api/admin/salary/:id
// @access  Private (Admin/HR)
exports.updateSalaryRecord = asyncHandler(async (req, res) => {
  const { status, paymentMethod, remarks, fixedSalary, incentiveStatus, rewardStatus } = req.body;

  console.log('Update Salary Request:', {
    id: req.params.id,
    body: req.body,
    fixedSalary: fixedSalary,
    fixedSalaryType: typeof fixedSalary
  });

  const salary = await Salary.findById(req.params.id);
  if (!salary) {
    return res.status(404).json({
      success: false,
      message: 'Salary record not found'
    });
  }

  console.log('Current salary before update:', {
    _id: salary._id,
    fixedSalary: salary.fixedSalary,
    month: salary.month
  });

  // Check if trying to edit past month (read-only)
  const salaryMonth = new Date(salary.month + '-01');
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);
  
  if (salaryMonth < currentMonth && salary.status === 'paid') {
    return res.status(400).json({
      success: false,
      message: 'Cannot edit salary records for past months that are already paid'
    });
  }

  // Store previous status for transaction creation and next month creation
  const previousStatus = salary.status;

  // When only "safe" fields are being updated (fixedSalary, remarks, paymentMethod), use
  // a selective $set so incentive/reward are never touched. This prevents incentive and
  // reward from being cleared when admin only edits fixed salary.
  const onlySafeFields = status === undefined && incentiveStatus === undefined && rewardStatus === undefined;
  if (onlySafeFields) {
    const setFields = { updatedBy: req.admin ? req.admin.id : null };

    if (fixedSalary !== undefined && fixedSalary !== null) {
      const parsedSalary = parseFloat(fixedSalary);
      if (isNaN(parsedSalary)) {
        return res.status(400).json({ success: false, message: 'Fixed salary must be a valid number' });
      }
      if (parsedSalary < 0) {
        return res.status(400).json({ success: false, message: 'Fixed salary must be greater than or equal to 0' });
      }
      setFields.fixedSalary = parsedSalary;
      const employee = await getEmployee(salary.employeeId, salary.employeeModel);
      if (employee && typeof employee.fixedSalary !== 'undefined') {
        employee.fixedSalary = parsedSalary;
        await employee.save();
      }
    }
    if (remarks !== undefined) setFields.remarks = remarks;
    if (paymentMethod && salary.status === 'paid') setFields.paymentMethod = paymentMethod;

    const updated = await Salary.findByIdAndUpdate(
      req.params.id,
      { $set: setFields },
      { new: true }
    ).populate('createdBy', 'name email').populate('updatedBy', 'name email');

    return res.json({
      success: true,
      message: 'Salary record updated successfully',
      data: updated
    });
  }

  // Update fixedSalary if provided (when also updating status / incentive / reward)
  if (fixedSalary !== undefined && fixedSalary !== null) {
    const parsedSalary = parseFloat(fixedSalary);
    console.log('Parsing fixedSalary:', { original: fixedSalary, parsed: parsedSalary });
    
    if (isNaN(parsedSalary)) {
      return res.status(400).json({
        success: false,
        message: 'Fixed salary must be a valid number'
      });
    }
    
    if (parsedSalary < 0) {
      return res.status(400).json({
        success: false,
        message: 'Fixed salary must be greater than or equal to 0'
      });
    }
    
    console.log('Updating fixedSalary from', salary.fixedSalary, 'to', parsedSalary);
    salary.fixedSalary = parsedSalary;
    console.log('Salary after update:', salary.fixedSalary);

    // Sync fixedSalary to underlying Employee/Sales/PM/Admin so wallet and profile show correct value
    const employee = await getEmployee(salary.employeeId, salary.employeeModel);
    if (employee && typeof employee.fixedSalary !== 'undefined') {
      employee.fixedSalary = parsedSalary;
      await employee.save();
    }
  }

  // Update fields
  if (status) {
    if (!['pending', 'paid'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "pending" or "paid"'
      });
    }
    salary.status = status;
    
    if (status === 'paid') {
      salary.paidDate = new Date();

      // For sales: pay incentive and reward together with salary on same day
      if (previousStatus !== 'paid' && salary.employeeModel === 'Sales' && salary.department === 'sales') {
        const { mapSalaryPaymentMethodToFinance } = require('../utils/paymentMethodMapper');
        const pm = paymentMethod ? mapSalaryPaymentMethodToFinance(paymentMethod) : 'Bank Transfer';
        const payDate = salary.paidDate || new Date();
        // Incentive: recalc from Incentive model (current balance), mark paid, create tx
        try {
          const incentives = await Incentive.find({ salesEmployee: salary.employeeId, currentBalance: { $gt: 0 } });
          const totalIncentive = incentives.reduce((sum, inc) => sum + (inc.currentBalance || 0), 0);
          if (totalIncentive > 0) {
            salary.incentiveAmount = totalIncentive;
            salary.incentiveStatus = 'paid';
            salary.incentivePaidDate = payDate;
            for (const inc of incentives) {
              inc.currentBalance = 0;
              if (!inc.paidAt) inc.paidAt = payDate;
              await inc.save();
            }
            const { createOutgoingTransaction } = require('../utils/financeTransactionHelper');
            const { mapSalaryPaymentMethodToFinance } = require('../utils/paymentMethodMapper');
            await createOutgoingTransaction({
              amount: totalIncentive,
              category: 'Incentive Payment',
              transactionDate: payDate,
              createdBy: req.admin.id,
              employee: salary.employeeId,
              paymentMethod: pm,
              description: `Incentive payment for ${salary.employeeName} - ${salary.month}`,
              metadata: { sourceType: 'incentive', sourceId: salary._id.toString(), month: salary.month },
              checkDuplicate: true
            });
          }
        } catch (e) {
          console.error('Error paying incentive with salary:', e);
        }
        // Reward: if rewardAmount > 0, mark paid and create tx
        try {
          const rewardAmt = Number(salary.rewardAmount || 0);
          if (rewardAmt > 0) {
            salary.rewardStatus = 'paid';
            salary.rewardPaidDate = payDate;
            const { createOutgoingTransaction } = require('../utils/financeTransactionHelper');
            const { mapSalaryPaymentMethodToFinance } = require('../utils/paymentMethodMapper');
            await createOutgoingTransaction({
              amount: rewardAmt,
              category: 'Reward Payment',
              transactionDate: payDate,
              createdBy: req.admin.id,
              employee: salary.employeeId,
              paymentMethod: pm,
              description: `Reward payment for ${salary.employeeName} - ${salary.month}`,
              metadata: { sourceType: 'reward', sourceId: salary._id.toString(), month: salary.month },
              checkDuplicate: true
            });
          }
        } catch (e) {
          console.error('Error paying reward with salary:', e);
        }
      }

      // Create finance transaction when salary is marked as paid
      try {
        const { createOutgoingTransaction } = require('../utils/financeTransactionHelper');
        const { mapSalaryPaymentMethodToFinance } = require('../utils/paymentMethodMapper');
        
        if (previousStatus !== 'paid') {
          await createOutgoingTransaction({
            amount: salary.fixedSalary,
            category: 'Salary Payment',
            transactionDate: salary.paidDate || new Date(),
            createdBy: req.admin.id,
            employee: salary.employeeId,
            paymentMethod: salary.paymentMethod ? mapSalaryPaymentMethodToFinance(salary.paymentMethod) : 'Bank Transfer',
            description: `Salary payment for ${salary.employeeName} - ${salary.month}`,
            metadata: {
              sourceType: 'salary',
              sourceId: salary._id.toString(),
              month: salary.month
            },
            checkDuplicate: true
          });
        }
      } catch (error) {
        // Log error but don't fail the salary update
        console.error('Error creating finance transaction for salary:', error);
      }

      // Auto-create next month's salary record when marking as paid
      if (previousStatus !== 'paid') {
        try {
          // Calculate next month
          const [year, monthStr] = salary.month.split('-');
          const month = parseInt(monthStr, 10) - 1; // Convert to 0-indexed (0-11)
          const nextMonthDate = new Date(parseInt(year), month + 1, 1); // Add 1 to get next month
          const nextMonth = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}`;

          // Get employee to get joining date
          const employeeModel = getEmployeeModelType(salary.role === 'project-manager' ? 'pm' : 
                                                      salary.employeeModel === 'Sales' ? 'sales' : 'employee');
          const employee = await getEmployee(salary.employeeId, employeeModel);

          if (employee) {
            const joiningDate = employee.joiningDate || salary.paymentDate;
            const paymentDate = calculatePaymentDate(joiningDate, nextMonth);
            const paymentDay = new Date(joiningDate).getDate();

            // Check if next month's salary already exists
            const existingNextMonth = await Salary.findOne({
              employeeId: salary.employeeId,
              employeeModel: salary.employeeModel,
              month: nextMonth
            });

            // Only create if it doesn't exist
            if (!existingNextMonth) {
              let nextIncentive = 0;
              let nextReward = 0;
              if (salary.employeeModel === 'Sales') {
                try {
                  const incs = await Incentive.find({ salesEmployee: salary.employeeId, currentBalance: { $gt: 0 } });
                  nextIncentive = incs.reduce((s, i) => s + (i.currentBalance || 0), 0);
                  nextReward = await calculateTeamTargetRewardForMonth(salary.employeeId, nextMonth);
                } catch (e) { /* ignore */ }
              }
              const role = salary.employeeModel === 'Sales' ? 'sales' : salary.employeeModel === 'PM' ? 'project-manager' : salary.role || 'employee';
              await Salary.create({
                employeeId: salary.employeeId,
                employeeModel: salary.employeeModel,
                employeeName: salary.employeeName,
                department: salary.department,
                role,
                month: nextMonth,
                fixedSalary: salary.fixedSalary,
                paymentDate,
                paymentDay,
                status: 'pending',
                incentiveAmount: nextIncentive,
                incentiveStatus: 'pending',
                rewardAmount: nextReward,
                rewardStatus: 'pending',
                createdBy: req.admin.id
              });
            }
          }
        } catch (error) {
          // Log error but don't fail the salary update
          console.error('Error creating next month salary record:', error);
        }
      }
    } else {
      salary.paidDate = null;
      salary.paymentMethod = null;
      
      // Cancel transaction if status changed back to pending
      try {
        const { cancelTransactionForSource } = require('../utils/financeTransactionHelper');
        await cancelTransactionForSource({
          sourceType: 'salary',
          sourceId: salary._id.toString()
        }, 'cancel');
      } catch (error) {
        console.error('Error canceling finance transaction for salary:', error);
      }
    }
  }

  if (paymentMethod && salary.status === 'paid') {
    salary.paymentMethod = paymentMethod;
  }

  if (remarks !== undefined) {
    salary.remarks = remarks;
  }

  // Handle separate incentive status update
  if (incentiveStatus !== undefined) {
    if (!['pending', 'paid'].includes(incentiveStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid incentiveStatus. Must be "pending" or "paid"'
      });
    }
    
    // Only allow incentive updates for sales team
    if (salary.employeeModel === 'Sales' && salary.department === 'sales') {
      const previousIncentiveStatus = salary.incentiveStatus;
      salary.incentiveStatus = incentiveStatus;
      
      if (incentiveStatus === 'paid') {
        salary.incentivePaidDate = new Date();
        
        // Find all Incentive records for this sales employee with currentBalance > 0
        const incentives = await Incentive.find({
          salesEmployee: salary.employeeId,
          currentBalance: { $gt: 0 }
        });

        // Calculate total incentive amount BEFORE clearing currentBalance
        // This preserves the amount that was paid for historical records
        const totalIncentiveAmount = incentives.reduce((sum, inc) => sum + (inc.currentBalance || 0), 0);
        
        // Store the incentive amount before clearing balances
        if (totalIncentiveAmount > 0) {
          salary.incentiveAmount = totalIncentiveAmount;
        }

        // Set currentBalance to 0 for all incentive records
        for (const incentive of incentives) {
          incentive.currentBalance = 0;
          if (!incentive.paidAt) {
            incentive.paidAt = new Date();
          }
          await incentive.save();
        }

        // Create finance transaction for incentive payment
        try {
          const { createOutgoingTransaction } = require('../utils/financeTransactionHelper');
          const { mapSalaryPaymentMethodToFinance } = require('../utils/paymentMethodMapper');
          
          if (previousIncentiveStatus !== 'paid' && salary.incentiveAmount > 0) {
            await createOutgoingTransaction({
              amount: salary.incentiveAmount,
              category: 'Incentive Payment',
              transactionDate: salary.incentivePaidDate || new Date(),
              createdBy: req.admin.id,
              employee: salary.employeeId,
              paymentMethod: paymentMethod ? mapSalaryPaymentMethodToFinance(paymentMethod) : 'Bank Transfer',
              description: `Incentive payment for ${salary.employeeName} - ${salary.month}`,
              metadata: {
                sourceType: 'incentive',
                sourceId: salary._id.toString(),
                month: salary.month
              },
              checkDuplicate: true
            });
          }
        } catch (error) {
          console.error('Error creating finance transaction for incentive:', error);
        }
      } else {
        salary.incentivePaidDate = null;
      }
    }
  }

  // Handle separate reward status update
  if (rewardStatus !== undefined) {
    if (!['pending', 'paid'].includes(rewardStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid rewardStatus. Must be "pending" or "paid"'
      });
    }
    
    const previousRewardStatus = salary.rewardStatus;
    salary.rewardStatus = rewardStatus;
    
    if (rewardStatus === 'paid') {
      salary.rewardPaidDate = new Date();
      
      // Create finance transaction for reward payment
      try {
        const { createOutgoingTransaction } = require('../utils/financeTransactionHelper');
        const { mapSalaryPaymentMethodToFinance } = require('../utils/paymentMethodMapper');
        
        if (previousRewardStatus !== 'paid' && salary.rewardAmount > 0) {
          await createOutgoingTransaction({
            amount: salary.rewardAmount,
            category: 'Reward Payment',
            transactionDate: salary.rewardPaidDate || new Date(),
            createdBy: req.admin.id,
            employee: salary.employeeId,
            paymentMethod: paymentMethod ? mapSalaryPaymentMethodToFinance(paymentMethod) : 'Bank Transfer',
            description: `Reward payment for ${salary.employeeName} - ${salary.month}`,
            metadata: {
              sourceType: 'reward',
              sourceId: salary._id.toString(),
              month: salary.month
            },
            checkDuplicate: true
          });
        }
      } catch (error) {
        console.error('Error creating finance transaction for reward:', error);
      }
    } else {
      salary.rewardPaidDate = null;
    }
  }

  salary.updatedBy = req.admin ? req.admin.id : null;
  
  console.log('Before save - salary.fixedSalary:', salary.fixedSalary);
  await salary.save();
  console.log('After save - salary.fixedSalary:', salary.fixedSalary);
  
  // Refresh from database to ensure we have latest data
  const updatedSalary = await Salary.findById(req.params.id);
  console.log('After refresh - updatedSalary.fixedSalary:', updatedSalary.fixedSalary);

  res.json({
    success: true,
    message: 'Salary record updated successfully',
    data: updatedSalary
  });
});

// @desc    Generate salary records for a specific month (auto-generation)
// @route   POST /api/admin/salary/generate/:month
// @access  Private (Admin/HR)
exports.generateMonthlySalaries = asyncHandler(async (req, res) => {
  const { month } = req.params;

  if (!/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid month format. Use YYYY-MM'
    });
  }

  // Get all employees with fixedSalary > 0 (including Admin/HR)
  const employees = await Employee.find({ fixedSalary: { $gt: 0 }, isActive: true });
  const sales = await Sales.find({ fixedSalary: { $gt: 0 }, isActive: true });
  const pms = await PM.find({ fixedSalary: { $gt: 0 }, isActive: true });
  const adminsWithSalary = await Admin.find({ fixedSalary: { $gt: 0 }, isActive: true });

  const allEmployees = [
    ...employees.map(e => ({ ...e.toObject(), modelType: 'Employee', model: Employee })),
    ...sales.map(s => ({ ...s.toObject(), modelType: 'Sales', model: Sales })),
    ...pms.map(p => ({ ...p.toObject(), modelType: 'PM', model: PM })),
    ...adminsWithSalary.map(a => ({ ...a.toObject(), modelType: 'Admin', model: Admin }))
  ];

  let generated = 0;
  let updated = 0;

  for (const emp of allEmployees) {
    const joiningDate = emp.joiningDate;
    const paymentDate = calculatePaymentDate(joiningDate, month);
    const paymentDay = new Date(joiningDate).getDate();

    const existing = await Salary.findOne({
      employeeId: emp._id,
      employeeModel: emp.modelType,
      month
    });

    // Calculate incentiveAmount and rewardAmount (team target reward) for sales team
    let incentiveAmount = 0;
    let rewardAmount = 0;
    if (emp.modelType === 'Sales') {
      try {
        const incentives = await Incentive.find({
          salesEmployee: emp._id,
          currentBalance: { $gt: 0 }
        });
        incentiveAmount = incentives.reduce((sum, inc) => sum + (inc.currentBalance || 0), 0);
        rewardAmount = await calculateTeamTargetRewardForMonth(emp._id, month);
      } catch (error) {
        console.error(`Error calculating incentive/reward for employee ${emp._id}:`, error);
      }
    }

    if (existing) {
      // Update existing record if salary changed or incentive/reward amounts changed
      let needsUpdate = existing.fixedSalary !== emp.fixedSalary;
      if (emp.modelType === 'Sales') {
        if (Math.abs((existing.incentiveAmount || 0) - incentiveAmount) > 0.01 ||
            Math.abs((existing.rewardAmount || 0) - rewardAmount) > 0.01) {
          needsUpdate = true;
        }
      }
      if (needsUpdate) {
        existing.fixedSalary = emp.fixedSalary;
        existing.paymentDate = paymentDate;
        existing.paymentDay = paymentDay;
        if (emp.modelType === 'Sales') {
          existing.incentiveAmount = incentiveAmount;
          existing.rewardAmount = rewardAmount;
        }
        existing.updatedBy = req.admin.id;
        await existing.save();
        updated++;
      }
    } else {
      // Create new record - map modelType to role for Salary schema
      const role = emp.modelType === 'Sales' ? 'sales' : emp.modelType === 'PM' ? 'project-manager' : emp.role || 'employee'
      await Salary.create({
        employeeId: emp._id,
        employeeModel: emp.modelType,
        employeeName: emp.name,
        department: emp.department || 'unknown',
        role,
        month,
        fixedSalary: emp.fixedSalary,
        paymentDate,
        paymentDay,
        status: 'pending',
        incentiveAmount,
        incentiveStatus: 'pending',
        rewardAmount,
        rewardStatus: 'pending',
        createdBy: req.admin.id
      });
      generated++;
    }
  }

  res.json({
    success: true,
    message: `Salary records generated: ${generated} new, ${updated} updated`,
    data: {
      generated,
      updated,
      total: allEmployees.length
    }
  });
});

// @desc    Get salary history for an employee
// @route   GET /api/admin/salary/employee/:userType/:employeeId
// @access  Private (Admin/HR)
exports.getEmployeeSalaryHistory = asyncHandler(async (req, res) => {
  const { userType, employeeId: rawEmployeeId } = req.params;

  const employeeModel = getEmployeeModelType(userType);
  if (!employeeModel) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user type'
    });
  }

  // Ensure employeeId is a valid ObjectId (frontend may send string; reject invalid values like "[object Object]")
  if (!rawEmployeeId || typeof rawEmployeeId !== 'string' || !mongoose.Types.ObjectId.isValid(rawEmployeeId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid employee ID'
    });
  }
  const employeeId = new mongoose.Types.ObjectId(rawEmployeeId);

  const salaries = await Salary.find({
    employeeId,
    employeeModel
  })
    .sort({ month: -1 })
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  res.json({
    success: true,
    data: salaries
  });
});

// @desc    Delete salary record (admin can delete any record, including paid)
// @route   DELETE /api/admin/salary/:id
// @access  Private (Admin/HR)
exports.deleteSalaryRecord = asyncHandler(async (req, res) => {
  const salary = await Salary.findById(req.params.id);
  
  if (!salary) {
    return res.status(404).json({
      success: false,
      message: 'Salary record not found'
    });
  }

  // Admin has full power to delete any salary record (paid or pending, past or future)
  await Salary.findByIdAndDelete(salary._id);

  res.json({
    success: true,
    message: 'Salary record deleted successfully'
  });
});

// @desc    Update incentive payment status
// @route   PUT /api/admin/salary/:id/incentive
// @access  Private (Admin/HR)
exports.updateIncentivePayment = asyncHandler(async (req, res) => {
  const { incentiveStatus, paymentMethod, remarks } = req.body;

  if (!incentiveStatus || !['pending', 'paid'].includes(incentiveStatus)) {
    return res.status(400).json({
      success: false,
      message: 'Valid incentiveStatus (pending or paid) is required'
    });
  }

  const salary = await Salary.findById(req.params.id);
  if (!salary) {
    return res.status(404).json({
      success: false,
      message: 'Salary record not found'
    });
  }

  // Only allow incentive updates for sales team
  if (salary.employeeModel !== 'Sales' || salary.department !== 'sales') {
    return res.status(400).json({
      success: false,
      message: 'Incentive payment is only available for sales team employees'
    });
  }

  const previousStatus = salary.incentiveStatus;

  // Update incentive status
  salary.incentiveStatus = incentiveStatus;

  if (incentiveStatus === 'paid') {
    salary.incentivePaidDate = new Date();
    
    // Find all Incentive records for this sales employee with currentBalance > 0
    const incentives = await Incentive.find({
      salesEmployee: salary.employeeId,
      currentBalance: { $gt: 0 }
    });

    // Calculate total incentive amount BEFORE clearing currentBalance
    // This preserves the amount that was paid for historical records
    const totalIncentiveAmount = incentives.reduce((sum, inc) => sum + (inc.currentBalance || 0), 0);
    
    // Store the incentive amount before clearing balances
    if (totalIncentiveAmount > 0) {
      salary.incentiveAmount = totalIncentiveAmount;
    }

    // Set currentBalance to 0 for all incentive records
    for (const incentive of incentives) {
      incentive.currentBalance = 0;
      if (!incentive.paidAt) {
        incentive.paidAt = new Date();
      }
      await incentive.save();
    }

    // Create finance transaction for incentive payment
    try {
      const { createOutgoingTransaction } = require('../utils/financeTransactionHelper');
      const { mapSalaryPaymentMethodToFinance } = require('../utils/paymentMethodMapper');
      
      if (previousStatus !== 'paid' && salary.incentiveAmount > 0) {
        await createOutgoingTransaction({
          amount: salary.incentiveAmount,
          category: 'Incentive Payment',
          transactionDate: salary.incentivePaidDate || new Date(),
          createdBy: req.admin.id,
          employee: salary.employeeId,
          paymentMethod: paymentMethod ? mapSalaryPaymentMethodToFinance(paymentMethod) : 'Bank Transfer',
          description: `Incentive payment for ${salary.employeeName} - ${salary.month}`,
          metadata: {
            sourceType: 'incentive',
            sourceId: salary._id.toString(),
            month: salary.month
          },
          checkDuplicate: true
        });
      }
    } catch (error) {
      console.error('Error creating finance transaction for incentive:', error);
    }
  } else {
    salary.incentivePaidDate = null;
    
    // Cancel transaction if status changed back to pending
    try {
      const { cancelTransactionForSource } = require('../utils/financeTransactionHelper');
      await cancelTransactionForSource({
        sourceType: 'incentive',
        sourceId: salary._id.toString()
      }, 'cancel');
    } catch (error) {
      console.error('Error canceling finance transaction for incentive:', error);
    }
  }

  if (paymentMethod && salary.incentiveStatus === 'paid') {
    // Store payment method in remarks or create a separate field if needed
    if (remarks) {
      salary.remarks = (salary.remarks || '') + ` [Incentive Payment: ${paymentMethod}]`;
    }
  }

  if (remarks && salary.incentiveStatus === 'paid') {
    salary.remarks = (salary.remarks || '') + ` [Incentive: ${remarks}]`;
  }

  salary.updatedBy = req.admin.id;
  await salary.save();

  res.json({
    success: true,
    message: 'Incentive payment status updated successfully',
    data: salary
  });
});

// @desc    Update reward payment status
// @route   PUT /api/admin/salary/:id/reward
// @access  Private (Admin/HR)
exports.updateRewardPayment = asyncHandler(async (req, res) => {
  const { rewardStatus, paymentMethod, remarks } = req.body;

  if (!rewardStatus || !['pending', 'paid'].includes(rewardStatus)) {
    return res.status(400).json({
      success: false,
      message: 'Valid rewardStatus (pending or paid) is required'
    });
  }

  const salary = await Salary.findById(req.params.id);
  if (!salary) {
    return res.status(404).json({
      success: false,
      message: 'Salary record not found'
    });
  }

  const previousStatus = salary.rewardStatus;

  // Update reward status
  salary.rewardStatus = rewardStatus;

  if (rewardStatus === 'paid') {
    salary.rewardPaidDate = new Date();
    
    // Create finance transaction for reward payment
    try {
      const { createOutgoingTransaction } = require('../utils/financeTransactionHelper');
      const { mapSalaryPaymentMethodToFinance } = require('../utils/paymentMethodMapper');
      
      if (previousStatus !== 'paid' && salary.rewardAmount > 0) {
        await createOutgoingTransaction({
          amount: salary.rewardAmount,
          category: 'Reward Payment',
          transactionDate: salary.rewardPaidDate || new Date(),
          createdBy: req.admin.id,
          employee: salary.employeeId,
          paymentMethod: paymentMethod ? mapSalaryPaymentMethodToFinance(paymentMethod) : 'Bank Transfer',
          description: `Reward payment for ${salary.employeeName} - ${salary.month}`,
          metadata: {
            sourceType: 'reward',
            sourceId: salary._id.toString(),
            month: salary.month
          },
          checkDuplicate: true
        });
      }
    } catch (error) {
      console.error('Error creating finance transaction for reward:', error);
    }
  } else {
    salary.rewardPaidDate = null;
    
    // Cancel transaction if status changed back to pending
    try {
      const { cancelTransactionForSource } = require('../utils/financeTransactionHelper');
      await cancelTransactionForSource({
        sourceType: 'reward',
        sourceId: salary._id.toString()
      }, 'cancel');
    } catch (error) {
      console.error('Error canceling finance transaction for reward:', error);
    }
  }

  if (paymentMethod && salary.rewardStatus === 'paid') {
    if (remarks) {
      salary.remarks = (salary.remarks || '') + ` [Reward Payment: ${paymentMethod}]`;
    }
  }

  if (remarks && salary.rewardStatus === 'paid') {
    salary.remarks = (salary.remarks || '') + ` [Reward: ${remarks}]`;
  }

  salary.updatedBy = req.admin.id;
  await salary.save();

  res.json({
    success: true,
    message: 'Reward payment status updated successfully',
    data: salary
  });
});

