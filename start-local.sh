#!/usr/bin/env bash
set -e

echo "====================================================================="
echo " LBRCE Canteen Management System - Native Local Runner"
echo "====================================================================="
echo ""
echo "Select Run Mode:"
echo "  [1] Zero-Install Mode (In-Memory H2 Database - No MySQL required!)"
echo "  [2] Local MySQL Mode (Connects to your local or cloud MySQL instance)"
echo ""
read -p "Enter choice [1 or 2, default is 1]: " MODE
MODE=${MODE:-1}

if [ "$MODE" = "1" ]; then
    echo ""
    echo "[+] Starting backend with In-Memory H2 Database..."
    echo "[+] H2 Web Console will be available at: http://localhost:8080/h2-console"
    echo "[+] JDBC URL: jdbc:h2:mem:lbrcedb (User: sa, Password: [blank])"
    echo ""
    cd backend
    mvn spring-boot:run -Dspring-boot.run.profiles=h2
else
    echo ""
    echo "[+] Starting backend with MySQL database..."
    echo "[+] Using configuration from .env or application.yml"
    echo ""
    cd backend
    mvn spring-boot:run -Dspring-boot.run.profiles=dev
fi
