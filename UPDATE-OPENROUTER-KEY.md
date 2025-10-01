# 🔑 Cách Update OpenRouter API Key

## 🎯 HƯỚNG DẪN CHI TIẾT

### Bước 1: Lấy API Key Mới

1. **Truy cập:** https://openrouter.ai/keys

2. **Đăng nhập hoặc Đăng ký:**
   - Email + Password
   - Hoặc dùng Google/GitHub login

3. **Tạo API Key mới:**
   - Click button **"Create Key"**
   - Name: `AI Prompt Assistant`
   - Limit (optional): Không giới hạn hoặc set quota
   - Click **"Create"**
   
4. **Copy API Key:**
   - Key sẽ bắt đầu với: `sk-or-v1-...`
   - ⚠️ **QUAN TRỌNG:** Copy ngay, chỉ hiển thị 1 lần!

---

### Bước 2: Update trong Node.js Server

**File:** `proxy-server.js`  
**Dòng:** 42

**Tìm đoạn code:**
```javascript
const OPENROUTER_CONFIG = {
    API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    API_KEY: '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',
    MODEL: 'deepseek/deepseek-chat-v3.1:free',
    // ...
};
```

**Thay đổi thành:**
```javascript
const OPENROUTER_CONFIG = {
    API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    API_KEY: 'YOUR-NEW-KEY-HERE',  // ← Paste key mới vào đây
    MODEL: 'deepseek/deepseek-chat-v3.1:free',
    // ...
};
```

---

### Bước 3: Update trong Python Server (Optional)

**File:** `proxy-server-python.py`  
**Dòng:** 31

**Tìm đoạn code:**
```python
OPENROUTER_CONFIG = {
    'API_URL': 'https://openrouter.ai/api/v1/chat/completions',
    'API_KEY': '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',
    'MODEL': 'deepseek/deepseek-chat-v3.1:free',
    # ...
}
```

**Thay đổi thành:**
```python
OPENROUTER_CONFIG = {
    'API_URL': 'https://openrouter.ai/api/v1/chat/completions',
    'API_KEY': 'YOUR-NEW-KEY-HERE',  # ← Paste key mới vào đây
    'MODEL': 'deepseek/deepseek-chat-v3.1:free',
    # ...
}
```

---

### Bước 4: Restart Server

**Windows PowerShell:**
```bash
# 1. Stop server hiện tại (Ctrl+C)

# 2. Start lại server
cd C:\Users\NaNa\Desktop\PROJECT\CURSOR\AI-prompt-assistant
node proxy-server.js
```

**Hoặc dùng batch file:**
```bash
start-server.bat
```

---

### Bước 5: Verify API Key

Server sẽ tự động test khi khởi động:

**✅ Thành công:**
```
📊 Test Results: 3/3 providers working

✅ Gemini: Connected
✅ OpenRouter: Connected  ← Thấy dòng này là OK!
✅ Groq: Connected
```

**❌ Vẫn lỗi:**
```
❌ OpenRouter: Failed - ...
```

→ Check lại API key có đúng format không  
→ Check account OpenRouter có credits không  
→ Try một lần nữa sau 1-2 phút

---

## 🧪 TEST API KEY TRƯỚC KHI UPDATE

**Để đảm bảo API key mới hoạt động:**

```bash
# Chạy test script
node test-openrouter-direct.js
```

**Update API key trong file `test-openrouter-direct.js` dòng 7:**
```javascript
const API_KEY = 'YOUR-NEW-KEY-HERE';
```

**Chạy lại:**
```bash
node test-openrouter-direct.js
```

**Expected output:**
```
✅ SUCCESS! API Key is valid!
```

---

## 💡 TROUBLESHOOTING

### Problem 1: "User not found" (401)
- ✅ API key sai format
- ✅ Account không tồn tại
- ✅ API key chưa activated

**Solution:** Lấy key mới từ https://openrouter.ai/keys

### Problem 2: "Insufficient credits" (402)
- ✅ Account hết credits
- ✅ Payment method chưa setup

**Solution:** 
- Add credits tại: https://openrouter.ai/credits
- OpenRouter cho $0.10 free credits để test

### Problem 3: "Rate limit exceeded" (429)
- ✅ Quá nhiều requests
- ✅ Free tier limit

**Solution:** Đợi 1 phút rồi thử lại

### Problem 4: Server vẫn lỗi sau khi update
- ✅ Server chưa restart
- ✅ Cache browser

**Solution:**
```bash
# 1. Stop server (Ctrl+C)
# 2. Clear cache: Ctrl+Shift+Delete trong browser
# 3. Restart server
node proxy-server.js
# 4. Hard refresh browser: Ctrl+Shift+R
```

---

## 🎯 OPENROUTER ACCOUNT SETUP TIPS

### 1. Free Credits
OpenRouter cho **$0.10 free credits** khi đăng ký

### 2. Free Models
Tất cả 16 models trong app đều **MIỄN PHÍ** (`:free` suffix)

### 3. Billing
- Không cần credit card để dùng free models
- Chỉ cần verify email

### 4. Rate Limits
- Free tier: ~60 requests/minute
- Đủ cho personal use

---

## 📞 HỖ TRỢ

**Nếu gặp vấn đề:**

1. **Check OpenRouter Status:**  
   https://status.openrouter.ai

2. **OpenRouter Discord:**  
   https://discord.gg/openrouter

3. **Documentation:**  
   https://openrouter.ai/docs

4. **Email Support:**  
   support@openrouter.ai

---

## ✅ CHECKLIST

- [ ] Lấy API key mới từ OpenRouter
- [ ] Copy API key (bắt đầu với `sk-or-v1-`)
- [ ] Update trong `proxy-server.js` dòng 42
- [ ] (Optional) Update trong `proxy-server-python.py` dòng 31
- [ ] Stop server cũ (Ctrl+C)
- [ ] Start server mới (`node proxy-server.js`)
- [ ] Verify "✅ OpenRouter: Connected" trong console
- [ ] Test trong app - chọn OpenRouter provider
- [ ] Generate prompts thành công!

---

**Tạo bởi:** Claude Sonnet 4.5  
**Ngày:** 1 Tháng 10, 2025  
**Status:** Ready to use

