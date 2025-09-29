import React from 'react'
import { 
  FaWallet, 
  FaBell, 
  FaSignOutAlt, 
  FaPhone, 
  FaEnvelope,
  FaUser,
  FaCog,
  FaHeart,
  FaArrowRight
} from 'react-icons/fa'
import SL_navbar from '../SL-components/SL_navbar'

const SL_profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <SL_navbar />
      
      {/* Mobile Layout */}
      <main className="max-w-md mx-auto px-4 pt-16 pb-20 lg:hidden">
        {/* Profile Header Section */}
        <div className="text-center mb-8">
          {/* Profile Picture */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center shadow-lg border border-gray-300">
              <FaUser className="text-gray-500 text-4xl" />
            </div>
          </div>

          {/* User Information */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Abhishek Sen</h1>
            <p className="text-gray-600 text-lg font-medium">abhishek@appzeto.com</p>
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-xl border border-gray-200/50"
          style={{
            boxShadow: '0 10px 30px -8px rgba(0, 0, 0, 0.15), 0 6px 16px -4px rgba(0, 0, 0, 0.08), 0 3px 8px -2px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="space-y-4">
            {/* Phone */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
                  style={{
                    boxShadow: '0 4px 12px -2px rgba(59, 130, 246, 0.2), 0 2px 6px -1px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <FaPhone className="text-blue-600 text-sm" />
                </div>
                <span className="text-gray-600 font-medium">Phone</span>
              </div>
              <span className="text-gray-900 font-bold text-lg">8874563452</span>
            </div>

          </div>
        </div>

        {/* Navigation Cards */}
        <div className="space-y-4 mb-8">
          {/* Wallet Card */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-200/50 cursor-pointer transition-all duration-300 hover:shadow-xl"
            style={{
              boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 12px -3px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center"
                  style={{
                    boxShadow: '0 4px 12px -2px rgba(16, 185, 129, 0.2), 0 2px 6px -1px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <FaWallet className="text-emerald-600 text-lg" />
                </div>
                <span className="text-gray-900 font-semibold text-lg">Wallet</span>
              </div>
              <FaArrowRight className="text-gray-400 text-lg" />
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-200/50 cursor-pointer transition-all duration-300 hover:shadow-xl"
            style={{
              boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 12px -3px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
                  style={{
                    boxShadow: '0 4px 12px -2px rgba(59, 130, 246, 0.2), 0 2px 6px -1px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <FaBell className="text-blue-600 text-lg" />
                </div>
                <span className="text-gray-900 font-semibold text-lg">Notifications</span>
              </div>
              <FaArrowRight className="text-gray-400 text-lg" />
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-200/50 cursor-pointer transition-all duration-300 hover:shadow-xl"
            style={{
              boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 12px -3px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center"
                  style={{
                    boxShadow: '0 4px 12px -2px rgba(147, 51, 234, 0.2), 0 2px 6px -1px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <FaCog className="text-purple-600 text-lg" />
                </div>
                <span className="text-gray-900 font-semibold text-lg">Settings</span>
              </div>
              <FaArrowRight className="text-gray-400 text-lg" />
            </div>
          </div>

          {/* Logout Card */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-red-200/50 cursor-pointer transition-all duration-300 hover:shadow-xl"
            style={{
              boxShadow: '0 8px 25px -5px rgba(239, 68, 68, 0.1), 0 4px 12px -3px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center"
                  style={{
                    boxShadow: '0 4px 12px -2px rgba(239, 68, 68, 0.2), 0 2px 6px -1px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <FaSignOutAlt className="text-red-600 text-lg" />
                </div>
                <span className="text-red-600 font-semibold text-lg">Logout</span>
              </div>
              <FaArrowRight className="text-red-400 text-lg" />
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-teal-600 font-medium text-lg">Appzeto loves you</span>
            <FaHeart className="text-blue-400 text-lg" />
          </div>
        </div>
      </main>

      {/* Desktop Layout */}
      <main className="hidden lg:block max-w-4xl mx-auto px-8 pt-20 pb-12">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Profile Info */}
          <div className="col-span-4">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200/50 mb-6"
              style={{
                boxShadow: '0 10px 30px -8px rgba(0, 0, 0, 0.15), 0 6px 16px -4px rgba(0, 0, 0, 0.08), 0 3px 8px -2px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="text-center">
                {/* Profile Picture */}
                <div className="mb-6">
                  <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center shadow-lg border border-gray-300">
                    <FaUser className="text-gray-500 text-3xl" />
                  </div>
                </div>

                {/* User Information */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Abhishek Sen</h1>
                <p className="text-gray-600 text-base">abhishek@appzeto.com</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200/50"
              style={{
                boxShadow: '0 10px 30px -8px rgba(0, 0, 0, 0.15), 0 6px 16px -4px rgba(0, 0, 0, 0.08), 0 3px 8px -2px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
                    style={{
                      boxShadow: '0 4px 12px -2px rgba(59, 130, 246, 0.2), 0 2px 6px -1px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <FaPhone className="text-blue-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Phone</p>
                    <p className="text-gray-900 font-semibold">8874563452</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column - Navigation Cards */}
          <div className="col-span-8">
            <div className="grid grid-cols-2 gap-6">
              {/* Wallet Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 cursor-pointer transition-all duration-300 hover:shadow-xl"
                style={{
                  boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 12px -3px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center"
                    style={{
                      boxShadow: '0 4px 12px -2px rgba(16, 185, 129, 0.2), 0 2px 6px -1px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <FaWallet className="text-emerald-600 text-lg" />
                  </div>
                  <span className="text-gray-900 font-semibold text-lg">Wallet</span>
                </div>
                <p className="text-gray-600 text-sm">Manage your wallet and transactions</p>
              </div>

              {/* Notifications Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 cursor-pointer transition-all duration-300 hover:shadow-xl"
                style={{
                  boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 12px -3px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
                    style={{
                      boxShadow: '0 4px 12px -2px rgba(59, 130, 246, 0.2), 0 2px 6px -1px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <FaBell className="text-blue-600 text-lg" />
                  </div>
                  <span className="text-gray-900 font-semibold text-lg">Notifications</span>
                </div>
                <p className="text-gray-600 text-sm">View and manage your notifications</p>
              </div>

              {/* Settings Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 cursor-pointer transition-all duration-300 hover:shadow-xl"
                style={{
                  boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 12px -3px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center"
                    style={{
                      boxShadow: '0 4px 12px -2px rgba(147, 51, 234, 0.2), 0 2px 6px -1px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <FaCog className="text-purple-600 text-lg" />
                  </div>
                  <span className="text-gray-900 font-semibold text-lg">Settings</span>
                </div>
                <p className="text-gray-600 text-sm">Customize your account settings</p>
              </div>

              {/* Logout Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-200/50 cursor-pointer transition-all duration-300 hover:shadow-xl"
                style={{
                  boxShadow: '0 8px 25px -5px rgba(239, 68, 68, 0.1), 0 4px 12px -3px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center"
                    style={{
                      boxShadow: '0 4px 12px -2px rgba(239, 68, 68, 0.2), 0 2px 6px -1px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <FaSignOutAlt className="text-red-600 text-lg" />
                  </div>
                  <span className="text-red-600 font-semibold text-lg">Logout</span>
                </div>
                <p className="text-gray-600 text-sm">Sign out of your account</p>
              </div>
            </div>

            {/* Footer Message */}
            <div className="text-center mt-8">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-teal-600 font-medium text-lg">Appzeto loves you</span>
                <FaHeart className="text-blue-400 text-lg" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SL_profile
