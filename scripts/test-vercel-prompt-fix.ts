#!/usr/bin/env tsx

// Vercel環境をシミュレート
process.env.VERCEL = '1';
process.env.PROMPT_ASKA = '更新されたASKAプロンプト - Vercel環境変数から';
process.env.PROMPT_KUWATA = '更新された桑田プロンプト - Vercel環境変数から';

import { default as promptStorage } from '../src/services/promptStorage';

async function testFixedPromptLoading() {
  console.log('=== Vercel Prompt Fix Test ===\n');
  
  console.log('Environment:');
  console.log(`VERCEL: ${process.env.VERCEL}`);
  console.log(`PROMPT_ASKA: ${process.env.PROMPT_ASKA}`);
  console.log(`PROMPT_KUWATA: ${process.env.PROMPT_KUWATA}`);
  console.log('\n');
  
  // ASKAプロンプトをテスト
  console.log('--- Testing ASKA Prompt ---');
  const askaPrompt = await promptStorage.getPrompt('aska');
  console.log(`Retrieved: ${askaPrompt}`);
  console.log(`Matches env?: ${askaPrompt === process.env.PROMPT_ASKA ? '✅ YES' : '❌ NO'}`);
  
  // KUWATAプロンプトをテスト
  console.log('\n--- Testing KUWATA Prompt ---');
  const kuwataPrompt = await promptStorage.getPrompt('kuwata');
  console.log(`Retrieved: ${kuwataPrompt.substring(0, 50)}...`);
  console.log(`Matches env?: ${kuwataPrompt === process.env.PROMPT_KUWATA ? '✅ YES' : '❌ NO'}`);
  
  // 環境変数が設定されていないスタイルをテスト
  console.log('\n--- Testing MISSION Prompt (no env var) ---');
  const missionPrompt = await promptStorage.getPrompt('mission');
  console.log(`Retrieved: ${missionPrompt.substring(0, 50)}...`);
  console.log(`Using default?: ${missionPrompt.startsWith('# ミッションインポッシブル') ? '✅ YES' : '❌ NO'}`);
}

testFixedPromptLoading().catch(console.error);