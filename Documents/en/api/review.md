# Review and management API

Except public category reads and search, this page requires an admin session. Paths include /api and use the [transport envelope](./overview.md).

## Lecture review

| Path | Method | Operation | Parameters | Success |
| --- | --- | --- | --- | --- |
| `/api/reviews/{kind}/pending` | GET | Pending snapshots | kind only lecture | 200 snapshot rows with lecture_slug |
| `/api/reviews/{kind}/{id}` | POST | Review snapshot | kind=lecture; required decision/comment body | 201 review row |

ID is the submission response's snapshot.id. decision is approved/rejected; comment is required, allows empty, max 5000. Review row fields: id,lecture_revision_id,reviewer_id,decision,comment,created_at.

Only pending snapshots can be reviewed. Duplicate/nonpending, archived lecture or approved-base conflict gives 409. Approval publishes the snapshot and changes the source draft version; rejection leaves current public content. Admin self-review is currently allowed. kind=knowledge gives 400; knowledge has no review workflow.

## Categories and search

| Path | Method | Operation | Permission | Parameters | Success |
| --- | --- | --- | --- | --- | --- |
| `/api/categories/{kind}` | GET | Active categories | Public | kind knowledge/lecture | 200 id/parent_id/slug/name/descr/pos array |
| `/api/categories/{kind}` | POST | Create | Admin | slug/name; optional parent_id/descr/pos | 201 row |
| `/api/categories/{kind}/{id}` | PUT | Update | Admin | parent_id/name/descr/pos/status required | 200 row |
| `/api/search` | GET | Public search | Public | Required q, optional limit query | 200 hits wrapper |

Knowledge/lecture categories are separate. parent_id is a positive ID or null, name nonempty/max 200, descr empty/max 5000, pos nonnegative integer, status active/archived. Rows add status/created_at/updated_at. Creation defaults to parent null, descr empty and pos 0. Knowledge-subtree deletion is described in [knowledge API](./knowledge.md).

q is nonempty/max 100; limit integer 1–100, default 20. Knowledge hits are type=knowledge/id/slug/title; lecture hits type=lecture/id/slug/revision_id/title/descr. Matching is case-insensitive substring, sorted by type/id, not relevance. Knowledge searches title/source; lectures search title/description/raw section source without expanding referenced bodies.

## Invitations, users and audit

| Path | Method | Operation | Parameters | Success |
| --- | --- | --- | --- | --- |
| `/api/invitations` | POST | Create invitation | role/max_uses; optional note/expires_at | 201 row |
| `/api/invitations` | GET | Recent invitations | None | 200, up to 200 rows |
| `/api/invitations/{id}` | DELETE | Revoke invitation | No body | 200 revoked row, not 204 |
| `/api/users` | GET | User list | None | 200 summaries |
| `/api/users/{id}/status` | PATCH | Enable/disable | status active/disabled | 200 user summary |
| `/api/audit-logs` | GET | Recent audit | Optional limit 1–100, default 20 | 200 rows |

role is editor/super_admin; max_uses integer 1–1000. note allows empty/max 1000; expires_at is a parseable date string or null, default null. Invitation rows contain id/code/role/created_by/max_uses/used_count/status/note/expires_at/created_at/updated_at.

User lists contain id/username/display_name/role/status/last_login_at/created_at; status update returns the first five. Disabling self conflicts 409; missing user/invitation currently gives 400. Disabling deletes all user sessions.

Audit rows contain id/user_id/username/user_role/method/path/status_code/duration_ms/ip_address/user_agent/payload/created_at. Payload fields are sanitized; asynchronous audit logging is not a content rollback mechanism. Missing login is 401, insufficient role 403; other errors follow common conventions.
