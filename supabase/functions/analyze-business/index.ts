import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { GoogleGenAI } from 'https://esm.sh/@google/genai@0.1.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { businessName, industry, description, website, services } = await req.json()
    const apiKey = (Deno as any).env.get('API_KEY')
    
    if (!apiKey) {
      throw new Error('API_KEY not set')
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Tools configuration
    // We would use googleSearch here if the model supports it and we have the entitlement
    const tools: any[] = [{ googleSearch: {} }];

    const prompt = `
      You are a senior business systems consultant for Sun AI Agency.
      Research the company using Google Search (if available) or analyze based on provided context.
      
      Context:
      Business Name: ${businessName}
      Industry: ${industry}
      Website: ${website}
      Description: ${description}
      Services: ${services?.join(', ')}

      Analyze this business context briefly (max 150 words).
      
      Output format:
      **Diagnostics Ready**
      
      [2-3 sentences of deep insight about their market position or operational challenges].
      
      [Bulleted list of 3 likely operational constraints or bottlenecks].
      
      Select your primary constraints to unlock the system architecture phase.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: tools
      }
    })

    return new Response(
      JSON.stringify({ analysis: response.text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})