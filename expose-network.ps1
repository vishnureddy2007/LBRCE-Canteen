# =====================================================================
# LBRCE Canteen MS - External Network Access Helper (LAN & Internet)
# =====================================================================
# This script:
# 1. Finds your local network IP (for phones / devices on the same Wi-Fi)
# 2. Configures Windows Firewall rules for ports 8080, 8081, 3306
# 3. Provides tunneling commands for worldwide internet access
# =====================================================================

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host " LBRCE Canteen MS - External Network & Database Access Tool" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

# Get primary IPv4 Address
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
    $_.InterfaceAlias -notmatch "Loopback|vEthernet|VirtualBox|VMware" -and $_.IPAddress -notlike "169.254*" 
} | Select-Object -First 1).IPAddress

if (-not $ip) {
    $ip = "YOUR_LOCAL_IP"
}

Write-Host "[+] Local Machine LAN IP Address: " -NoNewline
Write-Host $ip -ForegroundColor Green
Write-Host ""

Write-Host "1. ACCESS FROM OTHER DEVICES ON YOUR LOCAL NETWORK (Wi-Fi / LAN):" -ForegroundColor Yellow
Write-Host "   - Web Application:     http://$($ip):8080" -ForegroundColor White
Write-Host "   - Visual Database GUI: http://$($ip):8081" -ForegroundColor White
Write-Host "   - MySQL Database:      $($ip):3306" -ForegroundColor White
Write-Host ""

Write-Host "2. WINDOWS DEFENDER FIREWALL CONFIGURATION:" -ForegroundColor Yellow
$currentPrincipal = [Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if ($isAdmin) {
    Write-Host "[+] Creating / Verifying Windows Firewall rules for ports 8080, 8081, 3306..." -ForegroundColor Cyan
    
    $rules = @(
        @{ Name = "LBRCE-Canteen-App"; Port = 8080 },
        @{ Name = "LBRCE-Canteen-phpMyAdmin"; Port = 8081 },
        @{ Name = "LBRCE-Canteen-MySQL"; Port = 3306 }
    )

    foreach ($r in $rules) {
        $existing = Get-NetFirewallRule -DisplayName $r.Name -ErrorAction SilentlyContinue
        if (-not $existing) {
            New-NetFirewallRule -DisplayName $r.Name -Direction Inbound -LocalPort $r.Port -Protocol TCP -Action Allow | Out-Null
            Write-Host "    [OK] Allowed inbound TCP port $($r.Port) ($($r.Name))" -ForegroundColor Green
        } else {
            Write-Host "    [OK] Rule $($r.Name) already exists." -ForegroundColor Gray
        }
    }
} else {
    Write-Host "[!] Note: To automatically open firewall ports for LAN devices, run this script as Administrator." -ForegroundColor Yellow
    Write-Host "    Manual PowerShell command (Run as Admin):" -ForegroundColor Gray
    Write-Host "    New-NetFirewallRule -DisplayName 'LBRCE-App' -Direction Inbound -LocalPort 8080,8081,3306 -Protocol TCP -Action Allow" -ForegroundColor Gray
}

Write-Host ""
Write-Host "3. SHARE GLOBALLY OVER THE INTERNET (Zero Port Forwarding):" -ForegroundColor Yellow
Write-Host "   Option A: Localtunnel (Free, No Signup Required)" -ForegroundColor Cyan
Write-Host "     npx localtunnel --port 8080" -ForegroundColor White
Write-Host ""
Write-Host "   Option B: ngrok" -ForegroundColor Cyan
Write-Host "     ngrok http 8080" -ForegroundColor White
Write-Host ""
Write-Host "   Option C: Cloudflare Tunnel" -ForegroundColor Cyan
Write-Host "     cloudflared tunnel --url http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Cyan
