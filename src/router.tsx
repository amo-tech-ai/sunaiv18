import React from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import WizardLayout from './components/WizardLayout';
import Step1Context from './pages/wizard/Step1Context';
import Step2Diagnostics from './pages/wizard/Step2Diagnostics';
import Step3Recommendations from './pages/wizard/Step3Recommendations';
import Summary from './pages/wizard/Summary';
import Dashboard from './pages/Dashboard';
import AgencyDashboard from './pages/AgencyDashboard';
import { WizardProvider } from './context/WizardContext';

const WizardWrapper: React.FC = () => {
  return (
    <WizardProvider>
      <WizardLayout />
    </WizardProvider>
  );
};

export const router = createHashRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/app',
    element: <WizardWrapper />,
    children: [
      {
        path: 'wizard/step-1',
        element: <Step1Context />,
      },
      {
        path: 'wizard/step-2',
        element: <Step2Diagnostics />,
      },
      {
        path: 'wizard/step-3',
        element: <Step3Recommendations />,
      },
      {
        path: 'wizard/summary',
        element: <Summary />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        index: true,
        element: <Navigate to="wizard/step-1" replace />,
      },
    ],
  },
  {
    path: '/agency',
    element: <AgencyDashboard />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);