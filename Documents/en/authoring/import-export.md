# Import and export

Whole lectures use JSON; batch sections use `.typ`. JSON creates a new lecture, while `.typ` appends sections to the selected chapter.

## One lecture version as JSON

Select the lecture/version in the workbench, save edits, then Export JSON. The file contains that version's metadata, directory, source and cover. It omits ownership, collaborators, review/history/publication state and mastery. References remain slug macros without copied knowledge bodies, so offline expansion is not guaranteed.

Import from the local or online group, check the slug and confirm. Imports create a new lecture rather than overwrite. Resolve slug conflicts by renaming. Online imports become unpublished working drafts; choose the lecture category again. Chapter/section occurrence IDs are regenerated. Check the list before retrying an uncertain result.

All fields below are required, including empty strings. The following is a minimal example.

```json
{
  "type": "maki-lecture", "schema_version": 1,
  "lecture": { "slug": "limits", "title": "Limits", "subtitle": "", "summary": "An introduction", "typst_version": "0.15.1", "metadata": {} },
  "chapters": [{
    "slug": "chapter-1", "tag": "1", "title": "Limits", "summary": "",
    "sections": [{ "slug": "section-1", "tag": "1.1", "title": "Sequence limits", "summary": "", "source": "#mm-knowledge(slug: \"sequence-limit\")" }]
  }]
}
```

File summary maps to the API's draft descr. Metadata may include a cover Data URL, extracted and validated on online import with a 512 KiB limit. A local 5 MiB cover may need shrinking before online import. Neither source nor arbitrary metadata is fully sanitized for credentials; do not place secrets in files.

| Limit | Value |
| --- | --- |
| Lecture slug/title/subtitle/summary | 100/200/500/5000 characters |
| Chapter/section slugs | Nonempty, 100; chapter uniqueness per lecture, section uniqueness per chapter |
| Directory tag/title/summary | 5000 characters each |
| Section source | 200000 characters |
| Directory size | 100 chapters, 200 sections per chapter, 2000 total sections |
| Online request | Entire encrypted body at most 4 MiB, including covers |

Count limits do not guarantee all maximum-length sources fit together. Unknown fields, legacy blocks/animation and unsupported schema versions are rejected.

## Add sections from files

Select one or more `.typ` files in an editable chapter. Strict UTF-8 decoding is used; each file becomes one new section. Filename supplies an initial title and slug. Non-Latin filenames may produce an empty slug: fill it before confirming and resolve duplicates in the chapter/batch.

Confirmation only appends to current editing state; save the lecture afterward. This input does not accept PDF/Markdown/arbitrary extensions or split files by headings. Changing chapters cancels pending selection. Replace existing section content by editing source; there is no separate source-file replacement input.
