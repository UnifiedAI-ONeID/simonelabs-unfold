
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBulletproofAuth } from '@/hooks/useBulletproofAuth';
import { BulletproofSignInForm } from '@/components/Auth/BulletproofSignInForm';
import { BulletproofDevAuthHelper } from '@/components/Auth/BulletproofDevAuthHelper';
import { getSecurityHeaders } from '@/lib/securityConfig';

const SignIn = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useBulletproofAuth();

  useEffect(() => {
    const headers = getSecurityHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      if (key === 'Content-Security-Policy') {
        const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (metaCSP) {
          metaCSP.setAttribute('content', value);
        } else {
          const meta = document.createElement('meta');
          meta.setAttribute('http-equiv', 'Content-Security-Policy');
          meta.setAttribute('content', value);
          document.head.appendChild(meta);
        }
      }
    });
  }, []);

  useEffect(() => {
    console.log('SignIn page - Auth state:', { isAuthenticated, loading, user: user?.email });
    
    if (!loading && isAuthenticated && user) {
      console.log('User is already authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate, user]);

  const handleSignInSuccess = () => {
    console.log('Sign in success callback triggered');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <BulletproofSignInForm onSuccess={handleSignInSuccess} />
      <BulletproofDevAuthHelper />
    </div>
  );
};

export default SignIn;
