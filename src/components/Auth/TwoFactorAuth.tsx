
import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Shield, CheckCircle, AlertCircle, RefreshCw, Bug, Clock } from 'lucide-react';
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
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);
  const { toast } = useToast();

  // Countdown timer for code expiration
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Allow resend after 60 seconds
    if (timeLeft <= 540) { // 9 minutes left
      setCanResend(true);
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
        setError('Invalid verification code. Please check your email and try again.');
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
      setTimeLeft(600); // Reset timer
      setCanResend(false);
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

  return (
    <div className="space-y-6">
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

      {/* Email confirmation */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          We've sent a 6-digit verification code to <strong>{email}</strong>. 
          Please check your email and enter the code below.
        </AlertDescription>
      </Alert>

      {/* Timer display */}
      {timeLeft > 0 && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Code expires in: <strong>{formatTime(timeLeft)}</strong>
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
            disabled={isSubmitting || isVerifying || timeLeft <= 0}
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

      {timeLeft <= 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your verification code has expired. Please request a new one.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <Button
          onClick={handleVerifyCode}
          disabled={code.length !== 6 || isSubmitting || isVerifying || timeLeft <= 0}
          className="w-full"
        >
          {isSubmitting || isVerifying ? 'Verifying...' : 'Verify Code'}
        </Button>

        <div className="text-center">
          <Button
            type="button"
            variant="link"
            onClick={handleResendCode}
            disabled={!canResend || isResending || isSubmitting}
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
          {!canResend && timeLeft > 540 && (
            <p className="text-xs text-muted-foreground mt-1">
              You can request a new code in {formatTime(600 - timeLeft)}
            </p>
          )}
        </div>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Having trouble? Check your spam folder or contact support if you don't receive the code.
      </div>
    </div>
  );
};
