import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
  updatePassword: async () => ({ error: null }),
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    try {
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || email.split('@')[0],
            full_name: displayName || email.split('@')[0],
          },
        },
      });
      
      if (error) {
        console.error('Signup error:', { 
          message: error.message,
          status: error.status,
          code: error.code,
          details: error 
        });
        return { error };
      }
      
      console.log('Signup successful:', data);
      return { error: null };
    } catch (error: any) {
      console.error('Signup process failed:', {
        message: error.message,
        stack: error.stack,
        details: error
      });
      return { error };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Global signout attempt failed, continuing...');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Signin error:', {
          message: error.message,
          status: error.status,
          code: error.code,
          details: error
        });
        return { error };
      }
      
      console.log('Signin successful:', data);
      return { error: null };
    } catch (error: any) {
      console.error('Signin process failed:', {
        message: error.message,
        stack: error.stack,
        details: error
      });
      return { error };
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', {
          message: error.message,
          status: error.status,
          code: error.code,
          details: error
        });
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Password reset process failed:', {
        message: error.message,
        stack: error.stack,
        details: error
      });
      return { error };
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Password update error:', {
          message: error.message,
          status: error.status,
          code: error.code,
          details: error
        });
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Password update process failed:', {
        message: error.message,
        stack: error.stack,
        details: error
      });
      return { error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log('Signing out...');
      cleanupAuthState();
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('Signout error:', {
          message: error.message,
          status: error.status,
          code: error.code,
          details: error
        });
        toast({
          title: "Error signing out",
          description: "Please try again",
          variant: "destructive",
        });
      }
      
      window.location.href = '/';
    } catch (error: any) {
      console.error('Signout process failed:', {
        message: error.message,
        stack: error.stack,
        details: error
      });
      window.location.href = '/';
    }
  }, [toast]);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          
          if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            cleanupAuthState();
          } else if (event === 'SIGNED_IN') {
            toast({
              title: "Welcome back!",
              description: `Signed in as ${session?.user?.email}`,
            });
          } else if (event === 'PASSWORD_RECOVERY') {
            toast({
              title: "Password Recovery",
              description: "Please check your email for password reset instructions.",
            });
          }
        }
      }
    );

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', {
            message: error.message,
            status: error.status,
            code: error.code,
            details: error
          });
        }
        if (mounted) {
          console.log('Initial session:', session?.user?.email || 'No session');
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error: any) {
        console.error('Session initialization failed:', {
          message: error.message,
          stack: error.stack,
          details: error
        });
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};