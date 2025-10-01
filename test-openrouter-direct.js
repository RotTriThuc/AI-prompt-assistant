/**
 * Direct OpenRouter API Test
 * Test API key validity trực tiếp với OpenRouter
 */

const fetch = require('node-fetch');

const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function testOpenRouterDirect() {
    console.log('🧪 Testing OpenRouter API Key...');
    console.log(`📝 Key: ${API_KEY.substring(0, 20)}...`);
    console.log('');
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                'HTTP-Referer': 'http://localhost:3001',
                'X-Title': 'AI Prompt Assistant Test'
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat-v3.1:free',
                messages: [{
                    role: 'user',
                    content: 'Hello, this is a test.'
                }],
                max_tokens: 10
            })
        });
        
        console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
        console.log('');
        
        const data = await response.json();
        console.log('📦 Response Data:');
        console.log(JSON.stringify(data, null, 2));
        
        if (response.ok) {
            console.log('');
            console.log('✅ SUCCESS! API Key is valid!');
        } else {
            console.log('');
            console.log('❌ FAILED! API Key issue detected!');
            console.log('');
            console.log('🔧 Possible solutions:');
            console.log('   1. Get a new API key from: https://openrouter.ai/keys');
            console.log('   2. Check your account status at: https://openrouter.ai/account');
            console.log('   3. Verify billing/credits at: https://openrouter.ai/credits');
        }
        
    } catch (error) {
        console.error('❌ Error testing API key:', error.message);
    }
}

testOpenRouterDirect();
