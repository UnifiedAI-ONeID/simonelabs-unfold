
import { CaptchaValidator } from '@/components/Auth/CaptchaValidator';

const CaptchaTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">CAPTCHA Validation Test</h1>
          <p className="text-muted-foreground">
            Test CAPTCHA functionality and backend validation
          </p>
        </div>
        <CaptchaValidator />
      </div>
    </div>
  );
};

export default CaptchaTest;
