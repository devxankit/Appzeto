import React, { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import PM_navbar from '../../DEV-components/PM_navbar'
import PM_project_form from '../../DEV-components/PM_project_form'
import PM_task_form from '../../DEV-components/PM_task_form'
import { 
  FiFolder, 
  FiCheckSquare, 
  FiUsers, 
  FiCalendar,
  FiPlus,
  FiTrendingUp,
  FiBarChart,
  FiTarget,
  FiClock,
  FiCheckCircle,
  FiPauseCircle
} from 'react-icons/fi'

const PM_dashboard = () => {
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false)
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)

  const handleProjectSubmit = async (data) => {
    // TODO: integrate with API
    setIsProjectFormOpen(false)
  }

  const handleTaskSubmit = async (data) => {
    // TODO: integrate with API
    setIsTaskFormOpen(false)
  }
  // Mock data for projects
  const projectStats = {
    total: 12,
    active: 5,
    completed: 6,
    onHold: 1,
    overdue: 2
  }

  // Recent projects data
  const recentProjects = [
    {
      name: "Mobile App Development",
      progress: 65,
      status: "active",
      deadline: "Dec 15, 2024",
      team: 4
    },
    {
      name: "Website Redesign",
      progress: 90,
      status: "near-completion",
      deadline: "Dec 8, 2024", 
      team: 3
    },
    {
      name: "Database Migration",
      progress: 30,
      status: "active",
      deadline: "Jan 20, 2025",
      team: 2
    }
  ]

  // Chart data
  const monthlyData = [
    { month: 'Jan', completed: 3, active: 4 },
    { month: 'Feb', completed: 5, active: 3 },
    { month: 'Mar', completed: 7, active: 5 },
    { month: 'Apr', completed: 4, active: 6 },
    { month: 'May', completed: 6, active: 4 },
    { month: 'Jun', completed: 8, active: 5 }
  ]

  // Project status donut chart data
  const projectStatusData = [
    { name: 'In Progress', value: 5, color: '#10B981', count: '5 projects' },
    { name: 'Completed', value: 6, color: '#3B82F6', count: '6 projects' },
    { name: 'On Hold', value: 1, color: '#F59E0B', count: '1 project' },
    { name: 'Overdue', value: 2, color: '#EF4444', count: '2 projects' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'near-completion': return 'bg-blue-500'
      case 'overdue': return 'bg-red-500'
      case 'on-hold': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Active'
      case 'near-completion': return 'Near Completion'
      case 'overdue': return 'Overdue'
      case 'on-hold': return 'On Hold'
      default: return 'Unknown'
    }
  }

  return (
    <div>
      <PM_navbar />
      
      {/* Main Content */}
      <div className="pt-16 lg:pt-16 pb-20 lg:pb-0 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* New Project Card */}
          <div className="bg-teal-100 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-teal-300/40 cursor-pointer mb-6"
            style={{
              boxShadow: '0 8px 25px -5px rgba(20, 184, 166, 0.2), 0 4px 12px -3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-teal-900 mb-1">New Project</h2>
                <p className="text-sm text-teal-700">Projects requiring setup or initial planning</p>
              </div>
              <div 
                className="bg-teal-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg border border-teal-400/30"
                style={{
                  boxShadow: '0 4px 12px -2px rgba(20, 184, 166, 0.3), 0 2px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                <span className="text-lg font-bold">8</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button onClick={() => setIsProjectFormOpen(true)} className="flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:from-teal-600 hover:to-teal-700">
              <FiPlus className="text-lg" />
              <span>Add New Project</span>
            </button>
            <button onClick={() => setIsTaskFormOpen(true)} className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:from-purple-600 hover:to-purple-700">
              <FiCheckSquare className="text-lg" />
              <span>Add New Task</span>
            </button>
          </div>

          {/* Metrics Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Active Projects Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <FiFolder className="text-teal-600 text-lg" />
                </div>
                <span className="text-sm text-gray-600 font-medium">Active</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">5</div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>

            {/* Completed Projects Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiCheckCircle className="text-green-600 text-lg" />
                </div>
                <span className="text-sm text-gray-600 font-medium">Done</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">6</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>

            {/* Team Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiUsers className="text-blue-600 text-lg" />
                </div>
                <span className="text-sm text-gray-600 font-medium">Team</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">8</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>

            {/* Tasks Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiCalendar className="text-purple-600 text-lg" />
                </div>
                <span className="text-sm text-gray-600 font-medium">Tasks</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">24</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
              <button className="text-teal-600 text-sm font-medium hover:text-teal-700">View All</button>
            </div>
            
            <div className="space-y-2">
              {recentProjects.map((project, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <h3 className="font-medium text-gray-900 mb-2">{project.name}</h3>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-gray-900 font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Project Growth Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Project Growth</h3>
                <FiTrendingUp className="text-teal-600 text-lg" />
              </div>
              
              {/* Scrollable Bar Chart Container */}
              <div className="relative h-32 mb-4">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2 z-10">
                  <span>12</span>
                  <span>9</span>
                  <span>6</span>
                  <span>3</span>
                  <span>0</span>
                </div>
                
                {/* Scrollable Chart Area */}
                <div className="ml-8 h-full overflow-x-auto scrollbar-hide">
                  <div className="flex items-end space-x-1 w-max h-full relative min-w-full">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                      <div className="border-t border-gray-200"></div>
                      <div className="border-t border-gray-200"></div>
                      <div className="border-t border-gray-200"></div>
                      <div className="border-t border-gray-200"></div>
                      <div className="border-t border-gray-200"></div>
                    </div>
                    
                    {/* All 12 Months Bars */}
                    {[
                      { month: 'Jan', projects: 3, color: 'bg-teal-300' },
                      { month: 'Feb', projects: 5, color: 'bg-teal-400' },
                      { month: 'Mar', projects: 7, color: 'bg-teal-500' },
                      { month: 'Apr', projects: 9, color: 'bg-teal-600' },
                      { month: 'May', projects: 11, color: 'bg-teal-700' },
                      { month: 'Jun', projects: 12, color: 'bg-teal-600' },
                      { month: 'Jul', projects: 10, color: 'bg-teal-500' },
                      { month: 'Aug', projects: 8, color: 'bg-teal-400' },
                      { month: 'Sep', projects: 14, color: 'bg-teal-700' },
                      { month: 'Oct', projects: 16, color: 'bg-teal-600' },
                      { month: 'Nov', projects: 18, color: 'bg-teal-500' },
                      { month: 'Dec', projects: 20, color: 'bg-teal-400' }
                    ].map((data, index) => (
                      <div key={index} className="flex flex-col items-center group">
                        {/* Bar */}
                        <div 
                          className={`${data.color} w-6 mb-2 rounded-t-sm transition-all duration-300 hover:bg-teal-600 relative`}
                          style={{ height: `${(data.projects / 20) * 90}px` }}
                          title={`${data.month}: ${data.projects} projects`}
                        >
                          {/* Value label on hover */}
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            {data.projects}
                          </div>
                        </div>
                        
                        {/* Month label */}
                        <div className="text-xs font-medium text-gray-600">{data.month}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">New Projects</span>
                  </div>
                  <span className="text-sm font-medium text-teal-600">+150% growth</span>
                </div>
              </div>
            </div>

            {/* Team Performance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
                <FiUsers className="text-blue-600 text-lg" />
              </div>
              <div className="space-y-4">
                {/* Top Row - Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">8</div>
                    <div className="text-xs text-blue-700 font-medium">Team Members</div>
                  </div>
                  <div className="text-center p-3 bg-teal-50 rounded-lg">
                    <div className="text-xl font-bold text-teal-600">24</div>
                    <div className="text-xs text-teal-700 font-medium">Active Tasks</div>
                  </div>
                </div>
                
                {/* Performance Indicators */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Tasks Completed</span>
                    <span className="text-sm font-bold text-green-600">89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Active Milestone Count</span>
                    <span className="text-sm font-bold text-purple-600">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Active Projects</span>
                    <span className="text-sm font-bold text-orange-600">5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Status Donut Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Project Status Overview</h3>
              <p className="text-gray-600 text-sm">Distribution of projects by current status</p>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between">
              {/* Donut Chart */}
              <div className="flex justify-center mb-6 lg:mb-0">
                <div className="relative">
                  <PieChart width={280} height={280}>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                  
                  {/* Center Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">{projectStats.total}</p>
                      <p className="text-sm text-gray-600">Total Projects</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 lg:pl-8">
                <div className="space-y-4">
                  {projectStatusData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-5 h-5 rounded-full shadow-sm" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <div>
                          <p className="text-base font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.count}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">{item.value}</p>
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ 
                              backgroundColor: item.color,
                              width: `${(item.value / projectStats.total) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-3 border border-emerald-200/50">
                    <div className="flex items-center space-x-1.5 mb-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <p className="text-xs font-semibold text-emerald-700">Completion Rate</p>
                    </div>
                    <p className="text-base font-bold text-emerald-900">50%</p>
                    <p className="text-xs text-emerald-600">6/12 completed</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200/50">
                    <div className="flex items-center space-x-1.5 mb-1.5">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <p className="text-xs font-semibold text-blue-700">Active Rate</p>
                    </div>
                    <p className="text-base font-bold text-blue-900">41.7%</p>
                    <p className="text-xs text-blue-600">5/12 in progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Forms */}
      <PM_project_form
        isOpen={isProjectFormOpen}
        onClose={() => setIsProjectFormOpen(false)}
        onSubmit={handleProjectSubmit}
      />
      <PM_task_form
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleTaskSubmit}
      />
    </div>
  )
}

export default PM_dashboard
