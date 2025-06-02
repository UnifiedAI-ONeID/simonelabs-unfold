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
      console.log('🧹 [AUTH TEST] Starting auth state cleanup...');
      
      // Clear all possible auth keys
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('supabase.auth.') || 
        key.includes('sb-') ||
        key.includes('auth-token') ||
        key === 'user_id' ||
        key === 'user_role'
      );
      
      keysToRemove.forEach(key => {
        console.log(`🧹 [AUTH TEST] Removing localStorage key: ${key}`);
        localStorage.removeItem(key);
      });
      
      // Also clear session storage
      if (typeof sessionStorage !== 'undefined') {
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith('supabase') || key.includes('auth')) {
            console.log(`🧹 [AUTH TEST] Removing sessionStorage key: ${key}`);
            sessionStorage.removeItem(key);
          }
        });
      }
      
      console.log('✅ [AUTH TEST] Auth state cleanup completed successfully');
    } catch (error) {
      console.warn('⚠️ [AUTH TEST] Error during auth cleanup:', error);
    }
  }, []);

  // Enhanced error message processing
  const processAuthError = useCallback((error: AuthError | Error): AuthResult => {
    const message = error.message.toLowerCase();
    console.log('🔍 [AUTH TEST] Processing auth error:', { originalMessage: error.message, lowercaseMessage: message });
    
    // Rate limit detection
    if (RATE_LIMIT_PATTERNS.some(pattern => message.includes(pattern))) {
      const result = {
        success: false,
        error: 'Rate limit exceeded. Please try again in a few minutes or use a different email address.',
        needsRetry: true
      };
      console.log('⏰ [AUTH TEST] Rate limit detected:', result);
      return result;
    }

    // Weak password detection
    if (WEAK_PASSWORD_PATTERNS.some(pattern => message.includes(pattern))) {
      const result = {
        success: false,
        error: 'Password must be at least 8 characters long and include numbers, letters, and special characters.',
        needsRetry: false
      };
      console.log('🔒 [AUTH TEST] Weak password detected:', result);
      return result;
    }

    // Specific error cases
    if (message.includes('user already registered')) {
      const result = {
        success: false,
        error: 'An account with this email already exists. Please sign in instead.',
        needsRetry: false
      };
      console.log('👤 [AUTH TEST] User already exists:', result);
      return result;
    }

    if (message.includes('invalid login credentials')) {
      const result = {
        success: false,
        error: 'Invalid email or password. Please check your credentials and try again.',
        needsRetry: false
      };
      console.log('🚫 [AUTH TEST] Invalid credentials:', result);
      return result;
    }

    if (message.includes('email not confirmed')) {
      const result = {
        success: false,
        error: 'Please check your email and click the confirmation link before signing in.',
        needsRetry: false
      };
      console.log('📧 [AUTH TEST] Email not confirmed:', result);
      return result;
    }

    if (message.includes('network') || message.includes('fetch')) {
      const result = {
        success: false,
        error: 'Network error. Please check your connection and try again.',
        needsRetry: true
      };
      console.log('🌐 [AUTH TEST] Network error:', result);
      return result;
    }

    // Default error
    const result = {
      success: false,
      error: error.message || 'An unexpected error occurred',
      needsRetry: false
    };
    console.log('❓ [AUTH TEST] Unknown error type:', result);
    return result;
  }, []);

  // Exponential backoff retry logic
  const withRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: Error;
    console.log(`🔄 [AUTH TEST] Starting operation with retry logic (max retries: ${maxRetries})`);
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🎯 [AUTH TEST] Attempt ${attempt + 1}/${maxRetries + 1}`);
        const result = await operation();
        console.log(`✅ [AUTH TEST] Operation succeeded on attempt ${attempt + 1}`);
        return result;
      } catch (error: any) {
        lastError = error;
        console.log(`❌ [AUTH TEST] Attempt ${attempt + 1} failed:`, error.message);
        
        // Don't retry on certain errors
        const result = processAuthError(error);
        if (!result.needsRetry || attempt === maxRetries) {
          console.log(`🛑 [AUTH TEST] Not retrying (needsRetry: ${result.needsRetry}, isLastAttempt: ${attempt === maxRetries})`);
          throw error;
        }
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`⏳ [AUTH TEST] Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }, [processAuthError]);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    console.log('🚀 [AUTH TEST] Starting auth initialization...');

    const initializeAuth = async () => {
      try {
        console.log('🔍 [AUTH TEST] Checking for existing session...');
        
        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) {
          console.log('⚠️ [AUTH TEST] Component unmounted, aborting init');
          return;
        }

        if (error) {
          console.error('❌ [AUTH TEST] Session check error:', error);
          cleanupAuthState();
          setAuthState(prev => ({ ...prev, loading: false }));
          return;
        }

        if (session?.user) {
          console.log('✅ [AUTH TEST] Found existing session:', {
            userId: session.user.id,
            email: session.user.email,
            role: session.user.user_metadata?.role,
            sessionExpiry: session.expires_at
          });
          
          // Ensure profile exists
          console.log('👤 [AUTH TEST] Ensuring user profile exists...');
          await ensureUserProfile(session.user.id, session.user.email || '');
          console.log('✅ [AUTH TEST] User profile ensured');
          
          if (mounted) {
            setAuthState({
              user: session.user,
              session,
              loading: false,
              isAuthenticated: true,
              retryCount: 0
            });
            console.log('✅ [AUTH TEST] Auth state updated with existing session');
          }
        } else {
          console.log('ℹ️ [AUTH TEST] No existing session found');
          if (mounted) {
            setAuthState({
              user: null,
              session: null,
              loading: false,
              isAuthenticated: false,
              retryCount: 0
            });
            console.log('✅ [AUTH TEST] Auth state updated (no session)');
          }
        }
      } catch (error: any) {
        console.error('💥 [AUTH TEST] Auth initialization error:', error);
        if (mounted) {
          cleanupAuthState();
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }
    };

    // Set up auth state listener
    console.log('👂 [AUTH TEST] Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 [AUTH TEST] Auth state change detected:', {
        event,
        userId: session?.user?.id,
        email: session?.user?.email,
        role: session?.user?.user_metadata?.role,
        hasSession: !!session
      });
      
      if (!mounted) {
        console.log('⚠️ [AUTH TEST] Component unmounted, ignoring auth state change');
        return;
      }

      try {
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('👋 [AUTH TEST] User signed in, processing...');
          
          // Defer profile creation to avoid blocking
          setTimeout(async () => {
            console.log('👤 [AUTH TEST] Creating/updating user profile...');
            await ensureUserProfile(session.user.id, session.user.email || '');
            console.log('✅ [AUTH TEST] User profile created/updated');
          }, 0);
          
          setAuthState({
            user: session.user,
            session,
            loading: false,
            isAuthenticated: true,
            retryCount: 0
          });
          console.log('✅ [AUTH TEST] Auth state updated for signed in user');
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 [AUTH TEST] User signed out, cleaning up...');
          cleanupAuthState();
          setAuthState({
            user: null,
            session: null,
            loading: false,
            isAuthenticated: false,
            retryCount: 0
          });
          console.log('✅ [AUTH TEST] Auth state cleaned up after sign out');
        } else if (event === 'TOKEN_REFRESHED' && session) {
          console.log('🔄 [AUTH TEST] Token refreshed successfully');
          setAuthState(prev => ({
            ...prev,
            session,
            user: session.user,
            loading: false
          }));
        } else {
          console.log(`ℹ️ [AUTH TEST] Other auth event: ${event}`);
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error: any) {
        console.error('💥 [AUTH TEST] Auth state change error:', error);
        if (mounted) {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }
    });

    initializeAuth();

    return () => {
      console.log('🧹 [AUTH TEST] Cleaning up auth hook...');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [cleanupAuthState]);

  // Sign up with robust error handling
  const signUp = useCallback(async (email: string, password: string, confirmPassword?: string) => {
    try {
      console.log('🚀 [AUTH TEST] Starting signup process:', { email, hasPassword: !!password, hasConfirmPassword: !!confirmPassword });
      
      if (password !== confirmPassword) {
        const error = 'Passwords do not match';
        console.log('❌ [AUTH TEST] Password mismatch');
        toast({
          title: "Sign up failed",
          description: error,
          variant: "destructive",
        });
        return { error: { message: error } };
      }

      // Clean up any existing state first
      console.log('🧹 [AUTH TEST] Cleaning up auth state before signup...');
      cleanupAuthState();
      
      const result = await withRetry(async () => {
        console.log('📤 [AUTH TEST] Sending signup request to Supabase...');
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { role: 'student' }
          }
        });

        if (error) {
          console.error('❌ [AUTH TEST] Supabase signup error:', error);
          throw error;
        }
        
        console.log('✅ [AUTH TEST] Supabase signup response:', {
          hasUser: !!data.user,
          hasSession: !!data.session,
          userId: data.user?.id,
          email: data.user?.email,
          needsConfirmation: !data.session && !!data.user
        });
        
        return data;
      });

      console.log('✅ [AUTH TEST] Signup successful:', { email: result.user?.email, userId: result.user?.id });
      
      if (result.user && !result.session) {
        console.log('📧 [AUTH TEST] Email verification required');
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account before signing in.",
        });
      } else {
        console.log('🎉 [AUTH TEST] User automatically signed in');
        toast({
          title: "Account created successfully!",
          description: "Welcome to our platform!",
        });
      }

      return { data: result };
    } catch (error: any) {
      console.error('❌ [AUTH TEST] Signup error:', error);
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
      console.log('🔐 [AUTH TEST] Starting signin process:', { email, hasPassword: !!password });
      
      // Clean up any existing state first
      console.log('🧹 [AUTH TEST] Cleaning up auth state before signin...');
      cleanupAuthState();
      
      const result = await withRetry(async () => {
        console.log('📤 [AUTH TEST] Sending signin request to Supabase...');
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          console.error('❌ [AUTH TEST] Supabase signin error:', error);
          throw error;
        }
        
        console.log('✅ [AUTH TEST] Supabase signin response:', {
          hasUser: !!data.user,
          hasSession: !!data.session,
          userId: data.user?.id,
          email: data.user?.email,
          role: data.user?.user_metadata?.role
        });
        
        return data;
      });

      console.log('✅ [AUTH TEST] Signin successful:', { email: result.user?.email, userId: result.user?.id });
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      return { data: result };
    } catch (error: any) {
      console.error('❌ [AUTH TEST] Signin error:', error);
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
      console.log('👋 [AUTH TEST] Starting signout process...');
      
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      console.log('✅ [AUTH TEST] Supabase signout completed');
      
      // Clean up local state
      cleanupAuthState();
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      console.log('✅ [AUTH TEST] Signout process completed');
    } catch (error: any) {
      console.error('💥 [AUTH TEST] Signout error:', error);
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
      console.log('🔑 [AUTH TEST] Starting password reset:', { email });
      
      const result = await withRetry(async () => {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;
        return true;
      });

      console.log('✅ [AUTH TEST] Password reset email sent:', { email });
      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions to reset your password.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('❌ [AUTH TEST] Password reset error:', error);
      const errorResult = processAuthError(error);
      
      toast({
        title: "Password reset failed",
        description: errorResult.error,
        variant: "destructive",
      });
      
      return { error: { message: errorResult.error } };
    }
  }, [withRetry, processAuthError, toast]);

  console.log('📊 [AUTH TEST] Current auth state:', {
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    hasUser: !!authState.user,
    hasSession: !!authState.session,
    userId: authState.user?.id,
    email: authState.user?.email,
    role: authState.user?.user_metadata?.role,
    retryCount: authState.retryCount
  });

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    cleanupAuthState
  };
};
