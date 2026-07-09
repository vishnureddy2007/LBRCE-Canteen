# LBRCE Canteen Management System

A full-stack canteen ordering & management platform built for **LBRCE (Lakireddy
Balireddy College of Engineering)**. Students browse the menu, place orders,
track them in real-time, and download a PDF receipt. Canteen staff triage
incoming orders and toggle availability. Admins manage food, students, staff,
announcements, offers, and view sales reports.

> **Stack:** React 18 + Vite + Tailwind CSS v3 (dark-mode default) on the
> frontend; Spring Boot 3 + Java 17 + MySQL 8 on the backend.

---

## Features

### For students
- Browse the menu with category tabs, search, and live availability
- Cart with quantities persisted to localStorage
- Place Cash or UPI orders; receive an order number like `ORD-20250627-0001`
- Real-time order tracking (Placed → Preparing → Ready → Delivered)
- Cancel orders while still in PLACED status
- Download a branded PDF receipt for any of your orders
- Submit star ratings + comments on delivered orders
- See active announcements on the dashboard

### For staff
- Real-time order queue with accept / reject / status updates
- Quick toggle for "sold out" on any menu item
- View today's order history

### For admins
- Dashboard with KPIs (students, items, orders, delivered revenue)
- Full CRUD for food items (with image upload), students, staff
- Sales reports with chart and top-selling items (daily / weekly / monthly)
- Announcements and offers management
- All-orders search & status filtering

---

## Project layout

```
C:\LBRCE-Canteen-MS\
├── frontend/          React + Vite + Tailwind (dark-mode capable)
├── backend/           Spring Boot 3 (Java 17, Maven)
├── database/          MySQL schema, seed data, ER diagram
└── documentation/     All docs (this folder)
```

See **[INSTALLATION.md](INSTALLATION.md)** for setup, **[API.md](API.md)** for the
full REST reference, **[ARCHITECTURE.md](ARCHITECTURE.md)** for the architecture
walk-through, **[DATABASE.md](DATABASE.md)** for the schema, and
**[USER_GUIDE.md](USER_GUIDE.md)** for end-user walkthroughs.

---

## Quick start (TL;DR)

```bash
# 1. Database
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed_data.sql

# 2. Backend
cd backend
./mvnw spring-boot:run            # Windows:  mvnw spring-boot:run

# 3. Frontend (new terminal)
cd frontend
npm install
npm run dev                        # opens http://localhost:5173
```

Default admin login: **admin@lbrce.edu** / **admin123**.

---

## Tech highlights

- **Dark-mode first** — Tailwind `darkMode: 'class'` strategy with persistence.
  Every surface has hand-tuned dark variants. The toggle lives in the navbar.
- **Layered backend** — Controller → Service → Repository → Entity, DTOs on
  the wire, `@PreAuthorize("hasRole(...)")` on role-restricted endpoints.
- **Single SecurityConfig** — form login, session cookie, BCrypt, CORS for the
  Vite dev server.
- **Standard envelope** — every API response is `{ success, data, message, errors }`,
  unwrapped automatically on the frontend.
- **Hot reload for both stacks** — Spring DevTools + Vite HMR.

---

## License

Internal — LBRCE Canteen.
