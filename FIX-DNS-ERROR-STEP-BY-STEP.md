# 🔧 Fix DNS Error: InvalidDNSError - Step by Step

> **Giải quyết lỗi "Domain's DNS record could not be retrieved"**

---

## 🚨 **LỖI HIỆN TẠI:**

```
❌ Both promptcode.online and its alternate name are improperly configured
❌ Domain's DNS record could not be retrieved
❌ InvalidDNSError
```

**DNS Check Results:**
```
promptcode.online → No response (A records issue)
www.promptcode.online → Non-existent domain (CNAME not configured)
```

---

## 🎯 **NGUYÊN NHÂN:**

1. **CNAME record chưa được setup** hoặc setup sai
2. **A records thiếu** hoặc chưa propagate
3. **DNS chưa propagate** (cần đợi 5-30 phút)
4. **Conflict trong DNS records** (có records cũ)

---

## ✅ **GIẢI PHÁP - LÀM CHÍNH XÁC THEO THỨ TỰ:**

---

## **PHẦN 1: SETUP DNS TRÊN NAMECHEAP (QUAN TRỌNG NHẤT!)**

### **Bước 1.1: Truy cập Namecheap DNS Management**

1. Mở browser → Truy cập: https://www.namecheap.com/
2. Click **Sign In** (góc phải trên)
3. Đăng nhập với tài khoản của bạn
4. Sau khi đăng nhập → Click **Domain List** (menu trái)
5. Tìm domain **promptcode.online** → Click **MANAGE**

### **Bước 1.2: Vào Advanced DNS Tab**

1. Trong trang domain management
2. Click tab **Advanced DNS** (ở giữa tabs)
3. Kéo xuống section **HOST RECORDS**

### **Bước 1.3: XÓA TẤT CẢ records cũ (nếu có)**

**QUAN TRỌNG:** Xóa các records sau nếu tồn tại:
- ❌ URL Redirect Records
- ❌ Parking Page records  
- ❌ Default Namecheap A records (pointing đến Namecheap IPs)
- ❌ CNAME records sai (như `promptcode.github.io`)

**Cách xóa:**
- Click icon **🗑️ Trash/Delete** bên phải mỗi record
- Confirm delete

### **Bước 1.4: THÊM 4 A RECORDS (cho GitHub Pages)**

Click button **ADD NEW RECORD** và thêm từng record sau:

**Record 1:**
```
Type: A Record
Host: @
Value: 185.199.108.153
TTL: Automatic
```
Click ✅ (checkmark) để save

**Record 2:**
```
Type: A Record
Host: @
Value: 185.199.109.153
TTL: Automatic
```
Click ✅

**Record 3:**
```
Type: A Record
Host: @
Value: 185.199.110.153
TTL: Automatic
```
Click ✅

**Record 4:**
```
Type: A Record
Host: @
Value: 185.199.111.153
TTL: Automatic
```
Click ✅

### **Bước 1.5: THÊM CNAME RECORD (QUAN TRỌNG!)**

Click button **ADD NEW RECORD**:

```
Type: CNAME Record
Host: www
Value: rottritruc.github.io.
       ^^^^^^^^^^^^^^^^^^^^
       ⚠️ VIẾT THƯỜNG! Có dấu . cuối!
TTL: Automatic
```

**⚠️ CỰC KỲ QUAN TRỌNG:**
- ✅ ĐÚNG: `rottritruc.github.io.` (viết thường, có dấu `.` cuối)
- ❌ SAI: `promptcode.github.io`
- ❌ SAI: `RotTriThuc.github.io` (viết hoa không được)
- ❌ SAI: `rottritruc.github.io` (không có dấu `.` cuối)

Click ✅ để save

### **Bước 1.6: VERIFY Host Records Table**

Sau khi thêm xong, bảng HOST RECORDS phải có **CHÍNH XÁC** như sau:

```
┌──────────────┬──────┬─────────────────────────┬───────────┐
│     Type     │ Host │         Value           │    TTL    │
├──────────────┼──────┼─────────────────────────┼───────────┤
│ A Record     │  @   │ 185.199.108.153         │ Automatic │
│ A Record     │  @   │ 185.199.109.153         │ Automatic │
│ A Record     │  @   │ 185.199.110.153         │ Automatic │
│ A Record     │  @   │ 185.199.111.153         │ Automatic │
│ CNAME Record │ www  │ rottritruc.github.io.   │ Automatic │
└──────────────┴──────┴─────────────────────────┴───────────┘

✅ TOTAL: 5 records
```

