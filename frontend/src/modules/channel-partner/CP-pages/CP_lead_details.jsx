import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiArrowLeft, FiMoreVertical, FiPhone, FiMessageCircle, FiMail,
    FiBriefcase, FiUser, FiClock, FiCheck, FiShare2, FiCalendar,
    FiDollarSign, FiActivity, FiFileText
} from 'react-icons/fi';
import CP_navbar from '../CP-components/CP_navbar';

// --- Mock Data ---
const LEAD_DATA = {
    id: '1',
    name: 'Sarah Williams',
    projectType: 'E-commerce Website',
    source: 'self',
    status: 'hot',
    phone: '+1 234 567 8900',
    email: 'sarah.williams@example.com',
    createdOn: '20 Oct, 2023',
    value: '$5,000',
    timeline: [
        { id: 1, type: 'status', status: 'Hot', date: '2 hours ago', user: 'You', note: 'Client is very interested, asked for quote.' },
        { id: 2, type: 'status', status: 'Connected', date: 'Yesterday', user: 'You', note: 'Initial call connected.' },
        { id: 3, type: 'created', status: 'New Lead', date: '20 Oct, 2023', user: 'You', note: 'Lead added manually.' }
    ]
};

// --- Components ---

const TimelineItem = ({ item, index, total }) => {
    return (
        <div className="flex gap-4 relative">
            {/* Connector Line */}
            {index !== total - 1 && (
                <div className="absolute left-[19px] top-10 bottom-[-20px] w-0.5 bg-gray-200" />
            )}

            {/* Icon/Dot */}
            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center relative z-10 
                ${item.type === 'status' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}
            >
                {item.type === 'status' ? <FiActivity /> : <FiUser />}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{item.status}</p>
                        <p className="text-xs text-gray-500">Updated by {item.user}</p>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{item.date}</span>
                </div>
                {item.note && (
                    <div className="mt-2 bg-gray-50 p-3 rounded-xl border border-gray-100 text-sm text-gray-600">
                        {item.note}
                    </div>
                )}
            </div>
        </div>
    );
};

