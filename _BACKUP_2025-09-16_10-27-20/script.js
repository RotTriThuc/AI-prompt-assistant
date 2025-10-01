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
                // === QWEN MODELS ===
                'qwen3-8b': 'Qwen3 8B (4⭐)',
                'qwen3-14b': 'Qwen3 14B (4⭐) 🎯 Balanced',
                'qwen3-4b': 'Qwen3 4B (3⭐)',
                'qwen3-30b-a3b': 'Qwen3 30B A3B (4⭐)',
                'qwen3-235b-a22b': 'Qwen3 235B A22B (5⭐)',
                'qwen3-coder-free': 'Qwen3 Coder 480B (5⭐) 💻 Coding',
                'qwen2.5-72b-instruct': 'Qwen2.5 72B Instruct (4⭐)',
                'qwen2.5-coder-32b': 'Qwen2.5 Coder 32B (4⭐) 💻 Coding',
                'qwen2.5-vl-32b': 'Qwen2.5 VL 32B (4⭐)',
                'qwen2.5-vl-72b': 'Qwen2.5 VL 72B (4⭐)',
                'qwq-32b': 'QwQ 32B Reasoning (4⭐) 🧠 Reasoning',
                
                // === LLAMA MODELS ===
                'llama-3.1-405b': 'Llama 3.1 405B Instruct (5⭐) 🧠 Reasoning',
                'llama-3.2-3b': 'Llama 3.2 3B Instruct (3⭐)',
                'llama-3.3-8b': 'Llama 3.3 8B Instruct (4⭐)',
                'llama-3.3-70b': 'Llama 3.3 70B Instruct (5⭐) 📝 General Chat',
                'llama-4-maverick': 'Llama 4 Maverick (5⭐) ⚡ Speed + Quality',
                'llama-4-scout': 'Llama 4 Scout (5⭐) ⚡ Speed + Quality',
                
                // === MISTRAL MODELS ===
                'mistral-7b-instruct': 'Mistral 7B Instruct (3⭐)',
                'mistral-nemo': 'Mistral Nemo (3⭐)',
                'mistral-small-3.1': 'Mistral Small 3.1 24B (4⭐)',
                'mistral-small-3.2': 'Mistral Small 3.2 24B (4⭐) 🎯 Balanced',
                'mistral-small-2501': 'Mistral Small 2501 (4⭐)',
                'devstral-small-2505': 'Devstral Small 2505 (4⭐) 💻 Coding',
                
                // === DEEPSEEK MODELS ===
                'deepseek-chat-v3.1': 'DeepSeek Chat V3.1 (5⭐) 📝 General Chat',
                'deepseek-chat-v3-0324': 'DeepSeek Chat V3 0324 (4⭐)',
                'deepseek-r1': 'DeepSeek R1 (5⭐) 🧠 Reasoning',
                'deepseek-r1-0528': 'DeepSeek R1 0528 (5⭐) 🧠 Reasoning',
                'deepseek-r1-0528-qwen3': 'DeepSeek R1 0528 Qwen3 (4⭐) 🧠 Reasoning',
                'deepseek-r1-distill-llama': 'DeepSeek R1 Distill Llama 70B (4⭐) 🧠 Reasoning',
                
                // === GOOGLE MODELS ===
                'gemini-2.0-flash-exp': 'Gemini 2.0 Flash Experimental (4⭐)',
                'gemma-2-9b': 'Gemma 2 9B (3⭐)',
                'gemma-3-4b': 'Gemma 3 4B (3⭐)',
                'gemma-3-12b': 'Gemma 3 12B (4⭐)',
                'gemma-3-27b': 'Gemma 3 27B (4⭐)',
                'gemma-3n-2b': 'Gemma 3n 2B (2⭐)',
                'gemma-3n-4b': 'Gemma 3n 4B (3⭐)',
                
                // === NVIDIA MODELS ===
                'nvidia-nemotron-nano': 'NVIDIA Nemotron Nano 9B (3⭐)',
                
                // === OPENAI OSS MODELS ===
                'gpt-oss-120b': 'GPT-OSS 120B (4⭐)',
                'gpt-oss-20b': 'GPT-OSS 20B (3⭐)',
                
                // === Z.AI / GLM MODELS ===
                'glm-4.5-air-free': 'Z.AI GLM 4.5 Air (4⭐) 📝 General Chat',
                
                // === SPECIALIZED MODELS ===
                'microsoft-mai-ds-r1': 'Microsoft MAI DS R1 (4⭐)',
                'kimi-k2': 'Kimi K2 (3⭐)',
                'kimi-dev-72b': 'Kimi Dev 72B (4⭐)',
                'kimi-vl-a3b': 'Kimi VL A3B Thinking (3⭐)',
                'deephermes-3-llama': 'DeepHermes 3 Llama 3 8B (3⭐)',
                'reka-flash-3': 'Reka Flash 3 (3⭐)',
                'shisa-v2-llama': 'Shisa V2 Llama 3.3 70B (4⭐)',
                'hunyuan-a13b': 'Tencent Hunyuan A13B (3⭐)',
                'deepcoder-14b': 'Agentica Deepcoder 14B (3⭐) 💻 Coding',
                'qwq-32b-arliai': 'ArliAI QwQ 32B RpR (4⭐) 🧠 Reasoning',
                'dolphin3-mistral-24b': 'Dolphin3.0 Mistral 24B (3⭐)',
                'dolphin3-r1-mistral': 'Dolphin3.0 R1 Mistral 24B (4⭐) 🧠 Reasoning',
                'dolphin-venice-edition': 'Dolphin Venice Uncensored (3⭐)',
                'deepseek-r1t-chimera': 'DeepSeek R1T Chimera (4⭐) 🧠 Reasoning',
                'deepseek-r1t2-chimera': 'DeepSeek R1T2 Chimera (4⭐) 🧠 Reasoning'
            },
            defaultModel: 'qwen3-coder-free',
            features: ['56 Models + Specialties', '💻 Coding Experts', '🧠 Reasoning Masters', '⚡ Speed + Quality', '📝 Chat Specialists'],
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
            displayName: 'Groq AI (Lightning Fast)',
            endpoint: '/api/groq/chat',
            testEndpoint: '/api/test-groq',
            models: {
                'llama-3.1-8b-instant': 'Llama 3.1 8B Instant (4⭐) ⚡ Speed + Quality',
                'llama-3.1-70b-versatile': 'Llama 3.1 70B Versatile (4⭐)',
                'llama-3.1-405b-reasoning': 'Llama 3.1 405B Reasoning (5⭐) 🧠 Reasoning',
                'llama-3.2-1b-preview': 'Llama 3.2 1B Preview (2⭐)',
                'llama-3.2-3b-preview': 'Llama 3.2 3B Preview (3⭐)',
                'llama-3.2-11b-vision-preview': 'Llama 3.2 11B Vision (3⭐)',
                'llama-3.2-90b-vision-preview': 'Llama 3.2 90B Vision (4⭐)',
                'mixtral-8x7b-32768': 'Mixtral 8x7B MoE (4⭐) 🎯 Balanced',
                'gemma-7b-it': 'Gemma 7B Instruct (3⭐)',
                'gemma2-9b-it': 'Gemma 2 9B Instruct (3⭐)',
                'qwen3-32b': 'Qwen3 32B (4⭐)',
                'llama-4-maverick': 'Llama 4 Maverick (5⭐) ⚡ Speed + Quality',
                'llama-4-scout': 'Llama 4 Scout (5⭐) ⚡ Speed + Quality',
                'deepseek-r1-70b': 'DeepSeek R1 70B (5⭐) 🧠 Reasoning',
                'llama-3.3-70b': 'Llama 3.3 70B (5⭐) 📝 General Chat',
                'allam-2-7b': 'Allam 2 7B Multilingual (3⭐)',
                'groq-compound': 'Groq Compound Hybrid (4⭐) 🧠 Reasoning',
                'groq-compound-mini': 'Groq Compound Mini (3⭐)',
                'kimi-k2-instruct': 'Kimi K2 Long Context (3⭐)',
                'kimi-k2-instruct-0905': 'Kimi K2 0905 Version (3⭐)',
                'llama-guard-4-12b': 'Llama Guard 4 12B Safety (3⭐)',
                'llama-prompt-guard-2-22m': 'Llama Prompt Guard 22M (2⭐)',
                'llama-prompt-guard-2-86m': 'Llama Prompt Guard 86M (3⭐)',
                'whisper-large-v3': 'Whisper Large V3 Speech (4⭐)',
                'gpt-oss-120b': 'GPT-OSS 120B (4⭐)',
                'gpt-oss-20b': 'GPT-OSS 20B (3⭐)'
            },
            defaultModel: 'llama-3.1-8b-instant',
            features: ['26 Models + Specialties', '⚡ Lightning Speed Focus', '🧠 Reasoning + Speed', '📝 Chat + Speed', 'Safety Models'],
            icon: '⚡',
            color: '#f39800'
        }
    },
    
    // Default AI Provider
    DEFAULT_PROVIDER: 'openrouter',
    CURRENT_PROVIDER: 'openrouter',
    CURRENT_MODEL: 'gpt-4o-mini',
    
    // Legacy OpenAI Configuration (for backwards compatibility)
    OPENAI_API_KEY: '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',
    OPENAI_API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    OPENAI_MODEL: 'gpt-4o-mini',
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

