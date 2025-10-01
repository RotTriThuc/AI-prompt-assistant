# 🚀 Quick Start - API Key Encryption

## Mã hóa API keys trong 2 phút!

### ⚡ Cách nhanh nhất (Tự động)

```bash
# Bước 1: Cài đặt dependencies
npm install

# Bước 2: Tự động mã hóa API keys
npm run setup-encryption

# Bước 3: Chạy server với encrypted keys
npm run start-secure
```

**DONE!** ✅ API keys của bạn đã được mã hóa và bảo vệ!

---

## 📋 Giải thích các bước

### Bước 1: Install dependencies

```bash
npm install
```

Cài đặt:
- `express` - Web framework
- `cors` - CORS handling
- `node-fetch` - HTTP client
- `dotenv` - Environment variables

### Bước 2: Tự động mã hóa

```bash
npm run setup-encryption
```

Script `migrate-api-keys.js` sẽ:
1. Đọc API keys hiện tại từ `proxy-server.js`
2. Tạo encryption key ngẫu nhiên
3. Mã hóa tất cả API keys bằng AES-256-CBC
4. Tạo file `.env` với encrypted keys
5. Backup `.env` cũ nếu có

**Output mẫu:**
```
🔄 API Key Migration Tool
════════════════════════════════════════════════════════════════

📝 Step 1: Generating encryption key...
✅ Encryption key generated: your-32****key!!

🔐 Step 2: Encrypting API keys...

✅ GEMINI       - Encrypted successfully
   Original (masked): AIzaSy****AQAo
   Encrypted: 1a2b3c4d5e6f...

✅ OPENROUTER   - Encrypted successfully
   Original (masked): sk-or-****58f3
   Encrypted: 7g8h9i0j1k2l...

✅ GROQ         - Encrypted successfully
   Original (masked): gsk_LK****7cny
   Encrypted: 3m4n5o6p7q8r...

📝 Step 3: Creating .env file...
✅ .env file created successfully

🎉 Migration completed successfully!
```

### Bước 3: Chạy secure server

```bash
npm run start-secure
```

Server sẽ:
1. Load encrypted keys từ `.env`
2. Tự động giải mã khi khởi động
3. API hoạt động bình thường

**Output mẫu:**
```
🚀 ================================================================
🔐 AI Prompt Assistant SECURE Proxy Server v2.0
🛡️  AES-256-CBC Encrypted API Keys
🚀 ================================================================
📡 Server running on: http://localhost:3001

🔐 Security Status:
   • Encryption: AES-256-CBC ✅
   • Gemini API: ✅ Configured
   • OpenRouter API: ✅ Configured
   • Groq API: ✅ Configured
🚀 ================================================================

🔍 Testing all AI providers...
📊 3/3 providers working

🎉 Server ready!
```

---

## 🧪 Testing

### Test API connections

```bash
# Test tất cả providers
npm run test-all

# Test từng provider
npm run test-gemini
npm run test-openrouter
npm run test-groq

# Check server health
npm run check-health
```

### Test trong browser

1. Mở browser: http://localhost:3001
2. Nhập prompt bất kỳ
3. Chọn AI provider (OpenRouter/Gemini/Groq)
4. Click "Tạo Prompt"
5. Kiểm tra kết quả

---

## 🔧 Công cụ CLI

### Mã hóa API key mới

```bash
npm run encrypt-key
```

Hoặc:

```bash
node encryption-utils.js encrypt
```

### Giải mã để kiểm tra

```bash
npm run decrypt-key
```

### Tạo encryption key mới

```bash
npm run generate-key
```

---

## 📁 Files được tạo

Sau khi chạy setup:

```
project/
├── .env                    # 🔐 API keys đã mã hóa (GIT IGNORE)
├── .env.backup.xxxxx      # 📦 Backup file .env cũ (nếu có)
├── encryption-utils.js     # 🛠️ Encryption utilities
├── migrate-api-keys.js     # 🔄 Migration script
├── proxy-server-secure.js  # 🛡️ Secure proxy server
└── .gitignore             # 📝 Updated với .env
```

---

## ✅ Verification Checklist

### Sau khi setup, kiểm tra:

