import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/ui/error-boundary'
import NotFound from './components/ui/not-found'

//SL pages start here //
import SL_dashboard from './modules/sells/SL-pages/SL_dashboard'
import SL_leads from './modules/sells/SL-pages/SL_leads'
import SL_profile from './modules/sells/SL-pages/SL_profile'
import SL_wallet from './modules/sells/SL-pages/SL_wallet'
import SL_newLeads from './modules/sells/SL-pages/SL_newLeads'
import SL_connected from './modules/sells/SL-pages/SL_connected'
import SL_leadProfile from './modules/sells/SL-pages/SL_leadProfile'
import SL_ClientProfile from './modules/sells/SL-pages/SL_ClientProfile'
import SL_client_transaction from './modules/sells/SL-pages/SL_client_transaction'
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
import SL_notification from './modules/sells/SL-pages/SL_notification'
import SL_requests from './modules/sells/SL-pages/SL_requests'
import SL_notice_board from './modules/sells/SL-pages/SL_notice_board'

//PM pages start here //
import PM_dashboard from './modules/dev/DEV-pages/PM-pages/PM_dashboard'
import PM_projects from './modules/dev/DEV-pages/PM-pages/PM_projects'
import PM_milestone from './modules/dev/DEV-pages/PM-pages/PM_milestone'
import PM_tasks from './modules/dev/DEV-pages/PM-pages/PM_tasks'
import PM_leaderboard from './modules/dev/DEV-pages/PM-pages/PM_leaderboard'
import PM_Profile from './modules/dev/DEV-pages/PM-pages/PM_Profile'
import PM_project_detail from './modules/dev/DEV-pages/PM-pages/PM_project_detail'
import PM_milestone_detail from './modules/dev/DEV-pages/PM-pages/PM_milestone_detail'
import PM_task_detail from './modules/dev/DEV-pages/PM-pages/PM_task_detail'
import PM_wallet from './modules/dev/DEV-pages/PM-pages/PM_wallet'

//Employee pages start here //
import Employee_dashboard from './modules/dev/DEV-pages/Employee-pages/Employee_dashboard'
import Employee_leaderboard from './modules/dev/DEV-pages/Employee-pages/Employee_leaderboard'
import Employee_projects from './modules/dev/DEV-pages/Employee-pages/Employee_projects'
import Employee_tasks from './modules/dev/DEV-pages/Employee-pages/Employee_tasks'
import Employee_profile from './modules/dev/DEV-pages/Employee-pages/Employee_profile'
import Employee_project_detail from './modules/dev/DEV-pages/Employee-pages/Employee_project_detail'
import Employee_milestone_details from './modules/dev/DEV-pages/Employee-pages/Employee_milestone_details'
import Employee_task_detail from './modules/dev/DEV-pages/Employee-pages/Employee_task_detail'


function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          //SL pages start here //
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<SL_dashboard />} />
          <Route path="/leads" element={<SL_leads />} />
          <Route path="/wallet" element={<SL_wallet />} />
          <Route path="/new-leads" element={<SL_newLeads />} />
          <Route path="/connected" element={<SL_connected />} />
          <Route path="/lead-profile/:id" element={<SL_leadProfile />} />
          <Route path="/client-profile/:id" element={<SL_ClientProfile />} />
          <Route path="/client-transaction/:id" element={<SL_client_transaction />} />
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
          <Route path="/notifications" element={<SL_notification />} />
          <Route path="/requests" element={<SL_requests />} />
          <Route path="/notice-board" element={<SL_notice_board />} />
         
         //PM pages start here //
          <Route path="/pm-dashboard" element={<PM_dashboard />} />
          <Route path="/pm-projects" element={<PM_projects />} />
          <Route path="/pm-project/:id" element={<PM_project_detail />} />
          <Route path="/pm-milestone/:id" element={<PM_milestone_detail />} />
          <Route path="/pm-task/:id" element={<PM_task_detail />} />
          <Route path="/pm-milestone" element={<PM_milestone />} />
          <Route path="/pm-tasks" element={<PM_tasks />} />
          <Route path="/pm-leaderboard" element={<PM_leaderboard />} />
          <Route path="/pm-profile" element={<PM_Profile />} />
          <Route path="/pm-wallet" element={<PM_wallet />} />

          //Employee pages start here //
          <Route path="/employee-dashboard" element={<Employee_dashboard />} />
          <Route path="/employee-projects" element={<Employee_projects />} />
          <Route path="/employee-project/:id" element={<Employee_project_detail />} />
          <Route path="/employee/milestone-details/:id" element={<Employee_milestone_details />} />
          <Route path="/employee-task/:id" element={<Employee_task_detail />} />
          <Route path="/employee-tasks" element={<Employee_tasks />} />
          <Route path="/employee-leaderboard" element={<Employee_leaderboard />} />
          <Route path="/employee-profile" element={<Employee_profile />} />
         
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
