import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecurityMonitor } from './SecurityMonitor';
import { SecureRateLimiter } from './SecureRateLimiter';
import { SecurityEventLogger } from './SecurityEventLogger';
import { Shield, Activity, Eye, Settings, AlertTriangle } from 'lucide-react';

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  rateLimitViolations: number;
  failedAuthAttempts: number;
  lastSecurityScan: string;
}

export const AdvancedSecurityDashboard = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalEvents: 0,
    criticalEvents: 0,
    rateLimitViolations: 0,
    failedAuthAttempts: 0,
    lastSecurityScan: new Date().toISOString()
  });

  const [activeThreats, setActiveThreats] = useState<number>(0);

  useEffect(() => {
    // Initialize security monitoring
    const updateMetrics = () => {
      // In a real application, these would come from your security monitoring service
      setMetrics(prev => ({
        ...prev,
        lastSecurityScan: new Date().toISOString()
      }));
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const securityScore = Math.max(0, 100 - (activeThreats * 10) - (metrics.criticalEvents * 5));

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Security Score</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{securityScore}%</div>
            <p className="text-xs text-muted-foreground">
              {securityScore >= 90 ? 'Excellent' : securityScore >= 70 ? 'Good' : 'Needs Attention'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{activeThreats}</div>
            <p className="text-xs text-muted-foreground">
              Detected threats requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Security Events</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.criticalEvents} critical events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Last Scan</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {new Date(metrics.lastSecurityScan).toLocaleTimeString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Continuous monitoring active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Dashboard Tabs */}
      <Tabs defaultValue="monitor" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monitor">Monitor</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="limits">Rate Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="monitor" className="space-y-4">
          <SecurityMonitor />
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <SecurityEventLogger />
        </TabsContent>

        <TabsContent value="limits" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SecureRateLimiter />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Security Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Input Validation</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Email format validation</li>
                    <li>• Password complexity requirements</li>
                    <li>• Content length limits enforced</li>
                    <li>• Script injection prevention</li>
                    <li>• SQL injection protection</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Rate Limiting</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Authentication: 5 attempts/15min</li>
                    <li>• Course actions: 10 requests/min</li>
                    <li>• Reviews: 3 submissions/min</li>
                    <li>• API requests: 100 requests/min</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Security Headers</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Content Security Policy enabled</li>
                    <li>• CSRF protection active</li>
                    <li>• XSS protection headers</li>
                    <li>• Secure cookie settings</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
