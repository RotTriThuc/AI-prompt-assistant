/**
 * 🛡️ OpenAI API Proxy Server
 * Giải quyết CORS issue khi gọi OpenAI API từ browser
 * Tạo bởi Claude Sonnet 4 với advanced security
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 3001;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.static('./')); // Serve static files

// ===== CONFIGURATION =====
// Dual AI Provider Support: Google Gemini + OpenRouter AI + Groq AI
const GEMINI_CONFIG = {
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
    API_KEY: 'AIzaSyDAnBQKPWkJigLq_Hiy4PmqPvLkdW2AQAo',
    MODEL: 'gemini-2.0-flash-exp',
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7
};

// Legacy OpenAI config (kept for backward compatibility)
const OPENAI_CONFIG = {
    API_URL: 'https://api.openai.com/v1/chat/completions',
    API_KEY: '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',
    MODEL: 'gpt-4',
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7
};

// OpenRouter AI Configuration (Access to GPT-4, Claude, Llama, etc.)
const OPENROUTER_CONFIG = {
    API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    API_KEY: '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',
    MODEL: 'deepseek/deepseek-chat-v3.1:free',  // Default model - BEST Chat Model (5⭐)
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7,
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

// Groq AI Configuration (Super fast inference)
const GROQ_CONFIG = {
    API_URL: 'https://api.groq.com/openai/v1/chat/completions',
    API_KEY: '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',
    MODEL: 'llama-3.1-8b-instant',  // Default model - ultra fast
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7,
    MODELS: {
        // 🚀 FREE Models Only (Cleaned up - matches script.js)
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

// Root route - serve main app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'AI Prompt Assistant Proxy Server is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Test Gemini/OpenAI connection (Legacy endpoint - redirects to Gemini)
app.get('/api/test-openai', async (req, res) => {
    try {
        console.log('🔍 Testing Gemini connection (legacy endpoint)...');
        return testGeminiConnection(req, res);
    } catch (error) {
        console.error('❌ Server error testing Gemini:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error testing Gemini connection',
            error: error.message 
        });
    }
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

// ===== HELPER FUNCTIONS FOR TESTING =====

/**
 * Test Gemini API connection
 * @returns {Promise<Object>} Test result object
 */
async function testGeminiAPI() {
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

/**
 * Test OpenRouter API connection
 * @returns {Promise<Object>} Test result object
 */
async function testOpenRouterAPI() {
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

/**
 * Test Groq API connection
 * @returns {Promise<Object>} Test result object
 */
async function testGroqAPI() {
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

/**
 * Express route handler wrapper for Gemini test
 */
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

/**
 * Express route handler wrapper for OpenRouter test
 */
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

/**
 * Express route handler wrapper for Groq test
 */
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

// Proxy OpenAI API requests
app.post('/api/openai/chat', async (req, res) => {
    try {
        console.log('🤖 Proxying request to OpenAI API...');
        
        const { messages, systemPrompt, userInput } = req.body;
        
        // Validate request
        if (!messages && !userInput) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters: messages or userInput'
            });
        }

        // Build messages array
        let requestMessages = messages;
        if (!requestMessages && userInput && systemPrompt) {
            requestMessages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userInput }
            ];
        }

        // Make request to OpenAI
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

// ===== OPENROUTER CHAT ENDPOINT =====
/**
 * Proxy OpenRouter AI chat requests
 * Supports all 16 optimized free models
 */
app.post('/api/openrouter/chat', async (req, res) => {
    try {
        console.log('🤖 Proxying request to OpenRouter AI...');
        
        const { messages, systemPrompt, userInput, model } = req.body;
        
        // Validate request
        if (!messages && !userInput) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters: messages or userInput'
            });
        }
        
        // Build OpenAI-compatible messages format
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
        
        // Map model key to actual OpenRouter model ID
        const modelKey = model || 'deepseek-chat-v3.1';
        const actualModel = OPENROUTER_CONFIG.MODELS[modelKey] || OPENROUTER_CONFIG.MODEL;
        
        console.log(`📝 Using OpenRouter model: ${actualModel}`);
        
        // Make request to OpenRouter API
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
            
            // Add provider info to response
            data.provider = 'openrouter';
            if (!data.model) {
                data.model = actualModel;
            }
            
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

// ===== GROQ CHAT ENDPOINT =====
/**
 * Proxy Groq AI chat requests
 * Ultra-fast inference with 8 FREE models
 */
app.post('/api/groq/chat', async (req, res) => {
    try {
        console.log('🤖 Proxying request to Groq AI...');
        
        const { messages, systemPrompt, userInput, model } = req.body;
        
        // Validate request
        if (!messages && !userInput) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters: messages or userInput'
            });
        }
        
        // Build OpenAI-compatible messages format
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
        
        // Map model key to actual Groq model ID
        const modelKey = model || 'llama-3.1-8b-instant';
        const actualModel = GROQ_CONFIG.MODELS[modelKey] || GROQ_CONFIG.MODEL;
        
        console.log(`⚡ Using Groq model: ${actualModel}`);
        
        // Make request to Groq API
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
            
            // Add provider info to response
            data.provider = 'groq';
            if (!data.model) {
                data.model = actualModel;
            }
            
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
        name: 'AI Prompt Assistant Proxy Server',
        version: '2.0.0',
        description: 'Triple-provider proxy server: Google Gemini + OpenRouter AI + Groq AI',
        endpoints: {
            health: 'GET /health',
            testGemini: 'GET /api/test-openai',
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
                model: GEMINI_CONFIG.MODEL,
                maxTokens: GEMINI_CONFIG.MAX_TOKENS,
                temperature: GEMINI_CONFIG.TEMPERATURE,
                features: ['Free Tier', 'Fast Response', 'High Quality']
            },
            openrouter: {
                model: OPENROUTER_CONFIG.MODEL,
                maxTokens: OPENROUTER_CONFIG.MAX_TOKENS,
                temperature: OPENROUTER_CONFIG.TEMPERATURE,
                totalModels: Object.keys(OPENROUTER_CONFIG.MODELS).length,
                features: ['16 Optimized Models', '💻 Coding Experts', '🧠 Reasoning Masters', '⚡ Speed + Quality']
            },
            groq: {
                model: GROQ_CONFIG.MODEL,
                maxTokens: GROQ_CONFIG.MAX_TOKENS,
                temperature: GROQ_CONFIG.TEMPERATURE,
                totalModels: Object.keys(GROQ_CONFIG.MODELS).length,
                features: ['8 FREE Models', '⚡ Lightning Speed', '🎯 Balanced Performance']
            }
        }
    });
});

