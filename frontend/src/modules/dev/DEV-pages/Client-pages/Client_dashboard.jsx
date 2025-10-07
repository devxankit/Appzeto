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
  FiMessageSquare,
  FiCheckCircle,
  FiPlusCircle,
  FiUpload,
  FiRefreshCw,
  FiVideo,
  FiSettings
} from 'react-icons/fi'

const Client_dashboard = () => {
  const [loading, setLoading] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [responseText, setResponseText] = useState('')
  const [responseType, setResponseType] = useState('approve') // approve, reject, request_changes
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showAllActivities, setShowAllActivities] = useState(false)
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
        lastUpdate: "2024-01-22",
        milestones: {
          total: 5,
          completed: 3,
          progress: 60
        }
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
        lastUpdate: "2024-01-21",
        milestones: {
          total: 4,
          completed: 1,
          progress: 25
        }
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
        lastUpdate: "2024-01-15",
        milestones: {
          total: 3,
          completed: 3,
          progress: 100
        }
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
    ],
    recentActivities: [
      {
        id: 1,
        type: "milestone_completed",
        title: "Milestone Completed",
        description: "Phase 1: Design & Planning milestone completed for E-commerce Website",
        projectName: "E-commerce Website",
        timestamp: "2024-01-22T10:30:00Z",
        user: "John Doe (PM)",
        icon: "check-circle",
        color: "text-green-600"
      },
      {
        id: 2,
        type: "task_created",
        title: "New Task Created",
        description: "Payment gateway integration task added to Mobile App Development",
        projectName: "Mobile App Development",
        timestamp: "2024-01-22T09:15:00Z",
        user: "Sarah Wilson (Developer)",
        icon: "plus-circle",
        color: "text-blue-600"
      },
      {
        id: 3,
        type: "file_uploaded",
        title: "File Uploaded",
        description: "New design mockups uploaded for client review",
        projectName: "E-commerce Website",
        timestamp: "2024-01-21T16:45:00Z",
        user: "Jane Smith (Developer)",
        icon: "upload",
        color: "text-purple-600"
      },
      {
        id: 4,
        type: "comment_added",
        title: "Comment Added",
        description: "Added feedback on database migration progress",
        projectName: "Database Migration",
        timestamp: "2024-01-21T14:20:00Z",
        user: "David Brown (PM)",
        icon: "message-circle",
        color: "text-orange-600"
      },
      {
        id: 5,
        type: "status_changed",
        title: "Status Updated",
        description: "Project status changed from 'In Progress' to 'Testing'",
        projectName: "Mobile App Development",
        timestamp: "2024-01-21T11:30:00Z",
        user: "Mike Johnson (PM)",
        icon: "refresh-cw",
        color: "text-teal-600"
      },
      {
        id: 6,
        type: "deadline_updated",
        title: "Deadline Updated",
        description: "Project deadline extended to February 15, 2024",
        projectName: "E-commerce Website",
        timestamp: "2024-01-20T15:00:00Z",
        user: "John Doe (PM)",
        icon: "calendar",
        color: "text-red-600"
      },
      {
        id: 7,
        type: "bug_fixed",
        title: "Bug Fixed",
        description: "Fixed login authentication issue in mobile app",
        projectName: "Mobile App Development",
        timestamp: "2024-01-20T13:45:00Z",
        user: "Sarah Wilson (Developer)",
        icon: "bug",
        color: "text-green-600"
      },
      {
        id: 8,
        type: "meeting_scheduled",
        title: "Meeting Scheduled",
        description: "Client review meeting scheduled for January 25, 2024",
        projectName: "E-commerce Website",
        timestamp: "2024-01-20T10:00:00Z",
        user: "John Doe (PM)",
        icon: "video",
        color: "text-indigo-600"
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
          {/* Client Banner */}
          <div className="mb-6 md:mb-8">
            <div className="w-full rounded-xl overflow-hidden shadow-sm">
              <img 
                src="/src/assets/images/client_banner.png" 
                alt="Welcome to Appzeto" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Projects Section - Single Project Card */}
          <div className="bg-white rounded-2xl md:rounded-lg p-5 md:p-6 shadow-md border border-gray-100 mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Your Projects</h2>
              <Link 
                to="/client-projects" 
                className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center"
              >
                View all <FiArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Single Project Card */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {dashboardData.recentProjects.slice(0, 1).map((project) => (
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

          {/* Desktop Layout - Two Column Grid */}
          <div className="md:grid md:grid-cols-2 md:gap-8 md:mb-8">
            {/* Project Progress Overview */}
            <div className="bg-white rounded-2xl md:rounded-lg p-5 md:p-6 shadow-md border border-gray-100 mb-6 md:mb-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Project Progress</h2>
                <FiTrendingUp className="h-5 w-5 md:h-6 md:w-6 text-teal-600" />
              </div>
              
              <div className="space-y-4 md:space-y-6">
                {/* Project 1 Progress */}
                <div>
                  <div className="flex justify-between text-sm md:text-base mb-2 md:mb-3">
                    <span className="text-gray-600">{dashboardData.recentProjects[0].name}</span>
                    <span className="text-gray-900 font-medium">{dashboardData.recentProjects[0].milestones.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                    <div 
                      className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 md:h-3 rounded-full transition-all duration-500" 
                      style={{width: `${dashboardData.recentProjects[0].milestones.progress}%`}}
                    ></div>
                  </div>
                </div>
                
                {/* Project 2 Progress */}
                <div>
                  <div className="flex justify-between text-sm md:text-base mb-2 md:mb-3">
                    <span className="text-gray-600">{dashboardData.recentProjects[1].name}</span>
                    <span className="text-gray-900 font-medium">{dashboardData.recentProjects[1].milestones.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                    <div 
                      className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 md:h-3 rounded-full transition-all duration-500" 
                      style={{width: `${dashboardData.recentProjects[1].milestones.progress}%`}}
                    ></div>
                  </div>
                </div>

                {/* Project 3 Progress */}
                <div>
                  <div className="flex justify-between text-sm md:text-base mb-2 md:mb-3">
                    <span className="text-gray-600">{dashboardData.recentProjects[2].name}</span>
                    <span className="text-gray-900 font-medium">{dashboardData.recentProjects[2].milestones.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                    <div 
                      className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 md:h-3 rounded-full transition-all duration-500" 
                      style={{width: `${dashboardData.recentProjects[2].milestones.progress}%`}}
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

          {/* Recent Activity Section */}
          <div className="bg-white rounded-2xl md:rounded-lg p-5 md:p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Recent Activity</h2>
              <div className="text-sm text-gray-500">
                {dashboardData.recentActivities.length} activities
              </div>
            </div>

            <div className="space-y-3">
              {(showAllActivities ? dashboardData.recentActivities : dashboardData.recentActivities.slice(0, 5)).map((activity, index) => {
                const getActivityIcon = (iconType) => {
                  switch (iconType) {
                    case 'check-circle': return FiCheckCircle
                    case 'plus-circle': return FiPlusCircle
                    case 'upload': return FiUpload
                    case 'message-circle': return FiMessageSquare
                    case 'refresh-cw': return FiRefreshCw
                    case 'calendar': return FiCalendar
                    case 'bug': return FiSettings
                    case 'video': return FiVideo
                    default: return FiClock
                  }
                }

                const formatTimeAgo = (timestamp) => {
                  const now = new Date()
                  const activityTime = new Date(timestamp)
                  const diffTime = now.getTime() - activityTime.getTime()
                  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
                  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

                  if (diffHours < 1) {
                    const diffMinutes = Math.floor(diffTime / (1000 * 60))
                    return diffMinutes <= 1 ? 'Just now' : `${diffMinutes}m ago`
                  } else if (diffHours < 24) {
                    return `${diffHours}h ago`
                  } else if (diffDays === 1) {
                    return 'Yesterday'
                  } else if (diffDays < 7) {
                    return `${diffDays}d ago`
                  } else {
                    return activityTime.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric'
                    })
                  }
                }

                const IconComponent = getActivityIcon(activity.icon)

                return (
                  <div key={activity.id} className="group relative bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-start space-x-4">
                      {/* Activity Icon */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.color.replace('text-', 'bg-').replace('-600', '-100')} group-hover:scale-105 transition-transform duration-200`}>
                        <IconComponent className={`w-5 h-5 ${activity.color}`} />
                      </div>

                      {/* Activity Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title and Time */}
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-sm font-semibold text-gray-900 leading-tight pr-2">
                            {activity.title}
                          </h3>
                          <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
                          {activity.description}
                        </p>

                        {/* Project and User Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-medium">
                              {activity.projectName}
                            </span>
                            <span className="text-gray-400">by</span>
                            <span className="font-medium text-gray-600">{activity.user}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Load More Button */}
            {!showAllActivities && dashboardData.recentActivities.length > 5 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAllActivities(true)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 hover:border-teal-300 transition-colors duration-200"
                >
                  Load More Activities
                  <FiArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            )}

            {/* Show Less Button */}
            {showAllActivities && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAllActivities(false)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-colors duration-200"
                >
                  Show Less
                </button>
              </div>
            )}
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
