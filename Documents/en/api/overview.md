# API conventions

::: info Code baseline
Backend main 62ad91f, frontend main e3a2aa1, v1.1.0-beta. Examples were checked statically, without live requests.
:::

Tables contain complete /api paths; do not add the prefix twice. Braced path values are placeholders. Resource IDs are positive safe integers. Slugs allow lowercase letters/digits and separating hyphens, up to 100 characters. Object bodies reject unknown fields with 400.

See [authentication](./auth.md), [lectures](./lectures.md), [knowledge](./knowledge.md) and [review/management](./review.md). Legacy courses/chapters/sections endpoints and knowledge-revisions are removed.

## Authentication and transport

Send Authorization: Bearer with the access_token, not a refresh token or cookie. The server checks current account/session state as well as JWT validity.

GET /api/auth/pubkey returns plain `{ok:true,pubkey}`. Browser P-256 ECDH sends a Base64 raw 65-byte public key in x-cp. The shared 256-bit value is used directly for AES-256-GCM. Envelopes are `{d: Base64(12-byte IV + 16-byte tag + ciphertext)}`.

Nonempty POST/PUT/PATCH JSON bodies must be encrypted. GET also needs the right x-cp because populated 2xx API responses are encrypted. Do not parse/decrypt an empty 204; errors are plain JSON. The public-key exemption uses the exact URL, without query parameters; /health is outside encryption. Existing frontend src/api/client.js handles this layer.

The server's missing-x-cp compatibility key is for scripts, not browser distribution. HTTPS is still needed. Documentation examples show data before encryption or after decryption, not valid plain HTTP POST payloads.

## Errors and limits

Errors contain error and optionally details; rely on HTTP state rather than localized wording.

| Status | Typical cause |
| --- | --- |
| 400 | Missing/unknown fields, invalid types/envelope or database checks |
| 401 / 403 | Missing/invalid session / insufficient permission |
| 404 | Missing resource or unavailable through that reading entry |
| 409 | Draft version, archive restriction, duplicate submission/review, uniqueness or relation conflict |
| 413 / 429 / 500 | Oversize / rate limit / unmapped server error |

Lecture edit_version changes on whole-tree saves, section saves, cover changes and approval updates to the source draft. Body reads use the version from the outline. Preserve local input before reloading on 409. Knowledge has no concurrency field and uses the last successful write.

The entire encrypted request body is limited to 4 MiB. Knowledge-import data also has a 2 MiB limit. Source length is at most 200000 JavaScript string units, not bytes; covers and Base64 consume request space. Lists are not paginated; rate limit is 300 requests/minute.

## Data separation

Outlines omit source; section bodies and covers load separately. Lecture IDs, revision IDs, edit_version and chapter/section occurrence UUIDs are different identifiers. Whole-tree saves replace the directory; use the section endpoint to update one existing section.

The backend passes source through without AST construction or macro validation. A review snapshot freezes author source, while knowledge references resolve current active points by slug. Neither model exposes the legacy animation/scene-execution fields.
