import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Search, Filter, Globe, Smartphone,
    Database, ShoppingCart, ChevronRight, Share2,
    Check, Star, Zap, Shield, FileText
} from 'lucide-react';
import CP_navbar from '../CP-components/CP_navbar';

// --- Mock Data ---
const CATEGORIES = [
    { id: 'all', label: 'All', icon: Zap },
    { id: 'website', label: 'Website', icon: Globe },
    { id: 'mobile', label: 'Mobile App', icon: Smartphone },
    { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart },
    { id: 'crm', label: 'CRM / SaaS', icon: Database },
    { id: 'custom', label: 'Custom', icon: Shield },
];

const QUOTATIONS = [
    {
        id: 'web-basic',
        title: 'Business Website',
        category: 'website',
        price: '₹25,000',
        deliveryTime: '7-10 Days',
        features: ['5 Pages Responsive Design', 'Contact Form Integration', 'Basic SEO Setup', '1 Month Support'],
        popular: true,
        tag: 'Best Value'
    },
    {
        id: 'web-pro',
        title: 'Professional Website',
        category: 'website',
        price: '₹45,000',
        deliveryTime: '15-20 Days',
        features: ['10+ Pages Custom Design', 'CMS Integration (WordPress)', 'Advanced SEO & Speed Opt.', '3 Months Support'],
        popular: false,
        tag: 'Recommended'
    },
    {
        id: 'app-hybrid',
        title: 'Hybrid Mobile App',
        category: 'mobile',
        price: '₹85,000',
        deliveryTime: '30-45 Days',
        features: ['Android & iOS (Flutter/React Native)', 'Push Notifications', 'User Authentication', 'Admin Panel Lite'],
        popular: true,
        tag: 'Most Popular'
    },
    {
        id: 'ecom-start',
        title: 'E-commerce Starter',
        category: 'ecommerce',
        price: '₹60,000',
        deliveryTime: '20-25 Days',
        features: ['Product Catalog (Up to 50)', 'Payment Gateway Integration', 'Order Management System', 'Customer Reviews'],
        popular: false,
        tag: 'New'
    },
    {
        id: 'crm-basic',
        title: 'Basic CRM System',
        category: 'crm',
        price: '₹1,20,000',
        deliveryTime: '45-60 Days',
        features: ['Lead Management', 'Customer Database', 'Email Automation', 'Basic Reporting'],
        popular: false
    },
    {
        id: 'custom-erp',
        title: 'Custom ERP Solution',
        category: 'custom',
        price: 'Custom Quote',
        deliveryTime: '60+ Days',
        features: ['Inventory Management', 'HR & Payroll', 'Finance Module', 'Dedicated Support'],
        popular: false,
        tag: 'Enterprise'
    }
];

const QuotationCard = ({ quote, onNavigate, onShare }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all"
        >
            {/* Badge */}
            {quote.tag && (
                <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-wider ${quote.popular ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {quote.tag}
                </div>
            )}

            {/* Header */}
            <div className="mb-4 pr-16">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{CATEGORIES.find(c => c.id === quote.category)?.label}</p>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">{quote.title}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-xs text-gray-500">Starts from</span>
                    <span className="text-xl font-bold text-indigo-600">{quote.price}</span>
                </div>
            </div>

            {/* Features */}
            <div className="space-y-2 mb-6">
                {quote.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-xs text-gray-600 leading-snug">{feature}</span>
                    </div>
                ))}
            </div>

            {/* Footer Actions */}
            <div className="flex gap-2 mt-auto">
                <button
                    onClick={() => onNavigate(quote.id)}
                    className="flex-1 py-2.5 rounded-xl bg-gray-50 text-gray-900 font-bold text-xs hover:bg-gray-100 transition-colors flex items-center justify-center gap-1 group/btn"
                >
                    View Details
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onShare(quote); }}
                    className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                >
                    <Share2 className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};

const CP_quotations = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState(null);

    const filteredQuotes = useMemo(() => {
        return QUOTATIONS.filter(quote => {
            const matchesSearch = quote.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                quote.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = activeCategory === 'all' || quote.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory]);

    const handleShare = (quote) => {
        setSelectedQuote(quote);
        setIsShareSheetOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#F9F9F9] pb-20 font-sans text-[#1E1E1E]">
            <CP_navbar />

            {/* Sticky Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-3 pt-14 md:pt-4 flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">Product Quotations</h1>
                        <p className="text-xs text-gray-500">Share-ready pricing packages</p>
                    </div>
                    <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                </div>

                {/* Categories Scroller */}
                <div className="max-w-4xl mx-auto px-4 pb-0 overflow-hidden">
                    <div className="flex gap-4 overflow-x-auto hide-scrollbar py-3">
                        {CATEGORIES.map(cat => {
                            const Icon = cat.icon;
                            const isActive = activeCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all border ${isActive
                                            ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-200'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-300' : 'text-gray-400'}`} />
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <AnimatePresence mode='popLayout'>
                    {filteredQuotes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredQuotes.map(quote => (
                                <QuotationCard
                                    key={quote.id}
                                    quote={quote}
                                    onNavigate={(id) => navigate(`/cp-quotation-details/${id}`)}
                                    onShare={handleShare}
                                />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-sm border border-gray-100">
                                🔍
                            </div>
                            <h3 className="text-gray-900 font-bold mb-1">No packages found</h3>
                            <p className="text-gray-500 text-sm">Try adjusting your filters</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Share Bottom Sheet */}
            <AnimatePresence>
                {isShareSheetOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsShareSheetOpen(false)}
                            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 md:max-w-md md:mx-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-3xl shadow-2xl"
                        >
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
                            <h3 className="font-bold text-xl text-gray-900 mb-2">Share Quotation</h3>
                            <p className="text-sm text-gray-500 mb-6">Send <span className="font-bold text-indigo-600">{selectedQuote?.title}</span> details to your lead.</p>

                            <div className="space-y-3">
                                <button className="w-full py-3.5 rounded-xl bg-[#25D366] text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                                    <Share2 className="w-5 h-5" /> Share via WhatsApp
                                </button>
                                <button className="w-full py-3.5 rounded-xl bg-gray-100 text-gray-900 font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                                    <FileText className="w-5 h-5" /> Copy Link
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CP_quotations;
