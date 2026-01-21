import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    Users,
    TrendingUp,
    DollarSign,
    Activity,
    CheckCircle,
    Clock,
    ArrowRight,
    Wallet,
    Bell,
    Phone,
    Mail,
    Plus,
    Share2,
    FileText,
    PlayCircle,
    ChevronRight,
    Search,
    Filter
} from 'lucide-react'
import CP_navbar from '../CP-components/CP_navbar'

const CP_dashboard = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000)
        return () => clearTimeout(timer)
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24 font-sans">
            <CP_navbar />

            <main className="max-w-md mx-auto md:max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-8 space-y-6">

                {/* 1. Wallet Highlight Card (Hero Section) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 shadow-xl shadow-indigo-900/20 p-6 text-white"
                >
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-indigo-200 text-sm font-medium mb-1">Available Balance</p>
                                <h2 className="text-4xl font-bold tracking-tight">₹ 42,500</h2>
                            </div>
                            <div
                                onClick={() => navigate('/cp-wallet')}
                                className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 relative group cursor-pointer hover:bg-white/20 transition-all"
                            >
                                <Wallet className="w-6 h-6 text-indigo-100 group-hover:scale-110 transition-transform" />
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 mb-6 text-sm">
                            <div>
                                <p className="text-indigo-300 text-xs">Pending Earnings</p>
                                <p className="font-semibold text-white">₹ 12,800</p>
                            </div>
                            <div className="h-8 w-px bg-white/10"></div>
                            <div>
                                <p className="text-indigo-300 text-xs">Last Payout</p>
                                <p className="font-semibold text-white">22 Jan 2024</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/cp-wallet')}
                                className="flex-1 py-2.5 px-4 bg-white text-indigo-900 rounded-xl font-semibold text-sm hover:bg-indigo-50 active:scale-[0.98] transition-all focus:ring-2 focus:ring-white/20"
                            >
                                View Wallet
                            </button>
                            <button className="flex-1 py-2.5 px-4 bg-indigo-800/50 backdrop-blur-sm border border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700/50 active:scale-[0.98] transition-all">
                                History
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* 3. Lead Overview (Quick Stats Grid) */}
                <div className="grid grid-cols-2 gap-3 md:gap-6">
                    {[
                        { label: 'Active Leads', count: 24, color: 'blue', icon: Activity, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
                        { label: 'Hot Leads', count: 8, color: 'orange', icon: TrendingUp, bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100' },
                        { label: 'Not Interested', count: 12, color: 'red', icon: Users, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' },
                        { label: 'Converted', count: 5, color: 'emerald', icon: CheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + (idx * 0.05) }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-4 rounded-2xl border ${stat.border} ${stat.bg} relative overflow-hidden cursor-pointer group hover:shadow-md transition-all`}
                        >
                            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                                <stat.icon className={`w-12 h-12 ${stat.text}`} />
                            </div>
                            <h3 className={`text-3xl font-bold ${stat.text} mb-1`}>{stat.count}</h3>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions Bar (Below Cards) */}
                <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                    <button
                        onClick={() => navigate('/cp-converted')}
                        className="flex-none w-28 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Activity className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-700 text-center leading-tight">Track Progress</span>
                    </button>

                    <button
                        onClick={() => navigate('/cp-resources')}
                        className="flex-none w-28 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-700 text-center leading-tight">Resources</span>
                    </button>

                    <button
                        onClick={() => navigate('/cp-quotations')}
                        className="flex-none w-28 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-700 text-center leading-tight">Quotes</span>
                    </button>

                    <button
                        onClick={() => navigate('/cp-tutorials')}
                        className="flex-none w-28 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <PlayCircle className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-700 text-center leading-tight">Demos</span>
                    </button>

                    <button
                        onClick={() => navigate('/cp-profile')}
                        className="flex-none w-28 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Users className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-700 text-center leading-tight">My Profile</span>
                    </button>
                </div>

                {/* 4. Attention Required Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <h3 className="text-lg font-bold text-gray-900">Attention Required</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-red-200 hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-100 transition-colors">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">3 Pending Follow-ups</p>
                                    <p className="text-xs text-gray-500">Scheduled for today</p>
                                </div>
                            </div>
                            <button className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                                View
                            </button>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-amber-200 hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-100 transition-colors">
                                    <DollarSign className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">Client Payment Pending</p>
                                    <p className="text-xs text-gray-500">TechCorp Ltd - ₹25,000</p>
                                </div>
                            </div>
                            <button className="px-3 py-1.5 text-xs font-bold text-amber-600 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                                Remind
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* 5. Reward Progress (Gamification) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mt-10 -mr-10 blur-2xl"></div>

                    <div className="flex justify-between items-end mb-4 relative z-10">
                        <div>
                            <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Next Achievement</p>
                            <h3 className="text-xl font-bold">Gold Partner Status</h3>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-emerald-400">3/5</span>
                            <p className="text-xs text-gray-400">Conversions</p>
                        </div>
                    </div>

                    <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden mb-4">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '60%' }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full"
                        ></motion.div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <p>2 more conversions to unlock</p>
                        <button className="text-white font-semibold flex items-center gap-1 hover:text-emerald-300 transition-colors">
                            View Rewards <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                </motion.div>

                {/* 6. Converted Clients Snapshot */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-lg font-bold text-gray-900">Recent Conversions</h3>
                        <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All</button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Global Tech Solutions</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">Mobile App Development</p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 mb-1">
                                        PAID
                                    </span>
                                    <p className="text-xs font-medium text-gray-600">45% Complete</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* 7. Sales Team Lead Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        onClick={() => navigate('/cp-my-team')}
                        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all group"
                    >
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Your Sales Manager</p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                RS
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900">Rahul Sharma</h4>
                                <p className="text-xs text-gray-500">Senior Sales Lead</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                                    <Phone className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                    <Mail className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* 8. Latest Admin Updates */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">Latest Updates</h3>
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 leading-tight">New commission structure effective from Feb 1st</p>
                                    <p className="text-xs text-gray-400 mt-1">Today, 10:30 AM</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 leading-tight">Updated project proposal templates available</p>
                                    <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="pt-8 pb-4 text-center">
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Total Lifetime Earnings</p>
                    <h2 className="text-2xl font-bold text-gray-900">₹ 1,45,200</h2>
                    <p className="text-gray-400 text-xs mt-2">Partner since Dec 2023</p>
                </div>

            </main>

            {/* 9. Quick Actions (Fixed Bottom Bar on Mobile, Floating on Desktop) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
                <div className="grid grid-cols-4 gap-2">
                    <button
                        onClick={() => navigate('/cp-leads')}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl text-gray-500 hover:bg-gray-50 active:bg-gray-100"
                    >
                        <Plus className="w-6 h-6 text-indigo-600" />
                        <span className="text-[10px] font-medium text-indigo-600">Add Lead</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 p-2 rounded-xl text-gray-500 hover:bg-gray-50 active:bg-gray-100">
                        <Share2 className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Share</span>
                    </button>
                    <button
                        onClick={() => navigate('/cp-quotations')}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl text-gray-500 hover:bg-gray-50 active:bg-gray-100"
                    >
                        <FileText className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Quotes</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 p-2 rounded-xl text-gray-500 hover:bg-gray-50 active:bg-gray-100">
                        <PlayCircle className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Demo</span>
                    </button>
                </div>
            </div>

            {/* Desktop Floating Action Button */}
            <div className="hidden lg:flex fixed bottom-8 right-8 gap-3 z-40">
                <button
                    onClick={() => navigate('/cp-leads')}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all font-semibold"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add New Lead</span>
                </button>
            </div>

        </div>
    )
}

export default CP_dashboard
