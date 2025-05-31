
// Centralized security configuration
export const SECURITY_CONFIG = {
  // Supabase configuration - using correct environment variable names
  SUPABASE_URL: 'https://rbaouxhsajpeegrrvlag.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiYW91eGhzYWpwZWVncnJ2bGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMzU5NDAsImV4cCI6MjA2MzYxMTk0MH0._sxG22xNQSVeiPXuaAyfjwL0HCMBKry77LRzy7g8E6E',
  
  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SPECIAL: true,
  
  // Rate limiting
  AUTH_RATE_LIMIT: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  
  // Session security
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  ACTIVITY_TIMEOUT: 2 * 60 * 60 * 1000, // 2 hours
  
  // File upload limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  
  // Content Security Policy
  CSP_DIRECTIVES: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "https://challenges.cloudflare.com", "https://js.stripe.com"],
    'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    'font-src': ["'self'", "https://fonts.gstatic.com"],
    'img-src': ["'self'", "data:", "https:", "blob:"],
    'connect-src': ["'self'", "https://rbaouxhsajpeegrrvlag.supabase.co", "https://api.stripe.com", "https://challenges.cloudflare.com", "wss://realtime.supabase.co"],
    'frame-src': ["https://challenges.cloudflare.com", "https://js.stripe.com"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'upgrade-insecure-requests': [],
    'block-all-mixed-content': []
  }
};

// Security headers for all responses
export const getSecurityHeaders = () => ({
  'Content-Security-Policy': Object.entries(SECURITY_CONFIG.CSP_DIRECTIVES)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()'
});
