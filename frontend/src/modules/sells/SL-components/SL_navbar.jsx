
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  FiHome, 
  FiZap, 
  FiUsers, 
  FiBarChart, 
  FiUser,
  FiCreditCard,
  FiBell
} from 'react-icons/fi'
import logo from '../../../assets/images/logo.png'

function SL_navbar() {
  const location = useLocation()
  
  // Mock wallet balance - Employee's current available balance
  const [walletBalance] = useState(22750)
  
  // Mock notification count
  const [notificationCount] = useState(3)

  const navItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: FiHome,
      iconWithPower: true
    },
    { 
      path: '/hot-leads', 
      label: 'Hot', 
      icon: FiZap,
      iconWithPower: false
    },
    { 
      path: '/leads', 
      label: 'Leads', 
      icon: FiUsers,
      iconWithPower: false
    },
    { 
      path: '/converted', 
      label: 'Converted', 
      icon: FiBarChart,
      iconWithPower: false
    },
    { 
      path: '/profile', 
      label: 'Profile', 
      icon: FiUser,
      iconWithPower: false
    }
  ]

  return (
    <>
      {/* Mobile Top Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm lg:hidden z-50">
        <div className="flex items-center justify-between h-14 px-4">
          <Link to="/dashboard" className="flex items-center -ml-2">
            <img 
              src={logo} 
              alt="Appzeto" 
              className="h-8 w-auto"
            />
          </Link>
          
          <div className="flex items-center space-x-2">
            {/* Notification Icon */}
            <Link
              to="/notifications"
              className="relative p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200"
            >
              <FiBell className="text-lg" />
            </Link>
            
            {/* Wallet Balance Box */}
            <Link
              to="/wallet"
              className="flex items-center space-x-1 bg-gradient-to-r from-teal-500/10 to-teal-600/10 px-3 py-1.5 rounded-lg border border-teal-200/50 hover:from-teal-500/20 hover:to-teal-600/20 transition-all duration-200"
            >
              <FiCreditCard className="text-teal-600 text-sm" />
              <span className="text-sm font-semibold text-teal-700">₹{walletBalance.toLocaleString()}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg lg:hidden z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const IconComponent = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center relative py-2 px-3 min-w-0 flex-1"
                aria-label={item.label}
              >
                {/* Icon */}
                <div className={`${isActive ? 'text-teal-600' : 'text-gray-600'}`}>
                  {item.iconWithPower ? (
                    <div className="relative">
                      <IconComponent className="text-xl" />
                      <FiZap className="absolute -top-1 -right-1 text-xs text-yellow-500" />
                    </div>
                  ) : (
                    <IconComponent className="text-xl" />
                  )}
                </div>
                
                {/* Label */}
                {item.path !== '/leads' && (
                  <span className={`text-xs font-medium mt-1 ${isActive ? 'text-teal-600' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Desktop Top Navigation */}
      <nav className="hidden lg:block fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/dashboard" className="flex items-center -ml-2">
                  <img 
                    src={logo} 
                    alt="Appzeto" 
                    className="h-10 w-auto"
                  />
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notification Icon */}
              <Link
                to="/notifications"
                className="relative p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200"
              >
                <FiBell className="text-xl" />
              </Link>
              
              {/* Desktop Wallet Balance */}
              <Link
                to="/wallet"
                className="flex items-center space-x-2 bg-gradient-to-r from-teal-500/10 to-teal-600/10 px-4 py-2 rounded-lg border border-teal-200/50 hover:from-teal-500/20 hover:to-teal-600/20 transition-all duration-200"
              >
                <FiCreditCard className="text-teal-600 text-lg" />
                <span className="text-sm font-semibold text-teal-700">₹{walletBalance.toLocaleString()}</span>
              </Link>
              
              <div className="flex items-center space-x-8">
              {navItems.map((item) => {
                const IconComponent = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg' 
                        : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
                    }`}
                    aria-label={item.label}
                  >
                    {item.iconWithPower ? (
                      <div className="relative">
                        <IconComponent className="text-lg" />
                        <FiZap className="absolute -top-1 -right-1 text-xs text-yellow-500" />
                      </div>
                    ) : (
                      <IconComponent className="text-lg" />
                    )}
                    {item.path !== '/leads' && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </Link>
                )
              })}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default SL_navbar