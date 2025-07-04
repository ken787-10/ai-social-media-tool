import type { VercelRequest, VercelResponse } from '@vercel/node';
import { middleware, WebhookEvent } from '@line/bot-sdk';
import { handleEvent } from '../src/handlers/lineHandlers';
import logger from '../src/utils/logger';
import dotenv from 'dotenv';
import { checkRequiredEnvVars } from '../src/utils/checkEnv';

// 環境変数の読み込み
dotenv.config();

// 環境変数の検証
const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const channelSecret = process.env.LINE_CHANNEL_SECRET;

if (!channelAccessToken || !channelSecret) {
  logger.error('Missing required environment variables', {
    hasAccessToken: !!channelAccessToken,
    hasSecret: !!channelSecret
  });
}

const middlewareConfig = {
  channelAccessToken: channelAccessToken || '',
  channelSecret: channelSecret || ''
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 環境変数のチェック
  const envCheck = checkRequiredEnvVars();
  if (!envCheck.valid) {
    logger.error('Missing required environment variables', { missing: envCheck.missing });
  }
  
  // 環境変数のチェック（デバッグ用）
  if (req.method === 'GET') {
    const hasAccessToken = !!process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const hasSecret = !!process.env.LINE_CHANNEL_SECRET;
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    
    return res.status(200).json({ 
      status: 'ok', 
      message: 'LINE Style Tweet Bot is running',
      timestamp: new Date().toISOString(),
      env: {
        hasAccessToken,
        hasSecret,
        hasOpenAI,
        nodeEnv: process.env.NODE_ENV
      }
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // LINE署名検証
    const body = JSON.stringify(req.body);
    const signature = req.headers['x-line-signature'] as string;
    
    if (!signature) {
      logger.error('No LINE signature found');
      return res.status(401).json({ error: 'No signature' });
    }

    // イベント処理
    const events: WebhookEvent[] = req.body.events;
    
    if (!events || events.length === 0) {
      return res.status(200).json({ message: 'No events' });
    }

    // 並列処理
    const results = await Promise.allSettled(
      events.map(event => handleEvent(event))
    );

    // エラーログ
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        logger.error('Event processing failed', {
          eventIndex: index,
          error: result.reason
        });
      }
    });

    return res.status(200).json({ 
      message: 'Events processed',
      processed: events.length,
      success: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length
    });

  } catch (error) {
    logger.error('Webhook error', { error });
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}