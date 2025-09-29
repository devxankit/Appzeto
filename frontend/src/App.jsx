import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/ui/error-boundary'
import NotFound from './components/ui/not-found'
import SL_dashboard from './modules/sells/SL-pages/SL_dashboard'
import SL_leads from './modules/sells/SL-pages/SL_leads'
import SL_profile from './modules/sells/SL-pages/SL_profile'
import SL_wallet from './modules/sells/SL-pages/SL_wallet'
import SL_newLeads from './modules/sells/SL-pages/SL_newLeads'
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
          <Route path="/profile" element={<SL_profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
