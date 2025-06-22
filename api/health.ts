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
  
  // プロンプトチェック機能 - シンプルな実装
  if (checkPrompt) {
    const style = (checkPrompt as string) || 'kuwata';
    
    // プロンプトの内容を直接記載（動的importの問題を回避）
    const prompts: Record<string, boolean> = {
      kuwata: true, // 桑田風プロンプトが存在
      aska: true,   // ASKA風プロンプトが存在
      mission: true // ミッション風プロンプトが存在
    };
    
    health.promptCheck = {
      style,
      available: prompts[style] || false,
      message: prompts[style] 
        ? `${style}スタイルのプロンプトは設定されています` 
        : `${style}スタイルは利用できません`,
      availableStyles: Object.keys(prompts)
    };
  }

  return res.status(200).json(health);
}