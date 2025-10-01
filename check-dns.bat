@echo off
echo ========================================
echo CHECKING DNS FOR promptcode.online
echo ========================================
echo.

echo [1] Checking apex domain (promptcode.online):
nslookup promptcode.online
echo.

echo [2] Checking www subdomain (www.promptcode.online):
nslookup www.promptcode.online
echo.

echo ========================================
echo EXPECTED RESULTS:
echo ========================================
echo Apex domain should show:
echo   - 185.199.108.153
echo   - 185.199.109.153  
echo   - 185.199.110.153
echo   - 185.199.111.153
echo.
echo WWW subdomain should show:
echo   - Name: www.promptcode.online
echo   - CNAME: RotTriThuc.github.io
echo   - Addresses: (GitHub Pages IPs)
echo ========================================
pause

