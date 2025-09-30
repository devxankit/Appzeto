import React, { useRef } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { 
  FaRupeeSign, 
  FaVideo, 
  FaCheckCircle, 
  FaUsers,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaStar,
  FaTrophy,
  FaChartLine,
  FaFire,
  FaGem,
  FaCrown,
  FaRocket
} from 'react-icons/fa'
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Target, 
  Award,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  DollarSign,
  Users,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Star
} from 'lucide-react'
import SL_navbar from '../SL-components/SL_navbar'
import { Link } from 'react-router-dom'
import { colors, gradients } from '../../../lib/colors'

const SL_dashboard = () => {
  // Refs for scroll-triggered animations
  const tileCardsRef = useRef(null)
  const chartRef = useRef(null)
  
  // Check if elements are in view
  const tileCardsInView = useInView(tileCardsRef, { once: true, margin: "-100px" })
  const chartInView = useInView(chartRef, { once: true, margin: "-100px" })

  // Lead conversion chart data - showing conversion funnel
  const chartData = [
    { name: 'Connected', value: 80, color: '#06B6D4', amount: '80 leads' },
    { name: 'Converted', value: 40, color: '#10B981', amount: '40 leads' },
    { name: 'Lost', value: 28, color: '#EF4444', amount: '28 leads' }
  ]

  // Monthly conversion data for bar chart - 12 months for scrolling
  const monthlyData = [
    { month: 'Jan', totalLeads: 120, converted: 15, conversionRate: 12.5 },
    { month: 'Feb', totalLeads: 135, converted: 18, conversionRate: 13.3 },
    { month: 'Mar', totalLeads: 148, converted: 22, conversionRate: 14.9 },
    { month: 'Apr', totalLeads: 142, converted: 20, conversionRate: 14.1 },
    { month: 'May', totalLeads: 156, converted: 25, conversionRate: 16.0 },
    { month: 'Jun', totalLeads: 148, converted: 40, conversionRate: 27.0 },
    { month: 'Jul', totalLeads: 165, converted: 35, conversionRate: 21.2 },
    { month: 'Aug', totalLeads: 158, converted: 28, conversionRate: 17.7 },
    { month: 'Sep', totalLeads: 172, converted: 32, conversionRate: 18.6 },
    { month: 'Oct', totalLeads: 168, converted: 38, conversionRate: 22.6 },
    { month: 'Nov', totalLeads: 175, converted: 42, conversionRate: 24.0 },
    { month: 'Dec', totalLeads: 180, converted: 45, conversionRate: 25.0 }
  ]

  // Sparkline data for sales trends
  const salesTrendData = [2.1, 2.3, 2.5, 2.2, 2.8, 2.6, 2.9, 2.7, 2.85]
  const targetTrendData = [7.2, 7.1, 7.3, 7.0, 7.4, 7.2, 7.5, 7.3, 7.5]
  const incentiveTrendData = [0.8, 0.9, 1.0, 0.7, 1.1, 0.9, 1.2, 1.0, 1.0]

  return (
    <div className="min-h-screen bg-gray-50">
      <SL_navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-20 lg:pb-4">
        {/* Mobile-first layout */}
        <div className="space-y-6 lg:hidden">
          {/* Hero Dashboard Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200 rounded-2xl p-5 text-gray-900 shadow-2xl border border-teal-300/40 overflow-hidden"
              style={{
                boxShadow: '0 25px 50px -12px rgba(20, 184, 166, 0.2), 0 0 0 1px rgba(20, 184, 166, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
              }}
            >
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-4 right-8 w-2 h-2 bg-teal-200/30 rounded-full animate-pulse"></div>
              <div className="absolute top-12 right-16 w-1.5 h-1.5 bg-teal-300/25 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute top-20 right-10 w-1 h-1 bg-teal-400/20 rounded-full animate-pulse delay-2000"></div>
              <div className="absolute bottom-16 left-8 w-1.5 h-1.5 bg-teal-200/25 rounded-full animate-pulse delay-500"></div>
              <div className="absolute bottom-8 left-16 w-2 h-2 bg-teal-300/15 rounded-full animate-pulse delay-1500"></div>
              <div className="absolute top-32 right-24 w-1 h-1 bg-teal-400/15 rounded-full animate-pulse delay-3000"></div>
              <div className="absolute bottom-24 left-24 w-1.5 h-1.5 bg-teal-200/20 rounded-full animate-pulse delay-4000"></div>
              
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-3">
                <div className="w-full h-full" style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(20, 184, 166, 0.08) 1px, transparent 0)',
                  backgroundSize: '20px 20px'
                }}></div>
              </div>
            </div>

            {/* Enhanced Header Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-between mb-4 relative z-10"
            >
              <div className="flex items-center space-x-3">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="relative w-11 h-11 bg-white/60 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-xl border border-teal-300/40"
                  style={{
                    boxShadow: '0 12px 35px -8px rgba(20, 184, 166, 0.25), 0 6px 15px -4px rgba(0, 0, 0, 0.1), 0 3px 8px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <span className="text-teal-700 text-lg">👨‍💼</span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      boxShadow: '0 6px 18px -3px rgba(20, 184, 166, 0.5), 0 3px 8px -2px rgba(0, 0, 0, 0.15), 0 1px 4px -1px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <FaCrown className="text-white text-xs" />
                  </div>
                </motion.div>
                <div>
                  <h1 className="text-lg font-bold mb-0.5 text-gray-900">Hi, Sumit</h1>
                  <p className="text-teal-700 text-xs font-medium">Welcome back! 🚀</p>
                </div>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-1.5 bg-white/70 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-teal-400/50 shadow-xl"
                style={{
                  boxShadow: '0 8px 25px -5px rgba(20, 184, 166, 0.25), 0 4px 12px -3px rgba(0, 0, 0, 0.1), 0 2px 6px -1px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                }}
              >
                <FaTrophy className="text-teal-700 text-sm" />
                <span className="text-teal-800 font-bold text-xs">Top Performer</span>
              </motion.div>
            </motion.div>

            {/* Enhanced Sales Metrics */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 gap-4 mb-5"
            >
              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-teal-300/50 hover:border-teal-400/70 transition-all duration-300 shadow-xl"
                style={{
                  boxShadow: '0 10px 30px -6px rgba(20, 184, 166, 0.2), 0 6px 16px -4px rgba(0, 0, 0, 0.1), 0 3px 8px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-teal-800 text-sm font-semibold">Monthly Sales</p>
                  <div className="w-7 h-7 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg"
                    style={{
                      boxShadow: '0 6px 18px -3px rgba(20, 184, 166, 0.4), 0 3px 8px -2px rgba(0, 0, 0, 0.15), 0 1px 4px -1px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <FaChartLine className="text-white text-sm" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">₹2,850</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-emerald-300/50 hover:border-emerald-400/70 transition-all duration-300 shadow-xl"
                style={{
                  boxShadow: '0 10px 30px -6px rgba(16, 185, 129, 0.2), 0 6px 16px -4px rgba(0, 0, 0, 0.1), 0 3px 8px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-emerald-800 text-sm font-semibold">Target</p>
                  <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg"
                    style={{
                      boxShadow: '0 6px 18px -3px rgba(16, 185, 129, 0.4), 0 3px 8px -2px rgba(0, 0, 0, 0.15), 0 1px 4px -1px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <FaStar className="text-white text-sm" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">₹75,000</p>
              </motion.div>
            </motion.div>

            {/* Enhanced Progress Section */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-5"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-teal-800 text-sm font-semibold">Progress to Target</span>
                <span className="text-gray-900 font-bold text-lg">85%</span>
              </div>
              <div className="relative w-full bg-white/50 rounded-full h-2.5 overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                  className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 h-2.5 rounded-full relative shadow-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  <div className="absolute right-0 top-0 w-1 h-2.5 bg-white/90 rounded-full"></div>
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Reward Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex justify-between items-center mb-5"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg"
                  style={{
                    boxShadow: '0 6px 18px -3px rgba(20, 184, 166, 0.4), 0 3px 8px -2px rgba(0, 0, 0, 0.15), 0 1px 4px -1px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <FaGem className="text-white text-sm" />
                </div>
                <span className="text-teal-800 text-sm font-semibold">Reward Points</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-gray-900 font-bold text-xl">10k</span>
                <FaRocket className="text-teal-600 text-base" />
              </div>
            </motion.div>

            {/* Enhanced Sub-cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="grid grid-cols-2 gap-4 mb-5"
            >
              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-cyan-300/50 hover:border-cyan-400/70 transition-all duration-300 shadow-xl"
                style={{
                  boxShadow: '0 10px 30px -6px rgba(6, 182, 212, 0.2), 0 6px 16px -4px rgba(0, 0, 0, 0.1), 0 3px 8px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-cyan-800 text-sm font-semibold">Today's Sales</p>
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg"
                    style={{
                      boxShadow: '0 6px 18px -3px rgba(6, 182, 212, 0.4), 0 3px 8px -2px rgba(0, 0, 0, 0.15), 0 1px 4px -1px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <FaArrowUp className="text-white text-sm" />
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900">₹20k</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-indigo-300/50 hover:border-indigo-400/70 transition-all duration-300 shadow-xl"
                style={{
                  boxShadow: '0 10px 30px -6px rgba(99, 102, 241, 0.2), 0 6px 16px -4px rgba(0, 0, 0, 0.1), 0 3px 8px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-indigo-800 text-sm font-semibold">Today's Incentive</p>
                  <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg"
                    style={{
                      boxShadow: '0 6px 18px -3px rgba(99, 102, 241, 0.4), 0 3px 8px -2px rgba(0, 0, 0, 0.15), 0 1px 4px -1px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <FaChartLine className="text-white text-sm" />
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900">₹1,000</p>
              </motion.div>
            </motion.div>

            {/* Enhanced Bottom Metrics */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="grid grid-cols-3 gap-4"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-sky-300/50 text-center hover:border-sky-400/70 transition-all duration-300 shadow-xl"
                style={{
                  boxShadow: '0 8px 25px -5px rgba(14, 165, 233, 0.2), 0 4px 12px -3px rgba(0, 0, 0, 0.1), 0 2px 6px -1px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                }}
              >
                <p className="text-sky-800 text-sm mb-1.5 font-semibold">Total Deals</p>
                <p className="text-gray-900 text-lg font-bold">24</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-emerald-300/50 text-center hover:border-emerald-400/70 transition-all duration-300 shadow-xl"
                style={{
                  boxShadow: '0 8px 25px -5px rgba(16, 185, 129, 0.2), 0 4px 12px -3px rgba(0, 0, 0, 0.1), 0 2px 6px -1px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                }}
              >
                <p className="text-emerald-800 text-sm mb-1.5 font-semibold">Total Leads</p>
                <p className="text-gray-900 text-lg font-bold">48</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-violet-300/50 text-center hover:border-violet-400/70 transition-all duration-300 shadow-xl"
                style={{
                  boxShadow: '0 8px 25px -5px rgba(139, 92, 246, 0.2), 0 4px 12px -3px rgba(0, 0, 0, 0.1), 0 2px 6px -1px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                }}
              >
                <p className="text-violet-800 text-sm mb-1.5 font-semibold">Monthly Incentive</p>
                <p className="text-gray-900 text-lg font-bold">₹8,250</p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Enhanced Tile Cards Grid */}
          <motion.div 
            ref={tileCardsRef}
            initial={{ opacity: 0, y: 50 }}
            animate={tileCardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid grid-cols-2 gap-4"
          >
            {/* Payment Recovery */}
            <Link to="/payments-recovery">
              <div 
                className="bg-emerald-50 rounded-xl p-4 text-emerald-800 transition-all duration-300 cursor-pointer border border-emerald-200/30"
                style={{
                  boxShadow: '0 10px 30px -8px rgba(0, 0, 0, 0.2), 0 6px 16px -4px rgba(0, 0, 0, 0.12), 0 3px 8px -2px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                }}
              >
              <div className="flex flex-col h-full">
                {/* Enhanced Icon Section */}
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-emerald-100 backdrop-blur-sm rounded-xl flex items-center justify-center border border-emerald-200/30"
                    style={{
                      boxShadow: '0 6px 20px -4px rgba(0, 0, 0, 0.15), 0 3px 10px -2px rgba(0, 0, 0, 0.08), 0 1px 5px -1px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
                    }}
                  >
                    <FaRupeeSign className="text-xl text-emerald-600" />
                  </div>
                </div>
                
                {/* Enhanced Content Section */}
                <div className="flex-1 flex flex-col justify-between text-center">
                  <div>
                    <h3 className="font-bold text-sm mb-1.5 leading-tight text-emerald-800">Payment Recovery</h3>
                    <div className="flex items-center justify-center space-x-2 mb-2.5">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <p className="text-xs font-semibold opacity-95 text-emerald-700">12 Pendings</p>
                    </div>
                  </div>
                  
                  {/* Enhanced Trend Section */}
                  <div className="flex items-center justify-center space-x-1.5 mt-auto bg-emerald-100 rounded-lg px-2.5 py-1.5">
                    <FaArrowUp className="text-xs text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-600">+2 this week</span>
                  </div>
                </div>
              </div>
              </div>
            </Link>

            {/* Demo Requests */}
            <Link to="/demo-requests">
              <div 
                className="bg-blue-50 rounded-xl p-4 text-blue-800 transition-all duration-300 cursor-pointer border border-blue-200/30"
                style={{
                  boxShadow: '0 10px 30px -8px rgba(0, 0, 0, 0.2), 0 6px 16px -4px rgba(0, 0, 0, 0.12), 0 3px 8px -2px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                }}
              >
              <div className="flex flex-col h-full">
                {/* Enhanced Icon Section */}
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-blue-100 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-200/30"
                    style={{
                      boxShadow: '0 6px 20px -4px rgba(0, 0, 0, 0.15), 0 3px 10px -2px rgba(0, 0, 0, 0.08), 0 1px 5px -1px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
                    }}
                  >
                    <FaVideo className="text-xl text-blue-600" />
                  </div>
                </div>
                
                {/* Enhanced Content Section */}
                <div className="flex-1 flex flex-col justify-between text-center">
                  <div>
                    <h3 className="font-bold text-sm mb-1.5 leading-tight text-blue-800">Demo Requests</h3>
                    <div className="flex items-center justify-center space-x-2 mb-2.5">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-sm"></div>
                      <p className="text-xs font-semibold opacity-95 text-blue-700">5 New</p>
                    </div>
                  </div>
                  
                  {/* Enhanced Trend Section */}
                  <div className="flex items-center justify-center space-x-1.5 mt-auto bg-blue-100 rounded-lg px-2.5 py-1.5">
                    <FaArrowUp className="text-xs text-blue-600" />
                    <span className="text-xs font-semibold text-blue-600">+3 today</span>
                  </div>
                </div>
              </div>
              </div>
            </Link>

            {/* Tasks */}
            <Link to="/tasks">
              <div 
                className="bg-purple-50 rounded-xl p-4 text-purple-800 transition-all duration-300 cursor-pointer border border-purple-200/30"
                style={{
                  boxShadow: '0 10px 30px -8px rgba(0, 0, 0, 0.2), 0 6px 16px -4px rgba(0, 0, 0, 0.12), 0 3px 8px -2px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                }}
              >
              <div className="flex flex-col h-full">
                {/* Enhanced Icon Section */}
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-purple-100 backdrop-blur-sm rounded-xl flex items-center justify-center border border-purple-200/30"
                    style={{
                      boxShadow: '0 6px 20px -4px rgba(0, 0, 0, 0.15), 0 3px 10px -2px rgba(0, 0, 0, 0.08), 0 1px 5px -1px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
                    }}
                  >
                    <FaCheckCircle className="text-xl text-purple-600" />
                  </div>
                </div>
                
                {/* Enhanced Content Section */}
                <div className="flex-1 flex flex-col justify-between text-center">
                  <div>
                    <h3 className="font-bold text-sm mb-1.5 leading-tight text-purple-800">Tasks</h3>
                    <div className="flex items-center justify-center space-x-2 mb-2.5">
                      <div className="w-2 h-2 bg-purple-500 rounded-full shadow-sm"></div>
                      <p className="text-xs font-semibold opacity-95 text-purple-700">8 Pending</p>
                    </div>
                  </div>
                  
                  {/* Enhanced Trend Section */}
                  <div className="flex items-center justify-center space-x-1.5 mt-auto bg-purple-100 rounded-lg px-2.5 py-1.5">
                    <FaArrowDown className="text-xs text-purple-600" />
                    <span className="text-xs font-semibold text-purple-600">-1 completed</span>
                  </div>
                </div>
              </div>
              </div>
            </Link>

            {/* Meetings */}
            <Link to="/meetings">
              <div 
                className="bg-orange-50 rounded-xl p-4 text-orange-800 transition-all duration-300 cursor-pointer border border-orange-200/30"
                style={{
                  boxShadow: '0 10px 30px -8px rgba(0, 0, 0, 0.2), 0 6px 16px -4px rgba(0, 0, 0, 0.12), 0 3px 8px -2px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                }}
              >
              <div className="flex flex-col h-full">
                {/* Enhanced Icon Section */}
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-orange-100 backdrop-blur-sm rounded-xl flex items-center justify-center border border-orange-200/30"
                    style={{
                      boxShadow: '0 6px 20px -4px rgba(0, 0, 0, 0.15), 0 3px 10px -2px rgba(0, 0, 0, 0.08), 0 1px 5px -1px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
                    }}
                  >
                    <FaUsers className="text-xl text-orange-600" />
                  </div>
                </div>
                
                {/* Enhanced Content Section */}
                <div className="flex-1 flex flex-col justify-between text-center">
                  <div>
                    <h3 className="font-bold text-sm mb-1.5 leading-tight text-orange-800">Meetings</h3>
                    <div className="flex items-center justify-center space-x-2 mb-2.5">
                      <div className="w-2 h-2 bg-orange-500 rounded-full shadow-sm"></div>
                      <p className="text-xs font-semibold opacity-95 text-orange-700">3 Today</p>
                    </div>
                  </div>
                  
                  {/* Enhanced Trend Section */}
                  <div className="flex items-center justify-center space-x-1.5 mt-auto bg-orange-100 rounded-lg px-2.5 py-1.5">
                    <FaClock className="text-xs text-orange-600" />
                    <span className="text-xs font-semibold text-orange-600">2 upcoming</span>
                  </div>
                </div>
              </div>
              </div>
            </Link>
          </motion.div>

          {/* Enhanced Sales Analytics Section */}
          <motion.div 
            ref={chartRef}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={chartInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl border border-gray-200/50"
            style={{
              boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}
          >
            {/* Header Section */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lead Conversion</h3>
              <p className="text-gray-600 text-sm">Conversion funnel from connected to converted leads</p>
            </div>

            {/* Modern Chart Container */}
            <div className="relative">
              {/* Chart */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <PieChart width={240} height={240}>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                  
                  {/* Center Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">148</p>
                      <p className="text-xs text-gray-600">Total Leads</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Legend */}
              <div className="space-y-3">
                {chartData.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={chartInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                    transition={{ duration: 0.6, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full shadow-sm" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-600">{item.amount}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{item.value}%</p>
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={chartInView ? { width: `${item.value}%` } : { width: 0 }}
                          transition={{ duration: 1.2, delay: 0.5 + (index * 0.1), ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={chartInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="mt-6 grid grid-cols-2 gap-4"
              >
                 <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-3 border border-emerald-200/50">
                   <div className="flex items-center space-x-1.5 mb-1.5">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                     <p className="text-xs font-semibold text-emerald-700">Conversion Rate</p>
                   </div>
                   <p className="text-base font-bold text-emerald-900">27.0%</p>
                   <p className="text-xs text-emerald-600">40/148 converted</p>
                 </div>
                 
                 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200/50">
                   <div className="flex items-center space-x-1.5 mb-1.5">
                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                     <p className="text-xs font-semibold text-blue-700">Connected Rate</p>
                   </div>
                   <p className="text-base font-bold text-blue-900">54.1%</p>
                   <p className="text-xs text-blue-600">80/148 connected</p>
                 </div>
               </motion.div>
             </div>
           </motion.div>

           {/* Monthly Conversion Bar Chart */}
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={chartInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
             transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
             className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl border border-gray-200/50"
             style={{
               boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
             }}
           >
             {/* Header Section */}
             <div className="text-center mb-4">
               <h3 className="text-lg font-bold text-gray-900">Monthly Conversions</h3>
               <p className="text-gray-600 text-xs">Swipe to see past months</p>
             </div>

             {/* Scrollable Bar Chart Container */}
             <div className="h-64 overflow-x-auto">
               <div className="min-w-[600px] h-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart
                     data={monthlyData}
                     margin={{
                       top: 10,
                       right: 10,
                       left: 10,
                       bottom: 10,
                     }}
                   >
                     <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
                     <XAxis 
                       dataKey="month" 
                       stroke="#6b7280"
                       fontSize={11}
                       tickLine={false}
                       axisLine={false}
                     />
                     <YAxis 
                       stroke="#6b7280"
                       fontSize={11}
                       tickLine={false}
                       axisLine={false}
                       width={30}
                     />
                     <Tooltip 
                       contentStyle={{
                         backgroundColor: 'white',
                         border: '1px solid #e5e7eb',
                         borderRadius: '6px',
                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                         fontSize: '12px'
                       }}
                       formatter={(value) => [`${value} clients`, 'Converted']}
                       labelFormatter={(label) => `${label}`}
                     />
                     <Bar 
                       dataKey="converted" 
                       fill="#10B981" 
                       radius={[2, 2, 0, 0]}
                       name="converted"
                     />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             </div>

             {/* Chart Summary - Compact Rectangle Cards */}
             <div className="mt-3 grid grid-cols-3 gap-2 text-center">
               <div className="bg-emerald-50 rounded-md p-2 border border-emerald-200/50">
                 <p className="text-xs font-semibold text-emerald-700 mb-0.5">Best Month</p>
                 <p className="text-xs font-bold text-emerald-900">Dec</p>
                 <p className="text-xs text-emerald-600">45 converted</p>
               </div>
               <div className="bg-blue-50 rounded-md p-2 border border-blue-200/50">
                 <p className="text-xs font-semibold text-blue-700 mb-0.5">Avg Conversion</p>
                 <p className="text-xs font-bold text-blue-900">19.8%</p>
                 <p className="text-xs text-blue-600">per month</p>
               </div>
               <div className="bg-purple-50 rounded-md p-2 border border-purple-200/50">
                 <p className="text-xs font-semibold text-purple-700 mb-0.5">Total Converted</p>
                 <p className="text-xs font-bold text-purple-900">360</p>
                 <p className="text-xs text-purple-600">12 months</p>
               </div>
             </div>
           </motion.div>
         </div>

        {/* Desktop Layout - Hidden on mobile */}
        <div className="hidden lg:block mt-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Main card takes 8 columns on desktop */}
            <div className="col-span-8">
              <div className="relative bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 rounded-xl p-6 text-white shadow-2xl border border-white/10 overflow-hidden">
                {/* Sparkle Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-4 right-8 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                  <div className="absolute top-12 right-16 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse delay-1000"></div>
                  <div className="absolute top-20 right-12 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse delay-2000"></div>
                  <div className="absolute bottom-16 left-8 w-1.5 h-1.5 bg-white/35 rounded-full animate-pulse delay-500"></div>
                  <div className="absolute bottom-8 left-16 w-2 h-2 bg-white/20 rounded-full animate-pulse delay-1500"></div>
                </div>

                {/* Desktop version of main card with more spacing */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                      <span className="text-yellow-300 text-xl">👨‍🎓</span>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold mb-1">Hi, Sumit</h1>
                      <p className="text-white/80 text-sm">Welcome back!</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaTrophy className="text-yellow-300 text-lg" />
                    <span className="text-yellow-300 font-semibold text-sm">Top Performer</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white/80 text-xs font-medium">Monthly Sales</p>
                      <FaChartLine className="text-white/60 text-sm" />
                    </div>
                    <p className="text-2xl font-bold mb-2">₹2,850</p>
                    <div className="h-8">
                      <Sparklines data={salesTrendData} width={120} height={32} margin={0}>
                        <SparklinesLine color="#ffffff" style={{ strokeWidth: 1.5 }} />
                        <SparklinesSpots size={2} style={{ fill: "#ffffff" }} />
                      </Sparklines>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white/80 text-xs font-medium">Target</p>
                      <FaStar className="text-yellow-300 text-sm" />
                    </div>
                    <p className="text-2xl font-bold mb-2">₹75,000</p>
                    <div className="h-8">
                      <Sparklines data={targetTrendData} width={120} height={32} margin={0}>
                        <SparklinesLine color="#fbbf24" style={{ strokeWidth: 1.5 }} />
                        <SparklinesSpots size={2} style={{ fill: "#fbbf24" }} />
                      </Sparklines>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white/80 text-xs font-medium">Progress</p>
                      <FaTrophy className="text-yellow-300 text-sm" />
                    </div>
                    <p className="text-2xl font-bold mb-2">85%</p>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-gradient-to-r from-white to-yellow-200 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white/80 text-xs font-medium">Today's Sales</p>
                      <FaArrowUp className="text-green-300 text-sm" />
                    </div>
                    <p className="text-xl font-bold">20k</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white/80 text-xs font-medium">Total Incentive</p>
                      <FaChartLine className="text-blue-300 text-sm" />
                    </div>
                    <p className="text-xl font-bold">1000</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tiles take 4 columns on desktop */}
            <div className="col-span-4 space-y-3">
              <div className="bg-gradient-to-br from-brand-300 to-brand-400 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm flex-shrink-0">
                    <FaRupeeSign className="text-xl text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 leading-tight">Payment Recovery</h3>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-white bg-opacity-60 rounded-full flex-shrink-0"></div>
                      <p className="text-xs font-medium opacity-95 truncate">12 Pendings</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaArrowUp className="text-xs opacity-70 flex-shrink-0" />
                      <span className="text-xs opacity-75 font-medium">+2 this week</span>
                    </div>
                  </div>
                </div>
              </div>

              <Link to="/new-leads">
                <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm flex-shrink-0">
                    <FaVideo className="text-xl text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 leading-tight">Demo Requests</h3>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-sm flex-shrink-0"></div>
                      <p className="text-xs font-medium opacity-95 truncate">5 New</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaArrowUp className="text-xs opacity-70 flex-shrink-0" />
                      <span className="text-xs opacity-75 font-medium">+3 today</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

              <div className="bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm flex-shrink-0">
                    <FaCheckCircle className="text-xl text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 leading-tight">Tasks</h3>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-yellow-200 rounded-full shadow-sm flex-shrink-0"></div>
                      <p className="text-xs font-medium opacity-95 truncate">8 Pending</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaArrowDown className="text-xs opacity-70 flex-shrink-0" />
                      <span className="text-xs opacity-75 font-medium">-1 completed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm flex-shrink-0">
                    <FaUsers className="text-xl text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 leading-tight">Meetings</h3>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-green-200 rounded-full shadow-sm flex-shrink-0"></div>
                      <p className="text-xs font-medium opacity-95 truncate">3 Today</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaClock className="text-xs opacity-70 flex-shrink-0" />
                      <span className="text-xs opacity-75 font-medium">2 upcoming</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Chart */}
          <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Lead Conversion</h3>
              <p className="text-gray-600">Conversion funnel from connected to converted leads</p>
            </div>
            
            <div className="flex items-center justify-between">
              {/* Chart */}
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <PieChart width={300} height={300}>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={130}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                  
                  {/* Center Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">148</p>
                      <p className="text-sm text-gray-600">Total Leads</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex-1 pl-8">
                <div className="space-y-4">
                  {chartData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-5 h-5 rounded-full shadow-sm" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <div>
                          <p className="text-base font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.amount}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">{item.value}%</p>
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ 
                              backgroundColor: item.color,
                              width: `${item.value}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}

export default SL_dashboard 
