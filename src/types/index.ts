export type StyleType = 'aska' | 'kuwata' | 'mission' | 'omae' | 'instagram';

export interface UserSession {
  userId: string;
  imageId?: string;
  selectedStyle?: StyleType;
  timestamp: number;
  pendingImage?: Buffer;
}

export interface UserData {
  userId: string;
  preferences: {
    defaultStyle: StyleType;
    defaultLength: number;
  };
  usage: {
    month: string;
    tokensUsed: number;
    imagesProcessed: number;
  };
  history: ContentHistory[];
}

export interface ContentHistory {
  id: string;
  input: string;
  output: string;
  style: StyleType;
  timestamp: string;
  imageUrl?: string;
}

export interface MonthlyLimit {
  maxTokens: number;
  maxImages: number;
  alertThreshold: number;
}

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
}