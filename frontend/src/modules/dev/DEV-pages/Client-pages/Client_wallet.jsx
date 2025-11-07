import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Client_navbar from '../../DEV-components/Client_navbar'
import {
  FiCreditCard,
  FiCalendar,
  FiTrendingUp,
  FiArrowRight,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiFilter,
  FiActivity,
  FiFolder,
  FiLoader
} from 'react-icons/fi'
import clientWalletService from '../../DEV-services/clientWalletService'

const Client_wallet = () => {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [summary, setSummary] = useState(null)
  const [projects, setProjects] = useState([])
  const [transactions, setTransactions] = useState([])
  const [upcomingPayments, setUpcomingPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadWalletData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [summaryResponse, transactionsResponse, upcomingResponse] = await Promise.all([
        clientWalletService.getSummary(),
        clientWalletService.getTransactions({ limit: 50 }),
        clientWalletService.getUpcomingPayments({ limit: 10 })
      ])

      setSummary(summaryResponse?.summary || null)
      setProjects(summaryResponse?.projects || [])

      const transactionList = Array.isArray(transactionsResponse?.data)
        ? transactionsResponse.data
        : Array.isArray(transactionsResponse)
          ? transactionsResponse
          : []
      setTransactions(transactionList)

      const upcomingList = Array.isArray(upcomingResponse?.data)
        ? upcomingResponse.data
        : Array.isArray(upcomingResponse)
          ? upcomingResponse
          : []
      setUpcomingPayments(upcomingList)
    } catch (err) {
      console.error('Failed to load wallet data:', err)
      setError(err.message || 'Failed to load wallet data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWalletData()
  }, [loadWalletData])

  const currencyFormatter = useMemo(() => {
    const currencyCode = summary?.currency || 'INR'
    const locale = currencyCode === 'INR' ? 'en-IN' : 'en-US'
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }, [summary?.currency])

  const formatCurrency = useCallback(
    (amount) => {
      const safeAmount = typeof amount === 'number' ? amount : Number(amount || 0)
      return currencyFormatter.format(Number.isFinite(safeAmount) ? safeAmount : 0)
    },
    [currencyFormatter]
  )

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'started':
      case 'in-progress':
      case 'testing':
        return 'bg-teal-100 text-teal-800'
      case 'on-hold':
        return 'bg-orange-100 text-orange-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      case 'pending-assignment':
      case 'untouched':
        return 'bg-yellow-100 text-yellow-700'
      case 'completed':
      case 'paid':
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'refunded':
        return 'bg-blue-100 text-blue-700'
      case 'failed':
        return 'bg-red-100 text-red-700'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
      case 'started':
      case 'in-progress':
      case 'testing':
        return FiActivity
      case 'on-hold':
        return FiClock
      case 'cancelled':
        return FiAlertCircle
      case 'pending-assignment':
      case 'untouched':
        return FiClock
      case 'completed':
      case 'paid':
      case 'approved':
        return FiCheckCircle
      case 'pending':
        return FiClock
      case 'refunded':
        return FiTrendingUp
      case 'upcoming':
        return FiCalendar
      default:
        return FiAlertCircle
    }
  }

  const totals = useMemo(() => {
    const totalPaid = summary?.totalPaid || 0
    const totalOutstanding = summary?.totalOutstanding || 0
    const totalCost = summary?.totalCost || 0
    const projectsCount = summary?.totalProjects || projects.length || 0
    const upcomingAmount = upcomingPayments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    )

    return {
      totalPaid,
      totalOutstanding,
      totalCost,
      projectsCount,
      upcomingAmount
    }
  }, [summary, projects, upcomingPayments])

  const filteredTransactions = useMemo(() => {
    if (selectedFilter === 'all') return transactions
    if (selectedFilter === 'payment') {
      return transactions.filter((transaction) => transaction.status !== 'refunded')
    }
    if (selectedFilter === 'refund') {
      return transactions.filter((transaction) => transaction.status === 'refunded')
    }
    return transactions
  }, [transactions, selectedFilter])

  const resolveTransactionType = useCallback((transaction) => {
    if (!transaction) return 'payment'
    if (transaction.status === 'refunded') return 'refund'
    if (transaction.status === 'pending') return 'pending'
    return 'payment'
  }, [])

  const getTransactionIcon = useCallback(
    (transaction) => {
      const type = resolveTransactionType(transaction)
      switch (type) {
        case 'payment':
          return FiCreditCard
        case 'refund':
          return FiTrendingUp
        case 'pending':
          return FiClock
        default:
          return FiActivity
      }
    },
    [resolveTransactionType]
  )

  const getTransactionColor = useCallback(
    (transaction) => {
      const type = resolveTransactionType(transaction)
      if (type === 'refund') return 'text-green-600'
      if (type === 'pending') return 'text-yellow-600'
      return 'text-red-600'
    },
    [resolveTransactionType]
  )

  const getTransactionAmountPrefix = useCallback((transaction) => {
    const type = resolveTransactionType(transaction)
    if (type === 'refund') return '+'
    if (type === 'pending') return '±'
    return '-'
  }, [resolveTransactionType])

  const getTransactionDescription = useCallback((transaction) => {
    if (!transaction) return 'Payment'
    if (transaction.notes) return transaction.notes
    const projectName = transaction.project?.name
    if (projectName && transaction.paymentType) {
      return `${projectName} • ${transaction.paymentType}`
    }
    if (projectName) return projectName
    return transaction.paymentType
      ? transaction.paymentType.charAt(0).toUpperCase() + transaction.paymentType.slice(1)
      : 'Project payment'
  }, [])

  const displayedTransactions = useMemo(
    () => filteredTransactions.slice(0, 8),
    [filteredTransactions]
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <Client_navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-20 lg:pb-8">
          <div className="flex flex-col items-center justify-center h-64 text-gray-600 space-y-3">
            <FiLoader className="h-7 w-7 animate-spin text-teal-600" />
            <p>Loading wallet overview...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <Client_navbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-20 lg:pb-8">
          <div className="bg-white border border-red-100 rounded-2xl shadow-sm p-8 text-center">
            <div className="flex flex-col items-center space-y-3">
              <FiAlertCircle className="h-10 w-10 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900">Unable to load wallet data</h2>
              <p className="text-gray-600 max-w-md">{error}</p>
              <button
                onClick={loadWalletData}
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <Client_navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-20 lg:pb-4">
        
        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          
          {/* Financial Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative bg-gradient-to-br from-teal-500/5 via-teal-500/10 to-teal-600/20 rounded-xl p-4 text-gray-900 shadow-lg border border-teal-200/20 overflow-hidden"
            style={{
              boxShadow: '0 10px 25px -5px rgba(20, 184, 166, 0.15), 0 0 0 1px rgba(20, 184, 166, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
            }}
          >
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-2 right-4 w-1 h-1 bg-teal-500/30 rounded-full animate-pulse"></div>
              <div className="absolute top-6 right-8 w-0.5 h-0.5 bg-teal-500/25 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute bottom-8 left-4 w-0.5 h-0.5 bg-teal-500/25 rounded-full animate-pulse delay-500"></div>
              
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-2">
                <div className="w-full h-full" style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(20, 184, 166, 0.05) 1px, transparent 0)',
                  backgroundSize: '15px 15px'
                }}></div>
              </div>
            </div>

            {/* Header Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-between mb-3 relative z-10"
            >
              <div className="flex items-center space-x-2">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="relative w-8 h-8 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md border border-teal-500/40"
                >
                  <FiCreditCard className="text-teal-600 text-sm" />
                </motion.div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Client Wallet</h2>
                  <p className="text-teal-600 text-xs">Project Payments & Balance</p>
                </div>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-1 bg-white/70 backdrop-blur-sm rounded-md px-2 py-1 border border-teal-500/50 shadow-sm"
              >
                <FiActivity className="text-teal-600 text-xs" />
                <span className="text-teal-600 font-bold text-xs">Active</span>
              </motion.div>
            </motion.div>

            {/* Project Cost Metrics */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 gap-3 mb-3"
            >
              {/* Total Paid */}
              <motion.div 
                whileHover={{ scale: 1.02, y: -1 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm rounded-lg p-3 border border-green-300/50 hover:border-green-400/70 transition-all duration-300 shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-green-800 text-xs font-semibold">Total Paid</span>
                  <FiCheckCircle className="text-green-600 text-xs" />
                </div>
                <p className="text-gray-900 text-sm font-bold">{formatCurrency(totals.totalPaid)}</p>
                <p className="text-green-600 text-xs">Completed payments</p>
              </motion.div>
              
              {/* Remaining Amount */}
              <motion.div 
                whileHover={{ scale: 1.02, y: -1 }}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 backdrop-blur-sm rounded-lg p-3 border border-yellow-300/50 hover:border-yellow-400/70 transition-all duration-300 shadow-sm relative group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-yellow-800 text-xs font-semibold">Remaining</span>
                  <FiClock className="text-yellow-600 text-xs" />
                </div>
                <p className="text-gray-900 text-sm font-bold">{formatCurrency(totals.totalOutstanding)}</p>
                <p className="text-yellow-600 text-xs">Outstanding balance</p>
                
                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Amount still to be paid for projects
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                </div>
              </motion.div>
            </motion.div>

            {/* Summary Row */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-3 gap-2"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-blue-300/50 text-center hover:border-blue-400/70 transition-all duration-300 shadow-sm"
              >
                <p className="text-blue-800 text-xs font-semibold mb-0.5">Due Soon</p>
                <p className="text-gray-900 text-xs font-bold">{formatCurrency(totals.upcomingAmount)}</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-teal-300/50 text-center hover:border-teal-400/70 transition-all duration-300 shadow-sm"
              >
                <p className="text-teal-800 text-xs font-semibold mb-0.5">Total Cost</p>
                <p className="text-gray-900 text-xs font-bold">{formatCurrency(totals.totalCost)}</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-purple-300/50 text-center hover:border-purple-400/70 transition-all duration-300 shadow-sm"
              >
                <p className="text-purple-800 text-xs font-semibold mb-0.5">Projects</p>
                <p className="text-gray-900 text-xs font-bold">{totals.projectsCount}</p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Transaction Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Payment History</h3>
              <p className="text-sm text-gray-600 mt-1">{transactions.length} recent transactions</p>
            </div>
          </div>

          {/* Transaction List */}
          <div className="space-y-3">
            {displayedTransactions.map((transaction, index) => {
              const IconComponent = getTransactionIcon(transaction)
              const StatusIcon = getStatusIcon(transaction.status)
              const amountPrefix = getTransactionAmountPrefix(transaction)
              const description = getTransactionDescription(transaction)
              const dateValue = transaction.paidAt || transaction.createdAt

              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <IconComponent className={`text-sm ${getTransactionColor(transaction)}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{description}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-500">{formatDate(dateValue)}</p>
                          <div className="flex items-center space-x-1">
                            <StatusIcon className={`text-xs ${getStatusColor(transaction.status)}`} />
                            <span className={`text-xs ${getStatusColor(transaction.status)}`}>{transaction.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-semibold text-sm ${getTransactionColor(transaction)}`}>
                        {amountPrefix}{formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-8">
            
            {/* Main Content - 9 columns */}
            <div className="col-span-9 space-y-6">
              
              {/* Financial Overview Cards */}
              <div className="grid grid-cols-1 gap-6 mb-6">
                 {/* Project Cost Overview - Full Width Card */}
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.6, ease: "easeOut", delay: 0 }}
                   className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-8 shadow-2xl"
                   style={{
                     boxShadow: '0 25px 50px -12px rgba(20, 184, 166, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                   }}
                 >
                   <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center space-x-4">
                       <div className="bg-white/20 p-4 rounded-xl">
                         <FiFolder className="text-white text-2xl" />
                       </div>
                       <div>
                         <h3 className="text-white text-2xl font-bold">Project Cost Overview</h3>
                         <p className="text-white/80 text-sm">Total investment across all projects</p>
                       </div>
                     </div>
                     <div className="flex items-center space-x-4">
                       <div className="text-right">
                         <p className="text-white text-4xl font-bold">{formatCurrency(totals.totalCost)}</p>
                         <div className="flex items-center mt-1">
                           <FiCheckCircle className="text-white/60 text-sm mr-1" />
                           <span className="text-white/80 text-xs">Paid: {formatCurrency(totals.totalPaid)}</span>
                         </div>
                       </div>
                       <button className="bg-white/20 p-3 rounded-lg hover:bg-white/30 transition-colors duration-200">
                         <FiActivity className="text-white text-xl" />
                       </button>
                     </div>
                   </div>
                 </motion.div>
               </div>
               
               {/* Summary Cards Row */}
               <div className="grid grid-cols-3 gap-6 mb-6">
                 {/* Total Paid */}
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                   className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                 >
                   <div className="flex items-center justify-between mb-4">
                     <FiCheckCircle className="text-green-600 text-xl" />
                     <FiTrendingUp className="text-green-500 text-lg" />
                   </div>
                   <h4 className="text-gray-600 text-sm font-medium mb-2">Total Paid</h4>
                   <p className="text-gray-900 text-2xl font-bold">{formatCurrency(totals.totalPaid)}</p>
                   <p className="text-green-600 text-xs font-semibold mt-1">Completed payments</p>
                 </motion.div>
                 
                 {/* Remaining Amount */}
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                   className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                 >
                   <div className="flex items-center justify-between mb-4">
                     <FiClock className="text-yellow-600 text-xl" />
                     <FiAlertCircle className="text-yellow-500 text-lg" />
                   </div>
                   <h4 className="text-gray-600 text-sm font-medium mb-2">Remaining</h4>
                   <p className="text-gray-900 text-2xl font-bold">{formatCurrency(totals.totalOutstanding)}</p>
                   <p className="text-yellow-600 text-xs font-semibold mt-1">Outstanding balance</p>
                 </motion.div>

                 {/* Due Soon */}
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
                   className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                 >
                   <div className="flex items-center justify-between mb-4">
                     <FiCalendar className="text-blue-600 text-xl" />
                     <FiClock className="text-blue-500 text-lg" />
                   </div>
                   <h4 className="text-gray-600 text-sm font-medium mb-2">Due Soon</h4>
                   <p className="text-gray-900 text-2xl font-bold">{formatCurrency(totals.upcomingAmount)}</p>
                   <p className="text-blue-600 text-xs font-semibold mt-1">Next 30 days</p>
                 </motion.div>
               </div>
              
              {/* Transactions Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
                    <p className="text-sm text-gray-600 mt-1">Latest {transactions.length} transactions</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedFilter('all')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        selectedFilter === 'all' 
                          ? 'bg-teal-100 text-teal-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setSelectedFilter('payment')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        selectedFilter === 'payment' 
                          ? 'bg-teal-100 text-teal-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Payments
                    </button>
                    <button
                      onClick={() => setSelectedFilter('refund')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        selectedFilter === 'refund' 
                          ? 'bg-teal-100 text-teal-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Refunds
                    </button>
                  </div>
                </div>
                
                  <div className="overflow-hidden">
                  <div className="space-y-3">
                    {displayedTransactions.map((transaction, index) => {
                      const IconComponent = getTransactionIcon(transaction)
                      const StatusIcon = getStatusIcon(transaction.status)
                      const amountPrefix = getTransactionAmountPrefix(transaction)
                      const description = getTransactionDescription(transaction)
                      const dateValue = transaction.paidAt || transaction.createdAt

                      return (
                        <motion.div
                          key={transaction.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                          className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="bg-gray-50 p-2 rounded-lg">
                                <IconComponent className={`text-sm ${getTransactionColor(transaction)}`} />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 text-sm">{description}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <p className="text-xs text-gray-500">{formatDate(dateValue)}</p>
                                  <div className="flex items-center space-x-1">
                                    <StatusIcon className={`text-xs ${getStatusColor(transaction.status)}`} />
                                    <span className={`text-xs ${getStatusColor(transaction.status)}`}>{transaction.status}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className={`font-semibold text-sm ${getTransactionColor(transaction)}`}>
                                {amountPrefix}{formatCurrency(transaction.amount)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>

              
            </div>
            
            {/* Sidebar - 3 columns */}
            <div className="col-span-3 space-y-6">
              
              {/* Project Summary */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 1.0 }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Project Summary</h3>
                
                <div className="space-y-4">
                  {projects.map((project) => {
                    const paidAmount = project.paidAmount || 0
                    const totalCost = project.totalCost || 0
                    const remainingAmount =
                      project.remainingAmount ?? Math.max(totalCost - paidAmount, 0)
                    const progress =
                      totalCost > 0 ? Math.min((paidAmount / totalCost) * 100, 100) : 0

                    return (
                      <div key={project.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm">{project.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mb-2">
                          <span>Paid: {formatCurrency(paidAmount)}</span>
                          <span>Total: {formatCurrency(totalCost)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-teal-500 to-teal-600 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>Remaining: {formatCurrency(remainingAmount)}</span>
                          <span>Progress: {Math.round(progress)}%</span>
                        </div>
                      </div>
                    )
                  })}
                  {projects.length === 0 && (
                    <div className="text-center text-sm text-gray-500 border border-dashed border-gray-200 rounded-lg py-6">
                      No projects found yet.
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Upcoming Payments */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Payments</h3>
                
                <div className="space-y-3">
                  {upcomingPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900 text-sm">
                          {payment.project?.name || 'Project payment'}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status || 'pending')}`}>
                          {payment.status || 'pending'}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">
                          {payment.milestone?.title || 'Milestone payment'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 text-sm">{formatCurrency(payment.amount)}</p>
                        <p className="text-xs text-gray-500">{formatDate(payment.dueDate)}</p>
                      </div>
                    </div>
                  ))}
                  {upcomingPayments.length === 0 && (
                    <div className="text-center text-sm text-gray-500 border border-dashed border-gray-200 rounded-lg py-6">
                      No pending payments right now.
                    </div>
                  )}
                </div>
              </motion.div>
              
            </div>
          </div>
        </div>
        
      </main>

    </div>
  )
}

export default Client_wallet
