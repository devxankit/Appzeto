import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FiShare2, FiFilter, FiSearch, FiArrowRight, FiUser, 
    FiClock, FiDollarSign, FiCheck, FiX, FiPhone
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import CP_navbar from '../CP-components/CP_navbar';

// --- Mock Data ---
const SHARED_LEADS = [
    {
        id: '1',
        name: 'TechFlow Systems',
        projectType: 'Web Application',
        status: 'Connected',
        sharedWith: 'Alex Johnson',
        sharedOn: '21 Oct, 2023',
        lastUpdated: '2h ago',
        phone: '+1234567890',
        email: 'techflow@example.com',
        value: '₹15,000',
        lastUpdate: 'Client asked for proposal',
        updateTime: '2 hours ago'
    },
    {
        id: '2',
        name: 'Apex Innovations',
        projectType: 'Cloud Migration',
        status: 'Converted',
        sharedWith: 'Maria Garcia',
        sharedOn: '18 Oct, 2023',
        lastUpdated: '1d ago',
        phone: '+1987654321',
        email: 'apex@example.com',
        value: '₹22,000',
        lastUpdate: 'Proposal under review',
        updateTime: '1 day ago'
    },
    {
        id: '3',
        name: 'GreenLeaf Organics',
        projectType: 'E-commerce Store',
        status: 'Hot',
        sharedWith: 'Sam Smith',
        sharedOn: '15 Oct, 2023',
        lastUpdated: '3d ago',
        phone: '+1555666777',
        email: 'greenleaf@example.com',
        value: '₹8,500',
        lastUpdate: 'Price negotiation ongoing',
        updateTime: '3 days ago'
    },
    {
        id: '4',
        name: 'Digital Solutions',
        projectType: 'Mobile App',
        status: 'Lost',
        sharedWith: 'Alex Johnson',
        sharedOn: '10 Oct, 2023',
        lastUpdated: '1w ago',
        phone: '+1444333222',
        email: 'digital@example.com',
        value: '₹12,000',
        lastUpdate: 'Client declined',
        updateTime: '1 week ago'
    }
];

const SALES_REPS = [
    { id: 's1', name: 'Alex Johnson', role: 'Senior Sales' },
    { id: 's2', name: 'Maria Garcia', role: 'Sales Lead' },
    { id: 's3', name: 'Sam Smith', role: 'Sales Associate' }
];

// --- Components ---
const StatusBadge = ({ status }) => {
    const styles = {
        'Hot': 'bg-red-50 text-red-600 border-red-100',
        'Connected': 'bg-blue-50 text-blue-600 border-blue-100',
        'Converted': 'bg-green-50 text-green-600 border-green-100',
        'Lost': 'bg-gray-50 text-gray-500 border-gray-100',
        'default': 'bg-gray-50 text-gray-600 border-gray-100'
    };

    const currentStyle = styles[status] || styles['default'];

    return (
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${currentStyle} flex items-center gap-1`}>
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'Hot' ? 'bg-red-500 animate-pulse' : 'bg-current'}`} />
            {status}
        </span>
    );
};

