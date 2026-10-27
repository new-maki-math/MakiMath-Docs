# 环境变量参考

::: warning 本页尚未完成新模型复核
本页保留旧版操作资料，不作为当前接口或产品能力的依据。课程/小节接口已移除，旧动画执行方式不再适用。新契约以[前端接入流程](/api/frontend-integration)为准；部署不得据旧文直接初始化已有数据库。
:::


MakiMath 服务端通过 `.env` 文件或系统环境变量进行配置。在 Node.js 22+ 环境下，系统支持原生 `--env-file` 载入。

## 后端服务环境变量 (`maki-math-backend`)

### 1. 网络与服务基础配置

| 变量名 | 默认值 | 必填 | 描述与建议 |
|---|---|:---:|---|
| `HOST` | `127.0.0.1` | 否 | HTTP 监听地址。生产环境建议绑定本机回环地址，由 Nginx 反向代理接入。 |
| `PORT` | `3000` | 否 | 服务端内部监听端口。 |
| `TRUST_PROXY` | `loopback` | 否 | 反向代理信任级别：<br>• `loopback`（推荐）：仅信任本机 Nginx，准确读取 `X-Forwarded-For` 最右侧的真实客户端 IP；<br>• `false`：关闭代理信任，直接读取 Socket IP；<br>• CIDR（如 `10.0.0.0/8`）：针对独立代理服务器场景。 |
| `LOG_LEVEL` | `info` | 否 | 日志输出级别 (`fatal`, `error`, `warn`, `info`, `debug`, `trace`)。 |

### 2. PostgreSQL 数据库连接

| 变量名 | 默认值 | 必填 | 描述与建议 |
|---|---|:---:|---|
| `PGHOST` | `localhost` | 否 | PostgreSQL 数据库主机地址。 |
| `PGPORT` | `5432` | 否 | 数据库端口。 |
| `PGUSER` | `postgres` | 否 | 数据库连接用户名。 |
| `PGPASSWORD` | `""` | 是 | 数据库连接密码。生产环境务必配置强密码。 |
| `PGDATABASE` | `maki_math_dev` | 是 | 目标业务数据库名称（生产推荐 `maki_math`）。 |

### 3. JWT 鉴权与会话控制

| 变量名 | 默认值 | 必填 | 描述与建议 |
|---|---|:---:|---|
| `JWT_SECRET` | 内部默认测试密钥 | **生产必填** | 用于签名与校验 Access Token 的密钥。生产环境必须使用足够高强度的随机字符串（建议 `openssl rand -hex 32` 生成）。 |
| `JWT_EXPIRES_IN` | `2h` | 否 | 短期 Access Token 的有效时长（格式支持 `15m`, `2h`, `1d`）。 |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | 否 | 长期 Refresh Token 的有效生命周期（默认 7 天）。 |

### 4. 通信安全与文件路径

| 变量名 | 默认值 | 必填 | 描述与建议 |
|---|---|:---:|---|
| `PAYLOAD_SECRET_KEY` | 内部默认测试密钥 | **生产必填** | 用于通信载荷数据保护的密钥。在 `NODE_ENV=production` 下若未配置将抛出启动异常阻止运行。 |
| `TYPST_BIN` | `typst` | 否 | 系统中 Typst CLI 可执行文件路径（若已加入系统 PATH 则保持默认即可）。 |
| `CACHE_DIR` | `<root>/cache` | 否 | 本地服务端编译缓存临时存放目录。 |
| `UPLOAD_DIR` | `<root>/uploads` | 否 | 静态附件与资源上传保存根路径。 |

## 生产环境推荐 `.env` 完整范例

```ini
# ---------- 服务监听 ----------
HOST=127.0.0.1
PORT=3000
TRUST_PROXY=loopback
LOG_LEVEL=info

# ---------- PostgreSQL 16 ----------
PGHOST=127.0.0.1
PGPORT=5432
PGUSER=maki
PGPASSWORD=YourStrongDatabasePassword2026!
PGDATABASE=maki_math

# ---------- JWT 认证凭证 ----------
JWT_SECRET=c2e841f4862b9a716c52d00fb8a2e1d74c3e8095b281f692019c43e7168d3a51
JWT_EXPIRES_IN=2h
JWT_REFRESH_EXPIRES_IN=7d

# ---------- 通信安全配置 ----------
PAYLOAD_SECRET_KEY=9a3f2b8c1e7d4a0f8b2c6e1d5a9f3b7c
```

## 前端环境变量 (`maki-math-frontend`)

前端基于 Vite 构建，支持在 `.env` 或构建命令中注入以 `VITE_` 开头的环境变量：

| 变量名 | 默认值 | 描述 |
|---|---|---|
| `VITE_API_BASE_URL` | 空字符串（同源相对路径） | 后端 API 服务访问前缀。在标准部署模式下，前端通过 Nginx 统一反代 `/api`，保持默认空值即可避免跨域问题。 |
