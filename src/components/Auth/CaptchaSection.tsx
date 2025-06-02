
import { Shield, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          {t('captcha.label', 'Security Verification')}
        </span>
      </div>

      <div className="flex items-center justify-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2 text-yellow-800">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">
            CAPTCHA verification is currently disabled
          </span>
        </div>
      </div>

      {import.meta.env.DEV && (
        <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded border">
          <strong>Debug Info:</strong>
          <div>• CAPTCHA validation bypassed for all requests</div>
          <div>• Authentication will work without CAPTCHA completion</div>
          <div>• Re-enable CAPTCHA when ready for production</div>
        </div>
      )}
    </div>
  );
};
