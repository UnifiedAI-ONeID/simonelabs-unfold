
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
    const requestId = crypto.randomUUID();
    console.log(`[${requestId}] 🎉 CAPTCHA completed successfully!`);
    console.log(`[${requestId}] Token preview: ${token.substring(0, 30)}...`);
    
    setCaptchaToken(token);
    setCaptchaError(null);
    setIsLoading(false);
    setRetryCount(0);
  }, [setCaptchaToken, setCaptchaError]);

  const handleCaptchaError = useCallback((error?: string) => {
    const requestId = crypto.randomUUID();
    console.error(`[${requestId}] ❌ CAPTCHA error occurred:`, error);
    
    setCaptchaToken(null);
    setIsLoading(false);
    
    let errorMessage = t('errors.captchaFailed');
    let shouldAutoRetry = false;
    
    if (error?.includes('timeout')) {
      errorMessage = t('errors.captchaTimeout');
      shouldAutoRetry = retryCount < 2;
      console.log(`[${requestId}] Timeout error, shouldAutoRetry: ${shouldAutoRetry}`);
    } else if (error?.includes('network')) {
      errorMessage = t('errors.captchaNetwork');
      shouldAutoRetry = retryCount < 1;
      console.log(`[${requestId}] Network error, shouldAutoRetry: ${shouldAutoRetry}`);
    } else if (error?.includes('expired')) {
      errorMessage = t('errors.captchaExpired');
      shouldAutoRetry = true;
      console.log(`[${requestId}] Expired error, shouldAutoRetry: ${shouldAutoRetry}`);
    } else if (error) {
      errorMessage = t('errors.captchaError', { error });
      console.log(`[${requestId}] Generic error: ${error}`);
    }
    
    setCaptchaError(errorMessage);
    
    // Auto-retry for certain error types
    if (shouldAutoRetry && retryCount < 3) {
      console.log(`[${requestId}] 🔄 Auto-retrying CAPTCHA (attempt ${retryCount + 2})...`);
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setCaptchaKey(captchaKey + 1);
        setCaptchaError(null);
      }, 2000);
    }
  }, [setCaptchaToken, setCaptchaError, setCaptchaKey, captchaKey, retryCount, t]);

  const handleRetry = useCallback(() => {
    const requestId = crypto.randomUUID();
    console.log(`[${requestId}] 🔄 Manual retry requested`);
    
    setIsLoading(true);
    setCaptchaToken(null);
    setCaptchaError(null);
    setRetryCount(prev => prev + 1);
    setCaptchaKey(captchaKey + 1);
    
    // Reset loading state after timeout
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  }, [setCaptchaToken, setCaptchaError, setCaptchaKey, captchaKey]);

  const handleDevBypass = useCallback(() => {
    if (import.meta.env.DEV) {
      const requestId = crypto.randomUUID();
      console.log(`[${requestId}] 🔧 Development mode: bypassing CAPTCHA with test token`);
      
      setCaptchaToken('dev-bypass-token');
      setCaptchaError(null);
      setIsManualTesting(true);
      setIsLoading(false);
    }
  }, [setCaptchaToken, setCaptchaError]);

  const handleBeforeInteractive = useCallback(() => {
    setIsLoading(true);
    console.log('🔄 CAPTCHA widget loading...');
  }, []);

  const handleAfterInteractive = useCallback(() => {
    setIsLoading(false);
    console.log('✅ CAPTCHA widget ready for interaction');
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
