# Lecture API

Follow [transport and concurrency conventions](./overview.md). View means owner/admin/view-or-edit collaborator; Edit excludes view-only collaborators. Public availability does not grant private-version access. Outlines, section source and covers load separately.

## Reading

IDs are positive integers. Chapter/section slugs are nonempty strings, at most 100 characters.

| Path | Method | Operation | Permission | Parameters | Success |
| --- | --- | --- | --- | --- | --- |
| `/api/lectures` | GET | Public list | Public | None | 200 summaries |
| `/api/lectures/mine` | GET | Accessible identities | Login | None | 200 identity rows; admin all |
| `/api/lectures/owned` | GET | Own version shelf | Login | None | 200 items with versions; actual ownership only |
| `/api/lectures/manage` | GET | All management summaries | Admin | None | 200 summaries |
| `/api/lectures/by-slug/{slug}/outline` | GET | Select version/read directory | Public or View | Optional revision_id query | 200 lecture/revision/chapters, without section source |
| `/api/lectures/by-slug/{slug}/revisions/{revisionId}/chapters/{chapterSlug}/sections/{sectionSlug}` | GET | One body | Same version visibility | Required edit_version query | 200 revision_id/edit_version/occurrence_id/source |
| `/api/lectures/{id}/revisions` | GET | Private revision list | View | None | 200 revision rows |
| `/api/lecture-revisions/{id}/cover` | GET | Version cover | Same version visibility | None | 200 revision_id/cover/cover_hash |
| `/api/lecture-revisions/{id}/export` | GET | Full single-version export | Current public or View | None | 200 [portable JSON](../authoring/import-export.md); archives reject |

Without revision_id, a published lecture selects its current public revision. Otherwise authorized users select a unique working draft; ambiguity gives 409 details `{lecture_id,drafts}`. An explicit revision_id must belong to the lecture. Anonymous/nonprivate users can read only the current published approved version; unavailable versions give 404. Authorized users can read drafts/history, including archives. Outline/body/cover/owned/manage/export set no-store.

Body reads use the outline's edit_version. Mismatch gives 409 and requires a fresh outline. The URL uses chapter/section slugs, not old row IDs. Page routes likewise use `/lecture/online/{slug}/doc/{chapterSlug}/{sectionSlug}`, with local instead of online for browser copies.

| Response object | Fields |
| --- | --- |
| Identity | id,slug,owner_id,publication_status,public_revision_id,is_recommended,created_at,updated_at |
| Public summary | id,slug,is_recommended,revision_id,title,subtitle,descr,category_id,has_cover,cover_hash |
| Outline lecture | id,slug,public_revision_id,is_recommended, without owner_id |
| Outline revision | id,lecture_id,revision_no,based_on_id,source_draft_id,category_id,title,subtitle,descr,typst_version,metadata,change_note,created_by,edit_version,status,submitted_at,reviewed_at,created_at,updated_at,has_cover,cover_hash; metadata omits cover |
| Chapter/section | Row/parent/version IDs,occurrence_id,slug,tag,title,summary,pos,timestamps; chapters nest sections, sections omit source |
| Owned item | id,slug,publication_status,public_revision_id,versions; each version has revision_id,revision_no,kind,status,title,subtitle,descr,updated_at,has_cover,cover_hash,is_public |
| Management item | id,slug,owner_id,owner_username,publication_status,public_revision_id,latest_revision; latest may be null, otherwise revision_id,revision_no,status,kind,title |

kind is working_draft/snapshot. cover_hash is a content SHA-256, not permission, and may be null. Missing covers give 404; unsupported legacy cover data may give 409.

## Creation and saves

| Path | Method | Operation | Permission | Parameters | Success |
| --- | --- | --- | --- | --- | --- |
| `/api/lectures` | POST | New identity/draft | Login | slug,title | 201 lecture/revision |
| `/api/lectures/import` | POST | New lecture from file | Login | Portable JSON body | 201 lecture/revision |
| `/api/lectures/{id}/revisions` | POST | Copy submitted base | Edit | based_on_id | 201 outline, no source |
| `/api/lecture-revisions/{id}` | PUT | Replace tree/specified source | Edit | Complete save body | 200 updated outline |
| `/api/lecture-revisions/{id}/sections/{occurrenceId}` | PUT | Update existing section | Edit | edit_version,slug,tag,title,summary,source, all required | 200 section/edit_version, section includes source |
| `/api/lecture-revisions/{id}/cover` | PUT | Set draft cover | Edit | edit_version,cover | 200 cover-save result |
| `/api/lecture-revisions/{id}/cover` | DELETE | Remove draft cover | Edit | Required edit_version query, no body | 200 cover-save result, not 204 |

