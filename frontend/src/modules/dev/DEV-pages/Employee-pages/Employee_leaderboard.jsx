import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  FiStar
} from 'react-icons/fi'
import Employee_navbar from '../../DEV-components/Employee_navbar'

const Employee_leaderboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data for current user (employee perspective)
  const currentUser = {
    name: "Alex Johnson",
    rank: 3,
    score: 8750,
    avatar: "AJ",
    completedTasks: 45,
    overdueTasks: 2,
    missedDeadlines: 1,
    onTimeTasks: 42,
    completionRate: 93,
    avgCompletionTime: "2.3 days",
    department: "Development",
    role: "Senior Developer"
  }

  // Mock leaderboard data
  const leaderboardData = [
    { 
      id: 1, name: "Sarah Chen", avatar: "SC", score: 9500, rank: 1,
      completed: 52, overdue: 0, missed: 0, onTime: 52, rate: 98, 
      trend: "up", trendValue: "+12%", department: "Development",
      avgTime: "1.8 days", lastActive: "2 hours ago", projects: 8, role: "Senior Developer"
    },
    { 
      id: 2, name: "Michael Brown", avatar: "MB", score: 9100, rank: 2,
      completed: 48, overdue: 1, missed: 0, onTime: 47, rate: 96,
      trend: "up", trendValue: "+8%", department: "Development",
      avgTime: "2.1 days", lastActive: "1 hour ago", projects: 7, role: "Developer"
    },
    { 
      id: 3, name: "Alex Johnson", avatar: "AJ", score: 8750, rank: 3,
      completed: 45, overdue: 2, missed: 1, onTime: 42, rate: 93,
      trend: "stable", trendValue: "0%", department: "Development",
      avgTime: "2.3 days", lastActive: "30 mins ago", projects: 6, role: "Senior Developer",
      isCurrentUser: true
    },
    { 
      id: 4, name: "Emily Davis", avatar: "ED", score: 8400, rank: 4,
      completed: 43, overdue: 3, missed: 1, onTime: 39, rate: 91,
      trend: "down", trendValue: "-3%", department: "Design",
      avgTime: "2.5 days", lastActive: "5 hours ago", projects: 5, role: "UI/UX Designer"
    },
    { 
      id: 5, name: "James Wilson", avatar: "JW", score: 8200, rank: 5,
      completed: 41, overdue: 2, missed: 2, onTime: 37, rate: 89,
      trend: "up", trendValue: "+5%", department: "Development",
      avgTime: "2.7 days", lastActive: "1 hour ago", projects: 6, role: "Frontend Developer"
    },
  ]

  const filteredEmployees = leaderboardData.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  const EmployeeCard = ({ employee, isExpanded }) => {
    const [expanded, setExpanded] = useState(false)

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`bg-white rounded-xl shadow-sm overflow-hidden mb-3 border border-gray-100 ${
          employee.isCurrentUser ? 'ring-2 ring-teal-200 bg-teal-50/30' : ''
        }`}
      >
         <div 
           className="p-3 cursor-pointer hover:bg-gray-50 transition-all duration-200"
           onClick={() => setExpanded(!expanded)}
         >
           <div className="flex items-center justify-between">
             {/* Left Section - Rank & Avatar */}
             <div className="flex items-center gap-2 min-w-0 flex-1">
               {/* Rank Badge */}
               <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                 employee.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white' :
                 employee.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                 employee.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white' :
                 'bg-gray-100 text-gray-600'
               }`}>
                 {employee.rank}
               </div>

               {/* Avatar */}
               <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0">
                 {employee.avatar}
               </div>

               {/* User Info */}
               <div className="min-w-0 flex-1">
                 <div className="flex items-center gap-1">
                   <h3 className={`font-semibold text-sm truncate ${employee.isCurrentUser ? 'text-teal-600' : 'text-gray-900'}`}>
                     {employee.name} {employee.isCurrentUser && '(You)'}
                   </h3>
                   {employee.trend === 'up' && <FiTrendingUp className="w-3 h-3 text-green-500 flex-shrink-0" />}
                   {employee.trend === 'down' && <FiTrendingDown className="w-3 h-3 text-red-500 flex-shrink-0" />}
                 </div>
                 <p className="text-xs text-gray-500 truncate">{employee.role}</p>
               </div>
             </div>

             {/* Right Section - Metrics & Score */}
             <div className="flex items-center gap-2 shrink-0">
               {/* Performance Metrics */}
               <div className="text-right">
                 <div className="flex items-center gap-1">
                   <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                     employee.rate >= 95 ? 'bg-green-100 text-green-700' :
                     employee.rate >= 85 ? 'bg-teal-100 text-teal-700' :
                     'bg-orange-100 text-orange-700'
                   }`}>
                     {employee.rate}%
                   </span>
                 </div>
               </div>

               {/* Score */}
               <div className="text-right">
                 <div className="text-sm font-bold text-gray-900">{employee.score}</div>
               </div>

               {/* Expand Icon */}
               <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
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
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <div className="flex items-center gap-2 mb-1">
                    <FiCheckCircle className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-gray-600">Completed</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">{employee.completed}</p>
                </div>
                <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                  <div className="flex items-center gap-2 mb-1">
                    <FiTarget className="w-3 h-3 text-teal-600" />
                    <span className="text-xs text-gray-600">On Time</span>
                  </div>
                  <p className="text-lg font-bold text-teal-600">{employee.onTime}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                  <div className="flex items-center gap-2 mb-1">
                    <FiClock className="w-3 h-3 text-orange-600" />
                    <span className="text-xs text-gray-600">Overdue</span>
                  </div>
                  <p className="text-lg font-bold text-orange-600">{employee.overdue}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                  <div className="flex items-center gap-2 mb-1">
                    <FiAlertTriangle className="w-3 h-3 text-red-600" />
                    <span className="text-xs text-gray-600">Missed</span>
                  </div>
                  <p className="text-lg font-bold text-red-600">{employee.missed}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Projects</span>
                  <span className="font-semibold text-gray-800">{employee.projects}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-semibold text-green-600">{employee.rate}%</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full"
                    style={{ width: `${employee.rate}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pb-20">
      <Employee_navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 sm:px-6 lg:px-8 pt-16 pb-6 rounded-b-2xl shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Leaderboard</h1>
              <p className="text-teal-100 text-sm mt-1">Track your performance and rankings</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <FiAward className="w-5 h-5" />
            </div>
          </div>

          {/* Current User Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {currentUser.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{currentUser.name}</p>
                  <p className="text-teal-100 text-xs">Your Rank: #{currentUser.rank}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-yellow-300 text-lg font-bold">{currentUser.score}</p>
                <p className="text-teal-100 text-xs">Points</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-3 relative z-10">
        {/* Period Selector */}
        <div className="mb-4">
          <div className="bg-white rounded-xl p-1 shadow-sm flex gap-1">
            {['week', 'month', 'quarter'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`flex-1 py-2 rounded-lg font-medium text-sm capitalize transition-all ${
                  selectedPeriod === period
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <div className="bg-white rounded-xl p-1 shadow-sm flex gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'overview'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('rankings')}
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'rankings'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Rankings
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <div className="space-y-4">
            {/* Personal Stats Grid */}
            <div>
              <h2 className="text-base font-bold text-gray-800 mb-3">Your Performance</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard
                  icon={FiCheckCircle}
                  label="Completed"
                  value={currentUser.completedTasks}
                  subtext="This month"
                  color="text-green-600"
                  bgColor="bg-green-50"
                />
                <StatCard
                  icon={FiTarget}
                  label="On Time"
                  value={currentUser.onTimeTasks}
                  subtext="Tasks delivered"
                  color="text-teal-600"
                  bgColor="bg-teal-50"
                />
                <StatCard
                  icon={FiClock}
                  label="Overdue"
                  value={currentUser.overdueTasks}
                  subtext="Needs attention"
                  color="text-orange-600"
                  bgColor="bg-orange-50"
                />
                <StatCard
                  icon={FiAlertTriangle}
                  label="Missed"
                  value={currentUser.missedDeadlines}
                  subtext="Deadlines"
                  color="text-red-600"
                  bgColor="bg-red-50"
                />
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FiAward className="w-4 h-4 text-purple-600" />
                Performance Metrics
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-bold text-gray-800">{currentUser.completionRate}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full"
                      style={{ width: `${currentUser.completionRate}%` }}
                    />
                  </div>
                </div>
                

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Total Points</span>
                  <span className="font-bold text-teal-600 text-lg">{currentUser.score}</span>
                </div>
              </div>
            </div>

            {/* Top Performers Preview */}
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-4 shadow-sm border border-teal-100">
              <h3 className="font-bold text-gray-800 mb-3">Top Performers</h3>
              <div className="space-y-2">
                {leaderboardData.slice(0, 3).map((emp, idx) => (
                  <motion.div 
                    key={emp.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-lg border border-teal-100 ${
                      emp.isCurrentUser ? 'bg-white shadow-md' : 'bg-white/50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white' :
                      idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                      'bg-gradient-to-br from-orange-400 to-orange-500 text-white'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold text-sm ${emp.isCurrentUser ? 'text-teal-600' : 'text-gray-800'}`}>
                        {emp.name} {emp.isCurrentUser && '(You)'}
                      </p>
                      <p className="text-xs text-gray-500">{emp.completed} tasks • {emp.rate}%</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800 text-sm">{emp.score}</p>
                      <p className="text-xs text-green-600 font-medium">{emp.trendValue}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Search Bar */}
            <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3 border border-gray-100">
              <FiSearch className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, role, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-sm text-gray-800"
              />
              <button className="bg-teal-50 p-2 rounded-lg">
                <FiFilter className="w-4 h-4 text-teal-600" />
              </button>
            </div>

            {/* Employee Cards */}
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Showing {filteredEmployees.length} of {leaderboardData.length} team members
              </p>
              {filteredEmployees.map((employee) => (
                <EmployeeCard key={employee.id} employee={employee} />
              ))}
            </div>

            {/* Motivational Card */}
            <div className="bg-gradient-to-r from-teal-600 to-purple-600 rounded-xl p-4 text-white shadow-lg">
              <h3 className="font-bold text-base mb-2">Keep Going! 🚀</h3>
              <p className="text-white/90 text-sm mb-3">
                You're only {leaderboardData[1].score - currentUser.score} points away from rank #{currentUser.rank - 1}. Complete your pending tasks to climb up!
              </p>
              <button className="bg-white text-teal-600 px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-md transition-all flex items-center gap-2">
                View Tasks
                <FiChevronDown className="w-4 h-4 rotate-[-90deg]" />
              </button>
            </div>
          </div>
        )}
        </div>
    </div>
  )
}

export default Employee_leaderboard

