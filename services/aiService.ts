import { supabase } from '../lib/supabase';
import { BusinessContext } from '../types';

/**
 * Invokes the 'analyze-business' Edge Function to process company data.
 * Replaces direct client-side Gemini calls for security and centralized logic.
 */
export const analyzeBusiness = async (context: BusinessContext): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-business', {
      body: { 
        businessName: context.businessName,
        industry: context.industry,
        description: context.description,
        website: context.website,
        services: context.services
      }
    });

    if (error) {
      console.error('Edge Function Error:', error);
      throw error;
    }

    return data?.analysis || "Analysis complete. (No content returned)";
  } catch (error) {
    console.error("Failed to analyze business via Edge Function:", error);
    
    // Fallback for development/offline or if function isn't deployed yet
    return `**Offline Analysis Mode**
    
    I've detected you are in the ${context.industry || 'General'} sector.
    
    Based on "${context.businessName}", I recommend focusing on:
    - Operational efficiency through automated workflows.
    - Customer data consolidation.
    
    *Note: Connect to Supabase Edge Functions for live Gemini 3 analysis.*`;
  }
};