- [ ] File `.env` đã được tạo
- [ ] `.env` có trong `.gitignore`
- [ ] Server khởi động thành công
- [ ] Test API providers: `npm run test-all`
- [ ] Frontend hoạt động bình thường
- [ ] Git status không hiện `.env`

### Lệnh kiểm tra nhanh:

```bash
# Check .env exists
ls -la .env

# Check .gitignore
cat .gitignore | grep .env

# Check Git won't track .env
git status | grep .env  # Should return nothing

# Test server
npm run start-secure &
sleep 3
npm run test-all
```

---

## 🔒 Security Notes

### ⚠️ QUAN TRỌNG:

1. **KHÔNG commit file `.env`** - đã được add vào `.gitignore`
2. **Backup `ENCRYPTION_KEY`** - nếu mất key, không thể decrypt
3. **Xóa hardcoded keys** - sau khi migrate, xóa keys cũ khỏi code
4. **Dùng `.env` cho mọi environment** - dev, staging, production

### 🔐 Bảo mật tốt nhất:

```bash
# Development
.env                 # Local keys (encrypted)

# Production
.env.production      # Production keys (encrypted khác)

# Không commit cả 2 files này!
```

---

## 🆘 Troubleshooting

### Lỗi: "Cannot find module 'dotenv'"

```bash
npm install dotenv
```

### Lỗi: "Decryption failed"

```bash
# Re-run migration
npm run setup-encryption
```

### Lỗi: "API key not configured"

```bash
# Check .env file exists
ls .env

# If not, run migration
npm run setup-encryption
```

### Server không start

```bash
# Check logs
npm run start-secure

# Verify .env format
cat .env

# Test encryption utilities
npm run encrypt-key
```

---

## 📊 So sánh Before/After

### ❌ Before (Không an toàn):

```javascript
// proxy-server.js
const GEMINI_API_KEY = 'AIzaSyDAnBQKPWkJigLq_Hiy4PmqPvLkdW2AQAo'; // 🔴 EXPOSED!
const OPENROUTER_API_KEY = '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'; // 🔴 EXPOSED!
```

**Vấn đề:**
- API keys trong source code
- Sẽ bị lộ khi commit Git
- Khó rotate/update keys

### ✅ After (An toàn):

```javascript
// proxy-server-secure.js
const API_KEY = loadAPIKey('GEMINI'); // 🟢 From encrypted .env
```

**.env file:**
```bash
ENCRYPTION_KEY="your-32-character-secret-key!!"
GEMINI_API_KEY_ENCRYPTED="1a2b3c4d:9f8e7d6c..." # 🟢 ENCRYPTED!
```

**Lợi ích:**
- Keys được mã hóa AES-256
- `.env` không commit Git
- Dễ rotate/update keys
- Tách biệt config khỏi code

---

## 🎯 Next Steps

Sau khi setup encryption thành công:

### 1. Cleanup old code

```bash
# Xóa hoặc comment hardcoded keys trong proxy-server.js
# Hoặc chuyển hoàn toàn sang proxy-server-secure.js

# Update package.json default script
npm config set start-command "node proxy-server-secure.js"
```

### 2. Setup cho team

```bash
# Chia sẻ ENCRYPTION_KEY qua kênh bảo mật (1Password, LastPass)
# Tạo .env.template cho team members
# Document setup process

# Team members chỉ cần:
npm install
# Copy ENCRYPTION_KEY vào .env
npm run start-secure
```

### 3. Production deployment

```bash
# Tạo production keys
npm run encrypt-key  # Encrypt production API keys

# Set environment variables trên hosting
ENCRYPTION_KEY=xxx
GEMINI_API_KEY_ENCRYPTED=xxx
OPENROUTER_API_KEY_ENCRYPTED=xxx
GROQ_API_KEY_ENCRYPTED=xxx

# Deploy
git push production main
```

---

## 📚 Tài liệu đầy đủ

Xem thêm:
- [SECURITY-SETUP-GUIDE.md](./SECURITY-SETUP-GUIDE.md) - Hướng dẫn chi tiết
- [encryption-utils.js](./encryption-utils.js) - Source code encryption
- [ENV_TEMPLATE.txt](./ENV_TEMPLATE.txt) - Template file .env

---

**Happy Secure Coding! 🔐🚀**

