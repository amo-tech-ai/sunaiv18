import { IndustryPack } from './interfaces';

export const REAL_ESTATE_PACK: IndustryPack = {
  id: 'real_estate',
  name: 'Real Estate',
  diagnostics: [
    {
      title: 'Lead Management',
      questions: [
        {
          id: 'speed_to_lead',
          text: 'What is your average response time for new web inquiries?',
          type: 'single',
          options: [
            { label: 'Under 5 minutes', value: 'under_5' },
            { label: '1-24 hours', value: 'hours', mapped_system_id: 'sys_lead_responder' },
            { label: 'Manual follow up when possible', value: 'manual' }
          ]
        }
      ]
    },
    {
      title: 'Transaction Coordination',
      questions: [
        {
          id: 'doc_processing',
          text: 'How are transaction documents and contracts managed?',
          type: 'single',
          options: [
            { label: 'Digital Transaction Management', value: 'digital' },
            { label: 'Manual PDF/Email chains', value: 'manual', mapped_system_id: 'sys_doc_ai' }
          ]
        }
      ]
    }
  ]
};