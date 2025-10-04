import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Employee_navbar from '../../DEV-components/Employee_navbar'
import { 
  FiCheckSquare as CheckSquare,
  FiClock as Clock,
  FiAlertTriangle as AlertTriangle,
  FiTrendingUp as TrendingUp,
  FiCalendar as Calendar,
  FiUser as User,
  FiFolder as FolderKanban
} from 'react-icons/fi'

const Employee_dashboard = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    dueSoon: 0,
    overdue: 0,
    overallProgress: 0
  })
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await new Promise(r => setTimeout(r, 400))
      const mockTasks = [
        {
          _id: 't1',
          title: 'Implement login flow',
          description: 'Build login form and validation',
          status: 'in-progress',
          priority: 'high',
          dueDate: new Date(Date.now() + 2*24*60*60*1000).toISOString(),
          project: { name: 'Website Revamp' },
          milestone: { title: 'Auth & Users' },
          assignedTo: [{ fullName: 'You' }]
        },
        {
          _id: 't2',
          title: 'Prepare sprint summary',
          description: 'Draft summary for sprint review',
          status: 'pending',
          priority: 'normal',
          dueDate: new Date(Date.now() + 5*24*60*60*1000).toISOString(),
          project: { name: 'Internal Ops' },
          milestone: { title: 'Reporting' },
          assignedTo: [{ fullName: 'You' }]
        },
        {
          _id: 't3',
          title: 'Fix navbar overlap',
          description: 'Resolve layout shift on mobile',
          status: 'completed',
          priority: 'low',
          dueDate: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
          project: { name: 'UI Polish' },
          milestone: { title: 'Layout' },
          assignedTo: [{ fullName: 'You' }]
        }
      ]
      setTasks(mockTasks)

      const total = mockTasks.length
      const completed = mockTasks.filter(t => t.status === 'completed').length
      const inProgress = mockTasks.filter(t => t.status === 'in-progress').length
      const pending = mockTasks.filter(t => t.status === 'pending').length
      const dueSoon = mockTasks.filter(t => {
        const diffDays = Math.ceil((new Date(t.dueDate) - new Date())/(1000*60*60*24))
        return diffDays <= 3 && diffDays >= 0 && t.status !== 'completed'
      }).length
      const overdue = mockTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length
      const overallProgress = total > 0 ? Math.round((completed/total)*100) : 0

      setStats({ total, completed, inProgress, pending, dueSoon, overdue, overallProgress })
      setLoading(false)
    }
    load()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress': return 'bg-primary/10 text-primary border-primary/20'
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200'
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

  const filteredTasks = useMemo(() => {
    if (!tasks.length) return []
    switch (filter) {
      case 'due-soon':
        return tasks.filter(task => {
          const diffDays = Math.ceil((new Date(task.dueDate) - new Date())/(1000*60*60*24))
          return diffDays <= 3 && diffDays >= 0 && task.status !== 'completed'
        })
      case 'overdue':
        return tasks.filter(task => new Date(task.dueDate) < new Date() && task.status !== 'completed')
      case 'done':
        return tasks.filter(task => task.status === 'completed')
      case 'high-priority':
        return tasks.filter(task => (task.priority === 'high' || task.priority === 'urgent') && task.status !== 'completed')
      default:
        return tasks
    }
  }, [tasks, filter])

  if (loading) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
        <Employee_navbar />
        <main className="pt-16 pb-24 md:pt-20 md:pb-8">
          <div className="px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64 text-gray-600">Loading dashboard...</div>
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome, Employee!</h1>
            <p className="text-sm text-gray-600 mt-1">Here's your task overview</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <CheckSquare className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs text-gray-500">Total</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-600">Tasks</p>
            </div>
            <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-100 rounded-xl">
                  <CheckSquare className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-xs text-gray-500">Done</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              <p className="text-xs text-gray-600">Tasks</p>
            </div>
            <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-yellow-100 rounded-xl">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <span className="text-xs text-gray-500">Due Soon</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.dueSoon}</p>
              <p className="text-xs text-gray-600">Tasks</p>
            </div>
            <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-red-100 rounded-xl">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <span className="text-xs text-gray-500">Overdue</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
              <p className="text-xs text-gray-600">Tasks</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Task Progress Overview</h3>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">Overall Completion</span>
                <span className="text-sm font-bold text-primary">{stats.overallProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-gradient-to-r from-primary to-primary-dark h-4 rounded-full transition-all duration-700" style={{ width: `${stats.overallProgress}%` }} />
              </div>
            </div>
          </div>

          <div className="md:hidden mb-6">
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'all', label: 'All', count: stats.total },
                { key: 'done', label: 'Done', count: stats.completed },
                { key: 'due-soon', label: 'Due Soon', count: stats.dueSoon },
                { key: 'overdue', label: 'Overdue', count: stats.overdue }
              ].map(({ key, label, count }) => (
                <button key={key} onClick={() => setFilter(key)} className={`p-4 rounded-2xl shadow-sm border transition-all ${filter === key ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-600 border-gray-200 active:scale-95'}`}>
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-lg font-bold">{count}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block mb-8">
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'all', label: 'All', count: stats.total },
                { key: 'done', label: 'Done', count: stats.completed },
                { key: 'due-soon', label: 'Due Soon', count: stats.dueSoon },
                { key: 'overdue', label: 'Overdue', count: stats.overdue }
              ].map(({ key, label, count }) => (
                <button key={key} onClick={() => setFilter(key)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${filter === key ? 'bg-primary text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">My Tasks</h2>
              <span className="text-sm text-gray-500">{filteredTasks.length} tasks</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredTasks.map((task) => (
                <div key={task._id} onClick={() => navigate(`/employee-task/${task._id}`)} className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 active:scale-[0.98]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300">
                        <CheckSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors duration-300">{task.title}</h3>
                        </div>
                        <div className="flex items-center space-x-1.5 mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>{task.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">{task.description}</p>
                  <div className="mb-3 p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <FolderKanban className="h-3 w-3" />
                        <span className="text-primary font-semibold">{task.project?.name || 'Unknown Project'}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <span className="text-primary font-semibold">{task.milestone?.title || 'Unknown Milestone'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <User className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">{task.assignedTo?.[0]?.fullName || 'Unassigned'}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckSquare className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filter to see more tasks</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Employee_dashboard
