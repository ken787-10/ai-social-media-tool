#!/usr/bin/env tsx

// 環境変数を設定
process.env.VERCEL = '1';
process.env.PROMPT_ASKA = '環境変数から読み込まれたASKAプロンプト';

// promptStorageをインポートする前に環境変数を確認
console.log('=== Before Import ===');
console.log('VERCEL:', process.env.VERCEL);
console.log('PROMPT_ASKA:', process.env.PROMPT_ASKA);

// 動的インポートで確実に環境変数設定後に読み込む
async function test() {
  const { default: promptStorage } = await import('../src/services/promptStorage');
  
  console.log('\n=== After Import ===');
  
  // プロンプトを取得
  const askaPrompt = await promptStorage.getPrompt('aska');
  console.log('\nRetrieved ASKA prompt:');
  console.log('First 100 chars:', askaPrompt.substring(0, 100));
  console.log('Full length:', askaPrompt.length);
  
  // 環境変数と比較
  if (askaPrompt === process.env.PROMPT_ASKA) {
    console.log('\n✅ SUCCESS: Prompt matches environment variable');
  } else {
    console.log('\n❌ FAIL: Prompt does not match environment variable');
    console.log('Expected:', process.env.PROMPT_ASKA);
    console.log('Got:', askaPrompt.substring(0, 50) + '...');
  }
  
  // すべてのプロンプトを表示
  console.log('\n=== All Prompts ===');
  const allPrompts = await promptStorage.getAllPrompts();
  allPrompts.forEach(p => {
    console.log(`${p.style}: ${p.prompt.substring(0, 50)}... (${p.prompt.length} chars)`);
  });
}

test().catch(console.error);