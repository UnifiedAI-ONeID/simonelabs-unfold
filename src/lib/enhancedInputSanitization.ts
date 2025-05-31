
import DOMPurify from 'dompurify';
import { z } from 'zod';

// Enhanced input sanitization with multiple layers
export class InputSanitizer {
  private static readonly DANGEROUS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /eval\s*\(/gi,
    /document\.write/gi,
    /innerHTML/gi,
    /outerHTML/gi,
    /insertAdjacentHTML/gi,
    /\bvbscript:/gi,
    /\bdata:/gi,
    /\bjavascript:/gi
  ];

  private static readonly SQL_INJECTION_PATTERNS = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/gi,
    /(\b(OR|AND)\b.*=.*)/gi,
    /(--|#|\/\*|\*\/)/g,
    /('|"|;|\|)/g,
    /(\bxp_\w+)/gi
  ];

  static sanitizeText(input: string): string {
    if (typeof input !== 'string') return '';
    
    // Remove dangerous patterns
    let sanitized = input;
    this.DANGEROUS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    // HTML encode special characters
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    return sanitized.trim();
  }

  static sanitizeHtml(input: string, allowedTags: string[] = []): string {
    if (typeof input !== 'string') return '';

    const config = {
      ALLOWED_TAGS: allowedTags.length > 0 ? allowedTags : ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['href', 'target'],
      ALLOW_DATA_ATTR: false,
      FORBID_SCRIPT: true,
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
    };

    return DOMPurify.sanitize(input, config);
  }

  static preventSqlInjection(input: string): string {
    if (typeof input !== 'string') return '';
    
    let sanitized = input;
    this.SQL_INJECTION_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    return sanitized.trim();
  }

  static sanitizeFileName(filename: string): string {
    if (typeof filename !== 'string') return '';
    
    // Remove dangerous characters and patterns
    return filename
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\.\./g, '')
      .replace(/^\./, '')
      .trim();
  }

  static validateAndSanitizeObject(obj: unknown): unknown {
    if (obj === null || obj === undefined) return obj;
    
    if (typeof obj === 'string') {
      return this.sanitizeText(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.validateAndSanitizeObject(item));
    }
    
    if (typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const cleanKey = this.sanitizeText(key);
        sanitized[cleanKey] = this.validateAndSanitizeObject(value);
      }
      return sanitized;
    }
    
    return obj;
  }
}

// Enhanced validation schemas with security focus
export const secureValidationSchemas = {
  email: z.string()
    .email('Invalid email format')
    .min(5, 'Email too short')
    .max(254, 'Email too long')
    .refine(email => !InputSanitizer.DANGEROUS_PATTERNS.some(pattern => pattern.test(email)), 'Invalid characters in email'),

  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .refine(password => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/.test(password), 
           'Password must contain uppercase, lowercase, number and special character'),

  username: z.string()
    .min(3, 'Username too short')
    .max(30, 'Username too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens'),

  courseContent: z.string()
    .min(10, 'Content too short')
    .max(50000, 'Content too long')
    .refine(content => !InputSanitizer.DANGEROUS_PATTERNS.some(pattern => pattern.test(content)), 'Invalid content detected'),

  fileName: z.string()
    .min(1, 'Filename required')
    .max(255, 'Filename too long')
    .refine(name => !/[<>:"/\\|?*]/.test(name), 'Invalid characters in filename')
};
