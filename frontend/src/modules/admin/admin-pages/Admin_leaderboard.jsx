import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Admin_navbar from '../admin-components/Admin_navbar'
import Admin_sidebar from '../admin-components/Admin_sidebar'
import Loading from '../../../components/ui/loading'
import { 
  FiUsers, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiChevronDown, 
  FiFilter, 
  FiSearch, 
  FiAward, 
  FiTarget, 
  FiClock, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiBarChart, 
  FiCalendar,
  FiStar,
  FiRefreshCw,
  FiUser,
  FiShield,
  FiShoppingCart,
  FiCode,
  FiDollarSign,
  FiTrendingUp as FiTrendingUpIcon,
  FiActivity,
  FiPieChart
} from 'react-icons/fi'

const Admin_leaderboard = () => {
  // State management
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedModule, setSelectedModule] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Mock comprehensive leaderboard data across all modules
  const allLeaderboardData = {
    // Development Team (Employees + PMs)
    dev: [
      { 
        id: 1, name: "Sarah Chen", avatar: "SC", score: 9500, rank: 1,
        completed: 52, overdue: 0, missed: 0, onTime: 52, rate: 98, 
        trend: "up", trendValue: "+12%", department: "Development",
        avgTime: "1.8 days", lastActive: "2 hours ago", projects: 8, 
        role: "Senior Developer", module: "dev", earnings: 45000,
        achievements: ["Task Master", "On-Time Hero", "Quality Champion"]
      },
      { 
        id: 2, name: "Michael Brown", avatar: "MB", score: 9100, rank: 2,
        completed: 48, overdue: 1, missed: 0, onTime: 47, rate: 96,
        trend: "up", trendValue: "+8%", department: "Development",
        avgTime: "2.1 days", lastActive: "1 hour ago", projects: 7, 
        role: "Developer", module: "dev", earnings: 42000,
        achievements: ["Task Master", "On-Time Hero"]
      },
      { 
        id: 3, name: "Alex Johnson", avatar: "AJ", score: 8750, rank: 3,
        completed: 45, overdue: 2, missed: 1, onTime: 42, rate: 93,
        trend: "stable", trendValue: "0%", department: "Design",
        avgTime: "2.3 days", lastActive: "30 mins ago", projects: 6, 
        role: "UI/UX Designer", module: "dev", earnings: 40000,
        achievements: ["Task Master"]
      },
      { 
        id: 4, name: "David Wilson", avatar: "DW", score: 8500, rank: 4,
        completed: 43, overdue: 1, missed: 0, onTime: 42, rate: 95,
        trend: "up", trendValue: "+5%", department: "Development",
        avgTime: "2.0 days", lastActive: "2 hours ago", projects: 8, 
        role: "Project Manager", module: "dev", earnings: 50000,
        achievements: ["Task Master", "Team Leader", "Project Champion"]
      },
      { 
        id: 5, name: "Emily Davis", avatar: "ED", score: 8400, rank: 5,
        completed: 43, overdue: 3, missed: 1, onTime: 39, rate: 91,
        trend: "down", trendValue: "-3%", department: "Marketing",
        avgTime: "2.5 days", lastActive: "5 hours ago", projects: 5, 
        role: "Marketing Specialist", module: "dev", earnings: 38000,
        achievements: ["Task Master"]
      }
    ],
    // Sales Team
    sales: [
      { 
        id: 6, name: "Maria Garcia", avatar: "MG", score: 9200, rank: 1,
        completed: 35, overdue: 0, missed: 0, onTime: 35, rate: 100, 
        trend: "up", trendValue: "+15%", department: "Sales",
        avgTime: "1.5 days", lastActive: "1 hour ago", projects: 12, 
        role: "Senior Sales Executive", module: "sales", earnings: 65000,
        achievements: ["Sales Champion", "Client Magnet", "Revenue Generator"],
        salesMetrics: { leads: 45, conversions: 28, revenue: 250000, deals: 12 }
      },
      { 
        id: 7, name: "Robert Kim", avatar: "RK", score: 8800, rank: 2,
        completed: 32, overdue: 1, missed: 0, onTime: 31, rate: 97,
        trend: "up", trendValue: "+10%", department: "Sales",
        avgTime: "1.8 days", lastActive: "2 hours ago", projects: 10, 
        role: "Sales Executive", module: "sales", earnings: 58000,
        achievements: ["Sales Champion", "Client Magnet"],
        salesMetrics: { leads: 38, conversions: 22, revenue: 180000, deals: 10 }
      },
      { 
        id: 8, name: "Jennifer Lee", avatar: "JL", score: 8200, rank: 3,
        completed: 28, overdue: 2, missed: 1, onTime: 25, rate: 89,
        trend: "stable", trendValue: "+2%", department: "Sales",
        avgTime: "2.2 days", lastActive: "3 hours ago", projects: 8, 
        role: "Sales Representative", module: "sales", earnings: 52000,
        achievements: ["Sales Champion"],
        salesMetrics: { leads: 32, conversions: 18, revenue: 150000, deals: 8 }
      },
      { 
        id: 9, name: "Alex Chen", avatar: "AC", score: 7800, rank: 4,
        completed: 25, overdue: 3, missed: 1, onTime: 21, rate: 84,
        trend: "down", trendValue: "-5%", department: "Sales",
        avgTime: "2.5 days", lastActive: "4 hours ago", projects: 6, 
        role: "Sales Representative", module: "sales", earnings: 48000,
        achievements: [],
        salesMetrics: { leads: 28, conversions: 15, revenue: 120000, deals: 6 }
      }
    ]
  }

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    const allMembers = Object.values(allLeaderboardData).flat()
    return {
      totalMembers: allMembers.length,
      avgScore: Math.round(allMembers.reduce((sum, member) => sum + member.score, 0) / allMembers.length),
      totalCompleted: allMembers.reduce((sum, member) => sum + member.completed, 0),
      totalProjects: allMembers.reduce((sum, member) => sum + member.projects, 0),
      avgCompletionRate: Math.round(allMembers.reduce((sum, member) => sum + member.rate, 0) / allMembers.length),
      topPerformer: allMembers.reduce((top, member) => member.score > top.score ? member : top, allMembers[0]),
      totalRevenue: allMembers.reduce((sum, member) => sum + (member.earnings || 0), 0)
    }
  }, [])

  // Simulate data loading
  const loadData = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filter data based on selected module
  const filteredData = useMemo(() => {
    let data = []
    
    if (selectedModule === 'all') {
      data = Object.values(allLeaderboardData).flat()
    } else {
      data = allLeaderboardData[selectedModule] || []
    }

    // Apply search filter
    if (searchQuery) {
      data = data.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort by score and assign ranks
    return data.sort((a, b) => b.score - a.score).map((member, index) => ({
      ...member,
      rank: index + 1
    }))
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

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return FiStar
      case 2: return FiAward
      case 3: return FiTarget
      default: return null
    }
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white'
      case 2: return 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
      case 3: return 'bg-gradient-to-br from-orange-400 to-orange-500 text-white'
      default: return 'bg-gray-100 text-gray-600'
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

  const MemberCard = ({ member }) => {
    const [expanded, setExpanded] = useState(false)
    const ModuleIcon = getModuleIcon(member.module)
    const RankIcon = getRankIcon(member.rank)

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
            {/* Left Section - Rank & Avatar */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Rank Badge */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 relative ${getRankColor(member.rank)}`}>
                {RankIcon ? <RankIcon className="w-4 h-4" /> : member.rank}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {member.avatar}
              </div>

              {/* User Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{member.name}</h3>
                  {member.trend === 'up' && <FiTrendingUp className="w-3 h-3 text-green-500 flex-shrink-0" />}
                  {member.trend === 'down' && <FiTrendingDown className="w-3 h-3 text-red-500 flex-shrink-0" />}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500 truncate">{member.role}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getModuleColor(member.module)}`}>
                    <ModuleIcon className="inline w-3 h-3 mr-1" />
                    {member.module.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - Metrics & Score */}
            <div className="flex items-center gap-4 shrink-0">
              {/* Performance Metrics */}
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    member.rate >= 95 ? 'bg-green-100 text-green-700' :
                    member.rate >= 85 ? 'bg-teal-100 text-teal-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {member.rate}%
                  </span>
                </div>
                <p className="text-xs text-gray-500">{member.completed} tasks</p>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{member.score}</div>
                <p className="text-xs text-gray-500">points</p>
              </div>

              {/* Expand Icon */}
              <FiChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
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
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <div className="flex items-center gap-2 mb-1">
                    <FiCheckCircle className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-gray-600">Completed</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">{member.completed}</p>
                </div>
                <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                  <div className="flex items-center gap-2 mb-1">
                    <FiTarget className="w-3 h-3 text-teal-600" />
                    <span className="text-xs text-gray-600">On Time</span>
                  </div>
                  <p className="text-lg font-bold text-teal-600">{member.onTime}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                  <div className="flex items-center gap-2 mb-1">
                    <FiClock className="w-3 h-3 text-orange-600" />
                    <span className="text-xs text-gray-600">Overdue</span>
                  </div>
                  <p className="text-lg font-bold text-orange-600">{member.overdue}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <FiBarChart className="w-3 h-3 text-blue-600" />
                    <span className="text-xs text-gray-600">Projects</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">{member.projects}</p>
                </div>
              </div>

              {/* Module-specific metrics */}
              {member.module === 'sales' && member.salesMetrics && (
                <div className="mb-4 p-3 bg-teal-50 rounded-lg border border-teal-100">
                  <h4 className="text-sm font-semibold text-teal-800 mb-2">Sales Metrics</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Leads:</span>
                      <span className="font-semibold text-teal-700">{member.salesMetrics.leads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Conversions:</span>
                      <span className="font-semibold text-teal-700">{member.salesMetrics.conversions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-semibold text-teal-700">₹{member.salesMetrics.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deals:</span>
                      <span className="font-semibold text-teal-700">{member.salesMetrics.deals}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Achievements */}
              {member.achievements.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Achievements</h4>
                  <div className="flex flex-wrap gap-1">
                    {member.achievements.map((achievement, index) => (
                      <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        <FiAward className="inline w-3 h-3 mr-1" />
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Progress */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Performance</span>
                  <span className="font-semibold text-gray-800">{member.rate}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${member.rate}%` }}
                  />
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
              Leaderboard
            </h1>
            <p className="text-gray-600">
                  Comprehensive performance rankings across all teams and modules
                </p>
              </div>
              <button
                onClick={loadData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <FiRefreshCw className="text-sm" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Overall Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={FiUsers}
              label="Total Members"
              value={overallStats.totalMembers}
              subtext="Across all modules"
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
            <StatCard
              icon={FiBarChart}
              label="Average Score"
              value={overallStats.avgScore}
              subtext="Overall performance"
              color="text-teal-600"
              bgColor="bg-teal-50"
            />
            <StatCard
              icon={FiCheckCircle}
              label="Tasks Completed"
              value={overallStats.totalCompleted}
              subtext="This month"
              color="text-green-600"
              bgColor="bg-green-50"
            />
            <StatCard
              icon={FiDollarSign}
              label="Total Revenue"
              value={`₹${overallStats.totalRevenue.toLocaleString()}`}
              subtext="Generated"
              color="text-purple-600"
              bgColor="bg-purple-50"
            />
          </div>

          {/* Module Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Development Team</p>
                  <p className="text-2xl font-bold text-blue-600">{allLeaderboardData.dev.length}</p>
                </div>
                <FiCode className="text-blue-600 text-xl" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sales Team</p>
                  <p className="text-2xl font-bold text-teal-600">{allLeaderboardData.sales.length}</p>
                </div>
                <FiShoppingCart className="text-teal-600 text-xl" />
              </div>
            </motion.div>
          </div>

          {/* Module Filter Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'all', label: 'All Teams', icon: FiUsers },
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

          {/* Period Selector */}
          <div className="mb-6">
            <div className="bg-white rounded-lg p-1 shadow-sm flex gap-1 max-w-md">
              {['week', 'month', 'quarter', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`flex-1 py-2 rounded-md font-medium text-sm capitalize transition-all ${
                    selectedPeriod === period
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, role, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 ${
                showFilters ? 'bg-blue-50 text-blue-600 border-blue-300' : 'hover:bg-gray-50'
              }`}
            >
              <FiFilter className="text-sm" />
              <span>Filters</span>
            </button>
          </div>

          {/* Top Performers Preview */}
          {activeTab === 'overview' && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Top Performers</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredData.slice(0, 3).map((member, index) => {
                  const ModuleIcon = getModuleIcon(member.module)
                  const RankIcon = getRankIcon(member.rank)
                  
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getRankColor(member.rank)}`}>
                          {RankIcon ? <RankIcon className="w-4 h-4" /> : member.rank}
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {member.avatar}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{member.name}</h3>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Score:</span>
                          <span className="font-semibold text-gray-900">{member.score}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Completion:</span>
                          <span className="font-semibold text-green-600">{member.rate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Module:</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getModuleColor(member.module)}`}>
                            <ModuleIcon className="inline w-3 h-3 mr-1" />
                            {member.module.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Detailed Rankings */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedModule === 'all' ? 'All Teams Rankings' : `${selectedModule.toUpperCase()} Team Rankings`}
              </h2>
              <span className="text-sm text-gray-500">
                {filteredData.length} members
              </span>
            </div>
            
            {filteredData.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
                <p className="text-gray-500">
                  {searchQuery ? 'Try adjusting your search terms' : 'No members in this category'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredData.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            )}
          </div>

          {/* Performance Insights */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FiActivity className="w-5 h-5 text-blue-600 mr-2" />
              Performance Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Top Performer</h4>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    <FiStar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{overallStats.topPerformer.name}</p>
                    <p className="text-sm text-gray-600">{overallStats.topPerformer.score} points</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Team Average</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completion Rate:</span>
                    <span className="font-semibold text-gray-900">{overallStats.avgCompletionRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Average Score:</span>
                    <span className="font-semibold text-gray-900">{overallStats.avgScore}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin_leaderboard
