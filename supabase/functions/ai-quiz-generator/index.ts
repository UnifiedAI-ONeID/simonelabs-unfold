
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { topic, difficulty, questionCount, questionTypes, courseContent } = await req.json()

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Create the prompt for quiz generation
    const prompt = `Generate a quiz with the following specifications:
Topic: ${topic}
Difficulty: ${difficulty}
Number of questions: ${questionCount}
Question types: ${questionTypes.join(', ')}
${courseContent ? `Course content context: ${courseContent}` : ''}

Please generate a comprehensive quiz that tests understanding of the topic. For each question:
1. Provide clear, well-written questions
2. For multiple choice questions, include 4 options with only one correct answer
3. For true/false questions, provide a clear statement
4. Include explanations for the correct answers
5. Ensure questions are appropriate for the specified difficulty level

Return the response in this exact JSON format:
{
  "questions": [
    {
      "question_text": "Question text here",
      "question_type": "multiple_choice|true_false|short_answer",
      "correct_answer": "Correct answer text",
      "explanation": "Explanation of why this is correct",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"] // only for multiple_choice
    }
  ]
}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational content creator specializing in generating high-quality quiz questions. Always respond with valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    try {
      const quizData = JSON.parse(content)
      return new Response(JSON.stringify(quizData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content)
      throw new Error('Invalid response format from AI')
    }

  } catch (error) {
    console.error('Error in AI quiz generator:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
