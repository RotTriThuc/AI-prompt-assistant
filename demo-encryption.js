/**
 * 🎭 Demo Encryption System
 * Interactive demo để test encryption/decryption
 * Tạo bởi Claude Sonnet 4.5
 */

const { encryptAPIKey, decryptAPIKey, maskAPIKey, validateAPIKeyFormat, generateNewEncryptionKey } = require('./encryption-utils');

console.log('\n🎭 ======================================================');
console.log('   DEMO: API Key Encryption System');
console.log('   Tạo bởi Claude Sonnet 4.5');
console.log('======================================================\n');

// Demo API keys (for testing only)
const DEMO_KEYS = {
    gemini: 'AIzaSyDAnBQKPWkJigLq_Hiy4PmqPvLkdW2AQAo',
    openrouter: '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',
    groq: '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',
    test: 'test-api-key-1234567890'
};

/**
 * Demo 1: Encryption & Decryption
 */
function demo1_BasicEncryption() {
    console.log('📋 DEMO 1: Basic Encryption & Decryption\n');
    console.log('─'.repeat(60));
    
    const testKey = DEMO_KEYS.test;
    console.log(`\n1️⃣  Original API Key: "${testKey}"`);
    
    // Encrypt
    const encrypted = encryptAPIKey(testKey);
    console.log(`\n2️⃣  Encrypted Result: "${encrypted}"`);
    console.log(`   Format: iv:encryptedData`);
    console.log(`   - IV (first part): Random 16 bytes`);
    console.log(`   - Encrypted Data (second part): AES-256-CBC encrypted`);
    
    // Decrypt
    const decrypted = decryptAPIKey(encrypted);
    console.log(`\n3️⃣  Decrypted Result: "${decrypted}"`);
    
    // Verify
    const isMatch = testKey === decrypted;
    console.log(`\n4️⃣  Verification: ${isMatch ? '✅ MATCH!' : '❌ FAILED!'}`);
    console.log(`   Original: "${testKey}"`);
    console.log(`   Decrypted: "${decrypted}"`);
    
    console.log('\n' + '─'.repeat(60) + '\n');
}

/**
 * Demo 2: Multiple Providers
 */
