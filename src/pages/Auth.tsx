
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBulletproofAuth } from '@/hooks/useBulletproofAuth';

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useBulletproofAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user) {
        // Redirect based on user role
        const userRole = user.user_metadata?.role;
        if (userRole) {
          const redirectPath = userRole === 'student' ? '/student' : 
                             userRole === 'educator' ? '/educator' : 
                             userRole === 'admin' || userRole === 'superuser' ? '/administration' : 
                             '/dashboard';
          navigate(redirectPath, { replace: true });
        } else {
          navigate('/role-selection', { replace: true });
        }
      } else {
        // Redirect to sign in page instead of staying on auth
        navigate('/signin', { replace: true });
      }
    }
  }, [isAuthenticated, loading, navigate, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
};

export default Auth;
