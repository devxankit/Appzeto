import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Employee_navbar from '../../DEV-components/Employee_navbar'
import { 
  FiFolder as FolderKanban,
  FiCheckSquare as CheckSquare,
  FiTrendingUp as TrendingUp,
  FiUsers as Users,
  FiCalendar as Calendar
} from 'react-icons/fi'

const Employee_projects = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await new Promise(r => setTimeout(r, 400))
      const mockProjects = [
        { _id: 'p1', name: 'Website Revamp', description: 'Modernize the marketing site', status: 'active', priority: 'high', progress: 45, myTasks: 6, myCompletedTasks: 2, assignedTeam: [{ _id: 'u1', fullName: 'Alex' }], dueDate: new Date(Date.now()+7*24*60*60*1000).toISOString() },
        { _id: 'p2', name: 'Internal Ops', description: 'Optimize ops flows', status: 'planning', priority: 'normal', progress: 10, myTasks: 2, myCompletedTasks: 0, assignedTeam: [{ _id: 'u1', fullName: 'Alex' }], dueDate: new Date(Date.now()+14*24*60*60*1000).toISOString() }
      ]
      setProjects(mockProjects)
      setLoading(false)
    }
    load()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'active': return 'bg-primary/10 text-primary border-primary/20'
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'on-hold': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
      case 'high': return 'bg-red-100 text-red-800'
      case 'normal': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totals = useMemo(() => {
    const totalProjects = projects.length
    const activeProjects = projects.filter(p => p.status === 'active').length
    const completedProjects = projects.filter(p => p.status === 'completed').length
    const totalMyTasks = projects.reduce((s,p)=> s + (p.myTasks||0), 0)
    const completedMyTasks = projects.reduce((s,p)=> s + (p.myCompletedTasks||0), 0)
    const overallProgress = totalMyTasks>0 ? Math.round((completedMyTasks/totalMyTasks)*100) : 0
    return { totalProjects, activeProjects, completedProjects, totalMyTasks, completedMyTasks, overallProgress }
  }, [projects])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
        <Employee_navbar />
        <main className="pt-16 pb-24 md:pt-20 md:pb-8">
          <div className="px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64 text-gray-600">Loading projects...</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
      <Employee_navbar />
      <main className="pt-16 pb-24 md:pt-20 md:pb-8">
        <div className="px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">My Projects</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Projects you're assigned to</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <FolderKanban className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs text-gray-500">Active</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{totals.activeProjects}</p>
              <p className="text-xs text-gray-600">Projects</p>
            </div>
            <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-100 rounded-xl">
                  <CheckSquare className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-xs text-gray-500">My Tasks</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{totals.totalMyTasks}</p>
              <p className="text-xs text-gray-600">Assigned</p>
            </div>
            <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-xs text-gray-500">Completed</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{totals.completedMyTasks}</p>
              <p className="text-xs text-gray-600">Tasks</p>
            </div>
            <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-xs text-gray-500">Teams</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{totals.totalProjects}</p>
              <p className="text-xs text-gray-600">Projects</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl md:rounded-lg p-5 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Assigned Projects</h2>
              <span className="text-sm text-gray-500">{projects.length} projects</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {projects.map((project) => (
                <div key={project._id} onClick={() => navigate(`/employee-project/${project._id}`)} className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 active:scale-[0.98]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300">
                        <FolderKanban className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors duration-300">{project.name}</h3>
                        </div>
                        <div className="flex items-center space-x-1.5 mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>{project.priority}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>{project.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">{project.description}</p>
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-bold text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Users className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">{project.assignedTeam?.length || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">{new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Employee_projects

