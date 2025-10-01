# 🔐 Security Setup Guide - API Key Encryption

## Tổng quan

Hướng dẫn này giúp bạn mã hóa API keys để bảo vệ chúng khỏi bị lộ khi push code lên Git hoặc chia sẻ code.

### 🎯 Lợi ích của việc mã hóa API keys:

1. ✅ **Bảo mật**: API keys được mã hóa bằng AES-256-CBC
2. ✅ **Không lo commit nhầm**: File `.env` đã được thêm vào `.gitignore`
3. ✅ **Dễ quản lý**: Tách biệt API keys khỏi source code
4. ✅ **Hoạt động bình thường**: API vẫn chạy như cũ, chỉ khác là keys được bảo vệ

---

## 🚀 Quick Start (3 bước)

### Bước 1: Cài đặt dependencies

```bash
npm install
```

### Bước 2: Tự động mã hóa API keys hiện tại

```bash
node migrate-api-keys.js
```

Script này sẽ:
- Tự động tạo encryption key
- Mã hóa tất cả API keys hiện tại
- Tạo file `.env` với encrypted keys
- Backup file `.env` cũ nếu có

### Bước 3: Chạy server với encrypted keys

```bash
# Sử dụng proxy server mới (secure version)
node proxy-server-secure.js

# HOẶC update script trong package.json
npm run start-secure
```

---

## 📋 Hướng dẫn chi tiết

### 1. Cấu trúc Files

```
project/
├── encryption-utils.js          # Utilities mã hóa/giải mã
├── migrate-api-keys.js          # Script tự động migration
├── proxy-server-secure.js       # Server version với encrypted keys
├── .env                         # API keys đã mã hóa (KHÔNG commit Git)
├── .env.template                # Template cho .env (có thể commit)
└── .gitignore                   # Đã config ignore .env
```

### 2. Environment Variables (.env)

File `.env` được tạo tự động, có cấu trúc:

```bash
# Encryption key
ENCRYPTION_KEY="your-32-character-secret-key!!"

# Encrypted API keys
GEMINI_API_KEY_ENCRYPTED="iv:encryptedData"
OPENROUTER_API_KEY_ENCRYPTED="iv:encryptedData"
GROQ_API_KEY_ENCRYPTED="iv:encryptedData"
```

### 3. Cách hoạt động

1. **Khi server khởi động**:
   - Đọc encrypted keys từ `.env`
   - Sử dụng `ENCRYPTION_KEY` để giải mã
   - Load API keys vào memory
   - API hoạt động bình thường

2. **Mã hóa sử dụng**:
   - Algorithm: AES-256-CBC
   - Key derivation: PBKDF2
   - IV (Initialization Vector): Random cho mỗi lần encrypt

---

## 🛠️ Công cụ CLI

### Mã hóa API key thủ công

```bash
node encryption-utils.js encrypt
```

Sau đó nhập:
- API key cần mã hóa
- Provider name (gemini/openrouter/groq)
- Encryption password (hoặc Enter để dùng default)

### Giải mã API key (để kiểm tra)

```bash
node encryption-utils.js decrypt
```

### Tạo encryption key mới

```bash
node encryption-utils.js generate-key
```

---

## 🔄 Migration từ Hardcoded Keys

### Option 1: Tự động (Khuyến nghị)

```bash
# Chạy migration script
node migrate-api-keys.js

# Script sẽ:
# 1. Mã hóa tất cả API keys từ proxy-server.js
# 2. Tạo file .env với encrypted keys
# 3. Backup .env cũ nếu có
```

### Option 2: Thủ công

1. **Mã hóa từng API key**:
```bash
node encryption-utils.js encrypt
```

2. **Copy encrypted keys vào .env**:
```bash
GEMINI_API_KEY_ENCRYPTED="iv:encryptedDataHere"
```

3. **Test kết nối**:
```bash
node proxy-server-secure.js
# Mở browser: http://localhost:3001/api/test-all
```

---

## ✅ Checklist Bảo mật

### Trước khi commit code:

- [ ] `.env` đã được thêm vào `.gitignore`
- [ ] Không có API keys hardcoded trong source code
- [ ] Đã test server với encrypted keys
- [ ] File `.env` không xuất hiện trong git status

### Sau khi setup:

- [ ] Backup file `.env` an toàn (không lưu trong repo)
- [ ] Lưu `ENCRYPTION_KEY` ở nơi bảo mật
- [ ] Document cho team members cách setup
- [ ] Xóa hardcoded API keys khỏi proxy-server.js cũ

