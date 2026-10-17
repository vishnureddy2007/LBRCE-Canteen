# =====================================================================
# LBRCE Canteen MS - Local MySQL Root Password Reset Script (Windows)
# =====================================================================
# Usage:
#   Open PowerShell as Administrator and run:
#   .\reset_local_mysql.ps1 -NewPassword "root123"
# =====================================================================

param (
    [string]$NewPassword = "root123"
)

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " LBRCE Canteen MS - Local MySQL Password Reset Tool" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# Check Administrator privileges
$currentPrincipal = [Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "[!] ERROR: Please run this PowerShell script as Administrator!" -ForegroundColor Red
    Exit 1
}

# Identify MySQL service
$service = Get-Service -Name "MySQL80", "MySQL", "MariaDB" -ErrorAction SilentlyContinue | Select-Object -First 1

if (-not $service) {
    Write-Host "[!] No standard MySQL Windows Service (MySQL80/MySQL) found." -ForegroundColor Yellow
    Write-Host "[i] If using XAMPP/WAMP, default root password is blank (empty)." -ForegroundColor Yellow
    Exit 0
}

Write-Host "[+] Found MySQL Service: $($service.Name) (Status: $($service.Status))" -ForegroundColor Green

# 1. Stop MySQL Service
Write-Host "[+] Stopping $($service.Name) service..." -ForegroundColor Yellow
Stop-Service -Name $service.Name -Force

# 2. Create init SQL file
$initFile = "$env:TEMP\reset_mysql_pass.sql"
$sqlContent = "ALTER USER 'root'@'localhost' IDENTIFIED BY '$NewPassword'; FLUSH PRIVILEGES;"
Set-Content -Path $initFile -Value $sqlContent -Encoding UTF8

Write-Host "[+] Created password reset command for root user." -ForegroundColor Green

# 3. Locate mysqld.exe
$mysqldPaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe",
    "C:\Program Files\MySQL\MySQL Server 8.1\bin\mysqld.exe",
    "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld.exe",
    "C:\xampp\mysql\bin\mysqld.exe"
)

$mysqldExe = $mysqldPaths | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $mysqldExe) {
    Write-Host "[!] Could not locate mysqld.exe automatically." -ForegroundColor Red
    Write-Host "[i] Restarting $($service.Name)..." -ForegroundColor Yellow
    Start-Service -Name $service.Name
    Exit 1
}

Write-Host "[+] Executing password reset with $($mysqldExe)..." -ForegroundColor Yellow
$process = Start-Process -FilePath $mysqldExe -ArgumentList "--init-file=`"$initFile`"" -PassThru -NoNewWindow

Start-Sleep -Seconds 5
if (-not $process.HasExited) {
    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
}

# Cleanup
Remove-Item -Path $initFile -ErrorAction SilentlyContinue

# 4. Restart MySQL Service
Write-Host "[+] Restarting $($service.Name) service..." -ForegroundColor Yellow
Start-Service -Name $service.Name

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host " SUCCESS! Local MySQL root password reset to: $NewPassword" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host "You can now connect Spring Boot with:" -ForegroundColor White
Write-Host '  $env:SPRING_DATASOURCE_USERNAME="root"' -ForegroundColor Cyan
Write-Host "  `$env:SPRING_DATASOURCE_PASSWORD=`"$NewPassword`"" -ForegroundColor Cyan
