# System architecture

Current baselines are in [integration](../api/frontend-integration.md). Public knowledge has stable IDs, current admin-maintained source, classifications and prerequisites. It no longer has knowledge revision review. Lectures organize complete source by chapter/section; mm-knowledge resolves slugs dynamically. Point IDs, lecture IDs, version IDs and chapter/section occurrence IDs serve different purposes.

Submission copies a saved working draft to an independent pending snapshot, leaving the draft editable. Approval publishes the complete snapshot; recommendation is separate. Snapshots freeze author source, not the referenced current public knowledge. The old fixed knowledge-revision reference rule no longer describes this implementation.

The backend passes source through; the frontend maps supported Typst syntax to web components, not full compilation. Nested knowledge references do not expand. Public reading and private/management authorization remain separate. Local lectures/mastery/changelog read state live in browser IndexedDB without account or cross-device synchronization. Knowledge prerequisites are independent of lecture directories.
