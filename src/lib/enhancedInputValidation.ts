
import { z } from 'zod';
import DOMPurify from 'dompurify';

// Enhanced validation schemas with stricter rules
export const secureUserInputSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(5, 'Email too short')
    .max(254, 'Email too long')
    .refine((email) => !email.includes('<script'), 'Invalid characters in email'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Password must contain uppercase, lowercase, number and special character'),
  
  username: z.string()
    .min(3, 'Username too short')
    .max(30, 'Username too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens'),
  
  displayName: z.string()
    .min(1, 'Display name required')
    .max(100, 'Display name too long')
    .refine((name) => !containsScriptTags(name), 'Invalid characters in display name')
});

export const secureCourseContentSchema = z.object({
  title: z.string()
    .min(3, 'Title too short')
    .max(200, 'Title too long')
    .refine((title) => !containsScriptTags(title), 'Invalid characters in title'),
  
  description: z.string()
    .min(10, 'Description too short')
    .max(2000, 'Description too long')
    .refine((desc) => !containsScriptTags(desc), 'Invalid characters in description'),
  
  content: z.any()
    .refine((content) => {
      if (typeof content === 'object' && content !== null) {
        const jsonSize = JSON.stringify(content).length;
        return jsonSize <= 50000; // 50KB limit
      }
      return true;
    }, 'Content too large'),
  
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  
  estimatedDuration: z.string()
    .regex(/^\d{1,2}:\d{2}$/, 'Duration must be in HH:MM format')
    .optional()
});

export const secureDiscussionSchema = z.object({
  title: z.string()
    .min(5, 'Title too short')
    .max(200, 'Title too long')
    .refine((title) => !containsScriptTags(title), 'Invalid characters in title'),
  
  content: z.string()
    .min(10, 'Content too short')
    .max(10000, 'Content too long')
    .refine((content) => !containsScriptTags(content), 'Invalid characters in content'),
  
  tags: z.array(z.string().max(50)).max(10).optional(),
  
  topic: z.enum(['general', 'technical', 'assignment', 'discussion'])
});

export const secureReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  content: z.string()
    .min(10, 'Review too short')
    .max(2000, 'Review too long')
    .refine((content) => !containsScriptTags(content), 'Invalid characters in review')
});

// Content sanitization functions
export const sanitizeHtmlContent = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'iframe', 'meta', 'link', 'style'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit'],
    ALLOW_DATA_ATTR: false,
    USE_PROFILES: { html: true }
  });
};

export const sanitizeTextContent = (text: string): string => {
  return text
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
    .trim();
};

export const sanitizeJsonContent = (obj: any): any => {
  if (typeof obj === 'string') {
    return sanitizeTextContent(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(item => sanitizeJsonContent(item));
  } else if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanKey = sanitizeTextContent(key);
      sanitized[cleanKey] = sanitizeJsonContent(value);
    }
    return sanitized;
  }
  return obj;
};

// SQL injection prevention
export const sanitizeSqlParameters = (params: Record<string, unknown>) => {
  const sanitized: Record<string, unknown> = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === 'string') {
      // Remove potential SQL injection patterns
      sanitized[key] = value
        .replace(/['";\\]/g, '') // Remove quotes and backslashes
        .replace(/--/g, '') // Remove SQL comments
        .replace(/\/\*/g, '') // Remove block comments start
        .replace(/\*\//g, '') // Remove block comments end
        .trim();
    } else {
      sanitized[key] = value;
    }
  });
  
  return sanitized;
};

// Helper functions
const containsScriptTags = (input: string): boolean => {
  const scriptPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /eval\s*\(/gi,
    /document\.write/gi,
    /innerHTML/gi
  ];
  
  return scriptPatterns.some(pattern => pattern.test(input));
};

// File upload validation
export const validateFileUpload = (file: File, allowedTypes: string[], maxSize: number) => {
  const errors: string[] = [];
  
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} not allowed`);
  }
  
  if (file.size > maxSize) {
    errors.push(`File size ${file.size} exceeds limit of ${maxSize} bytes`);
  }
  
  if (file.name.length > 255) {
    errors.push('Filename too long');
  }
  
  if (containsScriptTags(file.name)) {
    errors.push('Invalid characters in filename');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Enhanced rate limiting validation
export const validateRequestFrequency = (
  identifier: string,
  action: string,
  maxRequests: number,
  windowMs: number
): boolean => {
  const key = `${action}_${identifier}`;
  const now = Date.now();
  const requests = JSON.parse(localStorage.getItem(`rl_${key}`) || '[]');
  
  // Filter out old requests
  const validRequests = requests.filter((timestamp: number) => now - timestamp < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return false;
  }
  
  validRequests.push(now);
  localStorage.setItem(`rl_${key}`, JSON.stringify(validRequests));
  return true;
};
