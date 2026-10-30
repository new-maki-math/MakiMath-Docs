# Create and maintain a lecture

Open `/lecture-workbench`. Guests can author local lectures; online authoring requires invitation registration followed by a separate login.

## Create the lecture and directory

Create a lecture in the local or your online group. Enter a title and slug using lowercase letters, digits and separating hyphens, such as `limits-intro`. Local slugs are unique in this browser; online slugs are unique on the server. The online interface cannot rename a lecture slug. Renaming a local slug changes its local URL.

Add chapters and sections, fill their titles/slugs and write [Typst/MM source](./typst-guide.md). Preview and diagnostics appear beside the editor. Scroll synchronization is optional and off by default. A rendered preview is not a saved revision: use Save or Ctrl/Cmd+S after editing.

Leaving unsaved work prompts for a decision. On an online version conflict, preserve your input before reloading. Reload is not a merge operation.

## Covers

Lecture properties accept JPG, PNG and WebP. Local covers allow up to 5 MiB and require saving the lecture afterward. Online covers allow up to 512 KiB; changing/removing one saves immediately through a separate request and changes the draft version. Save or discard other online edits before changing a cover.

Covers belong to versions. Submission copies the draft cover into its review snapshot; a later draft-cover change does not replace the current public snapshot. Lists load covers on demand and offer retry on failure.

## Save, submit and publish

Save updates the working draft. Submission copies persisted content into a separate review snapshot and leaves the draft editable. Each lecture permits one pending snapshot at a time. The UI asks for confirmation and has a short wait before submission.

Approval publishes the reviewed snapshot, not later edits to the draft. It also changes the source draft's concurrency version; check update/conflict messages when returning to the editor. Rejection leaves any current public version unchanged.

A snapshot freezes the directory, author source and reference macro strings. It does not include copied public knowledge bodies, which may change on later reads. Recommendation is a separate admin action.

## Archive and restore

An owner or admin may archive an online lecture through three steps: intent, lecture-name check and impact confirmation. Handle unsaved work first. Archiving retains versions/content but removes public availability and recommendation.

Authorized private reading remains available. Editing, submission, review, export, version copying and collaborator changes are blocked. Owner/admin restoration returns withdrawn when a public revision exists, otherwise unpublished; it never republishes automatically.

Admins can separately permanently delete an archived lecture through another three-step confirmation. It removes the identity, drafts, snapshots, directory, covers, reviews and collaborators. Restore cannot recover it. Public knowledge and browser copies are unaffected. Editors cannot perform this deletion. Deleting a local lecture only affects its browser copy.

See [import/export](./import-export.md) for files and [administration](../guide/admin.md) for platform operations.
