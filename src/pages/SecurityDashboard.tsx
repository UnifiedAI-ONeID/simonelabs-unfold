
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { AdvancedSecurityDashboard } from '@/components/Security/AdvancedSecurityDashboard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

const SecurityDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Security Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor and manage your application's security posture
              </p>
            </div>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              This dashboard provides real-time security monitoring, event logging, 
              and validation testing. All security events are logged and monitored 
              for potential threats.
            </AlertDescription>
          </Alert>

          <AdvancedSecurityDashboard />
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
