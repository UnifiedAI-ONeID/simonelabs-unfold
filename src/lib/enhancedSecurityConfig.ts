
import { SECURITY_CONFIG } from './securityConfig';

// Enhanced security configuration with additional hardening
export const ENHANCED_SECURITY_CONFIG = {
  ...SECURITY_CONFIG,
  
  // Enhanced CSP with stricter policies
  CSP_DIRECTIVES: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Only for development - should be removed in production
      "https://challenges.cloudflare.com",
      "https://js.stripe.com"
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com"
    ],
    'font-src': [
      "'self'",
      "https://fonts.gstatic.com"
    ],
    'img-src': [
      "'self'",
      "data:",
      "https:",
      "blob:"
    ],
    'connect-src': [
      "'self'",
      "https://rbaouxhsajpeegrrvlag.supabase.co",
      "https://api.stripe.com",
      "https://challenges.cloudflare.com",
      "wss://realtime.supabase.co"
    ],
    'frame-src': [
      "https://challenges.cloudflare.com",
      "https://js.stripe.com"
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'upgrade-insecure-requests': [],
    'block-all-mixed-content': []
  },

  // Enhanced rate limiting
  ENHANCED_RATE_LIMITS: {
    AUTH: {
      maxAttempts: 3,
      windowMs: 15 * 60 * 1000, // 15 minutes
      blockDuration: 30 * 60 * 1000 // 30 minutes
    },
    API: {
      maxRequests: 50,
      windowMs: 60 * 1000, // 1 minute
    },
    FORM_SUBMISSION: {
      maxSubmissions: 10,
      windowMs: 60 * 1000, // 1 minute
    }
  },

  // Input validation rules
  VALIDATION_RULES: {
    EMAIL_MAX_LENGTH: 254,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
    TEXT_FIELD_MAX_LENGTH: 1000,
    COURSE_CONTENT_MAX_SIZE: 50000, // 50KB
    FILE_UPLOAD_MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain'
    ]
  },

  // Security monitoring
  MONITORING: {
    FAILED_AUTH_THRESHOLD: 5,
    SUSPICIOUS_ACTIVITY_PATTERNS: [
      'script injection attempts',
      'sql injection attempts',
      'csrf token mismatches',
      'rate limit violations'
    ],
    LOG_RETENTION_DAYS: 30
  }
};

// Enhanced security headers with stricter policies
export const getEnhancedSecurityHeaders = () => ({
  'Content-Security-Policy': Object.entries(ENHANCED_SECURITY_CONFIG.CSP_DIRECTIVES)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=()',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin'
});

// Security validation functions
export const validateSecurityRequirements = () => {
  const issues: string[] = [];

  // Check if HTTPS is enabled in production
  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
    issues.push('HTTPS not enabled in production');
  }

  // Check for secure cookies
  if (document.cookie && !document.cookie.includes('Secure')) {
    issues.push('Cookies not marked as Secure');
  }

  // Check for CSP header
  const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (!metaCSP) {
    issues.push('Content Security Policy not implemented');
  }

  return {
    isSecure: issues.length === 0,
    issues
  };
};
