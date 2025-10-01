@echo off
echo ========================================
echo   FLUSH DNS CACHE AND CHECK
echo ========================================
echo.
echo [Step 1] Flushing DNS cache...
ipconfig /flushdns
echo.
echo [Step 2] Waiting 2 seconds...
timeout /t 2 /nobreak >nul
echo.
echo [Step 3] Checking DNS records...
echo.
echo ----------------------------------------
echo Checking: promptcode.online
echo ----------------------------------------
nslookup promptcode.online 8.8.8.8
echo.
echo ----------------------------------------
echo Checking: www.promptcode.online
echo ----------------------------------------
nslookup www.promptcode.online 8.8.8.8
echo.
echo ========================================
echo.
echo If results show GitHub IPs = SUCCESS!
echo If "Non-existent domain" = Wait more time
echo.
pause

