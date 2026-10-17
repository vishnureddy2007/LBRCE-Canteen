# 🌐 External Runner & Database Access Guide

This guide explains how **externals** (evaluators, collaborators, recruiters, or other developers) can run and access the **LBRCE Canteen Management System** and its **database** with zero friction.

---

## 🔑 1. Quick Credentials Reference

All setups (Docker, H2, and Local/Cloud MySQL) are pre-seeded with ready-to-test accounts across all roles:

### Application Accounts
| Role | Login Identifier | Password | Access & Features |
|---|---|---|---|
| **Administrator** | `admin` *(or `admin@lbrce.ac.in`)* | `Admin@12345678` | Full management: analytics, food items, categories, staff, students, offers, announcements |
| **Canteen Staff** | `STAFF001` *(or `staff@lbrce.ac.in`)* | `Staff@12345678` | Order queue, status updates, food availability toggle |
| **Student** | `20LBR001` *(or `student@lbrce.ac.in`)* | `Student@12345678` | Menu browsing, cart, order placement, live tracking, order history, receipts |

### Database Access Credentials
| Component | Connection Method | Host / URL | Port | Username | Password | Database |
|---|---|---|---|---|---|---|
| **Web GUI (phpMyAdmin)** | Browser | `http://localhost:8081` | `8081` | Auto-login *(root)* | `rootpassword` | `lbrce_canteen` |
| **Direct MySQL** | DBeaver / Workbench / CLI | `localhost` *(or LAN IP)* | `3306` | `canteen_user` *(or `root`)* | `canteen_pass` *(or `rootpassword`)* | `lbrce_canteen` |
| **In-Memory H2 Console** | Browser | `http://localhost:8080/h2-console` | `8080` | `sa` | *(blank)* | `jdbc:h2:mem:lbrcedb` |

---

## 🚀 2. Method 1: Docker Compose (Recommended - 1 Click)

The fastest and most robust method. Spins up the entire application stack:
- **MySQL 8.0**: Pre-initialized with `database/schema.sql` and `database/seed_data.sql`.
- **Spring Boot 3 + Embedded React SPA**: Unified single-origin container on port `8080`.
- **phpMyAdmin**: Web database interface on port `8081`.

### Windows:
Double-click `start-docker.bat` or run in terminal:
```powershell
.\start-docker.bat
```

### Linux / macOS:
```bash
chmod +x start-docker.sh
./start-docker.sh
```

### Manual Command:
```bash
docker compose up -d --build
```

### Accessing after startup:
- **Web Application**: [http://localhost:8080](http://localhost:8080)
- **Visual Database Management (phpMyAdmin)**: [http://localhost:8081](http://localhost:8081)
- **Direct Database Access**: Port `3306` (`canteen_user` / `canteen_pass`)

To stop all containers:
```bash
docker compose down
```

---

## ⚡ 3. Method 2: Zero-Install Local Run (H2 In-Memory Database)

If you don't have Docker or MySQL installed and just want to evaluate or run the project instantly using Java and Node:

### Windows:
Run `start-local.bat` and select Option **`1`**:
```powershell
.\start-local.bat
```

### Or using Maven CLI:
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

In a second terminal, launch the frontend:
```bash
cd frontend
npm install
npm run dev
```

### Database Access in H2 Mode:
Open [http://localhost:8080/h2-console](http://localhost:8080/h2-console):
- **JDBC URL**: `jdbc:h2:mem:lbrcedb`
- **User Name**: `sa`
- **Password**: *(leave blank)*
- Click **Connect** to run SQL queries directly in the browser!

---

## 💻 4. Method 3: Local Native Run with MySQL Server

If you have MySQL running locally (e.g., MySQL 8 Service or XAMPP):

1. **Initialize the database**:
   ```bash
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS lbrce_canteen CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   mysql -u root -p lbrce_canteen < database/schema.sql
   mysql -u root -p lbrce_canteen < database/seed_data.sql
   ```

2. **Configure credentials** in `.env` or run directly:
   ```powershell
   $env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/lbrce_canteen?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
   $env:SPRING_DATASOURCE_USERNAME="root"
   $env:SPRING_DATASOURCE_PASSWORD="YOUR_PASSWORD"
   ```

3. **Start backend and frontend**:
   ```bash
   # Terminal 1:
   cd backend
   mvn spring-boot:run -Dspring-boot.run.profiles=dev

   # Terminal 2:
   cd frontend
   npm run dev
   ```

---

## ☁️ 5. Method 4: Remote Cloud Database (Free Hosted MySQL)

External developers can run the app without hosting MySQL locally by connecting to a free hosted cloud MySQL instance (such as **Aiven.io**, **Clever Cloud**, or **Railway**):

1. Create a free MySQL database on [Aiven.io](https://aiven.io/) or [Clever Cloud](https://www.clever-cloud.com/).
2. Load `database/schema.sql` and `database/seed_data.sql` into your cloud database using any MySQL client.
3. Configure your connection in `.env`:
   ```properties
   SPRING_DATASOURCE_URL=jdbc:mysql://<CLOUD_HOST>:<PORT>/lbrce_canteen?useSSL=true&requireSSL=true&sslMode=REQUIRED&connectTimeout=10000&socketTimeout=30000
   SPRING_DATASOURCE_USERNAME=<CLOUD_USER>
   SPRING_DATASOURCE_PASSWORD=<CLOUD_PASSWORD>
   JPA_DDL_AUTO=update
   COOKIE_SECURE=false
   ```
4. Run the app locally (`start-local.bat` option 2 or `mvn spring-boot:run`). It connects securely over SSL to the cloud database.

---

## 📱 6. Method 5: External Access from Mobile & Other Network Devices

### Over Local Wi-Fi (LAN):
To let friends, colleagues, or mobile phones on the same Wi-Fi test the app and database:

1. Run the network helper:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\expose-network.ps1
   ```
   This will display your machine's LAN IP (e.g., `192.168.1.45`) and open firewall ports `8080`, `8081`, and `3306`.
2. Any device on the same Wi-Fi can now open:
   - **Web App**: `http://192.168.1.45:8080`
   - **Database GUI**: `http://192.168.1.45:8081`
   - **Direct MySQL**: `192.168.1.45:3306`

### Over the Public Internet (Tunneling):
To give access to someone outside your local network without router port forwarding:

```bash
# Using free Localtunnel (no signup needed):
npx localtunnel --port 8080

# Or using ngrok:
ngrok http 8080
```
This generates a secure public HTTPS URL (e.g., `https://canteen-demo.loca.lt`) that anyone on the internet can open on their phone or browser.

---

## 🛠️ Verification & Health Check

Verify your deployment anytime by calling the health endpoint:
```bash
curl http://localhost:8080/api/health
```
Expected response:
```json
{
  "success": true,
  "data": {
    "status": "UP",
    "timestamp": "2026-10-17T19:45:00Z"
  }
}
```
