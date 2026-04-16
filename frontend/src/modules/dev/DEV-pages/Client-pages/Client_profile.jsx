import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Client_navbar from '../../DEV-components/Client_navbar'
import { FiUser as User, FiMail as Mail, FiSave as Save, FiX as X, FiCalendar as Calendar, FiAward as Award, FiBriefcase as Briefcase, FiPhone as Phone, FiMapPin as MapPin, FiLogOut as LogOut } from 'react-icons/fi'
import { logoutClient, getProfile, updateProfile } from '../../DEV-services/clientAuthService'
import { useToast } from '../../../../contexts/ToastContext'

const Client_profile = () => {
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
    industry: '',
    phone: '',
    location: '',
    joinDate: '',
    avatar: '',
    projectsCount: 0,
    totalSpent: 0,
    address: {}
  })

  const deriveAvatar = (name) => {
    if (!name) return 'CL'
    const initials = name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .join('')
    return initials.slice(0, 2) || 'CL'
  }

  const formatLocationFromAddress = (address = {}) => {
    const parts = [address.city, address.state, address.country]
      .filter(Boolean)
      .map((part) => part.trim())
    return parts.length > 0 ? parts.join(', ') : ''
  }

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const response = await getProfile()
        const client = response?.data || {}

        const location = formatLocationFromAddress(client.address)
        const addressCopy = client.address ? { ...client.address } : {}
        const formattedProfile = {
          fullName: client.name || 'Client',
          email: client.email || 'Not provided',
          company: client.companyName || 'Not specified',
          industry: client.industry || 'Not specified',
          phone: client.phoneNumber || 'Not provided',
          location: location || 'Not specified',
          joinDate: (client.joiningDate || client.createdAt || new Date().toISOString()),
          avatar: deriveAvatar(client.name),
          projectsCount: Array.isArray(client.projects) ? client.projects.length : 0,
          totalSpent: client.totalSpent || 0,
          address: addressCopy
        }

        setProfileData(formattedProfile)
        setOriginalProfile({
          ...formattedProfile,
          address: { ...addressCopy }
        })
      } catch (error) {
        console.error('Failed to load client profile:', error)

        if (error?.status === 401 || error?.isUnauthorized) {
          toast.info('Session expired. Please log in again.', {
            title: 'Session Ended',
            duration: 4000
          })
          navigate('/client-login', { replace: true })
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

  const parseLocationToAddress = (locationString, previousAddress = {}) => {
    if (!locationString || typeof locationString !== 'string') {
      return { ...previousAddress }
    }

    const parts = locationString.split(',').map((part) => part.trim()).filter(Boolean)
    if (parts.length === 0) return { ...previousAddress }

    const updatedAddress = { ...previousAddress }

    if (parts.length === 1) {
      updatedAddress.city = parts[0]
    } else if (parts.length === 2) {
      updatedAddress.city = parts[0]
      updatedAddress.country = parts[1]
    } else {
      updatedAddress.city = parts[0]
      updatedAddress.state = parts.slice(1, parts.length - 1).join(', ')
      updatedAddress.country = parts[parts.length - 1]
    }

    return updatedAddress
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)

      const updatedAddress = parseLocationToAddress(profileData.location, profileData.address)

      const sanitizedCompany = profileData.company?.trim() || 'Not specified'
      const sanitizedIndustry = profileData.industry?.trim() || 'Not specified'
      const sanitizedLocation = profileData.location?.trim() || 'Not specified'

      await updateProfile({
        companyName: sanitizedCompany === 'Not specified' ? '' : sanitizedCompany,
        industry: sanitizedIndustry === 'Not specified' ? '' : sanitizedIndustry,
        address: updatedAddress
      })

      const updatedProfile = {
        ...profileData,
        company: sanitizedCompany,
        industry: sanitizedIndustry,
        location: sanitizedLocation,
        address: { ...updatedAddress }
      }

      setProfileData(updatedProfile)
      setOriginalProfile({
        ...updatedProfile,
        address: { ...updatedAddress }
      })
      setIsEditing(false)

      toast.success('Business information updated successfully.', {
        title: 'Profile Updated',
        duration: 3000
      })
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error(error.message || 'Unable to save changes. Please try again.', {
        title: 'Update Failed',
        duration: 4000
      })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logoutClient()
      toast.logout('You have been logged out successfully', {
        title: 'Logged Out',
        duration: 3000
      })
      setTimeout(() => {
        navigate('/client-login')
      }, 1000)
    } catch (error) {
      toast.error('Failed to logout. Please try again.', {
        title: 'Logout Failed',
        duration: 4000
      })
    } finally {
      setLoggingOut(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
        <Client_navbar />
        <main className="pt-16 pb-24 md:pt-20 md:pb-8">
          <div className="px-4 md:max-w-4xl md:mx-auto md:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64 text-gray-600">Loading profile...</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
      <Client_navbar />
      <main className="pt-16 pb-24 md:pt-20 md:pb-8">
        <div className="px-4 md:max-w-6xl md:mx-auto md:px-6 lg:px-8">
          <div className="space-y-8">
            
            {/* Hero Profile Section */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-7 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 md:gap-6">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-500 flex items-center justify-center shadow-md">
                      <span className="text-xl md:text-2xl font-bold text-white">{profileData.avatar}</span>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-0.5 md:mb-1">{profileData.fullName}</h1>
                    <p className="text-sm md:text-base font-medium text-gray-800">{profileData.company}</p>
                    <p className="text-xs md:text-sm text-gray-500">{profileData.industry}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[11px] font-medium text-emerald-700">Active client</span>
                      </span>
                      <span className="hidden md:inline text-xs text-gray-400">
                        Since {new Date(profileData.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                  <button 
                    onClick={() => {
                      if (isEditing) {
                        if (originalProfile) {
                          setProfileData({
                            ...originalProfile,
                            address: { ...(originalProfile.address || {}) }
                          })
                        }
                        setIsEditing(false)
                      } else {
                        setProfileData((prev) => ({
                          ...prev,
                          company: prev.company === 'Not specified' ? '' : prev.company,
                          industry: prev.industry === 'Not specified' ? '' : prev.industry,
                          location: prev.location === 'Not specified' ? '' : prev.location
                        }))
                        setIsEditing(true)
                      }
                    }} 
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isEditing 
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                        : 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {isEditing ? <X className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    <span>{isEditing ? 'Cancel' : 'Edit profile'}</span>
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="bg-white rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100">
                <p className="text-[11px] md:text-xs font-medium text-gray-500 mb-1">Active projects</p>
                <p className="text-lg md:text-xl font-bold text-gray-900">{profileData.projectsCount}</p>
              </div>
              <div className="bg-white rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100">
                <p className="text-[11px] md:text-xs font-medium text-gray-500 mb-1">Total spent</p>
                <p className="text-lg md:text-xl font-bold text-gray-900">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(profileData.totalSpent || 0)}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100">
                <p className="text-[11px] md:text-xs font-medium text-gray-500 mb-1">Client since</p>
                <p className="text-sm md:text-base font-semibold text-gray-900">
                  {new Date(profileData.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Personal Information Card */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                      <p className="text-sm text-gray-600">Your account details and contact information</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{profileData.fullName}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{profileData.email}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{profileData.phone}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Client Since</label>
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(profileData.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Information Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Business Info</h2>
                      <p className="text-sm text-gray-600">Company and industry details</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={profileData.company} 
                          onChange={(e) => handleProfileUpdate('company', e.target.value)} 
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm" 
                          placeholder="Enter company name" 
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{profileData.company}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={profileData.industry} 
                          onChange={(e) => handleProfileUpdate('industry', e.target.value)} 
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm" 
                          placeholder="Enter industry" 
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                          <Award className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{profileData.industry}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={profileData.location} 
                          onChange={(e) => handleProfileUpdate('location', e.target.value)} 
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm" 
                          placeholder="Enter location" 
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{profileData.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-center">
                <button 
                  onClick={handleSaveProfile} 
                  disabled={saving} 
                  className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}

export default Client_profile
