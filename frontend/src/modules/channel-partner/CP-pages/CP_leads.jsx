import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch, FiFilter, FiPlus, FiPhone, FiMessageCircle,
  FiShare2, FiMoreVertical, FiCalendar, FiClock, FiCheck,
  FiX, FiUser, FiBriefcase, FiDollarSign, FiArrowRight
} from 'react-icons/fi';
import CP_navbar from '../CP-components/CP_navbar';

// --- Mock Data ---
const MOCK_LEADS = [
  {
    id: '1',
    name: 'Sarah Williams',
    projectType: 'E-commerce Website',
    source: 'self',
    status: 'Hot',
    lastUpdated: '2h ago',
    phone: '+1234567890',
    email: 'sarah@example.com',
    value: '$5,000'
  },
  {
    id: '2',
    name: 'TechSolutions Inc',
    projectType: 'Mobile App',
    source: 'sales',
    status: 'Connected',
    lastUpdated: '1d ago',
    phone: '+1987654321',
    email: 'contact@techsolutions.com',
    value: '$12,000',
    assignedSales: 'Alex Johnson'
  },
  {
    id: '3',
    name: 'David Brown',
    projectType: 'Portfolio',
    source: 'self',
    status: 'Follow-up',
    lastUpdated: '30m ago',
    phone: '+1122334455',
    email: 'david@example.com',
    value: '$2,500'
  },
  {
    id: '4',
    name: 'Green Energy Co',
    projectType: 'CRM System',
    source: 'shared',
    status: 'Shared',
    lastUpdated: '3d ago',
    phone: '+1555666777',
    email: 'info@greenenergy.com',
    value: '$20,000',
    assignedSales: 'Maria Garcia',
    sharedWith: 'Maria Garcia'
  },
  {
    id: '5',
    name: 'Local Bistro',
    projectType: 'Landing Page',
    source: 'self',
    status: 'Converted',
    lastUpdated: '1w ago',
    phone: '+1444333222',
    email: 'bistro@local.com',
    value: '$1,500'
  },
  {
    id: '6',
    name: 'Startup Hub',
    projectType: 'SaaS Platform',
    source: 'sales',
    status: 'Lost',
    lastUpdated: '2w ago',
    phone: '+1999888777',
    email: 'hello@startuphub.com',
    value: '$15,000',
    assignedSales: 'Alex Johnson'
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
    'Follow-up': 'bg-amber-50 text-amber-600 border-amber-100',
    'Converted': 'bg-green-50 text-green-600 border-green-100',
    'Shared': 'bg-purple-50 text-purple-600 border-purple-100',
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

const LeadCard = ({ lead, onAction, onNavigate }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onNavigate(lead.id)}
      className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_24px_rgb(0,0,0,0.08)] transition-all relative group cursor-pointer"
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${lead.source === 'self' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-gradient-to-br from-orange-400 to-red-500 text-white'}`}>
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
          <FiDollarSign className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-semibold text-gray-700">{lead.value || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FiClock className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-500">Updated {lead.lastUpdated}</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <span className="text-xs text-gray-500">
            Source: <span className="font-medium text-gray-700">{lead.source === 'self' ? 'My Lead' : 'Sales Team'}</span>
          </span>
        </div>
      </div>

      {/* Action Footer - Minimalist */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex gap-1">
          <a href={`tel:${lead.phone}`} className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors">
            <FiPhone className="w-4 h-4" />
          </a>
          <a href={`https://wa.me/${lead.phone}`} className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors">
            <FiMessageCircle className="w-4 h-4" />
          </a>
          <button onClick={(e) => { e.stopPropagation(); onAction('share', lead); }} className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <FiShare2 className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onAction('update', lead); }}
          className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all"
        >
          Update Status <FiArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

// --- Main Page Component ---

const CP_leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Modal Interaction States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false); // Bottom Sheet State

  const [selectedLead, setSelectedLead] = useState(null);

  // New Lead Form State
  // New Lead Form State
  const [newLead, setNewLead] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    projectType: 'Web Development',
    budget: '',
    priority: 'Medium',
    notes: ''
  });

  // Filters logic (Same as before)
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.projectType.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (activeTab === 'all') return true;
      if (activeTab === 'my-leads') return lead.source === 'self';
      if (activeTab === 'sales') return lead.source === 'sales';
      if (activeTab === 'shared') return lead.status === 'Shared' || lead.source === 'shared';
      if (activeTab === 'converted') return lead.status === 'Converted';
      if (activeTab === 'lost') return lead.status === 'Lost';
      return true;
    });
  }, [leads, activeTab, searchQuery]);

  const handleAction = (type, lead) => {
    setSelectedLead(lead);
    if (type === 'share') setIsShareModalOpen(true);
    if (type === 'update') setIsUpdateModalOpen(true);
  };

  const handleUpdateStatus = (newStatus) => {
    if (!selectedLead) return;
    setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: newStatus, lastUpdated: 'Just now' } : l));
    setIsUpdateModalOpen(false);
    setSelectedLead(null);
  };

  const handleShareLead = (salesRepId) => {
    if (!selectedLead) return;
    setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: 'Shared', sharedWith: SALES_REPS.find(s => s.id === salesRepId)?.name, lastUpdated: 'Just now' } : l));
    setIsShareModalOpen(false);
    setSelectedLead(null);
  };

  const handleAddLead = (e) => {
    e.preventDefault();
    if (!newLead.name || !newLead.phone) return;

    const lead = {
      id: Date.now().toString(),
      ...newLead,
      source: 'self',
      status: 'Hot',
      lastUpdated: 'Just now',
      value: newLead.budget ? `$${newLead.budget}` : 'Pending'
    };
    setLeads([lead, ...leads]);
    setIsAddSheetOpen(false);
    setNewLead({
      name: '',
      businessName: '',
      phone: '',
      email: '',
      projectType: 'Web Development',
      budget: '',
      priority: 'Medium',
      notes: ''
    });
  };

  const TABS = [
    { id: 'all', label: 'All', count: leads.length },
    { id: 'my-leads', label: 'My Leads', count: leads.filter(l => l.source === 'self').length },
    { id: 'sales', label: 'Sales', count: leads.filter(l => l.source === 'sales').length },
    { id: 'shared', label: 'Shared', count: leads.filter(l => l.status === 'Shared').length },
    { id: 'converted', label: 'Converted', count: leads.filter(l => l.status === 'Converted').length },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-24 md:pb-0">
      <CP_navbar />

      <div className="max-w-4xl mx-auto pt-20 px-4 md:px-8">
        {/* Modern Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Leads</h1>
            <p className="text-sm text-gray-500 font-medium">{filteredLeads.length} active opportunities</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border transition-all ${showFilters ? 'bg-white border-indigo-200 text-indigo-600 shadow-sm' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <FiFilter className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by name or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-3.5 bg-white border-none rounded-2xl text-gray-900 shadow-[0_2px_15px_rgb(0,0,0,0.03)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
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
              <div className="p-4 bg-white rounded-2xl shadow-sm grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Timeframe</label>
                  <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl text-sm text-gray-700 font-medium border border-gray-100">
                    <FiCalendar className="text-indigo-500" /> <span>Last 30 Days</span>
                  </div>
                </div>
                {/* Add more filters as needed */}
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
                ? 'bg-gray-900 text-white shadow-lg shadow-gray-200'
                : 'bg-white text-gray-500 border border-gray-100'
                }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-500'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Leads List */}
        <AnimatePresence mode='popLayout'>
          <div className="space-y-4">
            {filteredLeads.length > 0 ? (
              filteredLeads.map(lead => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onAction={handleAction}
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
                  📪
                </div>
                <h3 className="text-gray-900 font-bold mb-1">No leads found</h3>
                <p className="text-gray-500 text-sm">Clear filters or create a new lead.</p>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </div>

      {/* Bottom Sheet Overlay */}
      <AnimatePresence>
        {isAddSheetOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddSheetOpen(false)}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* Bottom Sheet Content */}
      <AnimatePresence>
        {isAddSheetOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 md:max-w-2xl md:mx-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-3xl shadow-[0_-10px_40px_rgb(0,0,0,0.1)] max-h-[90vh] flex flex-col"
          >
            {/* Drag Handle for mobile vibe */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 md:hidden" />

            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-2xl text-gray-900 tracking-tight">New Lead</h3>
              <button onClick={() => setIsAddSheetOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-500"><FiX /></button>
            </div>

            <form onSubmit={handleAddLead} className="flex flex-col h-full overflow-hidden">
              <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 -mr-2 pb-4">

                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Contact Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text" required
                        value={newLead.name}
                        onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium placeholder-gray-400"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Business Name</label>
                    <div className="relative">
                      <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={newLead.businessName}
                        onChange={e => setNewLead({ ...newLead, businessName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium placeholder-gray-400"
                        placeholder="e.g. Acme Corp"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel" required
                        value={newLead.phone}
                        onChange={e => setNewLead({ ...newLead, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium placeholder-gray-400"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
                    <div className="relative">
                      <FiMessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={newLead.email}
                        onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium placeholder-gray-400"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Project Type</label>
                    <select
                      value={newLead.projectType}
                      onChange={e => setNewLead({ ...newLead, projectType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium appearance-none"
                    >
                      <option>Web Development</option>
                      <option>Mobile App</option>
                      <option>Digital Marketing</option>
                      <option>Custom Software</option>
                      <option>Consulting</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Budget Range</label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={newLead.budget}
                        onChange={e => setNewLead({ ...newLead, budget: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium placeholder-gray-400"
                        placeholder="e.g. 5,000 - 10,000"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Priority</label>
                  <div className="flex gap-2">
                    {['High', 'Medium', 'Low'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewLead({ ...newLead, priority: p })}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${newLead.priority === p
                            ? (p === 'High' ? 'bg-red-50 border-red-200 text-red-600 shadow-sm' : p === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-sm' : 'bg-green-50 border-green-200 text-green-600 shadow-sm')
                            : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Notes / Requirements</label>
                  <textarea
                    rows="3"
                    value={newLead.notes}
                    onChange={e => setNewLead({ ...newLead, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium placeholder-gray-400 resize-none"
                    placeholder="Enter any specific requirements or details..."
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-2 bg-white">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold text-lg shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95"
                >
                  Create New Lead
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium FAB - Positioned higher to clear nav */}
      <motion.button
        onClick={() => setIsAddSheetOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-5 md:bottom-10 md:right-10 px-5 py-4 bg-gray-900 text-white rounded-2xl shadow-xl shadow-gray-400/50 flex items-center gap-3 z-40 transition-all font-bold tracking-wide"
      >
        <FiPlus className="w-5 h-5" />
        <span className="hidden md:inline">Add Lead</span>
      </motion.button>

      {/* ... Other Modals (Update/Share) can reuse the bottom sheet style or stay as modals ... */}
    </div>
  );
};

export default CP_leads;
