# Authoring workbench

/lecture-workbench (legacy /workbench redirects) groups local lectures, online lectures and archives. Private trees show the working draft and read-only review snapshots. Guests may create/import/edit browser-local lectures; online editing requires login and owner/admin/edit-collaborator permission. /knowledge-workbench is administrator-only and directly edits current knowledge, with no knowledge review submission.

Chapter/section metadata and source can be edited, added, removed and reordered. Preview supports only the documented Typst/MM subset. Optional synchronized scrolling is off by default. Unsaved navigation prompts for save/discard; online409 conflicts require preserving input and reloading.

Save first, then submit after UI confirmation and a5-second wait. Submission creates a separate pending snapshot, leaving the working draft editable. Only one pending snapshot per lecture is allowed. Approval publishes the snapshot and changes the working draft concurrency version; visible-page refresh preserves unsaved edits and warns on conflict.

Online routes are /lecture/online/{slug} and /doc/{sectionId}, with optional revision_id query. Local routes use /lecture/local/{slug} and browser storage. Downloading requires a unique local slug; editing a download does not overwrite online content.

## Archive, restore and delete

Owners/admins archive through three steps: intent, lecture-name check, impact/final confirmation. Handle unsaved changes first. Archiving retains all versions/content, removes recommendation and moves the lecture to archives. Authorized reading remains available; editing, submission, review, version copying, export, collaborator changes and normal publication updates are blocked.

Owner/admin restoration returns withdrawn if a public pointer exists, otherwise unpublished, with recommendation false. Restoration never automatically republishes.

Administrators may permanently delete an archived lecture through a separate three-step confirmation of intent, name/scope and irreversibility. This removes its identity, draft, all snapshots, directory, reviews and collaborators, not public knowledge or browser data. The backend independently checks admin permission and archived state; three UI steps do not mean three API calls. Local deletion only removes the browser copy. Check lists before retrying uncertain remote results.

Portable JSON exchanges one version; chapter batch import appends.typ sections and requires saving afterward. See [import/export](./import-export.md).
