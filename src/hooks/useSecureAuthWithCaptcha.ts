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
    console.log(`[${requestId}] Environment: ${import.meta.env.DEV ? 'Development' : 'Production'}`);

    if (!token) {
      console.error(`[${requestId}] ❌ No CAPTCHA token provided`);
      toast({
        title: "CAPTCHA Required",
        description: "Please complete the CAPTCHA verification.",
        variant: "destructive",
      });
      return false;
    }

    // Development bypass with enhanced logging
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
      
      const requestData = { 
        token: token,
        environment: import.meta.env.DEV ? 'development' : 'production',
        timestamp: new Date().toISOString(),
        retryCount: retryCount
      };
      console.log(`[${requestId}] Request data being sent:`, requestData);
      console.log(`[${requestId}] Request data stringified:`, JSON.stringify(requestData));
      
      // Fix: Use correct Supabase function invocation syntax
      const { data, error } = await supabase.functions.invoke('validate-captcha', {
        body: requestData
      });

      console.log(`[${requestId}] 📨 Supabase function response:`, { 
        data, 
        error,
        hasData: !!data,
        hasError: !!error,
        responseType: typeof data
      });

      if (error) {
        console.error(`[${requestId}] ❌ Supabase function error:`, error);
        
        let userMessage = 'CAPTCHA verification failed. Please try again.';
        let shouldRetry = false;
        
        // Enhanced error categorization
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
        } else if (error.message?.includes('TURNSTILE_SECRET_KEY')) {
          userMessage = 'CAPTCHA service configuration error. Please contact support.';
          console.error(`[${requestId}] 🚨 CRITICAL: TURNSTILE_SECRET_KEY not configured!`);
        } else if (error.message?.includes('non-2xx status code')) {
          userMessage = 'CAPTCHA service error. Please try again.';
          console.error(`[${requestId}] 🚨 Non-2xx status code error - likely empty request body or server issue`);
          shouldRetry = retryCount < 1;
        }
        
        // Automatic retry with exponential backoff
        if (shouldRetry) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
          console.log(`[${requestId}] 🔄 Retrying CAPTCHA validation in ${delay}ms (attempt ${retryCount + 2})...`);
          await new Promise(resolve => setTimeout(resolve, delay));
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
      
      if (result.development || result.bypass) {
        toast({
          title: "Development Mode",
          description: "CAPTCHA bypassed for development testing.",
          variant: "default",
        });
      }
      
      return true;
      
    } catch (error) {
      console.error(`[${requestId}] 💥 CAPTCHA validation network error:`, error);
      console.error(`[${requestId}] Error details:`, {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // Enhanced retry logic for network errors
      if (retryCount < 2) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
        console.log(`[${requestId}] 🔄 Retrying CAPTCHA validation due to network error in ${delay}ms (attempt ${retryCount + 2})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
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

      // CAPTCHA validation
      if (!authData.captchaToken) {
        throw new Error('CAPTCHA verification is required');
      }

      console.log('🚀 Starting signup process with enhanced security validation...');
      const isCaptchaValid = await validateCaptcha(authData.captchaToken);
      if (!isCaptchaValid) {
        throw new Error('CAPTCHA verification failed. Please complete the verification and try again.');
      }

      console.log('✅ Enhanced security validation passed, proceeding with signup...');

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

      // CAPTCHA validation
      if (!authData.captchaToken) {
        throw new Error('CAPTCHA verification is required');
      }

      console.log('🚀 Starting signin process with enhanced security validation...');
      const isCaptchaValid = await validateCaptcha(authData.captchaToken);
      if (!isCaptchaValid) {
        throw new Error('CAPTCHA verification failed. Please complete the verification and try again.');
      }

      console.log('✅ Enhanced security validation passed, proceeding with signin...');

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
    validateCaptcha,
  };
};
