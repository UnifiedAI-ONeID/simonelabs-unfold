
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from './securityEnhancements';

interface SessionFingerprint {
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
}

interface SecuritySession {
  id: string;
  userId: string;
  fingerprint: SessionFingerprint;
  createdAt: number;
  lastActivity: number;
  ipAddress: string;
  role: string;
}

export class EnhancedSessionSecurity {
  private static readonly SESSION_TIMEOUTS = {
    student: 4 * 60 * 60 * 1000, // 4 hours
    educator: 8 * 60 * 60 * 1000, // 8 hours
    admin: 2 * 60 * 60 * 1000, // 2 hours (more sensitive)
    superuser: 1 * 60 * 60 * 1000 // 1 hour (most sensitive)
  };

  private static readonly MAX_CONCURRENT_SESSIONS = {
    student: 3,
    educator: 5,
    admin: 3,
    superuser: 2
  };

  private static activeSessions = new Map<string, SecuritySession[]>();

  static generateFingerprint(): SessionFingerprint {
    return {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform
    };
  }

  static async createSecureSession(userId: string, role: string, ipAddress: string): Promise<string> {
    const sessionId = crypto.randomUUID();
    const fingerprint = this.generateFingerprint();
    const now = Date.now();

    const session: SecuritySession = {
      id: sessionId,
      userId,
      fingerprint,
      createdAt: now,
      lastActivity: now,
      ipAddress,
      role
    };

    // Get existing sessions for user
    const userSessions = this.activeSessions.get(userId) || [];
    
    // Check concurrent session limit
    const maxSessions = this.MAX_CONCURRENT_SESSIONS[role as keyof typeof this.MAX_CONCURRENT_SESSIONS] || 1;
    if (userSessions.length >= maxSessions) {
      // Remove oldest session
      const oldestSession = userSessions.shift();
      if (oldestSession) {
        await logSecurityEvent({
          type: 'SESSION_TERMINATED',
          details: `Oldest session terminated due to concurrent session limit for user ${userId}`
        });
      }
    }

    userSessions.push(session);
    this.activeSessions.set(userId, userSessions);

    await logSecurityEvent({
      type: 'LOGIN',
      details: `Secure session created for user ${userId} with role ${role}`
    });

    return sessionId;
  }

  static async validateSession(sessionId: string, userId: string): Promise<{ isValid: boolean; reason?: string }> {
    const userSessions = this.activeSessions.get(userId) || [];
    const session = userSessions.find(s => s.id === sessionId);

    if (!session) {
      await logSecurityEvent({
        type: 'SESSION_VALIDATION_ERROR',
        details: `Session not found: ${sessionId}`
      });
      return { isValid: false, reason: 'Session not found' };
    }

    const now = Date.now();
    const timeout = this.SESSION_TIMEOUTS[session.role as keyof typeof this.SESSION_TIMEOUTS] || this.SESSION_TIMEOUTS.student;

    // Check session timeout
    if (now - session.lastActivity > timeout) {
      await this.terminateSession(sessionId, userId);
      await logSecurityEvent({
        type: 'SESSION_EXPIRED',
        details: `Session expired for user ${userId} after ${timeout / 1000}s of inactivity`
      });
      return { isValid: false, reason: 'Session expired' };
    }

    // Validate fingerprint (detect session hijacking)
    const currentFingerprint = this.generateFingerprint();
    if (!this.validateFingerprint(session.fingerprint, currentFingerprint)) {
      await this.terminateSession(sessionId, userId);
      await logSecurityEvent({
        type: 'SUSPICIOUS_ACTIVITY',
        details: `Session fingerprint mismatch detected for user ${userId}`
      });
      return { isValid: false, reason: 'Session fingerprint validation failed' };
    }

    // Update last activity
    session.lastActivity = now;

    return { isValid: true };
  }

  static async terminateSession(sessionId: string, userId: string): Promise<void> {
    const userSessions = this.activeSessions.get(userId) || [];
    const filteredSessions = userSessions.filter(s => s.id !== sessionId);
    
    if (filteredSessions.length === 0) {
      this.activeSessions.delete(userId);
    } else {
      this.activeSessions.set(userId, filteredSessions);
    }

    await logSecurityEvent({
      type: 'SESSION_TERMINATED',
      details: `Session ${sessionId} terminated for user ${userId}`
    });
  }

  static async terminateAllUserSessions(userId: string): Promise<void> {
    const userSessions = this.activeSessions.get(userId) || [];
    this.activeSessions.delete(userId);

    await logSecurityEvent({
      type: 'ALL_SESSIONS_TERMINATED',
      details: `All ${userSessions.length} sessions terminated for user ${userId}`
    });

    // Also sign out from Supabase
    await supabase.auth.signOut({ scope: 'global' });
  }

  private static validateFingerprint(stored: SessionFingerprint, current: SessionFingerprint): boolean {
    // Allow some flexibility for screen resolution (window resizing)
    const criticalFields = ['userAgent', 'timezone', 'language', 'platform'];
    
    return criticalFields.every(field => 
      stored[field as keyof SessionFingerprint] === current[field as keyof SessionFingerprint]
    );
  }

  static getActiveSessions(userId: string): SecuritySession[] {
    return this.activeSessions.get(userId) || [];
  }

  static async cleanupExpiredSessions(): Promise<void> {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [userId, sessions] of this.activeSessions.entries()) {
      const validSessions = sessions.filter(session => {
        const timeout = this.SESSION_TIMEOUTS[session.role as keyof typeof this.SESSION_TIMEOUTS] || this.SESSION_TIMEOUTS.student;
        const isValid = now - session.lastActivity <= timeout;
        
        if (!isValid) {
          cleanedCount++;
        }
        
        return isValid;
      });

      if (validSessions.length === 0) {
        this.activeSessions.delete(userId);
      } else {
        this.activeSessions.set(userId, validSessions);
      }
    }

    if (cleanedCount > 0) {
      await logSecurityEvent({
        type: 'SECURITY_SETTING_CHANGED',
        details: `Cleaned up ${cleanedCount} expired sessions`
      });
    }
  }

  // Run cleanup every 5 minutes
  static startCleanupTimer(): void {
    setInterval(() => {
      this.cleanupExpiredSessions();
    }, 5 * 60 * 1000);
  }
}

// Start the cleanup timer when the module loads
if (typeof window !== 'undefined') {
  EnhancedSessionSecurity.startCleanupTimer();
}
