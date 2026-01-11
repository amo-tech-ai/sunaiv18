export interface BusinessContext {
  fullName: string;
  businessName: string;
  website: string;
  industry: string;
  description: string;
  services: string[];
}

export interface AnalysisState {
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  content: string;
  signals: string[];
}

export interface WizardState {
  step: number;
  data: BusinessContext;
  updateData: (data: Partial<BusinessContext>) => void;
  analysis: AnalysisState;
  setAnalysis: (analysis: Partial<AnalysisState>) => void;
}

export enum Industry {
  RETAIL = 'Fashion / Retail',
  SAAS = 'SaaS / Technology',
  FINANCE = 'Finance / Fintech',
  HEALTH = 'Healthcare',
  AGENCY = 'Agency / Services',
  OTHER = 'Other'
}

export const SERVICES_LIST = [
  'Web Applications',
  'Mobile Apps',
  'Chatbots',
  'AI Agents',
  'Ecommerce',
  'Social Media',
  'WhatsApp',
  'CRM Integration',
  'Data Analytics'
];