// ===== AI PROMPT TEMPLATES & LOGIC =====
const PROMPT_TEMPLATES = {
    auto: {
        name: "Tự động nhận diện",
        icon: "🤖",
        systemPrompt: `Bạn là một AI chuyên gia phân tích và mở rộng prompt. Hãy phân tích câu hỏi/yêu cầu đơn giản của người dùng và tạo ra một prompt hoàn chỉnh, chi tiết và chuyên nghiệp.

NHIỆM VỤ:
1. Phân tích ngữ cảnh và mục đích của yêu cầu
2. Xác định loại prompt phù hợp (code, creative, business, analysis, etc.)
3. Mở rộng thành prompt đầy đủ với structure rõ ràng
4. Thêm context, constraints và expected output

ĐỊNH DẠNG OUTPUT:
- Role/Context: Xác định vai trò AI cần đảm nhận  
- Task Description: Mô tả chi tiết nhiệm vụ
- Specific Requirements: Các yêu cầu cụ thể
- Output Format: Định dạng kết quả mong muốn
- Additional Guidelines: Hướng dẫn bổ sung

Hãy tạo prompt chuyên nghiệp và dễ sử dụng.`
    },
    
    code: {
        name: "Lập trình",
        icon: "💻",
        systemPrompt: `Bạn là Senior Software Engineer với 10+ năm kinh nghiệm. Mở rộng yêu cầu coding đơn giản thành prompt hoàn chỉnh.

FOCUS AREAS:
- Code architecture & best practices
- Error handling & edge cases  
- Performance optimization
- Testing & documentation
- Security considerations

STRUCTURE:
1. **Role & Context**: Xác định công nghệ/framework
2. **Functional Requirements**: Tính năng cần implement
3. **Technical Specifications**: Chi tiết kỹ thuật
4. **Code Quality Standards**: Standards & conventions
5. **Deliverables**: Output mong muốn (code + docs + tests)

Tạo prompt chi tiết để AI có thể generate code production-ready.`
    },

    creative: {
        name: "Sáng tạo nội dung", 
        icon: "🎨",
        systemPrompt: `Bạn là Creative Director với chuyên môn về content creation, storytelling và brand communication. Mở rộng ý tưởng sáng tạo thành brief hoàn chỉnh.

CREATIVE DIMENSIONS:
- Target audience & personas
- Brand voice & tone
- Visual/content style
- Emotional impact
- Engagement strategy

STRUCTURE:
1. **Creative Brief**: Tổng quan dự án
2. **Audience Analysis**: Phân tích đối tượng
3. **Content Strategy**: Chiến lược nội dung  
4. **Creative Guidelines**: Hướng dẫn sáng tạo
5. **Success Metrics**: Tiêu chí đánh giá

Tạo prompt giúp AI tạo nội dung hấp dẫn và hiệu quả.`
    },

    business: {
        name: "Kinh doanh",
        icon: "💼", 
        systemPrompt: `Bạn là Business Consultant với MBA và 15+ năm kinh nghiệm strategy & operations. Mở rộng business query thành comprehensive analysis prompt.

BUSINESS FOCUS:
- Strategic planning & execution
- Market analysis & competitive landscape
- Financial modeling & projections
- Risk assessment & mitigation
- Implementation roadmap

STRUCTURE:
1. **Business Context**: Industry & company background
2. **Objective & Goals**: Clear business objectives
3. **Analysis Framework**: Phương pháp phân tích
4. **Key Considerations**: Factors ảnh hưởng
5. **Expected Outcomes**: Deliverables & timeline

Tạo prompt cho analysis sâu sắc và actionable insights.`
    },

    analysis: {
        name: "Phân tích dữ liệu",
        icon: "📊",
        systemPrompt: `Bạn là Data Scientist với PhD và expertise trong statistical analysis, machine learning và data visualization. Mở rộng data question thành comprehensive analysis prompt.

ANALYTICAL APPROACH:
- Data exploration & cleaning
- Statistical analysis & hypothesis testing
- Visualization & interpretation
- Model building & validation
- Insights & recommendations

STRUCTURE:
1. **Data Context**: Dataset description & source
2. **Research Questions**: Hypotheses cần test
3. **Methodology**: Phương pháp phân tích
4. **Technical Requirements**: Tools & techniques
5. **Output Specifications**: Charts, reports, models

Tạo prompt cho data analysis chuyên sâu và accurate.`
    },

    education: {
        name: "Giáo dục",
        icon: "📚",
        systemPrompt: `Bạn là Educational Designer với M.Ed và chuyên môn về curriculum development, learning psychology và instructional design. Mở rộng educational request thành detailed learning prompt.

PEDAGOGICAL ELEMENTS:
- Learning objectives & outcomes
- Target learner analysis
- Content structure & progression
- Engagement strategies
- Assessment methods

STRUCTURE:
1. **Learning Context**: Subject matter & level
2. **Learner Profile**: Audience characteristics
3. **Educational Goals**: Learning objectives
4. **Instructional Design**: Teaching approach
5. **Assessment Strategy**: Evaluation methods

Tạo prompt cho educational content hiệu quả và engaging.`
    },

    research: {
        name: "Nghiên cứu",
        icon: "🔬",
        systemPrompt: `Bạn là Research Director với PhD và expertise trong research methodology, literature review và academic writing. Mở rộng research question thành comprehensive research prompt.

RESEARCH FRAMEWORK:
- Literature review & background
- Research methodology & design
- Data collection & analysis
- Academic rigor & ethics
- Publication standards

STRUCTURE:  
1. **Research Context**: Field & background
2. **Research Questions**: Primary & secondary questions
3. **Methodology**: Research approach & methods
4. **Literature Review**: Relevant studies & theories
5. **Expected Contributions**: Novel insights & impact

Tạo prompt cho research chất lượng academic standard.`
    }
};

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

