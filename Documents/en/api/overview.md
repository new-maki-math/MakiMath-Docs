# API Overview & Conventions

MakiMath backend services adhere to a modular RESTful architecture. This document provides core API specifications, request conventions, error codes, and the **Master API & Permission Reference Table**.

---

## Protocols & Global Conventions

- **Base Endpoint URL**: All service endpoints are mounted under `/api` (e.g. `https://api.makimath.com/api/courses`).
- **Data Exchange Format**: Request and response payloads use `application/json; charset=utf-8`.
- **Authentication Header**: Protected endpoints require standard Bearer token authorization:
  ```http
  Authorization: Bearer <YOUR_JWT_TOKEN>
  ```
- **Naming Conventions**:
  - URL paths and query parameters: `snake_case` (e.g., `category_id`, `course_id`).
  - Request/Response JSON keys: Follow documented endpoint definitions.

---

## Master API & Permission Reference Table

The platform defines three primary user roles:
- **Reader (Public)**: Unauthenticated visitors and enrolled students. Possesses read-only access to all published courseware.
- **Course Editor (Editor)**: Authors admitted via invitation codes. Authorized to create, edit, reorder, and configure dependencies within their assigned courses.
- **Super Admin**: Complete administrative oversight, including initializing categories and course skeletons, assigning author roles, issuing invites, and platform maintenance.

The table below outlines endpoint accessibility across all three roles:

