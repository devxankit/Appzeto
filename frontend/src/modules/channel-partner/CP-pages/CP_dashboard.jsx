import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, LineChart, Line
} from 'recharts'
import {
    Users,
    TrendingUp,
    DollarSign,
    Activity,
    CheckCircle,
    Clock,
    ArrowRight,
    Wallet,
    PieChart as PieChartIcon,
    BarChart3
} from 'lucide-react'
import CP_navbar from '../CP-components/CP_navbar'
import { cpDashboardService } from '../CP-services'
import { useToast } from '../../../contexts/ToastContext'

const CP_dashboard = () => {
    const navigate = useNavigate()
    const { toast } = useToast()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState(null)
    const [activity, setActivity] = useState(null)
    const [leadTrends, setLeadTrends] = useState([])
    const [conversionFunnel, setConversionFunnel] = useState({})
    const [revenueChart, setRevenueChart] = useState([])

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            setLoading(true)
            const [statsRes, activityRes, trendsRes, funnelRes, revenueRes] = await Promise.all([
                cpDashboardService.getDashboardStats(),
                cpDashboardService.getRecentActivity({ limit: 5 }),
                cpDashboardService.getLeadTrends({ days: 30 }),
                cpDashboardService.getConversionFunnel(),
                cpDashboardService.getRevenueChart({ months: 12 })
            ])

            setStats(statsRes.data)
            setActivity(activityRes.data)
            setLeadTrends(trendsRes.data || [])
            setConversionFunnel(funnelRes.data || {})
            setRevenueChart(revenueRes.data || [])
        } catch (error) {
            console.error('Failed to load dashboard data:', error)
            toast.error?.('Failed to load dashboard data. Please try again.', {
                title: 'Error',
                duration: 4000
            })
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }

    const getStatusColor = (status) => {
        const colors = {
            new: 'bg-blue-50 text-blue-700 border-blue-200',
            connected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            followup: 'bg-amber-50 text-amber-700 border-amber-200',
            converted: 'bg-purple-50 text-purple-700 border-purple-200',
            lost: 'bg-red-50 text-red-700 border-red-200',
            not_picked: 'bg-slate-50 text-slate-700 border-slate-200',
            not_converted: 'bg-orange-50 text-orange-700 border-orange-200'
        }
        return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200'
    }

    // Prepare chart data
    const funnelData = Object.entries(conversionFunnel).map(([key, value]) => ({
        name: key.replace('_', ' ').toUpperCase(),
        value,
        color: key === 'converted' ? '#8B5CF6' : key === 'new' ? '#3B82F6' : key === 'connected' ? '#10B981' : '#F59E0B'
    }))

    // Prepare revenue chart data
    const revenueChartData = (revenueChart || []).map(item => ({
        month: `${item._id?.month || 0}/${item._id?.year || 0}`,
        revenue: item.revenue || 0
    }))

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280']

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
                <CP_navbar />
                <div className="pt-14 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto flex items-center justify-center h-[80vh]">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
                            <p className="text-gray-500 font-medium">Loading dashboard...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
            <CP_navbar />
            
            <div className="pt-14 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-6 pt-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Leads */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all"
                        onClick={() => navigate('/cp-leads')}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                {stats?.leads?.pending || 0}
                            </span>
                        </div>
                        <h3 className="text-xs font-medium text-gray-600 mb-1">Total Leads</h3>
                        <p className="text-xl font-bold text-gray-900">{stats?.leads?.total || 0}</p>
                    </motion.div>

                    {/* Converted */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all"
                        onClick={() => navigate('/cp-converted')}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {stats?.leads?.conversionRate?.toFixed(1) || 0}%
                            </span>
                        </div>
                        <h3 className="text-xs font-medium text-gray-600 mb-1">Converted Leads</h3>
                        <p className="text-xl font-bold text-gray-900">{stats?.leads?.converted || 0}</p>
                    </motion.div>

                    {/* Revenue */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <DollarSign className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                        <h3 className="text-xs font-medium text-gray-600 mb-1">Total Revenue</h3>
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(stats?.revenue?.total || 0)}</p>
                    </motion.div>

                    {/* Wallet */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all"
                        onClick={() => navigate('/cp-wallet')}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Wallet className="h-5 w-5 text-amber-600" />
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                        <h3 className="text-xs font-medium text-gray-600 mb-1">Wallet Balance</h3>
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(stats?.wallet?.balance || 0)}</p>
                    </motion.div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Funnel Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Conversion Funnel</h3>
                                <p className="text-sm text-gray-500">Lead progression overview</p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <PieChartIcon className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="h-72 w-full">
                            {funnelData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={funnelData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {funnelData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                borderRadius: '0.75rem',
                                                border: 'none',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                            }}
                                            itemStyle={{ fontSize: '0.875rem', fontWeight: 500 }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <PieChartIcon className="w-12 h-12 mb-3 opacity-20" />
                                    <p>No data available yet</p>
                                </div>
                            )}
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {funnelData.map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs font-medium text-slate-600">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Revenue Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
                                <p className="text-sm text-gray-500">Monthly revenue performance</p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <BarChart3 className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="h-72 w-full">
                            {revenueChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94A3B8', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94A3B8', fontSize: 12 }}
                                            tickFormatter={(value) => `₹${value / 1000}k`}
                                            dx={-10}
                                        />
                                        <Tooltip
                                            formatter={(value) => [formatCurrency(value), 'Revenue']}
                                            cursor={{ stroke: '#8B5CF6', strokeWidth: 1, strokeDasharray: '5 5' }}
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                borderRadius: '0.75rem',
                                                border: 'none',
                                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#8B5CF6"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#revenueGradient)"
                                            activeDot={{ r: 6, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 2 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <BarChart3 className="w-12 h-12 mb-3 opacity-20" />
                                    <p>No revenue data yet</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                            <p className="text-sm text-gray-500">Latest updates from your leads</p>
                        </div>
                        <button
                            onClick={() => navigate('/cp-leads')}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                        >
                            View all
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {activity?.leads?.length > 0 ? (
                            activity.leads.slice(0, 5).map((lead, index) => (
                                <div
                                    key={lead._id || index}
                                    onClick={() => navigate(`/cp-lead-profile/${lead._id}`)}
                                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-4"
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${lead.status === 'converted' ? 'bg-purple-100 text-purple-600' :
                                            lead.status === 'connected' ? 'bg-emerald-100 text-emerald-600' :
                                                'bg-blue-100 text-blue-600'
                                        }`}>
                                        {lead.status === 'converted' ? <CheckCircle className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{lead.name || lead.phone}</p>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDate(lead.createdAt)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(lead.status)}`}>
                                                {lead.status}
                                            </span>
                                            <p className="text-xs text-gray-500 truncate">
                                                {lead.requirements ? `Interested in ${lead.requirements}` : 'New inquiry'}
                                            </p>
                                        </div>
                                    </div>

                                    <ArrowRight className="w-4 h-4 text-gray-300" />
                                </div>
                            ))
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                                <Activity className="w-12 h-12 mb-3 opacity-20" />
                                <p>No recent activity found</p>
                            </div>
                        )}
                    </div>
                </motion.div>
                </div>
            </div>
        </div>
    )
}

export default CP_dashboard
