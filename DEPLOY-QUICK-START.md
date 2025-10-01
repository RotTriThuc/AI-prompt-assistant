# 🚀 Deploy Quick Start Guide

## ⚡ **DEPLOY NHANH TRONG 5 PHÚT**

### 📋 **Prerequisites:**
- ✅ Tài khoản GitHub
- ✅ Tài khoản Vercel (miễn phí) - **KHUYẾN NGHỊ**
- ✅ Git đã cài đặt
- ✅ API keys của bạn (OpenRouter, Gemini, Groq)

---

## 🎯 **OPTION 1: Deploy với Vercel (KHUYẾN NGHỊ)**

### **Bước 1: Chuẩn bị dự án**

```bash
# 1. Xóa API keys khỏi code (QUAN TRỌNG!)
# Mở proxy-server-python.py và thay thế:
OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY', '')
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')

# 2. Init Git (nếu chưa có)
git init
git add .
git commit -m "Initial commit - AI Prompt Assistant"

# 3. Push lên GitHub
# Tạo repo mới trên GitHub, sau đó:
git remote add origin https://github.com/your-username/ai-prompt-assistant.git
git branch -M main
git push -u origin main
```

### **Bước 2: Deploy với Vercel**

```bash
# Cài Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Thêm environment variables (API keys)
vercel env add OPENROUTER_API_KEY
# Paste your OpenRouter API key

vercel env add GEMINI_API_KEY
# Paste your Gemini API key

vercel env add GROQ_API_KEY
# Paste your Groq API key

# Deploy production
vercel --prod
```

### **Bước 3: Cấu hình Vercel (Web UI)**

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project vừa deploy
3. Settings → Environment Variables
4. Add variables:
   - `OPENROUTER_API_KEY`: `sk-or-v1-xxxxx`
   - `GEMINI_API_KEY`: `AIzaSy-xxxxx`
   - `GROQ_API_KEY`: `gsk_xxxxx`
5. Redeploy

✅ **XONG!** Dự án của bạn đã live tại: `https://your-project.vercel.app`

---

## 📦 **OPTION 2: Deploy GitHub Pages (Static Only)**

### **⚠️ LƯU Ý:**
- Proxy server KHÔNG hoạt động
- API calls phải gọi trực tiếp từ client
- CORS issues có thể xảy ra
- Chỉ nên dùng cho demo/prototype

### **Bước 1: Modify code cho client-side only**

```javascript
// Trong script.js, thay đổi:

// TỪ:
const proxyUrl = `${CONFIG.PROXY_SERVER_URL}${providerConfig.endpoint}`;

// THÀNH:
const directUrl = 'https://openrouter.ai/api/v1/chat/completions';

// Hoặc dùng Gemini (CORS-friendly):
const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`;
```

### **Bước 2: Setup GitHub Pages**

```bash
# 1. Push code lên GitHub
git init
git add .
git commit -m "GitHub Pages ready"
git remote add origin https://github.com/your-username/ai-prompt-assistant.git
git push -u origin main

# 2. Enable GitHub Pages
# - Vào Settings → Pages
# - Source: Deploy from branch
# - Branch: main, folder: / (root)
# - Save
```

✅ **XONG!** Site của bạn tại: `https://your-username.github.io/ai-prompt-assistant`

---

## 🔒 **QUAN TRỌNG: Bảo mật API Keys**

### **❌ KHÔNG BAO GIỜ:**
```javascript
// KHÔNG làm thế này:
const API_KEY = "sk-or-v1-xxxxx"; // Hardcoded
```

### **✅ ĐÚNG CÁCH:**

**Option A: User Input (cho GitHub Pages)**
```javascript
const API_KEY = localStorage.getItem('openrouter_key') || 
                prompt("Enter your OpenRouter API key:");
localStorage.setItem('openrouter_key', API_KEY);
```

**Option B: Environment Variables (cho Vercel)**
```python
import os
OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY')
```

---

## 🐛 **Troubleshooting**

### **Lỗi: "Git not recognized"**
```bash
# Cài Git tại: https://git-scm.com/download/win
# Sau khi cài, restart terminal
```

### **Lỗi: CORS issues**
```javascript
// Solution 1: Dùng Vercel/Netlify với serverless functions
// Solution 2: Thêm CORS headers trong proxy:
response.headers['Access-Control-Allow-Origin'] = '*'
```

### **Lỗi: API keys không hoạt động**
```bash
# Verify env variables:
vercel env ls

# Pull env to local:
vercel env pull
```

### **Lỗi: Deployment failed**
```bash
# Check logs:
vercel logs

# Redeploy:
vercel --prod --force
```

---

## 📊 **So sánh Options**

| Feature | Vercel | GitHub Pages | Heroku |
|---------|--------|--------------|--------|
| **Giá** | ✅ Free | ✅ Free | ⚠️ Paid |
| **Serverless** | ✅ Yes | ❌ No | ✅ Yes |
| **Env Vars** | ✅ Yes | ❌ No | ✅ Yes |
| **Auto Deploy** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Custom Domain** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Setup Time** | ⚡ 5 min | ⚡ 3 min | ⏱️ 15 min |
| **Khuyến nghị** | 🏆 **BEST** | 📝 Demo only | 🚀 Scale |

---

## ✅ **Checklist hoàn thành**

- [ ] Xóa API keys khỏi code
- [ ] Tạo .gitignore
- [ ] Init Git repository
- [ ] Push lên GitHub
- [ ] Deploy với Vercel/GitHub Pages
- [ ] Add environment variables
- [ ] Test live site
- [ ] Update README với live URL

---

## 🎉 **Sau khi Deploy**

### **Cập nhật README.md:**
```markdown
## 🌐 Live Demo

- **Production:** https://your-project.vercel.app
- **GitHub Repo:** https://github.com/your-username/ai-prompt-assistant
```

### **Share với team:**
```
🎉 AI Prompt Assistant is now live!

🌐 URL: https://your-project.vercel.app
📚 Docs: https://github.com/your-username/ai-prompt-assistant
🔧 Setup: See README.md for API key configuration
```

---

## 📞 **Cần hỗ trợ?**

1. **Vercel Issues:** [Vercel Support](https://vercel.com/support)
2. **GitHub Pages:** [GitHub Docs](https://docs.github.com/pages)
3. **Git Help:** [Git Book](https://git-scm.com/book)

---

*Happy Deploying! 🚀*
*Generated by Claude Sonnet 4*
