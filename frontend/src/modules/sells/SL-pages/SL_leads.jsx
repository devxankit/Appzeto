// Single-file mobile Lead Dashboard component — Tailwind v4 + react-icons
import React, { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { 
  FiPlus,
  FiPhone,
  FiPhoneOff,
  FiCalendar,
  FiFileText,
  FiSend,
  FiSmartphone,
  FiGlobe,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft,
  FiX
} from 'react-icons/fi'
import { Link } from 'react-router-dom'
import SL_navbar from '../SL-components/SL_navbar'

const LeadDashboard = () => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    phoneNumber: '',
    source: ''
  })
  
  // Refs for scroll-triggered animations
  const tilesRef = useRef(null)
  const lostBarRef = useRef(null)
  
  // Check if elements are in view
  const tilesInView = useInView(tilesRef, { once: true, margin: "-100px" })
  const lostBarInView = useInView(lostBarRef, { once: true, margin: "-100px" })

  // Modal functions
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  
  // Form handlers
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted:', formData)
    // Close modal after successful submission
    closeModal()
    // Reset form
    setFormData({ phoneNumber: '', source: '' })
  }

  // Sample data for tiles with monochromatic color scheme
  const tileData = [
    { title: "Contacted", count: 42, icon: FiPhone, bgClass: "bg-emerald-50", textClass: "text-emerald-800", iconBgClass: "bg-emerald-100", iconClass: "text-emerald-600", borderClass: "border-emerald-200/30" },
    { title: "Not Picked", count: 18, icon: FiPhoneOff, bgClass: "bg-rose-50", textClass: "text-rose-800", iconBgClass: "bg-rose-100", iconClass: "text-rose-600", borderClass: "border-rose-200/30" },
    { title: "Today Follow Up", count: 5, icon: FiCalendar, bgClass: "bg-amber-50", textClass: "text-amber-800", iconBgClass: "bg-amber-100", iconClass: "text-amber-600", borderClass: "border-amber-200/30" },
    { title: "Quotation Sent", count: 15, icon: FiFileText, bgClass: "bg-blue-50", textClass: "text-blue-800", iconBgClass: "bg-blue-100", iconClass: "text-blue-600", borderClass: "border-blue-200/30" },
    { title: "D&Q Sent", count: 17, icon: FiSend, bgClass: "bg-purple-50", textClass: "text-purple-800", iconBgClass: "bg-purple-100", iconClass: "text-purple-600", borderClass: "border-purple-200/30" },
    { title: "App Client", count: 33, icon: FiSmartphone, bgClass: "bg-indigo-50", textClass: "text-indigo-800", iconBgClass: "bg-indigo-100", iconClass: "text-indigo-600", borderClass: "border-indigo-200/30" },
    { title: "Web", count: 6653, icon: FiGlobe, bgClass: "bg-cyan-50", textClass: "text-cyan-800", iconBgClass: "bg-cyan-100", iconClass: "text-cyan-600", borderClass: "border-cyan-200/30" },
    { title: "Converted", count: 65, icon: FiCheckCircle, bgClass: "bg-green-50", textClass: "text-green-800", iconBgClass: "bg-green-100", iconClass: "text-green-600", borderClass: "border-green-200/30" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <SL_navbar />
      <main className="max-w-7xl mx-auto px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-20 lg:pb-4">
        {/* Mobile-first layout */}
        <div className="space-y-6 lg:hidden">
          {/* Add New Lead Button */}
          <div className="w-full px-2 mb-2">
            <button 
              onClick={openModal}
              className="w-full bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 text-white font-bold py-4 px-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 border border-teal-400/20"
              style={{
                boxShadow: '0 8px 25px -5px rgba(20, 184, 166, 0.3), 0 4px 12px -3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
              aria-label="Add new lead"
              role="button"
              tabIndex={0}
            >
              <FiPlus className="text-xl" />
              <span className="text-lg">Add New Lead</span>
            </button>
          </div>

          {/* New Leads Card */}
          <Link to="/new-leads">
            <div 
              className="bg-teal-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-teal-300/40 cursor-pointer mx-2 mt-4"
              style={{
                boxShadow: '0 8px 25px -5px rgba(20, 184, 166, 0.2), 0 4px 12px -3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-teal-900 mb-1">New Leads</h2>
                  <p className="text-sm text-teal-700">Leads requiring initial contact</p>
                </div>
                <div 
                  className="bg-teal-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg border border-teal-400/30"
                  style={{
                    boxShadow: '0 4px 12px -2px rgba(20, 184, 166, 0.3), 0 2px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <span className="text-lg font-bold">24</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Status Tiles Grid */}
          <div 
            ref={tilesRef}
            className="grid grid-cols-2 gap-4 px-2"
          >
            {tileData.map((tile, index) => {
              const IconComponent = tile.icon
              
              return (
                <Link
                  key={tile.title}
                  to={tile.title === "Contacted" ? "/connected" : "#"}
                  className={`${tile.bgClass} rounded-xl p-4 ${tile.textClass} transition-all duration-300 cursor-pointer border ${tile.borderClass} block`}
                  style={{
                    boxShadow: `0 10px 30px -8px rgba(0, 0, 0, 0.2), 0 6px 16px -4px rgba(0, 0, 0, 0.12), 0 3px 8px -2px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.15)`
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${tile.title} leads: ${tile.count}`}
                >
                  <div className="flex flex-col h-full">
                    {/* Enhanced Icon Section */}
                    <div className="flex justify-center mb-3">
                      <div className={`w-12 h-12 ${tile.iconBgClass} rounded-xl flex items-center justify-center border border-opacity-30 ${tile.borderClass}`}
                        style={{
                          boxShadow: `0 6px 20px -4px rgba(0, 0, 0, 0.15), 0 3px 10px -2px rgba(0, 0, 0, 0.08), 0 1px 5px -1px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.25)`
                        }}
                      >
                        <IconComponent className={`text-xl ${tile.iconClass}`} />
                      </div>
                    </div>
                    
                    {/* Enhanced Content Section */}
                    <div className="flex-1 flex flex-col justify-between text-center">
                      <div>
                        <h3 className={`font-bold text-sm mb-1.5 leading-tight ${tile.textClass}`}>{tile.title}</h3>
                        <div className="flex items-center justify-center space-x-2 mb-2.5">
                          <div className={`w-2 h-2 ${tile.iconClass.replace('text-', 'bg-')} rounded-full animate-pulse shadow-sm`}></div>
                          <p className={`text-xs font-semibold ${tile.textClass}/80`}>{tile.count} Leads</p>
                        </div>
                      </div>
                      
                      {/* Enhanced Trend Section */}
                      <div className={`flex items-center justify-center space-x-1.5 mt-auto ${tile.iconBgClass} rounded-lg px-2.5 py-1.5`}>
                        <span className={`text-xs font-semibold ${tile.textClass}/70`}>View Details</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Lost Leads Bottom Bar */}
          <div 
            ref={lostBarRef}
            className="w-full px-2"
          >
            <button 
              className="w-full bg-rose-100 text-rose-800 font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 border border-rose-300/40"
              style={{
                boxShadow: '0 8px 25px -5px rgba(244, 63, 94, 0.2), 0 4px 12px -3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
              aria-label="Lost leads"
              role="button"
              tabIndex={0}
            >
              <FiAlertCircle className="text-xl text-rose-700" />
              <span className="text-lg">Lost 23</span>
            </button>
          </div>
        </div>

        {/* Desktop Layout - Hidden on mobile */}
        <div className="hidden lg:block mt-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Main content takes 8 columns on desktop */}
            <div className="col-span-8">
              {/* Add New Lead Button */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-6"
              >
                <button 
                  onClick={openModal}
                  className="w-full bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 text-white font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 border border-teal-400/20"
                  style={{
                    boxShadow: '0 8px 25px -5px rgba(20, 184, 166, 0.3), 0 4px 12px -3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                  aria-label="Add new lead"
                  role="button"
                  tabIndex={0}
                >
                  <FiPlus className="text-2xl drop-shadow-lg" />
                  <span className="text-xl drop-shadow-lg">Add New Lead</span>
                </button>
              </motion.div>

              {/* New Leads Card */}
              <Link to="/new-leads">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                  className="bg-teal-100 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 mb-6 border border-teal-300/40 cursor-pointer"
                  style={{
                    boxShadow: '0 8px 25px -5px rgba(20, 184, 166, 0.2), 0 4px 12px -3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-teal-900 mb-2">New Leads</h2>
                      <p className="text-base text-teal-700">Leads requiring initial contact</p>
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-teal-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg border border-teal-400/30"
                      style={{
                        boxShadow: '0 4px 12px -2px rgba(20, 184, 166, 0.3), 0 2px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <span className="text-2xl font-bold">24</span>
                    </motion.div>
                  </div>
                </motion.div>
              </Link>

              {/* Status Tiles Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="grid grid-cols-4 gap-5"
              >
                {tileData.map((tile, index) => {
                  const IconComponent = tile.icon
                  
                  return (
                    <Link
                      key={tile.title}
                      to={tile.title === "Contacted" ? "/connected" : "#"}
                      className={`${tile.bgClass} rounded-xl p-6 ${tile.textClass} transition-all duration-300 cursor-pointer border ${tile.borderClass} block`}
                      style={{
                        boxShadow: `0 10px 30px -8px rgba(0, 0, 0, 0.2), 0 6px 16px -4px rgba(0, 0, 0, 0.12), 0 3px 8px -2px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.15)`
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${tile.title} leads: ${tile.count}`}
                    >
                      <div className="flex flex-col h-full">
                        {/* Enhanced Icon Section */}
                        <div className="flex justify-center mb-4">
                          <div className={`w-14 h-14 ${tile.iconBgClass} rounded-xl flex items-center justify-center border ${tile.borderClass}`}
                            style={{
                              boxShadow: `0 6px 20px -4px rgba(0, 0, 0, 0.15), 0 3px 10px -2px rgba(0, 0, 0, 0.08), 0 1px 5px -1px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.25)`
                            }}
                          >
                            <IconComponent className={`text-2xl ${tile.iconClass}`} />
                          </div>
                        </div>
                        
                        {/* Enhanced Content Section */}
                        <div className="flex-1 flex flex-col justify-between text-center">
                          <div>
                            <h3 className={`font-bold text-base mb-3 leading-tight ${tile.textClass}`}>{tile.title}</h3>
                            <div className="flex items-center justify-center space-x-2 mb-2.5">
                              <div className={`w-2 h-2 ${tile.iconClass.replace('text-', 'bg-')} rounded-full animate-pulse shadow-sm`}></div>
                              <p className={`text-xs font-semibold ${tile.textClass}/80`}>{tile.count} Leads</p>
                            </div>
                          </div>
                          
                          {/* Enhanced Trend Section */}
                          <div className={`flex items-center justify-center space-x-1.5 mt-auto ${tile.iconBgClass} rounded-lg px-2.5 py-1.5`}>
                            <span className={`text-xs font-semibold ${tile.textClass}/70`}>View Details</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </motion.div>

              {/* Lost Leads Bottom Bar */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
                className="mt-6"
              >
                <button 
                  className="w-full bg-rose-100 text-rose-800 font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 border border-rose-300/40"
                  style={{
                    boxShadow: '0 8px 25px -5px rgba(244, 63, 94, 0.2), 0 4px 12px -3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                  aria-label="Lost leads"
                  role="button"
                  tabIndex={0}
                >
                  <FiAlertCircle className="text-2xl text-rose-700" />
                  <span className="text-xl">Lost 23</span>
                </button>
              </motion.div>
            </div>

            {/* Sidebar takes 4 columns on desktop */}
            <div className="col-span-4">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-6 shadow-xl border border-slate-200/50"
                style={{
                  boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.12), 0 4px 12px -3px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <h3 className="text-xl font-bold text-slate-800 mb-6">Lead Statistics</h3>
                <div className="space-y-4">
                  {[
                    { label: "Total Leads", value: "6,853", bgClass: "bg-emerald-50", textClass: "text-emerald-800", borderClass: "border-emerald-200/30" },
                    { label: "Conversion Rate", value: "0.95%", bgClass: "bg-blue-50", textClass: "text-blue-800", borderClass: "border-blue-200/30" },
                    { label: "Active Pipeline", value: "142", bgClass: "bg-purple-50", textClass: "text-purple-800", borderClass: "border-purple-200/30" }
                  ].map((stat, index) => (
                    <motion.div 
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 + (index * 0.1), ease: "easeOut" }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className={`${stat.bgClass} rounded-xl p-4 ${stat.textClass} transition-all duration-300 border ${stat.borderClass}`}
                      style={{
                        boxShadow: `0 8px 25px -6px rgba(0, 0, 0, 0.15), 0 4px 12px -3px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.12)`
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{stat.label}</span>
                        <span className="font-bold text-lg">{stat.value}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-md bg-white rounded-none shadow-2xl"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 p-6 text-white relative">
                <button
                  onClick={closeModal}
                  className="absolute top-6 left-6 p-2 hover:bg-teal-600/50 rounded-full transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <FiArrowLeft className="text-xl" />
                </button>
                <h2 className="text-xl font-bold text-center">Add Lead</h2>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Phone Number Input */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-600">
                      <FiPhone className="text-xl" />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Number"
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Source Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900">Source</h3>
                  <div className="space-y-3">
                    {[
                      { value: 'meta', label: 'Meta' },
                      { value: 'linkedin', label: 'LinkedIn' },
                      { value: 'referral', label: 'Referral' },
                      { value: 'other', label: 'Other' },
                      { value: 'agent', label: 'Agent' }
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center p-3 rounded-lg border border-teal-200 bg-white hover:bg-teal-50 transition-colors duration-200 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="source"
                          value={option.value}
                          checked={formData.source === option.value}
                          onChange={handleInputChange}
                          className="sr-only"
                          required
                        />
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 transition-all duration-200 ${
                          formData.source === option.value 
                            ? 'border-teal-500 bg-teal-500' 
                            : 'border-gray-300'
                        }`}>
                          {formData.source === option.value && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <span className="text-gray-900 font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 text-white font-bold py-4 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border border-teal-400/20"
                  style={{
                    boxShadow: '0 8px 25px -5px rgba(20, 184, 166, 0.3), 0 4px 12px -3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  Add Lead
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LeadDashboard
