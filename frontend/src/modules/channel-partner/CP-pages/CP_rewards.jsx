import React from 'react';
import { motion } from 'framer-motion';
import {
  FiAward, FiStar, FiTrendingUp, FiLock, FiUnlock,
  FiGift, FiCheckCircle
} from 'react-icons/fi';
import CP_navbar from '../CP-components/CP_navbar';

// --- Mock Data ---
const REWARDS_DATA = {
  currentLevel: 'Silver Partner',
  nextLevel: 'Gold Partner',
  totalConversions: 8,
  conversionsForNextLevel: 10,
  progress: 80, // 8 out of 10
  currentRewardValue: '$500',
  milestones: [
    { id: 1, title: 'First Sale', requirement: '1 Conversion', reward: '$150', status: 'unlocked' },
    { id: 2, title: 'Rising Star', requirement: '5 Conversions', reward: '$350', status: 'unlocked' },
    { id: 3, title: 'Pro Partner', requirement: '10 Conversions', reward: '$1,000', status: 'in-progress' },
    { id: 4, title: 'Elite Club', requirement: '25 Conversions', reward: '$3,000', status: 'locked' },
  ],
  history: [
    { id: 101, title: 'Rising Star Bonus', date: '2 days ago', amount: '+$350' },
    { id: 102, title: 'First Sale Bonus', date: '15 Sep, 2023', amount: '+$150' },
  ]
};

const CP_rewards = () => {
  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-24 md:pb-0 font-sans text-[#1E1E1E]">
      <CP_navbar />

      <main className="max-w-md mx-auto md:max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-8 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Rewards & Achievements</h1>
          <p className="text-gray-500 text-sm">Unlock bonuses as you grow.</p>
        </div>

        {/* Level Progress Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <FiAward className="w-64 h-64 text-yellow-500" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
            {/* Badge */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-200">
              <FiStar className="w-10 h-10 text-white fill-white" />
            </div>

            {/* Stats */}
            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{REWARDS_DATA.currentLevel}</h2>
                  <p className="text-sm text-gray-500">
                    {REWARDS_DATA.conversionsForNextLevel - REWARDS_DATA.totalConversions} more sales to reach <span className="text-indigo-600 font-bold">{REWARDS_DATA.nextLevel}</span>
                  </p>
                </div>
                <span className="text-2xl font-bold text-indigo-600">{REWARDS_DATA.progress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${REWARDS_DATA.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones Grid */}
        <h3 className="font-bold text-lg text-gray-800 mb-4">Milestones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {REWARDS_DATA.milestones.map((milestone) => (
            <div
              key={milestone.id}
              className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${milestone.status === 'unlocked' ? 'bg-white border-green-200 shadow-sm' :
                  milestone.status === 'in-progress' ? 'bg-white border-indigo-200 ring-4 ring-indigo-50/50' :
                    'bg-gray-50 border-gray-200 opacity-75'
                }`}
            >
              {milestone.status === 'unlocked' && (
                <div className="absolute top-4 right-4 text-green-500 bg-green-50 p-1.5 rounded-full">
                  <FiCheckCircle className="w-5 h-5" />
                </div>
              )}
              {milestone.status === 'locked' && (
                <div className="absolute top-4 right-4 text-gray-400">
                  <FiLock className="w-5 h-5" />
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${milestone.status === 'unlocked' ? 'bg-green-100 text-green-600' :
                  milestone.status === 'in-progress' ? 'bg-indigo-100 text-indigo-600' :
                    'bg-gray-200 text-gray-400'
                }`}>
                <FiGift className="w-6 h-6" />
              </div>

              <h4 className="font-bold text-gray-900">{milestone.title}</h4>
              <p className="text-sm text-gray-500 mb-3">{milestone.requirement}</p>

              <div className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${milestone.status === 'unlocked' ? 'bg-green-50 text-green-700' :
                  milestone.status === 'in-progress' ? 'bg-indigo-50 text-indigo-700' :
                    'bg-gray-200 text-gray-500'
                }`}>
                {milestone.status === 'unlocked' ? `Earned ${milestone.reward}` : `Reward: ${milestone.reward}`}
              </div>
            </div>
          ))}
        </div>

        {/* Recent History */}
        <h3 className="font-bold text-lg text-gray-900 mb-4">Reward History</h3>
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
          {REWARDS_DATA.history.map((item, index) => (
            <div key={item.id} className={`flex items-center justify-between p-4 ${index !== REWARDS_DATA.history.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
                  <FiAward />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
              </div>
              <span className="font-bold text-green-600">{item.amount}</span>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default CP_rewards;
