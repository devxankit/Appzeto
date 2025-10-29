import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { 
  FiPhone, 
  FiPlus,
  FiUser,
  FiSave,
  FiMessageCircle,
  FiEdit3,
  FiPlay,
  FiX,
  FiArrowLeft,
  FiCheck,
  FiRefreshCw,
  FiFolder,
  FiCalendar,
  FiFileText,
  FiDollarSign,
  FiImage,
  FiUpload,
  FiClock,
  FiSend,
  FiMapPin,
  FiVideo,
  FiLoader,
  FiGlobe,
  FiSmartphone,
  FiTruck,
  FiAlertCircle,
  FiUsers,
  FiCheckCircle
} from 'react-icons/fi'
import SL_navbar from '../SL-components/SL_navbar'
import FollowUpDialog from '../SL-components/FollowUpDialog'
import { ConnectedLeadForm } from '../SL-components/ConnectedLeadForm'
import { salesLeadService } from '../SL-services'
import { useToast } from '../../../contexts/ToastContext'

const SL_leadProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  // State management
  const [lead, setLead] = useState(null)
  const [leadProfile, setLeadProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Status management (single-select)
  const [selectedStatus, setSelectedStatus] = useState('')
  
  // Dialog states
  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false)
  const [showConnectedForm, setShowConnectedForm] = useState(false)
  const [showNotesDialog, setShowNotesDialog] = useState(false)
  const [showDemoDialog, setShowDemoDialog] = useState(false)
  const [showLostDialog, setShowLostDialog] = useState(false)
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [showConvertDialog, setShowConvertDialog] = useState(false)
  
  // Form states
  const [notes, setNotes] = useState('')
  const [demoData, setDemoData] = useState({
    clientName: '',
    description: '',
    reference: '',
    mobileNumber: ''
  })
  const [lostReason, setLostReason] = useState('')
  const [transferData, setTransferData] = useState({
    toSalesId: '',
    reason: ''
  })
  const [salesTeam, setSalesTeam] = useState([])
  const [conversionData, setConversionData] = useState({
    projectName: '',
    mobileNo: '',
    finishedDays: '',
    web: false,
    app: false,
    description: '',
    totalCost: '',
    advanceReceived: '',
    includeGST: false
  })

  useEffect(() => {
    if (id) fetchLeadData()
  }, [id])

  const fetchLeadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await salesLeadService.getLeadDetail(id)
      if (response.success) {
        setLead(response.data)
        setLeadProfile(response.data.leadProfile)
        setSelectedStatus(response.data.status)

        const lp = response.data.leadProfile
        setDemoData({
          clientName: lp?.name || response.data.name || '',
          mobileNumber: response.data.phone || '',
          description: '',
          reference: ''
        })
        setConversionData({
          projectName: lp?.businessName || '',
          mobileNo: response.data.phone || '',
          finishedDays: '',
          web: lp?.projectType?.web || false,
          app: lp?.projectType?.app || false,
          description: lp?.description || '',
          totalCost: lp?.estimatedCost?.toString() || '',
          advanceReceived: '',
          includeGST: false
        })
      } else {
        setError(response.message || 'Failed to fetch lead data')
      }
    } catch (err) {
      console.error('Error fetching lead data:', err)
      setError('Failed to fetch lead data')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSalesTeam = async () => {
    try {
      const team = await salesLeadService.getSalesTeam()
      setSalesTeam(team)
    } catch (err) {
      console.error('Error fetching sales team:', err)
      toast.error('Failed to fetch sales team')
    }
  }

  const handleStatusChange = (status) => setSelectedStatus(status)

  const handleSaveStatus = async () => {
    if (!selectedStatus || !lead || selectedStatus === lead.status) return
    setIsSaving(true)
    try {
      await salesLeadService.updateLeadStatus(id, selectedStatus)
      setLead(prev => ({ ...prev, status: selectedStatus }))
      toast.success('Status updated successfully')
      if (window.refreshDashboardStats) window.refreshDashboardStats()
    } catch (err) {
      console.error('Error updating status:', err)
      toast.error('Failed to update status')
    } finally {
      setIsSaving(false)
    }
  }

  const handleFollowUpSubmit = async (followUpData) => {
    try {
      await salesLeadService.updateLeadStatus(id, 'followup', followUpData)
      toast.success('Follow-up scheduled successfully')
      setShowFollowUpDialog(false)
      fetchLeadData()
      if (window.refreshDashboardStats) window.refreshDashboardStats()
    } catch (err) {
      console.error('Error scheduling follow-up:', err)
      toast.error('Failed to schedule follow-up')
    }
  }

  const handleConnectedFormSubmit = async (profileData) => {
    try {
      await salesLeadService.updateLeadStatus(id, 'connected')
      await salesLeadService.createLeadProfile(id, profileData)
      toast.success('Lead marked as connected and profile created')
      setShowConnectedForm(false)
      fetchLeadData()
      if (window.refreshDashboardStats) window.refreshDashboardStats()
    } catch (err) {
      console.error('Error creating profile:', err)
      toast.error('Failed to create profile')
    }
  }

  const handleAddNote = async () => {
    if (!notes.trim()) {
      toast.error('Please enter a note')
      return
    }
    try {
      await salesLeadService.addNoteToLead(id, { content: notes.trim() })
      toast.success('Note added successfully')
      setNotes('')
      setShowNotesDialog(false)
      fetchLeadData()
    } catch (err) {
      console.error('Error adding note:', err)
      toast.error('Failed to add note')
    }
  }

  const handleDemoRequest = async () => {
    if (!demoData.clientName.trim()) {
      toast.error('Please enter client name')
      return
    }
    try {
      await salesLeadService.requestDemo(id, demoData)
      toast.success('Demo request submitted successfully')
      setShowDemoDialog(false)
      setDemoData({ clientName: '', description: '', reference: '', mobileNumber: '' })
      fetchLeadData()
      if (window.refreshDashboardStats) window.refreshDashboardStats()
    } catch (err) {
      console.error('Error requesting demo:', err)
      toast.error('Failed to request demo')
    }
  }

  const handleLostStatus = async () => {
    try {
      await salesLeadService.updateLeadStatus(id, 'lost', { lostReason: lostReason.trim() })
      toast.success('Lead marked as lost')
      setShowLostDialog(false)
      setLostReason('')
      fetchLeadData()
      if (window.refreshDashboardStats) window.refreshDashboardStats()
    } catch (err) {
      console.error('Error marking as lost:', err)
      toast.error('Failed to mark as lost')
    }
  }

  const handleLeadTransfer = async () => {
    if (!transferData.toSalesId) {
      toast.error('Please select a sales employee')
      return
    }
    try {
      await salesLeadService.transferLead(id, transferData)
      toast.success('Lead transferred successfully')
      setShowTransferDialog(false)
      setTransferData({ toSalesId: '', reason: '' })
      navigate('/leads')
      if (window.refreshDashboardStats) window.refreshDashboardStats()
    } catch (err) {
      console.error('Error transferring lead:', err)
      toast.error('Failed to transfer lead')
    }
  }

  const handleLeadConversion = async () => {
    if (!conversionData.projectName.trim() || !conversionData.totalCost.trim()) {
      toast.error('Please fill in required fields')
      return
    }
    try {
      await salesLeadService.convertLeadToClient(id, conversionData)
      toast.success('Lead converted to client successfully')
      setShowConvertDialog(false)
      navigate('/leads')
      if (window.refreshDashboardStats) window.refreshDashboardStats()
    } catch (err) {
      console.error('Error converting lead:', err)
      toast.error('Failed to convert lead')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <SL_navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FiLoader className="w-8 h-8 animate-spin text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading lead profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <SL_navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FiAlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/leads')}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Back to Leads
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <SL_navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FiUser className="w-8 h-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Lead not found</p>
            <button
              onClick={() => navigate('/leads')}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Back to Leads
            </button>
          </div>
        </div>
      </div>
    )
  }

  const displayName = leadProfile?.name || lead.name || 'Unknown'
  const displayPhone = lead.phone || 'N/A'
  const displayBusiness = leadProfile?.businessName || lead.company || 'N/A'
  const displayCost = leadProfile?.estimatedCost || 'N/A'
  const displayEmail = leadProfile?.email || 'N/A'
  const displayDescription = leadProfile?.description || 'No description available'

  const statusOptions = [
    { value: 'quotation_sent', label: 'Quotation Sent', color: 'blue' },
    { value: 'dq_sent', label: 'D&Q Sent', color: 'purple' },
    { value: 'app_client', label: 'App Client', color: 'indigo' },
    { value: 'web', label: 'Web', color: 'cyan' },
    { value: 'hot', label: 'Hot Lead', color: 'red' },
    { value: 'demo_requested', label: 'Demo Requested', color: 'teal' },
    { value: 'converted', label: 'Converted', color: 'green' },
    { value: 'lost', label: 'Lost', color: 'gray' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <SL_navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-20">
        <div className="mb-8">
          <button
            onClick={() => navigate('/leads')}
            className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 mb-4 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Leads</span>
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{displayName}</h1>
              <p className="text-gray-600 mt-1">{displayBusiness}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                lead.status === 'connected' ? 'bg-green-100 text-green-800' :
                lead.status === 'hot' ? 'bg-red-100 text-red-800' :
                lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                lead.status === 'lost' ? 'bg-gray-100 text-gray-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {salesLeadService.getStatusDisplayName(lead.status)}
              </span>
            </div>
          </div>
        </div>

        {!leadProfile && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FiAlertCircle className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="text-sm font-medium text-amber-800">Profile Not Created</h3>
                  <p className="text-sm text-amber-700">Create a profile to access full functionality</p>
                </div>
              </div>
              <button
                onClick={() => setShowConnectedForm(true)}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
              >
                Create Profile
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Client Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors"
                >
                  <FiEdit3 className="w-4 h-4" />
                  <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-600 font-bold text-lg">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{displayName}</p>
                      <p className="text-sm text-gray-500">Lead ID: {lead._id}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <div className="flex items-center space-x-2">
                    <FiPhone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{displayPhone}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business</label>
                  <div className="flex items-center space-x-2">
                    <FiFolder className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{displayBusiness}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="flex items-center space-x-2">
                    <FiUser className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{displayEmail}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cost</label>
                  <div className="flex items-center space-x-2">
                    <FiDollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">₹{displayCost}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <p className="text-gray-900 text-sm">{displayDescription}</p>
                </div>
              </div>

              {leadProfile?.projectType && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Project Type</label>
                  <div className="flex flex-wrap gap-3">
                    {leadProfile.projectType.web && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <FiGlobe className="w-4 h-4 mr-1" />
                        Web
                      </span>
                    )}
                    {leadProfile.projectType.app && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <FiSmartphone className="w-4 h-4 mr-1" />
                        App
                      </span>
                    )}
                    {leadProfile.projectType.taxi && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        <FiTruck className="w-4 h-4 mr-1" />
                        Taxi
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Status Management</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Current Status</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {statusOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedStatus === option.value
                            ? `border-${option.color}-500 bg-${option.color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={option.value}
                          checked={selectedStatus === option.value}
                          onChange={(e) => handleStatusChange(e.target.value)}
                          className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                        />
                        <span className={`text-sm font-medium ${
                          selectedStatus === option.value ? `text-${option.color}-700` : 'text-gray-700'
                        }`}>
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {selectedStatus !== lead.status && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveStatus}
                      disabled={isSaving}
                      className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      {isSaving ? (
                        <FiLoader className="w-4 h-4 animate-spin" />
                      ) : (
                        <FiSave className="w-4 h-4" />
                      )}
                      <span>{isSaving ? 'Saving...' : 'Save Status'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {leadProfile?.notes && leadProfile.notes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Notes</h2>
                <div className="space-y-4">
                  {leadProfile.notes.map((note, index) => (
                    <div key={index} className="border-l-4 border-teal-500 pl-4 py-2">
                      <p className="text-gray-900">{note.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">
                          By: {note.addedBy?.name || 'Unknown'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Actions</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowFollowUpDialog(true)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FiCalendar className="w-4 h-4" />
                  <span>Add Follow Up</span>
                </button>

                <button
                  onClick={() => setShowNotesDialog(true)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <FiMessageCircle className="w-4 h-4" />
                  <span>Add Notes</span>
                </button>

                <button
                  onClick={() => setShowDemoDialog(true)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <FiPlay className="w-4 h-4" />
                  <span>Request Demo</span>
                </button>

                <button
                  onClick={() => setShowLostDialog(true)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                  <span>Lost</span>
                </button>

                <button
                  onClick={() => { fetchSalesTeam(); setShowTransferDialog(true) }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <FiUsers className="w-4 h-4" />
                  <span>Transfer Lead</span>
                </button>

                <button
                  onClick={() => setShowConvertDialog(true)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <FiCheckCircle className="w-4 h-4" />
                  <span>Converted</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Lead Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created</label>
                  <p className="text-gray-900">{new Date(lead.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Contact</label>
                  <p className="text-gray-900">{lead.lastContactDate ? new Date(lead.lastContactDate).toLocaleDateString() : 'Never'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                  <p className="text-gray-900">{lead.assignedTo?.name || 'Unassigned'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <p className="text-gray-900">{lead.category?.name || 'No category'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FollowUpDialog
        isOpen={showFollowUpDialog}
        onClose={() => setShowFollowUpDialog(false)}
        onSubmit={handleFollowUpSubmit}
        leadId={id}
      />

      <ConnectedLeadForm
        isOpen={showConnectedForm}
        onClose={() => setShowConnectedForm(false)}
        leadId={id}
        onSubmit={handleConnectedFormSubmit}
        title="Create Lead Profile"
        submitText="Create Profile"
      />

      <AnimatePresence>
        {showNotesDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl"
            >
              <div className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 p-6 text-white relative">
                <button
                  onClick={() => setShowNotesDialog(false)}
                  className="absolute top-6 left-6 p-2 hover:bg-green-600/50 rounded-full transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
                <h2 className="text-xl font-bold text-center">Add Note</h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Note Content</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Enter your note here..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowNotesDialog(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddNote}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDemoDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl"
            >
              <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 p-6 text-white relative">
                <button
                  onClick={() => setShowDemoDialog(false)}
                  className="absolute top-6 left-6 p-2 hover:bg-purple-600/50 rounded-full transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
                <h2 className="text-xl font-bold text-center">Request Demo</h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={demoData.clientName}
                      onChange={(e) => setDemoData({ ...demoData, clientName: e.target.value })}
                      placeholder="Enter client name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      value={demoData.mobileNumber}
                      onChange={(e) => setDemoData({ ...demoData, mobileNumber: e.target.value })}
                      placeholder="Enter mobile number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={demoData.description}
                      onChange={(e) => setDemoData({ ...demoData, description: e.target.value })}
                      placeholder="Enter demo description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
                    <input
                      type="text"
                      value={demoData.reference}
                      onChange={(e) => setDemoData({ ...demoData, reference: e.target.value })}
                      placeholder="Enter reference"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDemoDialog(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDemoRequest}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Request Demo
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLostDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl"
            >
              <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 p-6 text-white relative">
                <button
                  onClick={() => setShowLostDialog(false)}
                  className="absolute top-6 left-6 p-2 hover:bg-red-600/50 rounded-full transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
                <h2 className="text-xl font-bold text-center">Mark as Lost</h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason (Optional)</label>
                    <textarea
                      value={lostReason}
                      onChange={(e) => setLostReason(e.target.value)}
                      placeholder="Enter reason for marking as lost..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowLostDialog(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLostStatus}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Mark as Lost
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTransferDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl"
            >
              <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 p-6 text-white relative">
                <button
                  onClick={() => setShowTransferDialog(false)}
                  className="absolute top-6 left-6 p-2 hover:bg-orange-600/50 rounded-full transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
                <h2 className="text-xl font-bold text-center">Transfer Lead</h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Sales Employee <span className="text-red-500">*</span></label>
                    <select
                      value={transferData.toSalesId}
                      onChange={(e) => setTransferData({ ...transferData, toSalesId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select sales employee</option>
                      {salesTeam.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name} ({member.department || 'Sales'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason (Optional)</label>
                    <textarea
                      value={transferData.reason}
                      onChange={(e) => setTransferData({ ...transferData, reason: e.target.value })}
                      placeholder="Enter reason for transfer..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowTransferDialog(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLeadTransfer}
                      className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Transfer Lead
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConvertDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 p-6 text-white relative">
                <button
                  onClick={() => setShowConvertDialog(false)}
                  className="absolute top-6 left-6 p-2 hover:bg-green-600/50 rounded-full transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
                <h2 className="text-xl font-bold text-center">Convert to Client</h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={conversionData.projectName}
                      onChange={(e) => setConversionData({ ...conversionData, projectName: e.target.value })}
                      placeholder="Enter project name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      value={conversionData.mobileNo}
                      onChange={(e) => setConversionData({ ...conversionData, mobileNo: e.target.value })}
                      placeholder="Enter mobile number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Finished Days</label>
                    <input
                      type="number"
                      value={conversionData.finishedDays}
                      onChange={(e) => setConversionData({ ...conversionData, finishedDays: e.target.value })}
                      placeholder="Enter estimated days"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={conversionData.web}
                          onChange={(e) => setConversionData({ ...conversionData, web: e.target.checked })}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Web</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={conversionData.app}
                          onChange={(e) => setConversionData({ ...conversionData, app: e.target.checked })}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">App</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={conversionData.description}
                      onChange={(e) => setConversionData({ ...conversionData, description: e.target.value })}
                      placeholder="Enter project description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Cost <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      value={conversionData.totalCost}
                      onChange={(e) => setConversionData({ ...conversionData, totalCost: e.target.value })}
                      placeholder="Enter total cost"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Advance Received</label>
                    <input
                      type="number"
                      value={conversionData.advanceReceived}
                      onChange={(e) => setConversionData({ ...conversionData, advanceReceived: e.target.value })}
                      placeholder="Enter advance amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={conversionData.includeGST}
                        onChange={(e) => setConversionData({ ...conversionData, includeGST: e.target.checked })}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Include GST</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowConvertDialog(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLeadConversion}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Convert to Client
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SL_leadProfile