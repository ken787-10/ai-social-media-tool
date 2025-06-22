import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { checkPrompt } = req.query;
  
  const health: any = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    services: {
      line: !!process.env.LINE_CHANNEL_ACCESS_TOKEN,
      openai: !!process.env.OPENAI_API_KEY,
      admin: !!process.env.ADMIN_PASSWORD
    }
  };
  
  // プロンプトチェック機能
  if (checkPrompt) {
    try {
      const promptStorage = require('../src/services/promptStorage').default;
      const style = (checkPrompt as string) || 'kuwata';
      const prompt = promptStorage.getPrompt(style as any);
      
      health.promptCheck = {
        style,
        promptLength: prompt?.length || 0,
        promptPreview: prompt?.substring(0, 100) + '...',
        hasKuwataUpdates: prompt?.includes('ひとりコックリさん') || false,
        hasDiversity: prompt?.includes('表現の多様性について') || false,
        hasPositivity: prompt?.includes('ポジティブ表現の徹底') || false
      };
    } catch (error) {
      health.promptCheck = {
        error: error instanceof Error ? error.message : 'Failed to check prompt'
      };
    }
  }

  return res.status(200).json(health);
}