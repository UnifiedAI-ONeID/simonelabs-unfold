
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TestTube, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const CaptchaTestComponent = () => {
  const [isTestingSimple, setIsTestingSimple] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const { toast } = useToast();

  const testSimpleRequest = async () => {
    setIsTestingSimple(true);
    setTestResult(null);
    
    const requestId = crypto.randomUUID();
    console.log(`[${requestId}] 🧪 Testing simple CAPTCHA request...`);

    try {
      // Test with minimal data first
      const testData = {
        token: 'dev-bypass-token',
        test: true
      };
      
      console.log(`[${requestId}] Sending test data:`, testData);
      console.log(`[${requestId}] Stringified:`, JSON.stringify(testData));
      
      // Fix: Pass data directly to the edge function, not in a body property
      const { data, error } = await supabase.functions.invoke('validate-captcha', testData);

      console.log(`[${requestId}] Response:`, { data, error });
      
      if (error) {
        setTestResult({
          success: false,
          error: error.message,
          details: error
        });
        toast({
          title: "Test Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setTestResult({
          success: true,
          data: data,
          message: 'Simple request successful!'
        });
        toast({
          title: "Test Successful",
          description: "Simple CAPTCHA request worked!",
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error(`[${requestId}] Test error:`, error);
      setTestResult({
        success: false,
        error: error.message,
        details: error
      });
      toast({
        title: "Test Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsTestingSimple(false);
    }
  };

  if (!import.meta.env.DEV) return null;

  return (
    <Card className="border-dashed border-blue-200 bg-blue-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <TestTube className="h-5 w-5 text-blue-600" />
          CAPTCHA Request Test
          <Badge variant="secondary">Debug Only</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Test the CAPTCHA validation endpoint with minimal data to debug the empty body issue.
        </div>
        
        <Button 
          onClick={testSimpleRequest} 
          disabled={isTestingSimple}
          variant="outline"
          className="w-full"
        >
          {isTestingSimple ? (
            <>
              <TestTube className="h-4 w-4 mr-2 animate-pulse" />
              Testing Simple Request...
            </>
          ) : (
            <>
              <TestTube className="h-4 w-4 mr-2" />
              Test Simple CAPTCHA Request
            </>
          )}
        </Button>

        {testResult && (
          <div className={`p-3 rounded-md border ${
            testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {testResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className={`font-medium ${
                testResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.success ? 'Test Successful' : 'Test Failed'}
              </span>
            </div>
            {testResult.error && (
              <p className="text-sm text-red-700 mb-2">{testResult.error}</p>
            )}
            <pre className="text-xs bg-white/50 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1 p-2 bg-yellow-50 rounded border border-yellow-200">
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-yellow-600" />
            <strong>Debug Info:</strong>
          </div>
          <div>• This tests if the edge function can receive any request body</div>
          <div>• Uses dev-bypass-token to avoid real CAPTCHA validation</div>
          <div>• Check browser Network tab to see actual request being sent</div>
          <div>• Check edge function logs for detailed server-side info</div>
        </div>
      </CardContent>
    </Card>
  );
};
