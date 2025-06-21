import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import logger from '../../src/utils/logger';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    if (password !== ADMIN_PASSWORD) {
      logger.warn('Failed login attempt');
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '24h' });
    
    logger.info('Admin login successful');
    return res.status(200).json({ token });
  } catch (error) {
    logger.error('Login error', { error });
    return res.status(500).json({ error: 'Internal server error' });
  }
}