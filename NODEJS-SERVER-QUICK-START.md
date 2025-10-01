# ⚡ Node.js Proxy Server v2.0 - Quick Start Guide

> **Fix cho lỗi:** `❌ OpenRouter (Free Models Only) connection failed`

## 🎯 TÓM TẮT CẬP NHẬT

**Node.js proxy server đã được update lên v2.0 với đầy đủ endpoints!**

✅ **OpenRouter Chat** - `/api/openrouter/chat`  
✅ **Groq Chat** - `/api/groq/chat`  
✅ **Test All Providers** - `/api/test-all`  
✅ **16 FREE OpenRouter models**  
✅ **8 FREE Groq models**  

---

## 🚀 KHỞI ĐỘNG SERVER

### Option 1: Start trực tiếp với Node.js (KHUYÊN DÙNG)

```bash
node proxy-server.js
```

### Option 2: Dùng npm script

```bash
npm start
```

### Option 3: Dùng batch file

```bash
start-server.bat
```

---

## ✅ VERIFY SERVER HOẠT ĐỘNG

Sau khi start server, bạn sẽ thấy:

```
🚀 ================================================
🤖 AI Prompt Assistant Proxy Server v2.0 (Node.js)
🎯 Triple-Provider: Gemini + OpenRouter + Groq AI
🚀 ================================================
📡 Server running on: http://localhost:3001

🔍 Testing all AI providers on startup...

📊 Test Results: 3/3 providers working

✅ Gemini: Connected
✅ OpenRouter: Connected
✅ Groq: Connected

🎉 Server ready to handle requests!
```

### ❌ Nếu có provider fail:

Server vẫn sẽ hoạt động với các providers còn lại:

```
📊 Test Results: 2/3 providers working

✅ Gemini: Connected
✅ OpenRouter: Connected
❌ Groq: Failed - API key invalid
```

---

## 🧪 TEST ENDPOINTS

### 1. Test Health

```bash
curl http://localhost:3001/health
```

**Expected response:**
```json
{
  "status": "OK",
  "message": "AI Prompt Assistant Proxy Server is running",
  "timestamp": "2025-10-01T...",
  "version": "1.0.0"
}
```

### 2. Test All Providers

```bash
curl http://localhost:3001/api/test-all
```

**Expected response:**
```json
{
  "results": {
    "gemini": { "success": true, "provider": "gemini" },
    "openrouter": { "success": true, "provider": "openrouter" },
    "groq": { "success": true, "provider": "groq" }
  },
  "summary": {
    "total_providers": 3,
    "working_providers": 3
  }
}
```

### 3. Test Individual Providers

```bash
# Test Gemini
curl http://localhost:3001/api/test-openai

# Test OpenRouter
curl http://localhost:3001/api/test-openrouter

# Test Groq
curl http://localhost:3001/api/test-groq
```

### 4. Get API Info

```bash
curl http://localhost:3001/api/info
```

---

## 💬 TEST CHAT ENDPOINTS

### OpenRouter Chat

```bash
curl -X POST http://localhost:3001/api/openrouter/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userInput": "Hello, how are you?",
    "systemPrompt": "You are a helpful assistant",
    "model": "deepseek-chat-v3.1"
  }'
```

### Groq Chat (Ultra Fast)

```bash
curl -X POST http://localhost:3001/api/groq/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userInput": "Hello, how are you?",
    "systemPrompt": "You are a helpful assistant",
    "model": "llama-3.1-8b-instant"
  }'
```

---

## 🎯 SỬ DỤNG VỚI FRONTEND

### 1. Start Server

```bash
node proxy-server.js
```

### 2. Open Frontend

Mở `index.html` trong browser hoặc:

```bash
# If using Python simple HTTP server
python -m http.server 8000

# Then open: http://localhost:8000
```

### 3. Test trong Frontend

1. Frontend sẽ tự động test tất cả providers khi load
2. Bạn sẽ thấy toast notification:
   - ✅ "🤖 Sẵn sàng với 3 AI provider(s)!"
3. Chọn provider từ dropdown:
   - OpenRouter (Free Models Only)
   - Google Gemini 2.0 Flash
   - Groq AI (Lightning Fast)
4. Chọn model và bắt đầu generate prompts!

---

## 🔧 TROUBLESHOOTING

### Problem 1: Server không start

```bash
Error: Cannot find module 'express'
```

**Solution:**
```bash
npm install
# hoặc
npm install express cors node-fetch
```

### Problem 2: Port 3001 đã được sử dụng

```bash
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
```bash
# Tìm process đang dùng port 3001
netstat -ano | findstr :3001

