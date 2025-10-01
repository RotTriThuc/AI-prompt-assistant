@echo off
echo =====================================
echo 🐍 AI Prompt Assistant Python Proxy 
echo =====================================
echo.

echo 📦 Installing Python dependencies...
pip install flask flask-cors requests

echo.
echo 🛡️ Starting Python Proxy Server...
python proxy-server-python.py

pause
