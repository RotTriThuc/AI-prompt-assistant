# 📝 Hướng Dẫn Viết Prompt Hiệu Quả

## 🎯 Mục Đích

Hướng dẫn này giúp bạn viết input tốt hơn để nhận được output chất lượng cao từ AI Prompt Assistant.

---

## ✨ QUY TẮC VÀNG

### 1. **Cụ Thể Thay Vì Chung Chung**

#### ❌ Sai:
```
"Tạo website"
```

#### ✅ Đúng:
```
"Tạo e-commerce website bán thời trang với:
- Payment integration (Stripe/PayPal)
- Admin dashboard quản lý sản phẩm, đơn hàng
- Mobile-first responsive design
- Tech stack: React + Node.js + PostgreSQL
- Mục tiêu: Hỗ trợ 1000+ concurrent users"
```

**Tại sao**: Càng cụ thể, AI càng hiểu rõ requirements và tạo prompt chi tiết hơn.

---

### 2. **Cung Cấp Context Đầy Đủ**

#### ❌ Sai:
```
"Viết content"
```

#### ✅ Đúng:
```
"Viết Instagram content cho quán cafe thủ công:
- Target audience: 25-35 tuổi, yêu thích specialty coffee
- Brand tone: Thân thiện, chuyên nghiệp, đam mê coffee
- Posting frequency: 5 posts/tuần
- Mục tiêu: Tăng 30% foot traffic trong 3 tháng"
```

**Tại sao**: Context giúp AI tạo prompt phù hợp với brand và mục tiêu cụ thể.

---

### 3. **Nói Rõ Constraints (Ràng Buộc)**

#### ❌ Sai:
```
"Phân tích dữ liệu"
```

#### ✅ Đúng:
```
"Phân tích sales data của cửa hàng:
- Dataset: CSV file với 10,000 rows
- Tools: Python pandas, matplotlib
- Timeline: Hoàn thành trong 1 tuần
- Output: Interactive dashboard + PDF report
- Focus: Tìm trends và seasonal patterns"
```

**Tại sao**: Constraints giúp AI tạo prompt realistic và actionable.

---

## 📚 EXAMPLES BY CATEGORY

### 💻 **Code/Development Tasks**

#### Example 1: Web Application
```
INPUT:
"Tạo todo list app với authentication và real-time sync"

BETTER INPUT:
"Tạo full-stack todo list application với:

Features:
- User authentication (email + Google OAuth)
- Real-time collaboration (multiple users)
- Task priorities, due dates, tags
- Offline-first với sync khi online
- Dark mode support

Tech Requirements:
- Frontend: Next.js 14 + TypeScript
- Backend: Node.js + Prisma ORM
- Database: PostgreSQL
- Real-time: WebSockets
- Deployment: Vercel

Quality Standards:
- Responsive design (mobile-first)
- 90+ Lighthouse score
- Unit tests (70%+ coverage)
- Accessibility (WCAG 2.1 AA)"
```

#### Example 2: API Development
```
INPUT:
"Tạo REST API cho blog"

BETTER INPUT:
"Tạo RESTful API cho blog platform với:

Core Endpoints:
- /posts (CRUD với pagination, search)
- /comments (nested comments support)
- /users (profile, authentication)
- /categories, /tags

Features:
- JWT authentication + refresh tokens
- Rate limiting (100 req/min per user)
- Image upload (Cloudinary integration)
- Full-text search (Elasticsearch)
- Email notifications (SendGrid)

Tech Stack:
- Framework: Express.js hoặc Fastify
- Database: MongoDB với Mongoose
- Validation: Joi hoặc Zod
- Documentation: Swagger/OpenAPI

Requirements:
- RESTful best practices
- Proper error handling (custom error classes)
- Logging (Winston)
- Security (helmet, cors, sanitization)
- Tests: Jest + Supertest"
```

---

### 🎨 **Creative/Content Tasks**

#### Example 1: Social Media Content
```
INPUT:
"Viết content Facebook"

BETTER INPUT:
"Tạo Facebook content strategy cho startup fintech:

Brand Info:
- Tên: MoneyWise
- Product: App quản lý tài chính cá nhân
- USP: AI-powered expense tracking + investment advice
- Voice: Thông minh, đáng tin, approachable

Target Audience:
- Age: 25-40
- Profile: Young professionals, muốn financial independence
- Pain points: Khó track expenses, không biết invest
- Platform behavior: Active 7-9 PM weekdays

Deliverables:
- Content calendar 30 ngày
- 15 ready-to-post với captions (100-150 words)
- Hashtag strategy (20 relevant tags)
- Engagement tactics (polls, questions, UGC)
- Visual guidelines (color palette, templates)

Goals:
- Reach: 50K impressions/month
- Engagement: 5%+ engagement rate
- Conversions: 200+ app downloads/month"
```

