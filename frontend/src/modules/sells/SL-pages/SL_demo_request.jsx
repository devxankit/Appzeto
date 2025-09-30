import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  FiArrowLeft, 
  FiSearch, 
  FiVideo,
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiMoreVertical,
  FiFilter
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import SL_navbar from '../SL-components/SL_navbar'

const SL_demo_request = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showActionsMenu, setShowActionsMenu] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  // Mock demo requests data
  const demoRequestsData = [
    {
      id: 1,
      clientName: 'John Smith',
      company: 'TechCorp Solutions',
      email: 'john@techcorp.com',
      phone: '+91 98765 43210',
      requestDate: '2024-01-15',
      preferredDate: '2024-01-20',
      preferredTime: '10:00 AM',
      status: 'pending',
      demoType: 'Web Application',
      notes: 'Interested in our CRM solution for their sales team',
      priority: 'high'
    },
    {
      id: 2,
      clientName: 'Sarah Johnson',
      company: 'Digital Marketing Pro',
      email: 'sarah@digitalmarketing.com',
      phone: '+91 98765 43211',
      requestDate: '2024-01-14',
      preferredDate: '2024-01-18',
      preferredTime: '2:00 PM',
      status: 'scheduled',
      demoType: 'Mobile App',
      notes: 'Looking for mobile app development services',
      priority: 'medium'
    },
    {
      id: 3,
      clientName: 'Mike Chen',
      company: 'E-commerce Plus',
      email: 'mike@ecommerceplus.com',
      phone: '+91 98765 43212',
      requestDate: '2024-01-13',
      preferredDate: '2024-01-25',
      preferredTime: '11:00 AM',
      status: 'completed',
      demoType: 'E-commerce Platform',
      notes: 'Need a complete e-commerce solution with payment integration',
      priority: 'high'
    },
    {
      id: 4,
      clientName: 'Emily Davis',
      company: 'Healthcare Solutions',
      email: 'emily@healthcare.com',
      phone: '+91 98765 43213',
      requestDate: '2024-01-12',
      preferredDate: '2024-01-22',
      preferredTime: '3:00 PM',
      status: 'pending',
      demoType: 'Web Application',
      notes: 'Hospital management system demo required',
      priority: 'low'
    },
    {
      id: 5,
      clientName: 'David Wilson',
      company: 'Finance Hub',
      email: 'david@financehub.com',
      phone: '+91 98765 43214',
      requestDate: '2024-01-11',
      preferredDate: '2024-01-19',
      preferredTime: '9:00 AM',
      status: 'cancelled',
      demoType: 'Financial Software',
      notes: 'Budget constraints, postponed for next quarter',
      priority: 'medium'
    }
  ]

  const filters = [
    { id: 'all', label: 'All Requests' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ]

  const filteredRequests = demoRequestsData.filter(request => {
    const matchesSearch = request.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.demoType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || request.status === selectedFilter
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'scheduled': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'completed': return 'text-green-600 bg-green-50 border-green-200'
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock className="text-orange-600" />
      case 'scheduled': return <FiCalendar className="text-blue-600" />
      case 'completed': return <FiCheckCircle className="text-green-600" />
      case 'cancelled': return <FiXCircle className="text-red-600" />
      default: return <FiClock className="text-gray-600" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const handleCall = (phone) => {
    window.open(`tel:${phone}`, '_self')
  }

  const handleWhatsApp = (phone) => {
    // Remove any non-numeric characters and add country code if needed
    const cleanPhone = phone.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/${cleanPhone}`
    window.open(whatsappUrl, '_blank')
  }

  const handleViewDetails = (requestId) => {
    console.log('View details for request:', requestId)
  }

  const handleStatusChange = (requestId, newStatus) => {
    console.log(`Request ${requestId} status changed to: ${newStatus}`)
    setShowActionsMenu(null)
  }

  const stats = {
    total: demoRequestsData.length,
    pending: demoRequestsData.filter(r => r.status === 'pending').length,
    scheduled: demoRequestsData.filter(r => r.status === 'scheduled').length,
    completed: demoRequestsData.filter(r => r.status === 'completed').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SL_navbar />
      
      <main className="max-w-4xl mx-auto px-4 pt-16 pb-20">

        {/* Summary Card */}
        <div className="bg-teal-500 rounded-xl p-5 mb-4 text-white">
          <div className="flex items-center justify-between">
            {/* Left Section - Total */}
            <div>
              <h2 className="text-sm font-medium mb-2">Total Demo Requests</h2>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            
            {/* Right Section - Status Breakdown */}
            <div className="flex items-center space-x-6">
              {/* Pending */}
              <div className="text-center">
                <p className="text-lg font-bold mb-1">{stats.pending}</p>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
                  <span className="text-sm">Pending</span>
                </div>
              </div>
              
              {/* Scheduled */}
              <div className="text-center">
                <p className="text-lg font-bold mb-1">{stats.scheduled}</p>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span className="text-sm">Scheduled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar with Filter Icon */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full pl-8 pr-12 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
              showFilters 
                ? 'bg-teal-500 text-white shadow-md' 
                : 'text-gray-500 hover:text-teal-600 hover:bg-teal-50 border border-teal-200'
            }`}
          >
            <FiFilter className="text-base" />
          </button>
        </div>

        {/* Filters - Conditional Display */}
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedFilter === filter.id
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </motion.div>
        )}

        {/* Demo Requests List */}
        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <FiVideo className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No demo requests found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  {/* Left Section - Client Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                        <FiUser className="text-white text-xs" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{request.clientName}</h3>
                        <p className="text-xs text-gray-600">{request.company}</p>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-xs text-gray-600">Demo Type</p>
                      <p className="text-sm font-medium text-gray-900">{request.demoType}</p>
                    </div>

                    <div className="mb-2">
                      <p className="text-xs text-gray-600">Preferred Date</p>
                      <p className="text-sm text-gray-900">{request.preferredDate} at {request.preferredTime}</p>
                    </div>
                  </div>

                  {/* Right Section - Status and Actions */}
                  <div className="flex flex-col items-end space-y-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="capitalize">{request.status}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCall(request.phone)}
                        className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200"
                        title="Call"
                      >
                        <FiPhone className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleWhatsApp(request.phone)}
                        className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200"
                        title="WhatsApp"
                      >
                        <FaWhatsapp className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleViewDetails(request.id)}
                        className="p-1.5 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors duration-200"
                        title="View Details"
                      >
                        <FiEye className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default SL_demo_request
