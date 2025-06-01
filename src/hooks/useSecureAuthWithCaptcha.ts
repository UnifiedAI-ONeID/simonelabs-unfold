
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
  development?: boolean;
  bypass?: boolean;
  challenge_ts?: string;
  details?: any;
  environment?: string;
}

export const useSecureAuthWithCaptcha = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateCaptcha = async (token: string, retryCount = 0): Promise<boolean> => {
    const requestId = crypto.randomUUID();
    console.log(`[${requestId}] 🛡️ Starting CAPTCHA validation...`);
    console.log(`[${requestId}] Token preview: ${token.substring(0, 20)}...`);
    console.log(`[${requestId}] Retry attempt: ${retryCount + 1}`);

    if (!token) {
      console.error(`[${requestId}] ❌ No CAPTCHA token provided`);
      toast({
        title: "CAPTCHA Required",
        description: "Please complete the CAPTCHA verification.",
        variant: "destructive",
      });
      return false;
    }

    // Development bypass
    if (import.meta.env.DEV && token === 'dev-bypass-token') {
      console.log(`[${requestId}] 🔧 Development mode: bypassing CAPTCHA validation`);
      toast({
        title: "Development Mode",
        description: "CAPTCHA bypassed for development testing.",
        variant: "default",
      });
      return true;
    }

    try {
      console.log(`[${requestId}] 📡 Sending request to validate-captcha function...`);
      
      // Prepare request body - ensure proper JSON format
      const requestBody = JSON.stringify({ token });
      console.log(`[${requestId}] Request body prepared:`, requestBody);
      
      const { data, error } = await supabase.functions.invoke('validate-captcha', {
        body: requestBody,
        headers: {
          'Content-Type': 'application/json',
          ...CSRFProtection.getHeaders()
        }
      });

      console.log(`[${requestId}] 📨 Supabase function response:`, { 
        data, 
        error,
        hasData: !!data,
        hasError: !!error 
      });

      if (error) {
        console.error(`[${requestId}] ❌ Supabase function error:`, error);
        
        let userMessage = 'CAPTCHA verification failed. Please try again.';
        let shouldRetry = false;
        
        // Handle different error types
        if (error.message?.includes('timeout') || error.message?.includes('408')) {
          userMessage = 'CAPTCHA verification timed out. Retrying...';
          shouldRetry = retryCount < 2;
        } else if (error.message?.includes('503') || error.message?.includes('unavailable')) {
          userMessage = 'CAPTCHA service temporarily unavailable. Please try again.';
          shouldRetry = retryCount < 1;
        } else if (error.message?.includes('expired') || error.message?.includes('duplicate')) {
          userMessage = 'CAPTCHA token expired. Please complete the verification again.';
        } else if (error.message?.includes('400')) {
          userMessage = 'Invalid CAPTCHA response. Please try again.';
        }
        
        // Automatic retry for certain error types
        if (shouldRetry) {
          console.log(`[${requestId}] 🔄 Retrying CAPTCHA validation (attempt ${retryCount + 2})...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return validateCaptcha(token, retryCount + 1);
        }
        
        toast({
          title: "CAPTCHA Error",
          description: userMessage,
          variant: "destructive",
        });

        await logSecurityEvent({
          type: 'VALIDATION_FAILURE',
          details: `CAPTCHA validation failed: ${error.message} (attempt ${retryCount + 1})`
        });
        
        return false;
      }

      const result: CaptchaValidationResponse = data;
      console.log(`[${requestId}] 📋 Validation result:`, result);
      
      if (!result || !result.success) {
        console.log(`[${requestId}] ❌ CAPTCHA validation returned false:`, result);
        
        let errorMessage = 'Please complete the security verification again.';
        if (result?.details?.errorCodes?.includes('timeout-or-duplicate')) {
          errorMessage = 'CAPTCHA token expired. Please try again.';
        } else if (result?.details?.errorCodes?.includes('invalid-input-response')) {
          errorMessage = 'Invalid CAPTCHA response. Please refresh and try again.';
        } else if (result?.error) {
          errorMessage = result.error;
        }
        
        toast({
          title: "CAPTCHA Failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        return false;
      }

      console.log(`[${requestId}] ✅ CAPTCHA validation successful!`, {
        development: result.development,
        bypass: result.bypass,
        challenge_ts: result.challenge_ts,
        environment: result.environment
      });
      
      if (result.development) {
        toast({
          title: "Development Mode",
          description: "CAPTCHA bypassed for development testing.",
          variant: "default",
        });
      }
      
      return true;
      
    } catch (error) {
      console.error(`[${requestId}] 💥 CAPTCHA validation network error:`, error);
      
      // Retry on network errors
      if (retryCount < 2) {
        console.log(`[${requestId}] 🔄 Retrying CAPTCHA validation due to network error (attempt ${retryCount + 2})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return validateCaptcha(token, retryCount + 1);
      }
      
      toast({
        title: "Network Error",
        description: "Unable to verify CAPTCHA. Please check your connection and try again.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  const signUpMutation = useMutation({
    mutationFn: async (authData: AuthData) => {
      const clientId = `signup_${authData.email}`;
      
      if (!authRateLimiter.canMakeRequest(clientId)) {
        throw new Error('Too many signup attempts. Please wait before trying again.');
      }

      // Input validation
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

      // CAPTCHA validation
      if (!authData.captchaToken) {
        throw new Error('CAPTCHA verification is required');
      }

      console.log('🚀 Starting signup process with CAPTCHA validation...');
      const isCaptchaValid = await validateCaptcha(authData.captchaToken);
      if (!isCaptchaValid) {
        throw new Error('CAPTCHA verification failed. Please complete the verification and try again.');
      }

      console.log('✅ CAPTCHA validation passed, proceeding with signup...');

      const { data, error } = await supabase.auth.signUp({
        email: authData.email,
        password: authData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
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
      navigate('/dashboard');
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
      const clientId = `signin_${authData.email}`;
      
      if (!authRateLimiter.canMakeRequest(clientId)) {
        throw new Error('Too many signin attempts. Please wait before trying again.');
      }

      // Input validation
      if (!validateInput.email(authData.email)) {
        throw new Error('Invalid email format');
      }

      if (!authData.email || !authData.password) {
        throw new Error('Email and password are required');
      }

      // CAPTCHA validation
      if (!authData.captchaToken) {
        throw new Error('CAPTCHA verification is required');
      }

      console.log('🚀 Starting signin process with CAPTCHA validation...');
      const isCaptchaValid = await validateCaptcha(authData.captchaToken);
      if (!isCaptchaValid) {
        throw new Error('CAPTCHA verification failed. Please complete the verification and try again.');
      }

      console.log('✅ CAPTCHA validation passed, proceeding with signin...');

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

  return {
    signUp: signUpMutation.mutate,
    signIn: signInMutation.mutate,
    isSigningUp: signUpMutation.isPending,
    isSigningIn: signInMutation.isPending,
    validateCaptcha,
  };
};
