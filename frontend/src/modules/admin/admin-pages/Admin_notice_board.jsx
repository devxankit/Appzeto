import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Admin_navbar from '../admin-components/Admin_navbar'
import Admin_sidebar from '../admin-components/Admin_sidebar'
import { 
  FiFileText, 
  FiImage, 
  FiVideo,
  FiCalendar,
  FiUser,
  FiClock,
  FiEye,
  FiDownload,
  FiPlay,
  FiFilter,
  FiSearch,
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiUpload,
  FiX,
  FiSave,
  FiAlertCircle,
  FiCheckCircle,
  FiUsers,
  FiTarget,
  FiTrendingUp,
  FiBell,
  FiSettings,
  FiRefreshCw
} from 'react-icons/fi'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Combobox } from '../../../components/ui/combobox'
import Loading from '../../../components/ui/loading'

const Admin_notice_board = () => {
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('text')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState(null)
  const [noticesData, setNoticesData] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'text',
    priority: 'medium',
    targetAudience: 'all',
    imageUrl: '',
    videoUrl: '',
    imageFile: null,
    videoFile: null,
    attachments: [],
    scheduledDate: '',
    scheduledTime: '',
    isScheduled: false,
    isPinned: false
  })

  // Mock notices data - in real app, this would come from API
  const initialNoticesData = [
    {
      id: 1,
      type: 'text',
      title: 'Monthly Sales Target Update',
      content: 'Great job team! We have achieved 85% of our monthly target. Let\'s push for the remaining 15% in the final week. Focus on closing pending deals and following up with hot leads.',
      author: 'Admin',
      date: '2024-01-15',
      time: '10:30 AM',
      priority: 'high',
      views: 45,
      targetAudience: 'sales',
      isPinned: true,
      status: 'published',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      type: 'image',
      title: 'New Product Launch Guidelines',
      content: 'Please review the attached guidelines for our upcoming product launch campaign.',
      imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
      author: 'Admin',
      date: '2024-01-14',
      time: '2:15 PM',
      priority: 'medium',
      views: 32,
      targetAudience: 'all',
      isPinned: false,
      status: 'published',
      createdAt: '2024-01-14T14:15:00Z'
    },
    {
      id: 3,
      type: 'video',
      title: 'Sales Training Session Recording',
      content: 'Watch the latest sales training session to improve your closing techniques.',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      author: 'Admin',
      date: '2024-01-13',
      time: '9:00 AM',
      priority: 'high',
      views: 67,
      targetAudience: 'sales',
      isPinned: false,
      status: 'published',
      createdAt: '2024-01-13T09:00:00Z'
    },
    {
      id: 4,
      type: 'text',
      title: 'Holiday Schedule Announcement',
      content: 'Please note that the office will be closed on January 26th for Republic Day. All pending work should be completed by January 25th.',
      author: 'Admin',
      date: '2024-01-12',
      time: '4:45 PM',
      priority: 'medium',
      views: 28,
      targetAudience: 'all',
      isPinned: true,
      status: 'published',
      createdAt: '2024-01-12T16:45:00Z'
    },
    {
      id: 5,
      type: 'image',
      title: 'Team Building Event Photos',
      content: 'Check out the amazing photos from our recent team building event!',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
      author: 'Admin',
      date: '2024-01-11',
      time: '11:20 AM',
      priority: 'low',
      views: 19,
      targetAudience: 'all',
      isPinned: false,
      status: 'published',
      createdAt: '2024-01-11T11:20:00Z'
    },
    {
      id: 6,
      type: 'video',
      title: 'Customer Success Stories',
      content: 'Learn from our top performers and their success strategies.',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      author: 'Admin',
      date: '2024-01-10',
      time: '3:30 PM',
      priority: 'medium',
      views: 41,
      targetAudience: 'all',
      isPinned: false,
      status: 'published',
      createdAt: '2024-01-10T15:30:00Z'
    },
    {
      id: 7,
      type: 'text',
      title: 'System Maintenance Notice',
      content: 'Our CRM system will undergo maintenance on Sunday, January 21st from 2:00 AM to 6:00 AM. Please save your work before this time.',
      author: 'Admin',
      date: '2024-01-09',
      time: '1:15 PM',
      priority: 'high',
      views: 38,
      targetAudience: 'all',
      isPinned: false,
      status: 'published',
      createdAt: '2024-01-09T13:15:00Z'
    },
    {
      id: 8,
      type: 'image',
      title: 'Office Renovation Progress',
      content: 'Here are the latest updates on our office renovation project.',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
      author: 'Admin',
      date: '2024-01-08',
      time: '5:00 PM',
      priority: 'low',
      views: 15,
      targetAudience: 'all',
      isPinned: false,
      status: 'draft',
      createdAt: '2024-01-08T17:00:00Z'
    }
  ]

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setNoticesData(initialNoticesData)
      setLoading(false)
    }, 1000)
  }, [])

  const tabs = [
    { id: 'text', label: 'Text', icon: FiFileText },
    { id: 'image', label: 'Images', icon: FiImage },
    { id: 'video', label: 'Videos', icon: FiVideo },
    { id: 'pinned', label: 'Pinned', icon: FiTarget },
    { id: 'draft', label: 'Drafts', icon: FiEdit3 }
  ]

  const targetAudienceOptions = [
    { value: 'all', label: 'All Employees' },
    { value: 'sales', label: 'Sales Team' },
    { value: 'development', label: 'Development Team' },
    { value: 'project-managers', label: 'Project Managers' },
    { value: 'hr', label: 'HR Team' },
    { value: 'admin', label: 'Admin Only' }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ]

  const typeOptions = [
    { value: 'text', label: 'Text Notice' },
    { value: 'image', label: 'Image Notice' },
    { value: 'video', label: 'Video Notice' }
  ]

  const filteredNotices = noticesData.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.author.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesTab = true
    if (selectedTab === 'pinned') {
      matchesTab = notice.isPinned
    } else if (selectedTab === 'draft') {
      matchesTab = notice.status === 'draft'
    } else {
      matchesTab = notice.type === selectedTab
    }
    
    return matchesSearch && matchesTab
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'text': return FiFileText
      case 'image': return FiImage
      case 'video': return FiVideo
      default: return FiFileText
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'text': return 'from-blue-50 to-blue-100 border-blue-200'
      case 'image': return 'from-purple-50 to-purple-100 border-purple-200'
      case 'video': return 'from-pink-50 to-pink-100 border-pink-200'
      default: return 'from-gray-50 to-gray-100 border-gray-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTargetAudienceColor = (audience) => {
    switch (audience) {
      case 'all': return 'bg-blue-100 text-blue-800'
      case 'sales': return 'bg-green-100 text-green-800'
      case 'development': return 'bg-purple-100 text-purple-800'
      case 'project-managers': return 'bg-orange-100 text-orange-800'
      case 'hr': return 'bg-pink-100 text-pink-800'
      case 'admin': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCreateNotice = () => {
    setFormData({
      title: '',
      content: '',
      type: 'text',
      priority: 'medium',
      targetAudience: 'all',
      imageUrl: '',
      videoUrl: '',
      imageFile: null,
      videoFile: null,
      attachments: [],
      scheduledDate: '',
      scheduledTime: '',
      isScheduled: false,
      isPinned: false
    })
    setShowCreateModal(true)
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setFormData({
        ...formData,
        imageFile: file,
        imageUrl: previewUrl
      })
    }
  }

  const handleVideoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        alert('Please select a valid video file')
        return
      }
      
      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        alert('Video size should be less than 50MB')
        return
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setFormData({
        ...formData,
        videoFile: file,
        videoUrl: previewUrl
      })
    }
  }

  const removeImage = () => {
    if (formData.imageUrl && formData.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(formData.imageUrl)
    }
    setFormData({
      ...formData,
      imageFile: null,
      imageUrl: ''
    })
  }

  const removeVideo = () => {
    if (formData.videoUrl && formData.videoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(formData.videoUrl)
    }
    setFormData({
      ...formData,
      videoFile: null,
      videoUrl: ''
    })
  }

  const handleEditNotice = (notice) => {
    setSelectedNotice(notice)
    setFormData({
      title: notice.title,
      content: notice.content,
      type: notice.type,
      priority: notice.priority,
      targetAudience: notice.targetAudience,
      imageUrl: notice.imageUrl || '',
      videoUrl: notice.videoUrl || '',
      attachments: notice.attachments || [],
      scheduledDate: notice.scheduledDate || '',
      scheduledTime: notice.scheduledTime || '',
      isScheduled: notice.isScheduled || false,
      isPinned: notice.isPinned || false
    })
    setShowEditModal(true)
  }

  const handleDeleteNotice = (notice) => {
    setSelectedNotice(notice)
    setShowDeleteModal(true)
  }

  const handleSaveNotice = () => {
    if (!formData.title || !formData.content) {
      alert('Please fill in all required fields')
      return
    }

    const newNotice = {
      id: noticesData.length + 1,
      ...formData,
      author: 'Admin',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      views: 0,
      status: formData.isScheduled ? 'scheduled' : 'published',
      createdAt: new Date().toISOString()
    }

    setNoticesData([newNotice, ...noticesData])
    setShowCreateModal(false)
    resetFormData()
  }

  const handleUpdateNotice = () => {
    if (!formData.title || !formData.content) {
      alert('Please fill in all required fields')
      return
    }

    const updatedNotices = noticesData.map(notice => 
      notice.id === selectedNotice.id 
        ? { 
            ...notice, 
            ...formData,
            status: formData.isScheduled ? 'scheduled' : 'published'
          }
        : notice
    )

    setNoticesData(updatedNotices)
    setShowEditModal(false)
    setSelectedNotice(null)
    resetFormData()
  }

  const handleConfirmDelete = () => {
    const updatedNotices = noticesData.filter(notice => notice.id !== selectedNotice.id)
    setNoticesData(updatedNotices)
    setShowDeleteModal(false)
    setSelectedNotice(null)
  }

  const togglePinNotice = (notice) => {
    const updatedNotices = noticesData.map(n => 
      n.id === notice.id 
        ? { ...n, isPinned: !n.isPinned }
        : n
    )
    setNoticesData(updatedNotices)
  }

  const resetFormData = () => {
    // Clean up any blob URLs
    if (formData.imageUrl && formData.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(formData.imageUrl)
    }
    if (formData.videoUrl && formData.videoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(formData.videoUrl)
    }
    
    setFormData({
      title: '',
      content: '',
      type: 'text',
      priority: 'medium',
      targetAudience: 'all',
      imageUrl: '',
      videoUrl: '',
      imageFile: null,
      videoFile: null,
      attachments: [],
      scheduledDate: '',
      scheduledTime: '',
      isScheduled: false,
      isPinned: false
    })
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
    setSelectedNotice(null)
    resetFormData()
  }

  // Notice Card Components
  const NoticeCard = ({ notice }) => {
    const TypeIcon = getTypeIcon(notice.type)
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className={`bg-gradient-to-br ${getTypeColor(notice.type)} rounded-xl p-4 border shadow-sm hover:shadow-md transition-all duration-300 relative`}
      >
        {/* Pin Indicator */}
        {notice.isPinned && (
          <div className="absolute top-2 right-2">
            <FiTarget className="h-4 w-4 text-orange-500" />
          </div>
        )}

        {/* Admin Actions */}
        <div className="absolute top-2 left-2 flex space-x-1">
          <button
            onClick={() => togglePinNotice(notice)}
            className={`p-1 rounded-full transition-colors ${
              notice.isPinned 
                ? 'bg-orange-100 text-orange-600' 
                : 'bg-gray-100 text-gray-400 hover:text-orange-600'
            }`}
          >
            <FiTarget className="h-3 w-3" />
          </button>
        </div>

        <div className="flex items-start justify-between mb-3 mt-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <TypeIcon className="text-white text-sm" />
            </div>
            <div>
              <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                {notice.type} Notice
              </span>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notice.status)}`}>
                  {notice.status}
                </span>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTargetAudienceColor(notice.targetAudience)}`}>
                  {notice.targetAudience}
                </span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{notice.title}</h3>
        
        {notice.type === 'image' && notice.imageUrl && (
          <div className="mb-3">
            <img 
              src={notice.imageUrl} 
              alt={notice.title}
              className="w-full h-32 object-cover rounded-lg shadow-sm"
            />
          </div>
        )}

        {notice.type === 'video' && notice.videoUrl && (
          <div className="relative mb-3">
            <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="flex items-center space-x-2 text-gray-500">
                <FiPlay className="text-2xl" />
                <span className="text-sm font-medium">Click to play video</span>
              </div>
            </div>
            <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200">
              <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                <FiPlay className="text-pink-500 text-xl ml-1" />
              </div>
            </button>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{notice.content}</p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <FiUser className="text-xs" />
              <span>{notice.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiCalendar className="text-xs" />
              <span>{notice.date}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <FiEye className="text-xs" />
            <span>{notice.views}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notice.priority)}`}>
            {notice.priority} priority
          </span>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEditNotice(notice)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <FiEdit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeleteNotice(notice)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Admin_navbar />
        <Admin_sidebar />
        <div className="ml-64 pt-20 p-8">
          <div className="max-w-7xl mx-auto">
            <Loading size="large" className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Admin_navbar />
      <Admin_sidebar />
      
      {/* Main Content */}
      <div className="ml-64 pt-20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notice Board Management</h1>
                <p className="text-gray-600 mt-2">Create and manage notices for all employees</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl">
                  <span className="text-sm font-semibold">Total: {noticesData.length}</span>
                </div>
                <div className="bg-white text-gray-600 px-6 py-3 rounded-xl border border-gray-200">
                  <span className="text-sm font-semibold">Showing: {filteredNotices.length}</span>
                </div>
                <Button
                  onClick={handleCreateNotice}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2"
                >
                  <FiPlus className="h-5 w-5" />
                  <span>Create Notice</span>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Search & Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 text-xl" />
                <input
                  type="text"
                  placeholder="Search notices by title, content, or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg"
                />
              </div>
            </div>
            
            {/* Tabs Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex flex-wrap gap-1 px-4">
                  {tabs.map((tab) => {
                    const TabIcon = tab.icon
                    const isActive = selectedTab === tab.id
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedTab(tab.id)}
                        className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-medium text-sm transition-colors rounded-t-lg ${
                          isActive
                            ? 'border-blue-500 text-blue-600 bg-blue-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <TabIcon className="h-4 w-4" />
                        <span className="whitespace-nowrap">{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Notices</p>
                    <p className="text-2xl font-bold text-blue-900">{noticesData.length}</p>
                  </div>
                  <FiFileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Published</p>
                    <p className="text-2xl font-bold text-green-900">{noticesData.filter(n => n.status === 'published').length}</p>
                  </div>
                  <FiCheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">Pinned</p>
                    <p className="text-2xl font-bold text-orange-900">{noticesData.filter(n => n.isPinned).length}</p>
                  </div>
                  <FiTarget className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Drafts</p>
                    <p className="text-2xl font-bold text-purple-900">{noticesData.filter(n => n.status === 'draft').length}</p>
                  </div>
                  <FiEdit3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notices Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredNotices.map((notice, index) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <NoticeCard notice={notice} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredNotices.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiFileText className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">No notices found</h3>
                <p className="text-gray-600 text-lg mb-6">
                  {searchTerm ? 'Try adjusting your search criteria or filters.' : 'No notices match your current filters.'}
                </p>
                <Button
                  onClick={handleCreateNotice}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto"
                >
                  <FiPlus className="h-5 w-5" />
                  <span>Create First Notice</span>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Create Notice Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Create New Notice</h3>
                <button onClick={closeModals} className="p-2 hover:bg-gray-100 rounded-full">
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveNotice(); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notice Type</label>
                    <Combobox
                      options={typeOptions}
                      value={formData.type}
                      onChange={(value) => setFormData({...formData, type: value})}
                      placeholder="Select type"
                      className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <Combobox
                      options={priorityOptions}
                      value={formData.priority}
                      onChange={(value) => setFormData({...formData, priority: value})}
                      placeholder="Select priority"
                      className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <Combobox
                    options={targetAudienceOptions}
                    value={formData.targetAudience}
                    onChange={(value) => setFormData({...formData, targetAudience: value})}
                    placeholder="Select audience"
                    className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter notice title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter notice content"
                    required
                  />
                </div>

                {formData.type === 'image' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image Upload</label>
                    
                    {!formData.imageUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center space-y-2"
                        >
                          <FiUpload className="h-8 w-8 text-gray-400" />
                          <span className="text-sm text-gray-600">Click to upload image</span>
                          <span className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</span>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-xl border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                        <div className="mt-2 text-xs text-gray-500">
                          {formData.imageFile ? `File: ${formData.imageFile.name}` : 'Image uploaded'}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {formData.type === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video Upload</label>
                    
                    {!formData.videoUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                          id="video-upload"
                        />
                        <label
                          htmlFor="video-upload"
                          className="cursor-pointer flex flex-col items-center space-y-2"
                        >
                          <FiUpload className="h-8 w-8 text-gray-400" />
                          <span className="text-sm text-gray-600">Click to upload video</span>
                          <span className="text-xs text-gray-500">MP4, MOV, AVI up to 50MB</span>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <video
                          src={formData.videoUrl}
                          controls
                          className="w-full h-48 object-cover rounded-xl border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={removeVideo}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                        <div className="mt-2 text-xs text-gray-500">
                          {formData.videoFile ? `File: ${formData.videoFile.name}` : 'Video uploaded'}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPinned}
                      onChange={(e) => setFormData({...formData, isPinned: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Pin this notice</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isScheduled}
                      onChange={(e) => setFormData({...formData, isScheduled: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Schedule for later</span>
                  </label>
                </div>

                {formData.isScheduled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Date</label>
                      <input
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Time</label>
                      <input
                        type="time"
                        value={formData.scheduledTime}
                        onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <FiSave className="h-4 w-4" />
                    <span>Create Notice</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Notice Modal */}
      <AnimatePresence>
        {showEditModal && selectedNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Edit Notice</h3>
                <button onClick={closeModals} className="p-2 hover:bg-gray-100 rounded-full">
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleUpdateNotice(); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notice Type</label>
                    <Combobox
                      options={typeOptions}
                      value={formData.type}
                      onChange={(value) => setFormData({...formData, type: value})}
                      placeholder="Select type"
                      className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <Combobox
                      options={priorityOptions}
                      value={formData.priority}
                      onChange={(value) => setFormData({...formData, priority: value})}
                      placeholder="Select priority"
                      className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <Combobox
                    options={targetAudienceOptions}
                    value={formData.targetAudience}
                    onChange={(value) => setFormData({...formData, targetAudience: value})}
                    placeholder="Select audience"
                    className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter notice title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter notice content"
                    required
                  />
                </div>

                {formData.type === 'image' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image Upload</label>
                    
                    {!formData.imageUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center space-y-2"
                        >
                          <FiUpload className="h-8 w-8 text-gray-400" />
                          <span className="text-sm text-gray-600">Click to upload image</span>
                          <span className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</span>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-xl border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                        <div className="mt-2 text-xs text-gray-500">
                          {formData.imageFile ? `File: ${formData.imageFile.name}` : 'Image uploaded'}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {formData.type === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video Upload</label>
                    
                    {!formData.videoUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                          id="video-upload"
                        />
                        <label
                          htmlFor="video-upload"
                          className="cursor-pointer flex flex-col items-center space-y-2"
                        >
                          <FiUpload className="h-8 w-8 text-gray-400" />
                          <span className="text-sm text-gray-600">Click to upload video</span>
                          <span className="text-xs text-gray-500">MP4, MOV, AVI up to 50MB</span>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <video
                          src={formData.videoUrl}
                          controls
                          className="w-full h-48 object-cover rounded-xl border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={removeVideo}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                        <div className="mt-2 text-xs text-gray-500">
                          {formData.videoFile ? `File: ${formData.videoFile.name}` : 'Video uploaded'}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPinned}
                      onChange={(e) => setFormData({...formData, isPinned: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Pin this notice</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isScheduled}
                      onChange={(e) => setFormData({...formData, isScheduled: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Schedule for later</span>
                  </label>
                </div>

                {formData.isScheduled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Date</label>
                      <input
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Time</label>
                      <input
                        type="time"
                        value={formData.scheduledTime}
                        onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <FiSave className="h-4 w-4" />
                    <span>Update Notice</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Delete Notice</h3>
                <button onClick={closeModals} className="p-2 hover:bg-gray-100 rounded-full">
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete the notice "{selectedNotice.title}"? This action cannot be undone.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <FiAlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-red-800 text-sm font-medium">This will permanently remove the notice from all employee views.</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={closeModals}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <FiTrash2 className="h-4 w-4" />
                  <span>Delete Notice</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Admin_notice_board
