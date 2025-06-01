
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

const validateRequest = (req: Request): { isValid: boolean; error?: string } => {
  const contentLength = req.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 1024 * 10) { // 10KB limit
    return { isValid: false, error: 'Request too large' };
  }

  const contentType = req.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return { isValid: false, error: 'Invalid content type' };
  }

  return { isValid: true };
};

const createSecureErrorResponse = (message: string, status: number = 400, details?: any) => {
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

  console.log(`[${requestId}] CAPTCHA validation request started`);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers });
  }

  if (req.method !== 'POST') {
    console.log(`[${requestId}] Invalid method: ${req.method}`);
    return createSecureErrorResponse('Method not allowed', 405);
  }

  // Validate request format and size
  const validation = validateRequest(req);
  if (!validation.isValid) {
    console.error(`[${requestId}] Request validation failed: ${validation.error}`);
    return createSecureErrorResponse(validation.error!, 400);
  }

  try {
    const body = await req.text();
    let parsedBody;
    
    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      console.error(`[${requestId}] Invalid JSON format:`, parseError);
      return createSecureErrorResponse('Invalid JSON format');
    }

    const { token } = parsedBody;
    
    if (!token || typeof token !== 'string') {
      console.error(`[${requestId}] Invalid or missing token in request`);
      return createSecureErrorResponse('Invalid or missing token');
    }

    // Enhanced token format validation
    if (token.length < 10 || token.length > 2048) {
      console.error(`[${requestId}] Invalid token format, length: ${token.length}`);
      return createSecureErrorResponse('Invalid token format');
    }

    // Check for malicious patterns
    if (token.includes('<script>') || token.includes('javascript:') || token.includes('data:')) {
      console.error(`[${requestId}] Potentially malicious token detected`);
      return createSecureErrorResponse('Invalid token format');
    }

    const secretKey = Deno.env.get('TURNSTILE_SECRET_KEY');
    if (!secretKey) {
      console.error(`[${requestId}] TURNSTILE_SECRET_KEY not configured in Supabase secrets`);
      return createSecureErrorResponse('CAPTCHA service configuration error - missing secret key', 500);
    }

    console.log(`[${requestId}] TURNSTILE_SECRET_KEY found, proceeding with validation`);

    // Get client IP with enhanced detection
    const clientIP = req.headers.get('CF-Connecting-IP') || 
                    req.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() || 
                    req.headers.get('X-Real-IP') || 
                    req.headers.get('X-Client-IP') ||
                    '127.0.0.1';

    console.log(`[${requestId}] Client IP: ${clientIP.substring(0, 8)}...`);

    // Enhanced development environment bypass
    const isDevelopment = Deno.env.get('ENVIRONMENT') === 'development';
    if (isDevelopment && token === 'dev-bypass-token') {
      console.log(`[${requestId}] Development mode: bypassing CAPTCHA validation`);
      return createSuccessResponse({ 
        development: true,
        bypass: true,
        challenge_ts: new Date().toISOString()
      });
    }

    // Verify the token with Cloudflare Turnstile
    const formData = new URLSearchParams({
      secret: secretKey,
      response: token,
      remoteip: clientIP,
    });

    console.log(`[${requestId}] Sending verification request to Turnstile API...`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Supabase-Edge-Function/1.0',
          'Accept': 'application/json'
        },
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`[${requestId}] Turnstile API HTTP error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error(`[${requestId}] Turnstile API error response:`, errorText);
        
        if (response.status >= 500) {
          return createSecureErrorResponse('CAPTCHA service temporarily unavailable', 503);
        } else {
          return createSecureErrorResponse('CAPTCHA verification failed', 400);
        }
      }

      const result: TurnstileResponse = await response.json();
      console.log(`[${requestId}] Turnstile API response:`, JSON.stringify(result, null, 2));
      
      if (!result.success) {
        console.warn(`[${requestId}] CAPTCHA verification failed:`, {
          errors: result['error-codes'],
          timestamp: result.challenge_ts,
          hostname: result.hostname
        });
        
        // Enhanced error message mapping
        const errorCodes = result['error-codes'] || [];
        let errorMessage = 'CAPTCHA verification failed';
        let statusCode = 400;
        
        if (errorCodes.includes('timeout-or-duplicate')) {
          errorMessage = 'CAPTCHA token expired or already used. Please try again.';
        } else if (errorCodes.includes('invalid-input-response')) {
          errorMessage = 'Invalid CAPTCHA token. Please refresh and try again.';
        } else if (errorCodes.includes('invalid-input-secret')) {
          errorMessage = 'CAPTCHA service configuration error';
          statusCode = 500;
          console.error(`[${requestId}] Invalid secret key configured!`);
        } else if (errorCodes.includes('missing-input-secret')) {
          errorMessage = 'CAPTCHA service configuration error';
          statusCode = 500;
        } else if (errorCodes.includes('missing-input-response')) {
          errorMessage = 'Missing CAPTCHA token';
        } else if (errorCodes.includes('bad-request')) {
          errorMessage = 'Invalid CAPTCHA request format';
        }
        
        return createSecureErrorResponse(errorMessage, statusCode, {
          errorCodes: errorCodes
        });
      }

      // Log successful verification (without sensitive data)
      console.log(`[${requestId}] CAPTCHA verified successfully:`, {
        timestamp: result.challenge_ts,
        hostname: result.hostname,
        action: result.action,
        clientIP: clientIP.substring(0, 8) + '...' // Partial IP for privacy
      });

      return createSuccessResponse({
        challenge_ts: result.challenge_ts,
        hostname: result.hostname,
        action: result.action
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error(`[${requestId}] Turnstile API request timeout`);
        return createSecureErrorResponse('CAPTCHA verification timeout. Please try again.', 408);
      } else {
        console.error(`[${requestId}] Turnstile API network error:`, fetchError);
        return createSecureErrorResponse('Network error during CAPTCHA verification', 503);
      }
    }

  } catch (error) {
    console.error(`[${requestId}] CAPTCHA validation error:`, error);
    return createSecureErrorResponse('Internal server error during CAPTCHA validation', 500);
  }
});
