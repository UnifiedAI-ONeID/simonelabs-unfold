
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Users, 
  Clock, 
  BarChart3,
  RefreshCw,
  Settings,
  Lock
} from 'lucide-react';
import { SecurityEventLogger } from './SecurityEventLogger';
import { SecurityMonitor } from './SecurityMonitor';
import { SecureRateLimiter } from './SecureRateLimiter';
import { AdvancedRateLimiter } from '@/lib/advancedRateLimiting';
import { EnhancedSessionSecurity } from '@/lib/enhancedSessionSecurity';

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  activeUsers: number;
  blockedIPs: number;
  sessionCount: number;
  rateLimitViolations: number;
}

export const EnhancedSecurityDashboard = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalEvents: 0,
    criticalEvents: 0,
    activeUsers: 0,
    blockedIPs: 0,
    sessionCount: 0,
    rateLimitViolations: 0
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadSecurityMetrics();
    const interval = setInterval(loadSecurityMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSecurityMetrics = async () => {
    try {
      // Load security events from localStorage
      const events = JSON.parse(localStorage.getItem('security_events') || '[]');
      const criticalEvents = events.filter((e: any) => 
        ['critical', 'high'].includes(e.severity)
      );

      // Get current user sessions
      const userId = localStorage.getItem('user_id') || 'anonymous';
      const userSessions = EnhancedSessionSecurity.getActiveSessions(userId);

      setMetrics({
        totalEvents: events.length,
        criticalEvents: criticalEvents.length,
        activeUsers: userSessions.length,
        blockedIPs: 0, // Would come from backend in real implementation
        sessionCount: userSessions.length,
        rateLimitViolations: events.filter((e: any) => 
          e.type === 'RATE_LIMIT_EXCEEDED'
        ).length
      });
    } catch (error) {
      console.error('Failed to load security metrics:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadSecurityMetrics();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleTerminateAllSessions = async () => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      await EnhancedSessionSecurity.terminateAllUserSessions(userId);
      await loadSecurityMetrics();
    }
  };

  const getSecurityStatus = () => {
    if (metrics.criticalEvents > 0) return { level: 'critical', color: 'destructive' };
    if (metrics.rateLimitViolations > 5) return { level: 'warning', color: 'secondary' };
    return { level: 'secure', color: 'default' };
  };

  const securityStatus = getSecurityStatus();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Enhanced Security Dashboard</h1>
            <p className="text-muted-foreground">Real-time security monitoring and controls</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant={securityStatus.color as any} className="px-3 py-1">
            {securityStatus.level === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
            {securityStatus.level === 'warning' && <Activity className="h-3 w-3 mr-1" />}
            {securityStatus.level === 'secure' && <Shield className="h-3 w-3 mr-1" />}
            {securityStatus.level.toUpperCase()}
          </Badge>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Security Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security Events</p>
                <p className="text-2xl font-bold">{metrics.totalEvents}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">{metrics.criticalEvents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold">{metrics.sessionCount}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rate Limit Violations</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.rateLimitViolations}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {metrics.criticalEvents > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Critical Security Alert:</strong> {metrics.criticalEvents} high-priority security events detected. 
            Review the Security Events tab immediately.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="controls">Security Controls</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SecurityMonitor />
            <SecureRateLimiter />
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <SecurityEventLogger />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Active Sessions Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Current Session</p>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date().toLocaleString()}
                  </p>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Total active sessions: {metrics.sessionCount}
                </p>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleTerminateAllSessions}
                >
                  Terminate All Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Session Timeout</label>
                  <select className="w-full p-2 border rounded">
                    <option value="3600">1 hour</option>
                    <option value="7200">2 hours</option>
                    <option value="14400">4 hours</option>
                    <option value="28800">8 hours</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rate Limit Strictness</label>
                  <select className="w-full p-2 border rounded">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="strict">Strict</option>
                  </select>
                </div>
                
                <Button className="w-full">
                  Update Security Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Security Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Threat Level</span>
                    <Badge variant={securityStatus.color as any}>{securityStatus.level}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Security Score</span>
                    <span className="font-medium">
                      {metrics.criticalEvents === 0 ? '95/100' : '75/100'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Updated</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
