
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
import { CreateAccountValidationMessage } from '@/components/Auth/CreateAccountValidationMessage';
import { Link, useNavigate } from 'react-router-dom';

interface CreateAccountFormProps {
  onSuccess?: () => void;
}

export const CreateAccountForm = ({ onSuccess }: CreateAccountFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

      if (!passwordValidation?.isValid) {
        throw new Error('Please ensure your password meets all requirements');
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      console.log('Attempting to create account...');
      // Pass null for captchaToken since CAPTCHA is disabled
      const { data, error } = await signUp(email, password, confirmPassword, null);
      
      if (error) {
        console.error('Account creation failed:', error);
        return;
      }

      // Redirect to email verification page after successful signup
      console.log('Account creation successful, redirecting to email verification...');
      navigate('/email-verification');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Create account error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handle2FAVerified = () => {
    console.log('2FA verification complete for new user, redirecting to email verification...');
    resetTwoFactor();
    navigate('/email-verification');
    
    if (onSuccess) {
      onSuccess();
    }
  };

  const isFormValid = () => {
    if (!email || !password || !confirmPassword) return false;
    if (!passwordValidation?.isValid) return false;
    if (password !== confirmPassword) return false;
    return true; // No CAPTCHA requirement anymore
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

            {/* CAPTCHA section removed - disabled for now */}
            {import.meta.env.DEV && (
              <div className="text-center">
                <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                  ⚠️ CAPTCHA is currently disabled
                </span>
              </div>
            )}

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
                captchaToken={null} // Always null since CAPTCHA is disabled
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
