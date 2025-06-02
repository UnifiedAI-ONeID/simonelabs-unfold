
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useBulletproofAuth } from '@/hooks/useBulletproofAuth';
import { Link } from 'react-router-dom';

interface BulletproofCreateAccountFormProps {
  onSuccess?: () => void;
}

export const BulletproofCreateAccountForm = ({ onSuccess }: BulletproofCreateAccountFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const { signUp, retryCount } = useBulletproofAuth();

  // Real-time password validation
  const validatePassword = useCallback((pwd: string): string[] => {
    const errors: string[] = [];
    
    if (pwd.length < 8) {
      errors.push('At least 8 characters long');
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push('At least one uppercase letter');
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push('At least one lowercase letter');
    }
    if (!/\d/.test(pwd)) {
      errors.push('At least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      errors.push('At least one special character');
    }
    
    return errors;
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    setValidationErrors(validatePassword(value));
  }, [validatePassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Client-side validation
      if (!email || !password || !confirmPassword) {
        throw new Error('All fields are required');
      }

      if (!email.includes('@') || !email.includes('.')) {
        throw new Error('Please enter a valid email address');
      }

      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        throw new Error('Password does not meet security requirements');
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      console.log('🚀 Submitting account creation...', { email, retryCount });
      
      const result = await signUp(email, password, confirmPassword);
      
      if (result.error) {
        console.error('❌ Account creation failed:', result.error);
        setError(result.error.message || 'Account creation failed');
        return;
      }

      console.log('✅ Account creation successful');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('💥 Create account error:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    if (!email || !password || !confirmPassword) return false;
    if (validationErrors.length > 0) return false;
    if (password !== confirmPassword) return false;
    return true;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Create Your Account
        </CardTitle>
        <CardDescription>
          Join our learning community and start your educational journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full"
              placeholder="Enter your email address"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Create Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full pr-10"
                placeholder="Create a strong password"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            
            {password && validationErrors.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm font-medium text-amber-800 mb-2">Password must include:</p>
                <ul className="space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-amber-700">
                      <XCircle className="h-3 w-3" />
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {password && validationErrors.length === 0 && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                Password meets security requirements
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full pr-10"
                placeholder="Confirm your password"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Passwords do not match
                </AlertDescription>
              </Alert>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {retryCount > 0 && (
            <Alert>
              <AlertDescription>
                Retry attempt #{retryCount}. If you continue having issues, please try a different email address.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
            
            {isFormValid() && !isSubmitting && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Ready to create your account!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </form>

        <div className="mt-4 text-center">
          <Link to="/signin">
            <Button type="button" variant="link" disabled={isSubmitting}>
              Already have an account? Sign in here
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
