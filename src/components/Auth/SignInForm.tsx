
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { useSimplifiedAuth } from '@/hooks/useSimplifiedAuth';
import { SignInFormFields } from '@/components/Auth/SignInFormFields';
import { FormValidationMessage } from '@/components/Auth/FormValidationMessage';
import { Link } from 'react-router-dom';

interface SignInFormProps {
  onSuccess?: () => void;
}

export const SignInForm = ({ onSuccess }: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn } = useSimplifiedAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('🔐 Starting sign in process...', { email });
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      const result = await signIn(email, password);
      
      if (result.error) {
        console.error('❌ Sign in failed:', result.error);
        setError(result.error.message || 'Sign in failed');
        return;
      }

      console.log('✅ Sign in successful');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('💥 Sign in error:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return email.trim() !== '' && password.trim() !== '';
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogIn className="h-5 w-5" />
          Welcome Back
        </CardTitle>
        <CardDescription>
          Sign in to your account to continue your learning journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <SignInFormFields
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
            
            <FormValidationMessage
              isFormValid={isFormValid()}
              isSubmitting={isSubmitting}
              email={email}
              password={password}
            />
          </div>
        </form>

        <div className="mt-4 text-center">
          <Link to="/create-account">
            <Button type="button" variant="link">
              Don't have an account? Create one here
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
