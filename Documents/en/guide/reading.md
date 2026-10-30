# Reading and your shelf

Choose a public lecture in the workshop, or browse the knowledge library by category. Public reading needs no login. Global search returns both kinds of content: knowledge opens in a detail overlay, while a lecture result opens the lecture.

## Lectures and knowledge

A lecture loads its outline first, then fetches the section you open. Online links use lecture, chapter and section slugs, for example `/lecture/online/limits/doc/chapter-1/section-1`. A revision_id query selects a version; changing it does not grant access to someone else's draft. Without private access you can read only the current public version.

Knowledge details include the body and direct prerequisites. Successors shown on the map belong to the current map scope, not necessarily the whole site. Archived or deleted knowledge leaves a missing-reference message in a lecture; other request failures offer retry.

References load current knowledge. An administrator's edit can change what a later read displays, even when the lecture has not published a new snapshot.

## Shelf and local copies

Your shelf separates browser-local lectures from versions of online lectures you own. A working draft, a review snapshot and a downloaded local copy are separate data. Editing a download does not upload it or overwrite its online source.

A local route such as `/lecture/local/{slug}` requires the lecture to exist in that browser. Sharing its URL does not transfer the data. Use [JSON export](../authoring/import-export.md) to move a copy.

## Mastery and release notes

Mark knowledge as mastered from its details or from a referenced knowledge box. Current records use the knowledge **slug** in this browser's IndexedDB, shared by repeated occurrences of that slug. They do not sync across accounts or devices. Clearing site data affects them; legacy numeric-ID records are not automatically converted.

Storage failures are shown rather than counted as saved. Reusing a deleted point's slug may reuse an old mastery mark, so administrators should avoid slug reuse.

Opening the header update log does not mark it read. Choose “Mark read” to store that version's read state locally. This state also stays in the current browser.
