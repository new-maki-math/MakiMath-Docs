# Frontend integration

::: info Code baseline
Backend ea63e51; frontend64cc122,2026-10-29. Static review only: no build, tests or browser integration were run.
:::

Authentication returns user/access_token/refresh_token; me wraps user, registration requires a separate login, logout sends the latest refresh_token and password changes send old_password/new_password, both returning204. Tables already include/api. Use the existing encryption layer; errors remain plain JSON.

1. An admin POSTs /api/knowledge-points with slug,title,source such as `#mm-box-definition[Definition]`.201 returns a point row, not point/revision. Knowledge is immediately active, with no revision review. Read it using /api/knowledge-points/by-slug/{slug}.
2. A logged-in editor POSTs /api/lectures with slug/title;201 returns lecture and its working draft revision. Save that revision with the [complete save body](./lectures.md), including edit_version and chapter/section source. Author content and `#mm-knowledge(slug: "sequence-limit")` share the same source string. Preserve chapter/section occurrence_id, not database row metadata.
3. Submit the saved draft with `{ "edit_version": 2 }`.200 returns `{snapshot,draft_edit_version}`. The original draft remains editable and its version is unchanged by submission. An admin reviews snapshot.id through POST /api/reviews/lecture/{id} with decision/comment. Approval publishes that snapshot and changes the source draft concurrency version. Preserve local edits before reloading.
4. Public GET /api/lectures/by-slug/{slug} returns lecture/revision/chapters with raw source. The frontend separately resolves knowledge references.404 gives a missing placeholder, other failures offer retry, nested references do not expand.

Online pages use /lecture/online/{slug} and /doc/{sectionId}, optional revision_id. Anonymous users only read the current public version; private viewers may select drafts/history. Local pages use /lecture/local/{slug} and browser IndexedDB, never local UUIDs in online API calls. owned provides the actual-owner version shelf; mine is broader.

There is no knowledge-revisions API or fixed knowledge-revision block protocol. Lecture snapshots freeze source, not current public knowledge bodies. Knowledge updates may affect subsequent reads. Whole-tree saves are not patches; edit_version protects lecture drafts only. Archives block ordinary mutation/export/review; restore never auto-publishes, admins may separately permanently delete archives. JSON import creates a new lecture and one draft, not permissions/history/mastery. See [reference semantics](../authoring/knowledge-reference.md), [MM subset](../authoring/typst-guide.md) and [imports](../authoring/import-export.md). Full linked request/response examples are in the [Chinese sequence](/api/frontend-integration).
