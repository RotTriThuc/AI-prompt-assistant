# 🔍 Namecheap DNS Configuration Checklist

## ✅ **PHẢI KIỂM TRA NGAY TRÊN NAMECHEAP:**

### **Bước 1: Đăng nhập Namecheap**
1. Vào: https://www.namecheap.com/
2. Sign In
3. Domain List
4. Click **MANAGE** bên cạnh `promptcode.online`

---

### **Bước 2: Vào Advanced DNS**
1. Click tab **Advanced DNS**
2. Scroll xuống **HOST RECORDS**

---

### **Bước 3: VERIFY CHÍNH XÁC TỪNG RECORD**

#### **✅ Phải có 4 A Records:**

```
Type: A Record | Host: @ | Value: 185.199.108.153 | TTL: Automatic
Type: A Record | Host: @ | Value: 185.199.109.153 | TTL: Automatic
Type: A Record | Host: @ | Value: 185.199.110.153 | TTL: Automatic
Type: A Record | Host: @ | Value: 185.199.111.153 | TTL: Automatic
```

**Check:**
- [ ] Có đủ 4 A records?
- [ ] Host đều là `@` (không phải gì khác)?
- [ ] Values đúng 4 IPs của GitHub Pages?

---

#### **✅ Phải có 1 CNAME Record:**

```
Type: CNAME Record | Host: www | Value: rottritruc.github.io. | TTL: Automatic
```

**⚠️ QUAN TRỌNG NHẤT - KIỂM TRA KỸ:**

**Host:**
- [ ] Phải là `www` (viết thường)
- [ ] KHÔNG phải `@`
- [ ] KHÔNG phải `*`

**Value: (ĐÂY LÀ PHẦN HAY SAI NHẤT!)**
- [ ] Phải là: `rottritruc.github.io.` (lowercase, có dấu `.` cuối)
- [ ] ❌ KHÔNG phải: `promptcode.github.io`
- [ ] ❌ KHÔNG phải: `RotTriThuc.github.io` (viết hoa)
- [ ] ❌ KHÔNG phải: `rottritruc.github.io` (không có dấu `.`)
- [ ] ❌ KHÔNG phải: `www.promptcode.online`

**TTL:**
- [ ] Automatic hoặc 1 min hoặc 300

---

### **Bước 4: XÓA CÁC RECORDS KHÔNG CẦN THIẾT**

**Phải XÓA nếu có:**
- [ ] URL Redirect Records
- [ ] Parking Page records
- [ ] A Records pointing đến IPs khác (không phải GitHub)
- [ ] CNAME Records khác ngoài `www`
- [ ] TXT Records không liên quan

**SAU KHI XÓA, chỉ còn:**
- ✅ 4 A Records (GitHub Pages IPs)
- ✅ 1 CNAME Record (www → rottritruc.github.io.)
- ✅ TOTAL: 5 records ONLY

---

### **Bước 5: SAVE CHANGES**

**QUAN TRỌNG:**
1. Sau khi sửa/thêm records
2. Kéo lên đầu page
3. Click button **SAVE ALL CHANGES** (màu xanh lá)
4. Đợi notification "Changes saved successfully"

**⚠️ Nếu KHÔNG click Save:**
- ❌ Changes sẽ KHÔNG được apply
- ❌ DNS sẽ vẫn giữ config cũ
- ❌ Lỗi vẫn tiếp diễn

---

### **Bước 6: VERIFY NAMESERVERS**

1. Vẫn trong page Domain Management
2. Click tab **Domain** (tab đầu tiên)
3. Scroll xuống section **NAMESERVERS**

**Phải là:**
```
✅ Namecheap BasicDNS
   - dns1.registrar-servers.com
   - dns2.registrar-servers.com
```

**Nếu khác (Custom DNS):**
- ⚠️ Bạn đang dùng external DNS provider
- ⚠️ Phải cấu hình DNS ở provider đó, KHÔNG phải Namecheap
- ⚠️ Hoặc đổi về Namecheap BasicDNS

---

## 📸 **SCREENSHOT CHECKLIST**

Để tôi có thể help verify, chụp screenshot:

1. **Screenshot 1:** Advanced DNS tab - HOST RECORDS table
   - Show tất cả records
   - Zoom in để đọc rõ values

2. **Screenshot 2:** Domain tab - NAMESERVERS section
   - Show nameserver đang dùng

3. **Screenshot 3:** GitHub Pages Settings
   - Show Custom domain section
   - Show DNS check status

---

## ⏰ **TIMELINE SAU KHI SỬA DNS**

**Nếu bạn vừa mới sửa DNS:**

```
0 min    : Sửa DNS trên Namecheap ✅
          Click SAVE CHANGES ✅
↓
5 min    : DNS bắt đầu propagate ⏳
          Run: flush-and-check-dns.bat
↓
10 min   : Một số DNS servers updated 🌍
          Check: nslookup www.promptcode.online
↓
30 min   : Phần lớn DNS updated ✅
          GitHub Pages có thể verify
          Remove & Re-add custom domain trên GitHub
↓
1 hour   : DNS fully propagated ✅
          Enable Enforce HTTPS
↓
2 hours  : SSL certificate active 🔒
          Site live at https://promptcode.online ✅
```

---

## 🎯 **ACTION REQUIRED**

### **GIỜ NÀY - Làm ngay:**

1. ✅ Vào Namecheap Advanced DNS
2. ✅ Kiểm tra từng record theo checklist trên
3. ✅ Sửa CNAME nếu sai
4. ✅ Xóa records không cần thiết
5. ✅ **CLICK SAVE ALL CHANGES**
6. ✅ Chụp screenshot HOST RECORDS table
7. ✅ Báo lại cho tôi kết quả

### **Sau 30 phút:**

1. ✅ Run: `flush-and-check-dns.bat`
2. ✅ Nếu DNS OK → Vào GitHub Pages settings
3. ✅ Remove custom domain → Wait 10s → Re-add
4. ✅ Verify DNS check successful

---

## 📝 **REPORT BACK FORMAT**

Sau khi kiểm tra Namecheap, reply với format:

```
1. CNAME Record value hiện tại: _______________
2. Số A Records: ___
3. A Records IPs: _______________
4. Nameservers: _______________
5. Đã click Save Changes: YES / NO
6. Time since save: ___ phút
```

---

## 🆘 **NẾU VẪN STUCK**

**Namecheap Support:**
- Live Chat: https://www.namecheap.com/support/live-chat/
- Nói với họ: "I need to configure DNS for GitHub Pages custom domain"
- Provide: 
  - Domain: promptcode.online
  - Target: GitHub Pages
  - Required: 4 A records + 1 CNAME record

**GitHub Support:**
- https://support.github.com/
- Topic: "Custom domain DNS verification issue"
- Repo: RotTriThuc/promptcode

---

*Generated by Claude Sonnet 4.5*  
*For: promptcode.online DNS troubleshooting*

