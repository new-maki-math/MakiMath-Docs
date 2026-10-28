# Lecture JSON and section imports

The portable format exchanges **one complete lecture version**, not all history or a database backup. Online and local use the same format. This round checked source statically without running imports or exports.

```json
{
  "type": "maki-lecture", "schema_version": 1,
  "lecture": { "slug": "limits-intro", "title": "Limits", "subtitle": "", "summary": "Introduction", "typst_version": "0.15.1", "metadata": {} },
  "chapters": [{ "slug": "chapter-1", "tag": "1", "title": "Limits", "summary": "", "sections": [{ "slug": "section-1", "tag": "1.1", "title": "Sequence limits", "summary": "", "source": "#mm-knowledge(slug: \"sequence-limit\")" }] }]
}
```

Every field shown is required; unknown fields are rejected. File summary maps to revision.descr in the save API. Files preserve metadata and raw section source, but omit database IDs, occurrence IDs, ownership/collaborators, sessions, history, review/publication/recommendation state and personal annotations/mastery. References remain macro strings, not embedded knowledge bodies; offline files do not guarantee offline reference expansion.

Lecture slug is lowercase letters/digits with separating hyphens, at most100 characters; title200, subtitle500, summary5000, nonempty typst_version50. Chapter/section slugs are nonempty up to100; chapter slugs are unique per file and section slugs per chapter. Directory text fields allow5000 characters, source200000. Limits are100 chapters,200 sections per chapter and2000 total sections. **Online encrypted request bodies are still limited to4MiB**; count limits do not guarantee any combination of source sizes will fit.

The local/online workbench groups import JSON as a new lecture. A changed slug can resolve conflicts; no existing record is overwritten. Online POST `/api/lectures/import` takes the portable document directly, encrypted, assigns the current owner and returns201 `{lecture, revision}` with an unpublished draft. Local import uses browser storage and creates new local and occurrence UUIDs.

GET `/api/lecture-revisions/{id}/export` exports one selected version: public users only the current published approved version, authorized users their readable versions. Archived lectures cannot export. Local exports use persisted records, rejecting incompatible legacy blocks/animations. The UI requires saving before export. Uncertain import results require checking the list before retry; there is no idempotency key.

Metadata may retain a cover. The frontend rejects selected identity/credential key names on export, but neither this nor the backend object-type check sanitizes arbitrary source or metadata. Do not store credentials there.

## Batch section imports

An editable chapter accepts one or more `.typ` files, strictly decoded as UTF-8. Each file appends one section in selection order. Filename supplies an initial title and slug; fill missing values and resolve duplicates within the current chapter/import batch. Confirmation only updates the in-memory tree: save the lecture afterward. This is not JSON import or automatic heading-based splitting, and the batch input does not accept PDF/Markdown/arbitrary extensions. Changing the chapter cancels pending file selection.

There is no separate source-file replacement input in the current section editor. Replace an existing section by editing its source and saving. Archived lectures and review snapshots are read-only.

The database lecture-category ID is not portable. Choose the lecture category again after import; imported local/online sections get new occurrence identities.
