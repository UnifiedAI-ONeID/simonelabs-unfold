
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Ban } from 'lucide-react';

export const CaptchaDebugPanel = () => {
  if (!import.meta.env.DEV) return null;

  return (
    <div className="space-y-4">
      <Card className="border-dashed border-gray-200 bg-gray-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Ban className="h-5 w-5 text-gray-600" />
            CAPTCHA Debug Panel
            <Badge variant="secondary">Disabled</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              CAPTCHA functionality has been completely removed from the authentication system.
              This debug panel is no longer functional.
            </AlertDescription>
          </Alert>
          
          <div className="text-sm text-muted-foreground space-y-2">
            <div><strong>Status:</strong> CAPTCHA Disabled</div>
            <div><strong>Authentication:</strong> Direct email/password validation</div>
            <div><strong>Security:</strong> Rate limiting and input validation still active</div>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">
                Authentication System Active
              </span>
            </div>
            <p className="text-sm text-green-700">
              Users can sign up and sign in without CAPTCHA verification. 
              Enhanced security features like rate limiting and input validation remain in place.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
