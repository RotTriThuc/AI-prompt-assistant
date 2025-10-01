# 🤖 AI Prompt Assistant v2.0

> **Biến ý tưởng đơn giản thành prompt hoàn chỉnh với sức mạnh Triple AI Providers**

Công cụ AI hỗ trợ prompt thông minh thế hệ mới, tích hợp OpenRouter AI (GPT-4, Claude, Llama) + Google Gemini + Groq AI (siêu tốc) để tạo ra những prompt chi tiết, chuyên nghiệp và hiệu quả vượt trội.

![AI Prompt Assistant](https://img.shields.io/badge/Version-2.0.0-brightgreen) ![AI Providers](https://img.shields.io/badge/AI%20Providers-3-blue) ![Models](https://img.shields.io/badge/Models-15%2B-orange) ![Built with](https://img.shields.io/badge/Built%20with-Claude%20Sonnet%204-purple) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Tính năng nổi bật

### 🚀 **Triple AI Providers Architecture (100% FREE)**
- **OpenRouter AI**: Qwen3 Coder 480B, Mistral Small 3.2, DeepSeek V3.1, Devstral Small (Chuyên coding)
- **Google Gemini 2.0 Flash**: Miễn phí, nhanh chóng với 15 requests/minute
- **Groq AI**: 8 models miễn phí siêu tốc (Llama 3.1, 3.2, Mixtral, Gemma, Whisper)
- **Smart Fallback**: Tự động chuyển provider nếu một provider gặp lỗi
- **Dynamic Model Selection**: 50+ models miễn phí để lựa chọn theo nhu cầu

### 🎯 **Advanced AI Selection**
- **Provider Switching**: Dễ dàng chuyển đổi giữa OpenRouter, Groq, và Gemini
- **Model Optimization**: Chọn model phù hợp (speed vs quality vs cost)
- **Real-time Status**: Hiển thị provider và model đang sử dụng
- **Usage Analytics**: Theo dõi token usage và performance

### 🧠 **AI Thinking Process**
- Hiển thị quá trình suy nghĩ từng bước của AI
- Phân tích ngữ cảnh và mục đích của yêu cầu
- Logic xử lý thông minh với 5 giai đoạn thinking

### 📋 **Multi-Category Templates**
- **💻 Code**: Lập trình, API, ứng dụng web
- **🎨 Creative**: Content marketing, brand, storytelling  
- **💼 Business**: Kinh doanh, strategy, market analysis
- **📊 Analysis**: Phân tích dữ liệu, statistics, insights
- **📚 Education**: Giáo dục, curriculum, learning design
- **🔬 Research**: Nghiên cứu học thuật, literature review

### 🎯 **Smart Features**
- **Auto-Detection**: Tự động nhận diện category từ input
- **Real-time Preview**: Hiệu ứng typing realistic  
- **History Tracking**: Lưu trữ và quản lý lịch sử prompts
- **One-Click Actions**: Copy, Save, Share với một click
- **Responsive Design**: Hoạt động mượt mà trên mọi thiết bị

## 🚀 Cách sử dụng

### 1. **Nhập ý tưởng đơn giản**
```
Ví dụ: "Tôi muốn tạo một website bán hàng online"
```

### 2. **Chọn category (tùy chọn)**
- Để "Tự động nhận diện" hoặc chọn category cụ thể
- AI sẽ tự động detect category phù hợp nhất

### 3. **Nhấn "Tạo Prompt"**
- Xem AI thinking process từng bước
- Nhận prompt hoàn chỉnh với structure chi tiết

### 4. **Sử dụng kết quả**
- **Copy**: Sao chép prompt để dùng với AI khác
- **Save**: Lưu vào thư viện cá nhân  
- **Share**: Chia sẻ với team/bạn bè

## 💡 Ví dụ sử dụng với Dual Providers

| Input đơn giản | AI Provider | Model | Output Quality |
|----------------|-------------|-------|----------------|
| "Tạo app todo list" | OpenRouter | GPT-4o | Full-stack development với enterprise architecture, security, testing, deployment |
| "Viết content cho Instagram" | OpenRouter | Claude-3 Sonnet | Content strategy sáng tạo với psychology analysis, brand voice, engagement metrics |  
| "Mở quán cafe" | Gemini 2.0 Flash | (Free) | Business plan chi tiết với market research, financial modeling, risk assessment |
| "Phân tích dữ liệu bán hàng" | OpenRouter | GPT-4o Mini | Data science workflow với advanced analytics, ML models, visualizations |

### 🎯 **Model Selection Guide**

| Use Case | Recommended Provider | Model | Lý do |
|----------|---------------------|-------|--------|
| **Quick Tasks** | Gemini | 2.0 Flash | Miễn phí, nhanh chóng |
| **Creative Writing** | OpenRouter | Claude-3 Opus | Chất lượng sáng tạo cao nhất |
| **Code Generation** | OpenRouter | GPT-4o | Code quality tốt nhất |
| **Cost-Effective** | OpenRouter | GPT-4o Mini | Cân bằng giá/chất lượng |
| **Complex Analysis** | OpenRouter | GPT-4o | Khả năng reasoning mạnh |

## 🛠 Cài đặt & Chạy

### **🚀 Setup Triple AI Providers (OpenRouter + Groq + Gemini)**

**⚠️ Vấn đề CORS:** Browser không cho phép gọi AI APIs trực tiếp  
**✅ Giải pháp:** Sử dụng Proxy Server v2.0 với triple provider support

#### **🎯 Quick Start (Khuyến nghị)**

**Bước 1:** Double-click file `RUNSERVER.bat` (Khởi động đầy đủ)  
**Bước 2:** Chờ cả HTTP server (port 8000) và Proxy server (port 3001) khởi động  
**Bước 3:** Browser tự động mở đến: `http://localhost:8000`

**Hoặc sử dụng cách riêng lẻ:**
- **Proxy Server only:** Double-click `start-python-server.bat` → Mở `http://localhost:3001`
- **HTTP Server only:** Double-click `open-browser.bat` (sau khi proxy đã chạy)

```bash
# Hoặc chạy manual:
pip install flask flask-cors requests
python proxy-server-python.py
```

**Console Output:**
```
🚀 AI Prompt Assistant Proxy Server v2.0 (Python)
🤖 Triple-Provider: Google Gemini + OpenRouter AI + Groq AI

🧪 Test Endpoints:
   • Test Gemini: http://localhost:3001/api/test-openai
   • Test OpenRouter: http://localhost:3001/api/test-openrouter
   • Test Groq: http://localhost:3001/api/test-groq
   • Test All: http://localhost:3001/api/test-all

💬 Chat Endpoints:
   • OpenRouter Chat: POST /api/openrouter/chat
   • Groq Chat: POST /api/groq/chat
   • Universal Chat: POST /api/chat/universal

🎯 Default Provider: OPENROUTER
🆓 Gemini: 15 requests/minute (Free)
⚡ Groq: Free tier với siêu tốc độ inference  
🆓 OpenRouter: Free models only (Qwen3, Mistral, DeepSeek)
```

#### **🔑 API Keys (Đã tích hợp sẵn)**

- **OpenRouter AI Key**: `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`
  - ✅ **100% Free Models Only**: 58 models miễn phí bao gồm tất cả models từ Qwen, Llama, Mistral, DeepSeek, Google, NVIDIA, Z.AI GLM, và nhiều hơn nữa
  - 🚫 **Đã loại bỏ**: Tất cả models có phí (GPT-4o, Claude, v.v.)
- **Groq AI Key**: `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`
  - ✅ **Hoàn toàn miễn phí** (có giới hạn rate limit)
- **Google Gemini Key**: `AIzaSyDAnBQKPWkJigLq_Hiy4PmqPvLkdW2AQAo`
  - ✅ **Hoàn toàn miễn phí** (15 requests/phút)


#### **🆓 Optimized Free Models (16 Models)**

**🏆 5-Star Models (8 models):**
- Qwen3 Coder 480B - Best Coding Model
- DeepSeek R1 - Best Reasoning Model  
- Llama 3.1 405B - Massive Reasoning Power
- DeepSeek Chat V3.1 - Best Chat Model
- Llama 3.3 70B - Excellent Chat Quality
- Llama 4 Maverick - Speed + Quality Balance
- Llama 4 Scout - Speed + Quality Balance
- **xAI Grok 4 Fast** - Ultra Speed + Intelligence

**⭐ 4-Star Models (6 models):**
- Qwen3 14B - Well Balanced
- Mistral Small 3.2 - Balanced Performance
- Devstral Small 2505 - Coding Expert
- Gemini 2.0 Flash - Google Fast
- Gemma 3 27B - Google Quality
- QwQ 32B - Smart Reasoning

**💫 3-Star Models (2 models):**
- Llama 3.2 3B - Lightweight & Fast  
- Z.AI GLM 4.5 Air - Multilingual Support

**⚠️ Lưu ý bảo mật:**
- API keys có trong code chỉ để demo/testing
- Trong production, sử dụng environment variables
- Monitor usage để tránh overcharge

### **Cách 1: Mở trực tiếp (Khuyến nghị)**
```bash
# Clone repository
git clone https://github.com/yourusername/ai-prompt-assistant.git

# Mở file index.html bằng browser
open index.html
```

### **Cách 2: Local Server**
```bash
# Với Python
python -m http.server 8000

# Với Node.js
npx serve .

# Truy cập http://localhost:8000
```

### **Cách 3: Live Server (VS Code)**
1. Cài extension "Live Server"
2. Right-click vào `index.html`
3. Chọn "Open with Live Server"

## 🏗 Cấu trúc Project v2.0

```
ai-prompt-assistant/
├── 📄 index.html                    # Giao diện chính với dual provider UI
├── 🎨 style.css                     # Styling + responsive design + AI selection
├── ⚡ script.js                     # Dual AI logic & smart provider switching
├── 🐍 proxy-server-python.py        # Python proxy server (dual providers)
├── 📋 requirements.txt              # Python dependencies
├── 🚀 start-python-server.bat       # Auto-start script
├── 🧪 debug-console.html            # API testing & debugging
├── 📊 model-comparison.html         # Model performance comparison
├── 📚 README.md                     # Documentation này
├── 🏷️ GEMINI-MODELS.md             # Gemini models comparison
└── 📋 legacy/                       # Legacy Node.js server (backup)
    ├── proxy-server.js
    ├── package.json
    └── start-server.bat
```

### **📊 Architecture Overview**

```
User Interface (HTML/CSS/JS)
         ↕️
Proxy Server v2.0 (Python Flask)
         ↕️
┌─────────────────┬─────────────────┐
│  OpenRouter AI  │  Google Gemini  │
├─────────────────┼─────────────────┤
│ • GPT-4o        │ • Gemini 2.0    │
│ • GPT-4o Mini   │   Flash         │
│ • Claude-3      │ • Free Tier     │
│ • Llama-3       │ • 15 req/min    │
│ • Pay-per-use   │                 │
└─────────────────┴─────────────────┘
```

## 🎨 Customization

### **Thêm Category mới**
```javascript
// Trong script.js -> PROMPT_TEMPLATES
custom_category: {
    name: "Tên category",
    icon: "🔥", 
    systemPrompt: `System prompt cho category này...`
}
```

### **Tùy chỉnh UI Theme**
```css
/* Trong style.css -> :root */
--primary: linear-gradient(135deg, #your-color1, #your-color2);
--bg-primary: #your-background-color;
```

### **Thêm Example mới**
```javascript
// Trong script.js -> EXAMPLE_PROMPTS
{
    category: 'your_category',
    icon: '🎯',
    title: 'Tiêu đề example',
    description: 'Mô tả chi tiết',
    simple: 'Input đơn giản',
    preview: 'Preview nội dung...'
}
```

## 🔧 Tính năng nâng cao

### **Local Storage**
- Tự động lưu lịch sử 50 prompts gần nhất
- Lưu preferences và settings
- Offline access cho saved prompts

### **Performance Optimization**
- Lazy loading cho examples
- Debounced input handling
- Optimized animations với CSS transforms

### **Accessibility**
- Keyboard navigation support
- Screen reader friendly
- High contrast mode compatibility

### **Analytics Ready**
```javascript
// Tích hợp Google Analytics
gtag('event', 'prompt_generated', {
    category: 'engagement',
    action: 'generate',
    label: category
});
```

## 📱 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 70+ | ✅ Full |
| Firefox | 65+ | ✅ Full |  
| Safari | 12+ | ✅ Full |
| Edge | 79+ | ✅ Full |
| IE | - | ❌ Not supported |

## 🐛 Troubleshooting

### **Common Issues**

**1. Prompt không generate**
- Kiểm tra input không trống
- Refresh page và thử lại
- Check browser console cho errors

**2. Local storage không hoạt động**  
- Đảm bảo browser cho phép cookies
- Clear cache và refresh
- Kiểm tra Private/Incognito mode

**3. Responsive issues**
- Hard refresh (Ctrl+F5)
- Kiểm tra viewport meta tag
- Test trên browser khác

### **Debug Mode**
```javascript
// Bật debug mode trong console
APP_STATE.debug = true;
```

## 🤝 Đóng góp

### **Bug Reports**
1. Mô tả chi tiết issue
2. Steps to reproduce  
3. Expected vs actual behavior
4. Browser/OS information

### **Feature Requests**
1. Mô tả feature mong muốn
2. Use cases cụ thể
3. Mockup/wireframe nếu có

### **Code Contributions**
1. Fork repository
2. Tạo feature branch
3. Commit với message rõ ràng
4. Submit pull request

## 📄 License

MIT License - xem chi tiết trong file [LICENSE](LICENSE)

## 🙏 Credits

- **AI Engines**: 
  - OpenRouter AI (GPT-4o, Claude-3, Llama-3, Gemma) 
  - Google Gemini 2.0 Flash
- **Development**: Powered by Claude Sonnet 4 advanced thinking capabilities
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Inter)
- **Architecture**: Dual-provider failover design

