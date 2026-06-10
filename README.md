# HandArt Marketplace 🛍️

[![Status](https://img.shields.io/badge/status-production-brightgreen)](https://github.com/) [![Frontend](https://img.shields.io/badge/frontend-Next.js-blue)](https://nextjs.org/) [![Backend](https://img.shields.io/badge/backend-Node.js-%23339933)](https://nodejs.org/) [![Database](https://img.shields.io/badge/database-MongoDB-%2347A248)](https://www.mongodb.com/) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> A polished artisan marketplace for buyers and sellers to discover handcrafted products, manage listings, and complete orders with modern full-stack web architecture.

## 📌 Project Overview

HandArt Marketplace is a full-stack craft commerce platform built with a Next.js frontend and an Express/MongoDB backend. The application solves the problem of disconnected artisan commerce by providing:

- a curated storefront for buyers
- a seller studio for makers to manage listings
- order tracking and secure authentication
- product search, wishlist, and cart flows

## 🎯 Why It Was Built

This project was built to demonstrate end-to-end full-stack skills, including:

- role-based authentication
- product CRUD and seller workflows
- order management and checkout readiness
- responsive UI design for portfolio and internship-ready presentation

## 👥 Target Users

- Artisans and sellers who want to list handmade creations.
- Buyers who seek curated craft products.
- Recruiters reviewing modern full-stack development skills.
- Product managers or designers evaluating marketplace UX.

## 🌐 Live Demo

- Frontend deployment: `https://handcraft-mu.vercel.app/`
- Backend API: `https://handart-backend.onrender.com`

## 🖼️ Screenshots

![Homepage Preview](images/Screenshot%202026-06-10%20095835.png)

## ✨ Key Features

- Buyer and seller authentication with JWT
- Product browsing, search, category filters
- Wishlist, cart, and checkout-ready ordering
- Seller product management (create, edit, delete)
- Order history and seller order status updates
- Cloudinary image upload support for product media
- Responsive, mobile-friendly interface
- Razorpay-ready payment integration support

## 📱 Mobile View

The frontend layout is built with responsive styles and supports mobile devices. The navbar, hero section, product cards, cart, and account flows adapt to narrow screens.

## 🧑‍💻 User Features

- Browse craft categories and product details
- Search products by title and filter by category
- Add items to cart and wishlist
- Create buyer accounts and login
- View order history and shipping details
- Dark mode toggle and in-browser persistence

## 🏬 Seller Features

- Register as a seller and access seller-only routes
- Upload and manage products with images
- View seller product list and inventory
- Edit or delete own product listings
- Review orders for sold items
- Update order status to shipped or delivered

## 🔐 Authentication

- Buyer and seller signup/login flows
- JWT authentication for protected API endpoints
- Password hashing with bcryptjs
- Role-based access control via middleware

## 🔍 Search and Filtering

- Search query support for product titles
- Category filtering in product list endpoints
- Server-side filters for efficient browsing

## 📱 Responsive Design

- Styled using inline responsive layout patterns
- Mobile-friendly hero, product grid, and navigation
- LocalStorage persistence for cart and wishlist

## 💳 Payment Integration

- Razorpay dependency installed in backend
- Order schema includes `razorpayOrderId` and `razorpayPaymentId`
- Payments route scaffolded for future checkout integration

## 🛠️ Tech Stack

| Layer          | Technologies                                                |
| -------------- | ----------------------------------------------------------- |
| Frontend       | Next.js, React 19, TypeScript, Tailwind CSS 4, ESLint       |
| Backend        | Node.js, Express 5, MongoDB, Mongoose, Cloudinary, Razorpay |
| Database       | MongoDB Atlas / self-hosted MongoDB                         |
| Authentication | JWT, bcryptjs                                               |
| Deployment     | Vercel, Render / Railway / Heroku                           |

## 🏗️ Project Architecture

### Frontend structure

- `frontend/app/` — main page and route components
- `frontend/components/` — reusable UI elements such as `Navbar`
- `frontend/context/` — global app state and cart/session handling
- `frontend/lib/` — API utilities and helper logic
- `frontend/public/` — static assets

### Backend structure

- `backend/server.js` — Express app entrypoint
- `backend/routes/` — API route files for auth, products, orders, payments
- `backend/models/` — Mongoose schemas for User, Product, Order
- `backend/middleware/` — auth middleware for JWT and role checks
- `backend/config/` — database connection logic

### Database flow

- `User` creates accounts as `buyer` or `seller`
- `Seller` creates `Product` listings
- `Buyer` places `Order` items from seller products
- Orders reference both buyer and seller for relationship tracking

## 📁 Folder Structure

```
handcraft/
├─ backend/
│  ├─ config/db.js
│  ├─ middleware/auth.js
│  ├─ models/Order.js
│  ├─ models/Product.js
│  ├─ models/User.js
│  ├─ routes/auth.js
│  ├─ routes/orders.js
│  ├─ routes/payments.js
│  ├─ routes/products.js
│  └─ server.js
└─ frontend/
   ├─ app/
   │  ├─ artisans/[id]/
   │  ├─ cart/page.tsx
   │  ├─ checkout/page.tsx
   │  ├─ dashboard/page.tsx
   │  ├─ login/page.tsx
   │  ├─ my-account/page.tsx
   │  ├─ orders/
   │  ├─ products/
   │  ├─ signup/page.tsx
   │  └─ wishlist/page.tsx
   ├─ components/Navbar.tsx
   ├─ context/AppContext.tsx
   ├─ lib/api.ts
   └─ globals.css
```

## 🚀 Installation & Setup

### 1. Clone repository

```bash
git clone https://github.com/Sujaykr99/handcraft
cd handcraft
```

### 2. Install dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 3. Environment variables setup

Create a `.env` file inside `backend/` with the variables below.

### 4. Run frontend

```bash
cd frontend
npm run dev
```

### 5. Run backend

```bash
cd backend
npm run dev
```

## 🔑 Environment Variables

Create `backend/.env` with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 🧪 API Endpoints

### Authentication routes

| Endpoint           | Method | Description              |
| ------------------ | ------ | ------------------------ |
| `/api/auth/signup` | POST   | Register buyer or seller |
| `/api/auth/login`  | POST   | Authenticate user        |
| `/api/auth/me`     | GET    | Get profile from JWT     |

### Product routes

| Endpoint                     | Method | Access | Description          |
| ---------------------------- | ------ | ------ | -------------------- |
| `/api/products`              | GET    | Public | Browse all products  |
| `/api/products/:id`          | GET    | Public | Product detail       |
| `/api/products/seller/my`    | GET    | Seller | Seller product list  |
| `/api/products/upload-image` | POST   | Seller | Upload product image |
| `/api/products`              | POST   | Seller | Create product       |
| `/api/products/:id`          | PUT    | Seller | Edit own product     |
| `/api/products/:id`          | DELETE | Seller | Delete own product   |

### Order routes

| Endpoint                 | Method | Access        | Description         |
| ------------------------ | ------ | ------------- | ------------------- |
| `/api/orders`            | POST   | Buyer         | Create a new order  |
| `/api/orders/my`         | GET    | Buyer         | Buyer order history |
| `/api/orders/seller`     | GET    | Seller        | Seller order list   |
| `/api/orders/:id/status` | PUT    | Seller        | Update order status |
| `/api/orders/:id`        | GET    | Authenticated | Order detail        |

### Payment routes

| Endpoint        | Method | Access | Description            |
| --------------- | ------ | ------ | ---------------------- |
| `/api/payments` | GET    | Public | Payment route scaffold |

## 🧱 Database Schema

### Main collections

- `User`
- `Product`
- `Order`

### User schema

- `name`, `email`, `password`, `role`, `avatar`
- Roles: `buyer`, `seller`

### Product schema

- `seller` → User reference
- `title`, `description`, `price`, `category`, `image`, `stock`
- `variants` array for size/color options

### Order schema

- `buyer` → User reference
- `seller` → User reference
- `items` → array of order item details
- `totalAmount`, `status`, `shippingAddress`
- Razorpay integration fields: `razorpayOrderId`, `razorpayPaymentId`

## 🔗 Relationships

- One seller to many products
- One buyer to many orders
- One seller to many orders
- Orders contain references to products and users

## 🧠 Challenges Faced

- Implementing role-based access control for buyer and seller flows
- Creating robust product CRUD with protected upload routes
- Designing a portfolio-ready responsive landing page
- Managing session state for cart, wishlist, and auth

## 🎓 Learning Outcomes

- Built a production-style full-stack marketplace
- Used JWT and bcrypt for authentication security
- Connected a React/Next.js frontend with an Express API
- Modeled relationships in MongoDB with Mongoose
- Designed a responsive user interface for desktop and mobile

## ⚡ Performance Optimizations

- Caching: localStorage persistence for cart and wishlist
- Code splitting: Next.js route-based splitting for fast page loads
- Image optimization: Cloudinary upload transformations with responsive delivery
- API optimization: query filters and indexed Mongoose models

## 🛡️ Security Features

- JWT authentication for protected routes
- Password hashing with bcryptjs
- Role-based middleware for seller-only access
- Input checks for required fields and ownership validation

## 🚧 Future Improvements

- Add full checkout payment flow with Razorpay
- Build admin dashboard and analytics panels
- Add product reviews, ratings, and seller profiles
- Add server-side search indexing and caching
- Deploy as a scalable microservices architecture

## ☁️ Deployment

### Vercel configuration

- Deploy `frontend/` as a Next.js project
- Set environment variables in Vercel dashboard if frontend requires them
- Ensure backend API URL is configured in frontend API calls

### Render configuration

- Deploy `backend/` as a Node.js service
- Configure `server.js` port and `MONGO_URI`, `JWT_SECRET`, Cloudinary vars
- Optionally add a `Dockerfile` for container deployment

### Environment setup

- Use separate env configs for production and local development
- Secure secrets with deployment platform vaults or environment settings

## ✅ Testing

### Manual testing steps

1. Start frontend and backend servers.
2. Create a buyer account and login.
3. Browse products, add items to cart, and place an order.
4. Create a seller account and login.
5. Create a product, update it, and delete it.
6. Verify seller order list and update order status.

### Test accounts

- Buyer account: any valid email/password combination
- Seller account: any valid email/password combination with role set to `seller`

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Add tests and update the README if needed
4. Submit a pull request

## 📄 License

MIT License

## 👨‍💻 Author

- Name: `sujay kumar singh`
- GitHub: [github.com/Sujaykr99](https://github.com/Sujaykr99)
