import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { useTranslation } from 'react-i18next';
import { PasswordStrength } from '@/components/ui/password-strength';
import { sanitizeText } from '@/lib/security';
import { useToast } from '@/hooks/use-toast';

// Use test site key for development - replace with your production key
const TURNSTILE_SITE_KEY = process.env.NODE_ENV === 'production' 
  ? '0x4AAAAAABfVmLaPZh3sMQ7-' 
  : '1x00000000000000000000AA'; // Test key that always passes

interface AuthFormProps {
  isLogin: boolean;
  isForgotPassword: boolean;
  isLoading: boolean;
  onSubmit: (data: {
    email: string;
    password: string;
    confirmPassword?: string;
    fullName?: string;
    captchaToken: string | null;
  }) => Promise<void>;
  onToggleMode: () => void;
  onToggleForgotPassword: (value: boolean) => void;
}

const AuthForm = ({
  isLogin,
  isForgotPassword,
  isLoading,
  onSubmit,
  onToggleMode,
  onToggleForgotPassword
}: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);
  const [captchaStatus, setCaptchaStatus] = useState<'loading' | 'ready' | 'error' | 'success'>('loading');
  const turnstileRef = useRef<any>(null);
  const { toast } = useToast();
  const { t } = useTranslation('auth');

  const handleTurnstileSuccess = useCallback((token: string) => {
    console.log('CAPTCHA success:', token?.substring(0, 20) + '...');
    setTurnstileToken(token);
    setCaptchaStatus('success');
  }, []);

  const handleTurnstileError = useCallback((error?: string) => {
    console.error('CAPTCHA error:', error);
    setTurnstileToken(null);
    setCaptchaStatus('error');
    setTurnstileKey(prev => prev + 1);
    
    // Don't show toast for development test key
    if (process.env.NODE_ENV === 'production') {
      toast({
        title: "Security verification failed",
        description: "Please try the verification again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleTurnstileExpire = useCallback(() => {
    console.log('CAPTCHA expired');
    setTurnstileToken(null);
    setCaptchaStatus('loading');
    setTurnstileKey(prev => prev + 1);
    
    if (process.env.NODE_ENV === 'production') {
      toast({
        title: "Verification expired",
        description: "Please complete the security verification again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleTurnstileLoad = useCallback(() => {
    console.log('CAPTCHA loaded');
    setCaptchaStatus('ready');
  }, []);

  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setShowPassword(false);
    setTurnstileToken(null);
    setCaptchaStatus('loading');
    setTurnstileKey(prev => prev + 1);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedEmail = sanitizeText(email.trim().toLowerCase());
    const sanitizedFullName = sanitizeText(fullName.trim());

    if (!sanitizedEmail || !password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (isForgotPassword) {
      toast({
        title: "Password reset requested",
        description: "If an account exists with this email, you'll receive reset instructions.",
      });
      onToggleForgotPassword(false);
      resetForm();
      return;
    }

    // In development, allow submission without CAPTCHA for testing
    if (process.env.NODE_ENV === 'production' && !turnstileToken) {
      toast({
        title: "Security verification required",
        description: "Please complete the security verification first.",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin) {
      if (password.length < 8) {
        toast({
          title: "Password too short",
          description: "Password must be at least 8 characters long.",
          variant: "destructive",
        });
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: "Password mismatch",
          description: "Passwords do not match. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!sanitizedFullName || sanitizedFullName.length < 2) {
        toast({
          title: "Invalid name",
          description: "Please enter a valid full name (at least 2 characters).",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      await onSubmit({
        email: sanitizedEmail,
        password,
        confirmPassword,
        fullName: sanitizedFullName,
        captchaToken: turnstileToken || 'dev-bypass-token'
      });
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setTurnstileToken(null);
      setCaptchaStatus('loading');
      setTurnstileKey(prev => prev + 1);
    }
  };

  const getCaptchaStatusColor = () => {
    switch (captchaStatus) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'ready': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getCaptchaStatusText = () => {
    switch (captchaStatus) {
      case 'success': return '✓ Verification complete';
      case 'error': return '✗ Verification failed';
      case 'ready': return '⏳ Please complete verification';
      case 'loading': return '🔄 Loading verification...';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {!isLogin && !isForgotPassword && (
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              {t('register.nameLabel')}
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
                placeholder={t('register.namePlaceholder')}
                className="pl-10 rounded-xl border-border/60 focus:border-primary h-11 text-base"
                disabled={isLoading}
                maxLength={50}
              />
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            {isLogin ? t('login.emailLabel') : t('register.emailLabel')}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={isLogin ? t('login.emailPlaceholder') : t('register.emailPlaceholder')}
              className="pl-10 rounded-xl border-border/60 focus:border-primary h-11 text-base"
              disabled={isLoading}
              maxLength={100}
            />
          </div>
        </div>

        {!isForgotPassword && (
          <>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                {isLogin ? t('login.passwordLabel') : t('register.passwordLabel')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={isLogin ? t('login.passwordPlaceholder') : t('register.passwordPlaceholder')}
                  minLength={8}
                  className="pl-10 pr-10 rounded-xl border-border/60 focus:border-primary h-11 text-base"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {!isLogin && (
                <PasswordStrength password={password} className="mt-2" />
              )}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={!isLogin}
                    placeholder="Confirm your password"
                    minLength={8}
                    className="pl-10 rounded-xl border-border/60 focus:border-primary h-11 text-base"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="scale-90 sm:scale-100">
                  <Turnstile
                    key={turnstileKey}
                    ref={turnstileRef}
                    siteKey={TURNSTILE_SITE_KEY}
                    onSuccess={handleTurnstileSuccess}
                    onError={handleTurnstileError}
                    onExpire={handleTurnstileExpire}
                    onLoad={handleTurnstileLoad}
                    options={{
                      theme: 'auto',
                      size: 'normal',
                      appearance: 'always',
                      retry: 'auto',
                      'refresh-expired': 'auto',
                    }}
                  />
                </div>
              </div>
              
              {process.env.NODE_ENV === 'development' && (
                <div className="text-center">
                  <span className={`text-xs font-medium ${getCaptchaStatusColor()}`}>
                    {getCaptchaStatusText()}
                  </span>
                  <div className="text-xs text-muted-foreground mt-1">
                    Development mode: CAPTCHA bypass enabled
                  </div>
                </div>
              )}
              
              {process.env.NODE_ENV === 'production' && (
                <div className="text-center">
                  <span className={`text-xs font-medium ${getCaptchaStatusColor()}`}>
                    {getCaptchaStatusText()}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl py-3 h-12 font-medium transition-all duration-200 text-base"
          disabled={isLoading || (process.env.NODE_ENV === 'production' && !isForgotPassword && !turnstileToken)}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              {isForgotPassword 
                ? 'Sending reset email...' 
                : isLogin 
                  ? 'Signing in...' 
                  : 'Creating account...'}
            </div>
          ) : (
            isForgotPassword 
              ? t('forgotPassword.submitButton') 
              : isLogin 
                ? t('login.submitButton') 
                : t('register.submitButton')
          )}
        </Button>

        <div className="mt-4 sm:mt-6 text-center space-y-3">
          {isLogin && !isForgotPassword && (
            <button
              type="button"
              onClick={() => onToggleForgotPassword(true)}
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-200 block w-full"
              disabled={isLoading}
            >
              {t('login.forgotPassword')}
            </button>
          )}
          
          {isForgotPassword && (
            <button
              type="button"
              onClick={() => onToggleForgotPassword(false)}
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 flex items-center justify-center gap-2 w-full"
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4" />
              {t('forgotPassword.backToLogin')}
            </button>
          )}
          
          {!isForgotPassword && (
            <button
              type="button"
              onClick={onToggleMode}
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 text-sm block w-full"
              disabled={isLoading}
            >
              {isLogin
                ? t('login.noAccount')
                : t('register.haveAccount')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
