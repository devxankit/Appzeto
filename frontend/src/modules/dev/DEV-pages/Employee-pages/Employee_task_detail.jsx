import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Employee_navbar from '../../DEV-components/Employee_navbar'
import {
  FiCheckSquare as CheckSquare,
  FiCalendar as Calendar,
  FiUser as User,
  FiClock as Clock,
  FiFileText as FileText,
  FiMessageSquare as MessageSquare,
  FiPaperclip as Paperclip,
  FiArrowLeft as ArrowLeft,
  FiEye as Eye,
  FiDownload as Download,
  FiUpload as Upload,
  FiX as X
} from 'react-icons/fi'

const Employee_task_detail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState(null)
  const [timeLeft, setTimeLeft] = useState('')
  const [newComment, setNewComment] = useState('')
  const [newAttachment, setNewAttachment] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await new Promise(r => setTimeout(r, 400))
      const mockTask = {
        _id: id,
        title: 'Implement login flow',
        description: 'Build login form and validation',
        status: 'in-progress',
        priority: 'high',
        createdAt: new Date(Date.now()-2*24*60*60*1000).toISOString(),
        dueDate: new Date(Date.now()+2*24*60*60*1000).toISOString(),
        project: { name: 'Website Revamp' },
        milestone: { title: 'Auth & Users' },
        assignedTo: [{ fullName: 'You' }],
        attachments: [],
        comments: []
      }
      setTask(mockTask)
      setLoading(false)
    }
    if (id) load()
  }, [id])

  useEffect(() => {
    if (!task || !task.dueDate) return
    const calc = () => {
      const now = new Date()
      const due = new Date(task.dueDate)
      const diff = due - now
      if (diff > 0) {
        const days = Math.floor(diff/(1000*60*60*24))
        const hours = Math.floor((diff%(1000*60*60*24))/(1000*60*60))
        if (days > 0) setTimeLeft(`${days}d ${hours}h`)
        else {
          const minutes = Math.floor((diff%(1000*60*60))/(1000*60))
          setTimeLeft(`${hours}h ${minutes}m`)
        }
      } else {
        const overdueDays = Math.floor(Math.abs(diff)/(1000*60*60*24))
        if (overdueDays > 0) setTimeLeft(`${overdueDays}d overdue`)
        else setTimeLeft(`${Math.floor(Math.abs(diff)/(1000*60*60))}h overdue`)
      }
    }
    calc()
    const i = setInterval(calc, 60000)
    return () => clearInterval(i)
  }, [task])

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

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-800' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-primary/10 text-primary' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
        <Employee_navbar />
        <main className="pt-16 pb-24 md:pt-20 md:pb-8">
          <div className="px-4 md:max-w-4xl md:mx-auto md:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64 text-gray-600">Loading task details...</div>
          </div>
        </main>
      </div>
    )
  }

  if (!task) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
      <Employee_navbar />
      <main className="pt-16 pb-24 md:pt-20 md:pb-8">
        <div className="px-4 md:max-w-4xl md:mx-auto md:px-6 lg:px-8">
          <div className="mb-6">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-2 rounded-lg ${getStatusColor(task.status)}`}>
                    <CheckSquare className="h-5 w-5" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{task.title}</h1>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>{task.status}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-blue-600">{timeLeft}</div>
                <div className="text-sm text-gray-500 mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{task.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Assigned to</p>
                    <p className="text-base font-medium text-gray-900">{task.assignedTo?.[0]?.fullName || 'Unassigned'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Created</p>
                    <p className="text-base font-medium text-gray-900">{new Date(task.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Project</p>
                    <p className="text-base font-medium text-gray-900">{task.project?.name || 'Unknown Project'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Milestone</p>
                    <p className="text-base font-medium text-gray-900">{task.milestone?.title || 'Unknown Milestone'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map(option => (
                  <button key={option.value} disabled={updatingStatus} onClick={() => setTask({ ...task, status: option.value })} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${task.status === option.value ? `${option.color} border-2 border-current` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Paperclip className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
                <span className="text-sm text-gray-500">({task.attachments.length})</span>
              </div>
              <label className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors cursor-pointer">
                <Upload className="h-4 w-4" />
                <span className="text-sm font-medium">Upload</span>
                <input type="file" onChange={(e)=>{ const file=e.target.files?.[0]; if(file){ setNewAttachment(file); setIsUploading(true); setTimeout(()=>{ setIsUploading(false); setNewAttachment(null); }, 1500) } }} className="hidden" accept=".pdf,.png,.jpg,.jpeg,.docx,.mp4" />
              </label>
            </div>
            {isUploading && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm text-blue-600">Uploading file...</span>
                </div>
              </div>
            )}
            {newAttachment && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📎</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{newAttachment.name}</p>
                      <p className="text-xs text-gray-500">{(newAttachment.size/1024/1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button onClick={()=>setNewAttachment(null)} className="p-1 text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
                </div>
              </div>
            )}
            {task.attachments.length === 0 && !newAttachment && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Paperclip className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No attachments yet</h3>
                <p className="text-gray-600">Upload files to share with your team</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
              <span className="text-sm text-gray-500">({task?.comments?.length || 0})</span>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-4">
                <textarea value={newComment} onChange={(e)=>setNewComment(e.target.value)} placeholder="Add a comment to this task..." rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none" />
                <div className="flex justify-end">
                  <button disabled={!newComment.trim()} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Add Comment</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Employee_task_detail
