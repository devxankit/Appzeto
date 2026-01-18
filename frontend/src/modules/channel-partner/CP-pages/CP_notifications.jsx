import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiX,
  FiClock,
  FiDollarSign,
  FiUser,
  FiAlertCircle,
  FiInfo,
  FiFilter,
  FiArrowRight,
  FiShare2
} from 'react-icons/fi'
import CP_navbar from '../CP-components/CP_navbar'
import { cpNotificationService } from '../CP-services'
import { useToast } from '../../../contexts/ToastContext'
import Loading from '../../../components/ui/loading'

const CP_notifications = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [typeFilter, setTypeFilter] = useState('all')
  const [readFilter, setReadFilter] = useState('all')

  useEffect(() => {
    loadNotifications()
    loadUnreadCount()
  }, [typeFilter, readFilter])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const params = {}
      if (typeFilter !== 'all') params.type = typeFilter
      if (readFilter !== 'all') params.read = readFilter === 'unread'

      const response = await cpNotificationService.getNotifications(params)
      if (response.success) {
        setNotifications(response.data || [])
        setUnreadCount(response.unreadCount || 0)
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
      toast.error?.(error.message || 'Failed to load notifications', {
        title: 'Error',
        duration: 4000
      })
    } finally {
      setLoading(false)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const response = await cpNotificationService.getUnreadCount()
      if (response.success) {
        setUnreadCount(response.data?.unreadCount || 0)
      }
    } catch (error) {
      console.error('Failed to load unread count:', error)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await cpNotificationService.markAsRead(notificationId)
      if (response.success) {
        loadNotifications()
        loadUnreadCount()
      }
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await cpNotificationService.markAllAsRead()
      if (response.success) {
        toast.success?.('All notifications marked as read', {
          title: 'Success',
          duration: 3000
        })
        loadNotifications()
        loadUnreadCount()
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error)
      toast.error?.(error.message || 'Failed to mark all as read', {
        title: 'Error',
        duration: 4000
      })
    }
  }

  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Just now'
    const eventDate = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - eventDate.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes} min ago`

    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? '' : 's'} ago`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`

    return eventDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getNotificationIcon = (type) => {
    const icons = {
      lead_update: FiUser,
      lead_assigned: FiUser,
      lead_shared: FiShare2,
      lead_unshared: FiShare2,
      lead_converted: FiCheckCircle,
      payment_received: FiDollarSign,
      payment_pending: FiClock,
      wallet_credit: FiDollarSign,
      wallet_debit: FiDollarSign,
      withdrawal_approved: FiCheckCircle,
      withdrawal_rejected: FiX,
      reward_earned: FiCheckCircle,
      incentive_earned: FiDollarSign,
      system: FiInfo,
      other: FiBell
    }
    return icons[type] || FiBell
  }

  const getNotificationColor = (type) => {
    const colors = {
      lead_update: 'bg-blue-100 text-blue-600',
      lead_assigned: 'bg-blue-100 text-blue-600',
      lead_shared: 'bg-purple-100 text-purple-600',
      lead_unshared: 'bg-purple-100 text-purple-600',
      lead_converted: 'bg-green-100 text-green-600',
      payment_received: 'bg-green-100 text-green-600',
      payment_pending: 'bg-yellow-100 text-yellow-600',
      wallet_credit: 'bg-green-100 text-green-600',
      wallet_debit: 'bg-red-100 text-red-600',
      withdrawal_approved: 'bg-green-100 text-green-600',
      withdrawal_rejected: 'bg-red-100 text-red-600',
      reward_earned: 'bg-purple-100 text-purple-600',
      incentive_earned: 'bg-indigo-100 text-indigo-600',
      system: 'bg-gray-100 text-gray-600',
      other: 'bg-gray-100 text-gray-600'
    }
    return colors[type] || 'bg-gray-100 text-gray-600'
  }

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification._id)
    }
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl)
    } else if (notification.reference?.id) {
      if (notification.reference.type === 'lead') {
        navigate(`/cp-lead-profile/${notification.reference.id}`)
      } else if (notification.reference.type === 'client') {
        navigate(`/cp-client-profile/${notification.reference.id}`)
      } else if (notification.reference.type === 'wallet') {
        navigate('/cp-wallet')
      }
    }
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
        <div className="max-w-4xl mx-auto space-y-6 pt-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-end space-x-2"
          >
            {unreadCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Mark All Read
              </motion.button>
            )}
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="lead_update">Lead Updates</option>
                  <option value="lead_shared">Lead Sharing</option>
                  <option value="lead_converted">Lead Conversions</option>
                  <option value="payment_received">Payments</option>
                  <option value="wallet_credit">Wallet</option>
                  <option value="withdrawal_approved">Withdrawals</option>
                  <option value="reward_earned">Rewards</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={readFilter}
                  onChange={(e) => setReadFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Notifications List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification, index) => {
                  const IconComponent = getNotificationIcon(notification.type)
                  const iconColor = getNotificationColor(notification.type)
                  
                  return (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${iconColor}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className={`text-base font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 flex-shrink-0 mt-2"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                              {formatRelativeTime(notification.createdAt)}
                            </p>
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMarkAsRead(notification._id)
                                }}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="p-12 text-center">
                <FiBell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No notifications found</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CP_notifications
