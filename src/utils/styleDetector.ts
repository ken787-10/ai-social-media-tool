import { StyleType } from '../types';

export function detectStyle(text: string): StyleType {
  const lowerText = text.toLowerCase();
  
  // ASKA風の検出
  if (lowerText.includes('aska') || lowerText.includes('アスカ') || 
      lowerText.includes('飛鳥') || lowerText.includes('チャゲアス')) {
    return 'aska';
  }
  
  // 桑田佳祐風の検出
  if (lowerText.includes('桑田') || lowerText.includes('kuwata') || 
      lowerText.includes('サザン') || lowerText.includes('southern')) {
    return 'kuwata';
  }
  
  // 大前研一風の検出
  if (lowerText.includes('大前') || lowerText.includes('研一') || 
      lowerText.includes('omae') || lowerText.includes('ビジネス')) {
    return 'omae';
  }
  
  // インスタグラム投稿用の検出
  if (lowerText.includes('インスタ') || lowerText.includes('instagram') || 
      lowerText.includes('ig') || lowerText.includes('映え')) {
    return 'instagram';
  }
  
  // ミッションインポッシブル風の検出
  if (lowerText.includes('ミッション') || lowerText.includes('mission') || 
      lowerText.includes('トム') || lowerText.includes('トムクルーズ') || 
      lowerText.includes('imp') || lowerText.includes('インポッシブル')) {
    return 'mission';
  }
  
  // デフォルトはミッションインポッシブル風
  return 'mission';
}

export function detectContentLength(text: string): keyof typeof import('../config/constants')['CONTENT_LENGTH'] {
  const lowerText = text.toLowerCase();
  
  // 数字のみのパターンも検出（末尾や単独の30, 50, 70など）
  if (lowerText.includes('30%') || lowerText.includes('30％') || 
      lowerText.match(/\b30\b/) || lowerText.endsWith('30') ||
      lowerText.includes('短く') || lowerText.includes('簡潔')) {
    return '30';
  }
  
  if (lowerText.includes('50%') || lowerText.includes('50％') || 
      lowerText.match(/\b50\b/) || lowerText.endsWith('50') ||
      lowerText.includes('半分')) {
    return '50';
  }
  
  if (lowerText.includes('70%') || lowerText.includes('70％') ||
      lowerText.match(/\b70\b/) || lowerText.endsWith('70')) {
    return '70';
  }
  
  // デフォルトは100%
  return '100';
}