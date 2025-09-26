import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ui/error-boundary'
import NotFound from './components/ui/not-found'
import SL_dashboard from './modules/sells/SL-pages/SL_dashboard'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<SL_dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
