/**
 * DEPRECATED: This service has been replaced by `services/aiService.ts`.
 * 
 * New Implementation:
 * We have moved all AI analysis logic to Supabase Edge Functions to ensure:
 * 1. Security (API Keys are kept server-side)
 * 2. Centralized Logic (Consistent prompt engineering)
 * 3. CORS Compliance
 * 
 * Please import `analyzeBusiness` from `services/aiService.ts` instead.
 */

import { BusinessContext } from "../types";

export const analyzeBusinessContext = async (context: BusinessContext): Promise<string> => {
  console.error("CRITICAL WARNING: Usage of deprecated geminiService. Use aiService.ts instead to prevent security risks.");
  return "Error: This service is deprecated. Please refresh and use the updated application flow.";
};