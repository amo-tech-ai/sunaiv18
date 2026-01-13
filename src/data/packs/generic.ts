import { IndustryPack } from './interfaces';

export const GENERIC_PACK: IndustryPack = {
  id: 'generic',
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