#### Example 2: Email Marketing
```
INPUT:
"Viết email marketing"

BETTER INPUT:
"Tạo email marketing campaign cho e-learning platform:

Campaign Type: Welcome series (5 emails)

Company:
- Platform: SkillUp Academy
- Offering: Online courses (tech, business, design)
- Audience: New signups chưa mua course

Email Sequence:
1. Welcome + platform tour (Day 0)
2. Free resources + value demo (Day 2)
3. Popular courses showcase (Day 4)
4. Student success stories (Day 7)
5. Limited-time discount 20% (Day 10)

Requirements:
- Subject lines (A/B test variants)
- Preview text optimized
- Mobile-responsive copy (80% mobile readers)
- Clear CTAs (1 primary CTA per email)
- Personalization tokens
- Urgency/scarcity triggers (ethical)

Tone: Inspiring, supportive, educational
Length: 150-200 words per email

Success Metrics:
- Open rate target: 25%+
- Click rate: 8%+
- Conversion: 5%+ purchase rate"
```

---

### 💼 **Business/Strategy Tasks**

#### Example 1: Business Plan
```
INPUT:
"Lập kế hoạch kinh doanh"

BETTER INPUT:
"Tạo business plan cho cloud kitchen startup:

Business Concept:
- Model: Multi-brand cloud kitchen
- Cuisine: Asian fusion, Western, Healthy bowls
- Location: Hà Nội (Cầu Giấy, Đống Đa)
- Delivery: GrabFood, ShopeeFood, own app

Plan Sections Needed:
1. Executive Summary
2. Market Analysis
   - TAM/SAM/SOM sizing
   - Competitor analysis (5 key players)
   - Customer segments và personas
3. Business Model
   - Revenue streams (commission, subscription)
   - Unit economics (CAC, LTV, margins)
4. Operations Plan
   - Kitchen setup (equipment, layout)
   - Supply chain và inventory
   - Technology stack
5. Marketing Strategy
   - Customer acquisition plan
   - Brand building
   - Partnership opportunities
6. Financial Projections (3 years)
   - P&L statements
   - Cash flow analysis
   - Break-even analysis
7. Risk Assessment + Mitigation

Budget: $50K initial investment
Timeline: Launch trong 6 tháng
Goal: 500 orders/day sau 12 tháng"
```

---

### 📊 **Data Analysis Tasks**

#### Example 1: Sales Analysis
```
INPUT:
"Phân tích dữ liệu bán hàng"

BETTER INPUT:
"Phân tích sales data của retail chain (50 stores):

Dataset Info:
- Period: 2 years (2023-2024)
- Records: 500K transactions
- Format: CSV files (sales.csv, products.csv, stores.csv)
- Size: ~200MB total

Analysis Objectives:
1. Sales Performance
   - Revenue trends (monthly, seasonal)
   - Top performing products (by revenue, units)
   - Store performance comparison
2. Customer Insights
   - Purchase patterns (time, frequency)
   - Basket analysis (product combinations)
   - Customer segmentation (RFM analysis)
3. Forecasting
   - Next quarter sales prediction
   - Inventory optimization recommendations

Technical Requirements:
- Tools: Python (pandas, numpy, scikit-learn)
- Visualizations: Plotly hoặc matplotlib/seaborn
- Statistical tests: Chi-square, correlation analysis
- ML models: Time series (ARIMA) + clustering

Deliverables:
1. Jupyter notebook với full analysis
2. Executive summary (2-page PDF)
3. Interactive dashboard (Streamlit/Dash)
4. SQL queries for future automation

Constraints:
- Budget: Internal analysis (no external tools)
- Timeline: 2 weeks
- Presentation: Board meeting style"
```

---

## 💡 TIPS & TRICKS

### Tip 1: Sử Dụng "5W1H" Framework
Luôn trả lời:
- **What**: Cái gì cần làm?
- **Why**: Mục đích là gì?
- **Who**: Đối tượng ai? (audience, users)
- **Where**: Ở đâu? (platform, environment)
- **When**: Timeline? Deadline?
- **How**: Làm như thế nào? (tech stack, approach)

