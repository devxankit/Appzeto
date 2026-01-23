import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiArrowLeft, FiMoreVertical, FiPhone, FiMessageCircle, FiMail,
    FiBriefcase, FiUser, FiClock, FiCheck, FiShare2, FiCalendar,
    FiDollarSign, FiActivity, FiFileText, FiX, FiFolder
} from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
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
    value: '₹5,000',
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
    const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);

    // Convert to Client Form State
    const [conversionData, setConversionData] = useState({
        projectName: '',
        projectType: { web: false, app: false, taxi: false },
        totalCost: '',
        finishedDays: '',
        advanceReceived: '',
        includeGST: false,
        description: '',
        screenshot: null
    });

    return (
        <div className="min-h-screen bg-[#F9F9F9] pb-24 font-sans text-[#1E1E1E]">
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

            <main className="max-w-md mx-auto md:max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-8 space-y-8">

                {/* Contact Card */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
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
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 grid grid-cols-2 gap-4">
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
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
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
            </main>


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
                        <h3 className="font-bold text-xl text-gray-900 mb-4 tracking-tight">Update Lead Status</h3>
                        <div className="space-y-2">
                            {['Hot', 'Connected', 'Converted', 'Lost'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        if (status === 'Converted') {
                                            setIsUpdateSheetOpen(false);
                                            setIsConvertModalOpen(true);
                                        } else {
                                            // Update status logic here - effectively a mock update for now
                                            setIsUpdateSheetOpen(false);
                                        }
                                    }}
                                    className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${lead.status.toLowerCase() === status.toLowerCase()
                                        ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                                        : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold">{status}</span>
                                    </div>
                                    {lead.status.toLowerCase() === status.toLowerCase() && <FiCheck className="w-5 h-5 text-indigo-600" />}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setIsUpdateSheetOpen(false)} className="w-full mt-6 py-3.5 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors">Cancel</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Convert to Client Bottom Sheet */}
            <AnimatePresence>
                {isConvertModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsConvertModalOpen(false)}
                            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 md:max-w-2xl md:mx-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-3xl shadow-[0_-10px_40px_rgb(0,0,0,0.1)] max-h-[90vh] flex flex-col"
                        >
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 md:hidden" />
                            
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-2xl text-gray-900 tracking-tight">Convert to Client</h3>
                                <button onClick={() => setIsConvertModalOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-500">
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex flex-col h-full overflow-hidden">
                                <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 -mr-2 pb-4">
                                    {/* Client Name - Pre-filled, Read-only */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Client Name</label>
                                        <div className="relative">
                                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={lead.name}
                                                readOnly
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none text-gray-900 cursor-not-allowed font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Number - Pre-filled, Read-only */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number</label>
                                        <div className="relative">
                                            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={lead.phone}
                                                readOnly
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none text-gray-900 cursor-not-allowed font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* Project Name */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Project Name <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <FiFolder className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={conversionData.projectName}
                                                onChange={(e) => setConversionData({ ...conversionData, projectName: e.target.value })}
                                                placeholder="Project name"
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium placeholder-gray-400"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Finished Days */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Finished Days</label>
                                        <div className="relative">
                                            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="number"
                                                min="0"
                                                value={conversionData.finishedDays}
                                                onChange={(e) => setConversionData({ ...conversionData, finishedDays: e.target.value })}
                                                placeholder="Finished days"
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium placeholder-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Project Type */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Project Type <span className="text-red-500">*</span></label>
                                        <div className="flex flex-wrap gap-4">
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={conversionData.projectType.web}
                                                    onChange={(e) => setConversionData({
                                                        ...conversionData,
                                                        projectType: { ...conversionData.projectType, web: e.target.checked }
                                                    })}
                                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 font-medium">Web</span>
                                            </label>
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={conversionData.projectType.app}
                                                    onChange={(e) => setConversionData({
                                                        ...conversionData,
                                                        projectType: { ...conversionData.projectType, app: e.target.checked }
                                                    })}
                                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 font-medium">App</span>
                                            </label>
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={conversionData.projectType.taxi}
                                                    onChange={(e) => setConversionData({
                                                        ...conversionData,
                                                        projectType: { ...conversionData.projectType, taxi: e.target.checked }
                                                    })}
                                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 font-medium">Taxi</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Description</label>
                                        <div className="relative">
                                            <FiFileText className="absolute left-4 top-3 text-gray-400" />
                                            <textarea
                                                value={conversionData.description}
                                                onChange={(e) => setConversionData({ ...conversionData, description: e.target.value })}
                                                placeholder="Description"
                                                rows={3}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium placeholder-gray-400 resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Total Cost */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Total Cost <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={conversionData.totalCost}
                                                onChange={(e) => setConversionData({ ...conversionData, totalCost: e.target.value })}
                                                placeholder="Total cost"
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium placeholder-gray-400"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Advance Received */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Advance Received</label>
                                        <div className="relative">
                                            <FiCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={conversionData.advanceReceived}
                                                onChange={(e) => setConversionData({ ...conversionData, advanceReceived: e.target.value })}
                                                placeholder="Advance received"
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium placeholder-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Include GST */}
                                    <div className="space-y-1.5">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={conversionData.includeGST}
                                                onChange={(e) => setConversionData({ ...conversionData, includeGST: e.target.checked })}
                                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 font-medium">Include GST</span>
                                        </label>
                                    </div>

                                    {/* Upload Screenshot */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Upload Screenshot</label>
                                        <div
                                            onClick={() => document.getElementById('screenshot-upload-details').click()}
                                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
                                        >
                                            <input
                                                id="screenshot-upload-details"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setConversionData({ ...conversionData, screenshot: file });
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                            {conversionData.screenshot ? (
                                                <div className="text-sm text-gray-700 font-medium">
                                                    {conversionData.screenshot.name}
                                                </div>
                                            ) : (
                                                <div>
                                                    <FiFileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-500 font-medium">Click to upload screenshot</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 mt-2 bg-white">
                                    <button
                                        onClick={() => {
                                            // Validate required fields
                                            if (!conversionData.projectName.trim()) {
                                                alert('Please enter project name');
                                                return;
                                            }
                                            if (!conversionData.totalCost.trim() || parseFloat(conversionData.totalCost) < 0) {
                                                alert('Please enter a valid total cost');
                                                return;
                                            }
                                            if (!conversionData.projectType.web && !conversionData.projectType.app && !conversionData.projectType.taxi) {
                                                alert('Please select at least one project type');
                                                return;
                                            }

                                            // Reset form and close modal
                                            setConversionData({
                                                projectName: '',
                                                projectType: { web: false, app: false, taxi: false },
                                                totalCost: '',
                                                finishedDays: '',
                                                advanceReceived: '',
                                                includeGST: false,
                                                description: '',
                                                screenshot: null
                                            });
                                            setIsConvertModalOpen(false);
                                            
                                            // Navigate to converted clients page
                                            navigate('/cp-converted');
                                        }}
                                        className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold text-lg shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95"
                                    >
                                        Convert to Client
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CP_lead_details;
