
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from './securityEnhancements';

// Comprehensive authentication state cleanup
export const cleanupAuthState = async (): Promise<void> => {
  try {
    // Log cleanup attempt
    await logSecurityEvent({
      type: 'SESSION_TERMINATED',
      details: 'Initiating comprehensive auth state cleanup'
    });

    // Clear all possible Supabase auth keys from localStorage
    const authKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('supabase.auth.') || 
      key.includes('sb-') ||
      key.startsWith('sb.') ||
      key.includes('supabase') ||
      key === 'access_token' ||
      key === 'refresh_token'
    );

    authKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    // Clear sessionStorage as well
    if (typeof sessionStorage !== 'undefined') {
      const sessionAuthKeys = Object.keys(sessionStorage).filter(key => 
        key.startsWith('supabase.auth.') || 
        key.includes('sb-') ||
        key.startsWith('sb.') ||
        key.includes('supabase')
      );

      sessionAuthKeys.forEach(key => {
        sessionStorage.removeItem(key);
      });
    }

    // Clear any cookies (if applicable)
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      if (name.includes('supabase') || name.includes('sb-')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    });

    // Clear Supabase client state
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (error) {
      console.warn('Global signout failed, continuing cleanup:', error);
    }

    await logSecurityEvent({
      type: 'SESSION_TERMINATED',
      details: 'Auth state cleanup completed successfully'
    });

  } catch (error: any) {
    console.error('Auth cleanup error:', error);
    await logSecurityEvent({
      type: 'SESSION_TERMINATED',
      details: `Auth cleanup failed: ${error.message}`
    });
  }
};

// Force clean signout with page refresh
export const forceSignOut = async (): Promise<void> => {
  try {
    await cleanupAuthState();
    
    // Force page refresh to ensure clean state
    window.location.href = '/auth';
  } catch (error) {
    console.error('Force signout error:', error);
    // Still redirect even if cleanup fails
    window.location.href = '/auth';
  }
};

// Session validation with timeout checks
export const validateSessionSecurity = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      await logSecurityEvent({
        type: 'SESSION_VALIDATION_ERROR',
        details: 'No valid session found'
      });
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    
    // Check if session is expired
    if (session.expires_at && session.expires_at < now) {
      await logSecurityEvent({
        type: 'SESSION_EXPIRED',
        details: 'Session has expired'
      });
      await cleanupAuthState();
      return false;
    }

    // Check for suspicious session activity
    const sessionAge = now - (session.created_at ? new Date(session.created_at).getTime() / 1000 : 0);
    if (sessionAge > 24 * 60 * 60) { // 24 hours
      await logSecurityEvent({
        type: 'SESSION_EXPIRED',
        details: 'Session too old, requiring re-authentication'
      });
      await cleanupAuthState();
      return false;
    }

    return true;
  } catch (error: any) {
    await logSecurityEvent({
      type: 'SESSION_VALIDATION_ERROR',
      details: `Session validation failed: ${error.message}`
    });
    return false;
  }
};
