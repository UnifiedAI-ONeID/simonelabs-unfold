
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Cleanup function to remove stale auth tokens
const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    try {
      // Clean up any existing auth state first
      cleanupAuthState();
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName || email.split('@')[0],
            full_name: displayName || email.split('@')[0],
          },
        },
      });
      
      if (error) {
        console.error('Signup error:', error);
        return { error };
      }
      
      console.log('Signup successful:', data);
      return { error: null };
    } catch (error) {
      console.error('Signup failed:', error);
      return { error };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log('Global signout attempt failed, continuing...');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Signin error:', error);
        return { error };
      }
      
      console.log('Signin successful:', data);
      return { error: null };
    } catch (error) {
      console.error('Signin failed:', error);
      return { error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log('Signing out...');
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        const { error } = await supabase.auth.signOut({ scope: 'global' });
        if (error) {
          console.error('Signout error:', error);
        }
      } catch (err) {
        console.error('Signout failed:', err);
      }
      
      // Force page refresh for clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error('Signout process failed:', error);
      // Force refresh even if signout fails
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          
          // Handle specific auth events
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('User signed in:', session.user.email);
            // Defer any additional data fetching to prevent deadlocks
            setTimeout(() => {
              // Additional user data can be fetched here if needed
            }, 0);
          } else if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            cleanupAuthState();
          }
        }
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        if (mounted) {
          console.log('Initial session:', session?.user?.email || 'No session');
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Session initialization failed:', error);
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
  }, []);

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
