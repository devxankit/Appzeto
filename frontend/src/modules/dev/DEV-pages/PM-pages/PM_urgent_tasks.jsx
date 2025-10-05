import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PM_navbar from '../../DEV-components/PM_navbar'
import PM_urgent_task_form from '../../DEV-components/PM_urgent_task_form'
import { CheckSquare, Plus, Search, Filter, Calendar, User, MoreVertical, Loader2, AlertTriangle, Clock, Zap } from 'lucide-react'

const PM_urgent_tasks = () => {
  const [filter, setFilter] = useState('all')
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Mock urgent tasks data - replace with API later
  const mockUrgentTasks = [
    {
      _id: 'ut-001',
      title: 'Fix Critical Security Vulnerability',
      description: 'Immediate patch required for authentication bypass issue.',
      status: 'In Progress',
      priority: 'Urgent',
      project: { _id: 'p-001', name: 'Security Update' },
      milestone: { _id: 'm-001', name: 'M1 - Critical Fixes' },
      assignedTo: [{ _id: 'u-001', fullName: 'John Doe' }],
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      isUrgent: true
    },
    {
      _id: 'ut-002',
      title: 'Server Downtime Resolution',
      description: 'Production server is down, affecting all users.',
      status: 'Pending',
      priority: 'Urgent',
      project: { _id: 'p-002', name: 'Infrastructure' },
      milestone: { _id: 'm-010', name: 'M1 - Emergency' },
      assignedTo: [{ _id: 'u-002', fullName: 'Jane Smith' }],
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
      isUrgent: true
    },
    {
      _id: 'ut-003',
      title: 'Client Data Recovery',
      description: 'Critical client data needs immediate recovery from backup.',
      status: 'Completed',
      priority: 'Urgent',
      project: { _id: 'p-003', name: 'Data Recovery' },
      milestone: { _id: 'm-020', name: 'M1 - Recovery' },
      assignedTo: [{ _id: 'u-003', fullName: 'Mike Johnson' }],
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      isUrgent: true
    },
    {
      _id: 'ut-004',
      title: 'Payment Gateway Integration Fix',
      description: 'Payment processing is failing for all transactions.',
      status: 'In Progress',
      priority: 'Urgent',
      project: { _id: 'p-004', name: 'E-commerce Platform' },
      milestone: { _id: 'm-030', name: 'M1 - Payment Fix' },
      assignedTo: [{ _id: 'u-004', fullName: 'Sarah Wilson' }],
      dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours
      isUrgent: true
    }
  ]

  useEffect(() => {
    loadUrgentTasks()
  }, [])

  const loadUrgentTasks = async () => {
    try {
      setIsLoading(true)
      await new Promise(r => setTimeout(r, 600))
      setTasks(mockUrgentTasks)
    } catch (error) {
      console.error('Error loading urgent tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTaskSubmit = () => {
    loadUrgentTasks()
    setIsTaskFormOpen(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'In Progress': return 'bg-red-100 text-red-800 border-red-200'
      case 'Pending': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(task => {
    const taskStatus = (task.status || '').toLowerCase()
    return taskStatus === filter.toLowerCase()
  })

  const getTimeRemaining = (dueDate) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffMs = due.getTime() - now.getTime()
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60))
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffMs < 0) return { text: `${Math.abs(diffDays)}d overdue`, color: 'text-red-600' }
    if (diffHours <= 1) return { text: '1h left', color: 'text-red-600' }
    if (diffHours <= 4) return { text: `${diffHours}h left`, color: 'text-orange-600' }
    if (diffHours <= 24) return { text: `${diffHours}h left`, color: 'text-yellow-600' }
    return { text: `${diffDays}d left`, color: 'text-green-600' }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PM_navbar />
      
      <main className="pt-16 pb-24 md:pt-20 md:pb-8">
        <div className="px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
          {/* Mobile Layout - Creative Tile with Button */}
          <div className="md:hidden mb-6">
            <div className="bg-white rounded-2xl p-6 border border-red-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                    Urgent Tasks
                  </h2>
                  <p className="text-sm text-gray-600">Critical tasks need immediate attention</p>
                </div>
                <button 
                  onClick={() => setIsTaskFormOpen(true)}
                  className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="font-medium text-sm">Add Urgent</span>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Search className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Search</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Filter className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Filter</span>
                </button>
              </div>
              <div className="bg-white rounded-xl p-4 border border-red-200">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center mb-1">
                      <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                      Urgent Tasks Priority
                    </h3>
                    <p className="text-xs text-gray-600">Add critical tasks that need immediate attention</p>
                  </div>
                  <button 
                    onClick={() => setIsTaskFormOpen(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="font-medium text-sm">New Urgent Task</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filter Tabs */}
          <div className="md:hidden mb-6">
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'all', label: 'All', count: tasks.length },
                { key: 'pending', label: 'Pending', count: tasks.filter(t => (t.status || '').toLowerCase() === 'pending').length },
                { key: 'in progress', label: 'Active', count: tasks.filter(t => (t.status || '').toLowerCase() === 'in progress').length },
                { key: 'completed', label: 'Done', count: tasks.filter(t => (t.status || '').toLowerCase() === 'completed').length }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`p-4 rounded-2xl shadow-sm border transition-all ${
                    filter === key
                      ? 'bg-red-500 text-white border-red-500 shadow-md'
                      : 'bg-white text-red-600 border-red-200 active:scale-95'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-lg font-bold">{count}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Filter Tabs */}
          <div className="hidden md:block mb-8">
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'all', label: 'All', count: tasks.length },
                { key: 'pending', label: 'Pending', count: tasks.filter(t => (t.status || '').toLowerCase() === 'pending').length },
                { key: 'in progress', label: 'Active', count: tasks.filter(t => (t.status || '').toLowerCase() === 'in progress').length },
                { key: 'completed', label: 'Done', count: tasks.filter(t => (t.status || '').toLowerCase() === 'completed').length }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    filter === key
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin text-red-500" />
                <span className="text-red-600">Loading urgent tasks...</span>
              </div>
            </div>
          )}

          {/* Responsive Urgent Task Cards */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {filteredTasks.map((task) => {
                const timeInfo = getTimeRemaining(task.dueDate)
                return (
                  <div 
                    key={task._id} 
                    onClick={() => navigate(`/pm-urgent-task/${task._id}`)}
                    className="bg-white rounded-xl p-4 shadow-sm border border-red-100 cursor-pointer"
                  >
                    {/* Header */}
                    <div className="relative flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className={`p-2 rounded-lg ${getStatusColor(task.status)} flex-shrink-0`}>
                          <CheckSquare className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {task.title}
                          </h3>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation() }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200 flex-shrink-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {task.description}
                    </p>

                    {/* Tags Row */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>

                    {/* Project & Milestone */}
                    <div className="mb-3 p-2 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1 text-red-600">
                          <span className="text-red-600 font-semibold">{task.project?.name || 'No Project'}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-red-600">
                          <span className="text-red-600 font-semibold">{task.milestone?.name || 'No Milestone'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1.5 text-gray-500">
                          <User className="h-3.5 w-3.5" />
                          <span className="text-xs">{task.assignedTo?.[0]?.fullName || 'Unassigned'}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-gray-500">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="text-xs">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-semibold ${timeInfo.color}`}>
                          {timeInfo.text}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-red-900 mb-2">No urgent tasks found</h3>
              <p className="text-red-600 mb-4">Try adjusting your filter or create a new urgent task</p>
              <button 
                onClick={() => setIsTaskFormOpen(true)}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full text-sm font-medium"
              >
                Create Urgent Task
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Urgent Task Form */}
      <PM_urgent_task_form
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleTaskSubmit}
      />
    </div>
  )
}

export default PM_urgent_tasks
