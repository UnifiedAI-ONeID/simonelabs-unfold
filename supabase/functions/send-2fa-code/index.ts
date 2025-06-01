
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@2.0.0'

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

    console.log(`2FA Code generated for ${email}: ${verificationCode}`)
    
    // Send email using Resend if API key is available
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey)
        
        const { data: emailData, error: emailError } = await resend.emails.send({
          from: 'SimoneLabs <noreply@yourdomain.com>',
          to: [email],
          subject: 'Your SimoneLabs Verification Code',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333; text-align: center;">SimoneLabs</h1>
              <h2 style="color: #666; text-align: center;">Verification Code</h2>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h3 style="color: #333; font-size: 32px; letter-spacing: 4px; margin: 0;">${verificationCode}</h3>
              </div>
              <p style="color: #666; text-align: center;">This code will expire in 10 minutes.</p>
              <p style="color: #999; font-size: 12px; text-align: center;">
                If you didn't request this code, please ignore this email.
              </p>
            </div>
          `
        })

        if (emailError) {
          console.error('Email sending error:', emailError)
          // Don't throw error here - still return success even if email fails
        } else {
          console.log('Email sent successfully:', emailData)
        }
      } catch (emailError) {
        console.error('Email service error:', emailError)
        // Don't throw error here - still return success even if email fails
      }
    } else {
      console.log('RESEND_API_KEY not configured - email not sent')
    }
    
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
