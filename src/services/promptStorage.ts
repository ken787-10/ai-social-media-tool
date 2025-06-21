import { StyleType } from '../types';
import fs from 'fs/promises';
import path from 'path';
import logger from '../utils/logger';

export interface StylePrompt {
  style: StyleType;
  prompt: string;
  updatedAt: string;
}

class PromptStorage {
  private prompts: Map<StyleType, StylePrompt> = new Map();
  private filePath: string;
  private defaultPrompts: Record<StyleType, string> = {
    aska: `あなたはCHAGE and ASKAのASKAです。詩的で哲学的、感性豊かな表現を使います。
独特の世界観と深い感情を込めた文章を書きます。音楽や芸術への愛、人生の深淵を見つめる視点が特徴です。`,
    
    kuwata: `あなたはサザンオールスターズの桑田佳祐です。ユーモラスで言葉遊びが得意、独特な視点で物事を表現します。
湘南の海を愛し、日本の夏や恋愛を独特の感性で歌い上げます。時に皮肉も交えながら、温かみのある文章を書きます。`,
    
    mission: `あなたはミッションインポッシブルのエージェントです。緊迫感のあるスパイ映画風の文体で書きます。
「君のミッションは...」「このメッセージは自動的に消去される」などの定番フレーズを使い、極秘任務や諜報活動を連想させる表現を多用します。
アクション満載で臨場感のある描写を心がけ、読者をスリリングな世界に引き込みます。`,
    
    omae: `あなたは経営コンサルタントの大前研一です。論理的でビジネス視点、鋭い洞察力で物事を分析します。
グローバルな視点と日本の課題を結びつけ、具体的な提言を行います。数字やデータを交えた説得力のある文章を書きます。`,
    
    instagram: `あなたはInstagram投稿のプロです。視覚的に映える内容で、適切な絵文字とハッシュタグを使います。
改行を効果的に使い、読みやすく共感されやすい投稿を作成します。トレンドを意識した内容にします。`
  };

  constructor() {
    this.filePath = process.env.VERCEL 
      ? '/tmp/prompts.json'  // Vercel環境では/tmpを使用
      : path.join(process.cwd(), 'data', 'prompts.json');
    
    // 初期化を非同期で実行
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.loadPrompts();
  }

  private async ensureDataDir(): Promise<void> {
    if (!process.env.VERCEL) {
      const dataDir = path.dirname(this.filePath);
      try {
        await fs.mkdir(dataDir, { recursive: true });
      } catch (error) {
        logger.error('Failed to create data directory', { error });
      }
    }
  }

  private async loadPrompts(): Promise<void> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      const promptsArray: StylePrompt[] = JSON.parse(data);
      
      promptsArray.forEach(prompt => {
        this.prompts.set(prompt.style, prompt);
      });
      
      logger.info('Prompts loaded from file', { count: promptsArray.length });
    } catch (error) {
      logger.info('No existing prompts file, using defaults');
      this.initializeDefaults();
    }
  }

  private initializeDefaults(): void {
    Object.entries(this.defaultPrompts).forEach(([style, prompt]) => {
      this.prompts.set(style as StyleType, {
        style: style as StyleType,
        prompt,
        updatedAt: new Date().toISOString()
      });
    });
  }

  async savePrompts(): Promise<void> {
    try {
      await this.ensureDataDir();
      const promptsArray = Array.from(this.prompts.values());
      await fs.writeFile(this.filePath, JSON.stringify(promptsArray, null, 2));
      logger.info('Prompts saved to file');
    } catch (error) {
      logger.error('Failed to save prompts', { error });
    }
  }

  getPrompt(style: StyleType): string {
    // プロンプトがまだロードされていない場合はデフォルトを使用
    if (this.prompts.size === 0) {
      return this.defaultPrompts[style];
    }
    const stylePrompt = this.prompts.get(style);
    return stylePrompt?.prompt || this.defaultPrompts[style];
  }

  getAllPrompts(): StylePrompt[] {
    // プロンプトがまだロードされていない場合はデフォルトを返す
    if (this.prompts.size === 0) {
      this.initializeDefaults();
    }
    return Array.from(this.prompts.values());
  }

  async updatePrompt(style: StyleType, prompt: string): Promise<void> {
    this.prompts.set(style, {
      style,
      prompt,
      updatedAt: new Date().toISOString()
    });
    
    await this.savePrompts();
    logger.info('Prompt updated', { style });
  }

  async resetPrompt(style: StyleType): Promise<void> {
    const defaultPrompt = this.defaultPrompts[style];
    if (defaultPrompt) {
      await this.updatePrompt(style, defaultPrompt);
    }
  }

  async resetAllPrompts(): Promise<void> {
    this.initializeDefaults();
    await this.savePrompts();
    logger.info('All prompts reset to defaults');
  }
}

export default new PromptStorage();