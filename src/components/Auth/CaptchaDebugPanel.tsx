
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSecureAuthWithCaptcha } from '@/hooks/useSecureAuthWithCaptcha';
import { CaptchaTestComponent } from './CaptchaTestComponent';
import { Loader2, TestTube, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const CaptchaDebugPanel = () => {
  const [isTestingCaptcha, setIsTestingCaptcha] = useState(false);
  const [testResults, setTestResults] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);
  
  const { validateCaptcha } = useSecureAuthWithCaptcha();

  const testCaptchaValidation = async () => {
    setIsTestingCaptcha(true);
    setTestResults(null);

    try {
      console.log('🧪 Testing CAPTCHA validation with dev token...');
      const result = await validateCaptcha('dev-bypass-token');
      
      setTestResults({
        success: result,
        message: result ? 'CAPTCHA validation successful!' : 'CAPTCHA validation failed',
        details: { devMode: true, timestamp: new Date().toISOString() }
      });
    } catch (error: any) {
      console.error('🧪 CAPTCHA test error:', error);
      setTestResults({
        success: false,
        message: `Test failed: ${error.message}`,
        details: { error: error.message }
      });
    } finally {
      setIsTestingCaptcha(false);
    }
  };

  if (!import.meta.env.DEV) return null;

  return (
    <div className="space-y-4">
      <Card className="border-dashed border-yellow-200 bg-yellow-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <TestTube className="h-5 w-5 text-yellow-600" />
            CAPTCHA Debug Panel
            <Badge variant="secondary">Development Only</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Test CAPTCHA functionality and backend validation without going through the full form flow.
          </div>
          
          <Button 
            onClick={testCaptchaValidation} 
            disabled={isTestingCaptcha}
            variant="outline"
            className="w-full"
          >
            {isTestingCaptcha ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing CAPTCHA...
              </>
            ) : (
              <>
                <TestTube className="h-4 w-4 mr-2" />
                Test CAPTCHA Validation
              </>
            )}
          </Button>

          {testResults && (
            <Alert variant={testResults.success ? "default" : "destructive"}>
              {testResults.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertDescription className="space-y-2">
                <div>{testResults.message}</div>
                {testResults.details && (
                  <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                    {JSON.stringify(testResults.details, null, 2)}
                  </pre>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <div><strong>Environment:</strong> {import.meta.env.DEV ? 'Development' : 'Production'}</div>
            <div><strong>Site Key:</strong> 0x4AAAAAABfVmLaPZh3sMQ7-</div>
            <div><strong>Validation Endpoint:</strong> validate-captcha</div>
          </div>
        </CardContent>
      </Card>

      <CaptchaTestComponent />
    </div>
  );
};