function demo2_MultipleProviders() {
    console.log('📋 DEMO 2: Encrypt Multiple Provider Keys\n');
    console.log('─'.repeat(60));
    
    const providers = ['gemini', 'openrouter', 'groq'];
    const encryptedKeys = {};
    
    providers.forEach((provider, index) => {
        const apiKey = DEMO_KEYS[provider];
        const encrypted = encryptAPIKey(apiKey);
        encryptedKeys[provider] = encrypted;
        
        console.log(`\n${index + 1}️⃣  ${provider.toUpperCase()}`);
        console.log(`   Original (masked): ${maskAPIKey(apiKey)}`);
        console.log(`   Encrypted: ${encrypted.substring(0, 50)}...`);
    });
    
    console.log('\n' + '─'.repeat(60));
    
    // Verify all
    console.log('\n🔍 Verification:\n');
    
    let allValid = true;
    providers.forEach((provider, index) => {
        const original = DEMO_KEYS[provider];
        const decrypted = decryptAPIKey(encryptedKeys[provider]);
        const isValid = original === decrypted;
        
        console.log(`${index + 1}️⃣  ${provider.toUpperCase()}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
        
        if (!isValid) allValid = false;
    });
    
    console.log(`\n🎯 Overall: ${allValid ? '✅ All keys encrypted correctly!' : '❌ Some keys failed!'}`);
    console.log('\n' + '─'.repeat(60) + '\n');
}

/**
 * Demo 3: API Key Validation
 */
function demo3_KeyValidation() {
    console.log('📋 DEMO 3: API Key Format Validation\n');
    console.log('─'.repeat(60));
    
    const testCases = [
        { provider: 'gemini', key: DEMO_KEYS.gemini, expected: true },
        { provider: 'openrouter', key: DEMO_KEYS.openrouter, expected: true },
        { provider: 'groq', key: DEMO_KEYS.groq, expected: true },
        { provider: 'gemini', key: 'invalid-key', expected: false },
        { provider: 'openrouter', key: 'sk-wrong-format', expected: false }
    ];
    
    testCases.forEach((test, index) => {
        const isValid = validateAPIKeyFormat(test.key, test.provider);
        const status = isValid === test.expected ? '✅' : '❌';
        
        console.log(`\n${index + 1}️⃣  ${status} ${test.provider.toUpperCase()}`);
        console.log(`   Key (masked): ${maskAPIKey(test.key)}`);
        console.log(`   Valid: ${isValid ? 'Yes' : 'No'} (Expected: ${test.expected ? 'Yes' : 'No'})`);
    });
    
    console.log('\n' + '─'.repeat(60) + '\n');
}

/**
 * Demo 4: Encryption Key Generation
 */
function demo4_KeyGeneration() {
    console.log('📋 DEMO 4: Encryption Key Generation\n');
    console.log('─'.repeat(60));
    
    console.log('\nGenerating 3 different encryption keys:\n');
    
    for (let i = 1; i <= 3; i++) {
        const key = generateNewEncryptionKey();
        console.log(`${i}️⃣  Key ${i}: ${key}`);
        console.log(`   Length: ${key.length} characters`);
    }
    
    console.log('\n💡 Note: Each key is randomly generated and unique');
    console.log('   Use these for ENCRYPTION_KEY in .env file');
    
    console.log('\n' + '─'.repeat(60) + '\n');
}

/**
 * Demo 5: Masking for Safe Logging
 */
function demo5_SafeLogging() {
    console.log('📋 DEMO 5: Safe Logging with Masking\n');
    console.log('─'.repeat(60));
    
    console.log('\n🔴 UNSAFE Logging (NEVER do this):');
    console.log(`   API Key: ${DEMO_KEYS.gemini}`);
    
    console.log('\n✅ SAFE Logging (Always use masking):');
    console.log(`   API Key: ${maskAPIKey(DEMO_KEYS.gemini)}`);
    
    console.log('\n📊 Comparison:\n');
    
    Object.keys(DEMO_KEYS).forEach((provider, index) => {
        const key = DEMO_KEYS[provider];
        console.log(`${index + 1}️⃣  ${provider.toUpperCase()}`);
        console.log(`   🔴 Full: ${key}`);
        console.log(`   ✅ Masked: ${maskAPIKey(key)}`);
        console.log('');
    });
    
    console.log('─'.repeat(60) + '\n');
}

/**
 * Demo 6: Encryption with Password
 */
function demo6_PasswordEncryption() {
    console.log('📋 DEMO 6: Encryption with Custom Password\n');
    console.log('─'.repeat(60));
    
    const testKey = DEMO_KEYS.test;
    const password1 = 'my-secret-password-123';
    const password2 = 'different-password-456';
    
    console.log(`\n1️⃣  Original Key: "${testKey}"`);
    
    // Encrypt with password 1
    const encrypted1 = encryptAPIKey(testKey, password1);
    console.log(`\n2️⃣  Encrypted with Password 1:`);
    console.log(`   Password: "${password1}"`);
    console.log(`   Encrypted: ${encrypted1.substring(0, 50)}...`);
    
    // Encrypt with password 2
    const encrypted2 = encryptAPIKey(testKey, password2);
    console.log(`\n3️⃣  Encrypted with Password 2:`);
    console.log(`   Password: "${password2}"`);
    console.log(`   Encrypted: ${encrypted2.substring(0, 50)}...`);
    
    console.log(`\n4️⃣  Comparison:`);
    console.log(`   Same original key → Different encrypted results`);
    console.log(`   Encrypted 1 === Encrypted 2: ${encrypted1 === encrypted2}`);
    
    // Decrypt with correct password
    const decrypted1 = decryptAPIKey(encrypted1, password1);
    console.log(`\n5️⃣  Decrypt with Correct Password:`);
    console.log(`   Decrypted: "${decrypted1}"`);
    console.log(`   Match: ${decrypted1 === testKey ? '✅' : '❌'}`);
    
    // Try decrypt with wrong password
    console.log(`\n6️⃣  Decrypt with Wrong Password:`);
    try {
        const decrypted2 = decryptAPIKey(encrypted1, password2);
        console.log(`   Decrypted: "${decrypted2}"`);
        console.log(`   ❌ Should have failed but didn't!`);
    } catch (error) {
        console.log(`   ✅ Correctly failed: ${error.message}`);
    }
    
    console.log('\n' + '─'.repeat(60) + '\n');
}

/**
 * Demo 7: .env File Format
 */
function demo7_EnvFileFormat() {
    console.log('📋 DEMO 7: .env File Format Example\n');
    console.log('─'.repeat(60));
    
    const encryptionKey = generateNewEncryptionKey();
    const encryptedGemini = encryptAPIKey(DEMO_KEYS.gemini, encryptionKey);
    const encryptedOpenRouter = encryptAPIKey(DEMO_KEYS.openrouter, encryptionKey);
    const encryptedGroq = encryptAPIKey(DEMO_KEYS.groq, encryptionKey);
    
    console.log('\n📝 Example .env file content:\n');
    console.log('# ======================================');
    console.log('# API Key Configuration (Encrypted)');
    console.log('# ======================================');
    console.log('');
    console.log(`ENCRYPTION_KEY="${encryptionKey}"`);
    console.log('');
    console.log('# Encrypted API Keys');
    console.log(`GEMINI_API_KEY_ENCRYPTED="${encryptedGemini}"`);
    console.log(`OPENROUTER_API_KEY_ENCRYPTED="${encryptedOpenRouter}"`);
    console.log(`GROQ_API_KEY_ENCRYPTED="${encryptedGroq}"`);
    console.log('');
    
    console.log('💡 Copy này vào file .env để sử dụng!');
    
    console.log('\n' + '─'.repeat(60) + '\n');
}

/**
 * Run all demos
 */
function runAllDemos() {
    console.log('🚀 Running all demos...\n');
    
    demo1_BasicEncryption();
    
    console.log('Press Enter to continue to Demo 2...');
    process.stdin.once('data', () => {
        demo2_MultipleProviders();
        
        console.log('Press Enter to continue to Demo 3...');
        process.stdin.once('data', () => {
            demo3_KeyValidation();
            
            console.log('Press Enter to continue to Demo 4...');
            process.stdin.once('data', () => {
                demo4_KeyGeneration();
                
                console.log('Press Enter to continue to Demo 5...');
                process.stdin.once('data', () => {
                    demo5_SafeLogging();
                    
                    console.log('Press Enter to continue to Demo 6...');
                    process.stdin.once('data', () => {
                        demo6_PasswordEncryption();
                        
                        console.log('Press Enter to continue to Demo 7...');
                        process.stdin.once('data', () => {
                            demo7_EnvFileFormat();
                            
                            console.log('\n✅ All demos completed!');
                            console.log('\n🎉 API Key Encryption System is working perfectly!\n');
                            process.exit(0);
                        });
                    });
                });
            });
        });
    });
}

/**
 * Interactive menu
 */
function showMenu() {
    console.log('Choose a demo to run:\n');
    console.log('1. Basic Encryption & Decryption');
    console.log('2. Multiple Provider Keys');
    console.log('3. API Key Validation');
    console.log('4. Encryption Key Generation');
    console.log('5. Safe Logging with Masking');
    console.log('6. Encryption with Custom Password');
    console.log('7. .env File Format Example');
    console.log('8. Run All Demos');
    console.log('0. Exit\n');
    
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.question('Enter your choice (0-8): ', (choice) => {
        console.log('');
        
        switch (choice.trim()) {
            case '1':
                demo1_BasicEncryption();
                break;
            case '2':
                demo2_MultipleProviders();
                break;
            case '3':
                demo3_KeyValidation();
                break;
            case '4':
                demo4_KeyGeneration();
                break;
            case '5':
                demo5_SafeLogging();
                break;
            case '6':
                demo6_PasswordEncryption();
                break;
            case '7':
                demo7_EnvFileFormat();
                break;
            case '8':
                rl.close();
                runAllDemos();
                return;
            case '0':
                console.log('👋 Goodbye!\n');
                rl.close();
                process.exit(0);
                return;
            default:
                console.log('❌ Invalid choice. Please try again.\n');
        }
        
        rl.close();
        
        // Show menu again after demo
        setTimeout(() => {
            console.log('\nPress Enter to return to menu...');
            process.stdin.once('data', () => {
                console.clear();
                showMenu();
            });
        }, 100);
    });
}

// Check if running directly or imported
if (require.main === module) {
    showMenu();
}

module.exports = {
    demo1_BasicEncryption,
    demo2_MultipleProviders,
    demo3_KeyValidation,
    demo4_KeyGeneration,
    demo5_SafeLogging,
    demo6_PasswordEncryption,
    demo7_EnvFileFormat
};

