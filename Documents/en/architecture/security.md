# Communication and authorization boundaries

The existing ECDH/AES-GCM envelope does not replace HTTPS or authorization and cannot prevent an authorized client reading content. Bearer authentication checks current account/session state; refresh rotates tokens. Logout deletes a session matching the supplied refresh token, even though unmatched tokens also return204. Password changes and account disablement revoke all user sessions.

Admins maintain knowledge; lecture owner/view/edit/admin permissions are enforced server-side. Read-only snapshots cannot be edited, but admins may permanently delete archived lectures through the restricted deletion endpoint. UI three-step confirmation is additional protection, not server authorization.

The backend neither executes Typst nor validates every reference target. Frontend rendering is limited to supported mappings, not arbitrary scripting. There are no legacy animation API fields. Portable JSON omits identity/session top-level fields but does not sanitize arbitrary source/metadata. Custom server private keys must match the published public key. Self-review remains allowed pending a separate product decision.
