import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Client_navbar from '../../DEV-components/Client_navbar'
import { 
  FiFolder, 
  FiCheckSquare, 
  FiClock,
  FiTrendingUp,
  FiUsers,
  FiCalendar,
  FiArrowRight,
  FiEye,
  FiFilter
} from 'react-icons/fi'

const Client_projects = () => {
  const [activeFilter, setActiveFilter] = useState('all')

  // Mock projects data
  const [projectsData] = useState({
    statistics: {
      total: 3,
      active: 2,
      completed: 1,
      overdue: 0
    },
    projects: [
      {
        id: 1,
        name: "E-commerce Website",
        description: "Modern e-commerce platform with payment integration and mobile responsiveness",
        status: "active",
        priority: "high",
        progress: 65,
        dueDate: "2024-02-15",
        assignedTeam: ["John Doe (PM)", "Jane Smith (Developer)", "Mike Wilson (Designer)"],
        totalTasks: 25,
        completedTasks: 16,
        awaitingClientFeedback: 2,
        lastUpdate: "2024-01-22",
        startDate: "2024-01-01"
      },
      {
        id: 2,
        name: "Mobile App Development",
        description: "Cross-platform mobile application for iOS and Android with real-time features",
        status: "active",
        priority: "urgent",
        progress: 45,
        dueDate: "2024-01-30",
        assignedTeam: ["Sarah Johnson (PM)", "David Brown (Developer)"],
        totalTasks: 30,
        completedTasks: 14,
        awaitingClientFeedback: 1,
        lastUpdate: "2024-01-21",
        startDate: "2024-01-10"
      },
      {
        id: 3,
        name: "Database Migration",
        description: "Migrate legacy database to modern cloud infrastructure with zero downtime",
        status: "completed",
        priority: "normal",
        progress: 100,
        dueDate: "2024-01-15",
        assignedTeam: ["Lisa Chen (PM)", "Tom Wilson (DevOps)"],
        totalTasks: 15,
        completedTasks: 15,
        awaitingClientFeedback: 0,
        lastUpdate: "2024-01-15",
        startDate: "2024-01-01"
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

  // Filter projects based on active filter
  const filteredProjects = projectsData.projects.filter(project => {
    return activeFilter === 'all' || project.status === activeFilter
  })

  const filters = [
    { key: 'all', label: 'All Projects', count: projectsData.statistics.total },
    { key: 'active', label: 'Active', count: projectsData.statistics.active },
    { key: 'completed', label: 'Completed', count: projectsData.statistics.completed }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
      <Client_navbar />
      
      {/* Main Content */}
      <main className="pt-16 lg:pt-16 pb-16 lg:pb-8">
        <div className="px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <div className="w-full bg-white rounded-2xl md:rounded-lg p-4 md:p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="p-2 md:p-3 bg-teal-100 rounded-xl md:rounded-lg">
                  <FiFolder className="h-5 w-5 md:h-6 md:w-6 text-teal-600" />
                </div>
                <span className="text-xs md:text-sm text-gray-500">Total</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{projectsData.statistics.total}</p>
              <p className="text-xs md:text-sm text-gray-600">Projects</p>
            </div>

            <div className="w-full bg-white rounded-2xl md:rounded-lg p-4 md:p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="p-2 md:p-3 bg-blue-100 rounded-xl md:rounded-lg">
                  <FiTrendingUp className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
                <span className="text-xs md:text-sm text-gray-500">Active</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{projectsData.statistics.active}</p>
              <p className="text-xs md:text-sm text-gray-600">In Progress</p>
            </div>

            <div className="w-full bg-white rounded-2xl md:rounded-lg p-4 md:p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="p-2 md:p-3 bg-green-100 rounded-xl md:rounded-lg">
                  <FiCheckSquare className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                </div>
                <span className="text-xs md:text-sm text-gray-500">Completed</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{projectsData.statistics.completed}</p>
              <p className="text-xs md:text-sm text-gray-600">Finished</p>
            </div>

            <div className="w-full bg-white rounded-2xl md:rounded-lg p-4 md:p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="p-2 md:p-3 bg-orange-100 rounded-xl md:rounded-lg">
                  <FiClock className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
                </div>
                <span className="text-xs md:text-sm text-gray-500">Overdue</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{projectsData.statistics.overdue}</p>
              <p className="text-xs md:text-sm text-gray-600">Delayed</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex justify-center mb-6">
            <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeFilter === filter.key
                      ? 'bg-teal-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>

          {/* Projects List */}
          <div className="bg-white rounded-2xl md:rounded-lg shadow-md border border-gray-100">
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  {activeFilter === 'all' ? 'All Projects' : 
                   activeFilter === 'active' ? 'Active Projects' : 
                   'Completed Projects'}
                </h2>
                <span className="text-sm text-gray-500">{filteredProjects.length} projects</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProjects.map((project) => (
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

                {filteredProjects.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <FiFolder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-500">No projects match the current filter</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Client_projects
