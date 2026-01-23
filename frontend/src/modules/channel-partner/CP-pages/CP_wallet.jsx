import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiDollarSign, FiClock, FiCreditCard, FiArrowUpRight,
    FiArrowDownLeft, FiFilter, FiDownload, FiAlertCircle
} from 'react-icons/fi';
import CP_navbar from '../CP-components/CP_navbar';

// --- Mock Data ---
const WALLET_DATA = {
    balance: '₹2,450.00',
    pending: '₹850.00',
    lifetime: '₹15,200.00',
    transactions: [
        { id: 1, type: 'credit', amount: '+₹500.00', source: 'Commission - TechSolutions', date: 'Today, 10:30 AM', status: 'Completed' },
        { id: 2, type: 'credit', amount: '+₹150.00', source: 'Reward - Silver Badge', date: 'Yesterday', status: 'Completed' },
        { id: 3, type: 'pending', amount: '+₹350.00', source: 'Commission - Green Energy', date: '20 Oct', status: 'Pending' },
        { id: 4, type: 'debit', amount: '-₹1,000.00', source: 'Withdrawal to Bank', date: '15 Oct', status: 'Completed' },
    ],
    dues: [
        { id: 101, client: 'Local Bistro', amount: '₹200.00', dueDate: '25 Oct', status: 'Overdue' }
    ]
};

// --- Components ---

const TransactionItem = ({ item }) => {
    const isCredit = item.type === 'credit' || item.type === 'pending';

    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm mb-3">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'debit' ? 'bg-red-50 text-red-600' :
                    item.type === 'pending' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                    }`}>
                    {item.type === 'debit' ? <FiArrowUpRight /> : isCredit ? <FiArrowDownLeft /> : <FiClock />}
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">{item.source}</h4>
                    <p className="text-xs text-gray-500">{item.date} • {item.status}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`font-bold ${item.type === 'debit' ? 'text-gray-900' : 'text-green-600'}`}>
                    {item.amount}
                </p>
                {item.type === 'pending' && <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold">PENDING</span>}
            </div>
        </div>
    );
};

const CP_wallet = () => {
    const [activeTab, setActiveTab] = useState('transactions');

    return (
        <div className="min-h-screen bg-[#F9F9F9] pb-24 md:pb-0 font-sans text-[#1E1E1E]">
            <CP_navbar />

            <main className="max-w-md mx-auto md:max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-8 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
                    <button className="p-2 text-indigo-600 bg-indigo-50 rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-indigo-100 transition-colors">
                        <FiDownload /> Statement
                    </button>
                </div>

                {/* Hero Card */}
                <div className="bg-gradient-to-br from-[#1E1E1E] via-gray-900 to-gray-800 rounded-[28px] p-6 text-white shadow-xl shadow-indigo-900/10 mb-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <FiCreditCard className="w-48 h-48" />
                    </div>

                    <div className="relative z-10">
                        <p className="text-indigo-200 text-sm font-medium mb-1">Available Balance</p>
                        <h2 className="text-4xl font-bold mb-6">{WALLET_DATA.balance}</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                                <div className="flex items-center gap-2 mb-1 text-orange-300">
                                    <FiClock className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wide">Pending</span>
                                </div>
                                <p className="font-bold text-lg">{WALLET_DATA.pending}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                                <div className="flex items-center gap-2 mb-1 text-green-300">
                                    <FiDollarSign className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wide">Lifetime</span>
                                </div>
                                <p className="font-bold text-lg">{WALLET_DATA.lifetime}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Note: In a real app, logic for withdrawal/bank linking would go here */}

                {/* Dues Alert Section */}
                {WALLET_DATA.dues.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <FiAlertCircle className="text-red-500" />
                            <h3 className="font-bold text-gray-800">Pending Dues</h3>
                        </div>
                        {WALLET_DATA.dues.map(due => (
                            <div key={due.id} className="bg-red-50 border border-red-100 p-6 rounded-[24px] flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-red-900">{due.client}</p>
                                    <p className="text-xs text-red-600">Due by {due.dueDate}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-red-700">{due.amount}</p>
                                    <button className="text-xs font-bold bg-white text-red-600 px-3 py-1.5 rounded-lg border border-red-100 shadow-sm mt-1 hover:bg-red-50">
                                        Pay Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'transactions' ? 'text-indigo-600' : 'text-gray-400'}`}
                    >
                        Transactions
                        {activeTab === 'transactions' && <motion.div layoutId="activeTabWallet" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('earnings')}
                        className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'earnings' ? 'text-indigo-600' : 'text-gray-400'}`}
                    >
                        Earnings Analysis
                        {activeTab === 'earnings' && <motion.div layoutId="activeTabWallet" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
                    </button>
                </div>

                {/* Content */}
                <AnimatePresence mode='wait'>
                    {activeTab === 'transactions' ? (
                        <motion.div
                            key="transactions"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-700">Recent Activity</h3>
                                <button className="p-2 text-gray-400 hover:text-gray-600"><FiFilter /></button>
                            </div>

                            <div>
                                {WALLET_DATA.transactions.map(item => (
                                    <TransactionItem key={item.id} item={item} />
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="earnings"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center py-12"
                        >
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-50 text-2xl">
                                📊
                            </div>
                            <p className="text-gray-500 text-sm font-medium">Detailed charts coming soon.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default CP_wallet;
