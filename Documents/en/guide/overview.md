# Project Overview

## What is MakiMath?

**MakiMath** is an open-source, modern **structured lecture and learning platform** specifically engineered for mathematics and exact sciences.

In traditional STEM education, courseware and digital handouts are usually structured **linearly** (page after page). This linear format fails to reflect the intricate prerequisite dependencies between definitions, theorems, and algorithms. Meanwhile, legacy LaTeX setups are notoriously heavy, slow to compile, and ill-suited for reactive web applications.

MakiMath combines the **modern Typst typesetting language**, **Directed Acyclic Graph (DAG) knowledge topologies**, and a **modern full-stack web architecture** to deliver a dynamic, conceptual roadmap for learners, teachers, and content creators.
## Core Design Principles

![MakiMath Core Design Principles](/images/overview-philosophy-en.svg)

### 1. Structured Knowledge Topology (DAG)
While conventional textbooks are linear, mathematical knowledge is naturally a Directed Acyclic Graph (DAG):
- **Four-Tier Hierarchy**: The platform organizes content across `Category` → `Course` → `Chapter` → `Section`.
- **Explicit Prerequisite Mapping**: Every section can declare its prerequisites (e.g., *mastering "2x2 Determinants" and "Polar Transforms" before studying "Change of Variables in Double Integrals"*).
- **Knowledge Roadmap**: Built with D3.js, the frontend rolls up section prerequisites into chapter-level graphs, offering learners an intuitive, interactive learning path.

### 2. Modern Typst Typesetting
- **Clean and Ergonomic**: Free of verbose LaTeX markup environments and massive toolchain overhead. Typst is concise, readable, and fast.
- **Millisecond WASM Rendering**: Lecture sources are stored as raw text in PostgreSQL and compiled to an AST JSON format. The frontend renders crisp vector typography natively in the browser via Typlet (WebAssembly), ensuring crisp formulas at any zoom scale.

### 3. Secure, Open, and Modern Full-Stack
- **End-to-End Payload Encryption**: Transparent full-link encryption for request/response payloads via the proprietary security core to safeguard lecture assets and API integrity.
- **Three-Tier Role Model**:
  - **Public Reader**: Completely login-free access to all published (`live`) courses.
  - **Course Editor**: Registered via administrator invitations to compose content, preview Typst AST rendering, and arrange prerequisite graphs in a dedicated workbench.
  - **Super Administrator**: Complete control over user management, invitation issuance, and structured audit logs.
## Repository Ecosystem Matrix

MakiMath is modularized into distinct focused repositories:

| Repository / Directory | Tech Stack | Role & Responsibility |
|---|---|---|
| **[MakiMath-Frontend](https://github.com/new-maki-math/MakiMath-Frontend)** | Vue 3 + Vite 8 + D3 + Typlet | Core frontend application: Lecture reader, knowledge graph, editor workbench, and platform admin panel |
| **[MakiMath-Backend](https://github.com/new-maki-math/MakiMath-Backend)** | Fastify 5 + PostgreSQL 16 | High-performance asynchronous backend: Topological sorting, Typst AST parsing, full-text search, and audit trails |
| **[SecureCorePackage](https://github.com/new-maki-math/SecureCorePackage)** | Internal Security Helper | Internal module for network communication and data packaging support |
| **[MakiMath-Docs](https://github.com/new-maki-math/MakiMath-Docs)** | VitePress 2 | Official bilingual technical documentation and developer guides |
## Next Steps

- Check out [Getting Started](./getting-started.md) to set up and run the project locally in under 5 minutes.
- Explore the [Lecture Authoring Guide](../authoring/workflow.md) to learn how to structure mathematical courses.

