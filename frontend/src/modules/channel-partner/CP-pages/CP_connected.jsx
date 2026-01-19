import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  FiPhone, 
  FiMoreVertical,
  FiFilter,
  FiUser,
  FiSearch,
  FiUserCheck,
  FiMessageCircle
} from 'react-icons/fi'
import CP_navbar from '../CP-components/CP_navbar'
import FollowUpDialog from '../CP-components/FollowUpDialog'
import { cpLeadService } from '../CP-services'
import { useToast } from '../../../contexts/ToastContext'

const CP_connected = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  // State for filters and UI
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showActionsMenu, setShowActionsMenu] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  
  // State for real data
  const [leadsData, setLeadsData] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  // State for Follow-up dialog
  const [showFollowupDialog, setShowFollowupDialog] = useState(false)
  const [selectedLeadForFollowup, setSelectedLeadForFollowup] = useState(null)

  // Fetch categories and leads on component mount
  useEffect(() => {
    fetchCategories()
    fetchLeads()
  }, [selectedFilter, selectedCategory, searchTerm])

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await cpLeadService.getLeadCategories()
      const cats = response.data || response || []
      setCategories(Array.isArray(cats) ? cats : [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Fetch leads from API
  const fetchLeads = async () => {
    setIsLoading(true)
    try {
      const params = {
        status: 'connected',
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchTerm || undefined
      }
      const response = await cpLeadService.getLeads(params)
      const leads = response.data || []
      const connectedLeads = leads.filter(lead => lead.status === 'connected')
      setLeadsData(connectedLeads)
    } catch (error) {
      console.error('Error fetching leads:', error)
      toast.error?.('Failed to fetch leads', {
        title: 'Error',
        duration: 4000
      })
      setLeadsData([])
    } finally {
      setIsLoading(false)
    }
  }

  const filters = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Last 7 Days' },
    { id: 'month', label: 'This Month' },
    { id: 'all', label: 'All' }
  ]

  // Get category info helper
  const getCategoryInfo = (categoryIdOrObject) => {
    if (!categoryIdOrObject) {
      return { name: 'Unknown', color: '#999999', icon: '📋' }
    }
    
    if (typeof categoryIdOrObject === 'object' && categoryIdOrObject.name) {
      return {
        name: categoryIdOrObject.name,
        color: categoryIdOrObject.color || '#999999',
        icon: categoryIdOrObject.icon || '📋'
      }
    }
    
    const categoryId = typeof categoryIdOrObject === 'object' ? categoryIdOrObject._id : categoryIdOrObject
    if (categoryId) {
      const category = categories.find(cat => cat._id === categoryId || cat._id?.toString() === categoryId?.toString())
      if (category) {
        return category
      }
    }
    
    return { name: 'Unknown', color: '#999999', icon: '📋' }
  }

  // Get lead activities (follow-ups)
  const getLeadActivities = (lead) => {
    const activities = []
    
    if (lead.followUps && Array.isArray(lead.followUps) && lead.followUps.length > 0) {
      const pendingFollowUps = lead.followUps.filter(fu => fu.status === 'pending')
      if (pendingFollowUps.length > 0) {
        activities.push({ type: 'followup', label: `${pendingFollowUps.length} Follow-up${pendingFollowUps.length > 1 ? 's' : ''}`, color: 'bg-amber-100 text-amber-800' })
      }
    }
    
    return activities
  }

  // Status change handler
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await cpLeadService.updateLeadStatus(leadId, newStatus)
      toast.success?.(`Lead status updated to ${newStatus.replace('_', ' ')}`, {
        title: 'Success',
        duration: 3000
      })
      
      const shouldRemove = ['not_converted', 'not_picked', 'converted', 'lost'].includes(newStatus)
      
      if (shouldRemove) {
        setLeadsData(prev => prev.filter(lead => lead._id !== leadId))
      } else {
        setLeadsData(prev => prev.map(lead => 
          lead._id === leadId ? { ...lead, status: newStatus } : lead
        ))
      }
      
      if (window.refreshCPDashboardStats) {
        window.refreshCPDashboardStats()
      }
    } catch (error) {
      console.error('Error updating lead status:', error)
      toast.error?.('Failed to update lead status', {
        title: 'Error',
        duration: 4000
      })
    }
    setShowActionsMenu(null)
  }

  // Handle follow-up scheduling
  const handleFollowUp = (leadId) => {
    setSelectedLeadForFollowup(leadId)
    setShowFollowupDialog(true)
    setShowActionsMenu(null)
  }

  // Handle follow-up form submission
  const handleFollowUpSubmit = async (followUpData) => {
    try {
      const followUpPayload = {
        scheduledDate: followUpData.followupDate,
        scheduledTime: followUpData.followupTime,
        type: 'call',
        notes: followUpData.notes || '',
        priority: followUpData.priority || 'medium'
      }
      await cpLeadService.addFollowUp(selectedLeadForFollowup, followUpPayload)
      toast.success?.('Follow-up scheduled successfully', {
        title: 'Success',
        duration: 3000
      })
      
      if (window.refreshCPDashboardStats) {
        window.refreshCPDashboardStats()
      }
      
      setShowFollowupDialog(false)
      setSelectedLeadForFollowup(null)
      fetchLeads()
    } catch (error) {
      console.error('Error scheduling follow-up:', error)
      toast.error?.('Failed to schedule follow-up', {
        title: 'Error',
        duration: 4000
      })
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
    const message = encodeURIComponent("Hello! I'm following up on our previous conversation. How can I help you today?")
    window.open(`https://wa.me/91${phone}?text=${message}`, '_blank')
  }

  const handleProfile = (leadId) => {
    navigate(`/cp-lead-profile/${leadId}`)
  }

  // Mobile Lead Card Component
  const MobileLeadCard = ({ lead }) => {
    const categoryInfo = getCategoryInfo(lead.category)
    const activities = getLeadActivities(lead)
    
    return (
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => {
          if (lead.leadProfile) {
            handleProfile(lead._id)
          } else {
            toast.error?.('This lead doesn\'t have a profile. Please connect to the lead first to create a profile.', {
              title: 'Error',
              duration: 4000
            })
          }
        }}
      >
        {/* Left Section - Avatar & Info */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <FiUser className="text-white text-xs" />
            </div>
            <div className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full flex items-center justify-center ${getPriorityColor(lead.priority)}`}>
              <div className={`w-1 h-1 rounded-full ${getPriorityColor(lead.priority).replace('text', 'bg')}`}></div>
            </div>
          </div>

          {/* Name, Phone & Category */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {lead.leadProfile?.name || lead.name || 'Unknown'}
            </h3>
            <p className="text-sm text-gray-600 truncate">{lead.phone}</p>
            {/* Category Tag & Activity Indicators */}
            <div className="flex items-center space-x-2 mt-1 flex-wrap gap-1">
              <span className="text-xs text-black">
                {categoryInfo.name}
              </span>
              {/* Activity Indicators */}
              {activities.map((activity, idx) => (
                <span key={idx} className={`text-xs px-2 py-0.5 rounded-full font-medium ${activity.color}`}>
                  {activity.label}
                </span>
              ))}
            </div>
          </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        {/* Call Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleCall(lead.phone)
          }}
          className="bg-white text-blue-600 border border-blue-200 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-all duration-200 text-xs font-medium"
        >
          Call
        </button>

        {/* WhatsApp Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleWhatsApp(lead.phone)
          }}
          className="bg-green-500 text-white p-1.5 rounded-lg hover:bg-green-600 transition-all duration-200"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c0 5.449-4.434 9.883-9.881 9.883"/>
          </svg>
        </button>

        {/* Profile Button - Only show if lead has profile */}
        {lead.leadProfile && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleProfile(lead._id)
            }}
            className="bg-blue-500 text-white p-1.5 rounded-lg hover:bg-blue-600 transition-all duration-200"
          >
            <FiUser className="w-3.5 h-3.5" />
          </button>
        )}

        {/* More Options */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowActionsMenu(showActionsMenu === lead._id ? null : lead._id)
            }}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <FiMoreVertical className="text-lg" />
          </button>

          {/* Actions Dropdown */}
          <AnimatePresence>
            {showActionsMenu === lead._id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2}}
                className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
              >
                <div className="py-1">
                  <button
                    onClick={() => handleStatusChange(lead._id, 'followup')}
                    className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors duration-200"
                  >
                    Follow Up
                  </button>
                  <button
                    onClick={() => handleFollowUp(lead._id)}
                    className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors duration-200"
                  >
                    Schedule Follow-up
                  </button>
                  <button
                    onClick={() => handleStatusChange(lead._id, 'not_converted')}
                    className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200"
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
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CP_navbar />
      
      <main className="max-w-4xl mx-auto px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        
         {/* Responsive Layout */}
         <div>
           {/* Header Section */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="mb-6"
           >
             <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 shadow-md border border-blue-200/30">
               <div className="flex items-center justify-between">
                 {/* Left Section - Icon and Text */}
                 <div className="flex items-center space-x-3 flex-1">
                   {/* Icon */}
                   <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                     <FiUserCheck className="text-white text-lg" />
                   </div>
                   
                   {/* Text Content */}
                   <div className="flex-1">
                     <h1 className="text-xl font-bold text-blue-900 leading-tight">
                       Connected<br />Leads
                     </h1>
                     <p className="text-blue-700 text-xs font-medium mt-0.5">
                       Leads that have been successfully contacted
                     </p>
                   </div>
                 </div>
                 
                 {/* Right Section - Total Count Card */}
                 <div className="bg-white rounded-lg px-4 py-3 shadow-md border border-white/20 ml-3">
                   <div className="text-center">
                     <p className="text-xs text-blue-600 font-medium mb-0.5">Total</p>
                     <p className="text-2xl font-bold text-blue-900 leading-none">{leadsData.length}</p>
                     <p className="text-xs text-blue-600 font-medium mt-0.5">Connected</p>
                   </div>
                 </div>
               </div>
             </div>
           </motion.div>

          {/* Search Bar with Filter Icon */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4"
          >
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-12 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
                  showFilters 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 border border-blue-200'
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
              className="space-y-4 mb-4"
            >
              {/* Time Filters */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Time Period</h4>
                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                        selectedFilter === filter.id
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filters */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Category</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      selectedCategory === 'all'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => setSelectedCategory(category._id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-1 ${
                        selectedCategory === category._id
                          ? 'text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={{
                        backgroundColor: selectedCategory === category._id ? category.color : undefined
                      }}
                    >
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
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
              Showing {leadsData.length} connected leads
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
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-xl p-4 border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : leadsData.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <FiUserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Connected Leads</h3>
                  <p className="text-gray-500">No leads have been marked as connected yet.</p>
                </motion.div>
              ) : (
                leadsData.map((lead, index) => (
                  <motion.div
                    key={lead._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                  >
                    <MobileLeadCard lead={lead} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* Follow-up Dialog */}
      <FollowUpDialog
        isOpen={showFollowupDialog}
        onClose={() => setShowFollowupDialog(false)}
        onSubmit={handleFollowUpSubmit}
        title="Schedule Follow-up"
        submitText="Schedule Follow-up"
      />
    </div>
  )
}

export default CP_connected
