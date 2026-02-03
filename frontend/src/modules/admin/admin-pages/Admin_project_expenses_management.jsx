import React, { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import Admin_navbar from '../admin-components/Admin_navbar'
import Admin_sidebar from '../admin-components/Admin_sidebar'
import Loading from '../../../components/ui/loading'
import { adminFinanceService } from '../admin-services/adminFinanceService'
import { adminProjectExpenseCategoryService } from '../admin-services/adminProjectExpenseCategoryService'
import { adminProjectCredentialService } from '../admin-services/adminProjectCredentialService'
import { useToast } from '../../../contexts/ToastContext'
import { adminStorage } from '../admin-services/baseApiService'
import { 
  FiTrendingUp,
  FiTrendingDown,
  FiFileText,
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit,
  FiEye,
  FiTrash2,
  FiRefreshCw,
  FiBarChart,
  FiPieChart,
  FiX,
  FiCalendar,
  FiTag,
  FiKey,
  FiLock,
  FiGlobe,
  FiServer
} from 'react-icons/fi'
import { IndianRupee } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

const Admin_project_expenses_management = () => {
  const { toast } = useToast()
  
  // Get admin role
  const adminData = adminStorage.get()
  const isAdmin = adminData?.role === 'admin'
  
  // State management
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [error, setError] = useState(null)
  
  // Project Expenses state
  const [projectExpenses, setProjectExpenses] = useState([])
  const [projectExpensesLoading, setProjectExpensesLoading] = useState(false)
  const [projectExpensesTotal, setProjectExpensesTotal] = useState(0)
  const [projectExpensesPages, setProjectExpensesPages] = useState(1)
  
  // Form data
  const [projectExpenseFormData, setProjectExpenseFormData] = useState({
    projectId: '',
    category: '',
    amount: '',
    vendor: '',
    paymentMethod: 'Bank Transfer',
    expenseDate: new Date().toISOString().split('T')[0],
    description: ''
  })
  
  // Modal states
  const [showProjectExpenseModal, setShowProjectExpenseModal] = useState(false)
  const [projectExpenseModalMode, setProjectExpenseModalMode] = useState('create') // 'create' or 'edit' or 'view'
  const [selectedProjectExpense, setSelectedProjectExpense] = useState(null)
  const [showDeleteProjectExpenseModal, setShowDeleteProjectExpenseModal] = useState(false)
  const [projectExpenseToDelete, setProjectExpenseToDelete] = useState(null)
  const [projectsList, setProjectsList] = useState([])
  
  // Category management state
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showCategoryEditModal, setShowCategoryEditModal] = useState(false)
  const [showCategoryDeleteModal, setShowCategoryDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryFormData, setCategoryFormData] = useState({
    name: ''
  })
  const [creatingCategory, setCreatingCategory] = useState(false)
  const [updatingCategory, setUpdatingCategory] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState(false)
  const [activeSection, setActiveSection] = useState('expenses') // 'expenses', 'categories', or 'credentials'
  
  // Credentials management state
  const [credentials, setCredentials] = useState([])
  const [projectsWithExpenses, setProjectsWithExpenses] = useState([])
  const [credentialsLoading, setCredentialsLoading] = useState(false)
  const [showCredentialModal, setShowCredentialModal] = useState(false)
  const [showCredentialEditModal, setShowCredentialEditModal] = useState(false)
  const [showCredentialDeleteModal, setShowCredentialDeleteModal] = useState(false)
  const [showCredentialViewModal, setShowCredentialViewModal] = useState(false)
  const [viewingCredential, setViewingCredential] = useState(null)
  const [selectedCredential, setSelectedCredential] = useState(null)
  const [credentialFormData, setCredentialFormData] = useState({
    projectId: '',
    credentials: ''
  })
  const [creatingCredential, setCreatingCredential] = useState(false)
  const [updatingCredential, setUpdatingCredential] = useState(false)
  const [deletingCredential, setDeletingCredential] = useState(false)
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('all')
  const [projectSearchTerm, setProjectSearchTerm] = useState('')
  const [showProjectDropdown, setShowProjectDropdown] = useState(false)
  const [formProjectSearchTerm, setFormProjectSearchTerm] = useState('')
  const [showExpenseProjectDropdown, setShowExpenseProjectDropdown] = useState(false)
  const [expenseProjectSearchTerm, setExpenseProjectSearchTerm] = useState('')
  const projectDropdownRef = useRef(null)
  const expenseProjectDropdownRef = useRef(null)

  // Statistics state
  const [statistics, setStatistics] = useState({
    totalExpenses: 0,
    totalProjects: 0,
    categoryBreakdown: {},
    monthlyExpenses: 0,
    todayExpenses: 0
  })
  const [statisticsLoading, setStatisticsLoading] = useState(false)

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Fetch project expenses
  const fetchProjectExpenses = async () => {
    try {
      setProjectExpensesLoading(true)
      setError(null)
      
      const params = {
        page: currentPage,
        limit: itemsPerPage
      }
      
      // Add filters
      if (selectedFilter !== 'all') {
        params.category = selectedFilter
      }
      if (searchTerm) {
        params.search = searchTerm
      }
      
      const response = await adminFinanceService.getProjectExpenses(params)
      
      if (response && response.success) {
        const expensesData = response.data || []
        setProjectExpenses(expensesData)
        setProjectExpensesTotal(response.total || expensesData.length || 0)
        setProjectExpensesPages(response.pages || Math.ceil((response.total || expensesData.length) / parseInt(itemsPerPage)) || 1)
      } else {
        console.error('Failed to fetch project expenses - response:', response)
        setProjectExpenses([])
        setProjectExpensesTotal(0)
        setProjectExpensesPages(1)
      }
    } catch (err) {
      console.error('Error fetching project expenses:', err)
      setError(err.message || 'Failed to fetch project expenses')
      toast.error('Failed to load project expenses')
    } finally {
      setProjectExpensesLoading(false)
      setLoading(false)
    }
  }

  // Fetch project expense statistics
  const fetchStatistics = async () => {
    try {
      setStatisticsLoading(true)
      const response = await adminFinanceService.getProjectExpenseStats()
      
      if (response && response.success && response.data) {
        setStatistics({
          totalExpenses: response.data.totalExpenses || 0,
          totalProjects: response.data.totalProjects || 0,
          categoryBreakdown: response.data.categoryBreakdown || {},
          monthlyExpenses: response.data.monthlyExpenses || 0,
          todayExpenses: response.data.todayExpenses || 0
        })
      }
    } catch (err) {
      console.error('Error fetching statistics:', err)
    } finally {
      setStatisticsLoading(false)
    }
  }

  // Fetch projects list for dropdown
  const fetchProjectsList = async () => {
    try {
      // Import adminProjectService dynamically to avoid circular dependencies
      const { adminProjectService } = await import('../admin-services/adminProjectService')
      
      // Fetch all active projects (including those without PM) for expense tracking
      // We'll fetch active projects without the hasPM filter by calling the API directly
      const queryParams = new URLSearchParams()
      queryParams.append('status', 'active')
      queryParams.append('limit', '1000')
      // Note: We don't include hasPM parameter to get ALL active projects
      
      // Use direct API call to avoid PM filter that getActiveProjects applies
      const { apiRequest } = await import('../admin-services/baseApiService')
      const response = await apiRequest(`/admin/projects?${queryParams.toString()}`)
      
      if (response && response.success && response.data) {
        // Sort projects by name for better UX
        const sortedProjects = [...response.data].sort((a, b) => {
          const nameA = (a.name || '').toLowerCase()
          const nameB = (b.name || '').toLowerCase()
          return nameA.localeCompare(nameB)
        })
        
        setProjectsList(sortedProjects.map(project => {
          // Extract client name - prefer companyName, then name
          let clientName = null
          if (project.client) {
            if (typeof project.client === 'object') {
              clientName = project.client.companyName || project.client.name || null
            } else if (typeof project.client === 'string') {
              clientName = project.client
            }
          }
          
          return {
            value: project._id || project.id,
            label: project.name || 'Unnamed Project',
            client: project.client || null,
            clientName: clientName
          }
        }))
      } else {
        // Fallback to getActiveProjects if direct API fails
        const fallbackResponse = await adminProjectService.getActiveProjects({ limit: 1000 })
        if (fallbackResponse.success && fallbackResponse.data) {
          const sortedProjects = [...fallbackResponse.data].sort((a, b) => {
            const nameA = (a.name || '').toLowerCase()
            const nameB = (b.name || '').toLowerCase()
            return nameA.localeCompare(nameB)
          })
          
          setProjectsList(sortedProjects.map(project => {
            let clientName = null
            if (project.client) {
              if (typeof project.client === 'object') {
                clientName = project.client.companyName || project.client.name || null
              } else if (typeof project.client === 'string') {
                clientName = project.client
              }
            }
            
            return {
              value: project._id || project.id,
              label: project.name || 'Unnamed Project',
              client: project.client || null,
              clientName: clientName
            }
          }))
        }
      }
    } catch (err) {
      console.error('Error fetching projects:', err)
      toast.error('Failed to load projects')
    }
  }

  // Helper function to extract project ID from expense object
  const extractProjectId = (expense) => {
    if (!expense) return ''
    
    // Try project._id first
    if (expense.project) {
      if (typeof expense.project === 'object') {
        return expense.project._id?.toString() || expense.project.id?.toString() || ''
      }
      return expense.project.toString()
    }
    
    // Try projectId field
    if (expense.projectId) {
      return typeof expense.projectId === 'object' 
        ? expense.projectId.toString() 
        : expense.projectId.toString()
    }
    
    return ''
  }

  // Handle project selection change to auto-fill client
  const handleProjectChange = async (projectId) => {
    setProjectExpenseFormData(prev => ({...prev, projectId}))
    
    // Find the selected project and auto-fill client name
    const selectedProject = projectsList.find(p => String(p.value) === String(projectId))
    if (selectedProject && selectedProject.clientName) {
      setProjectExpenseFormData(prev => ({
        ...prev,
        projectId,
        vendor: selectedProject.clientName
      }))
    } else if (projectId) {
      // If client info not in list, fetch project details
      try {
        const { adminProjectService } = await import('../admin-services/adminProjectService')
        const response = await adminProjectService.getProjectById(projectId)
        if (response.success && response.data) {
          const project = response.data
          let clientName = null
          if (project.client) {
            if (typeof project.client === 'object') {
              clientName = project.client.companyName || project.client.name || null
            }
          }
          if (clientName) {
            setProjectExpenseFormData(prev => ({
              ...prev,
              projectId,
              vendor: clientName
            }))
          }
        }
      } catch (err) {
        console.error('Error fetching project details:', err)
      }
    }
  }

  // CRUD Handlers
  const handleCreateProjectExpense = () => {
    setProjectExpenseFormData({
      projectId: '',
      category: '',
      amount: '',
      vendor: '',
      paymentMethod: 'Bank Transfer',
      expenseDate: new Date().toISOString().split('T')[0],
      description: ''
    })
    setProjectExpenseModalMode('create')
    setSelectedProjectExpense(null)
    setShowProjectExpenseModal(true)
  }

  const handleEditProjectExpense = (expense) => {
    // Extract project ID using helper function
    const projectId = extractProjectId(expense)
    
    // Format amount - ensure it's a string for input field
    const amountValue = expense.amount != null ? String(expense.amount) : ''
    
    // Format date - handle various date formats
    let expenseDateValue = new Date().toISOString().split('T')[0]
    if (expense.expenseDate) {
      try {
        const date = expense.expenseDate instanceof Date 
          ? expense.expenseDate 
          : new Date(expense.expenseDate)
        if (!isNaN(date.getTime())) {
          expenseDateValue = date.toISOString().split('T')[0]
        }
      } catch (e) {
        console.error('Error parsing expense date:', e)
      }
    }
    
    setProjectExpenseFormData({
      projectId: projectId,
      category: expense.category || '',
      amount: amountValue,
      vendor: expense.vendor || '',
      paymentMethod: expense.paymentMethod || 'Bank Transfer',
      expenseDate: expenseDateValue,
      description: expense.description || ''
    })
    setProjectExpenseModalMode('edit')
    setSelectedProjectExpense(expense)
    setShowProjectExpenseModal(true)
  }

  const handleViewProjectExpense = (expense) => {
    // Extract project ID using helper function
    const projectId = extractProjectId(expense)
    
    // Format amount - ensure it's a string for input field
    const amountValue = expense.amount != null ? String(expense.amount) : ''
    
    // Format date - handle various date formats
    let expenseDateValue = ''
    if (expense.expenseDate) {
      try {
        const date = expense.expenseDate instanceof Date 
          ? expense.expenseDate 
          : new Date(expense.expenseDate)
        if (!isNaN(date.getTime())) {
          expenseDateValue = date.toISOString().split('T')[0]
        }
      } catch (e) {
        console.error('Error parsing expense date:', e)
      }
    }
    
    setProjectExpenseFormData({
      projectId: projectId,
      category: expense.category || '',
      amount: amountValue,
      vendor: expense.vendor || '',
      paymentMethod: expense.paymentMethod || 'Bank Transfer',
      expenseDate: expenseDateValue,
      description: expense.description || ''
    })
    setProjectExpenseModalMode('view')
    setSelectedProjectExpense(expense)
    setShowProjectExpenseModal(true)
  }

  const handleDeleteProjectExpense = (expense) => {
    setProjectExpenseToDelete(expense)
    setShowDeleteProjectExpenseModal(true)
  }

  const confirmDeleteProjectExpense = async () => {
    if (!projectExpenseToDelete) return

    try {
      const expenseId = projectExpenseToDelete._id || projectExpenseToDelete.id
      const response = await adminFinanceService.deleteProjectExpense(expenseId)
      if (response.success) {
        toast.success('Project expense deleted successfully')
        setShowDeleteProjectExpenseModal(false)
        setProjectExpenseToDelete(null)
        await fetchProjectExpenses()
        await fetchStatistics()
      } else {
        toast.error(response.message || 'Failed to delete project expense')
      }
    } catch (err) {
      console.error('Error deleting project expense:', err)
      toast.error(err.message || 'Failed to delete project expense')
    }
  }

  const handleSaveProjectExpense = async () => {
    // Validation
    if (!projectExpenseFormData.projectId || 
        !projectExpenseFormData.category || !projectExpenseFormData.amount || 
        !projectExpenseFormData.expenseDate) {
      toast.error('Please fill in all required fields')
      return
    }

    // Prepare data for API - ensure amount is a number
    const expenseData = {
      ...projectExpenseFormData,
      amount: parseFloat(projectExpenseFormData.amount) || 0
    }

    try {
      let response
      if (projectExpenseModalMode === 'create') {
        response = await adminFinanceService.createProjectExpense(expenseData)
      } else {
        const expenseId = selectedProjectExpense._id || selectedProjectExpense.id
        response = await adminFinanceService.updateProjectExpense(
          expenseId,
          expenseData
        )
      }

      if (response.success) {
        toast.success(`Project expense ${projectExpenseModalMode === 'create' ? 'created' : 'updated'} successfully`)
        setShowProjectExpenseModal(false)
        // Reset form
        setProjectExpenseFormData({
          projectId: '',
          category: '',
          amount: '',
          vendor: '',
          paymentMethod: 'Bank Transfer',
          expenseDate: new Date().toISOString().split('T')[0],
          description: ''
        })
        setSelectedProjectExpense(null)
        await fetchProjectExpenses()
        await fetchStatistics()
      } else {
        toast.error(response.message || `Failed to ${projectExpenseModalMode === 'create' ? 'create' : 'update'} project expense`)
      }
    } catch (err) {
      console.error(`Error ${projectExpenseModalMode === 'create' ? 'creating' : 'updating'} project expense:`, err)
      toast.error(err.message || `Failed to ${projectExpenseModalMode === 'create' ? 'create' : 'update'} project expense`)
    }
  }

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true)
      const response = await adminProjectExpenseCategoryService.getAllCategories({ isActive: 'true' })
      if (response && response.success) {
        setCategories(response.data || [])
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
      toast.error('Failed to load categories')
    } finally {
      setCategoriesLoading(false)
    }
  }

  // Category CRUD handlers
  const handleCreateCategory = () => {
    setCategoryFormData({
      name: ''
    })
    setSelectedCategory(null)
    setShowCategoryModal(true)
  }

  const handleEditCategory = (category) => {
    setCategoryFormData({
      name: category.name || ''
    })
    setSelectedCategory(category)
    setShowCategoryEditModal(true)
  }

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category)
    setShowCategoryDeleteModal(true)
  }

  const confirmDeleteCategory = async () => {
    if (!selectedCategory) return

    try {
      setDeletingCategory(true)
      const response = await adminProjectExpenseCategoryService.deleteCategory(
        selectedCategory._id || selectedCategory.id
      )
      if (response.success) {
        toast.success('Category deleted successfully')
        setShowCategoryDeleteModal(false)
        setSelectedCategory(null)
        await fetchCategories()
      } else {
        toast.error(response.message || 'Failed to delete category')
      }
    } catch (err) {
      console.error('Error deleting category:', err)
      toast.error(err.message || 'Failed to delete category')
    } finally {
      setDeletingCategory(false)
    }
  }

  const handleSaveCategory = async () => {
    if (!categoryFormData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    try {
      setCreatingCategory(true)
      const response = await adminProjectExpenseCategoryService.createCategory({
        name: categoryFormData.name.trim()
      })
      if (response.success) {
        toast.success('Category created successfully')
        setShowCategoryModal(false)
        setCategoryFormData({
          name: ''
        })
        await fetchCategories()
      } else {
        toast.error(response.message || 'Failed to create category')
      }
    } catch (err) {
      console.error('Error creating category:', err)
      toast.error(err.message || 'Failed to create category')
    } finally {
      setCreatingCategory(false)
    }
  }

  const handleUpdateCategory = async () => {
    if (!categoryFormData.name.trim() || !selectedCategory) {
      toast.error('Category name is required')
      return
    }

    try {
      setUpdatingCategory(true)
      const response = await adminProjectExpenseCategoryService.updateCategory(
        selectedCategory._id || selectedCategory.id,
        {
          name: categoryFormData.name.trim()
        }
      )
      if (response.success) {
        toast.success('Category updated successfully')
        setShowCategoryEditModal(false)
        setSelectedCategory(null)
        setCategoryFormData({
          name: ''
        })
        await fetchCategories()
      } else {
        toast.error(response.message || 'Failed to update category')
      }
    } catch (err) {
      console.error('Error updating category:', err)
      toast.error(err.message || 'Failed to update category')
    } finally {
      setUpdatingCategory(false)
    }
  }

  // Filter projects based on search term (for filter bar)
  const filteredProjectsForFilter = useMemo(() => {
    if (!projectSearchTerm.trim()) {
      return projectsWithExpenses
    }
    const searchLower = projectSearchTerm.toLowerCase()
    return projectsWithExpenses.filter(project => 
      project.name?.toLowerCase().includes(searchLower)
    )
  }, [projectsWithExpenses, projectSearchTerm])

  // Filter projects for form dropdown
  const filteredProjectsForForm = useMemo(() => {
    if (!formProjectSearchTerm.trim()) {
      return projectsWithExpenses
    }
    const searchLower = formProjectSearchTerm.toLowerCase()
    return projectsWithExpenses.filter(project => 
      project.name?.toLowerCase().includes(searchLower)
    )
  }, [projectsWithExpenses, formProjectSearchTerm])

  // Filter projects for expense form dropdown
  const filteredProjectsForExpense = useMemo(() => {
    if (!expenseProjectSearchTerm.trim()) {
      return projectsList
    }
    const searchLower = expenseProjectSearchTerm.toLowerCase()
    return projectsList.filter(project => 
      project.label?.toLowerCase().includes(searchLower) ||
      project.clientName?.toLowerCase().includes(searchLower)
    )
  }, [projectsList, expenseProjectSearchTerm])

  // Fetch credentials
  const fetchCredentials = async () => {
    try {
      setCredentialsLoading(true)
      const params = {}
      if (selectedProjectFilter !== 'all') {
        params.projectId = selectedProjectFilter
      }
      const response = await adminProjectCredentialService.getAllCredentials(params)
      if (response && response.success) {
        let filteredData = response.data || []
        // Apply search filter on frontend if search term exists
        if (projectSearchTerm.trim() && selectedProjectFilter === 'all') {
          const searchLower = projectSearchTerm.toLowerCase()
          filteredData = filteredData.filter(cred => 
            cred.project?.name?.toLowerCase().includes(searchLower) ||
            cred.title?.toLowerCase().includes(searchLower) ||
            cred.additionalInfo?.toLowerCase().includes(searchLower)
          )
        }
        setCredentials(filteredData)
      }
    } catch (err) {
      console.error('Error fetching credentials:', err)
      toast.error('Failed to load credentials')
    } finally {
      setCredentialsLoading(false)
    }
  }

  // Fetch projects with expenses
  const fetchProjectsWithExpenses = async () => {
    try {
      const response = await adminProjectCredentialService.getProjectsWithExpenses()
      if (response && response.success) {
        setProjectsWithExpenses(response.data || [])
      }
    } catch (err) {
      console.error('Error fetching projects with expenses:', err)
    }
  }

  // Credential CRUD handlers
  const handleCreateCredential = () => {
    setCredentialFormData({
      projectId: '',
      credentials: ''
    })
    setSelectedCredential(null)
    setShowCredentialModal(true)
  }

  const handleEditCredential = (credential) => {
    // Combine all credential details into one text field
    const credentialsText = [
      credential.username && `Username: ${credential.username}`,
      credential.email && `Email: ${credential.email}`,
      credential.password && `Password: ${credential.password}`,
      credential.url && `URL: ${credential.url}`,
      credential.ipAddress && `IP: ${credential.ipAddress}${credential.port ? `:${credential.port}` : ''}`,
      credential.additionalInfo && `Additional Info: ${credential.additionalInfo}`,
      credential.notes && `Notes: ${credential.notes}`,
      credential.expiryDate && `Expiry: ${formatDate(credential.expiryDate)}`
    ].filter(Boolean).join('\n')

    setCredentialFormData({
      projectId: credential.project?._id || credential.project || '',
      credentials: credentialsText || ''
    })
    setSelectedCredential(credential)
    setShowCredentialEditModal(true)
  }

  const handleViewCredential = (credential) => {
    setViewingCredential(credential)
    setShowCredentialViewModal(true)
  }

  const handleDeleteCredential = (credential) => {
    setSelectedCredential(credential)
    setShowCredentialDeleteModal(true)
  }

  const confirmDeleteCredential = async () => {
    if (!selectedCredential) return

    try {
      setDeletingCredential(true)
      const response = await adminProjectCredentialService.deleteCredential(
        selectedCredential._id || selectedCredential.id
      )
      if (response.success) {
        toast.success('Credential deleted successfully')
        setShowCredentialDeleteModal(false)
        setSelectedCredential(null)
        await fetchCredentials()
      } else {
        toast.error(response.message || 'Failed to delete credential')
      }
    } catch (err) {
      console.error('Error deleting credential:', err)
      toast.error(err.message || 'Failed to delete credential')
    } finally {
      setDeletingCredential(false)
    }
  }

  const handleSaveCredential = async () => {
    if (!credentialFormData.projectId || !credentialFormData.credentials) {
      toast.error('Project and credentials are required')
      return
    }

    try {
      setCreatingCredential(true)
      // Store credentials in the additionalInfo field as a simple text
      const response = await adminProjectCredentialService.createCredential({
        projectId: credentialFormData.projectId,
        credentialType: 'other', // Default type since we're simplifying
        title: 'Credential', // Auto-generated title
        password: 'N/A', // Required field, but we'll store actual credentials in additionalInfo
        additionalInfo: credentialFormData.credentials.trim(),
        isActive: true
      })
      if (response.success) {
        toast.success('Credential created successfully')
        setShowCredentialModal(false)
        setCredentialFormData({
          projectId: '',
          credentials: ''
        })
        await fetchCredentials()
        await fetchProjectsWithExpenses()
      } else {
        toast.error(response.message || 'Failed to create credential')
      }
    } catch (err) {
      console.error('Error creating credential:', err)
      toast.error(err.message || 'Failed to create credential')
    } finally {
      setCreatingCredential(false)
    }
  }

  const handleToggleCredentialStatus = async (credential) => {
    try {
      const response = await adminProjectCredentialService.updateCredential(
        credential._id || credential.id,
        {
          isActive: !credential.isActive
        }
      )
      if (response.success) {
        toast.success(`Credential ${!credential.isActive ? 'activated' : 'deactivated'} successfully`)
        await fetchCredentials()
      } else {
        toast.error(response.message || 'Failed to update credential status')
      }
    } catch (err) {
      console.error('Error toggling credential status:', err)
      toast.error(err.message || 'Failed to update credential status')
    }
  }

  const handleUpdateCredential = async () => {
    if (!credentialFormData.credentials || !selectedCredential) {
      toast.error('Credentials are required')
      return
    }

    try {
      setUpdatingCredential(true)
      const response = await adminProjectCredentialService.updateCredential(
        selectedCredential._id || selectedCredential.id,
        {
          additionalInfo: credentialFormData.credentials.trim()
        }
      )
      if (response.success) {
        toast.success('Credential updated successfully')
        setShowCredentialEditModal(false)
        setSelectedCredential(null)
        setCredentialFormData({
          projectId: '',
          credentials: ''
        })
        await fetchCredentials()
        await fetchProjectsWithExpenses()
      } else {
        toast.error(response.message || 'Failed to update credential')
      }
    } catch (err) {
      console.error('Error updating credential:', err)
      toast.error(err.message || 'Failed to update credential')
    } finally {
      setUpdatingCredential(false)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target)) {
        setShowProjectDropdown(false)
      }
      if (expenseProjectDropdownRef.current && !expenseProjectDropdownRef.current.contains(event.target)) {
        setShowExpenseProjectDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchProjectExpenses()
    fetchStatistics()
    fetchProjectsList()
    fetchCategories()
    if (activeSection === 'credentials') {
      fetchCredentials()
      fetchProjectsWithExpenses()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedFilter, searchTerm, activeSection, selectedProjectFilter, projectSearchTerm])

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedFilter])

  // Pagination
  const totalPages = projectExpensesPages

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
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Project Expenses Management
              </h1>
              <p className="text-gray-600 text-lg">
                Manage and track all project-related expenses in detail
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  fetchProjectExpenses()
                  fetchStatistics()
                  fetchCategories()
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <FiRefreshCw className="text-sm" />
                <span>Refresh</span>
              </button>
              {activeSection === 'expenses' && (
                <button
                  onClick={handleCreateProjectExpense}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <FiPlus className="text-sm" />
                  <span>Add Project Expense</span>
                </button>
              )}
            </div>
          </motion.div>

          {/* Section Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveSection('expenses')}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === 'expenses'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiFileText className="h-4 w-4" />
                <span>Expenses</span>
              </button>
              {isAdmin && (
                <button
                  onClick={() => setActiveSection('categories')}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeSection === 'categories'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FiTag className="h-4 w-4" />
                  <span>Categories</span>
                </button>
              )}
              <button
                onClick={() => setActiveSection('credentials')}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === 'credentials'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiKey className="h-4 w-4" />
                <span>Project Credentials</span>
              </button>
            </nav>
          </div>

          {/* Content based on active section */}
          {activeSection === 'expenses' && (
            <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-red-800">
                      {statisticsLoading ? '...' : formatCurrency(statistics.totalExpenses)}
                    </p>
                    <IndianRupee className="h-8 w-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Total Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-blue-800">
                      {statisticsLoading ? '...' : statistics.totalProjects}
                    </p>
                    <FiFileText className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Monthly Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-green-800">
                      {statisticsLoading ? '...' : formatCurrency(statistics.monthlyExpenses)}
                    </p>
                    <FiCalendar className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700">Today's Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-purple-800">
                      {statisticsLoading ? '...' : formatCurrency(statistics.todayExpenses)}
                    </p>
                    <FiTrendingDown className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by project, client, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id || cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content Grid */}
          {projectExpensesLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loading size="medium" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchProjectExpenses}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : projectExpenses.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">No project expenses found</p>
              <button
                onClick={handleCreateProjectExpense}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add First Project Expense
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 min-w-[150px]">Project</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 min-w-[120px]">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 min-w-[120px]">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 min-w-[120px]">Client</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 min-w-[130px]">Payment Method</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 min-w-[120px]">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 min-w-[200px]">Description</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 min-w-[150px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectExpenses.map((item, index) => (
                      <motion.tr
                        key={item._id || item.id || `item-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.project?.name || item.projectName || 'N/A'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                            {item.category || 'N/A'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm font-semibold text-red-600">
                            -{formatCurrency(item.amount)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600">
                            {item.vendor || 'N/A'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600">
                            {item.paymentMethod || 'N/A'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600">
                            {formatDate(item.expenseDate || item.date || item.createdAt)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600 max-w-[200px] truncate" title={item.description || ''}>
                            {item.description || 'N/A'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewProjectExpense(item)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <FiEye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditProjectExpense(item)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProjectExpense(item)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-sm text-gray-700">
                  <span>
                    Showing <span className="font-semibold">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                    <span className="font-semibold">{Math.min(currentPage * itemsPerPage, projectExpensesTotal)}</span> of{' '}
                    <span className="font-semibold">{projectExpensesTotal}</span> expenses
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Project Expense Modal */}
          {showProjectExpenseModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {projectExpenseModalMode === 'create' ? 'Add New Project Expense' : 
                     projectExpenseModalMode === 'edit' ? 'Edit Project Expense' : 
                     'View Project Expense'}
                  </h3>
                  <button
                    onClick={() => setShowProjectExpenseModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={(e) => { 
                  e.preventDefault(); 
                  if (projectExpenseModalMode !== 'view') {
                    handleSaveProjectExpense(); 
                  }
                }} className="space-y-4">
                  <div className="relative" ref={expenseProjectDropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => !(projectExpenseModalMode === 'view') && setShowExpenseProjectDropdown(!showExpenseProjectDropdown)}
                        disabled={projectExpenseModalMode === 'view'}
                        className="w-full px-4 py-3 text-left border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white flex items-center justify-between hover:border-gray-400 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                      >
                        <span className={projectExpenseFormData.projectId ? 'text-gray-900' : 'text-gray-500'}>
                          {projectExpenseFormData.projectId 
                            ? projectsList.find(p => String(p.value) === String(projectExpenseFormData.projectId))?.label || 'Select Project'
                            : 'Select Project'}
                        </span>
                        <FiFilter className={`h-4 w-4 text-gray-400 transition-transform ${showExpenseProjectDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      {showExpenseProjectDropdown && projectExpenseModalMode !== 'view' && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-64 overflow-hidden">
                          <div className="p-2 border-b border-gray-200 bg-gray-50">
                            <div className="relative">
                              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <input
                                type="text"
                                placeholder="Search projects..."
                                value={expenseProjectSearchTerm}
                                onChange={(e) => setExpenseProjectSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                              />
                            </div>
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {filteredProjectsForExpense.length > 0 ? (
                              filteredProjectsForExpense.map(project => (
                                <button
                                  key={project.value}
                                  type="button"
                                  onClick={() => {
                                    handleProjectChange(String(project.value))
                                    setShowExpenseProjectDropdown(false)
                                    setExpenseProjectSearchTerm('')
                                  }}
                                  className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                                    String(projectExpenseFormData.projectId) === String(project.value) ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-900'
                                  }`}
                                >
                                  <div className="font-medium">{project.label}</div>
                                  {project.clientName && (
                                    <div className="text-xs text-gray-500 mt-0.5">{project.clientName}</div>
                                  )}
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-gray-500 text-center">No projects found</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={projectExpenseFormData.category}
                      onChange={(e) => setProjectExpenseFormData({...projectExpenseFormData, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={projectExpenseModalMode === 'view'}
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat._id || cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={projectExpenseFormData.amount}
                        onChange={(e) => setProjectExpenseFormData({...projectExpenseFormData, amount: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter amount"
                        required
                        disabled={projectExpenseModalMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expense Date *</label>
                      <input
                        type="date"
                        value={projectExpenseFormData.expenseDate}
                        onChange={(e) => setProjectExpenseFormData({...projectExpenseFormData, expenseDate: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={projectExpenseModalMode === 'view'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                      <input
                        type="text"
                        value={projectExpenseFormData.vendor}
                        onChange={(e) => setProjectExpenseFormData({...projectExpenseFormData, vendor: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Client name"
                        disabled={projectExpenseModalMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                      <select
                        value={projectExpenseFormData.paymentMethod}
                        onChange={(e) => setProjectExpenseFormData({...projectExpenseFormData, paymentMethod: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={projectExpenseModalMode === 'view'}
                      >
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="UPI">UPI</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="Cash">Cash</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={projectExpenseFormData.description}
                      onChange={(e) => setProjectExpenseFormData({...projectExpenseFormData, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter additional notes or description"
                      disabled={projectExpenseModalMode === 'view'}
                    />
                  </div>

                  {projectExpenseModalMode !== 'view' && (
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setShowProjectExpenseModal(false)}
                        className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <FiPlus className="h-4 w-4" />
                        <span>{projectExpenseModalMode === 'create' ? 'Add Project Expense' : 'Update Project Expense'}</span>
                      </button>
                    </div>
                  )}
                  {projectExpenseModalMode === 'view' && (
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setShowProjectExpenseModal(false)}
                        className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditProjectExpense(selectedProjectExpense)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <FiEdit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* Delete Project Expense Confirmation Modal */}
          {showDeleteProjectExpenseModal && projectExpenseToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Delete Project Expense</h3>
                  <button
                    onClick={() => {
                      setShowDeleteProjectExpenseModal(false)
                      setProjectExpenseToDelete(null)
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the expense <strong>"{projectExpenseToDelete.name}"</strong>? This action cannot be undone.
                </p>
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteProjectExpenseModal(false)
                      setProjectExpenseToDelete(null)
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteProjectExpense}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
            </>
          )}

          {/* Category Management Section */}
          {activeSection === 'categories' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Expense Categories</h3>
                  <p className="text-gray-600 text-sm mt-1">Manage project expense categories</p>
                </div>
                <button
                  onClick={handleCreateCategory}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <FiPlus className="h-4 w-4" />
                  <span>Add Category</span>
                </button>
              </div>

              {/* Categories List */}
              {categoriesLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loading size="medium" />
                </div>
              ) : categories.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-gray-600">No categories found</p>
                  <button
                    onClick={handleCreateCategory}
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add First Category
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Expenses</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((category, index) => (
                          <motion.tr
                            key={category._id || category.id || `cat-${index}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, delay: index * 0.02 }}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="font-semibold text-gray-900 text-sm">
                                {category.name || 'N/A'}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                category.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {category.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm text-gray-600">
                                {category.expenseCount || 0}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleEditCategory(category)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <FiEdit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(category)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                  disabled={category.expenseCount > 0}
                                >
                                  <FiTrash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Create Category Modal */}
          {showCategoryModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Add Category</h3>
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleSaveCategory()
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                    <input
                      type="text"
                      value={categoryFormData.name}
                      onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Domain, Server, Hosting"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowCategoryModal(false)}
                      className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingCategory}
                      className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      <FiPlus className="h-4 w-4" />
                      <span>{creatingCategory ? 'Creating...' : 'Create Category'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Category Modal */}
          {showCategoryEditModal && selectedCategory && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Edit Category</h3>
                  <button
                    onClick={() => {
                      setShowCategoryEditModal(false)
                      setSelectedCategory(null)
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleUpdateCategory()
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                    <input
                      type="text"
                      value={categoryFormData.name}
                      onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Domain, Server, Hosting"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCategoryEditModal(false)
                        setSelectedCategory(null)
                      }}
                      className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updatingCategory}
                      className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      <FiEdit className="h-4 w-4" />
                      <span>{updatingCategory ? 'Updating...' : 'Update Category'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Category Confirmation Modal */}
          {showCategoryDeleteModal && selectedCategory && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Delete Category</h3>
                  <button
                    onClick={() => {
                      setShowCategoryDeleteModal(false)
                      setSelectedCategory(null)
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the category <strong>"{selectedCategory.name}"</strong>? 
                  {selectedCategory.expenseCount > 0 && (
                    <span className="block mt-2 text-red-600">
                      This category is being used in {selectedCategory.expenseCount} expense(s). You must update or remove those expenses first.
                    </span>
                  )}
                  {selectedCategory.expenseCount === 0 && (
                    <span className="block mt-2">This action cannot be undone.</span>
                  )}
                </p>
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowCategoryDeleteModal(false)
                      setSelectedCategory(null)
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteCategory}
                    disabled={selectedCategory.expenseCount > 0 || deletingCategory}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingCategory ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Project Credentials Section */}
          {activeSection === 'credentials' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Project Credentials</h3>
                  <p className="text-gray-600 text-sm mt-1">Manage credentials for projects with purchases</p>
                </div>
                {isAdmin && (
                  <button
                    onClick={handleCreateCredential}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiPlus className="h-4 w-4" />
                    <span>Add Credential</span>
                  </button>
                )}
              </div>

              {/* Filters - Compact Search Bar */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={projectSearchTerm}
                    onChange={(e) => {
                      setProjectSearchTerm(e.target.value)
                      if (e.target.value.trim() === '') {
                        setSelectedProjectFilter('all')
                      }
                    }}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {projectSearchTerm && (
                  <button
                    onClick={() => {
                      setProjectSearchTerm('')
                      setSelectedProjectFilter('all')
                    }}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Credentials List */}
              {credentialsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loading size="medium" />
                </div>
              ) : credentials.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <FiKey className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No credentials found</p>
                  {isAdmin && (
                    <button
                      onClick={handleCreateCredential}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add First Credential
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Project</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Credentials</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {credentials.map((credential, index) => (
                          <motion.tr
                            key={credential._id || credential.id || `cred-${index}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, delay: index * 0.02 }}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="font-semibold text-gray-900 text-sm">
                                {credential.project?.name || 'N/A'}
                              </div>
                              {credential.project?.client && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {credential.project.client?.companyName || credential.project.client?.name || ''}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm text-gray-600 max-w-[300px]">
                                {credential.additionalInfo ? (
                                  <div className="truncate" title={credential.additionalInfo}>
                                    {credential.additionalInfo.substring(0, 80)}
                                    {credential.additionalInfo.length > 80 ? '...' : ''}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">No details</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {isAdmin ? (
                                <button
                                  onClick={() => handleToggleCredentialStatus(credential)}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                    credential.isActive ? 'bg-green-600' : 'bg-gray-300'
                                  }`}
                                  title={`Click to ${credential.isActive ? 'deactivate' : 'activate'}`}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      credential.isActive ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                              ) : (
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                  credential.isActive 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {credential.isActive ? 'Active' : 'Inactive'}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleViewCredential(credential)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <FiEye className="h-4 w-4" />
                                </button>
                                {isAdmin && (
                                  <>
                                    <button
                                      onClick={() => handleEditCredential(credential)}
                                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                      title="Edit"
                                    >
                                      <FiEdit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCredential(credential)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Delete"
                                    >
                                      <FiTrash2 className="h-4 w-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Create Credential Modal */}
          {showCredentialModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Add Credential</h3>
                  <button
                    onClick={() => setShowCredentialModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleSaveCredential()
                }} className="space-y-4">
                  <div className="relative" ref={projectDropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                        className="w-full px-4 py-3 text-left border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white flex items-center justify-between hover:border-gray-400 transition-colors"
                      >
                        <span className={credentialFormData.projectId ? 'text-gray-900' : 'text-gray-500'}>
                          {credentialFormData.projectId 
                            ? projectsWithExpenses.find(p => (p._id || p.id) === credentialFormData.projectId)?.name || 'Select Project'
                            : 'Select Project'}
                        </span>
                        <FiFilter className={`h-4 w-4 text-gray-400 transition-transform ${showProjectDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      {showProjectDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-64 overflow-hidden">
                          <div className="p-2 border-b border-gray-200 bg-gray-50">
                            <div className="relative">
                              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <input
                                type="text"
                                placeholder="Search projects..."
                                value={formProjectSearchTerm}
                                onChange={(e) => setFormProjectSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                              />
                            </div>
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {filteredProjectsForForm.length > 0 ? (
                              filteredProjectsForForm.map(project => (
                                <button
                                  key={project._id || project.id}
                                  type="button"
                                  onClick={() => {
                                    setCredentialFormData({...credentialFormData, projectId: project._id || project.id})
                                    setShowProjectDropdown(false)
                                    setFormProjectSearchTerm('')
                                  }}
                                  className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                                    credentialFormData.projectId === (project._id || project.id) ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-900'
                                  }`}
                                >
                                  <div className="font-medium">{project.name}</div>
                                  {project.credentialCount > 0 && (
                                    <div className="text-xs text-gray-500 mt-0.5">{project.credentialCount} credential{project.credentialCount !== 1 ? 's' : ''}</div>
                                  )}
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-gray-500 text-center">No projects found</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credentials *</label>
                    <textarea
                      value={credentialFormData.credentials}
                      onChange={(e) => setCredentialFormData({...credentialFormData, credentials: e.target.value})}
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter all credential details here, e.g:&#10;Email: admin@example.com&#10;Password: yourpassword123&#10;Domain: example.com&#10;URL: https://example.com&#10;IP: 192.168.1.1:80&#10;Additional notes..."
                      required
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Enter all credential information in this box (email, password, domain name, URL, IP address, etc.)
                    </p>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowCredentialModal(false)}
                      className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingCredential}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      <FiPlus className="h-4 w-4" />
                      <span>{creatingCredential ? 'Creating...' : 'Create Credential'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Credential Modal */}
          {showCredentialEditModal && selectedCredential && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Edit Credential</h3>
                  <button
                    onClick={() => {
                      setShowCredentialEditModal(false)
                      setSelectedCredential(null)
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleUpdateCredential()
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                    <input
                      type="text"
                      value={selectedCredential.project?.name || 'N/A'}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credentials *</label>
                    <textarea
                      value={credentialFormData.credentials}
                      onChange={(e) => setCredentialFormData({...credentialFormData, credentials: e.target.value})}
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter all credential details here, e.g:&#10;Email: admin@example.com&#10;Password: yourpassword123&#10;Domain: example.com&#10;URL: https://example.com&#10;IP: 192.168.1.1:80&#10;Additional notes..."
                      required
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Enter all credential information in this box (email, password, domain name, URL, IP address, etc.)
                    </p>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCredentialEditModal(false)
                        setSelectedCredential(null)
                      }}
                      className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updatingCredential}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      <FiEdit className="h-4 w-4" />
                      <span>{updatingCredential ? 'Updating...' : 'Update Credential'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* View Credential Modal */}
          {showCredentialViewModal && viewingCredential && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Credential Details</h3>
                  <button
                    onClick={() => {
                      setShowCredentialViewModal(false)
                      setViewingCredential(null)
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Project & Client Information */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Project</label>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          {viewingCredential.project?.name || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Client</label>
                        <p className="text-base font-semibold text-gray-800 mt-1">
                          {viewingCredential.project?.client?.companyName || 
                           viewingCredential.project?.client?.name || 
                           (typeof viewingCredential.project?.client === 'string' ? viewingCredential.project.client : 'N/A')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Credentials Details */}
                  {viewingCredential.additionalInfo && (
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                        <FiLock className="h-4 w-4 text-blue-600" />
                        <span>Credential Details</span>
                      </h4>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                          {viewingCredential.additionalInfo}
                        </pre>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(viewingCredential.additionalInfo)
                          toast.success('Credentials copied to clipboard')
                        }}
                        className="mt-3 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <FiFileText className="h-4 w-4" />
                        <span>Copy All</span>
                      </button>
                    </div>
                  )}

                  {/* Status & Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-medium text-gray-500 uppercase">Status:</span>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        viewingCredential.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {viewingCredential.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setShowCredentialViewModal(false)
                          handleEditCredential(viewingCredential)
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <FiEdit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Credential Confirmation Modal */}
          {showCredentialDeleteModal && selectedCredential && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Delete Credential</h3>
                  <button
                    onClick={() => {
                      setShowCredentialDeleteModal(false)
                      setSelectedCredential(null)
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the credential <strong>"{selectedCredential.title}"</strong>? 
                  <span className="block mt-2">This action cannot be undone.</span>
                </p>
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowCredentialDeleteModal(false)
                      setSelectedCredential(null)
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteCredential}
                    disabled={deletingCredential}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingCredential ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin_project_expenses_management
