
import { useEffect } from 'react';
import { getSecurityHeaders } from '@/lib/securityConfig';

export const SecureHeaders = () => {
  useEffect(() => {
    const headers = getSecurityHeaders();
    
    // Apply Content Security Policy
    if (headers['Content-Security-Policy']) {
      let metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (!metaCSP) {
        metaCSP = document.createElement('meta');
        metaCSP.setAttribute('http-equiv', 'Content-Security-Policy');
        document.head.appendChild(metaCSP);
      }
      metaCSP.setAttribute('content', headers['Content-Security-Policy']);
    }

    // Apply other security headers via meta tags where possible
    const securityMeta = [
      { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      { name: 'format-detection', content: 'telephone=no' },
      { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
    ];

    securityMeta.forEach(meta => {
      const existingMeta = document.querySelector(`meta[name="${meta.name}"], meta[http-equiv="${meta['http-equiv']}"]`);
      if (!existingMeta) {
        const metaElement = document.createElement('meta');
        if (meta.name) metaElement.setAttribute('name', meta.name);
        if (meta['http-equiv']) metaElement.setAttribute('http-equiv', meta['http-equiv']);
        metaElement.setAttribute('content', meta.content);
        document.head.appendChild(metaElement);
      }
    });

    return () => {
      // Cleanup is not needed for meta tags
    };
  }, []);

  return null;
};
