
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
    const { email, code, sessionId } = await req.json()

    if (!email || !code || !sessionId) {
      throw new Error('Email, code, and session ID are required')
    }

    console.log('Verifying 2FA code for:', email)

    // In a real implementation, you would:
    // 1. Retrieve the stored code from the database
    // 2. Verify it matches and hasn't expired
    // 3. Track attempts to prevent brute force attacks
    
    // For demonstration, we'll simulate verification
    // In production, retrieve from database
    const storage = new Map()
    const storedData = storage.get(`${email}:${sessionId}`)
    
    if (!storedData) {
      throw new Error('No verification code found or code has expired')
    }

    const { code: storedCode, expiresAt, attempts } = storedData

    // Check if code has expired
    if (new Date() > new Date(expiresAt)) {
      storage.delete(`${email}:${sessionId}`)
      throw new Error('Verification code has expired')
    }

    // Check attempts (prevent brute force)
    if (attempts >= 3) {
      storage.delete(`${email}:${sessionId}`)
      throw new Error('Too many failed attempts. Please request a new code.')
    }

    // Verify the code
    const isValid = code === storedCode

    if (isValid) {
      // Code is valid, remove from storage
      storage.delete(`${email}:${sessionId}`)
      console.log('2FA verification successful for:', email)
      
      return new Response(
        JSON.stringify({ 
          valid: true, 
          message: '2FA verification successful' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    } else {
      // Invalid code, increment attempts
      storedData.attempts = attempts + 1
      storage.set(`${email}:${sessionId}`, storedData)
      
      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: 'Invalid verification code',
          attemptsRemaining: 3 - storedData.attempts
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

  } catch (error) {
    console.error('Error verifying 2FA code:', error)
    
    return new Response(
      JSON.stringify({ 
        valid: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
