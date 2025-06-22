#!/usr/bin/env tsx

import promptStorage from '../src/services/promptStorage';
import { StyleType } from '../src/types';
import { CONTENT_LENGTH } from '../src/config/constants';

const inputText = "今日はANA便に乗ってグアムに行きます。今回宿泊するのはクラウンプラザホテル。";

async function showStylePrompts() {
  console.log('=== 各スタイルのプロンプト表示 ===\n');
  console.log(`入力テキスト: ${inputText}\n`);
  console.log('='.repeat(80) + '\n');

  const styles: { name: string; type: StyleType }[] = [
    { name: '桑田風 (kuwata style) - デフォルト', type: 'kuwata' },
    { name: 'ASKA風 (aska style)', type: 'aska' },
    { name: 'ミッション風 (mission style)', type: 'mission' }
  ];

  for (const { name, type } of styles) {
    console.log(`\n【${name}】`);
    console.log('='.repeat(60));
    
    try {
      // Get the system prompt for this style
      const systemPrompt = promptStorage.getPrompt(type);
      
      // Construct the user prompt (similar to openaiService.ts)
      const maxLength = CONTENT_LENGTH['100']; // 280 characters for 100%
      const userPrompt = `次のテーマについて、指定されたスタイルで${maxLength}文字以内の投稿を書いてください: ${inputText}`;
      
      console.log('\n[システムプロンプト] (最初の500文字):');
      console.log('-'.repeat(40));
      console.log(systemPrompt.substring(0, 500) + '...\n');
      
      console.log('[ユーザープロンプト]:');
      console.log('-'.repeat(40));
      console.log(userPrompt);
      
      console.log('\n[プロンプトの特徴]:');
      console.log('-'.repeat(40));
      
      // Check for specific characteristics in each style
      if (type === 'kuwata') {
        console.log('✓ 湘南・茅ヶ崎の風景');
        console.log('✓ 音楽愛と温かい人間味');
        console.log('✓ ポジティブな表現への変換');
        console.log('✓ 「〜ですね」「〜じゃないですか」などの親しみやすい語尾');
        if (systemPrompt.includes('ひとりコックリさん')) {
          console.log('✓ 表現の多様性（ひとりコックリさん）');
        }
      } else if (type === 'aska') {
        console.log('✓ 宇宙的・哲学的な視点');
        console.log('✓ 詩的で内省的な表現');
        console.log('✓ 「君」への語りかけ');
        console.log('✓ 魂、永遠、星座などのキーワード');
      } else if (type === 'mission') {
        console.log('✓ IMFエージェントとしての視点');
        console.log('✓ 緊迫感とスタイリッシュさ');
        console.log('✓ 任務遂行の精神');
        console.log('✓ 専門用語とアクション要素');
      }
      
      console.log('\n[期待される出力の例]:');
      console.log('-'.repeat(40));
      
      // Provide example outputs for each style
      if (type === 'kuwata') {
        console.log('おぉ〜、グアムですか！いいですねぇ〜♪');
        console.log('ANA便でひとっ飛び、クラウンプラザで優雅なひととき。');
        console.log('南国の風を感じながら、素敵な思い出作ってきてくださいね！');
        console.log('茅ヶ崎から応援してますよ〜（笑）');
      } else if (type === 'aska') {
        console.log('空の彼方へと導かれて、魂は新たな地平を求める。');
        console.log('グアムという楽園で、君は何を見つけるのだろうか。');
        console.log('クラウンプラザの窓から見える星空に、永遠の答えがあるかもしれない。');
        console.log('旅とは、自分自身との対話なのかもしれないね。');
      } else if (type === 'mission') {
        console.log('ミッション開始。ANA便にて目的地グアムへ移動。');
        console.log('拠点はクラウンプラザホテルに確保済み。');
        console.log('すべての準備は整った。この任務も必ず成功させる。');
        console.log('#MissionPossible #TeamWork');
      }
      
    } catch (error) {
      console.error(`エラーが発生しました (${name}):`, error);
    }
    
    console.log('\n' + '='.repeat(80));
  }
  
  console.log('\n\n[補足情報]');
  console.log('='.repeat(40));
  console.log('• これらのプロンプトはOpenAI APIのGPT-4oモデルに送信されます');
  console.log('• temperature: 0.7, presence_penalty: 0.1, frequency_penalty: 0.1');
  console.log('• 最大トークン数は文字数制限の約2倍に設定されます（日本語は1文字≒2トークン）');
}

// Run the script
showStylePrompts()
  .then(() => {
    console.log('\n✅ プロンプト表示が完了しました');
  })
  .catch(error => {
    console.error('\n❌ 実行中にエラーが発生しました:', error);
    process.exit(1);
  });