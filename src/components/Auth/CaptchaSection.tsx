
import { useCallback, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Shield, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CaptchaWidget } from './CaptchaWidget';
import { CaptchaDevControls } from './CaptchaDevControls';
import { CaptchaErrorDisplay } from './CaptchaErrorDisplay';
import { CaptchaStatusDisplay } from './CaptchaStatusDisplay';

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
  const { t } = useTranslation('auth');
  const [isManualTesting, setIsManualTesting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleCaptchaSuccess = useCallback((token: string) => {
    console.log('CAPTCHA completed successfully:', token.substring(0, 20) + '...');
    setCaptchaToken(token);
    setCaptchaError(null);
    setIsLoading(false);
    setRetryCount(0);
  }, [setCaptchaToken, setCaptchaError]);

  const handleCaptchaError = useCallback((error?: string) => {
    console.error('CAPTCHA error:', error);
    setCaptchaToken(null);
    setIsLoading(false);
    
    let errorMessage = t('errors.captchaFailed');
    let shouldAutoRetry = false;
    
    if (error?.includes('timeout')) {
      errorMessage = t('errors.captchaTimeout');
      shouldAutoRetry = retryCount < 2;
    } else if (error?.includes('network')) {
      errorMessage = t('errors.captchaNetwork');
      shouldAutoRetry = retryCount < 1;
    } else if (error?.includes('expired')) {
      errorMessage = t('errors.captchaExpired');
      shouldAutoRetry = true;
    } else if (error) {
      errorMessage = t('errors.captchaError', { error });
    }
    
    setCaptchaError(errorMessage);
    
    // Auto-retry for certain error types
    if (shouldAutoRetry && retryCount < 3) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setCaptchaKey(captchaKey + 1);
        setCaptchaError(null);
      }, 2000);
    }
  }, [setCaptchaToken, setCaptchaError, setCaptchaKey, captchaKey, retryCount, t]);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setCaptchaToken(null);
    setCaptchaError(null);
    setRetryCount(prev => prev + 1);
    setCaptchaKey(captchaKey + 1);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  }, [setCaptchaToken, setCaptchaError, setCaptchaKey, captchaKey]);

  const handleDevBypass = useCallback(() => {
    if (import.meta.env.DEV) {
      console.log('Development mode: bypassing CAPTCHA with test token');
      setCaptchaToken('dev-bypass-token');
      setCaptchaError(null);
      setIsManualTesting(true);
      setIsLoading(false);
    }
  }, [setCaptchaToken, setCaptchaError]);

  const handleBeforeInteractive = useCallback(() => {
    setIsLoading(true);
    console.log('CAPTCHA widget loading...');
  }, []);

  const handleAfterInteractive = useCallback(() => {
    setIsLoading(false);
    console.log('CAPTCHA widget ready for interaction');
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary" />
        <Label className="text-sm font-medium">{t('captcha.label')}</Label>
        {isLoading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
      </div>
      
      <CaptchaDevControls 
        onDevBypass={handleDevBypass}
        isManualTesting={isManualTesting}
      />

      {!isManualTesting ? (
        <CaptchaWidget
          captchaKey={captchaKey}
          onSuccess={handleCaptchaSuccess}
          onError={handleCaptchaError}
          onBeforeInteractive={handleBeforeInteractive}
          onAfterInteractive={handleAfterInteractive}
          isLoading={isLoading}
        />
      ) : (
        <CaptchaDevControls 
          onDevBypass={handleDevBypass}
          isManualTesting={isManualTesting}
        />
      )}

      <CaptchaErrorDisplay
        captchaError={captchaError}
        retryCount={retryCount}
        isLoading={isLoading}
        isManualTesting={isManualTesting}
        onRetry={handleRetry}
        onDevBypass={handleDevBypass}
      />

      <CaptchaStatusDisplay
        captchaToken={captchaToken}
        captchaError={captchaError}
        isManualTesting={isManualTesting}
      />
    </div>
  );
};
