
import { useEffect, useState } from 'react';
import { useSimplifiedAuth } from '@/hooks/useSimplifiedAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const AuthDebugPanel = () => {
  const { user, session, loading, isAuthenticated, signOut } = useSimplifiedAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    setDebugInfo({
      user: user ? { 
        id: user.id, 
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        user_metadata: user.user_metadata 
      } : null,
      session: session ? { 
        access_token: session.access_token?.substring(0, 20) + '...',
        expires_at: session.expires_at
      } : null,
      loading,
      isAuthenticated,
      timestamp: new Date().toISOString()
    });
  }, [user, session, loading, isAuthenticated]);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 w-80 opacity-90 z-50 max-h-96 overflow-auto">
      <CardHeader>
        <CardTitle className="text-sm flex justify-between items-center">
          Auth Debug
          {user && (
            <Button 
              onClick={signOut} 
              size="sm" 
              variant="outline"
              className="text-xs"
            >
              Sign Out
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-xs overflow-auto whitespace-pre-wrap">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
};
