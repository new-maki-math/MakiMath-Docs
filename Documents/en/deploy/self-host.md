# Self-Hosting Guide

MakiMath supports full-featured private deployment on independent Linux instances, virtual machines, or bare-metal servers. This guide covers both automated script installation and manual step-by-step production configuration.

---

## System Requirements

- **Operating System**: Ubuntu 22.04 / 24.04 LTS or Debian 12 recommended
- **Runtime**: Node.js >= 22.0.0 (Native ESM & `--env-file` support required)
- **Package Manager**: pnpm >= 9.0 or npm >= 10.0
- **Database**: PostgreSQL >= 16 with `postgresql-contrib` (for `pg_trgm` fuzzy indexing)
- **Web Gateway & Process Manager**: Nginx, PM2

---

## Method A: Automated Deployment Script (Recommended)

MakiMath includes automated SSH deployment scripts that install packages, initialize PostgreSQL, deploy files, and configure PM2 and Nginx.

### 1. Prepare Configuration
Create `deploy.config.json` in both `maki-math-backend` and `maki-math-frontend` roots:

```json
{
  "host": "YOUR_SERVER_IP",
  "port": 22,
  "username": "root",
  "password": "YOUR_SERVER_SSH_PASSWORD",
  "remoteBaseDir": "/var/www/maki-math",
  "backendPort": 3000,
  "domain": "math.yourdomain.com",
  "email": "admin@yourdomain.com",
  "setupDatabase": true,
  "db": {
    "name": "maki_math",
    "user": "maki",
    "password": "StrongDbPassword2026!"
  }
}
```

### 2. Execute Deployment
```bash
# 1. Deploy backend & initialize database
cd maki-math-backend
node scripts/deploy.js

# 2. Build and deploy frontend SPA & Nginx
cd ../maki-math-frontend
node scripts/deploy.js
```

---

## Method B: Manual Step-by-Step Installation

If you deploy behind restrictive firewall rules or use a managed cloud database (e.g. AWS RDS), follow these manual steps:

### 1. Install & Initialize PostgreSQL 16
```bash
# Install packages
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Provision user & database
sudo -u postgres psql <<EOF
CREATE ROLE maki WITH LOGIN PASSWORD 'StrongDbPassword2026!';
CREATE DATABASE maki_math OWNER maki;
EOF

# Enable extensions and import schema
sudo -u postgres psql -d maki_math -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"
PGPASSWORD='StrongDbPassword2026!' psql -h 127.0.0.1 -U maki -d maki_math -f maki-math-backend/Database/schema.sql
```

> [!IMPORTANT] Initial Default Administrator Account
> Database initialization sets up a default root user:
> - Username: `makimath_root`
> - Initial Password: `makimath_root`
> 
> **You must log in and change this password immediately after first launch!**

### 2. Setup & Start Backend
```bash
cd /var/www/maki-math/backend
npm install --omit=dev

# Write production environment (.env)
cat > .env <<EOF
HOST=127.0.0.1
PORT=3000
PGHOST=127.0.0.1
PGPORT=5432
PGUSER=maki
PGPASSWORD=StrongDbPassword2026!
PGDATABASE=maki_math
JWT_SECRET=$(openssl rand -hex 32)
PAYLOAD_SECRET_KEY=$(openssl rand -hex 16)
TRUST_PROXY=loopback
LOG_LEVEL=info
EOF
chmod 600 .env

# Manage daemon with PM2
npm install -g pm2
pm2 start npm --name "maki-math-backend" -- start
pm2 save
pm2 startup
```

### 3. Build & Deploy Frontend
```bash
cd /path/to/maki-math-frontend
pnpm install
pnpm build

# Copy build artifacts to web root
sudo mkdir -p /var/www/maki-math/frontend
sudo cp -r dist/* /var/www/maki-math/frontend/
```

### 4. Configure Nginx
Refer to the [Nginx Reverse Proxy Guide](./nginx.md) for SSL and proxy configuration.

---

## Maintenance & Telemetry

### 1. Health Probe
```bash
curl -fsS http://127.0.0.1:3000/health
```
Returns database connectivity status, connection pool latency, and uptime in seconds.

### 2. View Backend Logs
```bash
pm2 logs maki-math-backend --lines 100
```
