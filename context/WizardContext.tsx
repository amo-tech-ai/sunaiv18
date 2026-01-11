import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WizardState, BusinessContext, AnalysisState } from '../types';

const defaultContext: BusinessContext = {
  fullName: '',
  businessName: '',
  website: '',
  industry: '',
  description: '',
  services: []
};

const WizardContext = createContext<WizardState | undefined>(undefined);

export const WizardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<BusinessContext>(defaultContext);
  const [analysis, setAnalysisState] = useState<AnalysisState>({
    status: 'idle',
    content: '',
    signals: []
  });

  const updateData = (newData: Partial<BusinessContext>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const setAnalysis = (newAnalysis: Partial<AnalysisState>) => {
    setAnalysisState(prev => ({ ...prev, ...newAnalysis }));
  };

  // Step calculation could be derived from URL, but simpler to just expose data here
  // The layout component handles the step visualization based on the current route
  const step = 1; 

  return (
    <WizardContext.Provider value={{ step, data, updateData, analysis, setAnalysis }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};
