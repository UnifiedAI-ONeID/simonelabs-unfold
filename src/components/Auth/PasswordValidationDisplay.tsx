
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';
import { PasswordValidationResult } from '@/lib/enhancedPasswordValidation';

interface PasswordValidationDisplayProps {
  passwordValidation: PasswordValidationResult;
}

export const PasswordValidationDisplay = ({ passwordValidation }: PasswordValidationDisplayProps) => {
  const getPasswordStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  return (
    <div className="space-y-2">
      <div className={`text-sm font-medium ${getPasswordStrengthColor(passwordValidation.strength)}`}>
        Password Strength: {passwordValidation.strength.toUpperCase()}
      </div>
      {passwordValidation.errors.length > 0 && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {passwordValidation.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      {passwordValidation.isValid && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Password meets all security requirements
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
