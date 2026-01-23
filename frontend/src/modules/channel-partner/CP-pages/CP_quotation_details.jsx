import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Check, Share2, FileText, Info,
    ShieldCheck, HelpCircle, DollarSign, Calendar
} from 'lucide-react';
import CP_navbar from '../CP-components/CP_navbar';

// Mock DB (Ideally share this or fetch from API)
const QUOTATION_DETAILS = {
    'web-basic': {
        title: 'Business Website Package',
        price: '₹25,000',
        deliveryTime: '7-10 Days',
        description: 'Perfect for small businesses looking to establish a professional online presence quickly and affordably.',
        features: [
            { title: 'Responsive Design', desc: 'Mobile-friendly layout that looks good on all devices.' },
            { title: '5 Pages', desc: 'Home, About, Services, Gallery, Contact.' },
            { title: 'Contact Integration', desc: 'Functional contact form with email notifications.' },
            { title: 'Social Media Links', desc: 'Integration with Facebook, Instagram, LinkedIn.' },
            { title: 'Basic SEO', desc: 'Meta tags setup for Google indexing.' }
        ],
        addons: [
            { name: 'Logo Design', price: '₹3,000' },
            { name: 'Extra Page', price: '₹2,000 / page' },
            { name: 'Content Writing', price: '₹5,000' }
        ],
        terms: [
            '50% Advance Payment required to start.',
            'Remaining 50% upon completion & before handover.',
            'Domain & Hosting charges are extra.',
            '1 Month free technical support included.'
        ]
    },
    'web-pro': {
        title: 'Professional Website Package',
        price: '₹45,000',
        deliveryTime: '15-20 Days',
        description: 'A robust solution for growing businesses needing a CMS and advanced features.',
        features: [
            { title: 'Custom Design', desc: 'Unique UI/UX tailored to your brand.' },
            { title: 'CMS Integration', desc: 'Easy-to-manage content via WordPress/Webflow.' },
            { title: 'Speed Optimization', desc: 'Core Web Vitals optimized for fast loading.' },
            { title: 'Advanced SEO', desc: 'Keyword research and on-page optimization.' },
            { title: 'Analytics', desc: 'Google Analytics & Search Console setup.' }
        ],
        addons: [
            { name: 'E-commerce Add-on', price: '₹15,000' },
            { name: 'Blog Setup', price: '₹5,000' }
        ],
        terms: [
            '40% Advance, 30% Milestone 1, 30% Completion.',
            '3 Months free technical support included.'
        ]
    },
    // Add other fallbacks if needed
};

const CP_quotation_details = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const quote = QUOTATION_DETAILS[id] || QUOTATION_DETAILS['web-basic']; // Fallback for demo

    return (
        <div className="min-h-screen bg-[#F9F9F9] pb-24 font-sans text-[#1E1E1E]">
            <CP_navbar />

            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-md mx-auto px-4 py-3 pt-14 md:pt-4 flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Quotation Details</h1>
                </div>
            </div>

            <main className="max-w-md mx-auto px-4 py-6 space-y-6">

                {/* Hero Card */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mt-10 -mr-10 blur-2xl"></div>

                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Quotation #{id.toUpperCase()}</p>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{quote.title}</h2>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">{quote.description}</p>

                    <div className="flex items-end justify-between p-6 bg-white rounded-[24px] border border-gray-100 shadow-sm">
                        <div>
                            <p className="text-xs text-gray-400 font-medium mb-1">Estimated Cost</p>
                            <h3 className="text-3xl font-bold text-indigo-600 tracking-tight">{quote.price}</h3>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-medium mb-1">Delivery</p>
                            <h4 className="text-lg font-bold text-gray-900">{quote.deliveryTime}</h4>
                        </div>
                    </div>
                </div>

                {/* Features List */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" /> What's Included
                    </h3>
                    <div className="space-y-4">
                        {quote.features.map((feature, idx) => (
                            <div key={idx} className="flex gap-4">
                                <div className="mt-1 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
                                    <Check className="w-3 h-3" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{feature.title}</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add-ons */}
                {quote.addons && (
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-amber-500" /> Optional Add-ons
                        </h3>
                        <div className="space-y-3">
                            {quote.addons.map((addon, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <span className="text-sm font-medium text-gray-700">{addon.name}</span>
                                    <span className="text-sm font-bold text-indigo-600">{addon.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Payment Terms & Disclaimer */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-500" /> Payment Terms
                    </h3>
                    <ul className="space-y-2 mb-6">
                        {quote.terms.map((term, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0"></span>
                                {term}
                            </li>
                        ))}
                    </ul>

                    <div className="p-6 bg-amber-50 rounded-[24px] border border-amber-100 shadow-sm flex gap-3">
                        <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
                        <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                            <strong>Note:</strong> Final pricing may vary based on specific client requirements and customizations requested during the discovery phase.
                        </p>
                    </div>
                </div>

            </main>

            {/* Bottom Floating Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 md:hidden">
                <div className="flex gap-3">
                    <button className="flex-1 py-3.5 rounded-xl bg-[#25D366] text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 active:scale-95 transition-transform">
                        <Share2 className="w-5 h-5" /> Share Quote
                    </button>
                </div>
            </div>

            {/* Desktop FAB equivalent (if needed, but usually redundant with mobile-first focus) */}

        </div>
    );
};

export default CP_quotation_details;
