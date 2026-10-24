# Communication & Data Security

To safeguard courseware data integrity and enforce access boundaries across network transit, MakiMath incorporates a lightweight communication security and access control mechanism.

---

## Core Design Considerations

| Consideration | Platform Approach |
|---|---|
| **Data Protection in Transit** | Request and response payloads undergo automated encoding in transit, avoiding raw cleartext exposure and maintaining data integrity. |
| **Session State Isolation** | Keys reside solely within runtime memory closures without persistent disk storage, renewing naturally upon page refresh. |
| **Developer Transparency** | Framework interceptors and middlewares handle communication flows automatically, preserving standard JSON data interactions in business code. |
| **Access Control (RBAC)** | Operates alongside JWT sessions and a three-tier role-based access model (Readers, Editors, Administrators) to govern API permissions. |

---

## Data Flow Overview

Application logic is decoupled from underlying communication handling. The general request and response lifecycle is structured as follows:

![Communication & Data Flow](/images/arch-security-handshake-en.svg)

### 1. Client-Side Interception
- The frontend encapsulates outgoing network requests through an API abstraction layer that serializes and wraps payloads before transmission.
- Views and components interact with standard asynchronous API calls without manual cryptographic boilerplate.

### 2. Server-Side Middleware
- Fastify server plugins intercept incoming requests at framework lifecycle hooks.
- Payloads are decoded before reaching domain route handlers, while outgoing responses are wrapped uniformly on departure.

---

## Access Control Model

Complementing transport-level protections, platform operations are regulated by role-based access control (RBAC):

- **Readers**: Direct access to all publicly published courses, outlines, and roadmaps without mandatory authentication.
- **Editors**: Granted workspace access upon authorization to author, edit, and organize lecture sections and prerequisite linkages.
- **Administrators**: Manage invitation codes, user roles, and platform settings.
