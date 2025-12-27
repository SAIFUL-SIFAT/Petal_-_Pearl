# Petal & Pearl - E-Commerce Platform

A modern, full-stack e-commerce platform for clothing and ornaments built with React, TypeScript, and NestJS.

## 🚀 Features

### Customer Features
- 🛍️ Browse products by category (Clothing & Ornaments)
- 🛒 Shopping cart with real-time updates
- 💳 Complete checkout flow with multiple payment methods
- 📦 Order tracking and history
- 💬 AI-powered chatbot for customer support
- 👤 User authentication and profile management
- 📱 Fully responsive design

### Admin Features
- 📊 Real-time dashboard with analytics
- 📦 Product management (CRUD operations)
- 👥 User management
- 📈 Revenue and sales tracking
- 🔒 Role-based access control

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **State Management**: React Context + TanStack Query
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Zod

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **Security**: Helmet, CORS

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Git

## 🔧 Installation

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

# Create .env file
cp .env.example .env

# Update .env with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=your_password
# DB_NAME=petal_&_pearl
# JWT_SECRET=your_secret_key
# FRONTEND_URL=http://localhost:8080

# Start the backend server
npm run start:dev
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:3000" > .env

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:8080`

## 📁 Project Structure

```
petal-pearl-boutique/
├── backend/
│   ├── src/
│   │   ├── orders/          # Order management
│   │   ├── products/        # Product CRUD
│   │   ├── users/           # User authentication
│   │   ├── app.module.ts    # Main module
│   │   └── main.ts          # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── context/         # React contexts
│   │   ├── api/             # API services
│   │   └── App.tsx          # Root component
│   └── package.json
│
└── README.md
```

## 🔐 Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=petal_&_pearl
DB_SYNC=true
PORT=3000
FRONTEND_URL=http://localhost:8080
JWT_SECRET=your_secret_key
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## 🚀 Deployment

### Backend Deployment
1. Set `DB_SYNC=false` in production
2. Use environment variables for all sensitive data
3. Enable HTTPS
4. Configure proper CORS settings

### Frontend Deployment
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your hosting service
3. Update `VITE_API_URL` to your production API URL

## 📝 Available Scripts

### Backend
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Saiful Sifat**
- GitHub: [@SAIFUL-SIFAT](https://github.com/SAIFUL-SIFAT)

## 🙏 Acknowledgments

- shadcn/ui for the beautiful UI components
- NestJS for the robust backend framework
- React team for the amazing frontend library
