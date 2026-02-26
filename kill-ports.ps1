# Kill semua proses yang menggunakan port Vite (5173-5180) sebelum menjalankan dev server
$ports = @(5173, 5174, 5175, 5176, 5177, 5178, 5179, 5180)

foreach ($port in $ports) {
    $processId = (netstat -ano | findstr ":$port " | Where-Object { $_ -match "LISTENING" } | ForEach-Object { ($_ -split '\s+')[-1] } | Select-Object -First 1)
    if ($processId) {
        Write-Host "Membunuh proses $processId di port $port..." -ForegroundColor Yellow
        taskkill /PID $processId /F | Out-Null
        Write-Host "Port $port berhasil dibebaskan!" -ForegroundColor Green
    }
}

Write-Host "`nSemua port Vite sudah bersih. Menjalankan Vite..." -ForegroundColor Cyan
