/**
 * Reward Automation Scheduler
 * Runs on the 1st of every month at 12:05 AM
 * Follows the same pattern as backupScheduler.js
 */

const rewardService = require('./rewardService');
const Admin = require('../models/Admin');

/**
 * Trigger the monthly reward processing
 */
const runMonthlyRewards = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const monthNum = now.getMonth() + 1; // getMonth() is 0-indexed, so +1 for current

    // We process for the PREVIOUS month
    // If it's Jan 1st, we process for Dec of previous year
    let prevMonth = monthNum - 1;
    let prevYear = year;

    if (prevMonth === 0) {
        prevMonth = 12;
        prevYear = year - 1;
    }

    const targetMonthStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;

    console.log(`[Reward Scheduler] Automatically starting reward processing for ${targetMonthStr} at ${new Date().toLocaleString()}`);

    try {
        // Get an admin ID to use as creator (usually the first/super admin)
        const superAdmin = await Admin.findOne({ role: 'admin' });
        const adminId = superAdmin ? superAdmin._id : null;

        await rewardService.processMonthlyRewards(targetMonthStr, adminId);
    } catch (error) {
        console.error('[Reward Scheduler] Execution failed:', error);
    }
};

/**
 * Calculate milliseconds until the next 1st of any month at 12:05 AM
 */
const getMsUntilNextMonthStart = () => {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 5, 0, 0);
    return next.getTime() - now.getTime();
};

/**
 * Start the reward automation scheduler
 */
const startRewardScheduler = () => {
    const msWait = getMsUntilNextMonthStart();
    const nextRun = new Date(Date.now() + msWait);

    console.log('[Reward Scheduler] Initialized. Next automated run scheduled for:', nextRun.toLocaleString());

    // Set the first run
    setTimeout(() => {
        runMonthlyRewards();

        // After the first run, setup an interval to run roughly every month
        // However, intervals can drift, so it's better to recursively use setTimeout
        const setupNextRun = () => {
            setTimeout(() => {
                runMonthlyRewards();
                setupNextRun();
            }, getMsUntilNextMonthStart());
        };

        setupNextRun();
    }, msWait);
};

module.exports = {
    startRewardScheduler,
    runMonthlyRewards
};
