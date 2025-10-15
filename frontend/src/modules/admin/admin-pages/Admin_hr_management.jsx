import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Admin_navbar from '../admin-components/Admin_navbar'
import Admin_sidebar from '../admin-components/Admin_sidebar'
import { 
  Users, 
  UserCheck,
  X,
  Plus,
  Cake,
  Shield,
  User,
  UserPlus,
  Edit3,
  Trash2,
  Eye,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  Code,
  TrendingUp,
  Home,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Upload,
  FileText,
  FileSpreadsheet,
  Download,
  BarChart3,
  TrendingUp as TrendingUpIcon,
  Calendar as CalendarIcon,
  UserCheck as UserCheckIcon,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Banknote,
  CreditCard,
  Receipt,
  Calculator,
  PieChart,
  TrendingDown,
  Wallet,
  MessageSquare,
  Send,
  Laptop,
  Monitor,
  Smartphone,
  Headphones,
  Wifi,
  Car,
  Gift,
  Package,
  ClipboardList,
  FileCheck,
  UserX
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Combobox } from '../../../components/ui/combobox'
import Loading from '../../../components/ui/loading'

const Admin_hr_management = () => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('team')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [showBirthdayModal, setShowBirthdayModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [birthdayData, setBirthdayData] = useState({
    personId: '',
    birthday: '',
    personType: 'employee' // 'employee' or 'pm'
  })
  
  // Attendance states
  const [attendanceData, setAttendanceData] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)) // YYYY-MM format
  const [attendanceFile, setAttendanceFile] = useState(null)
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [attendanceStats, setAttendanceStats] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    attendanceRate: 0
  })

  // Salary states
  const [salaryData, setSalaryData] = useState([])
  const [selectedSalaryMonth, setSelectedSalaryMonth] = useState(new Date().toISOString().slice(0, 7))
  const [selectedSalaryDepartment, setSelectedSalaryDepartment] = useState('all')
  const [selectedSalaryWeek, setSelectedSalaryWeek] = useState('all')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all')
  const [salaryStats, setSalaryStats] = useState({
    totalEmployees: 0,
    paidEmployees: 0,
    pendingEmployees: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0
  })
  const [showSalaryModal, setShowSalaryModal] = useState(false)
  const [selectedSalaryRecord, setSelectedSalaryRecord] = useState(null)
  const [showEditSalaryModal, setShowEditSalaryModal] = useState(false)
  const [showAddEmployeeSalaryModal, setShowAddEmployeeSalaryModal] = useState(false)
  const [showDeleteSalaryModal, setShowDeleteSalaryModal] = useState(false)
  const [salaryToDelete, setSalaryToDelete] = useState(null)
  const [newEmployeeSalaryData, setNewEmployeeSalaryData] = useState({
    employeeId: '',
    salary: ''
  })
  const [editSalaryData, setEditSalaryData] = useState({
    basicSalary: ''
  })

  // Requests states
  const [requests, setRequests] = useState([])
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestData, setRequestData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    department: ''
  })

  // Allowances states
  const [allowances, setAllowances] = useState([])
  const [showAllowanceModal, setShowAllowanceModal] = useState(false)
  const [allowanceData, setAllowanceData] = useState({
    employeeId: '',
    itemType: '',
    itemName: '',
    serialNumber: '',
    issueDate: '',
    returnDate: '',
    status: 'active',
    value: '',
    remarks: ''
  })

  // Recurring Expenses states
  const [recurringExpenses, setRecurringExpenses] = useState([])
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [expenseData, setExpenseData] = useState({
    name: '',
    category: '',
    amount: '',
    frequency: 'monthly',
    startDate: '',
    endDate: '',
    status: 'active',
    description: '',
    vendor: '',
    paymentMethod: 'bank_transfer'
  })
  const [expenseStats, setExpenseStats] = useState({
    totalExpenses: 0,
    activeExpenses: 0,
    monthlyTotal: 0,
    yearlyTotal: 0,
    categories: {}
  })

  // Expense filter states
  const [expenseFilters, setExpenseFilters] = useState({
    selectedMonth: new Date().toISOString().slice(0, 7), // YYYY-MM format
    selectedYear: new Date().getFullYear().toString(),
    selectedCategory: 'all',
    selectedStatus: 'all',
    selectedFrequency: 'all',
    viewMode: 'all' // 'all', 'monthly', 'yearly'
  })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    team: '',
    department: '',
    status: 'active',
    dateOfBirth: '',
    joiningDate: '',
    document: null,
    password: '',
    confirmPassword: ''
  })

  // Birthday Statistics
  const [statistics, setStatistics] = useState({
    totalBirthdays: 8,
    todayBirthdays: 2,
    thisWeekBirthdays: 5,
    thisMonthBirthdays: 8
  })

  // Mock data
  const [employees, setEmployees] = useState([])
  const [projectManagers, setProjectManagers] = useState([])
  const [birthdays, setBirthdays] = useState([])
  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock employees data with birthdays
      const mockEmployees = [
        {
          id: 1,
          name: "Priya Sharma",
          email: "priya.sharma@company.com",
          phone: "+91 98765 43210",
          role: "Senior Developer",
          department: "Engineering",
          status: "active",
          joinDate: "2023-06-01",
          birthday: "1995-03-15",
          age: 29,
          experience: 4.5,
          salary: 55000,
          performance: 95,
          avatar: "PS",
          team: "developer",
          manager: "Sarah Johnson"
        },
        {
          id: 2,
          name: "Rajesh Kumar",
          email: "rajesh.kumar@company.com",
          phone: "+91 87654 32109",
          role: "UI/UX Designer",
          department: "Design",
          status: "active",
          joinDate: "2023-08-15",
          birthday: "1992-07-22",
          age: 32,
          experience: 6.2,
          salary: 48000,
          performance: 88,
          avatar: "RK",
          team: "developer",
          manager: "Mike Wilson"
        },
        {
          id: 3,
          name: "Anjali Singh",
          email: "anjali.singh@company.com",
          phone: "+91 76543 21098",
          role: "QA Engineer",
          department: "Engineering",
          status: "active",
          joinDate: "2023-04-10",
          birthday: "1998-01-08",
          age: 26,
          experience: 2.8,
          salary: 42000,
          performance: 92,
          avatar: "AS",
          team: "developer",
          manager: "Lisa Davis"
        },
        {
          id: 4,
          name: "Vikram Mehta",
          email: "vikram.mehta@company.com",
          phone: "+91 65432 10987",
          role: "DevOps Engineer",
          department: "Engineering",
          status: "on-leave",
          joinDate: "2023-02-01",
          birthday: "1990-12-03",
          age: 34,
          experience: 8.1,
          salary: 60000,
          performance: 98,
          avatar: "VM",
          team: "developer",
          manager: "David Brown"
        },
        {
          id: 5,
          name: "Sneha Gupta",
          email: "sneha.gupta@company.com",
          phone: "+91 54321 09876",
          role: "Sales Executive",
          department: "Sales",
          status: "active",
          joinDate: "2023-09-01",
          birthday: "1996-05-18",
          age: 28,
          experience: 3.5,
          salary: 38000,
          performance: 85,
          avatar: "SG",
          team: "sales",
          manager: "Emma Taylor"
        },
        {
          id: 6,
          name: "Amit Patel",
          email: "amit.patel@company.com",
          phone: "+91 43210 98765",
          role: "Marketing Specialist",
          department: "Marketing",
          status: "active",
          joinDate: "2023-11-15",
          birthday: "1994-09-12",
          age: 30,
          experience: 5.2,
          salary: 45000,
          performance: 90,
          avatar: "AP",
          team: "sales",
          manager: "Emma Taylor"
        }
      ]

      // Mock project managers data with birthdays
      const mockPMs = [
        {
          id: 101,
          name: "Sarah Johnson",
          email: "sarah.johnson@company.com",
          phone: "+91 98765 12345",
          role: "Senior Project Manager",
          department: "Management",
          status: "active",
          joinDate: "2023-02-01",
          birthday: "1988-04-25",
          age: 36,
          experience: 10.5,
          salary: 75000,
          performance: 98,
          avatar: "SJ",
          projects: 5,
          teamSize: 12
        },
        {
          id: 102,
          name: "Mike Wilson",
          email: "mike.wilson@company.com",
          phone: "+91 87654 23456",
          role: "Project Manager",
          department: "Management",
          status: "active",
          joinDate: "2023-05-15",
          birthday: "1991-11-14",
          age: 33,
          experience: 8.2,
          salary: 68000,
          performance: 92,
          avatar: "MW",
          projects: 4,
          teamSize: 8
        },
        {
          id: 103,
          name: "Lisa Davis",
          email: "lisa.davis@company.com",
          phone: "+91 76543 34567",
          role: "Project Manager",
          department: "Management",
          status: "active",
          joinDate: "2023-08-01",
          birthday: "1989-06-30",
          age: 35,
          experience: 9.1,
          salary: 72000,
          performance: 95,
          avatar: "LD",
          projects: 3,
          teamSize: 6
        }
      ]

      // Mock birthdays data
      const mockBirthdays = [
        {
          id: 1,
          personId: 1,
          personName: "Priya Sharma",
          personType: "employee",
          birthday: "1995-03-15",
          age: 29,
          department: "Engineering",
          role: "Senior Developer"
        },
        {
          id: 2,
          personId: 2,
          personName: "Rajesh Kumar",
          personType: "employee",
          birthday: "1992-07-22",
          age: 32,
          department: "Design",
          role: "UI/UX Designer"
        },
        {
          id: 3,
          personId: 101,
          personName: "Sarah Johnson",
          personType: "pm",
          birthday: "1988-04-25",
          age: 36,
          department: "Management",
          role: "Senior Project Manager"
        }
      ]

      setEmployees(mockEmployees)
      setProjectManagers(mockPMs)
      setBirthdays(mockBirthdays)
      
      // Combine all users for team management
      const combinedUsers = [
        ...mockEmployees.map(emp => ({ ...emp, role: 'employee' })),
        ...mockPMs.map(pm => ({ ...pm, role: 'project-manager' }))
      ]
      setAllUsers(combinedUsers)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get today's birthdays
  const getTodaysBirthdays = () => {
    const today = new Date()
    const todayStr = `${today.getMonth() + 1}-${today.getDate()}`
    
    return [...employees, ...projectManagers].filter(person => {
      if (!person.birthday) return false
      const birthday = new Date(person.birthday)
      const birthdayStr = `${birthday.getMonth() + 1}-${birthday.getDate()}`
      return birthdayStr === todayStr
    })
  }

  // Get this week's birthdays
  const getThisWeekBirthdays = () => {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    return [...employees, ...projectManagers].filter(person => {
      if (!person.birthday) return false
      const birthday = new Date(person.birthday)
      const currentYear = today.getFullYear()
      birthday.setFullYear(currentYear)
      return birthday >= weekStart && birthday <= weekEnd
    })
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Requests functions
  const generateRequestsData = () => {
    const mockRequests = [
      {
        id: 1,
        title: 'New Laptop Request',
        description: 'Need new laptops for the development team as current ones are outdated',
        category: 'Equipment',
        priority: 'high',
        department: 'nodejs',
        status: 'pending',
        requestedBy: 'HR Manager',
        requestDate: '2024-01-15',
        adminResponse: null,
        responseDate: null
      },
      {
        id: 2,
        title: 'Office Furniture',
        description: 'Request for ergonomic chairs and standing desks for better employee comfort',
        category: 'Furniture',
        priority: 'medium',
        department: 'all',
        status: 'approved',
        requestedBy: 'HR Manager',
        requestDate: '2024-01-10',
        adminResponse: 'Approved. Budget allocated for Q1.',
        responseDate: '2024-01-12'
      },
      {
        id: 3,
        title: 'Team Building Event',
        description: 'Organize team building activities for better team collaboration',
        category: 'Events',
        priority: 'low',
        department: 'all',
        status: 'pending',
        requestedBy: 'HR Manager',
        requestDate: '2024-01-18',
        adminResponse: null,
        responseDate: null
      }
    ]
    setRequests(mockRequests)
  }

  const handleCreateRequest = () => {
    setRequestData({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      department: ''
    })
    setShowRequestModal(true)
  }

  const handleSaveRequest = () => {
    const newRequest = {
      id: requests.length + 1,
      ...requestData,
      status: 'pending',
      requestedBy: 'HR Manager',
      requestDate: new Date().toISOString().split('T')[0],
      adminResponse: null,
      responseDate: null
    }
    setRequests([...requests, newRequest])
    setShowRequestModal(false)
    setRequestData({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      department: ''
    })
  }

  const getRequestStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Allowances functions
  const generateAllowancesData = () => {
    const mockAllowances = [
      {
        id: 1,
        employeeId: 1,
        employeeName: 'John Doe',
        itemType: 'laptop',
        itemName: 'MacBook Pro 16"',
        serialNumber: 'MBP2024001',
        issueDate: '2024-01-15',
        returnDate: null,
        status: 'active',
        value: 150000,
        remarks: 'Development work laptop'
      },
      {
        id: 2,
        employeeId: 2,
        employeeName: 'Jane Smith',
        itemType: 'monitor',
        itemName: 'Dell UltraSharp 27"',
        serialNumber: 'DELL2024002',
        issueDate: '2024-01-10',
        returnDate: null,
        status: 'active',
        value: 25000,
        remarks: 'External monitor for better productivity'
      },
      {
        id: 3,
        employeeId: 3,
        employeeName: 'Mike Johnson',
        itemType: 'headphones',
        itemName: 'Sony WH-1000XM4',
        serialNumber: 'SONY2024003',
        issueDate: '2024-01-05',
        returnDate: '2024-01-20',
        status: 'returned',
        value: 15000,
        remarks: 'Noise-cancelling headphones - returned'
      }
    ]
    setAllowances(mockAllowances)
  }

  const handleCreateAllowance = () => {
    setAllowanceData({
      employeeId: '',
      itemType: '',
      itemName: '',
      serialNumber: '',
      issueDate: '',
      returnDate: '',
      status: 'active',
      value: '',
      remarks: ''
    })
    setShowAllowanceModal(true)
  }

  const handleSaveAllowance = () => {
    const selectedEmployee = allUsers.find(user => user.id.toString() === allowanceData.employeeId)
    const newAllowance = {
      id: allowances.length + 1,
      ...allowanceData,
      employeeName: selectedEmployee ? selectedEmployee.name : 'Unknown',
      value: parseFloat(allowanceData.value)
    }
    setAllowances([...allowances, newAllowance])
    setShowAllowanceModal(false)
    setAllowanceData({
      employeeId: '',
      itemType: '',
      itemName: '',
      serialNumber: '',
      issueDate: '',
      returnDate: '',
      status: 'active',
      value: '',
      remarks: ''
    })
  }

  const getItemIcon = (itemType) => {
    switch (itemType) {
      case 'laptop': return <Laptop className="h-4 w-4" />
      case 'monitor': return <Monitor className="h-4 w-4" />
      case 'smartphone': return <Smartphone className="h-4 w-4" />
      case 'headphones': return <Headphones className="h-4 w-4" />
      case 'wifi': return <Wifi className="h-4 w-4" />
      case 'car': return <Car className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getAllowanceStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'returned': return 'bg-blue-100 text-blue-800'
      case 'lost': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Recurring Expenses functions
  const generateRecurringExpensesData = () => {
    const mockExpenses = [
      {
        id: 1,
        name: 'Office Rent',
        category: 'rent',
        amount: 50000,
        frequency: 'monthly',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'active',
        description: 'Monthly office rent for main building',
        vendor: 'Property Management Co.',
        paymentMethod: 'bank_transfer',
        lastPaid: '2024-01-15',
        nextDue: '2024-02-01'
      },
      {
        id: 2,
        name: 'Electricity Bill',
        category: 'utilities',
        amount: 15000,
        frequency: 'monthly',
        startDate: '2024-01-01',
        endDate: null,
        status: 'active',
        description: 'Monthly electricity consumption',
        vendor: 'State Electricity Board',
        paymentMethod: 'auto_debit',
        lastPaid: '2024-01-20',
        nextDue: '2024-02-20'
      },
      {
        id: 3,
        name: 'Internet & Phone',
        category: 'utilities',
        amount: 8000,
        frequency: 'monthly',
        startDate: '2024-01-01',
        endDate: null,
        status: 'active',
        description: 'High-speed internet and office phone lines',
        vendor: 'Telecom Provider',
        paymentMethod: 'credit_card',
        lastPaid: '2024-01-10',
        nextDue: '2024-02-10'
      },
      {
        id: 4,
        name: 'Office Cleaning',
        category: 'maintenance',
        amount: 12000,
        frequency: 'monthly',
        startDate: '2024-01-01',
        endDate: null,
        status: 'active',
        description: 'Professional cleaning services',
        vendor: 'CleanPro Services',
        paymentMethod: 'bank_transfer',
        lastPaid: '2024-01-25',
        nextDue: '2024-02-25'
      },
      {
        id: 5,
        name: 'Software Licenses',
        category: 'software',
        amount: 25000,
        frequency: 'yearly',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'active',
        description: 'Annual software subscriptions and licenses',
        vendor: 'Software Solutions Inc.',
        paymentMethod: 'bank_transfer',
        lastPaid: '2024-01-05',
        nextDue: '2025-01-05'
      },
      {
        id: 6,
        name: 'Insurance Premium',
        category: 'insurance',
        amount: 30000,
        frequency: 'yearly',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'active',
        description: 'Office and equipment insurance',
        vendor: 'Insurance Corp',
        paymentMethod: 'bank_transfer',
        lastPaid: '2024-01-01',
        nextDue: '2025-01-01'
      }
    ]
    setRecurringExpenses(mockExpenses)
    calculateExpenseStats(mockExpenses)
  }

  const calculateExpenseStats = (expenses) => {
    const totalExpenses = expenses.length
    const activeExpenses = expenses.filter(exp => exp.status === 'active').length
    
    let monthlyTotal = 0
    let yearlyTotal = 0
    const categories = {}

    expenses.forEach(expense => {
      if (expense.status === 'active') {
        // Calculate monthly contribution
        if (expense.frequency === 'monthly') {
          monthlyTotal += expense.amount
          yearlyTotal += expense.amount * 12
        } else if (expense.frequency === 'yearly') {
          monthlyTotal += expense.amount / 12
          yearlyTotal += expense.amount
        } else if (expense.frequency === 'quarterly') {
          monthlyTotal += expense.amount / 3
          yearlyTotal += expense.amount * 4
        }

        // Count by category
        if (!categories[expense.category]) {
          categories[expense.category] = 0
        }
        categories[expense.category]++
      }
    })

    setExpenseStats({
      totalExpenses,
      activeExpenses,
      monthlyTotal: Math.round(monthlyTotal),
      yearlyTotal: Math.round(yearlyTotal),
      categories
    })
  }

  const handleCreateExpense = () => {
    setExpenseData({
      name: '',
      category: '',
      amount: '',
      frequency: 'monthly',
      startDate: '',
      endDate: '',
      status: 'active',
      description: '',
      vendor: '',
      paymentMethod: 'bank_transfer'
    })
    setShowExpenseModal(true)
  }

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense)
    setExpenseData({
      name: expense.name,
      category: expense.category,
      amount: expense.amount.toString(),
      frequency: expense.frequency,
      startDate: expense.startDate,
      endDate: expense.endDate || '',
      status: expense.status,
      description: expense.description,
      vendor: expense.vendor,
      paymentMethod: expense.paymentMethod
    })
    setShowEditExpenseModal(true)
  }

  const handleSaveExpense = () => {
    if (!expenseData.name || !expenseData.amount || !expenseData.category) {
      alert('Please fill in all required fields')
      return
    }

    const newExpense = {
      id: recurringExpenses.length + 1,
      ...expenseData,
      amount: parseFloat(expenseData.amount),
      lastPaid: null,
      nextDue: calculateNextDueDate(expenseData.startDate, expenseData.frequency)
    }

    const updatedExpenses = [...recurringExpenses, newExpense]
    setRecurringExpenses(updatedExpenses)
    calculateExpenseStats(updatedExpenses)
    setShowExpenseModal(false)
    resetExpenseData()
  }

  const handleUpdateExpense = () => {
    if (!expenseData.name || !expenseData.amount || !expenseData.category) {
      alert('Please fill in all required fields')
      return
    }

    const updatedExpenses = recurringExpenses.map(expense => 
      expense.id === selectedExpense.id 
        ? { 
            ...expense, 
            ...expenseData, 
            amount: parseFloat(expenseData.amount),
            nextDue: calculateNextDueDate(expenseData.startDate, expenseData.frequency)
          }
        : expense
    )

    setRecurringExpenses(updatedExpenses)
    calculateExpenseStats(updatedExpenses)
    setShowEditExpenseModal(false)
    setSelectedExpense(null)
    resetExpenseData()
  }

  const handleDeleteExpense = (expense) => {
    if (window.confirm(`Are you sure you want to delete "${expense.name}"?`)) {
      const updatedExpenses = recurringExpenses.filter(exp => exp.id !== expense.id)
      setRecurringExpenses(updatedExpenses)
      calculateExpenseStats(updatedExpenses)
    }
  }

  const calculateNextDueDate = (startDate, frequency) => {
    const start = new Date(startDate)
    const now = new Date()
    
    if (frequency === 'monthly') {
      const nextDue = new Date(now.getFullYear(), now.getMonth() + 1, start.getDate())
      return nextDue.toISOString().split('T')[0]
    } else if (frequency === 'yearly') {
      const nextDue = new Date(now.getFullYear() + 1, start.getMonth(), start.getDate())
      return nextDue.toISOString().split('T')[0]
    } else if (frequency === 'quarterly') {
      const nextDue = new Date(now.getFullYear(), now.getMonth() + 3, start.getDate())
      return nextDue.toISOString().split('T')[0]
    }
    return startDate
  }

  const resetExpenseData = () => {
    setExpenseData({
      name: '',
      category: '',
      amount: '',
      frequency: 'monthly',
      startDate: '',
      endDate: '',
      status: 'active',
      description: '',
      vendor: '',
      paymentMethod: 'bank_transfer'
    })
  }

  const getExpenseStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getExpenseCategoryIcon = (category) => {
    switch (category) {
      case 'rent': return <Home className="h-4 w-4" />
      case 'utilities': return <Wifi className="h-4 w-4" />
      case 'maintenance': return <Package className="h-4 w-4" />
      case 'software': return <Laptop className="h-4 w-4" />
      case 'insurance': return <Shield className="h-4 w-4" />
      case 'marketing': return <TrendingUp className="h-4 w-4" />
      case 'travel': return <Car className="h-4 w-4" />
      default: return <Receipt className="h-4 w-4" />
    }
  }

  const getExpenseCategoryColor = (category) => {
    switch (category) {
      case 'rent': return 'bg-blue-100 text-blue-800'
      case 'utilities': return 'bg-green-100 text-green-800'
      case 'maintenance': return 'bg-orange-100 text-orange-800'
      case 'software': return 'bg-purple-100 text-purple-800'
      case 'insurance': return 'bg-red-100 text-red-800'
      case 'marketing': return 'bg-pink-100 text-pink-800'
      case 'travel': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Expense filter functions
  const getFilteredExpenses = () => {
    let filtered = [...recurringExpenses]

    // Filter by category
    if (expenseFilters.selectedCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category === expenseFilters.selectedCategory)
    }

    // Filter by status
    if (expenseFilters.selectedStatus !== 'all') {
      filtered = filtered.filter(expense => expense.status === expenseFilters.selectedStatus)
    }

    // Filter by frequency
    if (expenseFilters.selectedFrequency !== 'all') {
      filtered = filtered.filter(expense => expense.frequency === expenseFilters.selectedFrequency)
    }

    // Filter by view mode
    if (expenseFilters.viewMode === 'monthly') {
      filtered = filtered.filter(expense => expense.frequency === 'monthly')
    } else if (expenseFilters.viewMode === 'yearly') {
      filtered = filtered.filter(expense => expense.frequency === 'yearly')
    }

    return filtered
  }

  const getFilteredExpenseStats = () => {
    const filtered = getFilteredExpenses()
    const activeFiltered = filtered.filter(exp => exp.status === 'active')
    
    let monthlyTotal = 0
    let yearlyTotal = 0
    const categories = {}

    activeFiltered.forEach(expense => {
      if (expense.frequency === 'monthly') {
        monthlyTotal += expense.amount
        yearlyTotal += expense.amount * 12
      } else if (expense.frequency === 'yearly') {
        monthlyTotal += expense.amount / 12
        yearlyTotal += expense.amount
      } else if (expense.frequency === 'quarterly') {
        monthlyTotal += expense.amount / 3
        yearlyTotal += expense.amount * 4
      }
      
      if (!categories[expense.category]) {
        categories[expense.category] = 0
      }
      categories[expense.category]++
    })

    return {
      totalExpenses: filtered.length,
      activeExpenses: activeFiltered.length,
      monthlyTotal: Math.round(monthlyTotal),
      yearlyTotal: Math.round(yearlyTotal),
      categories
    }
  }

  const getMonthlyExpenseBreakdown = () => {
    const selectedMonth = expenseFilters.selectedMonth
    const selectedYear = selectedMonth.split('-')[0]
    const selectedMonthNum = selectedMonth.split('-')[1]
    
    return recurringExpenses.filter(expense => {
      if (expense.status !== 'active') return false
      
      const startDate = new Date(expense.startDate)
      const endDate = expense.endDate ? new Date(expense.endDate) : new Date('2099-12-31')
      const currentDate = new Date(selectedYear, selectedMonthNum - 1, 1)
      
      return startDate <= currentDate && endDate >= currentDate
    })
  }

  const getYearlyExpenseBreakdown = () => {
    const selectedYear = expenseFilters.selectedYear
    
    return recurringExpenses.filter(expense => {
      if (expense.status !== 'active') return false
      
      const startDate = new Date(expense.startDate)
      const endDate = expense.endDate ? new Date(expense.endDate) : new Date('2099-12-31')
      const currentYear = new Date(selectedYear, 0, 1)
      const nextYear = new Date(selectedYear, 11, 31)
      
      return startDate <= nextYear && endDate >= currentYear
    })
  }

  const getCategoryOptions = () => {
    const categories = [...new Set(recurringExpenses.map(exp => exp.category))]
    return [
      { value: 'all', label: 'All Categories' },
      ...categories.map(cat => ({ value: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1) }))
    ]
  }

  const getFrequencyOptions = () => [
    { value: 'all', label: 'All Frequencies' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ]

  const getStatusOptions = () => [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'paused', label: 'Paused' }
  ]

  const getViewModeOptions = () => [
    { value: 'all', label: 'All Expenses' },
    { value: 'monthly', label: 'Monthly Only' },
    { value: 'yearly', label: 'Yearly Only' }
  ]

  const handleFilterChange = (filterType, value) => {
    setExpenseFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const resetExpenseFilters = () => {
    setExpenseFilters({
      selectedMonth: new Date().toISOString().slice(0, 7),
      selectedYear: new Date().getFullYear().toString(),
      selectedCategory: 'all',
      selectedStatus: 'all',
      selectedFrequency: 'all',
      viewMode: 'all'
    })
  }


  // Handle birthday assignment
  const handleBirthdayAssignment = () => {
    if (!birthdayData.personId || !birthdayData.birthday) return

    const person = birthdayData.personType === 'employee' 
      ? employees.find(emp => emp.id.toString() === birthdayData.personId)
      : projectManagers.find(pm => pm.id.toString() === birthdayData.personId)

    if (person) {
      // Update person's birthday
      if (birthdayData.personType === 'employee') {
        setEmployees(prev => prev.map(emp => 
          emp.id.toString() === birthdayData.personId 
            ? { ...emp, birthday: birthdayData.birthday }
            : emp
        ))
      } else {
        setProjectManagers(prev => prev.map(pm => 
          pm.id.toString() === birthdayData.personId 
            ? { ...pm, birthday: birthdayData.birthday }
            : pm
        ))
      }

      // Add to birthdays list
      const newBirthday = {
        id: Date.now(),
        personId: birthdayData.personId,
        personName: person.name,
        personType: birthdayData.personType,
        birthday: birthdayData.birthday,
        age: new Date().getFullYear() - new Date(birthdayData.birthday).getFullYear(),
        department: person.department,
        role: person.role
      }
      setBirthdays(prev => [...prev, newBirthday])
    }

    // Reset form
    setBirthdayData({
      personId: '',
      birthday: '',
      personType: 'employee'
    })
    setShowBirthdayModal(false)
  }

  // Get person options for birthday assignment
  const getPersonOptions = () => {
    const employeeOptions = employees.map(emp => ({
      value: emp.id.toString(),
      label: `${emp.name} - ${emp.role} (Employee)`,
      icon: User,
      data: { ...emp, type: 'employee' }
    }))

    const pmOptions = projectManagers.map(pm => ({
      value: pm.id.toString(),
      label: `${pm.name} - ${pm.role} (PM)`,
      icon: Shield,
      data: { ...pm, type: 'pm' }
    }))

    return [...employeeOptions, ...pmOptions]
  }

  // Helper functions for team management
  const getRoleColor = (role) => {
    switch (role) {
      case 'project-manager': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'employee': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200'
      case 'on-leave': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTeamColor = (team) => {
    switch (team) {
      case 'developer': return 'bg-indigo-100 text-indigo-800'
      case 'sales': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCurrentUsers = () => {
    let filteredUsers = allUsers

    // Filter by search term
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      )
    }

    // Filter by status
    if (selectedFilter !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === selectedFilter)
    }

    // Filter by department (only for employees)
    if (selectedDepartment !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.department === selectedDepartment)
    }

    return filteredUsers
  }

  const handleCreateUser = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      team: '',
      department: '',
      status: 'active',
      dateOfBirth: '',
      joiningDate: '',
      document: null,
      password: '',
      confirmPassword: ''
    })
    setShowCreateModal(true)
  }

  const handleEditUser = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      team: user.team || '',
      department: user.department || '',
      status: user.status,
      dateOfBirth: user.dateOfBirth || user.birthday || '',
      joiningDate: user.joiningDate || user.joinDate || '',
      document: user.document || null,
      password: '',
      confirmPassword: ''
    })
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setShowViewModal(true)
  }

  const handleDeleteUser = (user) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const handleSaveUser = () => {
    // Validation
    if (showCreateModal && (!formData.password || !formData.confirmPassword)) {
      alert('Please fill in both password fields')
      return
    }
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    
    if (formData.password && formData.password.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }

    // Validation for department field when role is employee and team is developer
    if (formData.role === 'employee' && formData.team === 'developer' && !formData.department) {
      alert('Please select a department for developer employees')
      return
    }

    // Validation for required date fields
    if (!formData.dateOfBirth) {
      alert('Please select date of birth')
      return
    }

    if (!formData.joiningDate) {
      alert('Please select joining date')
      return
    }

    // Validation for document field
    if (!formData.document) {
      alert('Please upload a document')
      return
    }

    // Simulate API call
    console.log('Saving user:', formData)
    setShowCreateModal(false)
    setShowEditModal(false)
    setSelectedUser(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      team: '',
      department: '',
      status: 'active',
      dateOfBirth: '',
      joiningDate: '',
      document: null,
      password: '',
      confirmPassword: ''
    })
  }

  const confirmDelete = () => {
    // Simulate API call
    console.log('Deleting user:', selectedUser)
    setShowDeleteModal(false)
    setSelectedUser(null)
  }

  // Close modals
  const closeModals = () => {
    setShowBirthdayModal(false)
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowViewModal(false)
    setShowDeleteModal(false)
    setShowSalaryModal(false)
    setShowEditSalaryModal(false)
    setShowAddEmployeeSalaryModal(false)
    setShowDeleteSalaryModal(false)
    setShowRequestModal(false)
    setShowAllowanceModal(false)
    setShowExpenseModal(false)
    setShowEditExpenseModal(false)
    setSelectedUser(null)
    setSelectedSalaryRecord(null)
    setSelectedExpense(null)
    setEditSalaryData({ 
      basicSalary: ''
    })
    setRequestData({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      department: ''
    })
    setAllowanceData({
      employeeId: '',
      itemType: '',
      itemName: '',
      serialNumber: '',
      issueDate: '',
      returnDate: '',
      status: 'active',
      value: '',
      remarks: ''
    })
    setBirthdayData({
      personId: '',
      birthday: '',
      personType: 'employee'
    })
    resetExpenseData()
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      team: '',
      department: '',
      status: 'active',
      dateOfBirth: '',
      joiningDate: '',
      document: null,
      password: '',
      confirmPassword: ''
    })
  }

  // Reset department filter when switching tabs
  useEffect(() => {
    if (activeTab !== 'team') {
      setSelectedDepartment('all')
    }
  }, [activeTab])

  // Generate data on component mount
  useEffect(() => {
    generateSalaryData()
    generateRequestsData()
    generateAllowancesData()
    generateRecurringExpensesData()
  }, [])

  // Attendance functions
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setAttendanceFile(file)
      processAttendanceFile(file)
    } else {
      alert('Please upload a valid Excel file (.xlsx)')
    }
  }

  const processAttendanceFile = async (file) => {
    setIsProcessingFile(true)
    try {
      // Simulate file processing - in real app, you'd use a library like xlsx
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock processed attendance data
      const processedData = [
        {
          id: 1,
          employeeId: 1,
          employeeName: 'John Doe',
          date: '2024-01-15',
          checkIn: '09:15',
          checkOut: '18:30',
          status: 'present',
          hoursWorked: 8.25,
          isLate: true,
          lateMinutes: 15
        },
        {
          id: 2,
          employeeId: 1,
          employeeName: 'John Doe',
          date: '2024-01-16',
          checkIn: '09:00',
          checkOut: '18:00',
          status: 'present',
          hoursWorked: 8.0,
          isLate: false,
          lateMinutes: 0
        },
        {
          id: 3,
          employeeId: 2,
          employeeName: 'Jane Smith',
          date: '2024-01-15',
          checkIn: '08:45',
          checkOut: '17:45',
          status: 'present',
          hoursWorked: 8.0,
          isLate: false,
          lateMinutes: 0
        },
        {
          id: 4,
          employeeId: 2,
          employeeName: 'Jane Smith',
          date: '2024-01-16',
          checkIn: '09:30',
          checkOut: '18:30',
          status: 'present',
          hoursWorked: 8.0,
          isLate: true,
          lateMinutes: 30
        },
        {
          id: 5,
          employeeId: 3,
          employeeName: 'Mike Johnson',
          date: '2024-01-15',
          checkIn: null,
          checkOut: null,
          status: 'absent',
          hoursWorked: 0,
          isLate: false,
          lateMinutes: 0
        }
      ]
      
      setAttendanceData(processedData)
      calculateAttendanceStats(processedData)
      alert('Attendance file processed successfully!')
    } catch (error) {
      console.error('Error processing file:', error)
      alert('Error processing attendance file. Please try again.')
    } finally {
      setIsProcessingFile(false)
    }
  }

  const calculateAttendanceStats = (data) => {
    const totalDays = data.length
    const presentDays = data.filter(record => record.status === 'present').length
    const absentDays = data.filter(record => record.status === 'absent').length
    const lateDays = data.filter(record => record.isLate).length
    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0

    setAttendanceStats({
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      attendanceRate: Math.round(attendanceRate * 100) / 100
    })
  }

  const getAttendanceByMonth = () => {
    const [year, month] = selectedMonth.split('-')
    return attendanceData.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate.getFullYear() == year && recordDate.getMonth() + 1 == month
    })
  }

  const getEmployeeAttendanceSummary = () => {
    const monthlyData = getAttendanceByMonth()
    const summary = {}
    
    monthlyData.forEach(record => {
      if (!summary[record.employeeId]) {
        summary[record.employeeId] = {
          employeeName: record.employeeName,
          totalDays: 0,
          presentDays: 0,
          absentDays: 0,
          lateDays: 0,
          totalHours: 0,
          attendanceRate: 0
        }
      }
      
      summary[record.employeeId].totalDays++
      if (record.status === 'present') {
        summary[record.employeeId].presentDays++
        summary[record.employeeId].totalHours += record.hoursWorked
      } else if (record.status === 'absent') {
        summary[record.employeeId].absentDays++
      }
      if (record.isLate) {
        summary[record.employeeId].lateDays++
      }
    })
    
    // Calculate attendance rates
    Object.values(summary).forEach(emp => {
      emp.attendanceRate = emp.totalDays > 0 ? Math.round((emp.presentDays / emp.totalDays) * 100 * 100) / 100 : 0
    })
    
    return Object.values(summary)
  }

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800'
      case 'absent': return 'bg-red-100 text-red-800'
      case 'late': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle2 className="h-4 w-4" />
      case 'absent': return <XCircle className="h-4 w-4" />
      case 'late': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  // Salary functions
  const generateSalaryData = () => {
    const currentDate = new Date()
    const currentMonth = currentDate.toISOString().slice(0, 7)
    
    // Mock salary data based on employees
    const mockSalaryData = [
      {
        id: 1,
        employeeId: 1,
        employeeName: 'John Doe',
        department: 'nodejs',
        team: 'developer',
        role: 'employee',
        basicSalary: 45000,
        allowances: 5000,
        deductions: 2000,
        netSalary: 48000,
        month: currentMonth,
        joiningDate: '2022-01-15',
        salaryDate: '2024-01-15', // Based on joining date
        paymentDate: getPaymentDate('2022-01-15'),
        paymentWeek: getWeekOfMonth(getPaymentDate('2022-01-15')),
        status: 'paid',
        paidDate: '2024-01-16',
        paymentMethod: 'Bank Transfer',
        remarks: 'Salary paid on time'
      },
      {
        id: 2,
        employeeId: 2,
        employeeName: 'Jane Smith',
        department: 'flutter',
        team: 'developer',
        role: 'employee',
        basicSalary: 42000,
        allowances: 4500,
        deductions: 1800,
        netSalary: 44700,
        month: currentMonth,
        joiningDate: '2021-08-20',
        salaryDate: '2024-01-20', // Based on joining date
        paymentDate: getPaymentDate('2021-08-20'),
        paymentWeek: getWeekOfMonth(getPaymentDate('2021-08-20')),
        status: 'pending',
        paidDate: null,
        paymentMethod: null,
        remarks: 'Pending approval'
      },
      {
        id: 3,
        employeeId: 3,
        employeeName: 'Mike Johnson',
        department: 'web',
        team: 'sales',
        role: 'employee',
        basicSalary: 38000,
        allowances: 4000,
        deductions: 1500,
        netSalary: 40500,
        month: currentMonth,
        joiningDate: '2023-03-10',
        salaryDate: '2024-01-10', // Based on joining date
        paymentDate: getPaymentDate('2023-03-10'),
        paymentWeek: getWeekOfMonth(getPaymentDate('2023-03-10')),
        status: 'paid',
        paidDate: '2024-01-11',
        paymentMethod: 'Bank Transfer',
        remarks: 'Salary paid'
      },
      {
        id: 4,
        employeeId: 4,
        employeeName: 'Sarah Wilson',
        department: 'management',
        team: 'developer',
        role: 'project-manager',
        basicSalary: 65000,
        allowances: 8000,
        deductions: 3000,
        netSalary: 70000,
        month: currentMonth,
        joiningDate: '2020-11-05',
        salaryDate: '2024-01-05', // Based on joining date
        paymentDate: getPaymentDate('2020-11-05'),
        paymentWeek: getWeekOfMonth(getPaymentDate('2020-11-05')),
        status: 'paid',
        paidDate: '2024-01-06',
        paymentMethod: 'Bank Transfer',
        remarks: 'PM salary paid'
      },
      {
        id: 5,
        employeeId: 5,
        employeeName: 'David Brown',
        department: 'management',
        team: 'sales',
        role: 'project-manager',
        basicSalary: 62000,
        allowances: 7500,
        deductions: 2800,
        netSalary: 66700,
        month: currentMonth,
        joiningDate: '2021-02-28',
        salaryDate: '2024-01-28', // Based on joining date
        paymentDate: getPaymentDate('2021-02-28'),
        paymentWeek: getWeekOfMonth(getPaymentDate('2021-02-28')),
        status: 'pending',
        paidDate: null,
        paymentMethod: null,
        remarks: 'Awaiting final approval'
      }
    ]
    
    setSalaryData(mockSalaryData)
    calculateSalaryStats(mockSalaryData)
  }

  const calculateSalaryStats = (data) => {
    const totalEmployees = data.length
    const paidEmployees = data.filter(record => record.status === 'paid').length
    const pendingEmployees = data.filter(record => record.status === 'pending').length
    const totalAmount = data.reduce((sum, record) => sum + record.netSalary, 0)
    const paidAmount = data.filter(record => record.status === 'paid').reduce((sum, record) => sum + record.netSalary, 0)
    const pendingAmount = data.filter(record => record.status === 'pending').reduce((sum, record) => sum + record.netSalary, 0)

    setSalaryStats({
      totalEmployees,
      paidEmployees,
      pendingEmployees,
      totalAmount,
      paidAmount,
      pendingAmount
    })
  }

  const getSalaryByMonth = () => {
    return salaryData.filter(record => record.month === selectedSalaryMonth)
  }

  const getFilteredSalaryData = () => {
    let filtered = getSalaryByMonth()
    
    if (selectedSalaryDepartment !== 'all') {
      filtered = filtered.filter(record => record.department === selectedSalaryDepartment)
    }
    
    if (selectedSalaryWeek !== 'all') {
      filtered = filtered.filter(record => record.paymentWeek?.toString() === selectedSalaryWeek)
    }
    
    if (selectedPaymentStatus !== 'all') {
      filtered = filtered.filter(record => record.status === selectedPaymentStatus)
    }
    
    // Sort by payment priority (upcoming payments first)
    return filtered.sort((a, b) => {
      const priorityA = getPaymentPriority(a)
      const priorityB = getPaymentPriority(b)
      if (priorityA !== priorityB) return priorityA - priorityB
      
      // If same priority, sort by payment date
      const dateA = new Date(a.paymentDate || a.createdAt)
      const dateB = new Date(b.paymentDate || b.createdAt)
      return dateA - dateB
    })
  }

  const handleMarkSalaryPaid = (record) => {
    setSelectedSalaryRecord(record)
    setShowSalaryModal(true)
  }

  const handleDeleteSalary = (record) => {
    setSalaryToDelete(record)
    setShowDeleteSalaryModal(true)
  }

  const confirmDeleteSalary = () => {
    if (salaryToDelete) {
      setSalaryData(prev => prev.filter(item => item.id !== salaryToDelete.id))
      setShowDeleteSalaryModal(false)
      setSalaryToDelete(null)
      alert('Salary record deleted successfully!')
    }
  }

  const handleEditSalary = (record) => {
    setSelectedSalaryRecord(record)
    setEditSalaryData({
      basicSalary: record.basicSalary.toString()
    })
    setShowEditSalaryModal(true)
  }

  const handleSaveSalaryEdit = () => {
    const updatedData = salaryData.map(record => {
      if (record.id === selectedSalaryRecord.id) {
        const basicSalary = parseFloat(editSalaryData.basicSalary) || 0
        
        return {
          ...record,
          basicSalary: basicSalary,
          netSalary: basicSalary // Simplified - net salary = basic salary
        }
      }
      return record
    })
    
    setSalaryData(updatedData)
    calculateSalaryStats(updatedData)
    setShowEditSalaryModal(false)
    setSelectedSalaryRecord(null)
    setEditSalaryData({ 
      basicSalary: ''
    })
    alert('Salary updated successfully!')
  }

  const confirmSalaryPayment = (paymentData) => {
    const updatedData = salaryData.map(record => {
      if (record.id === selectedSalaryRecord.id) {
        return {
          ...record,
          status: 'paid',
          paidDate: paymentData.paidDate,
          paymentMethod: paymentData.paymentMethod,
          remarks: paymentData.remarks
        }
      }
      return record
    })
    
    setSalaryData(updatedData)
    calculateSalaryStats(updatedData)
    setShowSalaryModal(false)
    setSelectedSalaryRecord(null)
  }

  const getSalaryStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSalaryStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle2 className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'overdue': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  // Helper functions for salary payment management
  const getWeekOfMonth = (date) => {
    const d = new Date(date)
    const firstDay = new Date(d.getFullYear(), d.getMonth(), 1)
    const firstWeekDay = firstDay.getDay()
    const dayOfMonth = d.getDate()
    const weekNumber = Math.ceil((dayOfMonth + firstWeekDay) / 7)
    return Math.min(weekNumber, 4) // Max 4 weeks
  }

  const getPaymentDate = (joiningDate) => {
    const joinDate = new Date(joiningDate)
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()
    
    // Get the day of month from joining date
    const paymentDay = joinDate.getDate()
    
    // Create payment date for current month
    const paymentDate = new Date(currentYear, currentMonth, paymentDay)
    
    // If payment date has passed this month, set for next month
    if (paymentDate < currentDate) {
      return new Date(currentYear, currentMonth + 1, paymentDay)
    }
    
    return paymentDate
  }

  const getPaymentPriority = (salaryRecord) => {
    const paymentDate = getPaymentDate(salaryRecord.joiningDate || new Date())
    const currentDate = new Date()
    const daysUntilPayment = Math.ceil((paymentDate - currentDate) / (1000 * 60 * 60 * 24))
    
    if (salaryRecord.status === 'paid') return 999 // Paid records go to bottom
    if (daysUntilPayment < 0) return -1 // Overdue (highest priority)
    if (daysUntilPayment <= 3) return 0 // Due within 3 days
    if (daysUntilPayment <= 7) return 1 // Due within a week
    return 2 // Future payments
  }

  const getWeekOptions = () => {
    return [
      { value: 'all', label: 'All Weeks', icon: Calendar },
      { value: '1', label: 'Week 1 (1-7)', icon: Calendar },
      { value: '2', label: 'Week 2 (8-14)', icon: Calendar },
      { value: '3', label: 'Week 3 (15-21)', icon: Calendar },
      { value: '4', label: 'Week 4 (22-31)', icon: Calendar }
    ]
  }

  // Handle new employee salary form
  const handleAddEmployeeSalary = () => {
    setShowAddEmployeeSalaryModal(true)
    setNewEmployeeSalaryData({
      employeeId: '',
      salary: ''
    })
  }

  const handleSaveNewEmployeeSalary = () => {
    // Validate required fields
    if (!newEmployeeSalaryData.employeeId || !newEmployeeSalaryData.salary) {
      alert('Please select an employee and enter salary amount')
      return
    }

    // Find selected employee
    const selectedEmployee = allUsers.find(user => user.id === parseInt(newEmployeeSalaryData.employeeId))
    if (!selectedEmployee) {
      alert('Selected employee not found')
      return
    }

    const salary = parseFloat(newEmployeeSalaryData.salary) || 0

    // Create salary record
    const newSalaryRecord = {
      id: Date.now(),
      employeeId: selectedEmployee.employeeId || selectedEmployee.id.toString(),
      employeeName: selectedEmployee.name,
      department: selectedEmployee.department || 'General',
      basicSalary: salary,
      allowances: 0,
      deductions: 0,
      netSalary: salary,
      paymentMethod: 'bank_transfer',
      bankAccount: '',
      status: 'pending',
      month: selectedSalaryMonth,
      joiningDate: selectedEmployee.joiningDate || selectedEmployee.dateOfBirth || new Date().toISOString().split('T')[0],
      paymentDate: getPaymentDate(selectedEmployee.joiningDate || selectedEmployee.dateOfBirth || new Date().toISOString().split('T')[0]),
      paymentWeek: getWeekOfMonth(getPaymentDate(selectedEmployee.joiningDate || selectedEmployee.dateOfBirth || new Date().toISOString().split('T')[0])),
      remarks: '',
      createdAt: new Date().toISOString()
    }

    // Add to existing salary data
    setSalaryData(prev => [...prev, newSalaryRecord])

    // Close modal and reset form
    setShowAddEmployeeSalaryModal(false)
    setNewEmployeeSalaryData({
      employeeId: '',
      salary: ''
    })

    alert(`Salary set successfully for ${selectedEmployee.name}!`)
  }

  const handleNewEmployeeSalaryInputChange = (field, value) => {
    setNewEmployeeSalaryData(prev => ({
      ...prev,
      [field]: value
    }))
  }


  // Tab configuration
  const tabs = [
    { key: 'team', label: 'Team Management', icon: Users },
    { key: 'birthdays', label: 'Birthdays', icon: Cake },
    { key: 'attendance', label: 'Attendance', icon: UserCheck },
    { key: 'salary', label: 'Salary Management', icon: Banknote },
    { key: 'requests', label: 'Requests', icon: MessageSquare },
    { key: 'allowances', label: 'Allowances', icon: Gift },
    { key: 'expenses', label: 'Recurring Expenses', icon: Receipt }
  ]

  // Combobox options for HR (only employees and PMs)
  const roleOptions = [
    { value: 'project-manager', label: 'Project Manager', icon: Shield },
    { value: 'employee', label: 'Employee', icon: Code }
  ]

  const teamOptions = [
    { value: 'developer', label: 'Developer', icon: Code },
    { value: 'sales', label: 'Sales Team', icon: TrendingUp }
  ]

  const departmentOptions = [
    { value: 'full-stack', label: 'Full Stack', icon: Code },
    { value: 'nodejs', label: 'Node.js', icon: Code },
    { value: 'web', label: 'Web', icon: Code },
    { value: 'app', label: 'App', icon: Code }
  ]

  const salesDepartmentOptions = [
    { value: 'sales', label: 'Sales', icon: TrendingUp }
  ]

  const statusOptions = [
    { value: 'active', label: 'Active', icon: CheckCircle },
    { value: 'inactive', label: 'Inactive', icon: AlertCircle },
    { value: 'on-leave', label: 'On Leave', icon: Clock }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Admin_navbar />
        <Admin_sidebar />
        <div className="ml-64 pt-20 p-8">
          <div className="max-w-7xl mx-auto">
            <Loading size="large" className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Admin_navbar />
      <Admin_sidebar />
      
      {/* Main Content */}
      <div className="ml-64 pt-20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                HR Management
              </h1>
              <p className="text-gray-600 text-lg">
                {activeTab === 'team' && 'Manage team members and organizational structure'}
                {activeTab === 'birthdays' && 'Track and manage employee birthdays'}
                {activeTab === 'attendance' && 'Monitor employee attendance and time tracking'}
                {activeTab === 'salary' && 'Manage employee salaries and payment tracking'}
                {activeTab === 'requests' && 'Submit and track requests to admin'}
                {activeTab === 'allowances' && 'Track employee assets and allowances'}
                {activeTab === 'expenses' && 'Manage recurring monthly and yearly expenses'}
              </p>
            </div>
            {activeTab === 'team' && (
              <div className="flex items-center space-x-3">
                <Button
                  onClick={loadData}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button
                  onClick={handleCreateUser}
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Team Member
                </Button>
              </div>
            )}
            {activeTab === 'expenses' && (
              <div className="flex items-center space-x-3">
                <Button
                  onClick={loadData}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button
                  onClick={handleCreateExpense}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Expense
                </Button>
              </div>
            )}
          </motion.div>

          {/* Tabs Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4"
          >
            <div className="border-b border-gray-200">
              <nav className="flex flex-wrap gap-1 px-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.key
                  
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center space-x-1.5 py-2.5 px-3 border-b-2 font-medium text-xs transition-colors rounded-t-md ${
                        isActive
                          ? 'border-primary text-primary bg-primary/5'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="whitespace-nowrap">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </motion.div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4">
              {activeTab === 'team' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
                    <p className="text-gray-600 mt-1">Manage your team members and organizational structure</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search team members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                      />
                    </div>
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="on-leave">On Leave</option>
                    </select>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Departments</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Management">Management</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {getCurrentUsers().map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 group"
                    >
                      {/* Header */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                            {user.avatar}
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleViewUser(user)}
                              className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-all duration-200"
                            >
                              <Eye className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-gray-400 hover:text-green-600 p-1 rounded hover:bg-green-50 transition-all duration-200"
                            >
                              <Edit3 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-all duration-200"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-1">{user.name}</h3>
                          <p className="text-xs text-gray-600 truncate">{user.email}</p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center space-x-1 mb-2">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600 truncate">{user.phone}</span>
                      </div>

                      {/* Role and Team Badges */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full border ${getRoleColor(user.role)}`}>
                          {user.role === 'project-manager' ? 'PM' : 'Emp'}
                        </span>
                        {user.team && (
                          <span className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full ${getTeamColor(user.team)}`}>
                            {user.team === 'developer' ? 'Dev' : 'Sales'}
                          </span>
                        )}
                        <span className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(user.status)}`}>
                          {user.status === 'active' ? 'Active' : user.status === 'inactive' ? 'Inactive' : 'On Leave'}
                        </span>
                      </div>

                      {/* Bottom Info */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{formatDate(user.joinDate)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {getCurrentUsers().length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                  </div>
                )}
                </motion.div>
              )}

              {activeTab === 'birthdays' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
          {/* Birthday Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Birthdays */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Cake className="h-4 w-4 text-pink-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Total</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{statistics.totalBirthdays}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-pink-600 font-semibold">Birthdays</span>
                </div>
              </div>
            </motion.div>

            {/* Today's Birthdays */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Cake className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Today</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{getTodaysBirthdays().length}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-purple-600 font-semibold">Birthdays</span>
                </div>
              </div>
            </motion.div>

            {/* This Week's Birthdays */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Cake className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">This Week</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{getThisWeekBirthdays().length}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-blue-600 font-semibold">Birthdays</span>
                </div>
              </div>
            </motion.div>

            {/* This Month's Birthdays */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Cake className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">This Month</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{statistics.thisMonthBirthdays}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-green-600 font-semibold">Birthdays</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Today's Birthdays Card */}
          {getTodaysBirthdays().length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-pink-100 rounded-full">
                    <Cake className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Today's Birthdays</h3>
                    <p className="text-gray-600">Wish them a wonderful day!</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setShowBirthdayModal(true)}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Birthday
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getTodaysBirthdays().map((person) => (
                  <div key={person.id} className="bg-white rounded-lg p-4 border border-pink-200 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {person.avatar}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{person.name}</h4>
                        <p className="text-sm text-gray-600">{person.role}</p>
                        <p className="text-xs text-gray-500">{person.department}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl">🎂</div>
                        <p className="text-xs text-gray-500">Age {person.age}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Birthday Management Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Birthday Management</h2>
                  <p className="text-gray-600 mt-1">Track and manage employee birthdays</p>
                </div>
                <Button
                  onClick={() => setShowBirthdayModal(true)}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  <Cake className="h-4 w-4 mr-2" />
                  Add Birthday
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {birthdays.map((birthday) => (
                  <div key={birthday.id} className="bg-white rounded-lg border border-pink-200 p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {birthday.personName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{birthday.personName}</h3>
                        <p className="text-sm text-gray-600">{birthday.role}</p>
                        <p className="text-xs text-gray-500">{birthday.department}</p>
                      </div>
                    </div>
                    
                    <div className="bg-pink-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-pink-800">Birthday</p>
                          <p className="text-lg font-bold text-pink-900">{formatDate(birthday.birthday)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-pink-800">Age</p>
                          <p className="text-lg font-bold text-pink-900">{birthday.age}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
                </motion.div>
              )}

              {activeTab === 'attendance' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  {/* Header Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
                  <p className="text-gray-600 mt-1">Upload Excel files and track team attendance</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Button
                    onClick={() => document.getElementById('attendance-file-input').click()}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Upload Excel
                  </Button>
                  <input
                    id="attendance-file-input"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* File Upload Section */}
              {!attendanceData.length && (
                <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                  <CardContent className="p-8 text-center">
                    <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Upload Attendance Excel File</h3>
                    <p className="text-gray-500 mb-6">Upload an Excel file containing attendance data to get started</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={() => document.getElementById('attendance-file-input').click()}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Choose Excel File
                      </Button>
                      <Button
                        variant="outline"
                        className="px-6 py-3 rounded-lg flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download Template
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-4">
                      Supported formats: .xlsx, .xls | Max file size: 10MB
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Processing Indicator */}
              {isProcessingFile && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="text-blue-700 font-medium">Processing attendance file...</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Attendance Statistics */}
              {attendanceData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 text-sm font-medium">Total Records</p>
                          <p className="text-2xl font-bold text-blue-900">{attendanceStats.totalDays}</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 text-sm font-medium">Present Days</p>
                          <p className="text-2xl font-bold text-green-900">{attendanceStats.presentDays}</p>
                        </div>
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-red-600 text-sm font-medium">Absent Days</p>
                          <p className="text-2xl font-bold text-red-900">{attendanceStats.absentDays}</p>
                        </div>
                        <XCircle className="h-8 w-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-600 text-sm font-medium">Attendance Rate</p>
                          <p className="text-2xl font-bold text-purple-900">{attendanceStats.attendanceRate}%</p>
                        </div>
                        <TrendingUpIcon className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Employee Attendance Summary */}
              {attendanceData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheckIcon className="h-5 w-5" />
                      Employee Attendance Summary - {selectedMonth}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Total Days</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Present</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Absent</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Late Days</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Total Hours</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getEmployeeAttendanceSummary().map((employee, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                    {employee.employeeName.charAt(0)}
                                  </div>
                                  <span className="font-medium text-gray-900">{employee.employeeName}</span>
                                </div>
                              </td>
                              <td className="text-center py-3 px-4 text-gray-700">{employee.totalDays}</td>
                              <td className="text-center py-3 px-4">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle2 className="h-3 w-3" />
                                  {employee.presentDays}
                                </span>
                              </td>
                              <td className="text-center py-3 px-4">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <XCircle className="h-3 w-3" />
                                  {employee.absentDays}
                                </span>
                              </td>
                              <td className="text-center py-3 px-4">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <AlertTriangle className="h-3 w-3" />
                                  {employee.lateDays}
                                </span>
                              </td>
                              <td className="text-center py-3 px-4 text-gray-700">{employee.totalHours.toFixed(1)}h</td>
                              <td className="text-center py-3 px-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  employee.attendanceRate >= 90 ? 'bg-green-100 text-green-800' :
                                  employee.attendanceRate >= 80 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {employee.attendanceRate}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Detailed Attendance Records */}
              {attendanceData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Detailed Attendance Records - {selectedMonth}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Check In</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Check Out</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Hours</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getAttendanceByMonth().map((record, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 text-gray-700">
                                {new Date(record.date).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                    {record.employeeName.charAt(0)}
                                  </div>
                                  <span className="font-medium text-gray-900">{record.employeeName}</span>
                                </div>
                              </td>
                              <td className="text-center py-3 px-4 text-gray-700">
                                {record.checkIn || '-'}
                              </td>
                              <td className="text-center py-3 px-4 text-gray-700">
                                {record.checkOut || '-'}
                              </td>
                              <td className="text-center py-3 px-4 text-gray-700">
                                {record.hoursWorked > 0 ? `${record.hoursWorked}h` : '-'}
                              </td>
                              <td className="text-center py-3 px-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(record.status)}`}>
                                  {getStatusIcon(record.status)}
                                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                  {record.isLate && record.status === 'present' && ' (Late)'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
                </motion.div>
              )}

              {activeTab === 'salary' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  {/* Header Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Salary Management</h2>
                  <p className="text-gray-600 mt-1">Manage employee salaries and track payment status</p>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Filters Section */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2 shadow-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <input
                        type="month"
                        value={selectedSalaryMonth}
                        onChange={(e) => setSelectedSalaryMonth(e.target.value)}
                        className="text-sm font-medium text-gray-700 bg-transparent border-none outline-none focus:ring-0"
                      />
                    </div>
                    
                    <Combobox
                      options={[
                        { value: 'all', label: 'All Departments', icon: Users },
                        { value: 'nodejs', label: 'Node.js', icon: Code },
                        { value: 'flutter', label: 'Flutter', icon: Code },
                        { value: 'web', label: 'Web', icon: Code },
                        { value: 'management', label: 'Management', icon: Shield },
                        { value: 'sales', label: 'Sales', icon: TrendingUp }
                      ]}
                      value={selectedSalaryDepartment}
                      onChange={(value) => setSelectedSalaryDepartment(value)}
                      placeholder="Department"
                      className="w-44 h-10 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white shadow-sm"
                    />
                    
                    <Combobox
                      options={getWeekOptions()}
                      value={selectedSalaryWeek}
                      onChange={(value) => setSelectedSalaryWeek(value)}
                      placeholder="Week"
                      className="w-40 h-10 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white shadow-sm"
                    />
                    
                    <Combobox
                      options={[
                        { value: 'all', label: 'All Status', icon: Clock },
                        { value: 'pending', label: 'Pending', icon: Clock },
                        { value: 'paid', label: 'Paid', icon: CheckCircle2 },
                        { value: 'overdue', label: 'Overdue', icon: AlertTriangle }
                      ]}
                      value={selectedPaymentStatus}
                      onChange={(value) => setSelectedPaymentStatus(value)}
                      placeholder="Status"
                      className="w-36 h-10 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white shadow-sm"
                    />
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => setShowAddEmployeeSalaryModal(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-semibold"
                  >
                    <Banknote className="h-5 w-5" />
                    Set Employee Salary
                  </Button>
                </div>
              </div>

              {/* Salary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Employees</p>
                        <p className="text-2xl font-bold text-blue-900">{salaryStats.totalEmployees}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Paid Employees</p>
                        <p className="text-2xl font-bold text-green-900">{salaryStats.paidEmployees}</p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-600 text-sm font-medium">Pending Payments</p>
                        <p className="text-2xl font-bold text-yellow-900">{salaryStats.pendingEmployees}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Total Amount</p>
                        <p className="text-xl font-bold text-purple-900">{formatCurrency(salaryStats.totalAmount)}</p>
                      </div>
                      <Calculator className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-600 text-sm font-medium">Paid Amount</p>
                        <p className="text-xl font-bold text-emerald-900">{formatCurrency(salaryStats.paidAmount)}</p>
                      </div>
                      <Banknote className="h-8 w-8 text-emerald-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-600 text-sm font-medium">Pending Amount</p>
                        <p className="text-xl font-bold text-orange-900">{formatCurrency(salaryStats.pendingAmount)}</p>
                      </div>
                      <Wallet className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Salary Records Cards */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Banknote className="h-5 w-5" />
                    Salary Records - {selectedSalaryMonth}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {getFilteredSalaryData().length} employee{getFilteredSalaryData().length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {getFilteredSalaryData().map((record, index) => {
                    const paymentDate = new Date(record.paymentDate || record.createdAt)
                    const currentDate = new Date()
                    const daysUntilPayment = Math.ceil((paymentDate - currentDate) / (1000 * 60 * 60 * 24))
                    const isOverdue = daysUntilPayment < 0 && record.status !== 'paid'
                    const isDueSoon = daysUntilPayment <= 3 && daysUntilPayment >= 0 && record.status !== 'paid'
                    
                    return (
                      <Card key={index} className={`hover:shadow-lg transition-all duration-200 border-l-4 ${
                        isOverdue ? 'border-l-red-500 bg-red-50' : 
                        isDueSoon ? 'border-l-yellow-500 bg-yellow-50' : 
                        record.status === 'paid' ? 'border-l-green-500 bg-green-50' : 
                        'border-l-blue-500'
                      }`}>
                        <CardContent className="p-4">
                          {/* Employee Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {record.employeeName.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-sm">{record.employeeName}</h4>
                                <p className="text-xs text-gray-500">{record.department}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSalaryStatusColor(record.status)}`}>
                                {getSalaryStatusIcon(record.status)}
                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                              </span>
                              {record.paymentWeek && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Week {record.paymentWeek}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Payment Date Info */}
                          <div className="mb-3 p-2 bg-gray-100 rounded-lg">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-600">Payment Date:</span>
                              <span className="font-medium">
                                {paymentDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                              </span>
                            </div>
                            {record.status !== 'paid' && (
                              <div className="flex justify-between items-center text-xs mt-1">
                                <span className="text-gray-600">Days:</span>
                                <span className={`font-medium ${
                                  isOverdue ? 'text-red-600' : 
                                  isDueSoon ? 'text-yellow-600' : 
                                  'text-gray-600'
                                }`}>
                                  {isOverdue ? `${Math.abs(daysUntilPayment)} overdue` : 
                                   isDueSoon ? `${daysUntilPayment} days` : 
                                   `${daysUntilPayment} days`}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Salary Amount */}
                          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Salary</span>
                              <span className="text-lg font-bold text-green-600">{formatCurrency(record.basicSalary)}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            {record.status !== 'paid' && (
                              <Button
                                onClick={() => handleMarkSalaryPaid(record)}
                                size="sm"
                                className={`flex-1 text-xs py-1 h-8 ${
                                  isOverdue ? 'bg-red-600 hover:bg-red-700' : 
                                  isDueSoon ? 'bg-yellow-600 hover:bg-yellow-700' : 
                                  'bg-green-600 hover:bg-green-700'
                                } text-white`}
                              >
                                <CreditCard className="h-3 w-3 mr-1" />
                                {isOverdue ? 'Pay Now' : isDueSoon ? 'Due Soon' : 'Pay'}
                              </Button>
                            )}
                            <Button
                              onClick={() => handleEditSalary(record)}
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs py-1 h-8"
                              disabled={record.status === 'paid'}
                            >
                              <Edit3 className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeleteSalary(record)}
                              size="sm"
                              variant="outline"
                              className="text-xs py-1 h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Empty State */}
                {getFilteredSalaryData().length === 0 && (
                  <Card className="border-2 border-dashed border-gray-300">
                    <CardContent className="p-12 text-center">
                      <Banknote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Salary Records Found</h3>
                      <p className="text-gray-500">
                        {selectedSalaryDepartment !== 'all' 
                          ? `No salary records found for ${selectedSalaryDepartment} department in ${selectedSalaryMonth}`
                          : `No salary records found for ${selectedSalaryMonth}`
                        }
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
                </motion.div>
              )}

              {activeTab === 'requests' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  {/* Header Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">HR Requests</h2>
                  <p className="text-gray-600 mt-1">Submit and track requests to admin</p>
                </div>
                <Button
                  onClick={handleCreateRequest}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  New Request
                </Button>
              </div>

              {/* Request Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Requests</p>
                        <p className="text-2xl font-bold text-blue-900">{requests.length}</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-600 text-sm font-medium">Pending</p>
                        <p className="text-2xl font-bold text-yellow-900">{requests.filter(r => r.status === 'pending').length}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Approved</p>
                        <p className="text-2xl font-bold text-green-900">{requests.filter(r => r.status === 'approved').length}</p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Requests List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {requests.map((request, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{request.title}</h4>
                          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{request.description}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRequestStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>

                      <div className="space-y-1 mb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Category</span>
                          <span className="text-xs font-medium text-gray-900">{request.category}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Priority</span>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                            {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Department</span>
                          <span className="text-xs font-medium text-gray-900">{request.department}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Date</span>
                          <span className="text-xs font-medium text-gray-900">{new Date(request.requestDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {request.adminResponse && (
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs font-medium text-gray-700 mb-1">Admin Response:</p>
                          <p className="text-xs text-gray-600 line-clamp-2">{request.adminResponse}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(request.responseDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
                </motion.div>
              )}

              {activeTab === 'allowances' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  {/* Header Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Employee Allowances</h2>
                  <p className="text-gray-600 mt-1">Track employee assets and allowances</p>
                </div>
                <Button
                  onClick={handleCreateAllowance}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Allowance
                </Button>
              </div>

              {/* Allowance Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Items</p>
                        <p className="text-2xl font-bold text-blue-900">{allowances.length}</p>
                      </div>
                      <Package className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Active</p>
                        <p className="text-2xl font-bold text-green-900">{allowances.filter(a => a.status === 'active').length}</p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Returned</p>
                        <p className="text-2xl font-bold text-blue-900">{allowances.filter(a => a.status === 'returned').length}</p>
                      </div>
                      <RefreshCw className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Total Value</p>
                        <p className="text-xl font-bold text-purple-900">
                          {formatCurrency(allowances.reduce((sum, a) => sum + a.value, 0))}
                        </p>
                      </div>
                      <Calculator className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Allowances List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {allowances.map((allowance, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white">
                            {getItemIcon(allowance.itemType)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{allowance.itemName}</h4>
                            <p className="text-xs text-gray-500">{allowance.employeeName}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAllowanceStatusColor(allowance.status)}`}>
                          {allowance.status.charAt(0).toUpperCase() + allowance.status.slice(1)}
                        </span>
                      </div>

                      <div className="space-y-1 mb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Serial</span>
                          <span className="text-xs font-medium text-gray-900">{allowance.serialNumber}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Value</span>
                          <span className="text-xs font-bold text-green-600">{formatCurrency(allowance.value)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Issue Date</span>
                          <span className="text-xs font-medium text-gray-900">{new Date(allowance.issueDate).toLocaleDateString()}</span>
                        </div>
                        {allowance.returnDate && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Return Date</span>
                            <span className="text-xs font-medium text-gray-900">{new Date(allowance.returnDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {allowance.remarks && (
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs font-medium text-gray-700 mb-1">Remarks:</p>
                          <p className="text-xs text-gray-600 line-clamp-2">{allowance.remarks}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
                </motion.div>
              )}

              {activeTab === 'expenses' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  {/* Header Section */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Recurring Expenses</h2>
                      <p className="text-gray-600 mt-1">Manage monthly and yearly recurring expenses</p>
                    </div>
                    
                    {/* Filter Section */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Month Filter */}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <input
                          type="month"
                          value={expenseFilters.selectedMonth}
                          onChange={(e) => handleFilterChange('selectedMonth', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                      
                      {/* Category Filter */}
                      <Combobox
                        options={getCategoryOptions()}
                        value={expenseFilters.selectedCategory}
                        onChange={(value) => handleFilterChange('selectedCategory', value)}
                        placeholder="Category"
                        className="w-40 h-10 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      />
                      
                      {/* Status Filter */}
                      <Combobox
                        options={getStatusOptions()}
                        value={expenseFilters.selectedStatus}
                        onChange={(value) => handleFilterChange('selectedStatus', value)}
                        placeholder="Status"
                        className="w-32 h-10 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      />
                      
                      {/* View Mode Filter */}
                      <Combobox
                        options={getViewModeOptions()}
                        value={expenseFilters.viewMode}
                        onChange={(value) => handleFilterChange('viewMode', value)}
                        placeholder="View"
                        className="w-36 h-10 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      />
                      
                      {/* Reset Filter Button */}
                      <Button
                        onClick={resetExpenseFilters}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Filter className="h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                  </div>

                  {/* Expense Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-600 text-sm font-medium">Total Expenses</p>
                            <p className="text-2xl font-bold text-blue-900">{getFilteredExpenseStats().totalExpenses}</p>
                          </div>
                          <Receipt className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-600 text-sm font-medium">Active Expenses</p>
                            <p className="text-2xl font-bold text-green-900">{getFilteredExpenseStats().activeExpenses}</p>
                          </div>
                          <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-600 text-sm font-medium">Monthly Total</p>
                            <p className="text-xl font-bold text-purple-900">{formatCurrency(getFilteredExpenseStats().monthlyTotal)}</p>
                          </div>
                          <Calendar className="h-8 w-8 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-orange-600 text-sm font-medium">Yearly Total</p>
                            <p className="text-xl font-bold text-orange-900">{formatCurrency(getFilteredExpenseStats().yearlyTotal)}</p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-orange-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Expenses List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getFilteredExpenses().map((expense, index) => (
                      <Card key={index} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                                {getExpenseCategoryIcon(expense.category)}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{expense.name}</h4>
                                <p className="text-xs text-gray-500">{expense.vendor}</p>
                              </div>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getExpenseStatusColor(expense.status)}`}>
                              {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                            </span>
                          </div>

                          <div className="space-y-2 mb-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Amount</span>
                              <span className="text-sm font-bold text-green-600">{formatCurrency(expense.amount)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Frequency</span>
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getExpenseCategoryColor(expense.category)}`}>
                                {expense.frequency.charAt(0).toUpperCase() + expense.frequency.slice(1)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Next Due</span>
                              <span className="text-xs font-medium text-gray-900">{formatDate(expense.nextDue)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Payment</span>
                              <span className="text-xs font-medium text-gray-900 capitalize">
                                {expense.paymentMethod.replace('_', ' ')}
                              </span>
                            </div>
                          </div>

                          {expense.description && (
                            <div className="bg-gray-50 rounded-lg p-2 mb-3">
                              <p className="text-xs font-medium text-gray-700 mb-1">Description:</p>
                              <p className="text-xs text-gray-600 line-clamp-2">{expense.description}</p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEditExpense(expense)}
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs py-1 h-8"
                            >
                              <Edit3 className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeleteExpense(expense)}
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs py-1 h-8 text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Empty State */}
                  {getFilteredExpenses().length === 0 && (
                    <Card className="border-2 border-dashed border-gray-300">
                      <CardContent className="p-12 text-center">
                        <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Recurring Expenses Found</h3>
                        <p className="text-gray-500 mb-6">Start by adding your first recurring expense like office rent or utilities.</p>
                        <Button
                          onClick={handleCreateExpense}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
                        >
                          <Plus className="h-4 w-4" />
                          Add First Expense
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
            {/* Create/Edit User Modal */}
            {(showCreateModal || showEditModal) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={closeModals}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[95vh] overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header with gradient background */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">
                          {showCreateModal ? 'Add Team Member' : 'Edit Team Member'}
                        </h3>
                        <p className="text-blue-100">
                          {showCreateModal 
                            ? 'Fill in the team member details below. Fields marked with * are required.'
                            : 'Update the team member details below. Fields marked with * are required.'
                          }
                        </p>
                      </div>
                      <button
                        onClick={closeModals}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleSaveUser(); }} className="p-6 space-y-6 max-h-[calc(95vh-140px)] overflow-y-auto">
                    {/* Name Field */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-semibold text-gray-700 flex items-center">
                        Full Name <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="Enter full name"
                      />
                    </motion.div>

                    {/* Email Field */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-semibold text-gray-700 flex items-center">
                        Email Address <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="Enter email address"
                      />
                    </motion.div>

                    {/* Phone Field */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-semibold text-gray-700 flex items-center">
                        Phone Number <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="+91 98765 43210"
                      />
                    </motion.div>

                    {/* Role and Team Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                      >
                        <label className="text-sm font-semibold text-gray-700 flex items-center">
                          Role <span className="text-red-500 ml-1">*</span>
                        </label>
                        <Combobox
                          options={roleOptions}
                          value={formData.role}
                          onChange={(value) => setFormData({...formData, role: value, team: ''})}
                          placeholder="Select role"
                          className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        />
                      </motion.div>

                      {formData.role === 'employee' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="space-y-2"
                        >
                          <label className="text-sm font-semibold text-gray-700 flex items-center">
                            Team <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Combobox
                            options={teamOptions}
                            value={formData.team}
                            onChange={(value) => setFormData({...formData, team: value, department: ''})}
                            placeholder="Select team"
                            className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* Department Field - Only for Developer Employees */}
                    {formData.role === 'employee' && formData.team === 'developer' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-2"
                      >
                        <label className="text-sm font-semibold text-gray-700 flex items-center">
                          Department <span className="text-red-500 ml-1">*</span>
                        </label>
                        <Combobox
                          options={departmentOptions}
                          value={formData.department}
                          onChange={(value) => setFormData({...formData, department: value})}
                          placeholder="Select department"
                          className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        />
                      </motion.div>
                    )}

                    {/* Department Field - Only for Sales Employees */}
                    {formData.role === 'employee' && formData.team === 'sales' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-2"
                      >
                        <label className="text-sm font-semibold text-gray-700 flex items-center">
                          Department <span className="text-red-500 ml-1">*</span>
                        </label>
                        <Combobox
                          options={salesDepartmentOptions}
                          value={formData.department}
                          onChange={(value) => setFormData({...formData, department: value})}
                          placeholder="Select department"
                          className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        />
                      </motion.div>
                    )}

                    {/* Date Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-2"
                      >
                        <label className="text-sm font-semibold text-gray-700 flex items-center">
                          Date of Birth <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                          className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        />
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="space-y-2"
                      >
                        <label className="text-sm font-semibold text-gray-700 flex items-center">
                          Joining Date <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="date"
                          value={formData.joiningDate}
                          onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                          className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        />
                      </motion.div>
                    </div>

                {/* Document Upload Field */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    Document <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => setFormData({...formData, document: e.target.files[0]})}
                      className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Upload className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  {formData.document && (
                    <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg border border-green-200">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">{formData.document.name}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max 10MB)</p>
                </motion.div>

                {/* Status Field */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <Combobox
                    options={statusOptions}
                    value={formData.status}
                    onChange={(value) => setFormData({...formData, status: value})}
                    placeholder="Select status"
                    className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </motion.div>

                    {/* Password Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        className="space-y-2"
                      >
                        <label className="text-sm font-semibold text-gray-700 flex items-center">
                          Password <span className="text-red-500 ml-1">{showCreateModal ? '*' : ''}</span>
                          {!showCreateModal && <span className="text-gray-500 ml-2 text-xs">(Leave blank to keep current)</span>}
                        </label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          placeholder={showCreateModal ? "Enter password" : "Enter new password"}
                        />
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="space-y-2"
                      >
                        <label className="text-sm font-semibold text-gray-700 flex items-center">
                          Confirm Password <span className="text-red-500 ml-1">{showCreateModal ? '*' : ''}</span>
                        </label>
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          placeholder="Confirm password"
                        />
                        {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                          <motion.p 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-xs text-red-600 flex items-center"
                          >
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Passwords do not match
                          </motion.p>
                        )}
                      </motion.div>
                    </div>

                    {/* Form Actions */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={closeModals}
                        className="flex-1 h-12 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                      >
                        {showCreateModal ? 'Add Team Member' : 'Update Team Member'}
                      </Button>
                    </motion.div>
                  </form>
                </motion.div>
              </motion.div>
            )}

            {/* Birthday Assignment Modal */}
            {showBirthdayModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={closeModals}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Add Birthday</h3>
                      <p className="text-gray-600 text-sm mt-1">Assign birthday to an employee or PM</p>
                    </div>
                    <button
                      onClick={closeModals}
                      className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Select Person</label>
                      <Combobox
                        options={getPersonOptions()}
                        value={birthdayData.personId}
                        onChange={(value) => {
                          const selectedOption = getPersonOptions().find(opt => opt.value === value)
                          setBirthdayData({
                            ...birthdayData,
                            personId: value,
                            personType: selectedOption?.data?.type || 'employee'
                          })
                        }}
                        placeholder="Choose employee or PM..."
                        className="w-full h-12 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Birthday</label>
                      <input
                        type="date"
                        value={birthdayData.birthday}
                        onChange={(e) => setBirthdayData({...birthdayData, birthday: e.target.value})}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={closeModals}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBirthdayAssignment}
                      disabled={!birthdayData.personId || !birthdayData.birthday}
                      className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Birthday
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Salary Payment Modal */}
            {showSalaryModal && selectedSalaryRecord && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={() => setShowSalaryModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-xl p-4 max-w-sm w-full mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Mark as Paid</h3>
                    <button
                      onClick={() => setShowSalaryModal(false)}
                      className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{selectedSalaryRecord.employeeName}</span>
                        <span className="text-lg font-bold text-green-600">{formatCurrency(selectedSalaryRecord.basicSalary)}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Date</label>
                      <input
                        type="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="w-full h-8 px-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        id="paidDate"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Method</label>
                      <select
                        className="w-full h-8 px-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        id="paymentMethod"
                      >
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="UPI">UPI</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Cash">Cash</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200 mt-4">
                    <button
                      onClick={() => setShowSalaryModal(false)}
                      className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        const paidDate = document.getElementById('paidDate').value
                        const paymentMethod = document.getElementById('paymentMethod').value
                        const remarks = 'Salary paid'
                        
                        confirmSalaryPayment({
                          paidDate,
                          paymentMethod,
                          remarks
                        })
                      }}
                      className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-semibold text-sm"
                    >
                      Confirm
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Edit Salary Modal */}
            {showEditSalaryModal && selectedSalaryRecord && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowEditSalaryModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl shadow-xl max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-1">Edit Employee Salary</h3>
                        <p className="text-blue-100 text-sm">Update salary for {selectedSalaryRecord.employeeName}</p>
                      </div>
                      <button
                        onClick={() => setShowEditSalaryModal(false)}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleSaveSalaryEdit(); }} className="p-6 space-y-6">
                    {/* Employee Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {selectedSalaryRecord.employeeName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{selectedSalaryRecord.employeeName}</h4>
                          <p className="text-sm text-gray-500">{selectedSalaryRecord.department}</p>
                        </div>
                      </div>
                    </div>

                    {/* Salary Amount */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center">
                        Monthly Salary (₹) <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="number"
                        value={editSalaryData.basicSalary}
                        onChange={(e) => setEditSalaryData({...editSalaryData, basicSalary: e.target.value})}
                        className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="Enter monthly salary amount"
                        required
                        min="0"
                        step="100"
                      />
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowEditSalaryModal(false)}
                        className="flex-1 h-12 rounded-lg border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all duration-200"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Update Salary
                      </Button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}

            {/* Request Modal */}
            {showRequestModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowRequestModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-xl p-4 max-w-sm w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">New Request</h3>
                    <button
                      onClick={() => setShowRequestModal(false)}
                      className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={requestData.title}
                        onChange={(e) => setRequestData({...requestData, title: e.target.value})}
                        className="w-full h-8 px-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter request title"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                      <textarea
                        value={requestData.description}
                        onChange={(e) => setRequestData({...requestData, description: e.target.value})}
                        className="w-full h-16 px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Describe your request"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                        <select
                          value={requestData.category}
                          onChange={(e) => setRequestData({...requestData, category: e.target.value})}
                          className="w-full h-8 px-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select category</option>
                          <option value="Equipment">Equipment</option>
                          <option value="Furniture">Furniture</option>
                          <option value="Events">Events</option>
                          <option value="Software">Software</option>
                          <option value="Training">Training</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Priority</label>
                        <select
                          value={requestData.priority}
                          onChange={(e) => setRequestData({...requestData, priority: e.target.value})}
                          className="w-full h-8 px-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Department</label>
                      <select
                        value={requestData.department}
                        onChange={(e) => setRequestData({...requestData, department: e.target.value})}
                        className="w-full h-8 px-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select department</option>
                        <option value="all">All Departments</option>
                        <option value="nodejs">Node.js</option>
                        <option value="flutter">Flutter</option>
                        <option value="web">Web</option>
                        <option value="management">Management</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setShowRequestModal(false)}
                      className="px-3 py-1.5 text-xs text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveRequest}
                      className="px-4 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                    >
                      Submit Request
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Allowance Modal */}
            {showAllowanceModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowAllowanceModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-xl p-4 max-w-sm w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Add Allowance</h3>
                    <button
                      onClick={() => setShowAllowanceModal(false)}
                      className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Employee</label>
                      <select
                        value={allowanceData.employeeId}
                        onChange={(e) => setAllowanceData({...allowanceData, employeeId: e.target.value})}
                        className="w-full h-8 px-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Select employee</option>
                        {allUsers.map(user => (
                          <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Item Type</label>
                        <select
                          value={allowanceData.itemType}
                          onChange={(e) => setAllowanceData({...allowanceData, itemType: e.target.value})}
                          className="w-full h-8 px-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">Select type</option>
                          <option value="laptop">Laptop</option>
                          <option value="monitor">Monitor</option>
                          <option value="smartphone">Smartphone</option>
                          <option value="headphones">Headphones</option>
                          <option value="wifi">WiFi Device</option>
                          <option value="car">Car</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                        <select
                          value={allowanceData.status}
                          onChange={(e) => setAllowanceData({...allowanceData, status: e.target.value})}
                          className="w-full h-8 px-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="active">Active</option>
                          <option value="returned">Returned</option>
                          <option value="lost">Lost</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Item Name</label>
                      <input
                        type="text"
                        value={allowanceData.itemName}
                        onChange={(e) => setAllowanceData({...allowanceData, itemName: e.target.value})}
                        className="w-full h-8 px-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., MacBook Pro 16"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Serial Number</label>
                      <input
                        type="text"
                        value={allowanceData.serialNumber}
                        onChange={(e) => setAllowanceData({...allowanceData, serialNumber: e.target.value})}
                        className="w-full h-8 px-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter serial number"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Issue Date</label>
                        <input
                          type="date"
                          value={allowanceData.issueDate}
                          onChange={(e) => setAllowanceData({...allowanceData, issueDate: e.target.value})}
                          className="w-full h-8 px-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Return Date</label>
                        <input
                          type="date"
                          value={allowanceData.returnDate}
                          onChange={(e) => setAllowanceData({...allowanceData, returnDate: e.target.value})}
                          className="w-full h-8 px-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Value (₹)</label>
                      <input
                        type="number"
                        value={allowanceData.value}
                        onChange={(e) => setAllowanceData({...allowanceData, value: e.target.value})}
                        className="w-full h-8 px-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter item value"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Remarks</label>
                      <textarea
                        value={allowanceData.remarks}
                        onChange={(e) => setAllowanceData({...allowanceData, remarks: e.target.value})}
                        className="w-full h-12 px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                        placeholder="Additional notes"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setShowAllowanceModal(false)}
                      className="px-3 py-1.5 text-xs text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAllowance}
                      className="px-4 py-1.5 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                    >
                      Add Allowance
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Create Expense Modal */}
            {showExpenseModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowExpenseModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[95vh] overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Add Recurring Expense</h3>
                      <p className="text-gray-600 text-sm mt-1">Set up a new recurring expense for your organization</p>
                    </div>
                    <button
                      onClick={() => setShowExpenseModal(false)}
                      className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleSaveExpense(); }} className="space-y-4 max-h-[calc(95vh-140px)] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Expense Name *</label>
                        <input
                          type="text"
                          value={expenseData.name}
                          onChange={(e) => setExpenseData({...expenseData, name: e.target.value})}
                          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Office Rent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                        <select
                          value={expenseData.category}
                          onChange={(e) => setExpenseData({...expenseData, category: e.target.value})}
                          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select category</option>
                          <option value="rent">Rent</option>
                          <option value="utilities">Utilities</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="software">Software</option>
                          <option value="insurance">Insurance</option>
                          <option value="marketing">Marketing</option>
                          <option value="travel">Travel</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹) *</label>
                        <input
                          type="number"
                          value={expenseData.amount}
                          onChange={(e) => setExpenseData({...expenseData, amount: e.target.value})}
                          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter amount"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency *</label>
                        <select
                          value={expenseData.frequency}
                          onChange={(e) => setExpenseData({...expenseData, frequency: e.target.value})}
                          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                        <input
                          type="date"
                          value={expenseData.startDate}
                          onChange={(e) => setExpenseData({...expenseData, startDate: e.target.value})}
                          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                        <input
                          type="date"
                          value={expenseData.endDate}
                          onChange={(e) => setExpenseData({...expenseData, endDate: e.target.value})}
                          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Vendor</label>
                        <input
                          type="text"
                          value={expenseData.vendor}
                          onChange={(e) => setExpenseData({...expenseData, vendor: e.target.value})}
                          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Vendor/Service provider"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                        <select
                          value={expenseData.paymentMethod}
                          onChange={(e) => setExpenseData({...expenseData, paymentMethod: e.target.value})}
                          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="auto_debit">Auto Debit</option>
                          <option value="credit_card">Credit Card</option>
                          <option value="cheque">Cheque</option>
                          <option value="cash">Cash</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                      <textarea
                        value={expenseData.description}
                        onChange={(e) => setExpenseData({...expenseData, description: e.target.value})}
                        className="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Additional details about this expense"
                      />
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setShowExpenseModal(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                      >
                        Add Expense
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}

            {/* Edit Expense Modal */}
            {showEditExpenseModal && selectedExpense && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowEditExpenseModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[95vh] overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Edit Recurring Expense</h3>
                      <p className="text-gray-600 text-sm mt-1">Update the expense details</p>
                    </div>
                    <button
                      onClick={() => setShowEditExpenseModal(false)}
                      className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleUpdateExpense(); }} className="space-y-4 max-h-[calc(95vh-140px)] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Expense Name *</label>
                        <input
                          type="text"
                          value={expenseData.name}
                          onChange={(e) => setExpenseData({...expenseData, name: e.target.value})}
                          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Office Rent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                        <select
                          value={expenseData.category}
                          onChange={(e) => setExpenseData({...expenseData, category: e.target.value})}
                          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select category</option>
                          <option value="rent">Rent</option>
                          <option value="utilities">Utilities</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="software">Software</option>
                          <option value="insurance">Insurance</option>
                          <option value="marketing">Marketing</option>
                          <option value="travel">Travel</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹) *</label>
                        <input
                          type="number"
                          value={expenseData.amount}
                          onChange={(e) => setExpenseData({...expenseData, amount: e.target.value})}
                          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter amount"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency *</label>
                        <select
                          value={expenseData.frequency}
                          onChange={(e) => setExpenseData({...expenseData, frequency: e.target.value})}
                          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                        <input
                          type="date"
                          value={expenseData.startDate}
                          onChange={(e) => setExpenseData({...expenseData, startDate: e.target.value})}
                          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                        <input
                          type="date"
                          value={expenseData.endDate}
                          onChange={(e) => setExpenseData({...expenseData, endDate: e.target.value})}
                          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Vendor</label>
                        <input
                          type="text"
                          value={expenseData.vendor}
                          onChange={(e) => setExpenseData({...expenseData, vendor: e.target.value})}
                          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Vendor/Service provider"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                        <select
                          value={expenseData.paymentMethod}
                          onChange={(e) => setExpenseData({...expenseData, paymentMethod: e.target.value})}
                          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="auto_debit">Auto Debit</option>
                          <option value="credit_card">Credit Card</option>
                          <option value="cheque">Cheque</option>
                          <option value="cash">Cash</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                      <textarea
                        value={expenseData.description}
                        onChange={(e) => setExpenseData({...expenseData, description: e.target.value})}
                        className="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Additional details about this expense"
                      />
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setShowEditExpenseModal(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                      >
                        Update Expense
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}

            {/* Set Employee Salary Modal */}
            {showAddEmployeeSalaryModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowAddEmployeeSalaryModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl shadow-xl max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-1">Set Employee Salary</h3>
                        <p className="text-green-100 text-sm">Select employee and set their salary</p>
                      </div>
                      <button
                        onClick={() => setShowAddEmployeeSalaryModal(false)}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleSaveNewEmployeeSalary(); }} className="p-6 space-y-6">
                    {/* Employee Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center">
                        Select Employee <span className="text-red-500 ml-1">*</span>
                      </label>
                      <Combobox
                        options={allUsers.map(user => ({
                          value: user.id.toString(),
                          label: `${user.name} - ${user.department || 'General'} (${user.role})`,
                          icon: user.role === 'project-manager' ? Shield : Code
                        }))}
                        value={newEmployeeSalaryData.employeeId}
                        onChange={(value) => handleNewEmployeeSalaryInputChange('employeeId', value)}
                        placeholder="Choose an employee..."
                        className="h-12 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                      />
                    </div>

                    {/* Salary Amount */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center">
                        Monthly Salary (₹) <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="number"
                        value={newEmployeeSalaryData.salary}
                        onChange={(e) => handleNewEmployeeSalaryInputChange('salary', e.target.value)}
                        className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                        placeholder="Enter monthly salary amount"
                        required
                        min="0"
                        step="100"
                      />
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddEmployeeSalaryModal(false)}
                        className="flex-1 h-12 rounded-lg border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 h-12 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transition-all duration-200"
                      >
                        <Banknote className="h-4 w-4 mr-2" />
                        Set Salary
                      </Button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}

            {/* Delete Salary Confirmation Dialog */}
            {showDeleteSalaryModal && salaryToDelete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowDeleteSalaryModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl shadow-xl max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-1">Delete Salary Record</h3>
                        <p className="text-red-100 text-sm">This action cannot be undone</p>
                      </div>
                      <button
                        onClick={() => setShowDeleteSalaryModal(false)}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Trash2 className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Are you sure?</h4>
                        <p className="text-sm text-gray-600">
                          You are about to delete the salary record for <span className="font-semibold">{salaryToDelete.employeeName}</span>
                        </p>
                      </div>
                    </div>

                    {/* Salary Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Employee:</span>
                          <div className="font-semibold">{salaryToDelete.employeeName}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Department:</span>
                          <div className="font-semibold">{salaryToDelete.department}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Salary:</span>
                          <div className="font-semibold text-green-600">{formatCurrency(salaryToDelete.basicSalary)}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <div className="font-semibold">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSalaryStatusColor(salaryToDelete.status)}`}>
                              {getSalaryStatusIcon(salaryToDelete.status)}
                              {salaryToDelete.status.charAt(0).toUpperCase() + salaryToDelete.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Warning Message */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-red-800 mb-1">Warning</h5>
                          <p className="text-sm text-red-700">
                            This will permanently delete the salary record. This action cannot be undone and will remove all associated payment history.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowDeleteSalaryModal(false)}
                        className="flex-1 h-12 rounded-lg border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={confirmDeleteSalary}
                        className="flex-1 h-12 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Record
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
      </AnimatePresence>
    </div>
  )
}

export default Admin_hr_management