// Backwards compatibility
async function callOpenAIAPI(userInput, template) {
    return await callAIAPI(userInput, template);
}

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
    
    const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${providerConfig.name} Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.data.choices || !data.data.choices[0]) {
        throw new Error(`Invalid response from ${providerConfig.name}`);
    }

    return data.data.choices[0].message.content.trim();
}

// Legacy function for backwards compatibility
async function callOpenAIViaProxy(userInput, systemPrompt) {
    return await callAIViaProxy(userInput, systemPrompt, CONFIG.CURRENT_PROVIDER, CONFIG.CURRENT_MODEL);
}

/**
 * Gọi OpenAI API trực tiếp (có thể gặp CORS)
 * @param {string} userInput - Input từ người dùng
 * @param {string} systemPrompt - System prompt
 * @returns {Promise<string>} - AI response
 */
async function callOpenAIDirectly(userInput, systemPrompt) {
    const response = await fetch(CONFIG.OPENAI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: CONFIG.OPENAI_MODEL,
            messages: [
                {
                    role: 'system', 
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: `Yêu cầu của người dùng: "${userInput}"\n\nHãy tạo một prompt hoàn chỉnh, chi tiết và chuyên nghiệp dựa trên yêu cầu này.`
                }
            ],
            max_tokens: CONFIG.MAX_TOKENS,
            temperature: CONFIG.TEMPERATURE,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from OpenAI API');
    }

    return data.choices[0].message.content.trim();
}

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
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return `
# ${template.name} - Prompt Chi Tiết (Demo Mode)

## 📋 NGỮ CẢNH VÀ MỤC ĐÍCH
**Yêu cầu gốc:** ${input}

**Vai trò AI:** ${getAIRoleForCategory(template)}

## 🎯 NHIỆM VỤ CHI TIẾT
${generateDetailedTask(input, template)}

## ⚙️ YÊU CẦU CỤ THỂ
${generateSpecificRequirements(input, template)}

## 📊 ĐỊNH DẠNG OUTPUT
${generateOutputFormat(template)}

## 🔍 TIÊU CHÍ CHẤT LƯỢNG
${generateQualityCriteria(template)}

## 💡 HƯỚNG DẪN BỔ SUNG
${generateAdditionalGuidelines(input, template)}

---
*⚠️ Đây là chế độ demo. Để sử dụng AI thật, vui lòng kiểm tra kết nối internet và API key.*
*Prompt được tạo bởi AI Prompt Assistant - Phiên bản ${CONFIG.VERSION}*
    `.trim();
}

