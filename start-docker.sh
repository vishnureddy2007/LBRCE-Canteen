#!/usr/bin/env bash
set -e

echo "====================================================================="
echo " LBRCE Canteen Management System - One-Click Docker Runner"
echo "====================================================================="
echo ""

# 1. Check docker
if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker is not installed or not in PATH!"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

# 2. Check docker daemon
if ! docker info &> /dev/null; then
    echo "[ERROR] Docker daemon is not running. Please start Docker."
    exit 1
fi

echo "[+] Docker daemon is active."
echo "[+] Starting containers (MySQL 8 + Spring Boot + phpMyAdmin)..."
echo ""

docker compose up -d --build

echo ""
echo "====================================================================="
echo " SERVICES ARE UP AND RUNNING!"
echo "====================================================================="
echo ""
echo " * Web Application (Frontend + API):"
echo "   http://localhost:8080"
echo ""
echo " * Visual Database GUI (phpMyAdmin):"
echo "   http://localhost:8081"
echo "   (Logged in automatically as 'root' / 'rootpassword')"
echo ""
echo " * Direct MySQL Access (DBeaver / Workbench / CLI):"
echo "   Host:     localhost (or server IP)"
echo "   Port:     3306"
echo "   Database: lbrce_canteen"
echo "   Username: canteen_user  (or root)"
echo "   Password: canteen_pass  (or rootpassword)"
echo ""
echo " * Preloaded Test Accounts:"
echo "   -----------------------------------------------------------------"
echo "   Role     Login ID              Password"
echo "   -----------------------------------------------------------------"
echo "   Admin    admin                 Admin@12345678"
echo "   Staff    STAFF001              Staff@12345678"
echo "   Student  20LBR001              Student@12345678"
echo "   -----------------------------------------------------------------"
echo ""
echo "To stop services, run: docker compose down"
