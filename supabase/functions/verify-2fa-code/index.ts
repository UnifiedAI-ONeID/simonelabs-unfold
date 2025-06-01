
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
    const { email, code, sessionId } = await req.json()

    if (!email || !code || !sessionId) {
      throw new Error('Email, code, and session ID are required')
    }

    console.log('Verifying 2FA code for:', email)

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Retrieve the verification code from database
    const { data: storedData, error: fetchError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .eq('session_id', sessionId)
      .eq('used', false)
      .single()

    if (fetchError || !storedData) {
      console.log('No valid verification code found')
      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: 'No verification code found or code has expired' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Check if code has expired
    if (new Date() > new Date(storedData.expires_at)) {
      console.log('Verification code has expired')
      
      // Mark as used to prevent further attempts
      await supabase
        .from('verification_codes')
        .update({ used: true })
        .eq('id', storedData.id)

      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: 'Verification code has expired' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Check attempts (prevent brute force)
    if (storedData.attempts >= 3) {
      console.log('Too many failed attempts')
      
      // Mark as used to prevent further attempts
      await supabase
        .from('verification_codes')
        .update({ used: true })
        .eq('id', storedData.id)

      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: 'Too many failed attempts. Please request a new code.' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Verify the code
    const isValid = code === storedData.code

    if (isValid) {
      // Code is valid, mark as used
      await supabase
        .from('verification_codes')
        .update({ used: true })
        .eq('id', storedData.id)

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
      const newAttempts = storedData.attempts + 1
      
      await supabase
        .from('verification_codes')
        .update({ attempts: newAttempts })
        .eq('id', storedData.id)

      console.log(`Invalid code attempt ${newAttempts} for:`, email)
      
      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: 'Invalid verification code',
          attemptsRemaining: 3 - newAttempts
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
