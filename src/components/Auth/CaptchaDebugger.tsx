
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Turnstile } from '@marsidev/react-turnstile';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const TURNSTILE_SITE_KEY = '0x4AAAAAABfVmLaPZh3sMQ7-';

export const CaptchaDebugger = () => {
  const [token, setToken] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);

  const handleSuccess = (token: string) => {
    console.log('CAPTCHA Token received:', token);
    setToken(token);
    setValidationResult(null);
  };

  const handleError = (error?: string) => {
    console.error('CAPTCHA Error:', error);
    setToken(null);
    setValidationResult({ success: false, error: error || 'Unknown error' });
    setCaptchaKey(prev => prev + 1);
  };

  const validateToken = async () => {
    if (!token) return;

    setIsValidating(true);
    try {
      const response = await fetch('/supabase/functions/v1/validate-captcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();
      setValidationResult(result);
      console.log('Validation result:', result);
    } catch (error) {
      console.error('Validation error:', error);
      setValidationResult({ success: false, error: 'Network error' });
    } finally {
      setIsValidating(false);
    }
  };

  const resetCaptcha = () => {
    setToken(null);
    setValidationResult(null);
    setCaptchaKey(prev => prev + 1);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          CAPTCHA Debugger
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">CAPTCHA Widget</label>
          <div className="flex justify-center">
            <Turnstile
              key={captchaKey}
              siteKey={TURNSTILE_SITE_KEY}
              onSuccess={handleSuccess}
              onError={handleError}
              options={{
                theme: 'auto',
                size: 'normal',
                appearance: 'always',
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Token Status</label>
          <div className="flex items-center gap-2">
            {token ? (
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Token Received
              </Badge>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                No Token
              </Badge>
            )}
          </div>
          {token && (
            <div className="text-xs text-muted-foreground break-all">
              {token.substring(0, 20)}...
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={validateToken} 
            disabled={!token || isValidating}
            className="flex-1"
          >
            {isValidating ? 'Validating...' : 'Test Validation'}
          </Button>
          <Button 
            onClick={resetCaptcha} 
            variant="outline"
            className="flex-1"
          >
            Reset
          </Button>
        </div>

        {validationResult && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Validation Result</label>
            <div className="p-3 rounded-md bg-muted">
              <pre className="text-xs">
                {JSON.stringify(validationResult, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
