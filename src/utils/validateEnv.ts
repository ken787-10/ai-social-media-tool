import logger from './logger';

interface RequiredEnvVars {
  LINE_CHANNEL_SECRET: string;
  LINE_CHANNEL_ACCESS_TOKEN: string;
  OPENAI_API_KEY: string;
  ADMIN_PASSWORD: string;
  JWT_SECRET: string;
}

export function validateEnvironment(): void {
  const requiredVars: (keyof RequiredEnvVars)[] = [
    'LINE_CHANNEL_SECRET',
    'LINE_CHANNEL_ACCESS_TOKEN',
    'OPENAI_API_KEY',
    'ADMIN_PASSWORD',
    'JWT_SECRET'
  ];

  const missing: string[] = [];

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    logger.error('Missing required environment variables', { missing });
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // 警告: デフォルト値を使用している場合
  if (process.env.ADMIN_PASSWORD === 'admin123') {
    logger.warn('Using default admin password. Please change in production!');
  }

  if (process.env.JWT_SECRET === 'your-secret-key') {
    logger.warn('Using default JWT secret. Please change in production!');
  }

  logger.info('Environment validation passed');
}