
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { useTwoFactorAuth } from '@/hooks/useTwoFactorAuth';
import { TwoFactorAuth } from '@/components/Auth/TwoFactorAuth';
import { SecureFormWrapper } from '@/components/Security/SecureFormWrapper';
import { SignInFormFields } from '@/components/Auth/SignInFormFields';
import { CaptchaSection } from '@/components/Auth/CaptchaSection';
import { FormValidationMessage } from '@/components/Auth/FormValidationMessage';
import { Link, useNavigate } from 'react-router-dom';

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

  const { signIn, user } = useEnhancedAuth();
  const { 
    twoFactorState, 
    isVerifying, 
    isResending,
    initiateTwoFactor, 
    verifyTwoFactorCode, 
    resendTwoFactorCode,
    resetTwoFactor
  } = useTwoFactorAuth();

  const handleSubmit = async (formData: any) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Starting sign in process...');
      
      if (!captchaToken) {
        throw new Error('Please complete the CAPTCHA verification');
      }

      console.log('Attempting initial sign in...');
      const { data, error } = await signIn(email, password, captchaToken);
      
      if (error) {
        console.error('Sign in failed:', error);
        setCaptchaToken(null);
        setCaptchaKey(prev => prev + 1);
        return;
      }

      if (data?.session) {
        console.log('Initial sign in successful, initiating 2FA...');
        await initiateTwoFactor(email, data.session.access_token);
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      setCaptchaToken(null);
      setCaptchaKey(prev => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handle2FAVerified = () => {
    console.log('2FA verification complete, checking user role...');
    resetTwoFactor();
    
    const userRole = user?.user_metadata?.role;
    
    if (!userRole) {
      console.log('No role found, redirecting to role selection...');
      navigate('/role-selection');
    } else {
      console.log('Role found:', userRole, 'redirecting to dashboard...');
      switch (userRole) {
        case 'student':
          navigate('/student');
          break;
        case 'educator':
          navigate('/educator');
          break;
        case 'admin':
        case 'superuser':
          navigate('/administration');
          break;
        default:
          navigate('/role-selection');
      }
    }
    
    if (onSuccess) {
      onSuccess();
    }
  };

  const isFormValid = () => {
    return email && password && captchaToken;
  };

  if (twoFactorState.isRequired) {
    return (
      <TwoFactorAuth
        email={twoFactorState.email!}
        onVerified={handle2FAVerified}
        onResendCode={resendTwoFactorCode}
        onVerifyCode={verifyTwoFactorCode}
        isVerifying={isVerifying}
        isResending={isResending}
      />
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Welcome Back
        </CardTitle>
        <CardDescription>
          Sign in to your existing account to continue learning
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SecureFormWrapper
          onSubmit={handleSubmit}
          rateLimitKey="signin"
          maxSubmissions={3}
          windowMs={300000}
        >
          <div className="space-y-4">
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

            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In to Account'}
              </Button>
              
              <FormValidationMessage
                isFormValid={isFormValid()}
                isSubmitting={isSubmitting}
                email={email}
                password={password}
                captchaToken={captchaToken}
              />
            </div>
          </div>
        </SecureFormWrapper>

        <div className="mt-4 text-center">
          <Link to="/create-account">
            <Button type="button" variant="link">
              Don't have an account? Create one here
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
