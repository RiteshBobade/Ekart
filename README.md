# 🛒 Ekart: Premium E-Commerce Experience

Ekart is a fully modern, responsive full-stack e-commerce web application featuring a highly polished **glassmorphism** design aesthetic and beautiful micro-interactions powered by `framer-motion`.

Designed with a premium dark-themed architecture, Ekart provides an incredibly smooth shopping experience for users and a robust built-in dashboard for Administrators to manage inventory and sales.

## ✨ Key Features
- **Modern UI/UX**: Premium styling utilizing deep contrast, glowing accents, and frosted glass components.
- **Dynamic Animations**: Fluid page transitions and micro-interactions on hovers, scrolls, and clicks using Framer Motion.
- **Authentication**: Secure JWT-based registration, login, email verification, and password resets.
- **Shopping Cart & Checkout**: Real-time cart state management using Redux and a streamlined, compact checkout flow integrated with Cashfree payments.
- **Admin Dashboard**: A comprehensive administrative panel to track sales (via Recharts), manage user roles, and full CRUD control over the product inventory.
- **Responsive Navigation**: Adaptive mobile-first design including floating navbars and slide-out sidebars.

## 🛠️ Technology Stack
### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (v4.x)
- **Framer Motion** (Animations)
- **Redux Toolkit & React-Redux** (State Management)
- **Shadcn UI & Radix UI** (Accessible Base Components)
- **Lucide React** (Iconography)
- **Recharts** (Data Visualization)
- **Vercel** (Deployment Hosting)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database & Schemas)
- **JWT & Bcrypt** (Security & Auth)
- **Cloudinary** (Image Hosting for Products & Avatars)
- **Nodemailer** (Email Verification & OTP Delivery)
- **Cashfree PG** (Payment Gateway)

## 🚀 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Ekart.git
cd Ekart
```

### 2. Setup the Backend
Open a terminal in the `/backend` folder.
```bash
cd backend
npm install
```
Create a `.env` file in the `/backend` directory and add your secrets:
```env
PORT=8000
MONGO_URI=your_mongodb_cluster_url
SECRET_KEY=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173

# Email Configurations (for OTP & Verification)
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Cashfree Payments
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal in the `/frontend` folder.
```bash
cd frontend
npm install
```
Create a `.env` file in the `/frontend` directory:
```env
VITE_URL=http://localhost:8000
VITE_PAYMENT_URL=https://sandbox.cashfree.com/pg/orders
```
Start the frontend development server:
```bash
npm run dev
```
Visit `http://localhost:5173` in your browser!

## 🔐 Admin Access
To access the Admin Dashboard, register a new user or manipulate an existing user document in MongoDB to change the `role` from `"user"` to `"admin"`.
When logged in as an Admin, the "Dashboard" link will securely appear in your user dropdown menu.

---
Built with ❤️ using the MERN Stack.
