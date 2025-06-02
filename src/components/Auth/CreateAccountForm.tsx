
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { validatePassword, type PasswordValidationResult } from '@/lib/enhancedPasswordValidation';
import { CreateAccountFormFields } from '@/components/Auth/CreateAccountFormFields';
import { CreateAccountValidationMessage } from '@/components/Auth/CreateAccountValidationMessage';
import { Link, useNavigate } from 'react-router-dom';

interface CreateAccountFormProps {
  onSuccess?: () => void;
}

export const CreateAccountForm = ({ onSuccess }: CreateAccountFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { signUp } = useEnhancedAuth();

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    if (value) {
      setPasswordValidation(validatePassword(value));
    } else {
      setPasswordValidation(null);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Starting account creation process...');

      if (!passwordValidation?.isValid) {
        throw new Error('Please ensure your password meets all requirements');
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      console.log('Attempting to create account...');
      const { error } = await signUp(email, password, confirmPassword);
      
      if (error) {
        console.error('Account creation failed:', error);
        return;
      }

      console.log('Account creation successful');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Create account error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    if (!email || !password || !confirmPassword) return false;
    if (!passwordValidation?.isValid) return false;
    if (password !== confirmPassword) return false;
    return true;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Join Our Community
        </CardTitle>
        <CardDescription>
          Create a new account to start your learning journey with us
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CreateAccountFormFields
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={handlePasswordChange}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            passwordValidation={passwordValidation}
          />

          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create New Account'}
            </Button>
            
            <CreateAccountValidationMessage
              isFormValid={isFormValid()}
              isSubmitting={isSubmitting}
              email={email}
              password={password}
              confirmPassword={confirmPassword}
              passwordValidation={passwordValidation}
            />
          </div>
        </form>

        <div className="mt-4 text-center">
          <Link to="/signin">
            <Button type="button" variant="link">
              Already have an account? Sign in here
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
