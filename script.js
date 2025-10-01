/**
 * AI Prompt Assistant - Advanced JavaScript Logic
 * Tạo bởi Claude Sonnet 4 với khả năng suy nghĩ như Claude 4.1 Opus
 * Chức năng: Mở rộng câu hỏi đơn giản thành prompt hoàn chỉnh với AI thinking
 */

// ===== GLOBAL STATE & CONFIG =====
const APP_STATE = {
    isGenerating: false,
    currentCategory: 'auto',
    history: [],
    examples: [],
    thinkingSteps: []
};

const CONFIG = {
    MAX_HISTORY: 50,
    THINKING_DELAY: 800,
    TYPING_SPEED: 50,
    LOCAL_STORAGE_KEY: 'ai_prompt_assistant',
    VERSION: '2.0.0',
    
    // AI Provider Configuration
    AI_PROVIDERS: {
        openrouter: {
            name: 'OpenRouter AI',
            displayName: 'OpenRouter (Free Models Only)',
            endpoint: '/api/openrouter/chat',
            testEndpoint: '/api/test-openrouter',
            models: {
                // === 🏆 5-STAR MODELS (Must Keep - 8 models) ===
                'qwen3-coder-free': 'Qwen3 Coder 480B (5⭐) 💻 Best Coding',
                'deepseek-r1': 'DeepSeek R1 (5⭐) 🧠 Best Reasoning',
                'llama-3.1-405b': 'Llama 3.1 405B (5⭐) 🧠 Massive Reasoning',
                'deepseek-chat-v3.1': 'DeepSeek Chat V3.1 (5⭐) 📝 Best Chat',
                'llama-3.3-70b': 'Llama 3.3 70B (5⭐) 📝 Excellent Chat',
                'llama-4-maverick': 'Llama 4 Maverick (5⭐) ⚡ Speed + Quality',
                'llama-4-scout': 'Llama 4 Scout (5⭐) ⚡ Speed + Quality',
                'grok-4-fast': 'xAI Grok 4 Fast (5⭐) 🚀 Ultra Speed + Intelligence',
                
                // === ⭐ 4-STAR MODELS (High Priority - 6 models) ===
                'qwen3-14b': 'Qwen3 14B (4⭐) 🎯 Well Balanced',
                'mistral-small-3.2': 'Mistral Small 3.2 (4⭐) 🎯 Balanced',
                'devstral-small-2505': 'Devstral Small 2505 (4⭐) 💻 Coding Expert',
                'gemini-2.0-flash-exp': 'Gemini 2.0 Flash (4⭐) ⚡ Google Fast',
                'gemma-3-27b': 'Gemma 3 27B (4⭐) 🌟 Google Quality',
                'qwq-32b': 'QwQ 32B (4⭐) 🧠 Smart Reasoning',
                
                // === 💫 3-STAR MODELS (Specific Use - 2 models) ===
                'llama-3.2-3b': 'Llama 3.2 3B (3⭐) 🚀 Lightweight & Fast',
                'glm-4.5-air-free': 'Z.AI GLM 4.5 Air (3⭐) 🌏 Multilingual'
            },
            defaultModel: 'deepseek-chat-v3.1',
            features: ['16 Optimized Models', '💻 Coding Experts', '🧠 Reasoning Masters', '⚡ Speed + Quality', '📝 Chat Specialists'],
            icon: '🚀',
            color: '#0066cc'
        },
        gemini: {
            name: 'Google Gemini',
            displayName: 'Google Gemini 2.0 Flash',
            endpoint: '/api/openai/chat', // Legacy endpoint
            testEndpoint: '/api/test-openai',
            models: {
                'gemini-2.0-flash-exp': 'Gemini 2.0 Flash (Experimental)',
                'gemini-2.5-pro': 'Gemini 2.5 Pro (Latest)',
                'gemini-2.5-flash': 'Gemini 2.5 Flash (Latest)',
                'gemini-2.0-flash-thinking-exp': 'Gemini 2.0 Flash Thinking',
                'gemini-1.5-pro-latest': 'Gemini 1.5 Pro Latest'
            },
            defaultModel: 'gemini-2.0-flash-exp',
            features: ['Free Tier', 'Fast Response', 'Google AI'],
            icon: '⚡',
            color: '#4285f4'
        },
        groq: {
            name: 'Groq AI',
            displayName: 'Groq AI (Lightning Fast - FREE Only)',
            endpoint: '/api/groq/chat',
            testEndpoint: '/api/test-groq',
            models: {
                'llama-3.1-8b-instant': 'Llama 3.1 8B Instant (4⭐) ⚡ Speed + Quality',
                'llama-3.1-70b-versatile': 'Llama 3.1 70B Versatile (4⭐)',
                'llama-3.2-1b-preview': 'Llama 3.2 1B Preview (2⭐)',
                'llama-3.2-3b-preview': 'Llama 3.2 3B Preview (3⭐)',
                'mixtral-8x7b-32768': 'Mixtral 8x7B MoE (4⭐) 🎯 Balanced',
                'gemma-7b-it': 'Gemma 7B Instruct (3⭐)',
                'gemma2-9b-it': 'Gemma 2 9B Instruct (3⭐)',
                'whisper-large-v3': 'Whisper Large V3 Speech (4⭐)'
            },
            defaultModel: 'llama-3.1-8b-instant',
            features: ['8 FREE Models', '⚡ Lightning Speed', '🎯 Balanced Performance', '🔊 Audio Support'],
            icon: '⚡',
            color: '#f39800'
        }
    },
    
    // Default AI Provider
    DEFAULT_PROVIDER: 'openrouter',
    CURRENT_PROVIDER: 'openrouter',
    CURRENT_MODEL: 'gpt-4o-mini',
    
    // Legacy config removed - now using AI_PROVIDERS configuration
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7,
    
    // Proxy Server Configuration (để bypass CORS)
    PROXY_SERVER_URL: 'http://localhost:3001',
    USE_PROXY: true,
    
    // Environment Detection
    isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    isFileProtocol: window.location.protocol === 'file:',
    isServerMode: false
};

// ===== OPTIMIZED AI PROMPT TEMPLATES & LOGIC =====
const PROMPT_TEMPLATES = {
    universal: {
        name: "Universal AI Assistant",
        icon: "🤖",
        systemPrompt: `Bạn là AI expert mở rộng prompt. Phân tích yêu cầu user và tạo prompt hoàn chỉnh với: Role & Context, Task chi tiết, Requirements cụ thể, Output format. Tập trung vào actionable results, ngắn gọn nhưng đầy đủ để code sản phẩm hoàn thiện.`
    }
};

