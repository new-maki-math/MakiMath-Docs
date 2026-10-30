# 部署与升级

先区分三件事：后端服务、产品前端静态文件、文档站。它们的发布命令、配置和产物不同。以下步骤对应当前仓库的部署脚本。

## 后端：选择初始化还是复用数据库

空库可以应用 `Database/schema.sql`。已有库先备份并核对表、列、索引与触发器，再安排对应升级，不要拿初始化脚本当迁移执行。

当前仓库已删除此前应用过的 `Database/manual` 脚本，也没有可直接套用的完整旧库升级包。部署脚本只会查找可用的 `Database/migrations/*.sql`；没有文件时，“无待执行迁移”不代表远端结构已经与代码一致。本地应用过旧脚本，也不能证明线上应用过。旧库缺少封面表、单工作草稿约束或其他新结构时，由部署人员先补齐适合目标库的升级方案。

`forceSchema` 保持 false 或省略。只有明确写成 `DROP_AND_REBUILD` 才会清空 public schema；这是销毁数据，不是保留数据升级。任何初始化流程都不会自动创建默认管理员，之后需在实际后端目录按[本地开发](../guide/development.md)运行 `npm run admin:init`。

## 使用仓库脚本

每个项目在根目录维护自己的 `deploy.config.json`，从对应 example 复制后私下填写，不提交凭据。脚本通过 SSH 执行系统安装、文件替换和服务重启，运行前核对服务器与目录。

| 项目与命令 | 当前行为 |
| --- | --- |
| 后端 `npm run acl-deploy` | `scripts/deploy.ACL.js`；检查 Node.js，使用 npm ci 和 systemd 的 maki-math-backend 服务，核对健康接口数据库名；支持私钥或密码 |
| 后端 `npm run deploy` | 旧 `scripts/deploy.js`；使用 npm install 与 PM2，不能当成 ACL/systemd 流程的别名 |
| 前端 `npm run deploy` | 本机先构建 dist，再传到远端 frontend；可配置 Nginx 和 Certbot，会改动站点配置 |
| 前端 `npm run acl-deploy` | 另一套脚本，系统依赖和服务处理不同，按目标环境单独核对 |

后端 ACL 复用已有数据库、保留远端 `.env` 的配置示意：

```json
{
  "host": "server.example.com",
  "port": 22,
  "username": "deploy",
  "privateKeyPath": "C:/keys/deploy_ed25519",
  "remoteBaseDir": "/srv/maki-math",
  "backendPort": 3000,
  "setupDatabase": false,
  "forceSchema": false,
  "db": { "name": "maki_math_v3" }
}
```

此例要求远端已有可用 `.env` 和数据库。即使 setupDatabase=false，也要把 db.name 设置为目标库名，并与远端 `.env` 的 PGDATABASE 一致；脚本会据此检查数据库和健康响应。示例中的 maki_math_v3 请按实际库名替换。若启用 setupDatabase，则填写 db.name、db.user、db.password；若配置 env 对象，脚本会用它生成远端 `.env`，其中必须有 JWT_SECRET 和严格 32 字节的 PAYLOAD_SECRET_KEY，生产 JWT_SECRET 至少 32 字节。没有 env 时，现有 `.env` 会保留；只有允许初始化的相应分支才会新生成配置。backendPort、`.env` 的 PORT 与代理端口必须一致。

前端脚本使用 host、port、username、password、remoteBaseDir、domain、backendPort、email 和 configureNginx；后端不需要照抄 domain/email。即使 configureNginx=false，当前普通前端脚本仍校验 domain/email。它调用系统包管理器，不是任意服务器都能直接通用执行。

## 配置域名和代理

前端静态文件放在 Nginx 的站点根目录，HTML history 路由回退到 index.html。`/api/` 转发给后端，保留 `/api/` 前缀；示意配置如下，域名、目录、端口须替换。

```nginx
server {
    listen 80;
    server_name math.example.com;
    root /srv/maki-math/frontend;
    client_max_body_size 4m;

    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

这是 HTTP 配置示意，正式站点还要配置 HTTPS。后端与代理同机时 TRUST_PROXY=loopback；分机按实际代理网段设置。反向代理允许更大的请求也不会提高后端加密请求体的 4 MiB 上限。上线后先查后端 `/health` 的实际库名，再核对登录、目录与正文读取，不只检查首页能否打开。

## 文档站

本仓库 VitePress 的 base 为 `/`，用于自定义域名根路径部署。产物在 `Documents/.vitepress/dist`。GitHub Pages 工作流在推送 main 或手动触发时运行，推送其他分支不会自动发布；自定义域名及 DNS 仍需在 Pages 配置中确认。
