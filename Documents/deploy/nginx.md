# Nginx 反向代理配置

在生产环境中，推荐使用 Nginx 作为 MakiMath 全栈平台的统一接入网关，负责 SSL 证书终结、静态资产高效分发、Gzip 压缩，以及将 `/api` 与 `/health` 请求反向代理至 Fastify 后端服务。

## 推荐生产 Nginx 配置文件

在服务器创建 `/etc/nginx/sites-available/makimath.conf`：

```nginx
# HTTP 流量强制跳转至 HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name math.yourdomain.com;

    return 301 https://$host$request_uri;
}

# 核心 HTTPS 服务配置
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name math.yourdomain.com;

    # SSL 证书配置 (可由 Certbot 自动托管生成)
    ssl_certificate /etc/letsencrypt/live/math.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/math.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 允许上传较大数学附件与课件 (默认 50MB)
    client_max_body_size 50m;

    # Gzip 静态资源压缩 (显著提速矢量字体与公式加载)
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types
        text/plain
        text/css
        text/xml
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml
        font/woff2;

    # ---------- 1. 后端 API 接口反向代理 ----------
    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_http_version 1.1;

        # 传递真实客户端网络信息
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 针对长连接与会话保持
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # ---------- 2. 服务探活检查 ----------
    location /health {
        proxy_pass http://127.0.0.1:3000/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # ---------- 3. 前端单页应用 (SPA) 静态资源托管 ----------
    location / {
        root /var/www/maki-math/frontend;
        index index.html;

        # 支持 Vue Router HTML5 History 模式回退
        try_files $uri $uri/ /index.html;

        # 静态资源强缓存 (1年)
        location ~* \.(?:css|js|woff2?|svg|png|jpg|jpeg|webp)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

## 启用与测试配置

```bash
# 1. 软链启用站点配置
sudo ln -sf /etc/nginx/sites-available/makimath.conf /etc/nginx/sites-enabled/

# 2. 检查 Nginx 语法正确性
sudo nginx -t

# 3. 重新加载 Nginx 服务
sudo systemctl reload nginx
```

## 使用 Certbot 自动化配置免费 SSL 证书

若尚未申请 SSL 证书，推荐使用 Let's Encrypt 官方 Certbot 客户端自动签发与续期：

```bash
# 1. 安装 Certbot 与 Nginx 插件
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# 2. 一键申请证书并自动注入 Nginx 配置
sudo certbot --nginx -d math.yourdomain.com --email admin@yourdomain.com --agree-tos --non-interactive

# 3. 验证自动续期任务
sudo certbot renew --dry-run
```
证书有效期为 90 天，Certbot 后台定时任务会自动在到期前 30 天完成静默续订。
