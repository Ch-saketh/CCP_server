# CCP Server Authentication System

A secure backend authentication system built using **Node.js**, **Express.js**, **Prisma ORM**, and **PostgreSQL**.  
This project supports both **Email/Password Authentication** and **Google OAuth Authentication** using JWT tokens.

---

# Features

- User Registration
- User Login
- Google OAuth Authentication
- JWT-Based Authentication
- Protected Routes
- Role-Based Authorization
- Password Hashing using bcrypt
- Prisma ORM Integration
- PostgreSQL Database Support
- REST API Architecture
- Postman API Testing

---

# Tech Stack

## Backend
- Node.js
- Express.js

## Database
- PostgreSQL
- Prisma ORM
- Neon Database

## Authentication
- JWT (JSON Web Token)
- Google OAuth
- bcrypt

## Tools
- Postman
- Git & GitHub

---

# Project Folder Structure

```bash
CCP_server/
│
├── server/
│   │
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   │
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   └── auth.controller.js
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   │
│   │   ├── routes/
│   │   │   └── auth.routes.js
│   │   │
│   │   └── utils/
│   │       ├── hash.js
│   │       ├── jwt.js
│   │       └── google.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

---

# Environment Variables

Create a `.env` file inside the `server/` folder.

```env
DATABASE_URL="your_database_url"

JWT_SECRET="your_jwt_secret"

REFRESH_SECRET="your_refresh_secret"

NODE_ENV="development"

GOOGLE_CLIENT_ID="your_google_client_id"
```

---

# Installation & Setup

## 1. Clone Repository

```bash
git clone <repository_url>
```

---

## 2. Move to Project Folder

```bash
cd CCP_server/server
```

---

## 3. Install Dependencies

```bash
npm install
```

---

# Prisma Setup

## Generate Prisma Client

```bash
npx prisma generate
```

---

## Sync Database Schema

```bash
npx prisma db push
```

---

# Run the Project

```bash
npm run dev
```

Server will run on:

```txt
http://localhost:5000
```

---

# API Endpoints

## 1. Register User

### Endpoint

```http
POST /api/auth/register
```

### Request Body

```json
{
  "firstName": "Suneetha",
  "lastName": "Vemagiri",
  "username": "suneetha123",
  "email": "suneetha@gmail.com",
  "password": "123456",
  "phoneNumber": "9876543210"
}
```

---

## 2. Login User

### Endpoint

```http
POST /api/auth/login
```

### Request Body

```json
{
  "email": "suneetha@gmail.com",
  "password": "123456"
}
```

---

## 3. Protected Profile Route

### Endpoint

```http
GET /api/auth/profile
```

### Authorization

```txt
Bearer Token
```

---

## 4. Google Authentication

### Endpoint

```http
POST /api/auth/google
```

### Request Body

```json
{
  "token": "google_id_token"
}
```

---

# Authentication Flow

## Email Authentication Flow

```txt
Register/Login
        ↓
Password Verification
        ↓
JWT Token Generation
        ↓
Protected Route Access
```

---

## Google Authentication Flow

```txt
Google Login
        ↓
Google Token Verification
        ↓
JWT Token Generation
        ↓
Protected Route Access
```

---

# Security Features

- Password Hashing using bcrypt
- JWT Token Verification
- Protected Route Middleware
- Secure Google OAuth Validation
- Environment Variable Protection
- Role-Based Access Control

---

# Testing

All APIs were tested successfully using **Postman**.

---

# Git Workflow Followed

```txt
Create Branch
      ↓
Implement Feature
      ↓
Commit Changes
      ↓
Push Branch
      ↓
Create Pull Request
```

---

# Contributors

- Suneetha Vemagiri
- Team Members

---

# Future Improvements

- Frontend Integration
- Refresh Token Rotation
- Forgot Password Feature
- Email Verification
- Admin Dashboard
- Deployment

---

# Project Status

✅ Authentication system successfully implemented and tested.
