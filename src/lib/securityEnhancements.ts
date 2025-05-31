import { supabase } from '@/integrations/supabase/client';
import DOMPurify from 'dompurify';
import { CSRFProtection } from './csrf';
import { SECURITY_CONFIG } from './securityConfig';

// Rate limiting utilities with expanded scope
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  identifier?: string;
}

const createAdvancedRateLimiter = (config: RateLimitConfig) => {
  const requests = new Map<string, number[]>();
  
  return {
    canMakeRequest(identifier: string = 'default'): boolean {
      const now = Date.now();
      const windowStart = now - config.windowMs;
      const key = `${config.identifier || 'general'}_${identifier}`;
      
      if (!requests.has(key)) {
        requests.set(key, []);
      }
      
      const userRequests = requests.get(key)!;
      const validRequests = userRequests.filter(time => time > windowStart);
      
      if (validRequests.length >= config.maxRequests) {
        return false;
      }
      
      validRequests.push(now);
      requests.set(key, validRequests);
      return true;
    },
    
    getRemainingRequests(identifier: string = 'default'): number {
      const now = Date.now();
      const windowStart = now - config.windowMs;
      const key = `${config.identifier || 'general'}_${identifier}`;
      
      if (!requests.has(key)) {
        return config.maxRequests;
      }
      
      const userRequests = requests.get(key)!;
      const validRequests = userRequests.filter(time => time > windowStart);
      requests.set(key, validRequests);
      
      return Math.max(0, config.maxRequests - validRequests.length);
    }
  };
};

// Enhanced rate limiters with proper configuration
export const authRateLimiter = createAdvancedRateLimiter({
  maxRequests: SECURITY_CONFIG.AUTH_RATE_LIMIT.maxAttempts,
  windowMs: SECURITY_CONFIG.AUTH_RATE_LIMIT.windowMs,
  identifier: 'auth'
});

export const courseRateLimiter = createAdvancedRateLimiter({
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
  identifier: 'course'
});

export const reviewRateLimiter = createAdvancedRateLimiter({
  maxRequests: 3,
  windowMs: 60 * 1000, // 1 minute
  identifier: 'review'
});

export const apiRateLimiter = createAdvancedRateLimiter({
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
  identifier: 'api'
});

// Enhanced input validation with CSRF integration
export const validateInput = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },
  
  password: (password: string): boolean => {
    return password.length >= SECURITY_CONFIG.PASSWORD_MIN_LENGTH && password.length <= 128;
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
    
    const sanitized = sanitizeObject(content);
    return JSON.stringify(sanitized).length <= 50000; // 50KB limit
  },

  csrfToken: (token: string): boolean => {
    return CSRFProtection.validateToken(token);
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

// Enhanced security event logging
export const logSecurityEvent = async (event: {
  type: 'AUTH_ATTEMPT' | 'VALIDATION_FAILURE' | 'RATE_LIMIT_EXCEEDED' | 'SUSPICIOUS_ACTIVITY' | 'CSRF_VIOLATION' | 
        'SESSION_EXPIRED' | 'SESSION_INACTIVE' | 'SESSION_VALIDATION_ERROR' | 'LOGIN' | 'LOGOUT' | 'FAILED_LOGIN' |
        'OPERATION_START' | 'OPERATION_SUCCESS' | 'OPERATION_FAILED' | 'WEBHOOK_PROCESSING' | 'WEBHOOK_SUCCESS' | 'WEBHOOK_ERROR' |
        'INVALID_METHOD' | 'MISSING_SIGNATURE' | 'INVALID_SIGNATURE' | 'VALIDATION_SUCCESS' | 'SECURITY_SETTING_CHANGED' |
        'SESSION_TERMINATED' | 'ALL_SESSIONS_TERMINATED' | 'SECURE_FORM_SUBMISSION' | 'FORM_SUBMISSION_ERROR';
  details: string;
  userAgent?: string;
  ipAddress?: string;
  userId?: string;
}) => {
  try {
    const eventData = {
      ...event,
      timestamp: new Date().toISOString(),
      sessionId: crypto.randomUUID(),
      csrfToken: CSRFProtection.getToken(),
      userAgent: event.userAgent || navigator.userAgent,
      url: window.location.href
    };

    console.log('Security Event:', eventData);

    // Store in localStorage for admin review (in production, send to monitoring service)
    const existingEvents = JSON.parse(localStorage.getItem('security_events') || '[]');
    existingEvents.push(eventData);
    
    // Keep only last 100 events
    if (existingEvents.length > 100) {
      existingEvents.splice(0, existingEvents.length - 100);
    }
    
    localStorage.setItem('security_events', JSON.stringify(existingEvents));

    // High-priority events
    if (event.type === 'SUSPICIOUS_ACTIVITY' || event.type === 'CSRF_VIOLATION' || event.type === 'RATE_LIMIT_EXCEEDED') {
      console.warn('High-priority security event detected:', eventData);
      
      // In production, trigger immediate alerts
      if (typeof window !== 'undefined' && (window as any).securityAlertCallback) {
        (window as any).securityAlertCallback(eventData);
      }
    }
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

// Enhanced authentication helper with CSRF protection
export const secureAuth = {
  async requireAuth() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      await logSecurityEvent({
        type: 'AUTH_ATTEMPT',
        details: 'Unauthorized access attempt'
      });
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

// Secure operation wrapper with comprehensive protection
export const secureOperation = async <T>(
  operation: () => Promise<T>,
  context: {
    rateLimiter?: any;
    identifier?: string;
    requireAuth?: boolean;
    requireCSRF?: boolean;
  } = {}
): Promise<T> => {
  // Rate limiting check
  if (context.rateLimiter && context.identifier) {
    if (!context.rateLimiter.canMakeRequest(context.identifier)) {
      await logSecurityEvent({
        type: 'RATE_LIMIT_EXCEEDED',
        details: `Rate limit exceeded for ${context.identifier}`
      });
      throw new Error('Rate limit exceeded. Please try again later.');
    }
  }

  // Authentication check
  if (context.requireAuth) {
    await secureAuth.requireAuth();
  }

  // CSRF validation (if required)
  if (context.requireCSRF) {
    const token = CSRFProtection.getToken();
    if (!token) {
      await logSecurityEvent({
        type: 'CSRF_VIOLATION',
        details: 'Missing CSRF token'
      });
      throw new Error('CSRF token required');
    }
  }

  try {
    return await operation();
  } catch (error: any) {
    await logSecurityEvent({
      type: 'VALIDATION_FAILURE',
      details: `Operation failed: ${error.message}`
    });
    throw error;
  }
};
