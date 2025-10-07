import React, { useEffect, useState } from 'react'
import Client_navbar from '../../DEV-components/Client_navbar'
import { FiUser as User, FiMail as Mail, FiCamera as Camera, FiSave as Save, FiX as X, FiCalendar as Calendar, FiAward as Award, FiBriefcase as Briefcase, FiPhone as Phone, FiMapPin as MapPin } from 'react-icons/fi'

const Client_profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
    totalSpent: 0
  })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await new Promise(r => setTimeout(r, 400))
      setProfileData({
        fullName: 'John Smith',
        email: 'john.smith@company.com',
        company: 'TechCorp Solutions',
        industry: 'Technology',
        phone: '+91 98765 43210',
        location: 'Mumbai, India',
        joinDate: new Date(Date.now()-300*24*60*60*1000).toISOString(),
        avatar: 'JS',
        projectsCount: 3,
        totalSpent: 150000
      })
      setLoading(false)
    }
    load()
  }, [])

  const handleProfileUpdate = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))
    setSaving(false)
    setIsEditing(false)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
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
            <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary rounded-3xl p-6 md:p-8 shadow-2xl">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center space-x-6 mb-6 md:mb-0">
                    <div className="relative">
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 shadow-xl">
                        <span className="text-2xl md:text-3xl font-bold text-white">{profileData.avatar}</span>
                      </div>
                      {isEditing && (
                        <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl">
                          <Camera className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="text-white">
                      <h1 className="text-xl md:text-2xl font-bold mb-1">{profileData.fullName}</h1>
                      <p className="text-base md:text-lg text-white/90 font-medium">{profileData.company}</p>
                      <p className="text-sm text-white/80">{profileData.industry}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-white/90">Active Client</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => setIsEditing(!isEditing)} 
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
                        isEditing 
                          ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm' 
                          : 'bg-white text-primary hover:bg-gray-50'
                      }`}
                    >
                      {isEditing ? <X className="h-5 w-5" /> : <User className="h-5 w-5" />}
                      <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                    </button>
                  </div>
                </div>
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
