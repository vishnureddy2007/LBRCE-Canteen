# 🍽️ LBRCE Canteen Management System

A modern full-stack web application developed to digitize and streamline the canteen operations at **Lakireddy Bali Reddy College of Engineering (LBRCE)**. The system provides a seamless food ordering experience for students while enabling canteen staff and administrators to efficiently manage orders, menus, and sales.

## Production architecture

The production app is a single Spring Boot deployment. Its Docker build embeds the
React frontend in the backend, so the browser calls relative `/api` and `/uploads`
paths on one HTTPS origin. This avoids cross-site cookie issues and ensures users
never need to know a separate backend URL.

```text
Student browser → Spring Boot (React + API) → MySQL
                                      └──→ Cloudinary (optional food-image uploads)
```

Authentication has explicit initialization states: the client checks the session
before protected routes decide whether to redirect, login and sign-up establish a
server session, and a transient API error never causes an automatic retry loop.

For exact single-service, MySQL, and optional Cloudinary configuration, see
[DEPLOYMENT.md](DEPLOYMENT.md) and the non-secret templates in `.env.example`.

---

## ⚡ Quick Start for External Evaluators & Developers

Run the complete full-stack system and pre-seeded database in one command:

```bash
# Windows: Double-click or run:
start-docker.bat

# Linux / macOS:
./start-docker.sh
```

