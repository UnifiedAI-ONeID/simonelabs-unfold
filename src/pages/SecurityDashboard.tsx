
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { EnhancedSecurityDashboard } from '@/components/Security/EnhancedSecurityDashboard';

const SecurityDashboard = () => {
  const { isAuthenticated, loading, role } = useEnhancedAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/auth');
      } else if (role !== 'admin' && role !== 'superuser') {
        navigate('/dashboard'); // Redirect non-admin users
      }
    }
  }, [isAuthenticated, loading, role, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading security dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (role !== 'admin' && role !== 'superuser')) {
    return null; // Will be redirected by useEffect
  }

  return <EnhancedSecurityDashboard />;
};

export default SecurityDashboard;
