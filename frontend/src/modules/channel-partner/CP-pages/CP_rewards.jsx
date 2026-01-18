import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { 
  FiAward,
  FiTrendingUp,
  FiDollarSign,
  FiTarget,
  FiCheckCircle,
  FiArrowRight,
  FiCalendar,
  FiActivity,
  FiUsers
} from 'react-icons/fi'
import CP_navbar from '../CP-components/CP_navbar'
import { cpRewardService } from '../CP-services'
import { useToast } from '../../../contexts/ToastContext'

const CP_rewards = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [rewards, setRewards] = useState([])
  const [incentives, setIncentives] = useState([])
  const [performance, setPerformance] = useState(null)

  useEffect(() => {
    loadRewardsData()
  }, [])

  const loadRewardsData = async () => {
    try {
      setLoading(true)
      const [rewardsRes, incentivesRes, performanceRes] = await Promise.all([
        cpRewardService.getRewards({ limit: 20 }),
        cpRewardService.getIncentives(),
        cpRewardService.getPerformanceMetrics()
      ])

      if (rewardsRes.success) {
        setRewards(rewardsRes.data || [])
      }
      if (incentivesRes.success) {
        setIncentives(incentivesRes.data || [])
      }
      if (performanceRes.success) {
        setPerformance(performanceRes.data)
      }
    } catch (error) {
      console.error('Failed to load rewards data:', error)
      toast.error?.(error.message || 'Failed to load rewards data', {
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
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTransactionTypeColor = (type) => {
    const colors = {
      commission: 'text-blue-600',
      incentive: 'text-purple-600',
      reward: 'text-green-600'
    }
    return colors[type] || 'text-gray-600'
  }

  const getTransactionTypeBg = (type) => {
    const colors = {
      commission: 'bg-blue-50 border-blue-200',
      incentive: 'bg-purple-50 border-purple-200',
      reward: 'bg-green-50 border-green-200'
    }
    return colors[type] || 'bg-gray-50 border-gray-200'
  }

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
          {/* Performance Metrics */}
          {performance && (
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiTarget className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xs font-medium text-gray-600 mb-1">Total Leads</h3>
                <p className="text-xl font-bold text-gray-900">
                  {performance.leads?.total || 0}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiCheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xs font-medium text-gray-600 mb-1">Converted</h3>
                <p className="text-xl font-bold text-gray-900">
                  {performance.leads?.converted || 0}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {performance.leads?.conversionRate || 0}% rate
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FiUsers className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xs font-medium text-gray-600 mb-1">Total Clients</h3>
                <p className="text-xl font-bold text-gray-900">
                  {performance.clients?.total || 0}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FiDollarSign className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
                <h3 className="text-xs font-medium text-gray-600 mb-1">Total Revenue</h3>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(performance.revenue?.total || 0)}
                </p>
              </motion.div>
            </div>
          )}

          {/* Earnings Breakdown */}
          {performance && performance.earnings && Object.keys(performance.earnings).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Earnings Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(performance.earnings).map(([type, amount]) => (
                  <div key={type} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-600 mb-1 capitalize">
                      {type.replace('_', ' ')}
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(amount || 0)}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Incentives Summary */}
          {incentives.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Incentives Earned</h3>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(incentives.reduce((sum, inv) => sum + (inv.amount || 0), 0))}
                  </p>
                  <p className="text-sm text-gray-600">{incentives.length} incentives</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Recent Rewards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Rewards & Incentives</h3>
            {rewards.length > 0 ? (
              <div className="space-y-3">
                {rewards.map((reward) => (
                  <div key={reward._id} className={`p-4 rounded-lg border ${getTransactionTypeBg(reward.transactionType)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <FiAward className={`h-5 w-5 ${getTransactionTypeColor(reward.transactionType)}`} />
                          <p className="font-medium text-gray-900 capitalize">
                            {reward.transactionType?.replace('_', ' ')}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">{reward.description || 'Reward'}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(reward.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getTransactionTypeColor(reward.transactionType)}`}>
                          +{formatCurrency(reward.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FiAward className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No rewards yet</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CP_rewards
