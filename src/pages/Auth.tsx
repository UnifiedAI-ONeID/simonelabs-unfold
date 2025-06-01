
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useEnhancedAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        navigate('/role-selection', { replace: true });
      } else {
        // Redirect to sign in page instead of staying on auth
        navigate('/signin', { replace: true });
      }
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Redirecting to sign in...</p>
      </div>
    </div>
  );
};

export default Auth;
