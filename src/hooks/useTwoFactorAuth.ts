
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logSecurityEvent } from '@/lib/securityEnhancements';

interface TwoFactorState {
  isRequired: boolean;
  email: string | null;
  sessionId: string | null;
}

export const useTwoFactorAuth = () => {
  const [twoFactorState, setTwoFactorState] = useState<TwoFactorState>({
    isRequired: false,
    email: null,
    sessionId: null
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const initiateTwoFactor = async (email: string, sessionId: string) => {
    try {
      console.log('Initiating 2FA for:', email);
      
      // Call edge function to send 2FA code
      const { data, error } = await supabase.functions.invoke('send-2fa-code', {
        body: { email, sessionId }
      });

      if (error) {
        console.error('2FA initiation error:', error);
        await logSecurityEvent({
          type: 'VALIDATION_FAILURE',
          details: `2FA initiation failed for ${email}: ${error.message}`
        });
        throw new Error('Failed to send verification code. Please try again.');
      }

      console.log('2FA code sent successfully');
      setTwoFactorState({
        isRequired: true,
        email,
        sessionId
      });

      await logSecurityEvent({
        type: 'AUTH_ATTEMPT',
        details: `2FA code sent to ${email}`
      });

      // Show debug code in development
      if (import.meta.env.DEV && data?.debug_code) {
        console.log('Development 2FA Code:', data.debug_code);
        toast({
          title: "Development Mode",
          description: `2FA Code: ${data.debug_code}`,
          duration: 10000,
        });
      }

      return { success: true };
    } catch (error: any) {
      console.error('2FA initiation error:', error);
      throw error;
    }
  };

  const verifyTwoFactorCode = async (code: string): Promise<boolean> => {
    if (!twoFactorState.email || !twoFactorState.sessionId) {
      throw new Error('No active 2FA session');
    }

    setIsVerifying(true);
    
    try {
      console.log('Verifying 2FA code for:', twoFactorState.email);
      
      const { data, error } = await supabase.functions.invoke('verify-2fa-code', {
        body: { 
          email: twoFactorState.email,
          code,
          sessionId: twoFactorState.sessionId
        }
      });

      if (error) {
        console.error('2FA verification error:', error);
        await logSecurityEvent({
          type: 'VALIDATION_FAILURE',
          details: `2FA verification failed for ${twoFactorState.email}: ${error.message}`
        });
        return false;
      }

      const isValid = data?.valid === true;
      
      if (isValid) {
        console.log('2FA verification successful');
        await logSecurityEvent({
          type: 'AUTH_ATTEMPT',
          details: `2FA verification successful for ${twoFactorState.email}`
        });
        
        setTwoFactorState({
          isRequired: false,
          email: null,
          sessionId: null
        });
      } else {
        console.log('2FA verification failed - invalid code');
        await logSecurityEvent({
          type: 'VALIDATION_FAILURE',
          details: `Invalid 2FA code for ${twoFactorState.email}`
        });
        
        if (data?.attemptsRemaining !== undefined) {
          toast({
            title: "Invalid Code",
            description: `${data.attemptsRemaining} attempts remaining`,
            variant: "destructive",
          });
        }
      }

      return isValid;
    } catch (error: any) {
      console.error('2FA verification error:', error);
      await logSecurityEvent({
        type: 'VALIDATION_FAILURE',
        details: `2FA verification error for ${twoFactorState.email}: ${error.message}`
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const resendTwoFactorCode = async () => {
    if (!twoFactorState.email || !twoFactorState.sessionId) {
      throw new Error('No active 2FA session');
    }

    setIsResending(true);
    
    try {
      await initiateTwoFactor(twoFactorState.email, twoFactorState.sessionId);
      
      toast({
        title: "Code Sent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error: any) {
      console.error('2FA resend error:', error);
      throw error;
    } finally {
      setIsResending(false);
    }
  };

  const resetTwoFactor = () => {
    setTwoFactorState({
      isRequired: false,
      email: null,
      sessionId: null
    });
  };

  return {
    twoFactorState,
    isVerifying,
    isResending,
    initiateTwoFactor,
    verifyTwoFactorCode,
    resendTwoFactorCode,
    resetTwoFactor
  };
};
