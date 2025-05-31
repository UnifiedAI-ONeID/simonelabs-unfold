import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signUp, signIn, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!turnstileToken) {
      toast({
        title: "CAPTCHA Required",
        description: "Please complete the CAPTCHA verification.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await resetPassword(email);
        
        if (error) {
          toast({
            title: "Password Reset Failed",
            description: error.message || "Please check your email and try again.",
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "Password Reset Email Sent",
          description: "Please check your email for password reset instructions.",
        });
        setIsForgotPassword(false);
        return;
      }

      if (isLogin) {
        const { error } = await signIn(email, password);
        
        if (error) {
          console.error('Login error:', {
            message: error.message,
            status: error.status,
            code: error.code,
            details: error
          });
          
          if (error.message?.includes('Invalid login credentials')) {
            toast({
              title: "Login Failed",
              description: "Invalid email or password. Please check your credentials and try again.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Login Error",
              description: error.message || "An error occurred during login.",
              variant: "destructive",
            });
          }
          setLoading(false);
          return;
        }
        
        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in.",
        });

        // Redirect to the intended page or dashboard
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        const { error } = await signUp(email, password, fullName);
        
        if (error) {
          console.error('Registration error:', {
            message: error.message,
            status: error.status,
            code: error.code,
            details: error
          });
          
          if (error.message?.includes('User already registered')) {
            toast({
              title: "Account Exists",
              description: "An account with this email already exists. Please sign in instead.",
              variant: "destructive",
            });
            setIsLogin(true);
          } else {
            toast({
              title: "Registration Error",
              description: error.message || "An error occurred during registration.",
              variant: "destructive",
            });
          }
          setLoading(false);
          return;
        }
        
        toast({
          title: "Account created successfully!",
          description: "Welcome to SimoneLabs! You can now start learning.",
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Auth process failed:', {
        message: error.message,
        stack: error.stack,
        details: error
      });
      toast({
        title: "Authentication Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      // Reset Turnstile after form submission
      if (turnstileRef.current) {
        (turnstileRef.current as any).reset();
      }
      setTurnstileToken(null);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setShowPassword(false);
    setTurnstileToken(null);
    if (turnstileRef.current) {
      (turnstileRef.current as any).reset();
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl p-8 border border-border/60">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold gradient-text heading">SimoneLabs</h1>
          <p className="text-muted-foreground mt-2">
            {isForgotPassword 
              ? 'Reset your password'
              : isLogin 
                ? 'Welcome back!' 
                : 'Join our learning community'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && !isForgotPassword && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  placeholder="Enter your full name"
                  className="pl-10 rounded-xl border-border/60 focus:border-primary"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="pl-10 rounded-xl border-border/60 focus:border-primary"
              />
            </div>
          </div>

          {!isForgotPassword && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  minLength={6}
                  className="pl-10 pr-10 rounded-xl border-border/60 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>
          )}

          <div className="flex justify-center">
            <Turnstile
              ref={turnstileRef}
              siteKey="0x4AAAAAABfVmLaPZh3sMQ7-"
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => {
                setTurnstileToken(null);
                toast({
                  title: "CAPTCHA Error",
                  description: "Failed to verify CAPTCHA. Please try again.",
                  variant: "destructive",
                });
              }}
              onExpire={() => {
                setTurnstileToken(null);
                toast({
                  title: "CAPTCHA Expired",
                  description: "Please complete the CAPTCHA verification again.",
                  variant: "destructive",
                });
              }}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl py-3 font-medium transition-all duration-200"
            disabled={loading || !turnstileToken}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {isForgotPassword 
                  ? 'Sending reset email...' 
                  : isLogin 
                    ? 'Signing in...' 
                    : 'Creating account...'}
              </div>
            ) : (
              isForgotPassword 
                ? 'Send Reset Email' 
                : isLogin 
                  ? 'Sign In' 
                  : 'Create Account'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {isLogin && !isForgotPassword && (
            <button
              onClick={() => setIsForgotPassword(true)}
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-200"
            >
              Forgot your password?
            </button>
          )}
          
          {isForgotPassword && (
            <button
              onClick={() => setIsForgotPassword(false)}
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
            >
              Back to Sign In
            </button>
          )}
          
          {!isForgotPassword && (
            <button
              onClick={toggleMode}
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
            >
              {isLogin
                ? "Don't have an account? Create one"
                : 'Already have an account? Sign in'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;