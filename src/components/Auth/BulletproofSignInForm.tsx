
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, Eye, EyeOff, Loader2, XCircle } from 'lucide-react';
import { useBulletproofAuth } from '@/hooks/useBulletproofAuth';
import { Link, useNavigate } from 'react-router-dom';

interface BulletproofSignInFormProps {
  onSuccess?: () => void;
}

export const BulletproofSignInForm = ({ onSuccess }: BulletproofSignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { signIn, resetPassword, retryCount, user } = useBulletproofAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!email.includes('@') || !email.includes('.')) {
        throw new Error('Please enter a valid email address');
      }
      
      console.log('🔐 Submitting signin...', { email, retryCount });
      
      const result = await signIn(email, password);
      
      if (result.error) {
        console.error('❌ Signin failed:', result.error);
        setError(result.error.message || 'Sign in failed');
        return;
      }

      console.log('✅ Signin successful, redirecting...');
      
      // Get the user role and redirect appropriately
      const userRole = result.data?.user?.user_metadata?.role;
      
      if (userRole) {
        const redirectPath = userRole === 'student' ? '/student' : 
                           userRole === 'educator' ? '/educator' : 
                           userRole === 'admin' || userRole === 'superuser' ? '/administration' : 
                           '/dashboard';
        console.log('Redirecting to dashboard based on role:', { userRole, redirectPath });
        navigate(redirectPath, { replace: true });
      } else {
        console.log('No role found, redirecting to role selection');
        navigate('/role-selection', { replace: true });
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('💥 Signin error:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    try {
      await resetPassword(email);
    } catch (error) {
      // Error handling is done in the resetPassword function
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogIn className="h-5 w-5" />
          Welcome Back
        </CardTitle>
        <CardDescription>
          Sign in to your account to continue learning
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
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full pr-10"
                placeholder="Enter your password"
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
                Retry attempt #{retryCount}. If issues persist, try resetting your password.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            
            <Button
              type="button"
              variant="link"
              className="w-full text-sm"
              onClick={handleForgotPassword}
              disabled={isSubmitting || !email}
            >
              Forgot your password?
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <Link to="/create-account">
            <Button type="button" variant="link" disabled={isSubmitting}>
              Don't have an account? Create one here
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
