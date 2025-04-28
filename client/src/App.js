import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import FundExplorer from './components/FundExplorer';
import FundDashboard from './components/Dashboard';
import RiskPrediction from './components/RiskPrediction';
import HomePage from './components/HomePage';
import SmartInsights from './components/SmartInsights'; // ✅ Added this

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<FundDashboard />} />
        <Route path="/explorer" element={<FundExplorer />} />
        <Route path="/risk" element={<RiskPrediction />} />
        <Route path="/smart" element={<SmartInsights />} /> {/* ✅ New Route */}
      </Routes>
    </Router>
  );
}

export default App;
