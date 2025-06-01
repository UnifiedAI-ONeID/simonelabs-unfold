
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validatePassword } from '@/lib/enhancedPasswordValidation';
import { cleanupAuthState, validateSessionSecurity } from '@/lib/enhancedAuthCleanup';
import { InputSanitizer } from '@/lib/enhancedInputSanitization';
import { logSecurityEvent, authRateLimiter } from '@/lib/securityEnhancements';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface PendingAuth {
  email: string;
  sessionId: string;
  tempSession: any;
}

export const useEnhancedAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false
  });
  const [pendingAuth, setPendingAuth] = useState<PendingAuth | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.email);

        // Only set authenticated state if we have a session and no pending 2FA
        if (event === 'SIGNED_OUT') {
          await cleanupAuthState();
          setPendingAuth(null);
        }

        // Only consider user fully authenticated if not pending 2FA
        const isFullyAuthenticated = !!session?.user && !pendingAuth;

        setAuthState({
          user: isFullyAuthenticated ? session?.user ?? null : null,
          session: isFullyAuthenticated ? session : null,
          loading: false,
          isAuthenticated: isFullyAuthenticated
        });

        if (session?.user && event === 'SIGNED_IN' && !pendingAuth) {
          setTimeout(async () => {
            if (mounted) {
              const isValid = await validateSessionSecurity();
              if (!isValid) {
                await signOut();
              }
            }
          }, 100);
        }
      }
    );

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session initialization error:', error);
          await cleanupAuthState();
        }

        if (mounted) {
          // Only consider authenticated if we have a session and no pending auth
          const isFullyAuthenticated = !!session?.user && !pendingAuth;
          
          setAuthState({
            user: isFullyAuthenticated ? session?.user ?? null : null,
            session: isFullyAuthenticated ? session : null,
            loading: false,
            isAuthenticated: isFullyAuthenticated
          });

          if (session?.user && !pendingAuth) {
            const isValid = await validateSessionSecurity();
            if (!isValid && mounted) {
              setAuthState(prev => ({ ...prev, user: null, session: null, isAuthenticated: false }));
            }
          }
        }
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setAuthState({ user: null, session: null, loading: false, isAuthenticated: false });
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [pendingAuth]);

  const validateCaptcha = async (token: string): Promise<boolean> => {
    if (!token) {
      console.error('No CAPTCHA token provided');
      return false;
    }

    try {
      console.log('Validating CAPTCHA token...');
      const { data, error } = await supabase.functions.invoke('validate-captcha', {
        body: { token },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (error) {
        console.error('CAPTCHA validation error:', error);
        await logSecurityEvent({
          type: 'VALIDATION_FAILURE',
          details: `CAPTCHA validation failed: ${error.message}`
        });
        return false;
      }

      console.log('CAPTCHA validation response:', data);
      const isValid = data?.success === true;
      
      if (!isValid) {
        console.error('CAPTCHA validation returned false:', data);
        await logSecurityEvent({
          type: 'VALIDATION_FAILURE',
          details: `CAPTCHA validation returned false: ${JSON.stringify(data)}`
        });
      } else {
        console.log('CAPTCHA validation successful');
      }
      
      return isValid;
    } catch (error) {
      console.error('CAPTCHA validation network error:', error);
      await logSecurityEvent({
        type: 'VALIDATION_FAILURE',
        details: 'CAPTCHA validation network error'
      });
      return false;
    }
  };

  const signUp = async (email: string, password: string, confirmPassword: string, captchaToken?: string, role?: string) => {
    try {
      console.log('Starting signup process for:', email);
      
      if (!authRateLimiter.canMakeRequest(email)) {
        throw new Error('Too many signup attempts. Please wait before trying again.');
      }

      const sanitizedEmail = InputSanitizer.sanitizeText(email).toLowerCase();
      
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (captchaToken) {
        console.log('Validating CAPTCHA for signup...');
        const isCaptchaValid = await validateCaptcha(captchaToken);
        if (!isCaptchaValid) {
          throw new Error('CAPTCHA verification failed. Please complete the verification and try again.');
        }
        console.log('CAPTCHA validation passed for signup');
      } else {
        throw new Error('CAPTCHA verification is required');
      }

      await cleanupAuthState();

      console.log('Calling Supabase signUp...');
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/role-selection`,
          data: role ? { role } : undefined
        }
      });

      if (error) {
        console.error('Supabase signup error:', error);
        await logSecurityEvent({
          type: 'AUTH_ATTEMPT',
          details: `Signup failed for ${sanitizedEmail}: ${error.message}`
        });
        throw error;
      }

      console.log('Signup successful:', data);
      await logSecurityEvent({
        type: 'AUTH_ATTEMPT',
        details: `Successful signup for ${sanitizedEmail}`
      });

      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account before signing in.",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Signup process error:', error);
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string, captchaToken?: string) => {
    try {
      console.log('Starting signin process for:', email);
      
      if (!authRateLimiter.canMakeRequest(email)) {
        throw new Error('Too many signin attempts. Please wait before trying again.');
      }

      const sanitizedEmail = InputSanitizer.sanitizeText(email).toLowerCase();

      if (captchaToken) {
        console.log('Validating CAPTCHA for signin...');
        const isCaptchaValid = await validateCaptcha(captchaToken);
        if (!isCaptchaValid) {
          throw new Error('CAPTCHA verification failed. Please complete the verification and try again.');
        }
        console.log('CAPTCHA validation passed for signin');
      } else {
        throw new Error('CAPTCHA verification is required');
      }

      await cleanupAuthState();

      console.log('Calling Supabase signInWithPassword...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) {
        console.error('Supabase signin error:', error);
        await logSecurityEvent({
          type: 'AUTH_ATTEMPT',
          details: `Signin failed for ${sanitizedEmail}: ${error.message}`
        });
        throw error;
      }

      if (data.user) {
        // Store pending auth state - user is not fully authenticated until 2FA
        const sessionId = crypto.randomUUID();
        setPendingAuth({
          email: sanitizedEmail,
          sessionId,
          tempSession: data.session
        });

        console.log('Initial signin successful, setting up 2FA for:', sanitizedEmail);
        await logSecurityEvent({
          type: 'AUTH_ATTEMPT',
          details: `Initial signin successful for ${sanitizedEmail} - 2FA required`
        });

        // Immediately sign out to prevent unauthorized access
        await supabase.auth.signOut();

        return { 
          data: { 
            ...data, 
            requires2FA: true,
            sessionId 
          }, 
          error: null 
        };
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Signin process error:', error);
      setPendingAuth(null);
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const complete2FA = async () => {
    if (!pendingAuth) {
      throw new Error('No pending authentication found');
    }

    try {
      console.log('Completing 2FA authentication for:', pendingAuth.email);
      
      // Re-authenticate the user with the stored session
      const { data, error } = await supabase.auth.setSession(pendingAuth.tempSession);
      
      if (error) {
        throw error;
      }

      // Clear pending auth state
      setPendingAuth(null);

      await logSecurityEvent({
        type: 'AUTH_ATTEMPT',
        details: `2FA authentication completed successfully for ${pendingAuth.email}`
      });

      toast({
        title: "Sign in successful!",
        description: "Two-factor authentication completed successfully.",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('2FA completion error:', error);
      setPendingAuth(null);
      await logSecurityEvent({
        type: 'AUTH_ATTEMPT',
        details: `2FA completion failed for ${pendingAuth?.email}: ${error.message}`
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting signout process...');
      await logSecurityEvent({
        type: 'AUTH_ATTEMPT',
        details: 'User initiated signout'
      });

      setPendingAuth(null);
      await cleanupAuthState();
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });

      window.location.href = '/signin';
    } catch (error: any) {
      console.error('Signout error:', error);
      window.location.href = '/signin';
    }
  };

  const getUserRole = () => {
    return authState.user?.user_metadata?.role || 'user';
  };

  const getRoleBasedRedirect = () => {
    const role = getUserRole();
    switch (role) {
      case 'student':
        return '/student';
      case 'educator':
        return '/educator';
      case 'admin':
      case 'superuser':
        return '/administration';
      default:
        return '/dashboard';
    }
  };

  return {
    ...authState,
    pendingAuth,
    signUp,
    signIn,
    signOut,
    complete2FA,
    getUserRole,
    getRoleBasedRedirect
  };
};
