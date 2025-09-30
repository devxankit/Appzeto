import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/ui/error-boundary'
import NotFound from './components/ui/not-found'
import SL_dashboard from './modules/sells/SL-pages/SL_dashboard'
import SL_leads from './modules/sells/SL-pages/SL_leads'
import SL_profile from './modules/sells/SL-pages/SL_profile'
import SL_wallet from './modules/sells/SL-pages/SL_wallet'
import SL_newLeads from './modules/sells/SL-pages/SL_newLeads'
import SL_connected from './modules/sells/SL-pages/SL_connected'
import SL_leadProfile from './modules/sells/SL-pages/SL_leadProfile'
import SL_notes from './modules/sells/SL-pages/SL_notes'
import SL_payments_recovery from './modules/sells/SL-pages/SL_payments_recovery'
import SL_demo_request from './modules/sells/SL-pages/SL_demo_request'
import SL_tasks from './modules/sells/SL-pages/SL_tasks'
import SL_meetings from './modules/sells/SL-pages/SL_meetings'
import SL_hot_leads from './modules/sells/SL-pages/SL_hot_leads'
import SL_converted from './modules/sells/SL-pages/SL_converted'
import SL_not_picked from './modules/sells/SL-pages/SL_not_picked'
import SL_today_followup from './modules/sells/SL-pages/SL_today_followup'
import SL_quotation_sent from './modules/sells/SL-pages/SL_quotation_sent'
import SL_dq_sent from './modules/sells/SL-pages/SL_dq_sent'
import SL_app_client from './modules/sells/SL-pages/SL_app_client'
import SL_web from './modules/sells/SL-pages/SL_web'
import SL_lost from './modules/sells/SL-pages/SL_lost'
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<SL_dashboard />} />
          <Route path="/leads" element={<SL_leads />} />
          <Route path="/wallet" element={<SL_wallet />} />
          <Route path="/new-leads" element={<SL_newLeads />} />
          <Route path="/connected" element={<SL_connected />} />
          <Route path="/lead-profile/:id" element={<SL_leadProfile />} />
          <Route path="/client-notes/:id" element={<SL_notes />} />
          <Route path="/payments-recovery" element={<SL_payments_recovery />} />
          <Route path="/demo-requests" element={<SL_demo_request />} />
          <Route path="/tasks" element={<SL_tasks />} />
          <Route path="/meetings" element={<SL_meetings />} />
          <Route path="/hot-leads" element={<SL_hot_leads />} />
          <Route path="/converted" element={<SL_converted />} />
          <Route path="/not-picked" element={<SL_not_picked />} />
          <Route path="/today-followup" element={<SL_today_followup />} />
          <Route path="/quotation-sent" element={<SL_quotation_sent />} />
          <Route path="/dq-sent" element={<SL_dq_sent />} />
          <Route path="/app-client" element={<SL_app_client />} />
          <Route path="/web" element={<SL_web />} />
          <Route path="/lost" element={<SL_lost />} />
          <Route path="/profile" element={<SL_profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
