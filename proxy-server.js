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
const OPENAI_CONFIG = {
    API_URL: 'https://api.openai.com/v1/chat/completions',
    API_KEY: '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',
    MODEL: 'gpt-4',
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7
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

// Test OpenAI connection
app.get('/api/test-openai', async (req, res) => {
    try {
        console.log('🔍 Testing OpenAI connection...');
        
        const response = await fetch(OPENAI_CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_CONFIG.API_KEY}`
            },
            body: JSON.stringify({
                model: OPENAI_CONFIG.MODEL,
                messages: [{ role: 'user', content: 'test' }],
                max_tokens: 5
            })
        });

        if (response.ok) {
            console.log('✅ OpenAI connection successful');
            res.json({ 
                success: true, 
                message: 'OpenAI API connection successful',
                status: response.status 
            });
        } else {
            const errorData = await response.json();
            console.error('❌ OpenAI connection failed:', errorData);
            res.status(response.status).json({ 
                success: false, 
                message: 'OpenAI API connection failed',
                error: errorData,
                status: response.status 
            });
        }
    } catch (error) {
        console.error('❌ Server error testing OpenAI:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error testing OpenAI connection',
            error: error.message 
        });
    }
});

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

// API info
app.get('/api/info', (req, res) => {
    res.json({
        name: 'AI Prompt Assistant Proxy Server',
        version: '1.0.0',
        description: 'Proxy server to bypass CORS for OpenAI API calls',
        endpoints: {
            health: 'GET /health',
            testOpenAI: 'GET /api/test-openai', 
            chatProxy: 'POST /api/openai/chat',
            info: 'GET /api/info'
        },
        openaiConfig: {
            model: OPENAI_CONFIG.MODEL,
            maxTokens: OPENAI_CONFIG.MAX_TOKENS,
            temperature: OPENAI_CONFIG.TEMPERATURE
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
    console.log('\n🚀 =================================');
    console.log('🤖 AI Prompt Assistant Proxy Server');
    console.log('🚀 =================================');
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🔗 Main App: http://localhost:${PORT}/`);
    console.log(`📊 Health Check: http://localhost:${PORT}/health`);
    console.log(`🧪 Test OpenAI: http://localhost:${PORT}/api/test-openai`);
    console.log(`📝 API Info: http://localhost:${PORT}/api/info`);
    console.log('🚀 =================================\n');
    
    // Test OpenAI connection on startup
    setTimeout(async () => {
        try {
            const response = await fetch(`http://localhost:${PORT}/api/test-openai`);
            const data = await response.json();
            
            if (data.success) {
                console.log('✅ OpenAI connection verified on startup!');
            } else {
                console.warn('⚠️ OpenAI connection issue:', data.message);
            }
        } catch (error) {
            console.error('❌ Failed to test OpenAI on startup:', error.message);
        }
    }, 1000);
});

module.exports = app;
