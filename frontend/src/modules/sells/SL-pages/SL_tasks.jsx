import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  FiArrowLeft, 
  FiSearch, 
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiClock,
  FiCalendar,
  FiFlag,
  FiX
} from 'react-icons/fi'
import SL_navbar from '../SL-components/SL_navbar'

const SL_tasks = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: 'work'
  })

  // Mock tasks data
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Follow up with John Smith',
      description: 'Call John about the demo request and schedule a meeting',
      priority: 'high',
      dueDate: '2024-01-20',
      category: 'work',
      completed: false,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Prepare presentation slides',
      description: 'Create slides for the client presentation next week',
      priority: 'medium',
      dueDate: '2024-01-22',
      category: 'work',
      completed: false,
      createdAt: '2024-01-14'
    },
    {
      id: 3,
      title: 'Update project documentation',
      description: 'Review and update all project documentation',
      priority: 'low',
      dueDate: '2024-01-25',
      category: 'work',
      completed: true,
      createdAt: '2024-01-13'
    },
    {
      id: 4,
      title: 'Team meeting preparation',
      description: 'Prepare agenda and materials for weekly team meeting',
      priority: 'high',
      dueDate: '2024-01-18',
      category: 'work',
      completed: false,
      createdAt: '2024-01-12'
    },
    {
      id: 5,
      title: 'Client feedback review',
      description: 'Review client feedback and prepare response',
      priority: 'medium',
      dueDate: '2024-01-21',
      category: 'work',
      completed: false,
      createdAt: '2024-01-11'
    }
  ])

  const filters = [
    { id: 'all', label: 'All Tasks' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'high', label: 'High Priority' },
    { id: 'medium', label: 'Medium Priority' },
    { id: 'low', label: 'Low Priority' }
  ]

  const priorities = [
    { id: 'high', label: 'High Priority', color: 'text-red-600 bg-red-50 border-red-200' },
    { id: 'medium', label: 'Medium Priority', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
    { id: 'low', label: 'Low Priority', color: 'text-green-600 bg-green-50 border-green-200' }
  ]

  const categories = [
    { id: 'work', label: 'Work' },
    { id: 'personal', label: 'Personal' },
    { id: 'urgent', label: 'Urgent' }
  ]

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesFilter = true
    if (selectedFilter === 'pending') {
      matchesFilter = !task.completed
    } else if (selectedFilter === 'completed') {
      matchesFilter = task.completed
    } else if (['high', 'medium', 'low'].includes(selectedFilter)) {
      matchesFilter = task.priority === selectedFilter
    }
    
    return matchesSearch && matchesFilter
  })

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.id === priority)
    return priorityObj ? priorityObj.color : 'text-gray-600 bg-gray-50 border-gray-200'
  }

  const getPriorityLabel = (priority) => {
    const priorityObj = priorities.find(p => p.id === priority)
    return priorityObj ? priorityObj.label : 'Medium Priority'
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      category: 'work'
    })
    setShowTaskDialog(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setTaskForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      category: task.category
    })
    setShowTaskDialog(true)
  }

  const handleTaskFormChange = (field, value) => {
    setTaskForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveTask = () => {
    if (!taskForm.title.trim()) return

    if (editingTask) {
      // Update existing task
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...taskForm }
          : task
      ))
    } else {
      // Add new task
      const newTask = {
        id: Date.now(),
        ...taskForm,
        completed: false,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setTasks(prev => [newTask, ...prev])
    }

    setShowTaskDialog(false)
    setEditingTask(null)
  }

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const handleToggleComplete = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ))
  }

  const handleCloseDialog = () => {
    setShowTaskDialog(false)
    setEditingTask(null)
    setShowPriorityDropdown(false)
    setShowCategoryDropdown(false)
  }

  const handlePrioritySelect = (priority) => {
    setTaskForm(prev => ({ ...prev, priority }))
    setShowPriorityDropdown(false)
  }

  const handleCategorySelect = (category) => {
    setTaskForm(prev => ({ ...prev, category }))
    setShowCategoryDropdown(false)
  }

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
    high: tasks.filter(t => t.priority === 'high' && !t.completed).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SL_navbar />
      
      <main className="max-w-4xl mx-auto px-4 pt-16 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <FiArrowLeft className="text-xl text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Tasks</h1>
              <p className="text-gray-600 text-sm">Manage your personal tasks</p>
            </div>
          </div>
          <button
            onClick={handleAddTask}
            className="flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-200"
          >
            <FiPlus className="text-sm" />
            <span className="text-sm font-medium">Add Task</span>
          </button>
        </div>

        {/* Summary Card */}
        <div className="bg-teal-500 rounded-xl p-5 mb-4 text-white">
          <div className="flex items-center justify-between">
            {/* Left Section - Total */}
            <div>
              <h2 className="text-sm font-medium mb-2">Total Tasks</h2>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            
            {/* Right Section - Status Breakdown */}
            <div className="flex items-center space-x-6">
              {/* Pending */}
              <div className="text-center">
                <p className="text-lg font-bold mb-1">{stats.pending}</p>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
                  <span className="text-sm">Pending</span>
                </div>
              </div>
              
              {/* Completed */}
              <div className="text-center">
                <p className="text-lg font-bold mb-1">{stats.completed}</p>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                  <span className="text-sm">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3 mb-4">
          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600 text-sm" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  selectedFilter === filter.id
                    ? 'bg-teal-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <FiCheck className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No tasks found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                      task.completed
                        ? 'bg-teal-500 border-teal-500 text-white shadow-sm'
                        : 'border-gray-300 hover:border-teal-500 hover:bg-teal-50'
                    }`}
                  >
                    {task.completed && <FiCheck className="text-sm" />}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title and Actions */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-bold text-gray-900 text-base leading-tight ${
                        task.completed ? 'line-through text-gray-500' : ''
                      }`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                          title="Edit Task"
                        >
                          <FiEdit2 className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                          title="Delete Task"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    {task.description && (
                      <p className={`text-sm text-gray-600 mb-3 leading-relaxed ${
                        task.completed ? 'line-through text-gray-400' : ''
                      }`}>
                        {task.description}
                      </p>
                    )}
                    
                    {/* Tags and Info */}
                    <div className="flex items-center flex-wrap gap-2">
                      {/* Priority */}
                      <div className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                        <FiFlag className="inline w-3 h-3 mr-1" />
                        {getPriorityLabel(task.priority)}
                      </div>
                      
                      {/* Due Date */}
                      {task.dueDate && (
                        <div className="flex items-center space-x-1 text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                          <FiCalendar className="w-3 h-3" />
                          <span>{task.dueDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Task Dialog */}
        {showTaskDialog && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCloseDialog()
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-lg mx-4 sm:mx-0 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {editingTask ? 'Edit Task' : 'Add New Task'}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {editingTask ? 'Update your task details' : 'Create a new task to stay organized'}
                  </p>
                </div>
                <button
                  onClick={handleCloseDialog}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0 ml-2"
                >
                  <FiX className="text-lg sm:text-xl text-gray-600" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4 sm:space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => handleTaskFormChange('title', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 text-sm sm:text-base"
                    placeholder="What needs to be done?"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => handleTaskFormChange('description', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 resize-none text-sm sm:text-base"
                    rows={3}
                    placeholder="Add more details about this task..."
                  />
                </div>

                {/* Priority and Category Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Priority */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Priority
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPriorityDropdown(!showPriorityDropdown)
                        setShowCategoryDropdown(false)
                      }}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 text-left flex items-center justify-between bg-white text-sm sm:text-base"
                    >
                      <span className="text-gray-900 truncate">
                        {priorities.find(p => p.id === taskForm.priority)?.label || 'Select Priority'}
                      </span>
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
                          showPriorityDropdown ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Priority Dropdown */}
                    {showPriorityDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg"
                      >
                        <div className="py-1">
                          {priorities.map((priority) => (
                            <button
                              key={priority.id}
                              type="button"
                              onClick={() => handlePrioritySelect(priority.id)}
                              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base ${
                                taskForm.priority === priority.id ? 'bg-teal-50 text-teal-700' : 'text-gray-900'
                              }`}
                            >
                              <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                                priority.id === 'high' ? 'bg-red-500' :
                                priority.id === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}></div>
                              <span className="font-medium truncate">{priority.label}</span>
                              {taskForm.priority === priority.id && (
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-auto text-teal-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Category */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCategoryDropdown(!showCategoryDropdown)
                        setShowPriorityDropdown(false)
                      }}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 text-left flex items-center justify-between bg-white text-sm sm:text-base"
                    >
                      <span className="text-gray-900 truncate">
                        {categories.find(c => c.id === taskForm.category)?.label || 'Select Category'}
                      </span>
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
                          showCategoryDropdown ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Category Dropdown */}
                    {showCategoryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg"
                      >
                        <div className="py-1">
                          {categories.map((category) => (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => handleCategorySelect(category.id)}
                              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base ${
                                taskForm.category === category.id ? 'bg-teal-50 text-teal-700' : 'text-gray-900'
                              }`}
                            >
                              <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                                category.id === 'work' ? 'bg-blue-500' :
                                category.id === 'personal' ? 'bg-green-500' : 'bg-orange-500'
                              }`}></div>
                              <span className="font-medium truncate">{category.label}</span>
                              {taskForm.category === category.id && (
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-auto text-teal-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => handleTaskFormChange('dueDate', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mt-6 sm:mt-8">
                <button
                  onClick={handleCloseDialog}
                  className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTask}
                  disabled={!taskForm.title.trim()}
                  className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-sm sm:text-base"
                >
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )
}

export default SL_tasks
