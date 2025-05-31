
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Turnstile } from '@marsidev/react-turnstile';
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const TURNSTILE_SITE_KEY = '0x4AAAAAABfVmLaPZh3sMQ7-';

interface ValidationResult {
  success: boolean;
  error?: string;
  timestamp?: string;
}

export const CaptchaValidator = () => {
  const [token, setToken] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const { toast } = useToast();

  const handleSuccess = useCallback((token: string) => {
    console.log('CAPTCHA Token received:', token?.substring(0, 20) + '...');
    setToken(token);
    setValidationResult(null);
    toast({
      title: "CAPTCHA completed",
      description: "Token received successfully",
    });
  }, [toast]);

  const handleError = useCallback((error?: string) => {
    console.error('CAPTCHA Error:', error);
    setToken(null);
    setValidationResult({ success: false, error: error || 'Unknown error' });
    setCaptchaKey(prev => prev + 1);
    toast({
      title: "CAPTCHA failed",
      description: error || "Please try again",
      variant: "destructive",
    });
  }, [toast]);

  const validateToken = async () => {
    if (!token) {
      toast({
        title: "No token",
        description: "Please complete CAPTCHA first",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    try {
      console.log('Validating token:', token.substring(0, 20) + '...');
      
      const { data, error } = await supabase.functions.invoke('validate-captcha', {
        body: { token },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (error) {
        console.error('Validation error:', error);
        setValidationResult({ 
          success: false, 
          error: error.message || 'Validation failed' 
        });
        toast({
          title: "Validation failed",
          description: error.message || "Backend validation error",
          variant: "destructive",
        });
      } else {
        console.log('Validation result:', data);
        setValidationResult(data);
        toast({
          title: data.success ? "Validation successful" : "Validation failed",
          description: data.success ? "CAPTCHA is working correctly" : data.error,
          variant: data.success ? "default" : "destructive",
        });
      }
    } catch (error: any) {
      console.error('Network error:', error);
      setValidationResult({ 
        success: false, 
        error: 'Network error: ' + error.message 
      });
      toast({
        title: "Network error",
        description: "Failed to connect to validation service",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const resetCaptcha = () => {
    setToken(null);
    setValidationResult(null);
    setCaptchaKey(prev => prev + 1);
    toast({
      title: "CAPTCHA reset",
      description: "Please complete verification again",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          CAPTCHA Test & Validation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">CAPTCHA Widget</label>
          <div className="flex justify-center">
            <Turnstile
              key={captchaKey}
              siteKey={TURNSTILE_SITE_KEY}
              onSuccess={handleSuccess}
              onError={handleError}
              options={{
                theme: 'auto',
                size: 'normal',
                appearance: 'always',
                retry: 'auto'
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Token Status</label>
          <div className="flex items-center gap-2">
            {token ? (
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Token Ready
              </Badge>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                No Token
              </Badge>
            )}
          </div>
          {token && (
            <div className="text-xs text-muted-foreground break-all font-mono bg-muted p-2 rounded">
              {token.substring(0, 40)}...
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={validateToken} 
            disabled={!token || isValidating}
            className="flex-1"
          >
            {isValidating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              'Test Validation'
            )}
          </Button>
          <Button 
            onClick={resetCaptcha} 
            variant="outline"
            className="flex-1"
          >
            Reset
          </Button>
        </div>

        {validationResult && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Validation Result</label>
            <div className={`p-3 rounded-md ${
              validationResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            } border`}>
              <div className="flex items-center gap-2 mb-2">
                {validationResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className={`font-medium ${
                  validationResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {validationResult.success ? 'Validation Successful' : 'Validation Failed'}
                </span>
              </div>
              {validationResult.error && (
                <p className="text-sm text-red-700 mb-2">{validationResult.error}</p>
              )}
              <pre className="text-xs bg-white/50 p-2 rounded overflow-auto">
                {JSON.stringify(validationResult, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Complete CAPTCHA verification above</p>
          <p>• Click "Test Validation" to verify backend connection</p>
          <p>• Green result means authentication will work</p>
        </div>
      </CardContent>
    </Card>
  );
};
