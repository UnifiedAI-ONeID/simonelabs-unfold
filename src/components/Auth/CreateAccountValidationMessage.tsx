
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';
import { PasswordValidationResult } from '@/lib/enhancedPasswordValidation';

interface CreateAccountValidationMessageProps {
  isFormValid: boolean;
  isSubmitting: boolean;
  email: string;
  password: string;
  confirmPassword: string;
  passwordValidation: PasswordValidationResult | null;
}

export const CreateAccountValidationMessage = ({
  isFormValid,
  isSubmitting,
  email,
  password,
  confirmPassword,
  passwordValidation
}: CreateAccountValidationMessageProps) => {
  if (isSubmitting) {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Creating your account...
        </AlertDescription>
      </Alert>
    );
  }

  if (isFormValid) {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Ready to create account!
        </AlertDescription>
      </Alert>
    );
  }

  const issues = [];
  if (!email) issues.push('Email address required');
  if (!password) issues.push('Password required');
  if (!confirmPassword) issues.push('Password confirmation required');
  if (password && confirmPassword && password !== confirmPassword) {
    issues.push('Passwords must match');
  }
  if (passwordValidation && !passwordValidation.isValid) {
    issues.push('Password must meet security requirements');
  }

  return (
    <Alert variant="destructive">
      <XCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-1">
          {issues.map((issue, index) => (
            <div key={index}>• {issue}</div>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
};
