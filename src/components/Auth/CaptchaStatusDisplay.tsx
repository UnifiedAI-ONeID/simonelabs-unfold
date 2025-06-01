
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
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

  if (!captchaToken || captchaError) return null;

  return (
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
  );
};
