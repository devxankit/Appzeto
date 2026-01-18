import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line
} from 'recharts'
import { 
  FiUsers, 
  FiTrendingUp,
  FiDollarSign,
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiArrowRight
} from 'react-icons/fi'
import CP_navbar from '../CP-components/CP_navbar'
import { cpDashboardService } from '../CP-services'
import { useToast } from '../../../contexts/ToastContext'

const CP_dashboard = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [activity, setActivity] = useState(null)
  const [leadTrends, setLeadTrends] = useState([])
  const [conversionFunnel, setConversionFunnel] = useState({})
  const [revenueChart, setRevenueChart] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [statsRes, activityRes, trendsRes, funnelRes, revenueRes] = await Promise.all([
        cpDashboardService.getDashboardStats(),
        cpDashboardService.getRecentActivity({ limit: 5 }),
        cpDashboardService.getLeadTrends({ days: 30 }),
        cpDashboardService.getConversionFunnel(),
        cpDashboardService.getRevenueChart({ months: 12 })
      ])

      setStats(statsRes.data)
      setActivity(activityRes.data)
      setLeadTrends(trendsRes.data || [])
      setConversionFunnel(funnelRes.data || {})
      setRevenueChart(revenueRes.data || [])
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast.error?.('Failed to load dashboard data. Please try again.', {
        title: 'Error',
        duration: 4000
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-700',
      connected: 'bg-green-100 text-green-700',
      followup: 'bg-yellow-100 text-yellow-700',
      converted: 'bg-purple-100 text-purple-700',
      lost: 'bg-red-100 text-red-700',
      not_picked: 'bg-gray-100 text-gray-700',
      not_converted: 'bg-orange-100 text-orange-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  // Prepare chart data
  const funnelData = Object.entries(conversionFunnel).map(([key, value]) => ({
    name: key.replace('_', ' ').toUpperCase(),
    value,
    color: key === 'converted' ? '#10B981' : key === 'new' ? '#3B82F6' : key === 'connected' ? '#8B5CF6' : '#F59E0B'
  }))

  // Prepare revenue chart data
  const revenueChartData = (revenueChart || []).map(item => ({
    month: `${item._id?.month || 0}/${item._id?.year || 0}`,
    revenue: item.revenue || 0
  }))

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280']

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
        <CP_navbar />
        <div className="pt-14 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <CP_navbar />
      
      <div className="pt-14 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 pt-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Total Leads */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate('/cp-leads')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiUsers className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xs font-medium text-gray-600 mb-1">Total Leads</h3>
              <p className="text-xl font-bold text-gray-900">
                {stats?.leads?.total || 0}
              </p>
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <FiActivity className="h-3 w-3 mr-1" />
                <span>{stats?.leads?.pending || 0} pending</span>
              </div>
            </motion.div>

            {/* Converted Leads */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate('/cp-converted')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiCheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <h3 className="text-xs font-medium text-gray-600 mb-1">Converted</h3>
              <p className="text-xl font-bold text-gray-900">
                {stats?.leads?.converted || 0}
              </p>
              <div className="mt-1 flex items-center text-xs text-green-600">
                <FiTrendingUp className="h-3 w-3 mr-1" />
                <span>{stats?.leads?.conversionRate?.toFixed(1) || 0}% rate</span>
              </div>
            </motion.div>

            {/* Total Revenue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiDollarSign className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xs font-medium text-gray-600 mb-1">Total Revenue</h3>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(stats?.revenue?.total || 0)}
              </p>
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <FiActivity className="h-3 w-3 mr-1" />
                <span>All time</span>
              </div>
            </motion.div>

            {/* Wallet Balance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate('/cp-wallet')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FiDollarSign className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-xs font-medium text-gray-600 mb-1">Wallet Balance</h3>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(stats?.wallet?.balance || 0)}
              </p>
              <div className="mt-1 flex items-center text-xs text-indigo-600">
                <FiArrowRight className="h-3 w-3 mr-1" />
                <span>View wallet</span>
              </div>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversion Funnel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Conversion Funnel</h3>
              {funnelData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={funnelData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {funnelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </motion.div>

            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend</h3>
              {revenueChartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueChartData}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fill: '#6B7280', fontSize: 11 }}
                      />
                      <YAxis 
                        tick={{ fill: '#6B7280', fontSize: 11 }}
                        tickFormatter={(value) => `₹${value/1000}k`}
                      />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #E5E7EB',
                          borderRadius: '6px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8B5CF6" 
                        fillOpacity={1} 
                        fill="url(#revenueGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
              <button
                onClick={() => navigate('/cp-leads')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                View all
                <FiArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="space-y-3">
              {activity?.leads?.length > 0 ? (
                activity.leads.slice(0, 5).map((lead, index) => (
                  <motion.div
                    key={lead._id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/cp-lead-profile/${lead._id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{lead.name || lead.phone}</p>
                        <p className="text-xs text-gray-500">{formatDate(lead.createdAt)}</p>
                      </div>
                    </div>
                    <FiArrowRight className="h-4 w-4 text-gray-400" />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiActivity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CP_dashboard
