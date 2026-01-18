import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  FiDollarSign,
  FiSearch,
  FiFilter,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiCalendar,
  FiUser,
  FiBriefcase,
  FiFileText,
  FiMessageCircle,
  FiX
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import CP_navbar from '../CP-components/CP_navbar'
import { cpPaymentRecoveryService } from '../CP-services'
import { useToast } from '../../../contexts/ToastContext'

const CP_payment_recovery = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [pendingPayments, setPendingPayments] = useState([])
  const [paymentHistory, setPaymentHistory] = useState([])
  const [activeTab, setActiveTab] = useState('pending')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [activeTab, statusFilter])

  const loadData = async () => {
    try {
      setLoading(true)
      if (activeTab === 'pending') {
        const response = await cpPaymentRecoveryService.getPendingPayments({
          search: searchTerm || undefined
        })
        if (response.success) {
          setPendingPayments(response.data || [])
        }
      } else {
        const response = await cpPaymentRecoveryService.getPaymentHistory({
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: searchTerm || undefined
        })
        if (response.success) {
          setPaymentHistory(response.data || [])
        }
      }
    } catch (error) {
      console.error('Failed to load payment data:', error)
      toast.error?.(error.message || 'Failed to load payment data', {
        title: 'Error',
        duration: 4000
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddNotes = async () => {
    if (!notes.trim()) {
      toast.error?.('Please enter notes', {
        title: 'Validation Error',
        duration: 4000
      })
      return
    }

    try {
      setSubmitting(true)
      const response = await cpPaymentRecoveryService.updatePaymentStatus(selectedPayment._id, notes)
      if (response.success) {
        toast.success?.('Notes added successfully!', {
          title: 'Success',
          duration: 3000
        })
        setShowNotesModal(false)
        setSelectedPayment(null)
        setNotes('')
        loadData()
      }
    } catch (error) {
      console.error('Failed to add notes:', error)
      toast.error?.(error.message || 'Failed to add notes', {
        title: 'Error',
        duration: 4000
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleWhatsApp = (client, amount) => {
    const phone = client.phoneNumber || client.phone
    if (!phone) {
      toast.error?.('Phone number not available', {
        title: 'Error',
        duration: 4000
      })
      return
    }

    const cleanPhone = phone.replace(/\s+/g, '').replace('+91', '')
    const message = `Hello ${client.name || 'there'},

Payment Reminder:
• Amount Due: ₹${amount.toLocaleString('en-IN')}
• Please make the payment at your earliest convenience.

If you have any questions, feel free to contact us.

Thank you!`

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/91${cleanPhone}?text=${encodedMessage}`, '_blank')
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

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      overdue: 'bg-red-100 text-red-700 border-red-200',
      failed: 'bg-red-100 text-red-700 border-red-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  const totalPending = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const overdueCount = pendingPayments.filter(p => isOverdue(p.dueDate)).length
  const overdueAmount = pendingPayments
    .filter(p => isOverdue(p.dueDate))
    .reduce((sum, p) => sum + (p.amount || 0), 0)

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

  const currentPayments = activeTab === 'pending' ? pendingPayments : paymentHistory

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <CP_navbar />
      
      <div className="pt-14 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 pt-6">
          {/* Statistics Cards */}
          {activeTab === 'pending' && (
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <FiClock className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-xs font-medium text-gray-600 mb-1">Total Pending</h3>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalPending)}</p>
                <p className="text-xs text-gray-500 mt-1">{pendingPayments.length} payments</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FiAlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                <h3 className="text-xs font-medium text-gray-600 mb-1">Overdue</h3>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(overdueAmount)}</p>
                <p className="text-xs text-red-600 mt-1">{overdueCount} payments</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiCheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xs font-medium text-gray-600 mb-1">Total Paid</h3>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(paymentHistory
                    .filter(p => p.status === 'completed')
                    .reduce((sum, p) => sum + (p.amount || 0), 0))}
                </p>
              </motion.div>
            </div>
          )}

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-1"
          >
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'pending'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Pending Payments
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'history'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Payment History
              </button>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && loadData()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {activeTab === 'history' && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="failed">Failed</option>
                </select>
              )}
            </div>
          </motion.div>

          {/* Payments List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {currentPayments.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {currentPayments.map((payment, index) => {
                  const client = payment.project?.client
                  const isOverduePayment = isOverdue(payment.dueDate)
                  
                  return (
                    <motion.div
                      key={payment._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {client?.name || 'Client'}
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(payment.status)}`}>
                              {payment.status}
                            </span>
                            {isOverduePayment && (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                                Overdue
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <FiFileText className="h-4 w-4" />
                              <span>{payment.project?.name || 'Project'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FiDollarSign className="h-4 w-4" />
                              <span className="font-medium text-gray-900">{formatCurrency(payment.amount)}</span>
                            </div>
                            {payment.dueDate && (
                              <div className="flex items-center space-x-1">
                                <FiCalendar className="h-4 w-4" />
                                <span>Due: {formatDate(payment.dueDate)}</span>
                              </div>
                            )}
                            {client?.phoneNumber && (
                              <div className="flex items-center space-x-1">
                                <FiUser className="h-4 w-4" />
                                <span>{client.phoneNumber}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {activeTab === 'pending' && (
                            <>
                              {client?.phoneNumber && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleWhatsApp(client, payment.amount)}
                                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                  title="Send WhatsApp"
                                >
                                  <FaWhatsapp className="h-5 w-5" />
                                </motion.button>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setSelectedPayment(payment)
                                  setNotes(payment.notes || '')
                                  setShowNotesModal(true)
                                }}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                title="Add Notes"
                              >
                                <FiMessageCircle className="h-5 w-5" />
                              </motion.button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              if (client?._id) {
                                navigate(`/cp-client-profile/${client._id}`)
                              }
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <FiArrowRight className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="p-12 text-center">
                <FiDollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No payments found</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal && selectedPayment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowNotesModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Add Notes</h2>
              <button
                onClick={() => setShowNotesModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Payment: {formatCurrency(selectedPayment.amount)} for {selectedPayment.project?.name}
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add notes about payment recovery..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowNotesModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNotes}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default CP_payment_recovery
