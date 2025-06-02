
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimplifiedAuth } from '@/hooks/useSimplifiedAuth';
import { SignInForm } from '@/components/Auth/SignInForm';
import { getSecurityHeaders } from '@/lib/securityConfig';

const SignIn = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useSimplifiedAuth();

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
    if (!loading && isAuthenticated && user) {
      // Redirect to dashboard after successful sign in
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate, user]);

  const handleSignInSuccess = () => {
    navigate('/dashboard', { replace: true });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <SignInForm onSuccess={handleSignInSuccess} />
    </div>
  );
};

export default SignIn;
