
import DOMPurify from 'dompurify';

// Content sanitization
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
};

export const sanitizeText = (text: string): string => {
  return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
             .replace(/javascript:/gi, '')
             .replace(/on\w+\s*=/gi, '');
};

// Password validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const calculatePasswordStrength = (password: string): number => {
  let score = 0;
  
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  
  return Math.min(score / 6 * 100, 100);
};

// Input validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateDisplayName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 50 && /^[a-zA-Z0-9\s-_]+$/.test(name);
};

// Rate limiting helper
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!requests.has(identifier)) {
      requests.set(identifier, []);
    }
    
    const userRequests = requests.get(identifier);
    const validRequests = userRequests.filter((time: number) => time > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    requests.set(identifier, validRequests);
    return true;
  };
};

// Generic error messages to prevent user enumeration
export const getGenericAuthError = (error: any): string => {
  // Don't expose specific error details that could help attackers
  if (error?.message?.includes('Invalid login credentials') || 
      error?.message?.includes('Email not confirmed') ||
      error?.message?.includes('User not found')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  if (error?.message?.includes('User already registered')) {
    return 'An account with this email already exists. Please try logging in instead.';
  }
  
  if (error?.message?.includes('Signup not allowed')) {
    return 'Registration is currently unavailable. Please try again later.';
  }
  
  // Generic fallback
  return 'An error occurred. Please try again later.';
};
