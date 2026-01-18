import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  FiArrowLeft,
  FiUsers,
  FiShare2,
  FiX,
  FiPhone,
  FiMail,
  FiBriefcase,
  FiCalendar,
  FiArrowRight,
  FiCheckCircle,
  FiUser
} from 'react-icons/fi'
import CP_navbar from '../CP-components/CP_navbar'
import { cpLeadService } from '../CP-services'
import { useToast } from '../../../contexts/ToastContext'

const CP_lead_management = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('my-leads')
  const [myLeads, setMyLeads] = useState([])
  const [sharedWithSales, setSharedWithSales] = useState([])
  const [sharedFromSales, setSharedFromSales] = useState([])
  const [showShareModal, setShowShareModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [salesTeamLeads, setSalesTeamLeads] = useState([])
  const [selectedSalesId, setSelectedSalesId] = useState('')

  useEffect(() => {
    loadData()
    if (showShareModal) {
      loadSalesTeamLeads()
    }
  }, [activeTab, showShareModal])

  const loadSalesTeamLeads = async () => {
    try {
      const response = await cpLeadService.getSalesTeamLeads()
      setSalesTeamLeads(response.data || [])
    } catch (error) {
      console.error('Failed to load sales team leads:', error)
    }
  }

  const loadData = async () => {
    try {
      setLoading(true)
      if (activeTab === 'my-leads') {
        const response = await cpLeadService.getLeads()
        setMyLeads(response.data || [])
      } else if (activeTab === 'shared-with') {
        const response = await cpLeadService.getSharedLeadsWithSales()
        setSharedWithSales(response.data || [])
      } else if (activeTab === 'shared-from') {
        const response = await cpLeadService.getSharedLeadsFromSales()
        setSharedFromSales(response.data || [])
      }
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

  const handleShare = async () => {
    if (!selectedSalesId) {
      toast.error?.('Please select a Sales Team Lead', {
        title: 'Validation Error',
        duration: 4000
      })
      return
    }

    try {
      const response = await cpLeadService.shareLeadWithSales(selectedLead._id, selectedSalesId)
      if (response.success) {
        toast.success?.('Lead shared successfully!', {
          title: 'Success',
          duration: 3000
        })
        setShowShareModal(false)
        setSelectedLead(null)
        setSelectedSalesId('')
        loadData()
      }
    } catch (error) {
      console.error('Error sharing lead:', error)
      toast.error?.(error.message || 'Failed to share lead', {
        title: 'Error',
        duration: 4000
      })
    }
  }

  const handleUnshare = async (leadId, salesId) => {
    try {
      const response = await cpLeadService.unshareLeadWithSales(leadId, salesId)
      if (response.success) {
        toast.success?.('Lead unshared successfully!', {
          title: 'Success',
          duration: 3000
        })
        loadData()
      }
    } catch (error) {
      console.error('Error unsharing lead:', error)
      toast.error?.(error.message || 'Failed to unshare lead', {
        title: 'Error',
        duration: 4000
      })
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

  const tabs = [
    { id: 'my-leads', label: 'My Leads', count: myLeads.length },
    { id: 'shared-with', label: 'Shared with Sales', count: sharedWithSales.length },
    { id: 'shared-from', label: 'Shared from Sales', count: sharedFromSales.length }
  ]

  const currentLeads = activeTab === 'my-leads' ? myLeads : 
                      activeTab === 'shared-with' ? sharedWithSales : 
                      sharedFromSales

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <CP_navbar />
      
      <div className="pt-14 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 pt-6">
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-1"
          >
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>{tab.label}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Leads List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {currentLeads.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {currentLeads.map((lead, index) => (
                  <motion.div
                    key={lead._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="p-4 hover:bg-gray-50 transition-colors"
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
                          <div className="flex items-center space-x-1">
                            <FiCalendar className="h-4 w-4" />
                            <span>{formatDate(lead.createdAt)}</span>
                          </div>
                        </div>
                        {activeTab === 'shared-with' && lead.sharedWithSales && lead.sharedWithSales.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {lead.sharedWithSales.map((share, idx) => (
                              <div key={idx} className="flex items-center space-x-1 px-2 py-1 bg-blue-50 rounded text-xs text-blue-700">
                                <FiUser className="h-3 w-3" />
                                <span>{share.salesId?.name || 'Sales Lead'}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleUnshare(lead._id, share.salesId?._id)
                                  }}
                                  className="ml-1 hover:text-red-600"
                                >
                                  <FiX className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {activeTab === 'shared-from' && lead.sharedFromSales && lead.sharedFromSales.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {lead.sharedFromSales.map((share, idx) => (
                              <div key={idx} className="flex items-center space-x-1 px-2 py-1 bg-green-50 rounded text-xs text-green-700">
                                <FiUser className="h-3 w-3" />
                                <span>Shared by {share.sharedBy?.name || 'Sales Lead'}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {activeTab === 'my-leads' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedLead(lead)
                              setShowShareModal(true)
                            }}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Share with Sales"
                          >
                            <FiShare2 className="h-5 w-5" />
                          </motion.button>
                        )}
                        <button
                          onClick={() => navigate(`/cp-lead-profile/${lead._id}`)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <FiArrowRight className="h-5 w-5" />
                        </button>
                      </div>
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

      {/* Share Modal */}
      {showShareModal && selectedLead && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowShareModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Share Lead</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Share <strong>{selectedLead.name || selectedLead.phone}</strong> with a Sales Team Lead
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Sales Team Lead
              </label>
              <select
                value={selectedSalesId}
                onChange={(e) => setSelectedSalesId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a Sales Team Lead</option>
                {salesTeamLeads.map((sales) => (
                  <option key={sales._id} value={sales._id}>
                    {sales.name} {sales.email ? `(${sales.email})` : ''}
                  </option>
                ))}
              </select>
              {salesTeamLeads.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  No Sales Team Leads available
                </p>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Share
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default CP_lead_management
