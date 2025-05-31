
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Shield, Activity, Clock } from 'lucide-react';
import { logSecurityEvent } from '@/lib/securityEnhancements';

interface SecurityEvent {
  id: string;
  type: string;
  details: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const SecurityEventLogger = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [isLogging, setIsLogging] = useState(true);

  const addEvent = (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => {
    const newEvent: SecurityEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
    
    setEvents(prev => [newEvent, ...prev.slice(0, 49)]); // Keep last 50 events
    
    // Log to backend security system
    logSecurityEvent({
      type: event.type as any,
      details: event.details
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-3 w-3" />;
      case 'medium':
        return <Shield className="h-3 w-3" />;
      case 'low':
        return <Activity className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  // Expose addEvent globally for other components to use
  useEffect(() => {
    (window as any).logSecurityEvent = addEvent;
    
    // Log initial security check
    addEvent({
      type: 'SECURITY_MONITOR_STARTED',
      details: 'Security event monitoring initialized',
      severity: 'low'
    });

    return () => {
      delete (window as any).logSecurityEvent;
    };
  }, []);

  // Monitor for security-related browser events
  useEffect(() => {
    if (!isLogging) return;

    const handleSecurityEvents = () => {
      // Monitor for potential XSS attempts
      const scripts = document.querySelectorAll('script[src]');
      scripts.forEach(script => {
        const src = script.getAttribute('src');
        if (src && !src.startsWith('https://') && !src.startsWith('/')) {
          addEvent({
            type: 'SUSPICIOUS_SCRIPT_DETECTED',
            details: `Suspicious script source detected: ${src}`,
            severity: 'high'
          });
        }
      });

      // Monitor for console access (potential debugging attempts)
      const originalConsole = console.log;
      console.log = (...args) => {
        if (args.some(arg => typeof arg === 'string' && arg.includes('password'))) {
          addEvent({
            type: 'SENSITIVE_DATA_LOG_ATTEMPT',
            details: 'Attempt to log sensitive data detected',
            severity: 'medium'
          });
        }
        originalConsole.apply(console, args);
      };
    };

    handleSecurityEvents();
    const interval = setInterval(handleSecurityEvents, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isLogging]);

  const toggleLogging = () => {
    setIsLogging(!isLogging);
    addEvent({
      type: isLogging ? 'SECURITY_LOGGING_DISABLED' : 'SECURITY_LOGGING_ENABLED',
      details: `Security logging ${isLogging ? 'disabled' : 'enabled'} by user`,
      severity: 'medium'
    });
  };

  const clearEvents = () => {
    setEvents([]);
    addEvent({
      type: 'SECURITY_LOG_CLEARED',
      details: 'Security event log cleared by user',
      severity: 'low'
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Event Monitor
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant={isLogging ? 'default' : 'secondary'}>
              {isLogging ? 'Active' : 'Inactive'}
            </Badge>
            <button
              onClick={toggleLogging}
              className="text-xs px-2 py-1 rounded border"
            >
              {isLogging ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={clearEvents}
              className="text-xs px-2 py-1 rounded border"
            >
              Clear
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No security events recorded
              </p>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card/50"
                >
                  <div className="flex items-center gap-1 mt-0.5">
                    {getSeverityIcon(event.severity)}
                    <Badge variant={getSeverityColor(event.severity) as any} className="text-xs">
                      {event.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{event.type}</p>
                    <p className="text-xs text-muted-foreground break-words">
                      {event.details}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
