
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useSecurityOperations } from '@/components/Security/SecurityEnhancements';
import { validateInput } from '@/lib/securityEnhancements';

interface AuthData {
  email: string;
  password: string;
  confirmPassword?: string;
  fullName?: string;
}

export const useSecureAuth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { performSecureAuthOperation, logAuthAttempt } = useSecurityOperations();

  const signUpMutation = useMutation({
    mutationFn: async (authData: AuthData) => {
      return performSecureAuthOperation(async () => {
        // Enhanced input validation
        if (!validateInput.email(authData.email)) {
          throw new Error('Invalid email format');
        }

        if (!validateInput.password(authData.password)) {
          throw new Error('Password must be at least 8 characters long');
        }

        if (!authData.email || !authData.password || !authData.confirmPassword) {
          throw new Error('All fields are required');
        }

        if (authData.password !== authData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        console.log('🚀 Starting signup process (CAPTCHA disabled)...');

        const { data, error } = await supabase.auth.signUp({
          email: authData.email,
          password: authData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });

        if (error) {
          await logAuthAttempt(authData.email, false, error.message);
          throw new Error(error.message);
        }

        await logAuthAttempt(authData.email, true);
        return data;
      }, authData.email);
    },
    onSuccess: () => {
      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const signInMutation = useMutation({
    mutationFn: async (authData: AuthData) => {
      return performSecureAuthOperation(async () => {
        if (!validateInput.email(authData.email)) {
          throw new Error('Invalid email format');
        }

        if (!authData.email || !authData.password) {
          throw new Error('Email and password are required');
        }

        console.log('🚀 Starting signin process (CAPTCHA disabled)...');

        const { data, error } = await supabase.auth.signInWithPassword({
          email: authData.email,
          password: authData.password,
        });

        if (error) {
          await logAuthAttempt(authData.email, false, error.message);
          throw new Error(error.message);
        }

        await logAuthAttempt(authData.email, true);
        return data;
      }, authData.email);
    },
    onSuccess: () => {
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    signUp: signUpMutation.mutate,
    signIn: signInMutation.mutate,
    isSigningUp: signUpMutation.isPending,
    isSigningIn: signInMutation.isPending,
  };
};