### Tip 2: Specify Success Metrics
Luôn include:
```
"Mục tiêu đo lường được:
- Metric 1: [số cụ thể]
- Metric 2: [số cụ thể]
- Timeline: [thời gian cụ thể]"
```

### Tip 3: Mention Constraints
```
"Ràng buộc:
- Budget: $X hoặc free tools only
- Timeline: X weeks
- Team: X người với skills Y
- Tech limits: Must use [technology]"
```

### Tip 4: Provide Examples (Khi Có Thể)
```
"Tham khảo:
- Similar to: [competitor/example]
- Inspired by: [reference]
- Avoiding: [anti-patterns]"
```

---

## ⚠️ COMMON MISTAKES

### Mistake 1: Quá Ngắn
❌ "Làm app chat"
✅ "Làm real-time chat app với React Native, Firebase, end-to-end encryption, group chat support, cho iOS/Android"

### Mistake 2: Quá Mơ Hồ
❌ "Cải thiện performance"
✅ "Optimize React app: reduce bundle size <500KB, improve LCP <2s, achieve 90+ Lighthouse score"

### Mistake 3: Thiếu Context
❌ "Marketing plan"
✅ "Digital marketing plan cho SaaS B2B, budget $10K/month, targeting CTOs of 50-200 employee companies"

### Mistake 4: Không Có Priorities
❌ "Cần tất cả features"
✅ "Must-have: authentication, CRUD. Nice-to-have: analytics, export. Future: AI features"

---

## 🎯 TEMPLATE CHEAT SHEET

### Universal Template:
```
"[Action verb] [specific deliverable] cho [audience/use case]:

Core Requirements:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Technical Details:
- [Tech/Tool 1]
- [Tech/Tool 2]

Constraints:
- Budget: [amount or free]
- Timeline: [duration]
- Team: [size/skills]

Success Criteria:
- [Metric 1]: [target]
- [Metric 2]: [target]

Additional Context:
[Any relevant background, examples, or references]"
```

---

## 📊 BEFORE vs AFTER COMPARISON

### Example: E-commerce Project

**BEFORE (Weak Input)**:
```
"Tạo website bán hàng"
```

**AFTER (Strong Input)**:
```
"Tạo full-stack e-commerce platform bán thời trang:

Features:
- Product catalog với search, filters, categories
- Shopping cart + guest checkout
- Payment: Stripe + COD
- Order tracking
- Admin dashboard (inventory, orders, analytics)
- Email notifications

Tech Stack:
- Frontend: Next.js 14 + TypeScript + Tailwind
- Backend: Node.js + Prisma
- Database: PostgreSQL
- Payments: Stripe API
- Email: SendGrid
- Hosting: Vercel

Requirements:
- Mobile-responsive (70% traffic mobile)
- Fast (<3s load time)
- SEO optimized
- Accessible (WCAG AA)
- Secure (HTTPS, input validation)

Timeline: MVP trong 8 tuần
Budget: $20K development
Scale: Support 10K products, 1K concurrent users

Success Metrics:
- 90+ Lighthouse score
- <2% cart abandonment
- 99.9% uptime"
```

**Result**: Output quality tăng từ 6/10 → 9/10! 🚀

---

## ✅ CHECKLIST TRƯỚC KHI SUBMIT

Trước khi submit input, kiểm tra:

- [ ] Đã specific về deliverables?
- [ ] Đã mention tech stack/tools?
- [ ] Đã nói rõ audience/users?
- [ ] Đã include constraints (budget/time)?
- [ ] Đã define success metrics?
- [ ] Đã provide context đầy đủ?
- [ ] Đã dài hơn 50 words?
- [ ] Đã avoid vague terms?

**Nếu tất cả đều ✅**: Bạn sẽ nhận được prompt chất lượng cao!

---

## 🚀 NEXT STEPS

1. **Practice**: Thử với 5-10 inputs khác nhau
2. **Iterate**: So sánh output quality với input tốt vs xấu
3. **Save**: Bookmark những inputs templates tốt
4. **Share**: Share với team để cùng improve

---

**Tip cuối cùng**: AI Prompt Assistant sẽ làm tốt nhất khi bạn treat nó như một consultant thật - càng nhiều context, càng tốt kết quả! 💡

---

**Version**: 1.0.0  
**Last Updated**: October 1, 2025  
**Feedback**: Có suggestions? Create issue trên GitHub!

