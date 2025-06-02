
import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ensureUserProfile } from '@/lib/authDatabaseFix';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  retryCount: number;
}

interface AuthResult {
  success: boolean;
  error?: string;
  needsRetry?: boolean;
}

// Rate limit detection patterns
const RATE_LIMIT_PATTERNS = [
  'email rate limit',
  'over_email_send_rate_limit',
  'rate limit exceeded',
  'too many requests',
  'signup is disabled'
];

// Weak password patterns  
const WEAK_PASSWORD_PATTERNS = [
  'password should be at least',
  'password is too weak',
  'password must be'
];

export const useBulletproofAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
    retryCount: 0
  });
  const { toast } = useToast();

  // Clean up auth state completely
  const cleanupAuthState = useCallback(() => {
    try {
      // Clear all possible auth keys
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('supabase.auth.') || 
        key.includes('sb-') ||
        key.includes('auth-token') ||
        key === 'user_id' ||
        key === 'user_role'
      );
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Also clear session storage
      if (typeof sessionStorage !== 'undefined') {
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith('supabase') || key.includes('auth')) {
            sessionStorage.removeItem(key);
          }
        });
      }
      
      console.log('🧹 Auth state cleaned up');
    } catch (error) {
      console.warn('⚠️ Error during auth cleanup:', error);
    }
  }, []);

  // Enhanced error message processing
  const processAuthError = useCallback((error: AuthError | Error): AuthResult => {
    const message = error.message.toLowerCase();
    
    // Rate limit detection
    if (RATE_LIMIT_PATTERNS.some(pattern => message.includes(pattern))) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again in a few minutes or use a different email address.',
        needsRetry: true
      };
    }

    // Weak password detection
    if (WEAK_PASSWORD_PATTERNS.some(pattern => message.includes(pattern))) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long and include numbers, letters, and special characters.',
        needsRetry: false
      };
    }

    // Specific error cases
    if (message.includes('user already registered')) {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in instead.',
        needsRetry: false
      };
    }

    if (message.includes('invalid login credentials')) {
      return {
        success: false,
        error: 'Invalid email or password. Please check your credentials and try again.',
        needsRetry: false
      };
    }

    if (message.includes('email not confirmed')) {
      return {
        success: false,
        error: 'Please check your email and click the confirmation link before signing in.',
        needsRetry: false
      };
    }

    if (message.includes('network') || message.includes('fetch')) {
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
        needsRetry: true
      };
    }

    // Default error
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      needsRetry: false
    };
  }, []);

  // Exponential backoff retry logic
  const withRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        
        // Don't retry on certain errors
        const result = processAuthError(error);
        if (!result.needsRetry || attempt === maxRetries) {
          throw error;
        }
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`🔄 Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }, [processAuthError]);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing bulletproof auth...');
        
        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('❌ Session check error:', error);
          cleanupAuthState();
          setAuthState(prev => ({ ...prev, loading: false }));
          return;
        }

        if (session?.user) {
          console.log('✅ Found existing session for:', session.user.email);
          // Ensure profile exists
          await ensureUserProfile(session.user.id, session.user.email || '');
          
          if (mounted) {
            setAuthState({
              user: session.user,
              session,
              loading: false,
              isAuthenticated: true,
              retryCount: 0
            });
          }
        } else {
          console.log('ℹ️ No existing session found');
          if (mounted) {
            setAuthState({
              user: null,
              session: null,
              loading: false,
              isAuthenticated: false,
              retryCount: 0
            });
          }
        }
      } catch (error: any) {
        console.error('💥 Auth initialization error:', error);
        if (mounted) {
          cleanupAuthState();
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.email);
      
      if (!mounted) return;

      try {
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in, ensuring profile...');
          // Defer profile creation to avoid blocking
          setTimeout(async () => {
            await ensureUserProfile(session.user.id, session.user.email || '');
          }, 0);
          
          setAuthState({
            user: session.user,
            session,
            loading: false,
            isAuthenticated: true,
            retryCount: 0
          });
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          cleanupAuthState();
          setAuthState({
            user: null,
            session: null,
            loading: false,
            isAuthenticated: false,
            retryCount: 0
          });
        } else if (event === 'TOKEN_REFRESHED' && session) {
          console.log('🔄 Token refreshed');
          setAuthState(prev => ({
            ...prev,
            session,
            user: session.user,
            loading: false
          }));
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error: any) {
        console.error('💥 Auth state change error:', error);
        if (mounted) {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [cleanupAuthState]);

  // Sign up with robust error handling
  const signUp = useCallback(async (email: string, password: string, confirmPassword?: string) => {
    try {
      console.log('🚀 Starting bulletproof signup for:', email);
      
      if (password !== confirmPassword) {
        const error = 'Passwords do not match';
        toast({
          title: "Sign up failed",
          description: error,
          variant: "destructive",
        });
        return { error: { message: error } };
      }

      // Clean up any existing state first
      cleanupAuthState();
      
      const result = await withRetry(async () => {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { role: 'student' }
          }
        });

        if (error) throw error;
        return data;
      });

      console.log('✅ Signup successful for:', result.user?.email);
      
      if (result.user && !result.session) {
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account before signing in.",
        });
      } else {
        toast({
          title: "Account created successfully!",
          description: "Welcome to our platform!",
        });
      }

      return { data: result };
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      const errorResult = processAuthError(error);
      
      toast({
        title: "Sign up failed",
        description: errorResult.error,
        variant: "destructive",
      });
      
      setAuthState(prev => ({ 
        ...prev, 
        retryCount: prev.retryCount + 1 
      }));
      
      return { error: { message: errorResult.error } };
    }
  }, [cleanupAuthState, withRetry, processAuthError, toast]);

  // Sign in with robust error handling
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 Starting bulletproof signin for:', email);
      
      // Clean up any existing state first
      cleanupAuthState();
      
      const result = await withRetry(async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;
        return data;
      });

      console.log('✅ Signin successful for:', result.user?.email);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      return { data: result };
    } catch (error: any) {
      console.error('❌ Signin error:', error);
      const errorResult = processAuthError(error);
      
      toast({
        title: "Sign in failed",
        description: errorResult.error,
        variant: "destructive",
      });
      
      setAuthState(prev => ({ 
        ...prev, 
        retryCount: prev.retryCount + 1 
      }));
      
      return { error: { message: errorResult.error } };
    }
  }, [cleanupAuthState, withRetry, processAuthError, toast]);

  // Sign out with complete cleanup
  const signOut = useCallback(async () => {
    try {
      console.log('👋 Starting bulletproof signout...');
      
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clean up local state
      cleanupAuthState();
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      console.error('💥 Signout error:', error);
      // Still clean up even if signout fails
      cleanupAuthState();
      
      toast({
        title: "Sign out completed",
        description: "You have been signed out.",
      });
    }
  }, [cleanupAuthState, toast]);

  // Password reset with retry logic
  const resetPassword = useCallback(async (email: string) => {
    try {
      console.log('🔑 Starting password reset for:', email);
      
      const result = await withRetry(async () => {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;
        return true;
      });

      console.log('✅ Password reset email sent for:', email);
      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions to reset your password.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('❌ Password reset error:', error);
      const errorResult = processAuthError(error);
      
      toast({
        title: "Password reset failed",
        description: errorResult.error,
        variant: "destructive",
      });
      
      return { error: { message: errorResult.error } };
    }
  }, [withRetry, processAuthError, toast]);

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    cleanupAuthState
  };
};