# Kill process đó (Windows)
taskkill /PID <PID_NUMBER> /F

# Hoặc đổi port trong proxy-server.js
const PORT = 3002; // thay vì 3001
```

### Problem 3: OpenRouter/Groq connection failed

```bash
❌ OpenRouter: Failed - Unauthorized
```

**Solution:**
1. Check API key trong `proxy-server.js`
2. Verify API key vẫn còn valid
3. Check network connectivity
4. Try test trực tiếp:
   ```bash
   curl http://localhost:3001/api/test-openrouter
   ```

### Problem 4: CORS errors trong browser

```
Access to fetch at '...' from origin '...' has been blocked by CORS
```

**Solution:**
- Server đã enable CORS, nhưng đảm bảo đang chạy proxy server
- Không mở file HTML trực tiếp (file://), phải dùng HTTP server
- Dùng Live Server extension trong VSCode hoặc `python -m http.server`

---

## 📊 NPM SCRIPTS

Tất cả npm scripts available:

```bash
# Start server
npm start

# Start với nodemon (auto-reload)
npm run dev

# Install dependencies
npm run setup

# Test providers
npm run test-gemini
npm run test-openrouter
npm run test-groq
npm run test-all

# Check health
npm run check-health

# Get API info
npm run api-info
```

---

## 🎯 AVAILABLE MODELS

### OpenRouter (16 FREE Models)

**5-STAR MODELS (8):**
- `deepseek-chat-v3.1` - Best Chat (DEFAULT)
- `qwen3-coder-free` - Best Coding
- `deepseek-r1` - Best Reasoning
- `llama-3.1-405b` - Massive Reasoning
- `llama-3.3-70b` - Excellent Chat
- `llama-4-maverick` - Speed + Quality
- `llama-4-scout` - Speed + Quality
- `grok-4-fast` - Ultra Speed + Intelligence

**4-STAR MODELS (6):**
- `qwen3-14b` - Well Balanced
- `mistral-small-3.2` - Balanced
- `devstral-small-2505` - Coding Expert
- `gemini-2.0-flash-exp` - Google Fast
- `gemma-3-27b` - Google Quality
- `qwq-32b` - Smart Reasoning

**3-STAR MODELS (2):**
- `llama-3.2-3b` - Lightweight & Fast
- `glm-4.5-air-free` - Multilingual

### Groq AI (8 FREE Models)

- `llama-3.1-8b-instant` - Speed + Quality (DEFAULT)
- `llama-3.1-70b-versatile` - Versatile
- `llama-3.2-1b-preview` - Tiny & Fast
- `llama-3.2-3b-preview` - Small & Fast
- `mixtral-8x7b-32768` - Balanced MoE
- `gemma-7b-it` - Google Instruct
- `gemma2-9b-it` - Google Instruct v2
- `whisper-large-v3` - Speech Recognition

---

## 📖 DOCUMENTATION

**Chi tiết đầy đủ:** [NODEJS-PROXY-UPDATE.md](./NODEJS-PROXY-UPDATE.md)

**Setup Guide:** [README.md](./README.md)

---

## 🎉 SUCCESS INDICATORS

Nếu mọi thứ hoạt động đúng, bạn sẽ thấy:

1. ✅ Server khởi động thành công với banner đẹp
2. ✅ Tất cả 3 providers test pass khi startup
3. ✅ Frontend load không có lỗi console
4. ✅ Toast notification "🤖 Sẵn sàng với 3 AI provider(s)!"
5. ✅ Có thể chọn và switch giữa các providers
6. ✅ Generate prompt thành công với bất kỳ provider nào

---

## 🚨 KHI NÀO CẦN RESTART SERVER?

Restart server khi:

- ❌ Thay đổi API keys trong code
- ❌ Update code trong proxy-server.js
- ❌ Thêm/bớt models
- ❌ Thay đổi PORT
- ❌ Server bị crash hoặc không response

**Không cần restart khi:**
- ✅ Thay đổi frontend code (HTML/CSS/JS)
- ✅ Chỉ test các endpoints khác nhau

---

## 💡 TIPS & BEST PRACTICES

1. **Luôn check server logs** - Server logs rất chi tiết và helpful
2. **Use npm scripts** - Dễ nhớ và consistent
3. **Test providers individually** - Nếu có issue với specific provider
4. **Monitor token usage** - Check console logs để theo dõi usage
5. **Keep API keys secure** - Đừng commit API keys lên Git

---

**Tạo bởi:** Claude Sonnet 4.5  
**Version:** 2.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** 1 Tháng 10, 2025

