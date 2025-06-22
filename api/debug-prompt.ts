import type { VercelRequest, VercelResponse } from '@vercel/node';
import promptStorage from '../src/services/promptStorage';
import { detectStyle } from '../src/utils/styleDetector';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { text = 'テスト 桑田風' } = req.query;
  
  // スタイル検出
  const detectedStyle = detectStyle(text as string);
  
  // プロンプト取得
  const prompt = promptStorage.getPrompt(detectedStyle);
  
  // 桑田風プロンプトの重要部分を確認
  const hasHitoriKokkurisan = prompt?.includes('ひとりコックリさん');
  const hasDiversity = prompt?.includes('表現の多様性について');
  const hasPositivity = prompt?.includes('ポジティブ表現の徹底');
  
  res.status(200).json({
    input: text,
    detectedStyle,
    promptLength: prompt?.length || 0,
    promptPreview: prompt?.substring(0, 200) + '...',
    checks: {
      hasHitoriKokkurisan,
      hasDiversity,
      hasPositivity
    },
    promptFirstLine: prompt?.split('\n')[0]
  });
}