# Postman Testing Guide - Creator Commerce Platform API (MVP)

## Base URL
```
http://localhost:5000/api/auth
```

---

## 1. REGISTER
**Endpoint:** `POST /register`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "firstName": "Anil",
  "lastName": "Tech",
  "username": "aniltech",
  "email": "anil@gmail.com",
  "password": "password123",
  "phoneNumber": "9999999999"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "firstName": "Anil",
    "lastName": "Tech",
    "email": "anil@gmail.com",
    "username": "aniltech",
    "phoneNumber": "9999999999",
    "role": "USER",
    "createdAt": "2026-06-03T..."
  }
}
```

---

## 2. LOGIN
**Endpoint:** `POST /login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "anil@gmail.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "firstName": "Anil",
    "lastName": "Tech",
    "email": "anil@gmail.com",
    "username": "aniltech",
    "phoneNumber": "9999999999",
    "role": "USER",
    "createdAt": "2026-06-03T..."
  }
}
```

---

## 3. GET PROFILE (Protected)
**Endpoint:** `GET /profile`

**Headers:**
```
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "firstName": "Anil",
    "lastName": "Tech",
    "email": "anil@gmail.com",
    "username": "aniltech",
    "phoneNumber": "9999999999",
    "role": "USER",
    "createdAt": "2026-06-03T..."
  }
}
```

---

## Testing Flow

1. **POST /register** → Get token
2. **POST /login** → Get token
3. **GET /profile** with token → Verify JWT works

Done. That's MVP.

---

## Error Responses

| Status | Error | Meaning |
|--------|-------|---------|
| 400 | Email already exists | Duplicate email |
| 404 | User not found | Login with wrong email |
| 400 | Invalid credentials | Wrong password |
| 401 | No token | Missing Authorization header |
| 401 | Invalid token | Bad/expired JWT |

