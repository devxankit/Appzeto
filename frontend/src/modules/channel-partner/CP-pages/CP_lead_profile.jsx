import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { 
  FiArrowLeft,
  FiUser,
  FiPhone,
  FiMail,
  FiBriefcase,
  FiCalendar,
  FiSave,
  FiX,
  FiEdit2,
  FiCheckCircle,
  FiClock,
  FiMessageCircle,
  FiPlus,
  FiActivity,
  FiTag,
  FiDollarSign,
  FiFileText
} from 'react-icons/fi'
import CP_navbar from '../CP-components/CP_navbar'
import { cpLeadService } from '../CP-services'
import { useToast } from '../../../contexts/ToastContext'

const CP_lead_profile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [lead, setLead] = useState(null)
  const [leadProfile, setLeadProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showConnectForm, setShowConnectForm] = useState(false)
  const [showConvertForm, setShowConvertForm] = useState(false)
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [showFollowUpForm, setShowFollowUpForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    priority: 'medium',
    value: '',
    notes: ''
  })

  const [profileFormData, setProfileFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    projectType: { web: false, app: false, taxi: false, other: false },
    estimatedCost: '',
    description: '',
    location: { city: '', state: '', country: 'India' },
    businessType: '',
    quotationSent: false,
    demoSent: false,
    proposalSent: false
  })

  const [connectFormData, setConnectFormData] = useState({
    notes: '',
    nextFollowUpDate: null
  })

  const [convertFormData, setConvertFormData] = useState({
    projectName: '',
    finishedDays: '',
    totalCost: '',
    advanceReceived: '',
    includeGST: false
  })

  const [followUpFormData, setFollowUpFormData] = useState({
    scheduledDate: null,
    scheduledTime: '',
    type: 'call',
    notes: '',
    priority: 'medium'
  })

  useEffect(() => {
    if (id) {
      loadLeadData()
    }
  }, [id])

  const loadLeadData = async () => {
    try {
      setLoading(true)
      const response = await cpLeadService.getLeadById(id)
      if (response.success && response.data) {
        const leadData = response.data
        setLead(leadData)
        setLeadProfile(leadData.leadProfile)
        
        setFormData({
          name: leadData.name || '',
          company: leadData.company || '',
          email: leadData.email || '',
          priority: leadData.priority || 'medium',
          value: leadData.value?.toString() || '',
          notes: leadData.notes || ''
        })

        if (leadData.leadProfile) {
          setProfileFormData({
            name: leadData.leadProfile.name || '',
            businessName: leadData.leadProfile.businessName || '',
            email: leadData.leadProfile.email || '',
            projectType: leadData.leadProfile.projectType || { web: false, app: false, taxi: false, other: false },
            estimatedCost: leadData.leadProfile.estimatedCost?.toString() || '',
            description: leadData.leadProfile.description || '',
            location: leadData.leadProfile.location || { city: '', state: '', country: 'India' },
            businessType: leadData.leadProfile.businessType || '',
            quotationSent: leadData.leadProfile.quotationSent || false,
            demoSent: leadData.leadProfile.demoSent || false,
            proposalSent: leadData.leadProfile.proposalSent || false
          })
        }
      }
    } catch (error) {
      console.error('Failed to load lead:', error)
      toast.error?.(error.message || 'Failed to load lead profile', {
        title: 'Error',
        duration: 4000
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateLead = async () => {
    try {
      setSaving(true)
      const response = await cpLeadService.updateLead(id, {
        name: formData.name || undefined,
        company: formData.company || undefined,
        email: formData.email || undefined,
        priority: formData.priority,
        value: formData.value ? parseFloat(formData.value) : undefined,
        notes: formData.notes || undefined
      })

      if (response.success) {
        toast.success?.('Lead updated successfully!', {
          title: 'Success',
          duration: 3000
        })
        setIsEditing(false)
        loadLeadData()
      }
    } catch (error) {
      console.error('Failed to update lead:', error)
      toast.error?.(error.message || 'Failed to update lead', {
        title: 'Error',
        duration: 4000
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateStatus = async (newStatus, lostReason = null) => {
    try {
      setSaving(true)
      const response = await cpLeadService.updateLeadStatus(id, newStatus, lostReason)
      if (response.success) {
        toast.success?.('Status updated successfully!', {
          title: 'Success',
          duration: 3000
        })
        loadLeadData()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error?.(error.message || 'Failed to update status', {
        title: 'Error',
        duration: 4000
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCreateProfile = async () => {
    try {
      setSaving(true)
      const response = await cpLeadService.createLeadProfile(id, profileFormData)
      if (response.success) {
        toast.success?.('Lead profile created successfully!', {
          title: 'Success',
          duration: 3000
        })
        setShowProfileForm(false)
        loadLeadData()
      }
    } catch (error) {
      console.error('Failed to create profile:', error)
      toast.error?.(error.message || 'Failed to create profile', {
        title: 'Error',
        duration: 4000
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      setSaving(true)
      const response = await cpLeadService.updateLeadProfile(id, profileFormData)
      if (response.success) {
        toast.success?.('Profile updated successfully!', {
          title: 'Success',
          duration: 3000
        })
        setShowProfileForm(false)
        loadLeadData()
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error?.(error.message || 'Failed to update profile', {
        title: 'Error',
        duration: 4000
      })
    } finally {
      setSaving(false)
    }
  }

  const handleConnect = async () => {
    try {
      setSaving(true)
      await handleUpdateStatus('connected')
      if (connectFormData.nextFollowUpDate) {
        await cpLeadService.addFollowUp(id, {
          scheduledDate: connectFormData.nextFollowUpDate,
          scheduledTime: '',
          type: 'call',
          notes: connectFormData.notes,
          priority: 'medium'
        })
      }
      toast.success?.('Lead connected successfully!', {
        title: 'Success',
        duration: 3000
      })
      setShowConnectForm(false)
      setConnectFormData({ notes: '', nextFollowUpDate: null })
      loadLeadData()
    } catch (error) {
      console.error('Failed to connect lead:', error)
      toast.error?.(error.message || 'Failed to connect lead', {
        title: 'Error',
        duration: 4000
      })
    } finally {
      setSaving(false)
    }
  }

  const handleConvert = async () => {
    try {
      setSaving(true)
      const response = await cpLeadService.convertLeadToClient(id, {
        projectName: convertFormData.projectName,
        finishedDays: convertFormData.finishedDays ? parseInt(convertFormData.finishedDays) : undefined,
        totalCost: convertFormData.totalCost ? parseFloat(convertFormData.totalCost) : undefined,
        advanceReceived: convertFormData.advanceReceived ? parseFloat(convertFormData.advanceReceived) : undefined,
        includeGST: convertFormData.includeGST
      })

      if (response.success) {
        toast.success?.('Lead converted to client successfully!', {
          title: 'Success',
          duration: 3000
        })
        setShowConvertForm(false)
        setConvertFormData({
          projectName: '',
          finishedDays: '',
          totalCost: '',
          advanceReceived: '',
          includeGST: false
        })
        navigate('/cp-converted')
      }
    } catch (error) {
      console.error('Failed to convert lead:', error)
      toast.error?.(error.message || 'Failed to convert lead', {
        title: 'Error',
        duration: 4000
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAddFollowUp = async () => {
    if (!followUpFormData.scheduledDate) {
      toast.error?.('Please select a date for follow-up', {
        title: 'Validation Error',
        duration: 4000
      })
      return
    }

    try {
      setSaving(true)
      const response = await cpLeadService.addFollowUp(id, followUpFormData)
      if (response.success) {
        toast.success?.('Follow-up added successfully!', {
          title: 'Success',
          duration: 3000
        })
        setShowFollowUpForm(false)
        setFollowUpFormData({
          scheduledDate: null,
          scheduledTime: '',
          type: 'call',
          notes: '',
          priority: 'medium'
        })
        loadLeadData()
      }
    } catch (error) {
      console.error('Failed to add follow-up:', error)
      toast.error?.(error.message || 'Failed to add follow-up', {
        title: 'Error',
        duration: 4000
      })
    } finally {
      setSaving(false)
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (!lead) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
        <CP_navbar />
        <div className="pt-14 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <p className="text-gray-500">Lead not found</p>
              <button
                onClick={() => navigate('/cp-leads')}
                className="mt-4 text-blue-600 hover:text-blue-700"
              >
                Back to Leads
              </button>
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(lead.status)}`}>
                {lead.status.replace('_', ' ')}
              </span>
              {lead.category && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                  {lead.category.name}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {lead.status !== 'converted' && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowConnectForm(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Connect
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowConvertForm(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Convert
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Lead Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Lead Details</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          loadLeadData()
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleUpdateLead}
                        disabled={saving}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <FiSave className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <p className="text-gray-900 font-medium">{lead.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="text-gray-900 font-medium">{lead.email || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Company</label>
                        <p className="text-gray-900 font-medium">{lead.company || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Priority</label>
                        <p className="text-gray-900 font-medium capitalize">{lead.priority}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Value</label>
                        <p className="text-gray-900 font-medium">₹{lead.value || 0}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Created</label>
                        <p className="text-gray-900 font-medium">{formatDate(lead.createdAt)}</p>
                      </div>
                    </div>
                    {lead.notes && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Notes</label>
                        <p className="text-gray-900">{lead.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Lead Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Lead Profile</h2>
                  <button
                    onClick={() => setShowProfileForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    {leadProfile ? 'Edit Profile' : 'Create Profile'}
                  </button>
                </div>

                {leadProfile ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Business Name</label>
                        <p className="text-gray-900 font-medium">{leadProfile.businessName || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Business Type</label>
                        <p className="text-gray-900 font-medium">{leadProfile.businessType || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Location</label>
                        <p className="text-gray-900 font-medium">
                          {leadProfile.location ? 
                            `${leadProfile.location.city || ''}${leadProfile.location.city && leadProfile.location.state ? ', ' : ''}${leadProfile.location.state || ''}`.trim() || 'N/A'
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Estimated Cost</label>
                        <p className="text-gray-900 font-medium">₹{leadProfile.estimatedCost || 0}</p>
                      </div>
                    </div>
                    {leadProfile.description && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Description</label>
                        <p className="text-gray-900">{leadProfile.description}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {leadProfile.projectType?.web && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Web</span>
                      )}
                      {leadProfile.projectType?.app && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">App</span>
                      )}
                      {leadProfile.projectType?.taxi && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Taxi</span>
                      )}
                      {leadProfile.projectType?.other && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Other</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FiUser className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No profile created yet</p>
                    <button
                      onClick={() => setShowProfileForm(true)}
                      className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Create Profile
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Follow-ups Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Follow-ups</h2>
                  <button
                    onClick={() => setShowFollowUpForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2"
                  >
                    <FiPlus className="h-4 w-4" />
                    <span>Add Follow-up</span>
                  </button>
                </div>

                {lead.followUps && lead.followUps.length > 0 ? (
                  <div className="space-y-3">
                    {lead.followUps.map((followUp, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <FiCalendar className="h-4 w-4 text-gray-500" />
                            <span className="font-medium text-gray-900">
                              {formatDate(followUp.scheduledDate)}
                            </span>
                            {followUp.scheduledTime && (
                              <span className="text-gray-600">{followUp.scheduledTime}</span>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            followUp.status === 'completed' ? 'bg-green-100 text-green-700' :
                            followUp.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {followUp.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="capitalize">{followUp.type}</span>
                          {followUp.notes && (
                            <p className="mt-1">{followUp.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FiCalendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No follow-ups scheduled</p>
                  </div>
                )}
              </motion.div>

              {/* Activity Log */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Activity Log</h2>
                {lead.activities && lead.activities.length > 0 ? (
                  <div className="space-y-4">
                    {lead.activities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-200 last:border-0">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <FiActivity className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDateTime(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FiActivity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No activity recorded</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleUpdateStatus('connected')}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Mark as Connected
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('followup')}
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                  >
                    Mark as Follow-up
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('not_converted')}
                    className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                  >
                    Mark as Not Converted
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Enter reason for marking as lost:')
                      if (reason) {
                        handleUpdateStatus('lost', reason)
                      }
                    }}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Mark as Lost
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Connect Lead Modal */}
      <AnimatePresence>
        {showConnectForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConnectForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Connect Lead</h2>
                <button
                  onClick={() => setShowConnectForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={connectFormData.notes}
                    onChange={(e) => setConnectFormData({ ...connectFormData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add notes about the connection..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next Follow-up Date</label>
                  <DatePicker
                    selected={connectFormData.nextFollowUpDate}
                    onChange={(date) => setConnectFormData({ ...connectFormData, nextFollowUpDate: date })}
                    dateFormat="MMM dd, yyyy"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholderText="Select date"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowConnectForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConnect}
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Convert Lead Modal */}
      <AnimatePresence>
        {showConvertForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConvertForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Convert to Client</h2>
                <button
                  onClick={() => setShowConvertForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={convertFormData.projectName}
                    onChange={(e) => setConvertFormData({ ...convertFormData, projectName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Finished Days</label>
                  <input
                    type="number"
                    value={convertFormData.finishedDays}
                    onChange={(e) => setConvertFormData({ ...convertFormData, finishedDays: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Days"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Cost (₹)</label>
                  <input
                    type="number"
                    value={convertFormData.totalCost}
                    onChange={(e) => setConvertFormData({ ...convertFormData, totalCost: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advance Received (₹)</label>
                  <input
                    type="number"
                    value={convertFormData.advanceReceived}
                    onChange={(e) => setConvertFormData({ ...convertFormData, advanceReceived: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={convertFormData.includeGST}
                    onChange={(e) => setConvertFormData({ ...convertFormData, includeGST: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Include GST</label>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowConvertForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConvert}
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Converting...' : 'Convert'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Profile Form Modal */}
      <AnimatePresence>
        {showProfileForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowProfileForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {leadProfile ? 'Edit Lead Profile' : 'Create Lead Profile'}
                </h2>
                <button
                  onClick={() => setShowProfileForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      value={profileFormData.name}
                      onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                    <input
                      type="text"
                      value={profileFormData.businessName}
                      onChange={(e) => setProfileFormData({ ...profileFormData, businessName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileFormData.email}
                      onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                    <select
                      value={profileFormData.businessType}
                      onChange={(e) => setProfileFormData({ ...profileFormData, businessType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select type</option>
                      <option value="Startup">Startup</option>
                      <option value="SME">SME</option>
                      <option value="Enterprise">Enterprise</option>
                      <option value="Individual">Individual</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={profileFormData.location.city}
                      onChange={(e) => setProfileFormData({
                        ...profileFormData,
                        location: { ...profileFormData.location, city: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      value={profileFormData.location.state}
                      onChange={(e) => setProfileFormData({
                        ...profileFormData,
                        location: { ...profileFormData.location, state: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cost (₹)</label>
                    <input
                      type="number"
                      value={profileFormData.estimatedCost}
                      onChange={(e) => setProfileFormData({ ...profileFormData, estimatedCost: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileFormData.projectType.web}
                        onChange={(e) => setProfileFormData({
                          ...profileFormData,
                          projectType: { ...profileFormData.projectType, web: e.target.checked }
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Web</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileFormData.projectType.app}
                        onChange={(e) => setProfileFormData({
                          ...profileFormData,
                          projectType: { ...profileFormData.projectType, app: e.target.checked }
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">App</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileFormData.projectType.taxi}
                        onChange={(e) => setProfileFormData({
                          ...profileFormData,
                          projectType: { ...profileFormData.projectType, taxi: e.target.checked }
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Taxi</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileFormData.projectType.other}
                        onChange={(e) => setProfileFormData({
                          ...profileFormData,
                          projectType: { ...profileFormData.projectType, other: e.target.checked }
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Other</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={profileFormData.description}
                    onChange={(e) => setProfileFormData({ ...profileFormData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowProfileForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={leadProfile ? handleUpdateProfile : handleCreateProfile}
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : leadProfile ? 'Update Profile' : 'Create Profile'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Follow-up Form Modal */}
      <AnimatePresence>
        {showFollowUpForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowFollowUpForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Add Follow-up</h2>
                <button
                  onClick={() => setShowFollowUpForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <DatePicker
                    selected={followUpFormData.scheduledDate}
                    onChange={(date) => setFollowUpFormData({ ...followUpFormData, scheduledDate: date })}
                    dateFormat="MMM dd, yyyy"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholderText="Select date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={followUpFormData.scheduledTime}
                    onChange={(e) => setFollowUpFormData({ ...followUpFormData, scheduledTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={followUpFormData.type}
                    onChange={(e) => setFollowUpFormData({ ...followUpFormData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="meeting">Meeting</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="visit">Visit</option>
                    <option value="demo">Demo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={followUpFormData.priority}
                    onChange={(e) => setFollowUpFormData({ ...followUpFormData, priority: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={followUpFormData.notes}
                    onChange={(e) => setFollowUpFormData({ ...followUpFormData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowFollowUpForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddFollowUp}
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Adding...' : 'Add Follow-up'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CP_lead_profile
