import { VercelRequest, VercelResponse } from '@vercel/node';
import { RATE_LIMIT, HEAVY_PROCESS_LIMIT } from '../config/constants';
import logger from '../utils/logger';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private generalStore: RateLimitStore = {};
  private heavyProcessStore: RateLimitStore = {};

  private checkLimit(
    store: RateLimitStore,
    key: string,
    config: typeof RATE_LIMIT
  ): { allowed: boolean; message?: string } {
    const now = Date.now();
    const record = store[key];

    if (!record || now > record.resetTime) {
      store[key] = {
        count: 1,
        resetTime: now + config.windowMs
      };
      return { allowed: true };
    }

    if (record.count >= config.max) {
      const remainingTime = Math.ceil((record.resetTime - now) / 1000 / 60);
      logger.warn('Rate limit exceeded', {
        key,
        count: record.count,
        max: config.max,
        remainingMinutes: remainingTime
      });
      
      return { 
        allowed: false, 
        message: `${config.message} (約${remainingTime}分後に再度お試しください)`
      };
    }

    record.count++;
    return { allowed: true };
  }

  checkGeneralLimit(userId: string): { allowed: boolean; message?: string } {
    return this.checkLimit(this.generalStore, userId, RATE_LIMIT);
  }

  checkHeavyProcessLimit(userId: string): { allowed: boolean; message?: string } {
    return this.checkLimit(this.heavyProcessStore, userId, HEAVY_PROCESS_LIMIT);
  }

  // 定期的なクリーンアップ
  cleanup(): void {
    const now = Date.now();
    
    Object.keys(this.generalStore).forEach(key => {
      if (now > this.generalStore[key].resetTime) {
        delete this.generalStore[key];
      }
    });

    Object.keys(this.heavyProcessStore).forEach(key => {
      if (now > this.heavyProcessStore[key].resetTime) {
        delete this.heavyProcessStore[key];
      }
    });
  }
}

const rateLimiter = new RateLimiter();

// 5分ごとにクリーンアップ
setInterval(() => {
  rateLimiter.cleanup();
}, 5 * 60 * 1000);

export default rateLimiter;