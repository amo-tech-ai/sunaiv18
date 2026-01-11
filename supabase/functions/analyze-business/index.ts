import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { GoogleGenAI } from 'https://esm.sh/@google/genai@0.1.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. CORS Handling
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Authentication Validation (Security Verification)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        return new Response(
            JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    // 3. Request Parsing
    const { businessName, industry, description, website, services } = await req.json()

    // Validate required fields
    if (!businessName || !description) {
        return new Response(
            JSON.stringify({ error: 'Missing required fields: businessName and description are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    // 4. Gemini API Configuration
    // Fixed: Reverted to Deno.env.get because process.env is not available in Supabase Edge Runtime (Deno).
    // Using (Deno as any) to bypass TypeScript error "Property 'env' does not exist on type 'typeof Deno'" in some environments.
    const apiKey = (Deno as any).env.get('API_KEY');
    if (!apiKey) {
        console.error("API_KEY not set in Edge Function environment");
        throw new Error('Server configuration error');
    }

    const ai = new GoogleGenAI({ apiKey });

    // 5. Conditional URL Context Tool
    const tools: any[] = [{ googleSearch: {} }];
    if (website && typeof website === 'string' && website.startsWith('http')) {
        tools.push({ urlContext: {} });
    }

    // 6. Prompt Construction
    const prompt = `
      You are a senior business systems consultant for Sun AI Agency. We specialize in implementing AI Agents, Unified Data Layers, and Automated Workflows to help service businesses scale.
      
      Research the company using Google Search and the provided Website URL (if available) to analyze their specific offerings and market positioning.
      
      Context:
      Business Name: ${businessName}
      Industry: ${industry || 'Unspecified'}
      Website: ${website || 'None'}
      Description: ${description}
      Services: ${services && Array.isArray(services) ? services.join(', ') : 'None'}

      Analyze this business to identify specific operational friction points that our AI solutions could solve. Keep it brief (max 150 words).
      
      Output format (Markdown):
      **Diagnostics Ready**
      
      [2-3 sentences of deep insight about their market position and likely operational challenges].
      
      **Likely Operational Bottlenecks:**
      * [Specific bottleneck regarding manual processes, data fragmentation, or scaling limits]
      * [Specific bottleneck regarding customer experience or service delivery]
      * [Specific bottleneck regarding internal resource allocation]
      
      Select primary constraints to unlock the system architecture phase.
    `;

    // 7. Gemini API Call
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: tools
      }
    })

    // 8. Response Format
    const analysisText = response.text || "Analysis complete. (No content returned)";

    return new Response(
      JSON.stringify({ analysis: analysisText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    // 9. Error Handling
    console.error("Edge Function Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})