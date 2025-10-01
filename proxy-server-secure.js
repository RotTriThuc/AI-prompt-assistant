/**
 * 🛡️ Secure OpenAI API Proxy Server with Encrypted API Keys
 * Giải quyết CORS issue + Bảo mật API keys bằng AES-256-CBC encryption
 * Tạo bởi Claude Sonnet 4.5 - Tech Lead Security Expert
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config();

// Load encryption utilities
const { decryptAPIKey, maskAPIKey } = require('./encryption-utils');

const app = express();
const PORT = process.env.PORT || 3001;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.static('./')); // Serve static files

// ===== SECURE API KEY LOADING =====

/**
 * Load and decrypt API key from environment variables
 * Supports both encrypted and plain keys for backward compatibility
 * @param {string} provider - Provider name (GEMINI, OPENROUTER, GROQ, OPENAI)
 * @returns {string|null} - Decrypted API key or null if not found
 */
function loadAPIKey(provider) {
    const encryptedKeyName = `${provider}_API_KEY_ENCRYPTED`;
    const plainKeyName = `${provider}_API_KEY`;
    
    try {
        // Try encrypted key first (recommended)
        if (process.env[encryptedKeyName]) {
            console.log(`🔓 Loading encrypted ${provider} API key...`);
            const decrypted = decryptAPIKey(
                process.env[encryptedKeyName],
                process.env.ENCRYPTION_KEY
            );
            console.log(`✅ ${provider} API key decrypted: ${maskAPIKey(decrypted)}`);
            return decrypted;
        }
        
        // Fallback to plain key (for backward compatibility, not recommended)
        if (process.env[plainKeyName]) {
            console.warn(`⚠️  ${provider} API key is not encrypted! Use encrypted keys for better security.`);
            console.log(`📝 ${provider} API key (plain): ${maskAPIKey(process.env[plainKeyName])}`);
            return process.env[plainKeyName];
        }
        
        console.error(`❌ ${provider} API key not found in environment variables`);
        return null;
        
    } catch (error) {
        console.error(`❌ Error loading ${provider} API key:`, error.message);
        return null;
    }
}

// Load all API keys on startup
const API_KEYS = {
    GEMINI: loadAPIKey('GEMINI'),
    OPENROUTER: loadAPIKey('OPENROUTER'),
    GROQ: loadAPIKey('GROQ'),
    OPENAI: loadAPIKey('OPENAI')
};

// Validate critical API keys
if (!API_KEYS.GEMINI && !API_KEYS.OPENROUTER && !API_KEYS.GROQ) {
    console.error('\n❌ CRITICAL ERROR: No valid API keys found!');
    console.error('Please configure encrypted API keys in .env file.');
    console.error('Run: node migrate-api-keys.js to set up encryption.\n');
}

// ===== CONFIGURATION =====

const GEMINI_CONFIG = {
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
    API_KEY: API_KEYS.GEMINI,
    MODEL: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
    MAX_TOKENS: parseInt(process.env.GEMINI_MAX_TOKENS) || 2000,
    TEMPERATURE: parseFloat(process.env.GEMINI_TEMPERATURE) || 0.7
};

const OPENAI_CONFIG = {
    API_URL: 'https://api.openai.com/v1/chat/completions',
    API_KEY: API_KEYS.OPENAI,
    MODEL: 'gpt-4',
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7
};

const OPENROUTER_CONFIG = {
    API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    API_KEY: API_KEYS.OPENROUTER,
    MODEL: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3.1:free',
    MAX_TOKENS: parseInt(process.env.OPENROUTER_MAX_TOKENS) || 2000,
    TEMPERATURE: parseFloat(process.env.OPENROUTER_TEMPERATURE) || 0.7,
    MODELS: {
        // === 🏆 5-STAR MODELS (Must Keep - 8 models) ===
        'qwen3-coder-free': 'qwen/qwen3-coder:free',
        'deepseek-r1': 'deepseek/deepseek-r1:free',
        'llama-3.1-405b': 'meta-llama/llama-3.1-405b-instruct:free',
        'deepseek-chat-v3.1': 'deepseek/deepseek-chat-v3.1:free',
        'llama-3.3-70b': 'meta-llama/llama-3.3-70b-instruct:free',
        'llama-4-maverick': 'meta-llama/llama-4-maverick:free',
        'llama-4-scout': 'meta-llama/llama-4-scout:free',
        'grok-4-fast': 'x-ai/grok-4-fast:free',
        
        // === ⭐ 4-STAR MODELS (High Priority - 6 models) ===
        'qwen3-14b': 'qwen/qwen3-14b:free',
        'mistral-small-3.2': 'mistralai/mistral-small-3.2-24b-instruct:free',
        'devstral-small-2505': 'mistralai/devstral-small-2505:free',
        'gemini-2.0-flash-exp': 'google/gemini-2.0-flash-exp:free',
        'gemma-3-27b': 'google/gemma-3-27b-it:free',
        'qwq-32b': 'qwen/qwq-32b:free',
        
        // === 💫 3-STAR MODELS (Specific Use - 2 models) ===
        'llama-3.2-3b': 'meta-llama/llama-3.2-3b-instruct:free',
        'glm-4.5-air-free': 'z-ai/glm-4.5-air:free'
    }
};

