import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import promptStorage from '../../src/services/promptStorage';
import { StyleType } from '../../src/types';
import logger from '../../src/utils/logger';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = req.query.path as string | string[];
  const pathArray = Array.isArray(path) ? path : [path];
  const endpoint = pathArray?.[0];

  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (endpoint) {
      case 'login':
        return handleLogin(req, res);
      
      case 'verify':
        return handleVerify(req, res);
      
      case 'prompts':
        return handlePrompts(req, res, pathArray);
      
      default:
        return res.status(404).json({ error: 'Endpoint not found' });
    }
  } catch (error) {
    logger.error('Admin API error', { error, endpoint });
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleLogin(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '24h' });
  return res.status(200).json({ token });
}

async function handleVerify(req: VercelRequest, res: VercelResponse) {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ valid: true });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

async function handlePrompts(req: VercelRequest, res: VercelResponse, path: string[]) {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const style = path[1] as StyleType;
  const action = path[2];

  // GET /api/admin/prompts - すべてのプロンプトを取得
  if (req.method === 'GET' && !style) {
    const prompts = promptStorage.getAllPrompts();
    return res.status(200).json(prompts);
  }

  // PUT /api/admin/prompts/:style - プロンプトを更新
  if (req.method === 'PUT' && style && !action) {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    await promptStorage.updatePrompt(style, prompt);
    return res.status(200).json({ success: true });
  }

  // POST /api/admin/prompts/:style/reset - プロンプトをリセット
  if (req.method === 'POST' && style && action === 'reset') {
    await promptStorage.resetPrompt(style);
    return res.status(200).json({ success: true });
  }

  // POST /api/admin/prompts/reset-all - すべてのプロンプトをリセット
  if (req.method === 'POST' && style === 'reset-all') {
    await promptStorage.resetAllPrompts();
    return res.status(200).json({ success: true });
  }

  return res.status(404).json({ error: 'Endpoint not found' });
}

function extractToken(req: VercelRequest): string | null {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}