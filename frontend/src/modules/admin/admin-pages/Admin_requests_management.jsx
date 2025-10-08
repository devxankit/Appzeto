import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Admin_navbar from '../admin-components/Admin_navbar'
import Admin_sidebar from '../admin-components/Admin_sidebar'
import Loading from '../../../components/ui/loading'
import { 
  FiFileText,
  FiCheckSquare,
  FiX,
  FiMessageSquare,
  FiClock,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiUsers,
  FiUser,
  FiShield,
  FiDollarSign,
  FiCreditCard,
  FiPause,
  FiTrendingUp,
  FiAlertCircle,
  FiCalendar,
  FiEye,
  FiEdit,
  FiTrash2,
  FiSend,
  FiArrowDown,
  FiArrowUp,
  FiHome,
  FiCode,
  FiShoppingCart
} from 'react-icons/fi'

const Admin_requests_management = () => {
  // State management
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [responseText, setResponseText] = useState('')
  const [responseType, setResponseType] = useState('approve')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data - Request statistics
  const statistics = {
    totalRequests: 156,
    pendingRequests: 42,
    approvedRequests: 89,
    rejectedRequests: 25,
    urgentRequests: 18,
    clientRequests: 45,
    employeeRequests: 38,
    pmRequests: 35,
    salesRequests: 38
  }

  // Mock data - All requests from different modules
  const allRequests = [
    // Client Requests
    {
      id: 1,
      module: 'client',
      type: 'approval',
      title: 'Design Approval Required',
      description: 'Please review and approve the new homepage design mockups for the e-commerce website.',
      status: 'pending',
      priority: 'high',
      submittedDate: '2024-01-20',
      submittedBy: 'John Smith (Client)',
      submittedByType: 'client',
      projectName: 'E-commerce Website',
      category: 'Design Review',
      response: null
    },
    {
      id: 2,
      module: 'client',
      type: 'feedback',
      title: 'Content Review Needed',
      description: 'Please provide feedback on the product descriptions and marketing copy.',
      status: 'responded',
      priority: 'normal',
      submittedDate: '2024-01-18',
      submittedBy: 'Sarah Johnson (Client)',
      submittedByType: 'client',
      projectName: 'E-commerce Website',
      category: 'Content Review',
      response: {
        type: 'approve',
        message: 'Content looks good. Please proceed with the implementation.',
        respondedDate: '2024-01-19',
        respondedBy: 'Admin'
      }
    },
    // Employee Requests
    {
      id: 3,
      module: 'employee',
      type: 'approval',
      title: 'Request for Additional Development Time',
      description: 'The current timeline for the payment integration is too tight. I need 3 additional days to ensure proper testing and security implementation.',
      status: 'pending',
      priority: 'high',
      submittedDate: '2024-01-20',
      submittedBy: 'John Doe (Employee)',
      submittedByType: 'employee',
      projectName: 'E-commerce Website',
      category: 'Timeline Extension',
      response: null
    },
    {
      id: 4,
      module: 'employee',
      type: 'approval',
      title: 'Need Access to Production Database',
      description: 'I need temporary access to the production database to debug the user authentication issue that\'s affecting multiple clients.',
      status: 'responded',
      priority: 'urgent',
      submittedDate: '2024-01-18',
      submittedBy: 'Mike Johnson (Employee)',
      submittedByType: 'employee',
      projectName: 'Mobile App Development',
      category: 'Access Request',
      response: {
        type: 'approve',
        message: 'Access granted. Please use the temporary credentials provided in the secure channel.',
        respondedDate: '2024-01-19',
        respondedBy: 'Admin'
      }
    },
    // PM Requests
    {
      id: 5,
      module: 'pm',
      type: 'approval',
      title: 'Budget Approval for New Features',
      description: 'We need additional budget approval for implementing the advanced analytics features that the client requested.',
      status: 'pending',
      priority: 'high',
      submittedDate: '2024-01-15',
      submittedBy: 'Lisa Brown (PM)',
      submittedByType: 'pm',
      projectName: 'Analytics Dashboard',
      category: 'Budget Approval',
      response: null
    },
    {
      id: 6,
      module: 'pm',
      type: 'confirmation',
      title: 'Resource Allocation Request',
      description: 'We need additional server resources for the upcoming project. Please approve the resource allocation request.',
      status: 'responded',
      priority: 'normal',
      submittedDate: '2024-01-12',
      submittedBy: 'David Wilson (PM)',
      submittedByType: 'pm',
      projectName: 'Infrastructure Upgrade',
      category: 'Resource Management',
      response: {
        type: 'approve',
        message: 'Resources approved. New servers will be provisioned by end of week.',
        respondedDate: '2024-01-13',
        respondedBy: 'Admin'
      }
    },
    // Sales Requests
    {
      id: 7,
      module: 'sales',
      type: 'payment-recovery',
      title: 'Payment Recovery Request',
      description: 'Request to recover pending payment from Teris project. Client has not responded to multiple follow-ups.',
      status: 'pending',
      priority: 'urgent',
      submittedDate: '2024-01-20',
      submittedBy: 'Alex Chen (Sales)',
      submittedByType: 'sales',
      projectName: 'E-commerce Website',
      category: 'Payment Recovery',
      amount: 30000,
      response: null
    },
    {
      id: 8,
      module: 'sales',
      type: 'withdrawal',
      title: 'Withdrawal Request',
      description: 'Request to withdraw earnings to bank account. All client payments have been recovered.',
      status: 'approved',
      priority: 'normal',
      submittedDate: '2024-01-19',
      submittedBy: 'Maria Garcia (Sales)',
      submittedByType: 'sales',
      projectName: 'Personal Withdrawal',
      category: 'Earnings Withdrawal',
      amount: 15000,
      response: {
        type: 'approve',
        message: 'Withdrawal approved. Amount will be transferred within 2-3 business days.',
        respondedDate: '2024-01-20',
        respondedBy: 'Admin'
      }
    },
    {
      id: 9,
      module: 'sales',
      type: 'hold-work',
      title: 'Hold Work Request',
      description: 'Request to temporarily hold work on Ankit Ahirwar project due to payment issues.',
      status: 'pending',
      priority: 'high',
      submittedDate: '2024-01-18',
      submittedBy: 'Robert Kim (Sales)',
      submittedByType: 'sales',
      projectName: 'Mobile App Development',
      category: 'Work Management',
      response: null
    },
    {
      id: 10,
      module: 'sales',
      type: 'increase-cost',
      title: 'Increase Cost Request',
      description: 'Request to increase project cost due to additional requirements from client.',
      status: 'rejected',
      priority: 'normal',
      submittedDate: '2024-01-16',
      submittedBy: 'Jennifer Lee (Sales)',
      submittedByType: 'sales',
      projectName: 'E-commerce Platform',
      category: 'Cost Management',
      amount: 25000,
      response: {
        type: 'reject',
        message: 'Cost increase not approved. Please renegotiate with client or find alternative solutions.',
        respondedDate: '2024-01-17',
        respondedBy: 'Admin'
      }
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
      case 'responded':
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'normal':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getModuleColor = (module) => {
    switch (module) {
      case 'client':
        return 'bg-purple-100 text-purple-800'
      case 'employee':
        return 'bg-blue-100 text-blue-800'
      case 'pm':
        return 'bg-indigo-100 text-indigo-800'
      case 'sales':
        return 'bg-teal-100 text-teal-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'approval':
        return FiFileText
      case 'feedback':
        return FiMessageSquare
      case 'confirmation':
        return FiCheckSquare
      case 'payment-recovery':
        return FiCreditCard
      case 'withdrawal':
        return FiDollarSign
      case 'hold-work':
        return FiPause
      case 'accelerate-work':
        return FiTrendingUp
      case 'increase-cost':
        return FiDollarSign
      default:
        return FiAlertCircle
    }
  }

  const getModuleIcon = (module) => {
    switch (module) {
      case 'client':
        return FiUsers
      case 'employee':
        return FiUser
      case 'pm':
        return FiShield
      case 'sales':
        return FiShoppingCart
      default:
        return FiAlertCircle
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Filter data based on active tab, search and filter criteria
  const filteredData = useMemo(() => {
    let data = allRequests

    // Filter by module/tab
    if (activeTab !== 'all') {
      data = data.filter(request => request.module === activeTab)
    }

    // Filter by search term
    if (searchTerm) {
      data = data.filter(request =>
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.projectName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (selectedFilter !== 'all') {
      data = data.filter(request => request.status === selectedFilter)
    }

    return data
  }, [activeTab, searchTerm, selectedFilter])

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Management functions
  const handleView = (request) => {
    setSelectedRequest(request)
    setShowViewModal(true)
  }

  const handleRespond = (request) => {
    setSelectedRequest(request)
    setResponseText('')
    setResponseType('approve')
    setShowResponseModal(true)
  }

  const handleSubmitResponse = async () => {
    if (responseType !== 'approve' && !responseText.trim()) return
    
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Response submitted:', {
      requestId: selectedRequest.id,
      responseType,
      responseText,
      timestamp: new Date().toISOString()
    })
    
    setIsSubmitting(false)
    setShowResponseModal(false)
    setSelectedRequest(null)
    setResponseText('')
  }

  const closeModals = () => {
    setShowViewModal(false)
    setShowResponseModal(false)
    setSelectedRequest(null)
    setResponseText('')
    setResponseType('approve')
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
                  Requests Management
                </h1>
                <p className="text-gray-600">
                  Comprehensive oversight and management of all system requests
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

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalRequests}</p>
                </div>
                <FiFileText className="text-gray-600 text-xl" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{statistics.pendingRequests}</p>
                </div>
                <FiClock className="text-yellow-600 text-xl" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.approvedRequests}</p>
                </div>
                <FiCheckSquare className="text-green-600 text-xl" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Urgent</p>
                  <p className="text-2xl font-bold text-red-600">{statistics.urgentRequests}</p>
                </div>
                <FiAlertCircle className="text-red-600 text-xl" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{statistics.rejectedRequests}</p>
                </div>
                <FiX className="text-red-600 text-xl" />
              </div>
            </motion.div>
          </div>

          {/* Module Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Client Requests</p>
                  <p className="text-2xl font-bold text-purple-600">{statistics.clientRequests}</p>
                </div>
                <FiUsers className="text-purple-600 text-xl" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Employee Requests</p>
                  <p className="text-2xl font-bold text-blue-600">{statistics.employeeRequests}</p>
                </div>
                <FiUser className="text-blue-600 text-xl" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">PM Requests</p>
                  <p className="text-2xl font-bold text-indigo-600">{statistics.pmRequests}</p>
                </div>
                <FiShield className="text-indigo-600 text-xl" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sales Requests</p>
                  <p className="text-2xl font-bold text-teal-600">{statistics.salesRequests}</p>
                </div>
                <FiShoppingCart className="text-teal-600 text-xl" />
              </div>
            </motion.div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'all', label: 'All Requests', icon: FiFileText },
                  { id: 'client', label: 'Client Requests', icon: FiUsers },
                  { id: 'employee', label: 'Employee Requests', icon: FiUser },
                  { id: 'pm', label: 'PM Requests', icon: FiShield },
                  { id: 'sales', label: 'Sales Requests', icon: FiShoppingCart }
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
                placeholder="Search requests..."
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
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="responded">Responded</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedData.map((request, index) => {
              const TypeIcon = getTypeIcon(request.type)
              const ModuleIcon = getModuleIcon(request.module)
              
              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-lg ${getModuleColor(request.module)}`}>
                          <ModuleIcon className="text-sm" />
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModuleColor(request.module)}`}>
                          {request.module.toUpperCase()}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>

                    {/* Type and Priority */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="text-gray-400 text-sm" />
                        <span className="text-xs text-gray-500 capitalize">{request.type.replace('-', ' ')}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </div>

                    {/* Title and Description */}
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{request.title}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{request.description}</p>
                    </div>

                    {/* Project and Submitted By */}
                    <div className="text-xs text-gray-500">
                      <p className="font-medium">{request.projectName}</p>
                      <p>By: {request.submittedBy}</p>
                      <p>{formatDate(request.submittedDate)}</p>
                    </div>

                    {/* Amount (if applicable) */}
                    {request.amount && (
                      <div className="text-sm font-semibold text-teal-600">
                        {formatCurrency(request.amount)}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleView(request)}
                        className="flex-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                      >
                        <FiEye className="inline mr-1" />
                        View
                      </button>
                      {request.status === 'pending' && (
                        <button
                          onClick={() => handleRespond(request)}
                          className="flex-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                        >
                          <FiSend className="inline mr-1" />
                          Respond
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
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

      {/* View Request Modal */}
      {showViewModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${getModuleColor(selectedRequest.module)}`}>
                  {React.createElement(getModuleIcon(selectedRequest.module), { className: "text-lg" })}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedRequest.title}</h2>
                  <p className="text-sm text-gray-500">From: {selectedRequest.submittedBy}</p>
                </div>
              </div>
              <button
                onClick={closeModals}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Request Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Request Details</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{selectedRequest.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedRequest.priority)}`}>
                      {selectedRequest.priority} Priority
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModuleColor(selectedRequest.module)}`}>
                      {selectedRequest.module.toUpperCase()} Module
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>

                {/* Project Information */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Project Information</h3>
                  <p className="text-sm text-gray-600">Project: {selectedRequest.projectName}</p>
                  <p className="text-sm text-gray-600">Category: {selectedRequest.category}</p>
                  <p className="text-sm text-gray-600">Submitted: {formatDate(selectedRequest.submittedDate)}</p>
                  {selectedRequest.amount && (
                    <p className="text-sm font-semibold text-teal-600">Amount: {formatCurrency(selectedRequest.amount)}</p>
                  )}
                </div>

                {/* Response Section */}
                {selectedRequest.response ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <FiCheckSquare className="text-green-600" />
                      <h3 className="text-sm font-medium text-green-900">Response</h3>
                    </div>
                    <div className="mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedRequest.response.type === 'approve' ? 'bg-green-100 text-green-700' :
                        selectedRequest.response.type === 'reject' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {selectedRequest.response.type === 'approve' ? 'Approved' :
                         selectedRequest.response.type === 'reject' ? 'Rejected' :
                         'Changes Requested'}
                      </span>
                    </div>
                    <p className="text-sm text-green-800 leading-relaxed mb-2">{selectedRequest.response.message}</p>
                    <p className="text-xs text-green-600">
                      Responded by {selectedRequest.response.respondedBy} on {formatDate(selectedRequest.response.respondedDate)}
                    </p>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <FiClock className="text-amber-600" />
                      <h3 className="text-sm font-medium text-amber-900">Awaiting Response</h3>
                    </div>
                    <p className="text-sm text-amber-800 mt-1">
                      This request is pending your review and response.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeModals}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {selectedRequest.status === 'pending' && (
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    handleRespond(selectedRequest)
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Respond to Request
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FiSend className="text-blue-600 text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Respond to Request</h2>
                  <p className="text-sm text-gray-500">{selectedRequest.title}</p>
                </div>
              </div>
              <button
                onClick={closeModals}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Response Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Response Type</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setResponseType('approve')}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        responseType === 'approve'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-green-300 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <FiCheckSquare className="w-4 h-4" />
                        <span className="text-sm font-medium">Approve</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setResponseType('reject')}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        responseType === 'reject'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-red-300 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <FiX className="w-4 h-4" />
                        <span className="text-sm font-medium">Reject</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setResponseType('request_changes')}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        responseType === 'request_changes'
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-gray-200 hover:border-yellow-300 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <FiMessageSquare className="w-4 h-4" />
                        <span className="text-sm font-medium">Request Changes</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Response Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Your Response {responseType === 'approve' ? '(Optional)' : '(Required)'}
                  </label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder={
                      responseType === 'approve' ? 'Add any additional comments...' :
                      responseType === 'reject' ? 'Please explain why you are rejecting this request...' :
                      'Please specify what changes you would like...'
                    }
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    required={responseType !== 'approve'}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {responseType === 'approve' ? 'Optional feedback for the requester' : 'This field is required'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeModals}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitResponse}
                disabled={isSubmitting || (responseType !== 'approve' && !responseText.trim())}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                  isSubmitting || (responseType !== 'approve' && !responseText.trim())
                    ? 'bg-gray-400 cursor-not-allowed'
                    : responseType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : responseType === 'reject'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    <span>
                      {responseType === 'approve' ? 'Approve Request' :
                       responseType === 'reject' ? 'Reject Request' :
                       'Request Changes'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Admin_requests_management