Complete save example:

```json
{
  "edit_version": 1,
  "title": "Limits", "subtitle": "", "descr": "An introduction",
  "category_id": null, "typst_version": "0.15.1", "metadata": {}, "change_note": "First draft",
  "chapters": [{ "slug": "chapter-1", "title": "Limits", "sections": [{ "slug": "section-1", "title": "Sequence limits", "source": "#mm-knowledge(slug: \"sequence-limit\")" }] }]
}
```

All top-level fields are required. Nonempty title max 200; subtitle/descr/change_note allow empty, max 500/5000/2000. category_id is an ID or null. typst_version is nonempty/max 50 and only metadata, not a server compiler selection. metadata is an object. Limits: 100 chapters, 200 sections per chapter, 2000 total and 4 MiB for the encrypted request.

Chapters require slug/sections, sections require slug; both optionally accept occurrence_id/tag/title/summary. Slugs nonempty/max 100, the three directory text fields empty/max 5000, source max 200000. A new section must provide source. Existing occurrence_id may omit source to preserve its stored body; an unknown occurrence gives 409.

It is still whole-tree replacement: omitted directory nodes are deleted. Preserve chapter/section UUIDs; omit row IDs, timestamps and pos. Omitting source does not mean omitting the section. metadata.cover does not replace a cover through ordinary save; use cover endpoints. Successful save increments edit_version and returns an outline without bodies.

Cover is a PNG/JPEG/WebP Data URL, at most 524288 decoded bytes, with Base64/MIME/file-header checks. Set/remove returns revision_id/edit_version/has_cover/cover_hash and increments the draft version. Only unarchived working drafts can change covers. Covers copy with revisions/snapshots, without overwriting the public history.

## Submission

| Path | Method | Operation | Permission | Body | Success |
| --- | --- | --- | --- | --- | --- |
| `/api/lecture-revisions/{id}/submit` | POST | Create review snapshot | Edit | edit_version | 200 snapshot/draft_edit_version |

One working draft and one pending snapshot per lecture are allowed. Copying while a draft exists gives 409 details.draft_id, unlike outline ambiguity's details.drafts array.

Submission copies saved directory/source/cover into a new pending snapshot, leaving the working draft draft and not incrementing its version. At least one section must have nonblank source. Review snapshot.id, not the original draft ID. Submitted snapshots cannot be edited.

[Admin approval](./review.md) publishes the snapshot and changes the source draft based_on_id/edit_version. Rejection leaves public content unchanged. Submission/approval check the approved ancestry against the current public pointer; conflicts give 409. Public knowledge bodies are not frozen with the macro source.

## Collaborators and lifecycle

| Path | Method | Operation | Permission | Parameters | Success |
| --- | --- | --- | --- | --- | --- |
| `/api/lectures/{id}/collaborators` | GET | List | View | None | 200 user_id/permission/created_at/username/display_name array |
| `/api/lectures/{id}/collaborators/{userId}` | PUT | Set view/edit | Owner/admin | permission | 200 lecture_id/user_id/permission/invited_by/created_at |
| `/api/lectures/{id}/collaborators/{userId}` | DELETE | Remove | Owner/admin | No body | 204 |
| `/api/lectures/{id}/publication` | PATCH | Publication/recommendation | Owner/admin; recommendation admin only | Optional publication_status,is_recommended | 200 identity |
| `/api/lectures/{id}/restore` | POST | Restore archive | Owner/admin | No body | 200 identity |
| `/api/lectures/{id}` | DELETE | Permanently delete archive | Admin | No body | 204 |

publication_status accepts published/withdrawn/archived. Publishing requires an approved public pointer, which cannot be supplied by the client. Withdraw/archive clear recommendation; approval of a new version does not clear an existing recommendation. Archives block mutation, submit/copy/export/collaborator changes/publication and review.

Restore returns withdrawn if there is a public pointer, otherwise unpublished, without recommendation or automatic publication. Permanent deletion requires archived state and cleans identity/directory/covers/revisions/reviews/collaborators, not public knowledge/browser copies. Three-step confirmation is UI behavior, not a server token or multi-request protocol.

Errors: 400 parameters, 401 login, 403 permission, 404 unreadable/missing, 409 concurrency/archive/uniqueness/base/pending conflict. Collaborators must be active (otherwise 404); redundant owner assignment gives 409, removal of a missing collaborator still gives 204.
