import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Admin_navbar from '../admin-components/Admin_navbar'
import Admin_sidebar from '../admin-components/Admin_sidebar'
import Loading from '../../../components/ui/loading'
import { 
  FiGift,
  FiAward,
  FiDollarSign,
  FiStar,
  FiTarget,
  FiUsers,
  FiTrendingUp,
  FiCalendar,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiCode,
  FiShoppingCart,
  FiUser,
  FiBarChart,
  FiPieChart,
  FiActivity,
  FiSend,
  FiX,
  FiSave,
  FiSettings,
  FiCreditCard,
  FiShield,
  FiZap,
  FiHeart,
  FiCoffee,
  FiBook
} from 'react-icons/fi'

const Admin_reward_management = () => {
  // State management
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedModule, setSelectedModule] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedReward, setSelectedReward] = useState(null)
  const [selectedMember, setSelectedMember] = useState(null)

  // Mock comprehensive reward data
  const rewardData = {
    // Reward Categories
    categories: [
      { id: 1, name: 'Performance', icon: FiTarget, color: 'bg-blue-100 text-blue-800', count: 8 },
      { id: 2, name: 'Achievement', icon: FiAward, color: 'bg-purple-100 text-purple-800', count: 12 },
      { id: 3, name: 'Monetary', icon: FiDollarSign, color: 'bg-green-100 text-green-800', count: 6 },
      { id: 4, name: 'Recognition', icon: FiStar, color: 'bg-yellow-100 text-yellow-800', count: 10 },
      { id: 5, name: 'Lifestyle', icon: FiHeart, color: 'bg-pink-100 text-pink-800', count: 8 },
      { id: 6, name: 'Learning', icon: FiBook, color: 'bg-indigo-100 text-indigo-800', count: 5 }
    ],

    // Available Rewards
    rewards: [
      {
        id: 1,
        name: 'Task Master',
        description: 'Complete 50+ tasks on time',
        category: 'Performance',
        type: 'badge',
        value: 0,
        icon: FiTarget,
        color: 'bg-blue-100 text-blue-800',
        requirements: { tasksCompleted: 50, onTimeRate: 95 },
        assignedTo: ['dev', 'sales'],
        active: true,
        createdAt: '2024-01-15',
        totalAssigned: 15
      },
      {
        id: 2,
        name: 'Sales Champion',
        description: 'Achieve 100%+ of monthly sales target',
        category: 'Achievement',
        type: 'badge',
        value: 0,
        icon: FiAward,
        color: 'bg-purple-100 text-purple-800',
        requirements: { salesTarget: 100, monthlyTarget: true },
        assignedTo: ['sales'],
        active: true,
        createdAt: '2024-01-10',
        totalAssigned: 8
      },
      {
        id: 3,
        name: 'Performance Bonus',
        description: 'Monthly performance bonus',
        category: 'Monetary',
        type: 'monetary',
        value: 5000,
        icon: FiDollarSign,
        color: 'bg-green-100 text-green-800',
        requirements: { performanceScore: 90, monthly: true },
        assignedTo: ['dev', 'sales'],
        active: true,
        createdAt: '2024-01-01',
        totalAssigned: 25
      },
      {
        id: 4,
        name: 'Team Player',
        description: 'Excellent collaboration and teamwork',
        category: 'Recognition',
        type: 'badge',
        value: 0,
        icon: FiUsers,
        color: 'bg-yellow-100 text-yellow-800',
        requirements: { collaborationScore: 95, teamProjects: 3 },
        assignedTo: ['dev'],
        active: true,
        createdAt: '2024-01-20',
        totalAssigned: 12
      },
      {
        id: 5,
        name: 'Coffee Voucher',
        description: '₹500 coffee shop voucher',
        category: 'Lifestyle',
        type: 'voucher',
        value: 500,
        icon: FiCoffee,
        color: 'bg-pink-100 text-pink-800',
        requirements: { weeklyTarget: 100 },
        assignedTo: ['dev', 'sales'],
        active: true,
        createdAt: '2024-01-25',
        totalAssigned: 30
      },
      {
        id: 6,
        name: 'Learning Credit',
        description: '₹2000 learning platform credit',
        category: 'Learning',
        type: 'credit',
        value: 2000,
        icon: FiBook,
        color: 'bg-indigo-100 text-indigo-800',
        requirements: { coursesCompleted: 2, skillUpgrade: true },
        assignedTo: ['dev'],
        active: true,
        createdAt: '2024-02-01',
        totalAssigned: 8
      }
    ],

    // Team Members
    members: [
      { id: 1, name: 'Sarah Chen', avatar: 'SC', module: 'dev', role: 'Senior Developer', department: 'Development', totalRewards: 8, totalValue: 15000 },
      { id: 2, name: 'Michael Brown', avatar: 'MB', module: 'dev', role: 'Developer', department: 'Development', totalRewards: 6, totalValue: 12000 },
      { id: 3, name: 'David Wilson', avatar: 'DW', module: 'dev', role: 'Project Manager', department: 'Development', totalRewards: 10, totalValue: 18000 },
      { id: 4, name: 'Maria Garcia', avatar: 'MG', module: 'sales', role: 'Senior Sales Executive', department: 'Sales', totalRewards: 12, totalValue: 25000 },
      { id: 5, name: 'Robert Kim', avatar: 'RK', module: 'sales', role: 'Sales Executive', department: 'Sales', totalRewards: 8, totalValue: 15000 },
      { id: 6, name: 'Alex Johnson', avatar: 'AJ', module: 'dev', role: 'UI/UX Designer', department: 'Design', totalRewards: 5, totalValue: 8000 }
    ],

    // Reward Assignments
    assignments: [
      { id: 1, rewardId: 1, memberId: 1, assignedDate: '2024-01-20', status: 'completed', completedDate: '2024-02-15', value: 0 },
      { id: 2, rewardId: 3, memberId: 1, assignedDate: '2024-01-01', status: 'active', completedDate: null, value: 5000 },
      { id: 3, rewardId: 2, memberId: 4, assignedDate: '2024-01-15', status: 'completed', completedDate: '2024-02-10', value: 0 },
      { id: 4, rewardId: 4, memberId: 3, assignedDate: '2024-01-25', status: 'active', completedDate: null, value: 0 },
      { id: 5, rewardId: 5, memberId: 2, assignedDate: '2024-02-01', status: 'completed', completedDate: '2024-02-05', value: 500 },
      { id: 6, rewardId: 6, memberId: 1, assignedDate: '2024-02-01', status: 'active', completedDate: null, value: 2000 }
    ]
  }

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalRewards = rewardData.rewards.length
    const totalAssignments = rewardData.assignments.length
    const totalValue = rewardData.assignments.reduce((sum, assignment) => sum + assignment.value, 0)
    const activeRewards = rewardData.rewards.filter(reward => reward.active).length
    const completedRewards = rewardData.assignments.filter(assignment => assignment.status === 'completed').length
    const pendingRewards = rewardData.assignments.filter(assignment => assignment.status === 'active').length

    return {
      totalRewards,
      totalAssignments,
      totalValue,
      activeRewards,
      completedRewards,
      pendingRewards
    }
  }, [])

  // Simulate data loading
  const loadData = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filter rewards based on selected module
  const filteredRewards = useMemo(() => {
    let rewards = rewardData.rewards

    if (selectedModule !== 'all') {
      rewards = rewards.filter(reward => reward.assignedTo.includes(selectedModule))
    }

    if (searchQuery) {
      rewards = rewards.filter(reward =>
        reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reward.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reward.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return rewards
  }, [selectedModule, searchQuery])

  // Helper functions
  const getModuleColor = (module) => {
    switch (module) {
      case 'dev': return 'bg-blue-100 text-blue-800'
      case 'sales': return 'bg-teal-100 text-teal-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getModuleIcon = (module) => {
    switch (module) {
      case 'dev': return FiCode
      case 'sales': return FiShoppingCart
      default: return FiUser
    }
  }

  const getRewardTypeIcon = (type) => {
    switch (type) {
      case 'monetary': return FiDollarSign
      case 'badge': return FiAward
      case 'voucher': return FiGift
      case 'credit': return FiCreditCard
      default: return FiStar
    }
  }

  const getRewardTypeColor = (type) => {
    switch (type) {
      case 'monetary': return 'bg-green-100 text-green-800'
      case 'badge': return 'bg-purple-100 text-purple-800'
      case 'voucher': return 'bg-pink-100 text-pink-800'
      case 'credit': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const StatCard = ({ icon: Icon, label, value, subtext, color, bgColor }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${bgColor} rounded-xl p-4 shadow-sm border border-gray-100`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`${color} w-4 h-4`} />
        <span className="text-xs font-medium text-gray-600">{label}</span>
      </div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </motion.div>
  )

  const RewardCard = ({ reward }) => {
    const [expanded, setExpanded] = useState(false)
    const RewardIcon = reward.icon
    const TypeIcon = getRewardTypeIcon(reward.type)

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden mb-3 border border-gray-100 hover:shadow-md transition-shadow duration-200"
      >
        <div 
          className="p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center justify-between">
            {/* Left Section - Icon & Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Reward Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${reward.color}`}>
                <RewardIcon className="w-6 h-6" />
              </div>

              {/* Reward Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{reward.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRewardTypeColor(reward.type)}`}>
                    <TypeIcon className="inline w-3 h-3 mr-1" />
                    {reward.type}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">{reward.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${reward.color}`}>
                    {reward.category}
                  </span>
                  {reward.value > 0 && (
                    <span className="text-xs font-semibold text-green-600">
                      ₹{reward.value.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section - Stats & Actions */}
            <div className="flex items-center gap-4 shrink-0">
              {/* Assignment Stats */}
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">{reward.totalAssigned}</div>
                <p className="text-xs text-gray-500">assigned</p>
              </div>

              {/* Status */}
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  reward.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {reward.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedReward(reward)
                    setShowEditModal(true)
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <FiEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedReward(reward)
                    setShowAssignModal(true)
                  }}
                  className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                >
                  <FiSend className="w-4 h-4" />
                </button>
                <FiEye className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="px-4 pb-4 border-t border-gray-100 pt-4"
            >
              <div className="space-y-4">
                {/* Requirements */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Requirements</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="space-y-1 text-xs">
                      {Object.entries(reward.requirements).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="font-semibold text-gray-800">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Assigned To */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Assigned To</h4>
                  <div className="flex flex-wrap gap-1">
                    {reward.assignedTo.map((module) => {
                      const ModuleIcon = getModuleIcon(module)
                      return (
                        <span key={module} className={`px-2 py-1 rounded-full text-xs font-medium ${getModuleColor(module)}`}>
                          <ModuleIcon className="inline w-3 h-3 mr-1" />
                          {module.toUpperCase()}
                        </span>
                      )
                    })}
                  </div>
                </div>

                {/* Recent Assignments */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Recent Assignments</h4>
                  <div className="space-y-2">
                    {rewardData.assignments
                      .filter(assignment => assignment.rewardId === reward.id)
                      .slice(0, 3)
                      .map((assignment) => {
                        const member = rewardData.members.find(m => m.id === assignment.memberId)
                        return (
                          <div key={assignment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                {member?.avatar}
                              </div>
                              <span className="text-xs font-medium text-gray-800">{member?.name}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              assignment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {assignment.status}
                            </span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
      {/* Navbar */}
      <Admin_navbar />
      
      {/* Sidebar */}
      <Admin_sidebar />
      
      {/* Main Content */}
      <div className="ml-64 pt-20 p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Reward Management
                </h1>
                <p className="text-gray-600">
                  Comprehensive reward system for employees, PMs, and sales team
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={loadData}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  <FiRefreshCw className="text-sm" />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <FiPlus className="text-sm" />
                  <span>Create Reward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <StatCard
              icon={FiGift}
              label="Total Rewards"
              value={statistics.totalRewards}
              subtext="Available"
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
            <StatCard
              icon={FiCheckCircle}
              label="Active Rewards"
              value={statistics.activeRewards}
              subtext="Currently active"
              color="text-green-600"
              bgColor="bg-green-50"
            />
            <StatCard
              icon={FiUsers}
              label="Total Assignments"
              value={statistics.totalAssignments}
              subtext="All time"
              color="text-purple-600"
              bgColor="bg-purple-50"
            />
            <StatCard
              icon={FiDollarSign}
              label="Total Value"
              value={`₹${statistics.totalValue.toLocaleString()}`}
              subtext="Distributed"
              color="text-green-600"
              bgColor="bg-green-50"
            />
            <StatCard
              icon={FiAward}
              label="Completed"
              value={statistics.completedRewards}
              subtext="This month"
              color="text-yellow-600"
              bgColor="bg-yellow-50"
            />
            <StatCard
              icon={FiClock}
              label="Pending"
              value={statistics.pendingRewards}
              subtext="In progress"
              color="text-orange-600"
              bgColor="bg-orange-50"
            />
          </div>

          {/* Reward Categories */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Reward Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewardData.categories.map((category) => {
                const CategoryIcon = category.icon
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                          <CategoryIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-500">{category.count} rewards</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{category.count}</div>
                        <p className="text-xs text-gray-500">rewards</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Module Filter Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'all', label: 'All Rewards', icon: FiGift },
                  { id: 'dev', label: 'Development', icon: FiCode },
                  { id: 'sales', label: 'Sales Team', icon: FiShoppingCart }
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedModule(tab.id)}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                        selectedModule === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="text-sm" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search rewards by name, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
              <FiFilter className="text-sm" />
              <span>Filters</span>
            </button>
          </div>

          {/* Rewards List */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedModule === 'all' ? 'All Rewards' : `${selectedModule.toUpperCase()} Team Rewards`}
              </h2>
              <span className="text-sm text-gray-500">
                {filteredRewards.length} rewards
              </span>
            </div>
            
            {filteredRewards.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <FiGift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No rewards found</h3>
                <p className="text-gray-500">
                  {searchQuery ? 'Try adjusting your search terms' : 'No rewards in this category'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRewards.map((reward) => (
                  <RewardCard key={reward.id} reward={reward} />
                ))}
              </div>
            )}
          </div>

          {/* Top Performers by Rewards */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FiAward className="w-5 h-5 text-blue-600 mr-2" />
              Top Performers by Rewards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Most Rewarded</h4>
                <div className="space-y-2">
                  {rewardData.members
                    .sort((a, b) => b.totalRewards - a.totalRewards)
                    .slice(0, 3)
                    .map((member, index) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white' :
                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                            'bg-gradient-to-br from-orange-400 to-orange-500 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                            {member.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-sm">{member.totalRewards}</p>
                          <p className="text-xs text-gray-500">rewards</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Highest Value</h4>
                <div className="space-y-2">
                  {rewardData.members
                    .sort((a, b) => b.totalValue - a.totalValue)
                    .slice(0, 3)
                    .map((member, index) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white' :
                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                            'bg-gradient-to-br from-orange-400 to-orange-500 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                            {member.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600 text-sm">₹{member.totalValue.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">total value</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin_reward_management
