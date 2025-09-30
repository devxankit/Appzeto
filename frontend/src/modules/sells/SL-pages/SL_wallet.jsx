// Professional Wallet Dashboard component with enhanced UI
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiCreditCard,
  FiArrowUp,
  FiArrowDown,
  FiCalendar,
  FiTrendingUp,
  FiDollarSign,
  FiActivity,
  FiX
} from 'react-icons/fi'
import SL_navbar from '../SL-components/SL_navbar'

const SL_wallet = () => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  
  // Mock data - Employee's personal wallet with mixed earnings and withdrawals
  const walletData = {
    currentBalance: 22750,
    monthlyEarning: 18500,
    totalEarning: 89200,
    transactions: [
      { id: 1, amount: 12000, type: "income", date: "15/12/2023", category: "Salary", description: "Monthly Salary - December 2023" },
       { id: 2, amount: 5000, type: "withdrawal", date: "12/12/2023", category: "Withdrawal", description: "Bank Withdrawal", method: "Bank", status: "Completed" },
       { id: 3, amount: 3200, type: "income", date: "10/12/2023", category: "Reward", description: "Performance Bonus - December" },
       { id: 4, amount: 1500, type: "income", date: "08/12/2023", category: "Reward", description: "Sales Achievement Bonus" },
       { id: 5, amount: 3000, type: "withdrawal", date: "05/12/2023", category: "Withdrawal", description: "UPI Withdrawal", method: "UPI", status: "Completed" },
      { id: 6, amount: 2150, type: "income", date: "01/12/2023", category: "Reward", description: "Team Collaboration Award" },
      { id: 7, amount: 1680, type: "income", date: "28/11/2023", category: "Salary", description: "Monthly Salary - November 2023" },
       { id: 8, amount: 7500, type: "withdrawal", date: "20/11/2023", category: "Withdrawal", description: "Bank Withdrawal", method: "Bank", status: "Completed" },
       { id: 9, amount: 2400, type: "income", date: "18/11/2023", category: "Reward", description: "Client Satisfaction Bonus" },
       { id: 10, amount: 2000, type: "withdrawal", date: "15/11/2023", category: "Withdrawal", description: "UPI Withdrawal", method: "UPI", status: "Completed" },
      { id: 11, amount: 2750, type: "income", date: "15/11/2023", category: "Salary", description: "Monthly Salary - November 2023" },
      { id: 12, amount: 1200, type: "income", date: "10/11/2023", category: "Reward", description: "Project Completion Bonus" }
    ]
  }

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`
  }

  const getTransactionIcon = (category) => {
    switch(category) {
      case 'Salary': return FiCreditCard
      case 'Reward': return FiTrendingUp
      case 'Withdrawal': return FiArrowUp
      default: return FiActivity
    }
  }

  const getTransactionColor = (type) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600'
  }

  const getTransactionBg = (type) => {
    return type === 'income' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <SL_navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-20 lg:pb-4">
        
        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          
          {/* Financial Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200 rounded-xl p-4 text-gray-900 shadow-lg border border-teal-300/40 overflow-hidden"
            style={{
              boxShadow: '0 10px 25px -5px rgba(20, 184, 166, 0.15), 0 0 0 1px rgba(20, 184, 166, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
            }}
          >
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-2 right-4 w-1 h-1 bg-teal-200/30 rounded-full animate-pulse"></div>
              <div className="absolute top-6 right-8 w-0.5 h-0.5 bg-teal-300/25 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute bottom-8 left-4 w-0.5 h-0.5 bg-teal-200/25 rounded-full animate-pulse delay-500"></div>
              
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
                  className="relative w-8 h-8 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md border border-teal-300/40"
                >
                  <FiCreditCard className="text-teal-700 text-sm" />
                </motion.div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Wallet Overview</h2>
                  <p className="text-teal-700 text-xs">Financial summary</p>
                </div>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-1 bg-white/70 backdrop-blur-sm rounded-md px-2 py-1 border border-teal-400/50 shadow-sm"
              >
                <FiActivity className="text-teal-700 text-xs" />
                <span className="text-teal-800 font-bold text-xs">Active</span>
              </motion.div>
            </motion.div>

            {/* Current Balance Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-3"
            >
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-teal-300/50 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-teal-800 text-xs font-semibold">Current Balance</span>
                  <FiDollarSign className="text-teal-600 text-sm" />
                </div>
                <p className="text-gray-900 text-lg font-bold">{formatCurrency(walletData.currentBalance)}</p>
              </div>
            </motion.div>

            {/* Incentive Metrics */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 gap-3 mb-3"
            >
              {/* Total Incentive */}
              <motion.div 
                whileHover={{ scale: 1.02, y: -1 }}
                className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-emerald-300/50 hover:border-emerald-400/70 transition-all duration-300 shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-emerald-800 text-xs font-semibold">Total Incentive</span>
                  <FiTrendingUp className="text-emerald-600 text-xs" />
                </div>
                <p className="text-gray-900 text-sm font-bold">{formatCurrency(walletData.totalEarning)}</p>
                <p className="text-emerald-600 text-xs">All Time</p>
              </motion.div>
              
              {/* Pending Incentive */}
              <motion.div 
                whileHover={{ scale: 1.02, y: -1 }}
                className="bg-gradient-to-br from-yellow-50 to-amber-50 backdrop-blur-sm rounded-lg p-3 border border-yellow-300/50 hover:border-yellow-400/70 transition-all duration-300 shadow-sm relative group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-yellow-800 text-xs font-semibold">Pending Incentive</span>
                  <FiCalendar className="text-yellow-600 text-xs" />
                </div>
                <p className="text-gray-900 text-sm font-bold">{formatCurrency(walletData.monthlyEarning)}</p>
                <p className="text-yellow-600 text-xs">Awaiting Recovery</p>
                
                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                  You can withdraw this amount after full payment recovery of client
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                </div>
              </motion.div>
            </motion.div>

            {/* Monthly Summary */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-3 gap-2"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-cyan-300/50 text-center hover:border-cyan-400/70 transition-all duration-300 shadow-sm"
              >
                <p className="text-cyan-800 text-xs font-semibold mb-0.5">This Month</p>
                <p className="text-gray-900 text-xs font-bold">{formatCurrency(walletData.monthlyEarning)}</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-indigo-300/50 text-center hover:border-indigo-400/70 transition-all duration-300 shadow-sm"
              >
                <p className="text-indigo-800 text-xs font-semibold mb-0.5">Total Balance</p>
                <p className="text-gray-900 text-xs font-bold">{formatCurrency(walletData.currentBalance)}</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-violet-300/50 text-center hover:border-violet-400/70 transition-all duration-300 shadow-sm"
              >
                <p className="text-violet-800 text-xs font-semibold mb-0.5">All Time</p>
                <p className="text-gray-900 text-xs font-bold">{formatCurrency(walletData.totalEarning)}</p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Transaction Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Transaction History</h3>
              <p className="text-sm text-gray-600 mt-1">{walletData.transactions.length} recent transactions</p>
            </div>
              <div className="flex items-center space-x-2">
                <button 
                onClick={() => setIsWithdrawModalOpen(true)}
                className="bg-teal-500 px-4 py-2 rounded-lg text-white hover:bg-teal-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <FiArrowUp className="text-lg" />
                <span className="text-sm font-medium">Withdraw</span>
              </button>
            </div>
          </div>

          {/* Transaction List */}
          <div className="space-y-3">
            {walletData.transactions.map((transaction, index) => {
              const IconComponent = getTransactionIcon(transaction.category)
              
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
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-semibold text-sm ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
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
                 {/* Current Balance - Full Width Card */}
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.6, ease: "easeOut", delay: 0 }}
                   className="bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 rounded-2xl p-8 shadow-2xl"
                   style={{
                     boxShadow: '0 25px 50px -12px rgba(20, 184, 166, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                   }}
                 >
                   <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center space-x-4">
                       <div className="bg-white/20 p-4 rounded-xl">
                         <FiCreditCard className="text-white text-2xl" />
                       </div>
                       <div>
                         <h3 className="text-white text-2xl font-bold">Wallet Balance</h3>
                         <p className="text-white/80 text-sm">Current available amount</p>
                       </div>
                     </div>
                     <div className="flex items-center space-x-4">
                       <div className="text-right">
                         <p className="text-white text-4xl font-bold">{formatCurrency(walletData.currentBalance)}</p>
                         <div className="flex items-center mt-1">
                           <FiTrendingUp className="text-white/60 text-sm mr-1" />
                           <span className="text-white/80 text-xs">+12% from last month</span>
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
               <div className="grid grid-cols-2 gap-6 mb-6">
                 {/* Monthly Earnings */}
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                   className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                 >
                   <div className="flex items-center justify-between mb-4">
                     <FiCalendar className="text-teal-600 text-xl" />
                     <FiTrendingUp className="text-green-500 text-lg" />
                   </div>
                   <h4 className="text-gray-600 text-sm font-medium mb-2">Monthly Earning</h4>
                   <p className="text-gray-900 text-2xl font-bold">{formatCurrency(walletData.monthlyEarning)}</p>
                   <p className="text-green-600 text-xs font-semibold mt-1">+₹2,500 this week</p>
                 </motion.div>
                 
                 {/* Total Earnings */}
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                   className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                 >
                   <div className="flex items-center justify-between mb-4">
                     <FiDollarSign className="text-teal-600 text-xl" />
                     <FiActivity className="text-blue-500 text-lg" />
                   </div>
                   <h4 className="text-gray-600 text-sm font-medium mb-2">Total Earning</h4>
                   <p className="text-gray-900 text-2xl font-bold">{formatCurrency(walletData.totalEarning)}</p>
                   <p className="text-blue-600 text-xs font-semibold mt-1">All time earnings</p>
                 </motion.div>
               </div>
              
              {/* Transactions Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
                    <p className="text-sm text-gray-600 mt-1">Latest {walletData.transactions.length} transactions</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setIsWithdrawModalOpen(true)}
                      className="bg-teal-500 px-4 py-2 rounded-lg text-white hover:bg-teal-600 transition-colors duration-200 flex items-center space-x-2"
                      title="Withdraw funds"
                    >
                      <FiArrowUp className="text-lg" />
                      <span className="text-sm font-medium">Withdraw</span>
                    </button>
                  </div>
                </div>
                
                <div className="overflow-hidden">
                  <div className="space-y-3">
                    {walletData.transactions.slice(0, 8).map((transaction, index) => {
                      const IconComponent = getTransactionIcon(transaction.category)
                      
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
                                <p className="text-xs text-gray-500">{transaction.date}</p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className={`font-semibold text-sm ${getTransactionColor(transaction.type)}`}>
                                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
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
              
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
                className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-6 shadow-xl border border-slate-200/50"
              >
                <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
                
                 <div className="space-y-3">
                   <button 
                     onClick={() => setIsWithdrawModalOpen(true)}
                     className="w-full bg-teal-500 text-white font-semibold py-3 px-4 rounded-xl hover:bg-teal-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                   >
                     <FiArrowUp className="text-lg" />
                     <span>Withdraw Funds</span>
                   </button>
                   
                 </div>
              </motion.div>
              
              {/* Recent Activity Summary */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 1.0 }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">This Month</span>
                    <span className="font-semibold text-green-600">{formatCurrency(walletData.monthlyEarning)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Balance</span>
                    <span className="font-semibold text-teal-600">{formatCurrency(walletData.currentBalance)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">All Time Earnings</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(walletData.totalEarning)}</span>
                  </div>
                </div>
              </motion.div>
              
            </div>
          </div>
        </div>
        
      </main>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {isWithdrawModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsWithdrawModalOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 p-6 text-white rounded-t-2xl">
                <button
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="absolute top-6 left-6 p-2 hover:bg-teal-600/50 rounded-full transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <FiX className="text-xl" />
                </button>
                <h2 className="text-xl font-bold text-center">Withdraw Funds</h2>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                {/* Current Balance Display */}
                <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                  <div className="flex items-center justify-between">
                    <span className="text-teal-700 text-sm font-medium">Available Balance</span>
                    <FiCreditCard className="text-teal-600" />
                  </div>
                  <p className="text-teal-900 text-2xl font-bold mt-1">{formatCurrency(walletData.currentBalance)}</p>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Withdrawal Amount</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      ₹
                    </div>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                      max={walletData.currentBalance}
                      min="1"
                    />
                  </div>
                  {withdrawAmount && parseFloat(withdrawAmount) > walletData.currentBalance && (
                    <p className="text-red-500 text-xs">Amount exceeds available balance</p>
                  )}
                </div>


                {/* Submit Button */}
                <button
                  onClick={() => {
                    if (withdrawAmount && parseFloat(withdrawAmount) <= walletData.currentBalance) {
                      // Handle withdrawal logic here
                      console.log('Withdrawal:', { withdrawAmount })
                      alert(`Withdrawal request for ₹${parseInt(withdrawAmount).toLocaleString()} submitted successfully!`)
                      setIsWithdrawModalOpen(false)
                      setWithdrawAmount('')
                    }
                  }}
                  disabled={!withdrawAmount || parseFloat(withdrawAmount) > walletData.currentBalance}
                  className="w-full bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 text-white font-bold py-4 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-teal-400/20"
                >
                  Request Withdrawal
                </button>

                {/* Disclaimer */}
                <p className="text-xs text-gray-500 text-center">
                  Withdrawals are processed within 1-2 business days. Fees may apply.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SL_wallet
