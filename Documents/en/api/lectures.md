# Lecture API

A lecture has one working draft and independent review snapshots. Chapters contain sections with complete source, not blocks or fixed knowledge-revision references. Knowledge macros resolve current active content.

| Path | Method | Purpose | Permission | Request | Success |
| --- | --- | --- | --- | --- | --- |
| `/api/lectures` | `GET` | Public list | Public | None |200 summaries |
| `/api/lectures/by-slug/{slug}` | `GET` | Read selected version | Public/private rules below | Optional revision_id query |200 lecture/revision/chapters |
| `/api/lectures/mine` | `GET` | Accessible lectures | Login | None |200 identities; admin all |
| `/api/lectures/owned` | `GET` | Own version shelf | Login | None |200 identities with versions |
| `/api/lectures` | `POST` | Create lecture/draft | Login | slug,title |201 lecture/revision |
| `/api/lectures/import` | `POST` | Import new lecture | Login | Portable document |201 lecture/revision |
| `/api/lectures/{id}/revisions` | `GET` | List revisions | View | None |200 rows |
| `/api/lectures/{id}/revisions` | `POST` | Copy submitted base | Edit | based_on_id |201 revision/chapters |
| `/api/lecture-revisions/{id}` | `GET` | Private full version | View | None |200 revision/chapters |
| `/api/lecture-revisions/{id}/export` | `GET` | Export one version | Current public or View | None |200 portable JSON |
| `/api/lecture-revisions/{id}` | `PUT` | Replace whole draft | Edit | Complete save |200 revision/chapters |
| `/api/lecture-revisions/{id}/submit` | `POST` | Create review snapshot | Edit | edit_version |200 snapshot/draft_edit_version |
| `/api/lectures/{id}/collaborators` | `GET` | List collaborators | View | None |200 array |
| `/api/lectures/{id}/collaborators/{userId}` | `PUT` | Set collaborator | Owner/admin | permission view/edit |200 row |
| `/api/lectures/{id}/collaborators/{userId}` | `DELETE` | Remove collaborator | Owner/admin | None |204 |
| `/api/lectures/{id}/publication` | `PATCH` | Publication/recommendation | Owner/admin; recommendation admin only | Optional publication_status,is_recommended |200 identity |
| `/api/lectures/{id}/restore` | `POST` | Restore archive | Owner/admin | No body |200 identity |
| `/api/lectures/{id}` | `DELETE` | Permanently delete archive | Admin | No body |204 |

View includes owner/admin/view-or-edit collaborator; Edit excludes view-only collaborators. IDs are positive integers; slug is lowercase letters/digits/separating hyphens up to100. Old numeric public GET /api/lectures/{id} is removed. Anonymous slug reads select only the current published approved version. Authorized users may select their lecture draft or snapshots with revision_id, including archived private reads. Without revision_id, published content wins; otherwise a unique working draft is selected or409 details.drafts supplies candidates. Slug/private/owned/export reads use no-store.

owned only lists actual ownership, even for admins; mine has broader accessible scope. owned versions include revision_id,revision_no,kind working_draft/snapshot,status,title,subtitle,updated_at,is_public.

Complete save requires edit_version,title,subtitle,descr,category_id,typst_version,metadata,change_note,chapters. Chapter requires slug/sections; section requires slug/source; both optionally accept occurrence_id/tag/title/summary. Preserve chapter/section UUIDs, omit row IDs/positions/times. Source references have no server instance ID. Limits:100 chapters,200 sections each,2000 total,200000 characters per source, and4MiB for the entire encrypted request. See [complete fields and example](/api/lectures).

Save increments edit_version and replaces the whole tree. Submission copies persisted source into a new pending snapshot and does not increment the working draft; response is `{snapshot,draft_edit_version}`. Review uses snapshot.id. Draft stays editable; one pending snapshot per lecture. Copying with an existing draft returns409 details.draft_id. Approval publishes the snapshot and updates the source draft based_on_id/edit_version; preserve unsaved edits before reload. Snapshot freezes source, not referenced public knowledge.

Archived lectures remain privately readable but block save/submit/copy/export/collaborator changes/normal publication/review with409. Restore returns withdrawn if a public pointer exists, otherwise unpublished, always recommendation false. Admin deletion requires archived state and removes identity, drafts, snapshots, reviews, directory and collaborators, not public knowledge/browser data. Frontend three-step confirmation is not an API protocol. See [portable JSON](../authoring/import-export.md).
