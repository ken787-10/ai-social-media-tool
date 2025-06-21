import { StyleType } from '../types';

const MAX_INPUT_LENGTH = 1000;
const VALID_STYLES: StyleType[] = ['aska', 'kuwata', 'mission', 'omae', 'instagram'];

export function validateTextInput(text: string): { valid: boolean; error?: string } {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'テキストが入力されていません' };
  }

  if (text.length > MAX_INPUT_LENGTH) {
    return { valid: false, error: `入力は${MAX_INPUT_LENGTH}文字以内にしてください` };
  }

  // 危険な文字をチェック（基本的なXSS対策）
  const dangerousPatterns = [
    /<script[^>]*>/gi,
    /<iframe[^>]*>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(text)) {
      return { valid: false, error: '不正な文字が含まれています' };
    }
  }

  return { valid: true };
}

export function sanitizeInput(text: string): string {
  // HTMLエンティティをエスケープ
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function isValidStyle(style: string): style is StyleType {
  return VALID_STYLES.includes(style as StyleType);
}

export function validateImageSize(sizeInBytes: number): boolean {
  const MAX_SIZE = 20 * 1024 * 1024; // 20MB
  return sizeInBytes <= MAX_SIZE;
}