# 🍽️ LBRCE Canteen Management System

A modern full-stack web application developed to digitize and streamline the canteen operations at **Lakireddy Bali Reddy College of Engineering (LBRCE)**. The system provides a seamless food ordering experience for students while enabling canteen staff and administrators to efficiently manage orders, menus, and sales.

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
- Vercel (Frontend Deployment)
- Render (Backend Deployment)

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

## 👥 User Roles & Default Credentials

| Role | Access | Default Username | Default Password |
|------|--------|------------------|------------------|
| **Admin** | Full System Management | `vishnureddy@gmail.com` | `Bunny@07` |
| **Admin (Alternative)** | Full System Management | `admin@lbrce.edu` | `admin123` |
| **Student** | Order Food, Track Orders, View History | *Register via Signup* | *Self-created* |
| **Staff** | Manage Orders & Food Availability | *Created by Admin* | *Created by Admin* |

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
1. Configure your local database properties in `backend/src/main/resources/application.yml` under `spring.datasource`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/lbrce_canteen?useSSL=false&useLegacyDatetimeCode=false&allowPublicKeyRetrieval=true
       username: root
       password: admin
   ```
2. Navigate to the backend directory and run:
   ```bash
   cd backend
   # Build the project
   mvn clean install
   # Run the application
   mvn spring-boot:run
   ```
   The backend runs at `http://localhost:8080`.

### 3. Frontend Setup
1. Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=/api
   ```
2. Install dependencies and start the Vite dev server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend runs at `http://localhost:5173`.

---

## 🛠️ Environment Variables Reference

### Frontend (`frontend/.env`)
```env
# In development, the Vite dev server proxies requests automatically
VITE_API_BASE_URL=/api
```

### Backend (`backend/src/main/resources/application.yml` or OS environment variables)
- `SPRING_DATASOURCE_URL`: JDBC Database URL
- `SPRING_DATASOURCE_USERNAME`: Database username (default: `root`)
- `SPRING_DATASOURCE_PASSWORD`: Database password (default: `admin`)
- `PORT`: Port for the backend application (default: `8080`)

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
