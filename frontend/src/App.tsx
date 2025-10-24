import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TADashboard from './pages/TADashboard';
import HMDashboard from './pages/HMDashboard';
import CandidatePortal from './pages/CandidatePortal';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ta/*" element={<TADashboard />} />
          <Route path="/hm/*" element={<HMDashboard />} />
          <Route path="/candidate/*" element={<CandidatePortal />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
