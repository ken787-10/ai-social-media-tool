#!/usr/bin/env node

// 環境変数チェックスクリプト
// 実行方法: node scripts/check-env.js

const fs = require('fs');
const path = require('path');

console.log('=== 環境変数チェック ===\n');

// 必須環境変数
const requiredVars = [
  'LINE_CHANNEL_SECRET',
  'LINE_CHANNEL_ACCESS_TOKEN',
  'OPENAI_API_KEY',
  'ADMIN_PASSWORD',
  'JWT_SECRET'
];

// プロンプト関連の環境変数
const promptVars = [
  'PROMPT_ASKA',
  'PROMPT_KUWATA',
  'PROMPT_MISSION',
  'PROMPT_OMAE',
  'PROMPT_INSTAGRAM'
];

// その他の環境変数
const optionalVars = [
  'VERCEL',
  'VERCEL_ENV',
  'VERCEL_URL'
];

console.log('【必須環境変数】');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: 設定済み (${value.substring(0, 10)}...)`);
  } else {
    console.log(`❌ ${varName}: 未設定`);
  }
});

console.log('\n【プロンプト環境変数】');
promptVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: 設定済み (${value.length}文字)`);
  } else {
    console.log(`⚠️  ${varName}: 未設定 (デフォルトプロンプトを使用)`);
  }
});

console.log('\n【Vercel関連環境変数】');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`-  ${varName}: 未設定`);
  }
});

// .envファイルの存在確認
console.log('\n【環境変数ファイル】');
const envFiles = ['.env', '.env.local', '.env.production'];
envFiles.forEach(fileName => {
  const filePath = path.join(process.cwd(), fileName);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${fileName}: 存在`);
  } else {
    console.log(`-  ${fileName}: 存在しない`);
  }
});

console.log('\n=== チェック完了 ===');