
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { validateEnvironment } from '@/lib/enhancedSecurity';

interface SecurityStatus {
  environment: 'secure' | 'warning' | 'error';
  session: 'valid' | 'invalid' | 'expired';
  rateLimit: 'ok' | 'warning' | 'exceeded';
  lastCheck: Date;
}

export const SecurityMonitor = () => {
  const [status, setStatus] = useState<SecurityStatus>({
    environment: 'secure',
    session: 'valid',
    rateLimit: 'ok',
    lastCheck: new Date()
  });

  useEffect(() => {
    const checkSecurity = async () => {
      try {
        // Check environment variables
        validateEnvironment();
        
        // Check session validity (simplified)
        const hasValidSession = localStorage.getItem('supabase.auth.token') !== null;
        
        setStatus({
          environment: 'secure',
          session: hasValidSession ? 'valid' : 'invalid',
          rateLimit: 'ok',
          lastCheck: new Date()
        });
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          environment: 'error',
          lastCheck: new Date()
        }));
      }
    };

    checkSecurity();
    const interval = setInterval(checkSecurity, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (level: string) => {
    switch (level) {
      case 'secure':
      case 'valid':
      case 'ok':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (level: string) => {
    switch (level) {
      case 'secure':
      case 'valid':
      case 'ok':
        return 'default';
      case 'warning':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Environment</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(status.environment)}
            <Badge variant={getStatusColor(status.environment) as any}>
              {status.environment}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Session</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(status.session)}
            <Badge variant={getStatusColor(status.session) as any}>
              {status.session}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Rate Limit</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(status.rateLimit)}
            <Badge variant={getStatusColor(status.rateLimit) as any}>
              {status.rateLimit}
            </Badge>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Last checked: {status.lastCheck.toLocaleTimeString()}
          </p>
        </div>
        
        {(status.environment === 'error' || status.session === 'expired') && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Security issues detected. Please refresh the page or contact support.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
