
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Import security utilities
const getSecurityHeaders = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
});

const validateRequest = (req: Request): boolean => {
  const contentLength = req.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 1024 * 10) { // 10KB limit
    return false;
  }
  return true;
};

const createSecureErrorResponse = (message: string, status: number = 400) => {
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: message,
      timestamp: new Date().toISOString()
    }),
    { 
      status, 
      headers: { 
        ...getSecurityHeaders(), 
        'Content-Type': 'application/json' 
      }
    }
  );
};

interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

serve(async (req) => {
  const headers = getSecurityHeaders();

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers });
  }

  // Validate request size and format
  if (!validateRequest(req)) {
    console.error('Request too large');
    return createSecureErrorResponse('Request too large', 413);
  }

  try {
    const body = await req.text();
    let parsedBody;
    
    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      console.error('Invalid JSON format:', parseError);
      return createSecureErrorResponse('Invalid JSON format');
    }

    const { token } = parsedBody;
    
    if (!token || typeof token !== 'string') {
      console.error('Invalid or missing token in request');
      return createSecureErrorResponse('Invalid or missing token');
    }

    // Validate token format (basic check)
    if (token.length < 10 || token.length > 2048) {
      console.error('Invalid token format, length:', token.length);
      return createSecureErrorResponse('Invalid token format');
    }

    const secretKey = Deno.env.get('TURNSTILE_SECRET_KEY');
    if (!secretKey) {
      console.error('TURNSTILE_SECRET_KEY not configured in Supabase secrets');
      return createSecureErrorResponse('CAPTCHA service configuration error - missing secret key', 500);
    }

    console.log('TURNSTILE_SECRET_KEY found, proceeding with validation');

    // Get client IP with fallback
    const clientIP = req.headers.get('CF-Connecting-IP') || 
                    req.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() || 
                    req.headers.get('X-Real-IP') || 
                    '127.0.0.1';

    console.log('Client IP:', clientIP.substring(0, 8) + '...');

    // Check for development environment bypass
    const isDevelopment = Deno.env.get('ENVIRONMENT') === 'development';
    if (isDevelopment && token === 'dev-bypass-token') {
      console.log('Development mode: bypassing CAPTCHA validation');
      return new Response(
        JSON.stringify({ 
          success: true,
          development: true,
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { 
            ...headers, 
            'Content-Type': 'application/json' 
          }
        }
      );
    }

    // Verify the token with Cloudflare Turnstile
    const formData = new URLSearchParams({
      secret: secretKey,
      response: token,
      remoteip: clientIP,
    });

    console.log('Sending verification request to Turnstile API...');

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Supabase-Edge-Function/1.0'
      },
      body: formData,
    });

    if (!response.ok) {
      console.error('Turnstile API HTTP error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Turnstile API error response:', errorText);
      return createSecureErrorResponse('CAPTCHA service temporarily unavailable', 503);
    }

    const result: TurnstileResponse = await response.json();
    console.log('Turnstile API response:', JSON.stringify(result, null, 2));
    
    if (!result.success) {
      console.warn('CAPTCHA verification failed:', {
        errors: result['error-codes'],
        timestamp: result.challenge_ts,
        hostname: result.hostname
      });
      
      // Provide more specific error messages based on error codes
      const errorCodes = result['error-codes'] || [];
      let errorMessage = 'CAPTCHA verification failed';
      
      if (errorCodes.includes('timeout-or-duplicate')) {
        errorMessage = 'CAPTCHA token expired or already used. Please try again.';
      } else if (errorCodes.includes('invalid-input-response')) {
        errorMessage = 'Invalid CAPTCHA token. Please refresh and try again.';
      } else if (errorCodes.includes('invalid-input-secret')) {
        errorMessage = 'CAPTCHA service configuration error';
        console.error('Invalid secret key configured!');
      }
      
      return createSecureErrorResponse(errorMessage);
    }

    // Log successful verification (without sensitive data)
    console.log('CAPTCHA verified successfully:', {
      timestamp: result.challenge_ts,
      hostname: result.hostname,
      clientIP: clientIP.substring(0, 8) + '...' // Partial IP for privacy
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        timestamp: new Date().toISOString(),
        challenge_ts: result.challenge_ts
      }),
      { 
        headers: { 
          ...headers, 
          'Content-Type': 'application/json' 
        }
      }
    );

  } catch (error) {
    console.error('CAPTCHA validation error:', error);
    return createSecureErrorResponse('Internal server error during CAPTCHA validation', 500);
  }
});
