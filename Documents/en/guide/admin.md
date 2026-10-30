# Administration

Super admins control account admission, public knowledge and lecture review. Editors can maintain lectures they may edit, but cannot create/update public knowledge. Deployment staff create the first admin in the backend terminal; see [deployment](../deploy/self-host.md).

## Invitations and accounts

Create an invitation in platform management with a role, use count and optional expiry. Registration inherits the invitation role and still requires a separate login. Revoking an invitation prevents future use; it does not disable accounts already registered with it.

Disabling an account revokes all its sessions. An admin cannot disable their current account. Changing a personal password also revokes all sessions. Audit logs describe requests, not recoverable content backups.

## Public knowledge

Use the knowledge workbench to create categories and points. Each point has a fixed business slug, title and body. Saves affect public reading directly, without knowledge review or revision rollback. Concurrent edits use the last successful write, without edit_version protection.

Write one complete MM box, such as `#mm-box-definition[Definition]`. The title field is displayed in the first top-level box, and referenced mastery actions attach there too. The single-box rule is an authoring convention, not server validation or automatic cleanup.

Categories may be multiple and prerequisites are maintained separately. Management data may retain archived category associations that the public category list omits. Do not clear those associations merely because that list hides them. Relationship saves replace the whole set; cycles are rejected by database constraints.

Archiving removes public availability and leaves missing placeholders in lecture references. Restoring active makes it readable again. Permanent point deletion clears category and incoming/outgoing prerequisite links, without rewriting lecture source or browser records. Category deletion removes its subtree and points linked only inside it; points also linked outside survive. Avoid reusing referenced slugs.

Knowledge JSON import targets an active root category, attaches file-root categories underneath it and assigns otherwise uncategorized points there. It only creates; slug collisions do not overwrite. See [format and limits](../api/knowledge.md).

## Lecture review and management

The platform pending list links to the submitted snapshot. Read its directory, source, cover and references before approving/rejecting. Approval publishes that snapshot and updates the source draft concurrency counter, edit_version. Rejection leaves current public content alone. Admin self-review is currently allowed.

Snapshots freeze lecture source, not dynamically resolved public knowledge. Archived lectures reject review until restored. Recommendation is separate: initial approval does not recommend automatically, and approving a new version preserves an existing recommendation.

The workbench's all-online group gives admins summaries of owner, state and latest version. It does not preload every body; reading/editing fetches outline and sections separately. Admins may archive, restore and permanently delete archived lectures. See [lecture maintenance](../authoring/workbench.md#archive-and-restore) for scope.
