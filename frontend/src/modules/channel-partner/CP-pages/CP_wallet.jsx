import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { 
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiCreditCard,
  FiClock,
  FiCheckCircle,
  FiX,
  FiPlus,
  FiArrowRight,
  FiDownload
} from 'react-icons/fi'
import CP_navbar from '../CP-components/CP_navbar'
import { cpWalletService } from '../CP-services'
import { useToast } from '../../../contexts/ToastContext'
import Loading from '../../../components/ui/loading'

const CP_wallet = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [walletSummary, setWalletSummary] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [withdrawals, setWithdrawals] = useState([])
  const [earnings, setEarnings] = useState(null)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    bankDetails: {
      accountHolderName: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      branch: ''
    }
  })

  useEffect(() => {
    loadWalletData()
  }, [])

  const loadWalletData = async () => {
    try {
      setLoading(true)
      const [summaryRes, transactionsRes, withdrawalsRes, earningsRes] = await Promise.all([
        cpWalletService.getWalletSummary(),
        cpWalletService.getTransactions({ limit: 20 }),
        cpWalletService.getWithdrawalHistory({ limit: 10 }),
        cpWalletService.getEarningsBreakdown()
      ])

      if (summaryRes.success) {
        setWalletSummary(summaryRes.data)
        setTransactions(transactionsRes.data || [])
        setWithdrawals(withdrawalsRes.data || [])
        setEarnings(earningsRes.data)
      }
    } catch (error) {
      console.error('Failed to load wallet data:', error)
      toast.error?.(error.message || 'Failed to load wallet data', {
        title: 'Error',
        duration: 4000
      })
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async (e) => {
    e.preventDefault()
    
    if (!withdrawForm.amount || parseFloat(withdrawForm.amount) <= 0) {
      toast.error?.('Please enter a valid withdrawal amount', {
        title: 'Validation Error',
        duration: 4000
      })
      return
    }

    if (!withdrawForm.bankDetails.accountHolderName || !withdrawForm.bankDetails.accountNumber || 
        !withdrawForm.bankDetails.ifscCode || !withdrawForm.bankDetails.bankName) {
      toast.error?.('Please fill all bank details', {
        title: 'Validation Error',
        duration: 4000
      })
      return
    }

    try {
      setSubmitting(true)
      const response = await cpWalletService.createWithdrawalRequest({
        amount: parseFloat(withdrawForm.amount),
        bankDetails: withdrawForm.bankDetails
      })

      if (response.success) {
        toast.success?.('Withdrawal request created successfully!', {
          title: 'Success',
          duration: 3000
        })
        setShowWithdrawModal(false)
        setWithdrawForm({
          amount: '',
          bankDetails: {
            accountHolderName: '',
            accountNumber: '',
            ifscCode: '',
            bankName: '',
            branch: ''
          }
        })
        loadWalletData()
      }
    } catch (error) {
      console.error('Failed to create withdrawal:', error)
      toast.error?.(error.message || 'Failed to create withdrawal request', {
        title: 'Error',
        duration: 4000
      })
    } finally {
      setSubmitting(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTransactionTypeColor = (type) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600'
  }

  const getTransactionTypeBg = (type) => {
    return type === 'credit' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      approved: 'bg-blue-100 text-blue-700 border-blue-200',
      processed: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      cancelled: 'bg-gray-100 text-gray-700 border-gray-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  // Prepare earnings chart data
  const earningsChartData = earnings?.byMonth?.map(item => ({
    month: `${item._id.month}/${item._id.year}`,
    earnings: item.total
  })) || []

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
        <CP_navbar />
        <div className="pt-14 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <CP_navbar />
      
      <div className="pt-14 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 pt-6">
          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-8 text-white"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-blue-100 text-sm mb-2">Available Balance</p>
                <h2 className="text-4xl font-bold">
                  {formatCurrency(walletSummary?.wallet?.balance || 0)}
                </h2>
              </div>
              <div className="p-4 bg-white/20 rounded-full">
                <FiCreditCard className="h-8 w-8" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-blue-100 text-sm">Total Earned</p>
                <p className="text-xl font-semibold">
                  {formatCurrency(walletSummary?.wallet?.totalEarned || 0)}
                </p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Total Withdrawn</p>
                <p className="text-xl font-semibold">
                  {formatCurrency(walletSummary?.wallet?.totalWithdrawn || 0)}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowWithdrawModal(true)}
              className="mt-6 w-full px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
            >
              <FiDownload className="h-5 w-5" />
              <span>Request Withdrawal</span>
            </motion.button>
          </motion.div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiTrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <h3 className="text-xs font-medium text-gray-600 mb-1">Total Earned</h3>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(walletSummary?.wallet?.totalEarned || 0)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiDownload className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xs font-medium text-gray-600 mb-1">Total Withdrawn</h3>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(walletSummary?.wallet?.totalWithdrawn || 0)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FiClock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-xs font-medium text-gray-600 mb-1">Pending Withdrawals</h3>
              <p className="text-xl font-bold text-gray-900">
                {walletSummary?.pendingWithdrawals || 0}
              </p>
            </motion.div>
          </div>

          {/* Earnings Chart */}
          {earningsChartData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Earnings Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsChartData}>
                    <defs>
                      <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#6B7280', fontSize: 11 }}
                    />
                    <YAxis 
                      tick={{ fill: '#6B7280', fontSize: 11 }}
                      tickFormatter={(value) => `₹${value/1000}k`}
                    />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="earnings" 
                      stroke="#3B82F6" 
                      fillOpacity={1} 
                      fill="url(#earningsGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Earnings Breakdown */}
          {earnings && earnings.byType && Object.keys(earnings.byType).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Earnings Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(earnings.byType).map(([type, data]) => (
                  <div key={type} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-600 mb-1 capitalize">
                      {type.replace('_', ' ')}
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(data.total || 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{data.count || 0} transactions</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
                <button
                  onClick={() => {
                    // Could navigate to full transactions page
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </button>
              </div>
              {transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction._id} className={`p-4 rounded-lg border ${getTransactionTypeBg(transaction.type)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 capitalize">
                            {transaction.transactionType?.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-gray-600">{transaction.description || 'Transaction'}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(transaction.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${getTransactionTypeColor(transaction.type)}`}>
                            {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-xs text-gray-500">Balance: {formatCurrency(transaction.balanceAfter)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiCreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No transactions yet</p>
                </div>
              )}
            </motion.div>

            {/* Withdrawal Requests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Withdrawal Requests</h3>
                <button
                  onClick={() => {
                    // Could navigate to full withdrawals page
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </button>
              </div>
              {withdrawals.length > 0 ? (
                <div className="space-y-3">
                  {withdrawals.slice(0, 5).map((withdrawal) => (
                    <div key={withdrawal._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(withdrawal.amount)}
                        </p>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(withdrawal.status)}`}>
                          {withdrawal.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {withdrawal.bankDetails?.bankName} • {withdrawal.bankDetails?.accountNumber.slice(-4)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(withdrawal.createdAt)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiDownload className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No withdrawal requests</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowWithdrawModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Request Withdrawal</h2>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                  placeholder="Enter amount"
                  min="0"
                  max={walletSummary?.wallet?.balance || 0}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: {formatCurrency(walletSummary?.wallet?.balance || 0)}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Bank Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Holder Name *
                    </label>
                    <input
                      type="text"
                      value={withdrawForm.bankDetails.accountHolderName}
                      onChange={(e) => setWithdrawForm({
                        ...withdrawForm,
                        bankDetails: { ...withdrawForm.bankDetails, accountHolderName: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      value={withdrawForm.bankDetails.accountNumber}
                      onChange={(e) => setWithdrawForm({
                        ...withdrawForm,
                        bankDetails: { ...withdrawForm.bankDetails, accountNumber: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IFSC Code *
                    </label>
                    <input
                      type="text"
                      value={withdrawForm.bankDetails.ifscCode}
                      onChange={(e) => setWithdrawForm({
                        ...withdrawForm,
                        bankDetails: { ...withdrawForm.bankDetails, ifscCode: e.target.value.toUpperCase() }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      value={withdrawForm.bankDetails.bankName}
                      onChange={(e) => setWithdrawForm({
                        ...withdrawForm,
                        bankDetails: { ...withdrawForm.bankDetails, bankName: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branch
                    </label>
                    <input
                      type="text"
                      value={withdrawForm.bankDetails.branch}
                      onChange={(e) => setWithdrawForm({
                        ...withdrawForm,
                        bankDetails: { ...withdrawForm.bankDetails, branch: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default CP_wallet
