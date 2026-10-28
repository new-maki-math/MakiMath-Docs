# Developer setup

Current baselines appear in [integration](../api/frontend-integration.md). Backend requires Node22+,PostgreSQL and dependencies, default127.0.0.1:3000; /health checks database connectivity. Frontend Vite proxies/api according to configuration.

Database/schema.sql is empty-database initialization, without default admin credentials. After schema and backend.env setup, run npm run admin:init interactively in the backend directory. It shows the actual target database before confirmation and asks for account details and hidden password confirmation; existing active admins prevent creation. It does not create a database or apply schema. Process environment overrides.env. Never put passwords in commits or command arguments.

Existing databases require explicit [manual upgrades](../deploy/database-upgrade.md), not recreation. Current API has no knowledge revisions, old courses/sections, fixed revision blocks or animation. Admins maintain current points; lecture working drafts use edit_version and independent submission snapshots. This documentation round performed static review only, without builds, tests or browser sessions.
