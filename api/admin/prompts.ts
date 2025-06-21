import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import promptStorage from '../../src/services/promptStorage';
import { StyleType } from '../../src/types';
import logger from '../../src/utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Vercelのダイナミックルーティングを使わずに、クエリパラメータで処理
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 認証チェック
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { action, style } = req.query;

  try {
    // GET /api/admin/prompts - すべてのプロンプトを取得
    if (req.method === 'GET' && !action && !style) {
      const prompts = promptStorage.getAllPrompts();
      return res.status(200).json(prompts);
    }

    // POST /api/admin/prompts?action=reset-all - すべてのプロンプトをリセット
    if (req.method === 'POST' && action === 'reset-all') {
      await promptStorage.resetAllPrompts();
      return res.status(200).json({ success: true });
    }

    // PUT /api/admin/prompts?style=aska - プロンプトを更新
    if (req.method === 'PUT' && style && isValidStyle(style as string)) {
      const { prompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      await promptStorage.updatePrompt(style as StyleType, prompt);
      return res.status(200).json({ success: true });
    }

    // POST /api/admin/prompts?style=aska&action=reset - プロンプトをリセット
    if (req.method === 'POST' && style && action === 'reset' && isValidStyle(style as string)) {
      await promptStorage.resetPrompt(style as StyleType);
      return res.status(200).json({ success: true });
    }

    return res.status(404).json({ error: 'Endpoint not found' });
  } catch (error) {
    logger.error('Prompts API error', { error, action, style });
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function extractToken(req: VercelRequest): string | null {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

function isValidStyle(style: string): boolean {
  const validStyles: StyleType[] = ['aska', 'kuwata', 'influencer', 'omae', 'instagram'];
  return validStyles.includes(style as StyleType);
}