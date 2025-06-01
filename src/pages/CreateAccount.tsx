
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { CreateAccountForm } from '@/components/Auth/CreateAccountForm';
import { getSecurityHeaders } from '@/lib/securityConfig';

const CreateAccount = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useEnhancedAuth();

  useEffect(() => {
    const headers = getSecurityHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      if (key === 'Content-Security-Policy') {
        const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (metaCSP) {
          metaCSP.setAttribute('content', value);
        } else {
          const meta = document.createElement('meta');
          meta.setAttribute('http-equiv', 'Content-Security-Policy');
          meta.setAttribute('content', value);
          document.head.appendChild(meta);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/role-selection', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleCreateAccountSuccess = () => {
    navigate('/role-selection', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading secure authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <CreateAccountForm onSuccess={handleCreateAccountSuccess} />
    </div>
  );
};

export default CreateAccount;
