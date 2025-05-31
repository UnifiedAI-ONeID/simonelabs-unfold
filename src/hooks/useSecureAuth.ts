
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { validatePassword, validateEmail, validateDisplayName, getGenericAuthError, createRateLimiter } from '@/lib/security';

const authRateLimiter = createRateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

export const useSecureAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signIn, resetPassword } = useAuth();
  const { toast } = useToast();

  const secureSignUp = useCallback(async (email: string, password: string, fullName: string, captchaToken: string) => {
    const clientId = `signup_${email}`;
    
    if (!authRateLimiter(clientId)) {
      toast({
        title: "Too many attempts",
        description: "Please wait before trying again.",
        variant: "destructive",
      });
      return { success: false };
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return { success: false };
    }

    if (!validateDisplayName(fullName)) {
      toast({
        title: "Invalid name",
        description: "Name must be 2-50 characters and contain only letters, numbers, spaces, hyphens, and underscores.",
        variant: "destructive",
      });
      return { success: false };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      toast({
        title: "Password requirements not met",
        description: passwordValidation.errors.join('. '),
        variant: "destructive",
      });
      return { success: false };
    }

    if (!captchaToken) {
      toast({
        title: "CAPTCHA required",
        description: "Please complete the security verification.",
        variant: "destructive",
      });
      return { success: false };
    }

    setIsLoading(true);
    try {
      const { error } = await signUp(email, password, fullName);
      
      if (error) {
        console.error('Signup error:', error);
        toast({
          title: "Registration failed",
          description: getGenericAuthError(error),
          variant: "destructive",
        });
        return { success: false };
      }

      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });
      return { success: true };
    } catch (error: any) {
      console.error('Signup process failed:', error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [signUp, toast]);

  const secureSignIn = useCallback(async (email: string, password: string, captchaToken: string) => {
    const clientId = `signin_${email}`;
    
    if (!authRateLimiter(clientId)) {
      toast({
        title: "Too many attempts",
        description: "Please wait before trying again.",
        variant: "destructive",
      });
      return { success: false };
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return { success: false };
    }

    if (!password) {
      toast({
        title: "Password required",
        description: "Please enter your password.",
        variant: "destructive",
      });
      return { success: false };
    }

    if (!captchaToken) {
      toast({
        title: "CAPTCHA required",
        description: "Please complete the security verification.",
        variant: "destructive",
      });
      return { success: false };
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Login failed",
          description: getGenericAuthError(error),
          variant: "destructive",
        });
        return { success: false };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Login process failed:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [signIn, toast]);

  const secureResetPassword = useCallback(async (email: string) => {
    const clientId = `reset_${email}`;
    
    if (!authRateLimiter(clientId)) {
      toast({
        title: "Too many attempts",
        description: "Please wait before trying again.",
        variant: "destructive",
      });
      return { success: false };
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return { success: false };
    }

    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        console.error('Password reset error:', error);
        // Always show success message to prevent user enumeration
        toast({
          title: "Reset email sent",
          description: "If an account with this email exists, you'll receive reset instructions.",
        });
        return { success: true };
      }

      toast({
        title: "Reset email sent",
        description: "Please check your email for password reset instructions.",
      });
      return { success: true };
    } catch (error: any) {
      console.error('Password reset failed:', error);
      toast({
        title: "Reset email sent",
        description: "If an account with this email exists, you'll receive reset instructions.",
      });
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  }, [resetPassword, toast]);

  return {
    secureSignUp,
    secureSignIn,
    secureResetPassword,
    isLoading
  };
};
