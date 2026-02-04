import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiPhone, 
  FiMoreVertical,
  FiFilter,
  FiUser,
  FiSearch,
  FiUserCheck,
  FiFileText,
  FiX,
  FiUsers,
  FiShare2
} from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { salesLeadService } from '../SL-services'
import { useToast } from '../../../contexts/ToastContext'
import SL_navbar from '../SL-components/SL_navbar'

const TAB_RECEIVED = 'received'
const TAB_SHARED = 'shared'

const SL_channelPartnerLeads = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState(TAB_RECEIVED) // 'received' = from CP, 'shared' = shared by me with CP
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showActionsMenu, setShowActionsMenu] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  
  // Share with CP modal
  const [showShareModal, setShowShareModal] = useState(false)
  const [myLeadsForShare, setMyLeadsForShare] = useState([])
  const [assignedCPs, setAssignedCPs] = useState([])
  const [shareSelectedLeadId, setShareSelectedLeadId] = useState('')
  const [shareSelectedCPId, setShareSelectedCPId] = useState('')
  const [shareSubmitting, setShareSubmitting] = useState(false)
  
  // Real lead data state
  const [leadsData, setLeadsData] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoadingLeads, setIsLoadingLeads] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  })
  
  // Total count for statistics (not affected by pagination)
  const [totalLeads, setTotalLeads] = useState(0)

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const cats = await salesLeadService.getLeadCategories()
      setCategories(cats)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Fetch channel partner leads from API (by tab: received vs shared)
  const fetchLeads = useCallback(async () => {
    setIsLoadingLeads(true)
    try {
      const params = {
        type: activeTab,
        page: pagination.page,
        limit: pagination.limit
      }
      if (selectedCategory !== 'all') params.category = selectedCategory
      if (searchTerm) params.search = searchTerm
      if (selectedFilter !== 'all') params.timeFrame = selectedFilter

      const response = await salesLeadService.getChannelPartnerLeads(params)
      setLeadsData(response.data || [])
      setPagination({
        page: response.page || 1,
        limit: response.limit || 12,
        total: response.total || 0,
        pages: response.pages || 0
      })
      setTotalLeads(response.total || 0)
    } catch (error) {
      console.error('Error fetching channel partner leads:', error)
      toast.error('Unable to load leads. Please check your connection.')
    } finally {
      setIsLoadingLeads(false)
    }
  }, [activeTab, selectedCategory, searchTerm, selectedFilter, pagination.page, pagination.limit, toast])

  // Reset pagination when filters or tab change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [selectedCategory, searchTerm, selectedFilter, activeTab])

  useEffect(() => {
    fetchCategories()
    fetchLeads()
  }, [fetchLeads])

  // Open Share modal: load my new/connected leads and assigned CPs
  const openShareModal = useCallback(async () => {
    setShowShareModal(true)
    setShareSelectedLeadId('')
    setShareSelectedCPId('')
    try {
      const leadsPromise = salesLeadService.getMyLeads({ status: 'new', limit: 100 }).catch(() => ({ data: [] }))
      const cpsPromise = salesLeadService.getAssignedChannelPartners()
      const [leadsRes, cps] = await Promise.all([leadsPromise, cpsPromise])
      const allLeads = leadsRes?.data || []
      const connectedRes = await salesLeadService.getMyLeads({ status: 'connected', limit: 100 }).catch(() => ({ data: [] }))
      const connectedLeads = connectedRes?.data || []
      const combined = [...(allLeads || []), ...(connectedLeads || [])]
      const uniqueById = Array.from(new Map(combined.map(l => [l._id || l.id, l])).values())
      setMyLeadsForShare(Array.from(uniqueById))
      setAssignedCPs(Array.isArray(cps) ? cps : [])
    } catch (err) {
      toast.error('Failed to load leads or channel partners')
      setMyLeadsForShare([])
      setAssignedCPs([])
    }
  }, [toast])

  const handleShareWithCP = async () => {
    if (!shareSelectedLeadId || !shareSelectedCPId) {
      toast.error('Please select a lead and a channel partner')
      return
    }
    setShareSubmitting(true)
    try {
      const res = await salesLeadService.shareLeadWithCP(shareSelectedLeadId, shareSelectedCPId)
      if (res?.success) {
        toast.success(res.message || 'Lead shared with channel partner')
        setShowShareModal(false)
        fetchLeads()
      } else {
        toast.error(res?.message || 'Failed to share lead')
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to share lead with channel partner')
    } finally {
      setShareSubmitting(false)
    }
  }

  const filters = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'week', label: 'Last 7 Days' },
    { id: 'month', label: 'This Month' },
    { id: 'all', label: 'All' }
  ]

  const filteredLeads = leadsData

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

  const handleCall = (phone) => {
    window.open(`tel:${phone}`, '_self')
  }

  const handleWhatsApp = (phone) => {
    const message = encodeURIComponent("Hello! I'm calling about your inquiry regarding our services. How can I help you today?")
    window.open(`https://wa.me/91${phone}?text=${message}`, '_blank')
  }

  const handleProfile = (leadId) => {
    // For channel partner leads, we might need a different profile page
    // For now, navigate to the regular lead profile page
    navigate(`/lead-profile/${leadId}`)
  }

  // Mobile Lead Card Component
  const MobileLeadCard = ({ lead }) => {
    const categoryInfo = getCategoryInfo(lead.category)
    const channelPartner = lead.channelPartner || lead.assignedTo
    
    return (
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => handleProfile(lead._id)}
      >
        {/* Left Section - Avatar & Phone */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <FiUser className="text-white text-sm" />
            </div>
          </div>

          {/* Phone Number & Category */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{lead.phone}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-black">
                {categoryInfo.name}
              </span>
              {channelPartner && (
                <span className="text-xs text-purple-600 font-medium">
                  • {channelPartner.name || channelPartner.companyName || 'Channel Partner'}
                </span>
              )}
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
            className="bg-white text-purple-600 border border-purple-200 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-all duration-200 text-xs font-medium"
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
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SL_navbar />
      
      <main className="max-w-4xl mx-auto px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        {/* Responsive Layout */}
        <div>
          {/* Enhanced Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <div className="bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 rounded-xl p-4 shadow-lg border border-purple-300/40">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <FiUsers className="text-white text-lg" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-purple-900">Channel Partner Leads</h1>
                    <p className="text-purple-700 text-xs">
                      {activeTab === TAB_RECEIVED ? 'Leads received from channel partners' : 'Leads you shared with channel partners'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-white/30">
                    <div className="text-center">
                      <p className="text-xs text-purple-600 font-medium mb-0.5">Total</p>
                      <p className="text-xl font-bold text-purple-900">{totalLeads}</p>
                      <p className="text-xs text-purple-600 font-medium">Leads</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={openShareModal}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-colors"
                  >
                    <FiShare2 className="text-base" />
                    Share lead with CP
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs: Received from CP | Shared with CP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex rounded-xl bg-white border border-gray-200 p-1 shadow-sm mb-4"
          >
            <button
              type="button"
              onClick={() => setActiveTab(TAB_RECEIVED)}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === TAB_RECEIVED
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Received from CP
            </button>
            <button
              type="button"
              onClick={() => setActiveTab(TAB_SHARED)}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === TAB_SHARED
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Shared with CP
            </button>
          </motion.div>

          {/* Simple Modern Filter Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4"
          >
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-12 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
                  showFilters 
                    ? 'bg-purple-500 text-white shadow-md' 
                    : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50 border border-purple-200'
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
                          ? 'bg-purple-500 text-white shadow-md'
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
                        ? 'bg-purple-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.length > 0 ? categories.map((category) => (
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
                  )) : (
                    <div className="text-xs text-gray-500">Loading categories...</div>
                  )}
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
              Showing {filteredLeads.length} of {totalLeads} leads
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
              {isLoadingLeads ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No channel partner leads found</p>
                </div>
              ) : (
                filteredLeads.map((lead, index) => (
                <motion.div
                  key={lead._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <MobileLeadCard lead={lead} />
                </motion.div>
              ))
              )}
            </AnimatePresence>

            {/* Empty State */}
            {filteredLeads.length === 0 && !isLoadingLeads && (
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
                    {searchTerm ? 'Try adjusting your search criteria or filters.' : 'No channel partner leads match your current filters.'}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Mobile Pagination */}
            {pagination.pages > 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex items-center justify-center space-x-2 mt-6"
              >
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="px-3 py-2 text-sm text-gray-700">
                  Page {pagination.page} of {pagination.pages}
                </span>
                
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Share lead with CP modal */}
          <AnimatePresence>
            {showShareModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                onClick={() => !shareSubmitting && setShowShareModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={e => e.stopPropagation()}
                  className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-purple-900">Share lead with Channel Partner</h2>
                    <button
                      type="button"
                      onClick={() => !shareSubmitting && setShowShareModal(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                    >
                      <FiX className="text-lg" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Select one of your new or connected leads and a channel partner assigned to you.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your lead</label>
                      <select
                        value={shareSelectedLeadId}
                        onChange={e => setShareSelectedLeadId(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Select lead</option>
                        {myLeadsForShare.map(l => (
                          <option key={l._id || l.id} value={l._id || l.id}>
                            {l.name || l.company || l.phone || 'Unnamed'} {l.phone ? `(${l.phone})` : ''} – {l.status || 'new'}
                          </option>
                        ))}
                      </select>
                      {myLeadsForShare.length === 0 && (
                        <p className="text-xs text-amber-600 mt-1">No new or connected leads. Add leads from the main Leads page.</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Channel partner</label>
                      <select
                        value={shareSelectedCPId}
                        onChange={e => setShareSelectedCPId(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Select channel partner</option>
                        {assignedCPs.map(cp => (
                          <option key={cp._id} value={cp._id}>
                            {cp.name || cp.companyName || 'CP'} {cp.companyName ? `(${cp.companyName})` : ''}
                          </option>
                        ))}
                      </select>
                      {assignedCPs.length === 0 && (
                        <p className="text-xs text-amber-600 mt-1">No channel partners assigned to you. Contact admin to get CPs assigned.</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <button
                      type="button"
                      onClick={() => !shareSubmitting && setShowShareModal(false)}
                      className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleShareWithCP}
                      disabled={shareSubmitting || !shareSelectedLeadId || !shareSelectedCPId}
                      className="flex-1 py-2 px-4 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {shareSubmitting ? 'Sharing…' : 'Share lead'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default SL_channelPartnerLeads
