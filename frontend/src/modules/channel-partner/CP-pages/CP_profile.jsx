import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import CP_navbar from '../CP-components/CP_navbar'
import { 
  FiUser as User, 
  FiMail as Mail, 
  FiSave as Save, 
  FiX as X, 
  FiCalendar as Calendar, 
  FiPhone as Phone,
  FiEdit2 as Edit
} from 'react-icons/fi'
import { FiBriefcase as Building, FiMapPin as MapPin, FiLogOut as LogOut } from 'react-icons/fi'
import { getProfile, updateProfile, logoutCP } from '../CP-services/cpAuthService'
import { useToast } from '../../../contexts/ToastContext'

const CP_profile = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [originalProfile, setOriginalProfile] = useState(null)
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: '',
    joinDate: '',
    avatar: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      zipCode: ''
    }
  })

  const deriveAvatar = (name) => {
    if (!name) return 'CP'
    const initials = name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .join('')
    return initials.slice(0, 2) || 'CP'
  }

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const formatGender = (gender) => {
    if (!gender) return 'Not specified'
    const genderMap = {
      'male': 'Male',
      'female': 'Female',
      'other': 'Other',
      'prefer-not-to-say': 'Prefer not to say'
    }
    return genderMap[gender] || gender
  }

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const response = await getProfile()
        const cp = response?.data || {}

        const formattedProfile = {
          fullName: cp.name || 'Channel Partner',
          email: cp.email || 'Not provided',
          company: cp.companyName || 'Not specified',
          phone: cp.phoneNumber || 'Not provided',
          joinDate: (cp.joiningDate || cp.createdAt || new Date().toISOString()),
          avatar: deriveAvatar(cp.name),
          dateOfBirth: cp.dateOfBirth || '',
          gender: cp.gender || '',
          address: cp.address || {
            street: '',
            city: '',
            state: '',
            country: 'India',
            zipCode: ''
          }
        }

        setProfileData(formattedProfile)
        setOriginalProfile({ ...formattedProfile })
      } catch (error) {
        console.error('Failed to load channel partner profile:', error)

        if (error?.status === 401 || error?.isUnauthorized) {
          toast.info('Session expired. Please log in again.', {
            title: 'Session Ended',
            duration: 4000
          })
          navigate('/cp-login', { replace: true })
          return
        }

        toast.error('Unable to load profile. Please try again later.', {
          title: 'Profile Error',
          duration: 4000
        })
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [navigate, toast])

  const handleProfileUpdate = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddressUpdate = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const updateData = {
        name: profileData.fullName,
        email: profileData.email,
        companyName: profileData.company,
        address: profileData.address
      }

      const response = await updateProfile(updateData)
      
      if (response?.success) {
        setOriginalProfile({ ...profileData })
        setIsEditing(false)
        toast.success('Profile updated successfully!', {
          title: 'Success',
          duration: 3000
        })
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error(error.message || 'Failed to update profile. Please try again.', {
        title: 'Update Failed',
        duration: 4000
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setProfileData({ ...originalProfile })
    setIsEditing(false)
  }

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      await logoutCP()
      toast.logout?.('You have been logged out successfully.', {
        title: 'Logged Out',
        duration: 3000
      })
      navigate('/cp-login')
    } catch (error) {
      console.error('Channel Partner logout failed:', error)
      toast.error?.('Unable to logout. Please try again.', {
        title: 'Logout Failed',
        duration: 4000
      })
      // Still navigate to login even if logout fails
      navigate('/cp-login')
    } finally {
      setLoggingOut(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CP_navbar />
        <div className="pt-14 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto pt-6">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading profile...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const age = calculateAge(profileData.dateOfBirth)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <CP_navbar />
      
      <div className="pt-14 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto pt-6">
          {/* Main Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
          >
            {/* Header: Avatar, Name, and Edit Button on same level */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-blue-100">
                    {profileData.avatar}
                  </div>
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{profileData.fullName}</h3>
                  <p className="text-sm text-gray-600">{profileData.email || 'No email provided'}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (isEditing) {
                    handleCancel()
                  } else {
                    setIsEditing(true)
                  }
                }}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  isEditing 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                }`}
                title={isEditing ? 'Cancel' : 'Edit Profile'}
              >
                {isEditing ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Edit className="h-5 w-5" />
                )}
              </motion.button>
            </motion.div>

            {/* Profile Fields */}
            <div className="space-y-6">
              {/* Personal Information Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => handleProfileUpdate('fullName', e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-lg border border-gray-100 hover:border-blue-200 transition-all">
                        <User className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900">{profileData.fullName}</span>
                      </div>
                    )}
                  </motion.div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleProfileUpdate('email', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{profileData.email || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  {/* Phone Number (Read-only) */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-lg border border-gray-100">
                      <Phone className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-900">{profileData.phone}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
                  </motion.div>

                  {/* Gender */}
                  {profileData.gender && (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-lg border border-gray-100">
                        <User className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900">{formatGender(profileData.gender)}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Date of Birth */}
                  {profileData.dateOfBirth && (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-lg border border-gray-100">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(profileData.dateOfBirth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Age */}
                  {age && (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                      <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-lg border border-gray-100">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900">{age} years</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Joining Date (Read-only) */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date</label>
                    <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-lg border border-gray-100">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(profileData.joinDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Company Information Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="pt-6 border-t border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <Building className="h-5 w-5 text-purple-600" />
                  </div>
                  Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.company}
                        onChange={(e) => handleProfileUpdate('company', e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-gray-50 to-purple-50/50 rounded-lg border border-gray-100 hover:border-purple-200 transition-all">
                        <Building className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium text-gray-900">{profileData.company || 'Not specified'}</span>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>

              {/* Address Information Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="pt-6 border-t border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  Address Information
                </h3>
                {isEditing ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Street Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                      <input
                        type="text"
                        value={profileData.address?.street || ''}
                        onChange={(e) => handleAddressUpdate('street', e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="Enter street address"
                      />
                    </div>

                    {/* City and State */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={profileData.address?.city || ''}
                          onChange={(e) => handleAddressUpdate('city', e.target.value)}
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          placeholder="Enter city"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          value={profileData.address?.state || ''}
                          onChange={(e) => handleAddressUpdate('state', e.target.value)}
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          placeholder="Enter state"
                        />
                      </div>
                    </div>

                    {/* Pin Code and Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code</label>
                        <input
                          type="text"
                          value={profileData.address?.zipCode || ''}
                          onChange={(e) => handleAddressUpdate('zipCode', e.target.value.replace(/\D/g, ''))}
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          placeholder="Enter pin code"
                          maxLength={6}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          value={profileData.address?.country || ''}
                          onChange={(e) => handleAddressUpdate('country', e.target.value)}
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          placeholder="Enter country"
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start space-x-2 p-3 bg-gradient-to-r from-gray-50 to-green-50/50 rounded-lg border border-gray-100 hover:border-green-200 transition-all"
                  >
                    <MapPin className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm font-medium text-gray-900">
                      {[
                        profileData.address?.street,
                        profileData.address?.city,
                        profileData.address?.state,
                        profileData.address?.zipCode,
                        profileData.address?.country
                      ].filter(Boolean).join(', ') || 'Not provided'}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-end"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </motion.button>
              </motion.div>
            )}

            {/* Logout Button at Bottom */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mt-8 pt-6 border-t border-gray-200"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-50 to-red-100/50 text-red-700 rounded-lg font-medium hover:from-red-100 hover:to-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-2 border-red-200 hover:border-red-300 shadow-sm hover:shadow-md"
              >
                <LogOut className="h-5 w-5" />
                <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CP_profile
