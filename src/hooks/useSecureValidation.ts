
import { useState, useCallback } from 'react';
import { z } from 'zod';
import { 
  sanitizeHtmlContent, 
  sanitizeTextContent, 
  sanitizeJsonContent,
  validateFileUpload 
} from '@/lib/enhancedInputValidation';
import { useToast } from '@/hooks/use-toast';
import { logSecurityEvent } from '@/lib/securityEnhancements';

interface ValidationError {
  field: string;
  message: string;
}

interface UseSecureValidationReturn {
  validate: <T>(data: unknown, schema: z.ZodSchema<T>) => Promise<{ success: true; data: T } | { success: false; errors: ValidationError[] }>;
  sanitizeInput: (input: string, type?: 'text' | 'html' | 'json') => string;
  validateFile: (file: File, allowedTypes: string[], maxSize: number) => { isValid: boolean; errors: string[] };
  isValidating: boolean;
}

export const useSecureValidation = (): UseSecureValidationReturn => {
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validate = useCallback(async <T>(
    data: unknown, 
    schema: z.ZodSchema<T>
  ): Promise<{ success: true; data: T } | { success: false; errors: ValidationError[] }> => {
    setIsValidating(true);
    
    try {
      // Pre-sanitize string fields in the data
      const sanitizedData = sanitizeDataObject(data);
      
      // Validate against schema
      const result = schema.safeParse(sanitizedData);
      
      if (result.success) {
        await logSecurityEvent({
          type: 'VALIDATION_SUCCESS',
          details: 'Input validation passed successfully'
        });
        
        return { success: true, data: result.data };
      } else {
        const errors: ValidationError[] = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        await logSecurityEvent({
          type: 'VALIDATION_FAILURE',
          details: `Input validation failed: ${errors.map(e => e.message).join(', ')}`
        });
        
        toast({
          title: "Validation Error",
          description: "Please check your input and try again.",
          variant: "destructive",
        });
        
        return { success: false, errors };
      }
    } catch (error: any) {
      await logSecurityEvent({
        type: 'VALIDATION_FAILURE',
        details: `Validation error: ${error.message}`
      });
      
      return { 
        success: false, 
        errors: [{ field: 'general', message: 'Validation failed' }] 
      };
    } finally {
      setIsValidating(false);
    }
  }, [toast]);

  const sanitizeInput = useCallback((input: string, type: 'text' | 'html' | 'json' = 'text'): string => {
    switch (type) {
      case 'html':
        return sanitizeHtmlContent(input);
      case 'json':
        try {
          const parsed = JSON.parse(input);
          return JSON.stringify(sanitizeJsonContent(parsed));
        } catch {
          return sanitizeTextContent(input);
        }
      default:
        return sanitizeTextContent(input);
    }
  }, []);

  const validateFile = useCallback((
    file: File, 
    allowedTypes: string[], 
    maxSize: number
  ): { isValid: boolean; errors: string[] } => {
    const result = validateFileUpload(file, allowedTypes, maxSize);
    
    if (!result.isValid) {
      logSecurityEvent({
        type: 'VALIDATION_FAILURE',
        details: `File validation failed: ${result.errors.join(', ')}`
      });
    }
    
    return result;
  }, []);

  return {
    validate,
    sanitizeInput,
    validateFile,
    isValidating
  };
};

// Helper function to sanitize object data recursively
const sanitizeDataObject = (data: unknown): unknown => {
  if (typeof data === 'string') {
    return sanitizeTextContent(data);
  } else if (Array.isArray(data)) {
    return data.map(item => sanitizeDataObject(item));
  } else if (data && typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeDataObject(value);
    }
    return sanitized;
  }
  return data;
};
