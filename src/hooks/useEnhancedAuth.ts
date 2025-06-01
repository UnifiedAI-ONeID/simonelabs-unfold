
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedSessionSecurity } from '@/lib/enhancedSessionSecurity';
import { logSecurityEvent } from '@/lib/securityEnhancements';
import { useToast } from '@/hooks/use-toast';

interface EnhancedAuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  sessionId?: string;
  role?: string;
  pendingAuth?: { email: string; sessionId: string };
}

export const useEnhancedAuth = () => {
  const [authState, setAuthState] = useState<EnhancedAuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false
  });
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          await logSecurityEvent({
            type: 'SESSION_VALIDATION_ERROR',
            details: `Failed to get initial session: ${error.message}`
          });
          setAuthState(prev => ({ ...prev, loading: false }));
          return;
        }

        if (session?.user) {
          await handleAuthStateChange('SIGNED_IN', session);
        } else {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            isAuthenticated: false
          });
        }
      } catch (error: any) {
        console.error('Error in getInitialSession:', error);
        await logSecurityEvent({
          type: 'SESSION_VALIDATION_ERROR',
          details: `Unexpected error getting session: ${error.message}`
        });
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      await handleAuthStateChange(event, session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthStateChange = async (event: string, session: Session | null) => {
    try {
      if (event === 'SIGNED_IN' && session?.user) {
        const role = session.user.user_metadata?.role || 'student';
        const ipAddress = await getClientIP();
        
        // Create secure session
        const sessionId = await EnhancedSessionSecurity.createSecureSession(
          session.user.id,
          role,
          ipAddress
        );

        // Store user info in localStorage for session management
        localStorage.setItem('user_id', session.user.id);
        localStorage.setItem('user_role', role);

        setAuthState({
          user: session.user,
          session,
          loading: false,
          isAuthenticated: true,
          sessionId,
          role
        });

        await logSecurityEvent({
          type: 'LOGIN',
          details: `User ${session.user.email} signed in with role ${role}`
        });

      } else if (event === 'SIGNED_OUT') {
        // Clean up enhanced session
        const userId = localStorage.getItem('user_id');
        if (userId) {
          await EnhancedSessionSecurity.terminateAllUserSessions(userId);
        }

        // Clear localStorage
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_role');

        setAuthState({
          user: null,
          session: null,
          loading: false,
          isAuthenticated: false
        });

        await logSecurityEvent({
          type: 'LOGOUT',
          details: 'User signed out'
        });

      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Validate enhanced session on token refresh
        if (authState.sessionId) {
          const validation = await EnhancedSessionSecurity.validateSession(
            authState.sessionId,
            session.user.id
          );

          if (!validation.isValid) {
            await supabase.auth.signOut();
            return;
          }
        }

        setAuthState(prev => ({
          ...prev,
          session,
          user: session.user,
          loading: false
        }));
      } else {
        setAuthState({
          user: null,
          session: null,
          loading: false,
          isAuthenticated: false
        });
      }
    } catch (error: any) {
      console.error('Error handling auth state change:', error);
      await logSecurityEvent({
        type: 'SESSION_VALIDATION_ERROR',
        details: `Error handling auth state change: ${error.message}`
      });
      
      setAuthState({
        user: null,
        session: null,
        loading: false,
        isAuthenticated: false
      });
    }
  };

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || '127.0.0.1';
    } catch {
      return '127.0.0.1';
    }
  };

  const signIn = async (email: string, password: string, captchaToken?: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      // Check if 2FA is required (this would be handled by your 2FA system)
      const requires2FA = data.user?.user_metadata?.requires_2fa;
      if (requires2FA) {
        const sessionId = crypto.randomUUID();
        setAuthState(prev => ({
          ...prev,
          pendingAuth: { email, sessionId }
        }));
        return { data: { requires2FA: true, sessionId, user: data.user } };
      }

      return { data };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error: { message: error.message } };
    }
  };

  const signUp = async (email: string, password: string, confirmPassword?: string, captchaToken?: string) => {
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            role: 'student'
          }
        }
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });

      return { data };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error: { message: error.message } };
    }
  };

  const complete2FA = async () => {
    // This would complete the 2FA process and sign in the user
    if (authState.pendingAuth) {
      setAuthState(prev => ({
        ...prev,
        pendingAuth: undefined
      }));
    }
  };

  const signOut = async () => {
    try {
      const userId = authState.user?.id;
      
      // Terminate enhanced sessions first
      if (userId) {
        await EnhancedSessionSecurity.terminateAllUserSessions(userId);
      }

      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
    } catch (error: any) {
      console.error('Error signing out:', error);
      await logSecurityEvent({
        type: 'LOGOUT',
        details: `Error during signout: ${error.message}`
      });
    }
  };

  const validateCurrentSession = async (): Promise<boolean> => {
    if (!authState.sessionId || !authState.user) {
      return false;
    }

    const validation = await EnhancedSessionSecurity.validateSession(
      authState.sessionId,
      authState.user.id
    );

    if (!validation.isValid) {
      await signOut();
      return false;
    }

    return true;
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    complete2FA,
    validateCurrentSession
  };
};
