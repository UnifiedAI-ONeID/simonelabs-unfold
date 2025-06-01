
import { PasswordValidationResult } from '@/lib/enhancedPasswordValidation';

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
  if (isFormValid || isSubmitting) return null;

  return (
    <div className="text-sm text-muted-foreground space-y-1">
      <p className="text-center">Complete all requirements to continue:</p>
      <ul className="text-xs space-y-1">
        {!email && <li>• Enter your email address</li>}
        {!password && <li>• Enter your password</li>}
        {!passwordValidation?.isValid && <li>• Password must meet security requirements</li>}
        {confirmPassword && password !== confirmPassword && <li>• Passwords must match</li>}
        {!captchaToken && <li>• Complete CAPTCHA verification</li>}
      </ul>
    </div>
  );
};
