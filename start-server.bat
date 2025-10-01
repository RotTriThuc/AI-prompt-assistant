@echo off
echo ================================
echo 🚀 AI Prompt Assistant Proxy Setup
echo ================================
echo.

echo 📦 Installing dependencies...
npm install express cors node-fetch

echo.
echo 🛡️ Starting Proxy Server...
node proxy-server.js

pause
