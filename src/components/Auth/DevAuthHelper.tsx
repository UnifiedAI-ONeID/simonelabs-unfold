
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, TestTube } from 'lucide-react';
import { useSimplifiedAuth } from '@/hooks/useSimplifiedAuth';

export const DevAuthHelper = () => {
  const [testEmail, setTestEmail] = useState('');
  const [testPassword] = useState('testpass123');
  const [isGenerating, setIsGenerating] = useState(false);
  const { signUp } = useSimplifiedAuth();

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const generateTestEmail = () => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    return `test.user.${timestamp}.${randomId}@example.com`;
  };

  const handleGenerateAndTest = async () => {
    setIsGenerating(true);
    const email = generateTestEmail();
    setTestEmail(email);
    
    try {
      console.log('🧪 Testing signup with generated email:', email);
      const result = await signUp(email, testPassword, testPassword);
      
      if (result.error) {
        console.error('❌ Test signup failed:', result.error.message);
      } else {
        console.log('✅ Test signup successful');
      }
    } catch (error: any) {
      console.error('💥 Test signup error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 opacity-95 z-40">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <TestTube className="h-4 w-4" />
          Development Auth Helper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Alert>
          <Settings className="h-4 w-4" />
          <AlertDescription className="text-xs">
            For testing user creation with fresh emails that bypass rate limits
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <Label htmlFor="test-email" className="text-xs">Generated Test Email</Label>
          <Input
            id="test-email"
            value={testEmail}
            readOnly
            className="text-xs"
            placeholder="Click generate to create test email"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs">Test Password</Label>
          <Input
            value={testPassword}
            readOnly
            className="text-xs"
            type="password"
          />
        </div>
        
        <Button
          onClick={handleGenerateAndTest}
          disabled={isGenerating}
          className="w-full text-xs"
          size="sm"
        >
          {isGenerating ? 'Testing...' : 'Generate Email & Test Signup'}
        </Button>
        
        <div className="text-xs text-muted-foreground">
          <p>• Uses unique timestamp-based emails</p>
          <p>• Bypasses rate limiting issues</p>
          <p>• Check console for detailed logs</p>
        </div>
      </CardContent>
    </Card>
  );
};
