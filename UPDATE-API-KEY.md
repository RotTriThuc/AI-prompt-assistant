# 🔑 Cách thay đổi OpenAI API Key

## 🛠️ **Nếu bạn có API Key khác:**

### **Cách 1: Sửa trong Python Server**
```python
# Mở file: proxy-server-python.py
# Tìm dòng 22 và thay đổi:

OPENAI_CONFIG = {
    'API_KEY': 'sk-YOUR-NEW-API-KEY-HERE',  # ← Thay ở đây
    'MODEL': 'gpt-3.5-turbo',
    # ... rest của config
}
```

### **Cách 2: Sửa trong JavaScript Client**
```javascript
// Mở file: script.js  
// Tìm dòng 24 và thay đổi:

OPENAI_API_KEY: 'sk-YOUR-NEW-API-KEY-HERE',  // ← Thay ở đây
```

### **Sau khi sửa:**
1. **Restart server:** Kill Python và chạy lại
2. **Refresh browser:** Hard reload (Ctrl+F5)
3. **Test connection:** Thử tạo prompt

## 🧪 **Test API Key mới:**

```bash
# Test từ terminal:
Invoke-RestMethod -Uri "http://localhost:3001/api/test-openai" -Method Get

# Kết quả mong đợi:
{
  "success": true,
  "message": "OpenAI API connection successful"  
}
```

## 📊 **Check Quota trước khi dùng:**

1. **Login:** [OpenAI Platform](https://platform.openai.com/)
2. **Check Usage:** [Usage Dashboard](https://platform.openai.com/usage)
3. **Check Billing:** [Billing Settings](https://platform.openai.com/account/billing)

---

**💡 Lưu ý:** Demo Mode vẫn tạo prompt tốt, chỉ khác là không dùng AI thật.
