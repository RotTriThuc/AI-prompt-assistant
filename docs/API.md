# 🔌 API Documentation

## 📋 Overview

AI Prompt Assistant Proxy Server v2.0 cung cấp RESTful API để access 3 AI providers: OpenRouter, Groq, và Google Gemini.

**Base URL**: `http://localhost:3001`

---

## 🔑 Authentication

API keys được configure trong proxy server (environment variables). Client không cần pass API keys.

---

## 📡 ENDPOINTS

### Health Check

#### GET `/health`

Kiểm tra server status.

**Response**:
```json
{
  "status": "OK",
  "message": "AI Prompt Assistant Proxy Server (Python) is running",
  "timestamp": "2025-10-01T10:30:00.000Z",
  "version": "1.0.0"
}
```

---

### Test AI Providers

#### GET `/api/test-openrouter`

Test OpenRouter AI connection.

**Response Success**:
```json
{
  "success": true,
  "message": "OpenRouter AI API connection successful",
  "status": 200,
  "model": "deepseek/deepseek-chat-v3.1:free",
  "provider": "openrouter",
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 5,
    "total_tokens": 15
  }
}
```

**Response Error**:
```json
{
  "success": false,
  "message": "OpenRouter AI API connection failed",
  "error": "Rate limit exceeded",
  "status": 429
}
```

#### GET `/api/test-groq`

Test Groq AI connection.

**Response**: Similar to OpenRouter

#### GET `/api/test-gemini`

Test Google Gemini connection.

**Response**: Similar to OpenRouter

#### GET `/api/test-all`

Test all providers simultaneously.

**Response**:
```json
{
  "results": {
    "openrouter": {
      "success": true,
      "message": "OpenRouter AI API connection successful"
    },
    "groq": {
      "success": true,
      "message": "Groq AI API connection successful"
    },
    "gemini": {
      "success": true,
      "message": "Google Gemini API connection successful"
    }
  },
  "summary": {
    "total_providers": 3,
    "working_providers": 3,
    "timestamp": "2025-10-01T10:30:00.000Z"
  }
}
```

---

### Chat Completions

#### POST `/api/openrouter/chat`

Send chat request to OpenRouter AI.

**Request Body**:
```json
{
  "systemPrompt": "You are a helpful AI assistant.",
  "userInput": "What is React?",
  "model": "deepseek-chat-v3.1",
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**Parameters**:
- `systemPrompt` (required): System instructions for AI
- `userInput` (required): User's message/request
- `model` (optional): Model key (default: `deepseek-chat-v3.1`)
- `temperature` (optional): 0.0-1.0 (default: 0.7)
- `max_tokens` (optional): Max response tokens (default: 2000)

**Available Models**:
```javascript
// 5-Star Models (Best Quality)
"qwen3-coder-free"     // Best for coding
"deepseek-r1"          // Best reasoning
"deepseek-chat-v3.1"   // Best chat
"llama-3.3-70b"        // Excellent chat
"grok-4-fast"          // Ultra speed

// 4-Star Models (High Quality)
"qwen3-14b"            // Well balanced
"mistral-small-3.2"    // Balanced
"devstral-small-2505"  // Coding expert

