#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';
import { generateContent } from '../src/services/openaiService';
import { StyleType } from '../src/types';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const inputText = "今日はANA便に乗ってグアムに行きます。今回宿泊するのはクラウンプラザホテル。";

async function generateOutputs() {
  console.log('=== 文体別出力生成 ===\n');
  console.log(`入力テキスト: ${inputText}\n`);
  console.log('='.repeat(50) + '\n');

  const styles: { name: string; type: StyleType }[] = [
    { name: '桑田風 (kuwata style)', type: 'kuwata' },
    { name: 'ASKA風 (aska style)', type: 'aska' },
    { name: 'ミッション風 (mission style)', type: 'mission' }
  ];

  for (const { name, type } of styles) {
    console.log(`\n【${name}】`);
    console.log('-'.repeat(40));
    
    try {
      // Generate content with 100% length (full length)
      const output = await generateContent(
        inputText,
        type,
        '100%',
        'test-user',
        false
      );
      
      console.log(output);
      console.log(`\n(文字数: ${output.length}文字)`);
      
    } catch (error) {
      console.error(`エラーが発生しました (${name}):`, error);
    }
    
    console.log('\n' + '='.repeat(50));
    
    // Add a small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Check if OpenAI API key is set
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set in environment variables');
  process.exit(1);
}

// Run the script
generateOutputs()
  .then(() => {
    console.log('\n✅ すべての出力が完了しました');
  })
  .catch(error => {
    console.error('\n❌ 実行中にエラーが発生しました:', error);
    process.exit(1);
  });