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

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.email);

        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          if (event === 'SIGNED_OUT') {
            await cleanupAuthState();
          }
        }

        // Update state synchronously
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          isAuthenticated: !!session?.user
        });

        // Defer additional operations
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

    // Then check for existing session
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

  const signUp = async (email: string, password: string, confirmPassword: string, role?: string) => {
    try {
      // Rate limiting
      if (!authRateLimiter.canMakeRequest(email)) {
        throw new Error('Too many signup attempts. Please wait before trying again.');
      }

      // Sanitize inputs
      const sanitizedEmail = InputSanitizer.sanitizeText(email).toLowerCase();
      
      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Clean any existing auth state
      await cleanupAuthState();

      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/role-selection`,
          data: role ? { role } : undefined
        }
      });

      if (error) {
        await logSecurityEvent({
          type: 'AUTH_ATTEMPT',
          details: `Signup failed for ${sanitizedEmail}: ${error.message}`
        });
        throw error;
      }

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
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Rate limiting
      if (!authRateLimiter.canMakeRequest(email)) {
        throw new Error('Too many signin attempts. Please wait before trying again.');
      }

      // Sanitize inputs
      const sanitizedEmail = InputSanitizer.sanitizeText(email).toLowerCase();

      // Clean any existing auth state
      await cleanupAuthState();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) {
        await logSecurityEvent({
          type: 'AUTH_ATTEMPT',
          details: `Signin failed for ${sanitizedEmail}: ${error.message}`
        });
        throw error;
      }

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
      await logSecurityEvent({
        type: 'AUTH_ATTEMPT',
        details: 'User initiated signout'
      });

      await cleanupAuthState();
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });

      // Force page refresh for clean state
      window.location.href = '/auth';
    } catch (error: any) {
      console.error('Signout error:', error);
      // Force redirect even if signout fails
      window.location.href = '/auth';
    }
  };

  const getUserRole = () => {
    return authState.user?.user_metadata?.role || 'student';
  };

  const getRoleBasedRedirect = () => {
    const role = getUserRole();
    switch (role) {
      case 'student':
        return '/student';
      case 'educator':
        return '/educator';
      case 'administrator':
        return '/administrator';
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
