import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Shield, ChevronRight, Share2, LogOut,
    Phone, Briefcase, Users, Wallet, ExternalLink,
    CheckCircle, ArrowLeft, Settings, Bell
} from 'lucide-react';
import CP_navbar from '../CP-components/CP_navbar';
import { useToast } from '../../../contexts/ToastContext';
import { logoutCP } from '../CP-services/cpAuthService';

const CP_profile = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    // Mock User Data
    const USER = {
        name: 'Iron Man',
        id: 'CP-2024-STARK',
        role: 'Titanium Partner',
        initials: 'IM',
        company: 'Stark Industries',
        stats: {
            leads: 124,
            converted: 89,
            earnings: '₹ 5.45L'
        },
        contact: {
            phone: '+91 98765 00000',
            email: 'tony@stark.com',
            website: 'stark.com'
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`https://${USER.contact.website}`);
        toast.success("Public profile link copied");
    };

    const handleLogout = async () => {
        try {
            await logoutCP();
            toast.success("Logged out successfully");
            navigate('/cp-login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-teal-500 selection:text-white">
            <CP_navbar />

            <main className="flex-1 relative overflow-x-hidden pb-28">

                {/* 1. Header - PURE TEAL Gradient Only */}
                <div className="absolute top-0 left-0 right-0 h-[320px] z-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 rounded-b-[50px] shadow-lg"></div>
                    {/* Subtle Texture - No White */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                </div>

                <div className="relative z-10 pt-24 px-6 md:pt-28 max-w-lg mx-auto">

                    {/* 2. Header Content */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center justify-between mb-8 text-white"
                    >
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-800/30 border border-teal-400/30 mb-3 shadow-sm backdrop-blur-sm">
                                <Shield className="w-3.5 h-3.5 text-teal-200 fill-teal-200" />
                                <span className="text-[10px] font-bold tracking-widest uppercase text-teal-50">Verified Partner</span>
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-white">{USER.name}</h1>
                            <p className="text-teal-100 text-sm font-medium mt-1 opacity-90">{USER.company}</p>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="w-16 h-16 rounded-2xl border-2 border-white/20 bg-teal-800/20 backdrop-blur-md flex items-center justify-center shadow-lg cursor-pointer group"
                        >
                            <span className="text-2xl font-bold text-white">{USER.initials}</span>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >
                        {/* 3. HERO IDENTITY CARD - Pure White & Black Font */}
                        <motion.div variants={itemVariants} className="relative group">
                            <div className="relative bg-white rounded-[32px] p-7 shadow-xl shadow-teal-900/10 border border-gray-100 overflow-hidden">
                                {/* Card Content */}
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start border-b border-gray-100 pb-5 mb-5">
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5">Partner ID</p>
                                            <p className="text-xl font-mono font-bold text-black tracking-tight">{USER.id}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5">Membership</p>
                                            <p className="text-lg font-bold text-teal-700">
                                                {USER.role}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-teal-600" />
                                            <span className="text-xs font-bold text-black">Active Status</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400">Valid thru 12/28</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* 4. STATS GRID - Minimalist */}
                        <div className="grid grid-cols-2 gap-4">
                            <motion.div
                                variants={itemVariants}
                                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col justify-between h-36 relative overflow-hidden active:scale-95 transition-transform"
                            >
                                <div className="w-11 h-11 rounded-full bg-gray-50 text-black flex items-center justify-center mb-2">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-black tracking-tight">{USER.stats.leads}</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Total Leads</p>
                                </div>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                onClick={() => navigate('/cp-wallet')}
                                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col justify-between h-36 relative overflow-hidden cursor-pointer active:scale-95 transition-transform"
                            >
                                <div className="absolute right-0 top-0 p-4 opacity-5">
                                    <Wallet className="w-16 h-16 text-black" />
                                </div>
                                <div className="w-11 h-11 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mb-2">
                                    <Wallet className="w-5 h-5" />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black text-black tracking-tight truncate">{USER.stats.earnings}</h3>
                                    <div className="flex items-center gap-1 mt-1 text-teal-700">
                                        <p className="text-xs font-bold uppercase tracking-wide">Earnings</p>
                                        <ChevronRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* 5. MENU ACTIONS - Simple Black Text */}
                        <motion.div variants={itemVariants} className="space-y-5 pt-2">

                            <div className="bg-white rounded-[28px] shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100">
                                {/* Contact Row */}
                                <div className="p-5 flex items-center gap-5 cursor-default">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Mobile Number</p>
                                        <p className="text-sm font-bold text-black truncate font-mono">{USER.contact.phone}</p>
                                    </div>
                                </div>

                                {/* My Team Row */}
                                <motion.div
                                    whileTap={{ backgroundColor: "#f9fafb" }}
                                    onClick={() => navigate('/cp-my-team')}
                                    className="p-5 flex items-center justify-between cursor-pointer group"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-black">Assigned Sales Team</p>
                                            <p className="text-[10px] font-medium text-gray-400 mt-0.5">Manage your POCs</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black" />
                                    </div>
                                </motion.div>

                                {/* Share Row */}
                                <motion.div
                                    whileTap={{ backgroundColor: "#f9fafb" }}
                                    onClick={handleCopyLink}
                                    className="p-5 flex items-center justify-between cursor-pointer group"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                                            <Share2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-black">Share Public Profile</p>
                                            <p className="text-[10px] font-medium text-gray-400 mt-0.5">Increase your reach</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-black" />
                                    </div>
                                </motion.div>
                            </div>

                            <motion.button
                                variants={itemVariants}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLogout}
                                className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex items-center justify-center gap-2 text-gray-500 font-bold text-sm hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all mt-4"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </motion.button>
                        </motion.div>
                    </motion.div>

                    {/* 6. MINIMAL FOOTER */}
                    <div className="mt-12 mb-6 text-center">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase font-mono">
                            Appzeto • v2.5.0
                        </span>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default CP_profile;
