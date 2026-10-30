# Account and session API

Follow [transport conventions](./overview.md). Body fields are required unless marked optional.

| Path | Method | Operation | Permission | Parameters | Success |
| --- | --- | --- | --- | --- | --- |
| `/api/auth/pubkey` | GET | Public key | Public | None | 200 plain ok/pubkey |
| `/api/auth/register` | POST | Register | Invitation | username/password/invite_code; optional display_name | 201 user wrapper |
| `/api/auth/login` | POST | Login | Public | username/password | 200 user/access_token/refresh_token |
| `/api/auth/refresh` | POST | Rotate tokens | Refresh token | refresh_token | 200 same structure |
| `/api/auth/me` | GET | Current user | Login | None | 200 user wrapper |
| `/api/auth/profile` | PATCH | Display name | Login | display_name | 200 user wrapper |
| `/api/auth/logout` | POST | Revoke matching session | Login | refresh_token | 204 |
| `/api/auth/password` | PATCH | Change password/revoke all | Login | old_password/new_password | 204 |

Registration creates no session: log in separately. User is id/username/display_name/role; profile also returns status. Role is editor or super_admin and cannot be chosen in the registration body.

All fields are strings. Username is nonempty, max 80; invite_code nonempty, max 100; display_name allows empty, max 100. Registration/new passwords require 8–200 characters and at most 72 UTF-8 bytes. Login/old password only check nonempty/max 200. Refresh tokens are nonempty/max 200.

## Session handling

Serialize refresh requests and replace both tokens. Default access/session lifetimes are configurable 2h/7d. Refresh rotates the refresh token but keeps its session ID, so older unexpired access tokens may still work.

Logout deletes a session matching current user and supplied refresh-token hash. Stale/unmatched tokens also return 204, which does not prove the Bearer session was revoked. Send the latest refresh token and clear local state on success. Password change revokes all sessions; account disablement does too.

## Example

POST /api/auth/login before encryption:

```json
{ "username": "editor-demo", "password": "example-pass-2026" }
```

Decrypted shape, with placeholder tokens:

```json
{
  "user": { "id": 7, "username": "editor-demo", "display_name": "", "role": "editor" },
  "access_token": "<access_token>", "refresh_token": "<refresh_token>"
}
```

Invalid invitation/parameters give 400; duplicate username 409. Login, refresh-session or old-password failure gives 401. An incorrect old password needs corrected input, not automatic refresh and retry.
