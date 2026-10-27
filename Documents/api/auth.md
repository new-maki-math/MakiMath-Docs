# 认证与会话

依据及加密方式见[接口约定](./overview.md)。字段未标可选的均必填，拒绝未知字段。

| 路径 | 方法 | 权限 | 请求体 | 成功响应 |
| --- | --- | --- | --- | --- |
| `/auth/pubkey` | GET | 公开 | 无 | 200，明文 `{ ok, pubkey }` |
| `/auth/register` | POST | 公开，需有效邀请码 | username, password, invite_code；可选 display_name | 201，`{ user }`，不创建会话 |
| `/auth/login` | POST | 公开 | username, password | 200，`{ user, access_token, refresh_token }` |
| `/auth/refresh` | POST | 有效刷新令牌 | refresh_token | 200，`{ user, access_token, refresh_token }` |
| `/auth/me` | GET | 登录 | 无 | 200，`{ user }` |
| `/auth/profile` | PATCH | 登录 | display_name | 200，`{ user }` |
| `/auth/logout` | POST | 登录 | refresh_token | 204，无正文 |
| `/auth/password` | PATCH | 登录 | old_password, new_password | 204，撤销全部会话，无正文 |

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
