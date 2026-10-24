# Backend Architecture (Fastify + PostgreSQL)

The MakiMath server application (located under `maki-math-backend`) is built on Node.js 22+ and the Fastify 5 framework. It leverages a modular microkernel design, characterized by high throughput, minimal overhead, strong typing safety, and robust database integrity constraints.

---

## Technical Stack & Dependencies

![Backend Architecture](/images/arch-backend-en.svg)

---

## Directory Hierarchy & Modules

```
maki-math-backend/src/
├── config.js              # Environment variable parser (ports, DB URI, JWT secret, security settings)
├── server.js              # Fastify bootstrapping, plugin registration, and lifecycle setup
├── db/
│   └── pool.js            # PostgreSQL connection pool singleton & query telemetry
├── lib/
│   ├── crypto.js          # Server security core adapter & cryptography bridge utilities
│   ├── errors.js          # Standardized error hierarchy (ValidationError, AuthError, etc.)
│   ├── order.js           # Position weight calculation and reordering logic
│   ├── typst-to-json.js   # Lightweight Typst AST extractor and card macro parser
│   └── util.js            # Helper utilities (timestamp formatting, hashing)
├── plugins/
│   ├── auth.js            # JWT auth decorator, cookie extraction, and 3-tier RBAC guards
│   └── crypto.js          # Global preParsing decrypt and onSend encrypt lifecycle hooks
└── routes/
    ├── auth.js            # Login, registration, logout, session refresh, and passwords
    ├── categories.js      # Subject categories CRUD
    ├── courses.js         # Course metadata CRUD and macro prerequisites
    ├── chapters.js        # Chapters CRUD and ordering
    ├── sections.js        # Section CRUD, Typst source persistence, and DAG links
    ├── invitations.js     # Invitation code generation, redemption, and quotas
    ├── search.js          # Cross-entity full-text search
    └── users.js           # User management, role elevation, and account controls
```

---

## Core System Mechanisms

### 1. Transparent Payload Encryption Lifecycle (`plugins/crypto.js`)
Fastify's lifecycle hooks allow business route logic to remain oblivious to cryptography details:
- **Decryption Phase (`preParsing`)**:
  - Upon receiving an encrypted payload, the security plugin verifies session context and decrypts the stream at the gateway layer.
  - The clean JSON payload is injected into `request.body`; route handlers interact purely with clean domain objects.
- **Encryption Phase (`onSend`)**:
  - Before sending the HTTP response, the plugin encrypts the response body before transmission, guaranteeing bidirectional protection.

### 2. Unified Authentication & 3-Tier RBAC (`plugins/auth.js`)
The Fastify instance is decorated with unified authentication and role guards:
- **Reader (Unauthenticated / Public)**:
  - Read-only access to all published lectures, outlines, and roadmaps without mandatory sign-in.
- **Editor**:
  - Registered via invitation codes. Guarded by `fastify.requireEditor`.
  - Authorized to author, edit, and reorder their assigned courses, chapters, and Typst sections.
- **Super Admin**:
  - Highest authorization level, guarded by `fastify.requireAdmin`.
  - Dispatches invitation codes, manages user roles, and accesses platform audit logs.

### 3. Data Integrity & Concurrent Editing Protection
- **Database-Level Self-Prerequisite Prevention**:
  Enforced directly on PostgreSQL:
  ```sql
  CONSTRAINT sections_no_self_prereq CHECK (NOT (id = ANY (prereqs)))
  ```
- **Optimistic Concurrency Control (`source_hash`)**:
  Section updates require the caller to submit the previous SHA-256 `source_hash`. If the content has been concurrently updated by another author, the request is rejected with a conflict error.
- **Transactional Tree Reordering**:
  Drag-and-drop operations that update multiple `pos` values execute inside atomic database transactions (`BEGIN ... COMMIT`).
