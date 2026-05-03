# Petal & Pearl — Premium Boutique Ecosystem

<div align="center">
  <img src="frontend/public/logo.png" width="120" height="120" alt="Petal & Pearl Logo" />
  <p><strong>A high-end, full-stack boutique platform designed for the modern fashion ecosystem.</strong></p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)](https://react.dev/)
  [![NestJS](https://img.shields.io/badge/Backend-NestJS-red?logo=nestjs)](https://nestjs.com/)
  [![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql)](https://www.postgresql.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-blue?logo=tailwind-css)](https://tailwindcss.com/)

  <p>Browse exquisite artisanal clothing, manage global inventory, and track business performance — all through a <b>stunningly animated and responsive interface</b>.</p>

  <a href="https://petalpearl.netlify.app"><strong>Explore the Boutique »</strong></a>
  <br />
  <br />
</div>

---

## Table of Contents

- [Elegance First, Always](#elegance-first-always)
- [Why Petal & Pearl Exists](#why-petal--pearl-exists)
- [Feature Ecosystem](#feature-ecosystem)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [License](#license)

## Elegance First, Always

Petal & Pearl is built on the principle of **uncompromising aesthetics**.

- **Premium UI/UX:** A bespoke design system utilizing glassmorphism, fluid animations (Framer Motion), and luxury typography.
- **Unified Management:** One platform to rule both the storefront and the back-office, bridging the gap between customer and curator.
- **Smart Analytics:** Real-time revenue tracking and performance insights, not just simple data tables.
- **Blazing Fast:** Optimized client-side state management with TanStack Query and a modular NestJS backbone.

## Why Petal & Pearl Exists

The fashion and ornament industry often suffers from outdated digital experiences.

- **Generic Platforms:** Standard e-commerce templates often lack the "luxury feel" required for high-end artisanal products.
- **Management Fragmentation:** Small boutiques often juggle separate tools for inventory, sales tracking, and customer engagement.
- **Performance Gaps:** Heavy image catalogs often lead to slow load times, hurting conversion rates.

Petal & Pearl addresses these challenges by offering a custom-tailored, high-performance boutique ecosystem.

## Feature Ecosystem

Petal & Pearl provides a beautifully designed interface housing two primary modules:

### Customer Experience
- **Artisanal Catalog:** Browse clothing and ornaments with advanced filtering (category, material, occasion).
- **Interactive Shopping:** Seamless cart management, wishlist functionality, and quick-view previews.
- **AI Concierge:** Intelligent customer support assistant for instant policy and product guidance.

### Admin Dashboard
- **Revenue Command Center:** 6-month visual analytics with revenue growth and order fulfillment tracking.
- **Inventory Matrix:** Real-time stock management with instant increment/decrement and low-stock alerts.
- **Product Curator:** Complete CRUD system for catalog management with Cloudinary image optimization.

## Project Structure

The project follows a clean monorepo-style structure separating concerns:

```text
Petal_-_Pearl/
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── api/          # Axios services and API definitions
│   │   ├── components/   # Reusable UI components & shadcn primitives
│   │   ├── context/      # React Context (Auth, Wishlist, QuickView)
│   │   ├── data/         # Static data and constants
│   │   ├── hooks/        # Custom hooks (Debounce, Throttle, Cart, etc.)
│   │   ├── lib/          # Utility functions and shared logic
│   │   └── pages/        # Storefront, Admin & Dashboard views
├── backend/              # NestJS application
│   ├── src/
│   │   ├── auth/         # Authentication & JWT logic
│   │   ├── products/     # Catalog, inventory & filtering
│   │   ├── orders/       # Order processing & revenue analytics
│   │   ├── users/        # User profile & role management
│   │   ├── carts/        # Cart persistence logic
│   │   ├── cloudinary/   # Image hosting integration
│   │   ├── mailing/      # Email services (SendGrid/SMTP)
│   │   ├── notifications/# System & user alerts
│   │   ├── recovery/     # Password recovery & reset
│   │   ├── steadfast/    # Courier/Delivery integration
│   │   └── scripts/      # Database seeding and migrations
└── README.md
```

## Getting Started

Petal & Pearl is built with **React**, **NestJS**, and **PostgreSQL**.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SAIFUL-SIFAT/Petal_-_Pearl.git
   cd Petal_-_Pearl
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Configure .env with your PostgreSQL & JWT credentials
   npm run seed      # To populate initial demo data
   npm run start:dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Open [http://localhost:5173](http://localhost:5173)** in your browser.

## Architecture

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, TanStack Query.
- **Backend:** NestJS, TypeScript, TypeORM, PostgreSQL.
- **Security:** JWT Authentication, Role-Based Access Control (RBAC), Helmet.
- **Storage:** Cloudinary (Images).

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Built with ❤️ by Saiful Sifat. Star this repo if you find it useful!
</div>
