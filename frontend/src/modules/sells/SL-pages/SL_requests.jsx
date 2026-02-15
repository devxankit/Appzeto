import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiArrowLeft, 
  FiClock, 
  FiCheck, 
  FiX, 
  FiDollarSign,
  FiTrendingUp,
  FiPause,
  FiCreditCard,
  FiAlertCircle,
  FiCalendar,
  FiUser,
  FiFilter,
  FiSearch,
  FiLoader,
  FiInbox,
  FiSend,
  FiPlus,
  FiChevronDown
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import SL_navbar from '../SL-components/SL_navbar'
import salesRequestService from '../SL-services/salesRequestService'
import { salesMeetingsService } from '../SL-services'
import { useToast } from '../../../contexts/ToastContext'

const SL_requests = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedDirection, setSelectedDirection] = useState('all') // 'all', 'incoming', 'outgoing'
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [admins, setAdmins] = useState([])
  const [clients, setClients] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAdminDropdown, setShowAdminDropdown] = useState(false)
  const [showClientDropdown, setShowClientDropdown] = useState(false)
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })

  const [newRequest, setNewRequest] = useState({
    type: 'approval',
    title: '',
    description: '',
    priority: 'normal',
    recipientId: '',
    recipientName: '',
    clientId: '',
    clientName: '',
    category: ''
  })

  // Fetch requests from backend
  useEffect(() => {
    fetchRequests()
  }, [selectedFilter, selectedDirection, searchTerm])

  // Fetch admins and clients when create dialog opens
  useEffect(() => {
    if (showCreateDialog) {
      fetchAdmins()
      fetchClients()
    }
  }, [showCreateDialog])

  const fetchAdmins = async () => {
    try {
      const response = await salesRequestService.getRecipients('admin')
      setAdmins(response?.data || [])
    } catch (error) {
      console.error('Error fetching admins:', error)
      toast.error('Failed to fetch admin list')
    }
  }

  const fetchClients = async () => {
    try {
      const clientsData = await salesMeetingsService.getMyConvertedClients()
      setClients(clientsData || [])
    } catch (error) {
      console.error('Error fetching clients:', error)
      toast.error('Failed to fetch clients list')
    }
  }

  const fetchRequests = async () => {
    setIsLoading(true)
    try {
      const params = {
        direction: selectedDirection,
        module: 'sales',
        status: selectedFilter !== 'all' ? selectedFilter : undefined,
        search: searchTerm || undefined,
        limit: 50
      }
      
      const response = await salesRequestService.getRequests(params)
      const requestsData = response?.data || []
      
      setRequests(requestsData)
      
      // Calculate stats
      const total = requestsData.length
      const pending = requestsData.filter(r => r.status === 'pending').length
      const approved = requestsData.filter(r => r.status === 'approved').length
      const rejected = requestsData.filter(r => r.status === 'rejected').length
      
      setStats({ total, pending, approved, rejected })
    } catch (error) {
      console.error('Error fetching requests:', error)
      toast.error(error.message || 'Failed to fetch requests')
      setRequests([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateRequest = async () => {
    if (!newRequest.title || !newRequest.description || !newRequest.recipientId) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const requestData = {
        type: newRequest.type,
        title: newRequest.title,
        description: newRequest.description,
        priority: newRequest.priority,
        recipient: newRequest.recipientId,
        recipientModel: 'Admin',
        client: newRequest.clientId || undefined,
        category: newRequest.category || undefined
      }

      await salesRequestService.createRequest(requestData)
      toast.success('Request created successfully')
      
      // Reset form
      setNewRequest({
        type: 'approval',
        title: '',
        description: '',
        priority: 'normal',
        recipientId: '',
        recipientName: '',
        clientId: '',
        clientName: '',
        category: ''
      })
      
      setShowCreateDialog(false)
      fetchRequests() // Refresh requests list
    } catch (error) {
      console.error('Error creating request:', error)
      toast.error(error.message || 'Failed to create request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const requestTypes = [
    { id: 'all', label: 'All Requests', icon: FiAlertCircle },
    { id: 'pending', label: 'Pending', icon: FiClock },
    { id: 'approved', label: 'Approved', icon: FiCheck },
    { id: 'rejected', label: 'Rejected', icon: FiX }
  ]

  const directionTypes = [
    { id: 'all', label: 'All', icon: FiAlertCircle },
    { id: 'incoming', label: 'Incoming', icon: FiInbox },
    { id: 'outgoing', label: 'Outgoing', icon: FiSend }
  ]

  const requestTypeOptions = [
    { value: 'approval', label: 'Approval Request' },
    { value: 'feedback', label: 'Feedback Request' },
    { value: 'confirmation', label: 'Confirmation Request' },
    { value: 'hold-work', label: 'Hold Work' },
    { value: 'accelerate-work', label: 'Accelerate Work' },
    { value: 'increase-cost', label: 'Increase Cost' },
    { value: 'timeline-extension', label: 'Timeline Extension' },
    { value: 'budget-approval', label: 'Budget Approval' },
    { value: 'access-request', label: 'Access Request' }
  ]

  const getRequestTypeIcon = (type) => {
    switch (type) {
      case 'payment-recovery':
        return FiCreditCard
      case 'hold-work':
        return FiPause
      case 'accelerate-work':
        return FiTrendingUp
      case 'increase-cost':
        return FiDollarSign
      case 'approval':
        return FiCheck
      case 'feedback':
        return FiUser
      case 'confirmation':
        return FiAlertCircle
      case 'timeline-extension':
        return FiClock
      case 'budget-approval':
        return FiDollarSign
      case 'access-request':
        return FiUser
      default:
        return FiAlertCircle
    }
  }

  const getRequestTypeColor = (type) => {
    switch (type) {
      case 'payment-recovery':
        return 'text-emerald-600 bg-emerald-50'
      case 'hold-work':
        return 'text-orange-600 bg-orange-50'
      case 'accelerate-work':
        return 'text-purple-600 bg-purple-50'
      case 'increase-cost':
        return 'text-teal-600 bg-teal-50'
      case 'approval':
        return 'text-blue-600 bg-blue-50'
      case 'feedback':
        return 'text-indigo-600 bg-indigo-50'
      case 'confirmation':
        return 'text-gray-600 bg-gray-50'
      case 'timeline-extension':
        return 'text-yellow-600 bg-yellow-50'
      case 'budget-approval':
        return 'text-green-600 bg-green-50'
      case 'access-request':
        return 'text-pink-600 bg-pink-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50'
      case 'approved':
        return 'text-green-600 bg-green-50'
      case 'rejected':
        return 'text-red-600 bg-red-50'
      case 'responded':
        return 'text-blue-600 bg-blue-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  const getClientName = (request) => {
    if (request.client) {
      if (typeof request.client === 'object') {
        return request.client.name || 'Unknown Client'
      }
    }
    return 'N/A'
  }

  const getProjectName = (request) => {
    if (request.project) {
      if (typeof request.project === 'object') {
        return request.project.name || 'Unknown Project'
      }
    }
    return 'N/A'
  }

  const getRecipientName = (request) => {
    if (request.recipient) {
      if (typeof request.recipient === 'object') {
        return request.recipient.name || 'Unknown'
      }
    }
    return 'Unknown'
  }

  const getRequesterName = (request) => {
    if (request.requestedBy) {
      if (typeof request.requestedBy === 'object') {
        return request.requestedBy.name || 'Unknown'
      }
    }
    return 'Unknown'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SL_navbar />
      
      <main className="max-w-md mx-auto px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Requests</h1>
          </div>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            <FiPlus className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total</p>
                <p className="text-lg font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <FiAlertCircle className="text-teal-600 text-sm" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Pending</p>
                <p className="text-lg font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FiClock className="text-yellow-600 text-sm" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search Bar with Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mb-4"
        >
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search requests..."
            className="w-full pl-8 pr-12 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
              showFilters 
                ? 'bg-teal-500 text-white shadow-md' 
                : 'text-gray-500 hover:text-teal-600 hover:bg-teal-50'
            }`}
          >
            <FiFilter className="text-base" />
          </button>
        </motion.div>

        {/* Filters */}
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 space-y-3"
          >
            {/* Direction Filter */}
            <div>
              <p className="text-xs font-medium text-gray-700 mb-2">Direction</p>
              <div className="flex flex-wrap gap-2">
                {directionTypes.map((filter) => {
                  const IconComponent = filter.icon
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedDirection(filter.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                        selectedDirection === filter.id
                          ? 'bg-teal-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <IconComponent className="text-sm" />
                      <span>{filter.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <p className="text-xs font-medium text-gray-700 mb-2">Status</p>
              <div className="flex flex-wrap gap-2">
                {requestTypes.map((filter) => {
                  const IconComponent = filter.icon
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                        selectedFilter === filter.id
                          ? 'bg-teal-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <IconComponent className="text-sm" />
                      <span>{filter.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Requests List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-3"
        >
          {isLoading ? (
            <div className="text-center py-12">
              <FiLoader className="text-4xl text-teal-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500">Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <FiAlertCircle className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No requests found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            requests.map((request) => {
              const TypeIcon = getRequestTypeIcon(request.type)
              const clientName = getClientName(request)
              const projectName = getProjectName(request)
              const isOutgoing = selectedDirection === 'outgoing' || (selectedDirection === 'all' && request.requestedBy)
              
              return (
                <motion.div
                  key={request._id || request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getRequestTypeColor(request.type)}`}>
                        <TypeIcon className="text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">{request.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          {clientName !== 'N/A' && (
                            <span>{clientName}</span>
                          )}
                          {projectName !== 'N/A' && (
                            <>
                              {clientName !== 'N/A' && <span>•</span>}
                              <span>{projectName}</span>
                            </>
                          )}
                        </div>
                        {isOutgoing && (
                          <p className="text-xs text-gray-400 mt-1">
                            To: {getRecipientName(request)}
                          </p>
                        )}
                        {!isOutgoing && (
                          <p className="text-xs text-gray-400 mt-1">
                            From: {getRequesterName(request)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0 ml-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium mb-1 ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      {request.priority && request.priority !== 'normal' && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          request.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          request.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {request.priority}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{request.description}</p>

                  {/* Response message if available */}
                  {request.response && request.response.message && (
                    <div className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        {request.response.type === 'approve' ? 'Approved' : 
                         request.response.type === 'reject' ? 'Rejected' : 
                         'Response'}:
                      </p>
                      <p className="text-xs text-gray-600">{request.response.message}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <FiCalendar className="text-sm" />
                        <span className="text-xs">{formatDate(request.createdAt)}</span>
                      </div>
                      {request.createdAt && (
                        <div className="flex items-center space-x-1 text-gray-500">
                          <FiClock className="text-sm" />
                          <span className="text-xs">{formatTime(request.createdAt)}</span>
                        </div>
                      )}
                    </div>
                    {request.amount && request.amount > 0 && (
                      <span className="text-sm font-semibold text-teal-600">
                        ₹{request.amount.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })
          )}
        </motion.div>
      </main>

      {/* Create Request Dialog */}
      <AnimatePresence>
        {showCreateDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create New Request</h2>
                <button
                  onClick={() => setShowCreateDialog(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Request Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Type *
                  </label>
                  <select
                    value={newRequest.type}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    {requestTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Recipient (Admin) */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Send To (Admin) *
                  </label>
                  <div
                    className="relative w-full cursor-pointer"
                    onClick={() => {
                      setShowAdminDropdown(!showAdminDropdown)
                      setShowClientDropdown(false)
                    }}
                  >
                    <input
                      type="text"
                      readOnly
                      value={newRequest.recipientName || 'Select Admin'}
                      placeholder="Select Admin"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                    <FiChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-transform duration-200 ${showAdminDropdown ? 'rotate-180' : ''}`} />
                  </div>
                  {showAdminDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto"
                    >
                      {admins.length > 0 ? (
                        admins.map((admin) => (
                          <div
                            key={admin.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 text-sm"
                            onClick={() => {
                              setNewRequest(prev => ({ ...prev, recipientId: admin.id, recipientName: admin.name }))
                              setShowAdminDropdown(false)
                            }}
                          >
                            {admin.name} {admin.email && `(${admin.email})`}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500 text-sm">No admins found</div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Client (Optional) */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client (Optional)
                  </label>
                  <div
                    className="relative w-full cursor-pointer"
                    onClick={() => {
                      setShowClientDropdown(!showClientDropdown)
                      setShowAdminDropdown(false)
                    }}
                  >
                    <input
                      type="text"
                      readOnly
                      value={newRequest.clientName || 'Select Client'}
                      placeholder="Select Client"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                    <FiChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-transform duration-200 ${showClientDropdown ? 'rotate-180' : ''}`} />
                  </div>
                  {showClientDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto"
                    >
                      <div
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 text-sm border-b border-gray-200"
                        onClick={() => {
                          setNewRequest(prev => ({ ...prev, clientId: '', clientName: '' }))
                          setShowClientDropdown(false)
                        }}
                      >
                        None
                      </div>
                      {clients.length > 0 ? (
                        clients.map((client) => (
                          <div
                            key={client._id || client.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 text-sm"
                            onClick={() => {
                              const clientId = client._id || client.id
                              const clientName = client.name || client.leadProfile?.name || 'Unknown Client'
                              setNewRequest(prev => ({ 
                                ...prev, 
                                clientId, 
                                clientName
                              }))
                              setShowClientDropdown(false)
                            }}
                          >
                            {client.name || client.leadProfile?.name || 'Unknown Client'}
                            {client.email && ` (${client.email})`}
                            {client.phoneNumber && ` - ${client.phoneNumber}`}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500 text-sm">No clients found</div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter request title"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newRequest.description}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter request description"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newRequest.priority}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                {/* Category (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category (Optional)
                  </label>
                  <input
                    type="text"
                    value={newRequest.category}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Enter category"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateDialog(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRequest}
                  disabled={isSubmitting || !newRequest.title || !newRequest.description || !newRequest.recipientId}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isSubmitting || !newRequest.title || !newRequest.description || !newRequest.recipientId
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-teal-500 text-white hover:bg-teal-600'
                  }`}
                >
                  {isSubmitting ? 'Creating...' : 'Create Request'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SL_requests
