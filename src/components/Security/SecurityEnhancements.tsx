
import { logSecurityEvent, secureOperation, authRateLimiter } from '@/lib/securityEnhancements';
import { CSRFProtection } from '@/lib/csrf';

export const useSecurityOperations = () => {
  const performSecureAuthOperation = async (operation: () => Promise<any>, userEmail: string) => {
    return secureOperation(operation, {
      rateLimiter: authRateLimiter,
      identifier: userEmail,
      requireAuth: false,
      requireCSRF: true
    });
  };

  const initializeCSRF = () => {
    return CSRFProtection.generateToken();
  };

  const validateCSRF = (token: string) => {
    return CSRFProtection.validateToken(token);
  };

  const logAuthAttempt = async (email: string, success: boolean, details?: string) => {
    await logSecurityEvent({
      type: 'AUTH_ATTEMPT',
      details: `${success ? 'Successful' : 'Failed'} authentication for ${email}${details ? `: ${details}` : ''}`
    });
  };

  return {
    performSecureAuthOperation,
    initializeCSRF,
    validateCSRF,
    logAuthAttempt
  };
};
