import { Client } from '@line/bot-sdk';
import logger from './logger';

const client = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || ''
});

export async function downloadLineImage(messageId: string): Promise<Buffer> {
  try {
    const stream = await client.getMessageContent(messageId);
    const chunks: Buffer[] = [];
    
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });
      
      stream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        logger.info('Image downloaded', { 
          messageId, 
          size: buffer.length 
        });
        resolve(buffer);
      });
      
      stream.on('error', (err) => {
        logger.error('Image download error', { error: err, messageId });
        reject(err);
      });
    });
  } catch (error) {
    logger.error('Failed to download image', { error, messageId });
    throw new Error('画像のダウンロードに失敗しました');
  }
}

export function convertBufferToBase64DataUrl(buffer: Buffer, mimeType: string = 'image/jpeg'): string {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}