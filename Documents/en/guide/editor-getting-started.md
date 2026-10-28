# Editor setup

Guests can create/import/edit browser-local lectures without login; they do not sync across accounts or devices. Online authors obtain an invitation, register, then separately log in. Create a lecture working draft and fill chapter/section metadata and complete source. Admins maintain public knowledge; editors reference it with `#mm-knowledge(slug: "sequence-limit")`, resolving current active content rather than a fixed knowledge revision.

Save before submitting. Submission creates a separate review snapshot, leaving the working draft editable. Only one pending snapshot is allowed. Approval publishes; recommendation is separate. On return after review, preserve unsaved input and handle draft concurrency updates. Archive applies to the whole lecture, restoration does not republish, and admins may permanently delete archives. See [workbench](../authoring/workbench.md) and the [supported Typst subset](../authoring/typst-guide.md).
