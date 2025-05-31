
import { logSecurityEvent } from './securityEnhancements';

// Enhanced session validation
export class SessionValidator {
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly ACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours

  static async validateSession(sessionToken: string): Promise<boolean> {
    try {
      // Decode session without verification first to check timestamps
      const payload = JSON.parse(atob(sessionToken.split('.')[1]));
      const now = Date.now() / 1000;
      
      // Check if session is expired
      if (payload.exp && payload.exp < now) {
        await logSecurityEvent({
          type: 'SESSION_EXPIRED',
          details: `Session expired for user ${payload.sub}`
        });
        return false;
      }
      
      // Check last activity
      if (payload.last_activity && (now - payload.last_activity) > (this.ACTIVITY_TIMEOUT / 1000)) {
        await logSecurityEvent({
          type: 'SESSION_INACTIVE',
          details: `Session inactive for user ${payload.sub}`
        });
        return false;
      }
      
      return true;
    } catch (error) {
      await logSecurityEvent({
        type: 'SESSION_VALIDATION_ERROR',
        details: `Session validation failed: ${error}`
      });
      return false;
    }
  }

  static async logAuthEvent(event: 'LOGIN' | 'LOGOUT' | 'FAILED_LOGIN', userId?: string, details?: string) {
    await logSecurityEvent({
      type: event,
      details: `User ${userId || 'unknown'}: ${details || 'No additional details'}`
    });
  }
}

// Enhanced rate limiting with progressive penalties
export class AdvancedRateLimiter {
  private static attempts = new Map<string, { count: number; lastAttempt: number; penalty: number }>();
  
  static checkLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier);
    
    if (!attempts) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now, penalty: 0 });
      return true;
    }
    
    // Reset if window expired
    if (now - attempts.lastAttempt > windowMs + (attempts.penalty * 1000)) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now, penalty: 0 });
      return true;
    }
    
    // Check if still within limit
    if (attempts.count < maxAttempts) {
      attempts.count++;
      attempts.lastAttempt = now;
      return true;
    }
    
    // Apply progressive penalty
    attempts.penalty = Math.min(attempts.penalty + 60, 300); // Max 5 minute penalty
    
    logSecurityEvent({
      type: 'RATE_LIMIT_EXCEEDED',
      details: `Rate limit exceeded for ${identifier}. Penalty: ${attempts.penalty}s`
    });
    
    return false;
  }
  
  static resetLimit(identifier: string) {
    this.attempts.delete(identifier);
  }
}

// Secure environment validation
export const validateEnvironment = () => {
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'STRIPE_PUBLISHABLE_KEY'
  ];
  
  const missing = requiredVars.filter(varName => !import.meta.env[`VITE_${varName}`]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Content Security Policy helpers
export const generateCSPNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
};

export const createSecureHeaders = (nonce: string) => ({
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' https://js.stripe.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self' https://*.supabase.co https://api.stripe.com;
    frame-src 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `.replace(/\s+/g, ' ').trim(),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
});