const CP_lead_details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const lead = LEAD_DATA; // In real app, fetch by ID

    const [activeTab, setActiveTab] = useState('timeline');
    const [notes, setNotes] = useState('');
    const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
    const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F3F4F6] pb-24">
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-40 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600">
                        <FiArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="font-bold text-gray-900 text-lg leading-tight">{lead.name}</h1>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-xs font-bold border border-orange-100 uppercase tracking-wide">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            {lead.status}
                        </span>
                    </div>
                </div>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                    <FiMoreVertical className="w-5 h-5" />
                </button>
            </div>

            <div className="max-w-3xl mx-auto p-4 space-y-4">

                {/* Contact Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                            {lead.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Contact Details</p>
                            <div className="flex flex-col gap-1">
                                <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                                    <FiPhone className="w-4 h-4 text-gray-400" /> {lead.phone}
                                </a>
                                <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                                    <FiMail className="w-4 h-4 text-gray-400" /> {lead.email}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <a href={`tel:${lead.phone}`} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 text-gray-900 font-semibold text-sm hover:bg-green-50 hover:text-green-700 transition-colors border border-gray-100">
                            <FiPhone className="w-4 h-4" /> Call
                        </a>
                        <a href={`https://wa.me/${lead.phone}`} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-50 text-green-700 font-semibold text-sm hover:bg-green-100 transition-colors border border-green-100">
                            <FiMessageCircle className="w-4 h-4" /> WhatsApp
                        </a>
                    </div>
                </div>

                {/* Project Info */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-xs text-gray-400 font-bold uppercase">Project Type</p>
                        <div className="flex items-center gap-2 font-semibold text-gray-900">
                            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600"><FiBriefcase className="w-4 h-4" /></div>
                            {lead.projectType}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-gray-400 font-bold uppercase">Budget</p>
                        <div className="flex items-center gap-2 font-semibold text-gray-900">
                            <div className="p-1.5 rounded-lg bg-green-50 text-green-600"><FiDollarSign className="w-4 h-4" /></div>
                            {lead.value}
                        </div>
                    </div>
                </div>

                {/* Timeline & Notes Tabs */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab('timeline')}
                            className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'timeline' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}
                        >
                            Activity Timeline
                        </button>
                        <button
                            onClick={() => setActiveTab('notes')}
                            className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'notes' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}
                        >
                            Notes
                        </button>
                    </div>

                    <div className="p-5">
                        {activeTab === 'timeline' ? (
                            <div className="mt-2">
                                {lead.timeline.map((item, index) => (
                                    <TimelineItem key={item.id} item={item} index={index} total={lead.timeline.length} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add a private note about this lead..."
                                    className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-32 text-sm"
                                />
                                <button className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm shadow-lg hover:bg-gray-800 transition-transform active:scale-95">
                                    Save Note
                                </button>

                                <div className="mt-6">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-3">Previous Notes</p>
                                    <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-100 text-sm text-yellow-800">
                                        <p className="mb-2"><strong>You:</strong> Initial requirements gathered. They need a custom Shopify integration.</p>
                                        <p className="text-xs opacity-60">20 Oct, 2023</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* Sticky Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 px-4 z-40">
                <div className="max-w-3xl mx-auto grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setIsShareSheetOpen(true)}
                        className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gray-100 text-gray-900 font-bold text-sm hover:bg-gray-200 transition-colors"
                    >
                        <FiShare2 className="w-4 h-4" /> Share Lead
                    </button>
                    <button
                        onClick={() => setIsUpdateSheetOpen(true)}
                        className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
                    >
                        <FiCheck className="w-4 h-4" /> Update Status
                    </button>
                </div>
            </div>

            {/* Bottom Sheet Overlay */}
            <AnimatePresence>
                {(isShareSheetOpen || isUpdateSheetOpen) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => { setIsShareSheetOpen(false); setIsUpdateSheetOpen(false); }}
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50"
                    />
                )}
            </AnimatePresence>

            {/* Share Sheet */}
            <AnimatePresence>
                {isShareSheetOpen && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 md:max-w-md md:mx-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-3xl shadow-[0_-10px_40px_rgb(0,0,0,0.1)]"
                    >
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 md:hidden" />
                        <h3 className="font-bold text-xl text-gray-900 mb-4">Share with Sales Team</h3>
                        <div className="space-y-3">
                            {['Alex Johnson', 'Maria Garcia', 'Sam Smith'].map((rep, idx) => (
                                <button key={idx} onClick={() => setIsShareSheetOpen(false)} className="w-full text-left p-4 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition-colors flex justify-between items-center group">
                                    {rep}
                                    <span className="opacity-0 group-hover:opacity-100 text-sm font-bold bg-indigo-200 text-indigo-700 px-2 py-1 rounded">Select</span>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setIsShareSheetOpen(false)} className="w-full mt-4 py-3 font-bold text-gray-500">Cancel</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Update Status Sheet */}
            <AnimatePresence>
                {isUpdateSheetOpen && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 md:max-w-md md:mx-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-3xl shadow-[0_-10px_40px_rgb(0,0,0,0.1)]"
                    >
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 md:hidden" />
                        <h3 className="font-bold text-xl text-gray-900 mb-4">Update Lead Status</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {['Hot', 'Connected', 'Follow-up', 'Converted', 'Lost'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        // Update status logic here
                                        setIsUpdateSheetOpen(false);
                                    }}
                                    className={`p-4 rounded-xl font-bold text-sm border-2 transition-all ${status === lead.status
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                        : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setIsUpdateSheetOpen(false)} className="w-full mt-6 py-3 font-bold text-gray-500">Cancel</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CP_lead_details;