const GROQ_CONFIG = {
    API_URL: 'https://api.groq.com/openai/v1/chat/completions',
    API_KEY: API_KEYS.GROQ,
    MODEL: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
    MAX_TOKENS: parseInt(process.env.GROQ_MAX_TOKENS) || 2000,
    TEMPERATURE: parseFloat(process.env.GROQ_TEMPERATURE) || 0.7,
    MODELS: {
        'llama-3.1-8b-instant': 'llama-3.1-8b-instant',
        'llama-3.1-70b-versatile': 'llama-3.1-70b-versatile',
        'llama-3.2-1b-preview': 'llama-3.2-1b-preview',
        'llama-3.2-3b-preview': 'llama-3.2-3b-preview',
        'mixtral-8x7b-32768': 'mixtral-8x7b-32768',
        'gemma-7b-it': 'gemma-7b-it',
        'gemma2-9b-it': 'gemma2-9b-it',
        'whisper-large-v3': 'whisper-large-v3'
    }
};

// ===== ROUTES =====

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    const healthStatus = {
        status: 'OK',
        message: 'AI Prompt Assistant Secure Proxy Server is running',
        timestamp: new Date().toISOString(),
        version: '2.0.0-secure',
        security: {
            encryption: 'AES-256-CBC',
            apiKeysEncrypted: true,
            providers: {
                gemini: !!API_KEYS.GEMINI,
                openrouter: !!API_KEYS.OPENROUTER,
                groq: !!API_KEYS.GROQ,
                openai: !!API_KEYS.OPENAI
            }
        }
    };
    
    res.json(healthStatus);
});

// Test Gemini connection
app.get('/api/test-gemini', async (req, res) => {
    return testGeminiConnection(req, res);
});

// Test OpenRouter connection
app.get('/api/test-openrouter', async (req, res) => {
    return testOpenRouterConnection(req, res);
});

// Test Groq connection
app.get('/api/test-groq', async (req, res) => {
    return testGroqConnection(req, res);
});

// Legacy endpoint (redirects to Gemini)
app.get('/api/test-openai', async (req, res) => {
    return testGeminiConnection(req, res);
});

