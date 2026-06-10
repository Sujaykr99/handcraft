# HandArt Marketplace ðŸ›ï¸

[![Status](https://img.shields.io/badge/status-production-brightgreen)](https://github.com/) [![Frontend](https://img.shields.io/badge/frontend-Next.js-blue)](https://nextjs.org/) [![Backend](https://img.shields.io/badge/backend-Node.js-%23339933)](https://nodejs.org/) [![Database](https://img.shields.io/badge/database-MongoDB-%2347A248)](https://www.mongodb.com/) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> A polished artisan marketplace for buyers and sellers to discover handcrafted products, manage listings, and complete orders with modern full-stack web architecture.

## ðŸ“Œ Project Overview

HandArt Marketplace is a full-stack craft commerce platform built with a Next.js frontend and an Express/MongoDB backend. The application solves the problem of disconnected artisan commerce by providing:

- a curated storefront for buyers
- a seller studio for makers to manage listings
- order tracking and secure authentication
- product search, wishlist, and cart flows

## ðŸŽ¯ Why It Was Built

This project was built to demonstrate end-to-end full-stack skills, including:

- role-based authentication
- product CRUD and seller workflows
- order management and checkout readiness
- responsive UI design for portfolio and internship-ready presentation

## ðŸ‘¥ Target Users

- Artisans and sellers who want to list handmade creations.
- Buyers who seek curated craft products.
- Recruiters reviewing modern full-stack development skills.
- Product managers or designers evaluating marketplace UX.

## ðŸŒ Live Demo

- Frontend deployment: `https://handcraft-mu.vercel.app/`
- Backend API: `https://handart-backend.onrender.com`

> Update these URLs after deployment.

## ðŸ–¼ï¸ Screenshots

![Homepage Preview](C:\Users\DELL\OneDrive\Pictures\Screenshots\Screenshot 2026-06-10 095835.png)

## âœ¨ Key Features

- Buyer and seller authentication with JWT
- Product browsing, search, category filters
- Wishlist, cart, and checkout-ready ordering
- Seller product management (create, edit, delete)
- Order history and seller order status updates
- Cloudinary image upload support for product media
- Responsive, mobile-friendly interface
- Razorpay-ready payment integration support

## ðŸ“± Mobile View

The frontend layout is built with responsive styles and supports mobile devices. The navbar, hero section, product cards, cart, and account flows adapt to narrow screens.

## ðŸ§‘â€ðŸ’» User Features

- Browse craft categories and product details
- Search products by title and filter by category
- Add items to cart and wishlist
- Create buyer accounts and login
- View order history and shipping details
- Dark mode toggle and in-browser persistence

## ðŸ¬ Seller Features

- Register as a seller and access seller-only routes
- Upload and manage products with images
- View seller product list and inventory
- Edit or delete own product listings
- Review orders for sold items
- Update order status to shipped or delivered

## ðŸ” Authentication

- Buyer and seller signup/login flows
- JWT authentication for protected API endpoints
- Password hashing with bcryptjs
- Role-based access control via middleware

## ðŸ” Search and Filtering

- Search query support for product titles
- Category filtering in product list endpoints
- Server-side filters for efficient browsing

## ðŸ“± Responsive Design

- Styled using inline responsive layout patterns
- Mobile-friendly hero, product grid, and navigation
- LocalStorage persistence for cart and wishlist

## ðŸ’³ Payment Integration

- Razorpay dependency installed in backend
- Order schema includes `razorpayOrderId` and `razorpayPaymentId`
- Payments route scaffolded for future checkout integration

## ðŸ› ï¸ Tech Stack

| Layer          | Technologies                                                |
| -------------- | ----------------------------------------------------------- |
| Frontend       | Next.js, React 19, TypeScript, Tailwind CSS 4, ESLint       |
| Backend        | Node.js, Express 5, MongoDB, Mongoose, Cloudinary, Razorpay |
| Database       | MongoDB Atlas / self-hosted MongoDB                         |
| Authentication | JWT, bcryptjs                                               |
| Deployment     | Vercel, Render / Railway / Heroku                           |

## ðŸ—ï¸ Project Architecture

### Frontend structure

- `frontend/app/` â€” main page and route components
- `frontend/components/` â€” reusable UI elements such as `Navbar`
- `frontend/context/` â€” global app state and cart/session handling
- `frontend/lib/` â€” API utilities and helper logic
- `frontend/public/` â€” static assets

### Backend structure

- `backend/server.js` â€” Express app entrypoint
- `backend/routes/` â€” API route files for auth, products, orders, payments
- `backend/models/` â€” Mongoose schemas for User, Product, Order
- `backend/middleware/` â€” auth middleware for JWT and role checks
- `backend/config/` â€” database connection logic

### Database flow

- `User` creates accounts as `buyer` or `seller`
- `Seller` creates `Product` listings
- `Buyer` places `Order` items from seller products
- Orders reference both buyer and seller for relationship tracking

## ðŸ“ Folder Structure

```
handcraft/
â”œâ”€ backend/
â”‚  â”œâ”€ config/db.js
â”‚  â”œâ”€ middleware/auth.js
â”‚  â”œâ”€ models/Order.js
â”‚  â”œâ”€ models/Product.js
â”‚  â”œâ”€ models/User.js
â”‚  â”œâ”€ routes/auth.js
â”‚  â”œâ”€ routes/orders.js
â”‚  â”œâ”€ routes/payments.js
â”‚  â”œâ”€ routes/products.js
â”‚  â””â”€ server.js
â””â”€ frontend/
   â”œâ”€ app/
   â”‚  â”œâ”€ artisans/[id]/
   â”‚  â”œâ”€ cart/page.tsx
   â”‚  â”œâ”€ checkout/page.tsx
   â”‚  â”œâ”€ dashboard/page.tsx
   â”‚  â”œâ”€ login/page.tsx
   â”‚  â”œâ”€ my-account/page.tsx
   â”‚  â”œâ”€ orders/
   â”‚  â”œâ”€ products/
   â”‚  â”œâ”€ signup/page.tsx
   â”‚  â””â”€ wishlist/page.tsx
   â”œâ”€ components/Navbar.tsx
   â”œâ”€ context/AppContext.tsx
   â”œâ”€ lib/api.ts
   â””â”€ globals.css
```

## ðŸš€ Installation & Setup

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

## ðŸ”‘ Environment Variables

Create `backend/.env` with:

```env
PORT=5000
MONGO_URI=mongodb+srv://craftadmin:craft1234@cluster0.brpzr0z.mongodb.net/craftstore?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=mysupersecretkey123
CLOUDINARY_CLOUD_NAME=dlokpuewt
CLOUDINARY_API_KEY=534643617822269
CLOUDINARY_API_SECRET=mDOgVi0L8I9gSWwtpdYkqpteNWc
```

## ðŸ§ª API Endpoints

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

## ðŸ§± Database Schema

### Main collections

- `User`
- `Product`
- `Order`

### User schema

- `name`, `email`, `password`, `role`, `avatar`
- Roles: `buyer`, `seller`

### Product schema

- `seller` â†’ User reference
- `title`, `description`, `price`, `category`, `image`, `stock`
- `variants` array for size/color options

### Order schema

- `buyer` â†’ User reference
- `seller` â†’ User reference
- `items` â†’ array of order item details
- `totalAmount`, `status`, `shippingAddress`
- Razorpay integration fields: `razorpayOrderId`, `razorpayPaymentId`

## ðŸ”— Relationships

- One seller to many products
- One buyer to many orders
- One seller to many orders
- Orders contain references to products and users

## ðŸ§  Challenges Faced

- Implementing role-based access control for buyer and seller flows
- Creating robust product CRUD with protected upload routes
- Designing a portfolio-ready responsive landing page
- Managing session state for cart, wishlist, and auth

## ðŸŽ“ Learning Outcomes

- Built a production-style full-stack marketplace
- Used JWT and bcrypt for authentication security
- Connected a React/Next.js frontend with an Express API
- Modeled relationships in MongoDB with Mongoose
- Designed a responsive user interface for desktop and mobile

## âš¡ Performance Optimizations

- Caching: localStorage persistence for cart and wishlist
- Code splitting: Next.js route-based splitting for fast page loads
- Image optimization: Cloudinary upload transformations with responsive delivery
- API optimization: query filters and indexed Mongoose models

## ðŸ›¡ï¸ Security Features

- JWT authentication for protected routes
- Password hashing with bcryptjs
- Role-based middleware for seller-only access
- Input checks for required fields and ownership validation

## ðŸš§ Future Improvements

- Add full checkout payment flow with Razorpay
- Build admin dashboard and analytics panels
- Add product reviews, ratings, and seller profiles
- Add server-side search indexing and caching
- Deploy as a scalable microservices architecture

## â˜ï¸ Deployment

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

## âœ… Testing

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

## ðŸ¤ Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Add tests and update the README if needed
4. Submit a pull request

## ðŸ“„ License

MIT License

## ðŸ‘¨â€ðŸ’» Author

- Name: `sujay kumar singh`
- GitHub: [github.com/Sujaykr99](https://github.com/Sujaykr99)
