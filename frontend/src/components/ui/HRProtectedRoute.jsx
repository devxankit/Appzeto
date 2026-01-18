import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAdminAuthenticated } from '../../modules/admin/admin-services/adminAuthService'
import { adminStorage } from '../../modules/admin/admin-services/baseApiService'

const HRProtectedRoute = ({ children }) => {
  const location = useLocation()
  
  // Check if user is authenticated
  const isAuthenticated = isAdminAuthenticated()
  
  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/admin-login" state={{ from: location }} replace />
  }
  
  // Check if user is HR
  const adminData = adminStorage.get()
  if (!adminData || adminData.role !== 'hr') {
    // If not HR, redirect to appropriate page
    if (adminData?.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />
    }
    return <Navigate to="/admin-login" replace />
  }
  
  // If authenticated and is HR, render the protected component
  return children
}

export default HRProtectedRoute
