
import { logSecurityEvent } from './securityEnhancements';

interface RateLimitRule {
  maxRequests: number;
  windowMs: number;
  blockDuration: number;
  escalationFactor: number;
}

interface UserRequestData {
  requests: number[];
  violations: number;
  lastViolation: number;
  blockUntil: number;
}

// Role-based rate limiting configuration
const RATE_LIMIT_RULES: Record<string, Record<string, RateLimitRule>> = {
  student: {
    auth: { maxRequests: 3, windowMs: 15 * 60 * 1000, blockDuration: 30 * 60 * 1000, escalationFactor: 2 },
    api: { maxRequests: 30, windowMs: 60 * 1000, blockDuration: 5 * 60 * 1000, escalationFactor: 1.5 },
    form: { maxRequests: 5, windowMs: 60 * 1000, blockDuration: 10 * 60 * 1000, escalationFactor: 2 }
  },
  educator: {
    auth: { maxRequests: 5, windowMs: 15 * 60 * 1000, blockDuration: 20 * 60 * 1000, escalationFactor: 1.5 },
    api: { maxRequests: 60, windowMs: 60 * 1000, blockDuration: 3 * 60 * 1000, escalationFactor: 1.2 },
    form: { maxRequests: 10, windowMs: 60 * 1000, blockDuration: 5 * 60 * 1000, escalationFactor: 1.5 }
  },
  admin: {
    auth: { maxRequests: 10, windowMs: 15 * 60 * 1000, blockDuration: 10 * 60 * 1000, escalationFactor: 1.2 },
    api: { maxRequests: 120, windowMs: 60 * 1000, blockDuration: 2 * 60 * 1000, escalationFactor: 1.1 },
    form: { maxRequests: 20, windowMs: 60 * 1000, blockDuration: 3 * 60 * 1000, escalationFactor: 1.2 }
  },
  anonymous: {
    auth: { maxRequests: 2, windowMs: 15 * 60 * 1000, blockDuration: 60 * 60 * 1000, escalationFactor: 3 },
    api: { maxRequests: 10, windowMs: 60 * 1000, blockDuration: 15 * 60 * 1000, escalationFactor: 2 },
    form: { maxRequests: 2, windowMs: 60 * 1000, blockDuration: 30 * 60 * 1000, escalationFactor: 3 }
  }
};

export class AdvancedRateLimiter {
  private static userRequests = new Map<string, UserRequestData>();
  private static ipRequests = new Map<string, UserRequestData>();

  static checkLimit(
    identifier: string,
    action: string,
    userRole: string = 'anonymous',
    ipAddress?: string
  ): { allowed: boolean; reason?: string; retryAfter?: number } {
    const now = Date.now();
    const rule = RATE_LIMIT_RULES[userRole]?.[action] || RATE_LIMIT_RULES.anonymous[action];

    // Check user-based rate limit
    const userResult = this.checkUserLimit(identifier, rule, now);
    if (!userResult.allowed) {
      return userResult;
    }

    // Check IP-based rate limit (stricter for anonymous users)
    if (ipAddress) {
      const ipResult = this.checkIPLimit(ipAddress, rule, now, userRole === 'anonymous');
      if (!ipResult.allowed) {
        return ipResult;
      }
    }

    return { allowed: true };
  }

  private static checkUserLimit(
    identifier: string,
    rule: RateLimitRule,
    now: number
  ): { allowed: boolean; reason?: string; retryAfter?: number } {
    let userData = this.userRequests.get(identifier);
    
    if (!userData) {
      userData = { requests: [], violations: 0, lastViolation: 0, blockUntil: 0 };
      this.userRequests.set(identifier, userData);
    }

    // Check if user is currently blocked
    if (userData.blockUntil > now) {
      const retryAfter = Math.ceil((userData.blockUntil - now) / 1000);
      return { 
        allowed: false, 
        reason: 'User temporarily blocked due to rate limit violations',
        retryAfter 
      };
    }

    // Clean old requests
    const windowStart = now - rule.windowMs;
    userData.requests = userData.requests.filter(time => time > windowStart);

    // Check if within limit
    if (userData.requests.length < rule.maxRequests) {
      userData.requests.push(now);
      return { allowed: true };
    }

    // Rate limit exceeded - apply escalating block
    userData.violations++;
    userData.lastViolation = now;
    const blockDuration = rule.blockDuration * Math.pow(rule.escalationFactor, userData.violations - 1);
    userData.blockUntil = now + blockDuration;

    logSecurityEvent({
      type: 'RATE_LIMIT_EXCEEDED',
      details: `Rate limit exceeded for ${identifier}. Violation #${userData.violations}, blocked for ${Math.ceil(blockDuration / 1000)}s`
    });

    return { 
      allowed: false, 
      reason: 'Rate limit exceeded',
      retryAfter: Math.ceil(blockDuration / 1000)
    };
  }

  private static checkIPLimit(
    ipAddress: string,
    rule: RateLimitRule,
    now: number,
    isAnonymous: boolean
  ): { allowed: boolean; reason?: string; retryAfter?: number } {
    // Apply stricter limits for IP-based checking
    const ipRule = {
      ...rule,
      maxRequests: isAnonymous ? Math.floor(rule.maxRequests * 0.5) : rule.maxRequests,
      blockDuration: isAnonymous ? rule.blockDuration * 2 : rule.blockDuration
    };

    let ipData = this.ipRequests.get(ipAddress);
    
    if (!ipData) {
      ipData = { requests: [], violations: 0, lastViolation: 0, blockUntil: 0 };
      this.ipRequests.set(ipAddress, ipData);
    }

    // Check if IP is currently blocked
    if (ipData.blockUntil > now) {
      const retryAfter = Math.ceil((ipData.blockUntil - now) / 1000);
      return { 
        allowed: false, 
        reason: 'IP address temporarily blocked',
        retryAfter 
      };
    }

    // Clean old requests
    const windowStart = now - ipRule.windowMs;
    ipData.requests = ipData.requests.filter(time => time > windowStart);

    // Check if within limit
    if (ipData.requests.length < ipRule.maxRequests) {
      ipData.requests.push(now);
      return { allowed: true };
    }

    // IP rate limit exceeded
    ipData.violations++;
    ipData.lastViolation = now;
    const blockDuration = ipRule.blockDuration * Math.pow(ipRule.escalationFactor, ipData.violations - 1);
    ipData.blockUntil = now + blockDuration;

    logSecurityEvent({
      type: 'RATE_LIMIT_EXCEEDED',
      details: `IP rate limit exceeded for ${ipAddress}. Violation #${ipData.violations}, blocked for ${Math.ceil(blockDuration / 1000)}s`
    });

    return { 
      allowed: false, 
      reason: 'IP rate limit exceeded',
      retryAfter: Math.ceil(blockDuration / 1000)
    };
  }

  static getRemainingRequests(identifier: string, action: string, userRole: string = 'anonymous'): number {
    const now = Date.now();
    const rule = RATE_LIMIT_RULES[userRole]?.[action] || RATE_LIMIT_RULES.anonymous[action];
    const userData = this.userRequests.get(identifier);

    if (!userData) {
      return rule.maxRequests;
    }

    const windowStart = now - rule.windowMs;
    const recentRequests = userData.requests.filter(time => time > windowStart);
    
    return Math.max(0, rule.maxRequests - recentRequests.length);
  }

  static resetLimit(identifier: string): void {
    this.userRequests.delete(identifier);
  }

  static getBlockedUntil(identifier: string): number {
    const userData = this.userRequests.get(identifier);
    return userData?.blockUntil || 0;
  }
}
