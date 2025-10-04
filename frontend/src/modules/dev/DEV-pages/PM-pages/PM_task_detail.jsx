import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PM_navbar from '../../DEV-components/PM_navbar'
import { ArrowLeft, CheckSquare, Calendar, User, Clock, FileText, Download, Eye, Users, Paperclip, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

const PM_task_detail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useState(() => new URLSearchParams(window.location.search))
  const projectId = searchParams.get('projectId')
  const [task, setTask] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      await new Promise(r => setTimeout(r, 500))
      setTask({
        _id: id,
        title: 'Hero section',
        description: 'Build a responsive hero with CTA and analytics',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now()+2*24*60*60*1000).toISOString(),
        createdAt: new Date().toISOString(),
        completedAt: null,
        assignedTo: [{ _id: 'u-001', fullName: 'John Doe', email: 'john@example.com' }],
        project: { _id: projectId, name: 'Website Redesign' },
        milestone: { _id: 'm-001', title: 'M1 - UI/UX' },
        attachments: []
      })
      setIsLoading(false)
    }
    load()
  }, [id, projectId])

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  const getPriorityColor = (p) => {
    switch (p) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  const formatStatus = (s) => s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase()+s.slice(1)
  const formatPriority = (p) => p.charAt(0).toUpperCase()+p.slice(1)
  const formatFileSize = (b) => `${(b/1024/1024).toFixed(2)} MB`

  if (isLoading || !task) {
    return (
      <div className="min-h-screen bg-gray-50"><PM_navbar /><div className="flex items-center justify-center min-h-[60vh]"><div className="flex items-center space-x-3"><Loader2 className="h-8 w-8 animate-spin text-primary" /><span className="text-lg text-gray-600">Loading task details...</span></div></div></div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PM_navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <button onClick={() => navigate(`/pm-project/${projectId}`)} className="mb-4 text-gray-600 hover:text-gray-900 flex items-center"><ArrowLeft className="h-4 w-4 mr-2" />Back to Project</button>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex-shrink-0"><CheckSquare className="h-8 w-8 text-primary" /></div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 break-words">{task.title}</h1>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>{formatStatus(task.status)}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(task.priority)}`}>{formatPriority(task.priority)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2"><FileText className="h-5 w-5 text-primary" /><span>Description</span></h3>
              <p className="text-gray-700 leading-relaxed">{task.description || 'No description provided'}</p>
            </div>
            {task.attachments && task.attachments.length > 0 && (
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2"><Paperclip className="h-5 w-5 text-primary" /><span>Attachments ({task.attachments.length})</span></h3>
                <div className="space-y-3">
                  {task.attachments.map((att, idx) => (
                    <div key={att.cloudinaryId || idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div className="flex items-center space-x-3"><span className="text-2xl">📎</span><div><p className="text-sm font-medium text-gray-900">{att.originalName}</p><p className="text-xs text-gray-500">{formatFileSize(att.size)} • Uploaded {new Date(att.uploadedAt).toLocaleDateString()}</p></div></div><div className="flex items-center space-x-2"><a href={att.url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><Eye className="h-4 w-4" /></a><a href={att.url} download={att.originalName} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><Download className="h-4 w-4" /></a></div></div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Details</h3>
              <div className="space-y-4">
                <div><label className="text-sm font-medium text-gray-600">Due Date</label><p className="text-base font-medium text-gray-900 flex items-center space-x-2 mt-1"><Calendar className="h-4 w-4 text-primary" /><span>{new Date(task.dueDate).toLocaleDateString()}</span></p></div>
                <div><label className="text-sm font-medium text-gray-600">Created</label><p className="text-base font-medium text-gray-900 flex items-center space-x-2 mt-1"><Clock className="h-4 w-4 text-primary" /><span>{new Date(task.createdAt).toLocaleDateString()}</span></p></div>
                {task.completedAt && (<div><label className="text-sm font-medium text-gray-600">Completed</label><p className="text-base font-medium text-gray-900 flex items-center space-x-2 mt-1"><CheckCircle className="h-4 w-4 text-green-500" /><span>{new Date(task.completedAt).toLocaleDateString()}</span></p></div>)}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2"><Users className="h-5 w-5 text-primary" /><span>Assigned Team</span></h3>
              {task.assignedTo && task.assignedTo.length > 0 ? (
                <div className="space-y-3">{task.assignedTo.map(m => (<div key={m._id} className="flex items-center space-x-3"><div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full flex items-center justify-center"><User className="h-4 w-4 text-primary" /></div><div><p className="text-sm font-medium text-gray-900">{m.fullName}</p><p className="text-xs text-gray-500">{m.email}</p></div></div>))}</div>
              ) : (<p className="text-gray-500 text-sm">No team members assigned</p>)}
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Info</h3>
              <div className="space-y-3"><div><label className="text-sm font-medium text-gray-600">Project</label><p className="text-base font-medium text-gray-900">{task.project?.name || 'Unknown Project'}</p></div><div><label className="text-sm font-medium text-gray-600">Milestone</label><p className="text-base font-medium text-gray-900">{task.milestone?.title || 'Unknown Milestone'}</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PM_task_detail
