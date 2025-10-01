/**
 * 🔐 API Key Encryption Utilities
 * Mã hóa và giải mã API keys an toàn bằng AES-256-CBC
 * Tạo bởi Claude Sonnet 4.5 - Tech Lead Security Expert
 */

const crypto = require('crypto');

// ===== ENCRYPTION CONFIGURATION =====
const ENCRYPTION_CONFIG = {
    ALGORITHM: 'aes-256-cbc',
    // ⚠️ QUAN TRỌNG: Thay đổi KEY này và lưu ở nơi an toàn
    // Trong production, nên lấy từ environment variable hoặc secret manager
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'your-32-character-secret-key!!', // Must be 32 characters for AES-256
    IV_LENGTH: 16 // For AES, this is always 16
};

/**
 * Tạo encryption key từ password/secret
 * Sử dụng PBKDF2 để tạo key mạnh từ password
 * @param {string} password - Password hoặc secret phrase
 * @param {string} salt - Salt để tăng độ bảo mật (optional)
 * @returns {Buffer} - 32-byte encryption key
 */
function generateEncryptionKey(password, salt = 'ai-prompt-assistant-salt') {
    // Sử dụng PBKDF2 để derive key từ password
    return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
}

/**
 * Mã hóa API key
 * @param {string} apiKey - API key cần mã hóa
 * @param {string} encryptionPassword - Password để mã hóa (optional)
 * @returns {string} - API key đã mã hóa (format: iv:encryptedData)
 */
function encryptAPIKey(apiKey, encryptionPassword = null) {
    try {
        // Generate encryption key
        const key = encryptionPassword 
            ? generateEncryptionKey(encryptionPassword)
            : Buffer.from(ENCRYPTION_CONFIG.ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32));
        
        // Generate random IV (Initialization Vector)
        const iv = crypto.randomBytes(ENCRYPTION_CONFIG.IV_LENGTH);
        
        // Create cipher
        const cipher = crypto.createCipheriv(ENCRYPTION_CONFIG.ALGORITHM, key, iv);
        
        // Encrypt the API key
        let encrypted = cipher.update(apiKey, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        // Return IV + encrypted data (separated by :)
        // IV cần được lưu cùng với encrypted data để có thể decrypt sau này
        return `${iv.toString('hex')}:${encrypted}`;
        
    } catch (error) {
        console.error('❌ Error encrypting API key:', error);
        throw new Error(`Encryption failed: ${error.message}`);
    }
}

/**
 * Giải mã API key
 * @param {string} encryptedAPIKey - API key đã mã hóa (format: iv:encryptedData)
 * @param {string} encryptionPassword - Password để giải mã (optional)
 * @returns {string} - API key gốc
 */
function decryptAPIKey(encryptedAPIKey, encryptionPassword = null) {
    try {
        // Generate encryption key (phải giống với key dùng để encrypt)
        const key = encryptionPassword 
            ? generateEncryptionKey(encryptionPassword)
            : Buffer.from(ENCRYPTION_CONFIG.ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32));
        
        // Split IV and encrypted data
        const parts = encryptedAPIKey.split(':');
        if (parts.length !== 2) {
            throw new Error('Invalid encrypted API key format. Expected format: iv:encryptedData');
        }
        
        const iv = Buffer.from(parts[0], 'hex');
        const encryptedData = parts[1];
        
        // Create decipher
        const decipher = crypto.createDecipheriv(ENCRYPTION_CONFIG.ALGORITHM, key, iv);
        
        // Decrypt the data
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
        
    } catch (error) {
        console.error('❌ Error decrypting API key:', error);
        throw new Error(`Decryption failed: ${error.message}`);
    }
}

/**
 * Validate API key format
 * @param {string} apiKey - API key to validate
 * @param {string} provider - Provider name (gemini, openrouter, groq, openai)
 * @returns {boolean} - True if valid format
 */
function validateAPIKeyFormat(apiKey, provider) {
    const patterns = {
        gemini: /^AIza[0-9A-Za-z_-]{35}$/,
        openrouter: /^sk-or-v1-[a-f0-9]{64}$/,
        groq: /^gsk_[a-zA-Z0-9]{52}$/,
        openai: /^sk-proj-[a-zA-Z0-9_-]+$/
    };
    
    const pattern = patterns[provider.toLowerCase()];
    if (!pattern) {
        console.warn(`⚠️ No validation pattern for provider: ${provider}`);
        return true; // Allow unknown providers
    }
    
    return pattern.test(apiKey);
}

/**
 * Mask API key for logging (show only first and last 4 characters)
 * @param {string} apiKey - API key to mask
 * @returns {string} - Masked API key
 */
