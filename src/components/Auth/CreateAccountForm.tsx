
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { useTwoFactorAuth } from '@/hooks/useTwoFactorAuth';
import { TwoFactorAuth } from '@/components/Auth/TwoFactorAuth';
import { validatePassword, type PasswordValidationResult } from '@/lib/enhancedPasswordValidation';
import { SecureFormWrapper } from '@/components/Security/SecureFormWrapper';
import { CreateAccountFormFields } from '@/components/Auth/CreateAccountFormFields';
import { CaptchaSection } from '@/components/Auth/CaptchaSection';
import { CreateAccountValidationMessage } from '@/components/Auth/CreateAccountValidationMessage';
import { Link, useNavigate } from 'react-router-dom';

interface CreateAccountFormProps {
  onSuccess?: () => void;
}

export const CreateAccountForm = ({ onSuccess }: CreateAccountFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { signUp } = useEnhancedAuth();
  const { 
    twoFactorState, 
    isVerifying, 
    isResending,
    initiateTwoFactor, 
    verifyTwoFactorCode, 
    resendTwoFactorCode,
    resetTwoFactor
  } = useTwoFactorAuth();

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    if (value) {
      setPasswordValidation(validatePassword(value));
    } else {
      setPasswordValidation(null);
    }
  }, []);

  const handleSubmit = async (formData: any) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Starting account creation process...');
      
      if (!captchaToken) {
        throw new Error('Please complete the CAPTCHA verification');
      }

      if (!passwordValidation?.isValid) {
        throw new Error('Please ensure your password meets all requirements');
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      console.log('Attempting to create account...');
      const { data, error } = await signUp(email, password, confirmPassword, captchaToken);
      
      if (error) {
        console.error('Account creation failed:', error);
        setCaptchaToken(null);
        setCaptchaKey(prev => prev + 1);
        return;
      }

      if (data?.session) {
        console.log('Account creation successful, initiating 2FA...');
        await initiateTwoFactor(email, data.session.access_token);
      }
    } catch (error: any) {
      console.error('Create account error:', error);
      setCaptchaToken(null);
      setCaptchaKey(prev => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handle2FAVerified = () => {
    console.log('2FA verification complete for new user, redirecting to signin...');
    resetTwoFactor();
    navigate('/signin');
    
    if (onSuccess) {
      onSuccess();
    }
  };

  const isFormValid = () => {
    if (!email || !password || !confirmPassword) return false;
    if (!captchaToken) return false;
    if (!passwordValidation?.isValid) return false;
    if (password !== confirmPassword) return false;
    return true;
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
          <UserPlus className="h-5 w-5" />
          Join Our Community
        </CardTitle>
        <CardDescription>
          Create a new account to start your learning journey with us
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SecureFormWrapper
          onSubmit={handleSubmit}
          rateLimitKey="signup"
          maxSubmissions={3}
          windowMs={300000}
        >
          <div className="space-y-4">
            <CreateAccountFormFields
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={handlePasswordChange}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              passwordValidation={passwordValidation}
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
                {isSubmitting ? 'Creating Account...' : 'Create New Account'}
              </Button>
              
              <CreateAccountValidationMessage
                isFormValid={isFormValid()}
                isSubmitting={isSubmitting}
                email={email}
                password={password}
                confirmPassword={confirmPassword}
                passwordValidation={passwordValidation}
                captchaToken={captchaToken}
              />
            </div>
          </div>
        </SecureFormWrapper>

        <div className="mt-4 text-center">
          <Link to="/signin">
            <Button type="button" variant="link">
              Already have an account? Sign in here
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