| Component | URL / Connection | Credentials |
|---|---|---|
| **Web Application** | [http://localhost:8080](http://localhost:8080) | Admin: `admin` / `Admin@12345678`<br>Staff: `STAFF001` / `Staff@12345678`<br>Student: `20LBR001` / `Student@12345678` |
| **Visual DB Management (phpMyAdmin)** | [http://localhost:8081](http://localhost:8081) | Pre-logged in *(or root / rootpassword)* |
| **Direct MySQL Connection** | `localhost:3306` | DB: `lbrce_canteen`, User: `canteen_user`, Pass: `canteen_pass` |

👉 *For H2 in-memory zero-install mode, local native runs, cloud database setup, or sharing over Wi-Fi/Internet, see [EXTERNAL_ACCESS_GUIDE.md](EXTERNAL_ACCESS_GUIDE.md).*

---

## 📌 Features

### 👨‍🎓 Student
- Secure Login & Registration
- Browse Food Menu
- Add Items to Cart
- Place Orders (Cash on Pickup & UPI options)
- Track Order Status (Placed → Preparing → Ready → Delivered)
- View Order History
- Profile Management
- Download Order PDF Receipts
- View Announcements & Offers

### 👨‍🍳 Canteen Staff
- View Incoming Orders (Real-time Order Queue)
- Update Order Status
- Manage Food Availability (Quick sold-out toggle)
- View Daily Orders & History

### 👨‍💼 Admin
- Dashboard Analytics & KPIs (Delivered Revenue, Total Orders, Students, Food Items)
- Manage Students & Staff
- Add/Edit/Delete Food Items (with image uploads)
- Category Management
- Announcement & Offers Management
- Sales Reports & Charts (Daily, Weekly, Monthly)
- User Management
- Role-Based Access Control

---

## 🚀 Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Zustand
- Recharts
- jsPDF (for receipt generation)

### Backend
- Java 17
- Spring Boot 3
- Spring Security (Session-Based Auth)
- Spring Data JPA
- REST API

### Database
- MySQL 8

### Tools & Services
- Maven
- Git & GitHub
- One Docker-hosted Spring Boot application (frontend + backend)

---

## 📂 Project Structure

```
LBRCE-Canteen-MS/
│
├── frontend/          # React + Vite + Tailwind (dark-mode default)
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/           # Spring Boot 3 (Java 17, Maven)
│   ├── src/
│   ├── pom.xml
│   └── src/main/resources/application.yml
│
├── database/          # MySQL schema, seed data, ER diagram
│   ├── schema.sql
│   ├── seed_data.sql
│   └── ER_diagram.md
│
├── documentation/     # API, User Guide, and Architecture documents
│   └── README.md
│
└── README.md          # Main project README (this file)
```

---

## 🔐 Authentication

- Spring Security
- Session-Based Authentication (Secure Cookies)
- Role-Based Authorization
- Protected Routes
- Secure Password Encryption (BCrypt)

---

## 👥 User Roles & Access

| Role | Access |
|------|--------|
| **Admin** | Full System Management |
| **Student** | Order Food, Track Orders, View History |
| **Staff** | Manage Orders & Food Availability |

---

## 📊 Modules

- **Authentication**: Secure student/staff/admin login & registration.
- **Dashboard**: KPI analytics for Admin; Announcements and quick actions for students.
- **Menu Management**: Admin CRUD of food items, categorization, prices, and images.
- **Category Management**: Organized tabs for Breakfast, Lunch, Snacks, Beverages, Fast Food.
- **Cart & Order Management**: State-persisted cart, real-time status updates from Placed to Delivered.
- **Payment Module**: Simulated Cash on Pickup and UPI payments.
- **Announcement Module**: Admin broadcast announcements visible on student dashboards.
- **User Management**: Admin control of student profiles and staff credentials.
- **Reports & Analytics**: High-quality visual reports of sales and top-selling items.

---

## ⚙️ Installation & Setup

### 1. Database Setup
Ensure MySQL is running, then load the schema and seed data:
```bash
# Connect to MySQL and run:
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS lbrce_canteen;"
mysql -u root -p lbrce_canteen < database/schema.sql
mysql -u root -p lbrce_canteen < database/seed_data.sql
```

### 2. Backend Setup
1. Configure environment variables or use the `dev` profile for local testing:
   ```bash
   # Option A: Run with local MySQL using the dev profile
   mvn spring-boot:run -Dspring-boot.run.profiles=dev

   # Option B: Run with environment variables pointing to your database
   export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/lbrce_canteen?useSSL=false&allowPublicKeyRetrieval=true&connectTimeout=10000&socketTimeout=30000"
   export SPRING_DATASOURCE_USERNAME="YOUR_DB_USERNAME"
   export SPRING_DATASOURCE_PASSWORD="YOUR_DB_PASSWORD"
   mvn spring-boot:run
   ```
   The backend runs at `http://localhost:8080`.

### 3. Frontend Setup
1. In the `frontend` directory:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend runs at `http://localhost:5173`. In development, Vite proxies `/api` and `/uploads` to `http://localhost:8080`.

### 4. Single-Container Production Build (Docker)
Build and run the entire unified app (frontend + backend) in one container:
```bash
docker build -t lbrce-canteen .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://<HOST>:<PORT>/lbrce_canteen?useSSL=true&requireSSL=true&sslMode=REQUIRED" \
  -e SPRING_DATASOURCE_USERNAME="<DB_USER>" \
  -e SPRING_DATASOURCE_PASSWORD="<DB_PASS>" \
  -e JPA_DDL_AUTO="validate" \
  -e BOOTSTRAP_ADMIN_USERNAME="admin" \
  -e BOOTSTRAP_ADMIN_EMAIL="admin@lbrce.ac.in" \
  -e BOOTSTRAP_ADMIN_PASSWORD="<STRONG_PASSWORD_12_CHARS>" \
  lbrce-canteen
```

---

## 🛠️ Environment Variables Reference

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Application server port | `8080` |
| `SPRING_DATASOURCE_URL` | JDBC Database URL (with SSL parameters in prod) | `jdbc:mysql://HOST:PORT/DB?useSSL=true...` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `lbrce_user` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | *(Secret)* |
| `JPA_DDL_AUTO` | Hibernate schema validation mode | `validate` |
| `COOKIE_SECURE` | Enforce HTTPS Secure flag on session cookies | `true` |
| `COOKIE_SAME_SITE` | Cookie SameSite attribute (`lax` / `none`) | `lax` |
| `BOOTSTRAP_ADMIN_USERNAME` | First admin account username | `admin` |
| `BOOTSTRAP_ADMIN_EMAIL` | First admin account email | `admin@lbrce.ac.in` |
| `BOOTSTRAP_ADMIN_PASSWORD` | First admin account password (12+ chars) | *(Secret)* |
| `CLOUDINARY_URL` | Cloudinary URL for stateless image uploads | `cloudinary://...` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `lbrce-canteen` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | *(Secret)* |
| `APP_CORS_ALLOWED_ORIGINS` | Permitted external origins (leave empty for same origin) | *(Empty)* |

---

## 📈 Future Enhancements

- QR Code Ordering at tables.
- Push & Email Notifications for order readiness.
- AI-Based Food Recommendation based on purchase history.
- Inventory Management module for ingredient tracking.
- UPI Payment Gateway integration.
- Mobile application client.

---

## 🎯 Learning Outcomes

- Full Stack Web Development with React and Spring Boot.
- Security-first session management using Spring Security.
- Relational Database Design with MySQL and JPA/Hibernate.
- State management utilizing Zustand.
- Professional reporting dashboard using Recharts.
- Branded PDF Receipt generation on-the-fly.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is developed for educational purposes at **Lakireddy Bali Reddy College of Engineering (LBRCE)**.

---

## 👨‍💻 Developer

**Guntaka Nilakanta Vishnu Vardhan Reddy**

- 🎓 B.Tech – Information Technology
- 🏫 Lakireddy Bali Reddy College of Engineering
- 🌐 GitHub: [vishnureddy2007](https://github.com/vishnureddy2007)

---

⭐ If you found this project useful, don't forget to **Star** the repository.
