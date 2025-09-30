import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  FiHome, 
  FiZap, 
  FiPhone, 
  FiHelpCircle, 
  FiLogOut,
  FiX,
  FiCreditCard
} from 'react-icons/fi'
import { colors, gradients } from '../../../lib/colors'

const SL_sideBar = ({ isOpen, onClose }) => {
  const location = useLocation()
  
  // Mock user data
  const user = {
    name: 'Abhishek Sen',
    email: 'abhishek@appzeto.com',
    avatar: 'A',
    balance: 5000
  }

  const navItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: FiHome
    },
    { 
      path: '/today-followup', 
      label: 'Today follow-ups', 
      icon: FiPhone
    },
    { 
      path: '/hot-leads', 
      label: 'Hot leads', 
      icon: FiZap
    },
    { 
      path: '/notice-board', 
      label: 'Notice Board', 
      icon: FiHelpCircle
    }
  ]

  const handleLogout = () => {
    console.log('Logging out...')
    // Handle logout logic here
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 200,
              duration: 0.3 
            }}
            className="fixed top-14 left-0 w-72 bg-white shadow-2xl z-40 lg:hidden"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              height: 'calc(100vh - 7rem)',
              bottom: '4rem'
            }}
          >
            {/* Header Section with Teal Background */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="relative bg-gradient-to-br from-teal-500 to-teal-600 p-4 pt-12"
              style={{ background: gradients.primary }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <FiX className="w-5 h-5" />
              </button>

              {/* User Profile Section */}
              <div className="flex items-center gap-3 mb-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                  className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                >
                  <span className="text-lg font-bold text-gray-800">{user.avatar}</span>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="flex-1"
                >
                  <h2 className="text-base font-bold text-white">{user.name}</h2>
                  <p className="text-xs text-white/80">{user.email}</p>
                </motion.div>
              </div>

              {/* Balance Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="bg-white rounded-lg p-3 shadow-xl"
                style={{
                  boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.2), 0 4px 12px -3px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-teal-100 rounded flex items-center justify-center">
                      <FiCreditCard className="w-3 h-3 text-teal-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">My balance</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">₹{user.balance.toLocaleString()}</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Navigation Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="flex-1 p-4 flex flex-col"
            >
              {/* Add Recovery Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mb-4 py-2.5 px-3 rounded-lg text-white font-semibold shadow-lg text-sm"
                style={{ 
                  background: gradients.primary,
                  boxShadow: '0 4px 12px -3px rgba(20, 184, 166, 0.3), 0 2px 6px -2px rgba(0, 0, 0, 0.1)'
                }}
              >
                Add recovery
              </motion.button>

              {/* Navigation Links */}
              <div className="space-y-1 flex-1">
                {navItems.map((item, index) => {
                  const IconComponent = item.icon
                  const isActive = location.pathname === item.path
                  
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + (index * 0.1), duration: 0.4 }}
                    >
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? 'bg-teal-50 text-teal-700 border border-teal-200' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-teal-600'
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-gray-500'}`} />
                        <span className="font-medium text-sm">{item.label}</span>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Separator */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.4 }}
                className="my-3 border-t border-gray-200"
              />

              {/* Logout Button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center gap-3 p-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 w-full"
              >
                <div className="w-4 h-4 bg-red-100 rounded flex items-center justify-center">
                  <FiLogOut className="w-3 h-3 text-red-600" />
                </div>
                <span className="font-medium text-sm">Logout</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SL_sideBar
