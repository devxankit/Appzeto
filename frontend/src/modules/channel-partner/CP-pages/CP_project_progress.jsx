import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FiArrowLeft, FiClock, FiCheckCircle, FiAlertCircle,
    FiFileText, FiDownload, FiDollarSign, FiInfo, FiActivity,
    FiPlus, FiX, FiCalendar, FiFile
} from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
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
        total: '₹12,000',
        paid: '₹5,000',
        pending: '₹7,000',
        lastPayment: '20 Oct, 2023',
        payments: [
            {
                id: 1,
                amount: '₹3,000',
                date: '20 Oct, 2023',
                invoice: 'INV-2023-001',
                status: 'Received',
                method: 'Bank Transfer'
            },
            {
                id: 2,
                amount: '₹2,000',
                date: '15 Oct, 2023',
                invoice: 'INV-2023-002',
                status: 'Received',
                method: 'UPI'
            }
        ]
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

    const [isRecoverySheetOpen, setIsRecoverySheetOpen] = useState(false);
    const [isPaymentDetailsSheetOpen, setIsPaymentDetailsSheetOpen] = useState(false);
    const [payments, setPayments] = useState(project.payment.payments || []);
    
    const [recoveryData, setRecoveryData] = useState({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        invoice: '',
        method: 'Bank Transfer',
        notes: ''
    });

    const handleAddRecovery = () => {
        if (!recoveryData.amount || !recoveryData.date) {
            alert('Please fill in required fields');
            return;
        }

        const newPayment = {
            id: Date.now(),
            amount: `₹${recoveryData.amount}`,
            date: new Date(recoveryData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            invoice: recoveryData.invoice || `INV-${Date.now()}`,
            status: 'Received',
            method: recoveryData.method
        };

        setPayments([newPayment, ...payments]);
        
        // Update project payment totals
        const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount.replace('₹', '').replace(',', '')), 0) + parseFloat(recoveryData.amount);
        const totalAmount = parseFloat(project.payment.total.replace('₹', '').replace(',', ''));
        const pending = totalAmount - totalPaid;

        // Reset form
        setRecoveryData({
            amount: '',
            date: new Date().toISOString().split('T')[0],
            invoice: '',
            method: 'Bank Transfer',
            notes: ''
        });
        setIsRecoverySheetOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#F9F9F9] pb-20 md:pb-0 font-sans text-[#1E1E1E]">
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

            <main className="max-w-md mx-auto md:max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">

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
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
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
                    <div className="bg-amber-50 rounded-[24px] p-6 border border-amber-100">
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
                <div>
                    <h3 className="font-bold text-gray-900 mb-3 px-1">Payment Status</h3>
                    <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                    <FaRupeeSign />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Payment Status</p>
                                    <p className="text-sm font-bold text-gray-900">
                                        {project.payment.paid} <span className="text-gray-400 font-normal">/ {project.payment.total}</span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsPaymentDetailsSheetOpen(true)}
                                className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
                            >
                                View Details
                            </button>
                        </div>
                        <div className="pt-4 border-t border-gray-50">
                            <p className="text-xs text-gray-500 mb-2">Pending Amount</p>
                            <p className="text-lg font-bold text-gray-900">{project.payment.pending}</p>
                        </div>
                    </div>
                </div>

            </main>

            {/* Add Recovery FAB */}
            <motion.button
                onClick={() => setIsRecoverySheetOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-16 right-5 md:bottom-6 md:right-10 w-14 h-14 bg-green-500 text-white rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center z-40 transition-all font-semibold"
            >
                <FiPlus className="w-6 h-6" />
            </motion.button>

            {/* Add Recovery Bottom Sheet */}
            <AnimatePresence>
                {isRecoverySheetOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsRecoverySheetOpen(false)}
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
                                <h3 className="font-bold text-2xl text-gray-900 tracking-tight">Add Recovery Amount</h3>
                                <button onClick={() => setIsRecoverySheetOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-500">
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex flex-col h-full overflow-hidden">
                                <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 -mr-2 pb-4">
                                    {/* Amount */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Amount <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={recoveryData.amount}
                                                onChange={(e) => setRecoveryData({ ...recoveryData, amount: e.target.value })}
                                                placeholder="Enter amount"
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium placeholder-gray-400"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Payment Date <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="date"
                                                value={recoveryData.date}
                                                onChange={(e) => setRecoveryData({ ...recoveryData, date: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Payment Method</label>
                                        <select
                                            value={recoveryData.method}
                                            onChange={(e) => setRecoveryData({ ...recoveryData, method: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium appearance-none"
                                        >
                                            <option>Bank Transfer</option>
                                            <option>UPI</option>
                                            <option>Cash</option>
                                            <option>Cheque</option>
                                            <option>Credit Card</option>
                                        </select>
                                    </div>

                                    {/* Notes */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Notes</label>
                                        <textarea
                                            value={recoveryData.notes}
                                            onChange={(e) => setRecoveryData({ ...recoveryData, notes: e.target.value })}
                                            placeholder="Additional notes (optional)"
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium placeholder-gray-400 resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 mt-2 bg-white">
                                    <button
                                        onClick={handleAddRecovery}
                                        className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold text-lg shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95"
                                    >
                                        Add Recovery
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Payment Details Bottom Sheet */}
            <AnimatePresence>
                {isPaymentDetailsSheetOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsPaymentDetailsSheetOpen(false)}
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
                                <h3 className="font-bold text-2xl text-gray-900 tracking-tight">Payment Details</h3>
                                <button onClick={() => setIsPaymentDetailsSheetOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-500">
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex flex-col h-full overflow-hidden">
                                <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 -mr-2 pb-4">
                                    {/* Payment Summary */}
                                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium mb-1">Total Amount</p>
                                                <p className="text-lg font-bold text-gray-900">{project.payment.total}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium mb-1">Paid Amount</p>
                                                <p className="text-lg font-bold text-green-600">{project.payment.paid}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium mb-1">Pending Amount</p>
                                                <p className="text-lg font-bold text-red-600">{project.payment.pending}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium mb-1">Total Payments</p>
                                                <p className="text-lg font-bold text-gray-900">{payments.length}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment List */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold text-gray-900">Payment History</h4>
                                        {payments.length > 0 ? (
                                            payments.map((payment) => (
                                                <div key={payment.id} className="bg-white border border-gray-100 rounded-xl p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                                                <FiDollarSign className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900">{payment.amount}</p>
                                                                <p className="text-xs text-gray-500">{payment.method}</p>
                                                            </div>
                                                        </div>
                                                        <span className="px-2 py-1 rounded-lg bg-green-50 text-green-600 text-[10px] font-bold border border-green-100">
                                                            {payment.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                                        <div className="flex items-center gap-2">
                                                            <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                                                            <span className="text-xs text-gray-500">{payment.date}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FiFile className="w-3.5 h-3.5 text-gray-400" />
                                                            <span className="text-xs text-gray-500 font-medium">{payment.invoice}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <FaRupeeSign className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <p className="text-sm text-gray-500">No payments recorded yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CP_project_progress;
