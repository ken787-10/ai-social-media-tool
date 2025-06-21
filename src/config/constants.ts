import { MonthlyLimit, RateLimitConfig } from '../types';

// 月次使用量制限
export const MONTHLY_LIMIT: MonthlyLimit = {
  maxTokens: 100000,    // 月10万トークン (約$2-3)
  maxImages: 50,        // 月50枚の画像解析
  alertThreshold: 0.8   // 80%で警告
};

// 基本的なレート制限
export const RATE_LIMIT: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15分
  max: 50, // ユーザーあたり50リクエスト
  message: "しばらく時間をおいてから再度お試しください"
};

// 重い処理（画像解析）の制限
export const HEAVY_PROCESS_LIMIT: RateLimitConfig = {
  windowMs: 60 * 60 * 1000, // 1時間
  max: 10, // 画像解析は10回まで
  message: "画像解析の利用制限に達しました。1時間後に再度お試しください"
};

// セッションタイムアウト
export const SESSION_TIMEOUT = 10 * 60 * 1000; // 10分

// 文字数制限
export const CONTENT_LENGTH = {
  '30': 84,
  '50': 140,
  '70': 196,
  '100': 280
} as const;

// スタイル名の日本語マッピング
export const STYLE_NAMES = {
  aska: 'ASKA風',
  kuwata: '桑田佳祐風',
  influencer: 'インフルエンサー風',
  omae: '大前研一風',
  instagram: 'インスタグラム投稿用'
} as const;