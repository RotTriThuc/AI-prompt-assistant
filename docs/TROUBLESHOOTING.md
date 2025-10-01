# 🔧 Troubleshooting Guide

## 📋 Mục Lục

1. [Common Issues](#common-issues)
2. [Provider-Specific Issues](#provider-specific-issues)
3. [Performance Issues](#performance-issues)
4. [Output Quality Issues](#output-quality-issues)
5. [Development Issues](#development-issues)

---

## 🐛 COMMON ISSUES

### Issue 1: "Proxy server không kết nối được"

**Symptoms**:
- Error: "Failed to fetch"
- Toast notification: "Lỗi kết nối AI"
- Console: "Network error"

**Solutions**:

✅ **Step 1**: Kiểm tra proxy server đang chạy
```bash
# Check if port 3001 is active
netstat -ano | findstr :3001

# hoặc
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess
```

✅ **Step 2**: Start proxy server
```bash
# Từ project root
python proxy-server-python.py

# hoặc
.\start-python-server.bat
```

✅ **Step 3**: Verify server đang chạy
```bash
# Test health endpoint
curl http://localhost:3001/health

# Test all providers
curl http://localhost:3001/api/test-all
```

✅ **Step 4**: Check firewall
- Windows Firewall có thể block port 3001
- Thêm exception cho Python/Node.js

---

### Issue 2: "Prompt generation failed - Tất cả providers đều lỗi"

**Symptoms**:
- Output: "All providers failed"
- Fallback to demo mode
- Toast: "Đang sử dụng chế độ demo"

**Solutions**:

✅ **Step 1**: Test từng provider riêng lẻ
```bash
# Test OpenRouter
curl http://localhost:3001/api/test-openrouter

# Test Groq
curl http://localhost:3001/api/test-groq

# Test Gemini
curl http://localhost:3001/api/test-gemini
```

✅ **Step 2**: Kiểm tra API keys
```python
# Trong proxy-server-python.py
# Verify keys không rỗng
OPENROUTER_API_KEY = 'sk-or-v1-...'  # Should not be empty
GROQ_API_KEY = 'gsk_...'
GEMINI_API_KEY = 'AIzaSy...'
```

✅ **Step 3**: Check rate limits
- OpenRouter: Xem usage dashboard
- Groq: Check free tier limits
- Gemini: 15 requests/minute limit

✅ **Step 4**: Try different model
```javascript
// Trong UI, chọn model khác
// hoặc trong code:
CONFIG.CURRENT_MODEL = 'llama-3.1-8b-instant'; // Groq model
```

---

### Issue 3: "Output quá ngắn hoặc quá dài"

**Symptoms**:
- Output chỉ 100-150 từ (quá ngắn)
- hoặc Output >1000 từ bị cut off

**Solutions**:

✅ **Quá ngắn - Cải thiện input**:
```javascript
// Bad input:
"Tạo website"

// Good input:
"Tạo full-stack e-commerce website với:
- React frontend
- Node.js backend
- PostgreSQL database
- Payment integration
- Admin dashboard
Include: architecture, code structure, deployment guide"
```

✅ **Quá dài - Adjust max_tokens**:
```javascript
// Trong script.js, line ~104
MAX_TOKENS: 3000  // Tăng từ 2000 lên 3000
```

✅ **Set constraints trong input**:
```
"[Your request]

Requirements:
- Keep output between 400-600 words
- Focus on key requirements only
- Provide concise but complete information"
```

---

### Issue 4: "Output không nhất quán giữa các lần generate"

**Symptoms**:
- Cùng input nhưng output khác nhau mỗi lần
- Quality fluctuates (lúc tốt lúc xấu)

**Solutions**:

✅ **Giảm temperature**:
```javascript
// Trong script.js, line ~104
TEMPERATURE: 0.5  // Giảm từ 0.7 xuống 0.5
// Lower = more consistent, higher = more creative
```

✅ **Sử dụng enhanced prompt** (đã implement!):
- Enhanced prompt có examples → consistent hơn
- Clear structure → predictable outputs

✅ **Chọn model deterministic**:
```javascript
// DeepSeek Chat V3.1 - more consistent
CONFIG.CURRENT_MODEL = 'deepseek-chat-v3.1';

// vs Mixtral - more creative/varied
```

---

## 🔌 PROVIDER-SPECIFIC ISSUES

### OpenRouter Issues

#### "402 Payment Required"

**Cause**: Đang dùng paid model nhưng API key không có credits

**Solution**:
```javascript
// Switch to FREE models only
const FREE_MODELS = [
    'deepseek-chat-v3.1',  // 5⭐
    'qwen3-coder-free',    // 5⭐
    'llama-3.3-70b',       // 5⭐
    'grok-4-fast'          // 5⭐
];

// Avoid paid models
const PAID_MODELS = [
    'gpt-4o',              // ❌ Paid
    'claude-3-opus',       // ❌ Paid
    'gpt-4-turbo'          // ❌ Paid
];
```

#### "429 Rate Limit Exceeded"

**Cause**: Quá nhiều requests tới cùng model

**Solution**:
✅ **Automatic fallback** (đã có):
- System tự động thử các fallback models
- Xem console logs để biết model nào được dùng

✅ **Manual retry với model khác**:
```javascript
// Try different 5-star model
'deepseek-chat-v3.1' → 'llama-3.3-70b' → 'qwen3-14b'
```

✅ **Wait và retry**:
```bash
# Wait 1-2 minutes
sleep 120

# Then try again
```

---

### Groq Issues

#### "Too many requests"

**Cause**: Free tier rate limit (rất generous nhưng có limit)

**Solution**:
✅ Switch to other provider:
```javascript
// Groq → OpenRouter
CONFIG.CURRENT_PROVIDER = 'openrouter';

// hoặc Groq → Gemini
CONFIG.CURRENT_PROVIDER = 'gemini';
```

#### "Model not found"

**Cause**: Sai model name

**Valid Groq Models**:
```javascript
'llama-3.1-8b-instant'     // ✅ Correct
'llama-3.1-70b-versatile'  // ✅ Correct
'mixtral-8x7b-32768'       // ✅ Correct

'llama-3.1-8b'             // ❌ Wrong (missing -instant)
'llama3-8b'                // ❌ Wrong (wrong format)
```

---

### Gemini Issues

#### "Quota exceeded for quota metric 'GenerateContent request'"

**Cause**: Vượt 15 requests/minute

**Solution**:
✅ **Wait 1 minute**:
```javascript
// Auto fallback sẽ switch sang provider khác
// hoặc manual wait:
setTimeout(() => retryGeneration(), 60000); // Wait 1 min
```

✅ **Use OpenRouter/Groq first**:
```javascript
// Set OpenRouter as default
CONFIG.DEFAULT_PROVIDER = 'openrouter';
```

#### "API key not valid"

**Check API key format**:
```javascript
// Valid format
'AIzaSyDAnBQKPWkJigLq_Hiy4PmqPvLkdW2AQAo'

// Should start with 'AIzaSy'
```

---

## ⚡ PERFORMANCE ISSUES

### Issue: "Response time quá chậm (>10 seconds)"

**Diagnosis**:
```javascript
// Measure actual response time
console.time('API Call');
await callAIAPI(input, template);
console.timeEnd('API Call');
```

**Solutions by Provider**:

| Provider | Expected Time | If Slower |
|----------|---------------|-----------|
| Groq | 0.5-2s | Switch model hoặc provider |
| Gemini | 1-3s | Rate limited? Wait |
| OpenRouter | 2-5s | Normal, pick faster model |

✅ **Switch to faster model**:
```javascript
// FASTEST
'llama-3.1-8b-instant' (Groq) // 0.5-1s

// FAST
'gemini-2.0-flash-exp' (Gemini) // 1-2s
'grok-4-fast' (OpenRouter) // 1-2s

// BALANCED (Quality vs Speed)
'deepseek-chat-v3.1' (OpenRouter) // 2-4s
```

✅ **Reduce max_tokens**:
```javascript
MAX_TOKENS: 1500  // Giảm từ 2000 → faster response
```

---

### Issue: "UI bị lag khi typing"

**Cause**: Không có debounce

**Check if debounce hoạt động**:
```javascript
// Trong script.js, search for "handleInputChange"
// Nên có debounce logic
```

**Solution**: Đã có trong code, nhưng có thể tăng delay:
```javascript
const DEBOUNCE_DELAY = 500; // ms

let debounceTimer;
function handleInputChange() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        // Actual handler
    }, DEBOUNCE_DELAY);
}
```

---

## 📊 OUTPUT QUALITY ISSUES

### Issue: "Output không đủ chi tiết"

**Diagnosis**:
```javascript
// Check word count
const wordCount = output.split(' ').length;
console.log('Word count:', wordCount);
// Should be 300-600 words
```

**Solutions**:

✅ **Improve input specificity** (quan trọng nhất!):
```
Bad: "Tạo app"
Good: "Tạo mobile app với features X, Y, Z. Tech stack: A, B, C. Requirements: ..."
```

✅ **Use better model**:
```javascript
// For detailed outputs
'deepseek-chat-v3.1'  // 5⭐ Best chat
'llama-3.3-70b'       // 5⭐ Excellent chat
'qwen3-coder-free'    // 5⭐ Best coding (detailed)

// Avoid lightweight models for complex tasks
'llama-3.2-3b'        // 3⭐ Too small for complex prompts
```

✅ **Check enhanced prompt active**:
```javascript
// Verify systemPrompt trong PROMPT_TEMPLATES.universal
// Should be ~200 lines (enhanced), not 1 line (old)
console.log(PROMPT_TEMPLATES.universal.systemPrompt.length);
// Should be ~2000+ characters
```

---

### Issue: "Output bị lặp hoặc repetitive"

**Cause**: Model hallucination hoặc temperature quá cao

**Solutions**:

✅ **Reduce temperature**:
```javascript
TEMPERATURE: 0.5  // Giảm từ 0.7
```

✅ **Add no-repeat instruction**:
```javascript
userInput += "\n\nIMPORTANT: Avoid repetition. Each section should have unique, non-redundant content."
```

✅ **Try different model**:
```javascript
// Some models handle repetition better
'deepseek-chat-v3.1'  // Good at avoiding repetition
'qwen3-14b'           // Well balanced
```

---

## 💻 DEVELOPMENT ISSUES

### Issue: "Cannot run proxy server - Python error"

**Error**: `ModuleNotFoundError: No module named 'flask'`

**Solution**:
```bash
# Install dependencies
pip install flask flask-cors requests

# hoặc
pip install -r requirements.txt

# Verify installation
pip list | findstr flask
```

**Error**: `Python was not found`

**Solution**:
```bash
# Install Python 3.8+
# Download: https://www.python.org/downloads/

# Add to PATH
setx PATH "%PATH%;C:\Python312"

# Verify
python --version
```

---

### Issue: "Port 3001 already in use"

**Error**: `Address already in use: 3001`

**Solution**:

✅ **Find và kill process**:
```powershell
# Find PID on port 3001
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess

# Kill process
Stop-Process -Id <PID> -Force
```

✅ **Use different port**:
```python
# Trong proxy-server-python.py
PORT = 3002  # Change from 3001

# Update trong script.js
PROXY_SERVER_URL: 'http://localhost:3002'
```

---

### Issue: "CORS errors in browser console"

**Error**: 
```
Access to fetch at 'http://localhost:3001/api/...' from origin 'http://localhost:8000' has been blocked by CORS policy
```

**Solution**:

✅ **Verify CORS enabled trong proxy**:
```python
# proxy-server-python.py
from flask_cors import CORS
app = Flask(__name__)
CORS(app)  # Should be present
```

✅ **Check browser loading from correct origin**:
```javascript
// Should be localhost:8000 hoặc localhost:3001
console.log(window.location.origin);
```

---

## 🧪 TESTING & DEBUGGING

### Debug Mode

```javascript
// Enable debug logging
APP_STATE.debug = true;

// Check provider status
console.log('Current Provider:', CONFIG.CURRENT_PROVIDER);
console.log('Current Model:', CONFIG.CURRENT_MODEL);

// Test API directly
await testAIConnection('openrouter');
await testAIConnection('groq');
await testAIConnection('gemini');
```

### Verbose Logging

```javascript
// Add trong callAIAPI function
console.log('📤 Request:', {
    provider: CONFIG.CURRENT_PROVIDER,
    model: CONFIG.CURRENT_MODEL,
    inputLength: userInput.length
});

console.log('📥 Response:', {
    success: data.success,
    outputLength: output.length,
    usage: data.usage
});
```

### Test Endpoints Manually

```bash
# Test server health
curl http://localhost:3001/health

# Test provider connections
curl http://localhost:3001/api/test-all

# Test actual generation
curl -X POST http://localhost:3001/api/openrouter/chat \
  -H "Content-Type: application/json" \
  -d '{"systemPrompt":"Test","userInput":"Hello","model":"deepseek-chat-v3.1"}'
```

---

## 📞 STILL NEED HELP?

### Step 1: Check Logs
- Browser Console (F12)
- Proxy Server Terminal
- Network tab trong DevTools

### Step 2: Collect Information
```
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox/Safari version X
- Provider: OpenRouter/Groq/Gemini
- Model: [model name]
- Error message: [exact error]
- Steps to reproduce: [1, 2, 3...]
```

### Step 3: Create GitHub Issue
```markdown
**Title**: [Brief description]

**Environment**:
- OS: Windows 10
- Browser: Chrome 120
- Version: 2.0.0

**Description**:
[What happened]

**Expected**:
[What should happen]

**Steps to Reproduce**:
1. ...
2. ...

**Logs**:
```
[Paste console errors]
```

**Screenshots**: [If applicable]
```

---

## ✅ PREVENTION CHECKLIST

Để tránh issues:

- [ ] Luôn start proxy server trước khi use app
- [ ] Test `/api/test-all` định kỳ
- [ ] Monitor rate limits (don't spam)
- [ ] Use appropriate models (free vs paid)
- [ ] Write detailed inputs (better outputs)
- [ ] Check console logs for errors
- [ ] Keep dependencies updated
- [ ] Backup working configurations

---

**Last Updated**: October 1, 2025  
**Version**: 2.0.0  
**Maintained by**: AI Prompt Assistant Team

