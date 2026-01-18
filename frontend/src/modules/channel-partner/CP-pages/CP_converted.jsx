import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  FiCheckCircle,
  FiSearch,
  FiFilter,
  FiArrowRight,
  FiPhone,
  FiMail,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp
} from 'react-icons/fi'
import CP_navbar from '../CP-components/CP_navbar'
import { cpLeadService } from '../CP-services'
import { useToast } from '../../../contexts/ToastContext'
import Loading from '../../../components/ui/loading'

const CP_converted = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [convertedLeads, setConvertedLeads] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    loadConvertedLeads()
  }, [])

  const loadConvertedLeads = async () => {
    try {
      setLoading(true)
      const response = await cpLeadService.getLeads({ status: 'converted' })
      if (response.success) {
        setConvertedLeads(response.data || [])
        
        // Calculate stats
        const total = response.data?.length || 0
        const totalRevenue = response.data?.reduce((sum, lead) => sum + (lead.value || 0), 0) || 0
        setStats({ total, totalRevenue })
      }
    } catch (error) {
      console.error('Failed to load converted leads:', error)
      toast.error?.(error.message || 'Failed to load converted leads', {
        title: 'Error',
        duration: 4000
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const filteredLeads = convertedLeads.filter(lead => {
    const searchLower = searchTerm.toLowerCase()
    return (
      (lead.name || '').toLowerCase().includes(searchLower) ||
      (lead.phone || '').includes(searchTerm) ||
      (lead.email || '').toLowerCase().includes(searchLower) ||
      (lead.company || '').toLowerCase().includes(searchLower)
    )
  })

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
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiCheckCircle className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xs font-medium text-gray-600 mb-1">Total Converted</h3>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiDollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <h3 className="text-xs font-medium text-gray-600 mb-1">Total Revenue</h3>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </motion.div>
          </div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search converted leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </motion.div>

          {/* Converted Leads List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {filteredLeads.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredLeads.map((lead, index) => (
                  <motion.div
                    key={lead._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      if (lead.convertedToClient) {
                        navigate(`/cp-client-profile/${lead.convertedToClient}`)
                      } else {
                        navigate(`/cp-lead-profile/${lead._id}`)
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {lead.name || lead.phone}
                          </h3>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                            Converted
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
                          {lead.convertedAt && (
                            <div className="flex items-center space-x-1">
                              <FiCalendar className="h-4 w-4" />
                              <span>Converted: {formatDate(lead.convertedAt)}</span>
                            </div>
                          )}
                          {lead.value > 0 && (
                            <div className="flex items-center space-x-1 text-green-600 font-medium">
                              <FiDollarSign className="h-4 w-4" />
                              <span>{formatCurrency(lead.value)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <FiArrowRight className="h-5 w-5 text-gray-400 ml-4" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <FiCheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No converted leads found</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CP_converted
