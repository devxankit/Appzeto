import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FiArrowLeft, FiClock, FiCheckCircle, FiAlertCircle,
    FiFileText, FiDownload, FiDollarSign, FiInfo, FiActivity
} from 'react-icons/fi';
import CP_navbar from '../CP-components/CP_navbar';

// --- Mock Data ---
const PROJECT_DATA = {
    id: '1',
    projectName: 'E-commerce App Redesign',
    clientName: 'Global Tech Solutions',
    type: 'Mobile App',
    startDate: '10 Oct, 2023',
    expectedDelivery: '15 Dec, 2023',
    pmName: 'Vikram Singh',
    status: 'In Progress',
    progress: 65,
    phases: ['Discovery', 'Design', 'Dev', 'Testing', 'Delivery'],
    currentPhase: 'Dev',
    milestones: [
        { id: 1, name: 'Wireframes Approval', status: 'Completed', date: '15 Oct' },
        { id: 2, name: 'UI Design Finalization', status: 'Completed', date: '25 Oct' },
        { id: 3, name: 'Frontend Development', status: 'In Progress', date: 'Due: 20 Nov' },
        { id: 4, name: 'Backend Integration', status: 'Pending', date: 'Due: 30 Nov' },
    ],
    activities: [
        { id: 101, text: 'Frontend homepage module completed', user: 'Dev Team', time: '2 hours ago' },
        { id: 102, text: 'Client approved secondary color palette', user: 'Vikram Singh (PM)', time: 'Yesterday' },
        { id: 103, text: 'Milestone "UI Design" marked as Complete', user: 'Vikram Singh (PM)', time: '25 Oct' },
    ],
    files: [
        { id: 201, name: 'Project_Scope_v2.pdf', size: '2.4 MB', type: 'doc' },
        { id: 202, name: 'UI_Design_Preview.png', size: '5.1 MB', type: 'image' },
    ],
    payment: {
        total: '$12,000',
        paid: '$5,000',
        pending: '$7,000',
        lastPayment: '20 Oct, 2023'
    },
    adminNotes: [
        { id: 301, text: 'Waiting for client assets for the About Us page.', type: 'warning' },
        { id: 302, text: 'Project is on track for mid-December delivery.', type: 'info' }
    ]
};

const CP_project_progress = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const project = PROJECT_DATA; // Fetch by ID in real app

    return (
        <div className="min-h-screen bg-[#F3F4F6] pb-24 md:pb-0">
            {/* 1. Header (Sticky) */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-40 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600">
                        <FiArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="font-bold text-gray-900 text-sm md:text-base leading-tight">{project.projectName}</h1>
                        <p className="text-xs text-gray-500 hidden md:block">Track real-time progress</p>
                    </div>
                </div>
                <button className="p-2 text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100">
                    <FiInfo className="w-5 h-5" />
                </button>
            </div>

            <div className="max-w-3xl mx-auto p-4 space-y-6">

                {/* 2. Project Overview Card (Hero) */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="font-bold text-lg text-gray-900">{project.clientName}</h2>
                            <p className="text-sm text-gray-500 font-medium">{project.type}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${project.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            project.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-100 text-gray-600'
                            }`}>
                            {project.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase">Start Date</p>
                            <p className="font-semibold text-gray-700">{project.startDate}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase">Est. Delivery</p>
                            <p className="font-semibold text-gray-700">{project.expectedDelivery}</p>
                        </div>
                        <div className="col-span-2 pt-2 border-t border-gray-50 mt-2">
                            <p className="text-gray-400 text-xs font-bold uppercase">Project Manager</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                    {project.pmName.charAt(0)}
                                </div>
                                <span className="font-medium text-gray-700">{project.pmName}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Project Progress Bar */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-end mb-2">
                        <h3 className="font-bold text-gray-900">Progress</h3>
                        <span className="text-2xl font-bold text-indigo-600">{project.progress}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-4 relative">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-indigo-600 rounded-full"
                        />
                    </div>

                </div>

                {/* 4. Milestones Section */}
                <div>
                    <h3 className="font-bold text-gray-900 mb-3 px-1">Milestones</h3>
                    <div className="grid gap-3">
                        {project.milestones.map(ms => (
                            <div key={ms.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">{ms.name}</h4>
                                    <p className="text-xs text-gray-500">{ms.date}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${ms.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' :
                                    ms.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                        'bg-gray-50 text-gray-500 border-gray-200'
                                    }`}>
                                    {ms.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 8. Admin Notes (Pinned) */}
                {project.adminNotes.length > 0 && (
                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                        <div className="flex items-center gap-2 mb-2 text-amber-700">
                            <FiAlertCircle />
                            <h3 className="font-bold text-sm">PM Notes</h3>
                        </div>
                        <div className="space-y-2">
                            {project.adminNotes.map(note => (
                                <p key={note.id} className="text-sm text-amber-900 bg-white/50 p-2 rounded-lg border border-amber-100/50">
                                    {note.text}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. Recent Activity Timeline */}
                <div>
                    <h3 className="font-bold text-gray-900 mb-3 px-1">Recent Activity</h3>
                    <div className="bg-white rounded-2xl p-5 border border-gray-100">
                        <div className="space-y-6 relative left-2">
                            {/* Vertical Line */}
                            <div className="absolute top-2 bottom-2 left-[5px] w-0.5 bg-gray-100" />

                            {project.activities.map(act => (
                                <div key={act.id} className="flex gap-4 relative">
                                    <div className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-white ring-2 ring-indigo-50 flex-shrink-0 relative z-10" />
                                    <div>
                                        <p className="text-sm text-gray-900 font-medium">{act.text}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{act.user} • {act.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 6. Deliverables */}
                <div>
                    <h3 className="font-bold text-gray-900 mb-3 px-1">Files & Deliverables</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                        {project.files.map(file => (
                            <div key={file.id} className="flex-none w-40 bg-white p-3 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-2">
                                    <FiFileText />
                                </div>
                                <p className="text-xs font-bold text-gray-800 truncate w-full">{file.name}</p>
                                <p className="text-[10px] text-gray-400 mb-2">{file.size}</p>
                                <button className="text-[10px] font-bold text-indigo-600 border border-indigo-100 px-2 py-1 rounded hover:bg-indigo-50 flex items-center gap-1">
                                    <FiDownload /> Download
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 7. Payment Snapshot */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                            <FiDollarSign />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">Payment Status</p>
                            <p className="text-sm font-bold text-gray-900">
                                {project.payment.paid} <span className="text-gray-400 font-normal">/ {project.payment.total}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/cp-wallet')}
                        className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
                    >
                        View Details
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CP_project_progress;
