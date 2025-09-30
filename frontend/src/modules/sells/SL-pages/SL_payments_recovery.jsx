import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  FiArrowLeft, 
  FiSearch, 
  FiPlus,
  FiPhone,
  FiX,
  FiChevronDown,
  FiUser,
  FiFilter
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import SL_navbar from '../SL-components/SL_navbar'

const SL_payments_recovery = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    account: 'Vipins account'
  })
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [requestAmount, setRequestAmount] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Mock data for payments
  const paymentsData = [
    { id: 1, name: 'Alice', amount: 25000, phone: '+91 98765 43210', paidAmount: 10000 },
    { id: 2, name: 'Bob', amount: 4500, phone: '+91 98765 43211', paidAmount: 2000 },
    { id: 3, name: 'Charlie', amount: 3455, phone: '+91 98765 43212', paidAmount: 1000 },
    { id: 4, name: 'Justin', amount: 1123, phone: '+91 98765 43213', paidAmount: 500 },
    { id: 5, name: 'Max', amount: 6754, phone: '+91 98765 43214', paidAmount: 3000 },
    { id: 6, name: 'Stuny', amount: 3444, phone: '+91 98765 43215', paidAmount: 1500 }
  ]

  const totalDues = paymentsData.reduce((sum, payment) => sum + payment.amount, 0)

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'high', label: 'High Amount' },
    { id: 'medium', label: 'Medium Amount' },
    { id: 'low', label: 'Low Amount' }
  ]

  const filteredPayments = paymentsData.filter(payment => {
    const matchesSearch = payment.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         payment.phone.includes(searchTerm)
    
    let matchesFilter = true
    if (selectedFilter === 'high') {
      matchesFilter = payment.amount >= 10000
    } else if (selectedFilter === 'medium') {
      matchesFilter = payment.amount >= 3000 && payment.amount < 10000
    } else if (selectedFilter === 'low') {
      matchesFilter = payment.amount < 3000
    }
    
    return matchesSearch && matchesFilter
  })

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

  const handleWhatsApp = (client) => {
    setSelectedClient(client)
    setShowWhatsAppDialog(true)
  }

  const handleSendWhatsAppMessage = () => {
    if (!requestAmount || !selectedClient) return

    const cleanPhone = selectedClient.phone.replace(/\s+/g, '').replace('+91', '')
    const remainingAmount = selectedClient.amount - selectedClient.paidAmount
    const message = `Hello ${selectedClient.name},

Payment Request Details:
• Total Amount: ₹${selectedClient.amount.toLocaleString()}
• Already Paid: ₹${selectedClient.paidAmount.toLocaleString()}
• Remaining Amount: ₹${remainingAmount.toLocaleString()}
• Requested Amount: ₹${parseInt(requestAmount).toLocaleString()}
• Account: ${paymentForm.account}

Please make the payment at your earliest convenience. If you have any questions, feel free to contact us.

Thank you!`

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/91${cleanPhone}?text=${encodedMessage}`, '_blank')
    
    // Close dialog and reset
    setShowWhatsAppDialog(false)
    setSelectedClient(null)
    setRequestAmount('')
  }

  const handleCloseWhatsAppDialog = () => {
    setShowWhatsAppDialog(false)
    setSelectedClient(null)
    setRequestAmount('')
  }

  const handleProfile = (clientId) => {
    // Navigate to client profile page
    navigate(`/client-profile/${clientId}`)
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

        {/* Total Dues Card */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-4 mb-4 text-white">
          <h2 className="text-sm font-medium mb-1">Total dues</h2>
          <p className="text-2xl font-bold">₹ {totalDues.toLocaleString()} /-</p>
        </div>

        {/* Search Bar with Filter Icon */}
        <div className="relative mb-4">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
            <FiSearch className="text-sm" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full pl-8 pr-12 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
              showFilters 
                ? 'bg-teal-500 text-white shadow-md' 
                : 'text-gray-500 hover:text-teal-600 hover:bg-teal-50 border border-teal-200'
            }`}
          >
            <FiFilter className="text-base" />
          </button>
        </div>

        {/* Filters - Conditional Display */}
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedFilter === filter.id
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </motion.div>
        )}

        {/* Payments List */}
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              {/* Client Info Section */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{payment.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    <FiPhone className="mr-1 text-xs" />
                    {payment.phone}
                  </p>
                </div>
                
                {/* Amount Badge */}
                <div className="bg-red-50 px-3 py-1 rounded-full">
                  <p className="text-red-700 font-bold text-sm">₹{payment.amount.toLocaleString()}</p>
                </div>
              </div>

               {/* Action Buttons */}
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-2">
                   {/* Call Button */}
                   <button
                     onClick={() => handleCall(payment.phone)}
                     className="bg-white text-teal-600 border border-teal-200 px-2.5 py-1.5 rounded-lg hover:bg-teal-50 transition-all duration-200 text-xs font-medium"
                     title="Call"
                   >
                     Call
                   </button>

                   {/* WhatsApp Button */}
                   <button
                     onClick={() => handleWhatsApp(payment)}
                     className="bg-green-500 text-white p-1.5 rounded-lg hover:bg-green-600 transition-all duration-200"
                     title="WhatsApp"
                   >
                     <FaWhatsapp className="w-3.5 h-3.5" />
                   </button>

                   {/* Profile Button */}
                   <button
                     onClick={() => handleProfile(payment.id)}
                     className="bg-teal-500 text-white p-1.5 rounded-lg hover:bg-teal-600 transition-all duration-200"
                     title="View Profile"
                   >
                     <FiUser className="w-3.5 h-3.5" />
                   </button>
                 </div>

                 {/* Payment Action Button */}
                 <button
                   onClick={() => handlePaymentAction(payment)}
                   className="bg-teal-500 text-white p-1.5 rounded-lg hover:bg-teal-600 transition-all duration-200"
                   title="Record Payment"
                 >
                   <FiPlus className="w-3.5 h-3.5" />
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

      {/* WhatsApp Dialog */}
      {showWhatsAppDialog && selectedClient && (
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
              <h2 className="text-lg font-bold text-gray-900">Send WhatsApp Message</h2>
              <button
                onClick={handleCloseWhatsAppDialog}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <FiX className="text-lg text-gray-600" />
              </button>
            </div>

            {/* Client Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Client: <span className="font-semibold text-gray-900">{selectedClient.name}</span></p>
              <p className="text-sm text-gray-600">Total Amount: <span className="font-semibold text-gray-900">₹{selectedClient.amount.toLocaleString()}</span></p>
              <p className="text-sm text-gray-600">Already Paid: <span className="font-semibold text-green-600">₹{selectedClient.paidAmount.toLocaleString()}</span></p>
              <p className="text-sm text-gray-600">Remaining: <span className="font-semibold text-red-600">₹{(selectedClient.amount - selectedClient.paidAmount).toLocaleString()}</span></p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Request Amount Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Request Amount</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
                    <span className="text-lg">₹</span>
                  </div>
                  <input
                    type="number"
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                    placeholder="Enter amount to request"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Account Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Account Details</label>
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
                            setPaymentForm(prev => ({ ...prev, account }))
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
                onClick={handleCloseWhatsAppDialog}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSendWhatsAppMessage}
                disabled={!requestAmount}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  requestAmount 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Send Message
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default SL_payments_recovery
