import { IndustryPack } from './interfaces';

export const FASHION_PACK: IndustryPack = {
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
        },
        {
          id: 'personalization',
          text: 'Do you use purchase history to personalize marketing?',
          type: 'single',
          options: [
            { label: 'Yes, automated flows', value: 'yes_auto' },
            { label: 'No, batch and blast', value: 'no', mapped_system_id: 'sys_personalization_engine' }
          ]
        }
      ]
    }
  ]
};