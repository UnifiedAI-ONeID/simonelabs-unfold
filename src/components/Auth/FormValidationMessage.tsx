
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';

interface FormValidationMessageProps {
  isFormValid: boolean;
  isSubmitting: boolean;
  email: string;
  password: string;
  captchaToken: string | null; // This will always be null when CAPTCHA is disabled
}

export const FormValidationMessage = ({
  isFormValid,
  isSubmitting,
  email,
  password,
  captchaToken
}: FormValidationMessageProps) => {
  if (isSubmitting) {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Processing your sign in request...
        </AlertDescription>
      </Alert>
    );
  }

  if (isFormValid) {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Ready to sign in! (CAPTCHA disabled)
        </AlertDescription>
      </Alert>
    );
  }

  const missingFields = [];
  if (!email) missingFields.push('Email address');
  if (!password) missingFields.push('Password');

  return (
    <Alert variant="destructive">
      <XCircle className="h-4 w-4" />
      <AlertDescription>
        Please complete: {missingFields.join(', ')}
      </AlertDescription>
    </Alert>
  );
};
