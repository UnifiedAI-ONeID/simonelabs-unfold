
import { Turnstile } from '@marsidev/react-turnstile';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TURNSTILE_SITE_KEY = '0x4AAAAAABfVmLaPZh3sMQ7-';

interface CaptchaWidgetProps {
  captchaKey: number;
  onSuccess: (token: string) => void;
  onError: (error?: string) => void;
  onBeforeInteractive: () => void;
  onAfterInteractive: () => void;
  isLoading: boolean;
}

export const CaptchaWidget = ({
  captchaKey,
  onSuccess,
  onError,
  onBeforeInteractive,
  onAfterInteractive,
  isLoading
}: CaptchaWidgetProps) => {
  const { t } = useTranslation('auth');

  return (
    <div className="flex justify-center relative">
      <div className="relative">
        <Turnstile
          key={captchaKey}
          siteKey={TURNSTILE_SITE_KEY}
          onSuccess={onSuccess}
          onError={onError}
          onBeforeInteractive={onBeforeInteractive}
          onAfterInteractive={onAfterInteractive}
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
    </div>
  );
};
