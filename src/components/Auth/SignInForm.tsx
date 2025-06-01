
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Turnstile } from '@marsidev/react-turnstile';
import { Eye, EyeOff, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { useTwoFactorAuth } from '@/hooks/useTwoFactorAuth';
import { TwoFactorAuth } from '@/components/Auth/TwoFactorAuth';
import { SecureFormWrapper } from '@/components/Security/SecureFormWrapper';
import { Link, useNavigate } from 'react-router-dom';

const TURNSTILE_SITE_KEY = '0x4AAAAAABfVmLaPZh3sMQ7-';

interface SignInFormProps {
  onSuccess?: () => void;
}

export const SignInForm = ({ onSuccess }: SignInFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { signIn } = useEnhancedAuth();
  const { 
    twoFactorState, 
    isVerifying, 
    isResending,
    initiateTwoFactor, 
    verifyTwoFactorCode, 
    resendTwoFactorCode,
    resetTwoFactor
  } = useTwoFactorAuth();

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
        // Sign in successful, now require 2FA
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
    console.log('2FA verification complete, proceeding to dashboard...');
    resetTwoFactor();
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/role-selection');
    }
  };

  const isFormValid = () => {
    return email && password && captchaToken;
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
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pr-10"
                  placeholder="Enter your password"
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
                {isSubmitting ? 'Signing In...' : 'Sign In to Account'}
              </Button>
              
              {!isFormValid() && !isSubmitting && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="text-center">Complete all requirements to continue:</p>
                  <ul className="text-xs space-y-1">
                    {!email && <li>• Enter your email address</li>}
                    {!password && <li>• Enter your password</li>}
                    {!captchaToken && <li>• Complete CAPTCHA verification</li>}
                  </ul>
                </div>
              )}
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
