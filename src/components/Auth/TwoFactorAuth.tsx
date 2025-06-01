
import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Shield, CheckCircle, AlertCircle, RefreshCw, Bug } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TwoFactorAuthProps {
  email: string;
  onVerified: () => void;
  onResendCode: () => Promise<void>;
  onVerifyCode: (code: string) => Promise<boolean>;
  isVerifying?: boolean;
  isResending?: boolean;
}

export const TwoFactorAuth = ({ 
  email, 
  onVerified, 
  onResendCode, 
  onVerifyCode,
  isVerifying = false,
  isResending = false
}: TwoFactorAuthProps) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugCode, setDebugCode] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for debug code in development
  useEffect(() => {
    const checkDebugCode = async () => {
      if (import.meta.env.DEV) {
        // In development, we can show the debug code
        // This would typically come from the server response, but for now we'll simulate it
        console.log('Development mode: Check console logs for 2FA debug code');
      }
    };
    checkDebugCode();
  }, []);

  const handleVerifyCode = useCallback(async () => {
    if (code.length !== 6 || isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const isValid = await onVerifyCode(code);
      if (isValid) {
        toast({
          title: "2FA Verified",
          description: "Two-factor authentication successful.",
        });
        onVerified();
      } else {
        setError('Invalid verification code. Please try again.');
        setCode('');
      }
    } catch (error: any) {
      setError(error.message || 'Verification failed. Please try again.');
      setCode('');
    } finally {
      setIsSubmitting(false);
    }
  }, [code, onVerifyCode, onVerified, toast, isSubmitting]);

  const handleResendCode = useCallback(async () => {
    try {
      await onResendCode();
      setCode('');
      setError(null);
      toast({
        title: "Code Sent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error: any) {
      setError(error.message || 'Failed to resend code. Please try again.');
    }
  }, [onResendCode, toast]);

  const handleCodeChange = useCallback((value: string) => {
    setCode(value);
    setError(null);
    
    // Auto-submit when code is complete
    if (value.length === 6 && !isSubmitting) {
      setTimeout(() => handleVerifyCode(), 100);
    }
  }, [handleVerifyCode, isSubmitting]);

  // Development helper - auto-fill debug code
  const handleUseDebugCode = useCallback(() => {
    if (debugCode) {
      setCode(debugCode);
    }
  }, [debugCode]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          We've sent a 6-digit verification code to <strong>{email}</strong>. 
          Please enter the code below to complete your authentication.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Development Debug Helper */}
        {import.meta.env.DEV && (
          <Alert>
            <Bug className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="text-sm font-medium">Development Mode</p>
                <p className="text-xs">Check the browser console or edge function logs for the verification code.</p>
                <p className="text-xs">Edge function logs can be found in the Supabase dashboard.</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="verification-code" className="text-center block">
            Enter Verification Code
          </Label>
          <div className="flex justify-center">
            <InputOTP
              id="verification-code"
              value={code}
              onChange={handleCodeChange}
              maxLength={6}
              disabled={isSubmitting || isVerifying}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {(isSubmitting || isVerifying) && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Verifying your code...
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <Button
            onClick={handleVerifyCode}
            disabled={code.length !== 6 || isSubmitting || isVerifying}
            className="w-full"
          >
            {isSubmitting || isVerifying ? 'Verifying...' : 'Verify Code'}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={handleResendCode}
              disabled={isResending || isSubmitting}
              className="text-sm"
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend verification code'
              )}
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          The verification code will expire in 10 minutes for security purposes.
        </div>
      </CardContent>
    </Card>
  );
};
