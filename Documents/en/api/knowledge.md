# Knowledge API

Admins maintain current title/source directly. There are no knowledge revisions, reviews, summary, animation or content metadata. Public reads only return active points; admins use management reads for archived content.

| Path | Method | Operation | Permission | Parameters | Success |
| --- | --- | --- | --- | --- | --- |
| `/api/knowledge-points` | GET | Active list | Public | None | 200 id/slug/title array |
| `/api/knowledge-points/{id}` | GET | Detail by ID | Public | Path ID | 200 detail |
| `/api/knowledge-points/by-slug/{slug}` | GET | Detail by slug | Public | Path slug | 200 detail |
| `/api/knowledge-map` | GET | Map | Public | Optional category_id query | 200 map |
| `/api/knowledge-points/manage` | GET | Management list | Admin | None | 200 summaries |
| `/api/knowledge-points/manage/{id}` | GET | Management detail | Admin | Path ID | 200 point row |
| `/api/knowledge-points` | POST | Create | Admin | slug/title/source | 201 point row |
| `/api/knowledge-points/{id}` | PUT | Update title/body | Admin | title/source | 200 point row |
| `/api/knowledge-points/import` | POST | Add batch | Admin | category_id/data | 201 mappings |
| `/api/knowledge-points/{id}/status` | PATCH | Archive/restore | Admin | status active/archived | 200 row |
| `/api/knowledge-points/{id}/prerequisites` | GET | Active direct prerequisites | Public | Path ID | 200 id/slug/title array |
| `/api/knowledge-points/{id}/prerequisites` | PUT | Replace prerequisites | Admin | prerequisites ID array | 200 knowledge_point_id/prerequisites |
| `/api/knowledge-points/{id}/categories` | PUT | Replace categories | Admin | categories ID array | 200 knowledge_point_id/categories |
| `/api/knowledge-points/{id}` | DELETE | Delete point/relations | Admin | No body | 204 |
| `/api/categories/knowledge/{id}` | DELETE | Delete category subtree | Admin | No body | 204 |

ID is positive. Creation slug is max 100, title nonempty/max 200, source nonempty/max 200000. Business APIs cannot rename slugs. PUT has no edit_version; last successful write wins. A single MM box is a convention, not validation.

## Responses and relations

Public detail is id/slug/title/source/categories, with category id/slug/name. Missing/archived points give 404. Lists, details, map and management reads set no-store. Point rows add status/created_by/updated_by/created_at/updated_at. Managed summaries omit source and add all direct category_ids, including archived categories. Do not clear those links merely because public categories hide them.

Category/prerequisite arrays replace the whole set, up to 100 unique IDs; empty clears it. Cycles are database-rejected. Point deletion cleans both prerequisite directions and category links, not lecture source or browser mastery. Subtree deletion removes points linked only inside the subtree, preserving points linked outside.

Map returns categories/nodes/edges/stats/filter. Categories contain id/parent_id/slug/name/pos; nodes id/slug/title/category_ids. Edges are prerequisite source to dependent target. Optional category_id scopes nodes to a category subtree, while categories remains the full active list. Both endpoints of each returned edge are in the node set. stats has category_count/node_count/edge_count; filter has category_id/include_descendants=true. Invalid/inactive category filters give 404.

## Import

Target category_id must be an active root category. File-local IDs are strings, not database IDs. Imports only create and do not overwrite slug collisions. Unknown fields, missing local targets, duplicate IDs and cycles are rejected.

```json
{
  "category_id": 1,
  "data": {
    "schema_version": 1,
    "categories": [{ "id": "c1", "parent_id": null, "slug": "limits", "name": "Limits", "pos": 0 }],
    "points": [{ "id": "p1", "slug": "sequence-limit", "title": "Sequence limits", "source": "#mm-box-definition[Definition]", "category_ids": ["c1"] }],
    "edges": []
  }
}
```

Replace the illustrative target ID. All category fields are required; point category_ids may be absent/empty to attach directly to the target. File-root categories attach under the target. Edges use local source/target point IDs, with source as prerequisite.

201 returns category_id/counts/categories/points. counts has category/point/edge totals. Mappings are `{id,category_id}` and `{id,point_id}`; id is the file string, the other field is the new database ID.

Serialized data is limited to 2 MiB, 150 categories, 1000 points, 6000 edges, 10000 associations and 100 categories per point, plus the overall 4 MiB encrypted request limit. Errors may include field/index/property/id/slug in details. Typical states: 400 input, 401 login, 403 permission, 404 missing, 409 slug/target/association conflicts. Check lists before retrying an uncertain creation.
