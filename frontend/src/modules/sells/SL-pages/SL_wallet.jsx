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
  FiRefreshCw,
  FiFilter,
  FiX
} from 'react-icons/fi'
import SL_navbar from '../SL-components/SL_navbar'

const SL_wallet = () => {
  const [showFilters, setShowFilters] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawMethod, setWithdrawMethod] = useState('')
  
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
            className="bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 rounded-3xl p-6 shadow-2xl"
            style={{
              boxShadow: '0 25px 50px -12px rgba(20, 184, 166, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-3 rounded-xl">
                  <FiCreditCard className="text-white text-xl" />
                </div>
                <h2 className="text-white text-xl font-bold">Wallet Overview</h2>
              </div>
              <button className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors duration-200">
                <FiActivity className="text-white text-lg" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm font-medium">Current Balance</span>
                  <FiDollarSign className="text-white/60 text-lg" />
                </div>
                <p className="text-white text-2xl font-bold mt-1">{formatCurrency(walletData.currentBalance)}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80 text-xs font-medium">Monthly</span>
                    <FiTrendingUp className="text-white/60 text-sm" />
                  </div>
                  <p className="text-white text-lg font-bold">{formatCurrency(walletData.monthlyEarning)}</p>
                  <p className="text-white/60 text-xs">This Month</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80 text-xs font-medium">Total</span>
                    <FiCalendar className="text-white/60 text-sm" />
                  </div>
                  <p className="text-white text-lg font-bold">{formatCurrency(walletData.totalEarning)}</p>
                  <p className="text-white/60 text-xs">All Time</p>
                </div>
              </div>
            </div>
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
                className="bg-teal-500 p-2 rounded-lg text-white hover:bg-red-600 transition-colors duration-200"
              >
                <FiArrowUp className="text-lg" />
              </button>
                <button 
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                <FiFilter className="text-gray-600 text-lg" />
              </button>
              <button className="bg-teal-500 p-2 rounded-lg text-white hover:bg-teal-600 transition-colors duration-200">
                <FiRefreshCw className="text-lg" />
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
                  className={`${getTransactionBg(transaction.type)} rounded-2xl p-4 border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white p-2 rounded-xl shadow-sm">
                        <IconComponent className={`text-lg ${getTransactionColor(transaction.type)}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{transaction.description}</h4>
                        <p className="text-xs text-gray-600">
                          {transaction.type === 'withdrawal' 
                            ? `${transaction.method} • ${transaction.status}` 
                            : transaction.category
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-600">{transaction.date}</p>
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
                      className="bg-teal-500 p-2 rounded-lg text-white hover:bg-teal-600 transition-colors duration-200"
                      title="Withdraw funds"
                    >
                      <FiArrowUp className="text-lg" />
                    </button>
                    <button 
                         onClick={() => setShowFilters(!showFilters)}
                         className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      <FiFilter className="text-gray-600 text-lg" />
                    </button>
                      <button className="bg-teal-500 p-2 rounded-lg text-white hover:bg-teal-600 transition-colors duration-200">
                      <FiRefreshCw className="text-lg" />
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
                          className={`${getTransactionBg(transaction.type)} rounded-xl p-4 border hover:shadow-md transition-all duration-300`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="bg-white p-2 rounded-lg shadow-sm">
                                <IconComponent className={`text-lg ${getTransactionColor(transaction.type)}`} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{transaction.description}</h4>
                                <p className="text-sm text-gray-600">
                                  {transaction.type === 'withdrawal' 
                                    ? `${transaction.method} • ${transaction.status}` 
                                    : transaction.category
                                  }
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                              </p>
                              <p className="text-sm text-gray-600">{transaction.date}</p>
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
                   
                   <button className="w-full bg-white text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
                     <FiFilter className="text-lg" />
                     <span>Filter Transactions</span>
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

                {/* Withdrawal Method */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Withdrawal Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'bank', label: 'Bank Transfer', desc: 'Standard banking' },
                      { value: 'upi', label: 'UPI Payment', desc: 'Instant transfer' }
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                          withdrawMethod === method.value
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 bg-white hover:border-teal-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="withdrawMethod"
                          value={method.value}
                          checked={withdrawMethod === method.value}
                          onChange={(e) => setWithdrawMethod(e.target.value)}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <p className="font-medium text-gray-900 text-sm">{method.label}</p>
                          <p className="text-xs text-gray-600 mt-1">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={() => {
                    if (withdrawAmount && withdrawMethod && parseFloat(withdrawAmount) <= walletData.currentBalance) {
                      // Handle withdrawal logic here
                      console.log('Withdrawal:', { withdrawAmount, withdrawMethod })
                      alert(`Withdrawal request for ₹${parseInt(withdrawAmount).toLocaleString()} via ${withdrawMethod} submitted successfully!`)
                      setIsWithdrawModalOpen(false)
                      setWithdrawAmount('')
                      setWithdrawMethod('')
                    }
                  }}
                  disabled={!withdrawAmount || !withdrawMethod || parseFloat(withdrawAmount) > walletData.currentBalance}
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
