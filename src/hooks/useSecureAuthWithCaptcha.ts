
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AdvancedRateLimiter } from '@/lib/advancedRateLimiting';
import { logSecurityEvent, validateInput } from '@/lib/securityEnhancements';
import { SecureInputValidator } from '@/lib/enhancedInputValidation';

interface AuthData {
  email: string;
  password: string;
  confirmPassword?: string;
}

export const useSecureAuthWithCaptcha = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const signUpMutation = useMutation({
    mutationFn: async (authData: AuthData) => {
      const userRole = 'student';
      const clientIP = await getClientIP();
      
      // Enhanced rate limiting check
      const rateLimitResult = AdvancedRateLimiter.checkLimit(
        authData.email,
        'auth',
        'anonymous',
        clientIP
      );

      if (!rateLimitResult.allowed) {
        throw new Error(rateLimitResult.reason || 'Rate limit exceeded');
      }

      // Enhanced input validation
      const emailValidation = SecureInputValidator.validateField(authData.email, 'email');
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error);
      }

      if (!authData.email || !authData.password || !authData.confirmPassword) {
        throw new Error('All fields are required');
      }

      if (authData.password !== authData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      console.log('🚀 Starting signup process...');

      const { data, error } = await supabase.auth.signUp({
        email: authData.email,
        password: authData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            role: userRole
          }
        }
      });

      if (error) {
        console.error('❌ Signup error:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });
      navigate('/signin');
    },
    onError: (error: any) => {
      console.error('❌ Sign up mutation error:', error);
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const signInMutation = useMutation({
    mutationFn: async (authData: AuthData) => {
      const clientIP = await getClientIP();
      
      // Enhanced rate limiting check
      const rateLimitResult = AdvancedRateLimiter.checkLimit(
        authData.email,
        'auth',
        'anonymous',
        clientIP
      );

      if (!rateLimitResult.allowed) {
        throw new Error(rateLimitResult.reason || 'Rate limit exceeded');
      }

      // Enhanced input validation
      const emailValidation = SecureInputValidator.validateField(authData.email, 'email');
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error);
      }

      if (!authData.email || !authData.password) {
        throw new Error('Email and password are required');
      }

      console.log('🚀 Starting signin process...');

      const { data, error } = await supabase.auth.signInWithPassword({
        email: authData.email,
        password: authData.password,
      });

      if (error) {
        console.error('❌ Signin error:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
      navigate('/dashboard');
    },
    onError: (error: any) => {
      console.error('❌ Sign in mutation error:', error);
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || '127.0.0.1';
    } catch {
      return '127.0.0.1';
    }
  };

  return {
    signUp: signUpMutation.mutate,
    signIn: signInMutation.mutate,
    isSigningUp: signUpMutation.isPending,
    isSigningIn: signInMutation.isPending,
  };
};
