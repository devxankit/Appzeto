import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  FiPhone, 
  FiMoreVertical,
  FiFilter,
  FiUser,
  FiSearch,
  FiAlertCircle,
  FiUserCheck,
  FiMessageCircle,
  FiMail
} from 'react-icons/fi'
import SL_navbar from '../SL-components/SL_navbar'

const SL_connected = () => {
  const navigate = useNavigate()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLeadId, setSelectedLeadId] = useState(null)
  const [showActionsMenu, setShowActionsMenu] = useState(null)

  // Mock connected leads data with names
  const connectedLeadsData = [
    {
      id: 1,
      name: 'John Doe',
      phone: '9845637236',
      priority: 'high',
      lastContact: '2 hours ago',
      status: 'connected'
    },
    {
      id: 2,
      name: 'Jane Smith',
      phone: '9876543210',
      priority: 'medium',
      lastContact: '1 day ago',
      status: 'connected'
    },
    {
      id: 3,
      name: 'Alice Brown',
      phone: '9087654321',
      priority: 'high',
      lastContact: '3 hours ago',
      status: 'connected'
    },
    {
      id: 4,
      name: 'Bob Johnson',
      phone: '8765432109',
      priority: 'low',
      lastContact: '2 days ago',
      status: 'connected'
    },
    {
      id: 5,
      name: 'Charlie Lee',
      phone: '7654321098',
      priority: 'high',
      lastContact: '5 hours ago',
      status: 'connected'
    },
    {
      id: 6,
      name: 'David Kim',
      phone: '6543210987',
      priority: 'medium',
      lastContact: '1 day ago',
      status: 'connected'
    },
    {
      id: 7,
      name: 'Eva Adams',
      phone: '5432109876',
      priority: 'low',
      lastContact: '3 days ago',
      status: 'connected'
    }
  ]

  const filters = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'week', label: 'Last 7 Days' },
    { id: 'month', label: 'This Month' },
    { id: 'all', label: 'All' }
  ]

  const filteredLeads = connectedLeadsData.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         lead.phone.includes(searchTerm)
    return matchesSearch
  })

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
    const message = encodeURIComponent("Hello! I'm following up on our previous conversation. How can I help you today?")
    window.open(`https://wa.me/91${phone}?text=${message}`, '_blank')
  }

  const handleProfile = (leadId) => {
    console.log('Navigating to profile for lead ID:', leadId)
    navigate(`/client-profile/${leadId}`)
  }

  const handleStatusChange = (leadId, newStatus) => {
    console.log(`Lead ${leadId} status changed to: ${newStatus}`)
    setShowActionsMenu(null)
  }

  // Mobile Lead Card Component
  const MobileLeadCard = ({ lead }) => (
    <div className="flex items-center justify-between">
      {/* Left Section - Avatar & Info */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
            <FiUser className="text-white text-xs" />
          </div>
          <div className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full flex items-center justify-center ${getPriorityColor(lead.priority)}`}>
            <div className={`w-1 h-1 rounded-full ${getPriorityColor(lead.priority).replace('text', 'bg')}`}></div>
          </div>
        </div>

        {/* Name & Phone */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">{lead.name}</h3>
          <p className="text-sm text-gray-600 truncate">{lead.phone}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        {/* Call Button */}
        <button
          onClick={() => handleCall(lead.phone)}
          className="bg-white text-teal-600 border border-teal-200 px-2.5 py-1.5 rounded-lg hover:bg-teal-50 transition-all duration-200 text-xs font-medium"
        >
          Call
        </button>

        {/* WhatsApp Button */}
        <button
          onClick={() => handleWhatsApp(lead.phone)}
          className="bg-green-500 text-white p-1.5 rounded-lg hover:bg-green-600 transition-all duration-200"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c0 5.449-4.434 9.883-9.881 9.883"/>
          </svg>
        </button>

        {/* Profile Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleProfile(lead.id)
          }}
          className="bg-teal-500 text-white p-1.5 rounded-lg hover:bg-teal-600 transition-all duration-200"
        >
          <FiUser className="w-3.5 h-3.5" />
        </button>

        {/* More Options */}
        <div className="relative">
          <button
            onClick={() => setShowActionsMenu(showActionsMenu === lead.id ? null : lead.id)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <FiMoreVertical className="text-lg" />
          </button>

          {/* Actions Dropdown */}
          <AnimatePresence>
            {showActionsMenu === lead.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2}}
                className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
              >
                <div className="py-1">
                  <button
                    onClick={() => handleStatusChange(lead.id, 'follow_up')}
                    className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                  >
                    Follow Up
                  </button>
                  <button
                    onClick={() => handleStatusChange(lead.id, 'quotation')}
                    className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                  >
                    Send Quote
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )

  // Desktop Lead Card Component
  const DesktopLeadCard = ({ lead }) => (
    <div className="flex items-center justify-between">
      {/* Left Section - Avatar & Info */}
      <div className="flex-1 flex items-center space-x-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
            <FiUser className="text-white text-sm" />
          </div>
          <div className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full flex items-center justify-center ${getPriorityColor(lead.priority)}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(lead.priority).replace('text', 'bg')}`}></div>
          </div>
        </div>

        {/* Name & Phone */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
          <p className="text-gray-600">{lead.phone}</p>
        </div>
      </div>

      {/* Actions Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => handleCall(lead.phone)}
          className="bg-white text-teal-600 border border-teal-200 px-3.5 py-1.5 rounded-lg hover:bg-teal-50 transition-all duration-200 text-sm font-medium"
        >
          Call
        </button>
        
        <button
          onClick={() => handleWhatsApp(lead.phone)}
          className="bg-green-500 text-white px-3.5 py-1.5 rounded-lg hover:bg-green-600 transition-all duration-200 flex items-center space-x-2"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c0 5.449-4.434 9.883-9.881 9.883"/>
          </svg>
          <span className="text-sm">WhatsApp</span>
        </button>

        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleProfile(lead.id)
          }}
          className="bg-teal-500 text-white px-3.5 py-1.5 rounded-lg hover:bg-teal-600 transition-all duration-200 flex items-center space-x-2"
        >
          <FiUser className="w-3.5 h-3.5" />
          <span className="text-sm">Profile</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowActionsMenu(showActionsMenu === lead.id ? null : lead.id)}
            className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200"
          >
            <FiMoreVertical className="text-lg" />
          </button>

          {/* Actions Dropdown */}
          <AnimatePresence>
            {showActionsMenu === lead.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2}}
                className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
              >
                <div className="py-2">
                  <button
                    onClick={() => handleStatusChange(lead.id, 'follow_up')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                  >
                    Schedule Follow Up
                  </button>
                  <button
                    onClick={() => handleStatusChange(lead.id, 'quotation')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                  >
                    Send Quotation
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <SL_navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        
         {/* Mobile Layout */}
         <div className="lg:hidden">
           {/* Header Section */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="mb-6"
           >
             <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 shadow-md border border-teal-200/30">
               <div className="flex items-center justify-between">
                 {/* Left Section - Icon and Text */}
                 <div className="flex items-center space-x-3 flex-1">
                   {/* Icon */}
                   <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                     <FiUserCheck className="text-white text-lg" />
                   </div>
                   
                   {/* Text Content */}
                   <div className="flex-1">
                     <h1 className="text-xl font-bold text-teal-900 leading-tight">
                       Connected<br />Leads
                     </h1>
                     <p className="text-teal-700 text-xs font-medium mt-0.5">
                       Leads that have been successfully contacted
                     </p>
                   </div>
                 </div>
                 
                 {/* Right Section - Total Count Card */}
                 <div className="bg-white rounded-lg px-4 py-3 shadow-md border border-white/20 ml-3">
                   <div className="text-center">
                     <p className="text-xs text-teal-600 font-medium mb-0.5">Total</p>
                     <p className="text-2xl font-bold text-teal-900 leading-none">{connectedLeadsData.length}</p>
                     <p className="text-xs text-teal-600 font-medium mt-0.5">Connected</p>
                   </div>
                 </div>
               </div>
             </div>
           </motion.div>

          {/* Simple Filter Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl p-5 mb-6 shadow-lg border border-gray-200"
          >
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
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
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-4"
          >
            <p className="text-gray-600 text-sm">
              Showing {filteredLeads.length} of {connectedLeadsData.length} connected leads
            </p>
          </motion.div>

          {/* Mobile Leads List */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-3"
          >
            <AnimatePresence>
              {filteredLeads.map((lead, index) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <MobileLeadCard lead={lead} />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty State */}
            {filteredLeads.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUserCheck className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No connected leads found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search criteria or filters.' : 'No connected leads match your current filters.'}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-8">
            
            {/* Main Content - 8 columns */}
            <div className="col-span-8 space-y-6">
              
              {/* Desktop Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-between"
              >
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Connected Leads</h1>
                  <p className="text-gray-600 mt-2">Leads that have been successfully contacted</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl">
                    <span className="text-sm font-semibold">Total: {connectedLeadsData.length}</span>
                  </div>
                  <div className="bg-white text-gray-600 px-6 py-3 rounded-xl border border-gray-200">
                    <span className="text-sm font-semibold">Showing: {filteredLeads.length}</span>
                  </div>
                </div>
              </motion.div>

              {/* Desktop Search & Filters */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                      type="text"
                      placeholder="Search by name or phone number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 text-lg"
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
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
                </div>
              </motion.div>

              {/* Desktop Leads Grid */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-3"
              >
                <AnimatePresence>
                  {filteredLeads.map((lead, index) => (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                    >
                      <DesktopLeadCard lead={lead} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Empty State */}
              {filteredLeads.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiUserCheck className="text-gray-400 text-3xl" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">No connected leads found</h3>
                    <p className="text-gray-600 text-lg">
                      {searchTerm ? 'Try adjusting your search criteria or filters.' : 'No connected leads match your current filters.'}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar - 4 columns */}
            <div className="col-span-4 space-y-6">
            
              {/* Stats Overview */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 shadow-xl border border-teal-200/50"
              >
                <h3 className="text-lg font-bold text-teal-900 mb-4">Connected Leads Analytics</h3>
                
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <span className="text-teal-700 text-sm font-medium">Total Connected</span>
                     <span className="text-teal-900 text-xl font-bold">{connectedLeadsData.length}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-teal-700 text-sm font-medium">High Priority</span>
                     <span className="text-teal-900 text-xl font-bold">{connectedLeadsData.filter(lead => lead.priority === 'high').length}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-teal-700 text-sm font-medium">Medium Priority</span>
                     <span className="text-teal-900 text-xl font-bold">{connectedLeadsData.filter(lead => lead.priority === 'medium').length}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-teal-700 text-sm font-medium">Low Priority</span>
                     <span className="text-teal-900 text-xl font-bold">{connectedLeadsData.filter(lead => lead.priority === 'low').length}</span>
                   </div>
                 </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button className="w-full bg-teal-500 text-white font-semibold py-3 px-4 rounded-xl hover:bg-teal-600 transition-colors duration-200 flex items-center justify-center space-x-2">
                    <FiMessageCircle className="text-lg" />
                    <span>Bulk Message</span>
                  </button>
                  
                  <button className="w-full bg-white text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
                    <FiMail className="text-lg" />
                    <span>Export Leads</span>
                  </button>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 1.0 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FiUserCheck className="text-green-600 text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Lead connected</p>
                      <p className="text-xs text-gray-600">2 minutes ago</p>
                    </div>
                  </div>
                
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiPhone className="text-blue-600 text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Follow-up call</p>
                      <p className="text-xs text-gray-600">15 minutes ago</p>
                    </div>
                  </div>
                
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <FiMessageCircle className="text-orange-600 text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">WhatsApp sent</p>
                      <p className="text-xs text-gray-600">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SL_connected
