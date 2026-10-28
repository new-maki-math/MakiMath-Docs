# Knowledge source, references and mastery

Administrators maintain each knowledge point's title and source. Write source as **one complete MM box**:

```typst
#mm-box-definition[Let the sequence be $a_n$.]
```

The reader puts the point's title into the first top-level MM box, replacing that box's supplementary title. Referenced knowledge also gets its mastery action in this first box. This is an authoring convention: neither frontend nor backend currently enforces exactly one box. Without a top-level MM box, text may render but the reference's title/mastery action cannot attach as intended.

Insert knowledge into a lecture section with `#mm-knowledge(slug: "sequence-limit")`. Only one static slug string is supported, up to 100 characters using lowercase letters/digits and separating hyphens. No knowledge ID, revision ID, copied body or legacy comment protocol is accepted by this macro.

The backend saves section source unchanged, does not validate reference targets and creates no reference instance IDs, references or warnings. Chapter/section occurrence_id values still need preserving. The frontend resolves each reference through `/api/knowledge-points/by-slug/{slug}` to the current active point. Later knowledge edits can change later reads of an already approved lecture: **lecture review snapshots do not freeze knowledge bodies**. A missing/archived point shows a 404 placeholder; other failures offer retry. Nested references inside knowledge source do not expand.

The section editor offers knowledge search insertion and automatic triggering at supported incomplete macro positions. Comments, strings and raw text do not trigger automatic insertion. If the editor model changes while choosing, select the insertion position again. Knowledge details provide a copy-reference action. Global search can open a point in an overlay, read direct prerequisites and change mastery without modifying a lecture.

Mastery uses the permanent numeric knowledge ID in this browser's IndexedDB. Repeated references and library details share it; BroadcastChannel refreshes same-origin tabs when available. There is no cross-account or cross-device synchronization. Storage failures are shown, not treated as successful writes. Clearing site data affects records. Deleting a point does not clean local mastery; recreating the same slug with a new ID does not inherit the old record.
