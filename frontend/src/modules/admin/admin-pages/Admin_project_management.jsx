import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Admin_navbar from '../admin-components/Admin_navbar'
import Admin_sidebar from '../admin-components/Admin_sidebar'
import { adminProjectService } from '../admin-services/adminProjectService'
import { 
  FiUsers, 
  FiFolder, 
  FiCheckSquare, 
  FiTarget,
  FiTrendingUp,
  FiBarChart,
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiMoreVertical,
  FiCalendar,
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiPauseCircle,
  FiUser,
  FiHome,
  FiSettings,
  FiRefreshCw,
  FiDownload,
  FiUpload,
  FiArrowUp,
  FiArrowDown,
  FiActivity,
  FiX
} from 'react-icons/fi'
import { Combobox } from '../../../components/ui/combobox'
import Loading from '../../../components/ui/loading'

const Admin_project_management = () => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending-projects')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [modalType, setModalType] = useState('') // 'project', 'employee', 'client', 'pm'
  const [showPMAssignmentModal, setShowPMAssignmentModal] = useState(false)
  const [selectedPendingProject, setSelectedPendingProject] = useState(null)
  const [showPendingDetailsModal, setShowPendingDetailsModal] = useState(false)
  const [selectedPM, setSelectedPM] = useState('')

  // PM Options for Combobox
  const getPMOptions = () => {
    return pmOptions.length > 0 ? pmOptions : projectManagers
      .filter(pm => pm.status === 'active')
      .map(pm => ({
        value: pm.id.toString(),
        label: `${pm.name} - ${pm.projects} projects - ${pm.performance}% performance`,
        icon: FiUser,
        data: pm
      }))
  }

  // Mock data for statistics
  const [statistics, setStatistics] = useState({
    projects: {
      total: 45,
      active: 18,
      completed: 22,
      onHold: 3,
      overdue: 2,
      thisMonth: 8,
      pending: 3
    },
    milestones: {
      total: 156,
      completed: 89,
      inProgress: 45,
      pending: 22,
      overdue: 5
    },
    tasks: {
      total: 892,
      completed: 567,
      inProgress: 198,
      pending: 127,
      overdue: 23
    },
    employees: {
      total: 24,
      active: 22,
      onLeave: 2,
      newThisMonth: 3
    },
    clients: {
      total: 67,
      active: 45,
      inactive: 22,
      newThisMonth: 8
    },
    projectManagers: {
      total: 8,
      active: 7,
      onLeave: 1,
      avgProjects: 5.6
    }
  })

  // Mock data for lists
  const [projects, setProjects] = useState([])
  const [pendingProjects, setPendingProjects] = useState([])
  const [completedProjects, setCompletedProjects] = useState([])
  const [employees, setEmployees] = useState([])
  const [clients, setClients] = useState([])
  const [projectManagers, setProjectManagers] = useState([])
  const [pmOptions, setPMOptions] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadTabData()
  }, [activeTab, selectedFilter, searchTerm, currentPage])

  const loadMockData = async () => {
    setLoading(true)
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock projects data
      const mockProjects = [
        {
          id: 1,
          name: "E-commerce Platform",
          client: "TechCorp Inc.",
          status: "active",
          progress: 75,
          priority: "high",
          dueDate: "2024-02-15",
          teamSize: 5,
          budget: 50000,
          pm: "Sarah Johnson",
          startDate: "2024-01-01"
        },
        {
          id: 2,
          name: "Mobile App Development",
          client: "StartupXYZ",
          status: "in-progress",
          progress: 45,
          priority: "urgent",
          dueDate: "2024-01-30",
          teamSize: 4,
          budget: 35000,
          pm: "Mike Wilson",
          startDate: "2024-01-10"
        },
        {
          id: 3,
          name: "Website Redesign",
          client: "Global Corp",
          status: "completed",
          progress: 100,
          priority: "normal",
          dueDate: "2024-01-20",
          teamSize: 3,
          budget: 25000,
          pm: "Lisa Davis",
          startDate: "2023-12-01"
        },
        {
          id: 4,
          name: "Database Migration",
          client: "Enterprise Ltd",
          status: "on-hold",
          progress: 30,
          priority: "low",
          dueDate: "2024-03-01",
          teamSize: 2,
          budget: 40000,
          pm: "David Brown",
          startDate: "2024-01-15"
        },
        {
          id: 5,
          name: "API Integration",
          client: "TechStart",
          status: "overdue",
          progress: 60,
          priority: "high",
          dueDate: "2024-01-25",
          teamSize: 3,
          budget: 20000,
          pm: "Emma Taylor",
          startDate: "2023-12-15"
        }
      ]

      // Mock pending projects data (from sales team)
      const mockPendingProjects = [
        {
          id: 'pending-1',
          name: "Restaurant Management System",
          client: "Delicious Bites Restaurant",
          clientContact: "Rajesh Kumar",
          clientPhone: "+91 98765 43210",
          clientEmail: "rajesh@deliciousbites.in",
          package: "Restaurant App + Web Portal",
          budget: 45000,
          priority: "high",
          submittedBy: "Sales Team - Priya Sharma",
          submittedDate: "2024-01-20",
          requirements: "Online ordering, table booking, inventory management",
          status: "pending-assignment"
        },
        {
          id: 'pending-2',
          name: "E-learning Platform",
          client: "EduTech Solutions",
          clientContact: "Dr. Anjali Singh",
          clientPhone: "+91 87654 32109",
          clientEmail: "anjali@edutech.in",
          package: "E-learning Platform",
          budget: 75000,
          priority: "urgent",
          submittedBy: "Sales Team - Amit Patel",
          submittedDate: "2024-01-19",
          requirements: "Course management, student portal, payment integration",
          status: "pending-assignment"
        },
        {
          id: 'pending-3',
          name: "Healthcare Management App",
          client: "HealthCare Plus",
          clientContact: "Dr. Vikram Mehta",
          clientPhone: "+91 76543 21098",
          clientEmail: "vikram@healthcareplus.in",
          package: "Healthcare Management System",
          budget: 60000,
          priority: "normal",
          submittedBy: "Sales Team - Sneha Gupta",
          submittedDate: "2024-01-18",
          requirements: "Patient management, appointment booking, prescription tracking",
          status: "pending-assignment"
        }
      ]

      // Mock completed projects data
      const mockCompletedProjects = [
        {
          id: 101,
          name: "E-commerce Website",
          client: "Fashion Store Ltd",
          status: "completed",
          progress: 100,
          priority: "high",
          dueDate: "2024-01-15",
          teamSize: 4,
          budget: 45000,
          pm: "Sarah Johnson",
          startDate: "2023-11-01",
          completedDate: "2024-01-10",
          clientContact: "Priya Sharma",
          clientPhone: "+91 98765 43210",
          clientEmail: "priya@fashionstore.in",
          requirements: "Online store with payment integration, inventory management, and admin panel",
          submittedBy: "Sales Team - Amit Patel"
        },
        {
          id: 102,
          name: "Restaurant App",
          client: "Delicious Bites",
          status: "completed",
          progress: 100,
          priority: "normal",
          dueDate: "2024-01-20",
          teamSize: 3,
          budget: 35000,
          pm: "Mike Wilson",
          startDate: "2023-12-01",
          completedDate: "2024-01-18",
          clientContact: "Rajesh Kumar",
          clientPhone: "+91 87654 32109",
          clientEmail: "rajesh@deliciousbites.in",
          requirements: "Food ordering app with table booking and delivery tracking",
          submittedBy: "Sales Team - Sneha Gupta"
        },
        {
          id: 103,
          name: "Healthcare Portal",
          client: "MedCare Plus",
          status: "completed",
          progress: 100,
          priority: "urgent",
          dueDate: "2024-01-25",
          teamSize: 5,
          budget: 60000,
          pm: "Lisa Davis",
          startDate: "2023-10-15",
          completedDate: "2024-01-22",
          clientContact: "Dr. Anjali Singh",
          clientPhone: "+91 76543 21098",
          clientEmail: "anjali@medcareplus.in",
          requirements: "Patient management system with appointment booking and prescription tracking",
          submittedBy: "Sales Team - Priya Sharma"
        },
        {
          id: 104,
          name: "School Management System",
          client: "EduTech Academy",
          status: "completed",
          progress: 100,
          priority: "normal",
          dueDate: "2024-01-30",
          teamSize: 4,
          budget: 50000,
          pm: "David Brown",
          startDate: "2023-11-15",
          completedDate: "2024-01-28",
          clientContact: "Vikram Mehta",
          clientPhone: "+91 65432 10987",
          clientEmail: "vikram@edutechacademy.in",
          requirements: "Student management, attendance tracking, and parent portal",
          submittedBy: "Sales Team - Amit Patel"
        },
        {
          id: 105,
          name: "Real Estate Portal",
          client: "Property Hub",
          status: "completed",
          progress: 100,
          priority: "high",
          dueDate: "2024-02-05",
          teamSize: 6,
          budget: 75000,
          pm: "Emma Taylor",
          startDate: "2023-12-01",
          completedDate: "2024-02-02",
          clientContact: "Suresh Patel",
          clientPhone: "+91 54321 09876",
          clientEmail: "suresh@propertyhub.in",
          requirements: "Property listing portal with virtual tours and mortgage calculator",
          submittedBy: "Sales Team - Sneha Gupta"
        }
      ]

      // Mock employees data
      const mockEmployees = [
        {
          id: 1,
          name: "John Doe",
          email: "john.doe@company.com",
          role: "Senior Developer",
          department: "Engineering",
          status: "active",
          projects: 3,
          tasks: 12,
          joinDate: "2023-06-01",
          performance: 95,
          avatar: "JD"
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.smith@company.com",
          role: "UI/UX Designer",
          department: "Design",
          status: "active",
          projects: 2,
          tasks: 8,
          joinDate: "2023-08-15",
          performance: 88,
          avatar: "JS"
        },
        {
          id: 3,
          name: "Mike Johnson",
          email: "mike.johnson@company.com",
          role: "QA Engineer",
          department: "Engineering",
          status: "active",
          projects: 4,
          tasks: 15,
          joinDate: "2023-04-10",
          performance: 92,
          avatar: "MJ"
        },
        {
          id: 4,
          name: "Sarah Wilson",
          email: "sarah.wilson@company.com",
          role: "Project Manager",
          department: "Management",
          status: "active",
          projects: 5,
          tasks: 20,
          joinDate: "2023-02-01",
          performance: 98,
          avatar: "SW"
        },
        {
          id: 5,
          name: "David Brown",
          email: "david.brown@company.com",
          role: "DevOps Engineer",
          department: "Engineering",
          status: "on-leave",
          projects: 2,
          tasks: 6,
          joinDate: "2023-09-01",
          performance: 85,
          avatar: "DB"
        }
      ]

      // Mock clients data
      const mockClients = [
        {
          id: 1,
          name: "TechCorp Inc.",
          contact: "John Smith",
          email: "john@techcorp.com",
          status: "active",
          projects: 3,
          totalSpent: 125000,
          joinDate: "2023-01-15",
          lastActivity: "2024-01-20"
        },
        {
          id: 2,
          name: "StartupXYZ",
          contact: "Jane Doe",
          email: "jane@startupxyz.com",
          status: "active",
          projects: 1,
          totalSpent: 35000,
          joinDate: "2024-01-01",
          lastActivity: "2024-01-22"
        },
        {
          id: 3,
          name: "Global Corp",
          contact: "Mike Wilson",
          email: "mike@globalcorp.com",
          status: "inactive",
          projects: 2,
          totalSpent: 50000,
          joinDate: "2023-06-01",
          lastActivity: "2023-12-15"
        }
      ]

      // Mock project managers data
      const mockPMs = [
        {
          id: 1,
          name: "Sarah Johnson",
          email: "sarah.johnson@company.com",
          status: "active",
          projects: 5,
          teamSize: 12,
          completionRate: 94,
          joinDate: "2023-02-01",
          performance: 98
        },
        {
          id: 2,
          name: "Mike Wilson",
          email: "mike.wilson@company.com",
          status: "active",
          projects: 4,
          teamSize: 8,
          completionRate: 89,
          joinDate: "2023-05-15",
          performance: 92
        },
        {
          id: 3,
          name: "Lisa Davis",
          email: "lisa.davis@company.com",
          status: "active",
          projects: 3,
          teamSize: 6,
          completionRate: 96,
          joinDate: "2023-08-01",
          performance: 95
        }
      ]

      setProjects(mockProjects)
      setPendingProjects(mockPendingProjects)
      setCompletedProjects(mockCompletedProjects)
      setEmployees(mockEmployees)
      setClients(mockClients)
      setProjectManagers(mockPMs)
      
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      // Load statistics
      const statsResponse = await adminProjectService.getProjectManagementStatistics()
      if (statsResponse.success) {
        setStatistics(statsResponse.data)
      }

      // Load PM options for assignment
      const pmOptionsResponse = await adminProjectService.getPMsForAssignment()
      if (pmOptionsResponse.success) {
        setPMOptions(pmOptionsResponse.data)
      }

      // Load data based on active tab
      await loadTabData()
      
    } catch (error) {
      console.error('Error loading data:', error)
      setError('Failed to load data. Please try again.')
      // Keep existing mock data as fallback
    } finally {
      setLoading(false)
    }
  }

  const loadTabData = async () => {
    try {
      switch (activeTab) {
        case 'pending-projects':
          const pendingResponse = await adminProjectService.getPendingProjects({
            priority: selectedFilter !== 'all' ? selectedFilter : undefined,
            search: searchTerm || undefined,
            page: currentPage,
            limit: itemsPerPage
          })
          if (pendingResponse.success) {
            setPendingProjects(pendingResponse.data)
          }
          break

        case 'active-projects':
          const activeResponse = await adminProjectService.getActiveProjects({
            priority: selectedFilter !== 'all' ? selectedFilter : undefined,
            search: searchTerm || undefined,
            page: currentPage,
            limit: itemsPerPage
          })
          if (activeResponse.success) {
            setProjects(activeResponse.data)
          }
          break

        case 'completed-projects':
          const completedResponse = await adminProjectService.getCompletedProjects({
            priority: selectedFilter !== 'all' ? selectedFilter : undefined,
            search: searchTerm || undefined,
            page: currentPage,
            limit: itemsPerPage
          })
          if (completedResponse.success) {
            setCompletedProjects(completedResponse.data)
          }
          break

        case 'employees':
          const employeesResponse = await adminProjectService.getEmployees({
            status: selectedFilter !== 'all' ? selectedFilter : undefined,
            search: searchTerm || undefined,
            page: currentPage,
            limit: itemsPerPage
          })
          if (employeesResponse.success) {
            setEmployees(employeesResponse.data)
          }
          break

        case 'clients':
          const clientsResponse = await adminProjectService.getClients({
            status: selectedFilter !== 'all' ? selectedFilter : undefined,
            search: searchTerm || undefined,
            page: currentPage,
            limit: itemsPerPage
          })
          if (clientsResponse.success) {
            setClients(clientsResponse.data)
          }
          break

        case 'project-managers':
          const pmsResponse = await adminProjectService.getPMs({
            status: selectedFilter !== 'all' ? selectedFilter : undefined,
            search: searchTerm || undefined,
            page: currentPage,
            limit: itemsPerPage
          })
          if (pmsResponse.success) {
            setProjectManagers(pmsResponse.data)
          }
          break

        default:
          break
      }
    } catch (error) {
      console.error(`Error loading ${activeTab} data:`, error)
      setError(`Failed to load ${activeTab} data. Please try again.`)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'on-leave': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCurrentData = () => {
    switch (activeTab) {
      case 'pending-projects': return pendingProjects
      case 'active-projects': return projects
      case 'completed-projects': return completedProjects
      case 'employees': return employees
      case 'clients': return clients
      case 'project-managers': return projectManagers
      default: return []
    }
  }

  const filteredData = getCurrentData().filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (typeof item.client === 'string' ? item.client : item.client?.name || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.clientContact?.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesFilter = true
    if (activeTab === 'pending-projects') {
      matchesFilter = selectedFilter === 'all' || item.priority === selectedFilter
    } else {
      matchesFilter = selectedFilter === 'all' || item.status === selectedFilter
    }
    
    return matchesSearch && matchesFilter
  })

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Management Functions
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
    // Simulate API call
    console.log(`Deleting ${modalType}:`, selectedItem)
    setShowDeleteModal(false)
    setSelectedItem(null)
    setModalType('')
    // In real app, update the state to remove the item
  }

  const handleSave = (formData) => {
    // Simulate API call
    console.log(`Saving ${modalType}:`, formData)
    setShowCreateModal(false)
    setShowEditModal(false)
    setSelectedItem(null)
    setModalType('')
    // In real app, update the state with new/updated item
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowViewModal(false)
    setShowDeleteModal(false)
    setShowPMAssignmentModal(false)
    setShowPendingDetailsModal(false)
    setSelectedItem(null)
    setSelectedPendingProject(null)
    setSelectedPM('')
    setModalType('')
  }

  // PM Assignment Functions
  const handleAssignPM = (pendingProject) => {
    setSelectedPendingProject(pendingProject)
    setSelectedPM('')
    setShowPMAssignmentModal(true)
  }

  const handleViewPendingDetails = (pendingProject) => {
    setSelectedPendingProject(pendingProject)
    setShowPendingDetailsModal(true)
  }

  const confirmPMAssignment = async () => {
    if (!selectedPM || !selectedPendingProject) return

    try {
      setLoading(true)
      
      // Call API to assign PM to pending project
      const response = await adminProjectService.assignPMToProject(
        selectedPendingProject._id || selectedPendingProject.id, 
        selectedPM
      )
      
      if (response.success) {
        // Remove from pending projects
        setPendingProjects(prev => 
          prev.filter(p => (p._id || p.id) !== (selectedPendingProject._id || selectedPendingProject.id))
        )
        
        // Add to active projects
        setProjects(prev => [...prev, response.data])
        
        // Update statistics
        setStatistics(prev => ({
          ...prev,
          projects: {
            ...prev.projects,
            pending: prev.projects.pending - 1,
            active: prev.projects.active + 1
          }
        }))
        
        // Show success message
        console.log('PM assigned successfully:', response.message)
        setError(null) // Clear any previous errors
      } else {
        setError('Failed to assign PM. Please try again.')
      }
      
    } catch (error) {
      console.error('Error assigning PM:', error)
      setError('Failed to assign PM. Please try again.')
    } finally {
      setLoading(false)
      closeModals()
    }
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
      <div className="ml-64 pt-20 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5">
                      <button
                        type="button"
                        onClick={() => setError(null)}
                        className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Project Management
            </h1>
            <p className="text-gray-600">
                  Comprehensive management of development teams, projects, and resources.
                </p>
              </div>
              <div className="flex items-center space-x-3">
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

          {/* Compact Statistics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mb-4">
            {/* Projects Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <FiFolder className="h-3 w-3 text-blue-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Projects</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-lg font-bold text-gray-900">{statistics.projects.total}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-green-600 font-semibold">+{statistics.projects.thisMonth}</span>
                  <span className="text-xs text-gray-500">this month</span>
                </div>
              </div>
            </motion.div>

            {/* Milestones Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <FiTarget className="h-3 w-3 text-purple-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Milestones</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-lg font-bold text-gray-900">{statistics.milestones.total}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-green-600 font-semibold">{statistics.milestones.completed}</span>
                  <span className="text-xs text-gray-500">completed</span>
                </div>
              </div>
            </motion.div>

            {/* Tasks Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <FiCheckSquare className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Tasks</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-lg font-bold text-gray-900">{statistics.tasks.total}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-green-600 font-semibold">{statistics.tasks.completed}</span>
                  <span className="text-xs text-gray-500">completed</span>
                </div>
              </div>
            </motion.div>

            {/* Employees Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="p-1.5 bg-orange-100 rounded-lg">
                  <FiUsers className="h-3 w-3 text-orange-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Employees</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-lg font-bold text-gray-900">{statistics.employees.total}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-green-600 font-semibold">+{statistics.employees.newThisMonth}</span>
                  <span className="text-xs text-gray-500">new</span>
                </div>
              </div>
            </motion.div>

            {/* Clients Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="p-1.5 bg-teal-100 rounded-lg">
                  <FiHome className="h-3 w-3 text-teal-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Clients</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-lg font-bold text-gray-900">{statistics.clients.total}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-green-600 font-semibold">+{statistics.clients.newThisMonth}</span>
                  <span className="text-xs text-gray-500">new</span>
                </div>
              </div>
            </motion.div>

            {/* PMs Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="p-1.5 bg-indigo-100 rounded-lg">
                  <FiUser className="h-3 w-3 text-indigo-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">PMs</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-lg font-bold text-gray-900">{statistics.projectManagers.total}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-blue-600 font-semibold">{statistics.projectManagers.avgProjects}</span>
                  <span className="text-xs text-gray-500">avg projects</span>
                </div>
              </div>
            </motion.div>

            {/* Pending Projects Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="p-1.5 bg-orange-100 rounded-lg">
                  <FiClock className="h-3 w-3 text-orange-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Pending</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-lg font-bold text-gray-900">{statistics.projects.pending}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-orange-600 font-semibold">needs PM</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
            <div className="border-b border-gray-200">
              <nav className="flex flex-wrap gap-1 px-4">
                {[
                  { key: 'pending-projects', label: 'Pending', icon: FiClock },
                  { key: 'active-projects', label: 'Active', icon: FiFolder },
                  { key: 'completed-projects', label: 'Completed', icon: FiCheckCircle },
                  { key: 'employees', label: 'Employees', icon: FiUsers },
                  { key: 'clients', label: 'Clients', icon: FiHome },
                  { key: 'project-managers', label: 'PMs', icon: FiUser }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center space-x-1.5 py-2.5 px-3 border-b-2 font-medium text-xs transition-colors rounded-t-md ${
                      activeTab === tab.key
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-3.5 w-3.5" />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {/* Pending Projects Tab */}
              {activeTab === 'pending-projects' && (
                <div className="space-y-6">
                  {/* Header Section */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Pending Projects</h2>
                      <p className="text-gray-600 mt-1">Projects from sales team waiting for PM assignment</p>
                    </div>
                    <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg text-sm font-semibold">
                      {pendingProjects.length} pending assignment
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search pending projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="all">All Priority</option>
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="normal">Normal</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  {/* Pending Projects Grid */}
                  {pendingProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {pendingProjects.map((pendingProject) => (
                        <div key={pendingProject.id} className="bg-white rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden">
                          {/* Header with Priority Badge */}
                          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-3 border-b border-orange-100">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0 pr-2">
                                <h4 className="text-sm font-bold text-gray-900 truncate mb-0.5">{pendingProject.name}</h4>
                                <p className="text-xs text-gray-600 font-medium truncate">
                                  {typeof pendingProject.client === 'string' 
                                    ? pendingProject.client 
                                    : pendingProject.client?.name || 'Unknown Client'
                                  }
                                </p>
                              </div>
                              <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded-full ${getPriorityColor(pendingProject.priority)} flex-shrink-0`}>
                                {pendingProject.priority}
                              </span>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="p-3 space-y-3">
                            {/* Client Contact */}
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <FiUser className="h-3 w-3 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900 truncate">{pendingProject.clientContact}</p>
                                <p className="text-xs text-gray-500 truncate">{pendingProject.clientPhone}</p>
                              </div>
                            </div>

                            {/* Package & Budget Row */}
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-blue-50 rounded-md p-2">
                                <div className="text-xs text-blue-600 font-medium mb-0.5">Package</div>
                                <div className="text-xs font-bold text-blue-800 line-clamp-2">{pendingProject.package}</div>
                              </div>
                              <div className="bg-green-50 rounded-md p-2">
                                <div className="text-xs text-green-600 font-medium mb-0.5">Budget</div>
                                <div className="text-xs font-bold text-green-700">{formatCurrency(pendingProject.budget)}</div>
                              </div>
                            </div>

                            {/* Submission Info */}
                            <div className="bg-gray-50 rounded-md p-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-xs text-gray-600 font-medium">Submitted</div>
                                  <div className="text-xs font-semibold text-gray-900">{formatDate(pendingProject.submittedDate)}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs text-gray-600 font-medium">By</div>
                                  <div className="text-xs font-semibold text-gray-900 truncate max-w-16">
                                    {typeof pendingProject.submittedBy === 'string' 
                                      ? pendingProject.submittedBy.split(' - ')[1] || pendingProject.submittedBy
                                      : pendingProject.submittedBy?.name || 'Unknown'
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="px-3 pb-3">
                            <div className="flex space-x-1.5">
                              <button
                                onClick={() => handleViewPendingDetails(pendingProject)}
                                className="flex-1 bg-blue-500 text-white rounded-md py-2 px-2 text-xs font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                              >
                                <FiEye className="h-3 w-3" />
                                <span>Details</span>
                              </button>
                              <button
                                onClick={() => handleAssignPM(pendingProject)}
                                className="flex-1 bg-orange-500 text-white rounded-md py-2 px-2 text-xs font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-1"
                              >
                                <FiUser className="h-3 w-3" />
                                <span>Assign</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <FiClock className="text-orange-500 text-3xl" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">No pending projects</h3>
                        <p className="text-gray-600 text-lg">
                          All projects have been assigned to project managers. New projects from the sales team will appear here.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Active Projects Tab */}
              {activeTab === 'active-projects' && (
                <div className="space-y-6">
                  {/* Header Section */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Active Projects</h2>
                      <p className="text-gray-600 mt-1">Projects currently in progress with assigned PMs</p>
                    </div>
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold">
                      {projects.length} active projects
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search active projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>

                  {/* Projects Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {paginatedData.map((project) => (
                      <div key={project.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105 group">
                        {/* Header Section */}
                        <div className="mb-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-bold text-gray-900 truncate mb-1">{project.name}</h3>
                              <p className="text-xs text-gray-600 font-medium mb-1">
                                {typeof project.client === 'string' 
                                  ? project.client 
                                  : project.client?.name || 'Unknown Client'
                                }
                              </p>
                              <p className="text-xs text-gray-400">
                                PM: {typeof project.pm === 'string' 
                                  ? project.pm 
                                  : project.pm?.name || 'Unassigned'
                                }
                              </p>
                            </div>
                            <div className="flex flex-col space-y-1 ml-2">
                              <span className={`inline-flex px-1.5 py-0.5 text-xs font-bold rounded-full border ${getStatusColor(project.status)}`}>
                                {project.status}
                              </span>
                              <span className={`inline-flex px-1.5 py-0.5 text-xs font-bold rounded-full ${getPriorityColor(project.priority)}`}>
                                {project.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Section */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-700">Progress</span>
                            <span className="text-sm font-bold text-primary">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-gradient-to-r from-primary to-primary-dark h-1.5 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
                          </div>
                        </div>
                        
                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-blue-50 rounded-lg p-2">
                            <div className="text-xs text-blue-600 font-medium mb-1">Due Date</div>
                            <div className="text-xs font-bold text-blue-800">{formatDate(project.dueDate)}</div>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-2">
                            <div className="text-xs text-purple-600 font-medium mb-1">Team Size</div>
                            <div className="text-xs font-bold text-purple-800">{project.teamSize}</div>
                          </div>
                        </div>
                        
                        {/* Budget Highlight */}
                        <div className="bg-green-50 rounded-lg p-2 mb-3">
                          <div className="text-xs text-green-600 font-medium mb-1">Budget</div>
                          <div className="text-sm font-bold text-green-700">{formatCurrency(project.budget)}</div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-1">
                            <button 
                              onClick={() => handleView(project, 'project')}
                              className="text-gray-400 hover:text-primary p-1.5 rounded hover:bg-primary/10 transition-all duration-200 group-hover:text-primary"
                            >
                              <FiEye className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => handleEdit(project, 'project')}
                              className="text-gray-400 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50 transition-all duration-200 group-hover:text-blue-600"
                            >
                              <FiEdit3 className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => handleDelete(project, 'project')}
                              className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-all duration-200 group-hover:text-red-600"
                            >
                              <FiTrash2 className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="text-xs text-gray-400 font-medium">
                            {formatDate(project.startDate)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} projects
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 border rounded-md text-sm font-medium ${
                            currentPage === page
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Completed Projects Tab */}
              {activeTab === 'completed-projects' && (
                <div className="space-y-6">
                  {/* Header Section */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Completed Projects</h2>
                      <p className="text-gray-600 mt-1">Successfully completed projects with full details</p>
                    </div>
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold">
                      {completedProjects.length} completed projects
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search completed projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="all">All Priority</option>
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="normal">Normal</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  {/* Completed Projects Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {paginatedData.map((project) => (
                      <div key={project.id} className="bg-white rounded-lg border border-green-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105 group">
                        {/* Header Section */}
                        <div className="mb-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-bold text-gray-900 truncate mb-1">{project.name}</h3>
                              <p className="text-xs text-gray-600 font-medium mb-1">
                                {typeof project.client === 'string' 
                                  ? project.client 
                                  : project.client?.name || 'Unknown Client'
                                }
                              </p>
                              <p className="text-xs text-gray-400">
                                PM: {typeof project.pm === 'string' 
                                  ? project.pm 
                                  : project.pm?.name || 'Unassigned'
                                }
                              </p>
                            </div>
                            <div className="flex flex-col space-y-1 ml-2">
                              <span className="inline-flex px-1.5 py-0.5 text-xs font-bold rounded-full border bg-green-100 text-green-800 border-green-200">
                                Completed
                              </span>
                              <span className={`inline-flex px-1.5 py-0.5 text-xs font-bold rounded-full ${getPriorityColor(project.priority)}`}>
                                {project.priority}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Completion Info */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-700">Completed</span>
                            <span className="text-sm font-bold text-green-600">{formatDate(project.completedDate)}</span>
                            </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full w-full"></div>
                            </div>
                          </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-blue-50 rounded-lg p-2">
                              <div className="text-xs text-blue-600 font-medium mb-1">Duration</div>
                            <div className="text-xs font-bold text-blue-800">
                                {Math.ceil((new Date(project.completedDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24))} days
                              </div>
                            </div>
                          <div className="bg-purple-50 rounded-lg p-2">
                            <div className="text-xs text-purple-600 font-medium mb-1">Team Size</div>
                            <div className="text-xs font-bold text-purple-800">{project.teamSize}</div>
                            </div>
                          </div>

                        {/* Budget Highlight */}
                        <div className="bg-green-50 rounded-lg p-2 mb-3">
                          <div className="text-xs text-green-600 font-medium mb-1">Budget</div>
                          <div className="text-sm font-bold text-green-700">{formatCurrency(project.budget)}</div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleView(project, 'project')}
                              className="text-gray-400 hover:text-primary p-1.5 rounded hover:bg-primary/10 transition-all duration-200 group-hover:text-primary"
                            >
                              <FiEye className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleEdit(project, 'project')}
                              className="text-gray-400 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50 transition-all duration-200 group-hover:text-blue-600"
                            >
                              <FiEdit3 className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => handleDelete(project, 'project')}
                              className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-all duration-200 group-hover:text-red-600"
                            >
                              <FiTrash2 className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="text-xs text-gray-400 font-medium">
                            {formatDate(project.startDate)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} completed projects
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 border rounded-md text-sm font-medium ${
                            currentPage === page
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Employees Tab */}
              {activeTab === 'employees' && (
                <div className="space-y-6">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="on-leave">On Leave</option>
                    </select>
                  </div>

                  {/* Employees Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {paginatedData.map((employee) => (
                      <div key={employee.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105 group">
                        {/* Header Section */}
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                            {employee.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-gray-900 truncate">{employee.name}</h3>
                            <p className="text-xs text-gray-600 font-medium">{employee.role}</p>
                            <span className={`inline-flex px-1.5 py-0.5 text-xs font-bold rounded-full border mt-1 ${getStatusColor(employee.status)}`}>
                              {employee.status}
                            </span>
                          </div>
                        </div>
                        
                        {/* Performance Highlight */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-green-700">Performance</span>
                            <span className="text-lg font-bold text-green-600">{employee.performance}%</span>
                          </div>
                        </div>
                        
                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-blue-50 rounded-lg p-2">
                            <div className="text-xs text-blue-600 font-medium mb-1">Department</div>
                            <div className="text-xs font-bold text-blue-800">{employee.department}</div>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-2">
                            <div className="text-xs text-purple-600 font-medium mb-1">Projects</div>
                            <div className="text-xs font-bold text-purple-800">{employee.projects}</div>
                          </div>
                        </div>
                        
                        {/* Workload Metrics */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-orange-50 rounded-lg p-2">
                            <div className="text-xs text-orange-600 font-medium mb-1">Tasks</div>
                            <div className="text-xs font-bold text-orange-800">{employee.tasks}</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2">
                            <div className="text-xs text-gray-600 font-medium mb-1">Joined</div>
                            <div className="text-xs font-bold text-gray-800">{formatDate(employee.joinDate)}</div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-1">
                            <button 
                              onClick={() => handleView(employee, 'employee')}
                              className="text-gray-400 hover:text-primary p-1.5 rounded hover:bg-primary/10 transition-all duration-200 group-hover:text-primary"
                            >
                              <FiEye className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => handleEdit(employee, 'employee')}
                              className="text-gray-400 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50 transition-all duration-200 group-hover:text-blue-600"
                            >
                              <FiEdit3 className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => handleDelete(employee, 'employee')}
                              className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-all duration-200 group-hover:text-red-600"
                            >
                              <FiTrash2 className="h-3 w-3" />
                            </button>
                          </div>
                          <a href={`mailto:${employee.email}`} className="text-xs text-gray-400 hover:text-gray-600 truncate max-w-20 font-medium">
                            {employee.email}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} employees
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 border rounded-md text-sm font-medium ${
                            currentPage === page
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Clients Tab */}
              {activeTab === 'clients' && (
                <div className="space-y-6">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Clients Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {paginatedData.map((client) => (
                      <div key={client.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105 group">
                        {/* Header Section */}
                        <div className="mb-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="text-sm font-bold text-gray-900 mb-1">{client.name}</h3>
                              <p className="text-xs text-gray-600 font-medium mb-1">{client.contact}</p>
                              <p className="text-xs text-gray-400">{client.email}</p>
                            </div>
                            <span className={`inline-flex px-1.5 py-0.5 text-xs font-bold rounded-full border ${getStatusColor(client.status)}`}>
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
                            <div className="text-xs font-bold text-blue-800">{client.projects}</div>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-2">
                            <div className="text-xs text-purple-600 font-medium mb-1">Joined</div>
                            <div className="text-xs font-bold text-purple-800">{formatDate(client.joinDate)}</div>
                          </div>
                        </div>
                        
                        {/* Activity Status */}
                        <div className="bg-gray-50 rounded-lg p-2 mb-3">
                          <div className="text-xs text-gray-600 font-medium mb-1">Last Activity</div>
                          <div className="text-xs font-bold text-gray-800">{formatDate(client.lastActive)}</div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-1">
                            <button 
                              onClick={() => handleView(client, 'client')}
                              className="text-gray-400 hover:text-primary p-1.5 rounded hover:bg-primary/10 transition-all duration-200 group-hover:text-primary"
                            >
                              <FiEye className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => handleEdit(client, 'client')}
                              className="text-gray-400 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50 transition-all duration-200 group-hover:text-blue-600"
                            >
                              <FiEdit3 className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => handleDelete(client, 'client')}
                              className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-all duration-200 group-hover:text-red-600"
                            >
                              <FiTrash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} clients
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 border rounded-md text-sm font-medium ${
                            currentPage === page
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Project Managers Tab */}
              {activeTab === 'project-managers' && (
                <div className="space-y-6">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search project managers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="on-leave">On Leave</option>
                    </select>
                  </div>

                  {/* PMs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {paginatedData.map((pm) => (
                      <div key={pm.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:scale-105 group">
                        {/* Header Section */}
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                            {pm.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-gray-900 truncate">{pm.name}</h3>
                            <p className="text-xs text-gray-600 font-medium">Project Manager</p>
                            <span className={`inline-flex px-1.5 py-0.5 text-xs font-bold rounded-full border mt-1 ${getStatusColor(pm.status)}`}>
                              {pm.status}
                            </span>
                          </div>
                        </div>
                        
                        {/* Performance Metrics */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2">
                            <div className="text-xs text-green-600 font-medium mb-1">Completion</div>
                            <div className="text-sm font-bold text-green-700">{pm.completionRate}%</div>
                          </div>
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2">
                            <div className="text-xs text-blue-600 font-medium mb-1">Performance</div>
                            <div className="text-sm font-bold text-blue-700">{pm.performance}%</div>
                          </div>
                        </div>
                        
                        {/* Management Metrics */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-purple-50 rounded-lg p-2">
                            <div className="text-xs text-purple-600 font-medium mb-1">Projects</div>
                            <div className="text-xs font-bold text-purple-800">{pm.projects}</div>
                          </div>
                          <div className="bg-orange-50 rounded-lg p-2">
                            <div className="text-xs text-orange-600 font-medium mb-1">Team Size</div>
                            <div className="text-xs font-bold text-orange-800">{pm.teamSize}</div>
                          </div>
                        </div>
                        
                        {/* Join Date */}
                        <div className="bg-gray-50 rounded-lg p-2 mb-3">
                          <div className="text-xs text-gray-600 font-medium mb-1">Joined</div>
                          <div className="text-xs font-bold text-gray-800">{formatDate(pm.joinDate)}</div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-1">
                            <button 
                              onClick={() => handleView(pm, 'pm')}
                              className="text-gray-400 hover:text-primary p-1.5 rounded hover:bg-primary/10 transition-all duration-200 group-hover:text-primary"
                            >
                              <FiEye className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => handleEdit(pm, 'pm')}
                              className="text-gray-400 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50 transition-all duration-200 group-hover:text-blue-600"
                            >
                              <FiEdit3 className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => handleDelete(pm, 'pm')}
                              className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-all duration-200 group-hover:text-red-600"
                            >
                              <FiTrash2 className="h-3 w-3" />
                            </button>
                          </div>
                          <a href={`mailto:${pm.email}`} className="text-xs text-gray-400 hover:text-gray-600 truncate max-w-20 font-medium">
                            {pm.email}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} project managers
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 border rounded-md text-sm font-medium ${
                            currentPage === page
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FiTrash2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete {modalType}</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete {selectedItem?.name || 'this item'}? This will permanently remove all associated data.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Create/Edit Modal */}
        {(showCreateModal || showEditModal) && (
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
              className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {showCreateModal ? `Create New ${modalType}` : `Edit ${modalType}`}
                </h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              
              <form className="space-y-4">
                {modalType === 'project' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                      <input
                        type="text"
                        defaultValue={selectedItem?.name || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter project name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                      <input
                        type="text"
                        defaultValue={selectedItem?.client || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter client name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          defaultValue={selectedItem?.status || 'active'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="active">Active</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="on-hold">On Hold</option>
                          <option value="overdue">Overdue</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select
                          defaultValue={selectedItem?.priority || 'normal'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="low">Low</option>
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {modalType === 'employee' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          defaultValue={selectedItem?.name || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter employee name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue={selectedItem?.email || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <input
                          type="text"
                          defaultValue={selectedItem?.role || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter role"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                        <select
                          defaultValue={selectedItem?.department || 'Engineering'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="Engineering">Engineering</option>
                          <option value="Design">Design</option>
                          <option value="Management">Management</option>
                          <option value="Business">Business</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {modalType === 'client' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        defaultValue={selectedItem?.name || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter company name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                        <input
                          type="text"
                          defaultValue={selectedItem?.contact || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter contact person"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue={selectedItem?.email || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                  </>
                )}

                {modalType === 'pm' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          defaultValue={selectedItem?.name || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter PM name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue={selectedItem?.email || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault()
                      handleSave({})
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    {showCreateModal ? 'Create' : 'Update'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* View Modal */}
        {showViewModal && (
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
                  <h3 className="text-2xl font-bold text-gray-900">
                  {modalType.charAt(0).toUpperCase() + modalType.slice(1)} Details
                </h3>
                  <p className="text-gray-600 text-sm mt-1">Complete information about the {modalType}</p>
                </div>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              {/* Project Details */}
              {modalType === 'project' && selectedItem && (
                <>
                  {/* Project Overview */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedItem.name}</h4>
                        <p className="text-gray-600 font-medium mb-1">{selectedItem.client}</p>
                        <p className="text-gray-500">PM: {selectedItem.pm}</p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${getStatusColor(selectedItem.status)}`}>
                          {selectedItem.status}
                    </span>
                        <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${getPriorityColor(selectedItem.priority)}`}>
                          {selectedItem.priority} Priority
                    </span>
                  </div>
              </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-blue-600 font-medium mb-1">Progress</div>
                        <div className="text-lg font-bold text-blue-800">{selectedItem.progress}%</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-green-600 font-medium mb-1">Budget</div>
                        <div className="text-lg font-bold text-green-700">{formatCurrency(selectedItem.budget)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Project Information */}
                  <div className="mb-6">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiFolder className="h-5 w-5 mr-2 text-blue-600" />
                      Project Information
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium mb-1">Start Date</div>
                        <div className="text-base font-semibold text-gray-900">{formatDate(selectedItem.startDate)}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium mb-1">Due Date</div>
                        <div className="text-base font-semibold text-gray-900">{formatDate(selectedItem.dueDate)}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium mb-1">Team Size</div>
                        <div className="text-base font-semibold text-gray-900">{selectedItem.teamSize} members</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium mb-1">Project Manager</div>
                        <div className="text-base font-semibold text-gray-900">{selectedItem.pm}</div>
                      </div>
                    </div>
                  </div>

                  {/* Client Information */}
                  {selectedItem.clientContact && (
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FiUser className="h-5 w-5 mr-2 text-blue-600" />
                        Client Information
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm text-gray-600 font-medium mb-1">Client Name</div>
                          <div className="text-base font-semibold text-gray-900">{selectedItem.client}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm text-gray-600 font-medium mb-1">Contact Person</div>
                          <div className="text-base font-semibold text-gray-900">{selectedItem.clientContact}</div>
                        </div>
                        {selectedItem.clientPhone && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-sm text-gray-600 font-medium mb-1">Phone Number</div>
                            <div className="text-base font-semibold text-gray-900">{selectedItem.clientPhone}</div>
                          </div>
                        )}
                        {selectedItem.clientEmail && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-sm text-gray-600 font-medium mb-1">Email Address</div>
                            <div className="text-base font-semibold text-gray-900">{selectedItem.clientEmail}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Requirements */}
                  {selectedItem.requirements && (
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FiTarget className="h-5 w-5 mr-2 text-purple-600" />
                        Project Requirements
                      </h5>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-800 leading-relaxed">{selectedItem.requirements}</div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Employee Details */}
              {modalType === 'employee' && selectedItem && (
                <>
                  {/* Employee Overview */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                          {selectedItem.avatar}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 mb-1">{selectedItem.name}</h4>
                          <p className="text-gray-600 font-medium mb-1">{selectedItem.role}</p>
                          <p className="text-gray-500">{selectedItem.department}</p>
                        </div>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${getStatusColor(selectedItem.status)}`}>
                        {selectedItem.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-green-600 font-medium mb-1">Performance</div>
                        <div className="text-lg font-bold text-green-800">{selectedItem.performance}%</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-blue-600 font-medium mb-1">Projects</div>
                        <div className="text-lg font-bold text-blue-800">{selectedItem.projects}</div>
                      </div>
                    </div>
                  </div>

                  {/* Employee Information */}
                  <div className="mb-6">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiUsers className="h-5 w-5 mr-2 text-green-600" />
                      Employee Information
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium mb-1">Email</div>
                        <div className="text-base font-semibold text-gray-900">{selectedItem.email}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium mb-1">Department</div>
                        <div className="text-base font-semibold text-gray-900">{selectedItem.department}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium mb-1">Join Date</div>
                        <div className="text-base font-semibold text-gray-900">{formatDate(selectedItem.joinDate)}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium mb-1">Active Tasks</div>
                        <div className="text-base font-semibold text-gray-900">{selectedItem.tasks}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Client Details */}
              {modalType === 'client' && selectedItem && (
                <>
                  {/* Client Overview */}
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 mb-6 border border-teal-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedItem.name}</h4>
                        <p className="text-gray-600 font-medium mb-1">{selectedItem.contact}</p>
                        <p className="text-gray-500">{selectedItem.email}</p>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${getStatusColor(selectedItem.status)}`}>
                        {selectedItem.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-teal-600 font-medium mb-1">Total Spent</div>
                        <div className="text-lg font-bold text-teal-800">{formatCurrency(selectedItem.totalSpent)}</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-blue-600 font-medium mb-1">Projects</div>
                        <div className="text-lg font-bold text-blue-800">{selectedItem.projects}</div>
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
                        <div className="text-base font-semibold text-gray-900">{selectedItem.contact}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium mb-1">Email</div>
                        <div className="text-base font-semibold text-gray-900">{selectedItem.email}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium mb-1">Join Date</div>
                        <div className="text-base font-semibold text-gray-900">{formatDate(selectedItem.joinDate)}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium mb-1">Last Activity</div>
                        <div className="text-base font-semibold text-gray-900">{formatDate(selectedItem.lastActive)}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* PM Details */}
              {modalType === 'pm' && selectedItem && (
                <>
                  {/* PM Overview */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border border-indigo-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                          {selectedItem.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 mb-1">{selectedItem.name}</h4>
                          <p className="text-gray-600 font-medium mb-1">Project Manager</p>
                          <p className="text-gray-500">{selectedItem.email}</p>
                        </div>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${getStatusColor(selectedItem.status)}`}>
                        {selectedItem.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-indigo-600 font-medium mb-1">Performance</div>
                        <div className="text-lg font-bold text-indigo-800">{selectedItem.performance}%</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-purple-600 font-medium mb-1">Completion Rate</div>
                        <div className="text-lg font-bold text-purple-800">{selectedItem.completionRate}%</div>
                      </div>
                    </div>
                  </div>

                  {/* PM Information */}
                  <div className="mb-6">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiUser className="h-5 w-5 mr-2 text-indigo-600" />
                      Manager Information
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium mb-1">Email</div>
                        <div className="text-base font-semibold text-gray-900">{selectedItem.email}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium mb-1">Join Date</div>
                        <div className="text-base font-semibold text-gray-900">{formatDate(selectedItem.joinDate)}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium mb-1">Active Projects</div>
                        <div className="text-base font-semibold text-gray-900">{selectedItem.projects}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium mb-1">Team Size</div>
                        <div className="text-base font-semibold text-gray-900">{selectedItem.teamSize} members</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

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
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center space-x-2"
                >
                  <FiEdit3 className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* PM Assignment Modal */}
        {showPMAssignmentModal && selectedPendingProject && (
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
              className="bg-white rounded-xl p-5 max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Assign PM</h3>
                  <p className="text-gray-600 text-xs mt-1">Select a project manager</p>
                </div>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>

              {/* Project Info */}
              <div className="bg-orange-50 rounded-lg p-3 mb-4 border border-orange-200">
                <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">{selectedPendingProject.name}</h4>
                <div className="space-y-0.5 text-xs text-gray-600">
                  <div><span className="font-medium">Client:</span> {selectedPendingProject.client}</div>
                  <div><span className="font-medium">Budget:</span> {formatCurrency(selectedPendingProject.budget)}</div>
                  <div><span className="font-medium">Priority:</span> <span className="capitalize">{selectedPendingProject.priority}</span></div>
                </div>
              </div>

              {/* PM Selection Combobox */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Project Manager</label>
                <Combobox
                  options={getPMOptions()}
                  value={selectedPM}
                  onChange={(value) => setSelectedPM(value)}
                  placeholder="Choose a PM..."
                  className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Selected PM Info */}
              {selectedPM && (
                <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
                  {(() => {
                    const pm = projectManagers.find(p => p.id.toString() === selectedPM)
                    return pm ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                          {pm.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-sm">{pm.name}</div>
                          <div className="text-xs text-gray-600">Projects: {pm.projects} | Performance: {pm.performance}%</div>
                        </div>
                      </div>
                    ) : null
                  })()}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={closeModals}
                  className="px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPMAssignment}
                  disabled={!selectedPM}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign PM
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Pending Project Details Modal */}
        {showPendingDetailsModal && selectedPendingProject && (
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
                  <h3 className="text-2xl font-bold text-gray-900">Project Details</h3>
                  <p className="text-gray-600 text-sm mt-1">Complete information about the pending project</p>
                </div>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Project Overview */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 mb-6 border border-orange-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedPendingProject.name}</h4>
                    <p className="text-gray-600 font-medium mb-1">{selectedPendingProject.client}</p>
                    <p className="text-gray-500">{selectedPendingProject.clientContact}</p>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${getPriorityColor(selectedPendingProject.priority)}`}>
                    {selectedPendingProject.priority} Priority
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-sm text-blue-600 font-medium mb-1">Package</div>
                    <div className="text-sm font-bold text-blue-800">{selectedPendingProject.package}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-sm text-green-600 font-medium mb-1">Budget</div>
                    <div className="text-lg font-bold text-green-700">{formatCurrency(selectedPendingProject.budget)}</div>
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUser className="h-5 w-5 mr-2 text-blue-600" />
                  Client Information
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 font-medium mb-1">Client Name</div>
                    <div className="text-base font-semibold text-gray-900">{selectedPendingProject.client}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 font-medium mb-1">Contact Person</div>
                    <div className="text-base font-semibold text-gray-900">{selectedPendingProject.clientContact}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 font-medium mb-1">Phone Number</div>
                    <div className="text-base font-semibold text-gray-900">{selectedPendingProject.clientPhone}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 font-medium mb-1">Email Address</div>
                    <div className="text-base font-semibold text-gray-900">{selectedPendingProject.clientEmail}</div>
                  </div>
                </div>
              </div>

              {/* Project Requirements */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiTarget className="h-5 w-5 mr-2 text-purple-600" />
                  Project Requirements
                </h5>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-800 leading-relaxed">{selectedPendingProject.requirements}</div>
                </div>
              </div>

              {/* Submission Information */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiClock className="h-5 w-5 mr-2 text-orange-600" />
                  Submission Details
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 font-medium mb-1">Submitted By</div>
                    <div className="text-base font-semibold text-gray-900">{selectedPendingProject.submittedBy}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 font-medium mb-1">Submission Date</div>
                    <div className="text-base font-semibold text-gray-900">{formatDate(selectedPendingProject.submittedDate)}</div>
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
                    setShowPendingDetailsModal(false)
                    setShowPMAssignmentModal(true)
                  }}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center space-x-2"
                >
                  <FiUser className="h-4 w-4" />
                  <span>Assign PM</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Admin_project_management
