# Test script for AI Prompt Assistant servers
Write-Host "Testing AI Prompt Assistant Servers..." -ForegroundColor Green

# Test HTTP Server (port 8000)
Write-Host "`nTesting HTTP Server (port 8000)..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000" -UseBasicParsing -TimeoutSec 5
    if ($response.Content -match "<!DOCTYPE") {
        Write-Host "HTTP Server OK - Serving HTML" -ForegroundColor Green
    } else {
        Write-Host "HTTP Server responding but no HTML detected" -ForegroundColor Yellow
    }
} catch {
    Write-Host "HTTP Server not responding: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Proxy Server (port 3001)
Write-Host "`nTesting Proxy Server (port 3001)..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/info" -UseBasicParsing -TimeoutSec 5
    $json = $response.Content | ConvertFrom-Json
    Write-Host "Proxy Server OK - $($json.message)" -ForegroundColor Green
    Write-Host "Providers: $($json.providers -join ', ')" -ForegroundColor Gray
} catch {
    Write-Host "Proxy Server not responding: $($_.Exception.Message)" -ForegroundColor Red
}

# Summary
Write-Host "`nSummary:" -ForegroundColor Yellow
Write-Host "HTTP Server: http://localhost:8000" -ForegroundColor White
Write-Host "Proxy Server: http://localhost:3001" -ForegroundColor White
Write-Host "`nReady to use! Open http://localhost:8000 in your browser" -ForegroundColor Green