**Nếu có records khác → XÓA HẾT!**

### **Bước 1.7: SAVE CHANGES**

1. Kéo lên top của page
2. Click button **SAVE ALL CHANGES** (màu xanh lá)
3. Đợi message "Changes saved successfully" ✅

---

## **PHẦN 2: VERIFY CNAME FILE TRONG GITHUB REPO**

### **Bước 2.1: Kiểm tra CNAME file**

1. Truy cập: https://github.com/RotTriThuc/promptcode
2. Tìm file **CNAME** ở root directory
3. Click vào file CNAME

### **Bước 2.2: Verify nội dung**

File CNAME phải có **DUY NHẤT** 1 dòng:

```
promptcode.online
```

**⚠️ KHÔNG được có:**
- ❌ `www.promptcode.online`
- ❌ `https://promptcode.online`
- ❌ `http://promptcode.online`
- ❌ Dòng trống phía sau

### **Bước 2.3: Nếu file CNAME sai hoặc không có**

**Option A: Tạo qua GitHub Web:**
1. Vào repo: https://github.com/RotTriThuc/promptcode
2. Click **Add file** → **Create new file**
3. File name: `CNAME`
4. Content: `promptcode.online`
5. Commit message: "Add CNAME for custom domain"
6. Click **Commit changes**

**Option B: Tạo qua Git local (nếu bạn quen Git):**
```bash
echo "promptcode.online" > CNAME
git add CNAME
git commit -m "Add CNAME for custom domain"
git push origin main
```

---

## **PHẦN 3: CONFIG GITHUB PAGES SETTINGS**

### **Bước 3.1: Truy cập GitHub Pages Settings**

1. Vào: https://github.com/RotTriThuc/promptcode/settings/pages
2. Hoặc: Repo → Settings → Pages (sidebar trái)

### **Bước 3.2: Verify Build Settings**

**Source section:**
```
✅ Deploy from a branch
✅ Branch: main
✅ Folder: / (root)
```

Nếu sai → Sửa lại → Click **Save**

### **Bước 3.3: REMOVE Custom Domain (Temporary)**

**Custom domain** section:
1. Nếu có domain `promptcode.online` trong ô input
2. Click **❌ Remove** button
3. Confirm removal
4. **Đợi 10 giây**

### **Bước 3.4: RE-ADD Custom Domain**

1. Trong ô **Custom domain** (đang trống)
2. Nhập: `promptcode.online` (KHÔNG có www)
3. Click **Save**
4. GitHub sẽ bắt đầu kiểm tra DNS...

### **Bước 3.5: Đợi DNS Verification**

Màn hình sẽ hiện:
- ⏳ "DNS check is in progress..." → Đang check
- ⏳ Đợi 1-5 phút
- 🔄 Refresh page nếu cần

**Các kết quả có thể xảy ra:**

**A. Thành công ✅:**
```
✅ DNS check successful
✅ Your site is ready to be published at https://promptcode.online
```
→ Chuyển sang **PHẦN 4**

**B. Vẫn lỗi ❌:**
```
❌ Domain's DNS record could not be retrieved (InvalidDNSError)
```
→ Tiếp tục **PHẦN 4** để troubleshoot

---

## **PHẦN 4: ĐỢI DNS PROPAGATION & VERIFY**

### **Bước 4.1: Hiểu về DNS Propagation**

DNS changes không instant! Cần thời gian:
- ⏰ **Tối thiểu:** 5-10 phút
- ⏰ **Thông thường:** 30 phút - 2 giờ
- ⏰ **Tối đa:** 24-48 giờ (rare)

### **Bước 4.2: Check DNS từ máy tính**

**Mở Command Prompt / PowerShell:**

```bash
# Check A records
nslookup promptcode.online

# Check CNAME record
nslookup www.promptcode.online
```

**Kết quả đúng:**

```
✅ promptcode.online:
Server:  [your DNS server]
Address:  [IP]

Name:    promptcode.online
Addresses:  185.199.108.153
            185.199.109.153
            185.199.110.153
            185.199.111.153

✅ www.promptcode.online:
Name:    rottritruc.github.io
Aliases: www.promptcode.online
Addresses:  185.199.108.153
            ...
```