---

## 🔍 Testing & Verification

### Test 1: Kiểm tra encryption/decryption

```bash
# Encrypt một key
node encryption-utils.js encrypt

# Sau đó decrypt ngay
node encryption-utils.js decrypt
# Paste encrypted key vừa tạo

# Kết quả phải giống key ban đầu
```

### Test 2: Kiểm tra server hoạt động

```bash
# Start secure server
node proxy-server-secure.js

# Test tất cả providers
curl http://localhost:3001/api/test-all

# Kết quả mong đợi:
# {
#   "summary": {
#     "working_providers": 3,
#     "total_providers": 3
#   }
# }
```

### Test 3: Kiểm tra API calls

```bash
# Test frontend
# Mở browser: http://localhost:3001
# Nhập prompt và test tất cả providers
```

---

## 🆘 Troubleshooting

### Lỗi: "Decryption failed"

**Nguyên nhân**: Encryption key không khớp

**Giải pháp**:
```bash
# Kiểm tra ENCRYPTION_KEY trong .env
# Phải giống với key đã dùng để encrypt

# Nếu mất key, phải encrypt lại:
node migrate-api-keys.js
```

### Lỗi: "API key not configured"

**Nguyên nhân**: File `.env` không tồn tại hoặc thiếu keys

**Giải pháp**:
```bash
# Tạo .env từ template
cp ENV_TEMPLATE.txt .env

# Chạy migration
node migrate-api-keys.js

# Hoặc encrypt thủ công
node encryption-utils.js encrypt
```

### Lỗi: "Cannot find module 'dotenv'"

**Nguyên nhân**: Thiếu dependencies

**Giải pháp**:
```bash
npm install dotenv
# hoặc
npm install
```

---

## 🔐 Best Practices

### 1. Quản lý Encryption Key

**✅ NÊN:**
- Lưu trong password manager (1Password, LastPass, Bitwarden)
- Lưu trong secret manager (AWS Secrets Manager, Azure Key Vault)
- Backup ở nhiều nơi an toàn

**❌ KHÔNG:**
- Commit vào Git
- Lưu trong file text thường
- Chia sẻ qua email/chat

### 2. Rotate API Keys định kỳ

```bash
# Mỗi 3-6 tháng:
# 1. Tạo API keys mới từ providers
# 2. Encrypt keys mới
# 3. Update .env
# 4. Xóa keys cũ ở providers
```

### 3. Multiple Environments

```bash
# Development
.env                # Local dev keys

# Production  
.env.production     # Production keys (encrypted khác)

# Staging
.env.staging        # Staging keys
```

---

## 📚 Tài liệu kỹ thuật

### Encryption Algorithm

- **Algorithm**: AES-256-CBC
- **Key Size**: 256 bits (32 bytes)
- **IV Length**: 16 bytes (random per encryption)
- **Key Derivation**: PBKDF2 (100,000 iterations)
- **Hash**: SHA-256

### Format của Encrypted Key

```
iv:encryptedData
│  │
│  └─ Encrypted API key (hex)
└─ Initialization Vector (hex)

Example:
a1b2c3d4e5f6....:9f8e7d6c5b4a....
```

### Security Features

1. **Unique IV per encryption**: Ngăn pattern analysis
2. **PBKDF2 key derivation**: Chống brute force
3. **AES-256-CBC**: Military-grade encryption
4. **No key storage in code**: Keys chỉ trong .env

---

## 🎯 Kết luận

Sau khi hoàn thành setup:

✅ **API keys được mã hóa an toàn**
✅ **Không lo lộ keys khi commit Git**
✅ **API vẫn hoạt động bình thường**
✅ **Dễ dàng rotate/update keys**

### Câu hỏi thường gặp

**Q: API có chậm hơn không khi dùng encrypted keys?**
A: Không. Decryption chỉ chạy 1 lần khi server start, không ảnh hưởng performance.

**Q: Mất encryption key thì sao?**
A: Phải tạo keys mới và encrypt lại. Backup encryption key rất quan trọng!

**Q: Có thể dùng keys cũ (hardcoded) không?**
A: Có, proxy-server-secure.js hỗ trợ cả plain keys (fallback). Nhưng nên dùng encrypted.

---

## 📞 Support

Nếu gặp vấn đề:

1. Kiểm tra logs khi start server
2. Verify .env file tồn tại và có đúng format
3. Test encryption/decryption utilities
4. Xem Troubleshooting section

**Happy Coding! 🚀**

