# Frontend rendering and editing

Frontend baseline:64cc122. Renderer/TypstDoc.vue uses Typlet syntax parsing and mapped Vue nodes, with math rendered separately. MM extensions are separate from document parsing. The backend returns raw source, not the old doc AST; course presets are removed. This is not full Typst compilation. See [syntax and MM macros](../authoring/typst-guide.md).

Knowledge is maintained directly by administrators. Lecture sections store complete source. mm-knowledge resolves a slug to the current active point, with title and local mastery attached to its first top-level MM box. Missing points and retryable failures are distinct; nested references do not expand. See [references](../authoring/knowledge-reference.md).

TypstEditorPreview combines Monaco, reference insertion and preview. Optional bidirectional scroll synchronization is off by default and uses approximate source anchors. Unsupported fragments retain source and line/column diagnostics.

Online saves use edit_version and chapter/section occurrence_id. Source references have no server instance identity. Review snapshots and working drafts are separate. Review approval increments the working draft version; refresh checks preserve unsaved input and report conflicts. Local lectures, mastery and changelog read state use browser IndexedDB, without account isolation or cross-device sync. This documentation round performed static review only.
