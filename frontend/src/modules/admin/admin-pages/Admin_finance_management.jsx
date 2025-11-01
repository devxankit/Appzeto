import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Admin_navbar from '../admin-components/Admin_navbar'
import Admin_sidebar from '../admin-components/Admin_sidebar'
import Loading from '../../../components/ui/loading'
import { adminFinanceService } from '../admin-services/adminFinanceService'
import { useToast } from '../../../contexts/ToastContext'
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
  FiHome,
  FiX
} from 'react-icons/fi'

const Admin_finance_management = () => {
  const { toast } = useToast()
  
  // State management
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('transactions')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  const [timeFilter, setTimeFilter] = useState('all')
  const [error, setError] = useState(null)
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [showAccountViewModal, setShowAccountViewModal] = useState(false)
  const [showAccountEditModal, setShowAccountEditModal] = useState(false)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [showBudgetViewModal, setShowBudgetViewModal] = useState(false)
  const [showBudgetEditModal, setShowBudgetEditModal] = useState(false)
  const [showBudgetSpendModal, setShowBudgetSpendModal] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [accountFormData, setAccountFormData] = useState({
    accountName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branchName: '',
    accountType: 'current',
    isActive: true,
    description: ''
  })

  // Form data for different tabs
  const [transactionFormData, setTransactionFormData] = useState({
    type: 'incoming',
    category: '',
    amount: '',
    date: '',
    account: '',
    description: ''
  })

  // Accounts state
  const [accounts, setAccounts] = useState([])
  const [accountsLoading, setAccountsLoading] = useState(false)

  const [budgetFormData, setBudgetFormData] = useState({
    name: '',
    category: '',
    allocated: '',
    startDate: '',
    endDate: '',
    description: ''
  })

  const [invoiceFormData, setInvoiceFormData] = useState({
    client: '',
    project: '',
    amount: '',
    dueDate: '',
    description: ''
  })

  const [expenseFormData, setExpenseFormData] = useState({
    category: '',
    amount: '',
    date: '',
    description: ''
  })

  const [budgetSpendFormData, setBudgetSpendFormData] = useState({
    amount: '',
    date: '',
    description: ''
  })

  // Finance statistics state - fetched from API
  const [statistics, setStatistics] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    pendingPayments: 0,
    activeProjects: 0,
    totalClients: 0,
    todayEarnings: 0,
    rewardMoney: 0,
    employeeSalary: 0,
    otherExpenses: 0,
    profitLoss: 0,
    revenueChange: '0',
    expensesChange: '0',
    profitChange: '0'
  })
  const [statisticsLoading, setStatisticsLoading] = useState(false)

  // Fetch finance statistics from API
  const fetchFinanceStatistics = async () => {
    try {
      setStatisticsLoading(true)
      const response = await adminFinanceService.getFinanceStatistics(timeFilter)
      
      if (response && response.success && response.data) {
        setStatistics({
          totalRevenue: response.data.totalRevenue || 0,
          totalExpenses: response.data.totalExpenses || 0,
          netProfit: response.data.netProfit || 0,
          pendingPayments: response.data.pendingPayments || 0,
          activeProjects: response.data.activeProjects || 0,
          totalClients: response.data.totalClients || 0,
          todayEarnings: response.data.todayEarnings || 0,
          rewardMoney: response.data.rewardMoney || 0,
          employeeSalary: response.data.employeeSalary || 0,
          otherExpenses: response.data.otherExpenses || 0,
          profitLoss: response.data.profitLoss || 0,
          revenueChange: response.data.revenueChange || '0',
          expensesChange: response.data.expensesChange || '0',
          profitChange: response.data.profitChange || '0'
        })
      }
    } catch (err) {
      console.error('Error fetching finance statistics:', err)
      toast.error('Failed to load finance statistics')
    } finally {
      setStatisticsLoading(false)
    }
  }

  // Fetch statistics when component mounts or time filter changes
  useEffect(() => {
    fetchFinanceStatistics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFilter])

  // Time-based statistics (now using real API data)
  const getTimeBasedStats = () => {
    return {
      todayEarnings: statistics.todayEarnings,
      rewardMoney: statistics.rewardMoney,
      employeeSalary: statistics.employeeSalary,
      otherExpenses: statistics.otherExpenses,
      profitLoss: statistics.profitLoss
    }
  }

  // Transactions state - fetched from API
  const [transactions, setTransactions] = useState([])
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [transactionsTotal, setTransactionsTotal] = useState(0)
  const [transactionsPages, setTransactionsPages] = useState(1)

  // Budgets state - fetched from API
  const [budgets, setBudgets] = useState([])
  const [budgetsLoading, setBudgetsLoading] = useState(false)
  const [budgetsTotal, setBudgetsTotal] = useState(0)
  const [budgetsPages, setBudgetsPages] = useState(1)

  // Mock data - Invoices
  const [invoices, setInvoices] = useState([
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
  ])

  // Expenses state - fetched from API
  const [expenses, setExpenses] = useState([])
  const [expensesLoading, setExpensesLoading] = useState(false)
  const [expensesTotal, setExpensesTotal] = useState(0)
  const [expensesPages, setExpensesPages] = useState(1)

  // Fetch accounts from API
  const fetchAccounts = async () => {
    try {
      setAccountsLoading(true)
      const response = await adminFinanceService.getAccounts({ isActive: 'true' })
      if (response.success && response.data) {
        setAccounts(response.data)
      }
    } catch (err) {
      console.error('Error fetching accounts:', err)
      toast.error('Failed to load accounts')
    } finally {
      setAccountsLoading(false)
    }
  }

  // Fetch expenses from API
  const fetchExpenses = async () => {
    try {
      setExpensesLoading(true)
      setError(null)
      
      const params = {
        page: currentPage,
        limit: itemsPerPage
      }
      
      // Add filters
      if (selectedFilter !== 'all') {
        params.status = selectedFilter
      }
      if (searchTerm) {
        params.search = searchTerm
      }
      
      const response = await adminFinanceService.getExpenses(params)
      
      if (response.success && response.data) {
        setExpenses(response.data)
        setExpensesTotal(response.total || response.data.length)
        setExpensesPages(response.pages || 1)
      }
    } catch (err) {
      console.error('Error fetching expenses:', err)
      setError(err.message || 'Failed to fetch expenses')
      toast.error('Failed to load expenses')
    } finally {
      setExpensesLoading(false)
      setLoading(false)
    }
  }

  // Fetch budgets from API
  const fetchBudgets = async () => {
    try {
      setBudgetsLoading(true)
      setError(null)
      
      const params = {
        page: currentPage,
        limit: itemsPerPage
      }
      
      // Add filters
      if (selectedFilter !== 'all') {
        params.status = selectedFilter
      }
      if (searchTerm) {
        params.search = searchTerm
      }
      
      const response = await adminFinanceService.getBudgets(params)
      
      if (response.success && response.data) {
        // Map backend fields to frontend fields
        const mappedBudgets = response.data.map(budget => ({
          ...budget,
          id: budget._id || budget.id,
          name: budget.budgetName || budget.name,
          category: budget.budgetCategory || budget.category,
          allocated: budget.allocatedAmount || budget.allocated,
          spent: budget.spentAmount || budget.spent || 0,
          remaining: budget.remainingAmount || budget.remaining,
          startDate: budget.startDate ? new Date(budget.startDate).toISOString().split('T')[0] : budget.startDate,
          endDate: budget.endDate ? new Date(budget.endDate).toISOString().split('T')[0] : budget.endDate,
          projects: budget.budgetProjects || budget.projects || []
        }))
        setBudgets(mappedBudgets)
        setBudgetsTotal(response.total || response.data.length)
        setBudgetsPages(response.pages || 1)
      }
    } catch (err) {
      console.error('Error fetching budgets:', err)
      setError(err.message || 'Failed to fetch budgets')
      toast.error('Failed to load budgets')
    } finally {
      setBudgetsLoading(false)
      setLoading(false)
    }
  }

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      setTransactionsLoading(true)
      setError(null)
      
      const params = {
        page: currentPage,
        limit: itemsPerPage
      }
      
      // Add filters
      if (transactionTypeFilter !== 'all') {
        params.type = transactionTypeFilter
      }
      if (selectedFilter !== 'all') {
        params.status = selectedFilter
      }
      if (searchTerm) {
        params.search = searchTerm
      }
      
      const response = await adminFinanceService.getTransactions(params)
      
      if (response.success && response.data) {
        setTransactions(response.data)
        setTransactionsTotal(response.total || response.data.length)
        setTransactionsPages(response.pages || 1)
      }
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError(err.message || 'Failed to fetch transactions')
      toast.error('Failed to load transactions')
    } finally {
      setTransactionsLoading(false)
      setLoading(false)
    }
  }

  // Reset to page 1 when filters change
  useEffect(() => {
    if (activeTab === 'transactions' || activeTab === 'expenses' || activeTab === 'budgets') {
      setCurrentPage(1)
    }
  }, [transactionTypeFilter, selectedFilter, searchTerm, activeTab])

  // Load transactions when component mounts or filters change
  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactions()
      fetchAccounts() // Fetch accounts when transactions tab is active
    } else if (activeTab === 'expenses') {
      fetchExpenses()
    } else if (activeTab === 'budgets') {
      fetchBudgets()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentPage, transactionTypeFilter, selectedFilter, searchTerm])

  // Fetch accounts when component mounts
  useEffect(() => {
    fetchAccounts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return type === 'incoming' ? 'text-green-600' : 'text-red-600'
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
        return transactions.map(t => ({
          ...t,
          id: t._id || t.id,
          type: t.transactionType || t.type,
          date: t.transactionDate || t.date || t.createdAt
        }))
      case 'budgets':
        return budgets.map(b => ({
          ...b,
          id: b._id || b.id
        }))
      case 'invoices':
        return invoices
      case 'expenses':
        return expenses.map(e => ({
          ...e,
          id: e._id || e.id,
          date: e.transactionDate || e.date || e.createdAt
        }))
      case 'accounts':
        return accounts.map(a => ({
          ...a,
          id: a._id || a.id
        }))
      default:
        return transactions
    }
  }

  // Filter data based on search and filter criteria
  // Note: Transactions, expenses, and budgets are filtered on the backend, so we skip client-side filtering for them
  const filteredData = useMemo(() => {
    const data = getCurrentData()
    
    // For transactions, expenses, and budgets, backend handles filtering, so return data as-is
    if (activeTab === 'transactions' || activeTab === 'expenses' || activeTab === 'budgets') {
      return data
    }
    
    // For other tabs (still using mock data), apply client-side filtering
    return data.filter(item => {
      const matchesSearch = Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      let matchesFilter = true
      if (selectedFilter !== 'all') {
        if (activeTab === 'invoices') {
          matchesFilter = item.status === selectedFilter
        } else if (activeTab === 'accounts') {
          matchesFilter = item.isActive === (selectedFilter === 'active')
        }
      }
      
      return matchesSearch && matchesFilter
    })
  }, [activeTab, searchTerm, selectedFilter, transactionTypeFilter, transactions, expenses, budgets])

  // Pagination
  const paginatedData = useMemo(() => {
    // For transactions, expenses, and budgets, backend handles pagination, so return data as-is
    if (activeTab === 'transactions' || activeTab === 'expenses' || activeTab === 'budgets') {
      return filteredData
    }
    // For other tabs, apply client-side pagination
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage, activeTab])

  const totalPages = activeTab === 'transactions' 
    ? transactionsPages 
    : activeTab === 'expenses'
    ? expensesPages
    : activeTab === 'budgets'
    ? budgetsPages
    : Math.ceil(filteredData.length / itemsPerPage)

  // Management functions
  const handleCreate = () => {
    setSelectedItem(null)
    setShowCreateModal(true)
  }

  const handleEdit = (item) => {
    if (activeTab === 'budgets') {
      handleEditBudget(item)
    } else {
      setSelectedItem(item)
      setShowEditModal(true)
    }
  }

  const handleView = (item) => {
    if (activeTab === 'budgets') {
      handleViewBudget(item)
    } else {
      setSelectedItem(item)
      setShowViewModal(true)
    }
  }

  // Budget-specific handlers
  const handleViewBudget = (budget) => {
    setSelectedItem(budget)
    setShowBudgetViewModal(true)
  }

  const handleEditBudget = (budget) => {
    setSelectedItem(budget)
    setBudgetFormData({
      name: budget.name || budget.budgetName || '',
      category: budget.category || budget.budgetCategory || '',
      allocated: budget.allocated || budget.allocatedAmount || '',
      startDate: budget.startDate ? (typeof budget.startDate === 'string' ? budget.startDate : new Date(budget.startDate).toISOString().split('T')[0]) : '',
      endDate: budget.endDate ? (typeof budget.endDate === 'string' ? budget.endDate : new Date(budget.endDate).toISOString().split('T')[0]) : '',
      description: budget.description || ''
    })
    setShowBudgetEditModal(true)
  }

  const handleSpendBudget = (budget) => {
    setSelectedItem(budget)
    setBudgetSpendFormData({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    })
    setShowBudgetSpendModal(true)
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
    setShowAccountModal(false)
    setShowAccountViewModal(false)
    setShowAccountEditModal(false)
    setShowTransactionModal(false)
    setShowBudgetModal(false)
    setShowBudgetViewModal(false)
    setShowBudgetEditModal(false)
    setShowBudgetSpendModal(false)
    setShowInvoiceModal(false)
    setShowExpenseModal(false)
    setSelectedItem(null)
    setDeleteConfirm('')
    setAccountFormData({
      accountName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branchName: '',
      accountType: 'current',
      isActive: true,
      description: ''
    })
    setTransactionFormData({
      type: 'incoming',
      category: '',
      amount: '',
      date: '',
      account: '',
      description: ''
    })
    setBudgetFormData({
      name: '',
      category: '',
      allocated: '',
      startDate: '',
      endDate: '',
      description: ''
    })
    setInvoiceFormData({
      client: '',
      project: '',
      amount: '',
      dueDate: '',
      description: ''
    })
    setExpenseFormData({
      category: '',
      amount: '',
      date: '',
      description: ''
    })
  }

  const handleCreateAccount = () => {
    setAccountFormData({
      accountName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branchName: '',
      accountType: 'current',
      isActive: true,
      description: ''
    })
    setShowAccountModal(true)
  }

  const handleSaveAccount = async () => {
    if (!accountFormData.accountName || !accountFormData.bankName || !accountFormData.accountNumber) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      const response = await adminFinanceService.createAccount(accountFormData)
      
      if (response && response.success) {
        toast.success(response.message || 'Account created successfully')
        setShowAccountModal(false)
        closeModals()
        // Refresh accounts list
        await fetchAccounts()
      } else {
        toast.error(response?.message || 'Failed to create account')
      }
    } catch (err) {
      console.error('Error creating account:', err)
      toast.error(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleViewAccount = (account) => {
    setSelectedItem(account)
    setShowAccountViewModal(true)
  }

  const handleEditAccount = (account) => {
    setSelectedItem(account)
    setAccountFormData({
      accountName: account.accountName,
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      ifscCode: account.ifscCode,
      branchName: account.branchName,
      accountType: account.accountType,
      isActive: account.isActive,
      description: account.description
    })
    setShowAccountEditModal(true)
  }

  const handleUpdateAccount = async () => {
    if (!accountFormData.accountName || !accountFormData.bankName || !accountFormData.accountNumber) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      const accountId = selectedItem._id || selectedItem.id
      const response = await adminFinanceService.updateAccount(accountId, accountFormData)
      
      if (response && response.success) {
        toast.success(response.message || 'Account updated successfully')
        setShowAccountEditModal(false)
        closeModals()
        // Refresh accounts list
        await fetchAccounts()
      } else {
        toast.error(response?.message || 'Failed to update account')
      }
    } catch (err) {
      console.error('Error updating account:', err)
      toast.error(err.message || 'Failed to update account')
    } finally {
      setLoading(false)
    }
  }

  // Handler functions for different tabs
  const handleCreateTransaction = () => {
    setTransactionFormData({
      type: 'incoming',
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      account: '',
      description: ''
    })
    setShowTransactionModal(true)
  }

  const handleCreateBudget = () => {
    setBudgetFormData({
      name: '',
      category: '',
      allocated: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      description: ''
    })
    setShowBudgetModal(true)
  }

  const handleCreateInvoice = () => {
    setInvoiceFormData({
      client: '',
      project: '',
      amount: '',
      dueDate: '',
      description: ''
    })
    setShowInvoiceModal(true)
  }

  const handleCreateExpense = () => {
    setExpenseFormData({
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    })
    setShowExpenseModal(true)
  }

  const handleSaveTransaction = async () => {
    if (!transactionFormData.category || !transactionFormData.amount || !transactionFormData.date) {
      toast.error('Please fill in all required fields')
      return
    }

    // For incoming transactions, account is required
    if (transactionFormData.type === 'incoming' && !transactionFormData.account) {
      toast.error('Please select an account for incoming transactions')
      return
    }

    try {
      setLoading(true)
      
      const transactionData = {
        type: transactionFormData.type,
        category: transactionFormData.category,
        amount: parseFloat(transactionFormData.amount),
        date: transactionFormData.date,
        description: transactionFormData.description || ''
      }

      // Add account only for incoming transactions
      if (transactionFormData.type === 'incoming' && transactionFormData.account) {
        transactionData.account = transactionFormData.account
      }

      console.log('Creating transaction with data:', transactionData)
      const response = await adminFinanceService.createTransaction(transactionData)
      console.log('Transaction creation response:', response)
      
      if (response && response.success) {
        toast.success(response.message || 'Transaction created successfully')
        setShowTransactionModal(false)
        closeModals()
        // Refresh transactions list
        await fetchTransactions()
      } else {
        toast.error(response?.message || 'Failed to create transaction')
      }
    } catch (err) {
      console.error('Error creating transaction:', err)
      toast.error(err.message || 'Failed to create transaction')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveBudget = async () => {
    if (!budgetFormData.name || !budgetFormData.category || !budgetFormData.allocated || !budgetFormData.startDate || !budgetFormData.endDate) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      
      const budgetData = {
        name: budgetFormData.name,
        category: budgetFormData.category,
        allocated: parseFloat(budgetFormData.allocated),
        startDate: budgetFormData.startDate,
        endDate: budgetFormData.endDate,
        description: budgetFormData.description || ''
      }

      console.log('Creating budget with data:', budgetData)
      const response = await adminFinanceService.createBudget(budgetData)
      console.log('Budget creation response:', response)
      
      if (response && response.success) {
        toast.success(response.message || 'Budget created successfully')
        setShowBudgetModal(false)
        closeModals()
        // Refresh budgets list
        await fetchBudgets()
      } else {
        toast.error(response?.message || 'Failed to create budget')
      }
    } catch (err) {
      console.error('Error creating budget:', err)
      toast.error(err.message || 'Failed to create budget')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBudget = async () => {
    if (!budgetFormData.name || !budgetFormData.category || !budgetFormData.allocated || !budgetFormData.startDate || !budgetFormData.endDate) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!selectedItem || !selectedItem._id && !selectedItem.id) {
      toast.error('Budget not selected')
      return
    }

    try {
      setLoading(true)
      
      const budgetData = {
        name: budgetFormData.name,
        category: budgetFormData.category,
        allocated: parseFloat(budgetFormData.allocated),
        startDate: budgetFormData.startDate,
        endDate: budgetFormData.endDate,
        description: budgetFormData.description || '',
        status: selectedItem.status || 'active'
      }

      const budgetId = selectedItem._id || selectedItem.id
      const response = await adminFinanceService.updateBudget(budgetId, budgetData)
      
      if (response && response.success) {
        toast.success(response.message || 'Budget updated successfully')
        setShowBudgetEditModal(false)
        closeModals()
        // Refresh budgets list
        await fetchBudgets()
      } else {
        toast.error(response?.message || 'Failed to update budget')
      }
    } catch (err) {
      console.error('Error updating budget:', err)
      toast.error(err.message || 'Failed to update budget')
    } finally {
      setLoading(false)
    }
  }

  const handleSpendFromBudget = async () => {
    if (!budgetSpendFormData.amount || !budgetSpendFormData.date) {
      toast.error('Please fill in amount and date')
      return
    }

    if (!selectedItem || !selectedItem._id && !selectedItem.id) {
      toast.error('Budget not selected')
      return
    }

    const spendAmount = parseFloat(budgetSpendFormData.amount)
    if (spendAmount <= 0) {
      toast.error('Amount must be greater than 0')
      return
    }

    try {
      setLoading(true)
      
      // Create an outgoing transaction with the budget's category
      const budgetCategory = selectedItem.category || selectedItem.budgetCategory
      const expenseData = {
        category: budgetCategory,
        amount: spendAmount,
        date: budgetSpendFormData.date,
        description: budgetSpendFormData.description || `Budget spend for ${selectedItem.name || selectedItem.budgetName}`
      }

      // Create the expense (which is an outgoing transaction)
      const expenseResponse = await adminFinanceService.createExpense(expenseData)
      
      if (expenseResponse && expenseResponse.success) {
        toast.success(`₹${spendAmount.toLocaleString()} spent from budget successfully`)
        setShowBudgetSpendModal(false)
        closeModals()
        // Refresh budgets list to update spent amount
        await fetchBudgets()
      } else {
        toast.error(expenseResponse?.message || 'Failed to record budget spend')
      }
    } catch (err) {
      console.error('Error spending from budget:', err)
      toast.error(err.message || 'Failed to record budget spend')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveInvoice = () => {
    if (!invoiceFormData.client || !invoiceFormData.amount) {
      alert('Please fill in all required fields')
      return
    }

    const newInvoice = {
      id: invoices.length + 1,
      invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      ...invoiceFormData,
      amount: parseFloat(invoiceFormData.amount),
      status: 'pending',
      issueDate: new Date().toISOString().split('T')[0]
    }

    setInvoices([...invoices, newInvoice])
    setShowInvoiceModal(false)
    closeModals()
  }

  const handleSaveExpense = async () => {
    if (!expenseFormData.category || !expenseFormData.amount || !expenseFormData.date) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      
      const expenseData = {
        category: expenseFormData.category,
        amount: parseFloat(expenseFormData.amount),
        date: expenseFormData.date,
        description: expenseFormData.description || ''
      }

      console.log('Creating expense with data:', expenseData)
      const response = await adminFinanceService.createExpense(expenseData)
      console.log('Expense creation response:', response)
      
      if (response && response.success) {
        toast.success(response.message || 'Expense created successfully')
        setShowExpenseModal(false)
        closeModals()
        // Refresh expenses list
        await fetchExpenses()
      } else {
        toast.error(response?.message || 'Failed to create expense')
      }
    } catch (err) {
      console.error('Error creating expense:', err)
      toast.error(err.message || 'Failed to create expense')
    } finally {
      setLoading(false)
    }
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
                onClick={() => {
                  fetchFinanceStatistics() // Always refresh statistics
                  if (activeTab === 'transactions') {
                    fetchTransactions()
                  } else if (activeTab === 'expenses') {
                    fetchExpenses()
                  } else if (activeTab === 'budgets') {
                    fetchBudgets()
                  }
                }}
                disabled={loading || statisticsLoading || (activeTab === 'transactions' && transactionsLoading) || (activeTab === 'expenses' && expensesLoading) || (activeTab === 'budgets' && budgetsLoading)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiRefreshCw className={`text-sm ${(loading || statisticsLoading || transactionsLoading || expensesLoading || budgetsLoading) ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Statistics Cards - Row 1 */}
          {statisticsLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loading size="medium" />
            </div>
          ) : (
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
                    <p className={`text-xs font-medium ${parseFloat(statistics.revenueChange) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {parseFloat(statistics.revenueChange) >= 0 ? '+' : ''}{statistics.revenueChange}%
                    </p>
                    <p className="text-xs text-green-600">
                      {timeFilter === 'month' ? 'this month' : timeFilter === 'today' ? 'today' : timeFilter === 'week' ? 'this week' : timeFilter === 'year' ? 'this year' : 'all time'}
                    </p>
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
                    <p className={`text-xs font-medium ${parseFloat(statistics.expensesChange) >= 0 ? 'text-red-700' : 'text-green-700'}`}>
                      {parseFloat(statistics.expensesChange) >= 0 ? '+' : ''}{statistics.expensesChange}%
                    </p>
                    <p className="text-xs text-red-600">
                      {timeFilter === 'month' ? 'this month' : timeFilter === 'today' ? 'today' : timeFilter === 'week' ? 'this week' : timeFilter === 'year' ? 'this year' : 'all time'}
                    </p>
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
                    <p className={`text-xs font-medium ${parseFloat(statistics.profitChange) >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                      {parseFloat(statistics.profitChange) >= 0 ? '+' : ''}{statistics.profitChange}%
                    </p>
                    <p className="text-xs text-blue-600">
                      {timeFilter === 'month' ? 'this month' : timeFilter === 'today' ? 'today' : timeFilter === 'week' ? 'this week' : timeFilter === 'year' ? 'this year' : 'all time'}
                    </p>
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
          )}

          {/* Statistics Cards - Row 2 */}
          {statisticsLoading ? null : (
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
                    <span className="text-lg text-emerald-600">₹</span>
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
          )}

          {/* Navigation Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'transactions', label: 'Transactions', icon: FiActivity },
                  { id: 'budgets', label: 'Budgets', icon: FiTarget },
                  { id: 'invoices', label: 'Invoices', icon: FiFileText },
                  { id: 'expenses', label: 'Expenses', icon: FiTrendingDown },
                  { id: 'accounts', label: 'Accounts', icon: FiCreditCard }
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

          {/* Add Buttons and Transaction Type Tabs */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Transaction Type Tabs - Only show for transactions tab */}
            {activeTab === 'transactions' && (
              <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setTransactionTypeFilter('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    transactionTypeFilter === 'all'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTransactionTypeFilter('incoming')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    transactionTypeFilter === 'incoming'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Incoming
                </button>
                <button
                  onClick={() => setTransactionTypeFilter('outgoing')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    transactionTypeFilter === 'outgoing'
                      ? 'bg-white text-red-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Outgoing
                </button>
              </div>
            )}
            
            {/* Add Buttons */}
            <div className="flex justify-end">
              {activeTab === 'transactions' && (
                <button
                  onClick={handleCreateTransaction}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <FiPlus className="text-sm" />
                  <span>Add Transaction</span>
                </button>
              )}
              {activeTab === 'budgets' && (
                <button
                  onClick={handleCreateBudget}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <FiPlus className="text-sm" />
                  <span>Add Budget</span>
                </button>
              )}
              {activeTab === 'invoices' && (
                <button
                  onClick={handleCreateInvoice}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <FiPlus className="text-sm" />
                  <span>Add Invoice</span>
                </button>
              )}
              {activeTab === 'expenses' && (
                <button
                  onClick={handleCreateExpense}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <FiPlus className="text-sm" />
                  <span>Add Expense</span>
                </button>
              )}
              {activeTab === 'accounts' && (
                <button
                  onClick={handleCreateAccount}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <FiPlus className="text-sm" />
                  <span>Add Account</span>
                </button>
              )}
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
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </>
                )}
                {(activeTab === 'budgets' || activeTab === 'invoices' || activeTab === 'expenses') && (
                  <>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </>
                )}
                {activeTab === 'accounts' && (
                  <>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Content Grid */}
          {(transactionsLoading && activeTab === 'transactions') || (expensesLoading && activeTab === 'expenses') || (budgetsLoading && activeTab === 'budgets') ? (
            <div className="flex justify-center items-center py-12">
              <Loading size="medium" />
            </div>
          ) : error && (activeTab === 'transactions' || activeTab === 'expenses' || activeTab === 'budgets') ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => {
                  if (activeTab === 'transactions') fetchTransactions()
                  else if (activeTab === 'expenses') fetchExpenses()
                }}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : paginatedData.length === 0 && activeTab === 'transactions' ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">No transactions found</p>
              <button
                onClick={handleCreateTransaction}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add First Transaction
              </button>
            </div>
          ) : paginatedData.length === 0 && activeTab === 'expenses' ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">No expenses found</p>
              <button
                onClick={handleCreateExpense}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add First Expense
              </button>
            </div>
          ) : paginatedData.length === 0 && activeTab === 'budgets' ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">No budgets found</p>
              <button
                onClick={handleCreateBudget}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add First Budget
              </button>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedData.map((item, index) => (
              <motion.div
                key={item._id || item.id || `item-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                {/* Transaction Card */}
                {activeTab === 'transactions' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${getTypeColor(item.transactionType || item.type)}`}>
                        {(item.transactionType || item.type) === 'incoming' ? '+' : '-'}{formatCurrency(item.amount)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{item.category}</h3>
                      <p className="text-xs text-gray-600 mt-1">{item.description || 'No description'}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {item.account?.accountName || item.vendor || 'N/A'}
                      </span>
                      <span>{formatDate(item.transactionDate || item.date || item.createdAt)}</span>
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
                        <span>{formatCurrency(item.spent || 0)} / {formatCurrency(item.allocated)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min(100, ((item.spent || 0) / item.allocated) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <p>Remaining: {formatCurrency(item.remaining)}</p>
                      <p>{formatDate(item.startDate)} - {formatDate(item.endDate)}</p>
                    </div>
                    <div className="flex items-center space-x-1">
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
                      <button
                        onClick={() => handleSpendBudget(item)}
                        className="flex-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors"
                        title="Record expense from this budget"
                      >
                        <span className="inline mr-1">₹</span>
                        Spend
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
                      <p className="text-xs text-gray-600 mt-1">{item.description || 'No description'}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{item.vendor || item.employee?.name || 'N/A'}</span>
                      <span>{formatDate(item.transactionDate || item.date || item.createdAt)}</span>
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

                {/* Account Card - Light Color Credit Card Style */}
                {activeTab === 'accounts' && (
                  <div className={`relative rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden -m-4 ${
                    item.accountType === 'current' 
                      ? 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200'
                      : item.accountType === 'savings'
                      ? 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200'
                      : item.accountType === 'business'
                      ? 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200'
                      : 'bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200'
                  }`}>
                    {/* Card Content */}
                    <div className="p-3">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 rounded flex items-center justify-center ${
                            item.accountType === 'current' 
                              ? 'bg-blue-200 text-blue-700'
                              : item.accountType === 'savings'
                              ? 'bg-green-200 text-green-700'
                              : item.accountType === 'business'
                              ? 'bg-purple-200 text-purple-700'
                              : 'bg-orange-200 text-orange-700'
                          }`}>
                            <FiCreditCard className="w-3 h-3" />
                          </div>
                          <p className="text-xs font-medium text-gray-700 truncate">{item.bankName}</p>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          item.isActive 
                            ? 'bg-green-200 text-green-800' 
                            : 'bg-red-200 text-red-800'
                        }`}>
                          {item.isActive ? 'A' : 'I'}
                        </span>
                      </div>

                      {/* Account Name & Type */}
                      <div className="mb-3">
                        <h3 className="text-sm font-bold mb-1 truncate text-gray-800">{item.accountName}</h3>
                        <p className="text-xs text-gray-600 capitalize">{item.accountType}</p>
                      </div>

                      {/* Account Number */}
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Account</p>
                        <p className="text-sm font-mono tracking-wide text-gray-800">{item.accountNumber}</p>
                      </div>

                      {/* Bottom Info */}
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <p className="text-gray-500">IFSC</p>
                          <p className="font-mono text-gray-700">{item.ifscCode}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500">Branch</p>
                          <p className="truncate max-w-20 text-gray-700">{item.branchName}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-white p-2 border-t border-gray-100">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleViewAccount(item)}
                          className="flex-1 px-2 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1 text-xs"
                        >
                          <FiEye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleEditAccount(item)}
                          className="flex-1 px-2 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center justify-center space-x-1 text-xs"
                        >
                          <FiEdit className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                {activeTab === 'transactions' ? (
                  <>Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, transactionsTotal)} of {transactionsTotal} results</>
                ) : activeTab === 'expenses' ? (
                  <>Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, expensesTotal)} of {expensesTotal} results</>
                ) : activeTab === 'budgets' ? (
                  <>Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, budgetsTotal)} of {budgetsTotal} results</>
                ) : (
                  <>Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results</>
                )}
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

      {/* Account Creation Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Add New Bank Account</h3>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveAccount(); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Name *</label>
                  <input
                    type="text"
                    value={accountFormData.accountName}
                    onChange={(e) => setAccountFormData({...accountFormData, accountName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter account name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                  <input
                    type="text"
                    value={accountFormData.bankName}
                    onChange={(e) => setAccountFormData({...accountFormData, bankName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter bank name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                  <input
                    type="text"
                    value={accountFormData.accountNumber}
                    onChange={(e) => setAccountFormData({...accountFormData, accountNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter account number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code *</label>
                  <input
                    type="text"
                    value={accountFormData.ifscCode}
                    onChange={(e) => setAccountFormData({...accountFormData, ifscCode: e.target.value.toUpperCase()})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter IFSC code"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branch Name</label>
                  <input
                    type="text"
                    value={accountFormData.branchName}
                    onChange={(e) => setAccountFormData({...accountFormData, branchName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter branch name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                  <select
                    value={accountFormData.accountType}
                    onChange={(e) => setAccountFormData({...accountFormData, accountType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="current">Current Account</option>
                    <option value="savings">Savings Account</option>
                    <option value="business">Business Account</option>
                    <option value="corporate">Corporate Account</option>
                  </select>
                </div>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={accountFormData.description}
                  onChange={(e) => setAccountFormData({...accountFormData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter account description"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={accountFormData.isActive}
                    onChange={(e) => setAccountFormData({...accountFormData, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Active Account</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <FiPlus className="h-4 w-4" />
                  <span>Add Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account View Modal */}
      {showAccountViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Account Details</h3>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Account Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedItem.accountName}</h4>
                  <p className="text-sm text-gray-600">{selectedItem.bankName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedItem.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedItem.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Account Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <p className="text-lg font-mono bg-gray-50 p-3 rounded-lg">{selectedItem.accountNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                    <p className="text-lg font-mono bg-gray-50 p-3 rounded-lg">{selectedItem.ifscCode}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                    <p className="text-lg bg-gray-50 p-3 rounded-lg capitalize">{selectedItem.accountType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                    <p className="text-lg bg-gray-50 p-3 rounded-lg">{selectedItem.branchName}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedItem.description}</p>
              </div>

              {/* Account Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{formatDate(selectedItem.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Used</label>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{formatDate(selectedItem.lastUsed)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModals}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowAccountViewModal(false)
                    handleEditAccount(selectedItem)
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <FiEdit className="h-4 w-4" />
                  <span>Edit Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Edit Modal */}
      {showAccountEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Edit Account</h3>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleUpdateAccount(); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Name *</label>
                  <input
                    type="text"
                    value={accountFormData.accountName}
                    onChange={(e) => setAccountFormData({...accountFormData, accountName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter account name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                  <input
                    type="text"
                    value={accountFormData.bankName}
                    onChange={(e) => setAccountFormData({...accountFormData, bankName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter bank name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                  <input
                    type="text"
                    value={accountFormData.accountNumber}
                    onChange={(e) => setAccountFormData({...accountFormData, accountNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter account number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code *</label>
                  <input
                    type="text"
                    value={accountFormData.ifscCode}
                    onChange={(e) => setAccountFormData({...accountFormData, ifscCode: e.target.value.toUpperCase()})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter IFSC code"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branch Name</label>
                  <input
                    type="text"
                    value={accountFormData.branchName}
                    onChange={(e) => setAccountFormData({...accountFormData, branchName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter branch name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                  <select
                    value={accountFormData.accountType}
                    onChange={(e) => setAccountFormData({...accountFormData, accountType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="current">Current Account</option>
                    <option value="savings">Savings Account</option>
                    <option value="business">Business Account</option>
                    <option value="corporate">Corporate Account</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={accountFormData.description}
                  onChange={(e) => setAccountFormData({...accountFormData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter account description"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={accountFormData.isActive}
                    onChange={(e) => setAccountFormData({...accountFormData, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Active Account</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <FiEdit className="h-4 w-4" />
                  <span>Update Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Creation Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Add New Transaction</h3>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={async (e) => { 
              e.preventDefault(); 
              await handleSaveTransaction(); 
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type *</label>
                  <select
                    value={transactionFormData.type}
                    onChange={(e) => {
                      const newType = e.target.value
                      setTransactionFormData({
                        ...transactionFormData, 
                        type: newType,
                        account: newType === 'outgoing' ? '' : transactionFormData.account // Clear account if switching to outgoing
                      })
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="incoming">Incoming</option>
                    <option value="outgoing">Outgoing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <input
                    type="text"
                    value={transactionFormData.category}
                    onChange={(e) => setTransactionFormData({...transactionFormData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter category (e.g., Client Payment, Salary, etc.)"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={transactionFormData.amount}
                    onChange={(e) => setTransactionFormData({...transactionFormData, amount: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={transactionFormData.date}
                    onChange={(e) => setTransactionFormData({...transactionFormData, date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Account dropdown - only show for incoming transactions */}
              {transactionFormData.type === 'incoming' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account *</label>
                  {accountsLoading ? (
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500">
                      Loading accounts...
                    </div>
                  ) : accounts.length === 0 ? (
                    <div className="w-full px-4 py-3 border border-red-300 rounded-xl bg-red-50 text-red-600 text-sm">
                      No active accounts found. Please create an account first.
                    </div>
                  ) : (
                    <select
                      value={transactionFormData.account}
                      onChange={(e) => setTransactionFormData({...transactionFormData, account: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select an account</option>
                      {accounts.map((account) => (
                        <option key={account._id || account.id} value={account._id || account.id}>
                          {account.accountName} - {account.bankName} ({account.accountNumber})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={transactionFormData.description}
                  onChange={(e) => setTransactionFormData({...transactionFormData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter transaction description"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <FiPlus className="h-4 w-4" />
                  <span>Add Transaction</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Budget Creation Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Add New Budget</h3>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveBudget(); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Name *</label>
                  <input
                    type="text"
                    value={budgetFormData.name}
                    onChange={(e) => setBudgetFormData({...budgetFormData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter budget name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <input
                    type="text"
                    value={budgetFormData.category}
                    onChange={(e) => setBudgetFormData({...budgetFormData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter category"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allocated Amount *</label>
                <input
                  type="number"
                  value={budgetFormData.allocated}
                  onChange={(e) => setBudgetFormData({...budgetFormData, allocated: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter allocated amount"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={budgetFormData.startDate}
                    onChange={(e) => setBudgetFormData({...budgetFormData, startDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={budgetFormData.endDate}
                    onChange={(e) => setBudgetFormData({...budgetFormData, endDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={budgetFormData.description}
                  onChange={(e) => setBudgetFormData({...budgetFormData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter budget description"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <FiPlus className="h-4 w-4" />
                  <span>Add Budget</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Creation Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Add New Invoice</h3>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveInvoice(); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
                  <input
                    type="text"
                    value={invoiceFormData.client}
                    onChange={(e) => setInvoiceFormData({...invoiceFormData, client: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter client name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                  <input
                    type="text"
                    value={invoiceFormData.project}
                    onChange={(e) => setInvoiceFormData({...invoiceFormData, project: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter project name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                  <input
                    type="number"
                    value={invoiceFormData.amount}
                    onChange={(e) => setInvoiceFormData({...invoiceFormData, amount: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={invoiceFormData.dueDate}
                    onChange={(e) => setInvoiceFormData({...invoiceFormData, dueDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={invoiceFormData.description}
                  onChange={(e) => setInvoiceFormData({...invoiceFormData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter invoice description"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <FiPlus className="h-4 w-4" />
                  <span>Add Invoice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Budget View Modal */}
      {showBudgetViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Budget Details</h3>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Name</label>
                <p className="text-lg bg-gray-50 p-3 rounded-lg">{selectedItem.name || selectedItem.budgetName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <p className="text-lg bg-gray-50 p-3 rounded-lg">{selectedItem.category || selectedItem.budgetCategory}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <p className={`text-lg p-3 rounded-lg ${getStatusColor(selectedItem.status)}`}>
                    {selectedItem.status || 'active'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allocated</label>
                  <p className="text-lg font-semibold bg-blue-50 p-3 rounded-lg text-blue-700">
                    {formatCurrency(selectedItem.allocated || selectedItem.allocatedAmount)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spent</label>
                  <p className="text-lg font-semibold bg-red-50 p-3 rounded-lg text-red-700">
                    {formatCurrency(selectedItem.spent || selectedItem.spentAmount || 0)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Remaining</label>
                  <p className="text-lg font-semibold bg-green-50 p-3 rounded-lg text-green-700">
                    {formatCurrency(selectedItem.remaining || selectedItem.remainingAmount)}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Progress</label>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${
                      ((selectedItem.spent || selectedItem.spentAmount || 0) / (selectedItem.allocated || selectedItem.allocatedAmount)) > 0.9
                        ? 'bg-red-600'
                        : ((selectedItem.spent || selectedItem.spentAmount || 0) / (selectedItem.allocated || selectedItem.allocatedAmount)) > 0.7
                        ? 'bg-yellow-600'
                        : 'bg-blue-600'
                    }`}
                    style={{
                      width: `${Math.min(100, ((selectedItem.spent || selectedItem.spentAmount || 0) / (selectedItem.allocated || selectedItem.allocatedAmount)) * 100)}%`
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((selectedItem.spent || selectedItem.spentAmount || 0) / (selectedItem.allocated || selectedItem.allocatedAmount) * 100).toFixed(1)}% used
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <p className="text-lg bg-gray-50 p-3 rounded-lg">
                    {formatDate(selectedItem.startDate)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <p className="text-lg bg-gray-50 p-3 rounded-lg">
                    {formatDate(selectedItem.endDate)}
                  </p>
                </div>
              </div>

              {selectedItem.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedItem.description}</p>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBudgetViewModal(false)
                    handleSpendBudget(selectedItem)
                  }}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <span className="text-lg">₹</span>
                  <span>Record Spend</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Edit Modal */}
      {showBudgetEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Edit Budget</h3>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleUpdateBudget(); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Name *</label>
                  <input
                    type="text"
                    value={budgetFormData.name}
                    onChange={(e) => setBudgetFormData({...budgetFormData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter budget name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <input
                    type="text"
                    value={budgetFormData.category}
                    onChange={(e) => setBudgetFormData({...budgetFormData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter category"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allocated Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={budgetFormData.allocated}
                  onChange={(e) => setBudgetFormData({...budgetFormData, allocated: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter allocated amount"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={budgetFormData.startDate}
                    onChange={(e) => setBudgetFormData({...budgetFormData, startDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                  <input
                    type="date"
                    value={budgetFormData.endDate}
                    onChange={(e) => setBudgetFormData({...budgetFormData, endDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={budgetFormData.description}
                  onChange={(e) => setBudgetFormData({...budgetFormData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter budget description"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <FiEdit className="h-4 w-4" />
                  <span>Update Budget</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Budget Spend Modal */}
      {showBudgetSpendModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Record Budget Spend</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Budget: {selectedItem.name || selectedItem.budgetName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Remaining: {formatCurrency(selectedItem.remaining || selectedItem.remainingAmount)}
                </p>
              </div>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSpendFromBudget(); }} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Recording a spend will create an outgoing transaction with category "{selectedItem.category || selectedItem.budgetCategory}" 
                  and automatically update the budget's spent amount.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={selectedItem.remaining || selectedItem.remainingAmount}
                  value={budgetSpendFormData.amount}
                  onChange={(e) => setBudgetSpendFormData({...budgetSpendFormData, amount: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount to spend"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum: {formatCurrency(selectedItem.remaining || selectedItem.remainingAmount)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={budgetSpendFormData.date}
                  onChange={(e) => setBudgetSpendFormData({...budgetSpendFormData, date: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={budgetSpendFormData.description}
                  onChange={(e) => setBudgetSpendFormData({...budgetSpendFormData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter description for this spend"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <span className="text-lg">₹</span>
                  <span>Record Spend</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Creation Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Add New Expense</h3>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => { 
              e.preventDefault(); 
              handleSaveExpense(); 
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <input
                    type="text"
                    value={expenseFormData.category}
                    onChange={(e) => setExpenseFormData({...expenseFormData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter category (e.g., Salaries, Rent, Software, etc.)"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={expenseFormData.amount}
                    onChange={(e) => setExpenseFormData({...expenseFormData, amount: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={expenseFormData.date}
                  onChange={(e) => setExpenseFormData({...expenseFormData, date: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={expenseFormData.description}
                  onChange={(e) => setExpenseFormData({...expenseFormData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter expense description"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <FiPlus className="h-4 w-4" />
                  <span>Add Expense</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin_finance_management
