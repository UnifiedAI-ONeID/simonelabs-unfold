
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Turnstile } from '@marsidev/react-turnstile';
import { Eye, EyeOff, Shield, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { validatePassword, type PasswordValidationResult } from '@/lib/enhancedPasswordValidation';
import { SecureFormWrapper } from '@/components/Security/SecureFormWrapper';

const TURNSTILE_SITE_KEY = '0x4AAAAAABfVmLaPZh3sMQ7-';

interface EnhancedAuthFormProps {
  onSuccess?: () => void;
}

export const EnhancedAuthForm = ({ onSuccess }: EnhancedAuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
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

  const { signIn, signUp } = useEnhancedAuth();

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    if (!isLogin && value) {
      setPasswordValidation(validatePassword(value));
    } else {
      setPasswordValidation(null);
    }
  }, [isLogin]);

  const handleCaptchaSuccess = useCallback((token: string) => {
    console.log('CAPTCHA completed successfully:', token.substring(0, 20) + '...');
    setCaptchaToken(token);
    setCaptchaError(null);
  }, []);

  const handleCaptchaError = useCallback((error?: string) => {
    console.error('CAPTCHA error:', error);
    setCaptchaToken(null);
    setCaptchaError(error || 'CAPTCHA verification failed');
    setCaptchaKey(prev => prev + 1); // Reset CAPTCHA widget
  }, []);

  const handleSubmit = async (formData: any) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (!captchaToken) {
        throw new Error('Please complete the CAPTCHA verification');
      }

      if (isLogin) {
        // Sign in existing user
        const { error } = await signIn(email, password);
        if (!error && onSuccess) {
          onSuccess();
        }
      } else {
        // Create new account
        if (!passwordValidation?.isValid) {
          throw new Error('Please ensure your password meets all requirements');
        }
        
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        const { error } = await signUp(email, password, confirmPassword);
        if (!error && onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      // Reset CAPTCHA on error
      setCaptchaToken(null);
      setCaptchaKey(prev => prev + 1);
    } finally {
      setIsSubmitting(false);
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
    if (!email || !password) return false;
    if (!captchaToken) return false;
    if (!isLogin) {
      if (!confirmPassword || !passwordValidation?.isValid) return false;
      if (password !== confirmPassword) return false;
    }
    return true;
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPasswordValidation(null);
    setCaptchaToken(null);
    setCaptchaError(null);
    setCaptchaKey(prev => prev + 1);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {isLogin ? 'Sign In to Your Account' : 'Create Your Account'}
        </CardTitle>
        <CardDescription>
          {isLogin 
            ? 'Welcome back! Please sign in to your existing account'
            : 'Join our community! Create a new account to get started'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SecureFormWrapper
          onSubmit={handleSubmit}
          rateLimitKey={isLogin ? 'signin' : 'signup'}
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
              <Label htmlFor="password">
                {isLogin ? 'Password' : 'Create Password'}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  className="w-full pr-10"
                  placeholder={isLogin ? 'Enter your password' : 'Create a strong password'}
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

            {!isLogin && passwordValidation && (
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

            {!isLogin && (
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
                {!isLogin && confirmPassword && password !== confirmPassword && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      Passwords do not match
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

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
                {isSubmitting 
                  ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                  : (isLogin ? 'Sign In to Existing Account' : 'Create New Account')
                }
              </Button>
              
              {!isFormValid() && !isSubmitting && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="text-center">Complete all requirements to continue:</p>
                  <ul className="text-xs space-y-1">
                    {!email && <li>• Enter your email address</li>}
                    {!password && <li>• Enter your password</li>}
                    {!isLogin && !passwordValidation?.isValid && <li>• Password must meet security requirements</li>}
                    {!isLogin && confirmPassword && password !== confirmPassword && <li>• Passwords must match</li>}
                    {!captchaToken && <li>• Complete CAPTCHA verification</li>}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </SecureFormWrapper>

        <div className="mt-4 text-center">
          <Button
            type="button"
            variant="link"
            onClick={toggleMode}
          >
            {isLogin 
              ? "New user? Create an account" 
              : "Already have an account? Sign in"
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
