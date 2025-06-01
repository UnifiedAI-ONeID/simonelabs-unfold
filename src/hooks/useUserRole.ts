
import { useState, useEffect } from 'react';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

export type UserRole = 'student' | 'educator' | 'admin' | 'superuser';

export const useUserRole = () => {
  const { user, isAuthenticated } = useEnhancedAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const determineUserRole = () => {
      if (!isAuthenticated || !user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      // Check user metadata for role
      const role = user.user_metadata?.role as UserRole;
      
      // Default to student if no role is specified
      setUserRole(role || 'student');
      setLoading(false);
    };

    determineUserRole();
  }, [user, isAuthenticated]);

  const getUserLandingPage = (role: UserRole): string => {
    switch (role) {
      case 'student':
        return '/student';
      case 'educator':
        return '/educator';
      case 'admin':
      case 'superuser':
        return '/administration';
      default:
        return '/student';
    }
  };

  return {
    userRole,
    loading,
    getUserLandingPage,
    setUserRole
  };
};
