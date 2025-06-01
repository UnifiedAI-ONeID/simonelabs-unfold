
import { useCallback, useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Shield, Loader2, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CaptchaWidget } from './CaptchaWidget';
import { CaptchaDevControls } from './CaptchaDevControls';
import { CaptchaErrorDisplay } from './CaptchaErrorDisplay';
import { CaptchaStatusDisplay } from './CaptchaStatusDisplay';
import { CaptchaDebugPanel } from './CaptchaDebugPanel';

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
  const [lastError, setLastError] = useState<string | null>(null);

  // Enhanced logging for debugging
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🛡️ CAPTCHA Section State:', {
        hasToken: !!captchaToken,
        tokenPreview: captchaToken?.substring(0, 20) + '...',
        hasError: !!captchaError,
        error: captchaError,
        isLoading,
        retryCount,
        isManualTesting,
        captchaKey
      });
    }
  }, [captchaToken, captchaError, isLoading, retryCount, isManualTesting, captchaKey]);

  const handleCaptchaSuccess = useCallback((token: string) => {
    const requestId = crypto.randomUUID();
    console.log(`[${requestId}] 🎉 CAPTCHA completed successfully!`);
    console.log(`[${requestId}] Token preview: ${token.substring(0, 30)}...`);
    
    setCaptchaToken(token);
    setCaptchaError(null);
    setLastError(null);
    setIsLoading(false);
    setRetryCount(0);
  }, [setCaptchaToken, setCaptchaError]);

  const handleCaptchaError = useCallback((error?: string) => {
    const requestId = crypto.randomUUID();
    console.error(`[${requestId}] ❌ CAPTCHA error occurred:`, error);
    
    setCaptchaToken(null);
    setIsLoading(false);
    setLastError(error || 'Unknown error');
    
    let errorMessage = t('errors.captchaFailed', 'Security verification failed. Please try again.');
    let shouldAutoRetry = false;
    
    if (error?.includes('timeout')) {
      errorMessage = t('errors.captchaTimeout', 'Security verification timed out. Please try again.');
      shouldAutoRetry = retryCount < 2;
    } else if (error?.includes('network')) {
      errorMessage = t('errors.captchaNetwork', 'Network error during verification. Please check your connection.');
      shouldAutoRetry = retryCount < 1;
    } else if (error?.includes('expired')) {
      errorMessage = t('errors.captchaExpired', 'Security verification expired. Please complete it again.');
      shouldAutoRetry = true;
    } else if (error) {
      errorMessage = t('errors.captchaError', 'Security verification error: {{error}}', { error });
    }
    
    setCaptchaError(errorMessage);
    
    // Auto-retry for certain error types with exponential backoff
    if (shouldAutoRetry && retryCount < 3) {
      console.log(`[${requestId}] 🔄 Auto-retrying CAPTCHA (attempt ${retryCount + 2})...`);
      const delay = Math.min(1000 * Math.pow(2, retryCount), 5000); // Max 5 second delay
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setCaptchaKey(captchaKey + 1);
        setCaptchaError(null);
      }, delay);
    }
  }, [setCaptchaToken, setCaptchaError, setCaptchaKey, captchaKey, retryCount, t]);

  const handleRetry = useCallback(() => {
    const requestId = crypto.randomUUID();
    console.log(`[${requestId}] 🔄 Manual retry requested (attempt ${retryCount + 2})`);
    
    setIsLoading(true);
    setCaptchaToken(null);
    setCaptchaError(null);
    setLastError(null);
    setRetryCount(prev => prev + 1);
    setCaptchaKey(captchaKey + 1);
    
    // Reset loading state after timeout
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  }, [setCaptchaToken, setCaptchaError, setCaptchaKey, captchaKey, retryCount]);

  const handleDevBypass = useCallback(() => {
    if (import.meta.env.DEV) {
      const requestId = crypto.randomUUID();
      console.log(`[${requestId}] 🔧 Development mode: bypassing CAPTCHA with test token`);
      
      setCaptchaToken('dev-bypass-token');
      setCaptchaError(null);
      setLastError(null);
      setIsManualTesting(true);
      setIsLoading(false);
      setRetryCount(0);
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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary" />
        <Label className="text-sm font-medium">{t('captcha.label', 'Security Verification')}</Label>
        {isLoading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
        {retryCount > 0 && (
          <span className="text-xs text-muted-foreground">
            (Attempt {retryCount + 1})
          </span>
        )}
      </div>

      {/* Debug panel for development */}
      {import.meta.env.DEV && <CaptchaDebugPanel />}
      
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

      {/* Additional debug info for development */}
      {import.meta.env.DEV && lastError && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded border">
          <strong>Last Error:</strong> {lastError}
        </div>
      )}
    </div>
  );
};
