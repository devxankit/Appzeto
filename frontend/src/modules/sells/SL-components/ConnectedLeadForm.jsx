import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiX, 
  FiUser, 
  FiHome, 
  FiMail, 
  FiDollarSign, 
  FiFileText,
  FiCheck,
  FiGlobe,
  FiSmartphone,
  FiTruck
} from 'react-icons/fi'
import { salesLeadService } from '../SL-services'
import { useToast } from '../../../contexts/ToastContext'

const ConnectedLeadForm = ({ 
  isOpen, 
  onClose, 
  leadId, 
  onSubmit, 
  initialData = {},
  title = "Mark as Connected",
  submitText = "Create Profile & Connect"
}) => {
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    businessName: initialData.businessName || '',
    email: initialData.email || '',
    projectType: {
      web: initialData.projectType?.web || false,
      app: initialData.projectType?.app || false,
      taxi: initialData.projectType?.taxi || false
    },
    estimatedCost: initialData.estimatedCost || '',
    description: initialData.description || '',
    quotationSent: initialData.quotationSent || false,
    demoSent: initialData.demoSent || false
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleProjectTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      projectType: {
        ...prev.projectType,
        [type]: !prev.projectType[type]
      }
    }))
    // Clear projectType error when user selects something
    if (errors.projectType) {
      setErrors(prev => ({ ...prev, projectType: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.projectType.web && !formData.projectType.app && !formData.projectType.taxi) {
      newErrors.projectType = 'At least one project type must be selected'
    }
    
    if (!formData.estimatedCost || formData.estimatedCost < 0) {
      newErrors.estimatedCost = 'Estimated cost is required and must be 0 or greater'
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      // Prepare data for API
      const profileData = {
        name: formData.name.trim(),
        businessName: formData.businessName.trim(),
        email: formData.email.trim() || undefined,
        projectType: formData.projectType,
        estimatedCost: parseFloat(formData.estimatedCost) || 0,
        description: formData.description.trim(),
        quotationSent: formData.quotationSent,
        demoSent: formData.demoSent
      }

      // Call the onSubmit callback with the profile data
      await onSubmit(profileData)
      
      // Reset form
      setFormData({
        name: '',
        businessName: '',
        email: '',
        projectType: { web: false, app: false, taxi: false },
        estimatedCost: '',
        description: '',
        quotationSent: false,
        demoSent: false
      })
      setErrors({})
      
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to create profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      businessName: '',
      email: '',
      projectType: { web: false, app: false, taxi: false },
      estimatedCost: '',
      description: '',
      quotationSent: false,
      demoSent: false
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 p-6 text-white relative">
            <button
              onClick={handleClose}
              className="absolute top-6 left-6 p-2 hover:bg-teal-600/50 rounded-full transition-colors duration-200"
              aria-label="Close modal"
            >
              <FiX className="text-xl" />
            </button>
            <h2 className="text-xl font-bold text-center">{title}</h2>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-600">
                  <FiUser className="text-xl" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter client name"
                  className={`w-full pl-12 pr-4 py-4 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 ${
                    errors.name ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Business Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Business Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-600">
                  <FiHome className="text-xl" />
                </div>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Enter business name"
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-600">
                  <FiMail className="text-xl" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className={`w-full pl-12 pr-4 py-4 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 ${
                    errors.email ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Project Type Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Project Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'web', label: 'Web', icon: FiGlobe, color: 'blue' },
                  { key: 'app', label: 'App', icon: FiSmartphone, color: 'green' },
                  { key: 'taxi', label: 'Taxi', icon: FiTruck, color: 'purple' }
                ].map(({ key, label, icon: Icon, color }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleProjectTypeChange(key)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                      formData.projectType[key]
                        ? `border-${color}-500 bg-${color}-50 text-${color}-700`
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="text-2xl" />
                    <span className="text-sm font-medium">{label}</span>
                    {formData.projectType[key] && (
                      <FiCheck className="text-sm" />
                    )}
                  </button>
                ))}
              </div>
              {errors.projectType && <p className="text-sm text-red-600">{errors.projectType}</p>}
            </div>

            {/* Estimated Cost Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Estimated Cost <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-600">
                  <FiDollarSign className="text-xl" />
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.estimatedCost}
                  onChange={(e) => handleInputChange('estimatedCost', e.target.value)}
                  placeholder="Enter estimated cost"
                  className={`w-full pl-12 pr-4 py-4 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 ${
                    errors.estimatedCost ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.estimatedCost && <p className="text-sm text-red-600">{errors.estimatedCost}</p>}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-teal-600">
                  <FiFileText className="text-xl" />
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter project description"
                  rows={3}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 resize-none"
                />
              </div>
            </div>

            {/* Status Checkboxes */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Status Flags
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.quotationSent}
                    onChange={(e) => handleInputChange('quotationSent', e.target.checked)}
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Quotation Sent</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.demoSent}
                    onChange={(e) => handleInputChange('demoSent', e.target.checked)}
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Demo Sent</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full font-bold py-4 rounded-lg shadow-xl transition-all duration-300 border border-teal-400/20 ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 hover:shadow-2xl transform hover:scale-105 active:scale-95'
              }`}
              style={{
                boxShadow: isSubmitting ? 'none' : '0 8px 25px -5px rgba(20, 184, 166, 0.3), 0 4px 12px -3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Profile...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <FiCheck className="text-lg" />
                  <span>{submitText}</span>
                </div>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ConnectedLeadForm
export { ConnectedLeadForm }
