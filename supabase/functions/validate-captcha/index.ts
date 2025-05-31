
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
    return createSecureErrorResponse('Request too large', 413);
  }

  try {
    const body = await req.text();
    let parsedBody;
    
    try {
      parsedBody = JSON.parse(body);
    } catch {
      return createSecureErrorResponse('Invalid JSON format');
    }

    const { token } = parsedBody;
    
    if (!token || typeof token !== 'string') {
      return createSecureErrorResponse('Invalid or missing token');
    }

    // Validate token format (basic check)
    if (token.length < 10 || token.length > 2048) {
      return createSecureErrorResponse('Invalid token format');
    }

    const secretKey = Deno.env.get('TURNSTILE_SECRET_KEY');
    if (!secretKey) {
      console.error('TURNSTILE_SECRET_KEY not configured');
      return createSecureErrorResponse('Service configuration error', 500);
    }

    // Get client IP with fallback
    const clientIP = req.headers.get('CF-Connecting-IP') || 
                    req.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() || 
                    req.headers.get('X-Real-IP') || 
                    '127.0.0.1';

    // Verify the token with Cloudflare Turnstile
    const formData = new URLSearchParams({
      secret: secretKey,
      response: token,
      remoteip: clientIP,
    });

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Supabase-Edge-Function/1.0'
      },
      body: formData,
    });

    if (!response.ok) {
      console.error('Turnstile API error:', response.status, response.statusText);
      return createSecureErrorResponse('CAPTCHA service unavailable', 503);
    }

    const result: TurnstileResponse = await response.json();
    
    if (!result.success) {
      console.warn('CAPTCHA verification failed:', {
        errors: result['error-codes'],
        timestamp: result.challenge_ts,
        hostname: result.hostname
      });
      
      return createSecureErrorResponse('CAPTCHA verification failed');
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
        timestamp: new Date().toISOString()
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
    return createSecureErrorResponse('Internal server error', 500);
  }
});