// 3-Star Models (Good)
"llama-3.2-3b"         // Fast & lightweight
"glm-4.5-air-free"     // Multilingual
```

**Response Success**:
```json
{
  "success": true,
  "data": {
    "choices": [
      {
        "message": {
          "role": "assistant",
          "content": "React is a JavaScript library for building user interfaces..."
        },
        "finish_reason": "stop"
      }
    ],
    "usage": {
      "prompt_tokens": 25,
      "completion_tokens": 150,
      "total_tokens": 175
    },
    "model": "deepseek/deepseek-chat-v3.1:free"
  },
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 150,
    "total_tokens": 175
  },
  "provider": "openrouter"
}
```

**Response Error**:
```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again later.",
  "status": 429
}
```

---

#### POST `/api/groq/chat`

Send chat request to Groq AI (ultra-fast inference).

**Request**: Same as OpenRouter

**Available Models**:
```javascript
"llama-3.1-8b-instant"     // Fast (4⭐)
"llama-3.1-70b-versatile"  // Versatile (4⭐)
"mixtral-8x7b-32768"       // Balanced (4⭐)
"gemma2-9b-it"             // Good (3⭐)
```

**Response**: Same format as OpenRouter

---

#### POST `/api/openai/chat` (Legacy - Gemini)

Send chat request to Google Gemini.

**Note**: Legacy endpoint name for backward compatibility. Actually uses Gemini.

**Request Body**:
```json
{
  "systemPrompt": "You are a helpful AI assistant.",
  "userInput": "What is machine learning?"
}
```

**Response**: Similar to OpenRouter but different internal structure

---

#### POST `/api/chat/universal`

Universal endpoint - auto-routes to specified provider.

**Request Body**:
```json
{
  "provider": "openrouter",
  "systemPrompt": "You are a helpful AI assistant.",
  "userInput": "Explain quantum computing",
  "model": "deepseek-chat-v3.1"
}
```

**Parameters**:
- `provider` (required): "openrouter", "groq", or "gemini"
- Other params: Same as provider-specific endpoints

---

### Models Information

#### GET `/api/models`

List all available models from all providers.

**Response**:
```json
{
  "providers": {
    "openrouter": {
      "name": "OpenRouter AI",
      "models": {
        "deepseek-chat-v3.1": "deepseek/deepseek-chat-v3.1:free",
        "qwen3-coder-free": "qwen/qwen3-coder:free"
        // ... more models
      },
      "default": "deepseek/deepseek-chat-v3.1:free",
      "features": ["Multiple Models", "GPT-4 Access", "Free Tier"]
    },
    "groq": {
      "name": "Groq AI",
      "models": {
        "llama-3.1-8b-instant": "llama-3.1-8b-instant"
        // ... more models
      },
      "default": "llama-3.1-8b-instant",
      "features": ["Ultra Fast", "Free Tier"]
    },
    "gemini": {
      "name": "Google Gemini",
      "models": {
        "gemini-2.0-flash-exp": "gemini-2.0-flash-exp"
      },
      "default": "gemini-2.0-flash-exp",
      "features": ["Free Tier", "Fast Response"]
    }
  },
  "default_provider": "openrouter"
}
```

---

#### GET `/api/info`

Get API server information.

**Response**:
```json
{
  "name": "AI Prompt Assistant Proxy Server (Python)",
  "version": "2.0.0",
  "description": "Triple-provider proxy server",
  "endpoints": {
    "health": "GET /health",
    "testOpenRouter": "GET /api/test-openrouter",
    "testGroq": "GET /api/test-groq",
    "testGemini": "GET /api/test-gemini",
    "testAll": "GET /api/test-all",
    "openrouterChat": "POST /api/openrouter/chat",
    "groqChat": "POST /api/groq/chat",
    "geminiChat": "POST /api/openai/chat",
    "universalChat": "POST /api/chat/universal",
    "listModels": "GET /api/models",
    "info": "GET /api/info"
  },
  "providers": {
    "openrouter": {
      "model": "deepseek/deepseek-chat-v3.1:free",
      "maxTokens": 2000,
      "temperature": 0.7
    },
    "groq": {
      "model": "llama-3.1-8b-instant",
      "maxTokens": 2000,
      "temperature": 0.7
    },
    "gemini": {
      "model": "gemini-2.0-flash-exp",
      "maxTokens": 2000,
      "temperature": 0.7
    }
  },
  "defaultProvider": "openrouter"
}
```

---

## 📝 CODE EXAMPLES

### JavaScript/Node.js

```javascript
// Test connection
async function testConnection() {
  const response = await fetch('http://localhost:3001/api/test-all');
  const data = await response.json();
  console.log(data);
}

// Generate prompt with OpenRouter
async function generatePrompt(userInput) {
  const response = await fetch('http://localhost:3001/api/openrouter/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      systemPrompt: 'You are an AI prompt engineering expert...',
      userInput: userInput,
      model: 'deepseek-chat-v3.1',
      temperature: 0.7
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    return data.data.choices[0].message.content;
  } else {
    throw new Error(data.error);
  }
}

// Usage
generatePrompt('Create a React todo app')
  .then(prompt => console.log(prompt))
  .catch(error => console.error(error));
```

### Python

```python
import requests

