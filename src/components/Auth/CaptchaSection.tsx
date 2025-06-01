
import { useCallback, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Turnstile } from '@marsidev/react-turnstile';
import { CheckCircle, AlertCircle, RefreshCw, Bug } from 'lucide-react';

const TURNSTILE_SITE_KEY = '0x4AAAAAABfVmLaPZh3sMQ7-';

interface CaptchaSectionProps {
  captchaToken: string | null;
  setCaptchaToken: (token: string | null) => void;
  captchaError: string | null;
  setCaptchaError: (error: string | null) => void;
  captchaKey: number;
  setCaptchaKey: (key: number) => void;
}

export const CaptchaSection = ({
  captchaToken,
  setCaptchaToken,
  captchaError,
  setCaptchaError,
  captchaKey,
  setCaptchaKey
}: CaptchaSectionProps) => {
  const [isManualTesting, setIsManualTesting] = useState(false);

  const handleCaptchaSuccess = useCallback((token: string) => {
    console.log('CAPTCHA completed successfully:', token.substring(0, 20) + '...');
    setCaptchaToken(token);
    setCaptchaError(null);
  }, [setCaptchaToken, setCaptchaError]);

  const handleCaptchaError = useCallback((error?: string) => {
    console.error('CAPTCHA error:', error);
    setCaptchaToken(null);
    
    // Provide more helpful error messages
    let errorMessage = 'CAPTCHA verification failed';
    if (error?.includes('timeout')) {
      errorMessage = 'CAPTCHA timed out. Please try again.';
    } else if (error?.includes('network')) {
      errorMessage = 'Network error. Please check your connection and try again.';
    } else if (error) {
      errorMessage = `CAPTCHA error: ${error}`;
    }
    
    setCaptchaError(errorMessage);
    setCaptchaKey(captchaKey + 1);
  }, [setCaptchaToken, setCaptchaError, setCaptchaKey, captchaKey]);

  const handleRetry = useCallback(() => {
    setCaptchaToken(null);
    setCaptchaError(null);
    setCaptchaKey(captchaKey + 1);
  }, [setCaptchaToken, setCaptchaError, setCaptchaKey, captchaKey]);

  // Development bypass for testing
  const handleDevBypass = useCallback(() => {
    if (import.meta.env.DEV) {
      console.log('Development mode: bypassing CAPTCHA with test token');
      setCaptchaToken('dev-bypass-token');
      setCaptchaError(null);
      setIsManualTesting(true);
    }
  }, [setCaptchaToken, setCaptchaError]);

  return (
    <div className="space-y-2">
      <Label>Security Verification</Label>
      
      {/* Development helpers */}
      {import.meta.env.DEV && (
        <Alert>
          <Bug className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="text-sm font-medium">Development Mode</p>
              <p className="text-xs">
                If CAPTCHA is not working, you can use the bypass button below for testing.
              </p>
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                onClick={handleDevBypass}
                className="text-xs"
              >
                <Bug className="h-3 w-3 mr-1" />
                Bypass CAPTCHA (Dev Only)
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center">
        {!isManualTesting ? (
          <Turnstile
            key={captchaKey}
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={handleCaptchaSuccess}
            onError={handleCaptchaError}
            options={{
              theme: 'auto',
              size: 'normal',
              retry: 'auto',
              'retry-interval': 8000,
              'refresh-expired': 'auto'
            }}
          />
        ) : (
          <div className="p-4 border border-dashed border-muted-foreground rounded-lg text-center">
            <Bug className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Development Bypass Active</p>
          </div>
        )}
      </div>

      {captchaError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>{captchaError}</p>
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry CAPTCHA
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {captchaToken && !captchaError && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            CAPTCHA verified successfully
            {isManualTesting && (
              <span className="text-xs text-muted-foreground ml-2">(Development bypass)</span>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
