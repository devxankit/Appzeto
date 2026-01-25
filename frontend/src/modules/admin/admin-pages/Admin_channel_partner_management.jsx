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
  DollarSign,
  Award,
  FileText,
  UserCheck,
  Target,
  Clock,
  Download,
  Share2,
  Plus,
  BarChart3,
  PieChart,
  Wallet as WalletIcon,
  ArrowRight,
  ArrowLeft,
  MoreVertical,
  ChevronRight,
  Globe,
  Smartphone,
  ShoppingCart,
  Database,
  Shield
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import Loading from '../../../components/ui/loading'
import { adminChannelPartnerService } from '../admin-services'
import { useToast } from '../../../contexts/ToastContext'

const Admin_channel_partner_management = () => {
  const [loading, setLoading] = useState(true)
  const [partnersLoading, setPartnersLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('partners') // Changed from 'all' to 'partners'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  
  // Section-specific states
  const [leadsPage, setLeadsPage] = useState(1)
  const [leadsPerPage, setLeadsPerPage] = useState(20)
  const [walletPage, setWalletPage] = useState(1)
  const [walletPerPage, setWalletPerPage] = useState(20)
  const [rewardsPage, setRewardsPage] = useState(1)
  const [rewardsPerPage, setRewardsPerPage] = useState(20)
  const [convertedPage, setConvertedPage] = useState(1)
  const [convertedPerPage, setConvertedPerPage] = useState(20)
  const [quotationsPage, setQuotationsPage] = useState(1)
  const [quotationsPerPage, setQuotationsPerPage] = useState(20)
  const [teamPage, setTeamPage] = useState(1)
  const [teamPerPage, setTeamPerPage] = useState(20)
  
  // Pagination helper function
  const PaginationComponent = ({ currentPage, totalPages, itemsPerPage, totalItems, onPageChange, onItemsPerPageChange, itemsPerPageOptions = [20, 50, 100], alwaysShow = false }) => {
    if (totalPages <= 1 && !alwaysShow) return null
    
    return (
      <div className="mt-4 lg:mt-6 flex flex-col gap-3 lg:gap-4 pt-4 lg:pt-6 border-t border-gray-200">
        <div className="text-xs lg:text-sm text-gray-600 text-center lg:text-left">
          Showing <span className="font-semibold">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-semibold">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-semibold">{totalItems}</span> items
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start">
            <span className="text-xs lg:text-sm text-gray-600">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                onItemsPerPageChange(Number(e.target.value))
                onPageChange(1)
              }}
              className="px-2 lg:px-3 py-1.5 text-xs lg:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {itemsPerPageOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              ‹
            </button>
            <span className="px-2 lg:px-3 py-1 text-xs lg:text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // Leads section states
  const [selectedCPFilter, setSelectedCPFilter] = useState('all')
  const [leadStatusFilter, setLeadStatusFilter] = useState('all')
  const [showAssignLeadModal, setShowAssignLeadModal] = useState(false)
  const [showLeadDetailsModal, setShowLeadDetailsModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  
  // Wallet section states
  const [selectedCPWallet, setSelectedCPWallet] = useState('all')
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all')
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  
  // Rewards section states
  const [showAssignRewardModal, setShowAssignRewardModal] = useState(false)
  const [showMilestoneModal, setShowMilestoneModal] = useState(false)
  const [showRewardDetailsModal, setShowRewardDetailsModal] = useState(false)
  const [selectedReward, setSelectedReward] = useState(null)
  
  // Team section states
  const [showAssignTeamModal, setShowAssignTeamModal] = useState(false)
  const [selectedCPForTeam, setSelectedCPForTeam] = useState(null)
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
    totalRevenue: 0,
    totalLeads: 0,
    totalConversions: 0,
    avgCommission: 0
  })
  
  // Mock data for development (will be replaced with API calls later)
  const [mockLeads] = useState([
    { id: '1', name: 'Sarah Williams', cpName: 'Rajesh Kumar', cpId: 'cp1', cpPhone: '+91 98765 43210', projectType: 'E-commerce Website', status: 'Hot', value: '₹5,000', createdDate: '2024-01-15', lastUpdated: '2024-01-20', phone: '+1234567890', email: 'sarah@example.com', assignedSalesLead: 'Rahul Sharma', budget: '₹5,000', notes: 'Interested in e-commerce platform with payment gateway integration' },
    { id: '2', name: 'TechSolutions Inc', cpName: 'Priya Sharma', cpId: 'cp2', cpPhone: '+91 98765 11111', projectType: 'Mobile App', status: 'Connected', value: '₹12,000', createdDate: '2024-01-10', lastUpdated: '2024-01-19', phone: '+1987654321', email: 'contact@techsolutions.com', assignedSalesLead: 'Rahul Sharma', budget: '₹12,000', notes: 'Need iOS and Android app development' },
    { id: '4', name: 'Green Energy Co', cpName: 'Amit Patel', cpId: 'cp3', cpPhone: '+91 98765 22222', projectType: 'CRM System', status: 'Converted', value: '₹20,000', createdDate: '2024-01-05', lastUpdated: '2024-01-15', phone: '+1555666777', email: 'info@greenenergy.com', assignedSalesLead: null, budget: '₹20,000', notes: 'Converted to client. Project in progress.' },
    { id: '5', name: 'Local Bistro', cpName: 'Priya Sharma', cpId: 'cp2', cpPhone: '+91 98765 11111', projectType: 'Landing Page', status: 'Lost', value: '₹1,500', createdDate: '2024-01-08', lastUpdated: '2024-01-12', phone: '+1444333222', email: 'bistro@local.com', assignedSalesLead: 'Rahul Sharma', budget: '₹1,500', notes: 'Client chose another vendor' },
    { id: '6', name: 'Digital Marketing Pro', cpName: 'Rajesh Kumar', cpId: 'cp1', cpPhone: '+91 98765 43210', projectType: 'Website Redesign', status: 'Hot', value: '₹8,500', createdDate: '2024-01-22', lastUpdated: '2024-01-22', phone: '+1999888777', email: 'contact@digitalmarketingpro.com', assignedSalesLead: 'Rahul Sharma', budget: '₹8,500', notes: 'Urgent requirement for website redesign' }
  ])
  
  const [mockTransactions] = useState([
    { id: 't1', cpName: 'Rajesh Kumar', cpId: 'cp1', type: 'Commission', amount: 500, status: 'Completed', date: '2024-01-20', description: 'Commission - TechSolutions' },
    { id: 't2', cpName: 'Priya Sharma', cpId: 'cp2', type: 'Reward', amount: 150, status: 'Completed', date: '2024-01-19', description: 'Reward - Silver Badge' },
    { id: 't3', cpName: 'Amit Patel', cpId: 'cp3', type: 'Salary', amount: 10000, status: 'Completed', date: '2024-01-18', description: 'Monthly Salary' },
    { id: 't4', cpName: 'Rajesh Kumar', cpId: 'cp1', type: 'Commission', amount: 350, status: 'Pending', date: '2024-01-20', description: 'Commission - Green Energy' }
  ])
  
  const [mockRewards] = useState([
    { id: 'r1', cpName: 'Rajesh Kumar', cpId: 'cp1', type: 'Milestone', amount: 500, date: '2024-01-15', status: 'Credited', milestone: 'First Sale' },
    { id: 'r2', cpName: 'Priya Sharma', cpId: 'cp2', type: 'Bonus', amount: 1000, date: '2024-01-10', status: 'Credited', milestone: null },
    { id: 'r3', cpName: 'Amit Patel', cpId: 'cp3', type: 'Milestone', amount: 350, date: '2024-01-08', status: 'Pending', milestone: 'Rising Star' }
  ])
  
  const [mockConverted] = useState([
    { id: 'c1', clientName: 'Global Tech Solutions', cpName: 'Rajesh Kumar', cpId: 'cp1', projectType: 'Mobile App Development', status: 'In Progress', progress: 45, totalValue: 12000, paidAmount: 5000, pendingAmount: 7000, paymentStatus: 'Partial Paid', commissionEarned: 1200, commissionStatus: 'Credited' },
    { id: 'c2', clientName: 'Urban Cafe Chain', cpName: 'Priya Sharma', cpId: 'cp2', projectType: 'Website Redesign', status: 'Completed', progress: 100, totalValue: 3500, paidAmount: 3500, pendingAmount: 0, paymentStatus: 'Fully Paid', commissionEarned: 350, commissionStatus: 'Credited' },
    { id: 'c3', clientName: 'Nexus Logistics', cpName: 'Amit Patel', cpId: 'cp3', projectType: 'CRM Implementation', status: 'Planning', progress: 10, totalValue: 25000, paidAmount: 0, pendingAmount: 25000, paymentStatus: 'Payment Pending', commissionEarned: 2500, commissionStatus: 'Pending' }
  ])
  
  const [mockQuotations] = useState([
    { id: 'q1', title: 'Business Website', category: 'Website', price: '₹25,000', timesShared: 12, lastShared: '2024-01-18', sharedBy: ['Rajesh Kumar', 'Priya Sharma'] },
    { id: 'q2', title: 'Hybrid Mobile App', category: 'Mobile', price: '₹85,000', timesShared: 8, lastShared: '2024-01-19', sharedBy: ['Amit Patel', 'Rajesh Kumar'] },
    { id: 'q3', title: 'E-commerce Starter', category: 'E-commerce', price: '₹60,000', timesShared: 5, lastShared: '2024-01-15', sharedBy: ['Priya Sharma'] }
  ])
  
  const [mockTeamAssignments] = useState([
    { id: 'ta1', cpName: 'Rajesh Kumar', cpId: 'cp1', salesLead: 'Rahul Sharma', teamMembers: ['Priya Verma', 'Amit Kumar'], assignedDate: '2024-01-01' },
    { id: 'ta2', cpName: 'Priya Sharma', cpId: 'cp2', salesLead: 'Rahul Sharma', teamMembers: ['Priya Verma'], assignedDate: '2024-01-05' },
    { id: 'ta3', cpName: 'Amit Patel', cpId: 'cp3', salesLead: null, teamMembers: [], assignedDate: null }
  ])
  
  const [mockMilestones] = useState([
    { id: 'm1', title: 'First Sale', requirement: '1 Conversion', reward: 150, status: 'active' },
    { id: 'm2', title: 'Rising Star', requirement: '5 Conversions', reward: 350, status: 'active' },
    { id: 'm3', title: 'Pro Partner', requirement: '10 Conversions', reward: 1000, status: 'active' },
    { id: 'm4', title: 'Elite Club', requirement: '25 Conversions', reward: 3000, status: 'active' }
  ])

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

  // Update selectedFilter when activeTab changes (only for partners tab)
  useEffect(() => {
    if (activeTab === 'partners') {
      if (selectedFilter !== 'all' && selectedFilter !== 'active' && selectedFilter !== 'inactive') {
        setSelectedFilter('all')
      }
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

  
  // Reset pagination when filters change for each section
  useEffect(() => {
    setLeadsPage(1)
  }, [leadStatusFilter])
  
  useEffect(() => {
    setWalletPage(1)
  }, [selectedCPWallet, transactionTypeFilter])
  
  useEffect(() => {
    setRewardsPage(1)
  }, [])
  
  useEffect(() => {
    setConvertedPage(1)
  }, [])
  
  useEffect(() => {
    setQuotationsPage(1)
  }, [])
  
  useEffect(() => {
    setTeamPage(1)
  }, [])

  // Main section tabs
  const mainTabs = [
    { key: 'partners', label: 'Partners', icon: Handshake },
    { key: 'leads', label: 'Leads', icon: Users },
    { key: 'wallet', label: 'Wallet', icon: DollarSign },
    { key: 'rewards', label: 'Rewards', icon: Award },
    { key: 'converted', label: 'Converted', icon: CheckCircle },
    { key: 'quotations', label: 'Quotations', icon: FileText },
    { key: 'team', label: 'Team', icon: UserCheck }
  ]
  
  // Partner status tabs (for partners section only)
  const partnerStatusTabs = [
    { key: 'all', label: 'All Partners', count: statistics.total || 0 },
    { key: 'active', label: 'Active', count: statistics.active || 0 },
    { key: 'inactive', label: 'Inactive', count: statistics.inactive || 0 }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Admin_navbar />
        <Admin_sidebar />
      <div className="ml-0 lg:ml-64 pt-16 lg:pt-20 p-4 lg:p-8">
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
      <div className="ml-0 lg:ml-64 pt-16 lg:pt-20 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div className="space-y-2">
              <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Channel Partner Management
              </h1>
              <p className="text-gray-600 text-sm lg:text-lg">
                {activeTab === 'partners' && 'Manage channel partners and their access to the platform'}
                {activeTab === 'leads' && 'View and manage all leads created by channel partners'}
                {activeTab === 'wallet' && 'Monitor wallet balances and transaction history'}
                {activeTab === 'rewards' && 'Manage rewards, milestones, and achievements'}
                {activeTab === 'converted' && 'Track converted clients and project progress'}
                {activeTab === 'quotations' && 'View quotations shared by channel partners'}
                {activeTab === 'team' && 'Manage sales team assignments to channel partners'}
              </p>
            </div>
            {activeTab === 'partners' && (
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
            )}
          </motion.div>
          
          {/* Main Section Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="border-b border-gray-200 overflow-x-auto">
              <nav className="flex flex-nowrap gap-1 px-2 lg:px-4 min-w-max lg:min-w-0">
                {mainTabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.key
                  
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center space-x-1.5 py-2.5 px-3 border-b-2 font-medium text-xs transition-colors rounded-t-md ${
                        isActive
                          ? 'border-blue-500 text-blue-600 bg-blue-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="whitespace-nowrap">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 lg:gap-4"
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
                  <p className="text-xs font-medium text-emerald-700 mb-1">Active</p>
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
                  <p className="text-xs font-medium text-purple-700 mb-1">Revenue</p>
                  <p className="text-lg font-bold text-purple-800">₹{statistics.totalRevenue?.toLocaleString('en-IN') || 0}</p>
                </div>
              </div>
            </div>

            {/* Total Leads */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-amber-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-orange-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-orange-400/20 to-amber-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Target className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-orange-700 mb-1">Total Leads</p>
                  <p className="text-lg font-bold text-orange-800">{statistics.totalLeads || mockLeads.length}</p>
                </div>
              </div>
            </div>

            {/* Total Conversions */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-50 to-cyan-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-teal-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-teal-500/10">
                    <TrendingUp className="h-4 w-4 text-teal-600" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-teal-700 mb-1">Conversions</p>
                  <p className="text-lg font-bold text-teal-800">{statistics.totalConversions || mockConverted.length}</p>
                </div>
              </div>
            </div>

            {/* Avg Commission */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-50 to-rose-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-pink-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-pink-400/20 to-rose-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-pink-500/10">
                    <BarChart3 className="h-4 w-4 text-pink-600" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-pink-700 mb-1">Avg Commission</p>
                  <p className="text-lg font-bold text-pink-800">₹{statistics.avgCommission?.toLocaleString('en-IN') || '0'}</p>
                </div>
              </div>
            </div>

            {/* Inactive Partners */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-slate-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-gray-400/20 to-slate-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-gray-500/10">
                    <AlertCircle className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Inactive</p>
                  <p className="text-lg font-bold text-gray-800">{statistics.inactive}</p>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Tab Content - Conditionally render based on activeTab */}
          {activeTab === 'partners' && (
            <Card className="shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-200 p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <CardTitle className="text-lg lg:text-xl font-semibold text-gray-900">
                  Channel Partners
                </CardTitle>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search partners..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 text-sm"
                    />
                  </div>
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full sm:w-auto"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </CardHeader>

              <CardContent className="p-0">
              {/* Partner Status Tabs */}
              <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="flex flex-nowrap space-x-4 lg:space-x-8 px-3 lg:px-6 min-w-max lg:min-w-0">
                    {partnerStatusTabs.map((tab) => {
                      const isActive = selectedFilter === tab.key || (selectedFilter === 'all' && tab.key === 'all')
                      
                      return (
                        <button
                          key={tab.key}
                          onClick={() => setSelectedFilter(tab.key)}
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
              <div className="p-3 lg:p-6">
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
                          <table className="w-full min-w-[640px]">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Name</th>
                                <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Contact</th>
                                <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700 hidden md:table-cell">Company</th>
                                <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Status</th>
                                <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700 hidden lg:table-cell">Joined</th>
                                <th className="text-right py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partners.map((partner) => (
                                <tr key={partner.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                  <td className="py-3 lg:py-4 px-2 lg:px-4">
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
                                  <td className="py-3 lg:py-4 px-2 lg:px-4">
                                    <div className="flex items-center space-x-1 text-xs lg:text-sm text-gray-600">
                                      <Phone className="h-3 w-3" />
                                      <span className="truncate max-w-[120px] lg:max-w-none">{partner.phoneNumber}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 lg:py-4 px-2 lg:px-4 hidden md:table-cell">
                                    <div className="flex items-center space-x-1 text-xs lg:text-sm text-gray-600">
                                      <Building2 className="h-3 w-3" />
                                      <span className="truncate max-w-[100px] lg:max-w-none">{partner.companyName || 'N/A'}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 lg:py-4 px-2 lg:px-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(partner.status)}`}>
                                      {partner.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                  </td>
                                  <td className="py-3 lg:py-4 px-2 lg:px-4 hidden lg:table-cell">
                                    <div className="flex items-center space-x-1 text-xs lg:text-sm text-gray-600">
                                      <Calendar className="h-3 w-3" />
                                      <span>{formatDate(partner.joiningDate)}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 lg:py-4 px-2 lg:px-4">
                                    <div className="flex items-center justify-end space-x-1 lg:space-x-2">
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
                        <PaginationComponent
                          currentPage={currentPage}
                          totalPages={totalPages}
                          itemsPerPage={itemsPerPage}
                          totalItems={totalPartners}
                          onPageChange={setCurrentPage}
                          onItemsPerPageChange={(value) => {
                            setItemsPerPage(value)
                            setCurrentPage(1)
                          }}
                          alwaysShow={true}
                        />
                      </>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          )}

          {/* Leads Section */}
          {activeTab === 'leads' && (
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="border-b border-gray-200 p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <CardTitle className="text-lg lg:text-xl font-semibold text-gray-900">
                    Leads Management
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <select
                      value={leadStatusFilter}
                      onChange={(e) => setLeadStatusFilter(e.target.value)}
                      className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full sm:w-auto"
                    >
                      <option value="all">All Status</option>
                      <option value="Hot">Hot</option>
                      <option value="Connected">Connected</option>
                      <option value="Converted">Converted</option>
                      <option value="Lost">Lost</option>
                    </select>
                    <Button
                      onClick={() => setShowAssignLeadModal(true)}
                      className="gap-2 w-full sm:w-auto text-sm"
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Assign Lead</span>
                      <span className="sm:hidden">Assign</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 lg:p-6">
                <div className="overflow-x-auto -mx-3 lg:mx-0">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Lead Name</th>
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700 hidden sm:table-cell">Channel Partner</th>
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Project Type</th>
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Status</th>
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700 hidden md:table-cell">Value</th>
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700 hidden lg:table-cell">Created</th>
                        <th className="text-right py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockLeads
                        .filter(lead => {
                          if (leadStatusFilter !== 'all' && lead.status !== leadStatusFilter) return false
                          return true
                        })
                        .slice((leadsPage - 1) * leadsPerPage, leadsPage * leadsPerPage)
                        .map((lead) => (
                          <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-3 lg:py-4 px-2 lg:px-4">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                                <p className="text-xs text-gray-500">{lead.phone}</p>
                              </div>
                            </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4 hidden sm:table-cell">
                              <p className="text-xs lg:text-sm text-gray-600 truncate max-w-[120px] lg:max-w-none">{lead.cpName}</p>
                            </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4">
                              <p className="text-xs lg:text-sm text-gray-600 truncate max-w-[150px] lg:max-w-none">{lead.projectType}</p>
                            </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                lead.status === 'Hot' ? 'bg-red-100 text-red-800' :
                                lead.status === 'Connected' ? 'bg-blue-100 text-blue-800' :
                                lead.status === 'Converted' ? 'bg-green-100 text-green-800' :
                                lead.status === 'Lost' ? 'bg-gray-100 text-gray-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4 hidden md:table-cell">
                              <p className="text-xs lg:text-sm font-semibold text-gray-900">{lead.value}</p>
                            </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4 hidden lg:table-cell">
                              <p className="text-xs lg:text-sm text-gray-600">{formatDate(lead.createdDate)}</p>
                            </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4">
                              <div className="flex items-center justify-end space-x-1 lg:space-x-2">
                                <button
                                  onClick={() => { setSelectedLead(lead); setShowLeadDetailsModal(true); }}
                                  className="text-gray-400 hover:text-blue-600 p-2 rounded hover:bg-blue-50 transition-all"
                                  title="View"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => { setSelectedLead(lead); setShowAssignLeadModal(true); }}
                                  className="text-gray-400 hover:text-green-600 p-2 rounded hover:bg-green-50 transition-all"
                                  title="Assign"
                                >
                                  <Share2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {(() => {
                  const filteredLeads = mockLeads.filter(lead => {
                    if (leadStatusFilter !== 'all' && lead.status !== leadStatusFilter) return false
                    return true
                  })
                  const totalLeadsPages = Math.ceil(filteredLeads.length / leadsPerPage)
                  return (
                    <PaginationComponent
                      currentPage={leadsPage}
                      totalPages={totalLeadsPages}
                      itemsPerPage={leadsPerPage}
                      totalItems={filteredLeads.length}
                      onPageChange={setLeadsPage}
                      onItemsPerPageChange={setLeadsPerPage}
                      alwaysShow={true}
                    />
                  )
                })()}
              </CardContent>
            </Card>
          )}

          {/* Wallet Section */}
          {activeTab === 'wallet' && (
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="border-b border-gray-200 p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <CardTitle className="text-lg lg:text-xl font-semibold text-gray-900">
                    Wallet & Transactions
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <select
                      value={selectedCPWallet}
                      onChange={(e) => setSelectedCPWallet(e.target.value)}
                      className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full sm:w-auto"
                    >
                      <option value="all">All Partners</option>
                      <option value="cp1">Rajesh Kumar</option>
                      <option value="cp2">Priya Sharma</option>
                      <option value="cp3">Amit Patel</option>
                    </select>
                    <select
                      value={transactionTypeFilter}
                      onChange={(e) => setTransactionTypeFilter(e.target.value)}
                      className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full sm:w-auto"
                    >
                      <option value="all">All Types</option>
                      <option value="Salary">Salary</option>
                      <option value="Reward">Reward</option>
                      <option value="Commission">Commission</option>
                    </select>
                    <Button
                      variant="outline"
                      className="gap-2 w-full sm:w-auto text-sm"
                      size="sm"
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Export</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 lg:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
                  <div className="bg-blue-50 p-3 lg:p-4 rounded-lg border border-blue-200">
                    <p className="text-xs font-medium text-blue-700 mb-1">Total Balance</p>
                    <p className="text-base lg:text-lg font-bold text-blue-800">₹{mockTransactions.reduce((sum, t) => sum + (t.status === 'Completed' ? t.amount : 0), 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-orange-50 p-3 lg:p-4 rounded-lg border border-orange-200">
                    <p className="text-xs font-medium text-orange-700 mb-1">Pending</p>
                    <p className="text-base lg:text-lg font-bold text-orange-800">₹{mockTransactions.reduce((sum, t) => sum + (t.status === 'Pending' ? t.amount : 0), 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-green-50 p-3 lg:p-4 rounded-lg border border-green-200">
                    <p className="text-xs font-medium text-green-700 mb-1">Lifetime Earnings</p>
                    <p className="text-base lg:text-lg font-bold text-green-800">₹{mockTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-purple-50 p-3 lg:p-4 rounded-lg border border-purple-200">
                    <p className="text-xs font-medium text-purple-700 mb-1">Transactions</p>
                    <p className="text-base lg:text-lg font-bold text-purple-800">{mockTransactions.length}</p>
                  </div>
                </div>
                <div className="overflow-x-auto -mx-3 lg:mx-0">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Date</th>
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700 hidden sm:table-cell">Channel Partner</th>
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Type</th>
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Status</th>
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700 hidden md:table-cell">Description</th>
                        <th className="text-right py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTransactions
                        .filter(t => {
                          if (selectedCPWallet !== 'all' && t.cpId !== selectedCPWallet) return false
                          if (transactionTypeFilter !== 'all' && t.type !== transactionTypeFilter) return false
                          return true
                        })
                        .slice((walletPage - 1) * walletPerPage, walletPage * walletPerPage)
                        .map((transaction) => (
                          <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-3 lg:py-4 px-2 lg:px-4">
                              <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                            </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4 hidden sm:table-cell">
                              <p className="text-xs lg:text-sm text-gray-600 truncate max-w-[120px] lg:max-w-none">{transaction.cpName}</p>
                            </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                transaction.type === 'Salary' ? 'bg-blue-100 text-blue-800' :
                                transaction.type === 'Reward' ? 'bg-purple-100 text-purple-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {transaction.type}
                              </span>
                            </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4">
                              <p className="text-xs lg:text-sm font-semibold text-gray-900">₹{transaction.amount.toLocaleString('en-IN')}</p>
                            </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                              }`}>
                                {transaction.status}
                              </span>
                            </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4 hidden md:table-cell">
                              <p className="text-xs lg:text-sm text-gray-600 truncate max-w-[150px] lg:max-w-none">{transaction.description}</p>
                            </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4">
                              <button
                                onClick={() => { setSelectedTransaction(transaction); setShowTransactionModal(true); }}
                                className="text-gray-400 hover:text-blue-600 p-1.5 lg:p-2 rounded hover:bg-blue-50 transition-all"
                                title="View"
                              >
                                <Eye className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {(() => {
                  const filteredTransactions = mockTransactions.filter(t => {
                    if (selectedCPWallet !== 'all' && t.cpId !== selectedCPWallet) return false
                    if (transactionTypeFilter !== 'all' && t.type !== transactionTypeFilter) return false
                    return true
                  })
                  const totalWalletPages = Math.ceil(filteredTransactions.length / walletPerPage)
                  return (
                    <PaginationComponent
                      currentPage={walletPage}
                      totalPages={totalWalletPages}
                      itemsPerPage={walletPerPage}
                      totalItems={filteredTransactions.length}
                      onPageChange={setWalletPage}
                      onItemsPerPageChange={setWalletPerPage}
                      alwaysShow={true}
                    />
                  )
                })()}
              </CardContent>
            </Card>
          )}

          {/* Rewards Section */}
          {activeTab === 'rewards' && (
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="border-b border-gray-200 p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <CardTitle className="text-lg lg:text-xl font-semibold text-gray-900">
                    Rewards & Achievements
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <Button
                      onClick={() => setShowAssignRewardModal(true)}
                      className="gap-2 w-full sm:w-auto text-sm"
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Assign Reward</span>
                      <span className="sm:hidden">Assign</span>
                    </Button>
                    <Button
                      onClick={() => setShowMilestoneModal(true)}
                      variant="outline"
                      className="gap-2 w-full sm:w-auto text-sm"
                      size="sm"
                    >
                      <Award className="h-4 w-4" />
                      <span className="hidden sm:inline">Configure Milestones</span>
                      <span className="sm:hidden">Milestones</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 lg:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4 mb-4 lg:mb-6">
                  <div className="bg-yellow-50 p-3 lg:p-4 rounded-lg border border-yellow-200">
                    <p className="text-xs font-medium text-yellow-700 mb-1">Total Rewards</p>
                    <p className="text-base lg:text-lg font-bold text-yellow-800">₹{mockRewards.reduce((sum, r) => sum + r.amount, 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-purple-50 p-3 lg:p-4 rounded-lg border border-purple-200">
                    <p className="text-xs font-medium text-purple-700 mb-1">Active Milestones</p>
                    <p className="text-base lg:text-lg font-bold text-purple-800">{mockMilestones.length}</p>
                  </div>
                  <div className="bg-green-50 p-3 lg:p-4 rounded-lg border border-green-200">
                    <p className="text-xs font-medium text-green-700 mb-1">Rewards Distributed</p>
                    <p className="text-base lg:text-lg font-bold text-green-800">{mockRewards.length}</p>
                  </div>
                </div>
                <div className="overflow-x-auto -mx-3 lg:mx-0">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Channel Partner</th>
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Reward Type</th>
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700 hidden md:table-cell">Date</th>
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Status</th>
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700 hidden lg:table-cell">Milestone</th>
                        <th className="text-right py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockRewards
                        .slice((rewardsPage - 1) * rewardsPerPage, rewardsPage * rewardsPerPage)
                        .map((reward) => (
                          <tr key={reward.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-3 lg:py-4 px-2 lg:px-4">
                            <p className="text-sm font-semibold text-gray-900">{reward.cpName}</p>
                          </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                reward.type === 'Milestone' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {reward.type}
                              </span>
                            </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4">
                              <p className="text-xs lg:text-sm font-semibold text-gray-900">₹{reward.amount.toLocaleString('en-IN')}</p>
                            </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4 hidden md:table-cell">
                              <p className="text-xs lg:text-sm text-gray-600">{formatDate(reward.date)}</p>
                            </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                reward.status === 'Credited' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                              }`}>
                                {reward.status}
                              </span>
                            </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4 hidden lg:table-cell">
                              <p className="text-xs lg:text-sm text-gray-600 truncate max-w-[120px]">{reward.milestone || 'N/A'}</p>
                            </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4">
                              <button
                                onClick={() => { setSelectedReward(reward); setShowRewardDetailsModal(true); }}
                                className="text-gray-400 hover:text-blue-600 p-1.5 lg:p-2 rounded hover:bg-blue-50 transition-all"
                                title="View"
                              >
                                <Eye className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                              </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {(() => {
                  const totalRewardsPages = Math.ceil(mockRewards.length / rewardsPerPage)
                  return (
                    <PaginationComponent
                      currentPage={rewardsPage}
                      totalPages={totalRewardsPages}
                      itemsPerPage={rewardsPerPage}
                      totalItems={mockRewards.length}
                      onPageChange={setRewardsPage}
                      onItemsPerPageChange={setRewardsPerPage}
                      alwaysShow={true}
                    />
                  )
                })()}
              </CardContent>
            </Card>
          )}

          {/* Converted Clients Section */}
          {activeTab === 'converted' && (
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="border-b border-gray-200 p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <CardTitle className="text-lg lg:text-xl font-semibold text-gray-900">
                    Converted Clients
                  </CardTitle>
                  <div className="flex items-center w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search clients..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 lg:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
                  <div className="bg-teal-50 p-3 lg:p-4 rounded-lg border border-teal-200">
                    <p className="text-xs font-medium text-teal-700 mb-1">Total Converted</p>
                    <p className="text-base lg:text-lg font-bold text-teal-800">{mockConverted.length}</p>
                  </div>
                  <div className="bg-blue-50 p-3 lg:p-4 rounded-lg border border-blue-200">
                    <p className="text-xs font-medium text-blue-700 mb-1">Project Value</p>
                    <p className="text-base lg:text-lg font-bold text-blue-800">₹{mockConverted.reduce((sum, c) => sum + c.totalValue, 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-orange-50 p-3 lg:p-4 rounded-lg border border-orange-200">
                    <p className="text-xs font-medium text-orange-700 mb-1">Pending Payments</p>
                    <p className="text-base lg:text-lg font-bold text-orange-800">₹{mockConverted.reduce((sum, c) => sum + c.pendingAmount, 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-green-50 p-3 lg:p-4 rounded-lg border border-green-200">
                    <p className="text-xs font-medium text-green-700 mb-1">Commission Paid</p>
                    <p className="text-base lg:text-lg font-bold text-green-800">₹{mockConverted.reduce((sum, c) => sum + (c.commissionStatus === 'Credited' ? c.commissionEarned : 0), 0).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="space-y-3 lg:space-y-4">
                  {mockConverted
                    .slice((convertedPage - 1) * convertedPerPage, convertedPage * convertedPerPage)
                    .map((client) => (
                    <div key={client.id} className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 hover:shadow-md transition-all">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base lg:text-lg font-bold text-gray-900 truncate">{client.clientName}</h3>
                          <p className="text-xs lg:text-sm text-gray-500 truncate">{client.projectType}</p>
                          <p className="text-xs lg:text-sm text-gray-600 mt-1">CP: {client.cpName}</p>
                        </div>
                        <span className={`px-2 lg:px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                          client.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          client.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {client.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Total Value</p>
                          <p className="text-sm font-bold text-gray-900">₹{client.totalValue.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Paid Amount</p>
                          <p className="text-sm font-bold text-green-600">₹{client.paidAmount.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Pending</p>
                          <p className="text-sm font-bold text-red-600">₹{client.pendingAmount.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Commission</p>
                          <p className="text-sm font-bold text-purple-600">₹{client.commissionEarned.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Progress</span>
                          <span className="text-blue-600 font-semibold">{client.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${client.progress}%` }}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          client.paymentStatus === 'Fully Paid' ? 'bg-green-100 text-green-800' :
                          client.paymentStatus === 'Partial Paid' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {client.paymentStatus}
                        </span>
                        <button
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                        >
                          View Details <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {(() => {
                  const totalConvertedPages = Math.ceil(mockConverted.length / convertedPerPage)
                  return (
                    <PaginationComponent
                      currentPage={convertedPage}
                      totalPages={totalConvertedPages}
                      itemsPerPage={convertedPerPage}
                      totalItems={mockConverted.length}
                      onPageChange={setConvertedPage}
                      onItemsPerPageChange={setConvertedPerPage}
                      alwaysShow={true}
                    />
                  )
                })()}
              </CardContent>
            </Card>
          )}

          {/* Quotations Section */}
          {activeTab === 'quotations' && (
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="border-b border-gray-200 p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <CardTitle className="text-lg lg:text-xl font-semibold text-gray-900">
                    Quotations
                  </CardTitle>
                  <div className="flex items-center w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search quotations..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 lg:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4 mb-4 lg:mb-6">
                  <div className="bg-indigo-50 p-3 lg:p-4 rounded-lg border border-indigo-200">
                    <p className="text-xs font-medium text-indigo-700 mb-1">Total Shared</p>
                    <p className="text-base lg:text-lg font-bold text-indigo-800">{mockQuotations.reduce((sum, q) => sum + q.timesShared, 0)}</p>
                  </div>
                  <div className="bg-purple-50 p-3 lg:p-4 rounded-lg border border-purple-200">
                    <p className="text-xs font-medium text-purple-700 mb-1">Quotations</p>
                    <p className="text-base lg:text-lg font-bold text-purple-800">{mockQuotations.length}</p>
                  </div>
                  <div className="bg-pink-50 p-3 lg:p-4 rounded-lg border border-pink-200">
                    <p className="text-xs font-medium text-pink-700 mb-1">Categories</p>
                    <p className="text-base lg:text-lg font-bold text-pink-800">{new Set(mockQuotations.map(q => q.category)).size}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockQuotations
                    .slice((quotationsPage - 1) * quotationsPerPage, quotationsPage * quotationsPerPage)
                    .map((quote) => (
                    <div key={quote.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="text-xs font-bold text-gray-400 uppercase mb-1 block">{quote.category}</span>
                          <h3 className="text-lg font-bold text-gray-900">{quote.title}</h3>
                        </div>
                        <span className="px-2 py-1 text-xs font-bold bg-indigo-100 text-indigo-700 rounded">
                          {quote.price}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Times Shared</span>
                          <span className="font-semibold text-gray-900">{quote.timesShared}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Last Shared</span>
                          <span className="text-gray-600">{formatDate(quote.lastShared)}</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Shared by:</p>
                        <div className="flex flex-wrap gap-1">
                          {quote.sharedBy.map((cp, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {cp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {(() => {
                  const totalQuotationsPages = Math.ceil(mockQuotations.length / quotationsPerPage)
                  return (
                    <PaginationComponent
                      currentPage={quotationsPage}
                      totalPages={totalQuotationsPages}
                      itemsPerPage={quotationsPerPage}
                      totalItems={mockQuotations.length}
                      onPageChange={setQuotationsPage}
                      onItemsPerPageChange={setQuotationsPerPage}
                      alwaysShow={true}
                    />
                  )
                })()}
              </CardContent>
            </Card>
          )}

          {/* Team Assignments Section */}
          {activeTab === 'team' && (
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="border-b border-gray-200 p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <CardTitle className="text-lg lg:text-xl font-semibold text-gray-900">
                    Team Assignments
                  </CardTitle>
                  <Button
                    onClick={() => setShowAssignTeamModal(true)}
                    className="gap-2 w-full sm:w-auto text-sm"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Assign Team</span>
                    <span className="sm:hidden">Assign</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-3 lg:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4 mb-4 lg:mb-6">
                  <div className="bg-blue-50 p-3 lg:p-4 rounded-lg border border-blue-200">
                    <p className="text-xs font-medium text-blue-700 mb-1">Sales Team Members</p>
                    <p className="text-base lg:text-lg font-bold text-blue-800">12</p>
                  </div>
                  <div className="bg-green-50 p-3 lg:p-4 rounded-lg border border-green-200">
                    <p className="text-xs font-medium text-green-700 mb-1">CPs with Teams</p>
                    <p className="text-base lg:text-lg font-bold text-green-800">{mockTeamAssignments.filter(ta => ta.salesLead).length}</p>
                  </div>
                  <div className="bg-orange-50 p-3 lg:p-4 rounded-lg border border-orange-200">
                    <p className="text-xs font-medium text-orange-700 mb-1">Unassigned CPs</p>
                    <p className="text-base lg:text-lg font-bold text-orange-800">{mockTeamAssignments.filter(ta => !ta.salesLead).length}</p>
                  </div>
                </div>
                <div className="overflow-x-auto -mx-3 lg:mx-0">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Channel Partner</th>
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Sales Lead</th>
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700 hidden md:table-cell">Team Members</th>
                        <th className="text-left py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700 hidden lg:table-cell">Assigned Date</th>
                        <th className="text-right py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTeamAssignments
                        .slice((teamPage - 1) * teamPerPage, teamPage * teamPerPage)
                        .map((assignment) => (
                          <tr key={assignment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-3 lg:py-4 px-2 lg:px-4">
                            <p className="text-sm font-semibold text-gray-900">{assignment.cpName}</p>
                          </td>
                          <td className="py-4 px-4">
                            {assignment.salesLead ? (
                              <p className="text-sm text-gray-600">{assignment.salesLead}</p>
                            ) : (
                              <span className="text-xs text-gray-400">Not assigned</span>
                            )}
                          </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4 hidden md:table-cell">
                              {assignment.teamMembers.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {assignment.teamMembers.map((member, idx) => (
                                    <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                                      {member}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">No members</span>
                              )}
                            </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4 hidden lg:table-cell">
                              {assignment.assignedDate ? (
                                <p className="text-xs lg:text-sm text-gray-600">{formatDate(assignment.assignedDate)}</p>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </td>
                            <td className="py-3 lg:py-4 px-2 lg:px-4">
                              <div className="flex items-center justify-end space-x-1 lg:space-x-2">
                                <button
                                  onClick={() => { setSelectedCPForTeam(assignment); setShowAssignTeamModal(true); }}
                                  className="text-gray-400 hover:text-blue-600 p-1.5 lg:p-2 rounded hover:bg-blue-50 transition-all"
                                  title="Edit"
                                >
                                  <Edit3 className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                                </button>
                              </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {(() => {
                  const totalTeamPages = Math.ceil(mockTeamAssignments.length / teamPerPage)
                  return (
                    <PaginationComponent
                      currentPage={teamPage}
                      totalPages={totalTeamPages}
                      itemsPerPage={teamPerPage}
                      totalItems={mockTeamAssignments.length}
                      onPageChange={setTeamPage}
                      onItemsPerPageChange={setTeamPerPage}
                      alwaysShow={true}
                    />
                  )
                })()}
              </CardContent>
            </Card>
          )}
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
              className="bg-white rounded-2xl shadow-xl max-w-[95vw] lg:max-w-3xl w-full max-h-[95vh] overflow-hidden m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 lg:p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl lg:text-2xl font-bold mb-2">
                      {showCreateModal ? 'Create Channel Partner' : 'Edit Channel Partner'}
                    </h3>
                    <p className="text-blue-100 text-sm lg:text-base">
                      {showCreateModal 
                        ? 'Fill in the channel partner details below. Mobile OTP login will be enabled.'
                        : 'Update the channel partner details below.'
                      }
                    </p>
                  </div>
                  <button
                    onClick={closeModals}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors flex-shrink-0 ml-2"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSavePartner(); }} className="p-4 lg:p-6 space-y-4 lg:space-y-6 max-h-[calc(95vh-200px)] overflow-y-auto">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
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

        {/* Assign Lead Modal */}
        {showAssignLeadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAssignLeadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Assign Lead</h3>
                <button onClick={() => setShowAssignLeadModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Select Channel Partner</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Rajesh Kumar</option>
                    <option>Priya Sharma</option>
                    <option>Amit Patel</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowAssignLeadModal(false)}>Cancel</Button>
                  <Button>Assign</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Lead Details Modal */}
        {showLeadDetailsModal && selectedLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => { setShowLeadDetailsModal(false); setSelectedLead(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-[95vw] lg:max-w-3xl w-full max-h-[90vh] overflow-hidden m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 lg:p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl lg:text-2xl font-bold truncate">Lead Details</h3>
                    <p className="text-blue-100 text-xs lg:text-sm mt-1 truncate">{selectedLead.name}</p>
                  </div>
                  <button onClick={() => { setShowLeadDetailsModal(false); setSelectedLead(null); }} className="p-2 hover:bg-white/20 rounded-full flex-shrink-0 ml-2">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                {/* Lead Information Section */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
                    <Users className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                    Lead Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Lead Name</p>
                      <p className="text-sm text-gray-900">{selectedLead.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Phone Number</p>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-900">{selectedLead.phone}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Email Address</p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-900">{selectedLead.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Project Type</p>
                      <p className="text-sm text-gray-900">{selectedLead.projectType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Status</p>
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        selectedLead.status === 'Hot' ? 'bg-red-100 text-red-800' :
                        selectedLead.status === 'Connected' ? 'bg-blue-100 text-blue-800' :
                        selectedLead.status === 'Converted' ? 'bg-green-100 text-green-800' :
                        selectedLead.status === 'Lost' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedLead.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Project Value / Budget</p>
                      <p className="text-sm font-bold text-gray-900">{selectedLead.value || selectedLead.budget || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Created Date</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-900">{formatDate(selectedLead.createdDate)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Last Updated</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-900">{formatDate(selectedLead.lastUpdated)}</p>
                      </div>
                    </div>
                  </div>
                  {selectedLead.notes && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Notes</p>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedLead.notes}</p>
                    </div>
                  )}
                </div>

                {/* Channel Partner Information Section */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
                    <Handshake className="h-4 w-4 lg:h-5 lg:w-5 text-purple-600" />
                    Channel Partner Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Channel Partner Name</p>
                      <p className="text-sm text-gray-900">{selectedLead.cpName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Phone Number</p>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-900">{selectedLead.cpPhone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sales Team Assignment Section */}
                <div>
                  <h4 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
                    <UserCheck className="h-4 w-4 lg:h-5 lg:w-5 text-green-600" />
                    Sales Team Assignment
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Assigned Sales Lead</p>
                      {selectedLead.assignedSalesLead ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <p className="text-sm text-gray-900">{selectedLead.assignedSalesLead}</p>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Not assigned</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Assignment Status</p>
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        selectedLead.assignedSalesLead ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {selectedLead.assignedSalesLead ? 'Assigned' : 'Unassigned'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Transaction Details Modal */}
        {showTransactionModal && selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => { setShowTransactionModal(false); setSelectedTransaction(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Transaction Details</h3>
                <button onClick={() => { setShowTransactionModal(false); setSelectedTransaction(null); }} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Channel Partner</p>
                  <p className="text-sm text-gray-900">{selectedTransaction.cpName}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Type</p>
                  <p className="text-sm text-gray-900">{selectedTransaction.type}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Amount</p>
                  <p className="text-sm font-bold text-gray-900">₹{selectedTransaction.amount.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    selectedTransaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {selectedTransaction.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Description</p>
                  <p className="text-sm text-gray-900">{selectedTransaction.description}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Date</p>
                  <p className="text-sm text-gray-900">{formatDate(selectedTransaction.date)}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Assign Reward Modal */}
        {showAssignRewardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAssignRewardModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Assign Reward</h3>
                <button onClick={() => setShowAssignRewardModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Channel Partner</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Rajesh Kumar</option>
                    <option>Priya Sharma</option>
                    <option>Amit Patel</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Reward Type</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Bonus</option>
                    <option>Milestone</option>
                    <option>Special</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Amount</label>
                  <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter amount" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Description</label>
                  <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Enter description"></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowAssignRewardModal(false)}>Cancel</Button>
                  <Button>Assign Reward</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Milestone Configuration Modal */}
        {showMilestoneModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowMilestoneModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Configure Milestones</h3>
                  <button onClick={() => setShowMilestoneModal(false)} className="p-2 hover:bg-white/20 rounded-full">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto">
                <div className="space-y-3">
                  {mockMilestones.map((milestone) => (
                    <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                          <p className="text-sm text-gray-500">{milestone.requirement}</p>
                          <p className="text-sm font-semibold text-purple-600 mt-1">Reward: ₹{milestone.reward.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Milestone
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Assign Team Modal */}
        {showAssignTeamModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => { setShowAssignTeamModal(false); setSelectedCPForTeam(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Assign Team</h3>
                <button onClick={() => { setShowAssignTeamModal(false); setSelectedCPForTeam(null); }} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Channel Partner</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Rajesh Kumar</option>
                    <option>Priya Sharma</option>
                    <option>Amit Patel</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Sales Lead</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Rahul Sharma</option>
                    <option>Other Sales Lead</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Team Members</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-700">Priya Verma</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-700">Amit Kumar</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => { setShowAssignTeamModal(false); setSelectedCPForTeam(null); }}>Cancel</Button>
                  <Button>Assign Team</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Admin_channel_partner_management
