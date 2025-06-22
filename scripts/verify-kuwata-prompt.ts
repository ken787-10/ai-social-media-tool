#!/usr/bin/env tsx

import promptStorage from '../src/services/promptStorage';

function verifyKuwataPrompt() {
  console.log('=== Verifying Kuwata Prompt Content ===\n');
  
  const kuwataPrompt = promptStorage.getPrompt('kuwata');
  
  console.log('Total prompt length:', kuwataPrompt.length, 'characters\n');
  
  // Check for key sections
  const checks = [
    {
      name: 'Diversity section (表現の多様性について)',
      searchText: '表現の多様性について',
      found: false,
      content: ''
    },
    {
      name: 'ひとりコックリさん reference',
      searchText: 'ひとりコックリさん',
      found: false,
      content: ''
    },
    {
      name: 'Positivity section (ポジティブ表現の徹底)',
      searchText: 'ポジティブ表現の徹底',
      found: false,
      content: ''
    },
    {
      name: 'Positive transformation examples',
      searchText: 'ポジティブ変換の例',
      found: false,
      content: ''
    }
  ];
  
  // Search for each section
  checks.forEach(check => {
    const index = kuwataPrompt.indexOf(check.searchText);
    if (index !== -1) {
      check.found = true;
      // Extract some context around the found text
      const start = Math.max(0, index - 50);
      const end = Math.min(kuwataPrompt.length, index + 200);
      check.content = kuwataPrompt.substring(start, end);
    }
  });
  
  // Display results
  console.log('=== Section Verification Results ===\n');
  
  checks.forEach(check => {
    console.log(`${check.name}:`);
    console.log(`  Found: ${check.found ? '✅ YES' : '❌ NO'}`);
    if (check.found && check.content) {
      console.log(`  Context: ...${check.content}...`);
    }
    console.log();
  });
  
  // Check specific positive transformation examples
  console.log('=== Positive Transformation Examples ===\n');
  
  const transformations = [
    '「太った」→「幸せの重さ」',
    '「疲れた」→「充実した証拠」',
    '「失敗した」→「次への学び」',
    '「雨の日」→「恵みの雨」'
  ];
  
  transformations.forEach(trans => {
    const found = kuwataPrompt.includes(trans);
    console.log(`${trans}: ${found ? '✅' : '❌'}`);
  });
  
  // Check for diversity instructions
  console.log('\n=== Diversity Instructions ===\n');
  
  const diversityPoints = [
    '同じフレーズや構文を繰り返さない',
    '比喩や例えは新鮮なものを選ぶ',
    '文の始まり方、終わり方にバリエーションを持たせる',
    '絵文字も固定化せず、内容に合わせて選択'
  ];
  
  diversityPoints.forEach(point => {
    const found = kuwataPrompt.includes(point);
    console.log(`- ${point}: ${found ? '✅' : '❌'}`);
  });
  
  // Extract and show the actual diversity and positivity sections
  console.log('\n=== Full Diversity Section ===\n');
  const diversityStart = kuwataPrompt.indexOf('## 【重要：表現の多様性について】');
  const diversityEnd = kuwataPrompt.indexOf('## 【ポジティブ表現の徹底】');
  if (diversityStart !== -1 && diversityEnd !== -1) {
    console.log(kuwataPrompt.substring(diversityStart, diversityEnd).trim());
  } else {
    console.log('❌ Diversity section not found properly');
  }
  
  console.log('\n=== Full Positivity Section ===\n');
  const positivityStart = kuwataPrompt.indexOf('## 【ポジティブ表現の徹底】');
  const positivityEnd = kuwataPrompt.indexOf('## 【文字数】');
  if (positivityStart !== -1 && positivityEnd !== -1) {
    console.log(kuwataPrompt.substring(positivityStart, positivityEnd).trim());
  } else {
    console.log('❌ Positivity section not found properly');
  }
}

// Run verification
verifyKuwataPrompt();