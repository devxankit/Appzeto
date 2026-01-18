import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  FiArrowLeft,
  FiUser,
  FiPhone,
  FiMail,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiCreditCard
} from 'react-icons/fi'
import CP_navbar from '../CP-components/CP_navbar'
import { cpLeadService } from '../CP-services'
import { useToast } from '../../../contexts/ToastContext'
import Loading from '../../../components/ui/loading'

const CP_client_profile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [clientData, setClientData] = useState(null)
  const [projects, setProjects] = useState([])
  const [payments, setPayments] = useState([])

  useEffect(() => {
    if (id) {
      loadClientData()
    }
  }, [id])

  const loadClientData = async () => {
    try {
      setLoading(true)
      const response = await cpLeadService.getClientDetails(id)
      if (response.success && response.data) {
        setClientData(response.data.client)
        setProjects(response.data.projects || [])
        setPayments(response.data.payments || [])
      }
    } catch (error) {
      console.error('Failed to load client:', error)
      toast.error?.(error.message || 'Failed to load client profile', {
        title: 'Error',
        duration: 4000
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getPaymentStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      overdue: 'bg-red-100 text-red-700 border-red-200',
      failed: 'bg-red-100 text-red-700 border-red-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

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

  if (!clientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
        <CP_navbar />
        <div className="pt-14 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <p className="text-gray-500">Client not found</p>
              <button
                onClick={() => navigate('/cp-converted')}
                className="mt-4 text-blue-600 hover:text-blue-700"
              >
                Back to Converted
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const totalPaid = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (p.amount || 0), 0)
  const totalPending = payments
    .filter(p => p.status === 'pending' || p.status === 'overdue')
    .reduce((sum, p) => sum + (p.amount || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <CP_navbar />
      
      <div className="pt-14 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 pt-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700 border border-purple-200">
                Client
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/cp-payment-recovery')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Payment Recovery
            </motion.button>
          </motion.div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiCheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <h3 className="text-xs font-medium text-gray-600 mb-1">Total Paid</h3>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalPaid)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FiClock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-xs font-medium text-gray-600 mb-1">Pending</h3>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalPending)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiFileText className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xs font-medium text-gray-600 mb-1">Projects</h3>
              <p className="text-xl font-bold text-gray-900">{projects.length}</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Client Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Client Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900 font-medium">{clientData.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-900 font-medium">{clientData.phoneNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900 font-medium">{clientData.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Company</label>
                    <p className="text-gray-900 font-medium">{clientData.companyName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Created</label>
                    <p className="text-gray-900 font-medium">{formatDate(clientData.createdAt)}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Projects</h2>
              {projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div key={project._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-2">{project.name || 'Unnamed Project'}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          project.status === 'completed' ? 'bg-green-100 text-green-700' :
                          project.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {project.status || 'N/A'}
                        </span>
                        {project.progress !== undefined && (
                          <span>{project.progress}% complete</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiFileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No projects found</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Payment History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
              <button
                onClick={() => navigate('/cp-payment-recovery')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View Recovery
              </button>
            </div>
            {payments.length > 0 ? (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {payment.project?.name || 'Project Payment'}
                          </h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getPaymentStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <FiDollarSign className="h-4 w-4" />
                            <span className="font-medium text-gray-900">{formatCurrency(payment.amount || 0)}</span>
                          </div>
                          {payment.dueDate && (
                            <div className="flex items-center space-x-1">
                              <FiCalendar className="h-4 w-4" />
                              <span>Due: {formatDate(payment.dueDate)}</span>
                            </div>
                          )}
                          {payment.paidAt && (
                            <div className="flex items-center space-x-1">
                              <FiCheckCircle className="h-4 w-4" />
                              <span>Paid: {formatDate(payment.paidAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FiCreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No payment history</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CP_client_profile
