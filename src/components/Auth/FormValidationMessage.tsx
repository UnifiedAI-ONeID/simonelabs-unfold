
import { useTranslation } from 'react-i18next';

interface FormValidationMessageProps {
  isFormValid: boolean;
  isSubmitting: boolean;
  email: string;
  password: string;
  captchaToken: string | null;
}

export const FormValidationMessage = ({
  isFormValid,
  isSubmitting,
  email,
  password,
  captchaToken
}: FormValidationMessageProps) => {
  const { t } = useTranslation('auth');

  if (isFormValid || isSubmitting) return null;

  return (
    <div className="text-sm text-muted-foreground space-y-1">
      <p className="text-center">{t('validation.completeRequirements')}</p>
      <ul className="text-xs space-y-1">
        {!email && <li>• {t('validation.enterEmail')}</li>}
        {!password && <li>• {t('validation.enterPassword')}</li>}
        {!captchaToken && <li>• {t('validation.completeCaptcha')}</li>}
      </ul>
    </div>
  );
};
