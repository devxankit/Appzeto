import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  FiArrowLeft, 
  FiSearch, 
  FiPlus,
  FiPhone,
  FiX,
  FiChevronDown
} from 'react-icons/fi'
import SL_navbar from '../SL-components/SL_navbar'

const SL_payments_recovery = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    account: 'Vipins account'
  })
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)

  // Mock data for payments
  const paymentsData = [
    { id: 1, name: 'Alice', amount: 25000, phone: '+91 98765 43210' },
    { id: 2, name: 'Bob', amount: 4500, phone: '+91 98765 43211' },
    { id: 3, name: 'Charlie', amount: 3455, phone: '+91 98765 43212' },
    { id: 4, name: 'Justin', amount: 1123, phone: '+91 98765 43213' },
    { id: 5, name: 'Max', amount: 6754, phone: '+91 98765 43214' },
    { id: 6, name: 'Stuny', amount: 3444, phone: '+91 98765 43215' }
  ]

  const totalDues = paymentsData.reduce((sum, payment) => sum + payment.amount, 0)

  const filteredPayments = paymentsData.filter(payment =>
    payment.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePaymentAction = (payment) => {
    setSelectedPayment(payment)
    setShowPaymentDialog(true)
  }

  const handlePaymentFormChange = (field, value) => {
    setPaymentForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePaymentSubmit = () => {
    if (!paymentForm.amount) {
      alert('Please enter an amount')
      return
    }
    console.log('Payment recorded:', {
      client: selectedPayment.name,
      amount: paymentForm.amount,
      account: paymentForm.account
    })
    setShowPaymentDialog(false)
    setPaymentForm({ amount: '', account: 'Vipins account' })
    setSelectedPayment(null)
  }

  const handleClosePaymentDialog = () => {
    setShowPaymentDialog(false)
    setPaymentForm({ amount: '', account: 'Vipins account' })
    setSelectedPayment(null)
  }

  const handleCall = (phone) => {
    window.open(`tel:${phone}`, '_self')
  }

  const accountOptions = [
    'Vipins account',
    'Business account',
    'Personal account',
    'Savings account'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <SL_navbar />
      
      <main className="max-w-2xl mx-auto px-4 pt-16 pb-20">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <FiArrowLeft className="text-xl text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Payment Recovery</h1>
        </div>

        {/* Total Dues Card */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-4 mb-4 text-white">
          <h2 className="text-sm font-medium mb-1">Total dues</h2>
          <p className="text-2xl font-bold">₹ {totalDues.toLocaleString()} /-</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
            <FiSearch className="text-sm" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        {/* Payments List */}
        <div className="space-y-3">
          {filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                {/* Name */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{payment.name}</h3>
                </div>

                {/* Amount */}
                <div className="text-center mx-4">
                  <p className="text-lg font-bold text-gray-900">{payment.amount}</p>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handlePaymentAction(payment)}
                  className="w-8 h-8 bg-red-50 text-red-600 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors duration-200"
                >
                  <FiPlus className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Payment Dialog */}
      {showPaymentDialog && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl"
          >
            {/* Dialog Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">{selectedPayment.name}</h2>
              <button
                onClick={handleClosePaymentDialog}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <FiX className="text-lg text-gray-600" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Amount Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Amount</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
                    <span className="text-lg">₹</span>
                  </div>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => handlePaymentFormChange('amount', e.target.value)}
                    placeholder="Amount"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Account Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Choose Account</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 flex items-center justify-between"
                  >
                    <span>{paymentForm.account}</span>
                    <FiChevronDown className={`text-gray-400 transition-transform duration-200 ${showAccountDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showAccountDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                    >
                      {accountOptions.map((account) => (
                        <button
                          key={account}
                          type="button"
                          onClick={() => {
                            handlePaymentFormChange('account', account)
                            setShowAccountDropdown(false)
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-teal-50 transition-colors duration-200 ${
                            paymentForm.account === account ? 'bg-teal-50 text-teal-700' : 'text-gray-700'
                          }`}
                        >
                          {account}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={handleClosePaymentDialog}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentSubmit}
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 transition-all duration-200"
              >
                Amount received
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default SL_payments_recovery
