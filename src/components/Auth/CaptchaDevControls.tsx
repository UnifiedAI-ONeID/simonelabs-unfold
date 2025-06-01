
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Code } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CaptchaDevControlsProps {
  onDevBypass: () => void;
  isManualTesting: boolean;
}

export const CaptchaDevControls = ({
  onDevBypass,
  isManualTesting
}: CaptchaDevControlsProps) => {
  const { t } = useTranslation('auth');

  if (!import.meta.env.DEV) return null;

  if (isManualTesting) {
    return (
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="flex items-center justify-between">
            <span className="text-sm">
              {t('captcha.devModeActive', 'Development mode: CAPTCHA bypassed')}
            </span>
            <Code className="h-4 w-4" />
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="text-center">
      <Button
        onClick={onDevBypass}
        variant="outline"
        size="sm"
        className="text-xs border-dashed"
      >
        <Shield className="h-3 w-3 mr-1" />
        {t('captcha.devBypass', 'Dev Bypass')}
      </Button>
    </div>
  );
};
