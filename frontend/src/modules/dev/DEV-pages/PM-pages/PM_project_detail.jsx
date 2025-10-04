import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PM_navbar from '../../DEV-components/PM_navbar'
import PM_milestone_form from '../../DEV-components/PM_milestone_form'
import PM_task_form from '../../DEV-components/PM_task_form'
import { FolderKanban, Calendar, Users, CheckSquare, TrendingUp, Clock, Target, User, Plus, Loader2, FileText, Paperclip, Upload, Eye, Download, X } from 'lucide-react'

const PM_project_detail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [timeLeft, setTimeLeft] = useState('')
  const [isMilestoneFormOpen, setIsMilestoneFormOpen] = useState(false)
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [project, setProject] = useState(null)
  const [milestones, setMilestones] = useState([])
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [newAttachment, setNewAttachment] = useState(null)

  useEffect(() => {
    // mock load
    const load = async () => {
      setIsLoading(true)
      await new Promise(r => setTimeout(r, 500))
      
      // Mock data for projects from PM_new_projects
      const mockProjects = {
        '1': {
          _id: '1',
          name: 'E-commerce Platform',
          description: 'Complete e-commerce platform with mobile app, payment integration, and admin dashboard.',
          status: 'active',
          priority: 'high',
          progress: 45,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTeam: [
            { _id: 'u-001', fullName: 'John Doe', jobTitle: 'Developer' },
            { _id: 'u-002', fullName: 'Jane Smith', jobTitle: 'Designer' },
          ],
          customer: { name: 'Sarah Wilson' },
          startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          attachments: [
            { id: 'att-001', name: 'project-brief.pdf', size: 1024000, type: 'application/pdf', url: '#', uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 'att-002', name: 'wireframes.fig', size: 2048000, type: 'application/figma', url: '#', uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
          ]
        },
        '2': {
          _id: '2',
          name: 'Restaurant Management System',
          description: 'Restaurant management system with online ordering, table booking, and kitchen management.',
          status: 'active',
          priority: 'normal',
          progress: 25,
          dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTeam: [
            { _id: 'u-003', fullName: 'Mike Johnson', jobTitle: 'Developer' },
            { _id: 'u-004', fullName: 'Sarah Wilson', jobTitle: 'Designer' },
          ],
          customer: { name: 'Michael Chen' },
          startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          attachments: [
            { id: 'att-003', name: 'requirements.docx', size: 512000, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', url: '#', uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
          ]
        },
        '3': {
          _id: '3',
          name: 'Healthcare Portal',
          description: 'Healthcare portal for patient management, appointment booking, and medical records.',
          status: 'active',
          priority: 'urgent',
          progress: 60,
          dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTeam: [
            { _id: 'u-005', fullName: 'David Brown', jobTitle: 'Developer' },
            { _id: 'u-006', fullName: 'Lisa Davis', jobTitle: 'Designer' },
          ],
          customer: { name: 'Emily Rodriguez' },
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          attachments: [
            { id: 'att-004', name: 'healthcare-specs.pdf', size: 3584000, type: 'application/pdf', url: '#', uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 'att-005', name: 'compliance-docs.pdf', size: 2867200, type: 'application/pdf', url: '#', uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
          ]
        },
        '4': {
          _id: '4',
          name: 'Fitness App',
          description: 'Fitness tracking app with workout plans, nutrition tracking, and social features.',
          status: 'active',
          priority: 'high',
          progress: 35,
          dueDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTeam: [
            { _id: 'u-007', fullName: 'Tom Wilson', jobTitle: 'Developer' },
            { _id: 'u-008', fullName: 'Emma Taylor', jobTitle: 'Designer' },
          ],
          customer: { name: 'James Thompson' },
          startDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          attachments: [
            { id: 'att-006', name: 'fitness-mockups.fig', size: 4403200, type: 'application/figma', url: '#', uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
          ]
        },
        '5': {
          _id: '5',
          name: 'Real Estate Portal',
          description: 'Real estate portal with property listings, virtual tours, and agent management.',
          status: 'active',
          priority: 'normal',
          progress: 15,
          dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTeam: [
            { _id: 'u-001', fullName: 'John Doe', jobTitle: 'Developer' },
            { _id: 'u-002', fullName: 'Jane Smith', jobTitle: 'Designer' },
          ],
          customer: { name: 'Lisa Anderson' },
          startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          attachments: [
            { id: 'att-007', name: 'real-estate-brief.pdf', size: 3041280, type: 'application/pdf', url: '#', uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 'att-008', name: 'design-guidelines.pdf', size: 1572864, type: 'application/pdf', url: '#', uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
          ]
        }
      }
      
      // Load project data based on ID
      const projectData = mockProjects[id] || {
        _id: id,
        name: 'Website Redesign',
        description: 'Complete overhaul of marketing site with CMS migration.',
        status: 'active',
        priority: 'high',
        progress: 68,
        dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTeam: [
          { _id: 'u-001', fullName: 'John Doe', jobTitle: 'Developer' },
          { _id: 'u-002', fullName: 'Jane Smith', jobTitle: 'Designer' },
        ],
        customer: { name: 'Acme Corp' },
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [
          { id: 'att-001', name: 'project-brief.pdf', size: 1024000, type: 'application/pdf', url: '#', uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
          { id: 'att-002', name: 'wireframes.fig', size: 2048000, type: 'application/figma', url: '#', uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
          { id: 'att-003', name: 'requirements.docx', size: 512000, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', url: '#', uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        ]
      }
      
      setProject(projectData)
      setMilestones([
        { _id: 'm-001', title: 'M1 - UI/UX', description: 'Wireframes and designs', status: 'in-progress', priority: 'high', sequence: 1, progress: 45, dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), assignedTo: [{ _id: 'u-002' }] },
        { _id: 'm-002', title: 'M2 - Build', description: 'Frontend implementation', status: 'pending', priority: 'normal', sequence: 2, progress: 0, dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), assignedTo: [] },
      ])
      setTasks([
        { _id: 't-001', title: 'Hero section', status: 'in-progress', priority: 'high', assignedTo: [{ fullName: 'John Doe' }], dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
        { _id: 't-002', title: 'CTA tracking', status: 'pending', priority: 'normal', assignedTo: [], dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() }
      ])
      setIsLoading(false)
    }
    load()
  }, [id])

  useEffect(() => {
    if (!project?.dueDate) { setTimeLeft('No due date'); return }
    const calc = () => {
      const now = new Date(); const due = new Date(project.dueDate)
      const diff = due.getTime() - now.getTime()
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        setTimeLeft(days > 0 ? `${days}d ${hours}h` : `${hours}h`)
      } else {
        const overdueDays = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24))
        setTimeLeft(`${overdueDays}d overdue`)
      }
    }
    calc(); const i = setInterval(calc, 60000); return () => clearInterval(i)
  }, [project?.dueDate])

  const tabs = [
    { key: 'overview', label: 'Overview', icon: TrendingUp },
    { key: 'milestones', label: 'Milestones', icon: Target },
    { key: 'tasks', label: 'Tasks', icon: CheckSquare },
    { key: 'team', label: 'Team', icon: Users }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'active':
      case 'in-progress': return 'bg-primary/10 text-primary border-primary/20'
      case 'planning':
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'on-hold': return 'bg-orange-100 text-orange-800 border-orange-200'
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

  const getCountdownColor = () => {
    if (!project?.dueDate) return 'text-gray-600'
    const now = new Date(); const due = new Date(project.dueDate)
    const diff = due.getTime() - now.getTime(); const days = Math.floor(diff / (1000*60*60*24))
    if (diff < 0) return 'text-red-600'; if (days <= 1) return 'text-orange-600'; if (days <= 3) return 'text-yellow-600'; return 'text-blue-600'
  }

  const handleUploadChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewAttachment(file)
      setIsUploading(true)
      setTimeout(() => {
        setIsUploading(false)
        setNewAttachment(null)
        // In real app, upload file and add to project attachments
      }, 1500)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄'
    if (type.includes('image')) return '🖼️'
    if (type.includes('video')) return '🎥'
    if (type.includes('word') || type.includes('document')) return '📝'
    if (type.includes('figma') || type.includes('fig')) return '🎨'
    return '📎'
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-6 border border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/20 rounded-2xl"><TrendingUp className="h-6 w-6 text-primary" /></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Project Progress</h3>
                <p className="text-sm text-gray-600">Overall completion status</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{project.progress || 0}%</div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-primary to-primary-dark h-3 rounded-full transition-all duration-500" style={{ width: `${project.progress || 0}%` }}></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-100 rounded-xl"><CheckSquare className="h-5 w-5 text-green-600" /></div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
                <div className="text-xs text-gray-500">Total Tasks</div>
              </div>
            </div>
            <div className="text-xs text-gray-600">{tasks.filter(t => t.status === 'completed').length} completed</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-xl"><Users className="h-5 w-5 text-blue-600" /></div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{project.assignedTeam?.length || 0}</div>
                <div className="text-xs text-gray-500">Team Members</div>
              </div>
            </div>
            <div className="text-xs text-gray-600">Active contributors</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-xl"><Calendar className="h-5 w-5 text-purple-600" /></div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">Timeline</div>
                  <div className="text-sm text-gray-600">Project deadline</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${getCountdownColor()}`}>{timeLeft}</div>
                <div className="text-xs text-gray-500">{new Date(project.dueDate).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attachments */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
              <Paperclip className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 truncate">Attachments</h3>
            <span className="text-sm text-gray-500 shrink-0">({project.attachments?.length || 0})</span>
          </div>
          <label className="flex items-center space-x-1.5 bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-colors cursor-pointer shrink-0">
            <Upload className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Upload</span>
            <input type="file" onChange={handleUploadChange} className="hidden" accept=".pdf,.png,.jpg,.jpeg,.docx,.mp4,.fig,.txt,.zip" />
          </label>
        </div>
        
        {isUploading && (
          <div className="mb-3 p-2 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
              <span className="text-xs text-blue-600">Uploading...</span>
            </div>
          </div>
        )}
        
        {newAttachment && (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <span className="text-lg shrink-0">{getFileIcon(newAttachment.type || 'file')}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-900 truncate">{newAttachment.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(newAttachment.size)}</p>
                </div>
              </div>
              <button onClick={() => setNewAttachment(null)} className="p-1 text-gray-400 hover:text-gray-600 shrink-0">
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {project.attachments && project.attachments.length > 0 ? (
          <div className="space-y-2">
            {project.attachments.map((att) => (
              <div key={att.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <span className="text-lg shrink-0">{getFileIcon(att.type)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-900 truncate">{att.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(att.size)} • {new Date(att.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 shrink-0">
                  <a 
                    href={att.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </a>
                  <a 
                    href={att.url} 
                    download={att.name} 
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : !newAttachment && (
          <div className="text-center py-6">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Paperclip className="h-4 w-4 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No attachments yet</h3>
            <p className="text-xs text-gray-600">Upload files to share with your team</p>
          </div>
        )}
      </div>

      {/* Project Information */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-primary/20 rounded-xl"><FileText className="h-5 w-5 text-primary" /></div>
          <h3 className="text-lg font-bold text-gray-900">Project Information</h3>
        </div>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">{project.customer?.name ? project.customer.name.split(' ').map(w=>w[0]).join('').substring(0,2) : 'C'}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary/80 uppercase tracking-wide mb-1">Client</p>
            <p className="text-lg font-bold text-gray-900">{project.customer?.name || 'No client assigned'}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/50 rounded-xl p-4 border border-primary/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg"><Calendar className="h-4 w-4 text-green-600" /></div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Start Date</p>
                <p className="text-sm font-bold text-gray-900">{project.startDate ? new Date(project.startDate).toLocaleDateString('en-US', {year:'numeric', month:'short', day:'numeric'}) : 'Not set'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/50 rounded-xl p-4 border border-primary/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg"><Clock className="h-4 w-4 text-orange-600" /></div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Due Date</p>
                <p className="text-sm font-bold text-gray-900">{project.dueDate ? new Date(project.dueDate).toLocaleDateString('en-US', {year:'numeric', month:'short', day:'numeric'}) : 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMilestones = () => (
    <div className="space-y-4">
      {milestones.length === 0 ? (
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No milestones yet</h3>
          <p className="text-gray-600 mb-4">Create your first milestone to track progress</p>
          <button onClick={() => setIsMilestoneFormOpen(true)} className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-2 rounded-full text-sm font-medium">Add Milestone</button>
        </div>
      ) : (
        milestones.map((m) => (
          <div key={m._id} onClick={() => navigate(`/pm-milestone/${m._id}?projectId=${id}`)} className="group bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3 flex-1">
                <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl"><Target className="h-5 w-5 text-primary" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors duration-300">{m.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(m.status)}`}>{m.status}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(m.priority)}`}>{m.priority}</span>
                    <span className="text-xs text-gray-500">Seq: {m.sequence || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{m.description || 'No description available'}</p>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Progress</span><span className="text-gray-900 font-medium">{m.progress || 0}%</span></div>
              <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full transition-all duration-300" style={{ width: `${m.progress || 0}%` }}></div></div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-1"><Calendar className="h-4 w-4" /><span>Due: {m.dueDate ? new Date(m.dueDate).toLocaleDateString() : 'No date'}</span></div>
              <div className="flex items-center space-x-1"><User className="h-4 w-4" /><span>{m.assignedTo?.length || 0} assigned</span></div>
            </div>
          </div>
        ))
      )}
    </div>
  )

  const renderTasks = () => (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-600 mb-4">Create your first task to get started</p>
          <button onClick={() => setIsTaskFormOpen(true)} className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-2 rounded-full text-sm font-medium">Add Task</button>
        </div>
      ) : (
        tasks.map((task) => (
          <div key={task._id} onClick={() => navigate(`/pm-task/${task._id}?projectId=${id}`)} className="group bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${task.status === 'completed' ? 'bg-primary border-primary' : 'border-gray-300 group-hover:border-primary'}`}>{task.status === 'completed' && (<CheckSquare className="h-3 w-3 text-white" />)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-base font-semibold ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900 group-hover:text-primary'}`}>{task.title}</h3>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1.5"><User className="h-3.5 w-3.5" /><span>{task.assignedTo?.[0]?.fullName || 'Unassigned'}</span></div>
                  <div className="flex items-center space-x-1.5"><Calendar className="h-3.5 w-3.5" /><span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}</span></div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )

  const renderTeam = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {(project?.assignedTeam || []).length === 0 ? (
        <div className="col-span-2 text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members assigned</h3>
          <p className="text-gray-600">Team members will appear here when assigned to the project</p>
        </div>
      ) : (
        project.assignedTeam.map((member) => (
          <div key={member._id} className="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all duration-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center"><span className="text-base font-bold text-primary">{member.fullName.split(' ').map(w=>w[0]).join('').substring(0,2)}</span></div>
              <div className="flex-1"><h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors duration-200">{member.fullName}</h3><p className="text-sm text-gray-600">{member.jobTitle || 'Team Member'}</p></div>
            </div>
          </div>
        ))
      )}
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview()
      case 'milestones': return renderMilestones()
      case 'tasks': return renderTasks()
      case 'team': return renderTeam()
      default: return renderOverview()
    }
  }

  if (isLoading || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
        <PM_navbar />
        <main className="pt-16 pb-24 md:pt-20 md:pb-8">
          <div className="px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
            <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /><span className="ml-2 text-gray-600">Loading project details...</span></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
      <PM_navbar />
      <main className="pt-16 pb-24 md:pt-20 md:pb-8">
        <div className="px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
          {/* Mobile header card */}
          <div className="md:hidden mb-8">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl"><FolderKanban className="h-6 w-6 text-primary" /></div>
                    <h1 className="text-lg md:text-xl font-semibold text-gray-900 leading-tight line-clamp-2">{project.name}</h1>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className={`text-sm font-semibold ${getCountdownColor()}`}>{timeLeft}</div>
                  <div className="text-xs text-gray-500 mt-1">Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No date'}</div>
                </div>
              </div>
              <div className="mb-6"><p className="text-sm text-gray-600 leading-relaxed">{project.description}</p></div>
              <div className="flex items-center space-x-2 mb-6 overflow-x-auto">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(project.status)}`}>{project.status}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPriorityColor(project.priority)}`}>{project.priority}</span>
              </div>
              <div className="space-y-3">
                <div className="flex space-x-3">
                  <button onClick={() => setIsMilestoneFormOpen(true)} className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"><Target className="h-5 w-5" /><span className="font-semibold text-sm">Add Milestone</span></button>
                  <button onClick={() => setIsTaskFormOpen(true)} className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"><Plus className="h-5 w-5" /><span className="font-semibold text-sm">Add Task</span></button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden md:block mb-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl"><FolderKanban className="h-8 w-8 text-primary" /></div>
                  <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 line-clamp-2">{project.name}</h1>
                </div>
                <div className="flex-shrink-0 text-right"><div className={`text-lg font-semibold ${getCountdownColor()}`}>{timeLeft}</div><div className="text-sm text-gray-500 mt-1">Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No date'}</div></div>
              </div>
              <div className="mb-6"><p className="text-lg text-gray-600 leading-relaxed">{project.description}</p></div>
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(project.status)}`}>{project.status}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPriorityColor(project.priority)}`}>{project.priority}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button onClick={() => setIsMilestoneFormOpen(true)} className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center space-x-2"><Target className="h-5 w-5" /><span className="font-semibold">Add Milestone</span></button>
                  <button onClick={() => setIsTaskFormOpen(true)} className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center space-x-2"><Plus className="h-5 w-5" /><span className="font-semibold">Add Task</span></button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile tabs */}
          <div className="md:hidden mb-6">
            <div className="grid grid-cols-2 gap-3">
              {tabs.map(t => { const I = t.icon; return (
                <button key={t.key} onClick={() => setActiveTab(t.key)} className={`p-4 rounded-2xl shadow-sm border transition-all ${activeTab === t.key ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-600 border-gray-200 active:scale-95'}`}>
                  <div className="flex flex-col items-center space-y-2"><I className="h-6 w-6" /><span className="text-sm font-medium">{t.label}</span></div>
                </button>
              )})}
            </div>
          </div>

          {/* Desktop tabs */}
          <div className="hidden md:block mb-8">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              {tabs.map(t => { const I = t.icon; return (
                <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${activeTab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                  <I className="h-4 w-4" /><span>{t.label}</span>
                </button>
              )})}
            </div>
          </div>

          <div className="min-h-[400px]">{activeTab === 'overview' ? renderOverview() : activeTab === 'milestones' ? renderMilestones() : activeTab === 'tasks' ? renderTasks() : renderTeam()}</div>
        </div>
      </main>

      <PM_milestone_form isOpen={isMilestoneFormOpen} onClose={() => setIsMilestoneFormOpen(false)} onSubmit={() => { setIsMilestoneFormOpen(false); }} projectId={project?._id} />
      <PM_task_form isOpen={isTaskFormOpen} onClose={() => setIsTaskFormOpen(false)} onSubmit={() => { setIsTaskFormOpen(false); }} projectId={project?._id} />
    </div>
  )
}

export default PM_project_detail
