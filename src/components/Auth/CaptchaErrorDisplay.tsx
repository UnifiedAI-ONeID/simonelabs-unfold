
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Bug, Loader2 } from 'lucide-react';
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

  return (
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
              onClick={onRetry}
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
                onClick={onDevBypass}
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
  );
};
