import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Admin_navbar from '../admin-components/Admin_navbar'
import Admin_sidebar from '../admin-components/Admin_sidebar'
import CloudinaryUpload from '../../../components/ui/cloudinary-upload'
import { 
  Users, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Phone,
  Mail,
  Calendar,
  Building2,
  TrendingUp,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Handshake,
  DollarSign
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import Loading from '../../../components/ui/loading'
import { adminChannelPartnerService } from '../admin-services'
import { useToast } from '../../../contexts/ToastContext'

const Admin_channel_partner_management = () => {
  const [loading, setLoading] = useState(true)
  const [partnersLoading, setPartnersLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    status: 'active',
    dateOfBirth: '',
    gender: '',
    joiningDate: '',
    document: null,
    companyName: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      zipCode: ''
    }
  })

  // Statistics data
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalRevenue: 0
  })

  // Partners data
  const [partners, setPartners] = useState([])
  const [totalPartners, setTotalPartners] = useState(0)
  const { addToast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  // Reload partners when filters change
  useEffect(() => {
    if (!loading) {
      loadPartnersOnly()
    }
  }, [selectedFilter, searchTerm, currentPage, itemsPerPage])

  // Update selectedFilter when activeTab changes
  useEffect(() => {
    if (activeTab !== 'all') {
      setSelectedFilter(activeTab)
    } else {
      setSelectedFilter('all')
    }
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      const [partnersResponse, statisticsResponse] = await Promise.all([
        adminChannelPartnerService.getAllChannelPartners({
          status: selectedFilter !== 'all' ? selectedFilter : undefined,
          search: searchTerm || undefined,
          page: currentPage,
          limit: itemsPerPage
        }),
        adminChannelPartnerService.getChannelPartnerStatistics()
      ])

      const formattedPartners = partnersResponse.data.map(partner => 
        adminChannelPartnerService.formatChannelPartnerForDisplay(partner)
      )
      
      setPartners(formattedPartners)
      setTotalPartners(partnersResponse.total || 0)
      setStatistics(statisticsResponse.data)
      setCurrentPage(partnersResponse.page || 1)
    } catch (error) {
      console.error('Error loading data:', error)
      addToast({ type: 'error', message: 'Failed to load channel partner data' })
    } finally {
      setLoading(false)
    }
  }

  const loadPartnersOnly = async () => {
    setPartnersLoading(true)
    try {
      const partnersResponse = await adminChannelPartnerService.getAllChannelPartners({
        status: selectedFilter !== 'all' ? selectedFilter : undefined,
        search: searchTerm || undefined,
        page: currentPage,
        limit: itemsPerPage
      })

      const formattedPartners = partnersResponse.data.map(partner => 
        adminChannelPartnerService.formatChannelPartnerForDisplay(partner)
      )
      
      setPartners(formattedPartners)
      setTotalPartners(partnersResponse.total || 0)
      setCurrentPage(partnersResponse.page || 1)
    } catch (error) {
      console.error('Error loading partners:', error)
      addToast({ type: 'error', message: 'Failed to load channel partner data' })
    } finally {
      setPartnersLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateForInput = (date) => {
    if (!date) return ''
    if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date
    }
    try {
      const dateObj = new Date(date)
      if (isNaN(dateObj.getTime())) return ''
      const year = dateObj.getFullYear()
      const month = String(dateObj.getMonth() + 1).padStart(2, '0')
      const day = String(dateObj.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    } catch (e) {
      return ''
    }
  }

  const getCurrentPartners = () => {
    let filteredPartners = partners

    // Filter by tab
    if (activeTab !== 'all') {
      filteredPartners = filteredPartners.filter(partner => partner.status === activeTab)
    }

    return filteredPartners
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalPartners / itemsPerPage)

  const handleCreatePartner = () => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      status: 'active',
      dateOfBirth: '',
      gender: '',
      joiningDate: '',
      document: null,
      companyName: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: 'India',
        zipCode: ''
      }
    })
    setShowCreateModal(true)
  }

  const handleEditPartner = (partner) => {
    setFormData({
      name: partner.name,
      email: partner.email || '',
      phoneNumber: partner.phoneNumber,
      status: partner.status,
      dateOfBirth: formatDateForInput(partner.dateOfBirth),
      joiningDate: formatDateForInput(partner.joiningDate),
      document: partner.document || null,
      companyName: partner.companyName || '',
      address: partner.address || {
        street: '',
        city: '',
        state: '',
        country: 'India',
        zipCode: ''
      }
    })
    setSelectedPartner(partner)
    setShowEditModal(true)
  }

  const handleViewPartner = (partner) => {
    setSelectedPartner(partner)
    setShowViewModal(true)
  }

  const handleDeletePartner = (partner) => {
    setSelectedPartner(partner)
    setShowDeleteModal(true)
  }

  const handleSavePartner = async () => {
    try {
      // Validate partner data
      const validationErrors = adminChannelPartnerService.validateChannelPartnerData(formData, showEditModal)
      if (validationErrors.length > 0) {
        addToast({ type: 'error', message: validationErrors[0] })
        return
      }
    
      if (showCreateModal) {
        await adminChannelPartnerService.createChannelPartner(formData)
        addToast({ type: 'success', message: 'Channel partner created successfully' })
      } else {
        await adminChannelPartnerService.updateChannelPartner(selectedPartner.id, formData)
        addToast({ type: 'success', message: 'Channel partner updated successfully' })
      }

      // Close modals and reset form
      setShowCreateModal(false)
      setShowEditModal(false)
      setSelectedPartner(null)
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        status: 'active',
        dateOfBirth: '',
        gender: '',
        joiningDate: '',
        document: null,
        companyName: '',
        address: {
          street: '',
          city: '',
          state: '',
          country: 'India',
          zipCode: ''
        }
      })

      // Reload data
      await loadPartnersOnly()
      await adminChannelPartnerService.getChannelPartnerStatistics().then(res => setStatistics(res.data))
    } catch (error) {
      console.error('Error saving channel partner:', error)
      addToast({ type: 'error', message: error.response?.data?.message || 'Failed to save channel partner' })
    }
  }

  const confirmDelete = async () => {
    try {
      await adminChannelPartnerService.deleteChannelPartner(selectedPartner.id)
      addToast({ type: 'success', message: 'Channel partner deleted successfully' })
      setShowDeleteModal(false)
      setSelectedPartner(null)
      await loadPartnersOnly()
      await adminChannelPartnerService.getChannelPartnerStatistics().then(res => setStatistics(res.data))
    } catch (error) {
      console.error('Error deleting channel partner:', error)
      addToast({ type: 'error', message: error.response?.data?.message || 'Failed to delete channel partner' })
    }
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowViewModal(false)
    setShowDeleteModal(false)
    setSelectedPartner(null)
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      status: 'active',
      dateOfBirth: '',
      joiningDate: '',
      document: null,
      companyName: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: 'India',
        zipCode: ''
      }
    })
  }

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, selectedFilter, searchTerm])

  const tabs = [
    { key: 'all', label: 'All Partners', count: statistics.total || 0 },
    { key: 'active', label: 'Active', count: statistics.active || 0 },
    { key: 'inactive', label: 'Inactive', count: statistics.inactive || 0 }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Admin_navbar />
        <Admin_sidebar />
        <div className="ml-64 pt-20 p-8">
          <div className="max-w-7xl mx-auto">
            <Loading size="large" className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Admin_navbar />
      
      {/* Sidebar */}
      <Admin_sidebar />
      
      {/* Main Content */}
      <div className="ml-64 pt-20 p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Channel Partner Management
              </h1>
              <p className="text-gray-600">
                Manage channel partners and their access to the platform.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={loadPartnersOnly}
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={partnersLoading}
              >
                <RefreshCw className={`h-4 w-4 ${partnersLoading ? 'animate-spin' : ''}`} />
                {partnersLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button
                onClick={handleCreatePartner}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Add Channel Partner
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {/* Total Partners */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-blue-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Handshake className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-700 mb-1">Total Partners</p>
                  <p className="text-lg font-bold text-blue-800">{statistics.total}</p>
                </div>
              </div>
            </div>

            {/* Active Partners */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-emerald-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-emerald-700 mb-1">Active Partners</p>
                  <p className="text-lg font-bold text-emerald-800">{statistics.active}</p>
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-violet-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-purple-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-violet-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-purple-700 mb-1">Total Revenue</p>
                  <p className="text-lg font-bold text-purple-800">₹{statistics.totalRevenue?.toLocaleString('en-IN') || 0}</p>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Main Content Card */}
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Channel Partners
                </CardTitle>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search partners..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                    />
                  </div>
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.key
                    
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                          isActive
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {tab.count}
                        </span>
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Partners Table */}
              <div className="p-6">
                {partnersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-3">
                      <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                      <span className="text-gray-600">Loading partners...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {partners.length === 0 ? (
                      <div className="text-center py-12">
                        <Handshake className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No channel partners found</h3>
                        <p className="text-gray-600 mb-4">Get started by adding your first channel partner.</p>
                        <Button onClick={handleCreatePartner} className="gap-2">
                          <UserPlus className="h-4 w-4" />
                          Add Channel Partner
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Contact</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Company</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Joined</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partners.map((partner) => (
                                <tr key={partner.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                  <td className="py-4 px-4">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                                        {partner.avatar}
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold text-gray-900">{partner.name}</p>
                                        {partner.email && (
                                          <p className="text-xs text-gray-500">{partner.email}</p>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-4 px-4">
                                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                                      <Phone className="h-3 w-3" />
                                      <span>{partner.phoneNumber}</span>
                                    </div>
                                  </td>
                                  <td className="py-4 px-4">
                                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                                      <Building2 className="h-3 w-3" />
                                      <span>{partner.companyName || 'N/A'}</span>
                                    </div>
                                  </td>
                                  <td className="py-4 px-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(partner.status)}`}>
                                      {partner.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                  </td>
                                  <td className="py-4 px-4">
                                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                                      <Calendar className="h-3 w-3" />
                                      <span>{formatDate(partner.joiningDate)}</span>
                                    </div>
                                  </td>
                                  <td className="py-4 px-4">
                                    <div className="flex items-center justify-end space-x-2">
                                      <button
                                        onClick={() => handleViewPartner(partner)}
                                        className="text-gray-400 hover:text-blue-600 p-2 rounded hover:bg-blue-50 transition-all"
                                        title="View"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => handleEditPartner(partner)}
                                        className="text-gray-400 hover:text-green-600 p-2 rounded hover:bg-green-50 transition-all"
                                        title="Edit"
                                      >
                                        <Edit3 className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeletePartner(partner)}
                                        className="text-gray-400 hover:text-red-600 p-2 rounded hover:bg-red-50 transition-all"
                                        title="Delete"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                              Showing <span className="font-semibold">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-semibold">{Math.min(currentPage * itemsPerPage, totalPartners)}</span> of <span className="font-semibold">{totalPartners}</span> partners
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">Show:</span>
                              <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                  setItemsPerPage(Number(e.target.value))
                                  setCurrentPage(1)
                                }}
                                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                              </select>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                ‹
                              </button>
                              <span className="px-3 py-1 text-sm">
                                Page {currentPage} of {totalPages}
                              </span>
                              <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                ›
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Create/Edit Modal */}
        {(showCreateModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[95vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {showCreateModal ? 'Create Channel Partner' : 'Edit Channel Partner'}
                    </h3>
                    <p className="text-blue-100">
                      {showCreateModal 
                        ? 'Fill in the channel partner details below. Mobile OTP login will be enabled.'
                        : 'Update the channel partner details below.'
                      }
                    </p>
                  </div>
                  <button
                    onClick={closeModals}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSavePartner(); }} className="p-6 space-y-6 max-h-[calc(95vh-200px)] overflow-y-auto">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    Full Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Enter full name"
                  />
                </div>

                {/* Phone Number Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    Phone Number <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value.replace(/\D/g, '')})}
                    className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="9876543210"
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-500">10-digit Indian mobile number (OTP login will be enabled)</p>
                </div>

                {/* Email Field (Optional) */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Enter email address"
                  />
                </div>

                {/* Date Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      Date of Birth <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      Joining Date <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                      className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Gender Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Enter company name"
                  />
                </div>

                {/* Address Section */}
                <div className="space-y-4 border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700">Address Information</h4>
                  
                  {/* Street Address */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Street Address</label>
                    <input
                      type="text"
                      value={formData.address.street}
                      onChange={(e) => setFormData({
                        ...formData, 
                        address: {...formData.address, street: e.target.value}
                      })}
                      className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Enter street address"
                    />
                  </div>

                  {/* City and State Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">City</label>
                      <input
                        type="text"
                        value={formData.address.city}
                        onChange={(e) => setFormData({
                          ...formData, 
                          address: {...formData.address, city: e.target.value}
                        })}
                        className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Enter city"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">State</label>
                      <input
                        type="text"
                        value={formData.address.state}
                        onChange={(e) => setFormData({
                          ...formData, 
                          address: {...formData.address, state: e.target.value}
                        })}
                        className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Enter state"
                      />
                    </div>
                  </div>

                  {/* Zip Code and Country Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Pin Code</label>
                      <input
                        type="text"
                        value={formData.address.zipCode}
                        onChange={(e) => setFormData({
                          ...formData, 
                          address: {...formData.address, zipCode: e.target.value.replace(/\D/g, '')}
                        })}
                        className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Enter pin code"
                        maxLength={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Country</label>
                      <input
                        type="text"
                        value={formData.address.country}
                        onChange={(e) => setFormData({
                          ...formData, 
                          address: {...formData.address, country: e.target.value}
                        })}
                        className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Document Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Document</label>
                  <CloudinaryUpload
                    folder="appzeto/channel-partners/documents"
                    onUploadComplete={(document) => setFormData({...formData, document})}
                    existingFile={formData.document}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModals}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {showCreateModal ? 'Create Partner' : 'Update Partner'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* View Modal */}
        {showViewModal && selectedPartner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Channel Partner Details</h3>
                  <button
                    onClick={closeModals}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Name</p>
                    <p className="text-sm text-gray-900">{selectedPartner.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Phone</p>
                    <p className="text-sm text-gray-900">{selectedPartner.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Email</p>
                    <p className="text-sm text-gray-900">{selectedPartner.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedPartner.status)}`}>
                      {selectedPartner.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Company</p>
                    <p className="text-sm text-gray-900">{selectedPartner.companyName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Date of Birth</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedPartner.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Joining Date</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedPartner.joiningDate)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedPartner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Delete Channel Partner</h3>
                    <p className="text-sm text-gray-600">This action cannot be undone.</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-6">
                  Are you sure you want to delete <span className="font-semibold">{selectedPartner.name}</span>? This will permanently remove all associated data.
                </p>
              </div>
              <div className="flex items-center justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModals}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={confirmDelete}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Admin_channel_partner_management
