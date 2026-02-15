import { apiRequest } from './baseApiService'

const getWalletSummary = async () => {
  const res = await apiRequest('/sales/wallet/summary', { method: 'GET' })
  // Backend sends { success, data: { salary: { fixedSalary }, ... } }; support both shapes
  const payload = res?.data || res || {}
  return {
    salary: payload.salary && typeof payload.salary === 'object' ? payload.salary : { fixedSalary: 0 },
    incentive: payload.incentive || { perClient: 0, current: 0, pending: 0, monthly: 0, allTime: 0, breakdown: [] },
    isTeamLead: payload.isTeamLead,
    teamLeadIncentive: payload.teamLeadIncentive || null,
    teamTargetReward: payload.teamTargetReward || null,
    transactions: Array.isArray(payload.transactions) ? payload.transactions : []
  }
}

export default {
  getWalletSummary
}


