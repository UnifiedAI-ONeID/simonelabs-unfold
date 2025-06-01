
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Enhanced security headers
const getSecurityHeaders = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
});

const createErrorResponse = (message: string, status: number = 400, details?: any) => {
  const response = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    ...(details && { details })
  };

  return new Response(
    JSON.stringify(response),
    { 
      status, 
      headers: { 
        ...getSecurityHeaders(), 
        'Content-Type': 'application/json' 
      }
    }
  );
};

const createSuccessResponse = (data: any) => {
  return new Response(
    JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      ...data
    }),
    { 
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
  action?: string;
  cdata?: string;
}

serve(async (req) => {
  const headers = getSecurityHeaders();
  const requestId = crypto.randomUUID();

  console.log(`[${requestId}] CAPTCHA validation request started - Method: ${req.method}`);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers });
  }

  if (req.method !== 'POST') {
    console.log(`[${requestId}] Invalid method: ${req.method}`);
    return createErrorResponse('Method not allowed', 405);
  }

  try {
    // Read and parse request body
    let body: string;
    let parsedBody: any;
    
    try {
      body = await req.text();
      console.log(`[${requestId}] Request body received, length: ${body.length}`);
      
      if (!body || body.trim() === '') {
        console.error(`[${requestId}] Empty request body`);
        return createErrorResponse('Request body is required');
      }

      parsedBody = JSON.parse(body);
      console.log(`[${requestId}] Request body parsed successfully`);
    } catch (parseError) {
      console.error(`[${requestId}] Failed to parse request body:`, parseError);
      return createErrorResponse('Invalid JSON format');
    }

    const { token } = parsedBody;
    
    if (!token || typeof token !== 'string') {
      console.error(`[${requestId}] Invalid token in request:`, { token: typeof token });
      return createErrorResponse('Valid CAPTCHA token is required');
    }

    // Token format validation
    if (token.length < 10 || token.length > 2048) {
      console.error(`[${requestId}] Invalid token length: ${token.length}`);
      return createErrorResponse('Invalid CAPTCHA token format');
    }

    console.log(`[${requestId}] Processing token: ${token.substring(0, 20)}...`);

    // Check for development bypass
    const isDevelopment = Deno.env.get('ENVIRONMENT') === 'development';
    if (isDevelopment && token === 'dev-bypass-token') {
      console.log(`[${requestId}] Development mode: bypassing CAPTCHA validation`);
      return createSuccessResponse({ 
        development: true,
        bypass: true,
        challenge_ts: new Date().toISOString()
      });
    }

    // Get secret key - now properly configured
    const secretKey = Deno.env.get('TURNSTILE_SECRET_KEY');
    if (!secretKey) {
      console.error(`[${requestId}] TURNSTILE_SECRET_KEY not configured`);
      return createErrorResponse('CAPTCHA service configuration error', 500);
    }

    console.log(`[${requestId}] Secret key configured, proceeding with Turnstile validation`);

    // Get client IP
    const clientIP = req.headers.get('CF-Connecting-IP') || 
                    req.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() || 
                    req.headers.get('X-Real-IP') || 
                    '127.0.0.1';

    // Verify with Cloudflare Turnstile
    const formData = new URLSearchParams({
      secret: secretKey,
      response: token,
      remoteip: clientIP,
    });

    console.log(`[${requestId}] Sending verification request to Turnstile API...`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Supabase-Edge-Function/1.0',
        },
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`[${requestId}] Turnstile API error: ${response.status}`);
        return createErrorResponse('CAPTCHA verification service error', 503);
      }

      const result: TurnstileResponse = await response.json();
      console.log(`[${requestId}] Turnstile response:`, { success: result.success, errors: result['error-codes'] });
      
      if (!result.success) {
        const errorCodes = result['error-codes'] || [];
        let errorMessage = 'CAPTCHA verification failed';
        
        if (errorCodes.includes('timeout-or-duplicate')) {
          errorMessage = 'CAPTCHA token expired. Please try again.';
        } else if (errorCodes.includes('invalid-input-response')) {
          errorMessage = 'Invalid CAPTCHA token. Please refresh and try again.';
        } else if (errorCodes.includes('invalid-input-secret')) {
          errorMessage = 'CAPTCHA service configuration error';
          console.error(`[${requestId}] Invalid secret key!`);
        }
        
        return createErrorResponse(errorMessage, 400, { errorCodes });
      }

      console.log(`[${requestId}] CAPTCHA verified successfully`);

      return createSuccessResponse({
        challenge_ts: result.challenge_ts,
        hostname: result.hostname,
        action: result.action
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error(`[${requestId}] Turnstile API timeout`);
        return createErrorResponse('CAPTCHA verification timeout', 408);
      } else {
        console.error(`[${requestId}] Turnstile API error:`, fetchError);
        return createErrorResponse('CAPTCHA verification service unavailable', 503);
      }
    }

  } catch (error) {
    console.error(`[${requestId}] Unexpected error:`, error);
    return createErrorResponse('Internal server error', 500);
  }
});