// Category mapping for backward compatibility
const CATEGORY_MAPPING = {
    auto: 'universal',
    code: 'universal', 
    creative: 'universal',
    business: 'universal',
    analysis: 'universal',
    education: 'universal',
    research: 'universal'
};

        // Smart category detection patterns
        const SMART_DETECTION = {
            code: /\b(code|coding|lập trình|api|function|hàm|app|ứng dụng|website|web|javascript|python|react|vue|node|backend|frontend|database|sql|program|software|development)\b/i,
            creative: /\b(content|nội dung|viết|write|blog|social media|marketing|sáng tạo|creative|thiết kế|design|brand|thương hiệu|advertising|campaign)\b/i,
            business: /\b(business|kinh doanh|doanh nghiệp|công ty|startup|strategy|chiến lược|market|thị trường|customer|khách hàng|profit|lợi nhuận|revenue|sales)\b/i,
            analysis: /\b(data|dữ liệu|phân tích|analysis|chart|biểu đồ|statistics|thống kê|report|báo cáo|insights|xu hướng|trend|research|nghiên cứu)\b/i,
            education: /\b(học|dạy|giáo dục|education|course|khóa học|tutorial|hướng dẫn|student|sinh viên|teacher|giáo viên|training|đào tạo)\b/i,
            research: /\b(research|nghiên cứu|study|literature|tài liệu|paper|bài báo|academic|học thuật|science|khoa học|thesis|luận văn)\b/i
        };

        // Smart fallback model selection for rate-limited scenarios
        const FALLBACK_MODELS = {
            openrouter: [
                'deepseek-chat-v3.1',      // 5⭐ Best Chat - Primary fallback
                'grok-4-fast',             // 5⭐ Ultra Speed + Intelligence - Secondary fallback
                'deepseek-r1',             // 5⭐ Best Reasoning - Tertiary fallback  
                'llama-3.3-70b',           // 5⭐ Excellent Chat - Quaternary fallback
                'qwen3-14b',               // 4⭐ Well Balanced - Quinary fallback
                'mistral-small-3.2',       // 4⭐ Balanced - Final fallback
            ],
            gemini: ['gemini-flash-2.0'],
            groq: ['llama-3.1-70b-versatile', 'mixtral-8x7b-32768', 'llama-3.1-8b-instant']
        };

        // Smart rate limit handler with automatic fallback
        async function handleRateLimitedRequest(provider, originalModel, requestData) {
            const fallbacks = FALLBACK_MODELS[provider] || [];
            const providerConfig = CONFIG.AI_PROVIDERS[provider];
            const proxyUrl = `${CONFIG.PROXY_SERVER_URL}${providerConfig.endpoint}`;
            
            for (const fallbackModel of fallbacks) {
                if (fallbackModel === originalModel) continue; // Skip the original failed model
                
                console.log(`🔄 Rate limit detected, trying fallback model: ${fallbackModel}`);
                showToast(`🔄 Trying ${fallbackModel}...`, 'info', 2000);
                
                try {
                    const fallbackData = { ...requestData, model: fallbackModel };
                    const response = await fetch(proxyUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(fallbackData)
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data.success && data.data.choices && data.data.choices[0]) {
                            console.log(`✅ Fallback successful with ${fallbackModel}`);
                            showToast(`✅ Success with ${fallbackModel}!`, 'success', 3000);
                            return data.data.choices[0].message.content.trim();
                        }
                    }
                } catch (error) {
                    console.warn(`⚠️ Fallback model ${fallbackModel} also failed:`, error);
                    continue; // Try next fallback
                }
            }
            
            throw new Error(`All fallback models failed for provider: ${provider}. Please try again later or switch to a different AI provider.`);
        }

// ===== OPENAI API INTEGRATION =====

/**
 * Gọi AI API để tạo prompt expansion (supports multiple providers)
 * @param {string} userInput - Input từ người dùng  
 * @param {object} template - Template category được chọn
 * @param {string} provider - AI provider ('openrouter' hoặc 'gemini')
 * @param {string} model - Model name (optional)
 * @returns {Promise<string>} - Expanded prompt từ AI
 */
async function callAIAPI(userInput, template, provider = null, model = null, isRetry = false) {
    try {
        // Use current provider if not specified
        provider = provider || CONFIG.CURRENT_PROVIDER;
        model = model || CONFIG.CURRENT_MODEL;
        
        const providerConfig = CONFIG.AI_PROVIDERS[provider];
        if (!providerConfig) {
            throw new Error(`Unknown provider: ${provider}`);
        }
        
        const systemPrompt = template.systemPrompt || PROMPT_TEMPLATES.auto.systemPrompt;
        
        console.log(`🤖 Calling ${providerConfig.displayName} (${model})...`);
        showToast(`Đang kết nối với ${providerConfig.displayName}...`, 'info', 2000);
        
        // Always use proxy server for CORS bypass
        const response = await callAIViaProxy(userInput, systemPrompt, provider, model);
        
        console.log(`✅ Đã nhận response từ ${providerConfig.displayName}`);
        showToast(`Đã tạo prompt với ${providerConfig.displayName}!`, 'success', 2000);
        
        return response;
        
    } catch (error) {
        console.error(`❌ ${provider} AI API Error:`, error);
        
        // Handle payment errors specifically for OpenRouter
        if (error.message && error.message.includes('402') && provider === 'openrouter') {
            console.log('💰 Detected payment error - trying free model first...');
            
            // Try with a free model first
            if (!isModelFree(provider, model)) {
                showPaymentWarning(provider, model);
                const freeModel = 'qwen3-8b'; // Default free model
                try {
                    return await callAIAPI(userInput, template, provider, freeModel, true);
                } catch (freeModelError) {
                    console.log('Free model also failed, falling back to other providers...');
                }
            }
        }
        
        // Prevent infinite loop by only allowing one fallback attempt
        if (!isRetry) {
            // Smart fallback: try providers in order of preference
            const fallbackOrder = {
                'openrouter': ['groq', 'gemini'],
                'groq': ['openrouter', 'gemini'], 
                'gemini': ['groq', 'openrouter']
            };
            
            const fallbackProviders = fallbackOrder[provider] || [];
            
            for (const fallbackProvider of fallbackProviders) {
                if (CONFIG.AI_PROVIDERS[fallbackProvider]) {
                    console.log(`🔄 Trying fallback to ${CONFIG.AI_PROVIDERS[fallbackProvider].displayName}...`);
                    showToast(`${CONFIG.AI_PROVIDERS[provider].displayName} failed, trying ${CONFIG.AI_PROVIDERS[fallbackProvider].displayName}...`, 'warning', 3000);
                    
                    const fallbackModel = CONFIG.AI_PROVIDERS[fallbackProvider].defaultModel;
                    return await callAIAPI(userInput, template, fallbackProvider, fallbackModel, true);
                }
            }
        }
        
        // Final fallback to simulation
        console.log('🔄 All providers failed, fallback to simulation mode...');
        showToast('Lỗi kết nối AI. Đang sử dụng chế độ demo...', 'warning');
        
        return await simulateAIExpansionFallback(userInput, template);
    }
}

// Backwards compatibility - removed unused function

/**
 * Gọi AI API thông qua proxy server (supports multiple providers)
 * @param {string} userInput - Input từ người dùng
 * @param {string} systemPrompt - System prompt
 * @param {string} provider - AI provider
 * @param {string} model - Model name
 * @returns {Promise<string>} - AI response
 */
