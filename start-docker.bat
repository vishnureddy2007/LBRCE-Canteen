@echo off
setlocal enabledelayedexpansion

echo =====================================================================
echo  LBRCE Canteen Management System - One-Click Docker Runner
echo =====================================================================
echo.

:: 1. Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed or not in PATH!
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

:: 2. Check if Docker daemon is running
docker info >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] Docker daemon is not running!
    echo Starting Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe" 2>nul
    echo Waiting 15 seconds for Docker engine to initialize...
    timeout /t 15 /nobreak >nul
    docker info >nul 2>nul
    if %errorlevel% neq 0 (
        echo [ERROR] Docker daemon could not be reached.
        echo Please ensure Docker Desktop is open and running, then try again.
        pause
        exit /b 1
    )
)

echo [+] Docker daemon is active.
echo [+] Building and starting services (MySQL 8 + Spring Boot + phpMyAdmin)...
echo.

docker compose up -d --build

if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose failed to start the services.
    pause
    exit /b %errorlevel%
)

echo.
echo =====================================================================
echo  SERVICES ARE UP AND RUNNING!
echo =====================================================================
echo.
echo  * Web Application (Frontend + API):
echo    http://localhost:8080
echo.
echo  * Visual Database GUI (phpMyAdmin):
echo    http://localhost:8081
echo    (Logged in automatically as 'root' / 'rootpassword')
echo.
echo  * Direct MySQL Access (DBeaver / Workbench / CLI):
echo    Host:     localhost (or machine IP)
echo    Port:     3306
echo    Database: lbrce_canteen
echo    Username: canteen_user  (or root)
echo    Password: canteen_pass  (or rootpassword)
echo.
echo  * Preloaded Test Accounts:
echo    -----------------------------------------------------------------
echo    Role     Login ID              Password
echo    -----------------------------------------------------------------
echo    Admin    admin                 Admin@12345678
echo    Staff    STAFF001              Staff@12345678
echo    Student  20LBR001              Student@12345678
echo    -----------------------------------------------------------------
echo.
echo To stop services at any time, run: docker compose down
echo.
pause
