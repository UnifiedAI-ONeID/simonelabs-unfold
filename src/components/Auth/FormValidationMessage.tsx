
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
  if (isFormValid || isSubmitting) return null;

  return (
    <div className="text-sm text-muted-foreground space-y-1">
      <p className="text-center">Complete all requirements to continue:</p>
      <ul className="text-xs space-y-1">
        {!email && <li>• Enter your email address</li>}
        {!password && <li>• Enter your password</li>}
        {!captchaToken && <li>• Complete CAPTCHA verification</li>}
      </ul>
    </div>
  );
};
