import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    services: {
      line: !!process.env.LINE_CHANNEL_ACCESS_TOKEN,
      openai: !!process.env.OPENAI_API_KEY,
      admin: !!process.env.ADMIN_PASSWORD
    }
  };

  return res.status(200).json(health);
}