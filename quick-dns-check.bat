@echo off
cls
echo ========================================
echo   QUICK DNS CHECK FOR promptcode.online
echo ========================================
echo.
echo [Checking A records...]
nslookup promptcode.online 8.8.8.8
echo.
echo ========================================
echo [Checking CNAME record...]
nslookup www.promptcode.online 8.8.8.8
echo.
echo ========================================
echo.
echo EXPECTED RESULTS:
echo -----------------
echo A Records should show:
echo   185.199.108.153
echo   185.199.109.153
echo   185.199.110.153
echo   185.199.111.153
echo.
echo CNAME should show:
echo   www.promptcode.online = rottritruc.github.io
echo.
echo If you see "Non-existent domain" or "can't find":
echo   DNS hasn't propagated yet - wait 10-30 more minutes
echo.
echo ========================================
pause