**Kết quả SAI:**

```
❌ Server can't find promptcode.online: NXDOMAIN
❌ Non-existent domain
```
→ DNS chưa propagate, đợi thêm 10-30 phút

### **Bước 4.3: Flush DNS Cache (Windows)**

Để xóa DNS cache cũ trên máy:

```bash
# Mở Command Prompt AS ADMINISTRATOR
ipconfig /flushdns
```

Output:
```
Successfully flushed the DNS Resolver Cache.
```

Sau đó test lại với `nslookup`.

### **Bước 4.4: Check DNS Propagation Online**

Truy cập các tools sau để check worldwide propagation:

**Tool 1: DNS Checker**
1. Vào: https://dnschecker.org/
2. Nhập: `promptcode.online`
3. Type: `A`
4. Click **Search**
5. Xem kết quả từ nhiều locations

**Tool 2: What's My DNS**
1. Vào: https://www.whatsmydns.net/
2. Nhập: `promptcode.online`
3. Type: `A`
4. Xem kết quả global

**Kết quả tốt:**
- ✅ Màu xanh lá ở nhiều locations
- ✅ IPs: 185.199.108.153, 109.153, 110.153, 111.153

**Kết quả chưa OK:**
- ❌ Nhiều dấu X đỏ
- ⏳ Đợi thêm 15-30 phút và check lại

### **Bước 4.5: Timeline Checklist**

**Sau 5 phút:**
- [ ] DNS checker shows some green checkmarks
- [ ] nslookup starts returning IPs

**Sau 30 phút:**
- [ ] Most DNS servers worldwide updated
- [ ] GitHub Pages DNS check might succeed
- [ ] Site accessible at promptcode.online

**Sau 2 giờ:**
- [ ] 90%+ DNS servers updated
- [ ] GitHub Pages should verify successfully
- [ ] Can enable Enforce HTTPS

**Nếu sau 24 giờ vẫn lỗi:**
→ Có vấn đề nghiêm trọng, xem **PHẦN 5: Advanced Troubleshooting**

---

## **PHẦN 5: ENABLE HTTPS (SAU KHI DNS VERIFY THÀNH CÔNG)**

### **Bước 5.1: Verify DNS Check Successful**

Trên GitHub Pages settings:
```
✅ DNS check successful
Your site is ready to be published at https://promptcode.online
```

### **Bước 5.2: Enable Enforce HTTPS**

1. Tìm checkbox **Enforce HTTPS**
2. ✅ Tick vào checkbox
3. Message: "Enforcing HTTPS..."
4. Đợi 10-30 phút để GitHub generate SSL certificate

### **Bước 5.3: Verify HTTPS Active**

```
✅ Enforce HTTPS (checked)
✅ Your site is published at https://promptcode.online
```

---

## **PHẦN 6: FINAL TESTING**

### **Bước 6.1: Test All URLs**

Mở browser và test:

**Test 1: Apex domain HTTP**
```
http://promptcode.online
```
→ Should load website (might redirect to HTTPS)

**Test 2: Apex domain HTTPS**
```
https://promptcode.online
```
→ Should load with 🔒 padlock (secure)

**Test 3: WWW subdomain**
```
http://www.promptcode.online
https://www.promptcode.online
```
→ Should redirect to `promptcode.online`

**Test 4: GitHub Pages URL**
```
https://rottritruc.github.io/promptcode/
```
→ Should redirect to `promptcode.online`

### **Bước 6.2: Verify SSL Certificate**

1. Vào https://promptcode.online
2. Click vào icon 🔒 (padlock) bên trái URL bar
3. Click **Certificate** / **Connection is secure**
4. Verify:
   ```
   ✅ Certificate valid
   ✅ Issued to: promptcode.online
   ✅ Issued by: Let's Encrypt / GitHub
   ✅ Valid dates: Current date in range
   ```

### **Bước 6.3: Test from Different Devices**

- [ ] Desktop browser (Chrome/Firefox/Edge)
- [ ] Mobile phone browser
- [ ] Incognito/Private mode
- [ ] Different network (mobile data)

---

## 🐛 **PHẦN 7: ADVANCED TROUBLESHOOTING**

### **Issue A: DNS vẫn không resolve sau 24 giờ**

