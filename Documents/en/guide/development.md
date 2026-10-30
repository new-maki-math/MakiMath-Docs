# Local development

The projects are `maki-math-re` (Vue/Vite), `maki-math-backend` (Fastify/PostgreSQL) and `maki-math-docs` (VitePress). Install dependencies separately in each repository.

## Database and backend

Use Node.js 22+. Create a separate development database and apply Database/schema.sql to an empty database. It uses pg_trgm and needs appropriate database permissions. Do not rerun initialization on an existing business database.

Install backend dependencies, configure .env, then start. Create the first admin before starting the development server:

```powershell
npm install
npm run admin:init
npm run dev
```

admin:init requires existing tables and .env. It displays the actual target database, then asks for confirmation, account details and hidden password confirmation. Existing active admins or duplicate usernames prevent creation. It does not overwrite passwords; schema provides no default admin.

| Variable | Purpose/default |
| --- | --- |
| PGHOST / PGPORT | Database address, localhost / 5432 |
| PGUSER / PGPASSWORD / PGDATABASE | postgres / empty / maki_math_dev; set for your database |
| HOST / PORT | Backend binding, 127.0.0.1 / 3000 |
| JWT_SECRET | Session signing; production minimum 32 bytes |
| PAYLOAD_SECRET_KEY | Compatibility communication key, exactly 32 UTF-8 bytes; required in production |
| JWT_EXPIRES_IN / JWT_REFRESH_EXPIRES_IN | Defaults 2h / 7d; refresh accepts positive integer plus s/m/h/d, up to 365 days |
| LOG_LEVEL / TRUST_PROXY | info / loopback; see [deployment](../deploy/self-host.md) |

Do not copy development keys into production. Existing process variables override .env. GET http://127.0.0.1:3000/health queries the actual database and returns its name/version and uptime. It proves connectivity, not business-flow correctness.

## Frontend and documentation

In the frontend, install dependencies and run npm run dev. Vite defaults to port 5173 with the local SSL plugin; use the HTTPS URL printed by the process. /api proxies to http://127.0.0.1:3000 unless the startup environment sets VITE_API_TARGET. VITE_API_BASE is a client request prefix, not the proxy target.

The docs use pnpm install, pnpm docs:dev and pnpm docs:build. The docs site and product frontend publish independently; their build outputs are not interchangeable.

## Finding the implementation

Frontend routes are under src/router, pages under src/views, Typst/MM parsing under src/components/Renderer, API calls under src/api and local persistence under src/utils. Backend routes validate requests, services handle permissions/transactions, and schema.sql holds database constraints. The backend does not parse Typst.

Begin integration with [API conventions](../api/overview.md) and [lecture reads/writes](../api/lectures.md). Verify according to change risk; a successful build does not establish authorization/concurrency correctness. Use Conventional Commits and a review branch for documentation; do not push main directly.
