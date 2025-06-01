
import { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { EnhancedAuthForm } from '@/components/Auth/EnhancedAuthForm';
import { getSecurityHeaders } from '@/lib/securityConfig';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading, user, getRoleBasedRedirect } = useEnhancedAuth();

  useEffect(() => {
    // Apply security headers
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
      // Check if user has a role assigned
      const userRole = user.user_metadata?.role;
      
      if (!userRole) {
        // Redirect to role selection if no role assigned
        navigate('/role-selection', { replace: true });
      } else {
        // Redirect to role-based landing page
        const roleBasedRedirect = getRoleBasedRedirect();
        const from = (location.state as any)?.from?.pathname || roleBasedRedirect;
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, loading, navigate, location, user, getRoleBasedRedirect]);

  const handleAuthSuccess = () => {
    // Check if user has a role assigned
    const userRole = user?.user_metadata?.role;
    
    if (!userRole) {
      // Redirect to role selection if no role assigned
      navigate('/role-selection', { replace: true });
    } else {
      // Redirect to role-based landing page
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
      <EnhancedAuthForm onSuccess={handleAuthSuccess} />
    </div>
  );
};

export default Auth;
