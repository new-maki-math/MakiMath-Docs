# 账号与会话 API

本页遵循[通信约定](./overview.md)。Body 未标可选的字段均必填，GET 没有请求体。

| 路径 | 方法 | 操作 | 权限 | 请求参数 | 成功响应 |
| --- | --- | --- | --- | --- | --- |
| `/api/auth/pubkey` | GET | 通信公钥 | 公开 | 无 | 200，明文 `{ ok, pubkey }` |
| `/api/auth/register` | POST | 注册 | 有效邀请码 | Body：username、password、invite_code；display_name 可选 | 201，`{ user }` |
| `/api/auth/login` | POST | 登录 | 公开 | Body：username、password | 200，`{ user, access_token, refresh_token }` |
| `/api/auth/refresh` | POST | 轮换令牌 | 有效刷新令牌 | Body：refresh_token | 200，同登录结构 |
| `/api/auth/me` | GET | 当前用户 | 登录 | 无 | 200，`{ user }` |
| `/api/auth/profile` | PATCH | 修改昵称 | 登录 | Body：display_name | 200，`{ user }` |
| `/api/auth/logout` | POST | 撤销匹配会话 | 登录 | Body：refresh_token | 204，无正文 |
| `/api/auth/password` | PATCH | 改密并撤销全部会话 | 登录 | Body：old_password、new_password | 204，无正文 |

注册只创建账号，不创建登录会话；之后单独调用 login。通常 user 为 `{ id, username, display_name, role }`，profile 返回的 user 还带 status。role 为 editor 或 super_admin，不能从注册体指定。

| Body 字段 | 类型 | 约束 |
| --- | --- | --- |
| username | string | 非空，最长 80 |
| password / new_password | string | 注册和改密至少 8 字符，最长 200，UTF-8 最多 72 字节；登录 password 仅要求非空、最长 200 |
| old_password | string | 非空，最长 200 |
| invite_code | string | 非空，最长 100 |
| display_name | string | 可空，最长 100；只在注册时可省略 |
| refresh_token | string | 非空，最长 200 |

## 令牌怎么处理

刷新会轮换 refresh_token，应串行刷新并一起替换两种令牌。默认访问令牌有效期 2h、刷新会话 7d，可配置；刷新复用原会话 ID，未过期的旧访问令牌仍可能有效。

注销按“当前用户 + 所提交刷新令牌哈希”删除会话。提交已轮换或不匹配的令牌也会返回 204，所以 204 不证明 Bearer 所属会话已经撤销。前端应提交最新 refresh_token，随后清理本地令牌及用户状态。改密成功则撤销这个账号的全部会话，需要重新登录。账号被停用也会撤销会话。

## 请求示例

POST `/api/auth/login` 的加密前数据：

```json
{ "username": "editor-demo", "password": "example-pass-2026" }
```

响应结构示例，令牌为占位值：

```json
{
  "user": { "id": 7, "username": "editor-demo", "display_name": "", "role": "editor" },
  "access_token": "<access_token>",
  "refresh_token": "<refresh_token>"
}
```

无效邀请码或参数返回 400，用户名冲突返回 409；登录失败、失效刷新会话或旧密码错误返回 401。不要把所有 401 都当成可以自动刷新后重试的请求，例如旧密码不正确需要用户改输入。
