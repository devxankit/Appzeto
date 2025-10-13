import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Admin_navbar from '../admin-components/Admin_navbar'
import Admin_sidebar from '../admin-components/Admin_sidebar'
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
  Shield,
  Code,
  TrendingUp,
  Home,
  User,
  MoreVertical,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  RefreshCw,
  Upload,
  FileText
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Combobox } from '../../../components/ui/combobox'
import Loading from '../../../components/ui/loading'

const Admin_user_management = () => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('project-managers')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    team: '',
    department: '',
    status: 'active',
    dateOfBirth: '',
    joiningDate: '',
    document: null,
    password: '',
    confirmPassword: ''
  })

  // Mock statistics data
  const [statistics, setStatistics] = useState({
    total: 187,
    projectManagers: 12,
    employees: 68,
    clients: 107,
    developers: 45,
    salesTeam: 23,
    active: 175,
    inactive: 12
  })

  // Mock users data
  const [users, setUsers] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock users data with Indian context
      const mockUsers = [
        // Project Managers
        {
          id: 1,
          name: "Priya Sharma",
          email: "priya.sharma@appzeto.com",
          phone: "+91 98765 43210",
          role: "project-manager",
          team: null,
          status: "active",
          joinDate: "2023-02-01",
          lastActive: "2024-01-22",
          projects: 8,
          avatar: "PS"
        },
        {
          id: 2,
          name: "Rajesh Kumar",
          email: "rajesh.kumar@appzeto.com",
          phone: "+91 87654 32109",
          role: "project-manager",
          team: null,
          status: "active",
          joinDate: "2023-03-15",
          lastActive: "2024-01-22",
          projects: 6,
          avatar: "RK"
        },
        {
          id: 3,
          name: "Anita Singh",
          email: "anita.singh@appzeto.com",
          phone: "+91 76543 21098",
          role: "project-manager",
          team: null,
          status: "active",
          joinDate: "2023-04-10",
          lastActive: "2024-01-21",
          projects: 7,
          avatar: "AS"
        },
        {
          id: 4,
          name: "Vikram Patel",
          email: "vikram.patel@appzeto.com",
          phone: "+91 65432 10987",
          role: "project-manager",
          team: null,
          status: "inactive",
          joinDate: "2023-01-20",
          lastActive: "2024-01-15",
          projects: 5,
          avatar: "VP"
        },

        // Developers
        {
          id: 5,
          name: "Arjun Mehta",
          email: "arjun.mehta@appzeto.com",
          phone: "+91 54321 09876",
          role: "employee",
          team: "developer",
          department: "full-stack",
          status: "active",
          joinDate: "2023-05-15",
          lastActive: "2024-01-22",
          projects: 4,
          avatar: "AM"
        },
        {
          id: 6,
          name: "Sneha Reddy",
          email: "sneha.reddy@appzeto.com",
          phone: "+91 43210 98765",
          role: "employee",
          team: "developer",
          department: "nodejs",
          status: "active",
          joinDate: "2023-06-01",
          lastActive: "2024-01-22",
          projects: 3,
          avatar: "SR"
        },
        {
          id: 7,
          name: "Kiran Joshi",
          email: "kiran.joshi@appzeto.com",
          phone: "+91 32109 87654",
          role: "employee",
          team: "developer",
          department: "web",
          status: "active",
          joinDate: "2023-07-10",
          lastActive: "2024-01-21",
          projects: 5,
          avatar: "KJ"
        },
        {
          id: 8,
          name: "Rohit Gupta",
          email: "rohit.gupta@appzeto.com",
          phone: "+91 21098 76543",
          role: "employee",
          team: "developer",
          department: "app",
          status: "active",
          joinDate: "2023-08-15",
          lastActive: "2024-01-22",
          projects: 2,
          avatar: "RG"
        },
        {
          id: 9,
          name: "Deepika Agarwal",
          email: "deepika.agarwal@appzeto.com",
          phone: "+91 10987 65432",
          role: "employee",
          team: "developer",
          department: "full-stack",
          status: "inactive",
          joinDate: "2023-09-01",
          lastActive: "2024-01-10",
          projects: 3,
          avatar: "DA"
        },

        // Sales Team
        {
          id: 10,
          name: "Manish Verma",
          email: "manish.verma@appzeto.com",
          phone: "+91 98765 43211",
          role: "employee",
          team: "sales",
          department: "sales",
          status: "active",
          joinDate: "2023-03-01",
          lastActive: "2024-01-22",
          projects: 0,
          avatar: "MV"
        },
        {
          id: 11,
          name: "Pooja Nair",
          email: "pooja.nair@appzeto.com",
          phone: "+91 87654 32110",
          role: "employee",
          team: "sales",
          department: "sales",
          status: "active",
          joinDate: "2023-04-15",
          lastActive: "2024-01-22",
          projects: 0,
          avatar: "PN"
        },
        {
          id: 12,
          name: "Amit Shah",
          email: "amit.shah@appzeto.com",
          phone: "+91 76543 21099",
          role: "employee",
          team: "sales",
          department: "sales",
          status: "active",
          joinDate: "2023-05-20",
          lastActive: "2024-01-21",
          projects: 0,
          avatar: "AS"
        },
        {
          id: 13,
          name: "Kavya Iyer",
          email: "kavya.iyer@appzeto.com",
          phone: "+91 65432 10988",
          role: "employee",
          team: "sales",
          department: "sales",
          status: "active",
          joinDate: "2023-06-10",
          lastActive: "2024-01-22",
          projects: 0,
          avatar: "KI"
        },

        // Clients
        {
          id: 14,
          name: "Ravi Chandra",
          email: "ravi.chandra@techcorp.in",
          phone: "+91 54321 09877",
          role: "client",
          team: null,
          status: "active",
          joinDate: "2023-01-15",
          lastActive: "2024-01-20",
          projects: 3,
          avatar: "RC"
        },
        {
          id: 15,
          name: "Sunita Agarwal",
          email: "sunita.agarwal@startupxyz.in",
          phone: "+91 43210 98766",
          role: "client",
          team: null,
          status: "active",
          joinDate: "2023-02-01",
          lastActive: "2024-01-22",
          projects: 2,
          avatar: "SA"
        },
        {
          id: 16,
          name: "Gaurav Malhotra",
          email: "gaurav.malhotra@globalcorp.in",
          phone: "+91 32109 87655",
          role: "client",
          team: null,
          status: "active",
          joinDate: "2023-03-10",
          lastActive: "2024-01-21",
          projects: 4,
          avatar: "GM"
        },
        {
          id: 17,
          name: "Meera Desai",
          email: "meera.desai@enterprise.in",
          phone: "+91 21098 76544",
          role: "client",
          team: null,
          status: "active",
          joinDate: "2023-04-05",
          lastActive: "2024-01-19",
          projects: 1,
          avatar: "MD"
        },
        {
          id: 18,
          name: "Suresh Rao",
          email: "suresh.rao@techstart.in",
          phone: "+91 10987 65433",
          role: "client",
          team: null,
          status: "inactive",
          joinDate: "2023-05-15",
          lastActive: "2024-01-10",
          projects: 2,
          avatar: "SR"
        },
        {
          id: 19,
          name: "Neha Kapoor",
          email: "neha.kapoor@innovate.in",
          phone: "+91 98765 43212",
          role: "client",
          team: null,
          status: "active",
          joinDate: "2023-06-20",
          lastActive: "2024-01-22",
          projects: 3,
          avatar: "NK"
        },
        {
          id: 20,
          name: "Vishal Jain",
          email: "vishal.jain@digital.in",
          phone: "+91 87654 32111",
          role: "client",
          team: null,
          status: "active",
          joinDate: "2023-07-01",
          lastActive: "2024-01-21",
          projects: 2,
          avatar: "VJ"
        }
      ]

      setUsers(mockUsers)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'project-manager': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'employee': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'client': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTeamColor = (team) => {
    switch (team) {
      case 'developer': return 'bg-indigo-100 text-indigo-800'
      case 'sales': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCurrentUsers = () => {
    let filteredUsers = users

    // Filter by tab
    filteredUsers = users.filter(user => {
      switch (activeTab) {
        case 'employees':
          return user.role === 'employee'
        case 'project-managers':
          return user.role === 'project-manager'
        case 'clients':
          return user.role === 'client'
        default:
          return user.role === activeTab
      }
    })

    // Filter by department (only for employees)
    if (activeTab === 'employees' && selectedDepartment !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.department === selectedDepartment)
    }

    // Filter by search term
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      )
    }

    // Filter by status
    if (selectedFilter !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === selectedFilter)
    }

    return filteredUsers
  }

  const handleCreateUser = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      team: '',
      department: '',
      status: 'active',
      dateOfBirth: '',
      joiningDate: '',
      document: null,
      password: '',
      confirmPassword: ''
    })
    setShowCreateModal(true)
  }

  const handleEditUser = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      team: user.team || '',
      department: user.department || '',
      status: user.status,
      dateOfBirth: user.dateOfBirth || '',
      joiningDate: user.joiningDate || user.joinDate || '',
      document: user.document || null,
      password: '',
      confirmPassword: ''
    })
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setShowViewModal(true)
  }

  const handleDeleteUser = (user) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const handleSaveUser = () => {
    // Validation
    if (showCreateModal && (!formData.password || !formData.confirmPassword)) {
      alert('Please fill in both password fields')
      return
    }
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    
    if (formData.password && formData.password.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }

    // Validation for department field when role is employee and team is developer
    if (formData.role === 'employee' && formData.team === 'developer' && !formData.department) {
      alert('Please select a department for developer employees')
      return
    }

    // Validation for required date fields
    if (!formData.dateOfBirth) {
      alert('Please select date of birth')
      return
    }

    if (!formData.joiningDate) {
      alert('Please select joining date')
      return
    }

    // Validation for document field
    if (!formData.document) {
      alert('Please upload a document')
      return
    }

    // Simulate API call
    console.log('Saving user:', formData)
    setShowCreateModal(false)
    setShowEditModal(false)
    setSelectedUser(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      team: '',
      department: '',
      status: 'active',
      dateOfBirth: '',
      joiningDate: '',
      document: null,
      password: '',
      confirmPassword: ''
    })
  }

  const confirmDelete = () => {
    // Simulate API call
    console.log('Deleting user:', selectedUser)
    setShowDeleteModal(false)
    setSelectedUser(null)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowViewModal(false)
    setShowDeleteModal(false)
    setSelectedUser(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      team: '',
      department: '',
      status: 'active',
      dateOfBirth: '',
      joiningDate: '',
      document: null,
      password: '',
      confirmPassword: ''
    })
  }

  // Reset department filter when switching tabs
  useEffect(() => {
    if (activeTab !== 'employees') {
      setSelectedDepartment('all')
    }
  }, [activeTab])

  const tabs = [
    { key: 'project-managers', label: 'Project Managers', icon: Shield, count: 4 },
    { key: 'employees', label: 'Employees', icon: Code, count: 9 },
    { key: 'clients', label: 'Clients', icon: Home, count: 7 }
  ]

  // Combobox options
  const roleOptions = [
    { value: 'project-manager', label: 'Project Manager', icon: Shield },
    { value: 'employee', label: 'Employee', icon: Code },
    { value: 'client', label: 'Client', icon: Home }
  ]

  const teamOptions = [
    { value: 'developer', label: 'Developer', icon: Code },
    { value: 'sales', label: 'Sales Team', icon: TrendingUp }
  ]

  const departmentOptions = [
    { value: 'full-stack', label: 'Full Stack', icon: Code },
    { value: 'nodejs', label: 'Node.js', icon: Code },
    { value: 'web', label: 'Web', icon: Code },
    { value: 'app', label: 'App', icon: Code }
  ]

  const salesDepartmentOptions = [
    { value: 'sales', label: 'Sales', icon: TrendingUp }
  ]

  const statusOptions = [
    { value: 'active', label: 'Active', icon: CheckCircle },
    { value: 'inactive', label: 'Inactive', icon: AlertCircle }
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
                User Management
              </h1>
              <p className="text-gray-600">
                Manage all users, roles, and permissions across the platform.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={loadData}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                onClick={handleCreateUser}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>

          {/* Statistics Cards - Row 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {/* Total Users */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-blue-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-blue-700">+12.5%</p>
                    <p className="text-xs text-blue-600">this month</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-700 mb-1">Total Users</p>
                  <p className="text-lg font-bold text-blue-800">{statistics.total}</p>
                </div>
              </div>
            </div>

            {/* Project Managers */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-violet-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-purple-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-violet-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Shield className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-purple-700">+8.2%</p>
                    <p className="text-xs text-purple-600">this month</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-purple-700 mb-1">Project Managers</p>
                  <p className="text-lg font-bold text-purple-800">{statistics.projectManagers}</p>
                </div>
              </div>
            </div>

            {/* Employees */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-emerald-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Code className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-emerald-700">+15.3%</p>
                    <p className="text-xs text-emerald-600">this month</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-emerald-700 mb-1">Employees</p>
                  <p className="text-lg font-bold text-emerald-800">{statistics.employees}</p>
                </div>
              </div>
            </div>

            {/* Clients */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-amber-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-orange-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-orange-400/20 to-amber-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Home className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-orange-700">+22.1%</p>
                    <p className="text-xs text-orange-600">this month</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-orange-700 mb-1">Clients</p>
                  <p className="text-lg font-bold text-orange-800">{statistics.clients}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Statistics Cards - Row 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {/* Developers */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-blue-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-indigo-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-indigo-400/20 to-blue-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <Code className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-indigo-700">+18.7%</p>
                    <p className="text-xs text-indigo-600">this month</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-indigo-700 mb-1">Developers</p>
                  <p className="text-lg font-bold text-indigo-800">{statistics.developers}</p>
                </div>
              </div>
            </div>

            {/* Sales Team */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-50 to-pink-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-rose-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-rose-400/20 to-pink-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-rose-500/10">
                    <TrendingUp className="h-4 w-4 text-rose-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-rose-700">+25.4%</p>
                    <p className="text-xs text-rose-600">this month</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-rose-700 mb-1">Sales Team</p>
                  <p className="text-lg font-bold text-rose-800">{statistics.salesTeam}</p>
                </div>
              </div>
            </div>

            {/* Active Users */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-50 to-cyan-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-teal-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-teal-500/10">
                    <CheckCircle className="h-4 w-4 text-teal-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-teal-700">+5.2%</p>
                    <p className="text-xs text-teal-600">this month</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-teal-700 mb-1">Active Users</p>
                  <p className="text-lg font-bold text-teal-800">{statistics.active}</p>
                </div>
              </div>
            </div>

            {/* Inactive Users */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-slate-100 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200/50">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-gray-400/20 to-slate-500/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-gray-500/10">
                    <AlertCircle className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-700">-2.1%</p>
                    <p className="text-xs text-gray-600">this month</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Inactive Users</p>
                  <p className="text-lg font-bold text-gray-800">{statistics.inactive}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Card */}
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  User Management
                </CardTitle>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search users..."
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
                  {activeTab === 'employees' && (
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Departments</option>
                      <option value="full-stack">Full Stack</option>
                      <option value="nodejs">Node.js</option>
                      <option value="web">Web</option>
                      <option value="app">App</option>
                      <option value="sales">Sales</option>
                    </select>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
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
                        <Icon className="h-4 w-4" />
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

              {/* Users List */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {getCurrentUsers().map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200 group"
                    >
                      {/* Header */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                            {user.avatar}
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleViewUser(user)}
                              className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-all duration-200"
                            >
                              <Eye className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-gray-400 hover:text-green-600 p-1 rounded hover:bg-green-50 transition-all duration-200"
                            >
                              <Edit3 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-all duration-200"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-1">{user.name}</h3>
                          <p className="text-xs text-gray-600 truncate">{user.email}</p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center space-x-1 mb-2">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600 truncate">{user.phone}</span>
                      </div>

                      {/* Role and Team Badges */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full border ${getRoleColor(user.role)}`}>
                          {user.role === 'project-manager' ? 'PM' : 
                           user.role === 'employee' ? 'Emp' : 'Client'}
                        </span>
                        {user.team && (
                          <span className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full ${getTeamColor(user.team)}`}>
                            {user.team === 'developer' ? 'Dev' : 'Sales'}
                          </span>
                        )}
                        {user.department && user.role === 'employee' && (
                          <span className="inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full bg-cyan-100 text-cyan-800">
                            {user.department === 'full-stack' ? 'Full Stack' : 
                             user.department === 'nodejs' ? 'Node.js' :
                             user.department === 'web' ? 'Web' :
                             user.department === 'app' ? 'App' : 'Sales'}
                          </span>
                        )}
                        <span className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(user.status)}`}>
                          {user.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      {/* Bottom Info */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{formatDate(user.joinDate)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {getCurrentUsers().length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Create/Edit User Modal */}
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
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[95vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {showCreateModal ? 'Create New User' : 'Edit User'}
                    </h3>
                    <p className="text-blue-100">
                      {showCreateModal 
                        ? 'Fill in the user details below. Fields marked with * are required.'
                        : 'Update the user details below. Fields marked with * are required.'
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

              <form onSubmit={(e) => { e.preventDefault(); handleSaveUser(); }} className="p-6 space-y-6 max-h-[calc(95vh-140px)] overflow-y-auto">
                {/* Name Field */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    Full Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    placeholder="Enter full name"
                  />
                </motion.div>

                {/* Email Field */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    Email Address <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    placeholder="Enter email address"
                  />
                </motion.div>

                {/* Phone Field */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    Phone Number <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    placeholder="+91 98765 43210"
                  />
                </motion.div>

                {/* Role and Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      Role <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Combobox
                      options={roleOptions}
                      value={formData.role}
                      onChange={(value) => setFormData({...formData, role: value, team: ''})}
                      placeholder="Select role"
                      className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </motion.div>

                  {formData.role === 'employee' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-semibold text-gray-700 flex items-center">
                        Team <span className="text-red-500 ml-1">*</span>
                      </label>
                      <Combobox
                        options={teamOptions}
                        value={formData.team}
                        onChange={(value) => setFormData({...formData, team: value, department: ''})}
                        placeholder="Select team"
                        className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Department Field - Only for Developer Employees */}
                {formData.role === 'employee' && formData.team === 'developer' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      Department <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Combobox
                      options={departmentOptions}
                      value={formData.department}
                      onChange={(value) => setFormData({...formData, department: value})}
                      placeholder="Select department"
                      className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </motion.div>
                )}

                {/* Department Field - Only for Sales Employees */}
                {formData.role === 'employee' && formData.team === 'sales' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      Department <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Combobox
                      options={salesDepartmentOptions}
                      value={formData.department}
                      onChange={(value) => setFormData({...formData, department: value})}
                      placeholder="Select department"
                      className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </motion.div>
                )}

                {/* Date Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      Date of Birth <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      Joining Date <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                      className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </motion.div>
                </div>

                {/* Document Upload Field */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    Document <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => setFormData({...formData, document: e.target.files[0]})}
                      className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Upload className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  {formData.document && (
                    <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg border border-green-200">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">{formData.document.name}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max 10MB)</p>
                </motion.div>

                {/* Status Field */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <Combobox
                    options={statusOptions}
                    value={formData.status}
                    onChange={(value) => setFormData({...formData, status: value})}
                    placeholder="Select status"
                    className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </motion.div>

                {/* Password Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      Password <span className="text-red-500 ml-1">{showCreateModal ? '*' : ''}</span>
                      {!showCreateModal && <span className="text-gray-500 ml-2 text-xs">(Leave blank to keep current)</span>}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder={showCreateModal ? "Enter password" : "Enter new password"}
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      Confirm Password <span className="text-red-500 ml-1">{showCreateModal ? '*' : ''}</span>
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full h-12 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="Confirm password"
                    />
                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-xs text-red-600 flex items-center"
                      >
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Passwords do not match
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                {/* Form Actions */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModals}
                    className="flex-1 h-12 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {showCreateModal ? 'Create User' : 'Update User'}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* View User Modal */}
        {showViewModal && selectedUser && (
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
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">User Details</h3>
                    <p className="text-indigo-100">View and manage user information</p>
                  </div>
                  <button
                    onClick={closeModals}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
                {/* User Avatar and Basic Info */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                    {selectedUser.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{selectedUser.name}</h4>
                    <p className="text-gray-600 mb-2">{selectedUser.email}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getRoleColor(selectedUser.role)}`}>
                        {selectedUser.role === 'project-manager' ? 'Project Manager' : 
                         selectedUser.role === 'employee' ? 'Employee' : 'Client'}
                      </span>
                      {selectedUser.team && (
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getTeamColor(selectedUser.team)}`}>
                          {selectedUser.team === 'developer' ? 'Developer' : 'Sales Team'}
                        </span>
                      )}
                      {selectedUser.department && selectedUser.role === 'employee' && (
                        <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-cyan-100 text-cyan-800">
                          {selectedUser.department === 'full-stack' ? 'Full Stack' : 
                           selectedUser.department === 'nodejs' ? 'Node.js' :
                           selectedUser.department === 'web' ? 'Web' :
                           selectedUser.department === 'app' ? 'App' : 'Sales'}
                        </span>
                      )}
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Contact Information */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <h5 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-blue-600" />
                    Contact Information
                  </h5>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Phone Number</p>
                        <p className="text-gray-900">{selectedUser.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Joined Date</p>
                        <p className="text-gray-900">{formatDate(selectedUser.joinDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Last Active</p>
                        <p className="text-gray-900">{formatDate(selectedUser.lastActive)}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200"
                >
                  <Button
                    variant="outline"
                    onClick={closeModals}
                    className="flex-1 h-12 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setShowViewModal(false)
                      handleEditUser(selectedUser)
                    }}
                    className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Edit User
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedUser && (
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
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white rounded-t-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Trash2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Delete User</h3>
                    <p className="text-red-100 text-sm">This action cannot be undone</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {selectedUser.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{selectedUser.name}</p>
                      <p className="text-sm text-gray-600">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-800 mb-1">Warning</p>
                        <p className="text-sm text-amber-700">
                          Are you sure you want to delete <strong>{selectedUser.name}</strong>? This will permanently remove the user and all associated data from the system.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-3 pt-6"
                >
                  <Button
                    variant="outline"
                    onClick={closeModals}
                    className="flex-1 h-12 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmDelete}
                    className="flex-1 h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Delete User
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Admin_user_management
