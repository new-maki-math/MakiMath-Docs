# 本地开发

三个仓库分别是 `maki-math-re`（Vue/Vite 前端）、`maki-math-backend`（Fastify/PostgreSQL）和 `maki-math-docs`（VitePress）。它们独立安装依赖，不共享一份 node_modules。

## 准备数据库和后端

使用 Node.js 22+。创建独立开发数据库，在空库中执行后端 `Database/schema.sql`；脚本使用 pg_trgm，需要数据库账号具备相应权限。不要对已有业务库重新执行初始化脚本。

在后端根目录安装依赖，填写 `.env`，再启动。首次创建管理员后即可启动开发服务。

```powershell
npm install
npm run admin:init
npm run dev
```

`admin:init` 需要 `.env` 已配置、表结构已存在。它先显示实际连接的数据库，再要求确认及输入账号资料和两次隐藏密码；已有有效管理员或用户名重复时拒绝创建，不覆盖密码。schema 没有默认管理员。

| 环境变量 | 用途与默认值 |
| --- | --- |
| PGHOST / PGPORT | 数据库地址，默认 localhost / 5432 |
| PGUSER / PGPASSWORD / PGDATABASE | 默认 postgres / 空密码 / maki_math_dev，按本机数据库设置 |
| HOST / PORT | 后端监听地址，默认 127.0.0.1 / 3000 |
| JWT_SECRET | 会话签名密钥；生产至少 32 字节 |
| PAYLOAD_SECRET_KEY | 通信兼容密钥，严格 32 个 UTF-8 字节；生产必须配置 |
| JWT_EXPIRES_IN / JWT_REFRESH_EXPIRES_IN | 默认 2h / 7d；刷新时长支持正整数加 s/m/h/d，最长 365d |
| LOG_LEVEL / TRUST_PROXY | 默认 info / loopback；代理配置见[部署](../deploy/self-host.md) |

不要复制开发默认密钥到生产。启动脚本会读取 `.env`，进程中已设置的同名变量优先。`GET http://127.0.0.1:3000/health` 会查询实际数据库并返回名称、版本和运行时间；只能证明服务与数据库连通，不能证明业务流程正确。

## 启动前端和文档

前端根目录安装依赖后运行 `npm run dev`。Vite 默认端口 5173，已启用本地 SSL 插件，以终端实际显示的 HTTPS 地址为准。`/api` 默认代理到 `http://127.0.0.1:3000`；若后端地址不同，在启动进程环境设置 `VITE_API_TARGET`。`VITE_API_BASE` 是构建进客户端的请求前缀，不等于代理目标。

文档仓库使用 `pnpm install`、`pnpm docs:dev`；构建命令是 `pnpm docs:build`。文档站与产品前端各自部署，不能用其中一个的构建结果替代另一个。

## 改动从哪里看

前端路由在 `src/router`，编辑和阅读页面在 `src/views`，源码解析与 MM 组件在 `src/components/Renderer`。API 调用集中在 `src/api`，本地讲义和掌握记录在 `src/utils`。后端 `routes` 验证请求，`services` 处理授权和事务，`Database/schema.sql` 维护数据约束；后端不解析 Typst。

接口接入先读[公共约定](../api/overview.md)，再读[讲义读取与编辑](../api/lectures.md)。提交前按改动范围自行验证；构建通过不能替代权限、并发和数据一致性验证。文档仓库使用 Conventional Commits，分支提交交审核，不直接推送 main。
