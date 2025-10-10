import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Admin_navbar from '../admin-components/Admin_navbar'
import Admin_sidebar from '../admin-components/Admin_sidebar'
import Loading from '../../../components/ui/loading'
import { 
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiCreditCard,
  FiFileText,
  FiUsers,
  FiCalendar,
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit,
  FiEye,
  FiTrash2,
  FiRefreshCw,
  FiBarChart,
  FiPieChart,
  FiActivity,
  FiTarget,
  FiAward,
  FiHome
} from 'react-icons/fi'

const Admin_finance_management = () => {
  // State management
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('transactions')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  const [timeFilter, setTimeFilter] = useState('all')
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState('')

  // Mock data - Finance statistics
  const [statistics] = useState({
    totalRevenue: 2850000,
    totalExpenses: 1250000,
    netProfit: 1600000,
    pendingPayments: 450000,
    activeProjects: 24,
    totalClients: 156,
    todayEarnings: 45000,
    rewardMoney: 125000,
    employeeSalary: 180000,
    otherExpenses: 35000,
    profitLoss: 85000
  })

  // Time-based statistics that change with filters
  const getTimeBasedStats = () => {
    const baseStats = {
      todayEarnings: 45000,
      rewardMoney: 125000,
      employeeSalary: 180000,
      otherExpenses: 35000,
      profitLoss: 85000
    }

    switch (timeFilter) {
      case 'today':
        return {
          ...baseStats,
          todayEarnings: 45000,
          rewardMoney: 5000,
          employeeSalary: 0,
          otherExpenses: 2000,
          profitLoss: 43000
        }
      case 'week':
        return {
          ...baseStats,
          todayEarnings: 180000,
          rewardMoney: 25000,
          employeeSalary: 45000,
          otherExpenses: 8000,
          profitLoss: 102000
        }
      case 'month':
        return {
          ...baseStats,
          todayEarnings: 750000,
          rewardMoney: 125000,
          employeeSalary: 180000,
          otherExpenses: 35000,
          profitLoss: 410000
        }
      case 'year':
        return {
          ...baseStats,
          todayEarnings: 2850000,
          rewardMoney: 450000,
          employeeSalary: 2160000,
          otherExpenses: 420000,
          profitLoss: -180000
        }
      default:
        return baseStats
    }
  }

  // Mock data - Transactions
  const transactions = [
    {
      id: 1,
      type: 'revenue',
      category: 'Project Payment',
      amount: 150000,
      client: 'TechCorp Solutions',
      project: 'E-commerce Platform',
      date: '2024-01-15',
      status: 'completed',
      method: 'Bank Transfer',
      description: 'Milestone payment for Phase 2 completion'
    },
    {
      id: 2,
      type: 'expense',
      category: 'Salary',
      amount: 35000,
      employee: 'John Doe',
      role: 'Senior Developer',
      date: '2024-01-01',
      status: 'completed',
      method: 'Bank Transfer',
      description: 'Monthly salary payment'
    },
    {
      id: 3,
      type: 'revenue',
      category: 'Consulting',
      amount: 75000,
      client: 'StartupXYZ',
      project: 'Mobile App Development',
      date: '2024-01-20',
      status: 'pending',
      method: 'UPI',
      description: 'Consulting fee for app architecture'
    },
    {
      id: 4,
      type: 'expense',
      category: 'Office Rent',
      amount: 25000,
      vendor: 'Prime Properties',
      date: '2024-01-01',
      status: 'completed',
      method: 'Bank Transfer',
      description: 'Monthly office rent payment'
    },
    {
      id: 5,
      type: 'revenue',
      category: 'Maintenance',
      amount: 12000,
      client: 'RetailChain',
      project: 'Website Maintenance',
      date: '2024-01-25',
      status: 'completed',
      method: 'Credit Card',
      description: 'Monthly maintenance contract'
    },
    {
      id: 6,
      type: 'expense',
      category: 'Software License',
      amount: 5000,
      vendor: 'Adobe Inc.',
      date: '2024-01-10',
      status: 'completed',
      method: 'Credit Card',
      description: 'Annual Creative Suite license'
    }
  ]

  // Mock data - Budgets
  const budgets = [
    {
      id: 1,
      name: 'Q1 2024 Development',
      category: 'Development',
      allocated: 500000,
      spent: 320000,
      remaining: 180000,
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      status: 'active',
      projects: ['E-commerce Platform', 'Mobile App', 'Dashboard Redesign']
    },
    {
      id: 2,
      name: 'Marketing Campaign',
      category: 'Marketing',
      allocated: 200000,
      spent: 85000,
      remaining: 115000,
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      status: 'active',
      projects: ['Social Media Ads', 'Content Marketing', 'SEO']
    },
    {
      id: 3,
      name: 'Office Operations',
      category: 'Operations',
      allocated: 300000,
      spent: 280000,
      remaining: 20000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      projects: ['Rent', 'Utilities', 'Equipment']
    }
  ]

  // Mock data - Invoices
  const invoices = [
    {
      id: 1,
      invoiceNumber: 'INV-2024-001',
      client: 'TechCorp Solutions',
      project: 'E-commerce Platform',
      amount: 150000,
      dueDate: '2024-02-15',
      status: 'paid',
      issueDate: '2024-01-15',
      description: 'Phase 2 Development - Payment Milestone'
    },
    {
      id: 2,
      invoiceNumber: 'INV-2024-002',
      client: 'StartupXYZ',
      project: 'Mobile App Development',
      amount: 75000,
      dueDate: '2024-02-20',
      status: 'pending',
      issueDate: '2024-01-20',
      description: 'Consulting Services - App Architecture'
    },
    {
      id: 3,
      invoiceNumber: 'INV-2024-003',
      client: 'RetailChain',
      project: 'Website Maintenance',
      amount: 12000,
      dueDate: '2024-02-25',
      status: 'paid',
      issueDate: '2024-01-25',
      description: 'Monthly Maintenance Contract'
    }
  ]

  // Mock data - Expenses
  const expenses = [
    {
      id: 1,
      category: 'Salaries',
      amount: 35000,
      employee: 'John Doe',
      description: 'Monthly salary payment',
      date: '2024-01-01',
      status: 'paid',
      approvedBy: 'HR Manager'
    },
    {
      id: 2,
      category: 'Office Rent',
      amount: 25000,
      vendor: 'Prime Properties',
      description: 'Monthly office rent',
      date: '2024-01-01',
      status: 'paid',
      approvedBy: 'Finance Manager'
    },
    {
      id: 3,
      category: 'Software License',
      amount: 5000,
      vendor: 'Adobe Inc.',
      description: 'Annual Creative Suite license',
      date: '2024-01-10',
      status: 'paid',
      approvedBy: 'IT Manager'
    },
    {
      id: 4,
      category: 'Marketing',
      amount: 15000,
      vendor: 'Google Ads',
      description: 'Monthly advertising budget',
      date: '2024-01-15',
      status: 'pending',
      approvedBy: 'Marketing Manager'
    }
  ]

  // Simulate data loading
  const loadData = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'active':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type) => {
    return type === 'revenue' ? 'text-green-600' : 'text-red-600'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'transactions':
        return transactions
      case 'budgets':
        return budgets
      case 'invoices':
        return invoices
      case 'expenses':
        return expenses
      default:
        return transactions
    }
  }

  // Filter data based on search and filter criteria
  const filteredData = useMemo(() => {
    const data = getCurrentData()
    return data.filter(item => {
      const matchesSearch = Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      let matchesFilter = true
      if (selectedFilter !== 'all') {
        if (activeTab === 'transactions') {
          matchesFilter = item.type === selectedFilter
        } else if (activeTab === 'budgets') {
          matchesFilter = item.status === selectedFilter
        } else if (activeTab === 'invoices') {
          matchesFilter = item.status === selectedFilter
        } else if (activeTab === 'expenses') {
          matchesFilter = item.status === selectedFilter
        }
      }
      
      return matchesSearch && matchesFilter
    })
  }, [activeTab, searchTerm, selectedFilter])

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Management functions
  const handleCreate = () => {
    setSelectedItem(null)
    setShowCreateModal(true)
  }

  const handleEdit = (item) => {
    setSelectedItem(item)
    setShowEditModal(true)
  }

  const handleView = (item) => {
    setSelectedItem(item)
    setShowViewModal(true)
  }

  const handleDelete = (item) => {
    setSelectedItem(item)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (deleteConfirm === 'DELETE') {
      // Handle delete logic here
      console.log('Deleting item:', selectedItem)
      setShowDeleteModal(false)
      setDeleteConfirm('')
      setSelectedItem(null)
    }
  }

  const handleSave = (formData) => {
    // Handle save logic here
    console.log('Saving data:', formData)
    setShowCreateModal(false)
    setShowEditModal(false)
    setSelectedItem(null)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowViewModal(false)
    setShowDeleteModal(false)
    setSelectedItem(null)
    setDeleteConfirm('')
  }

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
      {/* Navbar */}
      <Admin_navbar />
      
      {/* Sidebar */}
      <Admin_sidebar />
      
      {/* Main Content */}
      <div className="ml-64 pt-20 p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Finance Management
            </h1>
            <p className="text-gray-600">
                  Comprehensive financial oversight and management dashboard
                </p>
              </div>
              <button
                onClick={loadData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <FiRefreshCw className="text-sm" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Statistics Cards - Row 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4"
          >
            {/* Total Revenue */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-green-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <FiTrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-green-700">+12.5%</p>
                    <p className="text-xs text-green-600">this month</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-green-700 mb-1">Total Revenue</p>
                  <p className="text-lg font-bold text-green-800">{formatCurrency(statistics.totalRevenue)}</p>
                </div>
              </div>
            </div>

            {/* Total Expenses */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-red-50 to-rose-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-red-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-red-400/20 to-rose-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <FiTrendingDown className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-red-700">+8.2%</p>
                    <p className="text-xs text-red-600">this month</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-red-700 mb-1">Total Expenses</p>
                  <p className="text-lg font-bold text-red-800">{formatCurrency(statistics.totalExpenses)}</p>
                </div>
              </div>
            </div>

            {/* Net Profit */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-blue-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <FiBarChart className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-blue-700">+15.3%</p>
                    <p className="text-xs text-blue-600">this month</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-700 mb-1">Net Profit</p>
                  <p className="text-lg font-bold text-blue-800">{formatCurrency(statistics.netProfit)}</p>
                </div>
              </div>
            </div>

            {/* Pending Payments */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-50 to-amber-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-yellow-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <FiCreditCard className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-yellow-700">Pending</p>
                    <p className="text-xs text-yellow-600">payments</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-yellow-700 mb-1">Pending Payments</p>
                  <p className="text-lg font-bold text-yellow-800">{formatCurrency(statistics.pendingPayments)}</p>
                </div>
              </div>
            </div>

            {/* Active Projects */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-blue-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-indigo-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-indigo-400/20 to-blue-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <FiHome className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-indigo-700">Active</p>
                    <p className="text-xs text-indigo-600">projects</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-indigo-700 mb-1">Active Projects</p>
                  <p className="text-lg font-bold text-indigo-800">{statistics.activeProjects}</p>
                </div>
              </div>
            </div>

            {/* Total Clients */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-50 to-teal-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-cyan-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-cyan-400/20 to-teal-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <FiUsers className="h-4 w-4 text-cyan-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-cyan-700">Total</p>
                    <p className="text-xs text-cyan-600">clients</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-cyan-700 mb-1">Total Clients</p>
                  <p className="text-lg font-bold text-cyan-800">{statistics.totalClients}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Statistics Cards - Row 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6"
          >
            {/* Today Earnings */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-emerald-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <FiDollarSign className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-emerald-700">Today</p>
                    <p className="text-xs text-emerald-600">earnings</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-emerald-700 mb-1">Today Earnings</p>
                  <p className="text-lg font-bold text-emerald-800">{formatCurrency(getTimeBasedStats().todayEarnings)}</p>
                </div>
              </div>
            </div>

            {/* Reward Money */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-violet-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-purple-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-violet-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <FiAward className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-purple-700">Rewards</p>
                    <p className="text-xs text-purple-600">bonuses</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-purple-700 mb-1">Reward Money</p>
                  <p className="text-lg font-bold text-purple-800">{formatCurrency(getTimeBasedStats().rewardMoney)}</p>
                </div>
              </div>
            </div>

            {/* Employee Salary */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-amber-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-orange-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-orange-400/20 to-amber-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <FiUsers className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-orange-700">Monthly</p>
                    <p className="text-xs text-orange-600">payroll</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-orange-700 mb-1">Employee Salary</p>
                  <p className="text-lg font-bold text-orange-800">{formatCurrency(getTimeBasedStats().employeeSalary)}</p>
                </div>
              </div>
            </div>

            {/* Other Expenses */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-50 to-pink-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-rose-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-rose-400/20 to-pink-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-rose-500/10">
                    <FiFileText className="h-4 w-4 text-rose-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-rose-700">Misc</p>
                    <p className="text-xs text-rose-600">expenses</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-rose-700 mb-1">Other Expenses</p>
                  <p className="text-lg font-bold text-rose-800">{formatCurrency(getTimeBasedStats().otherExpenses)}</p>
                </div>
              </div>
            </div>

            {/* Profit/Loss */}
            <div className={`group relative overflow-hidden rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border ${
              getTimeBasedStats().profitLoss >= 0 
                ? 'bg-gradient-to-br from-teal-50 to-cyan-100 border-teal-200/50' 
                : 'bg-gradient-to-br from-red-50 to-rose-100 border-red-200/50'
            }`}>
              <div className={`absolute top-0 right-0 w-12 h-12 rounded-full -translate-y-6 translate-x-6 ${
                getTimeBasedStats().profitLoss >= 0 
                  ? 'bg-gradient-to-br from-teal-400/20 to-cyan-500/20' 
                  : 'bg-gradient-to-br from-red-400/20 to-rose-500/20'
              }`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${
                    getTimeBasedStats().profitLoss >= 0 
                      ? 'bg-teal-500/10' 
                      : 'bg-red-500/10'
                  }`}>
                    {getTimeBasedStats().profitLoss >= 0 ? (
                      <FiTrendingUp className={`h-4 w-4 text-teal-600`} />
                    ) : (
                      <FiTrendingDown className={`h-4 w-4 text-red-600`} />
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-medium ${
                      getTimeBasedStats().profitLoss >= 0 
                        ? 'text-teal-700' 
                        : 'text-red-700'
                    }`}>
                      {getTimeBasedStats().profitLoss >= 0 ? 'Profit' : 'Loss'}
                    </p>
                    <p className={`text-xs ${
                      getTimeBasedStats().profitLoss >= 0 
                        ? 'text-teal-600' 
                        : 'text-red-600'
                    }`}>
                      {timeFilter === 'all' ? 'this month' : timeFilter}
                    </p>
                  </div>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${
                    getTimeBasedStats().profitLoss >= 0 
                      ? 'text-teal-700' 
                      : 'text-red-700'
                  }`}>
                    {getTimeBasedStats().profitLoss >= 0 ? 'Profit' : 'Loss'}
                  </p>
                  <p className={`text-lg font-bold ${
                    getTimeBasedStats().profitLoss >= 0 
                      ? 'text-teal-800' 
                      : 'text-red-800'
                  }`}>
                    {formatCurrency(Math.abs(getTimeBasedStats().profitLoss))}
                  </p>
                </div>
              </div>
            </div>

            {/* Time Filter */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-slate-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-gray-400/20 to-slate-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-gray-500/10">
                    <FiCalendar className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-700">Filter</p>
                    <p className="text-xs text-gray-600">time period</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Time Filter</p>
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="w-full text-sm font-bold text-gray-800 bg-transparent border-none outline-none cursor-pointer"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'transactions', label: 'Transactions', icon: FiActivity },
                  { id: 'budgets', label: 'Budgets', icon: FiTarget },
                  { id: 'invoices', label: 'Invoices', icon: FiFileText },
                  { id: 'expenses', label: 'Expenses', icon: FiTrendingDown }
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="text-sm" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All</option>
                {activeTab === 'transactions' && (
                  <>
                    <option value="revenue">Revenue</option>
                    <option value="expense">Expense</option>
                  </>
                )}
                {(activeTab === 'budgets' || activeTab === 'invoices' || activeTab === 'expenses') && (
                  <>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {paginatedData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                {/* Transaction Card */}
                {activeTab === 'transactions' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${getTypeColor(item.type)}`}>
                        {item.type === 'revenue' ? '+' : '-'}{formatCurrency(item.amount)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{item.category}</h3>
                      <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{item.client || item.employee || item.vendor}</span>
                      <span>{formatDate(item.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(item)}
                        className="flex-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                      >
                        <FiEye className="inline mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                      >
                        <FiEdit className="inline mr-1" />
                        Edit
                      </button>
                    </div>
                  </div>
                )}

                {/* Budget Card */}
                {activeTab === 'budgets' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Spent</span>
                        <span>{formatCurrency(item.spent)} / {formatCurrency(item.allocated)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(item.spent / item.allocated) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <p>Remaining: {formatCurrency(item.remaining)}</p>
                      <p>{formatDate(item.startDate)} - {formatDate(item.endDate)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(item)}
                        className="flex-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                      >
                        <FiEye className="inline mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                      >
                        <FiEdit className="inline mr-1" />
                        Edit
                      </button>
                    </div>
                  </div>
                )}

                {/* Invoice Card */}
                {activeTab === 'invoices' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 text-sm">{formatCurrency(item.amount)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{item.invoiceNumber}</h3>
                      <p className="text-xs text-gray-600 mt-1">{item.client}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      <p>Due: {formatDate(item.dueDate)}</p>
                      <p>Project: {item.project}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(item)}
                        className="flex-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                      >
                        <FiEye className="inline mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                      >
                        <FiEdit className="inline mr-1" />
                        Edit
                      </button>
                    </div>
                  </div>
                )}

                {/* Expense Card */}
                {activeTab === 'expenses' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-red-600 text-sm">{formatCurrency(item.amount)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{item.category}</h3>
                      <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      <p>{item.employee || item.vendor}</p>
                      <p>{formatDate(item.date)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(item)}
                        className="flex-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                      >
                        <FiEye className="inline mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                      >
                        <FiEdit className="inline mr-1" />
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin_finance_management