function maskAPIKey(apiKey) {
    if (!apiKey || apiKey.length < 12) {
        return '****';
    }
    
    const firstPart = apiKey.slice(0, 8);
    const lastPart = apiKey.slice(-4);
    const maskedMiddle = '*'.repeat(Math.min(apiKey.length - 12, 20));
    
    return `${firstPart}${maskedMiddle}${lastPart}`;
}

/**
 * Generate new encryption key (for initial setup)
 * @returns {string} - Random 32-character encryption key
 */
function generateNewEncryptionKey() {
    return crypto.randomBytes(32).toString('hex').slice(0, 32);
}

// ===== CLI HELPER FUNCTIONS =====

/**
 * Interactive CLI to encrypt API keys
 * Usage: node encryption-utils.js encrypt
 */
function interactiveEncrypt() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    console.log('\n🔐 API Key Encryption Tool\n');
    console.log('═══════════════════════════════════════════════════\n');
    
    rl.question('Enter API key to encrypt: ', (apiKey) => {
        rl.question('Enter provider name (gemini/openrouter/groq/openai): ', (provider) => {
            rl.question('Enter encryption password (or press Enter for default): ', (password) => {
                try {
                    // Validate API key format
                    if (provider && !validateAPIKeyFormat(apiKey, provider)) {
                        console.warn('\n⚠️ Warning: API key format may be invalid for provider:', provider);
                    }
                    
                    // Encrypt
                    const encryptedKey = encryptAPIKey(apiKey, password || null);
                    
                    console.log('\n✅ Encryption successful!\n');
                    console.log('═══════════════════════════════════════════════════');
                    console.log('Original (masked):', maskAPIKey(apiKey));
                    console.log('Encrypted:', encryptedKey);
                    console.log('═══════════════════════════════════════════════════\n');
                    console.log('💡 Add this to your .env file:');
                    console.log(`${provider.toUpperCase()}_API_KEY_ENCRYPTED="${encryptedKey}"\n`);
                    
                } catch (error) {
                    console.error('\n❌ Encryption failed:', error.message);
                } finally {
                    rl.close();
                }
            });
        });
    });
}

/**
 * Interactive CLI to decrypt API keys
 * Usage: node encryption-utils.js decrypt
 */
function interactiveDecrypt() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    console.log('\n🔓 API Key Decryption Tool\n');
    console.log('═══════════════════════════════════════════════════\n');
    
    rl.question('Enter encrypted API key (iv:encryptedData): ', (encryptedKey) => {
        rl.question('Enter encryption password (or press Enter for default): ', (password) => {
            try {
                // Decrypt
                const decryptedKey = decryptAPIKey(encryptedKey, password || null);
                
                console.log('\n✅ Decryption successful!\n');
                console.log('═══════════════════════════════════════════════════');
                console.log('Decrypted (masked):', maskAPIKey(decryptedKey));
                console.log('Full key:', decryptedKey);
                console.log('═══════════════════════════════════════════════════\n');
                
            } catch (error) {
                console.error('\n❌ Decryption failed:', error.message);
            } finally {
                rl.close();
            }
        });
    });
}

/**
 * Generate and display new encryption key
 * Usage: node encryption-utils.js generate-key
 */
function interactiveGenerateKey() {
    console.log('\n🔑 Generate New Encryption Key\n');
    console.log('═══════════════════════════════════════════════════\n');
    
    const newKey = generateNewEncryptionKey();
    
    console.log('New encryption key:', newKey);
    console.log('\n💡 Add this to your .env file:');
    console.log(`ENCRYPTION_KEY="${newKey}"\n`);
    console.log('⚠️ IMPORTANT: Keep this key safe and never commit it to Git!\n');
}

// ===== CLI COMMAND HANDLING =====
if (require.main === module) {
    const command = process.argv[2];
    
    switch (command) {
        case 'encrypt':
            interactiveEncrypt();
            break;
        case 'decrypt':
            interactiveDecrypt();
            break;
        case 'generate-key':
            interactiveGenerateKey();
            break;
        default:
            console.log('\n🔐 API Key Encryption Utilities\n');
            console.log('Usage:');
            console.log('  node encryption-utils.js encrypt       - Encrypt an API key');
            console.log('  node encryption-utils.js decrypt       - Decrypt an API key');
            console.log('  node encryption-utils.js generate-key  - Generate new encryption key\n');
    }
}

// ===== EXPORTS =====
module.exports = {
    encryptAPIKey,
    decryptAPIKey,
    validateAPIKeyFormat,
    maskAPIKey,
    generateEncryptionKey,
    generateNewEncryptionKey
};

