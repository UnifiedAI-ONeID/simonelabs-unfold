
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { SignInForm } from '@/components/Auth/SignInForm';
import { getSecurityHeaders } from '@/lib/securityConfig';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, user, getRoleBasedRedirect } = useEnhancedAuth();

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
      const userRole = user.user_metadata?.role;
      
      if (!userRole) {
        navigate('/role-selection', { replace: true });
      } else {
        const roleBasedRedirect = getRoleBasedRedirect();
        const from = (location.state as any)?.from?.pathname || roleBasedRedirect;
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, loading, navigate, location, user, getRoleBasedRedirect]);

  const handleSignInSuccess = () => {
    const userRole = user?.user_metadata?.role;
    
    if (!userRole) {
      navigate('/role-selection', { replace: true });
    } else {
      const roleBasedRedirect = getRoleBasedRedirect();
      const from = (location.state as any)?.from?.pathname || roleBasedRedirect;
      navigate(from, { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading secure authentication...</p>
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
