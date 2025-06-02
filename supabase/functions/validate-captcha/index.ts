
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

serve(async (req) => {
  const headers = getEnhancedSecurityHeaders();
  const requestId = crypto.randomUUID();

  console.log(`[${requestId}] === CAPTCHA validation request started (DISABLED MODE) ===`);
  console.log(`[${requestId}] Method: ${req.method}`);
  console.log(`[${requestId}] URL: ${req.url}`);

  if (req.method === 'OPTIONS') {
    console.log(`[${requestId}] CORS preflight request - returning headers`);
    return new Response('ok', { headers });
  }

  if (req.method !== 'POST') {
    console.log(`[${requestId}] Invalid method: ${req.method}`);
    return new Response('Method not allowed', { status: 405, headers });
  }

  try {
    // Parse request body
    let requestBody: any;
    
    try {
      requestBody = await req.json();
      console.log(`[${requestId}] Successfully parsed request body:`, requestBody);
    } catch (jsonError) {
      console.log(`[${requestId}] JSON parse error (ignoring in disabled mode):`, jsonError);
      requestBody = {};
    }

    console.log(`[${requestId}] ✅ CAPTCHA validation DISABLED - returning success for all requests`);

    // Always return success when CAPTCHA is disabled
    return createSuccessResponse({
      disabled: true,
      bypass: true,
      challenge_ts: new Date().toISOString(),
      environment: 'captcha_disabled',
      message: 'CAPTCHA validation is currently disabled'
    });

  } catch (error) {
    console.error(`[${requestId}] 💀 Unexpected error in CAPTCHA validation:`, error);
    // Even on error, return success when disabled
    return createSuccessResponse({
      disabled: true,
      bypass: true,
      challenge_ts: new Date().toISOString(),
      environment: 'captcha_disabled',
      message: 'CAPTCHA validation is currently disabled'
    });
  }
});
