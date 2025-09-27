// Single-file mobile Lead Dashboard component — Tailwind v4 + react-icons
import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
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
  FiAlertCircle
} from 'react-icons/fi'
import SL_navbar from '../SL-components/SL_navbar'

const LeadDashboard = () => {
  // Refs for scroll-triggered animations
  const tilesRef = useRef(null)
  const lostBarRef = useRef(null)
  
  // Check if elements are in view
  const tilesInView = useInView(tilesRef, { once: true, margin: "-100px" })
  const lostBarInView = useInView(lostBarRef, { once: true, margin: "-100px" })

  // Sample data for tiles with vibrant colors matching dashboard theme
  const tileData = [
    { title: "Contacted", count: 42, icon: FiPhone, color: "emerald", gradient: "from-emerald-500 via-teal-600 to-cyan-600" },
    { title: "Not Picked", count: 18, icon: FiPhoneOff, color: "rose", gradient: "from-rose-500 via-pink-600 to-red-600" },
    { title: "Today Follow Up", count: 5, icon: FiCalendar, color: "amber", gradient: "from-orange-500 via-amber-600 to-yellow-600" },
    { title: "Quotation Sent", count: 15, icon: FiFileText, color: "blue", gradient: "from-blue-500 via-indigo-600 to-purple-600" },
    { title: "D&Q Sent", count: 17, icon: FiSend, color: "purple", gradient: "from-violet-500 via-purple-600 to-indigo-600" },
    { title: "App Client", count: 33, icon: FiSmartphone, color: "indigo", gradient: "from-indigo-500 via-blue-600 to-cyan-600" },
    { title: "Web", count: 6653, icon: FiGlobe, color: "cyan", gradient: "from-cyan-500 via-teal-600 to-emerald-600" },
    { title: "Converted", count: 65, icon: FiCheckCircle, color: "green", gradient: "from-green-500 via-emerald-600 to-teal-600" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <SL_navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-20 lg:pb-4">
        {/* Mobile-first layout */}
        <div className="space-y-6 lg:hidden">
          {/* Add New Lead Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full"
          >
            <button 
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white font-bold py-4 px-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 border border-emerald-400/20"
              style={{
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
              aria-label="Add new lead"
              role="button"
              tabIndex={0}
            >
              <FiPlus className="text-xl" />
              <span className="text-lg">Add New Lead</span>
            </button>
          </motion.div>

          {/* New Leads Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-emerald-400/20"
            style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">New Leads</h2>
                <p className="text-sm text-white/90">Leads requiring initial contact</p>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 backdrop-blur-sm text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg border border-white/30"
              >
                <span className="text-lg font-bold">24</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Status Tiles Grid */}
          <motion.div 
            ref={tilesRef}
            initial={{ opacity: 0, y: 50 }}
            animate={tilesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid grid-cols-2 gap-3"
          >
            {tileData.map((tile, index) => {
              const IconComponent = tile.icon
              // Use the gradient directly from tile data for vibrant colors
              
              return (
                <motion.div
                  key={tile.title}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={tilesInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: 0.1 + (index * 0.1), ease: "easeOut" }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-gradient-to-br ${tile.gradient} rounded-xl p-4 text-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-${tile.color}-400/20`}
                  style={{
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${tile.title} leads: ${tile.count}`}
                >
                  <div className="flex flex-col h-full">
                    {/* Enhanced Icon Section */}
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                        <IconComponent className="text-xl text-white" />
                      </div>
                    </div>
                    
                    {/* Enhanced Content Section */}
                    <div className="flex-1 flex flex-col justify-between text-center">
                      <div>
                        <h3 className="font-bold text-sm mb-1.5 leading-tight">{tile.title}</h3>
                        <div className="flex items-center justify-center space-x-2 mb-2.5">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-sm"></div>
                          <p className="text-xs font-semibold opacity-95">{tile.count} Leads</p>
                        </div>
                      </div>
                      
                      {/* Enhanced Trend Section */}
                      <div className="flex items-center justify-center space-x-1.5 mt-auto bg-white/10 rounded-lg px-2.5 py-1.5">
                        <span className="text-xs font-semibold text-white/90">View Details</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Lost Leads Bottom Bar */}
          <motion.div 
            ref={lostBarRef}
            initial={{ opacity: 0, y: 30 }}
            animate={lostBarInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full"
          >
            <button 
              className="w-full bg-gradient-to-r from-rose-500 via-red-600 to-pink-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 border border-red-400/20"
              style={{
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
              aria-label="Lost leads"
              role="button"
              tabIndex={0}
            >
              <FiAlertCircle className="text-xl drop-shadow-lg" />
              <span className="text-lg drop-shadow-lg">Lost 23</span>
            </button>
          </motion.div>
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
                  className="w-full bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 border border-emerald-400/20"
                  style={{
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
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
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 mb-6 border border-emerald-400/20"
                style={{
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">New Leads</h2>
                    <p className="text-base text-white/90 drop-shadow-md">Leads requiring initial contact</p>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/20 backdrop-blur-sm text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg border border-white/30"
                  >
                    <span className="text-2xl font-bold drop-shadow-lg">24</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Status Tiles Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="grid grid-cols-4 gap-4"
              >
                {tileData.map((tile, index) => {
                  const IconComponent = tile.icon
                  
                  return (
                    <motion.div
                      key={tile.title}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.5 + (index * 0.1), ease: "easeOut" }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`bg-gradient-to-br ${tile.gradient} rounded-xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-${tile.color}-400/20`}
                      style={{
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${tile.title} leads: ${tile.count}`}
                    >
                      <div className="flex flex-col h-full">
                        {/* Enhanced Icon Section */}
                        <div className="flex justify-center mb-4">
                          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                            <IconComponent className="text-2xl text-white" />
                          </div>
                        </div>
                        
                        {/* Enhanced Content Section */}
                        <div className="flex-1 flex flex-col justify-between text-center">
                          <div>
                            <h3 className="font-bold text-base mb-3 leading-tight">{tile.title}</h3>
                            <div className="flex items-center justify-center space-x-2 mb-2.5">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-sm"></div>
                              <p className="text-xs font-semibold opacity-95">{tile.count} Leads</p>
                            </div>
                          </div>
                          
                          {/* Enhanced Trend Section */}
                          <div className="flex items-center justify-center space-x-1.5 mt-auto bg-white/10 rounded-lg px-2.5 py-1.5">
                            <span className="text-xs font-semibold text-white/90">View Details</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
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
                  className="w-full bg-gradient-to-r from-rose-500 via-red-600 to-pink-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 border border-red-400/20"
                  style={{
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}
                  aria-label="Lost leads"
                  role="button"
                  tabIndex={0}
                >
                  <FiAlertCircle className="text-2xl drop-shadow-lg" />
                  <span className="text-xl drop-shadow-lg">Lost 23</span>
                </button>
              </motion.div>
            </div>

            {/* Sidebar takes 4 columns on desktop */}
            <div className="col-span-4">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl border border-gray-200/50"
                style={{
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Lead Statistics</h3>
                <div className="space-y-4">
                  {[
                    { label: "Total Leads", value: "6,853", color: "emerald", gradient: "from-emerald-500 via-teal-600 to-cyan-600" },
                    { label: "Conversion Rate", value: "0.95%", color: "blue", gradient: "from-blue-500 via-indigo-600 to-purple-600" },
                    { label: "Active Pipeline", value: "142", color: "purple", gradient: "from-violet-500 via-purple-600 to-indigo-600" }
                  ].map((stat, index) => (
                    <motion.div 
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 + (index * 0.1), ease: "easeOut" }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-4 text-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-${stat.color}-400/20`}
                      style={{
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold drop-shadow-lg">{stat.label}</span>
                        <span className="font-bold text-lg drop-shadow-lg">{stat.value}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LeadDashboard
