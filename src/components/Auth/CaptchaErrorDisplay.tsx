
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Shield, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CaptchaErrorDisplayProps {
  captchaError: string | null;
  retryCount: number;
  isLoading: boolean;
  isManualTesting: boolean;
  onRetry: () => void;
  onDevBypass: () => void;
}

export const CaptchaErrorDisplay = ({
  captchaError,
  retryCount,
  isLoading,
  isManualTesting,
  onRetry,
  onDevBypass
}: CaptchaErrorDisplayProps) => {
  const { t } = useTranslation('auth');

  if (!captchaError) return null;

  const getErrorSeverity = (error: string) => {
    if (error.includes('timeout') || error.includes('network')) return 'warning';
    if (error.includes('configuration') || error.includes('service')) return 'destructive';
    return 'destructive';
  };

  const getErrorIcon = (error: string) => {
    if (error.includes('timeout') || error.includes('network')) return Info;
    return AlertTriangle;
  };

  const ErrorIcon = getErrorIcon(captchaError);
  const severity = getErrorSeverity(captchaError);

  return (
    <Alert variant={severity} className="text-sm">
      <ErrorIcon className="h-4 w-4" />
      <AlertDescription className="flex flex-col gap-2">
        <span>{captchaError}</span>
        {retryCount > 0 && (
          <span className="text-xs opacity-75">
            {t('captcha.retryAttempt', `Retry attempt ${retryCount}`, { count: retryCount })}
          </span>
        )}
        {import.meta.env.DEV && (
          <div className="text-xs opacity-60 bg-muted p-2 rounded">
            Debug: Error type detected as "{severity}" | Retry count: {retryCount}
          </div>
        )}
        <div className="flex gap-2 mt-2">
          <Button
            onClick={onRetry}
            size="sm"
            variant="outline"
            disabled={isLoading}
            className="h-8 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            {t('captcha.retry', 'Retry')}
          </Button>
          {import.meta.env.DEV && !isManualTesting && (
            <Button
              onClick={onDevBypass}
              size="sm"
              variant="secondary"
              className="h-8 text-xs"
            >
              <Shield className="h-3 w-3 mr-1" />
              {t('captcha.devBypass', 'Dev Bypass')}
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};
