#!/usr/bin/env tsx

// Vercel環境をシミュレート
process.env.VERCEL = '1';
process.env.PROMPT_ASKA = 'テスト用ASKAプロンプト';
process.env.PROMPT_KUWATA = 'テスト用桑田プロンプト';

import promptStorage from '../src/services/promptStorage';
import { StyleType } from '../src/types';

async function testVercelEnvironment() {
  console.log('=== Vercel Environment Test ===\n');
  
  console.log('Environment Variables:');
  console.log(`VERCEL: ${process.env.VERCEL}`);
  console.log(`PROMPT_ASKA: ${process.env.PROMPT_ASKA ? 'Set' : 'Not set'}`);
  console.log(`PROMPT_KUWATA: ${process.env.PROMPT_KUWATA ? 'Set' : 'Not set'}`);
  console.log('\n');
  
  const styles: StyleType[] = ['aska', 'kuwata', 'mission', 'omae', 'instagram'];
  
  for (const style of styles) {
    console.log(`\n--- Testing ${style} ---`);
    
    try {
      const prompt = await promptStorage.getPrompt(style);
      console.log(`Prompt retrieved: ${prompt?.substring(0, 50)}...`);
      console.log(`Length: ${prompt?.length || 0} characters`);
      
      // 環境変数から読み込まれているか確認
      const envKey = `PROMPT_${style.toUpperCase()}`;
      const envValue = process.env[envKey];
      if (envValue && prompt === envValue) {
        console.log('✅ Prompt loaded from environment variable');
      } else if (envValue && prompt !== envValue) {
        console.log('❌ Environment variable exists but prompt differs');
      } else {
        console.log('ℹ️ Using default prompt');
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }
  
  // プロンプトの更新をテスト
  console.log('\n\n=== Testing Prompt Update ===');
  try {
    await promptStorage.updatePrompt('aska', '更新されたプロンプト');
    const updatedPrompt = await promptStorage.getPrompt('aska');
    console.log(`Updated prompt: ${updatedPrompt}`);
    console.log(`Is Vercel: ${process.env.VERCEL ? 'Yes' : 'No'}`);
  } catch (error) {
    console.error('Update error:', error);
  }
}

testVercelEnvironment().catch(console.error);