/**
 * Kiểm tra tính hợp lệ của OpenAI API key
 * @returns {boolean} - True nếu API key hợp lệ
 */
function validateOpenAIApiKey() {
    const apiKey = CONFIG.OPENAI_API_KEY;
    
    if (!apiKey || apiKey.length < 40) {
        console.warn('⚠️ OpenAI API key không hợp lệ hoặc không được cấu hình');
        return false;
    }
    
    if (!apiKey.startsWith('sk-')) {
        console.warn('⚠️ OpenAI API key có format không đúng');
        return false;
    }
    
    return true;
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

// ===== AI THINKING PROCESS SIMULATOR =====
const THINKING_PATTERNS = {
    analyze: [
        "Phân tích ngữ cảnh và mục đích của yêu cầu...",
        "Xác định loại prompt và domain knowledge cần thiết...",
        "Đánh giá độ phức tạp và scope của nhiệm vụ...",
        "Tìm hiểu các yếu tố ảnh hưởng và constraints..."
    ],
    
    categorize: [
        "Nhận diện category phù hợp nhất...",
        "So sánh với các template có sẵn...", 
        "Xác định framework và approach tốt nhất...",
        "Đánh giá requirements đặc biệt..."
    ],
    
    structure: [
        "Thiết kế cấu trúc prompt logic và rõ ràng...",
        "Xác định các section và subsection cần thiết...",
        "Sắp xếp thông tin theo độ ưu tiên...",
        "Tối ưu flow và readability..."
    ],
    
    enhance: [
        "Thêm context và background information...",
        "Bổ sung specific requirements và constraints...",
        "Định nghĩa expected output format...",
        "Tăng cường độ chính xác và completeness..."
    ],
    
    validate: [
        "Kiểm tra tính nhất quán và logic...",
        "Đảm bảo prompt đầy đủ và actionable...",
        "Verify clarity và ease of understanding...",
        "Final review và polish..."
    ]
};

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
        if (result.success) {
            workingProviders.push(CONFIG.AI_PROVIDERS[providerName]?.displayName || providerName);
        } else {
            failedProviders.push(CONFIG.AI_PROVIDERS[providerName]?.displayName || providerName);
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

// Backwards compatibility
async function initializeOpenAIStatus() {
    return await initializeAIStatus();
}

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
        loadingOverlay: document.getElementById('loadingOverlay')
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
    const category = detectCategory(input);
    const flow = [];
    
    // Always start with analysis
    flow.push(...THINKING_PATTERNS.analyze);
    
    // Add category-specific thinking
    if (category !== 'auto') {
        flow.push(...THINKING_PATTERNS.categorize);
    }
    
    // Structure and enhance
    flow.push(...THINKING_PATTERNS.structure);
    flow.push(...THINKING_PATTERNS.enhance);
    
    // Always end with validation
    flow.push(...THINKING_PATTERNS.validate);
    
    return flow;
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
    const lowerInput = input.toLowerCase();
    
    // Code-related keywords
    if (lowerInput.match(/\b(code|coding|lập trình|api|function|hàm|app|ứng dụng|website|web|javascript|python|react|vue|node|backend|frontend|database|sql)\b/)) {
        return 'code';
    }
    
    // Creative keywords  
    if (lowerInput.match(/\b(content|nội dung|viết|write|blog|social media|marketing|sáng tạo|creative|thiết kế|design|brand|thương hiệu)\b/)) {
        return 'creative';
    }
    
    // Business keywords
    if (lowerInput.match(/\b(business|kinh doanh|doanh nghiệp|công ty|startup|strategy|chiến lược|market|thị trường|customer|khách hàng|profit|lợi nhuận)\b/)) {
        return 'business';
    }
    
    // Analysis keywords
    if (lowerInput.match(/\b(data|dữ liệu|phân tích|analysis|chart|biểu đồ|statistics|thống kê|report|báo cáo|insights|xu hướng|trend)\b/)) {
        return 'analysis';
    }
    
    // Education keywords
    if (lowerInput.match(/\b(học|dạy|giáo dục|education|course|khóa học|tutorial|hướng dẫn|student|sinh viên|teacher|giáo viên)\b/)) {
        return 'education';
    }
    
    // Research keywords
    if (lowerInput.match(/\b(research|nghiên cứu|study|literature|tài liệu|paper|bài báo|academic|học thuật|science|khoa học)\b/)) {
        return 'research';
    }
    
    return 'auto';
}

async function generateExpandedPrompt(input) {
    const category = elements.categorySelect.value === 'auto' ? detectCategory(input) : elements.categorySelect.value;
    const template = PROMPT_TEMPLATES[category] || PROMPT_TEMPLATES.auto;
    
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

async function simulateAIExpansion(input, template) {
    // This is a sophisticated prompt expansion algorithm
    // In a real implementation, this would call an actual AI API
    
    const baseStructure = `
# ${template.name} - Prompt Chi Tiết

## 📋 NGỮ CẢNH VÀ MỤC ĐÍCH
**Yêu cầu gốc:** ${input}

**Vai trò AI:** ${getAIRoleForCategory(template)}

## 🎯 NHIỆM VỤ CHI TIẾT
${generateDetailedTask(input, template)}

## ⚙️ YÊU CẦU CỤ THỂ
${generateSpecificRequirements(input, template)}

## 📊 ĐỊNH DẠNG OUTPUT
${generateOutputFormat(template)}

## 🔍 TIÊU CHÍ CHẤT LƯỢNG
${generateQualityCriteria(template)}

## 💡 HƯỚNG DẪN BỔ SUNG
${generateAdditionalGuidelines(input, template)}

---
*Prompt được tạo bởi AI Prompt Assistant - Phiên bản ${CONFIG.VERSION}*
    `;
    
    return baseStructure.trim();
}

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

function generateDetailedTask(input, template) {
    // Analyze input and expand based on category
    const expansions = {
        code: `
**Core Functionality:**
- Phân tích yêu cầu: ${input}
- Thiết kế architecture phù hợp với best practices
- Implement full-stack solution với error handling
- Optimize performance và security
- Tạo comprehensive documentation

**Technical Scope:**
- Backend: API design, database schema, business logic
- Frontend: User interface, user experience, responsive design
- DevOps: Deployment strategy, monitoring, scaling
- Testing: Unit tests, integration tests, E2E tests`,

        creative: `
**Content Strategy:**
- Phân tích brief: ${input}  
- Research target audience và competitive landscape
- Develop brand voice và messaging framework
- Create content calendar với diverse formats
- Design engagement strategy across platforms

**Creative Execution:**
- Visual identity và design system
- Copy writing với persuasive techniques
- Multimedia content (text, image, video, audio)
- Cross-platform adaptation và optimization`,

        business: `
**Business Analysis:**
- Đánh giá opportunity: ${input}
- Market research và competitive analysis  
- Financial modeling với revenue projections
- Risk assessment và mitigation strategies
- Implementation roadmap với milestones

**Strategic Planning:**
- Business model canvas development
- Go-to-market strategy design
- Resource allocation và team structure
- Performance metrics và KPI tracking`,

        analysis: `
**Data Analysis Workflow:**
- Dataset exploration: ${input}
- Statistical analysis với hypothesis testing
- Pattern recognition và trend identification  
- Predictive modeling với validation
- Insight synthesis và actionable recommendations

**Technical Implementation:**
- Data cleaning và preprocessing
- Exploratory Data Analysis (EDA)
- Advanced analytics (regression, clustering, classification)
- Data visualization với interactive dashboards`,

        education: `
**Learning Design:**
- Educational needs analysis: ${input}
- Learning objectives với measurable outcomes
- Curriculum structure với progressive difficulty
- Engagement strategies và interactive elements
- Assessment methods với feedback loops

**Content Development:**
- Lesson plans với detailed activities
- Multimedia resources và supplementary materials
- Practice exercises với varying complexity
- Real-world applications và case studies`,

        research: `
**Research Framework:**
- Literature review scope: ${input}
- Research questions với clear hypotheses
- Methodology design với rigorous standards
- Data collection strategy và timeline
- Analysis plan với statistical approaches

**Academic Standards:**
- Peer-reviewed source integration
- Citation management và referencing
- Ethical considerations và limitations
- Contribution to existing knowledge base`
    };

    return expansions[Object.keys(expansions).find(key => template.name.toLowerCase().includes(key))] || 
           `Phân tích yêu cầu "${input}" và mở rộng thành solution hoàn chỉnh với approach đa chiều và chi tiết.`;
}

function generateSpecificRequirements(input, template) {
    const requirements = {
        code: `
- **Functionality**: Đầy đủ CRUD operations với validation
- **Architecture**: Clean code, SOLID principles, design patterns
- **Performance**: Response time < 200ms, scalable design
- **Security**: Authentication, authorization, input sanitization
- **Documentation**: API docs, code comments, README`,

        creative: `
- **Brand Alignment**: Consistent với brand identity và values
- **Audience Engagement**: High CTR, shares, comments metrics
- **Content Quality**: Original, valuable, SEO-optimized
- **Visual Standards**: Professional design, mobile-friendly
- **Performance Tracking**: Analytics setup, A/B testing`,

        business: `
- **Financial Accuracy**: Realistic projections với assumptions
- **Market Validation**: Primary/secondary research data
- **Competitive Analysis**: SWOT, positioning matrix
- **Feasibility Assessment**: Resource requirements, timeline
- **ROI Projections**: Break-even analysis, growth scenarios`,

        analysis: `
- **Data Quality**: Clean, validated, representative dataset
- **Statistical Rigor**: Appropriate tests, significance levels
- **Visualization**: Clear charts, interactive dashboards
- **Reproducibility**: Documented methodology, code availability
- **Business Impact**: Actionable insights, recommendations`,

        education: `
- **Learning Outcomes**: SMART objectives với assessment criteria
- **Engagement**: Interactive elements, multimedia integration
- **Accessibility**: Multiple learning styles, inclusive design
- **Progress Tracking**: Milestones, feedback mechanisms
- **Real-world Application**: Practical exercises, case studies`,

        research: `
- **Academic Rigor**: Peer-reviewed sources, methodology transparency
- **Literature Coverage**: Comprehensive review, gap identification
- **Methodology**: Appropriate design, sample size calculations
- **Ethics Compliance**: IRB approval, consent procedures
- **Publication Ready**: Journal formatting, citation standards`
    };
    
    return requirements[Object.keys(requirements).find(key => template.name.toLowerCase().includes(key))] || 
           "- **Quality**: Professional standard với attention to detail\n- **Completeness**: Comprehensive coverage của topic\n- **Clarity**: Easy to understand và actionable";
}

function generateOutputFormat(template) {
    const formats = {
        code: `
**Deliverables:**
📁 **Source Code**
  - Well-documented, production-ready code
  - Modular architecture với reusable components
  - Unit và integration tests

📚 **Documentation**  
  - API documentation (Swagger/OpenAPI)
  - Setup và deployment guides
  - Architecture decisions record (ADR)

🧪 **Testing Suite**
  - Test cases với high coverage
  - Performance benchmarks
  - Security audit checklist`,

        creative: `
**Content Package:**
📝 **Written Content**
  - Headlines, body copy, CTAs
  - SEO-optimized với keywords
  - Multiple variations cho A/B testing

🎨 **Visual Assets**
  - Images, graphics, videos
  - Brand-compliant design system
  - Multi-platform formats

📊 **Strategy Document**
  - Content calendar và publishing schedule
  - Performance metrics và KPIs
  - Engagement optimization tactics`,

        business: `
**Business Plan Package:**
📈 **Executive Summary**
  - Vision, mission, value proposition
  - Key success factors và competitive advantages
  - Financial highlights và projections

📊 **Market Analysis**
  - Industry overview và trends
  - Target market segmentation
  - Competitive landscape assessment

💰 **Financial Projections**
  - 3-year P&L, cash flow, balance sheet
  - Break-even analysis và ROI calculations
  - Scenario planning (best/worst/realistic case)`,

        analysis: `
**Analysis Report:**
📊 **Executive Dashboard**
  - Key metrics và insights summary
  - Interactive visualizations
  - Performance trends và patterns

📈 **Detailed Analysis**
  - Statistical findings với confidence intervals
  - Correlation và regression analysis
  - Predictive models với accuracy metrics

🎯 **Recommendations**
  - Data-driven action items
  - Priority matrix với impact assessment
  - Implementation timeline và resource requirements`,

        education: `
**Learning Package:**
📚 **Course Structure**
  - Module breakdown với learning objectives
  - Lesson plans với detailed activities
  - Assessment rubrics và grading criteria

🎓 **Learning Materials**
  - Presentations, handouts, worksheets
  - Video tutorials và demonstrations
  - Interactive exercises và simulations

📝 **Assessment Tools**
  - Quizzes, assignments, projects
  - Peer review templates
  - Progress tracking spreadsheets`,

        research: `
**Research Output:**
📑 **Manuscript**
  - Abstract, introduction, methodology
  - Results với statistical analysis
  - Discussion và conclusions

📊 **Data Package**
  - Raw data với metadata documentation
  - Analysis scripts và reproducible code
  - Supplementary materials

📈 **Presentation Materials**
  - Conference slides với key findings
  - Poster templates
  - Executive summary cho stakeholders`
    };
    
    return formats[Object.keys(formats).find(key => template.name.toLowerCase().includes(key))] || 
           "**Standard Output:** Comprehensive response với structure rõ ràng, examples cụ thể và actionable recommendations";
}

function generateQualityCriteria(template) {
    return `
**Tiêu chí đánh giá chất lượng:**

✅ **Completeness (Tính đầy đủ)**
- Covers tất cả aspects của request
- No missing critical information
- Addresses edge cases và potential issues

✅ **Clarity (Tính rõ ràng)**  
- Easy to understand và follow
- Well-structured với logical flow
- Clear examples và explanations

✅ **Accuracy (Tính chính xác)**
- Factually correct information
- Up-to-date best practices
- Reliable sources và references

✅ **Actionability (Tính khả thi)**
- Specific, implementable steps
- Realistic timeline và resources
- Measurable outcomes và success criteria

✅ **Professional Standard**
- Industry best practices compliance
- High-quality deliverables
- Ready for production/presentation use`;
}

function generateAdditionalGuidelines(input, template) {
    const guidelines = {
        code: `
**Development Best Practices:**
- Follow language-specific conventions (PEP8, ESLint, etc.)
- Implement proper error handling và logging
- Use version control với meaningful commits
- Consider scalability và maintainability
- Include monitoring và alerting setup

**Collaboration Notes:**
- Document decisions và trade-offs made
- Provide clear setup instructions cho team members
- Include troubleshooting guide với common issues
- Plan for code reviews và testing procedures`,

        creative: `
**Creative Excellence:**
- Maintain brand consistency across touchpoints
- Optimize cho multiple platforms và devices
- Consider cultural sensitivity và inclusivity
- Plan for seasonal/trending content adaptation
- Include performance measurement strategies

**Content Optimization:**
- SEO best practices implementation
- Social media platform specifications
- Accessibility guidelines compliance
- A/B testing framework setup`,

        business: `
**Strategic Considerations:**
- Regular market monitoring và plan adjustment
- Stakeholder communication protocols
- Risk mitigation strategies implementation
- Performance review schedules
- Pivot planning với decision criteria

**Implementation Success:**
- Change management approach
- Team training và development plans
- Technology stack considerations
- Regulatory compliance requirements`,

        analysis: `
**Analytical Rigor:**
- Cross-validation của findings với multiple methods
- Sensitivity analysis cho key assumptions
- Documentation của limitations và biases
- Regular model performance monitoring
- Ethical considerations trong data usage

**Business Integration:**
- Alignment với organizational objectives
- Stakeholder communication strategies
- Implementation feasibility assessment
- Long-term monitoring plans`,

        education: `
**Learning Effectiveness:**
- Multiple intelligence theory integration
- Inclusive design cho diverse learners
- Regular feedback collection và iteration
- Technology integration best practices
- Assessment validity và reliability checks

**Engagement Strategies:**
- Gamification elements integration
- Social learning opportunities
- Real-world application emphasis
- Continuous improvement processes`,

        research: `
**Research Excellence:**
- Open science practices adoption
- Replication planning và documentation
- Collaboration opportunities identification
- Impact measurement strategies
- Knowledge transfer planning

**Publication Strategy:**
- Target journal identification
- Peer review preparation
- Conference presentation planning
- Public engagement considerations`
    };
    
    return guidelines[Object.keys(guidelines).find(key => template.name.toLowerCase().includes(key))] || 
           `**General Guidelines:** Maintain high professional standards, ensure completeness và accuracy, focus on practical applicability.`;
}

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
    return `
        <div class="example-card" data-index="${EXAMPLE_PROMPTS.indexOf(example)}" data-category="${example.category}">
            <div class="example-header">
                <div class="example-icon">${example.icon}</div>
                <div>
                    <div class="example-title">${example.title}</div>
                    <div class="example-category">${PROMPT_TEMPLATES[example.category]?.name || example.category}</div>
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
        elements.loadingOverlay.style.display = 'none';
        
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
        elements.loadingOverlay.style.display = 'none';
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
    const template = PROMPT_TEMPLATES[category];
    if (template) {
        showToast(`Đã nhận diện: ${template.name} ${template.icon}`, 'info');
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
