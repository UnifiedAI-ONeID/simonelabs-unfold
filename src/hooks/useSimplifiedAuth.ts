
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ensureUserProfile } from '@/lib/authDatabaseFix';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export const useSimplifiedAuth = () => {
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.email);
      
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ User signed in, ensuring profile...');
        // Ensure user profile exists
        await ensureUserProfile(session.user.id, session.user.email || '');
        
        setAuthState({
          user: session.user,
          session,
          loading: false,
          isAuthenticated: true
        });
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
        setAuthState({
          user: null,
          session: null,
          loading: false,
          isAuthenticated: false
        });
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token refreshed');
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user || null,
          isAuthenticated: !!session?.user
        }));
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false
        }));
      }
    });

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔍 Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('❌ Error getting session:', error);
          setAuthState(prev => ({ ...prev, loading: false }));
          return;
        }

        if (session?.user) {
          console.log('✅ Found existing session for:', session.user.email);
          await ensureUserProfile(session.user.id, session.user.email || '');
          setAuthState({
            user: session.user,
            session,
            loading: false,
            isAuthenticated: true
          });
        } else {
          console.log('ℹ️ No existing session found');
          setAuthState({
            user: null,
            session: null,
            loading: false,
            isAuthenticated: false
          });
        }
      } catch (error: any) {
        console.error('💥 Error in getInitialSession:', error);
        if (mounted) {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Starting signin process for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('❌ Signin error:', error);
        let errorMessage = error.message;
        
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many attempts. Please wait a moment before trying again.';
        }
        
        toast({
          title: "Sign in failed",
          description: errorMessage,
          variant: "destructive",
        });
        return { error: { message: errorMessage } };
      }

      console.log('✅ Signin successful for:', data.user?.email);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      return { data };
    } catch (error: any) {
      console.error('💥 Sign in catch error:', error);
      const errorMessage = error.message || 'An unexpected error occurred during sign in';
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { error: { message: errorMessage } };
    }
  };

  const signUp = async (email: string, password: string, confirmPassword?: string) => {
    try {
      console.log('🚀 Starting signup process for:', email);
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            role: 'student'
          }
        }
      });

      if (error) {
        console.error('❌ Signup error:', error);
        let errorMessage = error.message;
        
        // Handle specific error cases
        if (error.message.includes('User already registered')) {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
        } else if (error.message.includes('Password should be')) {
          errorMessage = 'Password must be at least 6 characters long.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        }
        
        toast({
          title: "Sign up failed",
          description: errorMessage,
          variant: "destructive",
        });
        return { error: { message: errorMessage } };
      }

      console.log('✅ Signup successful for:', data.user?.email);
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
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

      return { data };
    } catch (error: any) {
      console.error('💥 Sign up catch error:', error);
      const errorMessage = error.message || 'An unexpected error occurred during sign up';
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { error: { message: errorMessage } };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('🔑 Starting password reset for:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('❌ Password reset error:', error);
        let errorMessage = error.message;
        
        // Handle specific error cases
        if (error.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many reset attempts. Please wait before trying again.';
        }
        
        toast({
          title: "Password reset failed",
          description: errorMessage,
          variant: "destructive",
        });
        return { error: { message: errorMessage } };
      }

      console.log('✅ Password reset email sent for:', email);
      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions to reset your password.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('💥 Password reset catch error:', error);
      const errorMessage = error.message || 'An unexpected error occurred during password reset';
      toast({
        title: "Password reset failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { error: { message: errorMessage } };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      console.log('🔑 Updating password...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('❌ Password update error:', error);
        let errorMessage = error.message;
        
        if (error.message.includes('Password should be')) {
          errorMessage = 'Password must be at least 6 characters long.';
        }
        
        toast({
          title: "Password update failed",
          description: errorMessage,
          variant: "destructive",
        });
        return { error: { message: errorMessage } };
      }

      console.log('✅ Password updated successfully');
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('💥 Password update catch error:', error);
      const errorMessage = error.message || 'An unexpected error occurred while updating password';
      toast({
        title: "Password update failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { error: { message: errorMessage } };
    }
  };

  const signOut = async () => {
    try {
      console.log('👋 Starting signout process...');
      await supabase.auth.signOut({ scope: 'global' });
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      console.error('💥 Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  };
};
