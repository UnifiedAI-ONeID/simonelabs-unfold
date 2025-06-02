
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Enhanced security headers with comprehensive protection
const getEnhancedSecurityHeaders = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'cross-origin',
  'Content-Security-Policy': "default-src 'none'; script-src 'none'; object-src 'none'; frame-ancestors 'none';"
});

const createErrorResponse = (message: string, status: number = 400, details?: any) => {
  const response = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    ...(details && { details })
  };

  console.error(`Error Response [${status}]:`, response);

  return new Response(
    JSON.stringify(response),
    { 
      status, 
      headers: { 
        ...getEnhancedSecurityHeaders(), 
        'Content-Type': 'application/json' 
      }
    }
  );
};

const createSuccessResponse = (data: any) => {
  const response = {
    success: true,
    timestamp: new Date().toISOString(),
    ...data
  };

  console.log('Success Response:', response);

  return new Response(
    JSON.stringify(response),
    { 
      headers: { 
        ...getEnhancedSecurityHeaders(), 
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
  const headers = getEnhancedSecurityHeaders();
  const requestId = crypto.randomUUID();

  console.log(`[${requestId}] === CAPTCHA validation request started ===`);
  console.log(`[${requestId}] Method: ${req.method}`);
  console.log(`[${requestId}] URL: ${req.url}`);

  if (req.method === 'OPTIONS') {
    console.log(`[${requestId}] CORS preflight request - returning headers`);
    return new Response('ok', { headers });
  }

  if (req.method !== 'POST') {
    console.log(`[${requestId}] Invalid method: ${req.method}`);
    return createErrorResponse('Method not allowed - only POST requests are accepted', 405);
  }

  try {
    // Read and parse request body using req.json() - this is the correct way for Supabase functions
    let requestBody: any;
    
    try {
      requestBody = await req.json();
      console.log(`[${requestId}] Successfully parsed request body:`, requestBody);
    } catch (jsonError) {
      console.error(`[${requestId}] Failed to parse JSON body:`, jsonError);
      return createErrorResponse('Invalid JSON in request body. Please ensure CAPTCHA token is included.', 400);
    }

    // Extract and validate token
    const token = requestBody?.token;
    console.log(`[${requestId}] Extracted token type:`, typeof token);
    console.log(`[${requestId}] Token preview:`, typeof token === 'string' ? token.substring(0, 30) + '...' : token);
    
    if (!token || typeof token !== 'string') {
      console.error(`[${requestId}] Invalid token format:`, { 
        tokenType: typeof token, 
        tokenValue: token,
        requestBody 
      });
      return createErrorResponse('Valid CAPTCHA token is required. Please complete the CAPTCHA verification.', 400);
    }

    // Token format validation
    if (token.length < 10 || token.length > 2048) {
      console.error(`[${requestId}] Invalid token length: ${token.length}`);
      return createErrorResponse('Invalid CAPTCHA token format. Please refresh and try again.', 400);
    }

    console.log(`[${requestId}] Processing valid token: ${token.substring(0, 30)}...`);

    // Check for development bypass
    const isDevelopment = Deno.env.get('ENVIRONMENT') === 'development' || Deno.env.get('DENO_DEPLOYMENT_ID') === undefined;
    console.log(`[${requestId}] Environment check - isDevelopment: ${isDevelopment}`);
    
    if (isDevelopment && token === 'dev-bypass-token') {
      console.log(`[${requestId}] ✅ Development mode: bypassing CAPTCHA validation`);
      return createSuccessResponse({ 
        development: true,
        bypass: true,
        challenge_ts: new Date().toISOString(),
        environment: 'development'
      });
    }

    // Get and validate secret key
    const secretKey = Deno.env.get('TURNSTILE_SECRET_KEY');
    if (!secretKey) {
      console.error(`[${requestId}] ❌ TURNSTILE_SECRET_KEY not configured in environment`);
      return createErrorResponse('CAPTCHA service configuration error. Please contact support.', 500);
    }

    console.log(`[${requestId}] ✅ Secret key configured, proceeding with Turnstile validation`);

    // Get client IP with fallbacks
    const clientIP = req.headers.get('CF-Connecting-IP') || 
                    req.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() || 
                    req.headers.get('X-Real-IP') || 
                    req.headers.get('X-Forwarded-For') ||
                    '127.0.0.1';
    
    console.log(`[${requestId}] Client IP: ${clientIP}`);

    // Enhanced rate limiting check
    const rateLimitKey = `captcha_${clientIP}`;
    const maxRequests = 10; // 10 requests per 5 minutes
    const windowMs = 5 * 60 * 1000;
    
    // Simple rate limiting implementation
    const now = Date.now();
    const requests = globalThis.captchaRequests || new Map();
    const userRequests = requests.get(rateLimitKey) || [];
    const recentRequests = userRequests.filter((time: number) => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      console.log(`[${requestId}] Rate limit exceeded for IP: ${clientIP}`);
      return createErrorResponse('Rate limit exceeded. Please wait before trying again.', 429);
    }
    
    recentRequests.push(now);
    requests.set(rateLimitKey, recentRequests);
    globalThis.captchaRequests = requests;

    // Prepare verification request
    const formData = new URLSearchParams({
      secret: secretKey,
      response: token,
      remoteip: clientIP,
    });

    console.log(`[${requestId}] 🚀 Sending verification request to Turnstile API...`);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log(`[${requestId}] ⏰ Request timeout - aborting...`);
      controller.abort();
    }, 15000);

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

      console.log(`[${requestId}] 📡 Turnstile API response status: ${response.status}`);

      if (!response.ok) {
        console.error(`[${requestId}] ❌ Turnstile API HTTP error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error(`[${requestId}] Error response body:`, errorText);
        return createErrorResponse('CAPTCHA verification service error. Please try again.', 503);
      }

      const result: TurnstileResponse = await response.json();
      console.log(`[${requestId}] 📋 Turnstile response:`, {
        success: result.success,
        errorCodes: result['error-codes'],
        challenge_ts: result.challenge_ts,
        hostname: result.hostname
      });
      
      if (!result.success) {
        const errorCodes = result['error-codes'] || [];
        console.error(`[${requestId}] ❌ CAPTCHA verification failed with codes:`, errorCodes);
        
        let errorMessage = 'CAPTCHA verification failed. Please try again.';
        let statusCode = 400;
        
        if (errorCodes.includes('timeout-or-duplicate')) {
          errorMessage = 'CAPTCHA token expired or already used. Please complete the verification again.';
        } else if (errorCodes.includes('invalid-input-response')) {
          errorMessage = 'Invalid CAPTCHA token. Please refresh the page and try again.';
        } else if (errorCodes.includes('invalid-input-secret')) {
          errorMessage = 'CAPTCHA service configuration error';
          statusCode = 500;
          console.error(`[${requestId}] 🚨 CRITICAL: Invalid secret key configuration!`);
        } else if (errorCodes.includes('missing-input-response')) {
          errorMessage = 'Missing CAPTCHA token. Please complete the verification.';
        } else if (errorCodes.includes('missing-input-secret')) {
          errorMessage = 'CAPTCHA service configuration error';
          statusCode = 500;
          console.error(`[${requestId}] 🚨 CRITICAL: Missing secret key!`);
        }
        
        return createErrorResponse(errorMessage, statusCode, { errorCodes });
      }

      console.log(`[${requestId}] ✅ CAPTCHA verified successfully!`);

      return createSuccessResponse({
        challenge_ts: result.challenge_ts,
        hostname: result.hostname,
        action: result.action,
        verification_timestamp: new Date().toISOString(),
        client_ip: clientIP
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      console.error(`[${requestId}] 💥 Turnstile API fetch error:`, fetchError);
      
      if (fetchError.name === 'AbortError') {
        console.error(`[${requestId}] ⏰ Request timed out after 15 seconds`);
        return createErrorResponse('CAPTCHA verification timeout. Please try again.', 408);
      } else {
        console.error(`[${requestId}] 🌐 Network error:`, fetchError.message);
        return createErrorResponse('CAPTCHA verification service temporarily unavailable. Please try again.', 503);
      }
    }

  } catch (error) {
    console.error(`[${requestId}] 💀 Unexpected error in CAPTCHA validation:`, error);
    console.error(`[${requestId}] Error stack:`, error.stack);
    return createErrorResponse('Internal server error. Please try again.', 500);
  }
});
