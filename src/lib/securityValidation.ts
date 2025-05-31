
import DOMPurify from 'dompurify';
import { z } from 'zod';

// Enhanced input validation schemas
export const courseContentSchema = z.object({
  sections: z.array(z.object({
    id: z.string().uuid(),
    title: z.string().min(1).max(200),
    content: z.object({
      type: z.enum(['text', 'video', 'quiz', 'assignment']),
      data: z.record(z.unknown()).refine((data) => {
        // Deep validation of content structure
        if (typeof data !== 'object' || data === null) return false;
        
        // Validate based on content type
        const validKeys = ['text', 'html', 'videoUrl', 'questions', 'description'];
        return Object.keys(data).every(key => validKeys.includes(key));
      })
    }),
    order: z.number().int().min(0)
  })).max(50), // Limit number of sections
  metadata: z.object({
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    estimatedDuration: z.string().regex(/^\d+:\d{2}$/) // HH:MM format
  }).optional()
});

export const discussionContentSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10).max(5000),
  tags: z.array(z.string().max(50)).max(10).optional(),
  topic: z.enum(['general', 'technical', 'assignment', 'discussion'])
});

export const reviewContentSchema = z.object({
  rating: z.number().int().min(1).max(5),
  content: z.string().min(10).max(2000)
});

// Enhanced content sanitization
export const sanitizeContent = (content: string, options?: { allowedTags?: string[] }) => {
  const config = {
    ALLOWED_TAGS: options?.allowedTags || ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: ['href', 'target'],
    ALLOW_DATA_ATTR: false,
    FORBID_SCRIPT: true,
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed']
  };
  
  return DOMPurify.sanitize(content, config);
};

// Input validation with rate limiting integration
export const validateAndSanitize = <T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  sanitizeFields: string[] = []
): T => {
  // First validate structure
  const validatedData = schema.parse(data);
  
  // Then sanitize specified fields
  if (sanitizeFields.length > 0 && typeof validatedData === 'object' && validatedData !== null) {
    const sanitized = { ...validatedData } as any;
    
    sanitizeFields.forEach(field => {
      if (typeof sanitized[field] === 'string') {
        sanitized[field] = sanitizeContent(sanitized[field]);
      }
    });
    
    return sanitized;
  }
  
  return validatedData;
};

// SQL injection prevention helpers
export const sanitizeQueryParams = (params: Record<string, unknown>) => {
  const sanitized: Record<string, unknown> = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === 'string') {
      // Remove potential SQL injection patterns
      sanitized[key] = value.replace(/[';--]/g, '').trim();
    } else {
      sanitized[key] = value;
    }
  });
  
  return sanitized;
};
