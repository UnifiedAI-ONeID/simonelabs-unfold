
import { ReactNode, useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { CSRFProtection } from '@/lib/csrf';
import { validateRequestFrequency } from '@/lib/enhancedInputValidation';

interface SecureFormWrapperProps {
  children: ReactNode;
  onSubmit: (data: any) => Promise<void> | void;
  rateLimitKey?: string;
  maxSubmissions?: number;
  windowMs?: number;
  requireCSRF?: boolean;
  className?: string;
}

export const SecureFormWrapper = ({
  children,
  onSubmit,
  rateLimitKey = 'form_submission',
  maxSubmissions = 5,
  windowMs = 60000, // 1 minute
  requireCSRF = true,
  className = ''
}: SecureFormWrapperProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [securityWarnings, setSecurityWarnings] = useState<string[]>([]);
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [formSecurityStatus, setFormSecurityStatus] = useState<'secure' | 'warning' | 'blocked'>('secure');

  useEffect(() => {
    // Initialize CSRF protection
    if (requireCSRF) {
      const token = CSRFProtection.generateToken();
      setCsrfToken(token);
    }

    // Check browser security features
    const warnings: string[] = [];
    
    if (!window.isSecureContext) {
      warnings.push('Form is not in a secure context (HTTPS required)');
    }
    
    if (!navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Firefox')) {
      warnings.push('Browser security features may be limited');
    }

    setSecurityWarnings(warnings);
    setFormSecurityStatus(warnings.length > 0 ? 'warning' : 'secure');
  }, [requireCSRF]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (isSubmitting) return;
    
    const userId = localStorage.getItem('user_id') || 'anonymous';
    
    // Rate limiting check
    if (!validateRequestFrequency(userId, rateLimitKey, maxSubmissions, windowMs)) {
      setFormSecurityStatus('blocked');
      setSecurityWarnings(prev => [...prev, 'Too many submission attempts. Please wait before trying again.']);
      
      // Log security event
      if ((window as any).logSecurityEvent) {
        (window as any).logSecurityEvent({
          type: 'RATE_LIMIT_EXCEEDED',
          details: `Form submission rate limit exceeded for ${rateLimitKey}`,
          severity: 'medium'
        });
      }
      return;
    }

    // CSRF validation
    if (requireCSRF && !CSRFProtection.validateToken(csrfToken)) {
      setFormSecurityStatus('blocked');
      setSecurityWarnings(prev => [...prev, 'CSRF token validation failed. Please refresh the page.']);
      
      if ((window as any).logSecurityEvent) {
        (window as any).logSecurityEvent({
          type: 'CSRF_VIOLATION',
          details: 'CSRF token validation failed on form submission',
          severity: 'high'
        });
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData.entries());
      
      // Add CSRF token to submission data
      if (requireCSRF) {
        (data as any).csrfToken = csrfToken;
      }

      // Log successful form submission
      if ((window as any).logSecurityEvent) {
        (window as any).logSecurityEvent({
          type: 'SECURE_FORM_SUBMISSION',
          details: `Secure form submission for ${rateLimitKey}`,
          severity: 'low'
        });
      }

      await onSubmit(data);
      
      // Regenerate CSRF token after successful submission
      if (requireCSRF) {
        const newToken = CSRFProtection.generateToken();
        setCsrfToken(newToken);
      }
      
    } catch (error: any) {
      console.error('Form submission error:', error);
      
      if ((window as any).logSecurityEvent) {
        (window as any).logSecurityEvent({
          type: 'FORM_SUBMISSION_ERROR',
          details: `Form submission failed: ${error.message}`,
          severity: 'medium'
        });
      }
      
      setSecurityWarnings(prev => [...prev, 'Form submission failed. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = () => {
    switch (formSecurityStatus) {
      case 'secure':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'blocked':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Security Status Indicator */}
      <div className="flex items-center gap-2 text-sm">
        <Shield className="h-4 w-4" />
        {getStatusIcon()}
        <span className="text-muted-foreground">
          Form Security: {formSecurityStatus.charAt(0).toUpperCase() + formSecurityStatus.slice(1)}
        </span>
      </div>

      {/* Security Warnings */}
      {securityWarnings.length > 0 && (
        <Alert variant={formSecurityStatus === 'blocked' ? 'destructive' : 'default'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {securityWarnings.map((warning, index) => (
                <div key={index}>{warning}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {requireCSRF && (
          <input type="hidden" name="csrfToken" value={csrfToken} />
        )}
        
        {children}
        
        {/* Honeypot field to catch bots */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          style={{
            position: 'absolute',
            left: '-9999px',
            opacity: 0,
            pointerEvents: 'none'
          }}
        />
      </form>
    </div>
  );
};
