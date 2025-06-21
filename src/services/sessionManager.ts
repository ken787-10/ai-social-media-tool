import { UserSession } from '../types';
import { SESSION_TIMEOUT } from '../config/constants';
import logger from '../utils/logger';

class SessionManager {
  private sessions: Map<string, UserSession> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // 定期的に期限切れセッションをクリーンアップ
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000); // 1分ごと
  }

  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [userId, session] of this.sessions) {
      if (now - session.timestamp > SESSION_TIMEOUT) {
        this.sessions.delete(userId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug(`Cleaned up ${cleaned} expired sessions`);
    }
  }

  getSession(userId: string): UserSession | undefined {
    const session = this.sessions.get(userId);
    
    if (session && Date.now() - session.timestamp > SESSION_TIMEOUT) {
      this.sessions.delete(userId);
      return undefined;
    }
    
    return session;
  }

  setSession(userId: string, data: Partial<UserSession>): void {
    const existingSession = this.sessions.get(userId);
    
    const session: UserSession = {
      userId,
      timestamp: Date.now(),
      ...existingSession,
      ...data
    };
    
    this.sessions.set(userId, session);
    
    logger.debug('Session updated', {
      userId,
      hasImage: !!session.imageId,
      style: session.selectedStyle
    });
  }

  deleteSession(userId: string): void {
    this.sessions.delete(userId);
    logger.debug('Session deleted', { userId });
  }

  hasActiveImageSession(userId: string): boolean {
    const session = this.getSession(userId);
    return !!(session && session.imageId);
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.sessions.clear();
  }
}

export default new SessionManager();