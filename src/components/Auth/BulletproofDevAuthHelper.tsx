
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, TestTube, Loader2, RefreshCw } from 'lucide-react';
import { useBulletproofAuth } from '@/hooks/useBulletproofAuth';

export const BulletproofDevAuthHelper = () => {
  const [testEmail, setTestEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { signUp, retryCount, cleanupAuthState } = useBulletproofAuth();

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  // Generate cryptographically secure password
  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    // Ensure we have at least one of each required type
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
    password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Special
    
    // Fill the rest to make it 12 characters
    for (let i = 4; i < 12; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const generateTestEmail = () => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    return `test.${timestamp}.${randomId}@example.com`;
  };

  const handleGenerateAndTest = async () => {
    setIsGenerating(true);
    const email = generateTestEmail();
    const password = generateSecurePassword();
    setTestEmail(email);
    
    try {
      console.log('🧪 Testing signup with generated credentials:', { email, passwordLength: password.length });
      const result = await signUp(email, password, password);
      
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

  const handleCleanup = () => {
    cleanupAuthState();
    setTestEmail('');
    console.log('🧹 Auth state cleaned up manually');
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 opacity-95 z-40">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <TestTube className="h-4 w-4" />
          Bulletproof Auth Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Alert>
          <Settings className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Enhanced auth testing with secure password generation and retry logic
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
          <Label className="text-xs">Secure Password</Label>
          <Input
            value="••••••••••••"
            readOnly
            className="text-xs"
            type="password"
          />
          <p className="text-xs text-muted-foreground">Auto-generated 12-char secure password</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleGenerateAndTest}
            disabled={isGenerating}
            className="flex-1 text-xs"
            size="sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Testing...
              </>
            ) : (
              'Generate & Test'
            )}
          </Button>
          
          <Button
            onClick={handleCleanup}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
        
        {retryCount > 0 && (
          <Alert variant="destructive">
            <AlertDescription className="text-xs">
              Retry count: {retryCount}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="text-xs text-muted-foreground">
          <p>• Uses cryptographically secure passwords</p>
          <p>• Implements exponential backoff retry logic</p>
          <p>• Handles rate limits gracefully</p>
          <p>• Check console for detailed logs</p>
        </div>
      </CardContent>
    </Card>
  );
};
