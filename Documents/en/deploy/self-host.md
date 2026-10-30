# Deployment and upgrades

The backend service, product frontend and docs site publish separately. Their commands, configuration and outputs differ. The instructions below follow the current repository scripts.

## Choose initialization or database reuse

Apply Database/schema.sql only to an empty database. Back up an existing database and compare tables, columns, indexes and triggers before planning its upgrade.

Previously applied Database/manual scripts have been removed from the current repository. There is no complete ready-to-run package for arbitrary legacy schemas. Deployment checks available Database/migrations/*.sql; no files means no queued migration, not proof that remote schema matches code. A local upgrade is not evidence of remote application. Missing cover tables or working-draft constraints need a target-specific upgrade plan.

Keep forceSchema omitted or false. The literal DROP_AND_REBUILD destroys the public schema; it is not a data-preserving upgrade. Initialization creates no default admin. Create the first one with npm run admin:init in the actual backend directory afterward.

## Repository scripts

Each project has its own private deploy.config.json, based on its example. These SSH scripts install dependencies, replace files and restart services; check server/directory before running.

| Command | Current behavior |
| --- | --- |
| Backend npm run acl-deploy | deploy.ACL.js; Node checks, npm ci, systemd maki-math-backend, health database-name check; SSH key or password |
| Backend npm run deploy | Legacy deploy.js using npm install and PM2, not an alias for the ACL/systemd flow |
| Frontend npm run deploy | Builds dist locally, uploads frontend files, optionally changes Nginx and Certbot configuration |
| Frontend npm run acl-deploy | A separate script with different system/service handling; check target compatibility |

Example for backend ACL reuse of an existing database and remote .env:

```json
{
  "host": "server.example.com", "port": 22, "username": "deploy",
  "privateKeyPath": "C:/keys/deploy_ed25519",
  "remoteBaseDir": "/srv/maki-math", "backendPort": 3000,
  "setupDatabase": false, "forceSchema": false,
  "db": { "name": "maki_math_v3" }
}
```

This needs an existing usable remote .env and schema. Even with setupDatabase=false, set db.name to the target database and match the remote PGDATABASE: the preflight and health checks use this name. Replace maki_math_v3 with your actual database name. Enabling setupDatabase requires db.name/user/password. Supplying env replaces remote .env and requires JWT_SECRET plus exactly 32-byte PAYLOAD_SECRET_KEY; production JWT_SECRET needs at least 32 bytes. Without env, an existing remote file is retained; generation occurs only in the applicable initialization branch. Match backendPort, .env PORT and the proxy port.

The frontend script instead uses host/port/username/password/remoteBaseDir/domain/backendPort/email/configureNginx. The ordinary frontend script still validates domain/email with configureNginx=false. These system-package scripts are not automatically portable across arbitrary servers.

## Domain and proxy

Serve frontend files as the site root, with history fallback to index.html. Preserve the /api/ prefix when proxying. Replace the sample domain/path/port:

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

This illustrates HTTP; configure HTTPS for production. TRUST_PROXY=loopback fits a same-host proxy, while separate hosts need their actual trusted network. Raising a proxy size limit does not raise the backend's 4 MiB encrypted-body limit. Check the actual database name in /health, then login/outline/body behavior, not just the homepage.

## Docs site

VitePress base is / for a custom-domain root. Output is Documents/.vitepress/dist. Pages runs on main pushes or workflow_dispatch, not ordinary branch pushes. Confirm Pages domain/DNS separately.
