
// Enhanced security utilities with comprehensive protections

export interface SecurityConfig {
  maxRequestSize: number;
  rateLimitWindow: number;
  maxRequestsPerWindow: number;
  allowedOrigins: string[];
}

export const defaultSecurityConfig: SecurityConfig = {
  maxRequestSize: 1024 * 1024, // 1MB
  rateLimitWindow: 60000, // 1 minute
  maxRequestsPerWindow: 100,
  allowedOrigins: [
    'https://rbaouxhsajpeegrrvlag.supabase.co',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ]
};

// Enhanced CSP headers with comprehensive security
export function getSecurityHeaders(): HeadersInit {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://rbaouxhsajpeegrrvlag.supabase.co https://api.stripe.com https://challenges.cloudflare.com wss://realtime.supabase.co",
      "frame-src https://challenges.cloudflare.com https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  };
}

// Request validation with size limits
export function validateRequest(request: Request, config: SecurityConfig = defaultSecurityConfig): boolean {
  // Check content length
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > config.maxRequestSize) {
    console.warn('Request size exceeds limit:', contentLength);
    return false;
  }

  // Check origin for CORS
  const origin = request.headers.get('origin');
  if (origin && !config.allowedOrigins.includes(origin)) {
    console.warn('Invalid origin:', origin);
    return false;
  }

  return true;
}

// Rate limiting implementation
const requestCounts = new Map<string, { count: number; timestamp: number }>();

export function checkRateLimit(
  identifier: string, 
  config: SecurityConfig = defaultSecurityConfig
): boolean {
  const now = Date.now();
  const windowStart = now - config.rateLimitWindow;
  
  // Clean old entries
  for (const [key, value] of requestCounts.entries()) {
    if (value.timestamp < windowStart) {
      requestCounts.delete(key);
    }
  }
  
  const current = requestCounts.get(identifier);
  
  if (!current || current.timestamp < windowStart) {
    requestCounts.set(identifier, { count: 1, timestamp: now });
    return true;
  }
  
  if (current.count >= config.maxRequestsPerWindow) {
    console.warn('Rate limit exceeded for:', identifier);
    return false;
  }
  
  current.count++;
  return true;
}

// Secure error response helper
export function createSecureErrorResponse(
  message: string, 
  status: number = 400,
  logDetails?: any
): Response {
  // Log detailed error for debugging (server-side only)
  if (logDetails) {
    console.error('Security error:', { message, status, details: logDetails });
  }

  // Return generic error to client (don't expose internal details)
  const safeMessage = status >= 500 ? 'Internal server error' : message;
  
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: safeMessage,
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
}

// Input sanitization for edge functions
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Basic HTML/script tag removal
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim()
      .substring(0, 1000); // Limit length
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput).slice(0, 100); // Limit array size
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    let keyCount = 0;
    for (const [key, value] of Object.entries(input)) {
      if (keyCount >= 50) break; // Limit object size
      const sanitizedKey = typeof key === 'string' ? key.substring(0, 100) : key;
      sanitized[sanitizedKey] = sanitizeInput(value);
      keyCount++;
    }
    return sanitized;
  }
  
  return input;
}
