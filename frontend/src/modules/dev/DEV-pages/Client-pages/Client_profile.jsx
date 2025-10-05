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
        <div className="px-4 md:max-w-4xl md:mx-auto md:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
                <button onClick={() => setIsEditing(!isEditing)} className={`p-2 rounded-lg transition-all duration-200 ${isEditing ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-teal-600 text-white hover:bg-teal-700'}`}>
                  {isEditing ? <X className="h-4 w-4" /> : 'Edit'}
                </button>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-16 h-16 md:w-18 md:h-18 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center">
                      <span className="text-lg md:text-xl font-bold text-teal-700">{profileData.avatar}</span>
                    </div>
                    {isEditing && (
                      <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors duration-200 shadow-lg">
                        <Camera className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{profileData.fullName}</h3>
                    <p className="text-xs text-gray-500">{profileData.company}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                    {isEditing ? (
                      <input type="text" value={profileData.fullName} onChange={(e)=>handleProfileUpdate('fullName', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition-all duration-200 text-sm font-medium" placeholder="Enter your full name" />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{profileData.fullName}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">{profileData.email}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Company</label>
                    {isEditing ? (
                      <input type="text" value={profileData.company} onChange={(e)=>handleProfileUpdate('company', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition-all duration-200 text-sm font-medium" placeholder="Enter company name" />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{profileData.company}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Industry</label>
                    {isEditing ? (
                      <input type="text" value={profileData.industry} onChange={(e)=>handleProfileUpdate('industry', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition-all duration-200 text-sm font-medium" placeholder="Enter industry" />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{profileData.industry}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                    {isEditing ? (
                      <input type="tel" value={profileData.phone} onChange={(e)=>handleProfileUpdate('phone', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition-all duration-200 text-sm font-medium" placeholder="Enter phone number" />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{profileData.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                    {isEditing ? (
                      <input type="text" value={profileData.location} onChange={(e)=>handleProfileUpdate('location', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition-all duration-200 text-sm font-medium" placeholder="Enter location" />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{profileData.location}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Client Since</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">Client since {new Date(profileData.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">Registration date</p>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <button onClick={handleSaveProfile} disabled={saving} className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl mx-auto disabled:opacity-50">
                    <Save className="h-4 w-4" />
                    <span className="text-sm font-medium">{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <User className="h-4 w-4 text-teal-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Account Information</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-xs font-medium text-gray-600">Account Type</span>
                  <span className="text-xs font-semibold text-gray-900">Client</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-xs font-medium text-gray-600">Company</span>
                  <span className="text-xs font-semibold text-gray-900">{profileData.company}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-xs font-medium text-gray-600">Industry</span>
                  <span className="text-xs font-semibold text-gray-900">{profileData.industry}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-xs font-medium text-gray-600">Projects</span>
                  <span className="text-xs font-semibold text-gray-900">{profileData.projectsCount} Active</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-xs font-medium text-gray-600">Total Investment</span>
                  <span className="text-xs font-semibold text-gray-900">{formatCurrency(profileData.totalSpent)}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs font-medium text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Project Statistics</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-teal-600">{profileData.projectsCount}</div>
                  <div className="text-xs text-gray-600">Active Projects</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-teal-600">{formatCurrency(profileData.totalSpent)}</div>
                  <div className="text-xs text-gray-600">Total Investment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Client_profile
