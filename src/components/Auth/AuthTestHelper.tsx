
import { useEffect, useState } from 'react';
import { useSimplifiedAuth } from '@/hooks/useSimplifiedAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AuthTestHelper = () => {
  const { user, session, loading, isAuthenticated } = useSimplifiedAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    setDebugInfo({
      user: user ? { id: user.id, email: user.email } : null,
      session: session ? { access_token: session.access_token?.substring(0, 20) + '...' } : null,
      loading,
      isAuthenticated,
      timestamp: new Date().toISOString()
    });
  }, [user, session, loading, isAuthenticated]);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 opacity-80 z-50">
      <CardHeader>
        <CardTitle className="text-sm">Auth Debug</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
};
