
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useBulletproofAuth } from '@/hooks/useBulletproofAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useBulletproofAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', { isAuthenticated, loading, user: user?.email });
  }, [isAuthenticated, loading, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Redirecting to signin - not authenticated');
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If user is authenticated but has no role, redirect to role selection
  if (user && !user.user_metadata?.role) {
    console.log('Redirecting to role selection - no role set');
    return <Navigate to="/role-selection" replace />;
  }

  // Check role-based access if requiredRole is specified
  if (requiredRole && user?.user_metadata?.role) {
    const userRole = user.user_metadata.role;
    
    // Handle single role requirement
    if (typeof requiredRole === 'string') {
      if (userRole !== requiredRole) {
        // Redirect to appropriate dashboard based on user's actual role
        const redirectPath = userRole === 'student' ? '/student' : 
                           userRole === 'educator' ? '/educator' : 
                           userRole === 'admin' || userRole === 'superuser' ? '/administration' : 
                           '/dashboard';
        console.log('Redirecting due to role mismatch:', { userRole, requiredRole, redirectPath });
        return <Navigate to={redirectPath} replace />;
      }
    }
    
    // Handle multiple role requirements
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(userRole)) {
        // Redirect to appropriate dashboard based on user's actual role
        const redirectPath = userRole === 'student' ? '/student' : 
                           userRole === 'educator' ? '/educator' : 
                           userRole === 'admin' || userRole === 'superuser' ? '/administration' : 
                           '/dashboard';
        console.log('Redirecting due to role array mismatch:', { userRole, requiredRole, redirectPath });
        return <Navigate to={redirectPath} replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
