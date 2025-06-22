import type { VercelRequest, VercelResponse } from '@vercel/node';
import promptStorage from '../src/services/promptStorage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const kuwataPrompt = promptStorage.getPrompt('kuwata');
    
    const verification = {
      promptLength: kuwataPrompt?.length || 0,
      hasDiversitySection: kuwataPrompt?.includes('表現の多様性について') || false,
      hasKokkuriReference: kuwataPrompt?.includes('ひとりコックリさん') || false,
      hasPositivitySection: kuwataPrompt?.includes('ポジティブ表現の徹底') || false,
      positiveTransformations: {
        weight: kuwataPrompt?.includes('「太った」→「幸せの重さ」') || false,
        tired: kuwataPrompt?.includes('「疲れた」→「充実した証拠」') || false,
        failure: kuwataPrompt?.includes('「失敗した」→「次への学び」') || false,
        rain: kuwataPrompt?.includes('「雨の日」→「恵みの雨」') || false
      },
      diversityInstructions: {
        noRepeat: kuwataPrompt?.includes('同じフレーズや構文を繰り返さない') || false,
        freshMetaphors: kuwataPrompt?.includes('比喩や例えは新鮮なものを選ぶ') || false,
        varyStartEnd: kuwataPrompt?.includes('文の始まり方、終わり方にバリエーションを持たせる') || false,
        flexibleEmojis: kuwataPrompt?.includes('絵文字も固定化せず、内容に合わせて選択') || false
      },
      promptPreview: kuwataPrompt?.substring(0, 200) + '...',
      timestamp: new Date().toISOString()
    };
    
    return res.status(200).json(verification);
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to verify prompt',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}