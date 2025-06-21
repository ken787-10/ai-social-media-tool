#!/usr/bin/env node

// プロンプトが正しく読み込まれているか確認するスクリプト

const promptStorage = require('../dist/src/services/promptStorage').default;

console.log('=== プロンプト確認 ===\n');

const styles = ['aska', 'kuwata', 'mission', 'omae', 'instagram'];

styles.forEach(style => {
  const prompt = promptStorage.getPrompt(style);
  console.log(`【${style}】`);
  console.log(`- 文字数: ${prompt.length}文字`);
  console.log(`- 最初の100文字: ${prompt.substring(0, 100)}...`);
  console.log(`- ASKA風を含む: ${prompt.includes('ASKA') ? '✅' : '❌'}`);
  console.log(`- 桑田を含む: ${prompt.includes('桑田') ? '✅' : '❌'}`);
  console.log(`- ミッションを含む: ${prompt.includes('ミッション') ? '✅' : '❌'}`);
  console.log(`- 大前を含む: ${prompt.includes('大前') ? '✅' : '❌'}`);
  console.log('');
});

console.log('=== 確認完了 ===');