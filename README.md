# 🛒 ShopNest - Modern Full-Stack E-Commerce Platform

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Next.js 15](https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A feature-rich, high-performance **Full-Stack E-Commerce Platform** built with **NestJS**, **Next.js 15 (App Router)**, **MongoDB Atlas**, and **pnpm Monorepo**. Features role-based access control, JWT authentication, persistent cart management, product reviews, interactive pagination, and AI-assisted product search.

---

## ✨ Key Features

### 🛍️ Frontend (Client)
- **Next.js 15 App Router** with Turbopack for super-fast server rendering.
- **Modern Responsive Design** with custom gradient branding (`ShopNest`), Shadcn UI, and Tailwind CSS.
- **Hero Section & Dynamic Product Grid** with status indicators, ratings, and pagination.
- **Cart & Order System** featuring guest local storage and user server-side cart sync.
- **Dark/Light Theme Toggle** powered by `next-themes`.

### ⚙️ Backend (API)
- **NestJS Modular Architecture** with clean dependency injection, Controllers, DTOs, and Services.
- **MongoDB Atlas Integration** via `@nestjs/mongoose` schemas.
- **JWT & Cookie Authentication** with refresh token handling and Passport.js strategy.
- **Swagger Interactive API Documentation** available at `/api`.
- **Global Pipes & Helmet Security** for strict request validation and headers protection.

---

## 🛠️ Tech Stack

| Domain | Technologies Used |
|---|---|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn UI, Lucide Icons, TanStack Query |
| **Backend** | NestJS, TypeScript, Mongoose, Passport.js, JWT, Argon2, Swagger, Helmet |
| **Database** | MongoDB Atlas (Cloud NoSQL Database) |
| **Monorepo & Build** | pnpm Workspaces, TurboRepo, Cross-Env |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18+` or `v20+`
- **pnpm**: `pnpm install -g pnpm`

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/e-ticarat.git
cd e-ticarat
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Setup Environment Variables

#### `apps/server/.env`:
```env
PORT=5000
ALLOWED_ORIGINS=http://localhost:3000
MONGODB_URI=mongodb+srv://YOUR_DB_USER:YOUR_PASSWORD@cluster.mongodb.net/ecommerce
JWT_SECRET=your_jwt_secret
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

#### `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/v1
```

### 4. Seed Sample Products
```bash
cd apps/server
node seed-products.js
```

### 5. Run Development Servers

#### Start Backend (NestJS):
```bash
cd apps/server
pnpm run dev
```

#### Start Frontend (Next.js):
```bash
cd apps/web
pnpm run dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend API Server**: `http://localhost:5000/v1`
- **Swagger Documentation**: `http://localhost:5000/api`

---

## 📜 License
This project is open-source under the [MIT License](LICENSE).
