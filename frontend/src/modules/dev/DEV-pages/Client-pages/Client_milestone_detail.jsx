import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Client_navbar from '../../DEV-components/Client_navbar'
import { 
  FiTarget, 
  FiCalendar, 
  FiUser, 
  FiClock,
  FiFileText,
  FiMessageSquare,
  FiPaperclip,
  FiArrowLeft,
  FiEye,
  FiDownload,
  FiUpload,
  FiPlus,
  FiX,
  FiCheckCircle,
  FiAlertTriangle,
  FiSend
} from 'react-icons/fi'

const Client_milestone_detail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState('')
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [milestoneData, setMilestoneData] = useState({
    milestone: {
      id: parseInt(id),
      title: "Phase 2: Design & Prototyping",
      description: "Create wireframes, mockups, and design system for the platform. This milestone focuses on establishing the visual foundation and user experience patterns for the entire application.",
      status: "active",
      progress: 75,
      dueDate: "2024-01-25",
      createdDate: "2024-01-01",
      assignee: { fullName: "Mike Wilson" },
      project: { name: "E-commerce Website" },
      attachments: [
        {
          id: 1,
          name: "wireframes.pdf",
          type: "pdf",
          size: "2.4 MB",
          uploadedBy: "Mike Wilson",
          uploadedDate: "2024-01-15"
        },
        {
          id: 2,
          name: "design-system.fig",
          type: "fig",
          size: "5.1 MB",
          uploadedBy: "Mike Wilson",
          uploadedDate: "2024-01-18"
        }
      ],
      comments: [
        {
          id: 1,
          message: "Initial wireframes are ready for review. Please provide feedback on the user flow.",
          user: { fullName: "Mike Wilson" },
          timestamp: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          message: "Design system components are complete. Ready for development handoff.",
          user: { fullName: "Mike Wilson" },
          timestamp: "2024-01-20T14:15:00Z"
        }
      ]
    },
    tasks: [
      {
        id: 1,
        title: "Create homepage wireframes",
        description: "Design wireframes for the main homepage layout",
        status: "completed",
        assignedTo: "Mike Wilson",
        dueDate: "2024-01-10"
      },
      {
        id: 2,
        title: "Design product catalog page",
        description: "Create wireframes for product listing and filtering",
        status: "completed",
        assignedTo: "Mike Wilson",
        dueDate: "2024-01-15"
      },
      {
        id: 3,
        title: "Develop design system",
        description: "Create reusable UI components and style guide",
        status: "in-progress",
        assignedTo: "Mike Wilson",
        dueDate: "2024-01-25"
      }
    ]
  })

  // Calculate time left until due date
  useEffect(() => {
    if (!milestoneData?.milestone?.dueDate) return
    
    const calculateTimeLeft = () => {
      const now = new Date()
      const dueDate = new Date(milestoneData.milestone.dueDate)
      const difference = dueDate.getTime() - now.getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h`)
        } else if (hours > 0) {
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          setTimeLeft(`${hours}h ${minutes}m`)
        } else {
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          setTimeLeft(`${minutes}m left`)
        }
      } else {
        const overdueDays = Math.floor(Math.abs(difference) / (1000 * 60 * 60 * 24))
        const overdueHours = Math.floor((Math.abs(difference) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        
        if (overdueDays > 0) {
          setTimeLeft(`${overdueDays}d overdue`)
        } else {
          setTimeLeft(`${overdueHours}h overdue`)
        }
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 60000)
    return () => clearInterval(interval)
  }, [milestoneData?.milestone?.dueDate])

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'active': return 'bg-teal-100 text-teal-800 border-teal-200'
      case 'in-progress': return 'bg-teal-100 text-teal-800 border-teal-200'
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'on-hold': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatStatus = (status) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'active': return 'In Progress'
      case 'in-progress': return 'In Progress'
      case 'planning': return 'Planning'
      case 'on-hold': return 'On Hold'
      case 'cancelled': return 'Cancelled'
      case 'pending': return 'Pending'
      default: return status
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return FiCheckCircle
      case 'active': return FiClock
      case 'in-progress': return FiClock
      case 'planning': return FiAlertTriangle
      case 'pending': return FiAlertTriangle
      default: return FiAlertTriangle
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄'
      case 'docx': return '📝'
      case 'fig': return '🎨'
      case 'png': return '🖼️'
      case 'jpg': return '🖼️'
      case 'jpeg': return '🖼️'
      case 'zip': return '📦'
      default: return '📎'
    }
  }

  const getCountdownColor = () => {
    const now = new Date()
    const dueDate = new Date(milestoneData.milestone.dueDate)
    const difference = dueDate.getTime() - now.getTime()
    const daysLeft = Math.floor(difference / (1000 * 60 * 60 * 24))

    if (difference < 0) {
      return 'text-red-600'
    } else if (daysLeft <= 1) {
      return 'text-orange-600'
    } else if (daysLeft <= 3) {
      return 'text-yellow-600'
    } else {
      return 'text-teal-600'
    }
  }

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return
    
    // Simulate API call
    const newCommentObj = {
      id: Date.now(),
      message: newComment.trim(),
      user: { fullName: "Client" },
      timestamp: new Date().toISOString()
    }
    
    setMilestoneData(prevData => ({
      ...prevData,
      milestone: {
        ...prevData.milestone,
        comments: [...(prevData.milestone.comments || []), newCommentObj]
      }
    }))
    
    setNewComment('')
  }

  const StatusIcon = getStatusIcon(milestoneData.milestone.status)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
      <Client_navbar />
      
      <main className="pt-16 lg:pt-16 pb-16 lg:pb-8">
        <div className="px-4 md:max-w-4xl md:mx-auto md:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <FiArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Project</span>
            </button>
          </div>

          {/* Milestone Header */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100 mb-4 sm:mb-6">
            {/* Mobile Layout */}
            <div className="sm:hidden">
              <div className="flex items-start space-x-3 mb-4">
                <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0">
                  <FiTarget className="h-5 w-5 text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-bold text-gray-900 leading-tight mb-2">{milestoneData.milestone.title}</h1>
                  <div className="flex items-center space-x-2 mb-3">
                    <StatusIcon className="h-4 w-4" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(milestoneData.milestone.status)}`}>
                      {formatStatus(milestoneData.milestone.status)}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{milestoneData.milestone.description}</p>
              
              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-bold text-gray-900">{milestoneData.milestone.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${milestoneData.milestone.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Time Left */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500">Due Date</div>
                    <div className="text-sm font-medium text-gray-900">{formatDate(milestoneData.milestone.dueDate)}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${getCountdownColor()}`}>
                      {timeLeft}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:block">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-teal-100 rounded-xl">
                      <FiTarget className="h-6 w-6 text-teal-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">{milestoneData.milestone.title}</h1>
                    <div className="flex items-center space-x-2">
                      <StatusIcon className="h-4 w-4" />
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(milestoneData.milestone.status)}`}>
                        {formatStatus(milestoneData.milestone.status)}
                      </span>
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">{milestoneData.milestone.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-500">{milestoneData.milestone.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${milestoneData.milestone.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestone Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FiCalendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Due Date</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(milestoneData.milestone.dueDate)}</p>
                  <p className={`text-xs font-semibold ${getCountdownColor()}`}>{timeLeft}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FiUser className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Assigned To</p>
                  <p className="text-sm font-medium text-gray-900">{milestoneData.milestone.assignee?.fullName || 'Unassigned'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FiFileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Project</p>
                  <p className="text-sm font-medium text-gray-900">{milestoneData.milestone.project?.name || 'Unknown Project'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FiClock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(milestoneData.milestone.createdDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100 mb-4 sm:mb-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="p-2 bg-teal-100 rounded-lg">
                <FiCheckCircle className="h-5 w-5 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Milestone Tasks</h3>
            </div>

            <div className="space-y-3">
              {milestoneData.tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="group bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200 hover:border-teal-200 hover:bg-teal-50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                      task.status === 'completed' 
                        ? 'bg-teal-500 border-teal-500' 
                        : 'border-gray-300 group-hover:border-teal-500'
                    }`}>
                      {task.status === 'completed' && (
                        <FiCheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1 sm:mb-2">
                        <h4 className={`text-sm sm:text-base font-semibold transition-colors duration-200 ${
                          task.status === 'completed' 
                            ? 'text-gray-500 line-through' 
                            : 'text-gray-900 group-hover:text-teal-600'
                        }`}>
                          {task.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${
                          task.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : task.status === 'in-progress'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {formatStatus(task.status)}
                        </span>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">{task.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <FiUser className="h-3 w-3" />
                          <span>{task.assignedTo}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiCalendar className="h-3 w-3" />
                          <span>{new Date(task.dueDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attachments Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100 mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <FiPaperclip className="h-5 w-5 text-teal-600" />
                </div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
                  <span className="text-sm text-gray-500">({milestoneData.milestone.attachments?.length || 0})</span>
                </div>
              </div>
            </div>

            {/* Existing Attachments */}
            {milestoneData.milestone.attachments && milestoneData.milestone.attachments.length > 0 ? (
              <div className="space-y-3">
                {milestoneData.milestone.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg border border-gray-200">
                        <span className="text-lg">{getFileIcon(attachment.type)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                        <p className="text-xs text-gray-500">{attachment.size}</p>
                        <p className="text-xs text-gray-400">by {attachment.uploadedBy} • {formatDate(attachment.uploadedDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button className="p-2 text-gray-400 hover:text-teal-600 hover:bg-white rounded-lg transition-colors" title="Preview">
                        <FiEye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-teal-600 hover:bg-white rounded-lg transition-colors" title="Download">
                        <FiDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiPaperclip className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">No attachments yet</p>
                <p className="text-sm text-gray-400">Team members will upload files here</p>
              </div>
            )}
          </div>

          {/* Comments Section */}
          {milestoneData.milestone.comments && milestoneData.milestone.comments.length > 0 && (
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100 mb-4 sm:mb-6">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <FiMessageSquare className="h-5 w-5 text-teal-600" />
                </div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
                  <span className="text-sm text-gray-500">({milestoneData.milestone.comments?.length || 0})</span>
                </div>
              </div>

              <div className="space-y-4">
                {(milestoneData.milestone.comments || []).map((comment) => (
                  <div key={comment.id} className="border-l-4 border-teal-200 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                          <FiUser className="h-3 w-3 text-teal-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {comment.user?.fullName || 'Unknown User'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.timestamp)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{comment.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Comment Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="p-2 bg-teal-100 rounded-lg">
                <FiMessageSquare className="h-5 w-5 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Add Comment</h3>
            </div>
            
            <div className="space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment to this milestone..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors resize-none"
              />
              
              <div className="flex justify-end">
                <button
                  onClick={handleCommentSubmit}
                  disabled={!newComment.trim()}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <FiSend className="h-4 w-4" />
                  <span>Add Comment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Client_milestone_detail
