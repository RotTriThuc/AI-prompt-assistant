# 🌐 Hướng Dẫn Setup Custom Domain cho GitHub Pages

> **Guide chi tiết để deploy `promptcode.online` với GitHub Pages**

---

## 📋 **THÔNG TIN PROJECT**

| **Thông tin** | **Chi tiết** |
|--------------|-------------|
| **Domain** | `promptcode.online` |
| **GitHub Username** | `RotTriThuc` |
| **Repository** | `promptcode` |
| **Repo URL** | https://github.com/RotTriThuc/promptcode |
| **Domain Provider** | Namecheap |
| **Hosting** | GitHub Pages |

---

## 🎯 **OVERVIEW**

### **Cách GitHub Pages hoạt động với Custom Domain:**

```
promptcode.online  →  DNS Records  →  GitHub Pages  →  Your Website
                       (Namecheap)     (RotTriThuc/promptcode)
```

**Quan trọng:**
- GitHub Pages phục vụ project sites qua: `username.github.io/repo-name`
- Với custom domain, DNS phải point về `username.github.io` (KHÔNG có repo name)
- File CNAME trong repo chứa custom domain: `promptcode.online`

---

## 🔧 **BƯỚC 1: Cấu Hình DNS trên Namecheap**

### **A. Đăng nhập Namecheap:**
1. Truy cập: https://www.namecheap.com/
2. Login vào account
3. **Domain List** → Chọn `promptcode.online`
4. Click **Advanced DNS** tab

### **B. Cấu hình A Records (cho apex domain):**

**Thêm 4 A Records cho GitHub Pages IPs:**

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | 185.199.108.153 | Automatic |
| A Record | @ | 185.199.109.153 | Automatic |
| A Record | @ | 185.199.110.153 | Automatic |
| A Record | @ | 185.199.111.153 | Automatic |

**Giải thích:**
- `@` = apex domain (promptcode.online)
- GitHub Pages có 4 IP addresses để load balancing
- TTL `Automatic` = Namecheap tự động quản lý (thường là 1 giờ)

### **C. Cấu hình CNAME Record (cho www subdomain):**

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | www | RotTriThuc.github.io. | Automatic |

**⚠️ QUAN TRỌNG:**
- Phải là `RotTriThuc.github.io.` (GitHub username, KHÔNG phải repo name)
- ❌ SAI: `promptcode.github.io`
- ✅ ĐÚNG: `RotTriThuc.github.io.`
- Có dấu `.` ở cuối!

### **D. Xóa records không cần thiết:**

Xóa các records sau nếu có:
- ❌ URL Redirect Records
- ❌ Parking Page records
- ❌ Default Namecheap records

**Chỉ giữ lại:**
- ✅ 4 A Records pointing đến GitHub
- ✅ 1 CNAME Record cho www

---

## 📁 **BƯỚC 2: Cấu hình CNAME File trong Repository**

### **A. Tạo/Verify CNAME file:**

File `CNAME` phải tồn tại ở **root directory** của repo:

```
promptcode/
├── CNAME              ← File này
├── index.html
├── style.css
├── script.js
└── ...
```

### **B. Nội dung file CNAME:**

```
promptcode.online
```

**Lưu ý:**
- Chỉ 1 dòng duy nhất
- KHÔNG có `http://` hoặc `https://`
- KHÔNG có `www.`
- KHÔNG có trailing slash `/`

### **C. Tạo CNAME file (nếu chưa có):**

**Option 1: Trực tiếp trên GitHub:**
1. Vào repo: https://github.com/RotTriThuc/promptcode
2. Click **Add file** → **Create new file**
3. Tên file: `CNAME`
4. Nội dung: `promptcode.online`
5. Commit changes

**Option 2: Qua Git local:**

```bash
# Tạo file CNAME
echo "promptcode.online" > CNAME

# Commit và push
git add CNAME
git commit -m "Add CNAME for custom domain"
git push origin main
```

---

## ⚙️ **BƯỚC 3: Cấu hình GitHub Pages Settings**

### **A. Truy cập Settings:**
1. Vào repo: https://github.com/RotTriThuc/promptcode
2. Click **Settings** tab
3. Sidebar: **Pages** (dưới "Code and automation")

### **B. Cấu hình Source:**

```
Build and deployment
├── Source: Deploy from a branch
├── Branch: main
└── Folder: / (root)
```

Click **Save** nếu có thay đổi.

### **C. Cấu hình Custom Domain:**

**Custom domain** section:
1. Nhập: `promptcode.online` (KHÔNG có www)
2. Click **Save**
3. Đợi GitHub verify DNS (1-5 phút)

### **D. DNS Check Status:**

