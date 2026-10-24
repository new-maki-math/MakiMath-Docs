# Environment Variables Reference

MakiMath services are configured via `.env` files or system environment variables. Under Node.js 22+, native `--env-file` loading is fully supported.

## Backend Environment Variables (`maki-math-backend`)

### 1. Server & Network Configurations

| Variable | Default | Required | Description |
|---|---|:---:|---|
| `HOST` | `127.0.0.1` | No | HTTP bind interface. Production should bind to localhost and route traffic through Nginx. |
| `PORT` | `3000` | No | Internal port listened by Fastify. |
| `TRUST_PROXY` | `loopback` | No | Reverse proxy trust level:<br>• `loopback` (recommended): Trust local Nginx; extracts real client IP from the rightmost `X-Forwarded-For`;<br>• `false`: Disable proxy trust; reads direct socket IP;<br>• CIDR (e.g. `10.0.0.0/8`): For separate reverse proxy instances. |
| `LOG_LEVEL` | `info` | No | Logging verbosity (`fatal`, `error`, `warn`, `info`, `debug`, `trace`). |

### 2. PostgreSQL Database Connection

| Variable | Default | Required | Description |
|---|---|:---:|---|
| `PGHOST` | `localhost` | No | PostgreSQL host address. |
| `PGPORT` | `5432` | No | PostgreSQL port. |
| `PGUSER` | `postgres` | No | Database user account. |
| `PGPASSWORD` | `""` | Yes | Database user password. A strong password is required for production. |
| `PGDATABASE` | `maki_math_dev` | Yes | Target database name (`maki_math` for production). |

### 3. JWT Authentication & Sessions

| Variable | Default | Required | Description |
|---|---|:---:|---|
| `JWT_SECRET` | Internal dev key | **Yes (Prod)** | Secret key used to sign and verify Access Tokens. Generate via `openssl rand -hex 32`. |
| `JWT_EXPIRES_IN` | `2h` | No | Access Token validity duration (`15m`, `2h`, `1d`). |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | No | Refresh Token lifecycle duration (default 7 days). |

### 4. Communication & Storage Paths

| Variable | Default | Required | Description |
|---|---|:---:|---|
| `PAYLOAD_SECRET_KEY` | Internal dev key | **Yes (Prod)** | Secret key for transport payload protection. Throws fatal exception if unset in `NODE_ENV=production`. |
| `TYPST_BIN` | `typst` | No | Path to Typst CLI executable if not on system PATH. |
| `CACHE_DIR` | `<root>/cache` | No | Server temporary compilation cache directory. |
| `UPLOAD_DIR` | `<root>/uploads` | No | Storage root for uploaded attachments. |

## Production `.env` Template

```ini
# ---------- Server Network ----------
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

# ---------- JWT Authentication ----------
JWT_SECRET=c2e841f4862b9a716c52d00fb8a2e1d74c3e8095b281f692019c43e7168d3a51
JWT_EXPIRES_IN=2h
JWT_REFRESH_EXPIRES_IN=7d

# ---------- Communication Security ----------
PAYLOAD_SECRET_KEY=9a3f2b8c1e7d4a0f8b2c6e1d5a9f3b7c
```

## Frontend Environment Variables (`maki-math-frontend`)

The Vite frontend injects variables prefixed with `VITE_`:

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Empty string (same-origin) | API base prefix. With Nginx proxying `/api`, keep empty to ensure clean same-origin traffic. |
