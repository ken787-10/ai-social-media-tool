import type { VercelRequest, VercelResponse } from '@vercel/node';
import promptStorage from '../src/services/promptStorage';
import { StyleType } from '../src/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const styles: StyleType[] = ['aska', 'kuwata', 'mission', 'omae', 'instagram'];
    const prompts: Record<string, any> = {};
    
    for (const style of styles) {
      const prompt = promptStorage.getPrompt(style);
      prompts[style] = {
        length: prompt.length,
        preview: prompt.substring(0, 100) + '...',
        hasEnvVar: !!process.env[`PROMPT_${style.toUpperCase()}`]
      };
    }
    
    return res.status(200).json({
      status: 'ok',
      isVercel: !!process.env.VERCEL,
      prompts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to get prompts',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}