## 📞 Liên hệ & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-prompt-assistant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-prompt-assistant/discussions)  
- **Email**: support@ai-prompt-assistant.com

---

<div align="center">

**🌟 Nếu project này hữu ích, đừng quên star repo! ⭐**

Made with ❤️ by [Claude Sonnet 4](https://claude.ai) | Version 2.0.0 | Dual AI Providers

</div>

## 📊 Stats & Metrics

![GitHub Stars](https://img.shields.io/github/stars/yourusername/ai-prompt-assistant?style=social)
![GitHub Forks](https://img.shields.io/github/forks/yourusername/ai-prompt-assistant?style=social)
![GitHub Issues](https://img.shields.io/github/issues/yourusername/ai-prompt-assistant)
![GitHub Last Commit](https://img.shields.io/github/last-commit/yourusername/ai-prompt-assistant)

**Thống kê sử dụng v2.0 (Optimized):**
- 🤖 AI Providers: 3 (OpenRouter + Groq + Gemini)
- 🎯 Groq Models: 8 FREE Models (Llama, Mixtral, Gemma, Whisper)
- 🏷️ Categories hỗ trợ: Universal AI với smart detection
- ⚡ Templates: 1 Universal Template (ngắn gọn súc tích)
- 💾 Storage: 50 prompts lịch sử
- 🌍 Languages: Tiếng Việt (chính), English
- 📱 Responsive: 100% mobile-friendly
- 🔄 Smart Fallback: Auto-switch between providers
- 💰 Cost Options: 100% FREE Models Only

### **🚀 What's New in v2.0**

- ✨ **Triple AI Providers**: OpenRouter + Groq + Gemini integration
- ⚡ **Groq AI**: Ultra-fast inference với Llama 3.1 models
- 🎛️ **Dynamic Model Selection**: 15+ models để lựa chọn
- 🔄 **Smart Failover**: Automatic provider switching on errors
- 📊 **Usage Analytics**: Real-time token tracking
- 🎨 **Enhanced UI**: Provider/model selection interface
- 🧪 **Debug Tools**: Comprehensive testing endpoints
- 📈 **Performance**: Up to 10x faster với Groq inference

---

> *"Triple AI Power - Biến ý tưởng thành hành động, biến câu hỏi thành giải pháp với sức mạnh ba lần"* ✨⚡🚀
