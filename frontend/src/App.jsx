import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/ui/error-boundary'
import NotFound from './components/ui/not-found'
import SL_dashboard from './modules/sells/SL-pages/SL_dashboard'
import SL_leads from './modules/sells/SL-pages/SL_leads'
import SL_profile from './modules/sells/SL-pages/SL_profile'
import SL_wallet from './modules/sells/SL-pages/SL_wallet'
import SL_newLeads from './modules/sells/SL-pages/SL_newLeads'
import SL_connected from './modules/sells/SL-pages/SL_connected'
import SL_ClientProfile from './modules/sells/SL-pages/SL_ClientProfile'
import SL_notes from './modules/sells/SL-pages/SL_notes'
import SL_payments_recovery from './modules/sells/SL-pages/SL_payments_recovery'
import SL_demo_request from './modules/sells/SL-pages/SL_demo_request'
import SL_tasks from './modules/sells/SL-pages/SL_tasks'
import SL_meetings from './modules/sells/SL-pages/SL_meetings'
import SL_hot_leads from './modules/sells/SL-pages/SL_hot_leads'
import SL_converted from './modules/sells/SL-pages/SL_converted'
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
          <Route path="/client-profile/:id" element={<SL_ClientProfile />} />
          <Route path="/client-notes/:id" element={<SL_notes />} />
          <Route path="/payments-recovery" element={<SL_payments_recovery />} />
          <Route path="/demo-requests" element={<SL_demo_request />} />
          <Route path="/tasks" element={<SL_tasks />} />
          <Route path="/meetings" element={<SL_meetings />} />
          <Route path="/hot-leads" element={<SL_hot_leads />} />
          <Route path="/converted" element={<SL_converted />} />
          <Route path="/profile" element={<SL_profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
