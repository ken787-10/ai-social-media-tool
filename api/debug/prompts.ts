import type { VercelRequest, VercelResponse } from '@vercel/node';
import promptStorage from '../../src/services/promptStorage';
import { StyleType } from '../../src/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const debugInfo: any = {
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
    },
    environmentVariables: {
      PROMPT_ASKA: process.env.PROMPT_ASKA ? 'Set' : 'Not set',
      PROMPT_KUWATA: process.env.PROMPT_KUWATA ? 'Set' : 'Not set',
      PROMPT_MISSION: process.env.PROMPT_MISSION ? 'Set' : 'Not set',
      PROMPT_OMAE: process.env.PROMPT_OMAE ? 'Set' : 'Not set',
      PROMPT_INSTAGRAM: process.env.PROMPT_INSTAGRAM ? 'Set' : 'Not set',
    },
    prompts: {},
    timestamp: new Date().toISOString()
  };

  const styles: StyleType[] = ['aska', 'kuwata', 'mission', 'omae', 'instagram'];
  
  for (const style of styles) {
    const prompt = promptStorage.getPrompt(style);
    debugInfo.prompts[style] = {
      length: prompt?.length || 0,
      preview: prompt?.substring(0, 100) + '...',
      fromEnv: !!process.env[`PROMPT_${style.toUpperCase()}`]
    };
  }

  return res.status(200).json(debugInfo);
}