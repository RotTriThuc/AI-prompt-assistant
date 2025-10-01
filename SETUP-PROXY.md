# 🛡️ Setup Proxy Server - Giải quyết CORS Issue

> **Vấn đề:** Browser không cho phép gọi OpenAI API trực tiếp do CORS policy  
> **Giải pháp:** Proxy server bypass CORS và gọi OpenAI API từ server-side

## 🚀 **Cách Setup (Đơn giản - 3 bước)**

### **Bước 1: Install Dependencies**
```bash
# Mở Terminal/CMD trong thư mục project
npm install

# Hoặc install từng package
npm install express cors node-fetch
```

### **Bước 2: Chạy Proxy Server**
```bash
npm start

# Hoặc
node proxy-server.js
```

**Kết quả mong đợi:**
```
🚀 =================================
🤖 AI Prompt Assistant Proxy Server  
🚀 =================================
📡 Server running on: http://localhost:3001
🔗 Main App: http://localhost:3001/
📊 Health Check: http://localhost:3001/health
🧪 Test OpenAI: http://localhost:3001/api/test-openai
📝 API Info: http://localhost:3001/api/info
🚀 =================================

✅ OpenAI connection verified on startup!
```

### **Bước 3: Mở App**
```bash
# Mở browser và truy cập:
http://localhost:3001

# App sẽ tự động detect proxy server và sử dụng OpenAI GPT-4!
```

---

## 🧪 **Test & Verify**

### **1. Test Proxy Server**
```bash
curl http://localhost:3001/health
curl http://localhost:3001/api/test-openai
```

### **2. Test OpenAI Integration trong App**
- Mở app tại `http://localhost:3001`
- Nhập prompt: "Tạo website portfolio"
- Nhấn "Tạo Prompt" 
- Kiểm tra console logs

### **3. Kiểm tra Status**
- Statistics hiển thị: **"AI Engine: OpenAI GPT-4"** (màu xanh)
- Console logs: **"✅ Đã nhận response từ OpenAI API"**

---

## 🔧 **Troubleshooting**

### **Lỗi: Cannot find module**
```bash
npm install express cors node-fetch
```

### **Lỗi: Port 3001 already in use**
```bash
# Tìm và kill process đang dùng port 3001
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F

# Hoặc đổi port trong proxy-server.js
const PORT = 3002;
```

### **Lỗi: OpenAI API Error 401**
- Kiểm tra API key trong `proxy-server.js`
- Verify balance tài khoản OpenAI

### **App vẫn chạy Demo Mode**
- Đảm bảo proxy server đang chạy
- Mở app từ `http://localhost:3001` (không phải file://)

---

## 📊 **Architecture**

```
Browser App (localhost:3001) 
    ↓ (No CORS)
Proxy Server (Express.js)
    ↓ (Server-to-Server)  
OpenAI API (api.openai.com)
    ↓
GPT-4 Response
    ↓
Browser (Prompt hoàn chỉnh)
```

---

## 🎯 **Next Steps**

1. ✅ **Start Server:** `npm start`
2. ✅ **Open App:** `http://localhost:3001`  
3. ✅ **Test Prompt:** Nhập bất kỳ yêu cầu nào
4. ✅ **Verify:** Check "AI Engine: OpenAI GPT-4"

**🎉 Enjoy your AI-powered prompt generator!**
