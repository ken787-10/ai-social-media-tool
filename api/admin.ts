import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const htmlPath = path.join(process.cwd(), 'public', 'admin.html');
    const html = fs.readFileSync(htmlPath, 'utf-8');
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (error) {
    console.error('Error serving admin page:', error);
    return res.status(500).send('Internal Server Error');
  }
}