**Checklist:**
1. Verify Namecheap nameservers:
   - Vào Domain List → promptcode.online
   - Tab **Domain** 
   - Section **NAMESERVERS**
   - Phải là: `dns1.registrar-servers.com`, `dns2.registrar-servers.com`
   - Nếu khác → Reset về Namecheap BasicDNS

2. Check domain status:
   - Domain phải Active/Unlocked
   - Không bị Suspended/Locked

3. Contact Namecheap Support:
   - Live chat: https://www.namecheap.com/support/live-chat/
   - Ticket: https://www.namecheap.com/support/

### **Issue B: GitHub Pages không verify DNS**

**Solutions:**

**Try 1: Remove và Re-add Custom Domain**
```
1. GitHub Pages Settings
2. Remove custom domain
3. Đợi 5 phút
4. Re-add custom domain
5. Save
```

**Try 2: Xóa CNAME file và tạo lại**
```bash
# Trong repo
git rm CNAME
git commit -m "Remove CNAME"
git push origin main

# Đợi 2 phút

echo "promptcode.online" > CNAME
git add CNAME
git commit -m "Re-add CNAME"
git push origin main
```

**Try 3: Change Custom Domain Temporarily**
```
1. Remove promptcode.online
2. Add a subdomain: test.promptcode.online (with new CNAME record)
3. If test subdomain works → Issue with apex domain
4. Contact GitHub Support
```

### **Issue C: Site loads nhưng 404 Not Found**

**Causes:**
- File `index.html` không ở root directory
- Branch/folder settings sai
- Build failed

**Solutions:**
1. Verify `index.html` ở root:
   ```
   https://github.com/RotTriThuc/promptcode/blob/main/index.html
   ```

2. Check Actions tab:
   ```
   https://github.com/RotTriThuc/promptcode/actions
   ```
   → Build phải successful ✅

3. Re-deploy:
   ```
   Settings → Pages → Source → Change branch to "None" → Save
   → Đợi 1 phút
   → Change back to "main" → Save
   ```

### **Issue D: SSL Certificate Error**

**Causes:**
- HTTPS chưa được enable
- SSL cert đang được generated
- Mixed content issues

**Solutions:**
1. Đợi thêm 30 phút sau khi enforce HTTPS
2. Disable "Enforce HTTPS" → Save → Enable lại → Save
3. Check GitHub Status: https://www.githubstatus.com/
4. Clear browser cache và test incognito

---

## 📞 **PHẦN 8: GET HELP**

### **Nếu vẫn không fix được sau tất cả steps trên:**

**Contact GitHub Support:**
- URL: https://support.github.com/
- Topic: "GitHub Pages Custom Domain Issue"
- Provide:
  - Repository: RotTriThuc/promptcode
  - Domain: promptcode.online
  - Error: InvalidDNSError
  - Steps taken: (all above)

**Contact Namecheap Support:**
- Live Chat: https://www.namecheap.com/support/live-chat/
- Topic: "DNS records not propagating"
- Provide:
  - Domain: promptcode.online
  - DNS records configured (show screenshot)
  - Time since changes: XX hours

---

## ✅ **SUCCESS CHECKLIST**

**Khi mọi thứ hoạt động:**

- [x] DNS check successful trên GitHub ✅
- [x] https://promptcode.online loads website ✅
- [x] SSL certificate valid (🔒 padlock) ✅
- [x] www redirects to apex domain ✅
- [x] All pages accessible ✅
- [x] No browser warnings ✅

**Congratulations! 🎉 Domain setup hoàn tất!**

---

## 📊 **SUMMARY**

**Tổng thời gian ước tính:**
- Setup DNS: 10 phút
- DNS propagation: 30 phút - 2 giờ
- GitHub verification: 5 phút
- SSL activation: 30 phút
- **TOTAL: 1-3 giờ** (chủ yếu là đợi)

**Key Points:**
1. ✅ CNAME phải là `rottritruc.github.io.` (lowercase, có dấu `.`)
2. ✅ 4 A records pointing to GitHub IPs
3. ⏰ Patience! DNS cần thời gian propagate
4. 🔄 Remove & re-add custom domain nếu stuck
5. 🔒 Enable HTTPS sau khi DNS verify

---

*Generated by Claude Sonnet 4.5 - AI Prompt Assistant*  
*Last updated: October 1, 2025*  
*For: promptcode.online DNS setup*

