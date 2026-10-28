# Update log

The header action loads version from the frontend static updates/index.json, then loads updates/changelog.typ when opened. It uses the same renderer with knowledge expansion disabled. The current resource version is v1.0-beta. Release notes are not API contracts or test evidence.

Unread state compares that version string with IndexedDB in this browser. Opening the dialog does not mark it read: the user must choose Mark read and the local write must succeed. Storage errors are shown; content loading can retry. Read state has no account or cross-device synchronization.

Update both version and content for a new release. Changing content without changing the version does not make it unread again. Fetches use frontend BASE_URL with no-store. Deploying the documentation site is separate from publishing frontend changelog assets.
