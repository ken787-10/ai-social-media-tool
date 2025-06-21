import { Client, WebhookEvent, TextMessage, MessageAPIResponseBase } from '@line/bot-sdk';
import { StyleType } from '../types';
import { STYLE_NAMES } from '../config/constants';
import sessionManager from '../services/sessionManager';
import { generateContent, analyzeImage } from '../services/openaiService';
import { detectStyle, detectContentLength } from '../utils/styleDetector';
import rateLimiter from '../middleware/rateLimiter';
import { downloadLineImage, convertBufferToBase64DataUrl } from '../utils/imageDownloader';
import { validateTextInput, sanitizeInput } from '../utils/validator';
import logger from '../utils/logger';

// LINE Clientの初期化
let client: Client;

try {
  const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const secret = process.env.LINE_CHANNEL_SECRET;
  
  if (!accessToken || !secret) {
    throw new Error('LINE credentials are not properly configured');
  }
  
  client = new Client({
    channelAccessToken: accessToken,
    channelSecret: secret
  });
} catch (error) {
  logger.error('Failed to initialize LINE client', { error });
  // クライアントが初期化できない場合のフォールバック
  client = new Client({
    channelAccessToken: '',
    channelSecret: ''
  });
}

export async function handleEvent(event: WebhookEvent): Promise<MessageAPIResponseBase | undefined> {
  if (event.type !== 'message') {
    return;
  }

  const userId = event.source.userId;
  if (!userId) {
    logger.error('User ID not found in event');
    return;
  }

  // レート制限チェック
  const rateLimitCheck = rateLimiter.checkGeneralLimit(userId);
  if (!rateLimitCheck.allowed) {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: rateLimitCheck.message || '利用制限に達しました。しばらくお待ちください。'
    });
  }

  try {
    switch (event.message.type) {
      case 'text':
        return handleTextMessage(event, userId);
      case 'image':
        return handleImageMessage(event, userId);
      default:
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'テキストまたは画像を送信してください。'
        });
    }
  } catch (error) {
    logger.error('Event handling error', { error, event, userId });
    
    const errorMessage = error instanceof Error ? error.message : 'エラーが発生しました';
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: errorMessage
    });
  }
}

async function handleTextMessage(event: any, userId: string): Promise<MessageAPIResponseBase> {
  const userText = event.message.text;
  
  // 入力検証
  const validation = validateTextInput(userText);
  if (!validation.valid) {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: validation.error || '入力が無効です'
    });
  }
  
  // 入力をサニタイズ
  const sanitizedText = sanitizeInput(userText);
  
  // セッションチェック（画像が待機中の場合）
  const session = sessionManager.getSession(userId);
  if (session && session.imageId) {
    // 画像に対するコメント生成
    const style = detectStyle(userText);
    const length = detectContentLength(userText);
    
    let imageDescription = '素敵な画像';
    
    if (session.pendingImage) {
      try {
        const base64DataUrl = convertBufferToBase64DataUrl(session.pendingImage);
        imageDescription = await analyzeImage(base64DataUrl, userId);
      } catch (error) {
        logger.error('Image analysis failed in text handler', { error, userId });
      }
    }
    
    const content = await generateContent(imageDescription, style, length, userId, true);
    
    sessionManager.deleteSession(userId);
    
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: content
    });
  }
  
  // 通常のテキスト処理
  const style = detectStyle(userText);
  const length = detectContentLength(userText);
  
  const content = await generateContent(userText, style, length, userId);
  
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: content
  });
}

async function handleImageMessage(event: any, userId: string): Promise<MessageAPIResponseBase> {
  // 画像処理のレート制限チェック
  const heavyLimitCheck = rateLimiter.checkHeavyProcessLimit(userId);
  if (!heavyLimitCheck.allowed) {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: heavyLimitCheck.message || '画像処理の利用制限に達しました。'
    });
  }

  const messageId = event.message.id;
  
  try {
    // 画像をダウンロード
    const imageBuffer = await downloadLineImage(messageId);
    
    // セッションに保存
    sessionManager.setSession(userId, {
      imageId: messageId,
      pendingImage: imageBuffer,
      timestamp: Date.now()
    });
  } catch (error) {
    logger.error('Failed to download image', { error, userId, messageId });
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: '画像の取得に失敗しました。もう一度お試しください。'
    });
  }
  
  // スタイル選択を促すメッセージを送信
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: `画像を受信しました📸\n\nどのスタイルで投稿文を作成しますか？\n\n使用例：\n・ASKA風\n・桑田風30\n・インフルエンサー風50\n・大前風\n・インスタ風70\n\n数字は文字数の割合です（30/50/70/100%）`
  });
}

