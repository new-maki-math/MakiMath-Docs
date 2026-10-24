# 认证与会话 API

本模块提供用户登录、注册准入、Token 轮转、个人资料修改与操作审计日志相关的接口。

## 1. 用户名密码登录
- **请求方法**：`POST`
- **接口路径**：`/api/auth/login`
- **权限要求**：`公开免登`

### 请求体 (Body)
```json
{
  "username": "editor_user",
  "password": "SecurePassword123!"
}
```

### 响应体 (Response)
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "4a7b9e28f1c84d72a9e32...",
  "user": {
    "id": 1,
    "username": "editor_user",
    "displayName": "数学编者",
    "role": "editor"
  }
}
```

## 2. 使用邀请码注册
- **请求方法**：`POST`
- **接口路径**：`/api/auth/register`
- **权限要求**：`公开免登`

### 请求体 (Body)
```json
{
  "username": "new_editor",
  "password": "Password2026!",
  "displayName": "新晋编者",
  "inviteCode": "MAKI-2026-X8Y9"
}
```

### 响应体 (Response)
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "refreshToken": "8f9a2e1d...",
  "user": {
    "id": 2,
    "username": "new_editor",
    "displayName": "新晋编者",
    "role": "editor"
  }
}
```

## 3. 预检查邀请码有效性
- **请求方法**：`GET`
- **接口路径**：`/api/auth/check-invite`
- **权限要求**：`公开免登`

### 请求参数 (Query)
| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `code` | string | 是 | 待核验的邀请码字符串 |

### 响应体 (Response)
```json
{
  "ok": true,
  "valid": true,
  "role": "editor",
  "maxUses": 1,
  "usedCount": 0
}
```

## 4. 获取当前会话用户信息
- **请求方法**：`GET`
- **接口路径**：`/api/auth/me`
- **权限要求**：`登录用户 (requireLogin)`
- **请求头**：`Authorization: Bearer <TOKEN>`

### 响应体 (Response)
```json
{
  "ok": true,
  "user": {
    "id": 1,
    "username": "editor_user",
    "displayName": "数学编者",
    "role": "editor",
    "status": "active",
    "lastLoginAt": "2026-10-24T08:30:00.000Z",
    "createdAt": "2026-09-01T12:00:00.000Z"
  }
}
```

## 5. 刷新访问令牌 (Token Refresh)
- **请求方法**：`POST`
- **接口路径**：`/api/auth/refresh`
- **权限要求**：`公开免登`

### 请求体 (Body)
```json
{
  "refreshToken": "4a7b9e28f1c84d72a9e32..."
}
```

### 响应体 (Response)
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "refreshToken": "7c8e9f...",
  "user": {
    "id": 1,
    "username": "editor_user",
    "displayName": "数学编者",
    "role": "editor"
  }
}
```

## 6. 安全注销登录
- **请求方法**：`POST`
- **接口路径**：`/api/auth/logout`
- **权限要求**：`登录用户 (requireLogin)`
- **请求头**：`Authorization: Bearer <TOKEN>`

### 请求体 (Body)
```json
{
  "refreshToken": "4a7b9e28f1c84d72a9e32..."
}
```

### 响应体 (Response)
```json
{
  "ok": true,
  "message": "已安全登出"
}
```

## 7. 更新个人昵称
- **请求方法**：`PATCH`
- **接口路径**：`/api/auth/profile`
- **权限要求**：`登录用户 (requireLogin)`

### 请求体 (Body)
```json
{
  "displayName": "高数教研组·张老师"
}
```

### 响应体 (Response)
```json
{
  "ok": true,
  "user": {
    "id": 1,
    "username": "editor_user",
    "displayName": "高数教研组·张老师",
    "role": "editor"
  }
}
```

## 8. 修改账号密码
- **请求方法**：`PATCH`
- **接口路径**：`/api/auth/password`
- **权限要求**：`登录用户 (requireLogin)`

### 请求体 (Body)
```json
{
  "oldPassword": "CurrentPassword123",
  "newPassword": "BrandNewPassword2026!"
}
```

### 响应体 (Response)
```json
{
  "ok": true,
  "message": "密码修改成功"
}
```

## 9. 获取个人操作审计日志
- **请求方法**：`GET`
- **接口路径**：`/api/auth/audit-logs`
- **权限要求**：`登录用户 (requireLogin)`

### 请求参数 (Query)
| 参数名 | 类型 | 必填 | 默认值 | 描述 |
|---|---|---|---|---|
| `page` | number | 否 | `1` | 当前页码 |
| `limit` | number | 否 | `20` | 每页数量 (上限 100) |

### 响应体 (Response)
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
