# Kill Port Script for Windows
# Usage: .\kill-port.ps1 [Port]
# Example: .\kill-port.ps1 3001

param(
    [int]$Port = 3001
)

Write-Host ""
Write-Host "🔍 Checking port $Port..." -ForegroundColor Yellow
Write-Host "=" -NoNewline; Write-Host ("=" * 50)
Write-Host ""

try {
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    
    if ($connections) {
        $processId = $connections[0].OwningProcess
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        
        if ($process) {
            $processName = $process.ProcessName
            
            Write-Host "📍 Found process:" -ForegroundColor Cyan
            Write-Host "   Name: $processName" -ForegroundColor White
            Write-Host "   PID:  $processId" -ForegroundColor White
            Write-Host "   Port: $Port" -ForegroundColor White
            Write-Host ""
            
            Write-Host "🔴 Killing process..." -ForegroundColor Red
            Stop-Process -Id $processId -Force
            Start-Sleep -Milliseconds 500
            
            # Verify
            $stillExists = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
            
            if (-not $stillExists) {
                Write-Host "✅ Process killed successfully!" -ForegroundColor Green
                Write-Host ""
                Write-Host "🚀 Port $Port is now free!" -ForegroundColor Green
                Write-Host "   You can start your server now:" -ForegroundColor White
                Write-Host "   npm run start-secure" -ForegroundColor Cyan
            } else {
                Write-Host "⚠️  Process may still be running. Try again or restart your computer." -ForegroundColor Yellow
            }
        } else {
            Write-Host "⚠️  Process found but cannot get details" -ForegroundColor Yellow
            Write-Host "   Try running PowerShell as Administrator" -ForegroundColor White
        }
    } else {
        Write-Host "✅ Port $Port is free!" -ForegroundColor Green
        Write-Host "   No process is using this port" -ForegroundColor White
        Write-Host ""
        Write-Host "🚀 You can start your server now:" -ForegroundColor Green
        Write-Host "   npm run start-secure" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Try running PowerShell as Administrator" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=" -NoNewline; Write-Host ("=" * 50)
Write-Host ""

