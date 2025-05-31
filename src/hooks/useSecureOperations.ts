
import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { SessionValidator, AdvancedRateLimiter } from '@/lib/enhancedSecurity';
import { validateAndSanitize, courseContentSchema, discussionContentSchema, reviewContentSchema } from '@/lib/securityValidation';
import { logSecurityEvent } from '@/lib/securityEnhancements';

export const useSecureOperations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const executeSecureOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    operationType: string,
    validation?: {
      data?: unknown;
      schema?: any;
      sanitizeFields?: string[];
    }
  ): Promise<T | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to perform this action.",
        variant: "destructive",
      });
      return null;
    }

    // Rate limiting check
    const rateLimitKey = `${user.id}:${operationType}`;
    if (!AdvancedRateLimiter.checkLimit(rateLimitKey, 10, 60000)) {
      toast({
        title: "Rate limit exceeded",
        description: "Please wait before trying again.",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);

    try {
      // Validate and sanitize input if provided
      let validatedData;
      if (validation?.data && validation?.schema) {
        validatedData = validateAndSanitize(
          validation.data,
          validation.schema,
          validation.sanitizeFields
        );
      }

      // Log operation start
      await logSecurityEvent({
        type: 'OPERATION_START',
        details: `User ${user.id} starting ${operationType}`
      });

      const result = await operation();

      // Log successful operation
      await logSecurityEvent({
        type: 'OPERATION_SUCCESS',
        details: `User ${user.id} completed ${operationType}`
      });

      return result;
    } catch (error: any) {
      // Log failed operation
      await logSecurityEvent({
        type: 'OPERATION_FAILED',
        details: `User ${user.id} failed ${operationType}: ${error.message}`
      });

      toast({
        title: "Operation failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });

      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const createSecureCourse = useCallback((courseData: unknown) => {
    return executeSecureOperation(
      async () => {
        // Implementation would go here - this is just the security wrapper
        console.log('Creating course with validated data');
        return { id: 'new-course-id' };
      },
      'CREATE_COURSE',
      {
        data: courseData,
        schema: courseContentSchema,
        sanitizeFields: ['description']
      }
    );
  }, [executeSecureOperation]);

  const createSecureDiscussion = useCallback((discussionData: unknown) => {
    return executeSecureOperation(
      async () => {
        // Implementation would go here
        console.log('Creating discussion with validated data');
        return { id: 'new-discussion-id' };
      },
      'CREATE_DISCUSSION',
      {
        data: discussionData,
        schema: discussionContentSchema,
        sanitizeFields: ['content', 'title']
      }
    );
  }, [executeSecureOperation]);

  const createSecureReview = useCallback((reviewData: unknown) => {
    return executeSecureOperation(
      async () => {
        // Implementation would go here
        console.log('Creating review with validated data');
        return { id: 'new-review-id' };
      },
      'CREATE_REVIEW',
      {
        data: reviewData,
        schema: reviewContentSchema,
        sanitizeFields: ['content']
      }
    );
  }, [executeSecureOperation]);

  return {
    executeSecureOperation,
    createSecureCourse,
    createSecureDiscussion,
    createSecureReview,
    isLoading
  };
};