| Module | Method | Endpoint Path | Description | Reader | Editor | Super Admin |
|---|---|---|---|:---:|:---:|:---:|
| **System** | `GET` | `/health` | Server health and database connection telemetry | ✅ | ✅ | ✅ |
| **Auth & Session** | `POST` | `/api/auth/login` | Username/password login; issues dual tokens | ✅ | ✅ | ✅ |
| | `POST` | `/api/auth/register` | Register editor account via invitation token | ✅ | ✅ | ✅ |
| | `GET` | `/api/auth/check-invite` | Pre-validate invitation code validity & role | ✅ | ✅ | ✅ |
| | `POST` | `/api/auth/refresh` | Exchange refresh token for a new access token | ✅ | ✅ | ✅ |
| | `POST` | `/api/auth/logout` | Revoke session tokens and log out | - | ✅ | ✅ |
| | `GET` | `/api/auth/me` | Fetch active user profile and permissions | - | ✅ | ✅ |
| | `PATCH` | `/api/auth/profile` | Update display name | - | ✅ | ✅ |
| | `PATCH` | `/api/auth/password` | Change account password | - | ✅ | ✅ |
| | `GET` | `/api/auth/audit-logs` | Query personal user audit trail | - | ✅ | ✅ |
| **Categories** | `GET` | `/api/categories` | List all subject categories with course counters | ✅ | ✅ | ✅ |
| | `GET` | `/api/categories/:id` | Get category metadata | ✅ | ✅ | ✅ |
| | `POST` | `/api/categories` | Create new category | - | - | ✅ |
| | `PATCH` | `/api/categories/:id` | Update category title, slug, or description | - | - | ✅ |
| | `DELETE` | `/api/categories/:id` | Delete category (rejected if non-empty) | - | - | ✅ |
| | `PUT` | `/api/categories/order` | Batch update category display weights (`pos`) | - | - | ✅ |
| **Courses** | `GET` | `/api/courses` | List courses (filterable by category and status) | ✅ | ✅ | ✅ |
| | `GET` | `/api/courses/:id` | Get course details | ✅ | ✅ | ✅ |
| | `GET` | `/api/courses/:id/tree` | Fetch complete course outline tree (chapters + sections) | ✅ | ✅ | ✅ |
| | `POST` | `/api/courses` | Create new course skeleton | - | - | ✅ |
| | `PATCH` | `/api/courses/:id` | Update title, description, cover, and status | - | ✅* | ✅ |
| | `PUT` | `/api/courses/:id/prereqs`| Set array of macro prerequisite course IDs | - | ✅* | ✅ |
| | `PUT` | `/api/courses/order` | Batch update course order in category | - | ✅* | ✅ |
| | `DELETE` | `/api/courses/:id` | Delete course and cascade sub-entities | - | - | ✅ |
| | `POST` | `/api/courses/batch-delete` | Batch delete multiple courses | - | - | ✅ |
| **Chapters** | `GET` | `/api/chapters` | List chapters under a course | ✅ | ✅ | ✅ |
| | `GET` | `/api/chapters/:id` | Get chapter metadata | ✅ | ✅ | ✅ |
| | `POST` | `/api/chapters` | Create new chapter | - | ✅* | ✅ |
| | `PATCH` | `/api/chapters/:id` | Update chapter tag, title, or summary | - | ✅* | ✅ |
| | `PUT` | `/api/chapters/order` | Reorder chapters within a course | - | ✅* | ✅ |
| | `DELETE` | `/api/chapters/:id` | Delete single chapter | - | ✅* | ✅ |
| | `POST` | `/api/chapters/batch-delete` | Batch delete chapters | - | ✅* | ✅ |
| **Sections & Notes** | `GET` | `/api/sections` | List sections under a chapter | ✅ | ✅ | ✅ |
| | `GET` | `/api/sections/:id` | Get section metadata and prerequisite IDs | ✅ | ✅ | ✅ |
| | `GET` | `/api/sections/:id/doc` | **Fetch complete lecture content & AST (Core Reader API)** | ✅ | ✅ | ✅ |
| | `POST` | `/api/sections` | Create new section | - | ✅* | ✅ |
| | `PATCH` | `/api/sections/:id` | Update section title, tag, or slug | - | ✅* | ✅ |
| | `PUT` | `/api/sections/:id/source`| **Save Typst source with concurrency hash lock** | - | ✅* | ✅ |
| | `PUT` | `/api/sections/:id/prereqs`| Configure section DAG dependencies (cycle check) | - | ✅* | ✅ |
| | `PUT` | `/api/sections/order` | Batch reorder sections in chapter | - | ✅* | ✅ |
| | `POST` | `/api/sections/batch-move` | Batch move sections to target chapter | - | ✅* | ✅ |
| | `POST` | `/api/sections/batch-copy` | Batch copy sections to target chapter | - | ✅* | ✅ |
| | `DELETE` | `/api/sections/:id` | Delete single section | - | ✅* | ✅ |
| | `POST` | `/api/sections/batch-delete` | Batch delete sections | - | ✅* | ✅ |
| **Workbench** | `GET` | `/api/workbench/tree` | Fetch complete editing tree accessible to user | - | ✅ | ✅ |
| **Course Collaborators** | `GET` | `/api/courses/:id/editors` | List assigned editors for course | - | ✅ | ✅ |
| | `POST` | `/api/courses/:id/editors` | Grant editor authorization to course | - | - | ✅ |
| | `DELETE` | `/api/courses/:id/editors/:userId` | Revoke editor authorization | - | - | ✅ |
| **Invitations** | `POST` | `/api/invitations` | Generate new editor invitation token | - | - | ✅ |
| | `GET` | `/api/invitations` | Query invitation tokens, status, and quotas | - | - | ✅ |
| | `DELETE` | `/api/invitations/:id` | Revoke/delete unused invitation token | - | - | ✅ |
| **Users & Administration** | `GET` | `/api/users` | List platform users and account status | - | - | ✅ |
| | `POST` | `/api/users` | Provision user account directly | - | - | ✅ |
| | `PATCH` | `/api/users/:id` | Modify role, status, or reset password | - | - | ✅ |
| | `DELETE` | `/api/users/:id` | Remove user (cannot self-delete) | - | - | ✅ |
| | `GET` | `/api/audit-logs` | Platform-wide audit trail stream | - | - | ✅ |
| **Search & Discovery** | `GET` | `/api/search` | Full-text search across courses, chapters, and sections | ✅ | ✅ | ✅ |
| | `GET` | `/api/search/recommendations` | Get featured recommendation sections | ✅ | ✅ | ✅ |

> [!NOTE] Legend
> - `✅`: Full global access.
> - `✅*`: Accessible by Course Editors, restricted to their assigned courses (`requireCourseEditor`).
> - `-`: Forbidden (returns `401 Unauthorized` or `403 Forbidden`).

---

## Standard Responses & Error Formats

### 1. Success Response
Standard endpoints deliver plain object bodies or collections, optionally accompanied by status flags:
```json
{
  "ok": true,
  "data": { ... }
}
```

### 2. Standard Error Response
When request parameters fail validation, authorization is rejected, or concurrency collisions occur, the API returns a structured error object:
```json
{
  "error": "Descriptive error message",
  "code": "VALIDATION_FAILED"
}
```

### 3. HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Entity successfully created.
- `400 Bad Request`: Missing parameters, invalid formatting, or validation failures.
- `401 Unauthorized`: Token missing or expired.
- `403 Forbidden`: Insufficient permissions (not assigned course editor or admin).
- `404 Not Found`: Target entity not found.
- `409 Conflict`: Concurrency conflict (`source_hash` mismatch) or uniqueness violation (slug collision).
- `429 Too Many Requests`: Rate limiter triggered (default 300 req/min per IP).
- `500 Internal Server Error`: Unhandled server exception.
