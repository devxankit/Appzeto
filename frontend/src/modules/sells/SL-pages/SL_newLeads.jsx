import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiPhone, 
  FiMoreVertical,
  FiFilter,
  FiUser,
  FiSearch,
  FiAlertCircle,
  FiUserCheck,
  FiFileText,
  FiX
} from 'react-icons/fi'
import SL_navbar from '../SL-components/SL_navbar'

const SL_newLeads = () => {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLeadId, setSelectedLeadId] = useState(null)
  const [showActionsMenu, setShowActionsMenu] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [leadToDelete, setLeadToDelete] = useState(null)
  const [showConnectedForm, setShowConnectedForm] = useState(false)
  const [selectedLeadForForm, setSelectedLeadForForm] = useState(null)
  const [connectedForm, setConnectedForm] = useState({
    name: '',
    description: '',
    projectType: 'web',
    estimatedPrice: '50000',
    quotationSent: false,
    demoSent: false
  })

  // Mock leads data
  const leadsData = [
    {
      id: 1,
      phone: '9845637236',
      priority: 'high'
    },
    {
      id: 2,
      phone: '9876543210',
      priority: 'medium'
    },
    {
      id: 3,
      phone: '9087654321',
      priority: 'high'
    },
    {
      id: 4,
      phone: '8765432109',
      priority: 'low'
    },
    {
      id: 5,
      phone: '7654321098',
      priority: 'high'
    },
    {
      id: 6,
      phone: '6543210987',
      priority: 'medium'
    }
  ]

  const filters = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'week', label: 'Last 7 Days' },
    { id: 'month', label: 'This Month' },
    { id: 'all', label: 'All' }
  ]

  const filteredLeads = leadsData.filter(lead => {
    const matchesSearch = lead.phone.includes(searchTerm)
    return matchesSearch
  })


  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-gray-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const handleCall = (phone) => {
    window.open(`tel:${phone}`, '_self')
  }

  const handleWhatsApp = (phone) => {
    const message = encodeURIComponent("Hello! I'm calling about your inquiry regarding our services. How can I help you today?")
    window.open(`https://wa.me/91${phone}?text=${message}`, '_blank')
  }

  const handleStatusChange = (leadId, newStatus) => {
    if (newStatus === 'contacted') {
      setSelectedLeadForForm(leadId)
      setShowConnectedForm(true)
    } else {
      console.log(`Lead ${leadId} status changed to: ${newStatus}`)
    }
    setShowActionsMenu(null)
  }

  const handleNotInterested = (leadId) => {
    setLeadToDelete(leadId)
    setShowDeleteConfirm(true)
    setShowActionsMenu(null)
  }

  const confirmDelete = () => {
    if (leadToDelete) {
      // Remove lead from the data array
      const updatedLeads = leadsData.filter(lead => lead.id !== leadToDelete)
      console.log(`Lead ${leadToDelete} permanently deleted`)
      // In a real app, you would update the state or make an API call
    }
    setShowDeleteConfirm(false)
    setLeadToDelete(null)
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setLeadToDelete(null)
  }

  const handleConnectedFormChange = (field, value) => {
    setConnectedForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleConnectedFormSubmit = (e) => {
    e.preventDefault()
    console.log('Connected form submitted:', connectedForm)
    // Handle form submission logic here
    setShowConnectedForm(false)
    setSelectedLeadForForm(null)
    setConnectedForm({
      name: '',
      description: '',
      projectType: 'web',
      estimatedPrice: '50000',
      quotationSent: false,
      demoSent: false
    })
  }

  const closeConnectedForm = () => {
    setShowConnectedForm(false)
    setSelectedLeadForForm(null)
    setConnectedForm({
      name: '',
      description: '',
      projectType: 'web',
      estimatedPrice: '50000',
      quotationSent: false,
      demoSent: false
    })
  }

  // Mobile Lead Card Component - Simplified
  const MobileLeadCard = ({ lead }) => (
    <div className="flex items-center justify-between">
      {/* Left Section - Avatar & Phone */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
            <FiUser className="text-white text-sm" />
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{lead.phone}</h3>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        {/* Call Button */}
        <button
          onClick={() => handleCall(lead.phone)}
          className="bg-white text-teal-600 border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-all duration-200 text-xs font-medium"
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
                className="absolute right-0 top-full mt-2 w-36 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
              >
                <div className="py-1.5">
                  <button
                    onClick={() => handleStatusChange(lead.id, 'contacted')}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                  >
                    Contacted
                  </button>
                  <button
                    onClick={() => handleStatusChange(lead.id, 'not_picked')}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200"
                  >
                    Not Picked
                  </button>
                  <button
                    onClick={() => handleNotInterested(lead.id)}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                  >
                    Not Interested
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )

  // Desktop Lead Card Component - Simplified
  const DesktopLeadCard = ({ lead }) => (
    <div className="flex items-center justify-between">
      {/* Left Section - Avatar & Info */}
      <div className="flex-1 flex items-center space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
            <FiUser className="text-white text-lg" />
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">{lead.phone}</h3>
        </div>
      </div>

      {/* Actions Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => handleCall(lead.phone)}
          className="bg-white text-teal-600 border border-teal-200 px-4 py-2 rounded-lg hover:bg-teal-50 transition-all duration-200 text-sm font-medium"
        >
          Call
        </button>
        
        <button
          onClick={() => handleWhatsApp(lead.phone)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.':195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5-.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c0 5.449-4.434 9.883-9.881 9.883"/>
          </svg>
          <span className="text-sm">WhatsApp</span>
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
                className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
              >
                <div className="py-2.5">
                  <button
                    onClick={() => handleStatusChange(lead.id, 'contacted')}
                    className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                  >
                    Mark as Contacted
                  </button>
                  <button
                    onClick={() => handleStatusChange(lead.id, 'not_picked')}
                    className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200"
                  >
                    Mark as Not Picked
                  </button>
                  <button
                    onClick={() => handleNotInterested(lead.id)}
                    className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                  >
                    Mark as Not Interested
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
           {/* Enhanced Header Section */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="mb-6"
           >
             <div className="bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200 rounded-xl p-4 shadow-lg border border-teal-300/40">
               <div className="flex items-center justify-between">
                 {/* Left Section - Title and Description */}
                 <div className="flex items-center space-x-3 flex-1">
                   <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                     <FiUser className="text-white text-lg" />
                   </div>
                   <div>
                     <h1 className="text-lg font-bold text-teal-900">New Leads</h1>
                     <p className="text-teal-700 text-xs">Manage and track your potential customers</p>
                   </div>
                 </div>
                 
                 {/* Right Section - Total Count */}
                 <div className="bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-white/30">
                   <div className="text-center">
                     <p className="text-xs text-teal-600 font-medium mb-0.5">Total</p>
                     <p className="text-xl font-bold text-teal-900">{leadsData.length}</p>
                     <p className="text-xs text-teal-600 font-medium">Leads</p>
                   </div>
                 </div>
               </div>
             </div>
           </motion.div>


          {/* Simple Modern Filter Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4"
          >
            <div className="relative">
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
          </motion.div>

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

          {/* Results Count */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-4"
          >
            <p className="text-gray-600 text-sm">
              Showing {filteredLeads.length} of {leadsData.length} leads
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
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
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
                    <FiSearch className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No leads found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search criteria or filters.' : 'No leads match your current filters.'}
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
                  <h1 className="text-3xl font-bold text-gray-900">New Leads</h1>
                  <p className="text-gray-600 mt-2">Manage and track your potential customers</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl">
                    <span className="text-sm font-semibold">Total: {leadsData.length}</span>
                  </div>
                  <div className="bg-white text-gray-600 px-6 py-3 rounded-xl border border-gray-200">
                    <span className="text-sm font-semibold">Showing: {filteredLeads.length}</span>
                  </div>
                </div>
              </motion.div>

              {/* Simple Desktop Search & Filters */}
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
                      placeholder="Search by phone number..."
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
                      className="bg-white rounded-xl p-5 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
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
                      <FiSearch className="text-gray-400 text-3xl" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">No leads found</h3>
                    <p className="text-gray-600 text-lg">
                      {searchTerm ? 'Try adjusting your search criteria or filters.' : 'No leads match your current filters.'}
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
                <h3 className="text-lg font-bold text-teal-900 mb-4">Lead Analytics</h3>
                
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <span className="text-teal-700 text-sm font-medium">Total Leads</span>
                     <span className="text-teal-900 text-xl font-bold">{leadsData.length}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-teal-700 text-sm font-medium">Showing</span>
                     <span className="text-teal-900 text-xl font-bold">{filteredLeads.length}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-teal-700 text-sm font-medium">High Priority</span>
                     <span className="text-teal-900 text-xl font-bold">{leadsData.filter(lead => lead.priority === 'high').length}</span>
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
                    <FiSearch className="text-lg" />
                    <span>Advanced Search</span>
                  </button>
                  
                  <button className="w-full bg-white text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
                    <FiFilter className="text-lg" />
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
                      <FiPhone className="text-green-600 text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Call made</p>
                      <p className="text-xs text-gray-600">2 minutes ago</p>
                    </div>
                  </div>
                
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiUserCheck className="text-blue-600 text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Lead contacted</p>
                      <p className="text-xs text-gray-600">15 minutes ago</p>
                    </div>
                  </div>
                
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <FiAlertCircle className="text-orange-600 text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New lead added</p>
                      <p className="text-xs text-gray-600">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Connected Form Dialog */}
      <AnimatePresence>
        {showConnectedForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeConnectedForm}
            />

            {/* Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-md bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <FiUserCheck className="text-white text-lg" />
                    </div>
                    <h2 className="text-lg font-bold">Add Connected Lead</h2>
                  </div>
                  <button
                    onClick={closeConnectedForm}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
                  >
                    <FiX className="text-white text-lg" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleConnectedFormSubmit} className="p-6 space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Name</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
                      <FiUser className="text-lg" />
                    </div>
                    <input
                      type="text"
                      value={connectedForm.name}
                      onChange={(e) => handleConnectedFormChange('name', e.target.value)}
                      placeholder="Enter client name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Description</label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-teal-600">
                      <FiFileText className="text-lg" />
                    </div>
                    <textarea
                      value={connectedForm.description}
                      onChange={(e) => handleConnectedFormChange('description', e.target.value)}
                      placeholder="Enter project description"
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>

                {/* Project Type */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Project Type</label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleConnectedFormChange('projectType', 'web')}
                      className={`flex-1 py-3 px-3 rounded-lg font-medium transition-all duration-200 text-sm ${
                        connectedForm.projectType === 'web'
                          ? 'bg-teal-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Web
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConnectedFormChange('projectType', 'app')}
                      className={`flex-1 py-3 px-3 rounded-lg font-medium transition-all duration-200 text-sm ${
                        connectedForm.projectType === 'app'
                          ? 'bg-teal-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      App
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConnectedFormChange('projectType', 'taxi')}
                      className={`flex-1 py-3 px-3 rounded-lg font-medium transition-all duration-200 text-sm ${
                        connectedForm.projectType === 'taxi'
                          ? 'bg-teal-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Taxi
                    </button>
                  </div>
                </div>

                {/* Estimated Price */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Estimated Price</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
                      <span className="text-lg font-bold">₹</span>
                    </div>
                    <input
                      type="text"
                      value={connectedForm.estimatedPrice}
                      onChange={(e) => handleConnectedFormChange('estimatedPrice', e.target.value)}
                      placeholder="Enter amount (e.g., 50000)"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="quotationSent"
                      checked={connectedForm.quotationSent}
                      onChange={(e) => handleConnectedFormChange('quotationSent', e.target.checked)}
                      className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                    />
                    <label htmlFor="quotationSent" className="text-sm font-medium text-gray-700">
                      Quotation sent
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="demoSent"
                      checked={connectedForm.demoSent}
                      onChange={(e) => handleConnectedFormChange('demoSent', e.target.checked)}
                      className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                    />
                    <label htmlFor="demoSent" className="text-sm font-medium text-gray-700">
                      Demo sent
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeConnectedForm}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg"
                  >
                    Save Lead
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={cancelDelete}
            />

            {/* Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 text-white rounded-t-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <FiAlertCircle className="text-white text-lg" />
                  </div>
                  <h2 className="text-lg font-bold">Confirm Deletion</h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 text-sm mb-4">
                  Are you sure you want to mark this lead as "Not Interested"? This action will permanently delete the lead from your list.
                </p>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-700 text-xs font-medium">
                    ⚠️ This action cannot be undone
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                  >
                    Delete Lead
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SL_newLeads