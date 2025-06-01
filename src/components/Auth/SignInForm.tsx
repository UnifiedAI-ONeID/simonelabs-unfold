
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { useTwoFactorAuth } from '@/hooks/useTwoFactorAuth';
import { validatePassword } from '@/lib/enhancedPasswordValidation';
import { SignInFormFields } from './SignInFormFields';
import { CaptchaSection } from './CaptchaSection';
import { FormValidationMessage } from './FormValidationMessage';
import { TwoFactorAuth } from './TwoFactorAuth';

interface SignInFormProps {
  onSuccess?: () => void;
}

export const SignInForm = ({ onSuccess }: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { signIn, user, pendingAuth, complete2FA } = useEnhancedAuth();
  const {
    twoFactorState,
    isVerifying,
    isResending,
    initiateTwoFactor,
    verifyTwoFactorCode,
    resendTwoFactorCode,
    resetTwoFactor
  } = useTwoFactorAuth();

  // Form validation
  const passwordValidation = password ? validatePassword(password) : null;
  const isFormValid = Boolean(
    email &&
    password &&
    passwordValidation?.isValid &&
    captchaToken
  );

  // Reset captcha on error
  const resetCaptcha = () => {
    setCaptchaToken(null);
    setCaptchaError(null);
    setCaptchaKey(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      console.log('Starting signin process...');
      const result = await signIn(email, password, captchaToken);
      
      // Check if the result has 2FA properties
      if (result?.data && 'requires2FA' in result.data && result.data.requires2FA && 'sessionId' in result.data && result.data.sessionId) {
        console.log('2FA required, initiating verification...');
        await initiateTwoFactor(email, result.data.sessionId);
      } else if (result?.data?.user && !result.error) {
        console.log('Signin successful without 2FA');
        handleSuccessfulAuth();
      }
    } catch (error: any) {
      console.error('Signin error:', error);
      resetCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handle2FASuccess = async () => {
    try {
      console.log('2FA verification successful, completing authentication...');
      await complete2FA();
      handleSuccessfulAuth();
    } catch (error: any) {
      console.error('2FA completion error:', error);
      resetTwoFactor();
      resetCaptcha();
    }
  };

  const handleSuccessfulAuth = () => {
    console.log('Authentication complete, checking user role...');
    
    // Check if user has a role assigned
    const userRole = user?.user_metadata?.role;
    
    if (!userRole) {
      console.log('No role assigned, redirecting to role selection');
      navigate('/role-selection', { replace: true });
    } else {
      console.log('User has role:', userRole, 'redirecting to appropriate dashboard');
      // Redirect based on user role
      switch (userRole) {
        case 'student':
          navigate('/student', { replace: true });
          break;
        case 'educator':
          navigate('/educator', { replace: true });
          break;
        case 'admin':
        case 'superuser':
          navigate('/administration', { replace: true });
          break;
        default:
          navigate('/role-selection', { replace: true });
      }
    }
    
    if (onSuccess) {
      onSuccess();
    }
  };

  const handle2FAError = () => {
    console.log('2FA verification failed, resetting form...');
    resetTwoFactor();
    resetCaptcha();
  };

  useEffect(() => {
    return () => {
      resetTwoFactor();
    };
  }, []);

  // Show 2FA component if required
  if (twoFactorState.isRequired || pendingAuth) {
    return (
      <Card className="w-full max-w-md mx-auto simonelabs-glass-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold simonelabs-gradient-text">
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Please enter the verification code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TwoFactorAuth
            email={twoFactorState.email || pendingAuth?.email || ''}
            onVerified={handle2FASuccess}
            onResendCode={resendTwoFactorCode}
            onVerifyCode={verifyTwoFactorCode}
            isVerifying={isVerifying}
            isResending={isResending}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto simonelabs-glass-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold simonelabs-gradient-text">
          Welcome Back
        </CardTitle>
        <CardDescription>
          Sign in to your account to continue your learning journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <SignInFormFields
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />

          <CaptchaSection
            captchaToken={captchaToken}
            setCaptchaToken={setCaptchaToken}
            captchaError={captchaError}
            setCaptchaError={setCaptchaError}
            captchaKey={captchaKey}
            setCaptchaKey={setCaptchaKey}
          />

          <FormValidationMessage
            isFormValid={isFormValid}
            isSubmitting={isSubmitting}
            email={email}
            password={password}
            captchaToken={captchaToken}
          />

          <Button
            type="submit"
            className="w-full simonelabs-primary-button"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <Separator />

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/create-account" className="text-primary hover:underline font-medium">
              Create Account
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
