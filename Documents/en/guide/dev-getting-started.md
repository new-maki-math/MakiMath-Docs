# Developer Full-Stack Quickstart

This guide is intended for **engineers participating in MakiMath open-source development, extensions, and architectural debugging**. Follow these steps to spin up a complete local stack from scratch.
## Environment Prerequisites

Before beginning, ensure your local development machine satisfies the following prerequisites:

| Tool | Recommended Version | Note |
|---|---|---|
| **Node.js** | `>= 22.0.0` | The backend uses native Node.js ESM and built-in test runners |
| **pnpm** | `>= 9.0.0` | Unified package manager with fast workspace symlinking |
| **PostgreSQL** | `>= 14.0` | Relational database with the `pg_trgm` extension enabled for fuzzy search |
| **Git** | `>= 2.30` | Version control; commits must strictly follow Conventional Commits |

> [!TIP]
> Verify your toolchain versions:
> ```bash
> node -v  # Output should be v22.x.x or higher
> pnpm -v  # Output should be 9.x.x or higher
> psql --version  # Output should be PostgreSQL 14+
> ```
## 1. Clone the Repositories

We recommend organizing all MakiMath repositories inside a single parent directory:

```bash
mkdir MakiMath && cd MakiMath

# 1. Backend
git clone https://github.com/new-maki-math/MakiMath-Backend.git

# 2. Frontend
git clone https://github.com/new-maki-math/MakiMath-Frontend.git

# 3. Documentation
git clone https://github.com/new-maki-math/MakiMath-Docs.git
```
## 2. Configure & Run Backend (`MakiMath-Backend`)

### 2.1 Install Dependencies

```bash
cd MakiMath-Backend
pnpm install
```

### 2.2 Initialize PostgreSQL Database

1. Create a development database (assuming `maki_math_dev`):
   ```bash
   createdb -U postgres maki_math_dev
   ```
2. Run the schema migrations and seed initial data:
   ```bash
   psql -U postgres -d maki_math_dev -f Database/schema.sql
   ```

> [!IMPORTANT] Default Super Administrator Credentials
> `Database/schema.sql` seeds an initial administrator account for testing:
> - **Username**: `makimath_root`
> - **Initial Password**: `b!TnB7c3CGgcPxDFcaN8_&3Q`

### 2.3 Configure Environment Variables

Create a `.env` file in the root directory of `MakiMath-Backend`:

```ini
PORT=3000
HOST=127.0.0.1
LOG_LEVEL=info

# PostgreSQL Connection Settings
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_local_password
PGDATABASE=maki_math_dev

# JWT Authentication
JWT_SECRET=maki-math-secret-dev-key-2026
JWT_EXPIRES_IN=2h
JWT_REFRESH_EXPIRES_IN=7d

# Payload Communication Security Key (keep default for local dev)
PAYLOAD_SECRET_KEY=makimath-2026-secret-aes-key-32b
```

### 2.4 Start the Backend Server

```bash
pnpm dev
```

You should see logs indicating successful database connection and HTTP listener binding:
```text
[info] Database connected: maki_math_dev (PostgreSQL 16.x)
[info] Server listening at http://127.0.0.1:3000
```

Verify the health check endpoint: `http://127.0.0.1:3000/health`.
## 3. Configure & Run Frontend (`MakiMath-Frontend`)

### 3.1 Install Dependencies

Navigate into the frontend directory:

```bash
cd ../MakiMath-Frontend
pnpm install
```

### 3.2 Start Frontend Dev Server

```bash
pnpm dev
```

The frontend will run at `http://localhost:5173`.

Vite is configured (`vite.config.js`) to automatically proxy `/api/*` calls to `http://127.0.0.1:3000`.
## 4. Full-Stack Verification & Debugging Tips

Open `http://localhost:5173` in your browser:

1. **Reader Pipeline**:
   - Visit `/start` to verify public course listing.
   - Visit `/course/1` to ensure D3 knowledge graph renders correctly.
   - Open any section `/course/1/doc/1` to test Typlet WASM vector formula rendering.
2. **Editor & Admin Pipeline**:
   - Visit `/platform` and log in with the super administrator credentials.
   - Generate an invitation code to test editor onboarding.
   - Visit `/workbench` to create or edit chapters and sections.
3. **Cryptographic Payload Debugging**:
   - In browser DevTools Network tab, inspect POST/PUT requests to confirm payload encryption.
   - `plugins/crypto.js` on the backend decrypts requests automatically. Mismatched secret keys will trigger HTTP 400/500 errors.
## 5. Commit Guidelines

When submitting Pull Requests, make sure to follow Conventional Commits:

- Refer to our complete guide: [Git Commit Rules](../contributing/git-rules.md).
- Standard commit types: `feat`, `fix`, `refactor`, `perf`, `docs`, `chore`.

