# API conventions

Backend baseline and static verification scope appear in [integration](./frontend-integration.md). Tables use complete /api paths; do not prefix twice. Path IDs are positive safe integers. Request objects reject unknown fields. JSON examples represent pre-encryption requests or decrypted responses, not raw HTTP payloads.

Use Bearer access tokens; refresh tokens go in request bodies. GET /api/auth/pubkey returns plain ok/pubkey. Other populated successful API JSON responses use the existing AES-256-GCM envelope `{d}` with12-byte IV,16-byte tag and ciphertext, Base64 encoded. P-256 ECDH uses the client raw65-byte public key in x-cp. POST/PUT/PATCH bodies must be encrypted; GET also needs the appropriate decryption context.204 has no body; errors are plain JSON. HTTPS remains necessary.

The full encrypted HTTP body is limited to4MiB; lists are not paginated and rate limit is300/minute. Knowledge imports have an additional2MiB data limit. Counts do not imply unlimited file size. Error bodies contain error and optionally details:400 parameters,401 authentication,403 authorization,404 missing/unreadable,409 concurrency/business constraints,413 size,429 rate,500 server.

Knowledge points are admin-maintained current source with no revision/edit_version workflow. Lecture drafts require edit_version; submission creates an independent review snapshot. Source is passed through unchanged, without server Typst parsing or reference validation. No blocks/animation API exists. See [knowledge](./knowledge.md), [lectures](./lectures.md), [review](./review.md) and the [Typst subset](../authoring/typst-guide.md).
