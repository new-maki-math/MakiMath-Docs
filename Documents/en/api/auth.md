# Authentication & Session API

This module documents endpoints for authentication, invitation redemption, session token rotation, user profile updates, and personal audit trails.

---

## 1. User Login
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Permission**: `Public (No Auth)`

### Request Body
```json
{
  "username": "editor_user",
  "password": "SecurePassword123!"
}
```

### Response
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "4a7b9e28f1c84d72a9e32...",
  "user": {
    "id": 1,
    "username": "editor_user",
    "displayName": "Math Editor",
    "role": "editor"
  }
}
```

---

## 2. Register via Invitation Code
- **Method**: `POST`
- **Path**: `/api/auth/register`
- **Permission**: `Public (No Auth)`

### Request Body
```json
{
  "username": "new_editor",
  "password": "Password2026!",
  "displayName": "Junior Editor",
  "inviteCode": "MAKI-2026-X8Y9"
}
```

### Response
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "refreshToken": "8f9a2e1d...",
  "user": {
    "id": 2,
    "username": "new_editor",
    "displayName": "Junior Editor",
    "role": "editor"
  }
}
```

---

## 3. Pre-Validate Invitation Code
- **Method**: `GET`
- **Path**: `/api/auth/check-invite`
- **Permission**: `Public (No Auth)`

### Query Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| `code` | string | Yes | The invitation code string to verify |

### Response
```json
{
  "ok": true,
  "valid": true,
  "role": "editor",
  "maxUses": 1,
  "usedCount": 0
}
```

---

## 4. Get Current User Profile
- **Method**: `GET`
- **Path**: `/api/auth/me`
- **Permission**: `Authenticated User (requireLogin)`
- **Header**: `Authorization: Bearer <TOKEN>`

### Response
```json
{
  "ok": true,
  "user": {
    "id": 1,
    "username": "editor_user",
    "displayName": "Math Editor",
    "role": "editor",
    "status": "active",
    "lastLoginAt": "2026-10-24T08:30:00.000Z",
    "createdAt": "2026-09-01T12:00:00.000Z"
  }
}
```

---

## 5. Refresh Access Token
- **Method**: `POST`
- **Path**: `/api/auth/refresh`
- **Permission**: `Public (No Auth)`

### Request Body
```json
{
  "refreshToken": "4a7b9e28f1c84d72a9e32..."
}
```

### Response
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "refreshToken": "7c8e9f...",
  "user": {
    "id": 1,
    "username": "editor_user",
    "displayName": "Math Editor",
    "role": "editor"
  }
}
```

---

## 6. Logout
- **Method**: `POST`
- **Path**: `/api/auth/logout`
- **Permission**: `Authenticated User (requireLogin)`
- **Header**: `Authorization: Bearer <TOKEN>`

### Request Body
```json
{
  "refreshToken": "4a7b9e28f1c84d72a9e32..."
}
```

### Response
```json
{
  "ok": true,
  "message": "Logged out successfully"
}
```

---

## 7. Update Display Name
- **Method**: `PATCH`
- **Path**: `/api/auth/profile`
- **Permission**: `Authenticated User (requireLogin)`

### Request Body
```json
{
  "displayName": "Prof. Zhang"
}
```

### Response
```json
{
  "ok": true,
  "user": {
    "id": 1,
    "username": "editor_user",
    "displayName": "Prof. Zhang",
    "role": "editor"
  }
}
```

---

## 8. Change Password
- **Method**: `PATCH`
- **Path**: `/api/auth/password`
- **Permission**: `Authenticated User (requireLogin)`

### Request Body
```json
{
  "oldPassword": "CurrentPassword123",
  "newPassword": "BrandNewPassword2026!"
}
```

### Response
```json
{
  "ok": true,
  "message": "Password updated successfully"
}
```

---

## 9. Get Personal Audit Logs
- **Method**: `GET`
- **Path**: `/api/auth/audit-logs`
- **Permission**: `Authenticated User (requireLogin)`

### Query Parameters
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | number | No | `1` | Page number |
| `limit` | number | No | `20` | Items per page (max 100) |

### Response
```json
{
  "ok": true,
  "page": 1,
  "limit": 20,
  "total": 45,
  "list": [
    {
      "id": 102,
      "method": "PUT",
      "path": "/api/sections/15/source",
      "statusCode": 200,
      "durationMs": 42,
      "createdAt": "2026-10-24T10:15:20.000Z"
    }
  ]
}
```
