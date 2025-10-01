# 🔴 Hướng dẫn Fix Lỗi "Port Already in Use"

## ❌ Lỗi gì?

```
Error: listen EADDRINUSE: address already in use :::3001
```

**Nghĩa là:** Port 3001 đã được sử dụng bởi process khác (có thể là server cũ vẫn đang chạy).

---

## ⚡ GIẢI PHÁP NHANH

### Cách 1: Dùng npm script (Khuyến nghị - Nhanh nhất)

```bash
npm run kill-port
```

Xong! Port 3001 đã được giải phóng. Chạy lại server:

```bash
npm run start-secure
```

---

### Cách 2: Dùng PowerShell script

```powershell
.\kill-port.ps1
```

Hoặc kill port khác:

```powershell
.\kill-port.ps1 3002
```

---

### Cách 3: Dùng CMD script

```cmd
kill-port.bat
```

Hoặc:

```cmd
kill-port.bat 3002
```

---

### Cách 4: Manual (PowerShell)

```powershell
# Bước 1: Tìm process
netstat -ano | findstr :3001

# Bước 2: Copy PID (cột cuối)
# Ví dụ: 12345

# Bước 3: Kill process
taskkill /PID 12345 /F
```

---

### Cách 5: Manual (PowerShell - Advanced)

```powershell
# One-liner
$p = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if($p){Stop-Process -Id $p.OwningProcess -Force; Write-Host 'Killed!'}
```

---

### Cách 6: Đổi port (Nếu không muốn kill)

**Option A: Set environment variable**

```powershell
# PowerShell
$env:PORT=3002; npm run start-secure
```

```cmd
REM CMD
set PORT=3002 && npm run start-secure
```

**Option B: Update .env file**

```bash
# Thêm vào .env
PORT=3002
```

Sau đó:

```bash
npm run start-secure
```

---

## 🔍 DEBUG - Kiểm tra port đang dùng

### PowerShell:

```powershell
Get-NetTCPConnection -LocalPort 3001 | Format-Table -AutoSize
```

### CMD:

```cmd
netstat -ano | findstr :3001
```

---

## 🎯 WORKFLOW KHUYẾN NGHỊ

### Nếu lỗi "Port in use":

```bash
# 1. Kill port
npm run kill-port

# 2. Start server
npm run start-secure

# 3. Test
npm run test-all
```

---

## 📊 So sánh các cách

| Cách | Độ khó | Tốc độ | Platform |
|------|--------|--------|----------|
| `npm run kill-port` | ⭐ Easy | ⚡ Fast | Windows |
| `kill-port.ps1` | ⭐⭐ Medium | ⚡ Fast | PowerShell |
| `kill-port.bat` | ⭐ Easy | ⚡ Fast | CMD |
| Manual PowerShell | ⭐⭐⭐ Hard | 🐢 Slow | PowerShell |
| Đổi port | ⭐⭐ Medium | ⚡ Fast | All |

---

## 🚨 TROUBLESHOOTING

### Lỗi: "Access Denied"

**Nguyên nhân:** Process được chạy bởi user khác hoặc system service

**Giải pháp:**
1. Chạy PowerShell/CMD **as Administrator**
2. Chạy lại kill command

```powershell
# Right-click PowerShell → Run as Administrator
.\kill-port.ps1
```

### Lỗi: "Process not found"

**Nguyên nhân:** Process đã tắt nhưng port chưa được giải phóng

**Giải pháp:**
1. Đợi 30 giây
2. Chạy lại server

```bash
# Đợi 30s
timeout /t 30

# Hoặc restart máy
```

### Lỗi: Port vẫn bị chiếm

**Nguyên nhân:** Có nhiều processes đang dùng port

**Giải pháp:**
```powershell
# Tìm TẤT CẢ processes
Get-NetTCPConnection -LocalPort 3001 | ForEach-Object {
    Stop-Process -Id $_.OwningProcess -Force
}
```

---

## 🎓 HIỂU THÊM

### Port là gì?

Port là "cổng" mà ứng dụng dùng để giao tiếp qua network.
- Port 3001: Server của bạn
- Port 3000: Thường dùng cho React dev
- Port 80: HTTP default
- Port 443: HTTPS default

### Tại sao lỗi này xảy ra?

1. **Server cũ vẫn chạy**: Bạn đã chạy server trước đó nhưng không tắt
2. **Crash không clean**: Server crash nhưng process vẫn còn
3. **Multiple instances**: Chạy nhiều server cùng lúc
4. **Other app**: App khác đang dùng port 3001

### Cách phòng tránh?

1. **Tắt server đúng cách**: Ctrl+C để stop, không close terminal đột ngột
2. **Check trước khi start**: `npm run kill-port` trước khi start
3. **Dùng process manager**: PM2, nodemon với proper config
4. **Monitor ports**: Task Manager → Performance → Open Resource Monitor

---

## 🛠️ TOOLS AVAILABLE

Bạn có các tools sau để xử lý port issues:

| Tool | Command | Purpose |
|------|---------|---------|
| NPM Script | `npm run kill-port` | Kill port 3001 nhanh |
| PowerShell | `.\kill-port.ps1` | Advanced kill với info |
| CMD Batch | `kill-port.bat` | Simple kill cho CMD |
| Manual | `netstat + taskkill` | Full control |

---

## 📝 BEST PRACTICES

### 1. Always kill port before restart

```bash
npm run kill-port && npm run start-secure
```

### 2. Use different ports for different environments

```bash
# Development
PORT=3001 npm run start-secure

# Staging
PORT=3002 npm run start-secure

# Production
PORT=3000 npm run start-secure
```

### 3. Check port status

```bash
# Before start
npm run kill-port

# Start
npm run start-secure

# Test
npm run test-all
```

---

## 🎯 QUICK REFERENCE

### Single Command Fix:

```bash
npm run kill-port && npm run start-secure
```

### Verify Port is Free:

```powershell
# PowerShell
Get-NetTCPConnection -LocalPort 3001

# CMD
netstat -ano | findstr :3001
```

### Check Server is Running:

```bash
npm run check-health
# hoặc
curl http://localhost:3001/health
```

---

## ✅ SUCCESS CHECKLIST

Sau khi fix:

- [ ] Port 3001 đã được giải phóng
- [ ] Server start thành công
- [ ] `npm run test-all` pass
- [ ] Frontend connect được
- [ ] Không còn lỗi EADDRINUSE

---

**Happy Coding! 🚀**

*P/S: Nếu vẫn gặp vấn đề, chạy PowerShell as Administrator và thử lại.*

