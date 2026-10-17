# 🚀 Cloud Deployment, CI/CD & Persistent User Storage Guide

This guide gives you a **permanent live web link** for your project with **Continuous Integration / Continuous Deployment (CI/CD)** and a **persistent cloud database** where user logins and credentials are permanently saved across updates.

---

## 🎯 Architecture: How It Works

```text
 💻 Developer                  🐙 GitHub Repository                  ☁️ Render / Railway
(Local Machine)           (vishnureddy2007/LBRCE-Canteen)              (Live Web Link)
      │                                 │                                    │
      │ 1. git push origin main         │                                    │
      ├────────────────────────────────►│                                    │
      │                                 │ 2. CI: GitHub Actions              │
      │                                 │    Runs build & tests              │
      │                                 │                                    │
      │                                 │ 3. CD: Webhook triggers build      │
      │                                 ├───────────────────────────────────►│
      │                                 │                                    │
      │                                 │                                    ▼
      │                                                      ┌───────────────────────────────┐
      │                                                      │  Live App (Port 8080)         │
      │                                                      │  https://<your-app>.render.com│
      │                                                      └───────────────┬───────────────┘
      │                                                                      │
      │                                                        SSL Connection│ (Persistent)
      │                                                                      ▼
      │                                                      ┌───────────────────────────────┐
      │                                                      │   Hosted Cloud MySQL 8        │
      │                                                      │   (Aiven / Railway / TiDB)    │
      │                                                      │   • User credentials stored   │
      │                                                      │   • Order history stored      │
      │                                                      │   • Survives redeployments    │
      │                                                      └───────────────────────────────┘
```

---

## 🛠️ Step 1: Create Your Free TiDB Cloud Database (2 mins, No Credit Card)

TiDB Cloud Serverless is 100% MySQL compatible, provides **25 GB free forever**, and has a **built-in browser SQL editor**:

1. Go to **[https://tidbcloud.com/](https://tidbcloud.com/)** and click **Sign Up** (Sign in with Google or GitHub).
2. Choose **Serverless (Free)** tier.
3. Name your cluster (e.g. `lbrce-canteen`) and choose a region close to you (e.g., `Mumbai`, `Singapore`, or `Frankfurt`).
4. Click **Create**. Your database is ready in ~10 seconds!
5. On the popup (or click **Connect** on the dashboard):
   - Choose connection method: **Java / Spring Boot** (or **General**).
   - Set a strong password and save it.
   - You will see your connection parameters:
     - **Host**: e.g. `gateway01.ap-south-1.prod.aws.tidbcloud.com`
     - **Port**: `4000`
     - **User**: e.g. `xxxxxx.root`
     - **Database**: `test` (or `lbrce_canteen`)
     - **Password**: `<YOUR_TIDB_PASSWORD>`
6. **Initialize Tables directly in the TiDB Browser SQL Editor**:
   - In TiDB Cloud dashboard, click **SQL Editor** on the left menu.
   - Copy the contents of [`database/schema.sql`](database/schema.sql) and paste it into the editor, then click **Run**.
   - Copy the contents of [`database/seed_data.sql`](database/seed_data.sql) and paste it into the editor, then click **Run**.
   - Tables, categories, food items, and test users are now live in the cloud!

---

## 🌐 Step 2: Deploy to Render for a Live Public Link & CI/CD (3 mins)

Render connects directly to your GitHub repository and redeploys automatically on every `git push`.

1. Go to [https://render.com/](https://render.com/) and sign in with your GitHub account.
2. Click **New +** in the top navigation and select **Web Service**.
3. Select **Build and deploy from a Git repository**.
4. Choose your repository: `vishnureddy2007/LBRCE-Canteen`.
5. Configure the service:
   - **Name**: `lbrce-canteen` (or any custom name)
   - **Region**: Choose the same region as your TiDB database (e.g., Singapore, Frankfurt, Oregon)
   - **Branch**: `main`
   - **Runtime**: **Docker** (Render will automatically detect your `./Dockerfile`)
   - **Instance Type**: **Free**
6. Scroll down to **Environment Variables** and click **Add Environment Variable** for each:

| Key | Value | Notes |
|---|---|---|
| `PORT` | `8080` | Application port |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://<GATEWAY_HOST>:4000/lbrce_canteen?useSSL=true&requireSSL=true&sslMode=REQUIRED&serverTimezone=UTC&connectTimeout=10000&socketTimeout=30000` | Replace `<GATEWAY_HOST>` with your TiDB host |
| `SPRING_DATASOURCE_USERNAME` | `<CLUSTER_PREFIX>.root` | Your TiDB username |
| `SPRING_DATASOURCE_PASSWORD` | `<YOUR_TIDB_PASSWORD>` | Your TiDB password |
| `JPA_DDL_AUTO` | `update` | Automatically creates tables and persists user data |
| `COOKIE_SECURE` | `true` | Required for HTTPS production session cookies |
| `COOKIE_SAME_SITE` | `lax` | Session cookie attribute |
| `BOOTSTRAP_ADMIN_USERNAME` | `admin` | Initial admin username |
| `BOOTSTRAP_ADMIN_EMAIL` | `admin@lbrce.ac.in` | Initial admin email |
| `BOOTSTRAP_ADMIN_PASSWORD` | `Admin@12345678` | Initial admin password (min 12 chars) |
| `BOOTSTRAP_ADMIN_FULL_NAME` | `Canteen Administrator` | Display name |

7. Click **Create Web Service**.
8. Render will build the Docker container and provide you with your **Live Public Link**:
   ```
   https://lbrce-canteen.onrender.com
   ```

---

## 🔄 Step 3: Continuous Integration & Continuous Updates (CI/CD)

Whenever you make any changes to your code:

```bash
# 1. Stage changes
git add .

# 2. Commit your update
git commit -m "Update feature or design"

# 3. Push to GitHub
git push origin main
```

### What Happens Automatically:
1. **GitHub Actions CI**:
   - The `.github/workflows/ci.yml` pipeline starts automatically.
   - Builds the React frontend and compiles Spring Boot tests to confirm code stability.
2. **Render Automatic Deployment (CD)**:
   - Render detects the push to `main` through its GitHub webhook.
   - Builds the new Docker image and switches traffic to the updated version with zero downtime.
3. **Persistent Data Retention**:
   - Because the database is hosted independently in the cloud, all registered users, passwords, food menu items, and order history are **completely preserved across every deployment**!

---

## ⚡ Alternative Instant Option: Share Public Link Today (Tunneling)

If you want an immediate public HTTPS link to test with users right now before deploying to Render:

1. Start your local application with Docker:
   ```bash
   .\start-docker.bat
   ```
2. In a second terminal, run:
   ```bash
   npx localtunnel --port 8080
   ```
3. Localtunnel will generate a public HTTPS URL:
   ```
   your url is: https://canteen-xyz.loca.lt
   ```
4. Any external user anywhere in the world can open that URL, register an account, and their credentials are stored in your running database!
