import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { 
  FiPhone, 
  FiPlus,
  FiUser,
  FiSave,
  FiMessageCircle,
  FiEdit3,
  FiPlay,
  FiX,
  FiArrowLeft,
  FiCheck,
  FiRefreshCw,
  FiFolder,
  FiCalendar,
  FiFileText,
  FiDollarSign,
  FiImage,
  FiUpload,
  FiClock,
  FiSend
} from 'react-icons/fi'
import SL_navbar from '../SL-components/SL_navbar'

const SL_leadProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  console.log('Client Profile loaded with ID:', id)
  
  // Mock client data - in real app, fetch based on ID
  const clientData = {
    1: {
      id: 1,
      name: 'Alice Brown',
      phone: '7654321098',
      business: 'Cloth shop ecommerce',
      estimatedCost: '50k',
      avatar: 'A',
      status: {
        quotationSent: false,
        web: false,
        hotLead: false,
        demoSent: false,
        app: false
      }
    },
    2: {
      id: 2,
      name: 'John Doe',
      phone: '9845637236',
      business: 'Restaurant chain',
      estimatedCost: '75k',
      avatar: 'J',
      status: {
        quotationSent: true,
        web: false,
        hotLead: true,
        demoSent: false,
        app: false
      }
    },
    3: {
      id: 3,
      name: 'Jane Smith',
      phone: '9876543210',
      business: 'Tech startup',
      estimatedCost: '100k',
      avatar: 'J',
      status: {
        quotationSent: false,
        web: true,
        hotLead: false,
        demoSent: true,
        app: true
      }
    }
  }

  const client = clientData[id] || clientData[1]
  const [status, setStatus] = useState(client.status)
  const [isLoading, setIsLoading] = useState(false)
  const [showConvertedDialog, setShowConvertedDialog] = useState(false)
  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false)
  const [showRequestDemoDialog, setShowRequestDemoDialog] = useState(false)
  const [showLostDialog, setShowLostDialog] = useState(false)
  const [convertedForm, setConvertedForm] = useState({
    clientName: client.name,
    projectName: '',
    mobileNo: client.phone,
    finishedDays: '',
    web: false,
    app: false,
    description: '',
    totalCost: '',
    advanceReceived: '',
    includeGST: false
  })
  const [followUpForm, setFollowUpForm] = useState({
    date: null,
    time: '',
    notes: '',
    type: 'call'
  })
  const [requestDemoForm, setRequestDemoForm] = useState({
    clientName: client.name,
    description: '',
    reference: '',
    mobileNumber: client.phone
  })
  const [lostReason, setLostReason] = useState('')
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)

  const handleCall = (phone) => {
    window.open(`tel:${phone}`, '_self')
  }

  const handleWhatsApp = (phone) => {
    const message = encodeURIComponent(`Hello ${client.name}! I'm following up on our previous conversation. How can I help you today?`)
    window.open(`https://wa.me/91${phone}?text=${message}`, '_blank')
  }

  const handleStatusChange = (statusKey) => {
    setStatus(prev => ({
      ...prev,
      [statusKey]: !prev[statusKey]
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    // Show success message or handle response
    console.log('Status saved:', status)
  }

  const handleAddFollow = () => {
    setShowFollowUpDialog(true)
  }

  const handleFollowUpFormChange = (field, value) => {
    setFollowUpForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFollowUpSubmit = async () => {
    if (!followUpForm.date || !followUpForm.time) {
      alert('Please select both date and time')
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setShowFollowUpDialog(false)
    console.log('Follow-up scheduled:', followUpForm)
    
    // Reset form
    setFollowUpForm({
      date: null,
      time: '',
      notes: '',
      type: 'call'
    })
  }

  const followUpTypes = [
    { value: 'call', label: 'Phone Call', icon: '📞' },
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'meeting', label: 'Meeting', icon: '🤝' },
    { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
    { value: 'visit', label: 'Site Visit', icon: '🏢' },
    { value: 'demo', label: 'Demo', icon: '🎯' }
  ]

  const getTypeIcon = (type) => {
    const typeObj = followUpTypes.find(t => t.value === type)
    return typeObj ? typeObj.icon : '📞'
  }

  const getTypeLabel = (type) => {
    const typeObj = followUpTypes.find(t => t.value === type)
    return typeObj ? typeObj.label : 'Phone Call'
  }

  const handleCloseFollowUpDialog = () => {
    setShowFollowUpDialog(false)
    setShowTypeDropdown(false)
  }

  const handleAddNote = () => {
    navigate(`/client-notes/${client.id}`)
  }

  const handleRequestDemo = () => {
    setShowRequestDemoDialog(true)
  }

  const handleRequestDemoFormChange = (field, value) => {
    setRequestDemoForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRequestDemoSubmit = async () => {
    if (!requestDemoForm.clientName || !requestDemoForm.mobileNumber) {
      alert('Please fill in client name and mobile number')
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setShowRequestDemoDialog(false)
    console.log('Demo request submitted:', requestDemoForm)
    
    // Reset form
    setRequestDemoForm({
      clientName: client.name,
      description: '',
      reference: '',
      mobileNumber: client.phone
    })
  }

  const handleCloseRequestDemoDialog = () => {
    setShowRequestDemoDialog(false)
  }

  const handleLost = () => {
    setShowLostDialog(true)
  }

  const handleLostSubmit = async () => {
    if (!lostReason.trim()) {
      alert('Please enter a reason for marking this lead as lost')
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setShowLostDialog(false)
    setStatus('lost')
    console.log('Lead marked as lost:', { clientId: client.id, reason: lostReason })
    
    // Reset form
    setLostReason('')
  }

  const handleCloseLostDialog = () => {
    setShowLostDialog(false)
    setLostReason('')
  }

  const handleTransferClient = () => {
    console.log('Transfer client:', client.id)
    // Open transfer modal
  }

  const handleConverted = () => {
    setShowConvertedDialog(true)
  }

  const handleConvertedFormChange = (field, value) => {
    setConvertedForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleConvertedSubmit = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setShowConvertedDialog(false)
    console.log('Converted form submitted:', convertedForm)
  }

  const handleCloseDialog = () => {
    setShowConvertedDialog(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SL_navbar />
      
      <main className="max-w-md mx-auto px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        
        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Header with Back Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-6"
          >
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-teal-50 rounded-full transition-colors duration-200"
            >
              <FiArrowLeft className="text-xl text-teal-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Client Profile</h1>
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                E-cost: {client.estimatedCost}
              </div>
              <button className="p-2 hover:bg-teal-50 rounded-full transition-colors duration-200">
                <FiPlus className="text-xl text-teal-600" />
              </button>
            </div>
          </motion.div>

          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6"
          >
            {/* Avatar and Basic Info */}
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                  <span className="text-2xl font-bold text-white">{client.avatar}</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{client.name}</h2>
              <p className="text-lg text-teal-600 mb-1 font-medium">{client.phone}</p>
              <p className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full inline-block">{client.business}</p>
            </div>

            {/* Contact Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => handleCall(client.phone)}
                className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiPhone className="text-lg" />
                <span>Call</span>
              </button>
              <button
                onClick={() => handleWhatsApp(client.phone)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiMessageCircle className="text-lg" />
                <span>WhatsApp</span>
              </button>
            </div>
          </motion.div>

          {/* Status Checkboxes */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-white to-teal-50 rounded-2xl p-6 shadow-lg border border-teal-200 mb-6"
          >
            <h3 className="text-lg font-semibold text-teal-900 mb-4 flex items-center">
              <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
              Lead Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-teal-50 transition-colors duration-200">
                <input
                  type="checkbox"
                  checked={status.quotationSent}
                  onChange={() => handleStatusChange('quotationSent')}
                  className="w-5 h-5 text-teal-600 border-teal-300 rounded focus:ring-teal-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-teal-800">Quotation Sent</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-teal-50 transition-colors duration-200">
                <input
                  type="checkbox"
                  checked={status.web}
                  onChange={() => handleStatusChange('web')}
                  className="w-5 h-5 text-teal-600 border-teal-300 rounded focus:ring-teal-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-teal-800">Web</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-teal-50 transition-colors duration-200">
                <input
                  type="checkbox"
                  checked={status.hotLead}
                  onChange={() => handleStatusChange('hotLead')}
                  className="w-5 h-5 text-teal-600 border-teal-300 rounded focus:ring-teal-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-teal-800">Hot Lead</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-teal-50 transition-colors duration-200">
                <input
                  type="checkbox"
                  checked={status.demoSent}
                  onChange={() => handleStatusChange('demoSent')}
                  className="w-5 h-5 text-teal-600 border-teal-300 rounded focus:ring-teal-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-teal-800">Demo Sent</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer col-span-2 p-2 rounded-lg hover:bg-teal-50 transition-colors duration-200">
                <input
                  type="checkbox"
                  checked={status.app}
                  onChange={() => handleStatusChange('app')}
                  className="w-5 h-5 text-teal-600 border-teal-300 rounded focus:ring-teal-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-teal-800">App</span>
              </label>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6"
          >
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-teal-600 hover:to-teal-700 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiSave className="text-lg" />
              )}
              <span>{isLoading ? 'Saving...' : 'Save'}</span>
            </button>
          </motion.div>

          {/* Action Buttons Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 gap-3 mb-6"
          >
            <button
              onClick={handleAddFollow}
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:from-teal-600 hover:to-teal-700 transition-all duration-200"
            >
              Add Follow Up
            </button>
            
            <button
              onClick={handleAddNote}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
            >
              Add Note
            </button>
            
            <button
              onClick={handleRequestDemo}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
            >
              Request Demo
            </button>
            
            <button
              onClick={handleLost}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:from-red-600 hover:to-red-700 transition-all duration-200"
            >
              Lost
            </button>
          </motion.div>

          {/* Transfer Client Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-6"
          >
            <button
              onClick={handleTransferClient}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-teal-600 hover:to-teal-700 transition-all duration-200"
            >
              <FiRefreshCw className="text-lg" />
              <span>Transfer Client</span>
            </button>
          </motion.div>

          {/* Converted Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button
              onClick={handleConverted}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-teal-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FiCheck className="text-lg" />
              <span>Converted</span>
            </button>
          </motion.div>
        </div>

        {/* Converted Dialog */}
        {showConvertedDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Dialog Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Convert Client</h2>
                <button
                  onClick={handleCloseDialog}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <FiX className="text-xl text-gray-600" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Client Name */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
                      <FiUser className="text-lg" />
                    </div>
                    <input
                      type="text"
                      value={convertedForm.clientName}
                      onChange={(e) => handleConvertedFormChange('clientName', e.target.value)}
                      placeholder="Client name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Project Name */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
                      <FiFolder className="text-lg" />
                    </div>
                    <input
                      type="text"
                      value={convertedForm.projectName}
                      onChange={(e) => handleConvertedFormChange('projectName', e.target.value)}
                      placeholder="Project name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Mobile No */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
                      <FiPhone className="text-lg" />
                    </div>
                    <input
                      type="tel"
                      value={convertedForm.mobileNo}
                      onChange={(e) => handleConvertedFormChange('mobileNo', e.target.value)}
                      placeholder="Mobile no."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Finished Days */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
                      <FiCalendar className="text-lg" />
                    </div>
                    <input
                      type="number"
                      value={convertedForm.finishedDays}
                      onChange={(e) => handleConvertedFormChange('finishedDays', e.target.value)}
                      placeholder="Finished days"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Web and App Checkboxes */}
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={convertedForm.web}
                      onChange={(e) => handleConvertedFormChange('web', e.target.checked)}
                      className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Web</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={convertedForm.app}
                      onChange={(e) => handleConvertedFormChange('app', e.target.checked)}
                      className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700">App</span>
                  </label>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
                      <FiFileText className="text-lg" />
                    </div>
                    <input
                      type="text"
                      value={convertedForm.description}
                      onChange={(e) => handleConvertedFormChange('description', e.target.value)}
                      placeholder="Description"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Total Cost */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
                      <FiDollarSign className="text-lg" />
                    </div>
                    <input
                      type="number"
                      value={convertedForm.totalCost}
                      onChange={(e) => handleConvertedFormChange('totalCost', e.target.value)}
                      placeholder="Total cost"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Advance Received */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
                      <FiCheck className="text-lg" />
                    </div>
                    <input
                      type="number"
                      value={convertedForm.advanceReceived}
                      onChange={(e) => handleConvertedFormChange('advanceReceived', e.target.value)}
                      placeholder="Advance received"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Upload Screenshot Section */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Upload Screenshot</h3>
                  <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300 text-center hover:border-teal-300 transition-colors duration-200">
                    <FiImage className="text-gray-400 text-4xl mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Drop image here or click to upload</p>
                  </div>
                  
                  {/* Include GST Checkbox */}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={convertedForm.includeGST}
                      onChange={(e) => handleConvertedFormChange('includeGST', e.target.checked)}
                      className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Include GST</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  onClick={handleConvertedSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-teal-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiCheck className="text-lg" />
                  )}
                  <span>{isLoading ? 'Converting...' : 'Converted'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Follow-up Dialog */}
        {showFollowUpDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              {/* Dialog Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Schedule Follow-up</h2>
                <button
                  onClick={handleCloseFollowUpDialog}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <FiX className="text-xl text-gray-600" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                {/* Date Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <div className="relative">
                    <DatePicker
                      selected={followUpForm.date}
                      onChange={(date) => handleFollowUpFormChange('date', date)}
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                      placeholderText="Select date"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                      wrapperClassName="w-full"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600 pointer-events-none">
                      <FiCalendar className="text-lg" />
                    </div>
                  </div>
                </div>

                {/* Time Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Time</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
                      <FiClock className="text-lg" />
                    </div>
                    <input
                      type="time"
                      value={followUpForm.time}
                      onChange={(e) => handleFollowUpFormChange('time', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Follow-up Type - Custom Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getTypeIcon(followUpForm.type)}</span>
                        <span>{getTypeLabel(followUpForm.type)}</span>
                      </div>
                      <FiArrowLeft className={`text-gray-400 transition-transform duration-200 ${showTypeDropdown ? 'rotate-90' : '-rotate-90'}`} />
                    </button>
                    
                    {showTypeDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
                      >
                        {followUpTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => {
                              handleFollowUpFormChange('type', type.value)
                              setShowTypeDropdown(false)
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-teal-50 transition-colors duration-200 flex items-center space-x-3 ${
                              followUpForm.type === type.value ? 'bg-teal-50 text-teal-700' : 'text-gray-700'
                            }`}
                          >
                            <span className="text-lg">{type.icon}</span>
                            <span>{type.label}</span>
                            {followUpForm.type === type.value && (
                              <FiCheck className="ml-auto text-teal-600" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Notes Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Notes (Optional)</label>
                  <textarea
                    value={followUpForm.notes}
                    onChange={(e) => handleFollowUpFormChange('notes', e.target.value)}
                    placeholder="Add any notes about this follow-up..."
                    className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 resize-none"
                    rows={3}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  onClick={handleFollowUpSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-teal-600 hover:to-teal-700 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiCalendar className="text-lg" />
                  )}
                  <span>{isLoading ? 'Scheduling...' : 'Schedule Follow-up'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Request Demo Dialog */}
        {showRequestDemoDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              {/* Dialog Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Request Demo</h2>
                <button
                  onClick={handleCloseRequestDemoDialog}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <FiX className="text-xl text-gray-600" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Client Name Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
                      <FiUser className="text-lg" />
                    </div>
                    <input
                      type="text"
                      value={requestDemoForm.clientName}
                      onChange={(e) => handleRequestDemoFormChange('clientName', e.target.value)}
                      placeholder="Enter client name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
                      <FiFileText className="text-lg" />
                    </div>
                    <input
                      type="text"
                      value={requestDemoForm.description}
                      onChange={(e) => handleRequestDemoFormChange('description', e.target.value)}
                      placeholder="Enter description"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Reference Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
                      <FiFolder className="text-lg" />
                    </div>
                    <input
                      type="text"
                      value={requestDemoForm.reference}
                      onChange={(e) => handleRequestDemoFormChange('reference', e.target.value)}
                      placeholder="Reference"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Mobile Number Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
                      <FiPhone className="text-lg" />
                    </div>
                    <input
                      type="tel"
                      value={requestDemoForm.mobileNumber}
                      onChange={(e) => handleRequestDemoFormChange('mobileNumber', e.target.value)}
                      placeholder="Enter client mobile number"
                      maxLength={10}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                      {requestDemoForm.mobileNumber.length}/10
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  onClick={handleRequestDemoSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-teal-600 hover:to-teal-700 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiSend className="text-lg" />
                  )}
                  <span>{isLoading ? 'Sending...' : 'Send'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Lost Dialog */}
        {showLostDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              {/* Dialog Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Reason</h2>
                <button
                  onClick={handleCloseLostDialog}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <FiX className="text-xl text-gray-600" />
                </button>
              </div>

              {/* Reason Input Field */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
                    <FiUser className="text-lg" />
                  </div>
                  <input
                    type="text"
                    value={lostReason}
                    onChange={(e) => setLostReason(e.target.value)}
                    placeholder="Enter reason here"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={handleCloseLostDialog}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLostSubmit}
                  disabled={isLoading}
                  className="px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : null}
                  <span>{isLoading ? 'Marking...' : 'Ok'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="max-w-2xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <FiArrowLeft className="text-xl text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Client Profile</h1>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                  <FiPlus className="text-xl text-teal-600" />
                </button>
              </div>

              {/* Profile Section */}
              <div className="text-center mb-8">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-white">{client.avatar}</span>
                  </div>
                  <div className="absolute -top-3 -right-3 bg-teal-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {client.estimatedCost}
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{client.name}</h2>
                <p className="text-xl text-gray-600 mb-2">{client.phone}</p>
                <p className="text-base text-gray-500">{client.business}</p>
              </div>

              {/* Contact Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => handleCall(client.phone)}
                  className="bg-teal-500 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 hover:bg-teal-600 transition-colors duration-200"
                >
                  <FiPhone className="text-xl" />
                  <span>Call</span>
                </button>
                <button
                  onClick={() => handleWhatsApp(client.phone)}
                  className="bg-green-500 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 hover:bg-green-600 transition-colors duration-200"
                >
                  <FiMessageCircle className="text-xl" />
                  <span>WhatsApp</span>
                </button>
              </div>

              {/* Status Checkboxes */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Lead Status</h3>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { key: 'quotationSent', label: 'Quotation Sent' },
                    { key: 'web', label: 'Web' },
                    { key: 'hotLead', label: 'Hot Lead' },
                    { key: 'demoSent', label: 'Demo Sent' },
                    { key: 'app', label: 'App' }
                  ].map((item) => (
                    <label key={item.key} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={status[item.key]}
                        onChange={() => handleStatusChange(item.key)}
                        className="w-6 h-6 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                      />
                      <span className="text-base font-medium text-gray-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 hover:from-teal-600 hover:to-teal-700 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiSave className="text-xl" />
                  )}
                  <span>{isLoading ? 'Saving...' : 'Save'}</span>
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleAddFollow}
                    className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-200"
                  >
                    Add Follow Up
                  </button>
                  
                  <button
                    onClick={handleAddNote}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
                  >
                    Add Note
                  </button>
                  
                  <button
                    onClick={handleRequestDemo}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                  >
                    Request Demo
                  </button>
                  
                  <button
                    onClick={handleLost}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200"
                  >
                    Lost
                  </button>
                </div>

                <button
                  onClick={handleTransferClient}
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 hover:from-teal-600 hover:to-teal-700 transition-all duration-200"
                >
                  <FiRefreshCw className="text-xl" />
                  <span>Transfer Client</span>
                </button>

                <button
                  onClick={handleConverted}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-teal-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FiCheck className="text-lg" />
                  <span>Converted</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SL_leadProfile
