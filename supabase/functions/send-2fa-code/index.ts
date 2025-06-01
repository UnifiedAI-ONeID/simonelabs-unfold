
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, sessionId } = await req.json()

    if (!email || !sessionId) {
      throw new Error('Email and session ID are required')
    }

    console.log('Sending 2FA code to:', email)

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store the code with expiration (10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    
    // In a real implementation, you would:
    // 1. Store the code in the database with the email and session ID
    // 2. Send the code via email using a service like SendGrid or similar
    
    // For now, we'll log the code (in production, remove this)
    console.log(`2FA Code for ${email}: ${verificationCode}`)
    
    // Here you would typically send an email with the verification code
    // For demonstration, we'll simulate email sending
    
    // Store verification code in memory (in production, use database)
    const storage = new Map()
    storage.set(`${email}:${sessionId}`, {
      code: verificationCode,
      expiresAt,
      attempts: 0
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Verification code sent successfully',
        // In production, never return the actual code
        debug_code: verificationCode 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error sending 2FA code:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
