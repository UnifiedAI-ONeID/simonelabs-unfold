
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Set expiration to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    
    // Clean up any existing codes for this email/session
    await supabase
      .from('verification_codes')
      .delete()
      .eq('email', email)
      .eq('session_id', sessionId)

    // Store the new verification code in the database
    const { error: insertError } = await supabase
      .from('verification_codes')
      .insert({
        email,
        session_id: sessionId,
        code: verificationCode,
        expires_at: expiresAt,
        attempts: 0,
        used: false
      })

    if (insertError) {
      console.error('Database error:', insertError)
      throw new Error('Failed to store verification code')
    }

    console.log(`2FA Code stored for ${email}: ${verificationCode}`)
    
    // TODO: In production, send email here using SendGrid, Resend, or similar service
    // For now, we'll log the code for testing purposes
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Verification code sent successfully',
        // In development, include the code for testing (remove in production)
        ...(Deno.env.get('ENVIRONMENT') !== 'production' && { debug_code: verificationCode })
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
