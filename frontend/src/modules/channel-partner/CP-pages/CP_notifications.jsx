import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Bell, Check, Trash2,
    TrendingUp, CreditCard, Award, Megaphone,
    Clock, ChevronRight, AlertCircle
} from 'lucide-react';
import CP_navbar from '../CP-components/CP_navbar';

// --- Mock Data ---
const NOTIFICATIONS = [
    {
        id: 'n1',
        type: 'payment',
        title: 'Payment Pending',
        message: 'Invoice #inv-2024-001 for TechCorp is pending. Amount: ₹25,000',
        time: '2 hours ago',
        isRead: false,
        isPinned: true,
        path: '/cp-wallet' // Deep link
    },
    {
        id: 'n2',
        type: 'lead',
        title: 'New Lead Assigned',
        message: 'A new lead "Green Valley Hospital" has been assigned to you.',
        time: '5 hours ago',
        isRead: false,
        isPinned: false,
        path: '/cp-leads'
    },
    {
        id: 'n3',
        type: 'admin',
        title: 'System Maintenance',
        message: 'Dashboard will be down for maintenance on 24th Jan, 2 AM - 4 AM.',
        time: 'Yesterday',
        isRead: true,
        isPinned: false,
        path: '/cp-notice-board'
    },
    {
        id: 'n4',
        type: 'reward',
        title: 'Reward Unlocked!',
        message: 'Congratulations! You have unlocked "Silver Partner" badge.',
        time: '2 days ago',
        isRead: true,
        isPinned: false,
        path: '/cp-rewards'
    },
    {
        id: 'n5',
        type: 'lead',
        title: 'Follow-up Reminder',
        message: 'Call with Mr. Rajesh (Sunrise Schools) is scheduled for today at 4 PM.',
        time: 'Today, 9:00 AM',
        isRead: false,
        isPinned: true,
        path: '/cp-leads'
    }
];

const TABS = [
    { id: 'all', label: 'All' },
    { id: 'lead', label: 'Leads' },
    { id: 'payment', label: 'Payments' },
    { id: 'reward', label: 'Rewards' },
    { id: 'admin', label: 'Admin' }
];

const CP_notifications = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const [notifications, setNotifications] = useState(NOTIFICATIONS);

    const filteredNotifications = notifications.filter(n => {
        if (activeTab === 'all') return true;
        return n.type === activeTab;
    }).sort((a, b) => (b.isPinned === a.isPinned ? 0 : b.isPinned ? 1 : -1)); // Pinned first

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const handleNotificationClick = (id, path) => {
        // Mark as read
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        // Navigate
        if (path) navigate(path);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'lead': return <TrendingUp className="w-5 h-5 text-blue-600" />;
            case 'payment': return <CreditCard className="w-5 h-5 text-emerald-600" />;
            case 'reward': return <Award className="w-5 h-5 text-amber-600" />;
            case 'admin': return <Megaphone className="w-5 h-5 text-purple-600" />;
            default: return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'lead': return 'bg-blue-100';
            case 'payment': return 'bg-emerald-100';
            case 'reward': return 'bg-amber-100';
            case 'admin': return 'bg-purple-100';
            default: return 'bg-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F9F9] pb-20 font-sans text-[#1E1E1E]">
            <CP_navbar />

            {/* Sticky Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-xl mx-auto px-4 py-3 pt-14 md:pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 leading-tight">Notifications</h1>
                            {unreadCount > 0 && (
                                <p className="text-xs text-indigo-600 font-semibold">{unreadCount} unread updates</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={markAllRead}
                        className="text-xs font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                    >
                        <Check className="w-4 h-4" /> Mark All Read
                    </button>
                </div>

                {/* Tabs */}
                <div className="max-w-xl mx-auto px-4 pb-0 overflow-hidden">
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar py-3">
                        {TABS.map(tab => {
                            const count = notifications.filter(n => !n.isRead && (tab.id === 'all' || n.type === tab.id)).length;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-none px-4 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-2 ${activeTab === tab.id
                                            ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                                            : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab.label}
                                    {count > 0 && (
                                        <span className={`w-1.5 h-1.5 rounded-full ${activeTab === tab.id ? 'bg-red-400' : 'bg-red-500'}`}></span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <main className="max-w-xl mx-auto px-4 py-4 space-y-3">
                <AnimatePresence mode='popLayout'>
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map(notification => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification.id, notification.path)}
                                className={`relative p-6 rounded-[24px] border border-gray-100 shadow-sm transition-all cursor-pointer group ${notification.isRead
                                        ? 'bg-white border-gray-100'
                                        : 'bg-white border-indigo-100 shadow-md shadow-indigo-100/50'
                                    }`}
                            >
                                {/* Pinned Indicator */}
                                {notification.isPinned && !notification.isRead && (
                                    <div className="absolute top-0 right-0 p-3">
                                        <AlertCircle className="w-4 h-4 text-red-500 fill-red-50" />
                                    </div>
                                )}
                                {!notification.isRead && !notification.isPinned && (
                                    <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-500 rounded-full"></div>
                                )}

                                <div className="flex gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getBgColor(notification.type)}`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 pr-4">
                                        <h3 className={`text-sm font-bold mb-1 leading-tight ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                                            {notification.title}
                                        </h3>
                                        <p className={`text-xs leading-relaxed line-clamp-2 ${notification.isRead ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {notification.message}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-medium mt-2 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {notification.time}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-sm border border-gray-100">
                                🎉
                            </div>
                            <h3 className="text-gray-900 font-bold mb-1">You're all caught up!</h3>
                            <p className="text-gray-500 text-sm">No new notifications for now.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default CP_notifications;
