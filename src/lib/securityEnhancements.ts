
import { supabase } from '@/integrations/supabase/client';
import DOMPurify from 'dompurify';

// Rate limiting utilities
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const createRateLimiter = (config: RateLimitConfig) => {
  const requests: number[] = [];
  
  return {
    canMakeRequest(): boolean {
      const now = Date.now();
      const windowStart = now - config.windowMs;
      
      // Remove old requests
      while (requests.length > 0 && requests[0] < windowStart) {
        requests.shift();
      }
      
      if (requests.length >= config.maxRequests) {
        return false;
      }
      
      requests.push(now);
      return true;
    },
    
    getRemainingRequests(): number {
      const now = Date.now();
      const windowStart = now - config.windowMs;
      
      // Remove old requests
      while (requests.length > 0 && requests[0] < windowStart) {
        requests.shift();
      }
      
      return Math.max(0, config.maxRequests - requests.length);
    }
  };
};

// Authentication rate limiter (5 requests per minute)
export const authRateLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 60 * 1000 // 1 minute
});

// General API rate limiter (100 requests per minute)
export const apiRateLimiter = createRateLimiter({
  maxRequests: 100,
  windowMs: 60 * 1000 // 1 minute
});

// Enhanced input validation
export const validateInput = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },
  
  password: (password: string): boolean => {
    return password.length >= 8 && password.length <= 128;
  },
  
  text: (text: string, maxLength: number = 1000): boolean => {
    return typeof text === 'string' && text.length <= maxLength && !containsScriptTags(text);
  },
  
  uuid: (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  },
  
  courseContent: (content: any): boolean => {
    if (typeof content !== 'object' || content === null) return false;
    
    // Sanitize JSON content
    const sanitized = sanitizeObject(content);
    return JSON.stringify(sanitized).length <= 50000; // 50KB limit
  }
};

const containsScriptTags = (input: string): boolean => {
  const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  return scriptRegex.test(input);
};

// Enhanced content sanitization
export const sanitizeContent = {
  html: (dirty: string): string => {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
      FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'iframe', 'meta', 'link'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit'],
      ALLOW_DATA_ATTR: false,
    });
  },
  
  text: (text: string): string => {
    return text.replace(/[<>'"&]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#x27;';
        case '&': return '&amp;';
        default: return char;
      }
    });
  },
  
  json: (obj: any): any => {
    return sanitizeObject(obj);
  }
};

const sanitizeObject = (obj: any): any => {
  if (typeof obj === 'string') {
    return sanitizeContent.text(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  } else if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanKey = sanitizeContent.text(key);
      sanitized[cleanKey] = sanitizeObject(value);
    }
    return sanitized;
  }
  return obj;
};

// Secure error handling
export const createSecureError = (message: string, code?: string) => {
  // Log detailed error server-side, return generic message to client
  console.error(`Security Error [${code || 'UNKNOWN'}]:`, message);
  
  return {
    message: 'An error occurred. Please try again.',
    code: code || 'SECURITY_ERROR',
    timestamp: new Date().toISOString()
  };
};

// Security event logging
export const logSecurityEvent = async (event: {
  type: 'AUTH_ATTEMPT' | 'VALIDATION_FAILURE' | 'RATE_LIMIT_EXCEEDED' | 'SUSPICIOUS_ACTIVITY';
  details: string;
  userAgent?: string;
  ipAddress?: string;
}) => {
  try {
    // In a production environment, you would send this to a security monitoring service
    console.log('Security Event:', {
      ...event,
      timestamp: new Date().toISOString(),
      sessionId: crypto.randomUUID()
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

// Enhanced authentication helper
export const secureAuth = {
  async requireAuth() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      throw new Error('Authentication required');
    }
    
    return user;
  },
  
  async validateSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      await logSecurityEvent({
        type: 'AUTH_ATTEMPT',
        details: 'Invalid session detected'
      });
      return null;
    }
    
    return session;
  }
};

// Content Security Policy helpers
export const cspHeaders = {
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
