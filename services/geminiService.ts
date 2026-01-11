import { GoogleGenAI } from "@google/genai";
import { BusinessContext } from "../types";

// Initialize Gemini Client
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
    // Configure Tools
    const tools: any[] = [{ googleSearch: {} }];
    
    // Add URL Context tool if a valid website is provided
    // This enables the model to browse the specific URL for context
    if (context.website && context.website.startsWith('http')) {
       tools.push({ urlContext: {} });
    }

    const prompt = `
      You are a senior business systems consultant for Sun AI Agency.
      Research the company using Google Search.
      ${context.website ? `Analyze the website content at ${context.website}.` : ''}
      
      Analyze this business context briefly (max 100 words).
      
      Business Name: ${context.businessName}
      Industry: ${context.industry}
      Description: ${context.description}
      Services: ${context.services.join(', ')}

      Output format:
      **Diagnostics Ready**
      
      [2-3 sentences of deep insight about their market position or operational challenges based on the description and web findings].
      
      Select your primary constraints to unlock the system architecture phase.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        tools: tools
      }
    });

    return response.text || "Analysis complete. Ready for next steps.";
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return "Unable to connect to intelligence engine. Proceeding with offline heuristics.";
  }
};
