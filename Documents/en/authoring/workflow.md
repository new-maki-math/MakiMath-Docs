# Knowledge maintenance and lecture composition

Admins maintain current public knowledge; authors compose lecture source and reference slugs. These are distinct editing workflows. Knowledge IDs key mastery, slugs key source references. There is no knowledge revision review.

Lectures have chapters/sections with complete source: author prose, MM boxes and knowledge macros. Preserve chapter/section occurrence_id on whole-tree saves; source references have no server instance ID. Online draft saves require edit_version.

Submission copies saved content into an independent pending snapshot while the draft stays editable; one pending snapshot per lecture. Approval publishes the snapshot and updates draft concurrency state. Preserve unsaved input before reload. Snapshots freeze source, not current knowledge bodies.

Recommendation is separate from publication. Archives are read-only; owner/admin restore does not republish; admin may permanently delete. Portable exchange contains one version, not review/publication history. See [workbench](./workbench.md), [references](./knowledge-reference.md), [import/export](./import-export.md).
