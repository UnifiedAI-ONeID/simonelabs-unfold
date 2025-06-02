
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
    disabled: true,
    bypass: true,
    ...data
  };

  console.log('CAPTCHA Disabled - Success Response:', response);

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

  console.log(`[${requestId}] === CAPTCHA DISABLED - Auto-approving all requests ===`);
  console.log(`[${requestId}] Method: ${req.method}`);

  if (req.method === 'OPTIONS') {
    console.log(`[${requestId}] CORS preflight request - returning headers`);
    return new Response('ok', { headers });
  }

  if (req.method !== 'POST') {
    console.log(`[${requestId}] Invalid method: ${req.method}`);
    // Even for invalid methods, return success when CAPTCHA is disabled
    return createSuccessResponse({
      message: 'CAPTCHA validation is currently disabled - all requests approved'
    });
  }

  try {
    // Don't even try to parse the request body - just return success
    console.log(`[${requestId}] ✅ CAPTCHA DISABLED - Auto-approving request without validation`);

    return createSuccessResponse({
      challenge_ts: new Date().toISOString(),
      environment: 'captcha_completely_disabled',
      message: 'CAPTCHA validation is disabled - request automatically approved'
    });

  } catch (error) {
    console.error(`[${requestId}] 💀 Unexpected error (returning success anyway):`, error);
    
    // Even on error, return success when CAPTCHA is disabled
    return createSuccessResponse({
      challenge_ts: new Date().toISOString(),
      environment: 'captcha_completely_disabled',
      message: 'CAPTCHA validation is disabled - request automatically approved despite error'
    });
  }
});
