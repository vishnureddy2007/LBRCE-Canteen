# Production Deployment Guide - LBRCE Canteen Management System

This document outlines the complete production deployment procedure for the **LBRCE Canteen Management System**.

---

## 1. Architecture Overview

The production system runs as a **single containerized Spring Boot service** that embeds and serves the React SPA from the same HTTPS domain.

- **Unified Origin**: Browser, REST API (`/api/*`), uploads, and client routing share one domain.
- **Session Security**: Uses HTTP-only, SameSite=Lax (or None with Secure), session cookies (`LBRCESESSION`), preventing third-party cookie blocks on iOS/Safari and Android.
- **Client Routing**: Full SPA fallback routing ensures direct navigation or page refresh on `/student/*`, `/staff/*`, `/admin/*`, or nested order paths always resolves without 404 errors.
- **Shared Relational Database**: Hosted MySQL 8+ instance accessed by all clients concurrently with safe HikariCP connection pooling and leak detection.

```text
External Users (Mobile / Desktop)
              │
              ▼ HTTPS
┌────────────────────────────────────────────────────────┐
│  Single Spring Boot Docker Service (Port 8080)         │
│  ├── Embedded React SPA Dist (Static Resources)        │
│  ├── REST API (/api/*) & Health Check (/api/health)    │
│  └── SPA Fallback Route Controller & ErrorViewResolver │
└─────────────┬───────────────────────────┬──────────────┘
              │ JDBC (SSL)                │ HTTPS
              ▼                           ▼
      Hosted MySQL Database       Cloudinary Media Storage
```

---

## 2. Required Environment Variables

Configure these environment variables in your hosting provider (Render, Railway, AWS ECS, or Docker):

| Variable | Required | Description | Example / Recommended Setting |
|---|---|---|---|
| `PORT` | Yes | Port Spring Boot listens on | `8080` (or injected by hosting platform) |
| `SPRING_DATASOURCE_URL` | **Yes** | JDBC connection URL for hosted MySQL (with SSL parameters) | `jdbc:mysql://<HOST>:<PORT>/lbrce_canteen?useSSL=true&requireSSL=true&sslMode=REQUIRED&connectTimeout=10000&socketTimeout=30000` |
| `SPRING_DATASOURCE_USERNAME` | **Yes** | Database username | `lbrce_db_user` |
| `SPRING_DATASOURCE_PASSWORD` | **Yes** | Database password | *(Keep secret)* |
| `JPA_DDL_AUTO` | Yes | Hibernate DDL validation mode | `validate` |
| `COOKIE_SECURE` | Yes | Enforce HTTPS Secure flag on session cookies | `true` |
| `COOKIE_SAME_SITE` | Yes | SameSite attribute for session cookie | `lax` |
| `BOOTSTRAP_ADMIN_USERNAME` | First Boot | Initial administrator login handle | `admin` |
| `BOOTSTRAP_ADMIN_EMAIL` | First Boot | Initial administrator email | `admin@lbrce.ac.in` |
| `BOOTSTRAP_ADMIN_PASSWORD` | First Boot | Initial administrator password (min 12 chars) | *(Keep secret, 12+ characters)* |
| `BOOTSTRAP_ADMIN_FULL_NAME` | Optional | Initial admin display name | `Canteen Administrator` |
| `CLOUDINARY_URL` | Optional | Cloudinary connection string for food image uploads | `cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>` |
| `CLOUDINARY_CLOUD_NAME` | Optional | Cloudinary cloud name (if not using CLOUDINARY_URL) | `lbrce-canteen` |
| `CLOUDINARY_API_KEY` | Optional | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Optional | Cloudinary API secret | *(Keep secret)* |
| `APP_CORS_ALLOWED_ORIGINS` | Optional | Allowed CORS origins (leave empty for same-origin single-app) | *(Leave blank or set custom domain)* |

> [!IMPORTANT]
> Never set `localhost` in production variables. Ensure your MySQL database user has permissions for `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE`, `DROP`, `INDEX`, `ALTER`.

---

## 3. Database Setup Steps

Before launching the container with `JPA_DDL_AUTO=validate`, initialize the hosted MySQL database:

1. Connect to your managed MySQL instance using MySQL CLI or a client (DBeaver, MySQL Workbench):
   ```bash
   mysql -h <HOST> -P <PORT> -u <USER> -p --ssl-mode=REQUIRED
   ```
2. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS lbrce_canteen CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE lbrce_canteen;
   ```
3. Execute the schema script:
   ```bash
   mysql -h <HOST> -P <PORT> -u <USER> -p lbrce_canteen < database/schema.sql
   ```
4. (Optional) Load sample menu items and categories:
   ```bash
   mysql -h <HOST> -P <PORT> -u <USER> -p lbrce_canteen < database/seed_data.sql
   ```

---

## 4. Deploying on Render (Blueprints or Manual)

### Option A: Using `render.yaml` (Recommended)
1. Push repository changes to GitHub.
2. In the Render Dashboard, create a **New Blueprint Instance** and connect the repository.
3. Fill in the sensitive environment variables (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `BOOTSTRAP_ADMIN_*`).
4. Click **Apply**.

### Option B: Manual Web Service
1. In Render, select **New Web Service** → **Build and deploy from a Git repository**.
2. Environment: **Docker** (using `./Dockerfile`).
3. Set the Health Check Path to: `/api/health`.
4. In the **Environment Variables** tab, configure the variables listed in Section 2.
5. Deploy.

---

## 5. First Boot & Admin Access

1. Once the service finishes deploying, the `AdminBootstrap` runner checks if any admin exists.
2. If the table is empty and valid `BOOTSTRAP_ADMIN_*` variables are provided, the initial administrator is created.
3. Navigate to `https://<YOUR-APP-URL>/login` and sign in with the configured admin username and password.
4. **Security Recommendation**: Once the admin account is verified, remove `BOOTSTRAP_ADMIN_PASSWORD` from your hosting dashboard environment variables.

---

## 6. Post-Deployment Smoke Verification

1. **Liveness Health Check**:
   ```bash
   curl -i https://<YOUR-APP-URL>/api/health
   # Expected response: HTTP 200 OK
   # {"success":true,"message":"Success","data":{"status":"UP"}}
   ```
2. **Direct SPA Route Navigation**:
   - Open `https://<YOUR-APP-URL>/student` directly in a fresh tab. Verify it smoothly forwards to `/login` without a 404 or white screen.
3. **Session Persistence**:
   - Register a student account or sign in as admin.
   - Refresh the page multiple times (`F5`). Verify the session remains active without redirect bounces.
4. **Cross-Device Synchronization**:
   - Log into staff portal (`/staff/queue`) on one device.
   - Place an order as a student on another device (`/student/menu` → checkout).
   - Verify the staff queue updates within 15 seconds.
   - Advance the status to `PREPARING` and `READY`. Verify the student tracking page updates live.
5. **Image Uploads**:
   - As admin, navigate to `/admin/foods`, add or edit a dish with an image upload.
   - Verify the image displays properly on both desktop and mobile clients.
