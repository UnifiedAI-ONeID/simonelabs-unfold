
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle } from 'lucide-react';
import { authRateLimiter, courseRateLimiter, reviewRateLimiter, apiRateLimiter } from '@/lib/securityEnhancements';

interface RateLimitStatus {
  name: string;
  remaining: number;
  max: number;
  identifier: string;
}

export const SecureRateLimiter = () => {
  const [rateLimits, setRateLimits] = useState<RateLimitStatus[]>([]);

  const updateRateLimits = () => {
    const userId = 'current-user'; // In real app, get from auth context
    
    setRateLimits([
      {
        name: 'Authentication',
        remaining: authRateLimiter.getRemainingRequests(userId),
        max: 5,
        identifier: 'auth'
      },
      {
        name: 'Course Actions',
        remaining: courseRateLimiter.getRemainingRequests(userId),
        max: 10,
        identifier: 'course'
      },
      {
        name: 'Reviews',
        remaining: reviewRateLimiter.getRemainingRequests(userId),
        max: 3,
        identifier: 'review'
      },
      {
        name: 'API Requests',
        remaining: apiRateLimiter.getRemainingRequests(userId),
        max: 100,
        identifier: 'api'
      }
    ]);
  };

  useEffect(() => {
    updateRateLimits();
    const interval = setInterval(updateRateLimits, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (remaining: number, max: number) => {
    const percentage = (remaining / max) * 100;
    if (percentage > 50) return 'default';
    if (percentage > 20) return 'secondary';
    return 'destructive';
  };

  const getProgressColor = (remaining: number, max: number) => {
    const percentage = (remaining / max) * 100;
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Rate Limit Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rateLimits.map((limit) => (
          <div key={limit.identifier} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{limit.name}</span>
              <div className="flex items-center gap-2">
                {limit.remaining === 0 && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
                <Badge variant={getStatusColor(limit.remaining, limit.max) as any}>
                  {limit.remaining}/{limit.max}
                </Badge>
              </div>
            </div>
            <Progress 
              value={(limit.remaining / limit.max) * 100} 
              className="h-2"
            />
          </div>
        ))}
        
        <div className="pt-2 border-t text-xs text-muted-foreground">
          Rate limits reset automatically over time
        </div>
      </CardContent>
    </Card>
  );
};