async function callAIViaProxy(userInput, systemPrompt, provider, model) {
    const providerConfig = CONFIG.AI_PROVIDERS[provider];
    const proxyUrl = `${CONFIG.PROXY_SERVER_URL}${providerConfig.endpoint}`;
    
    const requestBody = {
        systemPrompt: systemPrompt,
        userInput: `Yêu cầu của người dùng: "${userInput}"\n\nHãy tạo một prompt hoàn chỉnh, chi tiết và chuyên nghiệp dựa trên yêu cầu này.`,
        provider: provider
    };
    
    // Add model for OpenRouter and Groq
    if ((provider === 'openrouter' || provider === 'groq') && model) {
        requestBody.model = model;
    }
    
    try {
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            
            // Check for rate limit errors (429 or rate-related messages)
            const isRateLimit = response.status === 429 || 
                              (errorData.error && typeof errorData.error === 'string' && 
                               /rate.?limit|temporarily|quota|too many requests/i.test(errorData.error)) ||
                              (errorData.error && errorData.error.message && 
                               /rate.?limit|temporarily|quota|too many requests/i.test(errorData.error.message));
            
            if (isRateLimit && provider === 'openrouter' && FALLBACK_MODELS[provider]) {
                console.warn(`⚠️ Rate limit detected for model: ${model}. Trying fallbacks...`);
                showToast(`⚠️ Model ${model} busy, trying fallback...`, 'warning', 3000);
                
                // Try fallback models
                return await handleRateLimitedRequest(provider, model, requestBody);
            }
            
            throw new Error(`${providerConfig.name} Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
        }

        const data = await response.json();
        
        if (!data.success || !data.data.choices || !data.data.choices[0]) {
            throw new Error(`Invalid response from ${providerConfig.name}`);
        }

        return data.data.choices[0].message.content.trim();
        
    } catch (error) {
        // If it's a rate limit handler error, re-throw it
        if (error.message.includes('All fallback models failed')) {
            throw error;
        }
        
        // For other errors, also check if it's rate-limit related
        const errorMsg = error.message.toLowerCase();
        if ((errorMsg.includes('rate') || errorMsg.includes('limit') || errorMsg.includes('temporarily')) && 
            provider === 'openrouter' && FALLBACK_MODELS[provider]) {
            
            console.warn(`⚠️ Rate limit error detected: ${error.message}. Trying fallbacks...`);
            showToast(`⚠️ Model busy, trying fallback...`, 'warning', 3000);
            
            return await handleRateLimitedRequest(provider, model, requestBody);
        }
        
        throw error;
    }
}

// Legacy function for backwards compatibility
async function callOpenAIViaProxy(userInput, systemPrompt) {
    return await callAIViaProxy(userInput, systemPrompt, CONFIG.CURRENT_PROVIDER, CONFIG.CURRENT_MODEL);
}

// Removed unused callOpenAIDirectly function - was never called anywhere

/**
 * Xác định có nên sử dụng proxy server không
 * @returns {Promise<boolean>}
 */
async function shouldUseProxyServer() {
    // Nếu đang chạy từ file:// thì bắt buộc phải dùng proxy
    if (CONFIG.isFileProtocol) {
        return true;
    }
    
    // Nếu config bắt buộc dùng proxy
    if (CONFIG.USE_PROXY) {
        // Kiểm tra proxy server có hoạt động không
        try {
            const response = await fetch(`${CONFIG.PROXY_SERVER_URL}/health`, { 
                method: 'GET',
                timeout: 2000 
            });
            return response.ok;
        } catch (error) {
            console.warn('⚠️ Proxy server không hoạt động, chuyển sang gọi trực tiếp:', error.message);
            return false;
        }
    }
    
    return false;
}

/**
 * Fallback function when OpenAI API fails
 * @param {string} input - User input
 * @param {object} template - Template object  
 * @returns {Promise<string>} - Simulated expanded prompt
 */
async function simulateAIExpansionFallback(input, template) {
    // Delay để giống như đang gọi API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const category = detectCategory(input);
    
    return `
# ${generateCompactPromptTitle(input, category)}

## 🎯 ROLE & TASK
${generateCompactRole(category)} với nhiệm vụ: ${input}

## ⚙️ REQUIREMENTS
${generateCompactRequirements(category)}

## 📋 OUTPUT FORMAT
${generateCompactOutput(category)}

## ✅ SUCCESS CRITERIA
${generateCompactCriteria(category)}

---
*⚠️ Demo Mode - Prompt được tạo bởi AI Prompt Assistant v${CONFIG.VERSION}*
    `.trim();
}

// ===== COMPACT OUTPUT HELPER FUNCTIONS =====
function generateCompactPromptTitle(input, category) {
    const categoryNames = {
        code: 'Coding Project',
        creative: 'Creative Project', 
        business: 'Business Strategy',
        analysis: 'Data Analysis',
        education: 'Educational Content',
        research: 'Research Project',
        universal: 'Professional Task'
    };
    return categoryNames[category] || 'Professional Task';
}

function generateCompactRole(category) {
    const roles = {
        code: 'Senior Full-Stack Developer với 10+ năm kinh nghiệm',
        creative: 'Creative Director với expertise brand & content strategy',
        business: 'Business Consultant với MBA và enterprise experience',
        analysis: 'Data Scientist với advanced analytics expertise',
        education: 'Educational Designer với instructional design background',
        research: 'Research Director với academic và industry experience',
        universal: 'AI Expert với multi-domain expertise'
    };
    return roles[category] || roles.universal;
}

function generateCompactRequirements(category) {
    const requirements = {
        code: '- Production-ready code với best practices\n- Error handling và security considerations\n- Comprehensive testing và documentation\n- Scalable architecture và performance optimization',
        creative: '- Brand-aligned content với clear messaging\n- Target audience engagement strategies\n- Visual/content guidelines và style consistency\n- Measurable impact với performance metrics',
        business: '- Data-driven strategy với market analysis\n- Financial projections và ROI calculations\n- Risk assessment với mitigation plans\n- Implementation roadmap với clear milestones',
        analysis: '- Statistical rigor với validated methodologies\n- Clear data visualizations và insights\n- Actionable recommendations với business impact\n- Reproducible analysis với documented processes',
        education: '- Clear learning objectives với measurable outcomes\n- Engaging content với multiple learning styles\n- Progressive difficulty với skill building\n- Assessment methods với feedback mechanisms',
        research: '- Academic rigor với peer-reviewed standards\n- Comprehensive literature review\n- Valid methodology với ethical considerations\n- Publication-ready findings với clear contributions',
        universal: '- Professional quality với industry standards\n- Clear deliverables với measurable outcomes\n- Actionable results với implementation guidance\n- Complete documentation với best practices'
    };
    return requirements[category] || requirements.universal;
}

function generateCompactOutput(category) {
    const outputs = {
        code: '**Deliverables:**\n- Source code với documentation\n- Setup instructions và deployment guide\n- Test suite với coverage report\n- Architecture diagram và technical specs',
        creative: '**Deliverables:**\n- Content package với multiple formats\n- Brand guidelines và style guide\n- Campaign strategy với timeline\n- Performance metrics và optimization plan',
        business: '**Deliverables:**\n- Executive summary với key recommendations\n- Detailed analysis với supporting data\n- Implementation plan với resource requirements\n- Financial projections với scenario analysis',
        analysis: '**Deliverables:**\n- Analysis report với key insights\n- Data visualizations và interactive dashboards\n- Methodology documentation\n- Recommendations với action items',
        education: '**Deliverables:**\n- Course structure với learning modules\n- Content materials với multimedia resources\n- Assessment tools với grading rubrics\n- Progress tracking và feedback systems',
        research: '**Deliverables:**\n- Research paper với findings\n- Data package với analysis scripts\n- Literature review với citations\n- Presentation materials với key takeaways',
        universal: '**Deliverables:**\n- Complete solution với implementation guide\n- Documentation với best practices\n- Quality assurance với testing procedures\n- Success metrics với evaluation criteria'
    };
    return outputs[category] || outputs.universal;
}

function generateCompactCriteria(category) {
    return `- ✅ **Completeness**: Covers tất cả aspects của requirements
- ✅ **Quality**: Professional standard với attention to detail  
- ✅ **Actionability**: Specific, implementable với clear next steps
- ✅ **Impact**: Measurable outcomes với business value`;
}

/**
 * Test connection tới AI provider
 * @param {string} provider - Provider name ('openrouter' hoặc 'gemini')
 * @returns {Promise<boolean>} - True nếu connection thành công
 */
async function testAIConnection(provider = null) {
    provider = provider || CONFIG.CURRENT_PROVIDER;
    
    try {
        const providerConfig = CONFIG.AI_PROVIDERS[provider];
        if (!providerConfig) {
            console.error(`Unknown provider: ${provider}`);
            return false;
        }
        
        console.log(`🧪 Testing ${providerConfig.displayName} connection...`);
        
        const testUrl = `${CONFIG.PROXY_SERVER_URL}${providerConfig.testEndpoint}`;
        const response = await fetch(testUrl);
        const data = await response.json();
        
        return data.success;
        
    } catch (error) {
        console.error(`🔴 ${provider} Connection Test Failed:`, error);
        return false;
    }
}

/**
 * Test all available AI providers
 * @returns {Promise<Object>} - Results for all providers
 */
async function testAllAIConnections() {
    try {
        console.log('🧪 Testing all AI providers...');
        
        const testUrl = `${CONFIG.PROXY_SERVER_URL}/api/test-all`;
        const response = await fetch(testUrl);
        const data = await response.json();
        
        return data.results;
        
    } catch (error) {
        console.error('🔴 All AI Connection Test Failed:', error);
        return {};
    }
}

// Legacy function for backwards compatibility
async function testOpenAIConnection() {
    return await testAIConnection(CONFIG.CURRENT_PROVIDER);
}

// ===== OPTIMIZED THINKING PROCESS (3 STEPS) =====
const THINKING_PATTERNS = {
    analyze: "🔍 Phân tích ngữ cảnh, mục đích và requirements của yêu cầu...",
    structure: "🏗️ Thiết kế cấu trúc prompt với role, task, requirements và output format...",
    optimize: "✨ Tối ưu clarity, actionability và completeness cho sản phẩm hoàn thiện..."
};

// Streamlined thinking flow
const COMPACT_THINKING_FLOW = [
    THINKING_PATTERNS.analyze,
    THINKING_PATTERNS.structure, 
    THINKING_PATTERNS.optimize
];

// ===== EXAMPLE PROMPTS DATABASE =====
const EXAMPLE_PROMPTS = [
    {
        category: 'code',
        icon: '💻',
        title: 'Tạo API REST',
        description: 'Thiết kế và implement RESTful API với authentication',
        simple: 'Tôi muốn tạo một API cho ứng dụng blog',
        preview: 'API endpoints, authentication, CRUD operations...'
    },
    {
        category: 'creative',
        icon: '🎨', 
        title: 'Content Marketing',
        description: 'Tạo chiến lược content cho social media',
        simple: 'Tôi cần viết content cho fanpage bán quần áo',
        preview: 'Brand voice, target audience, content calendar...'
    },
    {
        category: 'business',
        icon: '💼',
        title: 'Business Plan',
        description: 'Phân tích thị trường và lập kế hoạch kinh doanh',
        simple: 'Tôi muốn mở quán cafe ở Hà Nội',
        preview: 'Market analysis, financial projections, strategy...'
    },
    {
        category: 'analysis',
        icon: '📊',
        title: 'Data Analysis',
        description: 'Phân tích dữ liệu bán hàng và xu hướng',
        simple: 'Phân tích dữ liệu bán hàng của cửa hàng',
        preview: 'Statistical analysis, visualizations, insights...'
    },
    {
        category: 'education',
        icon: '📚',
        title: 'Khóa học Online',
        description: 'Thiết kế curriculum cho khóa học trực tuyến',
        simple: 'Tạo khóa học dạy JavaScript cho người mới',
        preview: 'Learning objectives, modules, assessments...'
    },
    {
        category: 'research',
        icon: '🔬',
        title: 'Literature Review',
        description: 'Tổng quan tài liệu nghiên cứu về AI',
        simple: 'Nghiên cứu về ứng dụng AI trong giáo dục',
        preview: 'Research questions, methodology, sources...'
    }
];

// ===== DOM ELEMENTS =====
let elements = {};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    initializeElements();
    initializeEventListeners(); 
    initializeUISelections(); // Initialize provider/model dropdowns
    loadExamples();
    loadHistory();
    initializeTooltips();
    
    // Test AI providers connection
    await initializeAIStatus();
    
    console.log('🚀 AI Prompt Assistant v2.0 initialized successfully!');
    showToast('Chào mừng bạn đến với AI Prompt Assistant v2.0!', 'info');
});

/**
 * Kiểm tra và hiển thị trạng thái AI providers khi khởi động
 */
async function initializeAIStatus() {
    console.log('🔍 Đang test kết nối tất cả AI providers...');
    showToast('Đang kiểm tra kết nối AI providers...', 'info', 3000);
    
    const allResults = await testAllAIConnections();
    let workingProviders = [];
    let failedProviders = [];
    
    // Check each provider
    for (const [providerName, result] of Object.entries(allResults)) {
        const displayName = CONFIG.AI_PROVIDERS[providerName]?.displayName || providerName;
        if (result.success) {
            workingProviders.push(displayName);
        } else {
            failedProviders.push(`${displayName} (${providerName})`);
            console.error(`❌ ${displayName} connection failed:`, result.error);
        }
    }
    
    // Update status based on results
    if (workingProviders.length > 0) {
        console.log(`✅ Kết nối thành công: ${workingProviders.join(', ')}`);
        showToast(`🤖 Sẵn sàng với ${workingProviders.length} AI provider(s)!`, 'success', 4000);
        
        // Set working provider as current if current one failed
        if (failedProviders.includes(CONFIG.AI_PROVIDERS[CONFIG.CURRENT_PROVIDER]?.displayName)) {
            const firstWorkingProvider = Object.keys(allResults).find(p => allResults[p].success);
            if (firstWorkingProvider) {
                switchAIProvider(firstWorkingProvider);
            }
        }
    } else {
        console.error('❌ Tất cả AI providers đều lỗi');
        showToast('⚠️ Lỗi kết nối AI - sử dụng chế độ demo', 'error', 5000);
    }
    
    if (failedProviders.length > 0) {
        console.warn(`⚠️ Providers lỗi: ${failedProviders.join(', ')}`);
    }
}

// Removed unused initializeOpenAIStatus function

function initializeElements() {
    elements = {
        // Input elements
        simpleInput: document.getElementById('simpleInput'),
        categorySelect: document.getElementById('categorySelect'), 
        providerSelect: document.getElementById('providerSelect'),
        modelSelect: document.getElementById('modelSelect'),
        generateBtn: document.getElementById('generateBtn'),
        
        // Results elements
        resultsSection: document.getElementById('resultsSection'),
        thinkingProcess: document.getElementById('thinkingProcess'),
        thinkingSteps: document.getElementById('thinkingSteps'),
        promptResult: document.getElementById('promptResult'),
        resultContent: document.getElementById('resultContent'),
        resultStats: document.getElementById('resultStats'),
        
        // Action buttons
        copyBtn: document.getElementById('copyBtn'),
        saveBtn: document.getElementById('saveBtn'), 
        shareBtn: document.getElementById('shareBtn'),
        
        // Navigation
        navBtns: document.querySelectorAll('.nav-btn'),
        
        // Examples & History
        examplesGrid: document.getElementById('examplesGrid'),
        historySection: document.getElementById('historySection'),
        historyList: document.getElementById('historyList'),
        clearHistoryBtn: document.getElementById('clearHistoryBtn'),
        
        // UI elements
        toastContainer: document.getElementById('toastContainer'),
        // loadingOverlay removed - using in-result loading
    };
}

function initializeEventListeners() {
    // Input events
    elements.simpleInput.addEventListener('input', handleInputChange);
    elements.simpleInput.addEventListener('keydown', handleKeyDown);
    elements.categorySelect.addEventListener('change', handleCategoryChange);
    elements.providerSelect.addEventListener('change', handleProviderChange);
    elements.modelSelect.addEventListener('change', handleModelChange);
    elements.generateBtn.addEventListener('click', handleGenerate);
    
    // Action button events  
    elements.copyBtn.addEventListener('click', handleCopy);
    elements.saveBtn.addEventListener('click', handleSave);
    elements.shareBtn.addEventListener('click', handleShare);
    
    // Navigation events
    elements.navBtns.forEach(btn => {
        btn.addEventListener('click', () => handleNavigation(btn.dataset.category));
    });
    
    // History events
    elements.clearHistoryBtn.addEventListener('click', handleClearHistory);
    
    // Global events
    document.addEventListener('click', handleGlobalClick);
    window.addEventListener('beforeunload', handleBeforeUnload);
}

// ===== INPUT HANDLING =====
function handleInputChange() {
    const value = elements.simpleInput.value.trim();
    elements.generateBtn.disabled = !value || APP_STATE.isGenerating;
    
    // Auto-categorize based on input
    if (elements.categorySelect.value === 'auto') {
        const detectedCategory = detectCategory(value);
        if (detectedCategory !== 'auto') {
            updateCategoryIndicator(detectedCategory);
        }
    }
}

function handleKeyDown(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        if (!elements.generateBtn.disabled) {
            handleGenerate();
        }
    }
}

function handleCategoryChange() {
    APP_STATE.currentCategory = elements.categorySelect.value;
    filterExamples(APP_STATE.currentCategory);
}

function handleProviderChange() {
    const selectedProvider = elements.providerSelect.value;
    
    // Switch AI provider
    const success = switchAIProvider(selectedProvider);
    
    if (success) {
        // Update model dropdown with available models for this provider
        updateModelDropdown(selectedProvider);
        
        // Update current model to default for this provider
        const providerConfig = CONFIG.AI_PROVIDERS[selectedProvider];
        CONFIG.CURRENT_MODEL = providerConfig.defaultModel;
        elements.modelSelect.value = CONFIG.CURRENT_MODEL;
        
        console.log(`🔄 Provider switched to: ${providerConfig.displayName}`);
    }
}

function handleModelChange() {
    const selectedModel = elements.modelSelect.value;
    CONFIG.CURRENT_MODEL = selectedModel;
    
    const providerConfig = CONFIG.AI_PROVIDERS[CONFIG.CURRENT_PROVIDER];
    const modelName = providerConfig.models[selectedModel] || selectedModel;
    
    console.log(`🎯 Model changed to: ${modelName}`);
    showToast(`Model: ${modelName}`, 'info', 1500);
}

// ===== CORE AI LOGIC =====
async function handleGenerate() {
    if (APP_STATE.isGenerating) return;
    
    const input = elements.simpleInput.value.trim();
    if (!input) {
        showToast('Vui lòng nhập câu hỏi hoặc yêu cầu của bạn', 'warning');
        return;
    }
    
    try {
        APP_STATE.isGenerating = true;
        setLoadingState(true);
        
        // Step 1: Show thinking process
        updateProgressStep(1, 'active');
        updateLoadingMessage('🧠 Đang phân tích yêu cầu của bạn...');
        await showThinkingProcess(input);
        await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause for UX
        
        // Step 2: Generate expanded prompt
        updateProgressStep(2, 'active');
        updateLoadingMessage('🤖 Đang kết nối với AI để tạo prompt...');
        const expandedPrompt = await generateExpandedPrompt(input);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Step 3: Display results
        updateProgressStep(3, 'active');
        updateLoadingMessage('✨ Đang hoàn thiện và hiển thị kết quả...');
        await displayResults(expandedPrompt, input);
        
        // Step 4: Save to history (no UI update needed)
        saveToHistory(input, expandedPrompt);
        
    } catch (error) {
        console.error('Error generating prompt:', error);
        showToast('Có lỗi xảy ra khi tạo prompt. Vui lòng thử lại!', 'error');
    } finally {
        APP_STATE.isGenerating = false;
        setLoadingState(false);
        
        // Mark all steps as completed when finished
        setTimeout(() => {
            updateProgressStep(3, 'completed');
            updateLoadingMessage('✅ Hoàn thành!');
        }, 100);
    }
}

async function showThinkingProcess(input) {
    elements.resultsSection.style.display = 'block';
    elements.thinkingProcess.style.display = 'block';
    elements.promptResult.style.display = 'none';
    
    elements.resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Clear previous steps
    elements.thinkingSteps.innerHTML = '';
    APP_STATE.thinkingSteps = [];
    
    // Generate thinking steps based on input
    const thinkingFlow = generateThinkingFlow(input);
    
    for (let i = 0; i < thinkingFlow.length; i++) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.THINKING_DELAY));
        await addThinkingStep(thinkingFlow[i], i + 1);
    }
    
    // Final pause before showing result
    await new Promise(resolve => setTimeout(resolve, CONFIG.THINKING_DELAY * 1.5));
}

function generateThinkingFlow(input) {
    // Simple 3-step thinking process
    return COMPACT_THINKING_FLOW;
}

async function addThinkingStep(stepText, stepNumber) {
    const stepElement = document.createElement('div');
    stepElement.className = 'thinking-step active';
    stepElement.innerHTML = `
        <div class="thinking-step-icon">${stepNumber}</div>
        <div class="thinking-step-content">
            <h4>Bước ${stepNumber}</h4>
            <p>${stepText}</p>
        </div>
    `;
    
    elements.thinkingSteps.appendChild(stepElement);
    APP_STATE.thinkingSteps.push({ step: stepNumber, text: stepText });
    
    // Scroll to new step
    stepElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    
    // Remove active class from previous steps
    setTimeout(() => {
        const previousSteps = elements.thinkingSteps.querySelectorAll('.thinking-step');
        previousSteps.forEach((step, index) => {
            if (index < stepNumber - 1) {
                step.classList.remove('active');
            }
        });
    }, CONFIG.THINKING_DELAY / 2);
}

function detectCategory(input) {
    // Use smart detection patterns
    for (const [category, regex] of Object.entries(SMART_DETECTION)) {
        if (regex.test(input)) {
            return category;
        }
    }
    return 'universal';
}

async function generateExpandedPrompt(input) {
    const category = elements.categorySelect.value === 'auto' ? detectCategory(input) : elements.categorySelect.value;
    const mappedCategory = CATEGORY_MAPPING[category] || 'universal';
    const template = PROMPT_TEMPLATES[mappedCategory] || PROMPT_TEMPLATES.universal;
    
    // Validate API key trước khi gọi
    const isApiKeyValid = validateAPIKey();
    let expandedPrompt;
    
    if (isApiKeyValid) {
        const providerConfig = CONFIG.AI_PROVIDERS[CONFIG.CURRENT_PROVIDER];
        console.log(`🤖 Gọi ${providerConfig.displayName} để tạo prompt...`);
        showToast(`Đang kết nối với ${providerConfig.displayName}...`, 'info', 2000);
        
        // Gọi AI API thật
        expandedPrompt = await callAIAPI(input, template);
        
        console.log(`✅ Đã nhận response từ ${providerConfig.displayName}`);
        showToast(`Đã tạo prompt với ${providerConfig.displayName}!`, 'success', 2000);
    } else {
        console.log('⚠️ API key không hợp lệ, sử dụng chế độ demo...');
        showToast('Sử dụng chế độ demo (không có API key hợp lệ)', 'warning');
        
        // Fallback to simulation
    await new Promise(resolve => setTimeout(resolve, 1000));
        expandedPrompt = await simulateAIExpansionFallback(input, template);
    }
    
    return {
        original: input,
        category: category,
        expanded: expandedPrompt,
        template: template,
        timestamp: new Date(),
        wordCount: expandedPrompt.split(' ').length,
        estimatedTime: Math.ceil(expandedPrompt.split(' ').length / 200), // Reading time in minutes
        isRealAI: isApiKeyValid,
        apiUsed: isApiKeyValid ? CONFIG.AI_PROVIDERS[CONFIG.CURRENT_PROVIDER].displayName : 'Demo Mode',
        provider: isApiKeyValid ? CONFIG.CURRENT_PROVIDER : 'demo',
        model: isApiKeyValid ? CONFIG.CURRENT_MODEL : 'simulation'
    };
}

// Removed old simulateAIExpansion function - using compact version

function getAIRoleForCategory(template) {
    const roles = {
        code: "Senior Full-Stack Developer với 10+ năm kinh nghiệm trong việc xây dựng ứng dụng enterprise-grade",
        creative: "Creative Director với chuyên môn về brand strategy, content marketing và digital storytelling", 
        business: "Senior Business Consultant với MBA và kinh nghiệm tư vấn cho 500+ doanh nghiệp",
        analysis: "Lead Data Scientist với PhD và expertise trong advanced analytics và machine learning",
        education: "Educational Technology Specialist với M.Ed và kinh nghiệm thiết kế curriculum",
        research: "Research Director với PhD và track record publish 50+ papers trong journals uy tín",
        auto: "AI Assistant đa năng với khả năng phân tích và tư duy logic cao"
    };
    
    return roles[template.name.toLowerCase()] || roles.auto;
}

// Removed old generateDetailedTask function - using compact helpers

// Removed old generateSpecificRequirements function - using compact helpers

// Removed old generateOutputFormat function - using compact helpers

// Removed old generateQualityCriteria function - using compact helpers

// Removed old generateAdditionalGuidelines function - using compact helpers

async function displayResults(promptData, originalInput) {
    // Hide thinking process
    elements.thinkingProcess.style.display = 'none';
    elements.promptResult.style.display = 'block';
    
    // Animate content appearance
    elements.resultContent.innerHTML = '';
    await typewriterEffect(elements.resultContent, promptData.expanded);
    
    // Update stats
    updateResultStats(promptData);
    
    // Show result actions
    elements.resultContent.scrollIntoView({ behavior: 'smooth' });
}

async function typewriterEffect(element, text) {
    element.textContent = '';
    
    for (let i = 0; i < text.length; i++) {
        element.textContent += text[i];
        
        // Skip typing delay for whitespace to speed up
        if (text[i] !== ' ') {
            await new Promise(resolve => setTimeout(resolve, Math.random() * 20 + 5));
        }
        
        // Scroll to bottom periodically
        if (i % 100 === 0) {
            element.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }
}

function updateResultStats(promptData) {
    const stats = [
        { icon: 'fas fa-words', label: 'Từ', value: promptData.wordCount },
        { icon: 'fas fa-clock', label: 'Thời gian đọc', value: `${promptData.estimatedTime} phút` },
        { icon: 'fas fa-tag', label: 'Loại', value: PROMPT_TEMPLATES[promptData.category]?.name || 'Tự động' },
        { 
            icon: promptData.isRealAI ? CONFIG.AI_PROVIDERS[promptData.provider]?.icon + ' fas fa-robot' || 'fas fa-robot' : 'fas fa-play-circle', 
            label: 'AI Provider', 
            value: promptData.apiUsed || 'Demo Mode',
            class: promptData.isRealAI ? 'stat-success' : 'stat-warning'
        },
        { icon: 'fas fa-calendar', label: 'Tạo lúc', value: new Date().toLocaleTimeString('vi-VN') }
    ];
    
    elements.resultStats.innerHTML = stats.map(stat => `
        <div class="stat-item ${stat.class || ''}">
            <i class="${stat.icon}"></i>
            <span>${stat.label}: <strong>${stat.value}</strong></span>
        </div>
    `).join('');
}

// ===== ACTION HANDLERS =====
async function handleCopy() {
    try {
        const content = elements.resultContent.textContent;
        await navigator.clipboard.writeText(content);
        showToast('Đã sao chép prompt vào clipboard!', 'success');
        
        // Visual feedback
        elements.copyBtn.innerHTML = '<i class="fas fa-check"></i> Đã sao chép';
        setTimeout(() => {
            elements.copyBtn.innerHTML = '<i class="fas fa-copy"></i> Sao chép';
        }, 2000);
        
    } catch (error) {
        console.error('Copy failed:', error);
        showToast('Không thể sao chép. Vui lòng thử lại!', 'error');
    }
}

function handleSave() {
    const content = elements.resultContent.textContent;
    const originalInput = elements.simpleInput.value.trim();
    
    if (!content) {
        showToast('Không có nội dung để lưu', 'warning');
        return;
    }
    
    // Save to browser storage
    const savedPrompts = JSON.parse(localStorage.getItem('saved_prompts') || '[]');
    const newPrompt = {
        id: Date.now(),
        original: originalInput,
        expanded: content,
        category: APP_STATE.currentCategory,
        timestamp: new Date().toISOString(),
        title: generateTitleFromInput(originalInput)
    };
    
    savedPrompts.unshift(newPrompt);
    
    // Keep only latest 100 saved prompts
    if (savedPrompts.length > 100) {
        savedPrompts.splice(100);
    }
    
    localStorage.setItem('saved_prompts', JSON.stringify(savedPrompts));
    showToast('Đã lưu prompt thành công!', 'success');
    
    // Visual feedback
    elements.saveBtn.innerHTML = '<i class="fas fa-check"></i> Đã lưu';
    setTimeout(() => {
        elements.saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Lưu';
    }, 2000);
}

function handleShare() {
    const content = elements.resultContent.textContent;
    const originalInput = elements.simpleInput.value.trim();
    
    if (navigator.share) {
        // Native sharing API
        navigator.share({
            title: 'AI Prompt Assistant - Prompt được tạo',
            text: `Prompt gốc: ${originalInput}\n\nPrompt mở rộng:\n${content}`,
            url: window.location.href
        }).then(() => {
            showToast('Đã chia sẻ thành công!', 'success');
        }).catch(error => {
            console.error('Share failed:', error);
            handleFallbackShare(originalInput, content);
        });
    } else {
        handleFallbackShare(originalInput, content);
    }
}

function handleFallbackShare(originalInput, content) {
    // Fallback: Copy share text to clipboard
    const shareText = `🤖 AI Prompt Assistant\n\n📝 Yêu cầu: ${originalInput}\n\n✨ Prompt hoàn chỉnh:\n${content}\n\n🔗 Tạo prompt của bạn tại: ${window.location.href}`;
    
    navigator.clipboard.writeText(shareText).then(() => {
        showToast('Đã sao chép link chia sẻ vào clipboard!', 'info');
    }).catch(() => {
        showToast('Không thể chia sẻ. Vui lòng thử lại!', 'error');
    });
}

// ===== EXAMPLES & NAVIGATION =====
function loadExamples() {
    elements.examplesGrid.innerHTML = EXAMPLE_PROMPTS.map(example => createExampleCard(example)).join('');
    
    // Add click handlers
    document.querySelectorAll('.example-card').forEach(card => {
        card.addEventListener('click', () => {
            const example = EXAMPLE_PROMPTS[parseInt(card.dataset.index)];
            handleExampleClick(example);
        });
    });
}

function createExampleCard(example, index) {
    const categoryNames = {
        code: 'Lập trình',
        creative: 'Sáng tạo', 
        business: 'Kinh doanh',
        analysis: 'Phân tích',
        education: 'Giáo dục',
        research: 'Nghiên cứu'
    };
    
    return `
        <div class="example-card" data-index="${EXAMPLE_PROMPTS.indexOf(example)}" data-category="${example.category}">
            <div class="example-header">
                <div class="example-icon">${example.icon}</div>
                <div>
                    <div class="example-title">${example.title}</div>
                    <div class="example-category">${categoryNames[example.category] || example.category}</div>
                </div>
            </div>
            <div class="example-description">${example.description}</div>
            <div class="example-preview">"${example.simple}"</div>
        </div>
    `;
}

function handleExampleClick(example) {
    elements.simpleInput.value = example.simple;
    elements.categorySelect.value = example.category;
    APP_STATE.currentCategory = example.category;
    
    handleInputChange();
    
    // Scroll to input
    elements.simpleInput.scrollIntoView({ behavior: 'smooth' });
    elements.simpleInput.focus();
    
    showToast(`Đã load ví dụ: ${example.title}`, 'info');
}

function handleNavigation(category) {
    // Update active nav button
    elements.navBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    
    // Filter examples
    filterExamples(category);
    
    // Update category select if auto
    if (category !== 'all') {
        elements.categorySelect.value = category;
        APP_STATE.currentCategory = category;
    }
}

function filterExamples(category) {
    const examples = document.querySelectorAll('.example-card');
    examples.forEach(card => {
        const shouldShow = category === 'all' || card.dataset.category === category;
        card.style.display = shouldShow ? 'block' : 'none';
    });
}

// ===== HISTORY MANAGEMENT =====
function loadHistory() {
    APP_STATE.history = JSON.parse(localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY) || '[]');
    updateHistoryDisplay();
}

function saveToHistory(originalInput, expandedPrompt) {
    const historyItem = {
        id: Date.now(),
        original: originalInput,
        expanded: expandedPrompt.expanded,
        category: expandedPrompt.category,
        timestamp: expandedPrompt.timestamp,
        title: generateTitleFromInput(originalInput)
    };
    
    APP_STATE.history.unshift(historyItem);
    
    // Keep only latest items
    if (APP_STATE.history.length > CONFIG.MAX_HISTORY) {
        APP_STATE.history.splice(CONFIG.MAX_HISTORY);
    }
    
    // Save to localStorage
    localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY, JSON.stringify(APP_STATE.history));
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    if (APP_STATE.history.length === 0) {
        elements.historySection.style.display = 'none';
        return;
    }
    
    elements.historySection.style.display = 'block';
    elements.historyList.innerHTML = APP_STATE.history.slice(0, 10).map(item => createHistoryItem(item)).join('');
    
    // Add click handlers
    document.querySelectorAll('.history-item').forEach(item => {
        const reloadBtn = item.querySelector('.reload-btn');
        const deleteBtn = item.querySelector('.delete-btn');
        
        if (reloadBtn) {
            reloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const itemId = parseInt(item.dataset.id);
                handleHistoryReload(itemId);
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const itemId = parseInt(item.dataset.id);
                handleHistoryDelete(itemId);
            });
        }
    });
}

function createHistoryItem(item) {
    const date = new Date(item.timestamp);
    const timeAgo = getTimeAgo(date);
    
    return `
        <div class="history-item" data-id="${item.id}">
            <div class="history-item-header">
                <div class="history-item-title">${item.title}</div>
                <div class="history-item-date">${timeAgo}</div>
            </div>
            <div class="history-item-content">${item.original}</div>
            <div class="history-item-actions">
                <button class="action-btn reload-btn" title="Load lại prompt này">
                    <i class="fas fa-redo"></i>
                    Load lại
                </button>
                <button class="action-btn delete-btn" title="Xóa khỏi lịch sử">
                    <i class="fas fa-trash"></i>
                    Xóa
                </button>
            </div>
        </div>
    `;
}

function handleHistoryReload(itemId) {
    const item = APP_STATE.history.find(h => h.id === itemId);
    if (!item) return;
    
    elements.simpleInput.value = item.original;
    elements.categorySelect.value = item.category || 'auto';
    APP_STATE.currentCategory = item.category || 'auto';
    
    handleInputChange();
    elements.simpleInput.scrollIntoView({ behavior: 'smooth' });
    elements.simpleInput.focus();
    
    showToast('Đã load lại prompt từ lịch sử', 'success');
}

function handleHistoryDelete(itemId) {
    APP_STATE.history = APP_STATE.history.filter(h => h.id !== itemId);
    localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY, JSON.stringify(APP_STATE.history));
    updateHistoryDisplay();
    showToast('Đã xóa khỏi lịch sử', 'success');
}

function handleClearHistory() {
    if (!confirm('Bạn có chắc muốn xóa toàn bộ lịch sử?')) {
        return;
    }
    
    APP_STATE.history = [];
    localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY, JSON.stringify([]));
    updateHistoryDisplay();
    showToast('Đã xóa toàn bộ lịch sử', 'success');
}

// ===== UTILITY FUNCTIONS =====
function generateTitleFromInput(input) {
    // Extract meaningful title from input
    const words = input.trim().split(' ').slice(0, 6);
    let title = words.join(' ');
    
    if (title.length > 50) {
        title = title.substring(0, 47) + '...';
    }
    
    return title || 'Prompt không có tiêu đề';
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
}

function setLoadingState(isLoading) {
    elements.generateBtn.classList.toggle('loading', isLoading);
    elements.generateBtn.disabled = isLoading || !elements.simpleInput.value.trim();
    
    // Instead of full-screen overlay, show loading in result area
    if (isLoading) {
        // Hide the full-screen overlay
        // loadingOverlay removed - using in-result loading instead
        
        // Show loading state in result area
        elements.resultsSection.style.display = 'block';
        elements.resultContent.innerHTML = `
            <div class="loading-in-result">
                <div class="loading-spinner-small"></div>
                <p>🤖 Đang kết nối với AI...</p>
                <div class="progress-steps">
                    <span class="step active">1. Phân tích yêu cầu</span>
                    <span class="step">2. Tạo prompt</span>
                    <span class="step">3. Hoàn thiện</span>
                </div>
            </div>
        `;
    } else {
        // Keep the overlay hidden when not loading
        // loadingOverlay removed - using in-result loading instead
    }
}

function updateProgressStep(stepNumber, status = 'active') {
    // Update progress steps during generation
    const steps = document.querySelectorAll('.progress-steps .step');
    if (steps.length > 0 && stepNumber <= steps.length) {
        // Reset all steps
        steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index < stepNumber - 1) {
                step.classList.add('completed');
            } else if (index === stepNumber - 1) {
                step.classList.add(status);
            }
        });
    }
}

function updateLoadingMessage(message) {
    // Update loading message during generation
    const loadingP = document.querySelector('.loading-in-result p');
    if (loadingP) {
        loadingP.textContent = message;
    }
}

function updateCategoryIndicator(category) {
    const mappedCategory = CATEGORY_MAPPING[category] || category;
    const template = PROMPT_TEMPLATES[mappedCategory];
    if (template) {
        const categoryNames = {
            code: 'Lập trình 💻',
            creative: 'Sáng tạo 🎨', 
            business: 'Kinh doanh 💼',
            analysis: 'Phân tích 📊',
            education: 'Giáo dục 📚',
            research: 'Nghiên cứu 🔬',
            universal: 'Universal AI 🤖'
        };
        const displayName = categoryNames[category] || 'Universal AI 🤖';
        showToast(`Đã nhận diện: ${displayName}`, 'info');
    }
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle', 
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    // Auto remove
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, duration);
    
    // Click to dismiss
    toast.addEventListener('click', () => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    });
}

// ===== GLOBAL EVENT HANDLERS =====
function handleGlobalClick(e) {
    // Close dropdowns, modals, etc.
    // This can be extended for future UI components
}

function handleBeforeUnload(e) {
    // Save any unsaved work
    if (APP_STATE.isGenerating) {
        e.preventDefault();
        e.returnValue = 'Đang tạo prompt. Bạn có chắc muốn rời khỏi trang?';
    }
}

// ===== AI PROVIDER MANAGEMENT =====
/**
 * Check if a model is free or paid
 */
function isModelFree(provider, model) {
    const providerConfig = CONFIG.AI_PROVIDERS[provider];
    if (!providerConfig || !providerConfig.models[model]) return false;
    
    const modelName = providerConfig.models[model];
    return modelName.includes('(Free)');
}

/**
 * Show payment warning for paid models
 */
function showPaymentWarning(provider, model) {
    const providerName = CONFIG.AI_PROVIDERS[provider]?.displayName || provider;
    const modelName = CONFIG.AI_PROVIDERS[provider]?.models[model] || model;
    
    showToast(
        `⚠️ ${modelName} yêu cầu thanh toán. API key ${providerName} cần có credits. Đang chuyển sang model miễn phí...`,
        'warning',
        5000
    );
}

/**
 * Switch to a different AI provider
 * @param {string} provider - Provider name
 * @param {string} model - Model name (optional)
 */
function switchAIProvider(provider, model = null) {
    if (!CONFIG.AI_PROVIDERS[provider]) {
        console.error(`Unknown provider: ${provider}`);
        return false;
    }
    
    const providerConfig = CONFIG.AI_PROVIDERS[provider];
    CONFIG.CURRENT_PROVIDER = provider;
    CONFIG.CURRENT_MODEL = model || providerConfig.defaultModel;
    
    console.log(`🔄 Switched to ${providerConfig.displayName} (${CONFIG.CURRENT_MODEL})`);
    showToast(`Chuyển sang ${providerConfig.displayName}`, 'info', 2000);
    
    // Update UI if needed
    updateProviderUI();
    
    return true;
}

/**
 * Get available models for current provider
 * @returns {Object} - Available models
 */
function getAvailableModels(provider = null) {
    provider = provider || CONFIG.CURRENT_PROVIDER;
    return CONFIG.AI_PROVIDERS[provider]?.models || {};
}

/**
 * Update model dropdown based on selected provider
 * @param {string} provider - Provider name
 */
function updateModelDropdown(provider) {
    const providerConfig = CONFIG.AI_PROVIDERS[provider];
    const models = providerConfig.models;
    
    // Clear current options
    elements.modelSelect.innerHTML = '';
    
    // Add new options based on provider
    for (const [modelKey, modelName] of Object.entries(models)) {
        const option = document.createElement('option');
        option.value = modelKey;
        option.textContent = modelName;
        elements.modelSelect.appendChild(option);
    }
    
    // If Gemini provider, disable model selection (only one model)
    if (provider === 'gemini') {
        elements.modelSelect.disabled = true;
        elements.modelSelect.title = 'Gemini chỉ có một model available';
    } else {
        elements.modelSelect.disabled = false;
        elements.modelSelect.title = 'Chọn model AI';
    }
}

/**
 * Initialize UI selections based on current config
 */
function initializeUISelections() {
    // Set provider dropdown
    elements.providerSelect.value = CONFIG.CURRENT_PROVIDER;
    
    // Update model dropdown and set current model
    updateModelDropdown(CONFIG.CURRENT_PROVIDER);
    elements.modelSelect.value = CONFIG.CURRENT_MODEL;
    
    // Update UI to reflect current provider
    updateProviderUI();
}

/**
 * Update UI to reflect current provider
 */
function updateProviderUI() {
    const providerConfig = CONFIG.AI_PROVIDERS[CONFIG.CURRENT_PROVIDER];
    
    // Update footer or status display if exists
    const footerInfo = document.querySelector('.footer-info p');
    if (footerInfo) {
        footerInfo.textContent = `© 2024 AI Prompt Assistant. Powered by ${providerConfig.displayName} ❤️`;
    }
    
    // Trigger custom event for other UI components
    document.dispatchEvent(new CustomEvent('providerChanged', {
        detail: {
            provider: CONFIG.CURRENT_PROVIDER,
            model: CONFIG.CURRENT_MODEL,
            config: providerConfig
        }
    }));
}

/**
 * Validate if API key exists (backwards compatibility)
 * @returns {boolean}
 */
function validateAPIKey() {
    // Always return true now since we handle provider switching dynamically
    return CONFIG.AI_PROVIDERS[CONFIG.CURRENT_PROVIDER] !== undefined;
}

// ===== ADDITIONAL FEATURES =====
function initializeTooltips() {
    // Add tooltips for better UX
    const tooltipElements = document.querySelectorAll('[title]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    // Custom tooltip implementation
    // This would create a more elegant tooltip than browser default
}

function hideTooltip(e) {
    // Hide custom tooltip
}

// ===== PERFORMANCE MONITORING =====
function trackPerformance(action, duration) {
    console.log(`⚡ Performance: ${action} took ${duration}ms`);
    
    // In production, this could send analytics data
    if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
            name: action,
            value: duration
        });
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showToast('Đã xảy ra lỗi. Vui lòng refresh trang và thử lại!', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showToast('Đã xảy ra lỗi khi xử lý. Vui lòng thử lại!', 'error');
});

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        APP_STATE,
        PROMPT_TEMPLATES,
        detectCategory,
        generateTitleFromInput,
        getTimeAgo
    };
}

console.log('🎯 AI Prompt Assistant v2.0 Script Loaded Successfully!');
console.log('💡 Developed by Claude Sonnet 4 with advanced thinking capabilities');
console.log(`📊 Version: ${CONFIG.VERSION}`);
console.log(`🤖 Default Provider: ${CONFIG.AI_PROVIDERS[CONFIG.DEFAULT_PROVIDER].displayName}`);
