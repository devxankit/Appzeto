import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Admin_navbar from '../admin-components/Admin_navbar'
import Admin_sidebar from '../admin-components/Admin_sidebar'
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
import Loading from '../../../components/ui/loading'

const Admin_dev_management = () => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('projects')
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

  // Mock data for statistics
  const [statistics, setStatistics] = useState({
    projects: {
      total: 45,
      active: 18,
      completed: 22,
      onHold: 3,
      overdue: 2,
      thisMonth: 8
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
  const [employees, setEmployees] = useState([])
  const [clients, setClients] = useState([])
  const [projectManagers, setProjectManagers] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
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
      setEmployees(mockEmployees)
      setClients(mockClients)
      setProjectManagers(mockPMs)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCurrentData = () => {
    switch (activeTab) {
      case 'projects': return projects
      case 'employees': return employees
      case 'clients': return clients
      case 'project-managers': return projectManagers
      default: return []
    }
  }

  const filteredData = getCurrentData().filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.client?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = selectedFilter === 'all' || item.status === selectedFilter
    
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
    setSelectedItem(null)
    setModalType('')
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
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dev Management
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
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
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { key: 'projects', label: 'Projects', icon: FiFolder },
                  { key: 'employees', label: 'Employees', icon: FiUsers },
                  { key: 'clients', label: 'Clients', icon: FiHome },
                  { key: 'project-managers', label: 'Project Managers', icon: FiUser }
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
            <div className="p-6">
              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search projects..."
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
                              <p className="text-xs text-gray-600 font-medium mb-1">{project.client}</p>
                              <p className="text-xs text-gray-400">PM: {project.pm}</p>
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
                          <div className="text-xs font-bold text-gray-800">{formatDate(client.lastActivity)}</div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
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
                          <div className="text-xs text-gray-400 font-medium">
                            ID: #{client.id}
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
              className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {modalType.charAt(0).toUpperCase() + modalType.slice(1)} Details
                </h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedItem && Object.entries(selectedItem).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-gray-900">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
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
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    setShowEditModal(true)
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Edit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Admin_dev_management
