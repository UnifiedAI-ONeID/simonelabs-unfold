
import { useState, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSecureAuthWithCaptcha } from '@/hooks/useSecureAuthWithCaptcha';
import AuthHeader from '@/components/Auth/AuthHeader';
import AuthForm from '@/components/Auth/AuthForm';
import { Button } from '@/components/ui/button';
import { TestTube } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, signIn, isSigningUp, isSigningIn } = useSecureAuthWithCaptcha();

  const handleSubmit = async (data: {
    email: string;
    password: string;
    confirmPassword?: string;
    fullName?: string;
    captchaToken: string | null;
  }) => {
    try {
      if (isLogin) {
        await signIn({
          email: data.email,
          password: data.password,
          captchaToken: data.captchaToken
        });
        
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        await signUp({
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword!,
          captchaToken: data.captchaToken
        });
      }
    } catch (error) {
      console.error('Auth submission error:', error);
    }
  };

  const toggleMode = useCallback(() => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
  }, [isLogin]);

  const isLoading = isSigningUp || isSigningIn;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-border/60 overflow-hidden">
        <div className="p-6 sm:p-8">
          <AuthHeader isLogin={isLogin} isForgotPassword={isForgotPassword} />
          <AuthForm
            isLogin={isLogin}
            isForgotPassword={isForgotPassword}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            onToggleMode={toggleMode}
            onToggleForgotPassword={setIsForgotPassword}
          />
          
          <div className="mt-6 pt-6 border-t border-border/60">
            <Link to="/captcha-test">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
              >
                <TestTube className="h-3 w-3 mr-2" />
                Test CAPTCHA Validation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
