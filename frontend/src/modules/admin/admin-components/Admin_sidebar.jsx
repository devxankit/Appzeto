import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Code, 
  DollarSign, 
  Trophy, 
  Gift, 
  TrendingUp,
  MessageSquare,
  Menu
} from 'lucide-react'
import { Button } from '../../../components/ui/button'

const Admin_sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/admin-dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'dev-management',
      label: 'Dev Management',
      path: '/admin-dev-management',
      icon: Code
    },
    {
      id: 'sells-management',
      label: 'Sells Management',
      path: '/admin-sells-management',
      icon: TrendingUp
    },
    {
      id: 'finance-management',
      label: 'Finance Management',
      path: '/admin-finance-management',
      icon: DollarSign
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      path: '/admin-leaderboard',
      icon: Trophy
    },
    {
      id: 'reward-management',
      label: 'Reward Management',
      path: '/admin-reward-management',
      icon: Gift
    },
    {
      id: 'requests-management',
      label: 'Requests Management',
      path: '/admin-requests-management',
      icon: MessageSquare
    }
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="fixed left-0 top-16 w-64 bg-white shadow-sm border-r border-gray-200 h-screen z-40">
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center space-x-2 mb-8">
          <Menu className="h-6 w-6 text-teal-500" />
          <h2 className="text-lg font-semibold text-teal-600">Admin Panel</h2>
        </div>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <Button
                key={item.id}
                variant={active ? "default" : "ghost"}
                className={`w-full justify-start space-x-3 transition-all duration-300 ease-in-out ${
                  active 
                    ? 'bg-teal-50/80 text-teal-600 border-teal-100 shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50/60 hover:text-gray-600'
                }`}
                onClick={() => navigate(item.path)}
              >
                <Icon className={`h-5 w-5 transition-colors duration-300 ease-in-out ${active ? 'text-teal-500' : 'text-gray-400 hover:text-gray-500'}`} />
                <span className={`font-medium transition-colors duration-300 ease-in-out ${active ? 'text-teal-600' : 'text-gray-500'}`}>{item.label}</span>
              </Button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default Admin_sidebar