// ===== ERROR HANDLING =====
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
    console.log('\n🚀 ================================================');
    console.log('🤖 AI Prompt Assistant Proxy Server v2.0 (Node.js)');
    console.log('🎯 Triple-Provider: Gemini + OpenRouter + Groq AI');
    console.log('🚀 ================================================');
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🔗 Main App: http://localhost:${PORT}/`);
    console.log(`📊 Health Check: http://localhost:${PORT}/health`);
    console.log('');
    console.log('🧪 Test Endpoints:');
    console.log(`   • Test Gemini: http://localhost:${PORT}/api/test-openai`);
    console.log(`   • Test OpenRouter: http://localhost:${PORT}/api/test-openrouter`);
    console.log(`   • Test Groq: http://localhost:${PORT}/api/test-groq`);
    console.log(`   • Test All: http://localhost:${PORT}/api/test-all`);
    console.log('');
    console.log('💬 Chat Endpoints:');
    console.log(`   • Gemini Chat: POST /api/openai/chat`);
    console.log(`   • OpenRouter Chat: POST /api/openrouter/chat`);
    console.log(`   • Groq Chat: POST /api/groq/chat`);
    console.log('');
    console.log('📝 Other Endpoints:');
    console.log(`   • API Info: http://localhost:${PORT}/api/info`);
    console.log('');
    console.log('🎯 Provider Details:');
    console.log('   ⚡ Gemini 2.0 Flash: Free Tier, Fast Response');
    console.log('   🚀 OpenRouter AI: 16 Optimized FREE Models');
    console.log('   ⚡ Groq AI: 8 FREE Models, Lightning Speed');
    console.log('🚀 ================================================\n');
    
    // Test all AI providers connection on startup
    setTimeout(async () => {
        try {
            console.log('🔍 Testing all AI providers on startup...\n');
            
            const response = await fetch(`http://localhost:${PORT}/api/test-all`);
            const data = await response.json();
            
            if (data.summary) {
                console.log(`📊 Test Results: ${data.summary.working_providers}/${data.summary.total_providers} providers working\n`);
                
                // Show individual results
                if (data.results.gemini?.success) {
                    console.log('✅ Gemini: Connected');
                } else {
                    console.log('❌ Gemini: Failed -', data.results.gemini?.error || 'Unknown error');
                }
                
                if (data.results.openrouter?.success) {
                    console.log('✅ OpenRouter: Connected');
                } else {
                    console.log('❌ OpenRouter: Failed -', data.results.openrouter?.error || 'Unknown error');
                }
                
                if (data.results.groq?.success) {
                    console.log('✅ Groq: Connected');
                } else {
                    console.log('❌ Groq: Failed -', data.results.groq?.error || 'Unknown error');
                }
                
                console.log('\n🎉 Server ready to handle requests!\n');
            }
        } catch (error) {
            console.error('❌ Failed to test providers on startup:', error.message);
            console.log('⚠️ Server is running, but initial provider test failed.\n');
        }
    }, 1000);
});

module.exports = app;
