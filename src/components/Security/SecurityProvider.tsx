
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { validateEnvironment, generateCSPNonce } from '@/lib/enhancedSecurity';
import { SessionValidator } from '@/lib/enhancedSecurity';

interface SecurityContextType {
  isSecure: boolean;
  nonce: string;
  sessionValid: boolean;
  validateSession: () => Promise<boolean>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider = ({ children }: SecurityProviderProps) => {
  const [isSecure, setIsSecure] = useState(false);
  const [sessionValid, setSessionValid] = useState(false);
  const [nonce] = useState(() => generateCSPNonce());

  const validateSession = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('supabase.auth.token');
      if (!token) {
        setSessionValid(false);
        return false;
      }

      const valid = await SessionValidator.validateSession(token);
      setSessionValid(valid);
      return valid;
    } catch (error) {
      console.error('Session validation error:', error);
      setSessionValid(false);
      return false;
    }
  };

  useEffect(() => {
    const initializeSecurity = async () => {
      try {
        // Validate environment
        validateEnvironment();
        
        // Validate session
        await validateSession();
        
        setIsSecure(true);
      } catch (error) {
        console.error('Security initialization failed:', error);
        setIsSecure(false);
      }
    };

    initializeSecurity();
    
    // Set up periodic session validation
    const interval = setInterval(validateSession, 5 * 60 * 1000); // Every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  const value = {
    isSecure,
    nonce,
    sessionValid,
    validateSession
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};
