
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CaptchaStatusDisplayProps {
  captchaToken: string | null;
  captchaError: string | null;
  isManualTesting: boolean;
}

export const CaptchaStatusDisplay = ({
  captchaToken,
  captchaError,
  isManualTesting
}: CaptchaStatusDisplayProps) => {
  const { t } = useTranslation('auth');

  if (captchaToken) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Badge variant="default" className="flex items-center gap-1 text-xs">
          <CheckCircle className="h-3 w-3" />
          {isManualTesting ? t('captcha.devMode', 'Dev Mode') : t('captcha.verified', 'Verified')}
        </Badge>
        {isManualTesting && (
          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
            <Shield className="h-3 w-3" />
            {t('captcha.testMode', 'Test Mode')}
          </Badge>
        )}
      </div>
    );
  }

  if (captchaError) {
    return (
      <div className="flex items-center justify-center">
        <Badge variant="destructive" className="flex items-center gap-1 text-xs">
          <XCircle className="h-3 w-3" />
          {t('captcha.failed', 'Failed')}
        </Badge>
      </div>
    );
  }

  return null;
};
