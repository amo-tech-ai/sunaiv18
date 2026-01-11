export interface DiagnosticOption {
  label: string;
  value: string;
  mapped_system_id?: string;
}

export interface DiagnosticQuestion {
  id: string;
  text: string;
  type: 'single' | 'multi' | 'rating';
  options: DiagnosticOption[];
}

export interface DiagnosticSection {
  title: string;
  questions: DiagnosticQuestion[];
}

export interface IndustryPack {
  id: string;
  name: string;
  diagnostics: DiagnosticSection[];
}

const FASHION_PACK: IndustryPack = {
  id: 'fashion',
  name: 'Fashion & Retail',
  diagnostics: [
    {
      title: 'Inventory & Operations',
      questions: [
        {
          id: 'inv_sync',
          text: 'How do you currently sync inventory across channels (Shopify, Amazon, Retail)?',
          type: 'single',
          options: [
            { label: 'Real-time automated sync', value: 'automated' },
            { label: 'Manual CSV uploads', value: 'manual_csv', mapped_system_id: 'sys_erp_lite' },
            { label: 'No sync / Single channel', value: 'none' }
          ]
        },
        {
          id: 'returns_handling',
          text: 'What is your current return rate, and how are returns processed?',
          type: 'single',
          options: [
            { label: 'Under 10%, Automated portal', value: 'low_auto' },
            { label: '10-20%, Manual email processing', value: 'med_manual', mapped_system_id: 'sys_returns_ai' },
            { label: 'Over 20%, High friction', value: 'high_friction' }
          ]
        }
      ]
    },
    {
      title: 'Customer Experience',
      questions: [
        {
          id: 'cx_support',
          text: 'How do you handle "Where is my order" (WISMO) tickets?',
          type: 'single',
          options: [
            { label: 'AI Chatbot / Self-serve', value: 'ai_bot' },
            { label: 'Human support agents', value: 'human', mapped_system_id: 'sys_cx_agent' },
            { label: 'Ignored / Slow response', value: 'slow' }
          ]
        }
      ]
    }
  ]
};

const SAAS_PACK: IndustryPack = {
  id: 'saas',
  name: 'SaaS / Technology',
  diagnostics: [
    {
      title: 'Growth & Sales',
      questions: [
        {
          id: 'lead_qual',
          text: 'How are inbound leads qualified before speaking to sales?',
          type: 'single',
          options: [
            { label: 'Automated enrichment & scoring', value: 'auto_score' },
            { label: 'Manual research by SDRs', value: 'manual_sdr', mapped_system_id: 'sys_revops_ai' },
            { label: 'No qualification', value: 'none' }
          ]
        }
      ]
    },
    {
      title: 'Retention',
      questions: [
        {
          id: 'churn_pred',
          text: 'Do you have automated alerts for at-risk accounts?',
          type: 'single',
          options: [
            { label: 'Yes, predictive health scores', value: 'predictive' },
            { label: 'Reactive / Cancellation only', value: 'reactive', mapped_system_id: 'sys_churn_guard' }
          ]
        }
      ]
    }
  ]
};

const DEFAULT_PACK: IndustryPack = {
  id: 'general',
  name: 'General Business',
  diagnostics: [
    {
      title: 'Operational Efficiency',
      questions: [
        {
          id: 'bottleneck',
          text: 'What is your primary bottleneck in current workflows?',
          type: 'single',
          options: [
            { label: 'Manual Data Entry', value: 'data_entry', mapped_system_id: 'sys_workflow_auto' },
            { label: 'Communication Silos', value: 'comms' },
            { label: 'Resource Constraints', value: 'resource' }
          ]
        }
      ]
    },
    {
      title: 'Data & Insights',
      questions: [
        {
          id: 'data_source',
          text: 'How do you currently track business performance?',
          type: 'single',
          options: [
             { label: 'Real-time Dashboard', value: 'dashboard' },
             { label: 'Spreadsheets (Excel/Sheets)', value: 'sheets', mapped_system_id: 'sys_data_warehouse' },
             { label: 'Ad-hoc / Guesswork', value: 'adhoc' }
          ]
        }
      ]
    }
  ]
};

export const getIndustryPack = (industry: string): IndustryPack => {
  if (!industry) return DEFAULT_PACK;
  const ind = industry.toLowerCase();
  if (ind.includes('fashion') || ind.includes('retail')) return FASHION_PACK;
  if (ind.includes('saas') || ind.includes('technology')) return SAAS_PACK;
  return DEFAULT_PACK;
};
