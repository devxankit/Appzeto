import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import logo from '../../../assets/images/logo.png'

const Admin_navbar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logout clicked')
    // navigate('/login')
  }

  const handleProfile = () => {
    // Add profile logic here
    console.log('Profile clicked')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 px-6 py-4 z-50">
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <img 
            src={logo} 
            alt="Appzeto Logo" 
            className="h-10 w-auto"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Profile Icon */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleProfile}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <User className="h-5 w-5 text-gray-600" />
          </Button>

          {/* Logout Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Admin_navbar
