import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  FiFolder, 
  FiUsers, 
  FiCalendar,
  FiDollarSign,
  FiPhone,
  FiMail,
  FiUser,
  FiCheckCircle,
  FiClock,
  FiPlay,
  FiPause,
  FiTarget,
  FiTrendingUp,
  FiAlertCircle,
  FiMoreVertical,
  FiSearch,
  FiFilter,
  FiArrowRight,
  FiSettings,
  FiPlus,
  FiEye,
  FiEdit
} from 'react-icons/fi'
import PM_navbar from '../../DEV-components/PM_navbar'
import PM_project_form from '../../DEV-components/PM_project_form'

const PM_new_projects = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('untouched')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showActionsMenu, setShowActionsMenu] = useState(null)
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  // Mock new projects data from sales team
  const newProjectsData = [
    {
      id: 1,
      name: 'E-commerce Platform',
      client: {
        name: 'Sarah Wilson',
        company: 'Tech Solutions Inc.',
        phone: '9845637236',
        email: 'sarah@techsolutions.com'
      },
      package: 'Premium Web + App',
      amount: 45000,
      convertedDate: '2024-01-15',
      salesRep: 'John Smith',
      description: 'Complete e-commerce platform with mobile app, payment integration, and admin dashboard.',
      requirements: [
        'Mobile responsive design',
        'Payment gateway integration',
        'Inventory management',
        'Order tracking system',
        'Admin dashboard'
      ],
       status: 'untouched',
       priority: 'high',
       estimatedDuration: '3 months',
       progress: 0,
      attachments: [
        { name: 'project-brief.pdf', size: '2.1 MB' },
        { name: 'wireframes.fig', size: '1.8 MB' }
      ]
    },
    {
      id: 2,
      name: 'Restaurant Management System',
      client: {
        name: 'Michael Chen',
        company: 'Digital Marketing Pro',
        phone: '9876543210',
        email: 'michael@digitalpro.com'
      },
      package: 'Basic Web Package',
      amount: 25000,
      convertedDate: '2024-01-12',
      salesRep: 'Jane Doe',
      description: 'Restaurant management system with online ordering, table booking, and kitchen management.',
      requirements: [
        'Online ordering system',
        'Table reservation',
        'Kitchen display system',
        'Customer management',
        'Analytics dashboard'
      ],
       status: 'untouched',
       priority: 'normal',
       estimatedDuration: '2 months',
       progress: 0,
      attachments: [
        { name: 'requirements.docx', size: '1.2 MB' }
      ]
    },
    {
      id: 3,
      name: 'Healthcare Portal',
      client: {
        name: 'Emily Rodriguez',
        company: 'E-commerce Store',
        phone: '9087654321',
        email: 'emily@ecommerce.com'
      },
      package: 'E-commerce Solution',
      amount: 35000,
      convertedDate: '2024-01-10',
      salesRep: 'Mike Johnson',
      description: 'Healthcare portal for patient management, appointment booking, and medical records.',
      requirements: [
        'Patient registration',
        'Appointment scheduling',
        'Medical records management',
        'Prescription management',
        'Telemedicine features'
      ],
       status: 'processing',
       priority: 'urgent',
       estimatedDuration: '4 months',
       progress: 0,
      attachments: [
        { name: 'healthcare-specs.pdf', size: '3.5 MB' },
        { name: 'compliance-docs.pdf', size: '2.8 MB' }
      ]
    },
    {
      id: 4,
      name: 'Fitness App',
      client: {
        name: 'James Thompson',
        company: 'Restaurant Chain',
        phone: '8765432109',
        email: 'james@restaurant.com'
      },
      package: 'Restaurant App',
      amount: 30000,
      convertedDate: '2024-01-08',
      salesRep: 'Sarah Wilson',
      description: 'Fitness tracking app with workout plans, nutrition tracking, and social features.',
      requirements: [
        'Workout tracking',
        'Nutrition logging',
        'Social features',
        'Progress analytics',
        'Personal trainer integration'
      ],
       status: 'processing',
       priority: 'high',
       estimatedDuration: '3 months',
       progress: 0,
      attachments: [
        { name: 'fitness-mockups.fig', size: '4.2 MB' }
      ]
    },
    {
      id: 5,
      name: 'Real Estate Portal',
      client: {
        name: 'Lisa Anderson',
        company: 'Fitness Center',
        phone: '7654321098',
        email: 'lisa@fitness.com'
      },
      package: 'Fitness App + Web',
      amount: 40000,
      convertedDate: '2024-01-05',
      salesRep: 'David Brown',
      description: 'Real estate portal with property listings, virtual tours, and agent management.',
      requirements: [
        'Property listings',
        'Virtual tour integration',
        'Agent profiles',
        'Search and filters',
        'Lead management'
      ],
       status: 'started',
       priority: 'normal',
       estimatedDuration: '5 months',
       progress: 35,
      attachments: [
        { name: 'real-estate-brief.pdf', size: '2.9 MB' },
        { name: 'design-guidelines.pdf', size: '1.5 MB' }
      ]
    }
  ]

  const projectStatuses = [
    { value: 'untouched', label: 'Untouched', color: 'bg-gray-100 text-gray-800', icon: FiClock },
    { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: FiSettings },
    { value: 'started', label: 'Started', color: 'bg-yellow-100 text-yellow-800', icon: FiPlay },
    { value: 'in-progress', label: 'In Progress', color: 'bg-green-100 text-green-800', icon: FiTrendingUp },
    { value: 'milestone-complete', label: 'Milestone Complete', color: 'bg-purple-100 text-purple-800', icon: FiTarget },
    { value: 'project-complete', label: 'Project Complete', color: 'bg-emerald-100 text-emerald-800', icon: FiCheckCircle },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-orange-100 text-orange-800', icon: FiPause }
  ]

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'high', label: 'High Priority' },
    { id: 'urgent', label: 'Urgent' },
    { id: 'normal', label: 'Normal Priority' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' }
  ]

  const filteredProjects = newProjectsData.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.company.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = activeTab === 'all' || project.status === activeTab
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'high' && project.priority === 'high') ||
                         (selectedFilter === 'urgent' && project.priority === 'urgent') ||
                         (selectedFilter === 'normal' && project.priority === 'normal')
    
    return matchesSearch && matchesStatus && matchesFilter
  })

  const getStatusInfo = (status) => {
    return projectStatuses.find(s => s.value === status) || projectStatuses[0]
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleEditProject = (projectId) => {
    const project = newProjectsData.find(p => p.id === projectId)
    if (project) {
      setEditingProject(project)
      setIsProjectFormOpen(true)
    }
  }

  const handleViewDetails = (projectId) => {
    console.log('Viewing project details:', projectId)
    navigate(`/pm-project/${projectId}`)
  }

  const handleCardClick = (project) => {
    if (project.status === 'started') {
      handleViewDetails(project.id)
    }
  }

  const handleProjectFormSubmit = (formData) => {
    console.log('Project form submitted:', formData)
    // Here you would typically update the project data
    setIsProjectFormOpen(false)
    setEditingProject(null)
  }

  const handleProjectFormClose = () => {
    setIsProjectFormOpen(false)
    setEditingProject(null)
  }

  // Mobile Project Card Component
  const MobileProjectCard = ({ project, ...motionProps }) => {
    const statusInfo = getStatusInfo(project.status)
    const StatusIcon = statusInfo.icon

    return (
      <motion.div 
        className={`group h-full rounded-xl border border-teal-200 hover:border-teal-300 bg-white p-4 shadow-md hover:shadow-lg transition-shadow ${project.status === 'started' ? 'cursor-pointer' : ''}`}
        onClick={() => handleCardClick(project)}
        {...motionProps}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 ring-1 ring-teal-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-teal-700">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7.5A1.5 1.5 0 014.5 6h5.379a1.5 1.5 0 011.06.44l1.621 1.62a1.5 1.5 0 001.06.44H19.5A1.5 1.5 0 0121 9v7.5A1.5 1.5 0 0119.5 18h-15A1.5 1.5 0 013 16.5V7.5z" />
              </svg>
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-black" title={project.name}>{project.name}</h3>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-black">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-teal-700">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.5 19.5a7.5 7.5 0 0115 0" />
                </svg>
                <span className="truncate">Client: {project.client.name}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        {project.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-black" title={project.description}>{project.description}</p>
        )}

        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-black">
            <span className="inline-flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-teal-700">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Progress
            </span>
            <span className="font-medium">{project.progress || 0}%</span>
          </div>
          <div className="mt-1.5 h-2 w-full rounded-full bg-teal-100">
            <div
              className="h-2 rounded-full bg-teal-500"
              style={{ width: `${Math.max(0, Math.min(100, project.progress || 0))}%` }}
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="inline-flex items-center gap-1 text-xs text-black">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-teal-700">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3M3.75 8.25h16.5M5 21h14a2 2 0 002-2V8.25H3v10.75A2 2 0 005 21z" />
            </svg>
            Due: {project.convertedDate}
          </div>
          
          {/* Conditional Button based on status */}
          {project.status === 'started' ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleViewDetails(project.id)
              }}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
              title="View Project Details"
            >
              <span>View details</span>
              <FiEye className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleEditProject(project.id)
              }}
              className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:underline"
              title="Edit Project"
            >
              <span>Edit</span>
              <FiEdit className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>
    )
  }

  // Desktop Project Card Component
  const DesktopProjectCard = ({ project, ...motionProps }) => {
    const statusInfo = getStatusInfo(project.status)
    const StatusIcon = statusInfo.icon

    return (
      <motion.div 
        className={`group h-full rounded-xl border border-teal-200 hover:border-teal-300 bg-white p-6 shadow-md hover:shadow-lg transition-shadow ${project.status === 'started' ? 'cursor-pointer' : ''}`}
        onClick={() => handleCardClick(project)}
        {...motionProps}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 ring-1 ring-teal-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-teal-700">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7.5A1.5 1.5 0 014.5 6h5.379a1.5 1.5 0 011.06.44l1.621 1.62a1.5 1.5 0 001.06.44H19.5A1.5 1.5 0 0121 9v7.5A1.5 1.5 0 0119.5 18h-15A1.5 1.5 0 013 16.5V7.5z" />
              </svg>
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-black" title={project.name}>{project.name}</h3>
              <div className="mt-1 flex items-center gap-1 text-sm text-black">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-teal-700">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.5 19.5a7.5 7.5 0 0115 0" />
                </svg>
                <span className="truncate">Client: {project.client.name}</span>
              </div>
              <div className="mt-1 text-xs text-gray-600">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                  {project.package}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        {project.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-black" title={project.description}>{project.description}</p>
        )}

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-black">
            <span className="inline-flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-teal-700">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Progress
            </span>
            <span className="font-medium">{project.progress || 0}%</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-teal-100">
            <div
              className="h-2 rounded-full bg-teal-500"
              style={{ width: `${Math.max(0, Math.min(100, project.progress || 0))}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-1 text-sm text-black">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-teal-700">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3M3.75 8.25h16.5M5 21h14a2 2 0 002-2V8.25H3v10.75A2 2 0 005 21z" />
            </svg>
            Due: {project.convertedDate}
          </div>
          
          {/* Conditional Button based on status */}
          {project.status === 'started' ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleViewDetails(project.id)
              }}
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
              title="View Project Details"
            >
              <span>View details</span>
              <FiEye className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleEditProject(project.id)
              }}
              className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:underline"
              title="Edit Project"
            >
              <span>Edit</span>
              <FiEdit className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PM_navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        
        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Simple Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="bg-teal-50 rounded-xl p-6 shadow-sm border border-teal-200/50">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-teal-900 mb-2">New Projects</h1>
                <p className="text-teal-700 text-sm">Projects from sales team ready for development</p>
              </div>
            </div>
          </motion.div>

          {/* Status Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4"
          >
             <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
               <button
                 onClick={() => setActiveTab('untouched')}
                 className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                   activeTab === 'untouched'
                     ? 'bg-teal-500 text-white shadow-sm'
                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                 }`}
               >
                 Untouched
               </button>
               <button
                 onClick={() => setActiveTab('processing')}
                 className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                   activeTab === 'processing'
                     ? 'bg-teal-500 text-white shadow-sm'
                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                 }`}
               >
                 Processing
               </button>
               <button
                 onClick={() => setActiveTab('started')}
                 className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                   activeTab === 'started'
                     ? 'bg-teal-500 text-white shadow-sm'
                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                 }`}
               >
                 Started
               </button>
             </div>
          </motion.div>

          {/* Search & Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4"
          >
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-8 pr-12 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
                  showFilters 
                    ? 'bg-teal-500 text-white shadow-md' 
                    : 'text-gray-500 hover:text-teal-600 hover:bg-teal-50 border border-teal-200'
                }`}
              >
                <FiFilter className="text-base" />
              </button>
            </div>
          </motion.div>

          {/* Filters - Conditional Display */}
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap gap-2 mb-4"
            >
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedFilter === filter.id
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </motion.div>
          )}

          {/* Results Count */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-4"
          >
            <p className="text-gray-600 text-sm">
              Showing {filteredProjects.length} of {newProjectsData.length} projects
            </p>
          </motion.div>

          {/* Mobile Projects List */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-3"
          >
             <AnimatePresence>
               {filteredProjects.map((project, index) => (
                 <MobileProjectCard 
                   key={project.id}
                   project={project}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   transition={{ duration: 0.3, delay: index * 0.05 }}
                 />
               ))}
             </AnimatePresence>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiFolder className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search criteria or filters.' : 'No projects match your current filters.'}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-8">
            
            {/* Main Content - 8 columns */}
            <div className="col-span-8 space-y-6">
              
              {/* Desktop Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <div className="bg-teal-50 rounded-xl p-8 shadow-sm border border-teal-200/50">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-teal-900 mb-2">New Projects</h1>
                    <p className="text-teal-700">Projects from sales team ready for development</p>
                  </div>
                </div>
              </motion.div>

              {/* Desktop Status Tabs */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6"
              >
                 <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                   <button
                     onClick={() => setActiveTab('untouched')}
                     className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                       activeTab === 'untouched'
                         ? 'bg-teal-500 text-white shadow-sm'
                         : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                     }`}
                   >
                     <FiClock className="h-4 w-4" />
                     <span>Untouched</span>
                   </button>
                   <button
                     onClick={() => setActiveTab('processing')}
                     className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                       activeTab === 'processing'
                         ? 'bg-teal-500 text-white shadow-sm'
                         : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                     }`}
                   >
                     <FiSettings className="h-4 w-4" />
                     <span>Processing</span>
                   </button>
                   <button
                     onClick={() => setActiveTab('started')}
                     className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                       activeTab === 'started'
                         ? 'bg-teal-500 text-white shadow-sm'
                         : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                     }`}
                   >
                     <FiPlay className="h-4 w-4" />
                     <span>Started</span>
                   </button>
                 </div>
              </motion.div>

              {/* Desktop Search & Filters */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-6"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-600 text-xl" />
                    <input
                      type="text"
                      placeholder="Search by project name, client, or company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-16 py-4 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 text-lg"
                    />
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
                        showFilters 
                          ? 'bg-teal-500 text-white shadow-md' 
                          : 'text-gray-500 hover:text-teal-600 hover:bg-teal-50 border border-teal-200'
                      }`}
                    >
                      <FiFilter className="text-lg" />
                    </button>
                  </div>
                </div>
                
                {/* Filters - Conditional Display */}
                {showFilters && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-wrap gap-2"
                  >
                    {filters.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setSelectedFilter(filter.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedFilter === filter.id
                            ? 'bg-teal-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </motion.div>

              {/* Desktop Projects Grid */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
              >
                 <AnimatePresence>
                   {filteredProjects.map((project, index) => (
                     <DesktopProjectCard 
                       key={project.id}
                       project={project}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -20 }}
                       transition={{ duration: 0.3, delay: index * 0.05 }}
                     />
                   ))}
                 </AnimatePresence>
              </motion.div>

              {/* Empty State */}
              {filteredProjects.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiFolder className="text-gray-400 text-3xl" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">No projects found</h3>
                    <p className="text-gray-600 text-lg">
                      {searchTerm ? 'Try adjusting your search criteria or filters.' : 'No projects match your current filters.'}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar - 4 columns */}
            <div className="col-span-4 space-y-6">
            
              {/* Project Status Flow */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 shadow-xl border border-teal-200/50"
              >
                <h3 className="text-lg font-bold text-teal-900 mb-4">Project Lifecycle</h3>
                
                <div className="space-y-3">
                  {projectStatuses.map((status, index) => {
                    const StatusIcon = status.icon
                    return (
                      <div key={status.value} className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status.color}`}>
                          <StatusIcon className="text-sm" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-teal-900">{status.label}</p>
                        </div>
                        {index < projectStatuses.length - 1 && (
                          <FiArrowRight className="text-teal-600 text-sm" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Stats Overview */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Project Statistics</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 text-sm font-medium">Total Projects</span>
                    <span className="text-gray-900 text-xl font-bold">{newProjectsData.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 text-sm font-medium">Untouched</span>
                    <span className="text-gray-900 text-xl font-bold">{newProjectsData.filter(p => p.status === 'untouched').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 text-sm font-medium">Processing</span>
                    <span className="text-gray-900 text-xl font-bold">{newProjectsData.filter(p => p.status === 'processing').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 text-sm font-medium">Started</span>
                    <span className="text-gray-900 text-xl font-bold">{newProjectsData.filter(p => p.status === 'started').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 text-sm font-medium">Total Value</span>
                    <span className="text-green-600 text-xl font-bold">₹{newProjectsData.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 1.0 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button className="w-full bg-teal-500 text-white font-semibold py-3 px-4 rounded-xl hover:bg-teal-600 transition-colors duration-200 flex items-center justify-center space-x-2">
                    <FiPlus className="text-lg" />
                    <span>Create Project</span>
                  </button>
                  
                  <button className="w-full bg-white text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
                    <FiUsers className="text-lg" />
                    <span>Assign Team</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
         </div>
       </main>

       {/* Project Form Dialog */}
       <PM_project_form 
         isOpen={isProjectFormOpen}
         onClose={handleProjectFormClose}
         onSubmit={handleProjectFormSubmit}
         projectData={editingProject}
       />
     </div>
   )
 }
 
 export default PM_new_projects
