
import { useCallback, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Turnstile } from '@marsidev/react-turnstile';
import { CheckCircle, AlertCircle } from 'lucide-react';

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
  const handleCaptchaSuccess = useCallback((token: string) => {
    console.log('CAPTCHA completed successfully:', token.substring(0, 20) + '...');
    setCaptchaToken(token);
    setCaptchaError(null);
  }, [setCaptchaToken, setCaptchaError]);

  const handleCaptchaError = useCallback((error?: string) => {
    console.error('CAPTCHA error:', error);
    setCaptchaToken(null);
    setCaptchaError(error || 'CAPTCHA verification failed');
    setCaptchaKey(prev => prev + 1);
  }, [setCaptchaToken, setCaptchaError, setCaptchaKey]);

  return (
    <div className="space-y-2">
      <Label>Security Verification</Label>
      <div className="flex justify-center">
        <Turnstile
          key={captchaKey}
          siteKey={TURNSTILE_SITE_KEY}
          onSuccess={handleCaptchaSuccess}
          onError={handleCaptchaError}
          options={{
            theme: 'auto',
            size: 'normal',
            retry: 'auto'
          }}
        />
      </div>
      {captchaError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {captchaError}. Please try again.
          </AlertDescription>
        </Alert>
      )}
      {captchaToken && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            CAPTCHA verified successfully
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
