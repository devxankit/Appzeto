import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Employee_navbar from '../../DEV-components/Employee_navbar'
import { employeeService } from '../../DEV-services'
import { useToast } from '../../../../contexts/ToastContext'
import {
  FiAlertOctagon,
  FiCheckCircle,
  FiZap,
  FiInfo,
  FiList,
  FiLoader,
  FiRefreshCw,
  FiToggleLeft,
  FiToggleRight
} from 'react-icons/fi'

const Employee_overload = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const [status, setStatus] = useState({
    isOverloaded: false,
    overloadedAt: null,
    activeTaskCount: 0,
    canToggleOverload: false
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isToggling, setIsToggling] = useState(false)

  const loadStatus = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await employeeService.getOverloadStatus()
      if (response?.success) {
        setStatus(response.data)
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load overload status')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStatus()
  }, [loadStatus])

  const handleToggle = async () => {
    if (isToggling) return
    try {
      setIsToggling(true)
      const response = await employeeService.toggleOverload()
      if (response?.success) {
        setStatus(response.data)
        toast.success(response.message || 'Overload status updated')
      }
    } catch (err) {
      toast.error(err.message || 'Failed to toggle overload status')
    } finally {
      setIsToggling(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Employee_navbar
        onMenuClick={() => setIsSidebarOpen(true)}
        isSidebarOpen={isSidebarOpen}
        onSidebarClose={() => setIsSidebarOpen(false)}
      />

      <div className="max-w-2xl mx-auto px-4 pt-20 pb-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
              <FiZap className="w-5 h-5 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Overload Status</h1>
          </div>
          <p className="text-sm text-gray-500 ml-12">
            Manage your workload capacity — when overloaded, TL / PM cannot assign you new tasks.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <FiLoader className="w-7 h-7 text-teal-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className={`rounded-2xl border-2 p-6 mb-5 transition-all duration-300 ${
                status.isOverloaded
                  ? 'bg-red-50 border-red-200'
                  : 'bg-green-50 border-green-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      status.isOverloaded ? 'bg-red-100' : 'bg-green-100'
                    }`}
                  >
                    {status.isOverloaded ? (
                      <FiAlertOctagon className="w-7 h-7 text-red-500" />
                    ) : (
                      <FiCheckCircle className="w-7 h-7 text-green-500" />
                    )}
                  </div>
                  <div>
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                        status.isOverloaded
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          status.isOverloaded ? 'bg-red-500' : 'bg-green-500'
                        }`}
                      />
                      {status.isOverloaded ? 'Overloaded' : 'Available'}
                    </div>
                    <p className="text-sm text-gray-700 font-medium">
                      {status.isOverloaded
                        ? 'You are currently in overload mode. TL and PM cannot assign new tasks to you.'
                        : 'You are available for new task assignments.'}
                    </p>
                    {status.isOverloaded && status.overloadedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Activated: {formatDate(status.overloadedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Active Task Count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 p-5 mb-5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiList className="w-5 h-5 text-teal-600" />
                <h2 className="text-sm font-semibold text-gray-700">Active Task Count</h2>
              </div>
              <div className="flex items-end gap-3">
                <span
                  className={`text-5xl font-bold ${
                    status.activeTaskCount >= 10 ? 'text-red-500' : 'text-teal-600'
                  }`}
                >
                  {status.activeTaskCount}
                </span>
                <div className="pb-2">
                  <span className="text-sm text-gray-500">active tasks</span>
                  <p className="text-xs text-gray-400">(pending + in-progress + testing)</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>0</span>
                  <span className="font-medium text-gray-700">Threshold: 10</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((status.activeTaskCount / 15) * 100, 100)}%` }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className={`h-3 rounded-full ${
                      status.activeTaskCount >= 10
                        ? 'bg-gradient-to-r from-red-400 to-red-600'
                        : 'bg-gradient-to-r from-teal-400 to-teal-600'
                    }`}
                  />
                </div>
                {status.activeTaskCount < 10 && (
                  <p className="text-xs text-gray-500 mt-2">
                    {10 - status.activeTaskCount} more task{10 - status.activeTaskCount !== 1 ? 's' : ''} needed to enable overload mode.
                  </p>
                )}
                {status.activeTaskCount >= 10 && !status.isOverloaded && (
                  <p className="text-xs text-orange-600 mt-2 font-medium">
                    You have 10+ active tasks. You can activate overload mode below.
                  </p>
                )}
                {status.isOverloaded && status.activeTaskCount < 10 && (
                  <p className="text-xs text-green-600 mt-2 font-medium">
                    Task count dropped below 10 — overload will auto-deactivate on next refresh.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Toggle Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-white rounded-2xl border border-gray-200 p-5 mb-5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiZap className="w-5 h-5 text-orange-500" />
                <h2 className="text-sm font-semibold text-gray-700">Toggle Overload Mode</h2>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-600">
                  {status.isOverloaded
                    ? 'Click below to deactivate overload mode. You will be available for new task assignments again.'
                    : status.canToggleOverload
                    ? 'You have 10+ active tasks. Click below to activate overload mode to block new assignments.'
                    : `You need at least 10 active tasks to activate overload mode. You currently have ${status.activeTaskCount}.`}
                </p>

                <button
                  onClick={handleToggle}
                  disabled={isToggling || (!status.isOverloaded && !status.canToggleOverload)}
                  className={`flex items-center justify-center gap-3 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    status.isOverloaded
                      ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                      : status.canToggleOverload
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isToggling ? (
                    <FiLoader className="w-4 h-4 animate-spin" />
                  ) : status.isOverloaded ? (
                    <FiToggleRight className="w-5 h-5" />
                  ) : (
                    <FiToggleLeft className="w-5 h-5" />
                  )}
                  {isToggling
                    ? 'Updating...'
                    : status.isOverloaded
                    ? 'Deactivate Overload Mode'
                    : 'Activate Overload Mode'}
                </button>
              </div>
            </motion.div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-blue-50 border border-blue-200 rounded-2xl p-5"
            >
              <div className="flex items-start gap-3">
                <FiInfo className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700 space-y-1">
                  <p className="font-semibold">How overload mode works</p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-blue-600">
                    <li>You can activate it manually when you have 10 or more active tasks.</li>
                    <li>While active, TL and PM will see you as greyed-out and cannot assign tasks.</li>
                    <li>It deactivates automatically when your active task count drops below 10.</li>
                    <li>You can also deactivate it manually at any time.</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Refresh */}
            <div className="flex justify-center mt-5">
              <button
                onClick={loadStatus}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-teal-600 transition-colors"
              >
                <FiRefreshCw className="w-3.5 h-3.5" />
                Refresh status
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Employee_overload
