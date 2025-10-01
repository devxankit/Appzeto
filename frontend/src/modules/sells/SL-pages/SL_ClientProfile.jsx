import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  FiPhone, 
  FiPlus,
  FiUser,
  FiArrowLeft,
  FiDollarSign,
  FiTrendingUp,
  FiPause,
  FiCheck,
  FiArrowRight,
  FiCreditCard,
  FiClock,
  FiCalendar,
  FiFileText,
  FiSettings,
  FiMessageCircle,
  FiEdit3,
  FiDownload,
  FiShare2
} from 'react-icons/fi'
import SL_navbar from '../SL-components/SL_navbar'
import { colors, gradients } from '../../../lib/colors'

const SL_ClientProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  console.log('Client Profile loaded with ID:', id)
  
  // Mock client data - in real app, fetch based on ID
  const clientData = {
    1: {
      id: 1,
      name: 'Teris',
      phone: '7846378987',
      avatar: 'T',
      totalCost: 50000,
      advanceReceived: 20000,
      pending: 30000,
      workProgress: 85,
      status: 'In Progress',
      projectType: 'E-commerce Website',
      startDate: '2024-01-15',
      expectedCompletion: '2024-03-15',
      lastPayment: '2024-02-01',
      nextPayment: '2024-02-15'
    },
    2: {
      id: 2,
      name: 'Ankit Ahirwar',
      phone: '9876543210',
      avatar: 'A',
      totalCost: 75000,
      advanceReceived: 50000,
      pending: 25000,
      workProgress: 100,
      status: 'Completed',
      projectType: 'Mobile App Development',
      startDate: '2024-01-01',
      expectedCompletion: '2024-02-15',
      lastPayment: '2024-02-15',
      nextPayment: 'N/A'
    }
  }
  
  const client = clientData[id] || clientData[1]
  
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showTransferConfirmation, setShowTransferConfirmation] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [amount, setAmount] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('Vipin\'s account')
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [showAccelerateModal, setShowAccelerateModal] = useState(false)
  const [showHoldModal, setShowHoldModal] = useState(false)
  const [showIncreaseCostModal, setShowIncreaseCostModal] = useState(false)
  const [accelerateReason, setAccelerateReason] = useState('')
  const [holdReason, setHoldReason] = useState('')
  const [increaseAmount, setIncreaseAmount] = useState('')
  const [increaseReason, setIncreaseReason] = useState('')
  const dropdownRef = useRef(null)
  
  const handleAddMoney = () => {
    if (amount) {
      console.log('Adding money:', amount, 'to account:', selectedAccount)
      setShowAddMoneyModal(false)
      setAmount('')
      setSelectedAccount('Vipin\'s account')
      setShowAccountDropdown(false)
    }
  }

  const accountOptions = [
    'Vipin\'s account',
    'Company account',
    'Personal account'
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAccountDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  const handleTransferClient = () => {
    if (selectedUser) {
      setShowTransferModal(false)
      setShowTransferConfirmation(true)
    }
  }

  const handleConfirmTransfer = () => {
    console.log('Transferring client to:', selectedUser)
    setShowTransferConfirmation(false)
    setSelectedUser('')
    setShowUserDropdown(false)
  }

  const userOptions = [
    'John Smith',
    'Sarah Johnson',
    'Mike Wilson',
    'Emily Davis',
    'David Brown',
    'Lisa Anderson'
  ]
  
  const handleCompleteProject = () => {
    console.log('Completing project')
    // Navigate to completion page or show success message
  }
  
  const handleAccelerateWork = () => {
    if (accelerateReason) {
      console.log('Accelerating work with reason:', accelerateReason)
      setShowAccelerateModal(false)
      setAccelerateReason('')
    }
  }
  
  const handleHoldWork = () => {
    if (holdReason) {
      console.log('Holding work with reason:', holdReason)
      setShowHoldModal(false)
      setHoldReason('')
    }
  }
  
  const handleIncreaseCost = () => {
    if (increaseAmount && increaseReason) {
      console.log('Increasing cost:', increaseAmount, 'with reason:', increaseReason)
      setShowIncreaseCostModal(false)
      setIncreaseAmount('')
      setIncreaseReason('')
    }
  }
  
  const handleViewTransactions = () => {
    console.log('Viewing transactions')
    navigate(`/client-transaction/${id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <SL_navbar />
      
      <main className="max-w-md mx-auto min-h-screen pt-16 pb-20">

        {/* Client Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-4 mt-4 rounded-2xl overflow-hidden shadow-xl border border-teal-300/40"
          style={{ 
            background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1, #99f6e4)',
            boxShadow: '0 8px 25px -5px rgba(20, 184, 166, 0.2), 0 4px 12px -3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">{client.avatar}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-teal-800">{client.name}</h2>
                    <p className="text-teal-600 text-sm">{client.phone}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-teal-700 text-sm">Total Cost</span>
                    <span className="text-teal-800 font-semibold">₹{client.totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-teal-700 text-sm">Advance Received</span>
                    <span className="text-teal-800 font-semibold">₹{client.advanceReceived.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-teal-700 text-sm">Pending</span>
                    <span className="text-teal-800 font-semibold">₹{client.pending.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Work Progress Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-4 mt-6 bg-white rounded-2xl p-6 shadow-xl border border-teal-100"
          style={{
            boxShadow: '0 4px 12px -3px rgba(20, 184, 166, 0.1), 0 2px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Work Progress</h3>
            <span className="text-lg font-semibold text-gray-600">{client.workProgress}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${client.workProgress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-3 rounded-full"
              style={{ background: gradients.primary }}
            />
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Status: <span className="font-medium text-teal-700">{client.status}</span></p>
            <p>Project: <span className="text-teal-600">{client.projectType}</span></p>
          </div>
        </motion.div>

        {/* Action Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-4 mt-6 space-y-4"
        >
          {/* Transactions Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewTransactions}
            className="bg-white rounded-xl p-4 shadow-lg border border-teal-100 cursor-pointer hover:shadow-xl transition-all"
            style={{
              boxShadow: '0 4px 12px -3px rgba(20, 184, 166, 0.1), 0 2px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                  <FiFileText className="w-5 h-5 text-teal-600" />
                </div>
                <span className="font-semibold text-gray-800">Transactions</span>
              </div>
              <FiArrowRight className="w-5 h-5 text-teal-500" />
            </div>
          </motion.div>

          {/* Add Money Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddMoneyModal(true)}
            className="w-full rounded-xl p-4 shadow-xl border-0 text-white font-semibold flex items-center justify-center gap-2"
            style={{ 
              background: gradients.primary,
              boxShadow: '0 8px 25px -5px rgba(20, 184, 166, 0.3), 0 4px 12px -3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            <FiPlus className="w-5 h-5" />
            Add Money
          </motion.button>

          {/* Accelerate Work Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAccelerateModal(true)}
            className="bg-white rounded-xl p-4 shadow-lg border border-teal-100 cursor-pointer hover:shadow-xl transition-all"
            style={{
              boxShadow: '0 4px 12px -3px rgba(20, 184, 166, 0.1), 0 2px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                  <FiTrendingUp className="w-5 h-5 text-teal-600" />
                </div>
                <span className="font-semibold text-gray-800">Accelerate work</span>
              </div>
              <FiArrowRight className="w-5 h-5 text-teal-500" />
            </div>
          </motion.div>

          {/* Hold Work Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowHoldModal(true)}
            className="bg-white rounded-xl p-4 shadow-lg border border-teal-100 cursor-pointer hover:shadow-xl transition-all"
            style={{
              boxShadow: '0 4px 12px -3px rgba(20, 184, 166, 0.1), 0 2px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                  <FiPause className="w-5 h-5 text-teal-600" />
                </div>
                <span className="font-semibold text-gray-800">Hold work</span>
              </div>
              <FiArrowRight className="w-5 h-5 text-teal-500" />
            </div>
          </motion.div>

          {/* Increase Cost Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowIncreaseCostModal(true)}
            className="bg-white rounded-xl p-4 shadow-lg border border-teal-100 cursor-pointer hover:shadow-xl transition-all"
            style={{
              boxShadow: '0 4px 12px -3px rgba(20, 184, 166, 0.1), 0 2px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                  <FiDollarSign className="w-5 h-5 text-teal-600" />
                </div>
                <span className="font-semibold text-gray-800">Increase cost</span>
              </div>
              <FiArrowRight className="w-5 h-5 text-teal-500" />
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-4 mt-8 mb-8 space-y-3"
        >
          {/* Transfer Client Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowTransferModal(true)}
            className="w-full rounded-xl p-4 shadow-xl border-0 text-white font-semibold flex items-center justify-center gap-2"
            style={{ 
              background: gradients.primary,
              boxShadow: '0 8px 25px -5px rgba(20, 184, 166, 0.3), 0 4px 12px -3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            <FiArrowRight className="w-5 h-5" />
            Transfer Client
          </motion.button>

          {/* No Dues Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCompleteProject}
            className="w-full rounded-xl p-4 shadow-xl border-0 text-white font-semibold flex items-center justify-center gap-2"
            style={{ 
              background: gradients.primary,
              boxShadow: '0 8px 25px -5px rgba(20, 184, 166, 0.3), 0 4px 12px -3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            <FiCheck className="w-5 h-5" />
            No Dues
          </motion.button>
        </motion.div>

        {/* Add Money Modal */}
        {showAddMoneyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddMoneyModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">{client.name}</h3>
              
              <div className="space-y-4">
                {/* Amount Input */}
                <div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <span className="text-teal-600 font-bold text-lg">₹</span>
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Amount"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Choose Account Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Account
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 bg-white text-left flex items-center justify-between"
                    >
                      <span className="text-gray-800">{selectedAccount}</span>
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showAccountDropdown ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Options */}
                    {showAccountDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                      >
                        {accountOptions.map((option, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setSelectedAccount(option)
                              setShowAccountDropdown(false)
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                              selectedAccount === option ? 'bg-teal-50 text-teal-700' : 'text-gray-800'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddMoneyModal(false)}
                    className="flex-1 px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMoney}
                    className="flex-1 px-4 py-3 rounded-lg text-white font-medium"
                    style={{ background: gradients.primary }}
                  >
                    Add money
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Transfer Client Modal */}
        {showTransferModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowTransferModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Transfer Client</h3>
              
              <div className="space-y-4">
                {/* User Selection Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Team Member
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 bg-white text-left flex items-center justify-between"
                    >
                      <span className="text-gray-800">
                        {selectedUser || 'Choose team member'}
                      </span>
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Options */}
                    {showUserDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
                      >
                        {userOptions.map((user, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setSelectedUser(user)
                              setShowUserDropdown(false)
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                              selectedUser === user ? 'bg-teal-50 text-teal-700' : 'text-gray-800'
                            }`}
                          >
                            {user}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowTransferModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTransferClient}
                    disabled={!selectedUser}
                    className={`flex-1 px-4 py-3 rounded-lg text-white font-medium ${
                      selectedUser 
                        ? 'opacity-100' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    style={{ background: gradients.primary }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Transfer Confirmation Modal */}
        {showTransferConfirmation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowTransferConfirmation(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Transfer</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to transfer <span className="font-semibold">{client.name}</span> to <span className="font-semibold">{selectedUser}</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowTransferConfirmation(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmTransfer}
                  className="flex-1 px-4 py-3 rounded-lg text-white font-medium"
                  style={{ background: gradients.primary }}
                >
                  Transfer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Accelerate Work Modal */}
        {showAccelerateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAccelerateModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Accelerate work</h3>
              
              <div className="space-y-4">
                {/* Reason Input */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-teal-600 text-lg">⚡</span>
                  </div>
                  <input
                    type="text"
                    value={accelerateReason}
                    onChange={(e) => setAccelerateReason(e.target.value)}
                    placeholder="Enter reason here"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowAccelerateModal(false)}
                    className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAccelerateWork}
                    className="px-4 py-2 rounded-lg text-white font-medium"
                    style={{ background: gradients.primary }}
                  >
                    Ok
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Hold Work Modal */}
        {showHoldModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowHoldModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Hold work</h3>
              
              <div className="space-y-4">
                {/* Reason Input */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <div className="w-1 h-3 bg-teal-600 rounded-sm mr-0.5"></div>
                      <div className="w-1 h-3 bg-teal-600 rounded-sm"></div>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={holdReason}
                    onChange={(e) => setHoldReason(e.target.value)}
                    placeholder="Enter reason here"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowHoldModal(false)}
                    className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleHoldWork}
                    className="px-4 py-2 rounded-lg text-white font-medium"
                    style={{ background: gradients.primary }}
                  >
                    Ok
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Increase Cost Modal */}
        {showIncreaseCostModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowIncreaseCostModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Increase cost</h3>
              
              <div className="space-y-4">
                {/* Amount Input */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-teal-600 font-bold text-lg">₹</span>
                  </div>
                  <input
                    type="number"
                    value={increaseAmount}
                    onChange={(e) => setIncreaseAmount(e.target.value)}
                    placeholder="Amount"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                  />
                </div>

                {/* Reason Input */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <FiTrendingUp className="w-5 h-5 text-teal-600" />
                  </div>
                  <input
                    type="text"
                    value={increaseReason}
                    onChange={(e) => setIncreaseReason(e.target.value)}
                    placeholder="Enter reason here"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowIncreaseCostModal(false)}
                    className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleIncreaseCost}
                    className="px-4 py-2 rounded-lg text-white font-medium"
                    style={{ background: gradients.primary }}
                  >
                    Ok
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default SL_ClientProfile