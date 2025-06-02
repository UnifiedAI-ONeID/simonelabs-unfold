
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimplifiedAuth } from '@/hooks/useSimplifiedAuth';
import { CreateAccountForm } from '@/components/Auth/CreateAccountForm';
import { DevAuthHelper } from '@/components/Auth/DevAuthHelper';
import { getSecurityHeaders } from '@/lib/securityConfig';

const CreateAccount = () => {
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
    console.log('CreateAccount page - Auth state:', { isAuthenticated, loading, user: user?.email });
    
    if (!loading && isAuthenticated && user) {
      console.log('User is already authenticated, redirecting to dashboard');
      // If user is already authenticated, redirect to dashboard
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate, user]);

  const handleCreateAccountSuccess = () => {
    console.log('Account creation success callback triggered');
    // After successful signup, user might need to verify email
    // Don't redirect immediately, let the auth state change handle it
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

  // If already authenticated, show loading while redirecting
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
      <CreateAccountForm onSuccess={handleCreateAccountSuccess} />
      <DevAuthHelper />
    </div>
  );
};

export default CreateAccount;
