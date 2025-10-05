import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Employee_navbar from '../../DEV-components/Employee_navbar'
import { CheckSquare, Search, Filter, Calendar, User, MoreVertical, Loader2, Clock, AlertTriangle } from 'lucide-react'

const Employee_tasks = () => {
  const [searchParams] = useSearchParams()
  const [filter, setFilter] = useState('all')
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Mock tasks data for employee - replace with API later
  const mockTasks = [
    {
      _id: 't-001',
      title: 'Design Landing Page',
      description: 'Create hero, features, and CTA sections for new brand.',
      status: 'In Progress',
      priority: 'High',
      project: { _id: 'p-001', name: 'Website Redesign' },
      milestone: { _id: 'm-001', name: 'M1 - UI/UX' },
      assignedTo: [{ _id: 'u-001', fullName: 'John Doe' }],
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 't-002',
      title: 'Implement Auth Flow',
      description: 'Add login, logout, and token refresh with guards.',
      status: 'Pending',
      priority: 'Normal',
      project: { _id: 'p-002', name: 'Mobile App v2' },
      milestone: { _id: 'm-010', name: 'M2 - Core' },
      assignedTo: [{ _id: 'u-002', fullName: 'Jane Smith' }],
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 't-003',
      title: 'Analytics Dashboard',
      description: 'KPIs, charts, and alerts for executive overview.',
      status: 'Completed',
      priority: 'Low',
      project: { _id: 'p-003', name: 'Data Warehouse Setup' },
      milestone: { _id: 'm-020', name: 'M3 - Reporting' },
      assignedTo: [{ _id: 'u-003', fullName: 'Mike Johnson' }],
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 't-004',
      title: 'Fix Critical Security Vulnerability',
      description: 'Immediate patch required for authentication bypass issue.',
      status: 'In Progress',
      priority: 'Urgent',
      project: { _id: 'p-004', name: 'Security Update' },
      milestone: { _id: 'm-030', name: 'M1 - Critical Fixes' },
      assignedTo: [{ _id: 'u-004', fullName: 'Sarah Wilson' }],
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      isUrgent: true
    },
    {
      _id: 't-005',
      title: 'Database Optimization',
      description: 'Optimize queries and improve performance for better user experience.',
      status: 'Pending',
      priority: 'Medium',
      project: { _id: 'p-005', name: 'Performance Enhancement' },
      milestone: { _id: 'm-040', name: 'M1 - Optimization' },
      assignedTo: [{ _id: 'u-005', fullName: 'David Brown' }],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]

  useEffect(() => {
    loadTasks()
    
    // Check for filter parameter in URL
    const urlFilter = searchParams.get('filter')
    if (urlFilter) {
      setFilter(urlFilter)
    }
  }, [searchParams])

  const loadTasks = async () => {
    try {
      setIsLoading(true)
      await new Promise(r => setTimeout(r, 600))
      setTasks(mockTasks)
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
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
    if (filter === 'urgent') {
      return task.isUrgent || task.priority === 'Urgent'
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
      <Employee_navbar />
      
      <main className="pt-16 pb-24 md:pt-20 md:pb-8">
        <div className="px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
          {/* Mobile Layout - Header */}
          <div className="md:hidden mb-6">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 mb-1">My Tasks</h2>
                  <p className="text-sm text-gray-600">Track and manage your assigned tasks</p>
                </div>
                <div className="ml-4 bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-2 rounded-lg shadow-sm">
                  <span className="text-sm font-medium">{tasks.length}</span>
                </div>
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
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <h3 className="text-sm font-semibold text-gray-900">Task Overview</h3>
                    <p className="text-xs text-gray-600">Total: {tasks.length} tasks assigned</p>
                  </div>
                  <div className="bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-2 rounded-lg shadow-sm">
                    <span className="text-sm font-medium">{tasks.filter(t => t.status === 'In Progress').length} Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filter Tabs */}
          <div className="md:hidden mb-6">
            <div className="flex space-x-1 bg-white border border-gray-200 rounded-xl shadow-sm p-1">
              {[
                { key: 'all', label: 'All', count: tasks.length },
                { key: 'pending', label: 'Pending', count: tasks.filter(t => (t.status || '').toLowerCase() === 'pending').length },
                { key: 'in progress', label: 'Active', count: tasks.filter(t => (t.status || '').toLowerCase() === 'in progress').length },
                { key: 'completed', label: 'Done', count: tasks.filter(t => (t.status || '').toLowerCase() === 'completed').length },
                { key: 'urgent', label: 'Urgent', count: tasks.filter(t => t.isUrgent || t.priority === 'Urgent').length }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    filter === key
                      ? key === 'urgent'
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'bg-teal-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-0.5">
                    <span className="text-sm font-bold">{count}</span>
                    <span className="text-xs font-medium">{label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Filter Tabs */}
          <div className="hidden md:block mb-8">
            <div className="flex space-x-1 bg-white border border-gray-200 rounded-xl shadow-sm p-1 max-w-fit">
              {[
                { key: 'all', label: 'All', count: tasks.length },
                { key: 'pending', label: 'Pending', count: tasks.filter(t => (t.status || '').toLowerCase() === 'pending').length },
                { key: 'in progress', label: 'Active', count: tasks.filter(t => (t.status || '').toLowerCase() === 'in progress').length },
                { key: 'completed', label: 'Done', count: tasks.filter(t => (t.status || '').toLowerCase() === 'completed').length },
                { key: 'urgent', label: 'Urgent', count: tasks.filter(t => t.isUrgent || t.priority === 'Urgent').length }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === key
                      ? key === 'urgent'
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'bg-teal-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
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
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-gray-600">Loading tasks...</span>
              </div>
            </div>
          )}

          {/* Responsive Task Cards */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {filteredTasks.map((task) => {
                const timeInfo = getTimeRemaining(task.dueDate)
                return (
                  <div 
                    key={task._id} 
                    onClick={() => navigate(`/employee-task/${task._id}`)}
                    className="group relative bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer overflow-hidden"
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Header */}
                    <div className="relative flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className={`p-2 rounded-lg ${getStatusColor(task.status)} flex-shrink-0`}>
                          <CheckSquare className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                            {task.title}
                          </h3>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation() }}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-all duration-200 flex-shrink-0"
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
                    <div className="mb-3 p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1 text-gray-600">
                          <span className="text-primary font-semibold">{task.project?.name || 'No Project'}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600">
                          <span className="text-primary font-semibold">{task.milestone?.name || 'No Milestone'}</span>
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
                          <Calendar className="h-3.5 w-3.5" />
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
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filter or check back later for new assignments</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Employee_tasks