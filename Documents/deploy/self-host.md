# 私有化部署指南

MakiMath 支持在独立 Linux 云服务器或物理服务器上进行全功能私有化部署。本文提供从单机独立安装到生产环境自动化上线的全套指南。

---

## 基础环境要求

- **操作系统**：推荐 Ubuntu 22.04 LTS / 24.04 LTS 或 Debian 12
- **运行时环境**：Node.js >= 22.0.0 (支持原生 ESM 与 `--env-file`)
- **包管理器**：pnpm >= 9.0 或 npm >= 10.0
- **数据库**：PostgreSQL >= 16（必须包含 `postgresql-contrib` 扩展包，以支持 `pg_trgm` 全文模糊索引）
- **Web 网关与守护**：Nginx、PM2

---

## 部署方案 A：自动化脚本一键部署 (推荐)

项目内置了基于 SSH 的自动化部署脚本，可自动处理系统依赖安装、PostgreSQL 初始化、源码传输、PM2 进程托管与 Nginx 证书配置。

### 1. 准备部署配置文件
在 `maki-math-backend` 与 `maki-math-frontend` 根目录下，基于模板创建 `deploy.config.json`：

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

### 2. 执行一键部署
```bash
# 1. 部署后端服务与数据库
cd maki-math-backend
node scripts/deploy.js

# 2. 构建并部署前端 SPA 与 Nginx
cd ../maki-math-frontend
node scripts/deploy.js
```

---

## 部署方案 B：手动分步安装

若生产环境有严格的安全合规策略或使用托管云数据库（如 RDS），请按以下步骤手动装配：

### 1. 安装与初始化 PostgreSQL 16
```bash
# 安装 PostgreSQL 及扩展
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# 创建数据库用户与数据库
sudo -u postgres psql <<EOF
CREATE ROLE maki WITH LOGIN PASSWORD 'StrongDbPassword2026!';
CREATE DATABASE maki_math OWNER maki;
EOF

# 导入模式结构并启用 pg_trgm
sudo -u postgres psql -d maki_math -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"
PGPASSWORD='StrongDbPassword2026!' psql -h 127.0.0.1 -U maki -d maki_math -f maki-math-backend/Database/schema.sql
```

> [!IMPORTANT] 默认初始管理员账号
> 数据库初始化完成后，系统默认预置超级管理员账号：
> - 用户名：`makimath_root`
> - 初始密码：`makimath_root`
> 
> **首次部署成功后，请务必立即登录并在控制台修改密码！**

### 2. 配置与启动后端服务
```bash
cd /var/www/maki-math/backend
npm install --omit=dev

# 配置生产环境变量 (.env)
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

# 使用 PM2 托管后端常驻进程
npm install -g pm2
pm2 start npm --name "maki-math-backend" -- start
pm2 save
pm2 startup
```

### 3. 构建并发布前端应用
```bash
cd /path/to/maki-math-frontend
pnpm install
pnpm build

# 将打包产物拷贝至 Web 目录
sudo mkdir -p /var/www/maki-math/frontend
sudo cp -r dist/* /var/www/maki-math/frontend/
```

### 4. 配置 Nginx 网关
参考 [Nginx 反向代理配置](./nginx.md) 配置域名与证书代理。

---

## 运维与健康检查

### 1. 接口健康探测
```bash
curl -fsS http://127.0.0.1:3000/health
```
正常响应将返回数据库连接状态、连接池延迟及当前服务运行秒数（`uptime`）。

### 2. 查看后端服务日志
```bash
pm2 logs maki-math-backend --lines 100
```
