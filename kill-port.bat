@echo off
REM Kill Port Script for Windows (CMD version)
REM Usage: kill-port.bat [port]
REM Example: kill-port.bat 3001

setlocal

REM Default port
set PORT=3001

REM Use provided port if given
if not "%1"=="" set PORT=%1

echo.
echo Checking port %PORT%...
echo ====================================================
echo.

REM Find process using the port
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT%') do (
    set PID=%%a
    goto :kill
)

echo Port %PORT% is free!
echo You can start your server now:
echo   npm run start-secure
goto :end

:kill
echo Found process using port %PORT%
echo PID: %PID%
echo.
echo Killing process...
taskkill /PID %PID% /F

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Process killed successfully!
    echo Port %PORT% is now free!
    echo.
    echo You can start your server now:
    echo   npm run start-secure
) else (
    echo.
    echo Failed to kill process!
    echo Try running as Administrator
)

:end
echo.
echo ====================================================
echo.
endlocal

