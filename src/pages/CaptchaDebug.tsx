
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Turnstile } from '@marsidev/react-turnstile';
import { AlertCircle, CheckCircle, XCircle, RefreshCw, Bug } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const TURNSTILE_SITE_KEY = '0x4AAAAAABfVmLaPZh3sMQ7-';

interface ValidationResult {
  success: boolean;
  error?: string;
  timestamp?: string;
}

const CaptchaDebug = () => {
  const [token, setToken] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const handleSuccess = (token: string) => {
    addLog(`CAPTCHA completed: ${token.substring(0, 20)}...`);
    setToken(token);
    setValidationResult(null);
    toast({
      title: "CAPTCHA completed",
      description: "Token received successfully",
    });
  };

  const handleError = (error?: string) => {
    addLog(`CAPTCHA error: ${error || 'Unknown error'}`);
    setToken(null);
    setValidationResult({ success: false, error: error || 'Unknown error' });
    setCaptchaKey(prev => prev + 1);
    toast({
      title: "CAPTCHA failed",
      description: error || "Please try again",
      variant: "destructive",
    });
  };

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
    addLog('Starting backend validation...');
    
    try {
      const { data, error } = await supabase.functions.invoke('validate-captcha', {
        body: { token },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (error) {
        addLog(`Validation error: ${error.message}`);
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
        addLog(`Validation success: ${JSON.stringify(data)}`);
        setValidationResult(data);
        toast({
          title: data.success ? "Validation successful" : "Validation failed",
          description: data.success ? "CAPTCHA is working correctly" : data.error,
          variant: data.success ? "default" : "destructive",
        });
      }
    } catch (error: any) {
      addLog(`Network error: ${error.message}`);
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
    addLog('CAPTCHA reset');
    toast({
      title: "CAPTCHA reset",
      description: "Please complete verification again",
    });
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Bug className="h-8 w-8" />
            CAPTCHA Debug & Test
          </h1>
          <p className="text-muted-foreground">
            Debug and test CAPTCHA functionality for signup process
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                CAPTCHA Widget Test
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
                    {token.substring(0, 60)}...
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
                    'Test Backend Validation'
                  )}
                </Button>
                <Button 
                  onClick={resetCaptcha} 
                  variant="outline"
                  className="flex-1"
                >
                  Reset CAPTCHA
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
                        {validationResult.success ? 'Backend Validation Passed' : 'Backend Validation Failed'}
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Debug Logs</span>
                <Button onClick={clearLogs} variant="outline" size="sm">
                  Clear Logs
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No logs yet...</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-xs font-mono bg-muted p-2 rounded">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-mono bg-primary/10 px-2 py-1 rounded text-xs">1</span>
                <p>Complete the CAPTCHA verification above by clicking the checkbox or solving the challenge</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono bg-primary/10 px-2 py-1 rounded text-xs">2</span>
                <p>Watch the token status change to "Token Ready" when CAPTCHA is completed</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono bg-primary/10 px-2 py-1 rounded text-xs">3</span>
                <p>Click "Test Backend Validation" to verify the token with the Supabase edge function</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono bg-primary/10 px-2 py-1 rounded text-xs">4</span>
                <p>Check the validation result and debug logs for any issues</p>
              </div>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  If both CAPTCHA completion and backend validation succeed, your signup form should work correctly.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CaptchaDebug;
