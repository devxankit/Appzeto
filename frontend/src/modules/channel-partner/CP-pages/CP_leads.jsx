import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  FiPlus, 
  FiUsers, 
  FiSearch, 
  FiFilter,
  FiX,
  FiPhone,
  FiMail,
  FiBriefcase,
  FiCalendar,
  FiArrowRight,
  FiSettings
} from 'react-icons/fi'
import CP_navbar from '../CP-components/CP_navbar'
import { cpLeadService } from '../CP-services'
import { useToast } from '../../../contexts/ToastContext'

const CP_leads = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [leads, setLeads] = useState([])
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    company: '',
    email: '',
    category: '',
    priority: 'medium',
    value: '',
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [statusFilter, priorityFilter, categoryFilter])

  const loadData = async () => {
    try {
      setLoading(true)
      const [leadsRes, categoriesRes] = await Promise.all([
        cpLeadService.getLeads({
          status: statusFilter !== 'all' ? statusFilter : undefined,
          priority: priorityFilter !== 'all' ? priorityFilter : undefined,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          search: searchTerm || undefined
        }),
        cpLeadService.getLeadCategories()
      ])
      setLeads(leadsRes.data || [])
      setCategories(categoriesRes.data || [])
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error?.('Failed to load leads. Please try again.', {
        title: 'Error',
        duration: 4000
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    loadData()
  }

  const handleAddLead = async (e) => {
    e.preventDefault()
    
    if (!formData.phone || !formData.category) {
      toast.error?.('Phone number and category are required', {
        title: 'Validation Error',
        duration: 4000
      })
      return
    }

    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(formData.phone)) {
      toast.error?.('Please enter a valid 10-digit phone number', {
        title: 'Validation Error',
        duration: 4000
      })
      return
    }

    try {
      setSubmitting(true)
      const response = await cpLeadService.createLead({
        phone: formData.phone,
        name: formData.name || undefined,
        company: formData.company || undefined,
        email: formData.email || undefined,
        category: formData.category,
        priority: formData.priority,
        value: formData.value ? parseFloat(formData.value) : 0,
        notes: formData.notes || undefined
      })

      if (response.success) {
        toast.success?.('Lead created successfully!', {
          title: 'Success',
          duration: 3000
        })
        setShowAddModal(false)
        setFormData({
          phone: '',
          name: '',
          company: '',
          email: '',
          category: '',
          priority: 'medium',
          value: '',
          notes: ''
        })
        loadData()
      }
    } catch (error) {
      console.error('Error creating lead:', error)
      toast.error?.(error.message || 'Failed to create lead', {
        title: 'Error',
        duration: 4000
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-700 border-blue-200',
      connected: 'bg-green-100 text-green-700 border-green-200',
      followup: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      not_converted: 'bg-orange-100 text-orange-700 border-orange-200',
      not_picked: 'bg-gray-100 text-gray-700 border-gray-200',
      converted: 'bg-purple-100 text-purple-700 border-purple-200',
      lost: 'bg-red-100 text-red-700 border-red-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-gray-100 text-gray-700'
    }
    return colors[priority] || 'bg-gray-100 text-gray-700'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
        <CP_navbar />
        <div className="pt-14 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <CP_navbar />
      
      <div className="pt-14 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 pt-6">
          {/* Two Cards on Top */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add New Lead Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white cursor-pointer"
              onClick={() => setShowAddModal(true)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Add New Lead</h3>
                  <p className="text-blue-100 text-sm">Create a new lead for your channel</p>
                </div>
                <div className="p-4 bg-white/20 rounded-full">
                  <FiPlus className="h-8 w-8" />
                </div>
              </div>
            </motion.div>

            {/* Lead Management Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 cursor-pointer"
              onClick={() => navigate('/cp-lead-management')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Lead Management</h3>
                  <p className="text-gray-600 text-sm">Manage shared leads with sales team</p>
                </div>
                <div className="p-4 bg-purple-100 rounded-full">
                  <FiSettings className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="connected">Connected</option>
                <option value="followup">Follow-up</option>
                <option value="not_converted">Not Converted</option>
                <option value="not_picked">Not Picked</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Leads List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {leads.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {leads.map((lead, index) => (
                  <motion.div
                    key={lead._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/cp-lead-profile/${lead._id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {lead.name || lead.phone}
                          </h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(lead.status)}`}>
                            {lead.status.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                            {lead.priority}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          {lead.phone && (
                            <div className="flex items-center space-x-1">
                              <FiPhone className="h-4 w-4" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                          {lead.email && (
                            <div className="flex items-center space-x-1">
                              <FiMail className="h-4 w-4" />
                              <span>{lead.email}</span>
                            </div>
                          )}
                          {lead.company && (
                            <div className="flex items-center space-x-1">
                              <FiBriefcase className="h-4 w-4" />
                              <span>{lead.company}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <FiCalendar className="h-4 w-4" />
                            <span>{formatDate(lead.createdAt)}</span>
                          </div>
                        </div>
                        {lead.category && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                              {lead.category.name}
                            </span>
                          </div>
                        )}
                      </div>
                      <FiArrowRight className="h-5 w-5 text-gray-400 ml-4" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <FiUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No leads found</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Add New Lead</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleAddLead} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="10-digit phone number"
                    maxLength={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Lead name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Company name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Value (₹)</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Creating...' : 'Create Lead'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CP_leads
