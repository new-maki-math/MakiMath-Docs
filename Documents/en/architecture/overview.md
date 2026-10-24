# System Architecture Overview

MakiMath is a high-performance, full-stack courseware platform purpose-built for modern mathematical pedagogy and academic research. It addresses three longstanding bottlenecks of traditional math platforms: linear fragmentation of knowledge, heavy/imprecise LaTeX rendering, and vulnerability to automated content scraping.

---

## Overall System Architecture & Core Interaction Sequence

The core architecture of MakiMath is structured around two primary execution pipelines: the **Public Reader Flow** and the **Protected Editor Workbench Flow**. System modules collaborate efficiently across this sequence:

![MakiMath Overall System Interaction Sequence](/images/arch-topology-en.svg)

### 1. Reader Public Reading Flow
- **Unauthenticated Access**: When a reader accesses a published lecture (e.g., `/course/math-analysis/doc/sec-1`), the frontend issues a lightweight public request without auth tokens.
- **Status Verification & Parsing**: The backend verifies the section belongs to a `live` course, parses the Typst source structure, and returns the payload.
- **Client-Side Vector Typesetting**: The frontend matches card presets and leverages the Typlet WebAssembly engine to render high-fidelity formulas natively in the browser.

### 2. Editor Workbench Modification & Save Flow
- **Granular Access Control**: When authors save lecture changes, requests carry authentication tokens validated by `requireLogin` and `requireCourseEditor` guards.
- **Version Hashing & Concurrency Safety**: Updating the Typst source recalculates the `sha256` digest to prevent concurrent overwrites.
- **Operational Audit Trails**: Every revision records an entry into `audit_logs` for full traceability.

---

## Repository Ecosystem Matrix

MakiMath is modularized into distinct focused repositories:

| Repository / Directory | Tech Stack | Role & Responsibility |
|---|---|---|
| **[MakiMath-Frontend](https://github.com/new-maki-math/MakiMath-Frontend)** | Vue 3 + Vite 8 + D3 + Typlet | Core frontend application: Lecture reader, knowledge graph, editor workbench, and platform admin panel |
| **[MakiMath-Backend](https://github.com/new-maki-math/MakiMath-Backend)** | Fastify 5 + PostgreSQL 16 | High-performance asynchronous backend: Topological sorting, Typst AST parsing, full-text search, and audit trails |
| **[MakiMath-Docs](https://github.com/new-maki-math/MakiMath-Docs)** | VitePress 2 | Official bilingual technical documentation and developer guides |

---

## Core Data & Execution Pipelines

### 1. Typst Compilation & Vector Rendering Pipeline
Unlike legacy platforms that embed MathJax/KaTeX snippets into HTML, MakiMath leverages end-to-end Typst:

![Typst Compilation & Vector Rendering Pipeline](/images/arch-typst-pipeline-en.svg)

- **Environment-free writing**: Authors omit `#set page` or layout directives and focus purely on math definitions, theorems, and proofs.
- **Unified presets**: Built-in visual presets match macros to styled cards, callouts, and mathematical block designs.

### 2. DAG Knowledge Topology Pipeline
- **Section-level linkages**: Authors declare `prereqs` (prerequisite section IDs) when editing content.
- **Cycle prevention**: The backend runs topological traversal on save and enforces database constraints (`CHECK (NOT (id = ANY (prereqs)))`).
- **Dynamic graph rollup**: In course-wide roadmaps, D3 aggregates section dependencies into chapter-level topological stages.

### 3. Communication & Data Security (Security Pipeline)
- **Transport-Level Protection**: Request and response bodies are automatically packaged in transit to prevent cleartext data exposure.
- **Session State Isolation**: Ephemeral session contexts are maintained exclusively in memory without relying on persistent local storage.
- **Bidirectional Transparent Pipeline**: Handlers on both frontend and backend manage encoding/decoding seamlessly, keeping business logic clean.
