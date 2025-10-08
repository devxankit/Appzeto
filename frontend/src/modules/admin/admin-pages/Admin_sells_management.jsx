import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiRefreshCw, 
  FiSearch, 
  FiFilter,
  FiEye, 
  FiEdit3, 
  FiTrash2, 
  FiPlus,
  FiUsers,
  FiUser,
  FiHome,
  FiTrendingUp,
  FiDollarSign,
  FiTarget,
  FiCalendar,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiStar,
  FiBarChart,
  FiPieChart,
  FiActivity
} from 'react-icons/fi'
import Admin_navbar from '../admin-components/Admin_navbar'
import Admin_sidebar from '../admin-components/Admin_sidebar'
import Loading from '../../../components/ui/loading'

const Admin_sells_management = () => {
  // State management
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('leads')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalType, setModalType] = useState('')

  // Mock statistics data
  const [statistics] = useState({
    leads: {
      total: 1247,
      thisMonth: 89,
      hot: 23,
      converted: 156
    },
    sales: {
      total: 2450000,
      thisMonth: 180000,
      target: 3000000,
      conversion: 12.5
    },
    team: {
      total: 8,
      active: 7,
      performance: 87.5,
      topPerformer: 'Sarah Wilson'
    },
    clients: {
      total: 342,
      active: 298,
      new: 24,
      retention: 94.2
    },
    meetings: {
      total: 156,
      today: 8,
      thisWeek: 34,
      conversion: 18.2
    },
    tasks: {
      total: 89,
      pending: 23,
      completed: 66,
      overdue: 5
    }
  })

  // Mock data for different entities
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: 'John Smith',
      company: 'Tech Solutions Inc.',
      phone: '+91 98765 43210',
      email: 'john@techsolutions.com',
      status: 'hot',
      priority: 'high',
      source: 'website',
      value: 45000,
      lastContact: '2024-01-15',
      nextFollowUp: '2024-01-20',
      assignedTo: 'Sarah Wilson',
      notes: 'Interested in premium package'
    },
    {
      id: 2,
      name: 'Emily Johnson',
      company: 'Digital Marketing Pro',
      phone: '+91 98765 43211',
      email: 'emily@digitalpro.com',
      status: 'connected',
      priority: 'medium',
      source: 'referral',
      value: 25000,
      lastContact: '2024-01-14',
      nextFollowUp: '2024-01-18',
      assignedTo: 'Mike Chen',
      notes: 'Needs more information about pricing'
    },
    {
      id: 3,
      name: 'Robert Davis',
      company: 'E-commerce Store',
      phone: '+91 98765 43212',
      email: 'robert@estore.com',
      status: 'new',
      priority: 'high',
      source: 'social media',
      value: 35000,
      lastContact: '2024-01-16',
      nextFollowUp: '2024-01-19',
      assignedTo: 'Lisa Anderson',
      notes: 'Looking for e-commerce solution'
    }
  ])

  const [salesTeam, setSalesTeam] = useState([
    {
      id: 1,
      name: 'Sarah Wilson',
      email: 'sarah@company.com',
      phone: '+91 98765 43220',
      role: 'Senior Sales Manager',
      department: 'Sales',
      status: 'active',
      performance: 95,
      leads: 45,
      converted: 12,
      revenue: 450000,
      target: 500000,
      joinDate: '2023-01-15',
      avatar: 'SW'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike@company.com',
      phone: '+91 98765 43221',
      role: 'Sales Representative',
      department: 'Sales',
      status: 'active',
      performance: 78,
      leads: 32,
      converted: 8,
      revenue: 320000,
      target: 400000,
      joinDate: '2023-03-20',
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Lisa Anderson',
      email: 'lisa@company.com',
      phone: '+91 98765 43222',
      role: 'Sales Executive',
      department: 'Sales',
      status: 'active',
      performance: 82,
      leads: 28,
      converted: 6,
      revenue: 280000,
      target: 350000,
      joinDate: '2023-06-10',
      avatar: 'LA'
    }
  ])

  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'TechCorp Solutions',
      contact: 'David Wilson',
      email: 'david@techcorp.com',
      phone: '+91 98765 43230',
      status: 'active',
      totalSpent: 125000,
      projects: 3,
      joinDate: '2023-02-15',
      lastActivity: '2024-01-10',
      package: 'Premium Web + App',
      renewalDate: '2024-02-15'
    },
    {
      id: 2,
      name: 'Digital Innovations',
      contact: 'Maria Garcia',
      email: 'maria@digitalinnovations.com',
      phone: '+91 98765 43231',
      status: 'active',
      totalSpent: 85000,
      projects: 2,
      joinDate: '2023-05-20',
      lastActivity: '2024-01-12',
      package: 'Business Web Package',
      renewalDate: '2024-05-20'
    },
    {
      id: 3,
      name: 'StartupHub',
      contact: 'Alex Thompson',
      email: 'alex@startuphub.com',
      phone: '+91 98765 43232',
      status: 'active',
      totalSpent: 45000,
      projects: 1,
      joinDate: '2023-08-10',
      lastActivity: '2024-01-08',
      package: 'Basic Web Package',
      renewalDate: '2024-08-10'
    }
  ])

  const [meetings, setMeetings] = useState([
    {
      id: 1,
      clientName: 'John Smith',
      company: 'Tech Solutions Inc.',
      meetingDate: '2024-01-20',
      meetingTime: '10:00 AM',
      meetingType: 'demo',
      location: 'Office Conference Room',
      status: 'scheduled',
      assignedTo: 'Sarah Wilson',
      notes: 'Product demonstration and pricing discussion'
    },
    {
      id: 2,
      clientName: 'Emily Johnson',
      company: 'Digital Marketing Pro',
      meetingDate: '2024-01-21',
      meetingTime: '2:00 PM',
      meetingType: 'video',
      location: 'Zoom Meeting',
      status: 'scheduled',
      assignedTo: 'Mike Chen',
      notes: 'Follow-up meeting to discuss requirements'
    },
    {
      id: 3,
      clientName: 'Robert Davis',
      company: 'E-commerce Store',
      meetingDate: '2024-01-22',
      meetingTime: '11:00 AM',
      meetingType: 'in-person',
      location: 'Client Office',
      status: 'scheduled',
      assignedTo: 'Lisa Anderson',
      notes: 'Initial consultation and needs assessment'
    }
  ])

  // Load data function
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
      case 'hot': return 'bg-red-100 text-red-800 border-red-200'
      case 'connected': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'new': return 'bg-green-100 text-green-800 border-green-200'
      case 'converted': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'lost': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'leads': return leads
      case 'sales-team': return salesTeam
      case 'clients': return clients
      case 'meetings': return meetings
      default: return leads
    }
  }

  // Filter data based on search and filter criteria
  const filteredData = useMemo(() => {
    const data = getCurrentData()
    return data.filter(item => {
      const matchesSearch = Object.values(item).some(value => 
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      let matchesFilter = true
      if (selectedFilter !== 'all') {
        matchesFilter = item.status === selectedFilter || item.priority === selectedFilter
      }
      
      return matchesSearch && matchesFilter
    })
  }, [activeTab, searchTerm, selectedFilter, leads, salesTeam, clients, meetings])

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Management functions
  const handleCreate = (type) => {
    setModalType(type)
    setSelectedItem(null)
    setShowCreateModal(true)
  }

  const handleEdit = (item, type) => {
    setModalType(type)
    setSelectedItem(item)
    setShowEditModal(true)
  }

  const handleView = (item, type) => {
    setModalType(type)
    setSelectedItem(item)
    setShowViewModal(true)
  }

  const handleDelete = (item, type) => {
    setModalType(type)
    setSelectedItem(item)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    // Simulate delete operation
    console.log('Deleting item:', selectedItem)
    setShowDeleteModal(false)
    setSelectedItem(null)
  }

  const handleSave = (formData) => {
    // Simulate save operation
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
    setSelectedItem(null)
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
      <div className="ml-64 pt-20 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Sells Management
                </h1>
                <p className="text-gray-600">
                  Monitor sales performance, leads, and sales team activities.
                </p>
              </div>
              <button
                onClick={loadData}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiRefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Compact Statistics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <FiUsers className="h-3 w-3 text-blue-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Leads</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-lg font-bold text-gray-900">{statistics.leads.total}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-green-600 font-semibold">+{statistics.leads.thisMonth}</span>
                  <span className="text-xs text-gray-500">this month</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <FiDollarSign className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Sales</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-lg font-bold text-gray-900">{formatCurrency(statistics.sales.total)}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-green-600 font-semibold">{statistics.sales.conversion}%</span>
                  <span className="text-xs text-gray-500">conversion</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <FiUser className="h-3 w-3 text-purple-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Team</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-lg font-bold text-gray-900">{statistics.team.total}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-green-600 font-semibold">{statistics.team.performance}%</span>
                  <span className="text-xs text-gray-500">performance</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="p-1.5 bg-orange-100 rounded-lg">
                  <FiHome className="h-3 w-3 text-orange-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Clients</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-lg font-bold text-gray-900">{statistics.clients.total}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-green-600 font-semibold">{statistics.clients.retention}%</span>
                  <span className="text-xs text-gray-500">retention</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="p-1.5 bg-indigo-100 rounded-lg">
                  <FiCalendar className="h-3 w-3 text-indigo-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Meetings</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-lg font-bold text-gray-900">{statistics.meetings.total}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-blue-600 font-semibold">{statistics.meetings.today}</span>
                  <span className="text-xs text-gray-500">today</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="p-1.5 bg-teal-100 rounded-lg">
                  <FiCheckCircle className="h-3 w-3 text-teal-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Tasks</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-lg font-bold text-gray-900">{statistics.tasks.total}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-orange-600 font-semibold">{statistics.tasks.pending}</span>
                  <span className="text-xs text-gray-500">pending</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'leads', label: 'Leads', icon: FiUsers },
                { key: 'sales-team', label: 'Sales Team', icon: FiUser },
                { key: 'clients', label: 'Clients', icon: FiHome },
                { key: 'meetings', label: 'Meetings', icon: FiCalendar }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Search and Filter */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="sm:w-48">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="all">All Status</option>
                    {activeTab === 'leads' && (
                      <>
                        <option value="hot">Hot</option>
                        <option value="connected">Connected</option>
                        <option value="new">New</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </>
                    )}
                    {activeTab === 'sales-team' && (
                      <>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </>
                    )}
                    {activeTab === 'clients' && (
                      <>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </>
                    )}
                    {activeTab === 'meetings' && (
                      <>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Content based on active tab */}
            <div className="p-6">
              {activeTab === 'leads' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {paginatedData.map((lead) => (
                    <div key={lead.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105 group">
                      {/* Header Section */}
                      <div className="mb-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-gray-900 truncate mb-1">{lead.name}</h3>
                            <p className="text-xs text-gray-600 font-medium mb-1">{lead.company}</p>
                            <p className="text-xs text-gray-400">{lead.assignedTo}</p>
                          </div>
                          <div className="flex flex-col space-y-1 ml-2">
                            <span className={`inline-flex px-1.5 py-0.5 text-xs font-bold rounded-full border ${getStatusColor(lead.status)}`}>
                              {lead.status}
                            </span>
                            <span className={`inline-flex px-1.5 py-0.5 text-xs font-bold rounded-full ${getPriorityColor(lead.priority)}`}>
                              {lead.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Value Highlight */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-green-700">Lead Value</span>
                          <span className="text-sm font-bold text-green-600">{formatCurrency(lead.value)}</span>
                        </div>
                      </div>
                      
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-blue-50 rounded-lg p-2">
                          <div className="text-xs text-blue-600 font-medium mb-1">Source</div>
                          <div className="text-xs font-bold text-blue-800">{lead.source}</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-2">
                          <div className="text-xs text-purple-600 font-medium mb-1">Next Follow</div>
                          <div className="text-xs font-bold text-purple-800">{formatDate(lead.nextFollowUp)}</div>
                        </div>
                      </div>
                      
                      {/* Contact Info */}
                      <div className="bg-gray-50 rounded-lg p-2 mb-3">
                        <div className="text-xs text-gray-600 font-medium mb-1">Contact</div>
                        <div className="text-xs font-bold text-gray-800">{lead.phone}</div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => handleView(lead, 'lead')}
                            className="text-gray-400 hover:text-primary p-1.5 rounded hover:bg-primary/10 transition-all duration-200 group-hover:text-primary"
                          >
                            <FiEye className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleEdit(lead, 'lead')}
                            className="text-gray-400 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50 transition-all duration-200 group-hover:text-blue-600"
                          >
                            <FiEdit3 className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleDelete(lead, 'lead')}
                            className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-all duration-200 group-hover:text-red-600"
                          >
                            <FiTrash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="text-xs text-gray-400 font-medium">
                          {formatDate(lead.lastContact)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'sales-team' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {paginatedData.map((member) => (
                    <div key={member.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105 group">
                      {/* Header Section */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                          {member.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 truncate">{member.name}</h3>
                          <p className="text-xs text-gray-600 font-medium">{member.role}</p>
                          <span className={`inline-flex px-1.5 py-0.5 text-xs font-bold rounded-full border mt-1 ${getStatusColor(member.status)}`}>
                            {member.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Performance Highlight */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-green-700">Performance</span>
                          <span className="text-lg font-bold text-green-600">{member.performance}%</span>
                        </div>
                      </div>
                      
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-blue-50 rounded-lg p-2">
                          <div className="text-xs text-blue-600 font-medium mb-1">Leads</div>
                          <div className="text-xs font-bold text-blue-800">{member.leads}</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-2">
                          <div className="text-xs text-purple-600 font-medium mb-1">Converted</div>
                          <div className="text-xs font-bold text-purple-800">{member.converted}</div>
                        </div>
                      </div>
                      
                      {/* Revenue Metrics */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-orange-50 rounded-lg p-2">
                          <div className="text-xs text-orange-600 font-medium mb-1">Revenue</div>
                          <div className="text-xs font-bold text-orange-800">{formatCurrency(member.revenue)}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="text-xs text-gray-600 font-medium mb-1">Target</div>
                          <div className="text-xs font-bold text-gray-800">{formatCurrency(member.target)}</div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => handleView(member, 'member')}
                            className="text-gray-400 hover:text-primary p-1.5 rounded hover:bg-primary/10 transition-all duration-200 group-hover:text-primary"
                          >
                            <FiEye className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleEdit(member, 'member')}
                            className="text-gray-400 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50 transition-all duration-200 group-hover:text-blue-600"
                          >
                            <FiEdit3 className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleDelete(member, 'member')}
                            className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-all duration-200 group-hover:text-red-600"
                          >
                            <FiTrash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <a href={`mailto:${member.email}`} className="text-xs text-gray-400 hover:text-gray-600 truncate max-w-20 font-medium">
                          {member.email}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'clients' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {paginatedData.map((client) => (
                    <div key={client.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105 group">
                      {/* Header Section */}
                      <div className="mb-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-sm font-bold text-gray-900 mb-1">{client.name}</h3>
                            <p className="text-xs text-gray-600 font-medium mb-1">{client.contact}</p>
                            <p className="text-xs text-gray-400">{client.email}</p>
                          </div>
                          <span className={`inline-flex px-1.5 py-0.5 text-xs font-bold rounded-full border ${getStatusColor(client.status)}`}>
                            {client.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Revenue Highlight */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-green-700">Total Spent</span>
                          <span className="text-sm font-bold text-green-600">{formatCurrency(client.totalSpent)}</span>
                        </div>
                      </div>
                      
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-blue-50 rounded-lg p-2">
                          <div className="text-xs text-blue-600 font-medium mb-1">Projects</div>
                          <div className="text-xs font-bold text-blue-800">{client.projects}</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-2">
                          <div className="text-xs text-purple-600 font-medium mb-1">Joined</div>
                          <div className="text-xs font-bold text-purple-800">{formatDate(client.joinDate)}</div>
                        </div>
                      </div>
                      
                      {/* Package Info */}
                      <div className="bg-gray-50 rounded-lg p-2 mb-3">
                        <div className="text-xs text-gray-600 font-medium mb-1">Package</div>
                        <div className="text-xs font-bold text-gray-800">{client.package}</div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => handleView(client, 'client')}
                            className="text-gray-400 hover:text-primary p-1.5 rounded hover:bg-primary/10 transition-all duration-200 group-hover:text-primary"
                          >
                            <FiEye className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleEdit(client, 'client')}
                            className="text-gray-400 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50 transition-all duration-200 group-hover:text-blue-600"
                          >
                            <FiEdit3 className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleDelete(client, 'client')}
                            className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-all duration-200 group-hover:text-red-600"
                          >
                            <FiTrash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="text-xs text-gray-400 font-medium">
                          ID: #{client.id}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'meetings' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {paginatedData.map((meeting) => (
                    <div key={meeting.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105 group">
                      {/* Header Section */}
                      <div className="mb-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-gray-900 truncate mb-1">{meeting.clientName}</h3>
                            <p className="text-xs text-gray-600 font-medium mb-1">{meeting.company}</p>
                            <p className="text-xs text-gray-400">{meeting.assignedTo}</p>
                          </div>
                          <span className={`inline-flex px-1.5 py-0.5 text-xs font-bold rounded-full border ${getStatusColor(meeting.status)}`}>
                            {meeting.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Meeting Details */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-blue-700">Meeting Time</span>
                          <span className="text-sm font-bold text-blue-600">{meeting.meetingTime}</span>
                        </div>
                      </div>
                      
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-green-50 rounded-lg p-2">
                          <div className="text-xs text-green-600 font-medium mb-1">Date</div>
                          <div className="text-xs font-bold text-green-800">{formatDate(meeting.meetingDate)}</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-2">
                          <div className="text-xs text-purple-600 font-medium mb-1">Type</div>
                          <div className="text-xs font-bold text-purple-800">{meeting.meetingType}</div>
                        </div>
                      </div>
                      
                      {/* Location */}
                      <div className="bg-gray-50 rounded-lg p-2 mb-3">
                        <div className="text-xs text-gray-600 font-medium mb-1">Location</div>
                        <div className="text-xs font-bold text-gray-800">{meeting.location}</div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => handleView(meeting, 'meeting')}
                            className="text-gray-400 hover:text-primary p-1.5 rounded hover:bg-primary/10 transition-all duration-200 group-hover:text-primary"
                          >
                            <FiEye className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleEdit(meeting, 'meeting')}
                            className="text-gray-400 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50 transition-all duration-200 group-hover:text-blue-600"
                          >
                            <FiEdit3 className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleDelete(meeting, 'meeting')}
                            className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-all duration-200 group-hover:text-red-600"
                          >
                            <FiTrash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="text-xs text-gray-400 font-medium">
                          ID: #{meeting.id}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} {activeTab}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this {modalType}? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Admin_sells_management