# Test connection
def test_connection():
    response = requests.get('http://localhost:3001/api/test-all')
    return response.json()

# Generate prompt
def generate_prompt(user_input, model='deepseek-chat-v3.1'):
    url = 'http://localhost:3001/api/openrouter/chat'
    payload = {
        'systemPrompt': 'You are an AI prompt engineering expert...',
        'userInput': user_input,
        'model': model,
        'temperature': 0.7
    }
    
    response = requests.post(url, json=payload)
    data = response.json()
    
    if data['success']:
        return data['data']['choices'][0]['message']['content']
    else:
        raise Exception(data['error'])

# Usage
try:
    prompt = generate_prompt('Create a React todo app')
    print(prompt)
except Exception as e:
    print(f'Error: {e}')
```

### cURL

```bash
# Test all providers
curl http://localhost:3001/api/test-all

# Generate prompt with OpenRouter
curl -X POST http://localhost:3001/api/openrouter/chat \
  -H "Content-Type: application/json" \
  -d '{
    "systemPrompt": "You are an AI prompt engineering expert...",
    "userInput": "Create a React todo app",
    "model": "deepseek-chat-v3.1",
    "temperature": 0.7
  }'

# Test Groq (ultra fast)
curl -X POST http://localhost:3001/api/groq/chat \
  -H "Content-Type: application/json" \
  -d '{
    "systemPrompt": "You are a helpful assistant.",
    "userInput": "What is AI?",
    "model": "llama-3.1-8b-instant"
  }'
```

---

## ⚠️ ERROR CODES

| Code | Message | Description |
|------|---------|-------------|
| 200 | Success | Request successful |
| 400 | Bad Request | Missing required parameters |
| 402 | Payment Required | API key needs credits (OpenRouter paid models) |
| 429 | Rate Limit | Too many requests, try again later |
| 500 | Server Error | Internal server error |
| 503 | Service Unavailable | Provider temporarily down |

---

## 🔄 RATE LIMITS

### OpenRouter (Free Models):
- Varies by model
- Automatic fallback to other models on rate limit

### Groq:
- Free tier rate limits apply
- Very generous limits
- Ultra-fast inference

### Gemini:
- 15 requests per minute (free tier)
- 1500 requests per day

**Smart Fallback**: API tự động switch providers khi gặp rate limit!

---

## 💡 BEST PRACTICES

### 1. Error Handling
```javascript
async function safeAPICall(endpoint, payload) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (!data.success) {
      // Handle API error
      console.error('API Error:', data.error);
      return null;
    }
    
    return data;
  } catch (error) {
    // Handle network error
    console.error('Network Error:', error);
    return null;
  }
}
```

### 2. Retry Logic
```javascript
async function retryAPICall(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### 3. Provider Selection
```javascript
// Choose provider based on use case
const providerForTask = {
  'coding': 'openrouter',      // Best coding models
  'speed': 'groq',             // Ultra fast
  'general': 'gemini',         // Free & reliable
  'reasoning': 'openrouter'    // Best reasoning models
};

function selectProvider(taskType) {
  return providerForTask[taskType] || 'openrouter';
}
```

---

## 📊 RESPONSE TIMES

| Provider | Model | Avg Response Time | Best For |
|----------|-------|-------------------|----------|
| Groq | llama-3.1-8b-instant | 0.5-1s | Speed |
| Gemini | gemini-2.0-flash-exp | 1-2s | Balance |
| OpenRouter | deepseek-chat-v3.1 | 2-4s | Quality |
| OpenRouter | qwen3-coder-free | 3-5s | Coding |

---

## 🔒 SECURITY

### API Key Management
- Keys stored in environment variables
- Never expose keys in client-side code
- Proxy server handles all authentication

### CORS
- Configured for `localhost` development
- Update for production domains

### Rate Limiting
- Built-in provider rate limits
- Smart fallback prevents abuse

---

## 📞 SUPPORT

**Issues?**
- Check `/health` endpoint
- Test providers with `/api/test-all`
- Review error messages
- Check logs in terminal

**Need Help?**
- GitHub Issues
- Documentation: README.md
- Community: Discussions

---

**Version**: 2.0.0  
**Last Updated**: October 1, 2025  
**Maintained by**: AI Prompt Assistant Team

