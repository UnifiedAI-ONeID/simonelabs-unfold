
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { CSRFProtection } from '@/lib/csrf';
import { authRateLimiter, logSecurityEvent, validateInput } from '@/lib/securityEnhancements';

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

// Helper function to clean up authentication state
const cleanupAuthState = () => {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error cleaning up auth state:', error);
  }
};

export const useSecureAuthWithCaptcha = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateCaptcha = async (token: string): Promise<boolean> => {
    if (!token) {
      console.error('No CAPTCHA token provided');
      return false;
    }

    try {
      const { data, error } = await supabase.functions.invoke('validate-captcha', {
        body: { token },
        headers: {
          ...CSRFProtection.getHeaders(),
          'Content-Type': 'application/json'
        }
      });

      if (error) {
        console.error('CAPTCHA validation error:', error);
        await logSecurityEvent({
          type: 'VALIDATION_FAILURE',
          details: `CAPTCHA validation failed: ${error.message}`
        });
        return false;
      }

      const result: CaptchaValidationResponse = data;
      const isValid = result.success;
      
      if (!isValid) {
        await logSecurityEvent({
          type: 'VALIDATION_FAILURE',
          details: 'CAPTCHA validation returned false'
        });
      }
      
      return isValid;
    } catch (error) {
      console.error('CAPTCHA validation network error:', error);
      await logSecurityEvent({
        type: 'VALIDATION_FAILURE',
        details: 'CAPTCHA validation network error'
      });
      return false;
    }
  };

  const signUpMutation = useMutation({
    mutationFn: async (authData: AuthData) => {
      const clientId = `signup_${authData.email}`;
      
      // Enhanced rate limiting check
      if (!authRateLimiter.canMakeRequest(clientId)) {
        await logSecurityEvent({
          type: 'RATE_LIMIT_EXCEEDED',
          details: `Signup rate limit exceeded for ${authData.email}`
        });
        throw new Error('Too many signup attempts. Please wait before trying again.');
      }

      // Clean up any existing auth state
      cleanupAuthState();

      // Enhanced input validation
      if (!validateInput.email(authData.email)) {
        await logSecurityEvent({
          type: 'VALIDATION_FAILURE',
          details: 'Invalid email format in signup'
        });
        throw new Error('Invalid email format');
      }

      if (!validateInput.password(authData.password)) {
        await logSecurityEvent({
          type: 'VALIDATION_FAILURE',
          details: 'Invalid password format in signup'
        });
        throw new Error('Password must be at least 8 characters long');
      }

      // Validate required fields
      if (!authData.email || !authData.password || !authData.confirmPassword) {
        throw new Error('All fields are required');
      }

      if (authData.password !== authData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Validate CAPTCHA - always required
      if (!authData.captchaToken) {
        throw new Error('CAPTCHA verification is required');
      }

      const isCaptchaValid = await validateCaptcha(authData.captchaToken);
      if (!isCaptchaValid) {
        await logSecurityEvent({
          type: 'VALIDATION_FAILURE',
          details: 'CAPTCHA validation failed in signup'
        });
        throw new Error('CAPTCHA verification failed. Please try again.');
      }

      // Proceed with signup only after all validations pass
      const { data, error } = await supabase.auth.signUp({
        email: authData.email,
        password: authData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('Signup error:', error);
        await logSecurityEvent({
          type: 'AUTH_ATTEMPT',
          details: `Signup failed for ${authData.email}: ${error.message}`
        });
        throw new Error(error.message);
      }

      await logSecurityEvent({
        type: 'AUTH_ATTEMPT',
        details: `Successful signup for ${authData.email}`
      });

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
      const clientId = `signin_${authData.email}`;
      
      // Enhanced rate limiting check
      if (!authRateLimiter.canMakeRequest(clientId)) {
        await logSecurityEvent({
          type: 'RATE_LIMIT_EXCEEDED',
          details: `Signin rate limit exceeded for ${authData.email}`
        });
        throw new Error('Too many signin attempts. Please wait before trying again.');
      }

      // Clean up any existing auth state
      cleanupAuthState();

      // Attempt global sign out before new sign in
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Global signout attempt failed, continuing...');
      }

      // Enhanced input validation
      if (!validateInput.email(authData.email)) {
        await logSecurityEvent({
          type: 'VALIDATION_FAILURE',
          details: 'Invalid email format in signin'
        });
        throw new Error('Invalid email format');
      }

      // Validate required fields
      if (!authData.email || !authData.password) {
        throw new Error('Email and password are required');
      }

      // Validate CAPTCHA - always required
      if (!authData.captchaToken) {
        throw new Error('CAPTCHA verification is required');
      }

      const isCaptchaValid = await validateCaptcha(authData.captchaToken);
      if (!isCaptchaValid) {
        await logSecurityEvent({
          type: 'VALIDATION_FAILURE',
          details: 'CAPTCHA validation failed in signin'
        });
        throw new Error('CAPTCHA verification failed. Please try again.');
      }

      // Proceed with signin only after all validations pass
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authData.email,
        password: authData.password,
      });

      if (error) {
        console.error('Signin error:', error);
        await logSecurityEvent({
          type: 'AUTH_ATTEMPT',
          details: `Signin failed for ${authData.email}: ${error.message}`
        });
        throw new Error(error.message);
      }

      await logSecurityEvent({
        type: 'AUTH_ATTEMPT',
        details: `Successful signin for ${authData.email}`
      });

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
