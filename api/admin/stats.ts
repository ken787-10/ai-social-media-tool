import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import usageTracker from '../../src/utils/usageTracker';
import { MONTHLY_LIMIT } from '../../src/config/constants';
import logger from '../../src/utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 認証チェック
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // 使用統計を集計
  const userId = req.query.userId as string;
  
  if (userId) {
    // 特定ユーザーの統計
    const userStats = usageTracker.getUsageStats(userId);
    return res.status(200).json({
      userId,
      usage: userStats,
      limits: {
        tokens: MONTHLY_LIMIT.maxTokens,
        images: MONTHLY_LIMIT.maxImages
      },
      percentages: {
        tokens: Math.round((userStats.tokensUsed / MONTHLY_LIMIT.maxTokens) * 100),
        images: Math.round((userStats.imagesProcessed / MONTHLY_LIMIT.maxImages) * 100)
      }
    });
  }

  // 全体の統計（簡易版）
  return res.status(200).json({
    message: 'Global stats not implemented',
    limits: {
      tokens: MONTHLY_LIMIT.maxTokens,
      images: MONTHLY_LIMIT.maxImages
    }
  });
}