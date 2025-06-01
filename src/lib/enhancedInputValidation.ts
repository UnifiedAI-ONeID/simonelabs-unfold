
import { logSecurityEvent } from './securityEnhancements';

// Enhanced input validation with security logging
export class SecureInputValidator {
  private static readonly patterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^\+?[\d\s\-\(\)]{10,15}$/,
    url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    alphanumeric: /^[a-zA-Z0-9\s]*$/,
    noScriptTags: /^(?!.*<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>).*$/i,
    noSqlInjection: /^(?!.*(union|select|insert|delete|update|drop|create|alter|exec|execute)\s).*$/i
  };

  static validateField(value: string, type: string, maxLength: number = 1000): { isValid: boolean; error?: string } {
    if (!value || typeof value !== 'string') {
      return { isValid: false, error: 'Value is required and must be a string' };
    }

    if (value.length > maxLength) {
      logSecurityEvent({
        type: 'VALIDATION_FAILURE',
        details: `Input length violation: ${value.length} > ${maxLength}`
      });
      return { isValid: false, error: `Input too long (max ${maxLength} characters)` };
    }

    // Check for script injection
    if (!this.patterns.noScriptTags.test(value)) {
      logSecurityEvent({
        type: 'SUSPICIOUS_ACTIVITY',
        details: 'Script tag injection attempt detected'
      });
      return { isValid: false, error: 'Invalid characters detected' };
    }

    // Check for SQL injection patterns
    if (!this.patterns.noSqlInjection.test(value)) {
      logSecurityEvent({
        type: 'SUSPICIOUS_ACTIVITY',
        details: 'SQL injection attempt detected'
      });
      return { isValid: false, error: 'Invalid input pattern detected' };
    }

    // Type-specific validation
    switch (type) {
      case 'email':
        if (!this.patterns.email.test(value)) {
          return { isValid: false, error: 'Invalid email format' };
        }
        break;
      case 'phone':
        if (!this.patterns.phone.test(value)) {
          return { isValid: false, error: 'Invalid phone number format' };
        }
        break;
      case 'url':
        if (!this.patterns.url.test(value)) {
          return { isValid: false, error: 'Invalid URL format' };
        }
        break;
      case 'alphanumeric':
        if (!this.patterns.alphanumeric.test(value)) {
          return { isValid: false, error: 'Only letters, numbers, and spaces allowed' };
        }
        break;
    }

    return { isValid: true };
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>'"&]/g, (char) => {
        switch (char) {
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '"': return '&quot;';
          case "'": return '&#x27;';
          case '&': return '&amp;';
          default: return char;
        }
      })
      .trim()
      .substring(0, 1000); // Hard limit
  }
}

// Sanitization functions for different content types
export const sanitizeTextContent = (input: string): string => {
  return SecureInputValidator.sanitizeInput(input);
};

export const sanitizeHtmlContent = (input: string): string => {
  // More aggressive HTML sanitization
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .trim()
    .substring(0, 2000);
};

export const sanitizeJsonContent = (obj: any): any => {
  if (typeof obj === 'string') {
    return sanitizeTextContent(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(item => sanitizeJsonContent(item));
  } else if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeJsonContent(value);
    }
    return sanitized;
  }
  return obj;
};

// Request frequency validation with progressive penalties
const requestMap = new Map<string, { count: number; lastRequest: number; penalty: number }>();

export const validateRequestFrequency = (
  identifier: string,
  action: string,
  maxRequests: number = 5,
  windowMs: number = 60000
): boolean => {
  const now = Date.now();
  const key = `${identifier}_${action}`;
  const existing = requestMap.get(key);

  if (!existing) {
    requestMap.set(key, { count: 1, lastRequest: now, penalty: 0 });
    return true;
  }

  // Check if window has expired (including penalty time)
  const windowWithPenalty = windowMs + (existing.penalty * 1000);
  if (now - existing.lastRequest > windowWithPenalty) {
    requestMap.set(key, { count: 1, lastRequest: now, penalty: 0 });
    return true;
  }

  // Check if within rate limit
  if (existing.count < maxRequests) {
    existing.count++;
    existing.lastRequest = now;
    return true;
  }

  // Apply progressive penalty (max 5 minutes)
  existing.penalty = Math.min(existing.penalty + 60, 300);
  
  logSecurityEvent({
    type: 'RATE_LIMIT_EXCEEDED',
    details: `Rate limit exceeded for ${key}. Penalty: ${existing.penalty}s`
  });

  return false;
};

// File validation - updated signature to match expected usage
export const validateFileUpload = (
  file: File, 
  allowedTypes?: string[], 
  maxSize?: number
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const maxFileSize = maxSize || 10 * 1024 * 1024; // 10MB default
  const defaultAllowedTypes = [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'text/csv'
  ];
  const allowedFileTypes = allowedTypes || defaultAllowedTypes;

  if (file.size > maxFileSize) {
    logSecurityEvent({
      type: 'VALIDATION_FAILURE',
      details: `File size violation: ${file.size} > ${maxFileSize}`
    });
    errors.push('File too large (max 10MB)');
  }

  if (!allowedFileTypes.includes(file.type)) {
    logSecurityEvent({
      type: 'VALIDATION_FAILURE',
      details: `Invalid file type: ${file.type}`
    });
    errors.push('File type not allowed');
  }

  // Check file extension matches MIME type
  const extension = file.name.split('.').pop()?.toLowerCase();
  const mimeTypeMap: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/gif': ['gif'],
    'image/webp': ['webp'],
    'application/pdf': ['pdf'],
    'text/plain': ['txt'],
    'text/csv': ['csv']
  };

  const expectedExtensions = mimeTypeMap[file.type];
  if (!expectedExtensions?.includes(extension || '')) {
    logSecurityEvent({
      type: 'VALIDATION_FAILURE',
      details: `File extension mismatch: ${extension} vs ${file.type}`
    });
    errors.push('File extension does not match content type');
  }

  return { isValid: errors.length === 0, errors };
};
