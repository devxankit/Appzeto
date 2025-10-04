import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PM_navbar from '../../DEV-components/PM_navbar'
import { Target, Calendar, User, CheckSquare, Paperclip, Upload, X, MessageSquare, Eye, Download, Loader2, ArrowLeft } from 'lucide-react'

const PM_milestone_detail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useState(() => new URLSearchParams(window.location.search))
  const projectId = searchParams.get('projectId')
  const [milestone, setMilestone] = useState(null)
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState('')
  const [newComment, setNewComment] = useState('')
  const [newAttachment, setNewAttachment] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      await new Promise(r => setTimeout(r, 500))
      setMilestone({
        _id: id,
        title: 'M1 - UI/UX',
        description: 'Wireframes and designs',
        status: 'in-progress',
        priority: 'high',
        progress: 45,
        dueDate: new Date(Date.now() + 3*24*60*60*1000).toISOString(),
        createdAt: new Date().toISOString(),
        assignedTo: [{ fullName: 'Jane Smith' }],
        attachments: [],
        comments: []
      })
      setProject({ _id: projectId, name: 'Website Redesign' })
      setTasks([
        { _id: 't-001', title: 'Hero section', status: 'in-progress', priority: 'high', assignedTo: [{ fullName: 'John Doe' }], dueDate: new Date().toISOString() }
      ])
      setIsLoading(false)
    }
    load()
  }, [id, projectId])

  useEffect(() => {
    if (!milestone?.dueDate) return
    const calc = () => {
      const now = new Date(); const due = new Date(milestone.dueDate)
      const diff = due.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000*60*60*24));
        const hours = Math.floor((diff % (1000*60*60*24))/(1000*60*60));
        setTimeLeft(days>0?`${days}d ${hours}h`:`${hours}h`)
      } else { setTimeLeft(`${Math.floor(Math.abs(diff)/(1000*60*60*24))}d overdue`) }
    }
    calc(); const i = setInterval(calc,60000); return ()=>clearInterval(i)
  }, [milestone?.dueDate])

  if (isLoading || !milestone) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
        <PM_navbar />
        <main className="pt-16 pb-24 md:pt-20 md:pb-8">
          <div className="px-4 md:max-w-4xl md:mx-auto md:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /><span className="ml-2 text-gray-600">Loading milestone...</span></div>
          </div>
        </main>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress': return 'bg-primary/10 text-primary border-primary/20'
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200'
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

  const getFileIcon = (type) => '📎'

  const handleUploadChange = (e) => {
    const f = e.target.files && e.target.files[0]
    if (f) {
      setNewAttachment(f)
      setIsUploading(true)
      setTimeout(() => {
        setIsUploading(false)
        setNewAttachment(null)
      }, 1200)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
      <PM_navbar />
      <main className="pt-16 pb-24 md:pt-20 md:pb-8">
        <div className="px-4 md:max-w-4xl md:mx-auto md:px-6 lg:px-8">
          <div className="mb-6"><button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"><ArrowLeft className="h-4 w-4" /><span className="text-sm font-medium">Back</span></button></div>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4"><div className={`p-2 rounded-lg ${getStatusColor(milestone.status)}`}><Target className="h-5 w-5" /></div><h1 className="text-2xl md:text-3xl font-bold text-gray-900">{milestone.title}</h1></div>
                <div className="flex items-center space-x-2 mb-4"><span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(milestone.status)}`}>{milestone.status}</span><span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(milestone.priority)}`}>{milestone.priority}</span></div>
              </div>
              <div className="text-right"><div className="text-lg font-semibold text-blue-600">{timeLeft}</div><div className="text-sm text-gray-500 mt-1">Due: {new Date(milestone.dueDate).toLocaleDateString()}</div></div>
            </div>
            <div className="mb-6"><h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3><p className="text-gray-600 leading-relaxed">{milestone.description}</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3"><div className="p-2 bg-primary/10 rounded-lg"><User className="h-4 w-4 text-primary" /></div><div><p className="text-sm font-semibold text-gray-600">Assigned to</p><p className="text-base font-medium text-gray-900">{milestone.assignedTo?.map(u=>u.fullName).join(', ') || 'No one assigned'}</p></div></div>
              <div className="flex items-center space-x-3"><div className="p-2 bg-blue-100 rounded-lg"><Calendar className="h-4 w-4 text-blue-600" /></div><div><p className="text-sm font-semibold text-gray-600">Created</p><p className="text-base font-medium text-gray-900">{new Date(milestone.createdAt).toLocaleDateString()}</p></div></div>
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4"><div className="flex items-center space-x-3"><div className="p-2 bg-primary/10 rounded-lg"><CheckSquare className="h-5 w-5 text-primary" /></div><div><h3 className="text-lg font-semibold text-gray-900">Tasks</h3><p className="text-sm text-gray-600">Tasks for this milestone</p></div></div><div className="text-sm text-gray-500">{tasks.length} task{tasks.length!==1?'s':''}</div></div>
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-center py-8"><div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckSquare className="h-6 w-6 text-gray-400" /></div><h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3><p className="text-gray-600">Tasks will appear here when created</p></div>
              ) : (
                tasks.map(task => (
                  <div key={task._id} onClick={() => navigate(`/pm-task/${task._id}?projectId=${projectId}`)} className="group bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200 cursor-pointer border border-gray-200 hover:border-primary/20">
                    <div className="flex items-center justify-between">
                      <div className="flex-1"><h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors">{task.title}</h4><div className="flex items-center space-x-4 mt-2 text-sm text-gray-500"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status==='completed'?'bg-green-100 text-green-800':task.status==='in-progress'?'bg-blue-100 text-blue-800':'bg-gray-100 text-gray-800'}`}>{task.status==='completed'?'Completed':task.status==='in-progress'?'In Progress':'Pending'}</span><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.priority==='high'?'bg-red-100 text-red-800':task.priority==='urgent'?'bg-red-100 text-red-800':task.priority==='low'?'bg-green-100 text-green-800':'bg-yellow-100 text-yellow-800'}`}>{task.priority==='urgent'?'Urgent':task.priority==='high'?'High':task.priority==='low'?'Low':'Normal'}</span></div></div>
                      <div className="text-right"><p className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3"><div className="p-2 bg-primary/10 rounded-lg"><Paperclip className="h-5 w-5 text-primary" /></div><h3 className="text-lg font-semibold text-gray-900">Attachments</h3></div>
              <label className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors cursor-pointer">
                <Upload className="h-4 w-4" />
                <span className="text-sm font-medium">Upload</span>
                <input type="file" onChange={handleUploadChange} className="hidden" accept=".pdf,.png,.jpg,.jpeg,.docx,.mp4,.fig" />
              </label>
            </div>
            {isUploading && (<div className="mb-4 p-3 bg-blue-50 rounded-lg"><div className="flex items-center space-x-2"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div><span className="text-sm text-blue-600">Uploading file...</span></div></div>)}
            {newAttachment && (<div className="mb-4 p-3 bg-gray-50 rounded-lg"><div className="flex items-center justify-between"><div className="flex items-center space-x-3"><span className="text-2xl">{getFileIcon(newAttachment.type || 'file')}</span><div><p className="text-sm font-medium text-gray-900">{newAttachment.name}</p><p className="text-xs text-gray-500">{(newAttachment.size/1024/1024).toFixed(2)} MB</p></div></div><button onClick={()=>setNewAttachment(null)} className="p-1 text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button></div></div>)}
          </div>

          {/* Comments */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6"><div className="p-2 bg-primary/10 rounded-lg"><MessageSquare className="h-5 w-5 text-primary" /></div><div className="flex items-center space-x-2"><h3 className="text-lg font-semibold text-gray-900">Comments</h3></div></div>
            <div className="border-t border-gray-200 pt-6"><div className="space-y-4"><textarea value={newComment} onChange={(e)=>setNewComment(e.target.value)} placeholder="Add a comment to this milestone..." rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none" /><div className="flex justify-end"><button onClick={()=>{ if(!newComment.trim()) return; setNewComment('') }} disabled={!newComment.trim()} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Add Comment</button></div></div></div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PM_milestone_detail