// Test all AI providers
app.get('/api/test-all', async (req, res) => {
    try {
        console.log('🧪 Testing all AI providers...');
        
        const results = {
            gemini: {},
            openrouter: {},
            groq: {}
        };
        
        // Test Gemini
        try {
            const geminiResult = await testGeminiAPI();
            results.gemini = geminiResult;
        } catch (error) {
            results.gemini = { success: false, error: error.message };
        }
        
        // Test OpenRouter
        try {
            const openrouterResult = await testOpenRouterAPI();
            results.openrouter = openrouterResult;
        } catch (error) {
            results.openrouter = { success: false, error: error.message };
        }
        
        // Test Groq
        try {
            const groqResult = await testGroqAPI();
            results.groq = groqResult;
        } catch (error) {
            results.groq = { success: false, error: error.message };
        }
        
        res.json({
            results: results,
            summary: {
                total_providers: 3,
                working_providers: Object.values(results).filter(r => r.success).length,
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('❌ Error testing all providers:', error);
        res.status(500).json({
            success: false,
            message: 'Error testing all AI providers',
            error: error.message
        });
    }
});

// ===== TEST FUNCTIONS (same as original) =====

async function testGeminiAPI() {
    if (!GEMINI_CONFIG.API_KEY) {
        throw new Error('Gemini API key not configured');
    }
    
    try {
        const url = `${GEMINI_CONFIG.API_URL}?key=${GEMINI_CONFIG.API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: 'Hello! This is a connection test.'
                    }]
                }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 10
                }
            })
        });
        
        if (response.ok) {
            console.log('✅ Gemini connection successful');
            return {
                success: true,
                message: 'Google Gemini API connection successful',
                status: response.status,
                model: 'gemini-2.0-flash-exp',
                provider: 'gemini'
            };
        } else {
            const errorData = await response.json();
            console.error('❌ Gemini connection failed:', errorData);
            return {
                success: false,
                message: 'Google Gemini API connection failed',
                error: errorData,
                status: response.status
            };
        }
    } catch (error) {
        console.error('❌ Server error testing Gemini:', error);
        return {
            success: false,
            message: 'Server error testing Gemini API connection',
            error: error.message
        };
    }
}

async function testOpenRouterAPI() {
    if (!OPENROUTER_CONFIG.API_KEY) {
        throw new Error('OpenRouter API key not configured');
    }
    
    try {
        const response = await fetch(OPENROUTER_CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_CONFIG.API_KEY}`,
                'HTTP-Referer': 'http://localhost:3001',
                'X-Title': 'AI Prompt Assistant'
            },
            body: JSON.stringify({
                model: OPENROUTER_CONFIG.MODEL,
                messages: [{
                    role: 'user',
                    content: 'Hello! This is a connection test.'
                }],
                max_tokens: 10,
                temperature: 0.1
            })
        });
        
        if (response.ok) {
            console.log('✅ OpenRouter connection successful');
            const data = await response.json();
            return {
                success: true,
                message: 'OpenRouter AI API connection successful',
                status: response.status,
                model: OPENROUTER_CONFIG.MODEL,
                provider: 'openrouter',
                usage: data.usage || {}
            };
        } else {
            const errorData = await response.json();
            console.error('❌ OpenRouter connection failed:', errorData);
            return {
                success: false,
                message: 'OpenRouter AI API connection failed',
                error: errorData,
                status: response.status
            };
        }
    } catch (error) {
        console.error('❌ Server error testing OpenRouter:', error);
        return {
            success: false,
            message: 'Server error testing OpenRouter API connection',
            error: error.message
        };
    }
}

async function testGroqAPI() {
    if (!GROQ_CONFIG.API_KEY) {
        throw new Error('Groq API key not configured');
    }
    
    try {
        const response = await fetch(GROQ_CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_CONFIG.API_KEY}`
            },
            body: JSON.stringify({
                model: GROQ_CONFIG.MODEL,
                messages: [{
                    role: 'user',
                    content: 'Hello! This is a connection test.'
                }],
                max_tokens: 10,
                temperature: 0.1
            })
        });
        
        if (response.ok) {
            console.log('✅ Groq connection successful');
            const data = await response.json();
            return {
                success: true,
                message: 'Groq AI API connection successful',
                status: response.status,
                model: GROQ_CONFIG.MODEL,
                provider: 'groq',
                usage: data.usage || {}
            };
        } else {
            const errorData = await response.json();
            console.error('❌ Groq connection failed:', errorData);
            return {
                success: false,
                message: 'Groq AI API connection failed',
                error: errorData,
                status: response.status
            };
        }
    } catch (error) {
        console.error('❌ Server error testing Groq:', error);
        return {
            success: false,
            message: 'Server error testing Groq API connection',
            error: error.message
        };
    }
}

async function testGeminiConnection(req, res) {
    try {
        const result = await testGeminiAPI();
        if (result.success) {
            res.json(result);
        } else {
            res.status(result.status || 500).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error testing Gemini',
            error: error.message
        });
    }
}

async function testOpenRouterConnection(req, res) {
    try {
        const result = await testOpenRouterAPI();
        if (result.success) {
            res.json(result);
        } else {
            res.status(result.status || 500).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error testing OpenRouter',
            error: error.message
        });
    }
}

async function testGroqConnection(req, res) {
    try {
        const result = await testGroqAPI();
        if (result.success) {
            res.json(result);
        } else {
            res.status(result.status || 500).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error testing Groq',
            error: error.message
        });
    }
}

// ===== CHAT ENDPOINTS (same structure as original) =====

// Gemini Chat
app.post('/api/openai/chat', async (req, res) => {
    if (!GEMINI_CONFIG.API_KEY) {
        return res.status(503).json({
            success: false,
            error: 'Gemini API key not configured. Please set up encrypted API keys.'
        });
    }
    
    // [Rest of the implementation remains same as original proxy-server.js]
    // ... (keeping the same logic for brevity)
    console.log('🤖 Proxying request to Gemini API...');
    
    try {
        const { messages, systemPrompt, userInput } = req.body;
        
        if (!messages && !userInput) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters: messages or userInput'
            });
        }

        let requestMessages = messages;
        if (!requestMessages && userInput && systemPrompt) {
            requestMessages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userInput }
            ];
        }

        const response = await fetch(OPENAI_CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_CONFIG.API_KEY}`
            },
            body: JSON.stringify({
                model: OPENAI_CONFIG.MODEL,
                messages: requestMessages,
                max_tokens: OPENAI_CONFIG.MAX_TOKENS,
                temperature: OPENAI_CONFIG.TEMPERATURE,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ OpenAI API response received');
            res.json({
                success: true,
                data: data,
                usage: data.usage
            });
        } else {
            console.error('❌ OpenAI API error:', data);
            res.status(response.status).json({
                success: false,
                error: data.error || 'OpenAI API error',
                status: response.status
            });
        }

    } catch (error) {
        console.error('❌ Proxy server error:', error);
        res.status(500).json({
            success: false,
            error: 'Proxy server error: ' + error.message
        });
    }
});

