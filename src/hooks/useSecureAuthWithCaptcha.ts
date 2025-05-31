
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthData {
  email: string;
  password: string;
  captchaToken?: string;
  confirmPassword?: string;
}

interface CaptchaValidationResponse {
  success: boolean;
  error?: string;
}

export const useSecureAuthWithCaptcha = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateCaptcha = async (token: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('validate-captcha', {
        body: { token }
      });

      if (error) {
        console.error('CAPTCHA validation error:', error);
        return false;
      }

      const result: CaptchaValidationResponse = data;
      return result.success;
    } catch (error) {
      console.error('CAPTCHA validation network error:', error);
      return false;
    }
  };

  const signUpMutation = useMutation({
    mutationFn: async (authData: AuthData) => {
      // Validate required fields
      if (!authData.email || !authData.password || !authData.confirmPassword) {
        throw new Error('All fields are required');
      }

      if (authData.password !== authData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Validate CAPTCHA first
      if (!authData.captchaToken) {
        throw new Error('CAPTCHA verification is required');
      }

      const isCaptchaValid = await validateCaptcha(authData.captchaToken);
      if (!isCaptchaValid) {
        throw new Error('CAPTCHA verification failed. Please try again.');
      }

      // Proceed with signup only after CAPTCHA validation
      const { data, error } = await supabase.auth.signUp({
        email: authData.email,
        password: authData.password,
      });

      if (error) {
        console.error('Signup error:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });
      navigate('/dashboard');
    },
    onError: (error: any) => {
      console.error('Sign up mutation error:', error);
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const signInMutation = useMutation({
    mutationFn: async (authData: AuthData) => {
      // Validate required fields
      if (!authData.email || !authData.password) {
        throw new Error('Email and password are required');
      }

      // Validate CAPTCHA first
      if (!authData.captchaToken) {
        throw new Error('CAPTCHA verification is required');
      }

      const isCaptchaValid = await validateCaptcha(authData.captchaToken);
      if (!isCaptchaValid) {
        throw new Error('CAPTCHA verification failed. Please try again.');
      }

      // Proceed with signin only after CAPTCHA validation
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authData.email,
        password: authData.password,
      });

      if (error) {
        console.error('Signin error:', error);
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
      console.error('Sign in mutation error:', error);
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
    validateCaptcha,
  };
};