GitHub sẽ kiểm tra DNS records:
- ⏳ **Checking...** → Đang verify DNS
- ✅ **DNS check successful** → OK, tiếp tục bước E
- ❌ **DNS check failed** → Xem phần Troubleshooting bên dưới

### **E. Enable HTTPS:**

**SAU KHI** DNS verify thành công:
- ✅ Tick checkbox **Enforce HTTPS**
- GitHub sẽ tự động generate SSL certificate (Let's Encrypt)
- Đợi 10-30 phút để SSL activate

---

## ⏰ **BƯỚC 4: Đợi DNS Propagation**

### **Thời gian propagation:**

| **Loại Change** | **Thời gian ước tính** |
|----------------|----------------------|
| A Records | 5-30 phút |
| CNAME Records | 5-30 phút |
| Full propagation worldwide | Lên đến 48 giờ |

### **Check DNS status:**

**Option 1: Sử dụng script check-dns.bat:**
```bash
# Double-click file check-dns.bat
# Hoặc chạy trong terminal:
.\check-dns.bat
```

**Option 2: Manual check với nslookup:**
```bash
# Check apex domain
nslookup promptcode.online

# Check www subdomain
nslookup www.promptcode.online
```

**Kết quả đúng:**

```
promptcode.online:
  → 185.199.108.153
  → 185.199.109.153
  → 185.199.110.153
  → 185.199.111.153

www.promptcode.online:
  → CNAME: RotTriThuc.github.io
  → Addresses: GitHub Pages IPs
```

**Option 3: Online DNS checker:**
- https://dnschecker.org/
- https://www.whatsmydns.net/
- Nhập `promptcode.online` và check globally

---

## ✅ **BƯỚC 5: Verify & Test**

### **A. Test domain access:**

Sau khi DNS propagate xong:

```bash
# Test HTTP (sẽ redirect to HTTPS)
http://promptcode.online
http://www.promptcode.online

# Test HTTPS (sau khi enforce HTTPS)
https://promptcode.online
https://www.promptcode.online
```

### **B. Expected behavior:**

1. `promptcode.online` → Load website ✅
2. `www.promptcode.online` → Redirect to `promptcode.online` ✅
3. `http://` → Redirect to `https://` ✅ (sau khi enforce HTTPS)
4. SSL certificate valid ✅ (issued by GitHub)

### **C. Check SSL certificate:**

Trong browser:
1. Click vào icon ổ khóa (🔒) bên trái URL
2. **Certificate is valid** → ✅ OK
3. Issued by: `Let's Encrypt` / `GitHub`

---

## 🐛 **TROUBLESHOOTING**

### **Lỗi 1: "Domain's DNS record could not be retrieved (InvalidDNSError)"**

**Nguyên nhân:**
- CNAME record sai (point về `promptcode.github.io` thay vì `RotTriThuc.github.io`)
- DNS chưa propagate
- A records thiếu hoặc sai

**Giải pháp:**
1. ✅ Verify CNAME: `www` → `RotTriThuc.github.io.` (có dấu `.`)
2. ✅ Verify 4 A records đúng GitHub IPs
3. ⏳ Đợi 30 phút rồi refresh GitHub Pages settings
4. ✅ Remove custom domain → Save → Add lại → Save

---

### **Lỗi 2: "Both domain and its alternate name are improperly configured"**

**Nguyên nhân:**
- DNS records conflict
- CNAME file sai format
- GitHub chưa verify DNS

**Giải pháp:**
1. ✅ Check CNAME file content: chỉ có `promptcode.online`
2. ✅ Check không có duplicate DNS records
3. ✅ Xóa URL redirect records trên Namecheap
4. ⏳ Đợi DNS propagate (5-30 phút)

---

### **Lỗi 3: "ERR_NAME_NOT_RESOLVED" khi truy cập domain**

**Nguyên nhân:**
- DNS chưa propagate
- A records chưa được setup

**Giải pháp:**
1. ✅ Run `nslookup promptcode.online`
2. Nếu không resolve → DNS chưa propagate
3. ⏳ Đợi thêm (có thể lên đến 24-48 giờ)
4. ✅ Clear browser cache / DNS cache:
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac
   sudo dscacheutil -flushcache
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```

---

### **Lỗi 4: "Not secure" warning (No SSL)**

**Nguyên nhân:**
- Chưa enforce HTTPS
- SSL certificate chưa được generate
- DNS chưa verify

**Giải pháp:**
1. ✅ Đợi DNS verify xong trên GitHub Pages settings
2. ✅ Enable "Enforce HTTPS"
3. ⏳ Đợi 10-30 phút để GitHub generate SSL cert
4. 🔄 Hard refresh browser (Ctrl+Shift+R)

---

### **Lỗi 5: 404 Page Not Found**

**Nguyên nhân:**
- File `index.html` không ở root directory
- Branch/folder settings sai
- Build chưa xong

**Giải pháp:**
1. ✅ Verify `index.html` ở root của repo
2. ✅ Check GitHub Pages settings: Branch = `main`, Folder = `/`
3. ✅ Check Actions tab: Build successful?
4. ⏳ Đợi 1-2 phút để GitHub rebuild

---

### **Lỗi 6: "www" không redirect về apex domain**

**Nguyên nhân:**
- CNAME record chưa setup
- GitHub chưa config redirect

**Giải pháp:**
1. ✅ Add CNAME record: `www` → `RotTriThuc.github.io.`
2. ⏳ Đợi DNS propagate
3. ✅ GitHub tự động redirect `www` về apex

---

## 📊 **DNS PROPAGATION TIMELINE**

### **Typical timeline:**

```
0 min    : Sửa DNS trên Namecheap ✅
↓
5 min    : DNS bắt đầu propagate ⏳
↓
10 min   : Một số DNS servers nhận được update 🌍
↓
30 min   : Phần lớn DNS servers updated ✅
↓
2 hours  : 90% worldwide propagation ✅
↓
24 hours : 99% worldwide propagation ✅
↓
48 hours : 100% guaranteed propagation ✅
```

### **Patience is key!**
- ⏳ Đợi ít nhất 30 phút trước khi lo lắng
- 🌍 DNS propagation là global process
- 🔄 ISP cache có thể hold old records lâu hơn

---

## 🔒 **BẢO MẬT & BEST PRACTICES**

### **✅ Recommendations:**

1. **HTTPS Only:**
   - Always enforce HTTPS
   - HTTP → HTTPS redirect automatic

2. **HSTS (HTTP Strict Transport Security):**
   - GitHub Pages tự động enable
   - Browsers remember to use HTTPS

3. **DNSSEC (Optional):**
   - Enable trên Namecheap nếu supported
   - Thêm layer bảo mật cho DNS

4. **Monitor uptime:**
   - Use UptimeRobot / Pingdom
   - Alert nếu site down

5. **Backup:**
   - Git repo là backup tự nhiên
   - Keep local copy updated

---

## 📞 **HỖ TRỢ & RESOURCES**

### **Official Documentation:**
- [GitHub Pages Custom Domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Namecheap DNS Management](https://www.namecheap.com/support/knowledgebase/category/10239/dns-domain-name-system/)
- [DNS Propagation Checker](https://www.whatsmydns.net/)

### **Troubleshooting Tools:**
- **DNS Lookup**: https://mxtoolbox.com/SuperTool.aspx
- **DNS Propagation**: https://dnschecker.org/
- **SSL Check**: https://www.ssllabs.com/ssltest/

### **Contact Support:**
- **GitHub Support**: https://support.github.com/
- **Namecheap Support**: https://www.namecheap.com/support/

---

## 🎯 **CHECKLIST FINAL**

Trước khi kết thúc, verify tất cả:

### **DNS Configuration (Namecheap):**
- [ ] 4 A Records pointing to GitHub IPs ✅
- [ ] 1 CNAME Record: `www` → `RotTriThuc.github.io.` ✅
- [ ] Xóa các records không cần thiết ✅
- [ ] TTL set to Automatic ✅

### **Repository (GitHub):**
- [ ] File CNAME exists at root ✅
- [ ] CNAME content: `promptcode.online` ✅
- [ ] index.html exists at root ✅
- [ ] Repo is public (hoặc có GitHub Pro) ✅

### **GitHub Pages Settings:**
- [ ] Source: Deploy from branch (main) ✅
- [ ] Custom domain: `promptcode.online` ✅
- [ ] DNS check successful ✅
- [ ] Enforce HTTPS enabled ✅

### **Testing:**
- [ ] `promptcode.online` loads website ✅
- [ ] `www.promptcode.online` redirects ✅
- [ ] HTTPS works with valid SSL ✅
- [ ] No browser security warnings ✅

---

## ✨ **KẾT LUẬN**

**Setup complete!** 🎉

Your website is now live at:
- 🌐 https://promptcode.online
- 🌐 https://www.promptcode.online

**Timeline summary:**
- DNS setup: 5 minutes
- DNS propagation: 30 minutes - 48 hours
- SSL activation: 10-30 minutes after DNS verify
- Total: ~1 hour (excluding full worldwide propagation)

**Next steps:**
1. ✅ Monitor DNS propagation
2. ✅ Test from different locations/devices
3. ✅ Update links/marketing materials
4. ✅ Setup analytics (Google Analytics, etc.)
5. ✅ Monitor uptime

---

*Generated by Claude Sonnet 4.5 - AI Prompt Assistant v2.0*  
*Last updated: October 1, 2025*

