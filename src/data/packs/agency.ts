import { IndustryPack } from './interfaces';

export const AGENCY_PACK: IndustryPack = {
  id: 'agency',
  name: 'Agency / Services',
  diagnostics: [
    {
      title: 'Project Efficiency',
      questions: [
        {
          id: 'scope_creep',
          text: 'How often do projects go over budget or timeline?',
          type: 'single',
          options: [
            { label: 'Rarely (<10%)', value: 'rare' },
            { label: 'Frequently (>30%)', value: 'freq', mapped_system_id: 'sys_pm_ai' }
          ]
        }
      ]
    },
    {
      title: 'Client Reporting',
      questions: [
        {
          id: 'reporting_time',
          text: 'How much time is spent creating client reports per month?',
          type: 'single',
          options: [
            { label: 'Automated / Minimal', value: 'auto' },
            { label: 'Significant (5+ hours/client)', value: 'high', mapped_system_id: 'sys_reporting_auto' }
          ]
        }
      ]
    }
  ]
};