# 🎓 Lincoln University LMS Portal

A premium, high-performance Learning Management and School Management System built with the modern MERN stack. This platform provides a seamless experience for Students, Teachers, Parents, and Administrators to manage academic lifecycles with a professional, institutional-grade interface.

---

## ✨ Key Features

### 🔐 Advanced Authentication & Onboarding

- **Multi-Step Onboarding**: A professional 3-step registration wizard that collects account credentials, personal details, and institutional roles.
- **Strict Verification**: Integrated email verification flow using 6-digit OTP codes.
- **Verification Guard**: Unverified users are restricted to a dedicated verification page with dynamic Navbar adaptations.
- **Secure Password Handling**: Industry-standard hashing using `bcryptjs` and session management via secure, HTTP-only JWT cookies.

### 🎨 Premium UI/UX

- **Institutional Branding**: A sleek, high-end design using the official institutional red palette.
- **Theme Support**: Full support for Light, Dark, and System theme synchronization via a persistent store.
- **Responsive Layout**: Mobile-first architecture with a slide-in navigation system for smaller screens.
- **Micro-Animations**: Smooth transitions and interactive elements powered by `framer-motion`.

### 👥 Role-Based Architecture

- Tailored experiences for four core user roles:
  - **Student**: Course materials, grades, and campus life.
  - **Teacher**: Course management, student tracking, and assessments.
  - **Parent**: Student progress monitoring and institutional communication.
  - **Admin**: Full system control and user management.

---

## 🚀 Tech Stack

### Frontend

- **Framework**: `React.js` with `Vite`
- **Styling**: `Tailwind CSS`
- **Icons**: `Lucide React`
- **Components**: `shadcn/ui`
- **Animations**: `framer-motion`
- **State Management**: `Zustand`
- **Data Fetching**: `Axios`

### Backend

- **Engine**: `Node.js` & `Express.js`
- **Database**: `MongoDB` with `Mongoose`
- **Security**: `JWT` (JSON Web Tokens), `bcryptjs`, `cookie-parser`
- **Communication**: Integrated email service for verification codes.

---

## 🛠️ Project Structure

```text
Lincoln-fyp/
├── backend/               # Express server and database models
│   ├── config/            # DB connection setup
│   ├── controllers/       # Business logic for routes
│   ├── middlewares/       # Authentication guards
│   ├── models/            # Mongoose schemas (User, etc.)
│   ├── router/            # Express endpoint definitions
│   └── utils/             # Token generation and mail services
├── frontend/              # Vite + React application
│   ├── src/
│   │   ├── axios/         # API configuration
│   │   ├── components/    # Reusable shadcn & custom components
│   │   ├── pages/         # Page components (Signup, Login, Verify)
│   │   ├── store/         # Zustand global state (Auth, Theme)
│   │   └── lib/           # Utility functions (utils.js)
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js installed
- MongoDB database (Local or Atlas)

### 1. Backend Setup

1. Navigate to `/backend`
2. Run `npm install`
3. Create a `.env` file with the following variables:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```
4. Start the server: `npm run dev`

### 2. Frontend Setup

1. Navigate to `/frontend`
2. Run `npm install`
3. Start the development server: `npm run dev`
4. Access the portal at `http://localhost:5173`

---

## 📝 License

This project is for academic purposes and is part of the Lincoln University Final Year Project (FYP).
