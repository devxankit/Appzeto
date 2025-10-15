
import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiRefreshCw, 
  FiSearch, 
  FiFilter,
  FiEye, 
  FiEdit3, 
  FiTrash2, 
  FiPlus,
  FiUsers,
  FiUser,
  FiHome,
  FiTrendingUp,
  FiCreditCard,
  FiTarget,
  FiCalendar,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiStar,
  FiBarChart,
  FiPieChart,
  FiActivity,
  FiUpload,
  FiFile,
  FiX
} from 'react-icons/fi'
import Admin_navbar from '../admin-components/Admin_navbar'
import Admin_sidebar from '../admin-components/Admin_sidebar'
import Loading from '../../../components/ui/loading'

const Admin_sales_management = () => {
  // State management
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('leads')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddLeadModal, setShowAddLeadModal] = useState(false)
  const [showBulkLeadModal, setShowBulkLeadModal] = useState(false)
  const [showTargetModal, setShowTargetModal] = useState(false)
  const [showAssignLeadModal, setShowAssignLeadModal] = useState(false)
  const [showLeadListModal, setShowLeadListModal] = useState(false)
  const [showIncentiveModal, setShowIncentiveModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showCategoryEditModal, setShowCategoryEditModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalType, setModalType] = useState('')
  const [selectedLeadCategory, setSelectedLeadCategory] = useState('')
  const [selectedLeadCategoryData, setSelectedLeadCategoryData] = useState([])
  
  // Form states
  const [leadNumber, setLeadNumber] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [targetAmount, setTargetAmount] = useState('')
  const [leadsToAssign, setLeadsToAssign] = useState('')
  const [incentiveAmount, setIncentiveAmount] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [categoryColor, setCategoryColor] = useState('#3B82F6')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [assignCategoryFilter, setAssignCategoryFilter] = useState('all')
  const [leadsPerCategory, setLeadsPerCategory] = useState({})

  // Mock statistics data
  const [statistics] = useState({
    leads: {
      total: 1247,
      new: 89,
      connected: 156,
      converted: 234,
      hot: 23
    },
    sales: {
      total: 2450000,
      thisMonth: 180000,
      target: 3000000,
      conversion: 12.5
    },
    earnings: {
      total: 1980000,
      collected: 1650000,
      pending: 330000,
      thisMonth: 145000
    },
    team: {
      total: 8,
      active: 7,
      performance: 87.5,
      topPerformer: 'Sarah Wilson'
    },
    clients: {
      total: 342,
      active: 298,
      new: 24,
      retention: 94.2
    }
  })

  // Mock data for different entities
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: 'Lead 1',
      company: 'Unknown Company',
      phone: '+91 9876543210',
      email: 'lead1@example.com',
      status: 'hot',
      priority: 'high',
      source: 'manual',
      value: 25000,
      lastContact: '2024-01-20',
      nextFollowUp: '2024-01-27',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 1,
      category: 'Hot Leads'
    },
    {
      id: 2,
      name: 'Lead 2',
      company: 'Unknown Company',
      phone: '+91 9876543211',
      email: 'lead2@example.com',
      status: 'connected',
      priority: 'medium',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-20',
      nextFollowUp: '2024-01-27',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 2,
      category: 'Cold Leads'
    },
    {
      id: 3,
      name: 'Lead 3',
      company: 'Unknown Company',
      phone: '+91 9876543212',
      email: 'lead3@example.com',
      status: 'new',
      priority: 'medium',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-20',
      nextFollowUp: '2024-01-27',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 3,
      category: 'Warm Leads'
    },
    {
      id: 4,
      name: 'Lead 4',
      company: 'Unknown Company',
      phone: '+91 9876543213',
      email: 'lead4@example.com',
      status: 'converted',
      priority: 'high',
      source: 'manual',
      value: 25000,
      lastContact: '2024-01-19',
      nextFollowUp: '2024-01-26',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 4,
      category: 'Enterprise'
    },
    {
      id: 5,
      name: 'Lead 5',
      company: 'Unknown Company',
      phone: '+91 9876543214',
      email: 'lead5@example.com',
      status: 'lost',
      priority: 'low',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-19',
      nextFollowUp: '2024-01-26',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 5,
      category: 'SME'
    },
    {
      id: 6,
      name: 'Lead 6',
      company: 'Unknown Company',
      phone: '+91 9876543215',
      email: 'lead6@example.com',
      status: 'hot',
      priority: 'high',
      source: 'manual',
      value: 25000,
      lastContact: '2024-01-18',
      nextFollowUp: '2024-01-25',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 1,
      category: 'Hot Leads'
    },
    {
      id: 7,
      name: 'Lead 7',
      company: 'Unknown Company',
      phone: '+91 9876543216',
      email: 'lead7@example.com',
      status: 'connected',
      priority: 'medium',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-18',
      nextFollowUp: '2024-01-25',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 2,
      category: 'Cold Leads'
    },
    {
      id: 8,
      name: 'Lead 8',
      company: 'Unknown Company',
      phone: '+91 9876543217',
      email: 'lead8@example.com',
      status: 'new',
      priority: 'medium',
      source: 'manual',
      value: 25000,
      lastContact: '2024-01-17',
      nextFollowUp: '2024-01-24',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 3,
      category: 'Warm Leads'
    },
    {
      id: 9,
      name: 'Lead 9',
      company: 'Unknown Company',
      phone: '+91 9876543218',
      email: 'lead9@example.com',
      status: 'converted',
      priority: 'high',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-17',
      nextFollowUp: '2024-01-24',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 4,
      category: 'Enterprise'
    },
    {
      id: 10,
      name: 'Lead 10',
      company: 'Unknown Company',
      phone: '+91 9876543219',
      email: 'lead10@example.com',
      status: 'lost',
      priority: 'low',
      source: 'manual',
      value: 25000,
      lastContact: '2024-01-16',
      nextFollowUp: '2024-01-23',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 5,
      category: 'SME'
    },
    {
      id: 11,
      name: 'Lead 11',
      company: 'Unknown Company',
      phone: '+91 9876543220',
      email: 'lead11@example.com',
      status: 'hot',
      priority: 'high',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-16',
      nextFollowUp: '2024-01-23',
      assignedTo: 'Michael Chen',
      notes: 'Bulk uploaded lead',
      categoryId: 1,
      category: 'Hot Leads'
    },
    {
      id: 12,
      name: 'Lead 12',
      company: 'Unknown Company',
      phone: '+91 9876543221',
      email: 'lead12@example.com',
      status: 'connected',
      priority: 'medium',
      source: 'manual',
      value: 25000,
      lastContact: '2024-01-15',
      nextFollowUp: '2024-01-22',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 2,
      category: 'Cold Leads'
    },
    {
      id: 13,
      name: 'Lead 13',
      company: 'Unknown Company',
      phone: '+91 9876543222',
      email: 'lead13@example.com',
      status: 'new',
      priority: 'medium',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-15',
      nextFollowUp: '2024-01-22',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 3,
      category: 'Warm Leads'
    },
    {
      id: 14,
      name: 'Lead 14',
      company: 'Unknown Company',
      phone: '+91 9876543223',
      email: 'lead14@example.com',
      status: 'converted',
      priority: 'high',
      source: 'manual',
      value: 25000,
      lastContact: '2024-01-14',
      nextFollowUp: '2024-01-21',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 4,
      category: 'Enterprise'
    },
    {
      id: 15,
      name: 'Lead 15',
      company: 'Unknown Company',
      phone: '+91 9876543224',
      email: 'lead15@example.com',
      status: 'lost',
      priority: 'low',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-14',
      nextFollowUp: '2024-01-21',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 5,
      category: 'SME'
    },
    {
      id: 16,
      name: 'Lead 16',
      company: 'Unknown Company',
      phone: '+91 9876543225',
      email: 'lead16@example.com',
      status: 'hot',
      priority: 'high',
      source: 'manual',
      value: 25000,
      lastContact: '2024-01-13',
      nextFollowUp: '2024-01-20',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 1,
      category: 'Hot Leads'
    },
    {
      id: 17,
      name: 'Lead 17',
      company: 'Unknown Company',
      phone: '+91 9876543226',
      email: 'lead17@example.com',
      status: 'connected',
      priority: 'medium',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-13',
      nextFollowUp: '2024-01-20',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 2,
      category: 'Cold Leads'
    },
    {
      id: 18,
      name: 'Lead 18',
      company: 'Unknown Company',
      phone: '+91 9876543227',
      email: 'lead18@example.com',
      status: 'new',
      priority: 'medium',
      source: 'manual',
      value: 25000,
      lastContact: '2024-01-12',
      nextFollowUp: '2024-01-19',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 3,
      category: 'Warm Leads'
    },
    {
      id: 19,
      name: 'Lead 19',
      company: 'Unknown Company',
      phone: '+91 9876543228',
      email: 'lead19@example.com',
      status: 'converted',
      priority: 'high',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-12',
      nextFollowUp: '2024-01-19',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 4,
      category: 'Enterprise'
    },
    {
      id: 20,
      name: 'Lead 20',
      company: 'Unknown Company',
      phone: '+91 9876543229',
      email: 'lead20@example.com',
      status: 'lost',
      priority: 'low',
      source: 'manual',
      value: 25000,
      lastContact: '2024-01-11',
      nextFollowUp: '2024-01-18',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 5,
      category: 'SME'
    },
    {
      id: 21,
      name: 'Lead 21',
      company: 'Unknown Company',
      phone: '+91 9876543230',
      email: 'lead21@example.com',
      status: 'hot',
      priority: 'high',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-11',
      nextFollowUp: '2024-01-18',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 1,
      category: 'Hot Leads'
    },
    {
      id: 22,
      name: 'Lead 22',
      company: 'Unknown Company',
      phone: '+91 9876543231',
      email: 'lead22@example.com',
      status: 'connected',
      priority: 'medium',
      source: 'manual',
      value: 25000,
      lastContact: '2024-01-10',
      nextFollowUp: '2024-01-17',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 2,
      category: 'Cold Leads'
    },
    {
      id: 23,
      name: 'Lead 23',
      company: 'Unknown Company',
      phone: '+91 9876543232',
      email: 'lead23@example.com',
      status: 'new',
      priority: 'medium',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-10',
      nextFollowUp: '2024-01-17',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 3,
      category: 'Warm Leads'
    },
    {
      id: 24,
      name: 'Lead 24',
      company: 'Unknown Company',
      phone: '+91 9876543233',
      email: 'lead24@example.com',
      status: 'converted',
      priority: 'high',
      source: 'manual',
      value: 25000,
      lastContact: '2024-01-09',
      nextFollowUp: '2024-01-16',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 4,
      category: 'Enterprise'
    },
    {
      id: 25,
      name: 'Lead 25',
      company: 'Unknown Company',
      phone: '+91 9876543234',
      email: 'lead25@example.com',
      status: 'lost',
      priority: 'low',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-09',
      nextFollowUp: '2024-01-16',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 5,
      category: 'SME'
    },
    {
      id: 26,
      name: 'Lead 26',
      company: 'Unknown Company',
      phone: '+91 9876543235',
      email: 'lead26@example.com',
      status: 'hot',
      priority: 'high',
      source: 'manual',
      value: 25000,
      lastContact: '2024-01-08',
      nextFollowUp: '2024-01-15',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 1,
      category: 'Hot Leads'
    },
    {
      id: 27,
      name: 'Lead 27',
      company: 'Unknown Company',
      phone: '+91 9876543236',
      email: 'lead27@example.com',
      status: 'connected',
      priority: 'medium',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-08',
      nextFollowUp: '2024-01-15',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 2,
      category: 'Cold Leads'
    },
    {
      id: 28,
      name: 'Lead 28',
      company: 'Unknown Company',
      phone: '+91 9876543237',
      email: 'lead28@example.com',
      status: 'new',
      priority: 'medium',
      source: 'manual',
      value: 25000,
      lastContact: '2024-01-07',
      nextFollowUp: '2024-01-14',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 3,
      category: 'Warm Leads'
    },
    {
      id: 29,
      name: 'Lead 29',
      company: 'Unknown Company',
      phone: '+91 9876543238',
      email: 'lead29@example.com',
      status: 'converted',
      priority: 'high',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-07',
      nextFollowUp: '2024-01-14',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 4,
      category: 'Enterprise'
    },
    {
      id: 30,
      name: 'Lead 30',
      company: 'Unknown Company',
      phone: '+91 9876543239',
      email: 'lead30@example.com',
      status: 'lost',
      priority: 'low',
      source: 'manual',
      value: 25000,
      lastContact: '2024-01-06',
      nextFollowUp: '2024-01-13',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 5,
      category: 'SME'
    },
    {
      id: 31,
      name: 'Lead 31',
      company: 'Unknown Company',
      phone: '+91 9876543240',
      email: 'lead31@example.com',
      status: 'hot',
      priority: 'high',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-06',
      nextFollowUp: '2024-01-13',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 1,
      category: 'Hot Leads'
    },
    {
      id: 32,
      name: 'Lead 32',
      company: 'Unknown Company',
      phone: '+91 9876543241',
      email: 'lead32@example.com',
      status: 'connected',
      priority: 'medium',
      source: 'manual',
      value: 25000,
      lastContact: '2024-01-05',
      nextFollowUp: '2024-01-12',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 2,
      category: 'Cold Leads'
    },
    {
      id: 33,
      name: 'Lead 33',
      company: 'Unknown Company',
      phone: '+91 9876543242',
      email: 'lead33@example.com',
      status: 'new',
      priority: 'medium',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-05',
      nextFollowUp: '2024-01-12',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 3,
      category: 'Warm Leads'
    },
    {
      id: 34,
      name: 'Lead 34',
      company: 'Unknown Company',
      phone: '+91 9876543243',
      email: 'lead34@example.com',
      status: 'converted',
      priority: 'high',
      source: 'manual',
      value: 25000,
      lastContact: '2024-01-04',
      nextFollowUp: '2024-01-11',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 4,
      category: 'Enterprise'
    },
    {
      id: 35,
      name: 'Lead 35',
      company: 'Unknown Company',
      phone: '+91 9876543244',
      email: 'lead35@example.com',
      status: 'lost',
      priority: 'low',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-04',
      nextFollowUp: '2024-01-11',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 5,
      category: 'SME'
    },
    {
      id: 36,
      name: 'Lead 36',
      company: 'Unknown Company',
      phone: '+91 9876543245',
      email: 'lead36@example.com',
      status: 'hot',
      priority: 'high',
      source: 'manual',
      value: 25000,
      lastContact: '2024-01-03',
      nextFollowUp: '2024-01-10',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 1,
      category: 'Hot Leads'
    },
    {
      id: 37,
      name: 'Lead 37',
      company: 'Unknown Company',
      phone: '+91 9876543246',
      email: 'lead37@example.com',
      status: 'connected',
      priority: 'medium',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-03',
      nextFollowUp: '2024-01-10',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 2,
      category: 'Cold Leads'
    },
    {
      id: 38,
      name: 'Lead 38',
      company: 'Unknown Company',
      phone: '+91 9876543247',
      email: 'lead38@example.com',
      status: 'new',
      priority: 'medium',
      source: 'manual',
      value: 25000,
      lastContact: '2024-01-02',
      nextFollowUp: '2024-01-09',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 3,
      category: 'Warm Leads'
    },
    {
      id: 39,
      name: 'Lead 39',
      company: 'Unknown Company',
      phone: '+91 9876543248',
      email: 'lead39@example.com',
      status: 'converted',
      priority: 'high',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-02',
      nextFollowUp: '2024-01-09',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 4,
      category: 'Enterprise'
    },
    {
      id: 40,
      name: 'Lead 40',
      company: 'Unknown Company',
      phone: '+91 9876543249',
      email: 'lead40@example.com',
      status: 'lost',
      priority: 'low',
      source: 'manual',
      value: 25000,
      lastContact: '2024-01-01',
      nextFollowUp: '2024-01-08',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 5,
      category: 'SME'
    },
    {
      id: 41,
      name: 'Lead 41',
      company: 'Unknown Company',
      phone: '+91 9876543250',
      email: 'lead41@example.com',
      status: 'hot',
      priority: 'high',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2024-01-01',
      nextFollowUp: '2024-01-08',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 1,
      category: 'Hot Leads'
    },
    {
      id: 42,
      name: 'Lead 42',
      company: 'Unknown Company',
      phone: '+91 9876543251',
      email: 'lead42@example.com',
      status: 'connected',
      priority: 'medium',
      source: 'manual',
      value: 25000,
      lastContact: '2023-12-31',
      nextFollowUp: '2024-01-07',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 2,
      category: 'Cold Leads'
    },
    {
      id: 43,
      name: 'Lead 43',
      company: 'Unknown Company',
      phone: '+91 9876543252',
      email: 'lead43@example.com',
      status: 'new',
      priority: 'medium',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2023-12-31',
      nextFollowUp: '2024-01-07',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 3,
      category: 'Warm Leads'
    },
    {
      id: 44,
      name: 'Lead 44',
      company: 'Unknown Company',
      phone: '+91 9876543253',
      email: 'lead44@example.com',
      status: 'converted',
      priority: 'high',
      source: 'manual',
      value: 25000,
      lastContact: '2023-12-30',
      nextFollowUp: '2024-01-06',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 4,
      category: 'Enterprise'
    },
    {
      id: 45,
      name: 'Lead 45',
      company: 'Unknown Company',
      phone: '+91 9876543254',
      email: 'lead45@example.com',
      status: 'lost',
      priority: 'low',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2023-12-30',
      nextFollowUp: '2024-01-06',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 5,
      category: 'SME'
    },
    {
      id: 46,
      name: 'Lead 46',
      company: 'Unknown Company',
      phone: '+91 9876543255',
      email: 'lead46@example.com',
      status: 'hot',
      priority: 'high',
      source: 'manual',
      value: 25000,
      lastContact: '2023-12-29',
      nextFollowUp: '2024-01-05',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 1,
      category: 'Hot Leads'
    },
    {
      id: 47,
      name: 'Lead 47',
      company: 'Unknown Company',
      phone: '+91 9876543256',
      email: 'lead47@example.com',
      status: 'connected',
      priority: 'medium',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2023-12-29',
      nextFollowUp: '2024-01-05',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 2,
      category: 'Cold Leads'
    },
    {
      id: 48,
      name: 'Lead 48',
      company: 'Unknown Company',
      phone: '+91 9876543257',
      email: 'lead48@example.com',
      status: 'new',
      priority: 'medium',
      source: 'manual',
      value: 25000,
      lastContact: '2023-12-28',
      nextFollowUp: '2024-01-04',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 3,
      category: 'Warm Leads'
    },
    {
      id: 49,
      name: 'Lead 49',
      company: 'Unknown Company',
      phone: '+91 9876543258',
      email: 'lead49@example.com',
      status: 'converted',
      priority: 'high',
      source: 'bulk_upload',
      value: 25000,
      lastContact: '2023-12-28',
      nextFollowUp: '2024-01-04',
      assignedTo: 'Sarah Wilson',
      notes: 'Bulk uploaded lead',
      categoryId: 4,
      category: 'Enterprise'
    },
    {
      id: 50,
      name: 'Lead 50',
      company: 'Unknown Company',
      phone: '+91 9876543259',
      email: 'lead50@example.com',
      status: 'lost',
      priority: 'low',
      source: 'manual',
      value: 25000,
      lastContact: '2023-12-27',
      nextFollowUp: '2024-01-03',
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: 5,
      category: 'SME'
    }
  ])

  // Mock data for lead categories
  const [leadCategories, setLeadCategories] = useState([
    {
      id: 1,
      name: 'Hot Leads',
      description: 'High priority leads with immediate potential',
      color: '#EF4444',
      icon: '🔥',
      createdAt: '2024-01-01',
      leadCount: 10
    },
    {
      id: 2,
      name: 'Cold Leads',
      description: 'Leads that need nurturing and follow-up',
      color: '#3B82F6',
      icon: '❄️',
      createdAt: '2024-01-01',
      leadCount: 10
    },
    {
      id: 3,
      name: 'Warm Leads',
      description: 'Leads showing interest but not ready to convert',
      color: '#F59E0B',
      icon: '🌡️',
      createdAt: '2024-01-01',
      leadCount: 10
    },
    {
      id: 4,
      name: 'Enterprise',
      description: 'Large enterprise clients and prospects',
      color: '#8B5CF6',
      icon: '🏢',
      createdAt: '2024-01-01',
      leadCount: 10
    },
    {
      id: 5,
      name: 'SME',
      description: 'Small and medium enterprise prospects',
      color: '#10B981',
      icon: '🏪',
      createdAt: '2024-01-01',
      leadCount: 10
    }
  ])

  const [salesTeam, setSalesTeam] = useState([
    {
      id: 1,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      phone: '+91 98765 43210',
      department: 'Sales',
      position: 'Senior Sales Manager',
      status: 'active',
      performance: 95,
      leadsCount: 25,
      convertedCount: 18,
      revenue: 450000,
      target: 500000,
      incentive: 45000,
      joinDate: '2022-03-15',
      lastActivity: '2024-01-20',
      avatar: 'SW',
      leadBreakdown: {
        new: 5,
        contacted: 8,
        notPicked: 3,
        todayFollowUp: 2,
        quotationSent: 4,
        dqSent: 3,
        appClient: 2,
        web: 1,
        converted: 18,
        lost: 7,
        notInterested: 4,
        hotLead: 6,
        demoSent: 5,
        app: 3,
        taxi: 1
      }
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      phone: '+91 98765 43211',
      department: 'Sales',
      position: 'Sales Representative',
      status: 'active',
      performance: 87,
      leadsCount: 20,
      convertedCount: 14,
      revenue: 320000,
      target: 400000,
      incentive: 32000,
      joinDate: '2023-01-10',
      lastActivity: '2024-01-19',
      avatar: 'MC',
      leadBreakdown: {
        new: 3,
        contacted: 6,
        notPicked: 2,
        todayFollowUp: 1,
        quotationSent: 3,
        dqSent: 2,
        appClient: 1,
        web: 0,
        converted: 14,
        lost: 5,
        notInterested: 3,
        hotLead: 4,
        demoSent: 3,
        app: 2,
        taxi: 0
      }
    },
    {
      id: 3,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@company.com',
      phone: '+91 98765 43212',
      department: 'Sales',
      position: 'Sales Director',
      status: 'active',
      performance: 92,
      leadsCount: 30,
      convertedCount: 22,
      revenue: 580000,
      target: 600000,
      incentive: 58000,
      joinDate: '2021-08-20',
      lastActivity: '2024-01-20',
      avatar: 'LA',
      leadBreakdown: {
        new: 8,
        contacted: 10,
        notPicked: 4,
        todayFollowUp: 3,
        quotationSent: 6,
        dqSent: 4,
        appClient: 3,
        web: 2,
        converted: 22,
        lost: 8,
        notInterested: 5,
        hotLead: 7,
        demoSent: 6,
        app: 4,
        taxi: 2
      }
    },
    {
      id: 4,
      name: 'David Rodriguez',
      email: 'david.rodriguez@company.com',
      phone: '+91 98765 43213',
      department: 'Sales',
      position: 'Sales Representative',
      status: 'inactive',
      performance: 78,
      leadsCount: 15,
      convertedCount: 10,
      revenue: 240000,
      target: 300000,
      incentive: 24000,
      joinDate: '2023-06-05',
      lastActivity: '2024-01-15',
      avatar: 'DR',
      leadBreakdown: {
        new: 2,
        contacted: 4,
        notPicked: 3,
        todayFollowUp: 1,
        quotationSent: 2,
        dqSent: 1,
        appClient: 1,
        web: 0,
        converted: 10,
        lost: 5,
        notInterested: 2,
        hotLead: 3,
        demoSent: 2,
        app: 1,
        taxi: 0
      }
    },
    {
      id: 5,
      name: 'Emily Johnson',
      email: 'emily.johnson@company.com',
      phone: '+91 98765 43214',
      department: 'Sales',
      position: 'Sales Manager',
      status: 'active',
      performance: 89,
      leadsCount: 22,
      convertedCount: 16,
      revenue: 380000,
      target: 450000,
      incentive: 38000,
      joinDate: '2022-11-12',
      lastActivity: '2024-01-18',
      avatar: 'EJ',
      leadBreakdown: {
        new: 4,
        contacted: 7,
        notPicked: 2,
        todayFollowUp: 2,
        quotationSent: 3,
        dqSent: 2,
        appClient: 2,
        web: 1,
        converted: 16,
        lost: 6,
        notInterested: 3,
        hotLead: 5,
        demoSent: 4,
        app: 2,
        taxi: 1
      }
    }
  ])

  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'Tech Solutions Inc.',
      contactPerson: 'John Smith',
      email: 'john@techsolutions.com',
      phone: '+91 98765 43220',
      status: 'active',
      totalSpent: 125000,
      projectsCompleted: 3,
      lastContact: '2024-01-15',
      joinDate: '2023-05-10',
      industry: 'Technology',
      location: 'Mumbai',
      avatar: 'TS'
    },
    {
      id: 2,
      name: 'Digital Marketing Pro',
      contactPerson: 'Emily Johnson',
      email: 'emily@digitalpro.com',
      phone: '+91 98765 43221',
      status: 'active',
      totalSpent: 85000,
      projectsCompleted: 2,
      lastContact: '2024-01-18',
      joinDate: '2023-08-15',
      industry: 'Marketing',
      location: 'Delhi',
      avatar: 'DM'
    },
    {
      id: 3,
      name: 'E-commerce Store',
      contactPerson: 'Robert Davis',
      email: 'robert@estore.com',
      phone: '+91 98765 43222',
      status: 'inactive',
      totalSpent: 45000,
      projectsCompleted: 1,
      lastContact: '2023-12-20',
      joinDate: '2023-10-05',
      industry: 'Retail',
      location: 'Bangalore',
      avatar: 'ES'
    },
    {
      id: 4,
      name: 'Healthcare Systems',
      contactPerson: 'Dr. Sarah Wilson',
      email: 'sarah@healthcare.com',
      phone: '+91 98765 43223',
      status: 'active',
      totalSpent: 200000,
      projectsCompleted: 4,
      lastContact: '2024-01-20',
      joinDate: '2022-12-01',
      industry: 'Healthcare',
      location: 'Chennai',
      avatar: 'HS'
    },
    {
      id: 5,
      name: 'Finance Corp',
      contactPerson: 'Michael Brown',
      email: 'michael@financecorp.com',
      phone: '+91 98765 43224',
      status: 'active',
      totalSpent: 150000,
      projectsCompleted: 2,
      lastContact: '2024-01-19',
      joinDate: '2023-03-20',
      industry: 'Finance',
      location: 'Pune',
      avatar: 'FC'
    }
  ])

  // Category Performance Calculations
  const categoryPerformance = useMemo(() => {
    return leadCategories.map(category => {
      const categoryLeads = leads.filter(lead => lead.categoryId === category.id)
      const totalLeads = categoryLeads.length
      
      // Calculate conversion rates based on lead status
      const convertedLeads = categoryLeads.filter(lead => 
        lead.status === 'converted' || lead.status === 'client' || lead.status === 'closed'
      ).length
      
      const hotLeads = categoryLeads.filter(lead => lead.status === 'hot' || lead.priority === 'high').length
      const warmLeads = categoryLeads.filter(lead => lead.status === 'warm' || lead.priority === 'medium').length
      const coldLeads = categoryLeads.filter(lead => lead.status === 'cold' || lead.priority === 'low').length
      const lostLeads = categoryLeads.filter(lead => lead.status === 'lost' || lead.status === 'notInterested').length
      
      // Calculate revenue
      const totalRevenue = categoryLeads.reduce((sum, lead) => sum + (lead.value || 0), 0)
      const convertedRevenue = categoryLeads
        .filter(lead => lead.status === 'converted' || lead.status === 'client' || lead.status === 'closed')
        .reduce((sum, lead) => sum + (lead.value || 0), 0)
      
      // Calculate conversion rate
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0
      
      // Calculate average deal value
      const avgDealValue = convertedLeads > 0 ? convertedRevenue / convertedLeads : 0
      
      // Calculate response rate (leads with recent contact)
      const recentContactLeads = categoryLeads.filter(lead => {
        const lastContact = new Date(lead.lastContact)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        return lastContact >= thirtyDaysAgo
      }).length
      
      const responseRate = totalLeads > 0 ? (recentContactLeads / totalLeads) * 100 : 0
      
      return {
        ...category,
        totalLeads,
        convertedLeads,
        hotLeads,
        warmLeads,
        coldLeads,
        lostLeads,
        totalRevenue,
        convertedRevenue,
        conversionRate: Math.round(conversionRate * 100) / 100,
        avgDealValue: Math.round(avgDealValue),
        responseRate: Math.round(responseRate * 100) / 100,
        unassignedLeads: categoryLeads.filter(lead => lead.assignedTo === 'Unassigned').length
      }
    })
  }, [leads, leadCategories])

  // Overall performance metrics
  const overallPerformance = useMemo(() => {
    const totalLeads = leads.length
    const totalConverted = leads.filter(lead => 
      lead.status === 'converted' || lead.status === 'client' || lead.status === 'closed'
    ).length
    const totalRevenue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0)
    const convertedRevenue = leads
      .filter(lead => lead.status === 'converted' || lead.status === 'client' || lead.status === 'closed')
      .reduce((sum, lead) => sum + (lead.value || 0), 0)
    
    return {
      totalLeads,
      totalConverted,
      totalRevenue,
      convertedRevenue,
      overallConversionRate: totalLeads > 0 ? Math.round((totalConverted / totalLeads) * 100 * 100) / 100 : 0,
      avgDealValue: totalConverted > 0 ? Math.round(convertedRevenue / totalConverted) : 0
    }
  }, [leads])

  // Load data function
  const loadData = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  // Reset filter when switching tabs
  useEffect(() => {
    setSelectedFilter('all')
    setSearchTerm('')
    setCurrentPage(1)
    setSelectedCategory('')
  }, [activeTab])

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800 border-red-200'
      case 'connected': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'new': return 'bg-green-100 text-green-800 border-green-200'
      case 'converted': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'lost': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'leads': return leads
      case 'sales-team': return salesTeam
      case 'clients': return clients
      default: return leads
    }
  }

  // Filter data based on search and filter criteria
  const filteredData = useMemo(() => {
    const data = getCurrentData()
    return data.filter(item => {
      const matchesSearch = Object.values(item).some(value => 
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      let matchesFilter = true
      if (selectedFilter !== 'all') {
        if (activeTab === 'leads') {
          // Handle date-based filters for leads
          if (selectedFilter === 'today' || selectedFilter === 'week' || selectedFilter === 'month') {
            const itemDate = new Date(item.lastContact)
            const today = new Date()
            const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
            const startOfWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000))
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
            
            switch (selectedFilter) {
              case 'today':
                matchesFilter = itemDate >= startOfToday
                break
              case 'week':
                matchesFilter = itemDate >= startOfWeek
                break
              case 'month':
                matchesFilter = itemDate >= startOfMonth
                break
              default:
                matchesFilter = true
            }
          } else {
            // Handle status-based filters
        matchesFilter = item.status === selectedFilter || item.priority === selectedFilter
          }
        } else {
          matchesFilter = item.status === selectedFilter || item.priority === selectedFilter
        }
      }

      // Handle category filter for leads
      let matchesCategory = true
      if (activeTab === 'leads' && selectedCategory) {
        matchesCategory = item.categoryId === parseInt(selectedCategory)
      }
      
      return matchesSearch && matchesFilter && matchesCategory
    })
  }, [activeTab, searchTerm, selectedFilter, selectedCategory, leads, salesTeam, clients])

  // Pagination
  const paginatedData = useMemo(() => {
    let sortedData = [...filteredData]
    
    // Sort leads by date (newest first) when on leads tab
    if (activeTab === 'leads') {
      sortedData.sort((a, b) => new Date(b.lastContact) - new Date(a.lastContact))
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage, activeTab])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Management functions
  const handleCreate = (type) => {
    setModalType(type)
    setSelectedItem(null)
    setShowCreateModal(true)
  }

  const handleEdit = (item, type) => {
    setModalType(type)
    setSelectedItem(item)
    setShowEditModal(true)
  }

  const handleView = (item, type) => {
    setModalType(type)
    setSelectedItem(item)
    setShowViewModal(true)
  }

  const handleDelete = (item, type) => {
    setModalType(type)
    setSelectedItem(item)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    // Simulate delete operation
    console.log('Deleting item:', selectedItem)
    setShowDeleteModal(false)
    setSelectedItem(null)
  }

  const handleSave = (formData) => {
    // Simulate save operation
    console.log('Saving data:', formData)
    setShowCreateModal(false)
    setShowEditModal(false)
    setSelectedItem(null)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowViewModal(false)
    setShowDeleteModal(false)
    setShowAddLeadModal(false)
    setShowBulkLeadModal(false)
    setShowTargetModal(false)
    setShowAssignLeadModal(false)
    setShowLeadListModal(false)
    setShowIncentiveModal(false)
    setShowCategoryModal(false)
    setShowCategoryEditModal(false)
    setSelectedItem(null)
    setLeadNumber('')
    setUploadedFile(null)
    setUploadProgress(0)
    setTargetAmount('')
    setLeadsToAssign('')
    setIncentiveAmount('')
    setSelectedLeadCategory('')
    setSelectedLeadCategoryData([])
    setCategoryName('')
    setCategoryDescription('')
    setCategoryColor('#3B82F6')
    setSelectedCategory('')
    setAssignCategoryFilter('all')
    setLeadsPerCategory({})
  }

  // Close only the lead list modal while keeping view details modal open
  const closeLeadListModal = () => {
    setShowLeadListModal(false)
    setSelectedLeadCategory('')
    setSelectedLeadCategoryData([])
  }

  // Handle lead category click
  const handleLeadCategoryClick = (category, member) => {
    const categoryCount = member.leadBreakdown[category]
    if (categoryCount > 0) {
      // Generate mock lead data for the selected category
      const mockLeads = generateMockLeadsForCategory(category, categoryCount, member.name)
      setSelectedLeadCategory(category)
      setSelectedLeadCategoryData(mockLeads)
      setShowLeadListModal(true)
    }
  }

  // Handle category card click in view details modal
  const handleCategoryCardClick = (category, member) => {
    // Get leads assigned to this member in this category
    const categoryLeads = leads.filter(lead => 
      lead.assignedTo === member.name && lead.categoryId === category.id
    )
    
    if (categoryLeads.length > 0) {
      setSelectedLeadCategory(category.name)
      setSelectedLeadCategoryData(categoryLeads)
      setShowLeadListModal(true)
    }
  }

  // Generate mock leads for a specific category
  const generateMockLeadsForCategory = (category, count, assignedTo) => {
    const categoryLabels = {
      new: 'New Lead',
      contacted: 'Contacted',
      notPicked: 'Not Picked',
      todayFollowUp: 'Today Follow Up',
      quotationSent: 'Quotation Sent',
      dqSent: 'D&Q Sent',
      appClient: 'App Client',
      web: 'Web',
      converted: 'Converted',
      lost: 'Lost',
      notInterested: 'Not Interested',
      hotLead: 'Hot Lead',
      demoSent: 'Demo Sent',
      app: 'App',
      taxi: 'Taxi'
    }

    return Array.from({ length: count }, (_, index) => ({
      id: Date.now() + index,
      name: `Lead ${index + 1}`,
      phone: `+91 98765${String(43210 + index).padStart(5, '0')}`,
      email: `lead${index + 1}@example.com`,
      company: 'Unknown Company',
      status: category,
      priority: category === 'hotLead' ? 'high' : category === 'lost' || category === 'notInterested' ? 'low' : 'medium',
      source: 'manual',
      value: 25000,
      lastContact: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      nextFollowUp: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedTo: assignedTo,
      notes: `${categoryLabels[category]} - Assigned to ${assignedTo}`,
      category: categoryLabels[category]
    }))
  }

  // Handle single lead addition
  const handleAddLead = () => {
    if (!leadNumber.trim() || !selectedCategory) return
    
    // Simulate API call
    console.log('Adding lead:', leadNumber)
    
    // Get selected category details
    const selectedCategoryData = leadCategories.find(cat => cat.id === parseInt(selectedCategory))
    
    // Create new lead object
    const newLead = {
      id: Date.now(),
      name: `Lead ${leadNumber}`,
      company: 'Unknown Company',
      phone: leadNumber,
      email: `lead${leadNumber}@example.com`,
      status: 'new',
      priority: 'medium',
      source: 'manual',
      value: 25000,
      lastContact: new Date().toISOString().split('T')[0],
      nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedTo: 'Sarah Wilson',
      notes: 'Manually added lead',
      categoryId: parseInt(selectedCategory),
      category: selectedCategoryData.name
    }
    
    // Add to leads array
    setLeads(prev => [newLead, ...prev])
    
    // Update category lead count
    setLeadCategories(prev => prev.map(cat => 
      cat.id === parseInt(selectedCategory)
        ? { ...cat, leadCount: cat.leadCount + 1 }
        : cat
    ))
    
    // Close modal and reset form
    closeModals()
  }

  // Handle bulk lead upload
  const handleBulkUpload = () => {
    if (!uploadedFile || !selectedCategory) return
    
    // Simulate file processing
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          // Simulate processing phone numbers from file
          // In real implementation, you would parse the uploaded file
          const samplePhoneNumbers = [
            '+91 98765 43210',
            '+91 98765 43211', 
            '+91 98765 43212',
            '+91 98765 43213',
            '+91 98765 43214'
          ]
          
          // Get selected category details
          const selectedCategoryData = leadCategories.find(cat => cat.id === parseInt(selectedCategory))
          
          const bulkLeads = samplePhoneNumbers.map((phoneNumber, index) => ({
            id: Date.now() + index,
            name: `Lead ${phoneNumber}`,
            company: 'Unknown Company',
            phone: phoneNumber,
            email: `lead${phoneNumber.replace(/\s+/g, '')}@example.com`,
            status: 'new',
            priority: 'medium',
            source: 'bulk_upload',
            value: 25000,
            lastContact: new Date().toISOString().split('T')[0],
            nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            assignedTo: 'Sarah Wilson',
            notes: 'Bulk uploaded lead from phone number list',
            categoryId: parseInt(selectedCategory),
            category: selectedCategoryData.name
          }))
          
          setLeads(prev => [...bulkLeads, ...prev])
          
          // Update category lead count
          setLeadCategories(prev => prev.map(cat => 
            cat.id === parseInt(selectedCategory)
              ? { ...cat, leadCount: cat.leadCount + bulkLeads.length }
              : cat
          ))
          
          closeModals()
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  // Handle target editing
  const handleEditTarget = (member) => {
    setSelectedItem(member)
    setTargetAmount(member.target.toString())
    setShowTargetModal(true)
  }

  const handleSaveTarget = () => {
    if (!targetAmount || !selectedItem) return
    
    const newTarget = parseFloat(targetAmount)
    if (isNaN(newTarget) || newTarget < 0) return

    setSalesTeam(prev => prev.map(member => 
      member.id === selectedItem.id 
        ? { ...member, target: newTarget }
        : member
    ))
    
    closeModals()
  }

  // Handle lead assignment
  const handleAssignLead = (member) => {
    setSelectedItem(member)
    setLeadsToAssign('')
    setAssignCategoryFilter('all')
    
    // Calculate leads per category
    const unassignedLeads = leads.filter(lead => lead.assignedTo === 'Unassigned')
    const categoryBreakdown = {}
    
    leadCategories.forEach(category => {
      const categoryLeads = unassignedLeads.filter(lead => lead.categoryId === category.id)
      categoryBreakdown[category.id] = {
        name: category.name,
        icon: category.icon,
        color: category.color,
        count: categoryLeads.length
      }
    })
    
    setLeadsPerCategory(categoryBreakdown)
    setShowAssignLeadModal(true)
  }

  // Handle incentive editing
  const handleEditIncentive = (member) => {
    setSelectedItem(member)
    setIncentiveAmount(member.incentive.toString())
    setShowIncentiveModal(true)
  }

  const handleSaveIncentive = () => {
    if (!incentiveAmount || !selectedItem) return
    
    const newIncentive = parseFloat(incentiveAmount)
    if (isNaN(newIncentive) || newIncentive < 0) return

    setSalesTeam(prev => prev.map(member => 
      member.id === selectedItem.id 
        ? { ...member, incentive: newIncentive }
        : member
    ))
    
    closeModals()
  }

  const handleSaveLeadAssignment = () => {
    if (!leadsToAssign || !selectedItem) return
    
    const numberOfLeads = parseInt(leadsToAssign)
    if (isNaN(numberOfLeads) || numberOfLeads <= 0) return

    // Get unassigned leads based on category filter
    let unassignedLeads = leads.filter(lead => lead.assignedTo === 'Unassigned')
    
    // Filter by category if specific category is selected
    if (assignCategoryFilter !== 'all') {
      unassignedLeads = unassignedLeads.filter(lead => lead.categoryId === parseInt(assignCategoryFilter))
    }
    
    // Check if we have enough leads to assign
    if (unassignedLeads.length < numberOfLeads) {
      const categoryName = assignCategoryFilter === 'all' ? 'all categories' : leadCategories.find(cat => cat.id === parseInt(assignCategoryFilter))?.name
      alert(`Only ${unassignedLeads.length} unassigned leads available in ${categoryName}. Please enter a number between 1 and ${unassignedLeads.length}.`)
      return
    }

    // Take the first N unassigned leads
    const leadsToAssign = unassignedLeads.slice(0, numberOfLeads)
    const leadIds = leadsToAssign.map(lead => lead.id)

    // Update leads to assign them to the selected member
    setLeads(prev => prev.map(lead => 
      leadIds.includes(lead.id)
        ? { ...lead, assignedTo: selectedItem.name }
        : lead
    ))

    // Update sales team member's lead count
    setSalesTeam(prev => prev.map(member => 
      member.id === selectedItem.id 
        ? { ...member, leadsCount: member.leadsCount + numberOfLeads }
        : member
    ))

    closeModals()
  }

  // Category management functions
  const handleCreateCategory = () => {
    if (!categoryName.trim()) return
    
    const newCategory = {
      id: Date.now(),
      name: categoryName,
      description: categoryDescription,
      color: categoryColor,
      icon: '📋', // Default icon
      createdAt: new Date().toISOString().split('T')[0],
      leadCount: 0
    }
    
    setLeadCategories(prev => [...prev, newCategory])
    closeModals()
  }

  const handleEditCategory = (category) => {
    setSelectedItem(category)
    setCategoryName(category.name)
    setCategoryDescription(category.description)
    setCategoryColor(category.color)
    setShowCategoryEditModal(true)
  }

  const handleUpdateCategory = () => {
    if (!categoryName.trim() || !selectedItem) return
    
    setLeadCategories(prev => prev.map(category => 
      category.id === selectedItem.id 
        ? { 
            ...category, 
            name: categoryName, 
            description: categoryDescription, 
            color: categoryColor 
          }
        : category
    ))
    closeModals()
  }

  const handleDeleteCategory = (category) => {
    setLeadCategories(prev => prev.filter(cat => cat.id !== category.id))
    // Also remove category from leads that have this category
    setLeads(prev => prev.map(lead => 
      lead.categoryId === category.id 
        ? { ...lead, categoryId: null, category: null }
        : lead
    ))
  }

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
      <div className="ml-64 pt-20 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Sales Management
                </h1>
                <p className="text-gray-600">
                  Monitor sales performance, leads, and sales team activities.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAddLeadModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <FiPlus className="h-4 w-4" />
                  <span>Add Lead</span>
                </button>
                <button
                  onClick={() => setShowBulkLeadModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FiUpload className="h-4 w-4" />
                  <span>Add Bulk Lead</span>
                </button>
              <button
                onClick={loadData}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiRefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              </div>
            </div>
          </div>

          {/* Statistics Cards - Row 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"
          >
            {/* Total Leads */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-blue-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <FiUsers className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-blue-700">+{statistics.leads.new}</p>
                    <p className="text-xs text-blue-600">this month</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-700 mb-1">Total Leads</p>
                  <p className="text-lg font-bold text-blue-800">{statistics.leads.total}</p>
                </div>
              </div>
            </div>

            {/* Total Sales */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-emerald-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <FiCreditCard className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-emerald-700">{statistics.sales.conversion}%</p>
                    <p className="text-xs text-emerald-600">conversion</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-emerald-700 mb-1">Total Sales</p>
                  <p className="text-lg font-bold text-emerald-800">{formatCurrency(statistics.sales.total)}</p>
                </div>
              </div>
            </div>

            {/* Earnings Collected */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-violet-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-purple-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-violet-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <FiTrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-purple-700">{formatCurrency(statistics.earnings.pending)}</p>
                    <p className="text-xs text-purple-600">pending</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-purple-700 mb-1">Earnings Collected</p>
                  <p className="text-lg font-bold text-purple-800">{formatCurrency(statistics.earnings.collected)}</p>
                </div>
              </div>
            </div>

            {/* Sales Team */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-amber-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-orange-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-orange-400/20 to-amber-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <FiUser className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-orange-700">{statistics.team.performance}%</p>
                    <p className="text-xs text-orange-600">performance</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-orange-700 mb-1">Sales Team</p>
                  <p className="text-lg font-bold text-orange-800">{statistics.team.total}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Statistics Cards - Row 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          >
            {/* New Leads */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-green-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <FiPlus className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-green-700">Fresh</p>
                    <p className="text-xs text-green-600">prospects</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-green-700 mb-1">New Leads</p>
                  <p className="text-lg font-bold text-green-800">{statistics.leads.new}</p>
                </div>
              </div>
            </div>

            {/* Connected Leads */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-blue-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-indigo-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-indigo-400/20 to-blue-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <FiPhone className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-indigo-700">In contact</p>
                    <p className="text-xs text-indigo-600">active</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-indigo-700 mb-1">Connected</p>
                  <p className="text-lg font-bold text-indigo-800">{statistics.leads.connected}</p>
                </div>
              </div>
            </div>

            {/* Hot Leads */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-50 to-pink-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-rose-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-rose-400/20 to-pink-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-rose-500/10">
                    <FiStar className="h-4 w-4 text-rose-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-rose-700">High priority</p>
                    <p className="text-xs text-rose-600">urgent</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-rose-700 mb-1">Hot Leads</p>
                  <p className="text-lg font-bold text-rose-800">{statistics.leads.hot}</p>
                </div>
              </div>
            </div>

            {/* Total Clients */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-50 to-cyan-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-teal-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-teal-500/10">
                    <FiHome className="h-4 w-4 text-teal-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-teal-700">{statistics.clients.retention}%</p>
                    <p className="text-xs text-teal-600">retention</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-teal-700 mb-1">Total Clients</p>
                  <p className="text-lg font-bold text-teal-800">{statistics.clients.total}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'leads', label: 'Leads', icon: FiUsers },
                { key: 'sales-team', label: 'Sales Team', icon: FiUser },
                { key: 'clients', label: 'Clients', icon: FiHome },
                { key: 'category-performance', label: 'Category Performance', icon: FiTrendingUp }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Search and Filter */}
            <div className="p-6 border-b border-gray-200">
               <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="w-full lg:w-80 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                     placeholder={activeTab === 'leads' ? 'Search phone numbers...' : `Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                 <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                   {activeTab === 'leads' ? (
                     <>
                       <div className="relative w-full sm:w-48">
                         <select
                           value={selectedFilter}
                           onChange={(e) => setSelectedFilter(e.target.value)}
                           className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white appearance-none cursor-pointer hover:border-gray-400 transition-colors shadow-sm"
                         >
                           <option value="all">📋 All Leads</option>
                           <option value="today">📅 Today</option>
                           <option value="week">📊 This Week</option>
                           <option value="month">📈 This Month</option>
                           <option value="hot">🔥 Hot Leads</option>
                           <option value="connected">🤝 Connected</option>
                           <option value="new">🆕 New Leads</option>
                           <option value="converted">✅ Converted</option>
                           <option value="lost">❌ Lost</option>
                         </select>
                         <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                           <FiFilter className="h-4 w-4 text-gray-400" />
                         </div>
                       </div>
                       <div className="relative w-full sm:w-48">
                         <select
                           value={selectedCategory}
                           onChange={(e) => setSelectedCategory(e.target.value)}
                           className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white appearance-none cursor-pointer hover:border-gray-400 transition-colors shadow-sm"
                         >
                           <option value="">🏷️ All Categories</option>
                           {leadCategories.map(category => (
                             <option key={category.id} value={category.id}>
                               {category.icon} {category.name}
                             </option>
                           ))}
                         </select>
                         <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                           <FiTarget className="h-4 w-4 text-gray-400" />
                         </div>
                       </div>
                     </>
                   ) : (
                     <div className="relative w-full sm:w-48">
                       <select
                         value={selectedFilter}
                         onChange={(e) => setSelectedFilter(e.target.value)}
                         className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white appearance-none cursor-pointer hover:border-gray-400 transition-colors shadow-sm"
                       >
                         <option value="all">All Status</option>
                         {activeTab === 'sales-team' && (
                           <>
                             <option value="active">Active</option>
                             <option value="inactive">Inactive</option>
                           </>
                         )}
                         {activeTab === 'clients' && (
                           <>
                             <option value="active">Active</option>
                             <option value="inactive">Inactive</option>
                           </>
                         )}
                       </select>
                       <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                         <FiFilter className="h-4 w-4 text-gray-400" />
                       </div>
                     </div>
                   )}
                 </div>
               </div>
             </div>

            {/* Content based on active tab */}
            <div className="p-6">
              {activeTab === 'leads' && (
                <div className="space-y-6">
                  {/* Leads Management Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Lead Management</h3>
                        <p className="text-gray-600 text-sm mt-1">Organize and manage your leads with categories</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setShowCategoryModal(true)}
                          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                        >
                          <FiTarget className="h-4 w-4" />
                          <span>Manage Categories</span>
                        </button>
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold">{filteredData.length}</span> leads found
                        </div>
                      </div>
                    </div>
                    
                    {/* Category Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {leadCategories.map((category) => (
                        <div key={category.id} className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                              style={{ backgroundColor: category.color }}
                            >
                              {category.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-gray-900 truncate">{category.name}</div>
                              <div className="text-xs text-gray-500">{category.leadCount} leads</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Leads List */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">All Leads</h3>
                        <div className="text-sm text-gray-500">
                          {filteredData.length} leads found
                          </div>
                        </div>
                      </div>
                      
                    <div className="divide-y divide-gray-200">
                      {paginatedData.map((lead, index) => (
                        <div key={lead.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-primary">{index + 1 + ((currentPage - 1) * itemsPerPage)}</span>
                        </div>
                              <div>
                                <div className="text-lg font-semibold text-gray-900 font-mono">
                                  {lead.phone}
                      </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span>Added: {formatDate(lead.lastContact)}</span>
                        </div>
                        </div>
                      </div>
                      
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(lead.status)}`}>
                                {lead.status}
                              </span>
                              {lead.category && (
                                <span 
                                  className="inline-flex px-2 py-1 text-xs font-bold rounded-full text-white"
                                  style={{ backgroundColor: leadCategories.find(cat => cat.name === lead.category)?.color || '#6B7280' }}
                                >
                                  {leadCategories.find(cat => cat.name === lead.category)?.icon} {lead.category}
                                </span>
                              )}
                          <button 
                            onClick={() => handleDelete(lead, 'lead')}
                                className="text-gray-400 hover:text-red-600 p-2 rounded hover:bg-red-50 transition-all duration-200"
                                title="Delete Lead"
                          >
                                <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sales-team' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {paginatedData.map((member) => (
                    <div key={member.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105 group">
                      {/* Header Section */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                          {member.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 truncate">{member.name}</h3>
                          <p className="text-xs text-gray-600 font-medium">{member.position}</p>
                          <span className={`inline-flex px-1.5 py-0.5 text-xs font-bold rounded-full border mt-1 ${getStatusColor(member.status)}`}>
                            {member.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Performance Highlight */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-green-700">Performance</span>
                          <span className="text-lg font-bold text-green-600">{member.performance}%</span>
                        </div>
                      </div>
                      
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-blue-50 rounded-lg p-2">
                          <div className="text-xs text-blue-600 font-medium mb-1">Leads</div>
                          <div className="text-xs font-bold text-blue-800">{member.leadsCount}</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-2">
                          <div className="text-xs text-purple-600 font-medium mb-1">Converted</div>
                          <div className="text-xs font-bold text-purple-800">{member.convertedCount}</div>
                        </div>
                      </div>
                      
                      {/* Revenue Metrics */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-orange-50 rounded-lg p-2">
                          <div className="text-xs text-orange-600 font-medium mb-1">Revenue</div>
                          <div className="text-xs font-bold text-orange-800">{formatCurrency(member.revenue)}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="text-xs text-gray-600 font-medium mb-1">Target</div>
                          <div className="text-xs font-bold text-gray-800">{formatCurrency(member.target)}</div>
                        </div>
                      </div>

                      {/* Incentive Metric */}
                      <div className="bg-green-50 rounded-lg p-2 mb-3">
                        <div className="text-xs text-green-600 font-medium mb-1">Incentive</div>
                        <div className="text-xs font-bold text-green-800">{formatCurrency(member.incentive)}</div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-center pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => handleView(member, 'sales-team')}
                            className="text-gray-400 hover:text-primary p-1.5 rounded hover:bg-primary/10 transition-all duration-200 group-hover:text-primary"
                            title="View Details"
                          >
                            <FiEye className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleEditTarget(member)}
                            className="text-gray-400 hover:text-orange-600 p-1.5 rounded hover:bg-orange-50 transition-all duration-200 group-hover:text-orange-600"
                            title="Edit Target"
                          >
                            <FiTarget className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleAssignLead(member)}
                            className="text-gray-400 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50 transition-all duration-200 group-hover:text-blue-600"
                            title="Assign Leads"
                          >
                            <FiUsers className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleEditIncentive(member)}
                            className="text-gray-400 hover:text-green-600 p-1.5 rounded hover:bg-green-50 transition-all duration-200 group-hover:text-green-600"
                            title="Set Incentive"
                          >
                            <FiCreditCard className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleDelete(member, 'sales-team')}
                            className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-all duration-200 group-hover:text-red-600"
                            title="Delete Member"
                          >
                            <FiTrash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'clients' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {paginatedData.map((client) => (
                    <div key={client.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105 group">
                      {/* Header Section */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                          {client.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 truncate">{client.name}</h3>
                          <p className="text-xs text-gray-600 font-medium">{client.contactPerson}</p>
                          <span className={`inline-flex px-1.5 py-0.5 text-xs font-bold rounded-full border mt-1 ${getStatusColor(client.status)}`}>
                            {client.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Revenue Highlight */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-green-700">Total Spent</span>
                          <span className="text-sm font-bold text-green-600">{formatCurrency(client.totalSpent)}</span>
                        </div>
                      </div>
                      
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-blue-50 rounded-lg p-2">
                          <div className="text-xs text-blue-600 font-medium mb-1">Projects</div>
                          <div className="text-xs font-bold text-blue-800">{client.projectsCompleted}</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-2">
                          <div className="text-xs text-purple-600 font-medium mb-1">Industry</div>
                          <div className="text-xs font-bold text-purple-800">{client.industry}</div>
                        </div>
                      </div>
                      
                      {/* Location & Contact Info */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-orange-50 rounded-lg p-2">
                          <div className="text-xs text-orange-600 font-medium mb-1">Location</div>
                          <div className="text-xs font-bold text-orange-800">{client.location}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="text-xs text-gray-600 font-medium mb-1">Joined</div>
                          <div className="text-xs font-bold text-gray-800">{formatDate(client.joinDate)}</div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => handleView(client, 'clients')}
                            className="text-gray-400 hover:text-primary p-1.5 rounded hover:bg-primary/10 transition-all duration-200 group-hover:text-primary"
                            title="View Details"
                          >
                            <FiEye className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleEdit(client, 'clients')}
                            className="text-gray-400 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50 transition-all duration-200 group-hover:text-blue-600"
                            title="Edit Client"
                          >
                            <FiEdit3 className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleDelete(client, 'clients')}
                            className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-all duration-200 group-hover:text-red-600"
                            title="Delete Client"
                          >
                            <FiTrash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="text-xs text-gray-400 font-medium">
                          {formatDate(client.lastContact)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'category-performance' && (
                <div className="space-y-6">
                  {/* Overall Performance Header */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Category Performance Breakdown</h3>
                        <p className="text-gray-600 text-sm mt-1">Analyze lead conversion rates and performance by category</p>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">{categoryPerformance.length}</span> categories analyzed
                      </div>
                    </div>
                    
                    {/* Overall Performance Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FiUsers className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Total Leads</div>
                            <div className="text-lg font-bold text-gray-900">{overallPerformance.totalLeads}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FiCheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Converted</div>
                            <div className="text-lg font-bold text-gray-900">{overallPerformance.totalConverted}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FiTrendingUp className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Conversion Rate</div>
                            <div className="text-lg font-bold text-gray-900">{overallPerformance.overallConversionRate}%</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <FiCreditCard className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Avg Deal Value</div>
                            <div className="text-lg font-bold text-gray-900">{formatCurrency(overallPerformance.avgDealValue)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Performance Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {categoryPerformance.map((category) => (
                      <div key={category.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:scale-105">
                        {/* Category Header */}
                        <div className="flex items-center space-x-2 mb-3">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: category.color }}
                          >
                            {category.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 truncate">{category.name}</h4>
                            <p className="text-xs text-gray-600 truncate">{category.description}</p>
                          </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-blue-50 rounded-lg p-2">
                            <div className="text-xs text-blue-600 font-medium mb-1">Total Leads</div>
                            <div className="text-lg font-bold text-blue-800">{category.totalLeads}</div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-2">
                            <div className="text-xs text-green-600 font-medium mb-1">Converted</div>
                            <div className="text-lg font-bold text-green-800">{category.convertedLeads}</div>
                          </div>
                        </div>

                        {/* Conversion Rate */}
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 mb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-purple-600 font-medium">Conversion Rate</div>
                              <div className="text-lg font-bold text-purple-800">{category.conversionRate}%</div>
                            </div>
                            <div className="w-12 h-12 relative">
                              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                  className="text-gray-200"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  fill="none"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                  className="text-purple-600"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeDasharray={`${category.conversionRate}, 100`}
                                  fill="none"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Total Revenue */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <FiCreditCard className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-green-600 font-medium">Total Revenue</div>
                              <div className="text-sm font-bold text-green-800 truncate">{formatCurrency(category.totalRevenue)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} {activeTab}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this {modalType}? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Add Lead Modal */}
        {showAddLeadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Add New Lead</h3>
                  <p className="text-gray-600 text-sm mt-1">Enter the lead number to create a new lead</p>
                </div>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lead Number
                  </label>
                  <input
                    type="text"
                    value={leadNumber}
                    onChange={(e) => setLeadNumber(e.target.value)}
                    placeholder="Enter lead number (e.g., +91 9876543210)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the phone number or contact number of the lead
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    required
                  >
                    <option value="">Select a category</option>
                    {leadCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose a category to organize this lead
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLead}
                  disabled={!leadNumber.trim()}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <FiPlus className="h-4 w-4" />
                  <span>Add Lead</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Bulk Lead Upload Modal */}
        {showBulkLeadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Bulk Lead Upload</h3>
                  <p className="text-gray-600 text-sm mt-1">Upload a file containing phone numbers (one per line)</p>
                </div>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* File Upload Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Upload File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center space-y-3"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <FiUpload className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {uploadedFile ? uploadedFile.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Excel (.xlsx, .xls), CSV (.csv), or Text (.txt) files with phone numbers
                        </p>
                      </div>
                    </label>
                  </div>
                  
                  {uploadedFile && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FiFile className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">{uploadedFile.name}</span>
                        <span className="text-xs text-green-600">
                          ({(uploadedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assign Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    required
                  >
                    <option value="">Select a category</option>
                    {leadCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    Choose a category to assign to all leads in this upload
                  </p>
                </div>

                {/* File Format Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">File Format Requirements</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• File should contain only phone numbers (one per line)</li>
                    <li>• Each line represents one lead number</li>
                    <li>• Phone numbers should include country code (e.g., +91 9876543210)</li>
                    <li>• Supported formats: Excel (.xlsx, .xls), CSV (.csv), or Text (.txt)</li>
                    <li>• Maximum file size: 10MB</li>
                  </ul>
                  <div className="mt-3 p-2 bg-white rounded border border-blue-300">
                    <p className="text-xs text-blue-700 font-medium mb-1">Example format:</p>
                    <div className="text-xs text-blue-600 font-mono">
                      +91 9876543210<br/>
                      +91 9876543211<br/>
                      +91 9876543212
                    </div>
                  </div>
                </div>

                {/* Upload Progress */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Processing file...</span>
                      <span className="text-gray-500">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {uploadProgress === 100 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FiCheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Successfully uploaded and processed leads!
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkUpload}
                  disabled={!uploadedFile || uploadProgress > 0}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <FiUpload className="h-4 w-4" />
                  <span>Upload & Process</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Sales Team View Details Modal */}
        {showViewModal && modalType === 'sales-team' && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-4 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Sales Team Member Details</h3>
                  <p className="text-gray-600 text-xs mt-1">{selectedItem.name}</p>
                </div>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Member Overview */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                      {selectedItem.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900">{selectedItem.name}</h4>
                      <p className="text-gray-600 font-medium text-sm">{selectedItem.position}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded-full ${getStatusColor(selectedItem.status)}`}>
                          {selectedItem.status}
                        </span>
                        <span className="text-xs text-gray-500">Joined: {formatDate(selectedItem.joinDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-white rounded-lg p-2 text-center">
                    <div className="text-xs text-blue-600 font-medium">Performance</div>
                    <div className="text-lg font-bold text-blue-800">{selectedItem.performance}%</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center">
                    <div className="text-xs text-green-600 font-medium">Revenue</div>
                    <div className="text-lg font-bold text-green-700">{formatCurrency(selectedItem.revenue)}</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center">
                    <div className="text-xs text-purple-600 font-medium">Total Leads</div>
                    <div className="text-lg font-bold text-purple-700">{selectedItem.leadsCount}</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center">
                    <div className="text-xs text-orange-600 font-medium">Converted</div>
                    <div className="text-lg font-bold text-orange-700">{selectedItem.convertedCount}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Category-Based Lead Distribution */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FiTarget className="h-5 w-5 mr-2 text-purple-600" />
                      Lead Distribution by Category
                    </h5>
                    <div className="space-y-3">
                      {leadCategories.map((category) => {
                        // Calculate leads for this category assigned to this member
                        const categoryLeads = leads.filter(lead => 
                          lead.assignedTo === selectedItem.name && lead.categoryId === category.id
                        )
                        const categoryCount = categoryLeads.length
                        const conversionRate = categoryCount > 0 ? 
                          Math.round((categoryLeads.filter(lead => lead.status === 'converted').length / categoryCount) * 100) : 0
                        
                        return (
                          <button
                            key={category.id}
                            onClick={() => handleCategoryCardClick(category, selectedItem)}
                            disabled={categoryCount === 0}
                            className={`w-full bg-gray-50 rounded-lg p-3 border border-gray-200 hover:shadow-md transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed ${
                              categoryCount > 0 ? 'hover:scale-105 cursor-pointer hover:border-gray-300' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                                  style={{ backgroundColor: category.color }}
                                >
                                  {category.icon}
                                </div>
                                <div>
                                  <h6 className="font-semibold text-gray-900 text-sm">{category.name}</h6>
                                  <p className="text-xs text-gray-500">{category.description}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold" style={{ color: category.color }}>
                                  {categoryCount}
                                </div>
                                <div className="text-xs text-gray-500">leads</div>
                              </div>
                            </div>
                            
                            {categoryCount > 0 && (
                              <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-white rounded p-1">
                                  <div className="text-xs text-gray-600">Active</div>
                                  <div className="font-semibold text-blue-600 text-sm">
                                    {categoryLeads.filter(lead => lead.status !== 'converted' && lead.status !== 'lost').length}
                                  </div>
                                </div>
                                <div className="bg-white rounded p-1">
                                  <div className="text-xs text-gray-600">Converted</div>
                                  <div className="font-semibold text-green-600 text-sm">
                                    {categoryLeads.filter(lead => lead.status === 'converted').length}
                                  </div>
                                </div>
                                <div className="bg-white rounded p-1">
                                  <div className="text-xs text-gray-600">Rate</div>
                                  <div className="font-semibold text-purple-600 text-sm">{conversionRate}%</div>
                                </div>
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FiTrendingUp className="h-5 w-5 mr-2 text-green-600" />
                      Performance Metrics
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-600 font-medium mb-1">Conversion Rate</div>
                        <div className="text-lg font-bold text-gray-900">
                          {selectedItem.leadsCount > 0 ? Math.round((selectedItem.convertedCount / selectedItem.leadsCount) * 100) : 0}%
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-600 font-medium mb-1">Target Achievement</div>
                        <div className="text-lg font-bold text-gray-900">
                          {selectedItem.target > 0 ? Math.round((selectedItem.revenue / selectedItem.target) * 100) : 0}%
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-600 font-medium mb-1">Avg Lead Value</div>
                        <div className="text-lg font-bold text-gray-900">
                          {selectedItem.leadsCount > 0 ? formatCurrency(selectedItem.revenue / selectedItem.leadsCount) : '$0'}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-600 font-medium mb-1">Incentive</div>
                        <div className="text-lg font-bold text-gray-900">{formatCurrency(selectedItem.incentive)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Lead Status Breakdown */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FiUsers className="h-5 w-5 mr-2 text-blue-600" />
                      Lead Status Breakdown
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {[
                        { key: 'new', label: 'New Leads', color: 'bg-green-50 text-green-700 border-green-200', icon: '🆕' },
                        { key: 'contacted', label: 'Contacted', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: '📞' },
                        { key: 'notPicked', label: 'Not Picked', color: 'bg-red-50 text-red-700 border-red-200', icon: '📵' },
                        { key: 'todayFollowUp', label: 'Today Follow Up', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: '📅' },
                        { key: 'quotationSent', label: 'Quotation Sent', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: '📄' },
                        { key: 'dqSent', label: 'D&Q Sent', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: '📤' },
                        { key: 'appClient', label: 'App Client', color: 'bg-cyan-50 text-cyan-700 border-cyan-200', icon: '📱' },
                        { key: 'web', label: 'Web', color: 'bg-teal-50 text-teal-700 border-teal-200', icon: '🌐' },
                        { key: 'converted', label: 'Converted', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '✅' },
                        { key: 'lost', label: 'Lost', color: 'bg-gray-50 text-gray-700 border-gray-200', icon: '❌' },
                        { key: 'notInterested', label: 'Not Interested', color: 'bg-orange-50 text-orange-700 border-orange-200', icon: '😞' },
                        { key: 'hotLead', label: 'Hot Lead', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: '🔥' },
                        { key: 'demoSent', label: 'Demo Sent', color: 'bg-violet-50 text-violet-700 border-violet-200', icon: '🎯' },
                        { key: 'app', label: 'App', color: 'bg-sky-50 text-sky-700 border-sky-200', icon: '📲' },
                        { key: 'taxi', label: 'Taxi', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: '🚕' }
                      ].map((category) => {
                        const count = selectedItem.leadBreakdown[category.key] || 0
                        return (
                          <button
                            key={category.key}
                            onClick={() => handleLeadCategoryClick(category.key, selectedItem)}
                            disabled={count === 0}
                            className={`${category.color} rounded-lg p-3 border-2 hover:shadow-md transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed ${
                              count > 0 ? 'hover:scale-105 cursor-pointer' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-lg">{category.icon}</span>
                              <span className="text-lg font-bold">{count}</span>
                            </div>
                            <div className="text-xs font-medium truncate">{category.label}</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Member Information */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FiUser className="h-5 w-5 mr-2 text-blue-600" />
                      Contact Information
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                        <FiMail className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-600">Email</div>
                          <div className="font-semibold text-gray-900 text-sm">{selectedItem.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                        <FiPhone className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-600">Phone</div>
                          <div className="font-semibold text-gray-900 text-sm">{selectedItem.phone}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                        <FiCalendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-600">Last Activity</div>
                          <div className="font-semibold text-gray-900 text-sm">{formatDate(selectedItem.lastActivity)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Revenue & Target Information */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FiTarget className="h-5 w-5 mr-2 text-orange-600" />
                      Revenue & Targets
                    </h5>
                    <div className="space-y-3">
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="text-xs text-green-600 font-medium mb-1">Current Revenue</div>
                        <div className="text-lg font-bold text-green-700">{formatCurrency(selectedItem.revenue)}</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                        <div className="text-xs text-orange-600 font-medium mb-1">Target Revenue</div>
                        <div className="text-lg font-bold text-orange-700">{formatCurrency(selectedItem.target)}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600 font-medium">Target Progress</span>
                          <span className="text-xs font-semibold text-gray-900">
                            {selectedItem.target > 0 ? Math.round((selectedItem.revenue / selectedItem.target) * 100) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${selectedItem.target > 0 ? Math.min((selectedItem.revenue / selectedItem.target) * 100, 100) : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setShowViewModal(false)
                      setShowTargetModal(true)
                    }}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center space-x-1 text-sm"
                  >
                    <FiTarget className="h-3 w-3" />
                    <span>Edit Target</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowViewModal(false)
                      setShowAssignLeadModal(true)
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center space-x-1 text-sm"
                  >
                    <FiUsers className="h-3 w-3" />
                    <span>Assign Leads</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowViewModal(false)
                      setShowIncentiveModal(true)
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center space-x-1 text-sm"
                  >
                    <FiCreditCard className="h-3 w-3" />
                    <span>Set Incentive</span>
                  </button>
                </div>
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Client View Details Modal */}
        {showViewModal && modalType === 'clients' && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Client Details</h3>
                  <p className="text-gray-600 text-sm mt-1">Complete information about the client</p>
                </div>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Client Overview */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 mb-6 border border-teal-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                      {selectedItem.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-1">{selectedItem.name}</h4>
                      <p className="text-gray-600 font-medium mb-1">{selectedItem.contactPerson}</p>
                      <p className="text-gray-500">{selectedItem.industry}</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${getStatusColor(selectedItem.status)}`}>
                    {selectedItem.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-sm text-green-600 font-medium mb-1">Total Spent</div>
                    <div className="text-lg font-bold text-green-700">{formatCurrency(selectedItem.totalSpent)}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-sm text-blue-600 font-medium mb-1">Projects</div>
                    <div className="text-lg font-bold text-blue-800">{selectedItem.projectsCompleted}</div>
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiHome className="h-5 w-5 mr-2 text-teal-600" />
                  Client Information
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 font-medium mb-1">Company Name</div>
                    <div className="text-base font-semibold text-gray-900">{selectedItem.name}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 font-medium mb-1">Contact Person</div>
                    <div className="text-base font-semibold text-gray-900">{selectedItem.contactPerson}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 font-medium mb-1">Email</div>
                    <div className="text-base font-semibold text-gray-900">{selectedItem.email}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 font-medium mb-1">Phone</div>
                    <div className="text-base font-semibold text-gray-900">{selectedItem.phone}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 font-medium mb-1">Industry</div>
                    <div className="text-base font-semibold text-gray-900">{selectedItem.industry}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 font-medium mb-1">Location</div>
                    <div className="text-base font-semibold text-gray-900">{selectedItem.location}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 font-medium mb-1">Join Date</div>
                    <div className="text-base font-semibold text-gray-900">{formatDate(selectedItem.joinDate)}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 font-medium mb-1">Last Contact</div>
                    <div className="text-base font-semibold text-gray-900">{formatDate(selectedItem.lastContact)}</div>
                  </div>
                </div>
              </div>

              {/* Business Metrics */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiTrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Business Metrics
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-sm text-green-600 font-medium mb-1">Total Revenue</div>
                    <div className="text-lg font-bold text-green-700">{formatCurrency(selectedItem.totalSpent)}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-sm text-blue-600 font-medium mb-1">Projects Completed</div>
                    <div className="text-lg font-bold text-blue-700">{selectedItem.projectsCompleted}</div>
                  </div>
                </div>
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 font-medium mb-2">Average Project Value</div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(selectedItem.totalSpent / selectedItem.projectsCompleted)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    setShowEditModal(true)
                  }}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center space-x-2"
                >
                  <FiEdit3 className="h-4 w-4" />
                  <span>Edit Client</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Target Edit Modal */}
        {showTargetModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Set Target</h3>
                  <p className="text-gray-600 text-sm mt-1">Set revenue target for {selectedItem.name}</p>
                </div>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Current Target Display */}
              <div className="bg-orange-50 rounded-lg p-4 mb-6 border border-orange-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {selectedItem.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{selectedItem.name}</h4>
                    <p className="text-sm text-gray-600">{selectedItem.position}</p>
                    <div className="text-sm text-orange-700 font-medium">
                      Current Target: {formatCurrency(selectedItem.target)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Target Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="Enter target amount"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg font-semibold"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Enter the revenue target for this sales team member</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTarget}
                  disabled={!targetAmount || parseFloat(targetAmount) < 0}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Set Target
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Assign Lead Modal */}
        {showAssignLeadModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Assign Leads</h3>
                  <p className="text-gray-600 text-sm mt-1">Assign leads to {selectedItem.name}</p>
                </div>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Member Info */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {selectedItem.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{selectedItem.name}</h4>
                    <p className="text-sm text-gray-600">{selectedItem.position}</p>
                    <div className="flex items-center space-x-4 text-sm text-blue-700">
                      <span>Current Leads: {selectedItem.leadsCount}</span>
                      <span>Converted: {selectedItem.convertedCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Available Leads by Category */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Leads by Category</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(leadsPerCategory).map(([categoryId, categoryData]) => (
                    <div 
                      key={categoryId}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        assignCategoryFilter === categoryId 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{categoryData.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{categoryData.name}</div>
                            <div className="text-xs text-gray-500">Available leads</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold" style={{ color: categoryData.color }}>
                            {categoryData.count}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Category</label>
                <select
                  value={assignCategoryFilter}
                  onChange={(e) => setAssignCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(leadsPerCategory).map(([categoryId, categoryData]) => (
                    <option key={categoryId} value={categoryId}>
                      {categoryData.icon} {categoryData.name} ({categoryData.count} leads)
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Select a specific category to assign leads from, or choose "All Categories" for mixed assignment
                </p>
              </div>

              {/* Number of Leads Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Leads to Assign</label>
                <div className="relative">
                  <input
                    type="number"
                    value={leadsToAssign}
                    onChange={(e) => setLeadsToAssign(e.target.value)}
                    placeholder="Enter number of leads to assign"
                    min="1"
                    max={assignCategoryFilter === 'all' 
                      ? leads.filter(lead => lead.assignedTo === 'Unassigned').length
                      : leadsPerCategory[assignCategoryFilter]?.count || 0
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Enter how many leads you want to assign to {selectedItem.name}
                  </p>
                  <p className="text-xs font-medium text-blue-600">
                    Available: {
                      assignCategoryFilter === 'all' 
                        ? leads.filter(lead => lead.assignedTo === 'Unassigned').length
                        : leadsPerCategory[assignCategoryFilter]?.count || 0
                    }
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLeadAssignment}
                  disabled={!leadsToAssign || parseInt(leadsToAssign) <= 0}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <FiUsers className="h-4 w-4" />
                  <span>Assign {leadsToAssign || 0} Lead{leadsToAssign && parseInt(leadsToAssign) > 1 ? 's' : ''}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Lead List Modal */}
        {showLeadListModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeLeadListModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedLeadCategoryData[0]?.category || 'Lead Category'} - {selectedItem.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {selectedLeadCategoryData.length} leads found in this category
                  </p>
                </div>
                <button
                  onClick={closeLeadListModal}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Lead List */}
              <div className="space-y-3">
                {selectedLeadCategoryData.map((lead, index) => (
                  <div key={lead.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{index + 1}</span>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-gray-900 font-mono">
                            {lead.phone}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Name: {lead.name}</span>
                            <span>Company: {lead.company}</span>
                            <span>Added: {formatDate(lead.lastContact)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${getPriorityColor(lead.priority)}`}>
                          {lead.priority}
                        </span>
                        <button 
                          onClick={() => handleDelete(lead, 'lead')}
                          className="text-gray-400 hover:text-red-600 p-2 rounded hover:bg-red-50 transition-all duration-200"
                          title="Delete Lead"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Lead Details */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 font-medium">Email:</span>
                          <span className="ml-2 text-gray-900">{lead.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Value:</span>
                          <span className="ml-2 text-gray-900">{formatCurrency(lead.value)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Next Follow-up:</span>
                          <span className="ml-2 text-gray-900">{formatDate(lead.nextFollowUp)}</span>
                        </div>
                      </div>
                      {lead.notes && (
                        <div className="mt-2">
                          <span className="text-gray-600 font-medium text-sm">Notes:</span>
                          <span className="ml-2 text-gray-900 text-sm">{lead.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={closeLeadListModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Export leads functionality
                    console.log('Export leads:', selectedLeadCategoryData)
                  }}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center space-x-2"
                >
                  <FiFile className="h-4 w-4" />
                  <span>Export Leads</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Incentive Edit Modal */}
        {showIncentiveModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Set Incentive</h3>
                  <p className="text-gray-600 text-sm mt-1">Set incentive amount for {selectedItem.name}</p>
                </div>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Current Incentive Display */}
              <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {selectedItem.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{selectedItem.name}</h4>
                    <p className="text-sm text-gray-600">{selectedItem.position}</p>
                    <div className="text-sm text-green-700 font-medium">
                      Current Incentive: {formatCurrency(selectedItem.incentive)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Incentive Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Incentive Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={incentiveAmount}
                    onChange={(e) => setIncentiveAmount(e.target.value)}
                    placeholder="Enter incentive amount"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Enter the incentive amount for this sales team member</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveIncentive}
                  disabled={!incentiveAmount || parseFloat(incentiveAmount) < 0}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <FiCreditCard className="h-4 w-4" />
                  <span>Set Incentive</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Category Management Modal */}
        {showCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Manage Lead Categories</h3>
                  <p className="text-gray-600 text-sm mt-1">Create and manage categories for organizing leads</p>
                </div>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Add New Category Form */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name</label>
                    <input
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <input
                      type="text"
                      value={categoryDescription}
                      onChange={(e) => setCategoryDescription(e.target.value)}
                      placeholder="Enter description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={categoryColor}
                        onChange={(e) => setCategoryColor(e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={categoryColor}
                        onChange={(e) => setCategoryColor(e.target.value)}
                        placeholder="#3B82F6"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleCreateCategory}
                    disabled={!categoryName.trim()}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <FiPlus className="h-4 w-4" />
                    <span>Add Category</span>
                  </button>
                </div>
              </div>

              {/* Categories List */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900">Existing Categories</h4>
                {leadCategories.map((category) => (
                  <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">{category.name}</h5>
                          <p className="text-sm text-gray-600">{category.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">
                              {category.leadCount} leads
                            </span>
                            <span className="text-xs text-gray-500">
                              Created: {formatDate(category.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 transition-colors"
                          title="Edit Category"
                        >
                          <FiEdit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category)}
                          className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition-colors"
                          title="Delete Category"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Category Edit Modal */}
        {showCategoryEditModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Edit Category</h3>
                  <p className="text-gray-600 text-sm mt-1">Update category information</p>
                </div>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name</label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    placeholder="Enter description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={categoryColor}
                      onChange={(e) => setCategoryColor(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={categoryColor}
                      onChange={(e) => setCategoryColor(e.target.value)}
                      placeholder="#3B82F6"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCategory}
                  disabled={!categoryName.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Category
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Admin_sales_management
