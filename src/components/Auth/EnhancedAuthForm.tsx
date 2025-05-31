
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Turnstile } from '@marsidev/react-turnstile';
import { Eye, EyeOff, Shield, CheckCircle, XCircle } from 'lucide-react';
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

  const handleSubmit = async (formData: any) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (!captchaToken) {
        throw new Error('Please complete the CAPTCHA verification');
      }

      if (isLogin) {
        const { error } = await signIn(email, password);
        if (!error && onSuccess) {
          onSuccess();
        }
      } else {
        if (!passwordValidation?.isValid) {
          throw new Error('Please ensure your password meets all requirements');
        }
        
        const { error } = await signUp(email, password, confirmPassword);
        if (!error && onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
    } finally {
      setIsSubmitting(false);
      // Reset CAPTCHA
      setCaptchaToken(null);
    }
  };

  const getPasswordStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {isLogin ? 'Secure Sign In' : 'Create Secure Account'}
        </CardTitle>
        <CardDescription>
          {isLogin 
            ? 'Sign in to your account with enhanced security'
            : 'Create a new account with strong security measures'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SecureFormWrapper
          onSubmit={handleSubmit}
          rateLimitKey={isLogin ? 'signin' : 'signup'}
          maxSubmissions={3}
          windowMs={300000} // 5 minutes
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full"
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
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  className="w-full pr-10"
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
              </div>
            )}

            <div className="space-y-2">
              <Label>Security Verification</Label>
              <div className="flex justify-center">
                <Turnstile
                  siteKey={TURNSTILE_SITE_KEY}
                  onSuccess={setCaptchaToken}
                  onError={() => setCaptchaToken(null)}
                  options={{
                    theme: 'auto',
                    size: 'normal'
                  }}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !captchaToken || (!isLogin && !passwordValidation?.isValid)}
            >
              {isSubmitting 
                ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                : (isLogin ? 'Sign In Securely' : 'Create Secure Account')
              }
            </Button>
          </div>
        </SecureFormWrapper>

        <div className="mt-4 text-center">
          <Button
            type="button"
            variant="link"
            onClick={() => {
              setIsLogin(!isLogin);
              setPassword('');
              setConfirmPassword('');
              setPasswordValidation(null);
              setCaptchaToken(null);
            }}
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
