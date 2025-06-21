#!/usr/bin/env tsx

import promptStorage from '../src/services/promptStorage';
import { StyleType } from '../src/types';

async function testPromptRetrieval() {
  console.log('=== Prompt Storage Test ===\n');
  
  const styles: StyleType[] = ['aska', 'kuwata', 'mission', 'omae', 'instagram'];
  
  for (const style of styles) {
    console.log(`\n--- Testing ${style} ---`);
    
    try {
      // プロンプトを取得
      const prompt = await promptStorage.getPrompt(style);
      
      console.log(`Style: ${style}`);
      console.log(`Prompt length: ${prompt?.length || 0} characters`);
      console.log(`First 100 chars: ${prompt?.substring(0, 100)}...`);
      
      // 環境変数をチェック
      const envKey = `PROMPT_${style.toUpperCase()}`;
      const envValue = process.env[envKey];
      console.log(`Environment variable ${envKey}: ${envValue ? 'Set' : 'Not set'}`);
      
    } catch (error) {
      console.error(`Error getting prompt for ${style}:`, error);
    }
  }
  
  console.log('\n\n=== All Prompts ===');
  
  try {
    const allPrompts = await promptStorage.getAllPrompts();
    console.log(`Total prompts loaded: ${allPrompts.length}`);
    
    allPrompts.forEach(p => {
      console.log(`\n${p.style}:`);
      console.log(`  Updated: ${p.updatedAt}`);
      console.log(`  Length: ${p.prompt.length} characters`);
    });
  } catch (error) {
    console.error('Error getting all prompts:', error);
  }
  
  console.log('\n\n=== Environment Check ===');
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`VERCEL: ${process.env.VERCEL}`);
  console.log(`PWD: ${process.cwd()}`);
}

// 実行
testPromptRetrieval().catch(console.error);