
import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSecureAuthWithCaptcha } from '@/hooks/useSecureAuthWithCaptcha';
import AuthHeader from '@/components/Auth/AuthHeader';
import AuthForm from '@/components/Auth/AuthForm';

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
  };

  const toggleMode = useCallback(() => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
  }, [isLogin]);

  const isLoading = isSigningUp || isSigningIn;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl p-8 border border-border/60">
        <AuthHeader isLogin={isLogin} isForgotPassword={isForgotPassword} />
        <AuthForm
          isLogin={isLogin}
          isForgotPassword={isForgotPassword}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onToggleMode={toggleMode}
          onToggleForgotPassword={setIsForgotPassword}
        />
      </div>
    </div>
  );
};

export default Auth;
