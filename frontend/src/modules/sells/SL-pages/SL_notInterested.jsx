import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  FiPhone, 
  FiMoreVertical,
  FiFilter,
  FiUser,
  FiSearch,
  FiSlash,
  FiUserCheck,
  FiMessageCircle,
  FiMail,
  FiXCircle,
  FiTag,
  FiLoader,
  FiX,
  FiFileText
} from 'react-icons/fi'
import SL_navbar from '../SL-components/SL_navbar'
import { salesLeadService } from '../SL-services'
import { useToast } from '../../../contexts/ToastContext'

const SL_notInterested = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  // State for filters and UI
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLeadId, setSelectedLeadId] = useState(null)
  const [showActionsMenu, setShowActionsMenu] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  
  // State for real data
  const [leadsData, setLeadsData] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // State for ContactedForm (for recovery)
  const [showContactedForm, setShowContactedForm] = useState(false)
  const [selectedLeadForForm, setSelectedLeadForForm] = useState(null)
  const [contactedFormData, setContactedFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    estimatedPrice: '50000',
    quotationSent: false,
    demoSent: false
  })

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      const cats = await salesLeadService.getLeadCategories()
      setCategories(cats || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    }
  }, [])

  // Fetch leads from API
  const fetchLeads = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchTerm || undefined,
        timeFrame: selectedFilter !== 'all' ? selectedFilter : undefined,
        page: 1,
        limit: 50
      }
      // Specifically fetch 'not_interested' leads
      const response = await salesLeadService.getLeadsByStatus('not_interested', params)
      
      // Normalize leads array from response shape
      const raw = response?.data
      const leads = Array.isArray(raw) ? raw : (raw?.data ?? [])
      setLeadsData(Array.isArray(leads) ? leads : [])
    } catch (error) {
      console.error('Error fetching leads:', error)
      toast.error('Failed to fetch leads')
      setLeadsData([])
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory, searchTerm, selectedFilter, toast])

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // Fetch leads when filters change
  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  // Helper function to get category info
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
      if (category) return category
    }
    
    return { name: 'Unknown', color: '#999999', icon: '📋' }
  }

  const filters = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'all', label: 'All' }
  ]

  const handleCall = (phone) => {
    window.open(`tel:${phone}`, '_self')
  }

  const handleWhatsApp = (phone) => {
    const message = encodeURIComponent("Hello! I'm following up on our previous conversation.")
    window.open(`https://wa.me/91${phone}?text=${message}`, '_blank')
  }

  const handleProfile = (leadId) => {
    navigate(`/lead-profile/${leadId}`)
  }

  const handleRecover = async (leadId) => {
    try {
      await salesLeadService.updateLeadStatus(leadId, 'connected')
      toast.success('Lead recovered successfully')
      setLeadsData(prev => prev.filter(lead => lead._id !== leadId))
      if (window.refreshDashboardStats) window.refreshDashboardStats()
    } catch (error) {
      console.error('Error recovering lead:', error)
      toast.error('Failed to recover lead')
    }
    setShowActionsMenu(null)
  }

  const handleRecoverAndConnect = (leadId) => {
    const lead = leadsData.find(l => l._id === leadId)
    if (lead) {
      setContactedFormData({
        name: lead.name || '',
        description: '',
        categoryId: '',
        estimatedPrice: '50000',
        quotationSent: false,
        demoSent: false
      })
      setSelectedLeadForForm(leadId)
      setShowContactedForm(true)
    }
    setShowActionsMenu(null)
  }

  const handleContactedFormSubmit = async (e) => {
    e.preventDefault()
    try {
      await salesLeadService.updateLeadStatus(selectedLeadForForm, 'connected')
      const profileData = {
        name: contactedFormData.name,
        businessName: contactedFormData.name,
        categoryId: contactedFormData.categoryId,
        estimatedCost: Math.round(Number(String(contactedFormData.estimatedPrice || '').replace(/,/g, '')) || 0),
        description: contactedFormData.description,
        quotationSent: contactedFormData.quotationSent,
        demoSent: contactedFormData.demoSent
      }
      await salesLeadService.createLeadProfile(selectedLeadForForm, profileData)
      toast.success('Lead marked as contacted and profile created')
      setLeadsData(prev => prev.filter(lead => lead._id !== selectedLeadForForm))
      if (window.refreshDashboardStats) window.refreshDashboardStats()
      setShowContactedForm(false)
    } catch (error) {
      console.error('Error recovering and connecting lead:', error)
      toast.error('Failed to recover and connect lead')
    }
  }

  const MobileLeadCard = ({ lead }) => {
    const categoryInfo = getCategoryInfo(lead.category)
    const hasProfile = lead.leadProfile
    
    return (
      <div className="flex items-center justify-between p-4">
        {/* Left Section - Avatar & Phone */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-sm">
              <FiUser className="text-white text-sm" />
            </div>
          </div>

          {/* Lead Info & Category */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {(lead.leadProfile?.name || lead.name) || lead.phone || 'No Data'}
            </h3>
            {/* Sub-info: Show phone if name is title, or category */}
            <div className="flex flex-col mt-0.5">
              {(lead.leadProfile?.name || lead.name) && lead.phone && (
                <span className="text-sm text-gray-500">{lead.phone}</span>
              )}
              <div className="flex items-center space-x-1 mt-0.5">
                <span className="text-xs text-black">
                  {categoryInfo.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-3">
          {/* Call Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleCall(lead.phone || '')
            }}
            className="bg-white text-teal-600 border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-all duration-200 text-xs font-medium shadow-sm"
          >
            Call
          </button>

          {/* WhatsApp Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleWhatsApp(lead.phone || '')
            }}
            className="bg-green-500 text-white p-1.5 rounded-lg hover:bg-green-600 transition-all duration-200 shadow-sm"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c0 5.449-4.434 9.883-9.881 9.883" />
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

            {/* Actions Dropdown */}
            <AnimatePresence>
              {showActionsMenu === lead._id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-36 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                >
                  <div className="py-1.5">
                    <button
                      onClick={() => lead.leadProfile ? handleRecover(lead._id) : handleRecoverAndConnect(lead._id)}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                    >
                      Contacted
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await salesLeadService.updateLeadStatus(lead._id, 'lost')
                          toast.success('Lead marked as lost')
                          setLeadsData(prev => prev.filter(l => l._id !== lead._id))
                          if (window.refreshDashboardStats) window.refreshDashboardStats()
                        } catch (error) {
                          toast.error('Failed to update lead status')
                        }
                        setShowActionsMenu(null)
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                    >
                      Lost
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
      <SL_navbar />
      <main className="max-w-4xl mx-auto px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 rounded-xl p-4 shadow-lg border border-orange-300/40">
            <div className="flex items-center justify-between">
              {/* Left Section - Title and Description */}
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                  <FiUser className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-orange-900">Not Interested</h1>
                  <p className="text-orange-700 text-xs">Leads marked as not interested</p>
                </div>
              </div>

              {/* Right Section - Total Count */}
              <div className="bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-white/30">
                <div className="text-center">
                  <p className="text-xs text-orange-600 font-medium mb-0.5">Total</p>
                  <p className="text-xl font-bold text-orange-900">{leadsData.length}</p>
                  <p className="text-xs text-orange-600 font-medium">Leads</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg" />
          <button onClick={() => setShowFilters(!showFilters)} className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg ${showFilters ? 'bg-teal-500 text-white' : 'text-gray-500 border border-teal-200'}`}><FiFilter /></button>
        </div>

        {showFilters && (
          <div className="space-y-4 mb-4">
            <div className="flex flex-wrap gap-2">
              {filters.map(f => (
                <button key={f.id} onClick={() => setSelectedFilter(f.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${selectedFilter === f.id ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-700'}`}>{f.label}</button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-8"><FiLoader className="animate-spin text-2xl text-gray-400" /></div>
          ) : leadsData.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUser className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No leads found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search criteria or filters.' : 'No leads marked as not interested yet.'}
                </p>
              </div>
            </div>
          ) : (
            leadsData.map(lead => (
              <div key={lead._id} className="bg-white rounded-lg shadow-sm border border-gray-200"><MobileLeadCard lead={lead} /></div>
            ))
          )}
        </div>
      </main>

      {/* Contacted Form Modal (Standard) */}
      <AnimatePresence>
        {showContactedForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowContactedForm(false)}
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
                    <h2 className="text-lg font-bold">Mark as Contacted</h2>
                  </div>
                  <button
                    onClick={() => setShowContactedForm(false)}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
                  >
                    <FiX className="text-white text-lg" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleContactedFormSubmit} className="p-6 space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Name</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
                      <FiUser className="text-lg" />
                    </div>
                    <input
                      type="text"
                      value={contactedFormData.name}
                      onChange={(e) => setContactedFormData({...contactedFormData, name: e.target.value})}
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
                      value={contactedFormData.description}
                      onChange={(e) => setContactedFormData({...contactedFormData, description: e.target.value})}
                      placeholder="Enter project description"
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Category <span className="text-red-500">*</span></label>
                  <select
                    value={contactedFormData.categoryId}
                    onChange={(e) => setContactedFormData({...contactedFormData, categoryId: e.target.value})}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
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
                      value={contactedFormData.estimatedPrice}
                      onChange={(e) => setContactedFormData({...contactedFormData, estimatedPrice: e.target.value})}
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
                      checked={contactedFormData.quotationSent}
                      onChange={(e) => setContactedFormData({...contactedFormData, quotationSent: e.target.checked})}
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
                      checked={contactedFormData.demoSent}
                      onChange={(e) => setContactedFormData({...contactedFormData, demoSent: e.target.checked})}
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
                    onClick={() => setShowContactedForm(false)}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg"
                  >
                    Mark as Contacted
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SL_notInterested
