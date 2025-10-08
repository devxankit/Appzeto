import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Admin_navbar from '../admin-components/Admin_navbar'
import Admin_sidebar from '../admin-components/Admin_sidebar'
import { 
  Users, 
  FolderOpen, 
  DollarSign, 
  TrendingUp,
  Activity,
  Award,
  Code,
  Trophy,
  Gift,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Settings,
  Bell,
  Eye,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target,
  Zap,
  Shield,
  Database,
  Server
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import Loading from '../../../components/ui/loading'
import { MagicCard } from '../../../components/ui/magic-card'
import { BorderBeam } from '../../../components/ui/border-beam'
import { SparklesText } from '../../../components/ui/sparkles-text'
import { AuroraText } from '../../../components/ui/aurora-text'
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'

// Import custom components
import MetricCard from '../admin-components/MetricCard'
import ChartContainer from '../admin-components/ChartContainer'
import NotificationPanel from '../admin-components/NotificationPanel'
import QuickActionButton from '../admin-components/QuickActionButton'

const Admin_dashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('7d')
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock dashboard data - replace with actual API calls
  const [dashboardData, setDashboardData] = useState({
    // User Statistics
    users: {
      total: 1234,
      sales: 45,
      pm: 12,
      employees: 89,
      clients: 1088,
      active: 1156,
      newThisMonth: 67,
      growth: 12.5
    },
    
    // Project Statistics
    projects: {
      total: 234,
      active: 89,
      completed: 123,
      onHold: 15,
      overdue: 7,
      totalRevenue: 2340000,
      avgProjectValue: 10000,
      completionRate: 78.5
    },
    
    // Sales Statistics
    sales: {
      totalLeads: 6853,
      converted: 65,
      conversionRate: 0.95,
      totalRevenue: 2340000,
      avgDealSize: 36000,
      growth: 18.2
    },
    
    // Financial Statistics
    finance: {
      totalRevenue: 2340000,
      outstandingPayments: 450000,
      expenses: 890000,
      profit: 1450000,
      profitMargin: 62,
      growth: 15.8
    },

    // System Health
    system: {
      uptime: 99.9,
      performance: 95,
      errors: 2,
      activeUsers: 156,
      serverLoad: 45
    }
  })

  // Chart data
  const revenueData = [
    { month: 'Jan', revenue: 180000, projects: 15 },
    { month: 'Feb', revenue: 220000, projects: 18 },
    { month: 'Mar', revenue: 190000, projects: 16 },
    { month: 'Apr', revenue: 250000, projects: 20 },
    { month: 'May', revenue: 280000, projects: 22 },
    { month: 'Jun', revenue: 320000, projects: 25 },
    { month: 'Jul', revenue: 350000, projects: 28 }
  ]

  const userGrowthData = [
    { month: 'Jan', users: 800, active: 720 },
    { month: 'Feb', users: 850, active: 765 },
    { month: 'Mar', users: 920, active: 828 },
    { month: 'Apr', users: 980, active: 882 },
    { month: 'May', users: 1050, active: 945 },
    { month: 'Jun', users: 1120, active: 1008 },
    { month: 'Jul', users: 1234, active: 1156 }
  ]

  const projectStatusData = [
    { name: 'Active', value: 89, color: '#10B981' },
    { name: 'Completed', value: 123, color: '#3B82F6' },
    { name: 'On Hold', value: 15, color: '#F59E0B' },
    { name: 'Overdue', value: 7, color: '#EF4444' }
  ]

  const userDistributionData = [
    { name: 'Clients', value: 1088, color: '#8B5CF6' },
    { name: 'Employees', value: 89, color: '#06B6D4' },
    { name: 'Sales', value: 45, color: '#10B981' },
    { name: 'PMs', value: 12, color: '#F59E0B' }
  ]

  // Mock notifications
  const mockNotifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Payment Overdue',
      message: '3 projects have overdue payments totaling ₹125,000',
      time: '2 hours ago',
      icon: AlertTriangle
    },
    {
      id: 2,
      type: 'success',
      title: 'Project Completed',
      message: 'E-commerce Website project completed successfully',
      time: '4 hours ago',
      icon: CheckCircle
    },
    {
      id: 3,
      type: 'info',
      title: 'New User Registration',
      message: '5 new clients registered in the last hour',
      time: '6 hours ago',
      icon: Users
    },
    {
      id: 4,
      type: 'error',
      title: 'System Alert',
      message: 'High server load detected - 85% CPU usage',
      time: '1 day ago',
      icon: Server
    }
  ]

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setNotifications(mockNotifications)
      setIsLoading(false)
    }
    loadData()
  }, [])

  const handleQuickAction = (action) => {
    switch(action) {
      case 'users':
        navigate('/admin-dev-management')
        break
      case 'projects':
        navigate('/admin-dev-management')
        break
      case 'finance':
        navigate('/admin-finance-management')
        break
      case 'sales':
        navigate('/admin-sells-management')
        break
      case 'rewards':
        navigate('/admin-reward-management')
        break
      case 'leaderboard':
        navigate('/admin-leaderboard')
        break
      default:
        break
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Admin_navbar />
        <Admin_sidebar />
        <div className="ml-64 pt-20 p-8">
          <div className="max-w-7xl mx-auto">
            <Loading size="large" className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Admin_navbar />
      
      {/* Sidebar */}
      <Admin_sidebar />
      
      {/* Main Content */}
      <div className="ml-64 pt-20 p-6">
          <div className="max-w-7xl mx-auto">

          {/* Key Metrics Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-5"
          >
            <MetricCard
              title="Total Users"
              value={dashboardData.users.total}
              change={`+${dashboardData.users.growth}% vs last month`}
              icon={Users}
              color="blue"
              format="number"
            />
            
            <MetricCard
              title="Active Projects"
              value={dashboardData.projects.active}
              change={`${dashboardData.projects.completionRate}% completion rate`}
              icon={FolderOpen}
              color="green"
              format="number"
            />
            
            <MetricCard
              title="Total Revenue"
              value={dashboardData.finance.totalRevenue}
              change={`+${dashboardData.finance.growth}% vs last month`}
              icon={DollarSign}
              color="purple"
              format="currency"
            />
            
            <MetricCard
              title="Monthly Revenue"
              value={dashboardData.finance.totalRevenue / 12}
              change={`+${dashboardData.finance.growth}% vs last month`}
              icon={DollarSign}
              color="green"
              format="currency"
            />
          </motion.div>

          {/* Secondary Metrics */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-5"
          >
            <MetricCard
              title="Converted Leads"
              value={dashboardData.sales.converted}
              icon={Trophy}
              color="orange"
              format="number"
              className="text-center"
            />
            
            <MetricCard
              title="Conversion Rate"
              value={dashboardData.sales.conversionRate}
              icon={Target}
              color="blue"
              format="percentage"
              className="text-center"
            />
            
            <MetricCard
              title="Overdue Projects"
              value={dashboardData.projects.overdue}
              icon={AlertTriangle}
              color="red"
              format="number"
              className="text-center"
            />
            
            <MetricCard
              title="Outstanding"
              value={dashboardData.finance.outstandingPayments}
              icon={Clock}
              color="orange"
              format="currency"
              className="text-center"
            />
            
            <MetricCard
              title="Performance"
              value={dashboardData.system.performance}
              icon={Zap}
              color="green"
              format="percentage"
              className="text-center"
            />
          </motion.div>

          {/* Charts Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5"
          >
            {/* Revenue Trend Chart */}
            <ChartContainer
              title="Revenue Trend"
              subtitle="Monthly revenue growth"
              icon={LineChart}
            >
              <ResponsiveContainer width="100%" height={280}>
                <RechartsLineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#14B8A6" 
                    strokeWidth={3}
                    dot={{ fill: '#14B8A6', strokeWidth: 2, r: 4 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* User Growth Chart */}
            <ChartContainer
              title="User Growth"
              subtitle="Total vs active users"
              icon={Users}
            >
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stackId="1"
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="active" 
                    stackId="2"
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </motion.div>

          {/* Project Status & User Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5"
          >
            {/* Project Status Distribution */}
            <ChartContainer
              title="Project Status"
              subtitle="Distribution of project statuses"
              icon={PieChart}
            >
              <ResponsiveContainer width="100%" height={280}>
                <RechartsPieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {projectStatusData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                      </div>
                ))}
                      </div>
            </ChartContainer>

            {/* User Distribution */}
            <ChartContainer
              title="User Distribution"
              subtitle="Users by role"
              icon={BarChart3}
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={userDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </motion.div>

          {/* Quick Actions & Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5"
          >
            {/* Quick Actions */}
            <Card className="p-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <CardTitle className="text-lg font-semibold text-gray-900">
                  Quick Actions
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <QuickActionButton
                    title="Manage Users"
                    description="View and manage all users"
                    icon={Users}
                    onClick={() => handleQuickAction('users')}
                    color="blue"
                  />
                  
                  <QuickActionButton
                    title="View Projects"
                    description="Monitor all projects"
                    icon={FolderOpen}
                    onClick={() => handleQuickAction('projects')}
                    color="green"
                  />
                  
                  <QuickActionButton
                    title="Financial Reports"
                    description="View financial analytics"
                    icon={DollarSign}
                    onClick={() => handleQuickAction('finance')}
                    color="purple"
                  />
                  
                  <QuickActionButton
                    title="Sales Management"
                    description="Monitor sales performance"
                    icon={TrendingUp}
                    onClick={() => handleQuickAction('sales')}
                    color="orange"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity & Notifications */}
            <NotificationPanel
              notifications={notifications}
              onDismiss={(id) => console.log('Dismiss notification:', id)}
            />
          </motion.div>

          </div>
        </div>
    </div>
  )
}

export default Admin_dashboard
