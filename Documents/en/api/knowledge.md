# Knowledge API

Knowledge is now maintained directly by administrators, with active/archived states and no revision, edit_version, submission or review API. Point IDs remain permanent identities for relationships and local mastery. Source is raw text; a single-box body is a convention, not an enforced validation rule.

| Path | Method | Purpose | Permission | Request | Success |
| --- | --- | --- | --- | --- | --- |
| `/api/knowledge-points` | `GET` | Active points | Public | None |200 array of id/slug/title |
| `/api/knowledge-points/{id}` | `GET` | Active detail | Public | Positive path ID |200 detail |
| `/api/knowledge-points/by-slug/{slug}` | `GET` | Active detail by slug | Public | Valid slug |200 detail |
| `/api/knowledge-map` | `GET` | Map | Public | Optional category_id query |200 categories/nodes/edges/stats/filter |
| `/api/knowledge-points/manage` | `GET` | Management list | Admin | None |200 summaries with category_ids |
| `/api/knowledge-points/manage/{id}` | `GET` | Management detail | Admin | Path ID |200 point row |
| `/api/knowledge-points` | `POST` | Create | Admin | slug,title,source required |201 point row |
| `/api/knowledge-points/{id}` | `PUT` | Update | Admin | title,source required |200 point row |
| `/api/knowledge-points/import` | `POST` | Import new batch | Admin | category_id,data required |201 mappings/counts |
| `/api/knowledge-points/{id}/status` | `PATCH` | Archive/restore | Admin | status active/archived |200 point row |
| `/api/knowledge-points/{id}/prerequisites` | `GET` | Active direct prerequisites | Public | Path ID |200 id/slug/title array |
| `/api/knowledge-points/{id}/prerequisites` | `PUT` | Replace prerequisites | Admin | prerequisites ID array |200 knowledge_point_id/prerequisites |
| `/api/knowledge-points/{id}/categories` | `PUT` | Replace associations | Admin | categories ID array |200 knowledge_point_id/categories |
| `/api/knowledge-points/{id}` | `DELETE` | Delete point and links | Admin | No body |204 |
| `/api/categories/knowledge/{id}` | `DELETE` | Delete category subtree | Admin | No body |204 |

Public detail is `{id,slug,title,source,categories}`, with categories of id/slug/name. Missing/archived points return404. Public/managed reads and map use no-store. Point rows add status,created_by,updated_by,created_at,updated_at; management lists omit source. Creation slug is lowercase letters/digits/hyphens up to100, title nonempty up to200, source nonempty up to200000. Slug cannot be updated. Relationship arrays replace all, up to100 unique IDs, with database cycle protection.

Map category_id filters nodes to a category subtree; invalid/inactive filter404. categories still includes all active categories. Edges run prerequisite source to dependent target, both in the returned nodes. stats and filter describe the result.

Batch data is schema_version=1 with categories,points,edges; category_id must target an active root knowledge category. File-local IDs are strings. Imports create without overwriting, return counts and local-to-database category/point ID mappings. The data JSON limit is2MiB,150 categories,1000 points,6000 edges,10000 associations and100 categories per point; the overall encrypted HTTP body also has a4MiB limit. Missing local targets/cycles are rejected; slug collisions409. See the [full JSON shape](/api/knowledge).

Deleting a point cleans incoming/outgoing prerequisites and category links, not lecture source or browser mastery. Deleting a category subtree removes points associated only with that subtree, preserving those also linked outside. Deletion does not require prior knowledge archiving. Errors:400 parameters,401 login,403 permissions,404 missing/private,409 uniqueness/associations/invalid import target. Unknown fields are rejected.
