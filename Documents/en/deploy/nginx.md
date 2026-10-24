# Nginx Reverse Proxy Configuration

In production, Nginx serves as the unified reverse proxy gateway for MakiMath, managing SSL termination, high-performance static asset delivery, Gzip compression, and proxy routing for `/api` and `/health` requests to the Fastify backend.

---

## Production Nginx Configuration

Create `/etc/nginx/sites-available/makimath.conf` on your server:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name math.yourdomain.com;

    return 301 https://$host$request_uri;
}

# Core HTTPS Server Configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name math.yourdomain.com;

    # SSL Certificate Paths (Managed via Certbot)
    ssl_certificate /etc/letsencrypt/live/math.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/math.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Upload size allowance for math attachments (default 50MB)
    client_max_body_size 50m;

    # Gzip Compression
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

    # ---------- 1. Backend API Reverse Proxy ----------
    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_http_version 1.1;

        # Forward real client headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # ---------- 2. Health Check Probe ----------
    location /health {
        proxy_pass http://127.0.0.1:3000/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # ---------- 3. Frontend SPA Static Delivery ----------
    location / {
        root /var/www/maki-math/frontend;
        index index.html;

        # Vue Router HTML5 History mode fallback
        try_files $uri $uri/ /index.html;

        # Immutable static caching (1 year)
        location ~* \.(?:css|js|woff2?|svg|png|jpg|jpeg|webp)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

---

## Enable & Validate

```bash
# 1. Enable site configuration
sudo ln -sf /etc/nginx/sites-available/makimath.conf /etc/nginx/sites-enabled/

# 2. Test syntax
sudo nginx -t

# 3. Reload Nginx
sudo systemctl reload nginx
```

---

## Automated SSL Setup with Certbot

To generate and renew free SSL certificates from Let's Encrypt:

```bash
# 1. Install Certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# 2. Acquire certificate and auto-inject into Nginx
sudo certbot --nginx -d math.yourdomain.com --email admin@yourdomain.com --agree-tos --non-interactive

# 3. Dry-run renewal validation
sudo certbot renew --dry-run
```
Certificates are valid for 90 days and renew automatically via systemd timers.
