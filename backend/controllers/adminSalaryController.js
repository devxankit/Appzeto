const Salary = require('../models/Salary');
const Employee = require('../models/Employee');
const Sales = require('../models/Sales');
const PM = require('../models/PM');
const mongoose = require('mongoose');
const asyncHandler = require('../middlewares/asyncHandler');

// Helper: Get employee by ID and model type
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

// Helper: Get employee model type from user type
const getEmployeeModelType = (userType) => {
  switch (userType) {
    case 'employee':
      return 'Employee';
    case 'sales':
      return 'Sales';
    case 'project-manager':
    case 'pm':
      return 'PM';
    default:
      return null;
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

  // Update fixed salary
  employee.fixedSalary = fixedSalary;
  await employee.save();

  // Auto-generate salary records for current and next 3 months
  const currentDate = new Date();
  const months = [];
  for (let i = 0; i < 4; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  }

  const joiningDate = employee.joiningDate;
  const paymentDay = new Date(joiningDate).getDate();

  for (const month of months) {
    const paymentDate = calculatePaymentDate(joiningDate, month);
    
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
        department: employee.department || 'unknown',
        role: employee.role || userType,
        month,
        fixedSalary,
        paymentDate,
        paymentDay,
        status: 'pending',
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
    message: `Fixed salary set to ₹${fixedSalary.toLocaleString()} and salary records generated`,
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

  const salaries = await Salary.find(filter)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .sort({ paymentDate: 1, employeeName: 1 });

  // Calculate statistics
  const stats = {
    totalEmployees: salaries.length,
    paidEmployees: salaries.filter(s => s.status === 'paid').length,
    pendingEmployees: salaries.filter(s => s.status === 'pending').length,
    totalAmount: salaries.reduce((sum, s) => sum + s.fixedSalary, 0),
    paidAmount: salaries.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.fixedSalary, 0),
    pendingAmount: salaries.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.fixedSalary, 0)
  };

  res.json({
    success: true,
    data: salaries,
    stats,
    month: currentMonth
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
  const { status, paymentMethod, remarks } = req.body;

  const salary = await Salary.findById(req.params.id);
  if (!salary) {
    return res.status(404).json({
      success: false,
      message: 'Salary record not found'
    });
  }

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

  // Store previous status for transaction creation
  const previousStatus = salary.status;

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

  salary.updatedBy = req.admin.id;
  await salary.save();

  res.json({
    success: true,
    message: 'Salary record updated successfully',
    data: salary
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

  // Get all employees with fixedSalary > 0
  const employees = await Employee.find({ fixedSalary: { $gt: 0 }, isActive: true });
  const sales = await Sales.find({ fixedSalary: { $gt: 0 }, isActive: true });
  const pms = await PM.find({ fixedSalary: { $gt: 0 }, isActive: true });

  const allEmployees = [
    ...employees.map(e => ({ ...e.toObject(), modelType: 'Employee', model: Employee })),
    ...sales.map(s => ({ ...s.toObject(), modelType: 'Sales', model: Sales })),
    ...pms.map(p => ({ ...p.toObject(), modelType: 'PM', model: PM }))
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

    if (existing) {
      // Update existing record if salary changed
      if (existing.fixedSalary !== emp.fixedSalary) {
        existing.fixedSalary = emp.fixedSalary;
        existing.paymentDate = paymentDate;
        existing.paymentDay = paymentDay;
        existing.updatedBy = req.admin.id;
        await existing.save();
        updated++;
      }
    } else {
      // Create new record
      await Salary.create({
        employeeId: emp._id,
        employeeModel: emp.modelType,
        employeeName: emp.name,
        department: emp.department || 'unknown',
        role: emp.role || 'employee',
        month,
        fixedSalary: emp.fixedSalary,
        paymentDate,
        paymentDay,
        status: 'pending',
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
  const { userType, employeeId } = req.params;

  const employeeModel = getEmployeeModelType(userType);
  if (!employeeModel) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user type'
    });
  }

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

// @desc    Delete salary record (only for pending and current/future months)
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

  // Only allow deletion of pending records in current/future months
  const salaryMonth = new Date(salary.month + '-01');
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  if (salary.status === 'paid') {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete paid salary records'
    });
  }

  if (salaryMonth < currentMonth) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete salary records for past months'
    });
  }

  await Salary.findByIdAndDelete(salary._id);

  res.json({
    success: true,
    message: 'Salary record deleted successfully'
  });
});

