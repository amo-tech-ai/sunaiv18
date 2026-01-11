import { GoogleGenAI } from "@google/genai";
import { BusinessContext } from "../types";

// Initialize Gemini Client
// Note: In a real app, strict error handling for missing keys is needed. 
// Here we gracefully handle it to prevent crashes in preview.
const apiKey = process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const analyzeBusinessContext = async (context: BusinessContext): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key missing. Returning mock analysis.");
    return `**Offline Analysis Mode**
    
    I've detected you are in the ${context.industry || 'General'} sector.
    
    Based on "${context.businessName}", I recommend focusing on:
    - Operational efficiency through automated workflows.
    - Customer data consolidation.
    
    *Add a valid API Key to unlock real-time deep diagnostics.*`;
  }

  try {
    const prompt = `
      You are a senior business systems consultant for Sun AI Agency.
      Analyze this business context briefly (max 100 words).
      
      Business Name: ${context.businessName}
      Industry: ${context.industry}
      Description: ${context.description}
      Services: ${context.services.join(', ')}

      Output format:
      **Diagnostics Ready**
      
      [2-3 sentences of deep insight about their market position or operational challenges based on the description].
      
      Select your primary constraints to unlock the system architecture phase.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest', // Using flash for speed/latency in UI
      contents: prompt,
    });

    return response.text || "Analysis complete. Ready for next steps.";
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return "Unable to connect to intelligence engine. Proceeding with offline heuristics.";
  }
};
