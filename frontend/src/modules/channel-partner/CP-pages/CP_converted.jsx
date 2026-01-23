import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FiBriefcase, FiCheckCircle, FiClock, FiDollarSign, FiFilter,
    FiMoreVertical, FiPieChart, FiSearch, FiTrendingUp, FiArrowRight
} from 'react-icons/fi';
import CP_navbar from '../CP-components/CP_navbar';

// --- Mock Data ---
const CONVERTED_CLIENTS = [
    {
        id: 1,
        name: 'Global Tech Solutions',
        projectType: 'Mobile App Development',
        status: 'In Progress', // Planning, In Progress, Completed
        progress: 45,
        totalValue: '₹12,000',
        paidAmount: '₹5,000',
        pendingAmount: '₹7,000',
        paymentStatus: 'Partial Paid', // Fully Paid, Partial Paid, Payment Pending
        lastPayment: '20 Oct, 2023',
        commissionEarned: '₹1,200',
        commissionStatus: 'Credited'
    },
    {
        id: 2,
        name: 'Urban Cafe Chain',
        projectType: 'Website Redesign',
        status: 'Unpaid',
        progress: 100,
        totalValue: '₹3,500',
        paidAmount: '₹3,500',
        pendingAmount: '₹0',
        paymentStatus: 'Fully Paid',
        lastPayment: '15 Oct, 2023',
        commissionEarned: '₹350',
        commissionStatus: 'Credited'
    },
    {
        id: 3,
        name: 'Nexus Logistics',
        projectType: 'CRM Implementation',
        status: 'Planning',
        progress: 10,
        totalValue: '₹25,000',
        paidAmount: '₹0',
        pendingAmount: '₹25,000',
        paymentStatus: 'Payment Pending',
        lastPayment: '—',
        nextExpected: '25 Oct, 2023',
        commissionEarned: '₹2,500',
        commissionStatus: 'Pending'
    }
];

const CP_converted = () => {
    const navigate = useNavigate();
    const [showFilters, setShowFilters] = useState(false);
    const [clients, setClients] = useState(CONVERTED_CLIENTS);

    // Insight Data
    const insights = {
        totalConverted: clients.length,
        totalValue: '₹40,500',
        pendingAmount: '₹32,000',
        commissionEarned: '₹4,050'
    };

    return (
        <div className="min-h-screen bg-[#F9F9F9] pb-24 md:pb-0 font-sans text-[#1E1E1E]">
            <CP_navbar />

            <main className="max-w-md mx-auto md:max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-8 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Converted Clients</h1>
                        <p className="text-sm text-gray-500">Track project progress & payments</p>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2.5 rounded-xl border transition-all ${showFilters ? 'bg-white border-indigo-200 text-indigo-600 shadow-sm' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        <FiFilter className="w-5 h-5" />
                    </button>
                </div>

                {/* 1. Summary Insight Bar (Horizontal Scroll) */}
                <div className="flex overflow-x-auto gap-4 hide-scrollbar pb-2 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex-none w-40 bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-indigo-600">
                            <FiCheckCircle />
                            <span className="text-xs font-bold uppercase">Converted</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{insights.totalConverted}</p>
                    </div>
                    <div className="flex-none w-40 bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-blue-600">
                            <FiBriefcase />
                            <span className="text-xs font-bold uppercase">Project Value</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{insights.totalValue}</p>
                    </div>
                    <div className="flex-none w-40 bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-orange-600">
                            <FiClock />
                            <span className="text-xs font-bold uppercase">Pending</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{insights.pendingAmount}</p>
                    </div>
                    <div className="flex-none w-40 bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-green-600">
                            <FiDollarSign />
                            <span className="text-xs font-bold uppercase">Commission</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{insights.commissionEarned}</p>
                    </div>
                </div>

                {/* 2. Collapsible Filters */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-6"
                        >
                            <div className="p-6 bg-white rounded-[24px] shadow-sm border border-gray-100 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Project Status</label>
                                    <select className="w-full p-2 bg-gray-50 rounded-lg text-sm border-none focus:ring-0">
                                        <option>All Projects</option>
                                        <option>Planning</option>
                                        <option>In Progress</option>
                                        <option>Delivered</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Payment Status</label>
                                    <select className="w-full p-2 bg-gray-50 rounded-lg text-sm border-none focus:ring-0">
                                        <option>All Payments</option>
                                        <option>Fully Paid</option>
                                        <option>Partial Paid</option>
                                        <option>Pending</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 3. Converted Client Cards */}
                <div className="space-y-4">
                    {clients.length > 0 ? (
                        clients.map((client) => (
                            <motion.div
                                key={client.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all cursor-pointer"
                                onClick={() => navigate(`/cp-project-progress/${client.id}`)}
                            >
                                {/* Top Row: Name & Status */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{client.name}</h3>
                                        <p className="text-xs text-gray-500 font-medium">{client.projectType}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${client.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                        client.status === 'Planning' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                            'bg-green-50 text-green-600 border-green-100'
                                        }`}>
                                        {client.status === 'Unpaid' ? 'Completed' : client.status}
                                    </span>
                                </div>

                                {/* Middle: Value & Payment Split */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="p-3 bg-gray-50 rounded-xl">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Total Value</p>
                                        <p className="text-sm font-bold text-gray-900">{client.totalValue}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-xl">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">
                                            {client.paymentStatus === 'Payment Pending' ? 'Pending Amount' : 'Paid Amount'}
                                        </p>
                                        <p className={`text-sm font-bold ${client.paymentStatus === 'Payment Pending' ? 'text-red-600' : 'text-green-600'
                                            }`}>
                                            {client.paymentStatus === 'Payment Pending' ? client.pendingAmount : client.paidAmount}
                                        </p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                                        <span className="text-gray-500">Project Completion</span>
                                        <span className="text-indigo-600">{client.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${client.progress}%` }}
                                            transition={{ duration: 1 }}
                                            className="h-full bg-indigo-600 rounded-full"
                                        />
                                    </div>
                                </div>

                                {/* Footer: Commission & Payment Status */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div
                                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg -ml-2 transition-colors"
                                        onClick={(e) => { e.stopPropagation(); navigate('/cp-wallet'); }}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${client.commissionStatus === 'Credited' ? 'bg-green-500' : 'bg-orange-500'}`} />
                                        <span className="text-xs text-gray-500">
                                            Commission: <span className="font-bold text-gray-700">{client.commissionEarned}</span>
                                        </span>
                                    </div>

                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${client.paymentStatus === 'Payment Pending' ? 'bg-red-50 text-red-600 border-red-100' :
                                        client.paymentStatus === 'Partial Paid' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                            'bg-green-50 text-green-600 border-green-100'
                                        }`}>
                                        {client.paymentStatus}
                                        {client.paymentStatus === 'Payment Pending' && <FiClock className="w-3 h-3" />}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        // Empty State
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-sm">
                                🚀
                            </div>
                            <h3 className="text-gray-900 font-bold mb-1">No conversions yet</h3>
                            <p className="text-gray-500 text-sm mb-6">Your first success is coming!</p>
                            <button onClick={() => navigate('/cp-leads')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-700 transition-colors">
                                Go to Leads
                            </button>
                        </div>
                    )}
                </div>

                {/* Sticky Bottom Actions (Condition: Pending Payments Exist) */}
                {insights.pendingAmount !== '$0' && (
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
                        <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-50 text-red-700 font-bold text-sm border border-red-100 hover:bg-red-100 transition-colors">
                            View Pending Payments <FiArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CP_converted;
