import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
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
  FiSearch
} from 'react-icons/fi'
import SL_navbar from '../SL-components/SL_navbar'

const SL_notice_board = () => {
  const navigate = useNavigate()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Mock notice data
  const noticesData = [
    {
      id: 1,
      type: 'text',
      title: 'Monthly Sales Target Update',
      content: 'Great job team! We have achieved 85% of our monthly target. Let\'s push for the remaining 15% in the final week. Focus on closing pending deals and following up with hot leads.',
      author: 'Admin',
      date: '2024-01-15',
      time: '10:30 AM',
      priority: 'high',
      views: 45
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
      views: 32
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
      views: 67
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
      views: 28
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
      views: 19
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
      views: 41
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
      views: 38
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
      views: 15
    }
  ]

  const filters = [
    { id: 'all', label: 'All Notices', icon: FiFileText },
    { id: 'text', label: 'Text', icon: FiFileText },
    { id: 'image', label: 'Images', icon: FiImage },
    { id: 'video', label: 'Videos', icon: FiVideo }
  ]

  const filteredNotices = noticesData.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || notice.type === selectedFilter
    return matchesSearch && matchesFilter
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
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

  // Text Notice Card Component
  const TextNoticeCard = ({ notice }) => {
    const TypeIcon = getTypeIcon(notice.type)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className={`bg-gradient-to-br ${getTypeColor(notice.type)} rounded-xl p-4 border shadow-sm hover:shadow-md transition-all duration-300`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <TypeIcon className="text-white text-sm" />
            </div>
            <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">Text Notice</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{notice.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{notice.content}</p>

        <div className="flex items-center justify-between text-xs text-gray-500">
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
      </motion.div>
    )
  }

  // Image Notice Card Component
  const ImageNoticeCard = ({ notice }) => {
    const TypeIcon = getTypeIcon(notice.type)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className={`bg-gradient-to-br ${getTypeColor(notice.type)} rounded-xl p-4 border shadow-sm hover:shadow-md transition-all duration-300`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <TypeIcon className="text-white text-sm" />
            </div>
            <span className="text-xs font-medium text-purple-700 uppercase tracking-wide">Image Notice</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">{notice.title}</h3>
        
        <div className="mb-3">
          <img 
            src={notice.imageUrl} 
            alt={notice.title}
            className="w-full h-32 object-cover rounded-lg shadow-sm"
          />
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{notice.content}</p>

        <div className="flex items-center justify-between text-xs text-gray-500">
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
      </motion.div>
    )
  }

  // Video Notice Card Component
  const VideoNoticeCard = ({ notice }) => {
    const TypeIcon = getTypeIcon(notice.type)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className={`bg-gradient-to-br ${getTypeColor(notice.type)} rounded-xl p-4 border shadow-sm hover:shadow-md transition-all duration-300`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
              <TypeIcon className="text-white text-sm" />
            </div>
            <span className="text-xs font-medium text-pink-700 uppercase tracking-wide">Video Notice</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">{notice.title}</h3>
        
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

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{notice.content}</p>

        <div className="flex items-center justify-between text-xs text-gray-500">
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
      </motion.div>
    )
  }

  // Notice Card Renderer
  const NoticeCard = ({ notice }) => {
    switch (notice.type) {
      case 'text':
        return <TextNoticeCard notice={notice} />
      case 'image':
        return <ImageNoticeCard notice={notice} />
      case 'video':
        return <VideoNoticeCard notice={notice} />
      default:
        return <TextNoticeCard notice={notice} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SL_navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        
        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 shadow-md border border-teal-200/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                    <FiFileText className="text-white text-lg" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-bold text-teal-900 leading-tight">
                      Notice Board
                    </h1>
                    <p className="text-teal-700 text-xs font-medium mt-0.5">
                      Latest updates and announcements
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg px-4 py-3 shadow-md border border-white/20 ml-3">
                  <div className="text-center">
                    <p className="text-xs text-teal-600 font-medium mb-0.5">Total</p>
                    <p className="text-2xl font-bold text-teal-900 leading-none">{noticesData.length}</p>
                    <p className="text-xs text-teal-600 font-medium mt-0.5">Notices</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4"
          >
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notices..."
                className="w-full pl-8 pr-12 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
                  showFilters 
                    ? 'bg-teal-500 text-white shadow-md' 
                    : 'text-gray-500 hover:text-teal-600 hover:bg-teal-50 border border-teal-200'
                }`}
              >
                <FiFilter className="text-base" />
              </button>
            </div>
          </motion.div>

          {/* Filters */}
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap gap-2 mb-4"
            >
              {filters.map((filter) => {
                const FilterIcon = filter.icon
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      selectedFilter === filter.id
                        ? 'bg-teal-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FilterIcon className="text-sm" />
                    <span>{filter.label}</span>
                  </button>
                )
              })}
            </motion.div>
          )}

          {/* Results Count */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-4"
          >
            <p className="text-gray-600 text-sm">
              Showing {filteredNotices.length} of {noticesData.length} notices
            </p>
          </motion.div>

          {/* Mobile Notices Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4"
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

            {/* Empty State */}
            {filteredNotices.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiFileText className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No notices found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search criteria or filters.' : 'No notices match your current filters.'}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-8">
            
            {/* Main Content - 8 columns */}
            <div className="col-span-8 space-y-6">
              
              {/* Desktop Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-between"
              >
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Notice Board</h1>
                  <p className="text-gray-600 mt-2">Latest updates and announcements from admin</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl">
                    <span className="text-sm font-semibold">Total: {noticesData.length}</span>
                  </div>
                  <div className="bg-white text-gray-600 px-6 py-3 rounded-xl border border-gray-200">
                    <span className="text-sm font-semibold">Showing: {filteredNotices.length}</span>
                  </div>
                </div>
              </motion.div>

              {/* Desktop Search & Filters */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-600 text-xl" />
                    <input
                      type="text"
                      placeholder="Search notices by title, content, or author..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-16 py-4 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 text-lg"
                    />
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
                        showFilters 
                          ? 'bg-teal-500 text-white shadow-md' 
                          : 'text-gray-500 hover:text-teal-600 hover:bg-teal-50 border border-teal-200'
                      }`}
                    >
                      <FiFilter className="text-lg" />
                    </button>
                  </div>
                </div>
                
                {/* Filters */}
                {showFilters && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-wrap gap-2"
                  >
                    {filters.map((filter) => {
                      const FilterIcon = filter.icon
                      return (
                        <button
                          key={filter.id}
                          onClick={() => setSelectedFilter(filter.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                            selectedFilter === filter.id
                              ? 'bg-teal-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <FilterIcon className="text-sm" />
                          <span>{filter.label}</span>
                        </button>
                      )
                    })}
                  </motion.div>
                )}
              </motion.div>

              {/* Desktop Notices Grid */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
                    <p className="text-gray-600 text-lg">
                      {searchTerm ? 'Try adjusting your search criteria or filters.' : 'No notices match your current filters.'}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar - 4 columns */}
            <div className="col-span-4 space-y-6">
            
              {/* Stats Overview */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 shadow-xl border border-teal-200/50"
              >
                <h3 className="text-lg font-bold text-teal-900 mb-4">Notice Statistics</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-teal-700 text-sm font-medium">Total Notices</span>
                    <span className="text-teal-900 text-xl font-bold">{noticesData.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-700 text-sm font-medium">Text Notices</span>
                    <span className="text-teal-900 text-xl font-bold">{noticesData.filter(n => n.type === 'text').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-700 text-sm font-medium">Image Notices</span>
                    <span className="text-teal-900 text-xl font-bold">{noticesData.filter(n => n.type === 'image').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-700 text-sm font-medium">Video Notices</span>
                    <span className="text-teal-900 text-xl font-bold">{noticesData.filter(n => n.type === 'video').length}</span>
                  </div>
                </div>
              </motion.div>

              {/* Recent Notices */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Notices</h3>
                
                <div className="space-y-3">
                  {noticesData.slice(0, 3).map((notice) => {
                    const TypeIcon = getTypeIcon(notice.type)
                    return (
                      <div key={notice.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                          <TypeIcon className="text-teal-600 text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{notice.title}</p>
                          <p className="text-xs text-gray-600">{notice.date}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 1.0 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button className="w-full bg-teal-500 text-white font-semibold py-3 px-4 rounded-xl hover:bg-teal-600 transition-colors duration-200 flex items-center justify-center space-x-2">
                    <FiDownload className="text-lg" />
                    <span>Download All</span>
                  </button>
                  
                  <button className="w-full bg-white text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
                    <FiEye className="text-lg" />
                    <span>Mark All Read</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SL_notice_board
