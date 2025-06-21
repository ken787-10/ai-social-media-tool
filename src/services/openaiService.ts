import OpenAI from 'openai';
import { StyleType } from '../types';
import { CONTENT_LENGTH, INSTAGRAM_CONTENT_LENGTH } from '../config/constants';
import usageTracker from '../utils/usageTracker';
import promptStorage from './promptStorage';
import logger from '../utils/logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateContent(
  input: string,
  style: StyleType,
  lengthPercentage: keyof typeof CONTENT_LENGTH,
  userId: string,
  isImageDescription: boolean = false
): Promise<string> {
  // Instagramの場合は専用の文字数制限を使用
  const maxLength = style === 'instagram' 
    ? INSTAGRAM_CONTENT_LENGTH[lengthPercentage]
    : CONTENT_LENGTH[lengthPercentage];
  
  // トークン使用量の事前チェック（推定）
  const estimatedTokens = Math.ceil(input.length / 2) + 500; // 入力 + 出力の推定
  await usageTracker.checkTokenLimit(userId, estimatedTokens);
  
  const systemPrompt = await promptStorage.getPrompt(style);
  const userPrompt = isImageDescription
    ? `この画像について、指定されたスタイルで${maxLength}文字以内のコメントを書いてください。画像の内容: ${input}`
    : `次のテーマについて、指定されたスタイルで${maxLength}文字以内の投稿を書いてください: ${input}`;
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: Math.ceil(maxLength * 2), // 日本語は1文字≒2トークン
      temperature: 0.8,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });
    
    const content = completion.choices[0]?.message?.content || '';
    
    // 実際の使用トークン数を記録
    const actualTokens = completion.usage?.total_tokens || estimatedTokens;
    await usageTracker.recordTokenUsage(userId, actualTokens);
    
    logger.info('Content generated', {
      userId,
      style,
      inputLength: input.length,
      outputLength: content.length,
      tokens: actualTokens,
      requestedLength: maxLength
    });
    
    // 文字数チェックと調整
    let finalContent = content;
    if (content.length > maxLength) {
      // 文字数オーバーの場合は切り詰める
      finalContent = content.substring(0, maxLength - 3) + '...';
      logger.info('Content truncated', {
        userId,
        originalLength: content.length,
        truncatedLength: finalContent.length
      });
    }
    
    // Instagram用の追加処理
    if (style === 'instagram') {
      return formatForInstagram(finalContent);
    }
    
    return finalContent;
  } catch (error) {
    logger.error('OpenAI API error', { error, userId, style });
    throw new Error('コンテンツの生成に失敗しました。しばらく後に再度お試しください。');
  }
}

export async function analyzeImage(imageUrl: string, userId: string): Promise<string> {
  await usageTracker.checkImageLimit(userId);
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "この画像の内容を日本語で簡潔に説明してください。" },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 300
    });
    
    const description = response.choices[0]?.message?.content || '画像の解析に失敗しました';
    
    await usageTracker.recordImageUsage(userId);
    
    logger.info('Image analyzed', {
      userId,
      descriptionLength: description.length
    });
    
    return description;
  } catch (error) {
    logger.error('Image analysis error', { error, userId });
    throw new Error('画像の解析に失敗しました。');
  }
}

function formatForInstagram(content: string): string {
  // 句点で改行
  let formatted = content
    .replace(/。/g, '。\n')
    .replace(/！/g, '！\n')
    .replace(/？/g, '？\n')
    .trim();
  
  // ハッシュタグ生成
  const hashtags = generateHashtags(content);
  
  // 絵文字追加
  formatted = addEmojis(formatted);
  
  // 最終的な投稿内容を組み立て
  const separator = '\n\n.\n.\n.\n';
  const hashtagsText = hashtags.join(' ');
  const fullPost = `${formatted}${separator}${hashtagsText}`;
  
  // 400文字を超える場合はハッシュタグを調整
  if (fullPost.length > 400) {
    const availableSpace = 400 - formatted.length - separator.length;
    if (availableSpace > 20) {
      // 最低限のスペースがあればハッシュタグを含める
      const limitedHashtags = [];
      let currentLength = 0;
      for (const tag of hashtags) {
        if (currentLength + tag.length + 1 <= availableSpace) {
          limitedHashtags.push(tag);
          currentLength += tag.length + 1;
        } else {
          break;
        }
      }
      return `${formatted}${separator}${limitedHashtags.join(' ')}`;
    } else {
      // スペースがない場合はハッシュタグを省略
      return formatted;
    }
  }
  
  return fullPost;
}

function generateHashtags(content: string): string[] {
  const baseHashtags = ['#AI生成', '#日常'];
  const contentHashtags: string[] = [];
  
  // コンテンツに基づくハッシュタグ
  if (content.includes('食')) contentHashtags.push('#グルメ', '#foodie');
  if (content.includes('旅')) contentHashtags.push('#旅行', '#travel');
  if (content.includes('仕事')) contentHashtags.push('#ビジネス', '#work');
  if (content.includes('恋') || content.includes('愛')) contentHashtags.push('#恋愛', '#love');
  
  return [...baseHashtags, ...contentHashtags].slice(0, 10);
}

function addEmojis(content: string): string {
  const emojiMap: Record<string, string> = {
    '食べ': '🍽️',
    '美味し': '😋',
    '旅': '✈️',
    '音楽': '🎵',
    '愛': '💕',
    '嬉し': '😊',
    '楽し': '🎉',
    '仕事': '💼',
    '勉強': '📚',
    '運動': '💪'
  };
  
  let result = content;
  for (const [keyword, emoji] of Object.entries(emojiMap)) {
    if (result.includes(keyword) && !result.includes(emoji)) {
      result = result.replace(keyword, `${keyword}${emoji}`);
    }
  }
  
  return result;
}