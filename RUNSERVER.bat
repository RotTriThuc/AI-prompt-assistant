@echo off
echo =====================================
echo 🚀 AI Prompt Assistant Full Server
echo =====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH!
    echo Please install Python 3.8+ from: https://python.org
    echo.
    pause
    exit /b 1
)

REM Install Python dependencies if requirements.txt exists
if exist requirements.txt (
    echo 📦 Installing Python dependencies...
    pip install -r requirements.txt --quiet
    if errorlevel 1 (
        echo ⚠️ Failed to install some dependencies, continuing...
    )
    echo.
)

REM Start HTTP server for static files in background
echo 🌐 Starting HTTP Server for static files...
start /B python -m http.server 8000 >nul 2>&1
timeout /t 2 /nobreak >nul

REM Check if HTTP server started
curl -s http://localhost:8000 >nul 2>&1
if errorlevel 1 (
    echo ⚠️ HTTP Server failed to start, opening files directly...
    set OPEN_DIRECT=true
) else (
    echo ✅ HTTP Server running on: http://localhost:8000
)

echo.
echo 🔧 Starting AI Proxy Server...
echo =====================================

REM Start the Python proxy server
python proxy-server-python.py

REM If we get here, proxy server stopped
echo.
echo 🛑 Servers stopped. Press any key to exit...
pause >nul
