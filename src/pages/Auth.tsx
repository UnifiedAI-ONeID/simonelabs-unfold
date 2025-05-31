
import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useSecureAuthWithCaptcha } from '@/hooks/useSecureAuthWithCaptcha';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { useTranslation } from 'react-i18next';
import { PasswordStrength } from '@/components/ui/password-strength';
import { sanitizeText } from '@/lib/security';

// Use the correct Turnstile site key for localhost/development
const TURNSTILE_SITE_KEY = '1x00000000000000000000AA'; // This is the test site key for localhost

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0); // Force re-render
  const turnstileRef = useRef<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation('auth');
  const { signUp, signIn, isSigningUp, isSigningIn } = useSecureAuthWithCaptcha();

  const handleTurnstileSuccess = useCallback((token: string) => {
    console.log('CAPTCHA success:', token);
    setTurnstileToken(token);
  }, []);

  const handleTurnstileError = useCallback((error?: string) => {
    console.error('CAPTCHA error:', error);
    setTurnstileToken(null);
    // Reset the turnstile widget
    setTurnstileKey(prev => prev + 1);
    toast({
      title: "Security verification failed",
      description: "Please try the verification again.",
      variant: "destructive",
    });
  }, [toast]);

  const handleTurnstileExpire = useCallback(() => {
    console.log('CAPTCHA expired');
    setTurnstileToken(null);
    setTurnstileKey(prev => prev + 1);
    toast({
      title: "Verification expired",
      description: "Please complete the security verification again.",
      variant: "destructive",
    });
  }, [toast]);

  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setShowPassword(false);
    setTurnstileToken(null);
    setTurnstileKey(prev => prev + 1);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sanitize inputs
    const sanitizedEmail = sanitizeText(email);
    const sanitizedFullName = sanitizeText(fullName);

    if (isForgotPassword) {
      // For password reset, we don't need CAPTCHA in this simplified version
      toast({
        title: "Password reset requested",
        description: "If an account exists with this email, you'll receive reset instructions.",
      });
      setIsForgotPassword(false);
      resetForm();
      return;
    }

    // Validate CAPTCHA token
    if (!turnstileToken) {
      toast({
        title: "Security verification required",
        description: "Please complete the security verification first.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isLogin) {
        await signIn({
          email: sanitizedEmail,
          password,
          captchaToken: turnstileToken
        });
        
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        // Validate password confirmation
        if (password !== confirmPassword) {
          toast({
            title: "Password mismatch",
            description: "Passwords do not match. Please try again.",
            variant: "destructive",
          });
          return;
        }

        await signUp({
          email: sanitizedEmail,
          password,
          confirmPassword,
          captchaToken: turnstileToken
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      // Reset CAPTCHA after submission
      setTurnstileToken(null);
      setTurnstileKey(prev => prev + 1);
    }
  };

  const toggleMode = useCallback(() => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    resetForm();
  }, [isLogin, resetForm]);

  const isLoading = isSigningUp || isSigningIn;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl p-8 border border-border/60">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold gradient-text heading">SimoneLabs</h1>
          <p className="text-muted-foreground mt-2">
            {isForgotPassword 
              ? t('forgotPassword.title')
              : isLogin 
                ? t('login.title') 
                : t('register.title')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="pl-10 rounded-xl border-border/60 focus:border-primary"
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
                className="pl-10 rounded-xl border-border/60 focus:border-primary"
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
                    className="pl-10 pr-10 rounded-xl border-border/60 focus:border-primary"
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
                      className="pl-10 rounded-xl border-border/60 focus:border-primary"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-center">
                <Turnstile
                  key={turnstileKey}
                  ref={turnstileRef}
                  siteKey={TURNSTILE_SITE_KEY}
                  onSuccess={handleTurnstileSuccess}
                  onError={handleTurnstileError}
                  onExpire={handleTurnstileExpire}
                  options={{
                    theme: 'light',
                    size: 'normal',
                    appearance: 'always',
                    retry: 'auto',
                    'retry-interval': 8000,
                  }}
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl py-3 font-medium transition-all duration-200"
            disabled={isLoading || (!isForgotPassword && !turnstileToken)}
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
        </form>

        <div className="mt-6 text-center space-y-2">
          {isLogin && !isForgotPassword && (
            <button
              onClick={() => setIsForgotPassword(true)}
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-200"
              disabled={isLoading}
            >
              {t('login.forgotPassword')}
            </button>
          )}
          
          {isForgotPassword && (
            <button
              onClick={() => setIsForgotPassword(false)}
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4" />
              {t('forgotPassword.backToLogin')}
            </button>
          )}
          
          {!isForgotPassword && (
            <button
              onClick={toggleMode}
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
              disabled={isLoading}
            >
              {isLogin
                ? t('login.noAccount')
                : t('register.haveAccount')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
