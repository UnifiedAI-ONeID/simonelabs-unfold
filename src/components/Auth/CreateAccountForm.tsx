import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Turnstile } from '@marsidev/react-turnstile';
import { Eye, EyeOff, UserPlus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { useTwoFactorAuth } from '@/hooks/useTwoFactorAuth';
import { TwoFactorAuth } from '@/components/Auth/TwoFactorAuth';
import { validatePassword, type PasswordValidationResult } from '@/lib/enhancedPasswordValidation';
import { SecureFormWrapper } from '@/components/Security/SecureFormWrapper';
import { Link, useNavigate } from 'react-router-dom';

const TURNSTILE_SITE_KEY = '0x4AAAAAABfVmLaPZh3sMQ7-';

interface CreateAccountFormProps {
  onSuccess?: () => void;
}

export const CreateAccountForm = ({ onSuccess }: CreateAccountFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleCaptchaSuccess = useCallback((token: string) => {
    console.log('CAPTCHA completed successfully:', token.substring(0, 20) + '...');
    setCaptchaToken(token);
    setCaptchaError(null);
  }, []);

  const handleCaptchaError = useCallback((error?: string) => {
    console.error('CAPTCHA error:', error);
    setCaptchaToken(null);
    setCaptchaError(error || 'CAPTCHA verification failed');
    setCaptchaKey(prev => prev + 1);
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
        // Account created successfully, now require 2FA
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
    console.log('2FA verification complete for new user, redirecting to role selection...');
    resetTwoFactor();
    
    // New users always go to role selection first
    navigate('/role-selection');
    
    if (onSuccess) {
      onSuccess();
    }
  };

  const getPasswordStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  const isFormValid = () => {
    if (!email || !password || !confirmPassword) return false;
    if (!captchaToken) return false;
    if (!passwordValidation?.isValid) return false;
    if (password !== confirmPassword) return false;
    return true;
  };

  // Show 2FA screen if required
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
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full"
                placeholder="Enter your email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full pr-10"
                  placeholder="Create a strong password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {passwordValidation && (
              <div className="space-y-2">
                <div className={`text-sm font-medium ${getPasswordStrengthColor(passwordValidation.strength)}`}>
                  Password Strength: {passwordValidation.strength.toUpperCase()}
                </div>
                {passwordValidation.errors.length > 0 && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1">
                        {passwordValidation.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                {passwordValidation.isValid && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Password meets all security requirements
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full pr-10"
                  placeholder="Confirm your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Passwords do not match
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label>Security Verification</Label>
              <div className="flex justify-center">
                <Turnstile
                  key={captchaKey}
                  siteKey={TURNSTILE_SITE_KEY}
                  onSuccess={handleCaptchaSuccess}
                  onError={handleCaptchaError}
                  options={{
                    theme: 'auto',
                    size: 'normal',
                    retry: 'auto'
                  }}
                />
              </div>
              {captchaError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {captchaError}. Please try again.
                  </AlertDescription>
                </Alert>
              )}
              {captchaToken && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    CAPTCHA verified successfully
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Create New Account'}
              </Button>
              
              {!isFormValid() && !isSubmitting && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="text-center">Complete all requirements to continue:</p>
                  <ul className="text-xs space-y-1">
                    {!email && <li>• Enter your email address</li>}
                    {!password && <li>• Enter your password</li>}
                    {!passwordValidation?.isValid && <li>• Password must meet security requirements</li>}
                    {confirmPassword && password !== confirmPassword && <li>• Passwords must match</li>}
                    {!captchaToken && <li>• Complete CAPTCHA verification</li>}
                  </ul>
                </div>
              )}
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
