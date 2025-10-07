import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Client_navbar from '../../DEV-components/Client_navbar'
import { 
  FiCreditCard,
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiTrendingDown,
  FiArrowRight,
  FiDownload,
  FiEye,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiFileText,
  FiFilter,
  FiActivity,
  FiAward,
  FiUser,
  FiFolder
} from 'react-icons/fi'

const Client_wallet = () => {
  const [selectedFilter, setSelectedFilter] = useState('all')

  // Mock wallet data
  const walletData = {
    balance: {
      total: 125000,
      available: 85000,
      pending: 40000,
      currency: 'USD'
    },
    projects: [
      {
        id: 1,
        name: "E-commerce Website",
        totalCost: 50000,
        paid: 30000,
        remaining: 20000,
        status: "active",
        dueDate: "2024-02-15",
        nextPayment: 10000,
        nextPaymentDate: "2024-01-30",
        milestones: [
          { name: "Design & Planning", cost: 15000, status: "paid", date: "2024-01-15" },
          { name: "Development Phase 1", cost: 15000, status: "paid", date: "2024-01-20" },
          { name: "Development Phase 2", cost: 10000, status: "pending", date: "2024-01-30" },
          { name: "Testing & Deployment", cost: 10000, status: "upcoming", date: "2024-02-15" }
        ]
      },
      {
        id: 2,
        name: "Mobile App Development",
        totalCost: 75000,
        paid: 25000,
        remaining: 50000,
        status: "active",
        dueDate: "2024-03-01",
        nextPayment: 25000,
        nextPaymentDate: "2024-02-01",
        milestones: [
          { name: "UI/UX Design", cost: 15000, status: "paid", date: "2024-01-10" },
          { name: "Backend Development", cost: 10000, status: "paid", date: "2024-01-25" },
          { name: "Frontend Development", cost: 25000, status: "pending", date: "2024-02-01" },
          { name: "Testing & Launch", cost: 25000, status: "upcoming", date: "2024-03-01" }
        ]
      },
      {
        id: 3,
        name: "Database Migration",
        totalCost: 30000,
        paid: 30000,
        remaining: 0,
        status: "completed",
        dueDate: "2024-01-15",
        nextPayment: 0,
        nextPaymentDate: null,
        milestones: [
          { name: "Data Analysis", cost: 10000, status: "paid", date: "2024-01-05" },
          { name: "Migration Process", cost: 15000, status: "paid", date: "2024-01-10" },
          { name: "Testing & Validation", cost: 5000, status: "paid", date: "2024-01-15" }
        ]
      }
    ],
    transactions: [
      {
        id: 1,
        type: "payment",
        amount: 15000,
        description: "E-commerce Website - Design & Planning milestone",
        date: "2024-01-15",
        status: "completed",
        project: "E-commerce Website"
      },
      {
        id: 2,
        type: "payment",
        amount: 15000,
        description: "E-commerce Website - Development Phase 1",
        date: "2024-01-20",
        status: "completed",
        project: "E-commerce Website"
      },
      {
        id: 3,
        type: "payment",
        amount: 15000,
        description: "Mobile App - UI/UX Design milestone",
        date: "2024-01-10",
        status: "completed",
        project: "Mobile App Development"
      },
      {
        id: 4,
        type: "payment",
        amount: 10000,
        description: "Mobile App - Backend Development",
        date: "2024-01-25",
        status: "completed",
        project: "Mobile App Development"
      },
      {
        id: 5,
        type: "refund",
        amount: 2000,
        description: "Database Migration - Scope adjustment refund",
        date: "2024-01-12",
        status: "completed",
        project: "Database Migration"
      }
    ],
    upcomingPayments: [
      {
        id: 1,
        project: "E-commerce Website",
        amount: 10000,
        dueDate: "2024-01-30",
        milestone: "Development Phase 2",
        status: "pending"
      },
      {
        id: 2,
        project: "Mobile App Development",
        amount: 25000,
        dueDate: "2024-02-01",
        milestone: "Frontend Development",
        status: "pending"
      }
    ]
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'active': return 'bg-teal-100 text-teal-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'paid': return FiCheckCircle
      case 'pending': return FiClock
      case 'upcoming': return FiCalendar
      default: return FiAlertCircle
    }
  }

  const filteredTransactions = selectedFilter === 'all' 
    ? walletData.transactions 
    : walletData.transactions.filter(t => t.type === selectedFilter)

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'payment': return FiCreditCard
      case 'refund': return FiTrendingDown
      default: return FiActivity
    }
  }

  const getTransactionColor = (type) => {
    return type === 'payment' ? 'text-red-600' : 'text-green-600'
  }

  const getTransactionBg = (type) => {
    return type === 'payment' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
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
                <p className="text-gray-900 text-sm font-bold">{formatCurrency(walletData.projects.reduce((sum, project) => sum + project.paid, 0))}</p>
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
                <p className="text-gray-900 text-sm font-bold">{formatCurrency(walletData.projects.reduce((sum, project) => sum + project.remaining, 0))}</p>
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
                <p className="text-gray-900 text-xs font-bold">{formatCurrency(walletData.upcomingPayments.reduce((sum, payment) => sum + payment.amount, 0))}</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-teal-300/50 text-center hover:border-teal-400/70 transition-all duration-300 shadow-sm"
              >
                <p className="text-teal-800 text-xs font-semibold mb-0.5">Total Cost</p>
                <p className="text-gray-900 text-xs font-bold">{formatCurrency(walletData.projects.reduce((sum, project) => sum + project.totalCost, 0))}</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-purple-300/50 text-center hover:border-purple-400/70 transition-all duration-300 shadow-sm"
              >
                <p className="text-purple-800 text-xs font-semibold mb-0.5">Projects</p>
                <p className="text-gray-900 text-xs font-bold">{walletData.projects.length}</p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Transaction Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Payment History</h3>
              <p className="text-sm text-gray-600 mt-1">{walletData.transactions.length} recent transactions</p>
            </div>
          </div>

          {/* Transaction List */}
          <div className="space-y-3">
            {walletData.transactions.map((transaction, index) => {
              const IconComponent = getTransactionIcon(transaction.type)
              const StatusIcon = getStatusIcon(transaction.status)
              
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
                        <IconComponent className={`text-sm ${getTransactionColor(transaction.type)}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{transaction.description}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                          <div className="flex items-center space-x-1">
                            <StatusIcon className={`text-xs ${getStatusColor(transaction.status)}`} />
                            <span className={`text-xs ${getStatusColor(transaction.status)}`}>{transaction.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-semibold text-sm ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'payment' ? '-' : '+'}{formatCurrency(transaction.amount)}
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
                         <p className="text-white text-4xl font-bold">{formatCurrency(walletData.projects.reduce((sum, project) => sum + project.totalCost, 0))}</p>
                         <div className="flex items-center mt-1">
                           <FiCheckCircle className="text-white/60 text-sm mr-1" />
                           <span className="text-white/80 text-xs">Paid: {formatCurrency(walletData.projects.reduce((sum, project) => sum + project.paid, 0))}</span>
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
                   <p className="text-gray-900 text-2xl font-bold">{formatCurrency(walletData.projects.reduce((sum, project) => sum + project.paid, 0))}</p>
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
                   <p className="text-gray-900 text-2xl font-bold">{formatCurrency(walletData.projects.reduce((sum, project) => sum + project.remaining, 0))}</p>
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
                   <p className="text-gray-900 text-2xl font-bold">{formatCurrency(walletData.upcomingPayments.reduce((sum, payment) => sum + payment.amount, 0))}</p>
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
                    <p className="text-sm text-gray-600 mt-1">Latest {walletData.transactions.length} transactions</p>
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
                    {filteredTransactions.slice(0, 8).map((transaction, index) => {
                      const IconComponent = getTransactionIcon(transaction.type)
                      const StatusIcon = getStatusIcon(transaction.status)
                      
                      return (
                        <motion.div
                          key={transaction.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                          className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="bg-gray-50 p-2 rounded-lg">
                                <IconComponent className={`text-sm ${getTransactionColor(transaction.type)}`} />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 text-sm">{transaction.description}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                                  <div className="flex items-center space-x-1">
                                    <StatusIcon className={`text-xs ${getStatusColor(transaction.status)}`} />
                                    <span className={`text-xs ${getStatusColor(transaction.status)}`}>{transaction.status}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className={`font-semibold text-sm ${getTransactionColor(transaction.type)}`}>
                                {transaction.type === 'payment' ? '-' : '+'}{formatCurrency(transaction.amount)}
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
                  {walletData.projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm">{project.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mb-2">
                        <span>Paid: {formatCurrency(project.paid)}</span>
                        <span>Total: {formatCurrency(project.totalCost)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-teal-500 to-teal-600 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${(project.paid / project.totalCost) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
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
                  {walletData.upcomingPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{payment.project}</p>
                        <p className="text-xs text-gray-600">{payment.milestone}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 text-sm">{formatCurrency(payment.amount)}</p>
                        <p className="text-xs text-gray-500">{formatDate(payment.dueDate)}</p>
                      </div>
                    </div>
                  ))}
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
