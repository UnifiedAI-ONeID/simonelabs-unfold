
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { message, courseContext, userLevel } = await req.json();

    console.log('AI Tutor request:', { message, courseContext, userLevel });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create a contextual system prompt based on course and user info
    const systemPrompt = `You are an expert AI tutor for SimoneLabs, a cutting-edge educational platform. You are helping a student with their learning.

Context:
- Course: ${courseContext?.title || 'General Learning'}
- Student Level: ${userLevel || 'Beginner'}
- Course Topic: ${courseContext?.description || 'Various subjects'}

Your role:
1. Answer questions clearly and pedagogically
2. Provide step-by-step explanations
3. Offer study tips and learning strategies
4. Suggest practice exercises when appropriate
5. Encourage and motivate the learner
6. Break down complex concepts into digestible parts
7. Ask clarifying questions to better understand their needs

Keep responses concise but thorough. Use examples when helpful. Always be encouraging and supportive.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI Tutor response generated successfully');

    return new Response(JSON.stringify({ 
      response: aiResponse,
      suggestions: [
        "Can you explain this concept differently?",
        "Give me a practice example",
        "What should I study next?",
        "How can I remember this better?"
      ]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI tutor function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get AI tutor response',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
