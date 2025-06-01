
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Bug } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CaptchaDevControlsProps {
  onDevBypass: () => void;
  isManualTesting: boolean;
}

export const CaptchaDevControls = ({ onDevBypass, isManualTesting }: CaptchaDevControlsProps) => {
  const { t } = useTranslation('auth');

  if (!import.meta.env.DEV) return null;

  if (isManualTesting) {
    return (
      <div className="p-4 border border-dashed border-green-300 bg-green-50 rounded-lg text-center">
        <Bug className="h-6 w-6 mx-auto mb-2 text-green-600" />
        <p className="text-sm text-green-700 font-medium">{t('captcha.devBypassActive')}</p>
        <p className="text-xs text-green-600 mt-1">{t('captcha.devBypassDescription')}</p>
      </div>
    );
  }

  return (
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
            onClick={onDevBypass}
            className="text-xs border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            <Bug className="h-3 w-3 mr-1" />
            {t('captcha.bypassButton')}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
