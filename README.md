# Petal & Pearl Boutique

A premium full-stack e-commerce platform for clothing and ornaments, built with React, NestJS, and PostgreSQL. Designed with a focus on rich aesthetics, smooth interactions, and robust management capabilities.

## Features

### Customer Experience
- Product Browsing: Browse artisanal clothing and ornaments with a high-end, premium UI.
- Filter and Search: Advanced, case-insensitive, and partial-matching filters for categories, materials, occasions, and colors.
- Shopping Cart: Add items, update quantities, and manage the shopping bag seamlessly.
- Wishlist: Save favorite items for later viewing.
- Quick View: Preview product details without leaving the current page.
- AI Chatbot: Intelligent customer support assistant providing instant help on policies, delivery, and more.
- Responsive Design: State-of-the-art responsive layout, including optimized mobile views with dual-column product cards.
- Coming Soon Mode: Interactive preview pages for upcoming seasonal collections.

### Admin Dashboard
- Revenue Overview: Dynamic 6-month revenue chart with real-time data visualization.
- Business Performance: Track monthly goal progress and order fulfillment rates.
- Growth Trends: Statistical trend indicators for revenue, active users, and order volume.
- Inventory Management: Monitor stock levels with instant increment/decrement controls and low-stock alerts.
- Product Management: Complete CRUD functionality with support for multiple product types and categories.
- Cloudinary Integration: Secure and optimized image hosting for all inventory items.

### Technical Excellence
- NestJS Backend: Modular architecture for high scalability.
- PostgreSQL & TypeORM: Robust data management with advanced query building.
- State Management: Efficient data fetching and caching using TanStack Query.
- Security: Role-based access control, JWT authentication, and secure headers via Helmet.
- Animations: Fluid micro-interactions and page transitions powered by Framer Motion.

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Axios
- Recharts
- TanStack Query
- Shadcn UI
- Lucide React

### Backend
- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- JWT
- Helmet
- Class Validator

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/SAIFUL-SIFAT/Petal_-_Pearl.git
cd Petal_-_Pearl
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file with your configuration
# Required: DATABASE_URL or DB credentials, JWT_SECRET

# Seed initial data
npm run seed

# Start the development server
npm run start:dev
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
# Add VITE_API_URL pointing to your backend

# Start the development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173 (standard Vite port)
- Backend API: http://localhost:3000

## Project Structure

```
petal-pearl-boutique/
├── backend/
│   ├── src/
│   │   ├── orders/          # Revenue analytics and order processing
│   │   ├── products/        # Advanced filtering and inventory logic
│   │   ├── users/           # Authentication and growth tracking
│   │   ├── notifications/   # System alerts
│   │   ├── scripts/         # Database seeding and migrations
│   │   └── app.module.ts
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # UI components (ProductCard, Carousel, etc.)
    │   ├── pages/           # View components and admin dashboard
    │   ├── hooks/           # Custom business logic hooks
    │   ├── context/         # Global state (Wishlist, QuickView)
    │   ├── lib/             # Utilities (Image optimization)
    │   └── api/             # Service layer
    └── package.json
```

## Key Modules Explained

### Analytics Engine
The backend aggregates monthly data to provide real-time performance insights. This includes revenue trends, user growth percentages, and fulfillment rate calculations displayed on the admin dashboard.

### Intelligent Filtering
The product search system implements flexible matching algorithms that account for singular/plural variations and case-sensitivity, ensuring customers always find what they are looking for.

### Design System
The application uses a custom design tokens approach for colors like Gold (#BFA045) and Emerald (#022c22), combined with glassmorphism effects and custom typography for a luxury feel.

## Available Scripts

### Backend
- npm run start:dev: Start development server
- npm run build: Build for production
- npm run start:prod: Start production server
- npm run seed: Populate database with initial data

### Frontend
- npm run dev: Start development server
- npm run build: Build for production
- npm run preview: Preview production build

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License.

## Author
Saiful Sifat
- GitHub: [@SAIFUL-SIFAT](https://github.com/SAIFUL-SIFAT)

## Acknowledgments
- Design inspiration from luxury boutique platforms
- UI components from Shadcn UI
- Icons from Lucide React
