#!/usr/bin/env tsx

import { generateContent } from '../src/services/openaiService';
import promptStorage from '../src/services/promptStorage';

async function testKuwataGeneration() {
  console.log('=== Testing Kuwata Style Generation ===\n');
  
  // Get the kuwata prompt to verify it has diversity/positivity sections
  const kuwataPrompt = promptStorage.getPrompt('kuwata');
  console.log('Prompt length:', kuwataPrompt.length);
  console.log('Has diversity section:', kuwataPrompt.includes('表現の多様性について'));
  console.log('Has positivity section:', kuwataPrompt.includes('ポジティブ表現の徹底'));
  console.log('Has ひとりコックリさん reference:', kuwataPrompt.includes('ひとりコックリさん'));
  
  console.log('\n--- Testing different themes with same style ---\n');
  
  const themes = [
    '今日は雨が降っている',
    'ちょっと疲れた一日だった',
    '仕事で失敗してしまった',
    '体重が増えてしまった'
  ];
  
  for (const theme of themes) {
    console.log(`\nTheme: "${theme}"`);
    console.log('---');
    
    try {
      // Generate content
      const content = await generateContent(
        theme,
        'kuwata',
        '50%',  // 140 characters
        'test-user',
        false
      );
      
      console.log('Generated content:');
      console.log(content);
      console.log(`Length: ${content.length} characters`);
      
      // Check for positive transformation
      if (theme.includes('雨')) {
        console.log('✓ Should transform rain positively');
      }
      if (theme.includes('疲れ')) {
        console.log('✓ Should transform tiredness positively');
      }
      if (theme.includes('失敗')) {
        console.log('✓ Should transform failure positively');
      }
      if (theme.includes('体重')) {
        console.log('✓ Should transform weight gain positively');
      }
      
    } catch (error) {
      console.error('Error generating content:', error);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n\n--- Testing expression diversity (same theme, multiple generations) ---\n');
  
  const sameTheme = '美味しいランチを食べた';
  console.log(`Theme: "${sameTheme}"`);
  console.log('Generating 3 versions to check diversity...\n');
  
  for (let i = 1; i <= 3; i++) {
    console.log(`\nVersion ${i}:`);
    try {
      const content = await generateContent(
        sameTheme,
        'kuwata',
        '50%',
        'test-user',
        false
      );
      console.log(content);
    } catch (error) {
      console.error('Error:', error);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Check if OpenAI API key is set
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY environment variable is not set');
  process.exit(1);
}

// Run the test
testKuwataGeneration().catch(console.error);