import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Client_navbar from '../../DEV-components/Client_navbar'
import { 
  FiFolder, 
  FiCheckSquare, 
  FiClock,
  FiTrendingUp,
  FiUsers,
  FiCalendar,
  FiArrowLeft,
  FiTarget,
  FiFileText,
  FiUser,
  FiBarChart,
  FiLock,
  FiEdit3,
  FiSend,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiCreditCard,
  FiDollarSign,
  FiFile,
  FiDownload,
  FiPlus,
  FiMinus
} from 'react-icons/fi'

const Client_project_detail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [timeLeft, setTimeLeft] = useState('')
  const [loading, setLoading] = useState(false)
  const [showModificationDialog, setShowModificationDialog] = useState(false)
  const [selectedMilestone, setSelectedMilestone] = useState(null)
  const [modificationRequest, setModificationRequest] = useState('')
  const [isSubmittingModification, setIsSubmittingModification] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Mock project data - in real app, this would come from API
  const [projectData] = useState({
    project: {
      id: parseInt(id),
      name: "E-commerce Website",
      description: "Modern e-commerce platform with payment integration and mobile responsiveness. This project includes a comprehensive online store with advanced features like inventory management, order tracking, and customer analytics.",
      status: "active",
      priority: "high",
      progress: 65,
      dueDate: "2024-02-15",
      startDate: "2024-01-01",
      assignedTeam: [
        { name: "John Doe", role: "Project Manager" },
        { name: "Jane Smith", role: "Frontend Developer" },
        { name: "Mike Wilson", role: "UI/UX Designer" },
        { name: "Sarah Johnson", role: "Backend Developer" }
      ],
      totalTasks: 25,
      completedTasks: 16,
      awaitingClientFeedback: 2,
      lastUpdate: "2024-01-22",
      // Payment Information
      totalCost: 150000, // Total project cost in rupees
      paidAmount: 45000, // Amount already paid
      remainingAmount: 105000, // Remaining amount to pay
      nextPaymentDue: 30000, // Next payment amount based on progress
      paymentSchedule: [
        { milestone: "Project Setup & Planning", amount: 15000, status: "paid", date: "2024-01-08" },
        { milestone: "UI/UX Design Phase", amount: 30000, status: "paid", date: "2024-01-18" },
        { milestone: "Frontend Development", amount: 45000, status: "due", dueDate: "2024-02-05" },
        { milestone: "Backend Integration", amount: 30000, status: "pending", dueDate: "2024-02-10" },
        { milestone: "Testing & Deployment", amount: 30000, status: "pending", dueDate: "2024-02-15" }
      ]
    },
    milestones: [
      {
        id: 1,
        title: "Project Setup & Planning",
        description: "Initial project setup, requirements gathering, and team coordination",
        status: "completed",
        progress: 100,
        dueDate: "2024-01-10",
        completedDate: "2024-01-08",
        sequence: 1,
        isLocked: false,
        isClickable: false
      },
      {
        id: 2,
        title: "UI/UX Design Phase",
        description: "Create wireframes, mockups, and design system for the platform",
        status: "completed",
        progress: 100,
        dueDate: "2024-01-20",
        completedDate: "2024-01-18",
        sequence: 2,
        isLocked: false,
        isClickable: false
      },
      {
        id: 3,
        title: "Frontend Development",
        description: "Develop responsive user interface and client-side functionality",
        status: "active",
        progress: 75,
        dueDate: "2024-02-05",
        sequence: 3,
        isLocked: false,
        isClickable: true
      },
      {
        id: 4,
        title: "Backend Integration",
        description: "API development, database setup, and server-side logic",
        status: "planning",
        progress: 0,
        dueDate: "2024-02-10",
        sequence: 4,
        isLocked: true,
        isClickable: false
      },
      {
        id: 5,
        title: "Testing & Deployment",
        description: "Quality assurance, bug fixes, and production deployment",
        status: "planning",
        progress: 0,
        dueDate: "2024-02-15",
        sequence: 5,
        isLocked: true,
        isClickable: false
      }
    ],
    tasks: [
      {
        id: 1,
        title: "Design Homepage Layout",
        description: "Create responsive homepage with hero section and product showcase",
        status: "completed",
        priority: "high",
        assignedTo: "Mike Wilson",
        dueDate: "2024-01-15",
        completedDate: "2024-01-14"
      },
      {
        id: 2,
        title: "Implement User Authentication",
        description: "Set up login, registration, and password reset functionality",
        status: "completed",
        priority: "high",
        assignedTo: "Jane Smith",
        dueDate: "2024-01-18",
        completedDate: "2024-01-17"
      },
      {
        id: 3,
        title: "Product Catalog Page",
        description: "Develop product listing page with filtering and search",
        status: "in-progress",
        priority: "normal",
        assignedTo: "Jane Smith",
        dueDate: "2024-01-25"
      },
      {
        id: 4,
        title: "Shopping Cart Implementation",
        description: "Create cart functionality with add/remove items and quantity updates",
        status: "in-progress",
        priority: "high",
        assignedTo: "Sarah Johnson",
        dueDate: "2024-01-28"
      },
      {
        id: 5,
        title: "Payment Gateway Integration",
        description: "Integrate Stripe payment processing for secure transactions",
        status: "pending",
        priority: "urgent",
        assignedTo: "Sarah Johnson",
        dueDate: "2024-02-01"
      },
      {
        id: 6,
        title: "Admin Dashboard",
        description: "Build admin panel for inventory and order management",
        status: "pending",
        priority: "normal",
        assignedTo: "John Doe",
        dueDate: "2024-02-05"
      }
    ],
    // Payment Transaction History
    paymentHistory: [
      {
        id: 1,
        amount: 15000,
        milestone: "Project Setup & Planning",
        date: "2024-01-08",
        method: "UPI",
        status: "completed",
        transactionId: "TXN001234567"
      },
      {
        id: 2,
        amount: 30000,
        milestone: "UI/UX Design Phase",
        date: "2024-01-18",
        method: "Bank Transfer",
        status: "completed",
        transactionId: "TXN001234568"
      }
    ]
  })

  // Countdown logic
  useEffect(() => {
    if (!projectData?.project?.dueDate) return
    
    const calculateTimeLeft = () => {
      const now = new Date()
      const dueDate = new Date(projectData.project.dueDate)
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
  }, [projectData?.project?.dueDate])

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'active': return 'bg-teal-100 text-teal-800 border-teal-200'
      case 'in-progress': return 'bg-teal-100 text-teal-800 border-teal-200'
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'on-hold': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'normal': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatStatus = (status) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'active': return 'In Progress'
      case 'in-progress': return 'In Progress'
      case 'planning': return 'Planning'
      case 'pending': return 'Pending'
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

  const getCountdownColor = () => {
    const now = new Date()
    const dueDate = new Date(projectData.project.dueDate)
    const difference = dueDate.getTime() - now.getTime()
    const daysLeft = Math.floor(difference / (1000 * 60 * 60 * 24))

    if (difference < 0) {
      return 'text-red-600'
    } else if (daysLeft <= 1) {
      return 'text-orange-600'
    } else if (daysLeft <= 3) {
      return 'text-yellow-600'
    } else {
      return 'text-blue-600'
    }
  }

  const getMilestoneStatusColor = (milestone) => {
    if (milestone.isLocked) {
      return 'bg-gray-100 text-gray-500 border-gray-200'
    }
    switch (milestone.status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'active': return 'bg-teal-100 text-teal-800 border-teal-200'
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getMilestoneCardStyle = (milestone) => {
    if (milestone.isLocked) {
      return 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
    }
    if (milestone.status === 'completed') {
      return 'bg-green-50 border-green-200 hover:bg-green-100 cursor-pointer'
    }
    if (milestone.status === 'active') {
      return 'bg-teal-50 border-teal-200 hover:bg-teal-100 cursor-pointer'
    }
    return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100 cursor-pointer'
  }

  const handleMilestoneClick = (milestone) => {
    if (milestone.isLocked) {
      return // Do nothing for locked milestones
    }
    
    if (milestone.status === 'completed') {
      // Show modification dialog for completed milestones
      setSelectedMilestone(milestone)
      setShowModificationDialog(true)
    } else if (milestone.isClickable) {
      // Navigate to milestone detail for active milestones
      navigate(`/client-milestone-detail/${milestone.id}`)
    }
  }

  const handleModificationSubmit = async () => {
    if (!modificationRequest.trim()) return
    
    setIsSubmittingModification(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmittingModification(false)
      setShowModificationDialog(false)
      setModificationRequest('')
      setSelectedMilestone(null)
      // Here you would typically show a success message
      alert('Modification request sent to Project Manager!')
    }, 1000)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200'
      case 'due': return 'bg-red-100 text-red-800 border-red-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handlePaymentSubmit = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) return
    
    setIsProcessingPayment(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false)
      setShowPaymentDialog(false)
      setPaymentAmount('')
      // Here you would typically show a success message
      alert(`Payment of ${formatCurrency(paymentAmount)} processed successfully!`)
    }, 2000)
  }

  const renderOverview = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Project Stats */}
      <div className="space-y-3 sm:space-y-4">
        {/* Progress Card */}
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-teal-200">
          {/* Mobile Layout */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-teal-200 rounded-lg">
                  <FiTrendingUp className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Progress</h3>
                  <p className="text-xs text-gray-600">Overall status</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-teal-600">{projectData.project.progress}%</div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Project Progress</span>
                <span className="text-gray-900 font-medium">{projectData.project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${projectData.project.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:block">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-teal-200 rounded-xl">
                  <FiTrendingUp className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Project Progress</h3>
                  <p className="text-sm text-gray-600">Overall completion status</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-teal-600">{projectData.project.progress}%</div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Project Progress</span>
                <span className="text-gray-900 font-medium">{projectData.project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${projectData.project.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg sm:rounded-xl">
                <FiCheckSquare className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">{projectData.project.totalTasks}</div>
                <div className="text-xs text-gray-500">Total Tasks</div>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              {projectData.project.completedTasks} completed
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg sm:rounded-xl">
                <FiUsers className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">{projectData.project.assignedTeam.length}</div>
                <div className="text-xs text-gray-500">Team Members</div>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              Active contributors
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm border border-gray-100 col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg sm:rounded-xl">
                  <FiCalendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm sm:text-lg font-semibold text-gray-900">Timeline</div>
                  <div className="text-xs sm:text-sm text-gray-600">Project deadline</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm sm:text-base font-bold ${getCountdownColor()}`}>
                  {timeLeft}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(projectData.project.dueDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Information */}
      <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-teal-200 shadow-sm">
        <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
          <div className="p-1.5 sm:p-2 bg-teal-200 rounded-lg sm:rounded-xl">
            <FiFileText className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">Project Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-teal-100">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                <FiCalendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Start Date</p>
                <p className="text-xs sm:text-sm font-bold text-gray-900">
                  {new Date(projectData.project.startDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-teal-100">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg">
                <FiClock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Due Date</p>
                <p className="text-xs sm:text-sm font-bold text-gray-900">
                  {new Date(projectData.project.dueDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMilestones = () => (
    <div className="relative">
      {/* Milestone Flow Container */}
      <div className="space-y-4">
        {projectData.milestones.map((milestone, index) => (
          <div key={milestone.id} className="relative">
            {/* Connection Line */}
            {index < projectData.milestones.length - 1 && (
              <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-300 z-0"></div>
            )}
            
            {/* Milestone Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleMilestoneClick(milestone)}
              className={`relative z-10 group rounded-xl p-4 border-2 transition-all duration-300 ${getMilestoneCardStyle(milestone)} ${
                milestone.isClickable ? 'hover:shadow-lg hover:scale-105' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* Milestone Number & Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    milestone.isLocked 
                      ? 'bg-gray-200 border-gray-300' 
                      : milestone.status === 'completed'
                      ? 'bg-green-500 border-green-600'
                      : milestone.status === 'active'
                      ? 'bg-teal-500 border-teal-600'
                      : 'bg-yellow-500 border-yellow-600'
                  }`}>
                    {milestone.isLocked ? (
                      <FiLock className="h-5 w-5 text-gray-500" />
                    ) : milestone.status === 'completed' ? (
                      <FiCheckCircle className="h-6 w-6 text-white" />
                    ) : (
                      <span className="text-white font-bold text-sm">{milestone.sequence}</span>
                    )}
                  </div>
                </div>

                {/* Milestone Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-sm font-semibold truncate ${
                      milestone.isLocked ? 'text-gray-500' : 'text-gray-900'
                    }`}>
                      {milestone.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getMilestoneStatusColor(milestone)}`}>
                      {milestone.isLocked ? 'Locked' : formatStatus(milestone.status)}
                    </span>
                  </div>
                  
                  <p className={`text-xs mb-3 line-clamp-2 ${
                    milestone.isLocked ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {milestone.description}
                  </p>

                  {/* Progress Bar */}
                  {!milestone.isLocked && (
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-900 font-semibold">{milestone.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            milestone.status === 'completed' 
                              ? 'bg-green-500' 
                              : milestone.status === 'active'
                              ? 'bg-teal-500'
                              : 'bg-yellow-500'
                          }`}
                          style={{ width: `${milestone.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Footer Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <FiCalendar className="h-3 w-3" />
                      <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                    </div>
                    {milestone.status === 'completed' && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <FiEdit3 className="h-3 w-3" />
                        <span>Click to modify</span>
                      </div>
                    )}
                    {milestone.status === 'active' && (
                      <div className="flex items-center space-x-1 text-teal-600">
                        <FiTarget className="h-3 w-3" />
                        <span>In Progress</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Hover Effects */}
              {milestone.isClickable && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Modification Dialog */}
      <AnimatePresence>
        {showModificationDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModificationDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FiEdit3 className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Request Modification</h3>
                    <p className="text-sm text-gray-600">Milestone: {selectedMilestone?.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModificationDialog(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <FiAlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800 font-medium">Modification Request</span>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">
                    This milestone has been completed and approved. Any changes will require additional cost and time.
                  </p>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe the changes you need:
                </label>
                <textarea
                  value={modificationRequest}
                  onChange={(e) => setModificationRequest(e.target.value)}
                  placeholder="Please describe the specific changes you need for this milestone..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-colors resize-none"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowModificationDialog(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModificationSubmit}
                  disabled={!modificationRequest.trim() || isSubmittingModification}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmittingModification ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="h-4 w-4" />
                      <span>Send Request</span>
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

  const renderPayment = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Payment Overview - Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-4 sm:p-6 border border-teal-200 shadow-lg"
      >
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-teal-200 rounded-lg">
            <FiCreditCard className="h-4 w-4 text-teal-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Payment Overview</h3>
            <p className="text-xs sm:text-sm text-teal-700">Project Financial Summary</p>
          </div>
        </div>

        {/* Payment Cards Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {/* Total Cost */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 sm:p-3 border border-blue-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-700 font-medium">Total Cost</span>
              <span className="text-blue-600 font-bold text-sm">₹</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-gray-900">{formatCurrency(projectData.project.totalCost)}</p>
            <p className="text-xs text-gray-500 mt-1">Project Budget</p>
          </motion.div>

          {/* Paid Amount */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2 sm:p-3 border border-green-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-700 font-medium">Paid Amount</span>
              <FiCheckCircle className="h-3 w-3 text-green-600" />
            </div>
            <p className="text-sm sm:text-base font-bold text-gray-900">{formatCurrency(projectData.project.paidAmount)}</p>
            <div className="flex items-center mt-1">
              <FiCheckCircle className="h-2 w-2 text-green-500 mr-1" />
              <p className="text-xs text-green-600">Paid</p>
            </div>
          </motion.div>

          {/* Remaining Amount */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-2 sm:p-3 border border-orange-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-700 font-medium">Remaining</span>
              <FiClock className="h-3 w-3 text-orange-600" />
            </div>
            <p className="text-sm sm:text-base font-bold text-gray-900">{formatCurrency(projectData.project.remainingAmount)}</p>
            <p className="text-xs text-gray-500 mt-1">Outstanding Balance</p>
          </motion.div>

          {/* Next Payment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-2 sm:p-3 border border-purple-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-700 font-medium">Next Due</span>
              <FiCreditCard className="h-3 w-3 text-purple-600" />
            </div>
            <p className="text-sm sm:text-base font-bold text-gray-900">{formatCurrency(projectData.project.nextPaymentDue)}</p>
            <p className="text-xs text-gray-500 mt-1">Upcoming Payment</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Payment Progress */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-teal-100 rounded-lg">
            <FiTrendingUp className="h-4 w-4 text-teal-600" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Payment Progress</h3>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Payment Progress</span>
            <span className="text-teal-600 font-semibold">
              {Math.round((projectData.project.paidAmount / projectData.project.totalCost) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(projectData.project.paidAmount / projectData.project.totalCost) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="text-xs text-gray-600">
          {formatCurrency(projectData.project.paidAmount)} paid out of {formatCurrency(projectData.project.totalCost)} total
        </div>
      </div>

      {/* Payment Schedule */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-teal-100 rounded-lg">
            <FiFile className="h-4 w-4 text-teal-600" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Payment Schedule</h3>
        </div>
        
        <div className="space-y-3">
          {projectData.project.paymentSchedule.map((payment, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-teal-300 transition-all duration-200">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">{payment.milestone}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(payment.status)}`}>
                    {payment.status === 'paid' ? 'Paid' : payment.status === 'due' ? 'Due' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{formatCurrency(payment.amount)}</span>
                  <span>{payment.date ? new Date(payment.date).toLocaleDateString() : `Due: ${new Date(payment.dueDate).toLocaleDateString()}`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <FiFile className="h-4 w-4 text-teal-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Transaction History</h3>
          </div>
          <button className="flex items-center space-x-1 px-3 py-1.5 text-teal-600 hover:text-teal-700 transition-colors text-sm bg-teal-100 hover:bg-teal-200 rounded-lg">
            <FiDownload className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {projectData.paymentHistory.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-teal-300 transition-all duration-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <FiCheckCircle className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{transaction.milestone}</h4>
                  <p className="text-xs text-gray-600">{transaction.method} • {transaction.transactionId}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{formatCurrency(transaction.amount)}</div>
                <div className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Dialog */}
      <AnimatePresence>
        {showPaymentDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPaymentDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <FiCreditCard className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Make Payment</h3>
                    <p className="text-sm text-gray-600">Pay for project progress</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPaymentDialog(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <FiDollarSign className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-800 font-medium">Payment Information</span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    Next payment due: {formatCurrency(projectData.project.nextPaymentDue)}
                  </p>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount to pay"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition-colors"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPaymentDialog(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  disabled={!paymentAmount || parseFloat(paymentAmount) <= 0 || isProcessingPayment}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FiCreditCard className="h-4 w-4" />
                      <span>Pay Now</span>
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

  const renderTasks = () => (
    <div className="space-y-2 sm:space-y-3">
      {projectData.tasks.map((task) => (
        <div 
          key={task.id} 
          className="group bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all duration-200"
        >
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
              task.status === 'completed' 
                ? 'bg-teal-500 border-teal-500' 
                : 'border-gray-300 group-hover:border-teal-500'
            }`}>
              {task.status === 'completed' && (
                <FiCheckSquare className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1 sm:mb-2">
                <h3 className={`text-sm sm:text-base font-semibold transition-colors duration-200 ${
                  task.status === 'completed' 
                    ? 'text-gray-500 line-through' 
                    : 'text-gray-900 group-hover:text-teal-600'
                }`}>
                  {task.title}
                </h3>
                <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${
                  task.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : task.status === 'in-progress'
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {formatStatus(task.status)}
                </span>
              </div>
              
              <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">{task.description}</p>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <FiUser className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="truncate">{task.assignedTo}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiCalendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>{new Date(task.dueDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {formatPriority(task.priority)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview()
      case 'milestones': return renderMilestones()
      case 'payment': return renderPayment()
      case 'tasks': return renderTasks()
      default: return renderOverview()
    }
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: FiBarChart },
    { key: 'milestones', label: 'Milestones', icon: FiTarget },
    { key: 'payment', label: 'Payment', icon: FiCreditCard },
    { key: 'tasks', label: 'Tasks', icon: FiCheckSquare }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
      <Client_navbar />
      
      <main className="pt-16 lg:pt-16 pb-16 lg:pb-8">
        <div className="px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/client-projects')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <FiArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Projects</span>
            </button>
          </div>

          {/* Project Header */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 mb-4 sm:mb-6">
            {/* Mobile Layout */}
            <div className="md:hidden">
              <div className="mb-4">
                <h1 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{projectData.project.name}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(projectData.project.status)}`}>
                    {formatStatus(projectData.project.status)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(projectData.project.priority)}`}>
                    {formatPriority(projectData.project.priority)}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-sm font-semibold ${getCountdownColor()}`}>
                        {timeLeft}
                      </div>
                      <div className="text-xs text-gray-500">
                        Due: {new Date(projectData.project.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Progress</div>
                      <div className="text-sm font-bold text-gray-900">{projectData.project.progress}%</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 leading-relaxed">{projectData.project.description}</p>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{projectData.project.name}</h1>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(projectData.project.status)}`}>
                        {formatStatus(projectData.project.status)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPriorityColor(projectData.project.priority)}`}>
                        {formatPriority(projectData.project.priority)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className={`text-base font-semibold ${getCountdownColor()}`}>
                    {timeLeft}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Due: {new Date(projectData.project.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-lg text-gray-600 leading-relaxed">{projectData.project.description}</p>
              </div>
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden mb-6">
            <div className="grid grid-cols-2 gap-3">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <motion.button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    animate={{
                      boxShadow: activeTab === tab.key 
                        ? "0 8px 25px rgba(20, 184, 166, 0.3)" 
                        : "0 2px 8px rgba(0, 0, 0, 0.1)"
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 30,
                      duration: 0.2 
                    }}
                    className={`relative p-4 rounded-xl border-2 overflow-hidden ${
                      activeTab === tab.key
                        ? 'bg-teal-500 text-white border-teal-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-teal-200'
                    }`}
                  >
                    {/* Animated background gradient for active state */}
                    {activeTab === tab.key && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-br from-teal-400 to-teal-600"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center space-y-2">
                      <motion.div
                        animate={{
                          scale: activeTab === tab.key ? 1.1 : 1,
                          rotate: activeTab === tab.key ? 5 : 0
                        }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 25 
                        }}
                      >
                        <IconComponent className={`h-5 w-5 ${
                          activeTab === tab.key 
                            ? 'text-white' 
                            : 'text-gray-600'
                        }`} />
                      </motion.div>
                      
                      <motion.span
                        animate={{
                          y: activeTab === tab.key ? -2 : 0
                        }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 30 
                        }}
                        className={`text-sm font-medium ${
                          activeTab === tab.key 
                            ? 'text-white' 
                            : 'text-gray-700'
                        }`}
                      >
                        {tab.label}
                      </motion.span>
                    </div>
                    
                    {/* Subtle border glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-transparent"
                      animate={{
                        borderColor: activeTab === tab.key 
                          ? "rgba(255, 255, 255, 0.3)" 
                          : "transparent"
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:block mb-8">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                      activeTab === tab.key
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Client_project_detail
