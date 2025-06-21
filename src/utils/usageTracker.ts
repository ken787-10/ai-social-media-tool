import { MONTHLY_LIMIT } from '../config/constants';
import logger from './logger';

interface UsageData {
  currentMonth: string;
  tokensUsed: number;
  imagesProcessed: number;
}

class UsageTracker {
  private usage: Map<string, UsageData> = new Map();

  private getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  private getUserUsage(userId: string): UsageData {
    const currentMonth = this.getCurrentMonth();
    const usage = this.usage.get(userId);

    if (!usage || usage.currentMonth !== currentMonth) {
      // 新しい月またはユーザーの場合は初期化
      const newUsage: UsageData = {
        currentMonth,
        tokensUsed: 0,
        imagesProcessed: 0
      };
      this.usage.set(userId, newUsage);
      return newUsage;
    }

    return usage;
  }

  async checkTokenLimit(userId: string, estimatedTokens: number): Promise<boolean> {
    const usage = this.getUserUsage(userId);
    
    if (usage.tokensUsed + estimatedTokens > MONTHLY_LIMIT.maxTokens) {
      logger.warn('Token limit exceeded', {
        userId,
        currentUsage: usage.tokensUsed,
        requested: estimatedTokens,
        limit: MONTHLY_LIMIT.maxTokens
      });
      throw new Error('月間トークン利用上限に達しました。来月までお待ちください。');
    }

    // 警告閾値チェック
    const usagePercentage = (usage.tokensUsed + estimatedTokens) / MONTHLY_LIMIT.maxTokens;
    if (usagePercentage >= MONTHLY_LIMIT.alertThreshold) {
      logger.info('Usage alert threshold reached', {
        userId,
        percentage: Math.round(usagePercentage * 100)
      });
    }

    return true;
  }

  async checkImageLimit(userId: string): Promise<boolean> {
    const usage = this.getUserUsage(userId);
    
    if (usage.imagesProcessed >= MONTHLY_LIMIT.maxImages) {
      logger.warn('Image limit exceeded', {
        userId,
        currentUsage: usage.imagesProcessed,
        limit: MONTHLY_LIMIT.maxImages
      });
      throw new Error('月間画像解析上限に達しました。来月までお待ちください。');
    }

    return true;
  }

  async recordTokenUsage(userId: string, tokens: number): Promise<void> {
    const usage = this.getUserUsage(userId);
    usage.tokensUsed += tokens;
    
    logger.info('Token usage recorded', {
      userId,
      tokensUsed: tokens,
      totalUsage: usage.tokensUsed,
      month: usage.currentMonth
    });
  }

  async recordImageUsage(userId: string): Promise<void> {
    const usage = this.getUserUsage(userId);
    usage.imagesProcessed += 1;
    
    logger.info('Image usage recorded', {
      userId,
      totalImages: usage.imagesProcessed,
      month: usage.currentMonth
    });
  }

  getUsageStats(userId: string): UsageData {
    return this.getUserUsage(userId);
  }
}

export default new UsageTracker();