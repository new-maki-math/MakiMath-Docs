# 认证与会话

依据及加密方式见[接口约定](./overview.md)。字段未标可选的均必填，拒绝未知字段。

Body 表示 JSON 请求体，Query 表示查询参数；未标“可选”的请求字段均必填。成功响应列说明 HTTP 状态和解密后的数据，完整字段见下文。

| 路径 | 方法 | 接口说明 | 权限 | 请求参数 | 成功响应 |
| --- | --- | --- | --- | --- | --- |
| `/api/auth/pubkey` | `GET` | 获取通信公钥 | 无需认证 | 无请求体 | `200`：明文 `{ ok, pubkey }` |
| `/api/auth/register` | `POST` | 注册账号 | 公开，需有效邀请码 | Body：`username`, `password`, `invite_code`；可选 `display_name` | `201`：`{ user }`，不创建会话 |
| `/api/auth/login` | `POST` | 登录并创建会话 | 无需认证 | Body：`username`, `password` | `200`：`{ user, access_token, refresh_token }` |
| `/api/auth/refresh` | `POST` | 刷新访问令牌并轮换刷新令牌 | 有效刷新令牌 | Body：`refresh_token` | `200`：`{ user, access_token, refresh_token }` |
| `/api/auth/me` | `GET` | 获取当前用户 | 已登录用户 | 无请求体 | `200`：`{ user }` |
| `/api/auth/profile` | `PATCH` | 更新个人资料 | 已登录用户 | Body：`display_name` | `200`：`{ user }` |
| `/api/auth/logout` | `POST` | 注销匹配的会话 | 已登录用户 | Body：`refresh_token` | `204`：无响应体 |
| `/api/auth/password` | `PATCH` | 修改密码并撤销全部会话 | 已登录用户 | Body：`old_password`, `new_password` | `204`：无响应体；撤销全部会话 |

注册后必须单独登录。username 最长 80；invite_code 最长 100；display_name 最长 100，可空。注册密码和新密码至少 8 字符、至多 200 字符且 UTF-8 不超过 72 字节。登录密码/旧密码非空、最长 200。refresh_token 非空、最长 200。

注册、登录、刷新和 me 的 user 为 `{ id, username, display_name, role }`，profile 更新的 user 另带 status。角色为 editor 或 super_admin，不允许客户端指定角色、所有者或会话 ID。

默认访问令牌有效期 2h、刷新会话 7d，可配置。刷新轮换 refresh_token，应同时替换两种令牌，串行处理同一会话刷新。旧刷新令牌失效；刷新复用会话 ID，该会话未过期的旧访问令牌仍可能有效。

注销按“当前用户 + 所提交刷新令牌哈希”删除会话。不匹配或已轮换的旧令牌也返回 204，**204 不证明 Bearer 对应会话已撤销**。前端应提交最新 refresh_token，成功后清理两种令牌及用户状态。改密成功删除该用户全部会话，需重新登录。停用账号也删除其会话；JWT 尚未过期不能绕过会话检查。

## 示例（静态核对，未做数据库联调）

POST /auth/login：

```json
{ "username": "editor-demo", "password": "example-pass-2026" }
```

解密后的响应（尖括号内容替换为真实运行时值）：

```json
{
  "user": { "id": 7, "username": "editor-demo", "display_name": "", "role": "editor" },
  "access_token": "<access_token>",
  "refresh_token": "<refresh_token>"
}
```

刷新或注销请求体如下，注销另需 Bearer：

```json
{ "refresh_token": "<最新 refresh_token>" }
```

PATCH /auth/password：

```json
{ "old_password": "example-pass-2026", "new_password": "example-new-pass-2026" }
```

主要错误：字段/无效邀请码 400；重复用户名 409；登录失败、无效刷新会话、旧密码错误 401。注销和改密成功不返回 `{ ok: true }`，不能解析空 JSON。

## 请求参数定义

下表补充接口索引中的请求体字段。同名字段只用于索引列出的接口。

| 参数 | 位置 | 类型 | 必填 | 约束 |
| --- | --- | --- | --- | --- |
| `username` | Body | string | 是 | 非空，最长 80 字符 |
| `password` | Body | string | 是 | 注册至少 8 字符且不超过 72 UTF-8 字节；登录最长 200 字符 |
| `invite_code` | Body | string | 是 | 注册使用，非空，最长 100 字符 |
| `display_name` | Body | string | 注册否；更新资料是 | 可为空，最长 100 字符 |
| `refresh_token` | Body | string | 是 | 刷新和注销使用，非空，最长 200 字符 |
| `old_password` | Body | string | 是 | 修改密码使用，非空，最长 200 字符 |
| `new_password` | Body | string | 是 | 至少 8 字符，最长 200 字符且不超过 72 UTF-8 字节 |
