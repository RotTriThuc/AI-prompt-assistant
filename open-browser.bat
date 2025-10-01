@echo off
echo =====================================
echo 🌐 Opening AI Prompt Assistant
echo =====================================
echo.

REM Check if servers are running
powershell -Command "& {try { $response = Invoke-WebRequest -Uri 'http://localhost:3001/api/info' -UseBasicParsing -TimeoutSec 3; Write-Host 'Proxy Server: OK' } catch { Write-Host 'Proxy Server: NOT RUNNING' -ForegroundColor Red; exit 1 }}"

powershell -Command "& {try { $response = Invoke-WebRequest -Uri 'http://localhost:8000' -UseBasicParsing -TimeoutSec 3; Write-Host 'HTTP Server: OK' } catch { Write-Host 'HTTP Server: NOT RUNNING' -ForegroundColor Red; exit 1 }}"

echo.
echo 🎯 Opening browser...
start http://localhost:8000

echo ✅ Browser opened! Enjoy using AI Prompt Assistant.
timeout /t 3 >nul