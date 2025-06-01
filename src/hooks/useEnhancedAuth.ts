
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

export const useEnhancedAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false
  });
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.email);

        if (event === 'SIGNED_OUT') {
          await cleanupAuthState();
        }

        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          isAuthenticated: !!session?.user
        });

        if (session?.user && event === 'SIGNED_IN') {
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
          setAuthState({
            user: session?.user ?? null,
            session,
            loading: false,
            isAuthenticated: !!session?.user
          });

          if (session?.user) {
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
  }, []);

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

      // Validate CAPTCHA token if provided
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
        description: "Please check your email to verify your account.",
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

      // Validate CAPTCHA token if provided
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

      console.log('Signin successful:', data);
      await logSecurityEvent({
        type: 'AUTH_ATTEMPT',
        details: `Successful signin for ${sanitizedEmail}`
      });

      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Signin process error:', error);
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting signout process...');
      await logSecurityEvent({
        type: 'AUTH_ATTEMPT',
        details: 'User initiated signout'
      });

      await cleanupAuthState();
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });

      // Fixed: Redirect to signin instead of auth to prevent loops
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
    signUp,
    signIn,
    signOut,
    getUserRole,
    getRoleBasedRedirect
  };
};
