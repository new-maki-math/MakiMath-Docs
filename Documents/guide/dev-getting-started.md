# 开发者全栈快速上手

本指南面向**参与 MakiMath 平台开源研发、二次开发与架构调试的开发者**。我们将带你从零开始在本地构建完整的前后端开发环境。
## 开发环境准备

在开始前，请确认你的开发机具备以下运行环境：

| 工具 | 建议版本 | 说明 |
|---|---|---|
| **Node.js** | `>= 22.0.0` | 后端采用原生 Node.js ESM 规范与内置测试运行器 |
| **pnpm** | `>= 9.0.0` | 统一包管理器，基于工作区与符号链接提升效能 |
| **PostgreSQL** | `>= 14.0` | 关系型数据库，需开启 `pg_trgm` 扩展支持中文模糊搜索 |
| **Git** | `>= 2.30` | 代码版本控制，提交需严格遵循约定式提交规范 |

> [!TIP]
> 检查本地开发环境版本：
> ```bash
> node -v  # 应输出 v22.x.x 或更高
> pnpm -v  # 应输出 9.x.x 或更高
> psql --version  # 应输出 PostgreSQL 14+
> ```
## 1. 仓库拉取与目录规划

建议在一个统一的工作空间文件夹下管理 MakiMath 各核心子工程：

```bash
mkdir MakiMath && cd MakiMath

# 1. 后端工程
git clone https://github.com/new-maki-math/MakiMath-Backend.git

# 2. 前端工程
git clone https://github.com/new-maki-math/MakiMath-Frontend.git

# 3. 加密安全核心
git clone https://github.com/new-maki-math/SecureCorePackage.git

# 4. 文档工程
git clone https://github.com/new-maki-math/MakiMath-Docs.git
```
## 2. 后端服务本地运行 (`MakiMath-Backend`)

### 2.1 安装依赖

```bash
cd MakiMath-Backend
pnpm install
```

### 2.2 初始化 PostgreSQL 数据库

1. 创建开发用数据库（假设数据库名为 `maki_math_dev`）：
   ```bash
   createdb -U postgres maki_math_dev
   ```
2. 执行全量结构与初始数据迁移：
   ```bash
   psql -U postgres -d maki_math_dev -f Database/schema.sql
   ```

> [!IMPORTANT] 默认超级管理员账号
> `Database/schema.sql` 脚本中已预置了初始超级管理员：
> - **用户名**：`makimath_root`
> - **初始密码**：`b!TnB7c3CGgcPxDFcaN8_&3Q`

### 2.3 配置环境变量

在 `MakiMath-Backend` 根目录下创建 `.env` 文件：

```ini
PORT=3000
HOST=127.0.0.1
LOG_LEVEL=info

# PostgreSQL 数据库连接
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_local_password
PGDATABASE=maki_math_dev

# JWT 鉴权配置
JWT_SECRET=maki-math-secret-dev-key-2026
JWT_EXPIRES_IN=2h
JWT_REFRESH_EXPIRES_IN=7d

# 载荷通信安全密钥 (开发调试保持默认即可)
PAYLOAD_SECRET_KEY=makimath-2026-secret-aes-key-32b
```

### 2.4 启动后端调试服务器

```bash
pnpm dev
```

终端输出类似如下信息即表示数据库与 HTTP 服务探活正常：
```text
[info] 数据库已连接：maki_math_dev（PostgreSQL 16.x）
[info] Server listening at http://127.0.0.1:3000
```

访问健康检查端点验证：`http://127.0.0.1:3000/health`。
## 3. 前端应用本地运行 (`MakiMath-Frontend`)

### 3.1 安装依赖

进入前端项目目录：

```bash
cd ../MakiMath-Frontend
pnpm install
```

### 3.2 启动前端开发服务器

```bash
pnpm dev
```

前端服务默认启动在：`http://localhost:5173`。

Vite 本地开发服务器已内置代理配置（`vite.config.js`），会自动将所有以 `/api` 开头的请求无缝反代至本地后端的 `http://127.0.0.1:3000`。
## 4. 全栈联动验证与调试技巧

打开浏览器访问 `http://localhost:5173` 进行验证：

1. **读者链路验证**：
   - 访问 `/start` 首页，测试公开讲义列表获取。
   - 访问 `/course/1`，观察 D3 渲染的知识图谱是否正常。
   - 点击任一小节进入 `/course/1/doc/1`，观察 Typlet WASM 引擎是否正常渲染 Typst 数学公式。
2. **编者与管理链路验证**：
   - 访问 `/platform` 登录超级管理员账号。
   - 生成一张测试邀请码（用于后续注册编者账号测试）。
   - 访问 `/workbench` 工作台，测试小节内容增删改查。
3. **安全加密调试注意**：
   - 在浏览器 Network 开发者工具中，所有 POST/PUT 请求体呈现加密形态。
   - 后端插件 `plugins/crypto.js` 会在接收请求时自动解密，若密钥配置不一致会导致请求解密失败（400 / 500）。
## 5. 代码提交规范

在向官方仓库提交 Pull Request 时，必须遵循 Conventional Commits 约定式提交规范：

- 详细规则请阅读：[Git Commit 提交规范](../contributing/git-rules.md)。
- 常见提交类型速查：`feat`、`fix`、`refactor`、`perf`、`docs`、`chore`。

