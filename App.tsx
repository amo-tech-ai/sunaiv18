import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { WizardProvider } from './context/WizardContext';
import LandingPage from './pages/LandingPage';
import WizardLayout from './components/WizardLayout';
import Step1Context from './pages/wizard/Step1Context';
import Step2Diagnostics from './pages/wizard/Step2Diagnostics';
import Step3Recommendations from './pages/wizard/Step3Recommendations';
import Summary from './pages/wizard/Summary';
import Dashboard from './pages/Dashboard';
import AgencyDashboard from './pages/AgencyDashboard';

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      {/* App Routes wrapped in WizardProvider is handled inside the pages usually, 
          but here we wrap the route grouping to share state across wizard steps */}
      <Route path="/app" element={<WizardWrapper />}>
        <Route path="wizard/step-1" element={<Step1Context />} />
        <Route path="wizard/step-2" element={<Step2Diagnostics />} />
        <Route path="wizard/step-3" element={<Step3Recommendations />} />
        <Route path="wizard/summary" element={<Summary />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route index element={<Navigate to="wizard/step-1" replace />} />
      </Route>
      
      <Route path="/agency" element={<AgencyDashboard />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const WizardWrapper: React.FC = () => {
  return (
    <WizardProvider>
      <WizardLayout />
    </WizardProvider>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;