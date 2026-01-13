import { IndustryPack } from './interfaces';

export const SAAS_PACK: IndustryPack = {
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
        },
        {
          id: 'onboarding_health',
          text: 'How is user onboarding progress tracked?',
          type: 'single',
          options: [
            { label: 'Product telemetry / events', value: 'telemetry' },
            { label: 'Manual check-ins', value: 'manual', mapped_system_id: 'sys_onboarding_flow' }
          ]
        }
      ]
    }
  ]
};