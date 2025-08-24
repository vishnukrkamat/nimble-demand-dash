import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, type, fileName, fileType } = await req.json();
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    console.log(`Processing ${type} with Gemini API`);

    // Construct the prompt based on the type of analysis
    let prompt = '';
    if (type === 'text_analysis') {
      prompt = `Analyze the following text and extract structured information. If it appears to be a business document (invoice, receipt, purchase order, etc.), extract relevant data like amounts, dates, items, quantities, etc. Return the analysis in a clear, structured format:

Text: ${text}`;
    } else if (type === 'file_analysis') {
      prompt = `Analyze the following document content from file "${fileName}" (${fileType}). Extract and structure any relevant business information like invoices, receipts, inventory data, sales data, etc. Return the analysis in a clear, structured format:

Content: ${text}`;
    }

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response received');

    const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No analysis available';
    
    // Calculate confidence based on content length and structure
    let confidence = 75;
    if (analysis.length > 100) confidence += 10;
    if (analysis.includes('Amount:') || analysis.includes('Date:') || analysis.includes('Quantity:')) confidence += 10;
    if (type === 'file_analysis') confidence += 5;

    return new Response(JSON.stringify({ 
      analysis,
      confidence: Math.min(confidence, 95),
      type,
      processed: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-parser function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to process with AI',
      analysis: 'Error occurred during processing',
      confidence: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});