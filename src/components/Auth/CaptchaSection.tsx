
import { useCallback, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Turnstile } from '@marsidev/react-turnstile';
import { CheckCircle, AlertCircle, RefreshCw, Bug, Loader2, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
      
      {/* Development helpers */}
      {import.meta.env.DEV && (
        <Alert className="border-orange-200 bg-orange-50">
          <Bug className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="text-sm font-medium text-orange-800">{t('captcha.devMode')}</p>
              <p className="text-xs text-orange-700">
                {t('captcha.devDescription')}
              </p>
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                onClick={handleDevBypass}
                className="text-xs border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                <Bug className="h-3 w-3 mr-1" />
                {t('captcha.bypassButton')}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center relative">
        {!isManualTesting ? (
          <div className="relative">
            <Turnstile
              key={captchaKey}
              siteKey={TURNSTILE_SITE_KEY}
              onSuccess={handleCaptchaSuccess}
              onError={handleCaptchaError}
              onBeforeInteractive={handleBeforeInteractive}
              onAfterInteractive={handleAfterInteractive}
              options={{
                theme: 'auto',
                size: 'normal',
                retry: 'auto'
              }}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('captcha.loading')}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 border border-dashed border-green-300 bg-green-50 rounded-lg text-center">
            <Bug className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-green-700 font-medium">{t('captcha.devBypassActive')}</p>
            <p className="text-xs text-green-600 mt-1">{t('captcha.devBypassDescription')}</p>
          </div>
        )}
      </div>

      {captchaError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="text-sm">{captchaError}</p>
              {retryCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  {t('captcha.retryAttempt', { count: retryCount })}
                </p>
              )}
              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry}
                  disabled={isLoading}
                  className="text-xs"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      {t('captcha.retrying')}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      {t('captcha.retryButton')}
                    </>
                  )}
                </Button>
                {import.meta.env.DEV && !isManualTesting && (
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm" 
                    onClick={handleDevBypass}
                    className="text-xs"
                  >
                    <Bug className="h-3 w-3 mr-1" />
                    {t('captcha.useDevBypass')}
                  </Button>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {captchaToken && !captchaError && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('captcha.verified')}</span>
              {isManualTesting && (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  {t('captcha.devModeLabel')}
                </span>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
