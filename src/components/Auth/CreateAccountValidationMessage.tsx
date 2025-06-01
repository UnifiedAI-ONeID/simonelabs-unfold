
import { PasswordValidationResult } from '@/lib/enhancedPasswordValidation';
import { useTranslation } from 'react-i18next';

interface CreateAccountValidationMessageProps {
  isFormValid: boolean;
  isSubmitting: boolean;
  email: string;
  password: string;
  confirmPassword: string;
  passwordValidation: PasswordValidationResult | null;
  captchaToken: string | null;
}

export const CreateAccountValidationMessage = ({
  isFormValid,
  isSubmitting,
  email,
  password,
  confirmPassword,
  passwordValidation,
  captchaToken
}: CreateAccountValidationMessageProps) => {
  const { t } = useTranslation('auth');

  if (isFormValid || isSubmitting) return null;

  return (
    <div className="text-sm text-muted-foreground space-y-1">
      <p className="text-center">{t('validation.completeRequirements')}</p>
      <ul className="text-xs space-y-1">
        {!email && <li>• {t('validation.enterEmail')}</li>}
        {!password && <li>• {t('validation.enterPassword')}</li>}
        {!passwordValidation?.isValid && <li>• {t('validation.passwordSecurityRequirements')}</li>}
        {confirmPassword && password !== confirmPassword && <li>• {t('validation.passwordMustMatch')}</li>}
        {!captchaToken && <li>• {t('validation.completeCaptcha')}</li>}
      </ul>
    </div>
  );
};