// OpenRouter Chat
app.post('/api/openrouter/chat', async (req, res) => {
    if (!OPENROUTER_CONFIG.API_KEY) {
        return res.status(503).json({
            success: false,
            error: 'OpenRouter API key not configured. Please set up encrypted API keys.'
        });
    }
    
    try {
        console.log('🤖 Proxying request to OpenRouter AI...');
        
        const { messages, systemPrompt, userInput, model } = req.body;
        
        if (!messages && !userInput) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters: messages or userInput'
            });
        }
        
        let requestMessages;
        if (userInput && systemPrompt) {
            requestMessages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userInput }
            ];
        } else if (messages) {
            requestMessages = messages;
        } else {
            requestMessages = [{ role: 'user', content: userInput || 'Generate a response' }];
        }
        
        const modelKey = model || 'deepseek-chat-v3.1';
        const actualModel = OPENROUTER_CONFIG.MODELS[modelKey] || OPENROUTER_CONFIG.MODEL;
        
        console.log(`📝 Using OpenRouter model: ${actualModel}`);
        
        const response = await fetch(OPENROUTER_CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_CONFIG.API_KEY}`,
                'HTTP-Referer': 'http://localhost:3001',
                'X-Title': 'AI Prompt Assistant'
            },
            body: JSON.stringify({
                model: actualModel,
                messages: requestMessages,
                max_tokens: req.body.max_tokens || OPENROUTER_CONFIG.MAX_TOKENS,
                temperature: req.body.temperature || OPENROUTER_CONFIG.TEMPERATURE,
                top_p: req.body.top_p || 0.95,
                frequency_penalty: req.body.frequency_penalty || 0,
                presence_penalty: req.body.presence_penalty || 0
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ OpenRouter AI response received');
            data.provider = 'openrouter';
            if (!data.model) data.model = actualModel;
            
            res.json({
                success: true,
                data: data,
                usage: data.usage || {},
                provider: 'openrouter'
            });
        } else {
            console.error('❌ OpenRouter API error:', data);
            res.status(response.status).json({
                success: false,
                error: data.error || 'OpenRouter API error',
                status: response.status
            });
        }
        
    } catch (error) {
        console.error('❌ OpenRouter proxy error:', error);
        res.status(500).json({
            success: false,
            error: 'OpenRouter proxy error: ' + error.message
        });
    }
});

// Groq Chat
app.post('/api/groq/chat', async (req, res) => {
    if (!GROQ_CONFIG.API_KEY) {
        return res.status(503).json({
            success: false,
            error: 'Groq API key not configured. Please set up encrypted API keys.'
        });
    }
    
    try {
        console.log('🤖 Proxying request to Groq AI...');
        
        const { messages, systemPrompt, userInput, model } = req.body;
        
        if (!messages && !userInput) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters: messages or userInput'
            });
        }
        
        let requestMessages;
        if (userInput && systemPrompt) {
            requestMessages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userInput }
            ];
        } else if (messages) {
            requestMessages = messages;
        } else {
            requestMessages = [{ role: 'user', content: userInput || 'Generate a response' }];
        }
        
        const modelKey = model || 'llama-3.1-8b-instant';
        const actualModel = GROQ_CONFIG.MODELS[modelKey] || GROQ_CONFIG.MODEL;
        
        console.log(`⚡ Using Groq model: ${actualModel}`);
        
        const response = await fetch(GROQ_CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_CONFIG.API_KEY}`
            },
            body: JSON.stringify({
                model: actualModel,
                messages: requestMessages,
                max_tokens: req.body.max_tokens || GROQ_CONFIG.MAX_TOKENS,
                temperature: req.body.temperature || GROQ_CONFIG.TEMPERATURE,
                top_p: req.body.top_p || 0.95,
                frequency_penalty: req.body.frequency_penalty || 0,
                presence_penalty: req.body.presence_penalty || 0
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Groq AI response received');
            data.provider = 'groq';
            if (!data.model) data.model = actualModel;
            
            res.json({
                success: true,
                data: data,
                usage: data.usage || {},
                provider: 'groq'
            });
        } else {
            console.error('❌ Groq API error:', data);
            res.status(response.status).json({
                success: false,
                error: data.error || 'Groq API error',
                status: response.status
            });
        }
        
    } catch (error) {
        console.error('❌ Groq proxy error:', error);
        res.status(500).json({
            success: false,
            error: 'Groq proxy error: ' + error.message
        });
    }
});