const SharedLeadCard = ({ lead, onNavigate }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onNavigate(lead.id)}
            className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all relative group cursor-pointer"
        >
            {/* Header Section */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        {lead.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-base leading-tight">{lead.name}</h3>
                        <p className="text-xs text-gray-500 font-medium">{lead.projectType}</p>
                    </div>
                </div>
                <StatusBadge status={lead.status} />
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4 bg-gray-50/50 p-3 rounded-xl border border-gray-50">
                <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-gray-700">{lead.value || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <FiClock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">Updated {lead.lastUpdated}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span className="text-xs text-gray-500">
                        Shared with: <span className="font-medium text-gray-700">{lead.sharedWith}</span>
                    </span>
                </div>
            </div>

            {/* Last Update Info */}
            {lead.lastUpdate && (
                <div className="mb-4 pb-4 border-b border-gray-50">
                    <p className="text-xs text-gray-500 mb-1">Last Update</p>
                    <p className="text-sm font-medium text-gray-700">{lead.lastUpdate}</p>
                    <p className="text-xs text-gray-400 mt-1">{lead.updateTime}</p>
                </div>
            )}

            {/* Read-only Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <div className="flex gap-1">
                    <a 
                        href={`tel:${lead.phone}`} 
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                    >
                        <FiPhone className="w-4 h-4" />
                    </a>
                    <a 
                        href={`https://wa.me/${lead.phone}`} 
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                    >
                        <FaWhatsapp className="w-4 h-4" />
                    </a>
                </div>
                <div className="text-xs text-gray-400 font-medium">
                    View Progress <FiArrowRight className="w-3 h-3 inline ml-1" />
                </div>
            </div>
        </motion.div>
    );
};

const CP_shared_leads = () => {
    const navigate = useNavigate();
    const [showFilters, setShowFilters] = useState(false);
    const [leads, setLeads] = useState(SHARED_LEADS);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [timeFilter, setTimeFilter] = useState('all-time');

    const TABS = [
        { id: 'all', label: 'All', count: leads.length },
        { id: 'hot', label: 'Hot', count: leads.filter(l => l.status === 'Hot').length },
        { id: 'connected', label: 'Connected', count: leads.filter(l => l.status === 'Connected').length },
        { id: 'converted', label: 'Converted', count: leads.filter(l => l.status === 'Converted').length },
        { id: 'lost', label: 'Lost', count: leads.filter(l => l.status === 'Lost').length },
        { id: 'active', label: 'Active', count: leads.filter(l => l.status !== 'Converted' && l.status !== 'Lost').length },
    ];

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.projectType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.sharedWith.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            // Time Filter Logic
            let matchesTime = true;
            if (timeFilter !== 'all-time') {
                const timeStr = lead.lastUpdated;
                if (timeFilter === 'yesterday') {
                    matchesTime = timeStr.includes('1d ago');
                } else if (timeFilter === 'this-week') {
                    matchesTime = timeStr.includes('m ago') || timeStr.includes('h ago') || (timeStr.includes('d ago') && parseInt(timeStr) < 7);
                } else if (timeFilter === 'last-30-days') {
                    matchesTime = !timeStr.includes('mo ago') && !timeStr.includes('y ago');
                }
            }
            if (!matchesTime) return false;

            if (activeTab === 'all') return true;
            if (activeTab === 'hot') return lead.status === 'Hot';
            if (activeTab === 'connected') return lead.status === 'Connected';
            if (activeTab === 'converted') return lead.status === 'Converted';
            if (activeTab === 'lost') return lead.status === 'Lost';
            if (activeTab === 'active') return lead.status !== 'Converted' && lead.status !== 'Lost';
            return true;
        });
    }, [leads, activeTab, searchQuery, timeFilter]);

    return (
        <div className="min-h-screen bg-[#F9F9F9] pb-24 md:pb-0 font-sans text-[#1E1E1E]">
            <CP_navbar />

            <main className="max-w-md mx-auto md:max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-8 space-y-8">
                {/* Search Bar with Filter */}
                <div className="mb-4 relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, project, or sales rep..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-11 pr-12 py-3.5 bg-white border border-gray-100 rounded-[24px] text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`absolute inset-y-0 right-0 pr-4 pl-3 flex items-center transition-colors ${showFilters ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <FiFilter className="w-5 h-5" />
                    </button>
                </div>

                {/* Collapsible Filters */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-6"
                        >
                            <div className="p-6 bg-white rounded-[24px] shadow-sm border border-gray-100">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 block">Timeframe</label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { id: 'all-time', label: 'All Time' },
                                        { id: 'yesterday', label: 'Yesterday' },
                                        { id: 'this-week', label: 'This Week' },
                                        { id: 'last-30-days', label: 'Last 30 Days' },
                                    ].map((tf) => (
                                        <button
                                            key={tf.id}
                                            onClick={() => setTimeFilter(tf.id)}
                                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${timeFilter === tf.id
                                                ? 'bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm'
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {tf.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Animated Tabs */}
                <div className="flex overflow-x-auto pb-6 gap-3 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${activeTab === tab.id
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-white text-gray-500 border border-gray-100'
                                }`}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-blue-400 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Shared Lead Cards */}
                <AnimatePresence mode='popLayout'>
                    <div className="space-y-4">
                        {filteredLeads.length > 0 ? (
                            filteredLeads.map((lead) => (
                                <SharedLeadCard
                                    key={lead.id}
                                    lead={lead}
                                    onNavigate={(id) => navigate(`/cp-lead-details/${id}`)}
                                />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16"
                            >
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-sm">
                                    🤝
                                </div>
                                <h3 className="text-gray-900 font-bold mb-1">No shared leads found</h3>
                                <p className="text-gray-500 text-sm mb-6">Clear filters or share leads with sales team first!</p>
                                <button onClick={() => navigate('/cp-leads')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-700 transition-colors">
                                    Go to Leads
                                </button>
                            </motion.div>
                        )}
                    </div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default CP_shared_leads;
