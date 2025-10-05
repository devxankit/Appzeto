import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Client_navbar from '../../DEV-components/Client_navbar'
import { 
  FiFolder, 
  FiFileText, 
  FiCheckSquare, 
  FiClock,
  FiTrendingUp,
  FiUsers,
  FiCalendar,
  FiAlertTriangle,
  FiArrowRight,
  FiEye,
  FiX,
  FiSend,
  FiMessageSquare
} from 'react-icons/fi'

const Client_dashboard = () => {
  const [loading, setLoading] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [responseText, setResponseText] = useState('')
  const [responseType, setResponseType] = useState('approve') // approve, reject, request_changes
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [dashboardData, setDashboardData] = useState({
    statistics: {
      projects: {
        total: 3,
        active: 2,
        completed: 1,
        awaitingApproval: 0
      },
      requests: {
        total: 8,
        pendingResponse: 2,
        responded: 5,
        urgent: 1
      },
      tasks: {
        total: 45,
        completed: 32,
        awaitingClientInput: 3,
        inProgress: 10
      },
      overallProgress: 78
    },
    recentProjects: [
      {
        id: 1,
        name: "E-commerce Website",
        description: "Modern e-commerce platform with payment integration",
        status: "active",
        priority: "high",
        progress: 65,
        dueDate: "2024-02-15",
        assignedTeam: ["John Doe (PM)", "Jane Smith (Developer)"],
        totalTasks: 25,
        completedTasks: 16,
        awaitingClientFeedback: 2,
        lastUpdate: "2024-01-22"
      },
      {
        id: 2,
        name: "Mobile App Development",
        description: "Cross-platform mobile application for iOS and Android",
        status: "active",
        priority: "urgent",
        progress: 45,
        dueDate: "2024-01-30",
        assignedTeam: ["Mike Johnson (PM)", "Sarah Wilson (Developer)"],
        totalTasks: 30,
        completedTasks: 14,
        awaitingClientFeedback: 1,
        lastUpdate: "2024-01-21"
      },
      {
        id: 3,
        name: "Database Migration",
        description: "Migrate legacy database to modern cloud infrastructure",
        status: "completed",
        priority: "normal",
        progress: 100,
        dueDate: "2024-01-15",
        assignedTeam: ["David Brown (PM)"],
        totalTasks: 15,
        completedTasks: 15,
        awaitingClientFeedback: 0,
        lastUpdate: "2024-01-15"
      }
    ],
    recentRequests: [
      {
        id: 1,
        title: "Design Approval Required",
        description: "Please review and approve the new homepage design mockups",
        status: "pending",
        priority: "high",
        submittedDate: "2024-01-20",
        submittedBy: "John Doe (PM)",
        type: "approval"
      },
      {
        id: 2,
        title: "Content Review Needed",
        description: "Please provide feedback on the product descriptions",
        status: "pending",
        priority: "normal",
        submittedDate: "2024-01-18",
        submittedBy: "Jane Smith (Developer)",
        type: "feedback"
      },
      {
        id: 3,
        title: "Feature Requirements Confirmation",
        description: "Please confirm the payment gateway integration requirements",
        status: "responded",
        priority: "urgent",
        submittedDate: "2024-01-15",
        submittedBy: "Mike Johnson (PM)",
        type: "confirmation"
      }
    ]
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'active': return 'bg-teal-100 text-teal-800 border-teal-200'
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'on-hold': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-red-100 text-red-800'
      case 'normal': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatStatus = (status) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'active': return 'In Progress'
      case 'planning': return 'Planning'
      case 'on-hold': return 'On Hold'
      case 'cancelled': return 'Cancelled'
      default: return status
    }
  }

  const formatPriority = (priority) => {
    switch (priority) {
      case 'urgent': return 'Urgent'
      case 'high': return 'High'
      case 'normal': return 'Medium'
      case 'low': return 'Low'
      default: return priority
    }
  }

  const handleRequestClick = (request) => {
    if (request.status === 'pending') {
      setSelectedRequest(request)
      setIsDialogOpen(true)
      setResponseText('')
      setResponseType('approve')
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedRequest(null)
    setResponseText('')
    setResponseType('approve')
    setShowConfirmation(false)
  }

  const handleSubmitResponse = () => {
    if (responseType !== 'approve' && !responseText.trim()) return
    setShowConfirmation(true)
  }

  const handleConfirmResponse = async () => {
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Response submitted:', {
        requestId: selectedRequest.id,
        responseType,
        responseText,
        timestamp: new Date().toISOString()
      })
      
      // Update the request status in the dashboard data
      setDashboardData(prevData => ({
        ...prevData,
        recentRequests: prevData.recentRequests.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: 'responded' }
            : req
        ),
        statistics: {
          ...prevData.statistics,
          requests: {
            ...prevData.statistics.requests,
            pendingResponse: prevData.statistics.requests.pendingResponse - 1,
            responded: prevData.statistics.requests.responded + 1
          }
        }
      }))
      
      setIsSubmitting(false)
      handleCloseDialog()
      
      // Show success message (you could add a toast notification here)
      console.log('Request status updated to responded')
    }, 1000)
  }

  const handleCancelConfirmation = () => {
    setShowConfirmation(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
      <Client_navbar />
      
      {/* Main Content */}
      <main className="pt-16 lg:pt-16 pb-16 lg:pb-8">
        <div className="px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-6 md:mb-8">
            <div className="mb-4 md:mb-6">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                Welcome back, Client!
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">Monitor your project progress and respond to team requests</p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            {/* Active Projects */}
            <div className="w-full bg-white rounded-2xl md:rounded-lg p-4 md:p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="p-2 md:p-3 bg-teal-100 rounded-xl md:rounded-lg">
                  <FiFolder className="h-5 w-5 md:h-6 md:w-6 text-teal-600" />
                </div>
                <span className="text-xs md:text-sm text-gray-500">Active</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{dashboardData.statistics.projects.active}</p>
              <p className="text-xs md:text-sm text-gray-600">Projects</p>
            </div>

            {/* Awaiting Your Response */}
            <div className="w-full bg-white rounded-2xl md:rounded-lg p-4 md:p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="p-2 md:p-3 bg-orange-100 rounded-xl md:rounded-lg">
                  <FiClock className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
                </div>
                <span className="text-xs md:text-sm text-gray-500">Awaiting</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{dashboardData.statistics.requests.pendingResponse}</p>
              <p className="text-xs md:text-sm text-gray-600">Your Response</p>
            </div>

            {/* Tasks Awaiting Input */}
            <div className="w-full bg-white rounded-2xl md:rounded-lg p-4 md:p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="p-2 md:p-3 bg-yellow-100 rounded-xl md:rounded-lg">
                  <FiAlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" />
                </div>
                <span className="text-xs md:text-sm text-gray-500">Need Input</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{dashboardData.statistics.tasks.awaitingClientInput}</p>
              <p className="text-xs md:text-sm text-gray-600">Tasks</p>
            </div>

            {/* Overall Progress */}
            <div className="w-full bg-white rounded-2xl md:rounded-lg p-4 md:p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="p-2 md:p-3 bg-blue-100 rounded-xl md:rounded-lg">
                  <FiTrendingUp className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
                <span className="text-xs md:text-sm text-gray-500">Progress</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{dashboardData.statistics.overallProgress}%</p>
              <p className="text-xs md:text-sm text-gray-600">Overall</p>
            </div>
          </div>

          {/* Desktop Layout - Two Column Grid */}
          <div className="md:grid md:grid-cols-2 md:gap-8 md:mb-8">
            {/* Progress Overview */}
            <div className="bg-white rounded-2xl md:rounded-lg p-5 md:p-6 shadow-md border border-gray-100 mb-6 md:mb-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Overall Progress</h2>
                <FiTrendingUp className="h-5 w-5 md:h-6 md:w-6 text-teal-600" />
              </div>
              
              {/* Overall Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="text-gray-900 font-medium">{dashboardData.statistics.overallProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${dashboardData.statistics.overallProgress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-4 md:space-y-6">
                {/* Projects Progress */}
                <div>
                  <div className="flex justify-between text-sm md:text-base mb-2 md:mb-3">
                    <span className="text-gray-600">Completed Projects</span>
                    <span className="text-gray-900 font-medium">{dashboardData.statistics.projects.completed}/{dashboardData.statistics.projects.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                    <div 
                      className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 md:h-3 rounded-full transition-all duration-500" 
                      style={{width: `${(dashboardData.statistics.projects.completed / dashboardData.statistics.projects.total) * 100}%`}}
                    ></div>
                  </div>
                </div>
                
                {/* Tasks Progress */}
                <div>
                  <div className="flex justify-between text-sm md:text-base mb-2 md:mb-3">
                    <span className="text-gray-600">Completed Tasks</span>
                    <span className="text-gray-900 font-medium">{dashboardData.statistics.tasks.completed}/{dashboardData.statistics.tasks.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                    <div 
                      className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 md:h-3 rounded-full transition-all duration-500" 
                      style={{width: `${(dashboardData.statistics.tasks.completed / dashboardData.statistics.tasks.total) * 100}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Requests */}
            <div className="bg-white rounded-2xl md:rounded-lg p-5 md:p-6 shadow-md border border-gray-100 mb-6 md:mb-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Team Requests</h2>
                <Link 
                  to="/client-requests" 
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center"
                >
                  View all <FiArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              
              <div className="space-y-3">
                {dashboardData.recentRequests.map((request) => (
                  <div 
                    key={request.id} 
                    onClick={() => handleRequestClick(request)}
                    className={`group relative bg-white rounded-lg p-4 border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-200 ${
                      request.status === 'pending' ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                          request.type === 'approval' ? 'bg-blue-100' :
                          request.type === 'feedback' ? 'bg-purple-100' :
                          'bg-green-100'
                        }`}>
                          {request.type === 'approval' && <FiFileText className="w-3.5 h-3.5 text-blue-600" />}
                          {request.type === 'feedback' && <FiUsers className="w-3.5 h-3.5 text-purple-600" />}
                          {request.type === 'confirmation' && <FiCheckSquare className="w-3.5 h-3.5 text-green-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-teal-700 transition-colors duration-200 truncate">
                            {request.title}
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 flex-shrink-0 ml-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          request.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          request.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          request.priority === 'normal' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {formatPriority(request.priority)}
                        </span>
                        {request.status === 'pending' && (
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                      {request.description}
                    </p>

                    {/* Footer Row */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        From: <span className="font-medium text-gray-700">{request.submittedBy}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          request.status === 'pending' 
                            ? 'bg-amber-50 text-amber-700' 
                            : 'bg-green-50 text-green-700'
                        }`}>
                          {request.status === 'pending' ? 'Pending' : 'Responded'}
                        </span>
                        <div className="text-xs text-gray-500 font-medium">
                          {(() => {
                            const now = new Date()
                            const submittedDate = new Date(request.submittedDate)
                            const diffTime = now.getTime() - submittedDate.getTime()
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                            
                            if (diffDays === 0) return 'Today'
                            if (diffDays === 1) return 'Yesterday'
                            if (diffDays < 7) return `${diffDays}d ago`
                            return new Date(request.submittedDate).toLocaleDateString('en-US', { 
                              day: 'numeric',
                              month: 'short'
                            })
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="bg-white rounded-2xl md:rounded-lg p-5 md:p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Your Projects</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{dashboardData.statistics.projects.total} projects</span>
                <Link 
                  to="/client-projects" 
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center"
                >
                  View all <FiArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Project Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {dashboardData.recentProjects.map((project) => (
                <Link 
                  key={project.id} 
                  to={`/client-project-detail/${project.id}`}
                  className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl border border-gray-100 hover:border-teal-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                >
                  {/* Mobile Layout */}
                  <div className="sm:hidden">
                    {/* Header */}
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="p-2 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg group-hover:from-teal-200 group-hover:to-teal-300 transition-all duration-300 flex-shrink-0">
                        <FiFolder className="h-4 w-4 text-teal-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 leading-tight group-hover:text-teal-600 transition-colors duration-300 mb-2">
                          {project.name}
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                            {formatPriority(project.priority)}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                            {formatStatus(project.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-700">Progress</span>
                        <span className="text-xs font-bold text-gray-900">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-teal-500 to-teal-600 h-1.5 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Task Stats */}
                    <div className="grid grid-cols-3 gap-1.5 mb-3">
                      <div className="bg-gray-50 rounded-md p-2 text-center">
                        <div className="text-xs font-bold text-gray-900">{project.totalTasks}</div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                      <div className="bg-green-50 rounded-md p-2 text-center">
                        <div className="text-xs font-bold text-green-600">{project.completedTasks}</div>
                        <div className="text-xs text-gray-500">Done</div>
                      </div>
                      <div className="bg-orange-50 rounded-md p-2 text-center">
                        <div className="text-xs font-bold text-orange-600">{project.awaitingClientFeedback}</div>
                        <div className="text-xs text-gray-500">Awaiting</div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 text-gray-500">
                          <FiUsers className="h-3 w-3" />
                          <span className="text-xs font-medium">{project.assignedTeam.length}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <FiCalendar className="h-3 w-3" />
                          <span className="text-xs font-medium">
                            {new Date(project.dueDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-gray-700">
                          {(() => {
                            const now = new Date()
                            const dueDate = new Date(project.dueDate)
                            const diffTime = dueDate.getTime() - now.getTime()
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                            
                            if (diffDays < 0) {
                              return `${Math.abs(diffDays)}d overdue`
                            } else if (diffDays === 0) {
                              return 'Today'
                            } else if (diffDays === 1) {
                              return 'Tomorrow'
                            } else {
                              return `${diffDays}d left`
                            }
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:block">
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="p-2.5 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl group-hover:from-teal-200 group-hover:to-teal-300 transition-all duration-300">
                          <FiFolder className="h-5 w-5 text-teal-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-gray-900 leading-tight group-hover:text-teal-600 transition-colors duration-300 mb-2">
                            {project.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                              {formatPriority(project.priority)}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                              {formatStatus(project.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Progress Section */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-bold text-gray-900">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Task Counts */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-sm font-bold text-gray-900">{project.totalTasks}</div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <div className="text-sm font-bold text-green-600">{project.completedTasks}</div>
                        <div className="text-xs text-gray-500">Done</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3 text-center">
                        <div className="text-sm font-bold text-orange-600">{project.awaitingClientFeedback}</div>
                        <div className="text-xs text-gray-500">Awaiting</div>
                      </div>
                    </div>

                    {/* Footer Section */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-gray-500">
                          <FiUsers className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">{project.assignedTeam.length}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <FiCalendar className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">
                            {new Date(project.dueDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-gray-700">
                          {(() => {
                            const now = new Date()
                            const dueDate = new Date(project.dueDate)
                            const diffTime = dueDate.getTime() - now.getTime()
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                            
                            if (diffDays < 0) {
                              return `${Math.abs(diffDays)}d overdue`
                            } else if (diffDays === 0) {
                              return 'Today'
                            } else if (diffDays === 1) {
                              return 'Tomorrow'
                            } else {
                              return `${diffDays}d left`
                            }
                          })()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Updated: {new Date(project.lastUpdate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Response Dialog */}
      <AnimatePresence>
        {isDialogOpen && selectedRequest && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col"
            >
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  selectedRequest.type === 'approval' ? 'bg-blue-100' :
                  selectedRequest.type === 'feedback' ? 'bg-purple-100' :
                  'bg-green-100'
                }`}>
                  {selectedRequest.type === 'approval' && <FiFileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
                  {selectedRequest.type === 'feedback' && <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />}
                  {selectedRequest.type === 'confirmation' && <FiCheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{selectedRequest.title}</h2>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">From: {selectedRequest.submittedBy}</p>
                </div>
              </div>
              <button
                onClick={handleCloseDialog}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Dialog Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {!showConfirmation ? (
                // Response Form
                <div className="space-y-4 sm:space-y-6">
                  {/* Request Description */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Request Details</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedRequest.description}</p>
                  </div>

                  {/* Response Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">Response Type</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                      <button
                        onClick={() => setResponseType('approve')}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          responseType === 'approve'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-green-300 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <FiCheckSquare className="w-4 h-4" />
                          <span className="text-sm font-medium">Approve</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setResponseType('reject')}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          responseType === 'reject'
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-red-300 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <FiX className="w-4 h-4" />
                          <span className="text-sm font-medium">Reject</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setResponseType('request_changes')}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          responseType === 'request_changes'
                            ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                            : 'border-gray-200 hover:border-yellow-300 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <FiMessageSquare className="w-4 h-4" />
                          <span className="text-sm font-medium">Request Changes</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Response Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Your Response {responseType === 'approve' ? '(Optional)' : '(Required)'}
                    </label>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder={
                        responseType === 'approve' ? 'Add any additional comments...' :
                        responseType === 'reject' ? 'Please explain why you are rejecting this request...' :
                        'Please specify what changes you would like...'
                      }
                      className="w-full h-24 sm:h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                      required={responseType !== 'approve'}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {responseType === 'approve' ? 'Optional feedback for the team' : 'This field is required'}
                    </p>
                  </div>
                </div>
              ) : (
                // Confirmation View
                <div className="space-y-4 sm:space-y-6">
                  {/* Confirmation Header */}
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                      responseType === 'approve' ? 'bg-green-100' :
                      responseType === 'reject' ? 'bg-red-100' :
                      'bg-yellow-100'
                    }`}>
                      {responseType === 'approve' && <FiCheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />}
                      {responseType === 'reject' && <FiX className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />}
                      {responseType === 'request_changes' && <FiMessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Confirm Your Response</h3>
                      <p className="text-sm text-gray-500">Please review your response before submitting</p>
                    </div>
                  </div>

                  {/* Request Summary */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Request</h4>
                    <p className="text-sm text-gray-600">{selectedRequest.title}</p>
                  </div>

                  {/* Response Summary */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Your Response</h4>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        responseType === 'approve' ? 'bg-green-100 text-green-700' :
                        responseType === 'reject' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {responseType === 'approve' ? 'Approve' :
                         responseType === 'reject' ? 'Reject' :
                         'Request Changes'}
                      </span>
                    </div>
                    {responseText && (
                      <p className="text-sm text-gray-600 mt-2">{responseText}</p>
                    )}
                  </div>

                  {/* Warning Note */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Once submitted, this response cannot be undone. The team will be notified immediately.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <div className="flex items-center justify-end space-x-2 sm:space-x-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <button
                onClick={showConfirmation ? handleCancelConfirmation : handleCloseDialog}
                className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                {showConfirmation ? 'Back' : 'Cancel'}
              </button>
              <button
                onClick={showConfirmation ? handleConfirmResponse : handleSubmitResponse}
                disabled={isSubmitting || (!showConfirmation && responseType !== 'approve' && !responseText.trim())}
                className={`px-3 sm:px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                  isSubmitting || (!showConfirmation && responseType !== 'approve' && !responseText.trim())
                    ? 'bg-gray-400 cursor-not-allowed'
                    : responseType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : responseType === 'reject'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Submitting...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    <span>
                      {showConfirmation ? 'Confirm & Submit' :
                       responseType === 'approve' ? 'Approve Request' :
                       responseType === 'reject' ? 'Reject Request' :
                       'Request Changes'}
                    </span>
                  </>
                )}
              </button>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Client_dashboard