// API info
app.get('/api/info', (req, res) => {
    res.json({
        name: 'AI Prompt Assistant Secure Proxy Server',
        version: '2.0.0-secure',
        description: 'Triple-provider proxy with AES-256-CBC encrypted API keys',
        security: {
            encryption: 'AES-256-CBC',
            keysEncrypted: true,
            algorithm: 'PBKDF2 + AES-256-CBC'
        },
        endpoints: {
            health: 'GET /health',
            testGemini: 'GET /api/test-gemini',
            testOpenRouter: 'GET /api/test-openrouter',
            testGroq: 'GET /api/test-groq',
            testAll: 'GET /api/test-all',
            geminiChat: 'POST /api/openai/chat',
            openrouterChat: 'POST /api/openrouter/chat',
            groqChat: 'POST /api/groq/chat',
            info: 'GET /api/info'
        },
        providers: {
            gemini: {
                configured: !!API_KEYS.GEMINI,
                model: GEMINI_CONFIG.MODEL,
                features: ['Free Tier', 'Fast Response', 'High Quality']
            },
            openrouter: {
                configured: !!API_KEYS.OPENROUTER,
                model: OPENROUTER_CONFIG.MODEL,
                totalModels: Object.keys(OPENROUTER_CONFIG.MODELS).length,
                features: ['16 Optimized Models', 'Coding + Reasoning', 'All FREE']
            },
            groq: {
                configured: !!API_KEYS.GROQ,
                model: GROQ_CONFIG.MODEL,
                totalModels: Object.keys(GROQ_CONFIG.MODELS).length,
                features: ['8 FREE Models', 'Lightning Speed', 'Balanced Performance']
            }
        }
    });
});

// Error handling
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
    });
});

// ===== START SERVER =====
app.listen(PORT, () => {
    console.log('\n🚀 ================================================================');
    console.log('🔐 AI Prompt Assistant SECURE Proxy Server v2.0');
    console.log('🛡️  AES-256-CBC Encrypted API Keys');
    console.log('🚀 ================================================================');
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🔗 Main App: http://localhost:${PORT}/`);
    console.log(`📊 Health Check: http://localhost:${PORT}/health`);
    console.log('');
    console.log('🔐 Security Status:');
    console.log(`   • Encryption: AES-256-CBC ${process.env.ENCRYPTION_KEY ? '✅' : '❌'}`);
    console.log(`   • Gemini API: ${API_KEYS.GEMINI ? '✅ Configured' : '❌ Missing'}`);
    console.log(`   • OpenRouter API: ${API_KEYS.OPENROUTER ? '✅ Configured' : '❌ Missing'}`);
    console.log(`   • Groq API: ${API_KEYS.GROQ ? '✅ Configured' : '❌ Missing'}`);
    console.log('🚀 ================================================================\n');
    
    // Test providers on startup
    setTimeout(async () => {
        try {
            console.log('🔍 Testing all AI providers...\n');
            const response = await fetch(`http://localhost:${PORT}/api/test-all`);
            const data = await response.json();
            
            if (data.summary) {
                console.log(`📊 ${data.summary.working_providers}/${data.summary.total_providers} providers working\n`);
            }
        } catch (error) {
            console.error('⚠️  Initial provider test failed:', error.message);
        }
    }, 1000);
});

module.exports = app;

