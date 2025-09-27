import React from 'react'
import { PieChart, Pie, Cell } from 'recharts'
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines'
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
  FaChartLine
} from 'react-icons/fa'
import SL_navbar from '../SL-components/SL_navbar'
import { colors, gradients } from '../../../lib/colors'

const SL_dashboard = () => {
  // Donut chart data using centralized colors
  const chartData = [
    { name: 'Light Sea Green', value: 25, color: colors['light-sea-green'] },
    { name: 'Robin Egg Blue', value: 20, color: colors['robin-egg-blue'] },
    { name: 'Tiffany Blue', value: 15, color: colors['tiffany-blue'] },
    { name: 'Celeste', value: 20, color: colors['celeste'] },
    { name: 'Celeste 2', value: 20, color: colors['celeste-2'] }
  ]

  // Sparkline data for sales trends
  const salesTrendData = [2.1, 2.3, 2.5, 2.2, 2.8, 2.6, 2.9, 2.7, 2.85]
  const targetTrendData = [7.2, 7.1, 7.3, 7.0, 7.4, 7.2, 7.5, 7.3, 7.5]
  const incentiveTrendData = [0.8, 0.9, 1.0, 0.7, 1.1, 0.9, 1.2, 1.0, 1.0]

  return (
    <div className="min-h-screen bg-gray-50">
      <SL_navbar />
      <main className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile-first layout */}
        <div className="space-y-6 lg:hidden">
          {/* Main Dashboard Card */}
          <div className="relative bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 rounded-xl p-4 text-white shadow-2xl border border-white/10 overflow-hidden">
            {/* Sparkle Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-2 right-6 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse"></div>
              <div className="absolute top-8 right-12 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute top-14 right-8 w-1 h-1 bg-white/25 rounded-full animate-pulse delay-2000"></div>
              <div className="absolute bottom-12 left-6 w-1 h-1 bg-white/35 rounded-full animate-pulse delay-500"></div>
              <div className="absolute bottom-6 left-12 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-1500"></div>
            </div>

            {/* Header Section */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  <span className="text-yellow-300 text-lg">👨‍🎓</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold mb-0.5">Hi, Sumit</h1>
                  <p className="text-white/80 text-xs">Welcome back!</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <FaTrophy className="text-yellow-300 text-sm" />
                <span className="text-yellow-300 font-semibold text-xs">Top Performer</span>
              </div>
            </div>

            {/* Sales Metrics with Sparklines */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white/80 text-xs font-medium">Monthly Sales</p>
                  <FaChartLine className="text-white/60 text-xs" />
                </div>
                <p className="text-lg font-bold mb-1">₹2,850</p>
                <div className="h-6">
                  <Sparklines data={salesTrendData} width={100} height={24} margin={0}>
                    <SparklinesLine color="#ffffff" style={{ strokeWidth: 1.5 }} />
                    <SparklinesSpots size={1} style={{ fill: "#ffffff" }} />
                  </Sparklines>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white/80 text-xs font-medium">Target</p>
                  <FaStar className="text-yellow-300 text-xs" />
                </div>
                <p className="text-lg font-bold mb-1">₹75,000</p>
                <div className="h-6">
                  <Sparklines data={targetTrendData} width={100} height={24} margin={0}>
                    <SparklinesLine color="#fbbf24" style={{ strokeWidth: 1.5 }} />
                    <SparklinesSpots size={1} style={{ fill: "#fbbf24" }} />
                  </Sparklines>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/80 text-xs font-medium">Progress</span>
                <span className="text-white font-bold text-sm">85%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden shadow-inner">
                <div className="bg-gradient-to-r from-white via-yellow-200 to-white h-2 rounded-full relative" style={{ width: '85%' }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Reward Section */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-1">
                <FaTrophy className="text-yellow-300 text-sm" />
                <span className="text-white/80 text-xs font-medium">Reward</span>
              </div>
              <span className="text-yellow-300 font-bold text-lg">10k</span>
            </div>

            {/* Embedded Sub-cards */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white/80 text-xs font-medium">Today's Sales</p>
                  <FaArrowUp className="text-green-300 text-xs" />
                </div>
                <p className="text-lg font-bold">20k</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white/80 text-xs font-medium">Total Incentive</p>
                  <FaChartLine className="text-blue-300 text-xs" />
                </div>
                <p className="text-lg font-bold">1000</p>
              </div>
            </div>

            {/* Bottom Metrics */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-md p-2 border border-white/20 text-center hover:bg-white/15 transition-all duration-300">
                <p className="text-white/70 text-xs mb-0.5">Total Deals</p>
                <p className="text-sm font-bold">24</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-md p-2 border border-white/20 text-center hover:bg-white/15 transition-all duration-300">
                <p className="text-white/70 text-xs mb-0.5">Total Leads</p>
                <p className="text-sm font-bold">48</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-md p-2 border border-white/20 text-center hover:bg-white/15 transition-all duration-300">
                <p className="text-white/70 text-xs mb-0.5">Monthly Incentive</p>
                <p className="text-sm font-bold">$8,250</p>
              </div>
            </div>
          </div>

           {/* Tile Cards Grid */}
           <div className="grid grid-cols-2 gap-3">
             {/* Payment Recovery */}
             <div className="bg-gradient-to-br from-brand-300 to-brand-400 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
               <div className="flex flex-col h-full">
                 {/* Icon Section */}
                 <div className="flex justify-center mb-3">
                   <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                     <FaRupeeSign className="text-xl text-white" />
                   </div>
          </div>
          
                 {/* Content Section */}
                 <div className="flex-1 flex flex-col justify-between text-center">
                   <div>
                     <h3 className="font-semibold text-sm mb-2 leading-tight">Payment Recovery</h3>
                     <div className="flex items-center justify-center space-x-2 mb-2">
                       <div className="w-2 h-2 bg-white bg-opacity-60 rounded-full"></div>
                       <p className="text-xs font-medium opacity-95">12 Pendings</p>
                    </div>
                  </div>
                   
                   {/* Trend Section */}
                   <div className="flex items-center justify-center space-x-1 mt-auto">
                     <FaArrowUp className="text-xs opacity-70" />
                     <span className="text-xs opacity-75 font-medium">+2 this week</span>
                  </div>
                </div>
              </div>
            </div>

             {/* Demo Requests */}
             <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
               <div className="flex flex-col h-full">
                 {/* Icon Section */}
                 <div className="flex justify-center mb-3">
                   <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                     <FaVideo className="text-xl text-white" />
                   </div>
                 </div>
                 
                 {/* Content Section */}
                 <div className="flex-1 flex flex-col justify-between text-center">
                   <div>
                     <h3 className="font-semibold text-sm mb-2 leading-tight">Demo Requests</h3>
                     <div className="flex items-center justify-center space-x-2 mb-2">
                       <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-sm"></div>
                       <p className="text-xs font-medium opacity-95">5 New</p>
                    </div>
                  </div>
                   
                   {/* Trend Section */}
                   <div className="flex items-center justify-center space-x-1 mt-auto">
                     <FaArrowUp className="text-xs opacity-70" />
                     <span className="text-xs opacity-75 font-medium">+3 today</span>
                  </div>
                </div>
              </div>
            </div>

             {/* Tasks */}
             <div className="bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
               <div className="flex flex-col h-full">
                 {/* Icon Section */}
                 <div className="flex justify-center mb-3">
                   <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                     <FaCheckCircle className="text-xl text-white" />
                   </div>
                 </div>
                 
                 {/* Content Section */}
                 <div className="flex-1 flex flex-col justify-between text-center">
                   <div>
                     <h3 className="font-semibold text-sm mb-2 leading-tight">Tasks</h3>
                     <div className="flex items-center justify-center space-x-2 mb-2">
                       <div className="w-2 h-2 bg-yellow-200 rounded-full shadow-sm"></div>
                       <p className="text-xs font-medium opacity-95">8 Pending</p>
                    </div>
                  </div>
                   
                   {/* Trend Section */}
                   <div className="flex items-center justify-center space-x-1 mt-auto">
                     <FaArrowDown className="text-xs opacity-70" />
                     <span className="text-xs opacity-75 font-medium">-1 completed</span>
                  </div>
                </div>
              </div>
            </div>

             {/* Meetings */}
             <div className="bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
               <div className="flex flex-col h-full">
                 {/* Icon Section */}
                 <div className="flex justify-center mb-3">
                   <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                     <FaUsers className="text-xl text-white" />
                   </div>
                 </div>
                 
                 {/* Content Section */}
                 <div className="flex-1 flex flex-col justify-between text-center">
                   <div>
                     <h3 className="font-semibold text-sm mb-2 leading-tight">Meetings</h3>
                     <div className="flex items-center justify-center space-x-2 mb-2">
                       <div className="w-2 h-2 bg-green-200 rounded-full shadow-sm"></div>
                       <p className="text-xs font-medium opacity-95">3 Today</p>
                    </div>
                  </div>
                   
                   {/* Trend Section */}
                   <div className="flex items-center justify-center space-x-1 mt-auto">
                     <FaClock className="text-xs opacity-70" />
                     <span className="text-xs opacity-75 font-medium">2 upcoming</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-center">
              <PieChart width={256} height={256}>
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
            </div>
          </div>
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
          <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Sales Distribution</h3>
            <div className="flex justify-center">
              <PieChart width={320} height={320}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={140}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}

export default SL_dashboard 
