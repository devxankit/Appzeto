// Channel Partner Leads Dashboard - Premium Mobile-First Design
import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiPlus,
  FiPhone,
  FiPhoneOff,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiX,
  FiChevronDown,
  FiSearch,
  FiFilter,
  FiActivity,
  FiGrid,
  FiTrendingUp
} from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useToast } from '../../../contexts/ToastContext'
import { cpLeadService } from '../CP-services'
import CP_navbar from '../CP-components/CP_navbar'

const CP_leads = () => {
  const { toast } = useToast()
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    phoneNumber: '',
    categoryId: ''
  })
  const [categories, setCategories] = useState([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const dropdownRef = useRef(null)
  
  // Dashboard statistics state
  const [dashboardStats, setDashboardStats] = useState({
    statusCounts: {
      new: 0,
      connected: 0,
      not_picked: 0,
      followup: 0,
      not_converted: 0,
      converted: 0,
      lost: 0
    },
    totalLeads: 0
  })
  const [isLoadingStats, setIsLoadingStats] = useState(false)

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Fetch categories and dashboard stats on component mount
  useEffect(() => {
    const token = localStorage.getItem('cpToken') || localStorage.getItem('token')
    if (token) {
      fetchCategories()
      fetchDashboardStats()
    }
  }, [])

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    setIsLoadingStats(true)
    try {
      const response = await cpLeadService.getLeads({ limit: 1000 })
      const allLeads = response.data || []
      
      const statusCounts = {
        new: allLeads.filter(l => l.status === 'new').length,
        connected: allLeads.filter(l => l.status === 'connected').length,
        not_picked: allLeads.filter(l => l.status === 'not_picked').length,
        followup: allLeads.filter(l => l.status === 'followup').length,
        not_converted: allLeads.filter(l => l.status === 'not_converted').length,
        converted: allLeads.filter(l => l.status === 'converted').length,
        lost: allLeads.filter(l => l.status === 'lost').length
      }
      
      setDashboardStats({
        statusCounts,
        totalLeads: allLeads.length
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      toast.error?.('Failed to load dashboard statistics', { title: 'Error' })
      setDashboardStats(prev => ({ ...prev, totalLeads: 0 }))
    } finally {
      setIsLoadingStats(false)
    }
  }

  // Function to refresh stats
  const refreshDashboardStats = () => {
    fetchDashboardStats()
  }

  // Expose refresh function globally
  useEffect(() => {
    window.refreshCPDashboardStats = refreshDashboardStats
    return () => {
      delete window.refreshCPDashboardStats
    }
  }, [])

  const fetchCategories = async () => {
    setIsLoadingCategories(true)
    try {
      const categoriesData = await cpLeadService.getLeadCategories()
      if (categoriesData && Array.isArray(categoriesData.data)) {
        setCategories(categoriesData.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const getCategoryInfo = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId)
    return category || { name: 'Unknown Category', color: '#6B7280' }
  }

  // Modal functions
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => {
    setIsModalOpen(false)
    setShowCategoryDropdown(false)
    setFormData({ phoneNumber: '', categoryId: '' })
  }
  
  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'phoneNumber') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10)
      setFormData({ ...formData, [name]: numericValue })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }
  
  const handleCategoryChange = (categoryId) => {
    setFormData({ ...formData, categoryId: categoryId })
    setShowCategoryDropdown(false)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.phoneNumber || !formData.categoryId) {
      toast.error?.('Please fill in all fields')
      return
    }

    if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      toast.error?.('Enter a valid 10-digit phone number')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await cpLeadService.createLead({
        phone: formData.phoneNumber,
        category: formData.categoryId
      })

      if (response.success) {
        toast.success?.('Lead created successfully!')
        closeModal()
        refreshDashboardStats()
      } else {
        toast.error?.(response.message || 'Failed to create lead')
      }
    } catch (error) {
      toast.error?.(error.message || 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Data for cards
  const cardData = [
    {
      id: 'new',
      title: 'New Leads',
      count: dashboardStats.statusCounts.new,
      icon: FiUsers,
      color: 'blue',
      route: '/cp-new-leads',
      description: 'Requires action',
      trend: 'high'
    },
    {
      id: 'connected',
      title: 'Connected',
      count: dashboardStats.statusCounts.connected,
      icon: FiPhone,
      color: 'emerald',
      route: '/cp-connected',
      description: 'In conversation',
      trend: 'neutral'
    },
    {
      id: 'followup',
      title: 'Follow Up',
      count: dashboardStats.statusCounts.followup,
      icon: FiCalendar,
      color: 'amber',
      route: '/cp-followup',
      description: 'Scheduled later',
      trend: 'high'
    },
    {
      id: 'not_picked',
      title: 'No Response',
      count: dashboardStats.statusCounts.not_picked,
      icon: FiPhoneOff,
      color: 'rose',
      route: '/cp-not-picked',
      description: 'Call back later',
      trend: 'low'
    },
    {
      id: 'converted',
      title: 'Converted',
      count: dashboardStats.statusCounts.converted,
      icon: FiCheckCircle,
      color: 'violet',
      route: '/cp-converted',
      description: 'Successfully closed',
      trend: 'high'
    },
    {
      id: 'lost',
      title: 'Lost',
      count: dashboardStats.statusCounts.lost,
      icon: FiAlertCircle,
      color: 'slate',
      route: '/cp-lost',
      description: 'Closed opportunities',
      trend: 'neutral'
    }
  ]

  // Enhanced Color System
  const colorStyles = {
    blue: { 
      bg: 'bg-blue-50', 
      text: 'text-blue-700', 
      iconBg: 'bg-blue-100',
      icon: 'text-blue-600',
      border: 'border-blue-100',
      accent: 'bg-blue-500' 
    },
    emerald: { 
      bg: 'bg-emerald-50', 
      text: 'text-emerald-700', 
      iconBg: 'bg-emerald-100',
      icon: 'text-emerald-600',
      border: 'border-emerald-100',
      accent: 'bg-emerald-500'
    },
    amber: { 
      bg: 'bg-amber-50', 
      text: 'text-amber-700', 
      iconBg: 'bg-amber-100',
      icon: 'text-amber-600',
      border: 'border-amber-100',
      accent: 'bg-amber-500'
    },
    rose: { 
      bg: 'bg-rose-50', 
      text: 'text-rose-700', 
      iconBg: 'bg-rose-100',
      icon: 'text-rose-600',
      border: 'border-rose-100',
      accent: 'bg-rose-500'
    },
    violet: { 
      bg: 'bg-violet-50', 
      text: 'text-violet-700', 
      iconBg: 'bg-violet-100',
      icon: 'text-violet-600',
      border: 'border-violet-100',
      accent: 'bg-violet-500'
    },
    slate: { 
      bg: 'bg-slate-50', 
      text: 'text-slate-700', 
      iconBg: 'bg-slate-100',
      icon: 'text-slate-600',
      border: 'border-slate-200',
      accent: 'bg-slate-500'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/30 font-sans pb-24">
      <CP_navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-20 sm:px-6 lg:px-8">
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lead Pipeline</h1>
            <p className="text-slate-500 text-sm mt-1">Manage and track your lead conversions</p>
          </div>
          
          <div className="hidden md:flex">
            <button
              onClick={openModal}
              className="inline-flex items-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-xl shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Add New Lead
            </button>
          </div>
        </div>

        {/* Stats Overview - Clean & Minimal */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory mb-4">
          <div className="snap-center min-w-[160px] bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Leads</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{dashboardStats.totalLeads}</h3>
            </div>
            <div className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-full">
              <FiTrendingUp className="mr-1" />
              <span>Active</span>
            </div>
          </div>

          <div className="snap-center min-w-[160px] bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-violet-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Conversion</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">
                {dashboardStats.totalLeads > 0 
                  ? ((dashboardStats.statusCounts.converted / dashboardStats.totalLeads) * 100).toFixed(0) 
                  : 0}%
              </h3>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-violet-500 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${dashboardStats.totalLeads > 0 ? (dashboardStats.statusCounts.converted / dashboardStats.totalLeads) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="snap-center min-w-[160px] bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">
                {dashboardStats.statusCounts.new + dashboardStats.statusCounts.followup}
              </h3>
            </div>
            <div className="text-xs text-slate-500">Requires attention</div>
          </div>
        </div>

        {/* Main Grid - Bento Box Style */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {cardData.map((card, index) => {
            const styles = colorStyles[card.color]
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={card.route} className="block h-full">
                  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-slate-200 transition-all duration-300 h-full flex flex-col justify-between group relative overflow-hidden">
                    {/* Top Accent Line */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${styles.accent} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${styles.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                        <card.icon className={`w-5 h-5 ${styles.icon}`} />
                      </div>
                      <div className={`text-2xl font-bold text-slate-900`}>
                        {card.count}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-bold text-slate-800 mb-1 group-hover:text-slate-900 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {card.description}
                      </p>
                    </div>

                    {/* Hover Arrow */}
                    <div className="absolute bottom-4 right-4 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <FiArrowRight className={`w-4 h-4 ${styles.text}`} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </main>

      {/* Premium Floating Action Button (Mobile) */}
      <div className="md:hidden fixed bottom-20 right-6 z-[60]">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={openModal}
          className="w-14 h-14 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-900/30 flex items-center justify-center focus:outline-none"
        >
          <FiPlus className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Refined Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 500 }}
              className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">New Lead</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Enter details to create a lead</p>
                </div>
                <button 
                  onClick={closeModal} 
                  className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiPhone className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="98765 43210"
                      maxLength={10}
                      className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl text-slate-900 font-semibold placeholder:text-slate-400 transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <div className="relative group" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      className="w-full pl-4 pr-4 py-4 text-left bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white text-slate-900 font-semibold flex items-center justify-between outline-none transition-all"
                    >
                      <span className={formData.categoryId ? 'text-slate-900' : 'text-slate-400'}>
                        {formData.categoryId 
                          ? getCategoryInfo(formData.categoryId).name
                          : 'Select Category'
                        }
                      </span>
                      <FiChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showCategoryDropdown && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute z-10 w-full bottom-full mb-2 bg-white border border-slate-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto"
                        >
                          {categories.map((category) => (
                            <button
                              key={category._id}
                              type="button"
                              onClick={() => handleCategoryChange(category._id)}
                              className="w-full px-5 py-3.5 text-left hover:bg-slate-50 transition-colors flex items-center justify-between border-b border-slate-50 last:border-0"
                            >
                              <span className="text-slate-700 font-medium">{category.name}</span>
                              <div 
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: category.color || '#6B7280' }}
                              />
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="pt-2 pb-safe">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-2xl font-bold text-white text-lg shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                      isSubmitting 
                        ? 'bg-slate-400 cursor-not-allowed' 
                        : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20'
                    }`}
                  >
                    {isSubmitting ? 'Creating...' : (
                      <>
                        <FiPlus className="w-5 h-5" />
                        Create Lead
                      </>
                    )}
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

export default CP_leads
